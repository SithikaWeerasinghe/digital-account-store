import { Order } from '@/types/order';
import { InventoryItem } from '@/types/inventory';
import * as orderService from '@/lib/services/orderService';
import * as inventoryService from '@/lib/services/inventoryService';
import * as productService from '@/lib/services/productService';
import { sendDeliveryEmail, sendAdminDeliveryNotification } from '@/lib/services/emailService';

export type DeliveryResult = {
  success: boolean;
  message: string;
  emailSent?: boolean;
  inventoryItem?: InventoryItem | null;
};

/**
 * Marks an order's delivery as failed and notifies the admin once. The admin
 * email is only sent when the order was not already in 'failed' state, so a
 * retried webhook for the same un-deliverable order doesn't spam the inbox.
 */
async function markDeliveryFailed(
  order: Order,
  info: { deliveredCount: number; requestedCount: number; reason: string }
): Promise<void> {
  const wasAlreadyFailed = order.delivery_status === 'failed';

  await orderService.updateOrderPaymentFields(order.id, { delivery_status: 'failed' });

  if (!wasAlreadyFailed) {
    await sendAdminDeliveryNotification(order, {
      ok: false,
      deliveredCount: info.deliveredCount,
      requestedCount: info.requestedCount,
      reason: info.reason,
    }).catch((e) =>
      console.error('[deliveryService] Admin delivery-failure notice failed:', e?.message || e)
    );
  }
}

/**
 * Deliver order: find inventory, assign to order, send email, mark delivered
 * @param orderId - The order ID to deliver
 * @param skipPaymentCheck - If true, allow delivery without payment confirmation (admin manual)
 */
export async function deliverOrder(orderId: string, skipPaymentCheck = false): Promise<DeliveryResult> {
  try {
    // 1. Fetch the order
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return { success: false, message: `Order not found: ${orderId}` };
    }

    // 2. Check if already delivered
    if (order.delivery_status === 'delivered') {
      return { success: true, message: 'Order already delivered', emailSent: false, inventoryItem: null };
    }

    // 3. Check payment status (unless admin is forcing delivery)
    if (!skipPaymentCheck && order.payment_status !== 'paid') {
      return {
        success: false,
        message: `Cannot deliver: payment status is ${order.payment_status}, not paid`,
      };
    }

    // 4. Find and assign inventory item
    const productId = order.product_id || '';
    const customerEmail = order.customer_email || order.userId || '';

    if (!productId) {
      return { success: false, message: 'Order has no product ID' };
    }
    if (!customerEmail) {
      return { success: false, message: 'Order has no customer email' };
    }

    // Read the exact selected option/guarantee from the order metadata so we
    // deliver inventory matching the variant the customer actually purchased.
    const selectedOption = order.order_metadata?.product_option;
    const selectedGuarantee = order.order_metadata?.guarantee;
    const optionId = selectedOption?.id || null;
    const optionLabel = selectedOption?.label || null;
    const guaranteeId = selectedGuarantee?.id || null;
    const guaranteeLabel = selectedGuarantee?.label || null;

    // Deliver exactly the purchased quantity — one inventory item per unit.
    const requestedQty = Math.max(1, Number(order.quantity) || 1);

    // Diagnostic: the exact combination this delivery will look up, so a failed
    // assignment can be traced to an option/guarantee mismatch in inventory.
    console.log(
      `[delivery] order=${order.id} product=${productId} option="${optionLabel ?? '—'}"(${optionId ?? 'null'}) ` +
        `guarantee="${guaranteeLabel ?? '—'}"(${guaranteeId ?? 'null'}) qty=${requestedQty}`
    );

    // Pre-check available stock for the EXACT product + plan + warranty
    // combination so we never assign a partial batch, and never borrow stock
    // from a different option or warranty. If there isn't enough for the full
    // order, fail cleanly and let the admin handle it.
    const comboLabel = [optionLabel, guaranteeLabel].filter(Boolean).join(' · ');
    const available = await inventoryService.getAvailableInventoryCount(productId, optionId, guaranteeId);
    if (available < requestedQty) {
      await markDeliveryFailed(order, {
        deliveredCount: 0,
        requestedCount: requestedQty,
        reason: comboLabel
          ? `Only ${available} of ${requestedQty} available for "${comboLabel}"`
          : `Only ${available} of ${requestedQty} available in inventory`,
      });
      return {
        success: false,
        message: comboLabel
          ? `Not enough inventory for selected "${comboLabel}" (have ${available}, need ${requestedQty})`
          : `Not enough inventory for this product (have ${available}, need ${requestedQty})`,
        inventoryItem: null,
      };
    }

    // Assign one available item per unit. Each assignment is atomic (only
    // flips an item that is still 'available'), so concurrent deliveries can't
    // double-sell the same item.
    const assignedItems: InventoryItem[] = [];
    for (let i = 0; i < requestedQty; i++) {
      const item = await inventoryService.assignInventoryItemToOrder(
        productId,
        orderId,
        customerEmail,
        optionId,
        optionLabel,
        guaranteeId,
        guaranteeLabel
      );
      if (!item) break; // stock raced out from under us
      assignedItems.push(item);
    }

    if (assignedItems.length < requestedQty) {
      // Short delivery (e.g. a concurrent order took the last item). The items
      // we did assign stay attached to this order for the admin to complete.
      // Do NOT send partial credentials as a success.
      await markDeliveryFailed(order, {
        deliveredCount: assignedItems.length,
        requestedCount: requestedQty,
        reason: `Assigned ${assignedItems.length} of ${requestedQty} (stock changed during delivery)`,
      });
      return {
        success: false,
        message: `Delivery incomplete: assigned ${assignedItems.length} of ${requestedQty}. Admin notified.`,
        inventoryItem: assignedItems[0] ?? null,
      };
    }

    // 5. Send delivery email (fetch the real product for its name + usage
    //    instructions; falls back gracefully if the lookup fails).
    let productName: string | undefined;
    let usageInstructions: string | null | undefined;
    try {
      const product = await productService.getProductById(productId);
      productName = product?.name;
      // Prefer the inventory item's own instructions, then the product's.
      usageInstructions = assignedItems[0].usage_instructions ?? product?.usage_instructions ?? null;
    } catch {
      // non-fatal — still try the item's own instructions
      usageInstructions = assignedItems[0].usage_instructions ?? null;
    }

    // Combine every assigned account's credentials into one delivery email.
    const deliveryContent = assignedItems
      .map((item, idx) =>
        requestedQty > 1
          ? `Account ${idx + 1} of ${requestedQty}\n${item.delivery_content}`
          : item.delivery_content
      )
      .join('\n\n──────────\n\n');

    const emailResult = await sendDeliveryEmail({
      order,
      inventoryItem: assignedItems[0],
      productName,
      usageInstructions,
      deliveryContent,
    });

    const emailSent = emailResult.success || emailResult.skipped;
    if (!emailSent) {
      console.warn('[deliveryService] Email delivery warning (order still marked delivered):', emailResult.error);
    }

    // 6. Mark order as delivered
    await orderService.updateOrderPaymentFields(orderId, {
      delivery_status: 'delivered',
    });

    // Best-effort admin success notification (never blocks delivery).
    await sendAdminDeliveryNotification(order, {
      ok: true,
      deliveredCount: assignedItems.length,
      requestedCount: requestedQty,
    }).catch(() => {});

    return {
      success: true,
      message: 'Order delivered successfully',
      emailSent,
      inventoryItem: assignedItems[0],
    };
  } catch (error: any) {
    console.error('[deliveryService] Delivery failed:', error);
    return {
      success: false,
      message: error.message || 'Delivery failed: unknown error',
    };
  }
}

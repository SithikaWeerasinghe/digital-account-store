import { Order } from '@/types/order';
import { InventoryItem } from '@/types/inventory';
import * as orderService from '@/lib/services/orderService';
import * as inventoryService from '@/lib/services/inventoryService';
import { sendDeliveryEmail } from '@/lib/services/emailService';
import { sampleProducts } from '@/data/sampleProducts';

export type DeliveryResult = {
  success: boolean;
  message: string;
  emailSent?: boolean;
  inventoryItem?: InventoryItem | null;
};

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

    const inventoryItem = await inventoryService.assignInventoryItemToOrder(
      productId,
      orderId,
      customerEmail,
      optionId,
      optionLabel,
      guaranteeId,
      guaranteeLabel
    );

    if (!inventoryItem) {
      // No matching inventory — update order delivery_status to failed.
      // For variant orders, never substitute a different option's credentials.
      await orderService.updateOrderPaymentFields(orderId, {
        delivery_status: 'failed',
      });
      const message = optionLabel
        ? `No available inventory for selected option: ${optionLabel}`
        : 'No available inventory item for this product';
      return {
        success: false,
        message,
        inventoryItem: null,
      };
    }

    // 5. Send delivery email
    const product = sampleProducts.find((p) => p.id === productId);
    const emailResult = await sendDeliveryEmail({
      order,
      inventoryItem,
      productName: product?.name,
    });

    const emailSent = emailResult.success || emailResult.skipped;
    if (!emailSent) {
      console.warn('[deliveryService] Email delivery warning (order still marked delivered):', emailResult.error);
    }

    // 6. Mark order as delivered
    await orderService.updateOrderPaymentFields(orderId, {
      delivery_status: 'delivered',
    });

    return {
      success: true,
      message: 'Order delivered successfully',
      emailSent,
      inventoryItem,
    };
  } catch (error: any) {
    console.error('[deliveryService] Delivery failed:', error);
    return {
      success: false,
      message: error.message || 'Delivery failed: unknown error',
    };
  }
}

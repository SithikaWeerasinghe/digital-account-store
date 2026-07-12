// ApexFled temporary admin visibility change.
// Set a flag to `true` to restore that tab and page.
//
// Only the Dashboard tab is currently visible. Every other tab is hidden: the
// sidebar omits it and direct-URL access redirects to the dashboard. This is a
// UI/access change ONLY — no page files, routes, components, APIs, services, or
// product/order/inventory/database logic are affected. Fully reversible: flip a
// flag back to `true` and its sidebar tab and direct-URL access both return.
import { ROUTES } from '@/lib/constants';

// ── Admin tab visibility flags (temporarily hidden — Dashboard only) ──
export const SHOW_DASHBOARD_TAB = true;
export const SHOW_CATEGORIES_TAB = false;
export const SHOW_PRODUCTS_TAB = false;
export const SHOW_ORDERS_TAB = false;
export const SHOW_INVENTORY_TAB = false;
export const SHOW_PAYMENT_METHODS_TAB = false;
export const SHOW_COUPONS_TAB = false; // "Coupons" tab → /admin/discounts
export const SHOW_PROMOS_TAB = false;
export const SHOW_TICKETS_TAB = false;
export const SHOW_REVIEWS_TAB = false;

/** Each admin route + whether it is currently visible/reachable. */
export const ADMIN_TAB_ACCESS: { prefix: string; visible: boolean }[] = [
  { prefix: ROUTES.ADMIN.DASHBOARD, visible: SHOW_DASHBOARD_TAB },
  { prefix: ROUTES.ADMIN.CATEGORIES, visible: SHOW_CATEGORIES_TAB },
  { prefix: ROUTES.ADMIN.PRODUCTS, visible: SHOW_PRODUCTS_TAB },
  { prefix: ROUTES.ADMIN.ORDERS, visible: SHOW_ORDERS_TAB },
  { prefix: ROUTES.ADMIN.INVENTORY, visible: SHOW_INVENTORY_TAB },
  { prefix: ROUTES.ADMIN.PAYMENT_METHODS, visible: SHOW_PAYMENT_METHODS_TAB },
  { prefix: ROUTES.ADMIN.DISCOUNTS, visible: SHOW_COUPONS_TAB },
  { prefix: ROUTES.ADMIN.PROMOS, visible: SHOW_PROMOS_TAB },
  { prefix: ROUTES.ADMIN.TICKETS, visible: SHOW_TICKETS_TAB },
  { prefix: ROUTES.ADMIN.REVIEWS, visible: SHOW_REVIEWS_TAB },
];

/**
 * True when a pathname belongs to a HIDDEN admin tab — used by the admin layout
 * to redirect direct-URL access to the dashboard. Matches the exact route and
 * any sub-path (e.g. /admin/products and /admin/products/anything).
 */
export function isHiddenAdminPath(pathname: string): boolean {
  if (!pathname) return false;
  return ADMIN_TAB_ACCESS.some(
    (t) => !t.visible && (pathname === t.prefix || pathname.startsWith(`${t.prefix}/`))
  );
}

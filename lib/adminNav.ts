// ApexFled temporary admin tab visibility change — restore by setting the flag
// to true. This ONLY hides sidebar tabs and blocks direct-URL access to those
// pages (redirects to the dashboard). No page files, APIs, or product/order/
// inventory logic are deleted — flip a flag back to `true` to fully restore.
import { ROUTES } from '@/lib/constants';

// ── Admin tab visibility flags ──
// Set any of these back to `true` to bring the tab + its page back.
export const SHOW_DASHBOARD_TAB = true; // keep visible (required)
export const SHOW_CATEGORIES_TAB = true; // keep visible (required)
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

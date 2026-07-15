// Admin tab visibility flags.
//
// ALL TABS ARE VISIBLE (fully restored). Each flag controls three things at once
// for its section: the sidebar tab, direct-URL access, and any matching dashboard
// card/shortcut. Setting a flag to `false` hides that section (sidebar omits the
// tab and direct-URL access redirects to the dashboard); setting it back to
// `true` restores all three. This is a UI/access mechanism ONLY — no page files,
// routes, components, APIs, services, or product/order/inventory/database logic
// are affected either way.
import { ROUTES } from '@/lib/constants';

// ── Admin tab visibility flags (all restored to visible) ──
export const SHOW_DASHBOARD_TAB = true;
export const SHOW_CATEGORIES_TAB = true;
export const SHOW_PRODUCTS_TAB = true;
export const SHOW_ORDERS_TAB = true;
export const SHOW_INVENTORY_TAB = true;
export const SHOW_PAYMENT_METHODS_TAB = true;
export const SHOW_COUPONS_TAB = true; // "Coupons" tab → /admin/discounts
export const SHOW_PROMOS_TAB = true;
export const SHOW_TICKETS_TAB = true;
export const SHOW_REVIEWS_TAB = true;

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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ApexFled change request: currency adjustment (EUR → GBP).
// SINGLE SOURCE OF TRUTH for the displayed currency. Change these three constants
// to switch the whole storefront's displayed currency. Payment-provider
// (processing) currencies are configured separately via Vercel env vars — see
// the rollback notes. To revert: set CODE='EUR', SYMBOL='€', LOCALE='en-US'.
export const CURRENCY_CODE = 'GBP';
export const CURRENCY_SYMBOL = '£';
export const CURRENCY_LOCALE = 'en-GB';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

/**
 * How a bulk inventory paste is split into individual accounts:
 *  - 'lines'  → one account per non-empty line (e.g. "email:password" rows)
 *  - 'blocks' → one account per block, blocks separated by a blank line
 *               (for multi-line credentials: email / password / notes)
 */
export type BulkSplitMode = 'lines' | 'blocks';

/**
 * Parses a bulk paste of multiple accounts into separate, trimmed credential
 * strings — one per deliverable stock unit. Empty lines/blocks are dropped, so
 * the result length is exactly the number of accounts that will be created.
 */
export function parseBulkAccounts(raw: string, mode: BulkSplitMode): string[] {
  if (!raw || !raw.trim()) return [];
  const parts =
    mode === 'lines'
      ? raw.split(/\r?\n/)
      : raw.split(/\r?\n\s*\r?\n/); // one or more blank lines separate blocks
  return parts.map((p) => p.trim()).filter(Boolean);
}

/**
 * Converts a product name into a URL-friendly slug.
 * e.g. "Netflix Premium [4K]" -> "netflix-premium-4k"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove non-word chars
    .replace(/[\s_-]+/g, '-')   // collapse whitespace/underscores to single dash
    .replace(/^-+|-+$/g, '');   // trim leading/trailing dashes
}

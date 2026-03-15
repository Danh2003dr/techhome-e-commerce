/**
 * Format number as USD currency
 */
export function formatCurrency(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    ...options,
  }).format(value);
}

/**
 * Format number as VND (Vietnamese Dong). No decimals, dot as thousands separator.
 * Example: 24990000 → "24.990.000 ₫"
 */
export function formatVND(value: number): string {
  const n = Math.round(Number(value));
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
  return `${formatted} ₫`;
}

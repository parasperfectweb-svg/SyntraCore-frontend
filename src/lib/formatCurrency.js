// lib/formatCurrency.js
import { CURRENCY_SYMBOLS } from './constants';

/**
 * Formats a number as a currency string using a plain symbol prefix
 * (matches the design's "£1,250.00" / "€0.00" style) rather than
 * Intl.NumberFormat's locale-driven symbol placement.
 */
export function formatCurrency(amount, currency = 'USD', { decimals = 2 } = {}) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '';
  const value = Number(amount ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol}${value}`;
}

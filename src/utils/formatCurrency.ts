/**
 * @description
 * Utility functions for formatting currency values in the application.
 * Handles conversion between kobo (backend format) and naira (display format).
 *
 * @dependencies
 * - None - pure utility functions
 */

/**
 * Formats an amount in kobo to a displayable naira string
 * @param amountInKobo - The amount in kobo (smallest currency unit)
 * @returns Formatted currency string (e.g., "₦1,500.00")
 */
export const formatCurrency = (amountInKobo: number): string => {
  const nairaAmount = amountInKobo / 100;
  return `₦${nairaAmount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formats user-entered naira text with comma grouping while preserving decimals.
 * @param value - Raw amount input text
 * @returns Input-safe amount text (e.g., "125000.50" -> "125,000.50")
 */
export const formatAmountInput = (value: string): string => {
  const sanitized = value.replace(/,/g, '').replace(/[^\d.]/g, '');

  if (!sanitized) {
    return '';
  }

  const [rawIntegerPart = '', ...rawDecimalParts] = sanitized.split('.');
  const hasDecimal = sanitized.includes('.');
  const integerPart = rawIntegerPart.replace(/^0+(?=\d)/, '');
  const groupedInteger = (integerPart || (hasDecimal ? '0' : '')).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );
  const decimalPart = rawDecimalParts.join('').slice(0, 2);

  return hasDecimal ? `${groupedInteger}.${decimalPart}` : groupedInteger;
};

/**
 * Converts a naira amount to kobo
 * @param nairaAmount - The amount in naira
 * @returns The amount in kobo
 */
export const nairaToKobo = (nairaAmount: number): number => {
  return Math.round(nairaAmount * 100);
};

/**
 * Converts a kobo amount to naira
 * @param koboAmount - The amount in kobo
 * @returns The amount in naira
 */
export const koboToNaira = (koboAmount: number): number => {
  return koboAmount / 100;
};

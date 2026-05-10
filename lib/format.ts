/**
 * Format a raw number as Nigerian Naira currency.
 * @param amount - price in Naira as a plain integer (e.g. 25000)
 * @returns formatted string (e.g. "₦25,000")
 */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

/**
 * Format a Date as DD/MM/YYYY — Nigerian standard.
 * @param date - Date object or ISO string
 * @returns formatted string (e.g. "09/05/2025")
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Validate a Nigerian phone number.
 * @param phone - phone string to validate
 * @returns true if format matches +234XXXXXXXXXX
 */
export function isValidNigerianPhone(phone: string): boolean {
  return /^\+234\d{10}$/.test(phone);
}

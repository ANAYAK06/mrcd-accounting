// Double-entry voucher helpers
// src/utils/voucher.js

const amount = (value) => parseFloat(value) || 0;

const hasAmount = (entry) => amount(entry.debit) > 0 || amount(entry.credit) > 0;

/**
 * Lines that will be saved: an account is selected and there is a debit or credit amount.
 */
export const getValidEntries = (entries) =>
  entries.filter(entry => entry.accountCode && hasAmount(entry));

/**
 * Debit and credit totals of all lines, as shown while the user is typing.
 * validateVoucherEntries rejects amounts without an account, so a voucher that
 * passes validation has the same totals for the lines actually saved.
 */
export const calculateTotals = (entries) => {
  const totalDebit = entries.reduce((sum, entry) => sum + amount(entry.debit), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + amount(entry.credit), 0);
  return { totalDebit, totalCredit, difference: totalDebit - totalCredit };
};

export const isBalanced = (totals) => Math.abs(totals.difference) < 0.01;

/**
 * Checks the voucher lines before saving.
 * @returns {string|null} an error message, or null when the voucher can be saved
 */
export const validateVoucherEntries = (entries) => {
  if (entries.some(entry => !entry.accountCode && hasAmount(entry))) {
    return 'Select an account for every line that has an amount';
  }
  if (getValidEntries(entries).length < 2) {
    return 'At least 2 entries are required';
  }
  if (!isBalanced(calculateTotals(entries))) {
    return 'Debit and Credit must be equal!';
  }
  return null;
};

/**
 * Today's date as YYYY-MM-DD in the user's own time zone, for date inputs.
 * (toISOString() uses UTC, which gives yesterday's date in India before 5:30 am.)
 */
export const todayAsInputValue = (now = new Date()) => {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

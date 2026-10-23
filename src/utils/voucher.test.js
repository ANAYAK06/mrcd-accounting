import {
  calculateTotals,
  getValidEntries,
  isBalanced,
  todayAsInputValue,
  validateVoucherEntries
} from './voucher';

const line = (accountCode, debit = '', credit = '') => ({ accountCode, accountName: '', debit, credit });

describe('voucher entries', () => {
  test('a balanced two-line voucher is valid', () => {
    const entries = [line('1001', '500'), line('2001', '', '500')];
    expect(validateVoucherEntries(entries)).toBeNull();
  });

  test('empty lines are ignored', () => {
    const entries = [line('1001', '500'), line('2001', '', '500'), line('')];
    expect(getValidEntries(entries)).toHaveLength(2);
    expect(validateVoucherEntries(entries)).toBeNull();
  });

  test('debits and credits must be equal', () => {
    const entries = [line('1001', '500'), line('2001', '', '400')];
    expect(validateVoucherEntries(entries)).toMatch(/equal/);
  });

  test('at least two lines are needed', () => {
    expect(validateVoucherEntries([line('1001', '500'), line('')])).toMatch(/At least 2/);
  });

  test('an amount without an account is rejected, so the saved lines stay balanced', () => {
    // Totals on screen balance (500 = 250 + 250), but the third line has no account
    // and would be dropped when saving, leaving 500 debit against 250 credit.
    const entries = [line('1001', '500'), line('2001', '', '250'), line('', '', '250')];
    expect(isBalanced(calculateTotals(entries))).toBe(true);
    expect(validateVoucherEntries(entries)).toMatch(/Select an account/);
  });

  test('totals add decimal amounts typed as text', () => {
    const totals = calculateTotals([line('1001', '100.10'), line('1002', '0.20'), line('2001', '', '100.30')]);
    expect(totals.totalDebit).toBeCloseTo(100.3);
    expect(isBalanced(totals)).toBe(true);
  });

  test('today\'s date uses the local calendar date', () => {
    expect(todayAsInputValue(new Date(2026, 0, 5, 1, 30))).toBe('2026-01-05');
  });
});

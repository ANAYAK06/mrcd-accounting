import {
  getCurrentFinancialYear,
  getFinancialYearList,
  getFinancialYearStartDate,
  getFinancialYearEndDate,
  formatFinancialYear,
  isDateInFinancialYear,
  getFinancialYearForDate
} from './financialYear';

describe('financial year (April to March)', () => {
  afterEach(() => jest.useRealTimers());

  test('April starts a new financial year', () => {
    expect(getFinancialYearForDate(new Date(2025, 3, 1))).toBe('2025-26');
  });

  test('January to March belong to the previous financial year', () => {
    expect(getFinancialYearForDate(new Date(2026, 0, 15))).toBe('2025-26');
    expect(getFinancialYearForDate(new Date(2026, 2, 31))).toBe('2025-26');
  });

  test('the century boundary is formatted with two digits', () => {
    expect(getFinancialYearForDate(new Date(2099, 5, 1))).toBe('2099-00');
  });

  test('current year and the list of past years follow today\'s date', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 1, 10));
    expect(getCurrentFinancialYear()).toBe('2025-26');
    expect(getFinancialYearList(3)).toEqual(['2025-26', '2024-25', '2023-24']);
  });

  test('start and end dates of a financial year', () => {
    expect(getFinancialYearStartDate('2024-25')).toBe('2024-04-01');
    expect(getFinancialYearEndDate('2024-25')).toBe('2025-03-31');
  });

  test('a date is inside the financial year only between 1 April and 31 March', () => {
    expect(isDateInFinancialYear('2024-04-01', '2024-25')).toBe(true);
    expect(isDateInFinancialYear('2025-03-31', '2024-25')).toBe(true);
    expect(isDateInFinancialYear('2025-04-01', '2024-25')).toBe(false);
    expect(isDateInFinancialYear('2024-03-31', '2024-25')).toBe(false);
  });

  test('display format', () => {
    expect(formatFinancialYear('2024-25')).toBe('FY 2024-25');
  });
});

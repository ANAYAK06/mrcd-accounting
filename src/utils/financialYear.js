// Financial Year Utility Functions
// src/utils/financialYear.js

/**
 * Get current financial year in format "YYYY-YY"
 * Financial year runs from April to March
 */
export const getCurrentFinancialYear = () => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11 (0 = January, 3 = April)
  const currentYear = today.getFullYear();

  let startYear, endYear;

  if (currentMonth >= 3) {
    // April (3) to December (11) - current financial year
    startYear = currentYear;
    endYear = currentYear + 1;
  } else {
    // January (0) to March (2) - previous financial year
    startYear = currentYear - 1;
    endYear = currentYear;
  }

  // Format: "2024-25"
  const endYearShort = endYear.toString().slice(-2);
  return `${startYear}-${endYearShort}`;
};

/**
 * Get list of past financial years
 * @param {number} count - Number of years to include (default 5)
 */
export const getFinancialYearList = (count = 5) => {
  const years = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Determine the current financial year's start year
  let startYear;
  if (currentMonth >= 3) {
    startYear = currentYear;
  } else {
    startYear = currentYear - 1;
  }
  
  // Generate list of financial years
  for (let i = 0; i < count; i++) {
    const year = startYear - i;
    const nextYear = year + 1;
    const nextYearShort = nextYear.toString().slice(-2);
    years.push(`${year}-${nextYearShort}`);
  }
  
  return years;
};

/**
 * Get financial year start date
 */
export const getFinancialYearStartDate = (financialYear) => {
  if (!financialYear) {
    financialYear = getCurrentFinancialYear();
  }
  
  const startYear = financialYear.split('-')[0];
  return `${startYear}-04-01`;
};

/**
 * Get financial year end date
 */
export const getFinancialYearEndDate = (financialYear) => {
  if (!financialYear) {
    financialYear = getCurrentFinancialYear();
  }
  
  const parts = financialYear.split('-');
  const startYear = parseInt(parts[0]);
  const endYear = startYear + 1;
  return `${endYear}-03-31`;
};

/**
 * Format financial year for display
 * @param {string} fy - Financial year in format "2024-25"
 * @returns {string} - Formatted as "FY 2024-25"
 */
export const formatFinancialYear = (fy) => {
  return `FY ${fy}`;
};

/**
 * Check if a date falls within a financial year
 */
export const isDateInFinancialYear = (date, financialYear) => {
  const checkDate = new Date(date);
  const startDate = new Date(getFinancialYearStartDate(financialYear));
  const endDate = new Date(getFinancialYearEndDate(financialYear));
  
  return checkDate >= startDate && checkDate <= endDate;
};

/**
 * Get financial year for a specific date
 */
export const getFinancialYearForDate = (date) => {
  const d = new Date(date);
  const month = d.getMonth();
  const year = d.getFullYear();
  
  let startYear;
  
  if (month >= 3) {
    // April to December
    startYear = year;
  } else {
    // January to March
    startYear = year - 1;
  }
  
  const endYear = startYear + 1;
  const endYearShort = endYear.toString().slice(-2);
  
  return `${startYear}-${endYearShort}`;
};
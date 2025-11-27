import React, { useState, useEffect, useCallback } from 'react';
import { getAccountWiseMonthly } from '../../api/api';
import { getCurrentFinancialYear, getFinancialYearList } from '../../utils/financialYear';

const AccountWiseMonthly = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialYear, setFinancialYear] = useState(getCurrentFinancialYear());
  const [accountType, setAccountType] = useState('all');

  // Get list of available financial years (current + last 5 years)
  const financialYearOptions = getFinancialYearList(6);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAccountWiseMonthly(financialYear, accountType);

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch report');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [financialYear, accountType]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const formatAmount = (amount) => {
    if (!amount || amount === 0) return '—';
    return amount.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">No data available</p>
      </div>
    );
  }

  const { monthNames, incomeAccounts, expenseAccounts, monthlyTotals, summary } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Account-wise Monthly Comparison</h2>
          <p className="text-gray-600">Month by Month Breakdown</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {financialYearOptions.map(year => (
              <option key={year} value={year}>FY {year}</option>
            ))}
          </select>

          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Accounts</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>
      </div>

      {/* Expense Accounts Table */}
      {(accountType === 'all' || accountType === 'expense') && expenseAccounts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <h3 className="text-lg font-semibold text-red-800">EXPENSE ACCOUNTS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r-2 border-gray-300 sticky left-0 bg-gray-50">
                    Account Name
                  </th>
                  {monthNames.map((month, idx) => (
                    <th key={idx} className="px-3 py-3 text-right font-medium text-gray-600">
                      {month}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-l-2 border-gray-300 bg-red-50">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenseAccounts.map((account) => (
                  <tr key={account.accountCode} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 border-r-2 border-gray-200 sticky left-0 bg-white">
                      {account.accountName}
                    </td>
                    {account.monthlyData.map((amount, idx) => (
                      <td key={idx} className="px-3 py-3 text-right text-red-600">
                        {formatAmount(amount)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right font-bold text-red-700 border-l-2 border-gray-300 bg-red-50">
                      {formatAmount(account.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-red-50 border-t-2 border-red-300">
                <tr>
                  <td className="px-4 py-4 font-bold text-gray-900 border-r-2 border-red-300 sticky left-0 bg-red-50">
                    TOTAL EXPENSES
                  </td>
                  {monthlyTotals.expense.map((total, idx) => (
                    <td key={idx} className="px-3 py-4 text-right font-bold text-red-700">
                      {formatAmount(total)}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-right font-bold text-red-800 border-l-2 border-red-300 text-base">
                    {formatAmount(summary.totalExpense)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Income Accounts Table */}
      {(accountType === 'all' || accountType === 'income') && incomeAccounts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-green-50 border-b border-green-200">
            <h3 className="text-lg font-semibold text-green-800">INCOME ACCOUNTS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 border-r-2 border-gray-300 sticky left-0 bg-gray-50">
                    Account Name
                  </th>
                  {monthNames.map((month, idx) => (
                    <th key={idx} className="px-3 py-3 text-right font-medium text-gray-600">
                      {month}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 border-l-2 border-gray-300 bg-green-50">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incomeAccounts.map((account) => (
                  <tr key={account.accountCode} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 border-r-2 border-gray-200 sticky left-0 bg-white">
                      {account.accountName}
                    </td>
                    {account.monthlyData.map((amount, idx) => (
                      <td key={idx} className="px-3 py-3 text-right text-green-600">
                        {formatAmount(amount)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right font-bold text-green-700 border-l-2 border-gray-300 bg-green-50">
                      {formatAmount(account.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-green-50 border-t-2 border-green-300">
                <tr>
                  <td className="px-4 py-4 font-bold text-gray-900 border-r-2 border-green-300 sticky left-0 bg-green-50">
                    TOTAL INCOME
                  </td>
                  {monthlyTotals.income.map((total, idx) => (
                    <td key={idx} className="px-3 py-4 text-right font-bold text-green-700">
                      {formatAmount(total)}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-right font-bold text-green-800 border-l-2 border-green-300 text-base">
                    {formatAmount(summary.totalIncome)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h4 className="text-sm font-medium text-green-700 mb-2">Total Income</h4>
          <div className="text-3xl font-bold text-green-700">₹{formatAmount(summary.totalIncome)}</div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h4 className="text-sm font-medium text-red-700 mb-2">Total Expenses</h4>
          <div className="text-3xl font-bold text-red-700">₹{formatAmount(summary.totalExpense)}</div>
        </div>

        <div className={`border-2 rounded-xl p-6 ${summary.netSurplus >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
          <h4 className={`text-sm font-medium mb-2 ${summary.netSurplus >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            Net {summary.netSurplus >= 0 ? 'Surplus' : 'Deficit'}
          </h4>
          <div className={`text-3xl font-bold ${summary.netSurplus >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            ₹{formatAmount(Math.abs(summary.netSurplus))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountWiseMonthly;
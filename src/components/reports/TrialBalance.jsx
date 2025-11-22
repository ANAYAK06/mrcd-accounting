import React, { useState, useEffect } from 'react';
import { getTrialBalance } from '../../api/api';
import { Calendar, Download, Scale, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

function TrialBalance() {
  const [asOnDate, setAsOnDate] = useState(new Date().toISOString().split('T')[0]);
  const [trialBalanceData, setTrialBalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Auto-generate on component load
    handleGenerateReport();
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    
    console.log('📊 Generating Trial Balance as on:', asOnDate);
    
    try {
      const result = await getTrialBalance(asOnDate);
      
      console.log('📊 Trial Balance Result:', result);
      
      if (result.success) {
        console.log('✅ Trial Balance Data:', result.data);
        console.log('   Total Accounts:', result.data.accounts?.length || 0);
        console.log('   Total Debit:', result.data.totalDebit);
        console.log('   Total Credit:', result.data.totalCredit);
        console.log('   Is Balanced:', result.data.isBalanced);
        
        setTrialBalanceData(result.data);
      } else {
        console.error('❌ Error:', result.error);
        setError('Failed to generate report: ' + result.error);
      }
    } catch (err) {
      console.error('❌ Exception:', err);
      setError('Error generating report: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    return Math.abs(parseFloat(amount)).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const isBalanced = () => {
    if (!trialBalanceData) return false;
    const diff = Math.abs(trialBalanceData.totalDebit - trialBalanceData.totalCredit);
    return diff < 0.01; // Allow for rounding errors
  };

  const getDifference = () => {
    if (!trialBalanceData) return 0;
    return Math.abs(trialBalanceData.totalDebit - trialBalanceData.totalCredit);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white shadow-lg print:hidden">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Trial Balance</h2>
            <p className="text-sm opacity-90">Verify all account balances</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 print:hidden">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Filters - Print Hidden */}
      <div className="bg-white rounded-xl shadow-md p-6 print:hidden">
        <div className="flex items-center gap-4">
          {/* As On Date */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              As On Date
            </label>
            <input
              type="date"
              value={asOnDate}
              onChange={(e) => {
                setAsOnDate(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-3">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Calendar className="w-4 h-4" />
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
            {trialBalanceData && (
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Print / Download
              </button>
            )}
          </div>
        </div>

        {/* Balance Status Alert */}
        {trialBalanceData && (
          <div className={`mt-4 p-4 rounded-lg border ${
            isBalanced() 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {isBalanced() ? (
                <>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Trial Balance is Balanced! ✓</p>
                    <p className="text-sm text-green-700">Total Debits equal Total Credits</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Trial Balance is NOT Balanced!</p>
                    <p className="text-sm text-red-700">
                      Difference: ₹{formatCurrency(getDifference())}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Report Display */}
      {trialBalanceData && (
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Report Header */}
          <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              MALABAR REHABILITATION CENTER FOR DIFFERENTLY ABLED (MRCD)
            </h3>
            <p className="text-sm text-gray-600 mt-1">Payyanur, Kerala</p>
            <h4 className="text-xl font-semibold text-green-600 mt-3">
              TRIAL BALANCE
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              As on {new Date(asOnDate).toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Trial Balance Table */}
          {trialBalanceData.accounts && trialBalanceData.accounts.length > 0 ? (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Account Code
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Account Name
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Debit (₹)
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Credit (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalanceData.accounts.map((account, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                        {account.accountCode}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                        {account.accountName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-600">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          account.accountType === 'Asset' ? 'bg-blue-100 text-blue-700' :
                          account.accountType === 'Liability' ? 'bg-red-100 text-red-700' :
                          account.accountType === 'Income' ? 'bg-green-100 text-green-700' :
                          account.accountType === 'Expense' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {account.accountType}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-right font-semibold text-blue-600">
                        {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm text-right font-semibold text-red-600">
                        {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-200 font-bold">
                    <td colSpan="3" className="border border-gray-300 px-4 py-3 text-right text-sm">
                      TOTAL:
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-sm text-blue-700">
                      ₹{formatCurrency(trialBalanceData.totalDebit)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-sm text-red-700">
                      ₹{formatCurrency(trialBalanceData.totalCredit)}
                    </td>
                  </tr>
                  {!isBalanced() && (
                    <tr className="bg-red-100 font-bold">
                      <td colSpan="3" className="border border-gray-300 px-4 py-3 text-right text-sm text-red-800">
                        DIFFERENCE:
                      </td>
                      <td colSpan="2" className="border border-gray-300 px-4 py-3 text-center text-sm text-red-800">
                        ₹{formatCurrency(getDifference())}
                      </td>
                    </tr>
                  )}
                  {isBalanced() && (
                    <tr className="bg-green-100 font-bold">
                      <td colSpan="5" className="border border-gray-300 px-4 py-3 text-center text-sm text-green-800">
                        ✓ BALANCED - Debits equal Credits
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No account balances found</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Debit</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{formatCurrency(trialBalanceData.totalDebit || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Credit</p>
                  <p className="text-lg font-bold text-red-600">
                    ₹{formatCurrency(trialBalanceData.totalCredit || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${
              isBalanced() 
                ? 'bg-green-50 border-green-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-3">
                {isBalanced() ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                )}
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p className={`text-lg font-bold ${
                    isBalanced() ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {isBalanced() ? 'Balanced ✓' : 'Not Balanced'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Summary by Type */}
          {trialBalanceData.accounts && trialBalanceData.accounts.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Asset', 'Liability', 'Income', 'Expense'].map((type) => {
                const count = trialBalanceData.accounts.filter(acc => acc.accountType === type).length;
                return (
                  <div key={type} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600">{type} Accounts</p>
                    <p className="text-xl font-bold text-gray-800">{count}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Report Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
            <p className="mt-1">MRCD Accounting System - Trial Balance Report</p>
          </div>
        </div>
      )}

      {/* No Report State */}
      {!trialBalanceData && !loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Scale className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Report Generated</h3>
          <p className="text-gray-500">Select a date and click "Generate Report"</p>
        </div>
      )}
    </div>
  );
}

export default TrialBalance;
import React, { useState, useEffect } from 'react';
import { getChartOfAccounts, getLedger } from '../../api/api';
import { Search, Download, Calendar, TrendingUp, TrendingDown, FileText, AlertCircle } from 'lucide-react';

function LedgerReport() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAccounts();
    // Set from date to first day of current month
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    setFromDate(firstDay.toISOString().split('T')[0]);
  }, []);

  const loadAccounts = async () => {
    console.log('📋 Loading accounts...');
    try {
      const result = await getChartOfAccounts();
      console.log('📋 Accounts result:', result);
      if (result.success) {
        setAccounts(result.data.filter(acc => acc.isActive));
        console.log('✅ Loaded', result.data.length, 'accounts');
      } else {
        setError('Failed to load accounts: ' + result.error);
      }
    } catch (err) {
      setError('Error loading accounts: ' + err.message);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedAccount) {
      alert('Please select an account');
      return;
    }

    // Validate date range
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      alert('From Date cannot be after To Date');
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log('🔍 Generating ledger report...');
    console.log('   Account Code:', selectedAccount);
    console.log('   From Date:', fromDate);
    console.log('   To Date:', toDate);
    
    try {
      const result = await getLedger(selectedAccount, fromDate, toDate);
      
      console.log('📊 Ledger API Response:', result);
      
      if (result.success) {
        console.log('✅ Ledger Data:', result.data);
        console.log('   Account Name:', result.data.accountName);
        console.log('   Transactions:', result.data.transactions?.length || 0);
        console.log('   Opening Balance:', result.data.openingBalance);
        console.log('   Closing Balance:', result.data.closingBalance);
        
        if (!result.data.accountName) {
          console.warn('⚠️ WARNING: accountName is missing in API response!');
          console.warn('   You need to update Google Apps Script getLedger function');
        }
        
        setLedgerData(result.data);
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

  // Get account name from API response FIRST, then fallback to local state
  const getAccountName = () => {
    // Priority 1: From API response (most reliable)
    if (ledgerData && ledgerData.accountName) {
      return ledgerData.accountName;
    }
    
    // Priority 2: From local accounts state (fallback)
    const account = accounts.find(acc => acc.accountCode === selectedAccount);
    if (account) {
      return account.accountName;
    }
    
    // Priority 3: Unknown
    return 'Unknown Account';
  };

  // Format balance with sign indicator for better readability
  const formatBalance = (balance) => {
    const absBalance = Math.abs(balance);
    const formatted = absBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
    
    if (balance > 0) {
      return `₹${formatted} Dr`;
    } else if (balance < 0) {
      return `₹${formatted} Cr`;
    } else {
      return `₹${formatted}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg print:hidden">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Ledger Report</h2>
            <p className="text-sm opacity-90">Account-wise transaction details</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Account Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Account <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => {
                setSelectedAccount(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Choose an account...</option>
              {accounts.map(acc => (
                <option key={acc.accountCode} value={acc.accountCode}>
                  {acc.accountCode} - {acc.accountName}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setError(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleGenerateReport}
            disabled={loading || !selectedAccount}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          {ledgerData && (
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

      {/* Report Display */}
      {ledgerData && (
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Report Header */}
          <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
            <h3 className="text-2xl font-bold text-gray-900">MRCD - Ledger Report</h3>
            <p className="text-sm text-gray-600 mt-1">
              Malabar Rehabilitation Center for Differently Abled
            </p>
            <div className="mt-3">
              <p className="text-lg font-semibold text-gray-800">
                Account: {selectedAccount} - {getAccountName()}
              </p>
              <p className="text-sm text-gray-600">
                Period: {new Date(fromDate).toLocaleDateString('en-IN')} to {new Date(toDate).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>

          {/* Opening Balance */}
          <div className={`border rounded-lg p-4 mb-6 ${
            ledgerData.openingBalance > 0 
              ? 'bg-blue-50 border-blue-200' 
              : ledgerData.openingBalance < 0 
              ? 'bg-red-50 border-red-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Opening Balance:</span>
              <span className={`text-lg font-bold ${
                ledgerData.openingBalance > 0 
                  ? 'text-blue-600' 
                  : ledgerData.openingBalance < 0 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }`}>
                {formatBalance(ledgerData.openingBalance || 0)}
              </span>
            </div>
          </div>

          {/* Transactions Table */}
          {ledgerData.transactions && ledgerData.transactions.length > 0 ? (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Voucher No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Particulars
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                      Debit (₹)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                      Credit (₹)
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                      Balance (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ledgerData.transactions.map((txn, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(txn.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {txn.voucherNo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {txn.narration || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
                        {txn.debit > 0 ? `₹${txn.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">
                        {txn.credit > 0 ? `₹${txn.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-bold ${
                        txn.balance > 0 ? 'text-blue-600' : txn.balance < 0 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {formatBalance(txn.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions found for this period</p>
            </div>
          )}

          {/* Closing Balance */}
          <div className="border-t-2 border-gray-300 pt-4">
            <div className={`border rounded-lg p-4 ${
              ledgerData.closingBalance > 0 
                ? 'bg-blue-50 border-blue-200' 
                : ledgerData.closingBalance < 0 
                ? 'bg-red-50 border-red-200' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Closing Balance:</span>
                <span className={`text-lg font-bold ${
                  ledgerData.closingBalance > 0 
                    ? 'text-blue-600' 
                    : ledgerData.closingBalance < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {formatBalance(ledgerData.closingBalance || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Debit</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{(ledgerData.totalDebit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
                    ₹{(ledgerData.totalCredit || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Transactions</p>
                  <p className="text-lg font-bold text-purple-600">
                    {ledgerData.transactions?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
            <p className="mt-1">MRCD Accounting System - Ledger Report</p>
          </div>
        </div>
      )}

      {/* No Report State */}
      {!ledgerData && !loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Report Generated</h3>
          <p className="text-gray-500">Select an account and date range, then click "Generate Report"</p>
        </div>
      )}
    </div>
  );
}

export default LedgerReport;
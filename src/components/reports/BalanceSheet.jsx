import React, { useState, useEffect } from 'react';
import { getBalanceSheet } from '../../api/api';
import { Calendar, Download, Building2, AlertCircle, CheckCircle, FileText } from 'lucide-react';

function BalanceSheet() {
  const [asOnDate, setAsOnDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Auto-generate on component load
    handleGenerateReport();
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    
    console.log('📊 Generating Balance Sheet as on:', asOnDate);
    
    try {
      const result = await getBalanceSheet(asOnDate);
      
      console.log('📊 Balance Sheet Result:', result);
      
      if (result.success) {
        console.log('✅ Balance Sheet Data:', result.data);
        console.log('   Assets:', result.data.assets?.length || 0);
        console.log('   Liabilities:', result.data.liabilities?.length || 0);
        console.log('   Equity:', result.data.equity?.length || 0);
        console.log('   Total Assets:', result.data.totalAssets);
        console.log('   Total Liabilities & Equity:', result.data.totalLiabilitiesAndEquity);
        console.log('   Is Balanced:', result.data.isBalanced);
        
        setReportData(result.data);
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
    if (!reportData) return false;
    return reportData.isBalanced;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white shadow-lg print:hidden">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Balance Sheet</h2>
            <p className="text-sm opacity-90">Financial position as on a specific date</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-3">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Calendar className="w-4 h-4" />
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
            {reportData && (
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
        {reportData && (
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
                    <p className="font-semibold text-green-800">Balance Sheet is Balanced! ✓</p>
                    <p className="text-sm text-green-700">Assets equal Liabilities + Equity</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Balance Sheet is NOT Balanced!</p>
                    <p className="text-sm text-red-700">
                      Difference: ₹{formatCurrency(reportData.difference)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Report Display */}
      {reportData && (
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Report Header */}
          <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
            <h3 className="text-2xl font-bold text-gray-900">
              MALABAR REHABILITATION CENTER FOR DIFFERENTLY ABLED (MRCD)
            </h3>
            <p className="text-sm text-gray-600 mt-1">Payyanur, Kerala</p>
            <h4 className="text-xl font-semibold text-indigo-600 mt-3">
              BALANCE SHEET
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              As on {new Date(asOnDate).toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* LIABILITIES & EQUITY SECTION */}
            <div>
              <div className="bg-red-50 border-b-2 border-red-600 px-4 py-2 mb-3">
                <h5 className="font-bold text-red-800 text-lg">LIABILITIES & EQUITY</h5>
              </div>
              
              {/* Liabilities */}
              {reportData.liabilities && reportData.liabilities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 px-4">Liabilities:</p>
                  <div className="space-y-2">
                    {reportData.liabilities.map((account, index) => (
                      <div key={index} className="flex justify-between items-start px-4 py-2 hover:bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{account.accountName}</p>
                          <p className="text-xs text-gray-500">{account.accountCode}</p>
                        </div>
                        <p className="text-sm font-semibold text-red-700 ml-4">
                          ₹{formatCurrency(account.balance)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Equity */}
              {reportData.equity && reportData.equity.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 px-4">Equity/Capital:</p>
                  <div className="space-y-2">
                    {reportData.equity.map((account, index) => (
                      <div key={index} className="flex justify-between items-start px-4 py-2 hover:bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{account.accountName}</p>
                          <p className="text-xs text-gray-500">{account.accountCode}</p>
                        </div>
                        <p className="text-sm font-semibold text-purple-700 ml-4">
                          ₹{formatCurrency(account.balance)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Liabilities */}
              <div className="border-t-2 border-red-600 mt-3 pt-3 px-4 bg-red-50">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <p className="font-semibold text-gray-700">Total Liabilities</p>
                    <p className="font-semibold text-red-700">
                      ₹{formatCurrency(reportData.totalLiabilities)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="font-semibold text-gray-700">Total Equity</p>
                    <p className="font-semibold text-purple-700">
                      ₹{formatCurrency(reportData.totalEquity)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-red-300">
                    <p className="font-bold text-gray-900">Total</p>
                    <p className="text-lg font-bold text-red-700">
                      ₹{formatCurrency(reportData.totalLiabilitiesAndEquity)}
                    </p>
                  </div>
                </div>
              </div>

              {((!reportData.liabilities || reportData.liabilities.length === 0) && 
                (!reportData.equity || reportData.equity.length === 0)) && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No liabilities or equity found</p>
                </div>
              )}
            </div>

            {/* ASSETS SECTION */}
            <div>
              <div className="bg-blue-50 border-b-2 border-blue-600 px-4 py-2 mb-3">
                <h5 className="font-bold text-blue-800 text-lg">ASSETS</h5>
              </div>
              
              {reportData.assets && reportData.assets.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {reportData.assets.map((account, index) => (
                    <div key={index} className="flex justify-between items-start px-4 py-2 hover:bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{account.accountName}</p>
                        <p className="text-xs text-gray-500">{account.accountCode}</p>
                      </div>
                      <p className="text-sm font-semibold text-blue-700 ml-4">
                        ₹{formatCurrency(account.balance)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 mb-4">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No assets found</p>
                </div>
              )}
              
              {/* Total Assets */}
              <div className="border-t-2 border-blue-600 mt-3 pt-3 px-4 bg-blue-50">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-gray-900">Total Assets</p>
                  <p className="text-lg font-bold text-blue-700">
                    ₹{formatCurrency(reportData.totalAssets)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Balance Verification */}
          {!isBalanced() && (
            <div className="bg-red-100 border-2 border-red-600 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="font-bold text-red-800">DIFFERENCE:</p>
                <p className="text-lg font-bold text-red-800">
                  ₹{formatCurrency(reportData.difference)}
                </p>
              </div>
            </div>
          )}

          {isBalanced() && (
            <div className="bg-green-100 border-2 border-green-600 rounded-lg p-4 mb-6">
              <p className="text-center font-bold text-green-800">
                ✓ BALANCED - Assets equal Liabilities + Equity
              </p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Assets</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{formatCurrency(reportData.totalAssets || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Liabilities</p>
                  <p className="text-lg font-bold text-red-600">
                    ₹{formatCurrency(reportData.totalLiabilities || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Equity</p>
                  <p className="text-lg font-bold text-purple-600">
                    ₹{formatCurrency(reportData.totalEquity || 0)}
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

          {/* Account Counts */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600">Asset Accounts</p>
              <p className="text-xl font-bold text-gray-800">
                {reportData.assets?.length || 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600">Liability Accounts</p>
              <p className="text-xl font-bold text-gray-800">
                {reportData.liabilities?.length || 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600">Equity Accounts</p>
              <p className="text-xl font-bold text-gray-800">
                {reportData.equity?.length || 0}
              </p>
            </div>
          </div>

          {/* Report Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
            <p className="mt-1">MRCD Accounting System - Balance Sheet</p>
          </div>
        </div>
      )}

      {/* No Report State */}
      {!reportData && !loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Building2 className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Report Generated</h3>
          <p className="text-gray-500">Select a date and click "Generate Report"</p>
        </div>
      )}
    </div>
  );
}

export default BalanceSheet;
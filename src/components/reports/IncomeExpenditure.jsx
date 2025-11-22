import React, { useState, useEffect } from 'react';
import { getIncomeExpenditure } from '../../api/api';
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, AlertCircle, FileText } from 'lucide-react';

function IncomeExpenditure() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set from date to first day of current financial year (April 1st)
    const today = new Date();
    const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const financialYearStart = new Date(currentYear, 3, 1); // April 1st
    setFromDate(financialYearStart.toISOString().split('T')[0]);
    
    // Auto-generate on component load
    handleGenerateReport();
  }, []);

  const handleGenerateReport = async () => {
    // Validate date range
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      setError('From Date cannot be after To Date');
      return;
    }

    setLoading(true);
    setError(null);
    
    console.log('📊 Generating Income & Expenditure Statement...');
    console.log('   From Date:', fromDate);
    console.log('   To Date:', toDate);
    
    try {
      const result = await getIncomeExpenditure(fromDate, toDate);
      
      console.log('📊 I&E Result:', result);
      
      if (result.success) {
        console.log('✅ I&E Data:', result.data);
        console.log('   Income Accounts:', result.data.incomeAccounts?.length || 0);
        console.log('   Expenditure Accounts:', result.data.expenditureAccounts?.length || 0);
        console.log('   Total Income:', result.data.totalIncome);
        console.log('   Total Expenditure:', result.data.totalExpenditure);
        console.log('   Surplus/Deficit:', result.data.surplus);
        
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg print:hidden">
        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Income & Expenditure Statement</h2>
            <p className="text-sm opacity-90">Surplus/Deficit for the period</p>
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
          {/* From Date */}
          <div className="flex-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          {/* To Date */}
          <div className="flex-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-3">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        {/* Summary Alert */}
        {reportData && (
          <div className={`mt-4 p-4 rounded-lg border ${
            reportData.isSurplus 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {reportData.isSurplus ? (
                <>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Surplus for the Period!</p>
                    <p className="text-sm text-green-700">
                      Income exceeds Expenditure by ₹{formatCurrency(reportData.surplus)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800">Deficit for the Period</p>
                    <p className="text-sm text-red-700">
                      Expenditure exceeds Income by ₹{formatCurrency(Math.abs(reportData.surplus))}
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
            <h4 className="text-xl font-semibold text-purple-600 mt-3">
              INCOME & EXPENDITURE STATEMENT
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              For the period from {new Date(fromDate).toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })} to {new Date(toDate).toLocaleDateString('en-IN', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* INCOME SECTION */}
            <div>
              <div className="bg-green-50 border-b-2 border-green-600 px-4 py-2 mb-3">
                <h5 className="font-bold text-green-800 text-lg">INCOME</h5>
              </div>
              
              {reportData.incomeAccounts && reportData.incomeAccounts.length > 0 ? (
                <div className="space-y-2">
                  {reportData.incomeAccounts.map((account, index) => (
                    <div key={index} className="flex justify-between items-start px-4 py-2 hover:bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{account.accountName}</p>
                        <p className="text-xs text-gray-500">{account.accountCode}</p>
                      </div>
                      <p className="text-sm font-semibold text-green-700 ml-4">
                        ₹{formatCurrency(account.amount)}
                      </p>
                    </div>
                  ))}
                  
                  {/* Total Income */}
                  <div className="border-t-2 border-green-600 mt-3 pt-3 px-4 bg-green-50">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-900">Total Income</p>
                      <p className="text-lg font-bold text-green-700">
                        ₹{formatCurrency(reportData.totalIncome)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No income accounts found</p>
                </div>
              )}
            </div>

            {/* EXPENDITURE SECTION */}
            <div>
              <div className="bg-red-50 border-b-2 border-red-600 px-4 py-2 mb-3">
                <h5 className="font-bold text-red-800 text-lg">EXPENDITURE</h5>
              </div>
              
              {reportData.expenditureAccounts && reportData.expenditureAccounts.length > 0 ? (
                <div className="space-y-2">
                  {reportData.expenditureAccounts.map((account, index) => (
                    <div key={index} className="flex justify-between items-start px-4 py-2 hover:bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{account.accountName}</p>
                        <p className="text-xs text-gray-500">{account.accountCode}</p>
                      </div>
                      <p className="text-sm font-semibold text-red-700 ml-4">
                        ₹{formatCurrency(account.amount)}
                      </p>
                    </div>
                  ))}
                  
                  {/* Total Expenditure */}
                  <div className="border-t-2 border-red-600 mt-3 pt-3 px-4 bg-red-50">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-900">Total Expenditure</p>
                      <p className="text-lg font-bold text-red-700">
                        ₹{formatCurrency(reportData.totalExpenditure)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No expenditure accounts found</p>
                </div>
              )}
            </div>
          </div>

          {/* Surplus/Deficit */}
          <div className={`border-t-4 pt-4 ${
            reportData.isSurplus ? 'border-green-600' : 'border-red-600'
          }`}>
            <div className={`rounded-lg p-6 ${
              reportData.isSurplus ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-lg font-bold ${
                    reportData.isSurplus ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {reportData.isSurplus ? 'SURPLUS' : 'DEFICIT'} for the period
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {reportData.isSurplus 
                      ? 'Income exceeded Expenditure' 
                      : 'Expenditure exceeded Income'
                    }
                  </p>
                </div>
                <p className={`text-3xl font-bold ${
                  reportData.isSurplus ? 'text-green-700' : 'text-red-700'
                }`}>
                  ₹{formatCurrency(Math.abs(reportData.surplus))}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Income</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{formatCurrency(reportData.totalIncome || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-xs text-gray-600">Total Expenditure</p>
                  <p className="text-lg font-bold text-red-600">
                    ₹{formatCurrency(reportData.totalExpenditure || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${
              reportData.isSurplus 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-3">
                <DollarSign className={`w-8 h-8 ${
                  reportData.isSurplus ? 'text-blue-600' : 'text-orange-600'
                }`} />
                <div>
                  <p className="text-xs text-gray-600">
                    {reportData.isSurplus ? 'Surplus' : 'Deficit'}
                  </p>
                  <p className={`text-lg font-bold ${
                    reportData.isSurplus ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    ₹{formatCurrency(Math.abs(reportData.surplus || 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Counts */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600">Income Accounts</p>
              <p className="text-xl font-bold text-gray-800">
                {reportData.incomeAccounts?.length || 0}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600">Expenditure Accounts</p>
              <p className="text-xl font-bold text-gray-800">
                {reportData.expenditureAccounts?.length || 0}
              </p>
            </div>
          </div>

          {/* Report Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
            <p className="mt-1">MRCD Accounting System - Income & Expenditure Statement</p>
          </div>
        </div>
      )}

      {/* No Report State */}
      {!reportData && !loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <DollarSign className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Report Generated</h3>
          <p className="text-gray-500">Select a date range and click "Generate Report"</p>
        </div>
      )}
    </div>
  );
}

export default IncomeExpenditure;
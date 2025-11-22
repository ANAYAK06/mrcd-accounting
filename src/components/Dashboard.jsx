import React, { useState, useEffect } from 'react';
import { getBalanceSheet, getIncomeExpenditure, getVouchers } from '../api/api';
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Calendar } from 'lucide-react';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    totalIncome: 0,
    totalExpenditure: 0,
    surplus: 0,
    recentVouchers: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0];
    
    try {
      const [balanceSheet, incomeExpenditure, vouchers] = await Promise.all([
        getBalanceSheet(today),
        getIncomeExpenditure(firstDayOfMonth, today),
        getVouchers()
      ]);
      
      setDashboardData({
        totalAssets: balanceSheet.data?.totalAssets || 0,
        totalLiabilities: balanceSheet.data?.totalLiabilities || 0,
        totalIncome: incomeExpenditure.data?.totalIncome || 0,
        totalExpenditure: incomeExpenditure.data?.totalExpenditure || 0,
        surplus: incomeExpenditure.data?.surplus || 0,
        recentVouchers: vouchers.data?.slice(0, 5) || []
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to MRCD Accounting
            </h1>
            <p className="text-blue-100">
              Malabar Rehabilitation Center for Differently Abled
            </p>
          </div>
          <div className="hidden md:block">
            <Calendar className="w-16 h-16 opacity-50" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-100">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assets Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Assets
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Assets</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{dashboardData.totalAssets.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Total Liabilities Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
              Liabilities
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Liabilities</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{dashboardData.totalLiabilities.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Monthly Income Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
              This Month
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{dashboardData.totalIncome.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Monthly Expenditure Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
              This Month
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Expenditure</p>
            <p className="text-2xl font-bold text-red-600">
              ₹{dashboardData.totalExpenditure.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Surplus/Deficit Card */}
      <div className={`rounded-xl shadow-md p-6 ${
        dashboardData.surplus >= 0 
          ? 'bg-gradient-to-r from-green-500 to-green-600' 
          : 'bg-gradient-to-r from-red-500 to-red-600'
      } text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80 mb-2">Monthly Surplus / Deficit</p>
            <p className="text-4xl font-bold">
              ₹{Math.abs(dashboardData.surplus).toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-white/90 mt-2">
              {dashboardData.surplus >= 0 ? '✓ Surplus' : '✗ Deficit'} for this month
            </p>
          </div>
          <div className="hidden md:block">
            {dashboardData.surplus >= 0 ? (
              <TrendingUp className="w-20 h-20 opacity-30" />
            ) : (
              <TrendingDown className="w-20 h-20 opacity-30" />
            )}
          </div>
        </div>
      </div>

      {/* Recent Vouchers */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Recent Vouchers
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </button>
        </div>

        {dashboardData.recentVouchers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No vouchers yet</p>
            <p className="text-sm text-gray-400 mt-2">Create your first voucher to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Voucher No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Narration
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.recentVouchers.map((voucher, index) => {
                  const totalAmount = voucher.entries?.reduce((sum, entry) => 
                    sum + (entry.debit || entry.credit || 0), 0
                  ) || 0;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {voucher.voucherNo}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          voucher.voucherType === 'Receipt' 
                            ? 'bg-green-100 text-green-800'
                            : voucher.voucherType === 'Payment'
                            ? 'bg-red-100 text-red-800'
                            : voucher.voucherType === 'Journal'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {voucher.voucherType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(voucher.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {voucher.narration || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Beneficiaries</p>
              <p className="text-2xl font-bold text-gray-900">500+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Staff Members</p>
              <p className="text-2xl font-bold text-gray-900">50+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Vouchers</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.recentVouchers.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
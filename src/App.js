import React, { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser } from './api/api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import VoucherEntry from './components/VoucherEntry';
import VoucherList from './components/VoucherList';
import ChartOfAccounts from './components/ChartOfAccounts';
import LedgerReport from './components/reports/LedgerReport';
import TrialBalance from './components/reports/TrialBalance';
import IncomeExpenditure from './components/reports/IncomeExpenditure';
import BalanceSheet from './components/reports/BalanceSheet';

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
  }, []);

  if (!isAuthenticated()) {
    return <Login onLogin={() => setUser(getCurrentUser())} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 lg:p-8">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'vouchers' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Voucher Entry</h2>
                <p className="text-gray-600">Voucher entry form will be here</p>
              </div>
            )}
            {activeTab === 'payment' && (
              <VoucherEntry voucherType="Payment" />
            )}
            {activeTab === 'receipt' && (
              <VoucherEntry voucherType="Receipt" />
            )}
            {activeTab === 'journal' && (
              <VoucherEntry voucherType="Journal" />
            )}
            {activeTab === 'contra' && (
              <VoucherEntry voucherType="Contra" />
            )}
            {activeTab === 'voucher-list' && (
              <VoucherList />
            )}
            {activeTab === 'accounts' && (
              <ChartOfAccounts />
            )}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
                <p className="text-gray-600">Reports will be here</p>
              </div>
            )}
            {activeTab === 'ledger' && (
              <LedgerReport />
            )}
            {activeTab === 'trial-balance' && (
              <TrialBalance />
            )}
            {activeTab === 'income-expenditure' && (
              <IncomeExpenditure />
            )}
            {activeTab === 'balance-sheet' && (
              <BalanceSheet />
            )}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Management</h2>
                <p className="text-gray-600">User management will be here</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
                <p className="text-gray-600">Settings will be here</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
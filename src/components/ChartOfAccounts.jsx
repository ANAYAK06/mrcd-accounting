import React, { useState, useEffect } from 'react';
import { getChartOfAccounts, addAccount, updateAccount, deleteAccount } from '../api/api';
import { Plus, Edit2, Trash2, Search, RefreshCw, CheckCircle, XCircle, Save, X, Calendar } from 'lucide-react';
import { showToast } from '../utils/toast';

function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'Asset',
    parent: '',
    openingBalance: 0,
    openingBalanceType: 'Debit',
    openingBalanceAsOnDate: new Date().toISOString().split('T')[0],
    isActive: true
  });

  const accountTypes = ['Asset', 'Liability', 'Income', 'Expense', 'Capital'];

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [accounts, searchTerm, filterType]);

  const loadAccounts = async () => {
    setLoading(true);
    const result = await getChartOfAccounts();
    if (result.success) {
      console.log('📊 Loaded accounts with new fields:', result.data[0]);
      setAccounts(result.data);
    } else {
      showToast('error', 'Failed to load accounts. Please refresh the page.');
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...accounts];

    if (filterType !== 'All') {
      filtered = filtered.filter(acc => acc.accountType === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(acc =>
        acc.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAccounts(filtered);
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditMode(true);
      setFormData({
        ...account,
        openingBalanceType: account.openingBalanceType || getDefaultBalanceType(account.accountType),
        openingBalanceAsOnDate: account.openingBalanceAsOnDate || new Date().toISOString().split('T')[0]
      });
    } else {
      setEditMode(false);
      setFormData({
        accountCode: '',
        accountName: '',
        accountType: 'Asset',
        parent: '',
        openingBalance: 0,
        openingBalanceType: 'Debit',
        openingBalanceAsOnDate: new Date().toISOString().split('T')[0],
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSubmitting(false);
    setFormData({
      accountCode: '',
      accountName: '',
      accountType: 'Asset',
      parent: '',
      openingBalance: 0,
      openingBalanceType: 'Debit',
      openingBalanceAsOnDate: new Date().toISOString().split('T')[0],
      isActive: true
    });
  };

  // Helper function to get default balance type based on account type
  const getDefaultBalanceType = (accountType) => {
    if (accountType === 'Asset' || accountType === 'Expense') {
      return 'Debit';
    }
    return 'Credit';
  };

  // Update balance type when account type changes
  const handleAccountTypeChange = (newAccountType) => {
    setFormData({
      ...formData,
      accountType: newAccountType,
      openingBalanceType: getDefaultBalanceType(newAccountType)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.accountCode.trim()) {
      showToast('error', 'Account code is required');
      return;
    }
    if (!formData.accountName.trim()) {
      showToast('error', 'Account name is required');
      return;
    }
    if (!formData.openingBalanceAsOnDate) {
      showToast('error', 'Opening balance date is required');
      return;
    }

    setSubmitting(true);
    console.log('💾 Submitting account data:', formData);

    let result;
    if (editMode) {
      result = await updateAccount(formData);
    } else {
      result = await addAccount(formData);
    }

    if (result.success) {
      showToast('success', `Account "${formData.accountName}" ${editMode ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        handleCloseModal();
        loadAccounts();
        setSubmitting(false);
      }, 1500);
    } else {
      showToast('error', result.error || `Failed to ${editMode ? 'update' : 'create'} account. Please try again.`);
      setSubmitting(false);
    }
  };

  const handleDelete = async (accountCode, accountName) => {
    if (window.confirm(`Are you sure you want to deactivate account "${accountName}"?`)) {
      const result = await deleteAccount(accountCode);
      if (result.success) {
        showToast('success', `Account "${accountName}" deactivated successfully!`);
        loadAccounts();
      } else {
        showToast('error', result.error || 'Failed to deactivate account. It may be in use.');
      }
    }
  };

  const getAccountTypeBadge = (type) => {
    const styles = {
      'Asset': 'bg-blue-100 text-blue-800',
      'Liability': 'bg-red-100 text-red-800',
      'Income': 'bg-green-100 text-green-800',
      'Expense': 'bg-orange-100 text-orange-800',
      'Capital': 'bg-purple-100 text-purple-800'
    };
    return styles[type] || 'bg-gray-100 text-gray-800';
  };

  const getBalanceTypeBadge = (type) => {
    return type === 'Debit' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getAccountsByType = (type) => {
    return filteredAccounts.filter(acc => acc.accountType === type);
  };

  const calculateTotalByType = (type) => {
    return getAccountsByType(type).reduce((sum, acc) => sum + (parseFloat(acc.openingBalance) || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Chart of Accounts</h2>
            <p className="text-sm opacity-90">Manage your accounting structure</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by code or name..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              {accountTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('All');
            }}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
          <button
            onClick={loadAccounts}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {accountTypes.map(type => {
          const count = getAccountsByType(type).length;
          const total = calculateTotalByType(type);
          return (
            <div key={type} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getAccountTypeBadge(type)}`}>
                  {type}
                </span>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
              <p className="text-xs text-gray-600">Opening Balance:</p>
              <p className="text-sm font-semibold text-gray-900">₹{total.toLocaleString('en-IN')}</p>
            </div>
          );
        })}
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No accounts found</p>
            <p className="text-gray-400 text-sm mt-2">Create your first account to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opening Balance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    As On Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.accountCode} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-gray-900">{account.accountCode}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{account.accountName}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getAccountTypeBadge(account.accountType)}`}>
                        {account.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{account.parent || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{parseFloat(account.openingBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getBalanceTypeBadge(account.openingBalanceType || 'Debit')}`}>
                        {account.openingBalanceType || 'Debit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-xs text-gray-600">
                        {account.openingBalanceAsOnDate 
                          ? new Date(account.openingBalanceAsOnDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '-'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {account.isActive ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                          <XCircle className="w-4 h-4" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(account)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(account.accountCode, account.accountName)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sticky top-0">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {editMode ? 'Edit Account' : 'Add New Account'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountCode}
                    onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                    disabled={editMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="e.g., 1100"
                    required
                  />
                </div>

                {/* Account Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Cash in Hand"
                    required
                  />
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => handleAccountTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {accountTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Parent Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Account (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1000"
                  />
                </div>

                {/* Opening Balance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Balance
                  </label>
                  <input
                    type="number"
                    value={formData.openingBalance}
                    onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    onFocus={(e) => e.target.value === '0' && e.target.select()}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                {/* Opening Balance Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Balance Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.openingBalanceType}
                    onChange={(e) => setFormData({ ...formData, openingBalanceType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Default for {formData.accountType}: {getDefaultBalanceType(formData.accountType)}
                  </p>
                </div>

                {/* Opening Balance As On Date */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Opening Balance As On Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.openingBalanceAsOnDate}
                    onChange={(e) => setFormData({ ...formData, openingBalanceAsOnDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usually the start of financial year (e.g., 01-04-2024)
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Account</span>
                  </label>
                </div>
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> The Opening Balance Type determines whether this balance appears on the Debit or Credit side of reports.
                  For exceptional cases like advance payments to suppliers (Liability account with Debit balance), you can override the default.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editMode ? 'Update' : 'Create'} Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartOfAccounts;
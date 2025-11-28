import React, { useState, useEffect } from 'react';
import { getChartOfAccounts, addVoucher, getNextVoucherNumber } from '../api/api';
import { Plus, Trash2, Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { showToast } from '../utils/toast';

function VoucherEntry({ voucherType = 'Payment' }) {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [voucherNo, setVoucherNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [narration, setNarration] = useState('');
  const [entries, setEntries] = useState([
    { accountCode: '', accountName: '', debit: '', credit: '' },
    { accountCode: '', accountName: '', debit: '', credit: '' }
  ]);

  // Load accounts and voucher number on mount
  useEffect(() => {
    loadAccounts();
    loadVoucherNumber();
  }, [voucherType]);

  const loadAccounts = async () => {
    const result = await getChartOfAccounts();
    console.log('Accounts loaded:', result);
    if (result.success) {
      setAccounts(result.data.filter(acc => acc.isActive));
    } else {
      showToast('error', 'Failed to load accounts. Please refresh the page.');
    }
  };

  const loadVoucherNumber = async () => {
    const result = await getNextVoucherNumber(voucherType);
    console.log('Voucher number:', result);
    if (result.success) {
      setVoucherNo(result.voucherNo);
    } else {
      showToast('error', 'Failed to load voucher number.');
    }
  };

  // Add new entry line
  const addEntry = () => {
    setEntries([...entries, { accountCode: '', accountName: '', debit: '', credit: '' }]);
  };

  // Remove entry line
  const removeEntry = (index) => {
    if (entries.length > 2) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

// Update entry field
const updateEntry = (index, field, value) => {
  setEntries(prevEntries => {
    const newEntries = [...prevEntries];
    
    if (field === 'accountCode') {
      // Trim the value to remove any whitespace
      const trimmedValue = value.trim();
      
      console.log('🔍 Looking for account code:', trimmedValue);
      console.log('📋 Available accounts:', accounts);
      
      // Try to find the account
      const account = accounts.find(acc => {
        console.log('Comparing:', acc.accountCode, 'with', trimmedValue);
        return String(acc.accountCode).trim() === trimmedValue;
      });
      
      console.log('✅ Found account:', account);
      
      if (account) {
        newEntries[index] = {
          ...newEntries[index],
          accountCode: trimmedValue,
          accountName: account.accountName || 'Name not available'
        };
      } else {
        // If not found, try to extract from the dropdown text
        newEntries[index] = {
          ...newEntries[index],
          accountCode: trimmedValue,
          accountName: 'Account not found'
        };
      }
    } else if (field === 'debit' || field === 'credit') {
      if (field === 'debit' && value) {
        newEntries[index] = {
          ...newEntries[index],
          debit: value,
          credit: ''
        };
      } else if (field === 'credit' && value) {
        newEntries[index] = {
          ...newEntries[index],
          credit: value,
          debit: ''
        };
      } else {
        newEntries[index] = {
          ...newEntries[index],
          [field]: value
        };
      }
    } else {
      newEntries[index] = {
        ...newEntries[index],
        [field]: value
      };
    }
    
    console.log('💾 Updated entries:', newEntries);
    return newEntries;
  });
};

  // Calculate totals
  const calculateTotals = () => {
    const totalDebit = entries.reduce((sum, entry) => sum + parseFloat(entry.debit || 0), 0);
    const totalCredit = entries.reduce((sum, entry) => sum + parseFloat(entry.credit || 0), 0);
    const difference = totalDebit - totalCredit;
    return { totalDebit, totalCredit, difference };
  };

  // Validate form
  const validateForm = () => {
    if (!voucherNo.trim()) {
      showToast('error', 'Voucher number is required');
      return false;
    }
    if (!date) {
      showToast('error', 'Date is required');
      return false;
    }
    if (!narration.trim()) {
      showToast('error', 'Narration is required');
      return false;
    }

    const validEntries = entries.filter(e => e.accountCode && (parseFloat(e.debit) > 0 || parseFloat(e.credit) > 0));
    if (validEntries.length < 2) {
      showToast('error', 'At least 2 entries are required');
      return false;
    }

    const totals = calculateTotals();
    if (Math.abs(totals.difference) > 0.01) {
      showToast('error', 'Debit and Credit must be equal!');
      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const validEntries = entries.filter(e => 
      e.accountCode && (parseFloat(e.debit) > 0 || parseFloat(e.credit) > 0)
    );

    const voucherData = {
      voucherType,
      voucherNo,
      date,
      narration,
      entries: validEntries
    };

    console.log('Submitting voucher:', voucherData);
    const result = await addVoucher(voucherData);
    console.log('Voucher result:', result);

    if (result.success) {
      showToast('success', `${voucherType} voucher ${result.voucherNo || voucherNo} submitted successfully!`);
      
      // Reset form after 1.5 seconds
      setTimeout(() => {
        resetForm();
      }, 1500);
    } else {
      showToast('error', result.error || 'Failed to save voucher. Please try again.');
    }

    setLoading(false);
  };

  // Reset form
  const resetForm = () => {
    setEntries([
      { accountCode: '', accountName: '', debit: '', credit: '' },
      { accountCode: '', accountName: '', debit: '', credit: '' }
    ]);
    setNarration('');
    setDate(new Date().toISOString().split('T')[0]);
    loadVoucherNumber();
  };

  const totals = calculateTotals();
  const isBalanced = Math.abs(totals.difference) < 0.01;

  // Get voucher type details with fixed classes
  const getVoucherTypeInfo = () => {
    switch(voucherType) {
      case 'Payment':
        return {
          title: 'Payment Voucher',
          description: 'Record money going out (expenses, asset purchases)',
          bgClass: 'bg-gradient-to-r from-red-500 to-red-600',
          icon: '💸'
        };
      case 'Receipt':
        return {
          title: 'Receipt Voucher',
          description: 'Record money coming in (income, donations)',
          bgClass: 'bg-gradient-to-r from-green-500 to-green-600',
          icon: '💰'
        };
      case 'Journal':
        return {
          title: 'Journal Voucher',
          description: 'Non-cash transactions (adjustments, depreciation)',
          bgClass: 'bg-gradient-to-r from-blue-500 to-blue-600',
          icon: '📝'
        };
      case 'Contra':
        return {
          title: 'Contra Voucher',
          description: 'Transfer between Cash and Bank',
          bgClass: 'bg-gradient-to-r from-purple-500 to-purple-600',
          icon: '🔄'
        };
      default:
        return {
          title: 'Voucher Entry',
          description: 'Create accounting voucher',
          bgClass: 'bg-gradient-to-r from-gray-500 to-gray-600',
          icon: '📄'
        };
    }
  };

  const typeInfo = getVoucherTypeInfo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${typeInfo.bgClass} rounded-xl p-6 text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{typeInfo.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{typeInfo.title}</h2>
            <p className="text-sm opacity-90">{typeInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Voucher Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md">
        {/* Voucher Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voucher No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voucher Type
              </label>
              <input
                type="text"
                value={voucherType}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Entries Table */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Entries</h3>
            <button
              type="button"
              onClick={addEntry}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>

          {accounts.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">Loading accounts... If accounts don't load, please add accounts in Chart of Accounts first.</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account <span className="text-red-500">*</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Debit (₹)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Credit (₹)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <select
                        value={entry.accountCode}
                        onChange={(e) => updateEntry(index, 'accountCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value="">Select Account</option>
                        {accounts.map(acc => (
                          <option key={acc.accountCode} value={acc.accountCode}>
                            {acc.accountCode} - {acc.accountName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={entry.accountName}
                        disabled
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={entry.debit}
                        onChange={(e) => updateEntry(index, 'debit', e.target.value)}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-right"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={entry.credit}
                        onChange={(e) => updateEntry(index, 'credit', e.target.value)}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-right"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entries.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeEntry(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr className="border-t-2 border-gray-300">
                  <td colSpan="2" className="px-4 py-3 text-right font-semibold text-gray-900">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    ₹{totals.totalDebit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    ₹{totals.totalCredit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isBalanced && totals.totalDebit > 0 ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Balanced
                      </span>
                    ) : totals.totalDebit > 0 || totals.totalCredit > 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Diff: ₹{Math.abs(totals.difference).toFixed(2)}
                      </span>
                    ) : null}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Narration */}
        <div className="px-6 pb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Narration / Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            rows="3"
            placeholder="Enter transaction details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </button>

          <button
            type="submit"
            disabled={loading || !isBalanced}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Voucher'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default VoucherEntry;
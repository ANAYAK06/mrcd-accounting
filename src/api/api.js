// Simple fetch - no axios, no CORS proxy, no JSONP
const API_URL = 'https://script.google.com/macros/s/AKfycbyDSET1ZBuADd6ayY3EPYO2Ua1mfAiVlOWGgYp322uXVbxtvvfgh-9SyZy51kc5lbDqnw/exec';

const getToken = () => localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

// ============================================
// AUTHENTICATION
// ============================================

export const login = async (email, password) => {
  try {
    console.log('🔐 Attempting login...');
    
    const url = `${API_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    
    console.log('📤 URL:', url);
    
    const res = await fetch(url);
    const data = await res.json();
    
    console.log('📥 Response:', data);
    
    if (data.success) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('✅ Login successful!');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Login error:', error);
    return { 
      success: false, 
      error: 'Unable to connect: ' + error.message
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getCurrentUser = () => {
  return getUser();
};

// ============================================
// CHART OF ACCOUNTS - UPDATED
// ============================================

export const getChartOfAccounts = async () => {
  try {
    const url = `${API_URL}?action=getChartOfAccounts&token=${getToken()}`;
    const res = await fetch(url);
    const data = await res.json();
    
    // Log to verify new fields are received
    if (data.success && data.data.length > 0) {
      console.log('📊 Chart of Accounts Sample:', data.data[0]);
    }
    
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addAccount = async (accountData) => {
  try {
    // Ensure new fields are included
    const payload = {
      action: 'addAccount',
      token: getToken(),
      accountCode: accountData.accountCode,
      accountName: accountData.accountName,
      accountType: accountData.accountType,
      parent: accountData.parent || '',
      openingBalance: parseFloat(accountData.openingBalance) || 0,
      openingBalanceType: accountData.openingBalanceType || 
        (accountData.accountType === 'Asset' || accountData.accountType === 'Expense' ? 'Debit' : 'Credit'),
      openingBalanceAsOnDate: accountData.openingBalanceAsOnDate || 
        new Date().toISOString().split('T')[0],
      isActive: accountData.isActive !== false
    };
    
    console.log('➕ Adding account:', payload);
    
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    
    console.log('📥 Add account response:', data);
    
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateAccount = async (accountData) => {
  try {
    // Ensure new fields are included
    const payload = {
      action: 'updateAccount',
      token: getToken(),
      accountCode: accountData.accountCode,
      accountName: accountData.accountName,
      accountType: accountData.accountType,
      parent: accountData.parent || '',
      openingBalance: parseFloat(accountData.openingBalance) || 0,
      openingBalanceType: accountData.openingBalanceType || 
        (accountData.accountType === 'Asset' || accountData.accountType === 'Expense' ? 'Debit' : 'Credit'),
      openingBalanceAsOnDate: accountData.openingBalanceAsOnDate || 
        new Date().toISOString().split('T')[0],
      isActive: accountData.isActive !== false
    };
    
    console.log('✏️ Updating account:', payload);
    
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    
    console.log('📥 Update account response:', data);
    
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteAccount = async (accountCode) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteAccount',
        token: getToken(),
        accountCode
      })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============================================
// VOUCHERS
// ============================================

export const getNextVoucherNumber = async (voucherType) => {
  try {
    const url = `${API_URL}?action=getNextVoucherNumber&token=${getToken()}&voucherType=${voucherType}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getVouchers = async () => {
  try {
    const url = `${API_URL}?action=getVouchers&token=${getToken()}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addVoucher = async (voucherData) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'addVoucher',
        token: getToken(),
        ...voucherData,
        createdBy: getUser().name
      })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteVoucher = async (voucherNo) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteVoucher',
        token: getToken(),
        voucherNo
      })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============================================
// REPORTS - UPDATED WITH LOGGING
// ============================================

export const getBalanceSheet = async (asOnDate) => {
  try {
    const url = `${API_URL}?action=getBalanceSheet&token=${getToken()}&asOnDate=${asOnDate || ''}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getIncomeExpenditure = async (fromDate, toDate) => {
  try {
    const url = `${API_URL}?action=getIncomeExpenditure&token=${getToken()}&fromDate=${fromDate || ''}&toDate=${toDate || ''}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getLedger = async (accountCode, fromDate, toDate) => {
  try {
    const url = `${API_URL}?action=getLedger&token=${getToken()}&accountCode=${accountCode}&fromDate=${fromDate || ''}&toDate=${toDate || ''}`;
    
    console.log('📊 Fetching ledger:', { accountCode, fromDate, toDate });
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.success) {
      console.log('📥 Ledger response:', {
        accountName: data.data.accountName,
        openingBalance: data.data.openingBalance,
        openingBalanceDate: data.data.openingBalanceDate,
        transactions: data.data.transactions?.length || 0
      });
    }
    
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getTrialBalance = async (asOnDate) => {
  try {
    const url = `${API_URL}?action=getTrialBalance&token=${getToken()}&asOnDate=${asOnDate || ''}`;
    
    console.log('⚖️ Fetching trial balance for:', asOnDate || 'today');
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.success) {
      console.log('📥 Trial Balance:', {
        accounts: data.data.accounts?.length || 0,
        totalDebit: data.data.totalDebit,
        totalCredit: data.data.totalCredit,
        isBalanced: data.data.isBalanced
      });
    }
    
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============================================
// USER MANAGEMENT
// ============================================

export const getUsers = async () => {
  try {
    const url = `${API_URL}?action=getUsers&token=${getToken()}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const addUser = async (userData) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'addUser',
        token: getToken(),
        ...userData
      })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUser = async (userData) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'updateUser',
        token: getToken(),
        ...userData
      })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (email) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'deleteUser',
        token: getToken(),
        email
      })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Users,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Wallet,
  BookOpen,
  FileSpreadsheet,
  DollarSign
} from 'lucide-react';
import mrcdLogo from '../assets/mrcd-logo.png';

function Sidebar({ isOpen, onToggle, activeTab, onTabChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & Summary'
    },
    {
      id: 'vouchers',
      label: 'Voucher Entry',
      icon: FileText,
      description: 'Create Vouchers',
      submenu: [
        { id: 'payment', label: 'Payment Voucher', icon: Wallet },
        { id: 'receipt', label: 'Receipt Voucher', icon: Receipt },
        { id: 'journal', label: 'Journal Voucher', icon: BookOpen },
        { id: 'contra', label: 'Contra Voucher', icon: DollarSign }
      ]
    },
    {
      id: 'voucher-list',
      label: 'View Vouchers',
      icon: FileSpreadsheet,
      description: 'All Transactions'
    },
    {
      id: 'accounts',
      label: 'Chart of Accounts',
      icon: BarChart3,
      description: 'Manage Accounts'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: TrendingUp,
      description: 'Financial Reports',
      submenu: [
        { id: 'ledger', label: 'Ledger' },
        { id: 'trial-balance', label: 'Trial Balance' },
        { id: 'income-expenditure', label: 'Income & Expenditure' },
        { id: 'balance-sheet', label: 'Balance Sheet' },
        { id: 'account-wise-monthly', label: 'Account-wise Monthly' }
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage Users'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'System Settings'
    }
  ];

  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (itemId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleMenuClick = (itemId) => {
    onTabChange(itemId);
    
    // Close mobile sidebar after selection
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-20'}
        `}
        style={{ top: '64px' }} // Offset for navbar height
      >
        <div className="flex flex-col h-full">
          {/* Expand/Collapse Button - Desktop Only */}
          <div className="hidden lg:flex items-center justify-end p-3 border-b border-gray-100">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuExpanded = expandedMenus[item.id];

              return (
                <div key={item.id}>
                  {/* Main Menu Item */}
                  <button
                    onClick={() => {
                      if (hasSubmenu) {
                        toggleSubmenu(item.id);
                      } else {
                        handleMenuClick(item.id);
                      }
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-green-50 text-green-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      ${!isExpanded ? 'justify-center' : ''}
                    `}
                    title={!isExpanded ? item.label : ''}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                    
                    {isExpanded && (
                      <>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500">{item.description}</p>
                          )}
                        </div>
                        
                        {hasSubmenu && (
                          <ChevronRight 
                            className={`w-4 h-4 transition-transform ${
                              isSubmenuExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        )}
                      </>
                    )}
                  </button>

                  {/* Submenu Items */}
                  {hasSubmenu && isExpanded && isSubmenuExpanded && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = activeTab === subItem.id;

                        return (
                          <button
                            key={subItem.id}
                            onClick={() => handleMenuClick(subItem.id)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-lg
                              text-sm transition-colors
                              ${isSubActive
                                ? 'bg-green-50 text-green-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                              }
                            `}
                          >
                            {SubIcon && <SubIcon className="w-4 h-4" />}
                            <span>{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer - Organization Info */}
          {isExpanded && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2 border border-gray-200">
                  <img src={mrcdLogo} alt="MRCD" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">MRCD</p>
                  <p className="text-xs text-gray-600">Version 1.0</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                NGO Accounting System
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
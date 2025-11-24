import React, { useState } from 'react';
import { getCurrentUser, logout } from '../api/api';
import { Menu, X, LogOut, User, Settings, Bell } from 'lucide-react';
import mrcdLogo from '../assets/mrcd-logo.png';
import appLogo from '../assets/logo.png';

function Navbar({ onMenuClick, isSidebarOpen }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const user = getCurrentUser();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.reload();
    }
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate color based on name
  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-500';
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Menu Button and Branding */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Logo and App Name */}
            <div className="flex items-center gap-3">
              {/* App Logo */}
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 border border-gray-200">
                <img src={appLogo} alt="NGO Accounts" className="w-full h-full object-contain" />
              </div>
              
              {/* App Name */}
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  NGO Accounts
                </h1>
                <p className="text-xs text-gray-500 leading-tight">
                  Accounting System
                </p>
              </div>
            </div>
          </div>

          {/* Center Section - Organization Info */}
          <div className="hidden md:flex items-center gap-3">
            {/* MRCD Logo */}
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2 border border-gray-200">
              <img src={mrcdLogo} alt="MRCD" className="w-full h-full object-contain" />
            </div>
            
            {/* Organization Name */}
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                MRCD
              </p>
              <p className="text-xs text-gray-600 leading-tight">
                Malabar Rehabilitation Center for Differently Abled
              </p>
            </div>
          </div>

          {/* Right Section - Notifications and User Menu */}
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {/* Notification Badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* User Avatar */}
                <div className={`w-9 h-9 ${getAvatarColor(user.name)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                  {getInitials(user.name)}
                </div>
                
                {/* User Name (Hidden on mobile) */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600 leading-tight">
                    {user.role || 'User'}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  ></div>

                  {/* Menu Content */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 py-2 z-20">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {user.email || 'user@example.com'}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-green-50 text-green-700 rounded">
                        {user.role || 'User'}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Add profile navigation here
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Add settings navigation here
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
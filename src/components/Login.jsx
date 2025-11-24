import React, { useState } from 'react';
import { login } from '../api/api';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import appLogo from '../assets/logo.png';
import mrcdLogo from '../assets/mrcd-logo.png';


function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      onLogin();
    } else {
      setError(result.error || 'Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Side - Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center">

              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Log In
              </h1>
              <p className="text-gray-600 text-sm">
                Welcome back to your account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-gray-700">Remember me</span>
                </label>
                <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Having trouble? Contact{' '}
              <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                IT Support
              </button>
            </div>

          </div>
        </div>

        {/* Right Side - Professional Branding */}
        <div className="hidden lg:flex bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">

          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-40 h-40 bg-white opacity-5 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white opacity-5 rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-24 h-24 bg-white opacity-5 rounded-full"></div>

          <div className="relative z-10 text-center max-w-md">

            {/* App Logo and Name */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white mb-6 shadow-2xl p-1 rounded-full">
            <img src={appLogo} alt="NGO Accounts" className="w-full h-full object-contain rounded-full" />
              </div>
              <h2 className="text-4xl font-bold mb-2 tracking-tight">
                NGO Accounts
              </h2>
              <p className="text-lg text-green-100 font-medium">
                Professional Accounting System
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-1 bg-white bg-opacity-30 mx-auto my-8 rounded-full"></div>

            {/* MRCD Branding */}
            <div className="mb-8">
              <p className="text-sm text-green-100 mb-4 font-medium uppercase tracking-wider">
                Developed For
              </p>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-xl p-3">
                <img src={mrcdLogo} alt="MRCD" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                MRCD
              </h3>
              <p className="text-base text-green-100 leading-relaxed">
                Malabar Rehabilitation Center<br />
                for Differently Abled
              </p>
            </div>

            {/* Professional Tagline */}
            <div className="mt-12 p-6 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl border border-white border-opacity-20 shadow-lg">
              <p className="text-sm text-green-50 leading-relaxed">
                Streamlined financial management and accounting solutions designed specifically for non-profit organizations.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
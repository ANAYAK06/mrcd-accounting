import React, { useState } from 'react';
import { login } from '../api/api';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Users, Award, TrendingUp } from 'lucide-react';

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
                <p  className="text-green-600 hover:text-green-700 font-medium">
                  Forgot password?
                </p>
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
              <p  className="text-green-600 hover:text-green-700 font-medium">
                IT Support
              </p>
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-10 flex-col justify-center text-white relative overflow-hidden">

          <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white opacity-10 rounded-full"></div>

          <div className="relative z-10">

            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-6 border-4 border-white border-opacity-30 shadow-xl">
              <span className="text-3xl font-bold">M</span>
            </div>

            <h2 className="text-4xl font-bold mb-3">
              MRCD
            </h2>
            <p className="text-lg mb-1 text-green-100">
              Malabar Rehabilitation Center
            </p>
            <p className="text-base text-green-100 mb-8">
              for Differently Abled
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-2 shadow-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-green-100">Beneficiaries</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-2 shadow-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-xs text-green-100">Staff Members</div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mb-2 shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold">99%</div>
                <div className="text-xs text-green-100">Success Rate</div>
              </div>
            </div>

            <div classname="mt-10 p-5 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl border border-white border-opacity-20 shadow-lg">
              <p className="text-sm text-green-50 italic leading-relaxed">
                "Empowering lives, building futures. Join us in making a difference in the lives of differently-abled individuals."
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;

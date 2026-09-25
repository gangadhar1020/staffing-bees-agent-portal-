import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { StaffingBeesLogo } from './HoneyBeeLogo';

interface AgentLoginPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const AgentLoginPage: React.FC<AgentLoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState('agent@staffingbees.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen w-screen bg-[#f8fafc] text-gray-900 flex flex-col justify-between font-sans select-none p-4 sm:p-6">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors cursor-pointer font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="cursor-pointer" onClick={onBackToLanding}>
          <StaffingBeesLogo size="lg" theme="light" showIcon={true} />
        </div>

        <div className="w-16" />
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200/80 p-8 sm:p-10">
          {/* Logo & Headings */}
          <div className="text-center mb-7">
            <div className="flex justify-center mb-3">
              <StaffingBeesLogo size="xl" theme="light" showIcon={true} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1.5">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Login to continue your StaffingBees Agent journey.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Agent Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@staffingbees.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition-all bg-gray-50/50 focus:bg-white text-gray-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotMsg(true)}
                  className="text-[11px] text-[#1d4ed8] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-lg outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition-all bg-gray-50/50 focus:bg-white text-gray-800"
                />
              </div>
            </div>

            {showForgotMsg && (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Demo mode: Use default pre-filled credentials to sign in.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center space-x-1.5"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-500">
              Demo Credentials: <span className="font-semibold text-gray-700">agent@staffingbees.com</span>
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-gray-400 py-2">
        © 2026 StaffingBees Inc. All rights reserved.
      </footer>
    </div>
  );
};

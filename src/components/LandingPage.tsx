import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, X } from 'lucide-react';
import { StaffingBeesLogo } from './HoneyBeeLogo';

interface LandingPageProps {
  onOpenLogin: () => void;
  onExploreJobs?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onExploreJobs,
}) => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);

  const handleQuickAction = (text: string) => {
    setQuery(text);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setSubmittedQuery(query.trim());
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white text-gray-900 flex flex-col justify-between font-sans select-none overflow-x-hidden">
      {/* Top Header with high z-index to guarantee clickability above main container */}
      <header className="w-full px-8 sm:px-12 py-6 flex items-center justify-between relative z-30">
        {/* Top-Left: StaffingBees Logo */}
        <div className="flex items-center cursor-pointer">
          <StaffingBeesLogo size="xl" theme="light" showIcon={false} />
        </div>

        {/* Top-Right: Agent Login Button */}
        <div className="relative z-30">
          <button
            type="button"
            id="agent-login-btn"
            data-testid="agent-login-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenLogin();
            }}
            className="px-4 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-2xs cursor-pointer select-none"
          >
            Agent Login
          </button>
        </div>
      </header>

      {/* Main Center Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-2xl flex flex-col items-center text-center">
          {/* Main Heading matching screenshot */}
          <h1 className="text-xl sm:text-2xl md:text-[25px] font-bold text-[#111827] tracking-tight leading-snug mb-7 max-w-xl">
            Hi, Tell us what you are looking for, we will connect to the right person
          </h1>

          {/* Large Search Box */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[580px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-200/90 flex items-center pl-6 pr-2.5 py-2.5 transition-all focus-within:shadow-[0_4px_30px_rgba(0,0,0,0.1)] focus-within:border-gray-300"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="I'm looking for a Java Developer job in Dallas..."
              className="w-full text-gray-800 placeholder-gray-400 text-sm outline-none bg-transparent pr-3"
            />

            <div className="flex items-center space-x-1.5 shrink-0">
              {/* Subtle inner icon button */}
              <button
                type="button"
                onClick={() => setQuery("I'm looking for a Senior React Developer in Austin")}
                title="AI Prompt Assistant"
                className="w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              {/* Dark circular submit button with right arrow */}
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-[#111827] hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Quick-action buttons below input */}
          <div className="mt-4 flex items-center justify-center flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickAction("I'm looking for a job")}
              className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-700 font-normal transition-colors cursor-pointer shadow-2xs"
            >
              I'm looking for a job
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction("I need help with my resume")}
              className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-700 font-normal transition-colors cursor-pointer shadow-2xs"
            >
              Resume help
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction("I need interview preparation help")}
              className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-700 font-normal transition-colors cursor-pointer shadow-2xs"
            >
              Interview help
            </button>
          </div>
        </div>
      </main>

      {/* Subtle bottom buffer */}
      <footer className="h-10" />

      {/* Feedback Modal / Submission Response */}
      {submittedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Request Received!
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Got it! We'll connect you with the right StaffingBees team for:{' '}
              <span className="font-semibold text-gray-800">"{submittedQuery}"</span>
            </p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setSubmittedQuery(null);
                  onOpenLogin();
                }}
                className="w-full py-2 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Continue to Agent Portal (Agent Login)
              </button>
              <button
                onClick={() => setSubmittedQuery(null)}
                className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

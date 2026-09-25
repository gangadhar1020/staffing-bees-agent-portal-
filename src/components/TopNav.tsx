import React, { useState } from 'react';
import {
  Users,
  Inbox,
  CheckSquare,
  Calendar,
  Tag,
  BarChart2,
  Wrench,
  Search,
  MessageSquare,
  Phone,
  Zap,
  UserPlus,
  Bell,
  Grid,
  LogOut,
} from 'lucide-react';
import { StaffingBeesLogo } from './HoneyBeeLogo';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeNav: string;
  onNavClick: (nav: string) => void;
  onLogout?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchQuery,
  onSearchChange,
  activeNav,
  onNavClick,
  onLogout,
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'jobs/candidates', label: 'Jobs/Candidates', icon: Users },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    // { id: 'calendar', label: 'Calendar', icon: Calendar },
    // { id: 'deals', label: 'Deals', icon: Tag },
    // { id: 'reporting', label: 'Reporting', icon: BarChart2 },
    // { id: 'admin', label: 'Admin', icon: Wrench },
  ];

  return (
    <header className="bg-[#0f172a] text-gray-300 h-12 flex items-center justify-between px-3 text-xs select-none border-b border-[#1e293b] z-30 shrink-0">
      {/* Left side: Logo & Navigation */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 h-full">
        {/* Staffing Bees Honey Bee Logo */}
        <div
          onClick={onLogout}
          title="Return to Landing Page"
          className="flex items-center mr-1 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <StaffingBeesLogo size="md" />
        </div>

        {/* Navigation items */}
        <nav className="flex items-center h-full space-x-0.5 sm:space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav.toLowerCase() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavClick(item.label)}
                className={`relative flex items-center space-x-1.5 h-full px-2.5 transition-colors cursor-pointer text-xs ${
                  isActive
                    ? 'text-white font-semibold bg-[#1e293b]'
                    : 'text-gray-300 hover:text-white hover:bg-[#1e293b]/60 font-normal'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-[#FBBF24]' : 'text-gray-400'
                  }`}
                />
                <span>{item.label}</span>
                {/* Active arrow indicator pointing up at the bottom edge */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Middle: Search Box */}
      <div className="flex-1 max-w-[280px] mx-4 hidden lg:block">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search candidates or jobs..."
            className="w-full bg-[#1e293b] text-gray-200 placeholder-gray-400 pl-8 pr-3 py-1.5 rounded-full text-xs outline-none focus:ring-1 focus:ring-[#1d4ed8] focus:bg-[#0f172a] shadow-inner"
          />
        </div>
      </div>

      {/* Right side: Circular Action Icons & Profile */}
      <div className="flex items-center space-x-2 relative">
        {/* Cyan text/chat bubble */}
        {/* <button
          title="Texting"
          className="w-7 h-7 rounded-full bg-[#17a2b8] hover:opacity-90 flex items-center justify-center text-white transition-opacity cursor-pointer shadow-sm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button> */}

        {/* Green phone dialer */}
        {/* <button
          title="Dialer"
          className="w-7 h-7 rounded-full bg-[#28a745] hover:opacity-90 flex items-center justify-center text-white transition-opacity cursor-pointer shadow-sm"
        >
          <Phone className="w-3.5 h-3.5" />
        </button> */}

        {/* Purple lightning/automations */}
        {/* <button
          title="Action Plans & Automations"
          className="w-7 h-7 rounded-full bg-[#6f42c1] hover:opacity-90 flex items-center justify-center text-white transition-opacity cursor-pointer shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
        </button> */}

        {/* Blue add contact */}
        {/* <button
          title="Add Person"
          className="w-7 h-7 rounded-full bg-[#1d4ed8] hover:opacity-90 flex items-center justify-center text-white transition-opacity cursor-pointer shadow-sm"
        >
          <UserPlus className="w-3.5 h-3.5" />
        </button> */}

        {/* Bell notification */}
        <button
          title="Notifications"
          onClick={() => setShowNotification(!showNotification)}
          className="w-7 h-7 rounded-full hover:bg-[#34404e] flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* 3x3 App Launcher */}
        {/* <button
          title="Integrations & Apps"
          className="w-7 h-7 rounded-full hover:bg-[#34404e] flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
        >
          <Grid className="w-4 h-4" />
        </button> */}

        {/* Orange Profile Avatar "SP" with dropdown for Logout */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Agent Profile (SP)"
            className="w-7 h-7 rounded-full bg-[#d35400] text-white flex items-center justify-center font-semibold text-xs cursor-pointer hover:ring-2 hover:ring-[#FBBF24] ml-1 transition-all"
          >
            SP
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1.5 z-50 border border-gray-200 text-xs">
              <div className="px-3.5 py-2 border-b border-gray-100">
                <p className="font-semibold text-gray-900">StaffingBees Agent</p>
                <p className="text-[11px] text-gray-500">agent@staffingbees.com</p>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavClick('Tasks');
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center space-x-2"
              >
                <CheckSquare className="w-3.5 h-3.5 text-gray-400" />
                <span>Certification Tasks</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  if (onLogout) onLogout();
                }}
                className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2 border-t border-gray-100 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out to Landing</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

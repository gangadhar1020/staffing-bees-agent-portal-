/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AgentLoginPage } from './components/AgentLoginPage';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { ActionToolbar } from './components/ActionToolbar';
import { PeopleTable } from './components/PeopleTable';
import { ColumnsModal } from './components/ColumnsModal';
import { FilterModal } from './components/FilterModal';
import { SmartListsModal } from './components/SmartListsModal';
import { InboxSidebar } from './components/InboxSidebar';
import { InboxView } from './components/InboxView';
import { VideoModal } from './components/VideoModal';
import { TasksView } from './components/TasksView';
import { TaskDetailModal } from './components/TaskDetailModal';
import { HowTasksWorkModal } from './components/HowTasksWorkModal';
import { CandidateProfileView } from './components/CandidateProfileView';
import {
  Candidate,
  JobId,
  InboxFolder,
  Conversation,
  CertificationModule,
  CertificationTask,
} from './types';
import { DEMO_CANDIDATES } from './data/mockCandidates';
import { SAMPLE_CONVERSATIONS } from './data/mockConversations';
import { INITIAL_MODULES, INITIAL_TASKS } from './data/certificationData';
import { Calendar, Tag, BarChart2, Wrench, ArrowRight } from 'lucide-react';

export default function App() {
  // Screen state: 'landing' (entry point) | 'login' | 'portal'
  const [screenState, setScreenState] = useState<'landing' | 'login' | 'portal'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') return 'login';
      if (hash === '#portal') return 'portal';
    }
    return 'landing';
  });

  const navigateTo = (state: 'landing' | 'login' | 'portal') => {
    setScreenState(state);
    try {
      if (typeof window !== 'undefined') {
        if (state === 'landing') {
          if (window.location.hash) {
            window.location.hash = '';
          }
        } else {
          window.location.hash = state;
        }
      }
    } catch {
      // Safe fallback if iframe sandboxing restricts location/hash modification
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login') setScreenState('login');
      else if (hash === '#portal') setScreenState('portal');
      else setScreenState('landing');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Agent Portal initial landing tab: 'Jobs/Candidates' as required
  const [activeNav, setActiveNav] = useState('Jobs/Candidates');
  const [selectedJobId, setSelectedJobId] = useState<JobId>('frontend');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ================= TASKS & CERTIFICATION STATE =================
  const [modules, setModules] = useState<CertificationModule[]>(INITIAL_MODULES);
  const [tasks, setTasks] = useState<CertificationTask[]>(INITIAL_TASKS);
  const [activeCertNumber, setActiveCertNumber] = useState<number>(1);
  const [activeTaskDetail, setActiveTaskDetail] = useState<CertificationTask | null>(null);
  const [isHowTasksWorkOpen, setIsHowTasksWorkOpen] = useState(false);

  // ================= INBOX STATE =================
  const [selectedInboxFolder, setSelectedInboxFolder] = useState<InboxFolder>('inbox');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [hasDemoConversations, setHasDemoConversations] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // ================= CANDIDATES / JOBS STATE =================
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>({
    name: true,
    phone: true,
    email: true,
    created: true,
    stage: true,
    source: true,
    lastActivity: true,
  });
  const [filters, setFilters] = useState<any[]>([]);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set());

  // Candidates database map & Active Profile Candidate ID
  const [candidatesMap, setCandidatesMap] = useState<Record<string, Candidate[]>>(DEMO_CANDIDATES);
  const [activeProfileCandidateId, setActiveProfileCandidateId] = useState<string | null>(null);

  // Raw candidates based on selected job role
  const rawCandidates: Candidate[] = useMemo(() => {
    if (selectedJobId === 'all-jobs') {
      return Object.values(candidatesMap).flat();
    }
    return candidatesMap[selectedJobId] || [];
  }, [selectedJobId, candidatesMap]);

  // Find active profile candidate
  const activeProfileCandidate: Candidate | undefined = useMemo(() => {
    if (!activeProfileCandidateId) return undefined;
    for (const jobList of Object.values(candidatesMap)) {
      const found = jobList.find((c) => c.id === activeProfileCandidateId);
      if (found) return found;
    }
    return undefined;
  }, [activeProfileCandidateId, candidatesMap]);

  // Update candidate record handler (e.g. reassign agent, add note, change stage)
  const handleUpdateCandidate = (updated: Candidate) => {
    setCandidatesMap((prev) => {
      const next: Record<string, Candidate[]> = {};
      for (const [key, list] of Object.entries(prev)) {
        next[key] = list.map((c) => (c.id === updated.id ? updated : c));
      }
      return next;
    });
  };

  // Filtered & searched candidates
  const candidates: Candidate[] = useMemo(() => {
    let list = rawCandidates;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.stage.toLowerCase().includes(q) ||
          c.source.toLowerCase().includes(q)
      );
    }

    if (filters.length > 0) {
      list = list.filter((c) => {
        return filters.every((rule) => {
          const val = (c as any)[rule.field.toLowerCase()] || '';
          if (rule.condition === 'is') return val.toLowerCase() === rule.value.toLowerCase();
          if (rule.condition === 'is not') return val.toLowerCase() !== rule.value.toLowerCase();
          if (rule.condition === 'contains') return val.toLowerCase().includes(rule.value.toLowerCase());
          return true;
        });
      });
    }

    return list.map((c) => ({
      ...c,
      selected: selectedCandidateIds.has(c.id),
    }));
  }, [rawCandidates, searchQuery, filters, selectedCandidateIds]);

  // ================= TASK COMPLETION & UNLOCK LOGIC =================
  const handleCompleteTask = (taskId: string, submission: string, passed?: boolean) => {
    const updatedTasks = tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: 'completed' as const,
            submission: submission || t.submission,
          }
        : t
    );
    setTasks(updatedTasks);

    const taskObj = tasks.find((t) => t.id === taskId);
    if (!taskObj) return;

    const certNum = taskObj.certNumber;
    const certTasks = updatedTasks.filter((t) => t.certNumber === certNum);
    const mandatoryTasks = certTasks.filter((t) => !t.isAssessment);
    const allMandatoryDone = mandatoryTasks.every((t) => t.status === 'completed');
    const assessmentTask = certTasks.find((t) => t.isAssessment);
    const assessmentPassed = assessmentTask ? assessmentTask.status === 'completed' : true;

    setModules((prevModules) =>
      prevModules.map((m) => {
        if (m.number === certNum) {
          if (allMandatoryDone && assessmentPassed) {
            return { ...m, status: 'completed' };
          }
          if (allMandatoryDone && !assessmentPassed) {
            return { ...m, status: 'assessment_pending' };
          }
          return { ...m, status: 'in_progress' };
        }

        // Sequential Unlock: If previous cert is now completed, unlock this one!
        if (m.number === certNum + 1 && allMandatoryDone && assessmentPassed) {
          if (m.status === 'locked') {
            return { ...m, status: 'in_progress' };
          }
        }

        return m;
      })
    );
  };

  const handleToggleTaskComplete = (taskId: string) => {
    const taskObj = tasks.find((t) => t.id === taskId);
    if (!taskObj) return;

    if (taskObj.status === 'completed') {
      const updatedTasks = tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'pending' as const } : t
      );
      setTasks(updatedTasks);
      setModules((prevModules) =>
        prevModules.map((m) =>
          m.number === taskObj.certNumber
            ? { ...m, status: 'in_progress' }
            : m
        )
      );
    } else {
      handleCompleteTask(taskId, taskObj.submission || 'Completed', true);
    }
  };

  // Jobs Actions
  const handleUpdateList = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 600);
  };

  const handleToggleSelectAll = () => {
    if (candidates.length === 0) return;
    const allSelected = candidates.every((c) => c.selected);
    if (allSelected) {
      setSelectedCandidateIds(new Set());
    } else {
      setSelectedCandidateIds(new Set(candidates.map((c) => c.id)));
    }
  };

  const handleToggleSelectCandidate = (id: string) => {
    setSelectedCandidateIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleResetColumns = () => {
    setVisibleColumns({
      name: true,
      phone: true,
      email: true,
      created: true,
      stage: true,
      source: true,
      lastActivity: true,
    });
  };

  // Inbox Actions
  const handleToggleDemoData = () => {
    if (hasDemoConversations) {
      setConversations([]);
      setSelectedConversation(null);
      setHasDemoConversations(false);
    } else {
      setConversations(SAMPLE_CONVERSATIONS);
      setHasDemoConversations(true);
    }
  };

  const handleSendMessage = (convId: string, text: string) => {
    const newMsg = {
      id: Date.now().toString(),
      sender: 'Staffing Bees Recruiter',
      text,
      timestamp: 'Just now',
      isRecruiter: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const updated = {
            ...c,
            lastMessage: text,
            timestamp: 'Just now',
            messages: [...c.messages, newMsg],
          };
          if (selectedConversation?.id === convId) {
            setSelectedConversation(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  const selectedCount = candidates.filter((c) => c.selected).length;
  const unreadConversationsCount = conversations.filter((c) => c.unread).length;

  // ========================================================
  // RENDER: SCREEN 1 — PUBLIC LANDING SCREEN
  // ========================================================
  if (screenState === 'landing') {
    return (
      <LandingPage
        onOpenLogin={() => navigateTo('login')}
        onExploreJobs={() => {
          setActiveNav('Jobs/Candidates');
          navigateTo('portal');
        }}
      />
    );
  }

  // ========================================================
  // RENDER: SCREEN 2 — AGENT LOGIN SCREEN
  // ========================================================
  if (screenState === 'login') {
    return (
      <AgentLoginPage
        onLoginSuccess={() => {
          setActiveNav('Jobs/Candidates');
          navigateTo('portal');
        }}
        onBackToLanding={() => navigateTo('landing')}
      />
    );
  }

  // ========================================================
  // RENDER: SCREEN 3 — AGENT PORTAL
  // ========================================================
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#ebedf0] font-sans antialiased text-gray-800">
      {/* 1. Top Navigation Bar (Jobs/Candidates, Inbox, Tasks, Calendar, Deals, Reporting, Admin) */}
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNav={activeNav}
        onNavClick={setActiveNav}
        onLogout={() => navigateTo('landing')}
      />

      {/* Main Area: Render based on Active Top Nav Tab */}
      {activeNav.toLowerCase() === 'tasks' ? (
        /* =================== SCREEN: TASKS =================== */
        <TasksView
          modules={modules}
          tasks={tasks}
          activeCertNumber={activeCertNumber}
          onSelectCert={setActiveCertNumber}
          onOpenTaskDetail={setActiveTaskDetail}
          onToggleTaskComplete={handleToggleTaskComplete}
          onOpenHowTasksWork={() => setIsHowTasksWorkOpen(true)}
        />
      ) : activeNav.toLowerCase() === 'inbox' ? (
        /* =================== SCREEN: INBOX =================== */
        <div className="flex-1 flex overflow-hidden min-w-[900px]">
          {/* Left Inbox Sidebar */}
          <InboxSidebar
            selectedFolder={selectedInboxFolder}
            onSelectFolder={(folder) => {
              setSelectedInboxFolder(folder);
              setSelectedConversation(null);
            }}
            unreadCount={unreadConversationsCount}
          />

          {/* Middle List & Right Onboarding/Conversation Area */}
          <InboxView
            selectedFolder={selectedInboxFolder}
            conversations={conversations}
            onOpenVideoModal={() => setIsVideoModalOpen(true)}
            onSelectConversation={setSelectedConversation}
            selectedConversation={selectedConversation}
            onSendMessage={handleSendMessage}
            onToggleDemoData={handleToggleDemoData}
            hasDemoData={hasDemoConversations}
          />
        </div>
      ) : activeNav.toLowerCase() === 'jobs/candidates' ? (
        /* =================== SCREEN: JOBS/CANDIDATES =================== */
        activeProfileCandidateId && activeProfileCandidate ? (
          <CandidateProfileView
            candidate={activeProfileCandidate}
            onBack={() => setActiveProfileCandidateId(null)}
            onUpdateCandidate={handleUpdateCandidate}
          />
        ) : (
          <div className="flex-1 flex overflow-hidden min-w-[900px]">
            {/* Left Sidebar */}
            <Sidebar
              selectedJobId={selectedJobId}
              onSelectJob={(id) => {
                setSelectedJobId(id);
                setSelectedCandidateIds(new Set());
              }}
              collapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            {/* Main Content Container */}
            <main className="flex-1 flex flex-col overflow-y-auto bg-[#ebedf0]">
              <ActionToolbar
                selectedCount={selectedCount}
                totalCount={candidates.length}
                activeListName="Pipelined Candidates"
                onUpdateList={handleUpdateList}
                isUpdating={isUpdating}
                onOpenColumns={() => setIsColumnsModalOpen(true)}
                onOpenFilters={() => setIsFiltersModalOpen(true)}
                onOpenHelp={() => setIsHelpModalOpen(true)}
                activeFilterCount={filters.length}
              />

              <PeopleTable
                candidates={candidates}
                onToggleSelectAll={handleToggleSelectAll}
                onToggleSelectCandidate={handleToggleSelectCandidate}
                onSelectCandidate={(cand) => setActiveProfileCandidateId(cand.id)}
                allSelected={candidates.length > 0 && candidates.every((c) => c.selected)}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                visibleColumns={visibleColumns}
              />
            </main>
          </div>
        )
      ) : (
        /* =================== PLACEHOLDER PANELS: CALENDAR, DEALS, REPORTING, ADMIN =================== */
        <div className="flex-1 p-8 bg-[#ebedf0] flex flex-col items-center justify-center select-none text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 max-w-lg w-full flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1d4ed8] flex items-center justify-center mb-4">
              {activeNav.toLowerCase() === 'calendar' ? (
                <Calendar className="w-7 h-7" />
              ) : activeNav.toLowerCase() === 'deals' ? (
                <Tag className="w-7 h-7" />
              ) : activeNav.toLowerCase() === 'reporting' ? (
                <BarChart2 className="w-7 h-7" />
              ) : (
                <Wrench className="w-7 h-7" />
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">
              StaffingBees {activeNav}
            </h2>
            <p className="text-xs text-gray-500 mb-6 max-w-sm leading-relaxed">
              Manage your staffing activities, interview schedules, client commissions, and pipeline performance metrics in the StaffingBees Agent Portal.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveNav('Tasks')}
                className="px-4 py-2 bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-sm flex items-center space-x-1.5"
              >
                <span>Go to Certification Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveNav('Jobs/Candidates')}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                View Candidates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={activeTaskDetail}
        isOpen={!!activeTaskDetail}
        onClose={() => setActiveTaskDetail(null)}
        onCompleteTask={handleCompleteTask}
      />

      {/* How Tasks Work Modal */}
      <HowTasksWorkModal
        isOpen={isHowTasksWorkOpen}
        onClose={() => setIsHowTasksWorkOpen(false)}
      />

      {/* Video / Walkthrough Modal for Inbox */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Modals & Popovers for Jobs view */}
      <ColumnsModal
        isOpen={isColumnsModalOpen}
        onClose={() => setIsColumnsModalOpen(false)}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
        onResetColumns={handleResetColumns}
      />

      <FilterModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onClearFilters={() => setFilters([])}
      />

      <SmartListsModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}

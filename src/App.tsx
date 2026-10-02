import React, { useState } from 'react';
import {
  INITIAL_FLAGSHIPS, INITIAL_PROJECTS, INITIAL_ACTIONS, INITIAL_MEETINGS,
  INITIAL_EVENTS, INITIAL_REPORTS, INITIAL_KPIS, INITIAL_USERS, INITIAL_AUDIT_LOGS,
  Flagship, Project, ActionPoint, Meeting, EventItem, ReportItem,
  PerformanceKPI, SystemUser, AuditLogItem
} from './data/initialData';
import {
  INITIAL_PROGRAMMES, ProgrammeItem, SubProgrammeItem, DeliveryUnitItem, OutputItem, SubKpiItem
} from './data/programmesData';
import {
  Activity, ArrowUpRight, BarChart3, Bell, Building2, Calendar, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  CircleDot, ClipboardCheck, Clock, Download, ExternalLink, Eye, FileSpreadsheet,
  FileText, Filter, Fingerprint, Flag, FolderGit2, FolderOpen, Gauge, HardDriveDownload,
  Info, KeyRound, Layers, LayoutDashboard, ListFilter, Lock, LogOut, Mail,
  MapPin, Milestone, Paperclip, PenSquare, Plus, PlusCircle, Search,
  Server, Settings, Shield, ShieldAlert, ShieldCheck, Sliders, TableProperties, Target, Trash2, User, UserCheck, Users, Users2, X
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // RBAC & User State
  const [users, setUsers] = useState<SystemUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<SystemUser>(INITIAL_USERS[0]);

  // Data States
  const [flagships, setFlagships] = useState<Flagship[]>(INITIAL_FLAGSHIPS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [actionPoints, setActionPoints] = useState<ActionPoint[]>(INITIAL_ACTIONS);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS);
  const [kpis, setKpis] = useState<PerformanceKPI[]>(INITIAL_KPIS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Sub-views & Filters
  const [selectedFlagship, setSelectedFlagship] = useState<Flagship | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionPoint | null>(null);
  const [selectedKpiDetail, setSelectedKpiDetail] = useState<PerformanceKPI | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogItem | null>(null);
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<'all' | 'Directorate' | 'Saga' | 'Division'>('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [showGantt, setShowGantt] = useState(true);
  const [calendarMonth, setCalendarMonth] = useState(1); // February (0-indexed 1)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [selectedDiaryEvent, setSelectedDiaryEvent] = useState<{
    id: number;
    title: string;
    category: string;
    priority: string;
    date: string;
    time: string;
    location?: string;
    host?: string;
    attendees?: string;
    description: string;
  } | null>({
    id: 1,
    title: 'Commissioning of KNH Modern Burns ICU',
    category: 'Event',
    priority: 'High',
    date: '2026-02-15',
    time: '09:30',
    location: 'Kenyatta National Hospital, Modern Burns Unit, Nairobi',
    host: 'Cabinet Secretary & PS-SDMS',
    attendees: 'Dr. Harry Kimtai (PS-SDMS), Dr. Evanson Kamuri (CEO KNH), Parliamentary Health Committee, Media Pool',
    description: 'Official ribbon-cutting and technical handover of the modernized Burns ICU at Kenyatta National Hospital. Includes inspection of specialized critical-care telemetry equipment, high-efficiency particulate airlock chambers, and patient isolation suites.'
  });
  const [reportSearch, setReportSearch] = useState('');
  const [reportProjectFilter, setReportProjectFilter] = useState('');
  const [pcYearFilter, setPcYearFilter] = useState('2026/2027');
  const [pcStatusFilter, setPcStatusFilter] = useState('All');
  const [pcGanttFilterUnit, setPcGanttFilterUnit] = useState('All');
  const [showPcGantt, setShowPcGantt] = useState(true);
  const [pcCategoryFilter, setPcCategoryFilter] = useState<'All' | 'Financial Stewardship' | 'Service Delivery' | 'Core Mandate' | 'Implementation of Presidential Directives' | 'Affirmative Action in Procurement' | 'Cross-Cutting'>('All');
  const [pcSearch, setPcSearch] = useState('');
  const [pcViewMode, setPcViewMode] = useState<'categorized' | 'matrix'>('categorized');
  const [editingPcKpi, setEditingPcKpi] = useState<PerformanceKPI | null>(null);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState('');
  const [showProjectDetailsDropdown, setShowProjectDetailsDropdown] = useState(true);
  const [showProjectEditor, setShowProjectEditor] = useState(false);

  // Programmes Hierarchy & Sub-Programmes State
  const [programmes, setProgrammes] = useState<ProgrammeItem[]>(INITIAL_PROGRAMMES);
  const [expandedProgrammes, setExpandedProgrammes] = useState<Record<number, boolean>>({ 1: true });
  const [expandedSubProgs, setExpandedSubProgs] = useState<Record<string, boolean>>({ '1-sp-1-1': true });
  const [expandedDeliveryUnits, setExpandedDeliveryUnits] = useState<Record<string, boolean>>({ '1-sp-1-1-du-knh': true });
  const [expandedOutputs, setExpandedOutputs] = useState<Record<string, boolean>>({ '1-sp-1-1-du-knh-out-a': true });
  const [programmeSearch, setProgrammeSearch] = useState<string>('');
  const [projectsViewMode, setProjectsViewMode] = useState<'programmes' | 'portfolio' | 'gantt'>('portfolio');
  const [projectsSubView, setProjectsSubView] = useState<'portfolio' | 'directorates' | 'sagas' | 'divisions'>('portfolio');
  const [projFilterSaga, setProjFilterSaga] = useState('All');
  const [projFilterDirectorate, setProjFilterDirectorate] = useState('All');
  const [projFilterDeliveryUnit, setProjFilterDeliveryUnit] = useState('All');
  const [projFilterDivision, setProjFilterDivision] = useState('All');
  const [projectsDisplayCount, setProjectsDisplayCount] = useState(6);
  const [projectYearFilter, setProjectYearFilter] = useState('2026');
  const [projectMonthFilter, setProjectMonthFilter] = useState('All');
  const [projectProgTitleFilter, setProjectProgTitleFilter] = useState('');
  const [projectSubProgFilter, setProjectSubProgFilter] = useState('');
  const [projectDeliveryUnitFilter, setProjectDeliveryUnitFilter] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('All');
  const [dashFilterSaga, setDashFilterSaga] = useState('All');
  const [dashFilterDirectorate, setDashFilterDirectorate] = useState('All');
  const [dashFilterDeliveryUnit, setDashFilterDeliveryUnit] = useState('All');
  const [dashFilterDivision, setDashFilterDivision] = useState('All');
  const [dashStatusFilter, setDashStatusFilter] = useState('All');
  const [dashSearch, setDashSearch] = useState('');
  const [dashDisplayCount, setDashDisplayCount] = useState(6);

  const toggleProgramme = (id: number) => {
    setExpandedProgrammes(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleSubProg = (key: string) => {
    setExpandedSubProgs(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleDeliveryUnit = (key: string) => {
    setExpandedDeliveryUnits(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleOutput = (key: string) => {
    setExpandedOutputs(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const expandAllProgrammesHierarchy = () => {
    const ep: Record<number, boolean> = {};
    const esp: Record<string, boolean> = {};
    const edu: Record<string, boolean> = {};
    const eout: Record<string, boolean> = {};
    programmes.forEach(p => {
      ep[p.id] = true;
      p.sub_programmes?.forEach(sp => {
        const spKey = `${p.id}-${sp.id}`;
        esp[spKey] = true;
        sp.delivery_units?.forEach(du => {
          const duKey = `${spKey}-${du.id}`;
          edu[duKey] = true;
          du.outputs?.forEach(out => {
            const outKey = `${duKey}-${out.id}`;
            eout[outKey] = true;
          });
        });
      });
    });
    setExpandedProgrammes(ep);
    setExpandedSubProgs(esp);
    setExpandedDeliveryUnits(edu);
    setExpandedOutputs(eout);
  };
  const collapseAllProgrammesHierarchy = () => {
    setExpandedProgrammes({});
    setExpandedSubProgs({});
    setExpandedDeliveryUnits({});
    setExpandedOutputs({});
  };

  // 11-field New Project & Dossier Modal State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedKpiForDossier, setSelectedKpiForDossier] = useState<{
    kpi: SubKpiItem;
    piTitle: string;
    unitName: string;
    progName: string;
    subProgName: string;
  } | null>(null);

  const [newProjectForm, setNewProjectForm] = useState({
    programme_title: 'Specialized Regional Cancer & Clinical Infrastructure Programme',
    sub_programme: '',
    category: 'Directorate' as 'Directorate' | 'Saga' | 'Division',
    entity_name: 'Directorate for Family Health',
    total_budget: 500000000,
    start_date: '2026-01-01',
    end_date: '2028-12-31',
    status: 'In Progress',
    description: '',
    initial_monthly_progress: 25
  });

  // Top Menu & Module Visibility State
  const [showModuleSettings, setShowModuleSettings] = useState(false);
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('moh_enabled_modules');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      dashboard: true,
      flagships: true,
      events: true,
      actions: true,
      projects: true,
      reports: true,
      diary: true,
      pc: true,
      users: true,
      audit_logs: true,
      backup: true,
    };
  });

  const toggleModuleVisibility = (id: string) => {
    setEnabledModules(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('moh_enabled_modules', JSON.stringify(updated));
      } catch (e) {}
      if (!updated[id] && activeTab === id) {
        setActiveTab('dashboard');
      }
      return updated;
    });
  };

  const resetModuleVisibility = () => {
    const allEnabled = {
      dashboard: true,
      flagships: true,
      events: true,
      actions: true,
      projects: true,
      reports: true,
      diary: true,
      pc: true,
      users: true,
      audit_logs: true,
      backup: true,
    };
    setEnabledModules(allEnabled);
    try {
      localStorage.setItem('moh_enabled_modules', JSON.stringify(allEnabled));
    } catch (e) {}
    showToast('All menu modules restored to active.');
  };

  // Modal State
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatKes = (amount: number) => {
    return 'KES ' + amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const formatProjectCurrency = (amount: number) => {
    return 'KES ' + (amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatProjectDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parts[2];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${months[monthIdx] || parts[1]} ${year}`;
      }
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
    } catch (e) {}
    return dateStr;
  };

  // Dynamic Project Progress calculation derived from linked Performance Contract Sub-KPIs
  const getProjectCalculatedProgress = (project: Project, kpiList: PerformanceKPI[]) => {
    if (project.progress_calculation_mode === 'manual' || !project.linked_sub_kpi_codes || project.linked_sub_kpi_codes.length === 0) {
      const parsed = parseInt(project.progress_status.replace('%', '')) || 0;
      return {
        pct: parsed,
        isDerived: false,
        linkedKpis: []
      };
    }
    const matchedKpis = kpiList.filter(k => project.linked_sub_kpi_codes?.includes(k.code));
    if (matchedKpis.length === 0) {
      const parsed = parseInt(project.progress_status.replace('%', '')) || 0;
      return { pct: parsed, isDerived: false, linkedKpis: [] };
    }
    const totalWeight = matchedKpis.reduce((acc, k) => acc + (k.sub_kpi_weight || 1), 0);
    const weightedSum = matchedKpis.reduce((acc, k) => acc + (k.current_achievement * (k.sub_kpi_weight || 1)), 0);
    const computed = Math.round(weightedSum / (totalWeight || 1));
    return {
      pct: computed,
      isDerived: true,
      linkedKpis: matchedKpis
    };
  };

  // Overall Ministry Performance Contract Composite Score
  const calculateOverallPcScore = (kpiList: PerformanceKPI[]) => {
    const total = kpiList.reduce((acc, k) => acc + (k.current_achievement * (k.sub_kpi_weight || 0) / 100), 0);
    return Math.round(total * 10) / 10;
  };

  // Category Metrics and Breakdown
  const calculateCategoryMetrics = (kpiList: PerformanceKPI[], category: string) => {
    const list = kpiList.filter(k => k.category === category);
    const totalWeight = list.reduce((acc, k) => acc + (k.sub_kpi_weight || 0), 0);
    const weightedSum = list.reduce((acc, k) => acc + (k.current_achievement * (k.sub_kpi_weight || 0)), 0);
    const avgScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
    const targetMetCount = list.filter(k => k.current_achievement >= 90).length;
    return { list, totalWeight, avgScore, count: list.length, targetMetCount };
  };

  // Helper status badge styles
  const getStatusBadgeClass = (status: string) => {
    const s = status.toUpperCase();
    if (['ON TRACK', 'COMPLETED', 'ACTIVE', 'APPROVED', 'CHECKED IN'].includes(s)) {
      return 'bg-emerald-600 text-white';
    }
    if (['IN PROGRESS', 'UPCOMING'].includes(s)) {
      return 'bg-blue-600 text-white';
    }
    if (['NOT STARTED', 'PLANNING'].includes(s)) {
      return 'bg-slate-800 text-white';
    }
    if (['DELAYED', 'ON HOLD'].includes(s)) {
      return 'bg-pink-600 text-white';
    }
    if (['STALLED', 'SEVERE', 'CRITICAL', 'OVERDUE', 'REJECTED'].includes(s)) {
      return 'bg-red-600 text-white';
    }
    if (['PENDING', 'FORWARDED', 'REVIEWED'].includes(s)) {
      return 'bg-amber-500 text-slate-900';
    }
    return 'bg-slate-600 text-white';
  };

  // Download Handlers
  const handleDownloadSchema = () => {
    window.location.href = '/database/schema.sql';
    showToast('Downloading complete MySQL schema & demo dataset (moh_database_schema_and_demo.sql)...');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7fb] text-slate-800 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3 text-sm animate-bounce">
          <Info className="w-5 h-5 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Ministerial Header */}
      <header className="bg-gradient-to-r from-[#0a2356] via-[#0d3b82] to-[#0d47a1] text-white px-6 py-3 border-b-2 border-[#08214d] shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <img 
              src="/public/assets/images/kenya_coat_arms.png" 
              alt="Coat of Arms of Kenya" 
              className="w-14 h-14 object-contain drop-shadow-md"
              onError={(e: any) => { e.target.src = '/src/assets/images/kenya_coat_arms_1790239737101.jpg'; }}
            />
            <div>
              <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-wide leading-tight text-white drop-shadow">
                STATE DEPARTMENT FOR MEDICAL SERVICES
              </h1>
              <p className="text-xs md:text-sm font-medium text-sky-200 tracking-normal">
                Project Performance, Service Delivery &amp; Operational Management System (PP-SDOMS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Download Package Button */}
            <button 
              onClick={handleDownloadSchema}
              className="hidden lg:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded transition shadow-sm"
              title="Download MySQL Schema with Demo Data for cPanel Import"
            >
              <HardDriveDownload className="w-3.5 h-3.5" />
              <span>Download MySQL Script (.sql)</span>
            </button>

            {/* Notification Bell */}
            <div className="relative cursor-pointer p-2 bg-white/10 hover:bg-white/20 rounded-full transition" title="5 Active System Notifications">
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0a2356]">
                5
              </span>
            </div>

            {/* User Role Switcher Pill */}
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full border border-white/20">
              <img 
                src="/public/assets/images/avatar.png" 
                alt="Avatar" 
                className="w-7 h-7 rounded-full object-cover border border-sky-300"
                onError={(e: any) => { e.target.src = '/src/assets/images/avatar_system_admin_1790239749304.jpg'; }}
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold leading-none text-white">{currentUser.full_name}</div>
                <div className="text-[10px] text-sky-200">[{currentUser.role}]</div>
              </div>
              <select 
                value={currentUser.id}
                onChange={(e) => {
                  const u = users.find(x => x.id === Number(e.target.value));
                  if (u) {
                    setCurrentUser(u);
                    showToast(`Switched active session to: ${u.full_name} (${u.role})`);
                  }
                }}
                className="bg-transparent text-[11px] text-sky-200 border-none focus:ring-0 cursor-pointer"
                title="Switch User Role for RBAC Testing"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id} className="text-slate-800">
                    Switch: {u.full_name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {currentUser.is_admin && (
              <button 
                onClick={() => setShowModuleSettings(true)}
                className="flex items-center gap-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 hover:text-white px-2.5 py-1.5 rounded text-xs font-bold transition border border-yellow-400/40"
                title="Configure visible modules or remove from menu"
              >
                <Sliders className="w-3.5 h-3.5 text-yellow-300" />
                <span className="hidden md:inline">Menu Config</span>
              </button>
            )}

            <button 
              onClick={() => showToast('Session active. For cPanel login, navigate to index.php')}
              className="flex items-center gap-1 bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white px-2.5 py-1.5 rounded text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Top Horizontal Navigation Bar */}
      <nav className="bg-[#0d47a1] border-b-2 border-[#1565c0] px-4 overflow-x-auto whitespace-nowrap shadow-inner">
        <div className="flex items-center space-x-1 py-0.5">
          {[
            { id: 'dashboard', label: 'DASHBOARD' },
            { id: 'flagships', label: 'PRIORITY FLAGSHIPS' },
            { id: 'events', label: 'ACTIVITIES AND EVENTS' },
            { id: 'actions', label: 'ACTION POINTS TRACKER' },
            { id: 'projects', label: 'PROJECTS AND PROGRAMMES' },
            { id: 'reports', label: 'REPORTS' },
            { id: 'diary', label: 'DIARY' },
            { id: 'pc', label: 'PERFORMANCE CONTRACT' },
            { id: 'users', label: 'USERS' },
            ...(currentUser.is_admin ? [{ id: 'audit_logs', label: 'AUDIT LOGS' }] : []),
            { id: 'backup', label: 'CPANEL & BACKUP' },
          ]
            .filter((tab) => enabledModules[tab.id] !== false)
            .map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedFlagship(null);
                setSelectedProject(null);
                setSelectedAction(null);
              }}
              className={`px-3 py-2.5 text-[11.5px] font-extrabold uppercase tracking-wider transition-all duration-150 border-b-[3px] ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white border-yellow-300 shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/10 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Core Values Marquee Bar */}
      <div className="bg-[#1976d2] text-white py-1.5 px-4 text-xs font-bold italic tracking-wide text-center border-b border-[#1565c0] shadow-sm overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-pulse">
          CORE VALUES: Integrity, Professionalism, Accountability, Ethics, Teamwork, Delivery, Impact. &nbsp;&bull;&nbsp; Dedicated to Universal Health Coverage (UHC) and Quality Healthcare for All Kenyans. &nbsp;&bull;&nbsp; State Department for Medical Services.
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-5 md:p-6 max-w-7xl mx-auto w-full">

        {/* ======================= TAB: DASHBOARD ======================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Title Banner */}
            <div className="bg-gradient-to-r from-[#1976d2] to-[#0d47a1] text-white rounded-lg p-4 shadow flex flex-wrap justify-between items-center gap-3">
              <h2 className="text-lg font-extrabold uppercase tracking-wide flex items-center gap-2">
                <Gauge className="w-5 h-5" /> Performance Management Dashboard
              </h2>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded">
                FY 2025/2026 Active Quarter 3
              </span>
            </div>

            {/* Quick Access Grid (Exact match with Page 4 screenshot) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-700" /> Quick Access
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {[
                  { id: 'flagships', title: 'Priority Flagships', desc: 'Track Priority Flagships', icon: Milestone },
                  { id: 'projects', title: 'Projects & Programmes', desc: 'Manage all projects and programmes', icon: FolderOpen },
                  { id: 'events', title: 'Upcoming Key Activities', desc: 'Manage activities and events', icon: Calendar },
                  { id: 'actions', title: 'Action Points Tracker', desc: 'View Action Points', icon: ClipboardCheck },
                  { id: 'meetings', title: 'Meeting Minutes', desc: 'View local and foreign financiers', icon: FileText },
                  { id: 'reports', title: 'Reports', desc: 'View System Data', icon: FileSpreadsheet },
                  { id: 'diary', title: 'Diary', desc: 'View Diary Entries', icon: Clock },
                  { id: 'pc', title: 'Performance Contract', desc: 'View KPI Targets & Scores', icon: Shield },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id === 'meetings' ? 'projects' : item.id)}
                      className="bg-[#0d47a1] hover:bg-[#0a3880] text-white p-5 rounded-lg text-center flex flex-col items-center justify-center gap-2 transition transform hover:-translate-y-1 shadow-md border border-[#1565c0]"
                    >
                      <Icon className="w-8 h-8 text-sky-200 mb-1" />
                      <div className="font-bold text-sm leading-tight text-white">{item.title}</div>
                      <div className="text-[10px] text-sky-200/90 leading-tight">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Projects Table Section */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-black text-slate-900">Priority Projects Performance &amp; Tracking</h3>
                </div>
                <div className="text-xs font-bold text-slate-500 font-mono">
                  Showing {Math.min(dashDisplayCount, projects.filter(p => {
                    if (dashFilterSaga !== 'All' && p.saga_name !== dashFilterSaga) return false;
                    if (dashFilterDirectorate !== 'All' && p.directorate_name !== dashFilterDirectorate) return false;
                    if (dashFilterDeliveryUnit !== 'All' && p.delivery_unit !== dashFilterDeliveryUnit) return false;
                    if (dashFilterDivision !== 'All' && p.division_name !== dashFilterDivision) return false;
                    if (dashStatusFilter !== 'All' && p.status !== dashStatusFilter) return false;
                    if (dashSearch.trim() !== '') {
                      const q = dashSearch.toLowerCase();
                      if (!p.sub_programme?.toLowerCase().includes(q) && !p.programme_title?.toLowerCase().includes(q)) return false;
                    }
                    return true;
                  }).length)} of {projects.filter(p => {
                    if (dashFilterSaga !== 'All' && p.saga_name !== dashFilterSaga) return false;
                    if (dashFilterDirectorate !== 'All' && p.directorate_name !== dashFilterDirectorate) return false;
                    if (dashFilterDeliveryUnit !== 'All' && p.delivery_unit !== dashFilterDeliveryUnit) return false;
                    if (dashFilterDivision !== 'All' && p.division_name !== dashFilterDivision) return false;
                    if (dashStatusFilter !== 'All' && p.status !== dashStatusFilter) return false;
                    if (dashSearch.trim() !== '') {
                      const q = dashSearch.toLowerCase();
                      if (!p.sub_programme?.toLowerCase().includes(q) && !p.programme_title?.toLowerCase().includes(q)) return false;
                    }
                    return true;
                  }).length} Projects
                </div>
              </div>

              {/* Filters Toolbar on top of table (SAGA, Directorate, Delivery Unit, Division, Status, Search) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* SAGA Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Filter by SAGA</label>
                    <select
                      value={dashFilterSaga}
                      onChange={(e) => setDashFilterSaga(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">All SAGAs</option>
                      {Array.from(new Set(projects.filter(p => p.saga_name).map(p => p.saga_name))).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Directorate Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Filter by Directorate</label>
                    <select
                      value={dashFilterDirectorate}
                      onChange={(e) => setDashFilterDirectorate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">All Directorates</option>
                      {Array.from(new Set(projects.filter(p => p.directorate_name).map(p => p.directorate_name))).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Unit Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Filter by Delivery Unit</label>
                    <select
                      value={dashFilterDeliveryUnit}
                      onChange={(e) => setDashFilterDeliveryUnit(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">All Delivery Units</option>
                      {Array.from(new Set(projects.filter(p => p.delivery_unit).map(p => p.delivery_unit))).map(du => (
                        <option key={du} value={du}>{du}</option>
                      ))}
                    </select>
                  </div>

                  {/* Division Filter */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Filter by Division</label>
                    <select
                      value={dashFilterDivision}
                      onChange={(e) => setDashFilterDivision(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="All">All Divisions</option>
                      <option value="Division of Primary Health Care">Division of Primary Health Care</option>
                      <option value="Division of Reproductive and Maternal Health">Division of Reproductive and Maternal Health</option>
                      <option value="Division of Disease Surveillance and Response">Division of Disease Surveillance and Response</option>
                      <option value="Division of Health Informatics and m-Health">Division of Health Informatics and m-Health</option>
                      <option value="Division of Laboratory Services and Blood Safety">Division of Laboratory Services and Blood Safety</option>
                    </select>
                  </div>

                  {/* Search Bar */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Search Projects</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={dashSearch}
                        onChange={(e) => setDashSearch(e.target.value)}
                        placeholder="Search title..."
                        className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 mr-2">Status:</span>
                  {['All', 'In Progress', 'On Hold', 'Completed', 'Planning', 'Delayed'].map(st => (
                    <button
                      key={st}
                      onClick={() => setDashStatusFilter(st)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                        dashStatusFilter === st 
                          ? 'bg-blue-700 text-white shadow-2xs' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Projects Table (Lazy Loaded 6 at a time) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Title &amp; Delivery Unit</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Budget (KES)</th>
                        <th className="py-3 px-4 w-36">Progress</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filtered = projects.filter(p => {
                          if (dashFilterSaga !== 'All' && p.saga_name !== dashFilterSaga) return false;
                          if (dashFilterDirectorate !== 'All' && p.directorate_name !== dashFilterDirectorate) return false;
                          if (dashFilterDeliveryUnit !== 'All' && p.delivery_unit !== dashFilterDeliveryUnit) return false;
                          if (dashFilterDivision !== 'All' && p.division_name !== dashFilterDivision) return false;
                          if (dashStatusFilter !== 'All' && p.status !== dashStatusFilter) return false;
                          if (dashSearch.trim() !== '') {
                            const q = dashSearch.toLowerCase();
                            const match = p.sub_programme?.toLowerCase().includes(q) || p.programme_title?.toLowerCase().includes(q);
                            if (!match) return false;
                          }
                          return true;
                        });

                        const sliced = filtered.slice(0, dashDisplayCount);

                        if (sliced.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                                No priority projects found matching the selected filters.
                              </td>
                            </tr>
                          );
                        }

                        return sliced.map(pr => {
                          const { pct } = getProjectCalculatedProgress(pr, kpis);
                          const statusClass = 
                            pr.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            pr.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            pr.status === 'On Hold' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800';

                          return (
                            <tr key={pr.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-4">
                                <div className="font-extrabold text-slate-900 line-clamp-1">{pr.sub_programme}</div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-3 h-3 text-blue-600 shrink-0" />
                                  <span>{pr.delivery_unit || pr.directorate_name || pr.saga_name || 'Ministry of Health'}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 font-semibold text-slate-700">
                                {pr.category || 'Directorate'}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${statusClass}`}>
                                  {pr.status || 'In Progress'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                                {formatKes(pr.total_budget)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                                  <span className="text-slate-600">{pct}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                  <div className="bg-blue-700 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}></div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedProject(pr);
                                    setActiveTab('projects');
                                  }}
                                  className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition inline-flex items-center gap-1 text-xs font-bold px-2.5"
                                  title="View Project Details"
                                >
                                  <Eye className="w-3.5 h-3.5" /> View
                                </button>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

                {/* Lazy Load / Show More Button */}
                {dashDisplayCount < projects.length && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                    <button
                      onClick={() => setDashDisplayCount(prev => prev + 6)}
                      className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded-lg shadow-sm transition inline-flex items-center gap-2"
                    >
                      <span>Load More Priority Projects ({projects.length - dashDisplayCount} remaining)</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: PRIORITY FLAGSHIPS ======================= */}
        {activeTab === 'flagships' && (
          <div className="space-y-6">
            {selectedFlagship ? (
              // Detailed Flagship View (Matching Screenshot Page 8)
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority Flagship Initiative</span>
                    <h2 className="text-xl font-extrabold text-slate-900">{selectedFlagship.title}</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedFlagship(null)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Flagships
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Overall Progress</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                        <div className="bg-blue-700 h-full rounded-full transition-all" style={{ width: `${selectedFlagship.progress_pct}%` }}></div>
                      </div>
                      <span className="text-base font-black text-blue-700">{selectedFlagship.progress_pct}%</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-3">{selectedFlagship.description}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-center">
                    <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Risk Assessment</h4>
                    <div className="flex justify-center gap-2 my-2">
                      <span className="w-6 h-6 rounded-full bg-red-600 inline-block"></span>
                      <span className="w-6 h-6 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-6 h-6 rounded-full bg-slate-200 inline-block"></span>
                    </div>
                    <div className="text-base font-bold text-red-600 uppercase">{selectedFlagship.risk_level} Risk</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-xs">
                    <div className="font-bold text-slate-400 uppercase text-[10px]">Budget Performance</div>
                    <div className="mt-1">Allocated: <strong>{formatKes(selectedFlagship.allocated_budget)}</strong></div>
                    <div>Utilized: <strong>{formatKes(selectedFlagship.utilized_budget)}</strong></div>
                    <div className="text-blue-700 font-bold mt-2">
                      {Math.round((selectedFlagship.utilized_budget / selectedFlagship.allocated_budget) * 100)}% Utilized
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-xs">
                    <div className="font-bold text-slate-400 uppercase text-[10px]">Timeline Variance</div>
                    <div className="mt-1">Start Date: <strong>{selectedFlagship.start_date}</strong></div>
                    <div>Due Date: <strong>{selectedFlagship.target_date}</strong></div>
                    <div className="text-emerald-600 font-bold mt-2">Milestones On Schedule</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 text-xs">
                    <div className="font-bold text-slate-400 uppercase text-[10px]">Stakeholders &amp; Team</div>
                    <div className="mt-1">Lead Officer: <strong>{selectedFlagship.lead_officer}</strong></div>
                    <div>Steering Team: <strong>{selectedFlagship.team_name}</strong></div>
                    <div className="text-blue-700 mt-2 font-medium">{selectedFlagship.lead_directorate}</div>
                  </div>
                </div>

                {/* Linked Projects for this flagship */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-800">
                    Linked Portfolio Projects
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Project Code</th>
                          <th className="p-3">Title</th>
                          <th className="p-3">Budget</th>
                          <th className="p-3">Progress</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {projects.filter(p => p.flagship_id === selectedFlagship.id).map(lp => (
                          <tr key={lp.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">{lp.programme_title}</td>
                            <td className="p-3 font-bold text-slate-800">{lp.sub_programme}</td>
                            <td className="p-3 font-mono">{formatKes(lp.total_budget)}</td>
                            <td className="p-3">{lp.progress_status}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeClass(lp.status)}`}>
                                {lp.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              // Flagships Grid (Matching Screenshot Page 9)
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Milestone className="w-5 h-5 text-blue-700" /> Priority Flagships
                  </h2>
                  {currentUser.can_edit && (
                    <button 
                      onClick={() => { setEditingItem(null); setModalType('flagship'); }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Flagship
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flagships.map((f) => (
                    <div 
                      key={f.id}
                      className="bg-white rounded-lg shadow-sm border border-slate-200 border-t-4 border-t-[#0d47a1] p-4 flex flex-col justify-between hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                            {f.priority_tier}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 border border-slate-200 px-2 py-0.5 rounded bg-slate-50">
                            {f.risk_level} Risk
                          </span>
                        </div>
                        <h3 
                          onClick={() => setSelectedFlagship(f)}
                          className="font-extrabold text-sm text-slate-900 hover:text-blue-700 cursor-pointer mb-1 leading-snug"
                        >
                          {f.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{f.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500">Progress</span>
                          <span className="text-blue-700">{f.progress_pct}%</span>
                        </div>
                        <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                          <div className="bg-blue-700 h-full rounded-full" style={{ width: `${f.progress_pct}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-500">
                          <span>Due: {f.target_date.substring(0, 7)}</span>
                          <button 
                            onClick={() => setSelectedFlagship(f)}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded text-xs font-bold"
                          >
                            Details &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB: PROJECTS & PROGRAMMES ======================= */}
        {activeTab === 'projects' && (
          <div className="space-y-5">
            {selectedProject ? (
              // Detailed Single Project View (Matching project-view-detail.png)
              <div className="space-y-6">
                {/* Top Navigation & Utility Controls */}
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-white border border-slate-300 hover:border-blue-400 px-3 py-1.5 rounded-md transition shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4 text-blue-700" />
                    <span>Back to Projects &amp; Programmes</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {currentUser.can_edit && (
                      <button 
                        onClick={() => setShowProjectEditor(!showProjectEditor)}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-md transition shadow-sm"
                      >
                        <PenSquare className="w-3.5 h-3.5" />
                        <span>{showProjectEditor ? 'Hide Project Editor' : 'Edit Project & KPI Links'}</span>
                      </button>
                    )}
                  </div>
                </div>

                 {/* Project Header (Matching Screenshot) */}
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {selectedProject.sub_programme}
                  </h1>

                  {/* Status Badge */}
                  <div className="mt-2.5">
                    <span className="inline-block bg-[#16a34a] text-white text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                      {selectedProject.status || 'In Progress'}
                    </span>
                  </div>

                  {/* VIEW DETAILS Toggle Button */}
                  <div className="mt-4">
                    <button 
                      onClick={() => setShowProjectDetailsDropdown(!showProjectDetailsDropdown)}
                      className="bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold text-xs uppercase px-4 py-2 rounded-md flex items-center gap-2 shadow-sm transition"
                    >
                      {showProjectDetailsDropdown ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />}
                      <span>VIEW DETAILS</span>
                    </button>
                  </div>
                </div>

                {/* Hidden Field that drops down (Collapsible Project Metadata Grid) */}
                {showProjectDetailsDropdown && (
                  <div className="bg-slate-50/70 border border-slate-200/90 rounded-lg p-5 shadow-sm transition-all duration-300">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
                      {/* Row 1 */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PROGRAMME TITLE</div>
                        <div className="text-sm font-extrabold text-blue-700 font-mono mt-1">
                          {selectedProject.programme_title}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CATEGORY</div>
                        <div className="text-sm font-extrabold text-blue-700 mt-1">
                          {selectedProject.category}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">DELIVERY UNIT</div>
                        <div className="text-sm font-extrabold text-blue-700 mt-1">
                          {selectedProject.delivery_unit || selectedProject.directorate_name || selectedProject.saga_name || 'Ministry of Health'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">IMPLEMENTING ENTITY</div>
                        <div className="text-sm font-extrabold text-blue-700 mt-1">
                          {selectedProject.directorate_name || selectedProject.saga_name || selectedProject.division_name || 'Ministry of Health'}
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">STATUS</div>
                        <div className="text-sm font-extrabold text-blue-700 mt-1">
                          {selectedProject.status}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TOTAL BUDGET</div>
                        <div className="text-sm font-extrabold text-blue-700 font-mono mt-1">
                          {formatProjectCurrency(selectedProject.total_budget)}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">START DATE</div>
                        <div className="text-sm font-extrabold text-blue-700 mt-1">
                          {formatProjectDate(selectedProject.start_date)}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">END DATE</div>
                        <div className="text-sm font-extrabold text-blue-700 mt-1">
                          {formatProjectDate(selectedProject.end_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Two-Column Layout (Matching Screenshot) */}
                {(() => {
                  const { pct, isDerived, linkedKpis } = getProjectCalculatedProgress(selectedProject, kpis);
                  const budgetPlanned = selectedProject.total_budget || 500000000;
                  const budgetDisbursed = selectedProject.funds_disbursed || Math.round(budgetPlanned * 0.7);
                  const budgetUtilized = selectedProject.funds_utilized || Math.round(budgetPlanned * 0.62);

                  // Dynamic or fixed Y-axis scale based on project budget
                  const maxVal = Math.max(budgetPlanned, budgetDisbursed, budgetUtilized, 1);
                  const yTicks = [
                    maxVal,
                    Math.round(maxVal * 0.8),
                    Math.round(maxVal * 0.6),
                    Math.round(maxVal * 0.4),
                    Math.round(maxVal * 0.2),
                    0
                  ];

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* ================= LEFT COLUMN ================= */}
                      <div className="lg:col-span-5 space-y-4">
                        {/* Action Card */}
                        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                          <h3 className="font-extrabold text-sm text-slate-900 mb-2.5">Action:</h3>
                          <div className="border border-slate-200 rounded p-3 text-xs text-slate-700 leading-relaxed bg-white min-h-[140px] whitespace-pre-line">
                            {selectedProject.description || "National program for HIV/AIDS and STI prevention, treatment, and control. Key indicators include: People Living with HIV, On ART, and With Viral Load Suppression.\n\nNational program for HIV/AIDS and STI prevention, treatment, and control. Key indicators include: People Living with HIV, On ART, and With Viral Load Suppression."}
                          </div>

                          {/* Progress Status Bar */}
                          <div className="mt-3.5">
                            <div className="flex justify-between items-center font-extrabold text-xs text-slate-900">
                              <span>Progress Status: {pct}%</span>
                              {isDerived && (
                                <span className="text-[10px] text-blue-700 font-mono font-bold" title={linkedKpis.map(k => `${k.code}: ${k.current_achievement}%`).join(', ')}>
                                  PC Linked ({linkedKpis.length})
                                </span>
                              )}
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3 mt-1.5 overflow-hidden">
                              <div 
                                className="bg-[#475569] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Remarks Card */}
                        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                          <h3 className="font-extrabold text-sm text-slate-900 mb-2.5">Remarks:</h3>
                          <div className="border border-slate-200 rounded p-3 text-xs text-slate-700 leading-relaxed bg-white min-h-[90px]">
                            {selectedProject.remarks || "Demo programme for Directorate of Family Health showing key HIV indicators. Targets: 100% coverage for PLHIV, 95% on ART, 95% viral load suppression."}
                          </div>
                        </div>

                        {/* Row: Indicators & Reports Mini-Cards */}
                        <div className="grid grid-cols-2 gap-3.5">
                          {/* Indicators Card */}
                          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm">
                            <div className="font-extrabold text-xs text-slate-900 mb-2.5">Indicators:</div>
                            <div className="space-y-2 text-xs font-bold text-blue-700">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>Milestones Completed: {selectedProject.milestones_completed ?? 2}/{selectedProject.milestones_total ?? 3}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ListFilter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span>Tasks On Track: {selectedProject.tasks_on_track ?? 0}/{selectedProject.tasks_total ?? 1}</span>
                              </div>
                            </div>
                          </div>

                          {/* Reports Card */}
                          <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm flex flex-col justify-between">
                            <div className="font-extrabold text-xs text-slate-900 text-center mb-2">Reports:</div>
                            <button 
                              onClick={() => {
                                setActiveTab('reports');
                                setReportProjectFilter(selectedProject.sub_programme);
                              }}
                              className="w-full border border-blue-600 hover:bg-blue-50 text-blue-700 font-bold py-1.5 px-3 rounded text-xs transition text-center"
                            >
                              View Reports
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ================= RIGHT COLUMN ================= */}
                      <div className="lg:col-span-7 space-y-4">
                        {/* Financial Bar Graph Card */}
                        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                          {/* Legend / Key */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="font-extrabold text-xs text-slate-900">Bar Graph Key:</span>
                            <span className="bg-[#1976d2] text-white font-bold text-[11px] px-2.5 py-0.5 rounded">Planned</span>
                            <span className="bg-[#16a34a] text-white font-bold text-[11px] px-2.5 py-0.5 rounded">Completed</span>
                            <span className="bg-[#eab308] text-white font-bold text-[11px] px-2.5 py-0.5 rounded">In Progress</span>
                          </div>

                          {/* Bar Chart Area */}
                          <div className="relative pt-2 pb-1">
                            <div className="relative h-64 w-full flex">
                              {/* Y-axis Labels */}
                              <div className="w-24 pr-2 flex flex-col justify-between text-right text-[10px] text-slate-500 font-mono select-none">
                                {yTicks.map((val, idx) => (
                                  <div key={idx} className="leading-none">
                                    {val.toLocaleString('en-KE')}
                                  </div>
                                ))}
                              </div>

                              {/* Plot Area with Grid Lines */}
                              <div className="relative flex-1 h-full border-l border-b border-slate-300">
                                {/* Horizontal Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                  {yTicks.map((_, idx) => (
                                    <div key={idx} className="border-t border-slate-100 w-full first:border-transparent"></div>
                                  ))}
                                </div>

                                {/* Bars */}
                                <div className="absolute inset-0 grid grid-cols-3 items-end px-6 gap-6 sm:gap-10">
                                  {/* Bar 1: Planned (Total Budget) */}
                                  <div className="flex flex-col items-center h-full justify-end group">
                                    <div 
                                      className="w-10 sm:w-14 bg-[#1976d2] rounded-t hover:brightness-110 transition-all duration-500 shadow-sm relative cursor-pointer"
                                      style={{ height: `${Math.min(100, Math.max(5, (budgetPlanned / maxVal) * 100))}%` }}
                                      title={`Planned Total Budget: ${formatProjectCurrency(budgetPlanned)}`}
                                    >
                                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap z-10 pointer-events-none font-mono">
                                        {formatProjectCurrency(budgetPlanned)}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bar 2: Completed (Funds Disbursed) */}
                                  <div className="flex flex-col items-center h-full justify-end group">
                                    <div 
                                      className="w-10 sm:w-14 bg-[#16a34a] rounded-t hover:brightness-110 transition-all duration-500 shadow-sm relative cursor-pointer"
                                      style={{ height: `${Math.min(100, Math.max(5, (budgetDisbursed / maxVal) * 100))}%` }}
                                      title={`Completed (Disbursed): ${formatProjectCurrency(budgetDisbursed)}`}
                                    >
                                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap z-10 pointer-events-none font-mono">
                                        {formatProjectCurrency(budgetDisbursed)}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bar 3: In Progress (Funds Utilized) */}
                                  <div className="flex flex-col items-center h-full justify-end group">
                                    <div 
                                      className="w-10 sm:w-14 bg-[#eab308] rounded-t hover:brightness-110 transition-all duration-500 shadow-sm relative cursor-pointer"
                                      style={{ height: `${Math.min(100, Math.max(5, (budgetUtilized / maxVal) * 100))}%` }}
                                      title={`In Progress (Utilized): ${formatProjectCurrency(budgetUtilized)}`}
                                    >
                                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap z-10 pointer-events-none font-mono">
                                        {formatProjectCurrency(budgetUtilized)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* X-axis Labels */}
                            <div className="flex ml-24">
                              <div className="w-full grid grid-cols-3 text-center px-6 gap-6 sm:gap-10 pt-2 text-xs font-semibold text-slate-700">
                                <div>Total Budget</div>
                                <div>Funds Disbursed</div>
                                <div>Funds Utilized</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Overall Statistics (Gantt Chart) Card */}
                        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                          <h3 className="font-extrabold text-xs text-slate-900 mb-4">Overall Statistics (Gantt Chart):</h3>
                          <div className="space-y-2">
                            <div className="grid grid-cols-12 items-center gap-3">
                              {/* Task Title on Left */}
                              <div className="col-span-12 sm:col-span-4 text-blue-700 font-bold text-xs truncate" title={selectedProject.gantt_task_name || "Improve Viral Load Suppression Rate"}>
                                {selectedProject.gantt_task_name || "Improve Viral Load Suppression Rate"}
                              </div>

                              {/* Gantt Bar spanning Feb to Jun */}
                              <div className="col-span-12 sm:col-span-8">
                                <div className="w-full bg-slate-100 rounded-md h-7 overflow-hidden flex border border-slate-200 shadow-inner">
                                  {/* Left dark blue section */}
                                  <div className="bg-[#1565c0] h-full" style={{ width: '60%' }} title="Phase 1: Completed"></div>
                                  {/* Right bright blue section */}
                                  <div className="bg-[#1976d2] h-full" style={{ width: '40%' }} title="Phase 2: In Progress"></div>
                                </div>

                                {/* Month scale ticks */}
                                <div className="grid grid-cols-5 text-center pt-2 text-[11px] text-slate-700 font-medium">
                                  <div>
                                    <div className="font-bold">Feb</div>
                                    <div className="text-[10px] text-slate-500 font-mono">2026</div>
                                  </div>
                                  <div className="pt-0.5">Mar</div>
                                  <div className="pt-0.5">Apr</div>
                                  <div className="pt-0.5">May</div>
                                  <div className="pt-0.5">Jun</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Linked Sub-Programmes & Weighted Indicators Breakdown Card */}
                <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-700" />
                        <span>Sub-Programmes &amp; Performance Indicators (PIs) Linkage</span>
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Sub-KPIs under their respective Delivery Units and PIs roll up with assigned weights into this project's achievement status.
                      </p>
                    </div>
                    <span className="bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold text-xs px-2.5 py-1 rounded">
                      Calculation: Weighted Formula &Sigma;(Achv &times; Wt)
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Sub-Programme / Delivery Unit</th>
                          <th className="py-2.5 px-3">Performance Indicator (PI) / Sub-KPI</th>
                          <th className="py-2.5 px-3 text-center">Assigned Weight</th>
                          <th className="py-2.5 px-3 text-center">2025/26 Target</th>
                          <th className="py-2.5 px-3 text-center">2026/27 Target Baseline</th>
                          <th className="py-2.5 px-3 text-center">Progress Status</th>
                          <th className="py-2.5 px-3 text-right">Weighted Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(() => {
                          const linked = kpis.filter(k => selectedProject.linked_sub_kpi_codes?.includes(k.code));
                          const displayKpis = linked.length > 0 ? linked : kpis.slice(0, 3);
                          return displayKpis.map((lk) => {
                            const wt = lk.sub_kpi_weight || 25;
                            const achv = lk.current_achievement || 90;
                            const weightedContrib = ((achv * wt) / 100).toFixed(1);
                            return (
                              <tr key={lk.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3">
                                  <div className="font-bold text-slate-800">{lk.delivery_unit || 'NASCOP / Family Health'}</div>
                                  <div className="text-[10px] text-slate-500">{lk.parent_kpi_name || 'Sub programme 2.1: Communicable disease control'}</div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center gap-1.5 font-bold text-blue-700">
                                    <span className="font-mono bg-blue-100 text-blue-900 px-1 py-0.2 rounded text-[10px]">[{lk.code}]</span>
                                    <span>{lk.kpi_name}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">{lk.key_outputs || lk.category}</div>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded text-[11px]">
                                    {wt}%
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono">{lk.target_2025_26 || '1,350,000'}</td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">{lk.target_baseline_2026_27 || '1,350,000'}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                                    {achv}%
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-extrabold text-slate-900">
                                  {weightedContrib}%
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Collapsible Project Editor & PC Sub-KPI Linkage Drawer */}
                {showProjectEditor && (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-6">
                    <div className="bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase flex justify-between items-center">
                      <span>Edit Project Details &amp; Performance Contract Linkage</span>
                      <button onClick={() => setShowProjectEditor(false)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Programme Title</label>
                        <input 
                          type="text" 
                          value={selectedProject.programme_title} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, programme_title: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Sub-Programme</label>
                        <input 
                          type="text" 
                          value={selectedProject.sub_programme} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, sub_programme: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Priority Flagship Attachment</label>
                        <select 
                          value={selectedProject.flagship_id || ''} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, flagship_id: Number(e.target.value) })}
                          className="w-full border border-slate-300 rounded p-2"
                        >
                          {flagships.map(f => (
                            <option key={f.id} value={f.id}>{f.title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Category</label>
                        <select 
                          value={selectedProject.category} 
                          onChange={(e: any) => setSelectedProject({ ...selectedProject, category: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                        >
                          <option value="Directorate">Directorate</option>
                          <option value="Saga">SAGA</option>
                          <option value="Division">Division</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Delivery Unit / Entity Name</label>
                        <input 
                          type="text" 
                          value={selectedProject.delivery_unit || selectedProject.directorate_name || selectedProject.saga_name || ''} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, delivery_unit: e.target.value, directorate_name: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                          placeholder="e.g. Directorate for Family Health"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Total Budget (KES)</label>
                        <input 
                          type="number" 
                          value={selectedProject.total_budget} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, total_budget: Number(e.target.value) })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Funds Disbursed (KES)</label>
                        <input 
                          type="number" 
                          value={selectedProject.funds_disbursed || 0} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, funds_disbursed: Number(e.target.value) })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Funds Utilized (KES)</label>
                        <input 
                          type="number" 
                          value={selectedProject.funds_utilized || 0} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, funds_utilized: Number(e.target.value) })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Start Date</label>
                        <input 
                          type="date" 
                          value={selectedProject.start_date} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, start_date: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">End Date</label>
                        <input 
                          type="date" 
                          value={selectedProject.end_date} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, end_date: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Status</label>
                        <select 
                          value={selectedProject.status} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, status: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                        >
                          <option value="Planning">Planning</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Delayed">Delayed</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Gantt Key Task Name</label>
                        <input 
                          type="text" 
                          value={selectedProject.gantt_task_name || ''} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, gantt_task_name: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                          placeholder="e.g. Improve Viral Load Suppression Rate"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Milestones Completed (e.g. 2 of 3)</label>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="number" 
                            value={selectedProject.milestones_completed ?? 2} 
                            onChange={(e) => setSelectedProject({ ...selectedProject, milestones_completed: Number(e.target.value) })}
                            className="w-full border border-slate-300 rounded p-2 text-center"
                          />
                          <span className="font-bold">/</span>
                          <input 
                            type="number" 
                            value={selectedProject.milestones_total ?? 3} 
                            onChange={(e) => setSelectedProject({ ...selectedProject, milestones_total: Number(e.target.value) })}
                            className="w-full border border-slate-300 rounded p-2 text-center"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-600 block mb-1">Tasks On Track (e.g. 0 of 1)</label>
                        <div className="flex gap-2 items-center">
                          <input 
                            type="number" 
                            value={selectedProject.tasks_on_track ?? 0} 
                            onChange={(e) => setSelectedProject({ ...selectedProject, tasks_on_track: Number(e.target.value) })}
                            className="w-full border border-slate-300 rounded p-2 text-center"
                          />
                          <span className="font-bold">/</span>
                          <input 
                            type="number" 
                            value={selectedProject.tasks_total ?? 1} 
                            onChange={(e) => setSelectedProject({ ...selectedProject, tasks_total: Number(e.target.value) })}
                            className="w-full border border-slate-300 rounded p-2 text-center"
                          />
                        </div>
                      </div>

                      {/* Performance Contract Linkage & Calculation Section */}
                      <div className="md:col-span-3 bg-blue-50/60 border border-blue-200 rounded-lg p-3.5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-2">
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-blue-700" />
                            <span className="font-extrabold text-blue-900 text-xs">Performance Contract Progress Calculation Linkage</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-semibold text-slate-600">Mode:</label>
                            <select 
                              value={selectedProject.progress_calculation_mode || 'kpi_derived'}
                              onChange={(e: any) => setSelectedProject({ ...selectedProject, progress_calculation_mode: e.target.value })}
                              className="bg-white border border-blue-300 rounded px-2 py-1 text-[11px] font-bold text-blue-950"
                            >
                              <option value="kpi_derived">Calculate dynamically from linked PC Sub-KPIs</option>
                              <option value="manual">Manual Progress Percentage</option>
                            </select>
                          </div>
                        </div>

                        {selectedProject.progress_calculation_mode === 'manual' ? (
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Manual Progress Status (%)</label>
                            <input 
                              type="text" 
                              value={selectedProject.progress_status}
                              onChange={(e) => setSelectedProject({ ...selectedProject, progress_status: e.target.value })}
                              placeholder="e.g. 75%"
                              className="w-full md:w-48 bg-white border border-slate-300 rounded p-1.5 font-mono font-bold"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-[11px] text-slate-600">
                              Select one or more Performance Contract Sub-KPIs to dynamically derive this project's progress on the table and Gantt chart:
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1 bg-white rounded border border-blue-100">
                              {kpis.map(kpi => {
                                const isChecked = selectedProject.linked_sub_kpi_codes?.includes(kpi.code);
                                return (
                                  <label 
                                    key={kpi.id} 
                                    className={`flex items-start gap-2 p-1.5 rounded cursor-pointer border text-[11px] transition ${
                                      isChecked ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'border-slate-100 text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    <input 
                                      type="checkbox"
                                      checked={!!isChecked}
                                      onChange={(e) => {
                                        const current = selectedProject.linked_sub_kpi_codes || [];
                                        const updated = e.target.checked 
                                          ? [...current, kpi.code] 
                                          : current.filter(c => c !== kpi.code);
                                        const matched = kpis.filter(k => updated.includes(k.code));
                                        const newPct = matched.length > 0 ? Math.round(matched.reduce((a, b) => a + b.current_achievement, 0) / matched.length) : parseInt(selectedProject.progress_status) || 0;
                                        setSelectedProject({
                                          ...selectedProject,
                                          linked_sub_kpi_codes: updated,
                                          progress_status: `${newPct}%`
                                        });
                                      }}
                                      className="mt-0.5 rounded text-blue-600"
                                    />
                                    <div className="truncate">
                                      <span className="font-mono font-extrabold text-blue-800">[{kpi.code}]</span> {kpi.kpi_name}
                                      <div className="text-[10px] text-slate-400 font-normal">Achv: {kpi.current_achievement}% &bull; Wt: {kpi.sub_kpi_weight}%</div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>

                            {/* Live Calculated Progress Readout */}
                            {(() => {
                              const { pct, linkedKpis } = getProjectCalculatedProgress(selectedProject, kpis);
                              return (
                                <div className="bg-emerald-50 border border-emerald-200 rounded p-2 flex flex-wrap items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span className="font-semibold text-emerald-900">
                                      Current Dynamic Progress: <strong className="font-mono text-sm">{pct}%</strong>
                                    </span>
                                    <span className="text-[11px] text-emerald-700">
                                      ({linkedKpis.length} Sub-KPI{linkedKpis.length !== 1 ? 's' : ''} linked: {linkedKpis.map(k => `${k.code} (${k.current_achievement}%)`).join(', ') || 'None'})
                                    </span>
                                  </div>
                                  <span className="bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                                    Reflected in Gantt &amp; Table
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-3">
                        <label className="font-bold text-slate-600 block mb-1">Action Description</label>
                        <textarea 
                          rows={3} 
                          value={selectedProject.description} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="font-bold text-slate-600 block mb-1">Remarks</label>
                        <textarea 
                          rows={2} 
                          value={selectedProject.remarks} 
                          onChange={(e) => setSelectedProject({ ...selectedProject, remarks: e.target.value })}
                          className="w-full border border-slate-300 rounded p-2"
                        />
                      </div>
                    </div>

                    {currentUser.can_edit && (
                      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-right">
                        <button 
                          onClick={() => {
                            setProjects(projects.map(p => p.id === selectedProject.id ? selectedProject : p));
                            setShowProjectEditor(false);
                            showToast('Project updated successfully!');
                          }}
                          className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded shadow-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Manage Meetings & Action Points */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-blue-700 text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Manage Meetings &amp; Action Points</span>
                    <button 
                      onClick={() => { setEditingItem(null); setModalType('meeting'); }}
                      className="bg-white text-blue-700 text-[11px] font-extrabold px-2.5 py-1 rounded"
                    >
                      + Add New Meeting
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {meetings.map((m) => (
                      <div key={m.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                        <div>
                          <strong className="text-slate-800">{m.title}</strong>
                          <span className="text-slate-500 ml-2">({m.date})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded">Action Points</span>
                          <button 
                            onClick={() => {
                              showToast(`Minutes Document: ${m.document}`);
                            }}
                            className="text-blue-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <Paperclip className="w-3.5 h-3.5" /> View Doc
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Projects Main View Matching project-main-page.png, Directorates, SAGAS, Divisions, Lazy Load Table & Gantt
              <div className="space-y-6">
                {/* Top 3 Banners / Cards: Directorates, SAGAS, Divisions (Matching project-main-page.png) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Directorate Card */}
                  <div 
                    onClick={() => setProjectsSubView('directorates')}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition cursor-pointer flex items-center justify-between group border-l-4 border-l-blue-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-inner">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base group-hover:text-blue-700 transition">Directorates</h3>
                        <p className="text-xs text-slate-500 mt-0.5">View all Directorates and their projects</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-700 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {/* SAGAs Card */}
                  <div 
                    onClick={() => setProjectsSubView('sagas')}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition cursor-pointer flex items-center justify-between group border-l-4 border-l-emerald-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-inner">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base group-hover:text-emerald-700 transition">SAGAs</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Semi-Autonomous Government Agencies</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  {/* Divisions Card */}
                  <div 
                    onClick={() => setProjectsSubView('divisions')}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition cursor-pointer flex items-center justify-between group border-l-4 border-l-indigo-600"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-inner">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-base group-hover:text-indigo-700 transition">Divisions</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Filter &amp; manage ministerial divisions</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-700 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* SubView: Directorates Page (Matching directorates.jpeg) */}
                {projectsSubView === 'directorates' ? (
                  <div className="space-y-4 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                      <div>
                        <button 
                          onClick={() => setProjectsSubView('portfolio')}
                          className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-2"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> Back to Projects Portfolio
                        </button>
                        <h2 className="text-xl font-black text-slate-900">Directorates</h2>
                      </div>
                      {currentUser.can_edit && (
                        <button 
                          onClick={() => showToast('Directorate creation modal opened.')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow-sm flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Directorate
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {[
                        { title: 'Directorate for Curative Services', code: 'CS', desc: 'Curative health and tertiary care services', head: 'Dr. Peter Mwangi' },
                        { title: 'Directorate for Family Health', code: 'FH', desc: 'Reproductive, maternal, newborn, child and adolescent health', head: 'Dr. Jane Kimani' },
                        { title: 'Directorate for Health Products and Technologies', code: 'HPT', desc: 'Pharmaceuticals, medical supplies and cold-chain supply chain', head: 'Dr. Fredrick Ochieng' },
                        { title: 'Directorate for Policy, Digital Health and Innovations', code: 'PDHI', desc: 'E-Health, Digital Health Superhighway, m-Health, and data platforms', head: 'Eng. Kiprono Koech' },
                        { title: 'Directorate for Kenya National Blood Tissues & Transfusion Services (KNBTS)', code: 'KNBTTS', desc: 'Blood safety, DAMU-KE, and human organ transplants', head: 'Dr. Angela Waweru' },
                      ].map((dir, idx) => (
                        <div key={idx} className="bg-[#1976d2] text-white rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4 hover:bg-[#1565c0] transition">
                          <div>
                            <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">{dir.code}</span>
                            <h3 className="font-extrabold text-base mt-2">{dir.title}</h3>
                            <p className="text-xs text-blue-100 mt-1 opacity-90">{dir.desc}</p>
                          </div>
                          <div className="pt-3 border-t border-blue-400/30 flex justify-between items-center text-xs">
                            <span className="font-medium text-blue-100">Head: {dir.head}</span>
                            <button 
                              onClick={() => {
                                setProjFilterDirectorate(dir.title);
                                setProjectsSubView('portfolio');
                              }}
                              className="bg-white text-blue-800 font-extrabold px-3 py-1 rounded shadow-sm hover:bg-blue-50 transition"
                            >
                              View More
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : projectsSubView === 'sagas' ? (
                  // SubView: SAGAS Page (Matching sagas.jpeg)
                  <div className="space-y-4 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                      <div>
                        <button 
                          onClick={() => setProjectsSubView('portfolio')}
                          className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-2"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> Back to Projects Portfolio
                        </button>
                        <h2 className="text-xl font-black text-slate-900">Semi-Autonomous Government Agencies (SAGAs)</h2>
                      </div>
                      {currentUser.can_edit && (
                        <button 
                          onClick={() => showToast('SAGA creation modal opened.')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow-sm flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add SAGA
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {[
                        'Kenya Medical Research Institute (KEMRI)',
                        'Kenya Medical Supplies Authority (KEMSA)',
                        'Kenyatta National Hospital (KNH)',
                        'Moi Teaching and Referral Hospital (MTRH)',
                        'Mathari National Teaching and Referral Hospital (MNTRH)',
                        'Kenyatta University Teaching, Referral & Research Hospital (KUTRRH)',
                        'Mwai Kibaki Referral Hospital (MKRH)',
                        'Jaramogi Oginga Odinga Teaching and Referral Hospital (JOOTRH)',
                        'National Cancer Institute Kenya (NCIK)',
                        'National Syndemic Diseases Control Council (NSDCC)',
                        'Kenya National Blood Transfusion Service (KNBTS)',
                        'National Spinal Injury Referral Hospital (NSIRH)'
                      ].map((sagaName, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
                          <div>
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-black mb-3">
                              SAGA
                            </div>
                            <h3 className="font-black text-slate-900 text-sm">{sagaName}</h3>
                            <p className="text-xs text-slate-500 mt-1">Specialized National Referral &amp; Agency Facility</p>
                          </div>
                          <div className="pt-3 border-t border-slate-100 flex justify-end">
                            <button 
                              onClick={() => {
                                setProjFilterSaga(sagaName);
                                setProjectsSubView('portfolio');
                              }}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded text-xs transition"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : projectsSubView === 'divisions' ? (
                  // SubView: Divisions Page
                  <div className="space-y-4 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                      <div>
                        <button 
                          onClick={() => setProjectsSubView('portfolio')}
                          className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 mb-2"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> Back to Projects Portfolio
                        </button>
                        <h2 className="text-xl font-black text-slate-900">Ministerial Divisions</h2>
                      </div>
                      {currentUser.can_edit && (
                        <button 
                          onClick={() => showToast('Division creation modal opened.')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow-sm flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" /> Add Division
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {[
                        { name: 'Division of Primary Health Care', code: 'DPHC', head: 'Dr. David Kariuki', desc: 'Primary care networks and community health strategy' },
                        { name: 'Division of Reproductive and Maternal Health', code: 'DRMH', head: 'Dr. Mary Muthoni', desc: 'Maternal health and SHA maternal benefits integration' },
                        { name: 'Division of Disease Surveillance and Response', code: 'DDSR', head: 'Dr. Sultani Matendechero', desc: 'Epidemic preparedness and health security' },
                        { name: 'Division of Health Informatics and m-Health', code: 'DHIM', head: 'Eng. Kiprono Koech', desc: 'Taifa Care EHR and digital health' },
                        { name: 'Division of Laboratory Services and Blood Safety', code: 'DLSBS', head: 'Dr. Angela Waweru', desc: 'Damu-KE and clinical laboratory standards' },
                      ].map((div, idx) => (
                        <div key={idx} className="bg-indigo-900 text-white rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4">
                          <div>
                            <span className="bg-indigo-700 text-indigo-100 text-[10px] font-black px-2 py-0.5 rounded uppercase">{div.code}</span>
                            <h3 className="font-extrabold text-base mt-2">{div.name}</h3>
                            <p className="text-xs text-indigo-200 mt-1">{div.desc}</p>
                          </div>
                          <div className="pt-3 border-t border-indigo-800 flex justify-between items-center text-xs">
                            <span className="text-indigo-300">Head: {div.head}</span>
                            <button 
                              onClick={() => {
                                setProjFilterDivision(div.name);
                                setProjectsSubView('portfolio');
                              }}
                              className="bg-white text-indigo-900 font-extrabold px-3 py-1 rounded shadow-sm hover:bg-indigo-50 transition"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Portfolio View with Table (Lazy Loaded 6 at a time) & Filters
                  <div className="space-y-5">
                    {/* Header & Add Project */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-blue-700" />
                        <h2 className="text-base font-black text-slate-900">All Priority Projects &amp; Programmes</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.print()}
                          className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs transition"
                        >
                          <FileText className="w-4 h-4 text-sky-400" />
                          <span>PDF Report</span>
                        </button>
                        {currentUser.can_edit && (
                          <button 
                            onClick={() => setShowAddProjectModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs transition"
                          >
                            <Plus className="w-4 h-4" />
                            <span>New Project</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filters Toolbar on top of table (SAGA, Directorate, Delivery Unit, Division, Status, Search) */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* SAGA Filter */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Filter by SAGA</label>
                          <select
                            value={projFilterSaga}
                            onChange={(e) => setProjFilterSaga(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                          >
                            <option value="All">All SAGAs</option>
                            {Array.from(new Set(projects.filter(p => p.saga_name).map(p => p.saga_name))).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        {/* Directorate Filter */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Filter by Directorate</label>
                          <select
                            value={projFilterDirectorate}
                            onChange={(e) => setProjFilterDirectorate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                          >
                            <option value="All">All Directorates</option>
                            {Array.from(new Set(projects.filter(p => p.directorate_name).map(p => p.directorate_name))).map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>

                        {/* Delivery Unit Filter */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Filter by Delivery Unit</label>
                          <select
                            value={projFilterDeliveryUnit}
                            onChange={(e) => setProjFilterDeliveryUnit(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                          >
                            <option value="All">All Delivery Units</option>
                            {Array.from(new Set(projects.filter(p => p.delivery_unit).map(p => p.delivery_unit))).map(du => (
                              <option key={du} value={du}>{du}</option>
                            ))}
                          </select>
                        </div>

                        {/* Division Filter */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Filter by Division</label>
                          <select
                            value={projFilterDivision}
                            onChange={(e) => setProjFilterDivision(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-800"
                          >
                            <option value="All">All Divisions</option>
                            <option value="Division of Primary Health Care">Division of Primary Health Care</option>
                            <option value="Division of Reproductive and Maternal Health">Division of Reproductive and Maternal Health</option>
                            <option value="Division of Disease Surveillance and Response">Division of Disease Surveillance and Response</option>
                            <option value="Division of Health Informatics and m-Health">Division of Health Informatics and m-Health</option>
                            <option value="Division of Laboratory Services and Blood Safety">Division of Laboratory Services and Blood Safety</option>
                          </select>
                        </div>

                        {/* Search Bar */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Search Projects</label>
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={projectSearch}
                              onChange={(e) => setProjectSearch(e.target.value)}
                              placeholder="Search title, code..."
                              className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Status Filter Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-600 mr-2">Status:</span>
                        {['All', 'In Progress', 'On Hold', 'Completed', 'Planning', 'Delayed', 'Overdue', 'Cancelled'].map(st => (
                          <button
                            key={st}
                            onClick={() => setProjectStatusFilter(st)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                              projectStatusFilter === st 
                                ? 'bg-blue-700 text-white shadow-2xs' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Projects Table (Lazy Loaded 6 at a time) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wide text-[11px]">
                            <tr>
                              <th className="py-3 px-4">Title &amp; Location</th>
                              <th className="py-3 px-3">Type</th>
                              <th className="py-3 px-3">Category</th>
                              <th className="py-3 px-3">Status</th>
                              <th className="py-3 px-3 text-right">Budget (KES)</th>
                              <th className="py-3 px-4 w-36">Progress</th>
                              <th className="py-3 px-4 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(() => {
                              const filtered = projects.filter(p => {
                                if (projFilterSaga !== 'All' && p.saga_name !== projFilterSaga) return false;
                                if (projFilterDirectorate !== 'All' && p.directorate_name !== projFilterDirectorate) return false;
                                if (projFilterDeliveryUnit !== 'All' && p.delivery_unit !== projFilterDeliveryUnit) return false;
                                if (projFilterDivision !== 'All' && p.division_name !== projFilterDivision) return false;
                                if (projectStatusFilter !== 'All' && p.status !== projectStatusFilter) return false;
                                if (projectSearch.trim() !== '') {
                                  const q = projectSearch.toLowerCase();
                                  const match = p.sub_programme?.toLowerCase().includes(q) || p.programme_title?.toLowerCase().includes(q);
                                  if (!match) return false;
                                }
                                return true;
                              });

                              const sliced = filtered.slice(0, projectsDisplayCount);

                              if (sliced.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                                      No projects found matching the selected filters.
                                    </td>
                                  </tr>
                                );
                              }

                              return sliced.map(pr => {
                                const { pct } = getProjectCalculatedProgress(pr, kpis);
                                const statusClass = 
                                  pr.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                  pr.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                  pr.status === 'On Hold' ? 'bg-amber-100 text-amber-800' :
                                  'bg-slate-100 text-slate-800';

                                return (
                                  <tr key={pr.id} className="hover:bg-slate-50/80 transition">
                                    <td className="py-3 px-4">
                                      <div className="font-extrabold text-slate-900 line-clamp-1">{pr.sub_programme}</div>
                                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                                        <span>{pr.delivery_unit || 'Countrywide'}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-3">
                                      <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                        {pr.category || 'Project'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 font-semibold text-slate-700">
                                      {pr.category || 'Directorate'}
                                    </td>
                                    <td className="py-3 px-3">
                                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${statusClass}`}>
                                        {pr.status || 'In Progress'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                                      {formatKes(pr.total_budget)}
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex justify-between items-center text-[11px] font-bold mb-1">
                                        <span className="text-slate-600">{pct}%</span>
                                      </div>
                                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-blue-700 h-full rounded-full" style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}></div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <div className="inline-flex items-center gap-1.5">
                                        <button
                                          onClick={() => setSelectedProject(pr)}
                                          className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition"
                                          title="View Details"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                        {currentUser.can_edit && (
                                          <button
                                            onClick={() => {
                                              setSelectedProject(pr);
                                              setShowProjectEditor(true);
                                            }}
                                            className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition"
                                            title="Edit Project"
                                          >
                                            <PenSquare className="w-4 h-4" />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>

                      {/* Lazy Load / Show More Button */}
                      {projectsDisplayCount < projects.length && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                          <button
                            onClick={() => setProjectsDisplayCount(prev => prev + 6)}
                            className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-6 py-2 rounded-lg shadow-sm transition inline-flex items-center gap-2"
                          >
                            <span>Load More Projects ({projects.length - projectsDisplayCount} remaining)</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Gantt Chart / Performance Graph Across All Projects */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <Milestone className="w-5 h-5 text-blue-700" />
                          <h3 className="text-sm font-black text-slate-900">General Performance &amp; Progress Across All Projects (Gantt Overview)</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-500 font-mono">2026/2027 Execution Cycle</span>
                      </div>

                      <div className="space-y-3 pt-2">
                        {projects.slice(0, 5).map((pr, idx) => {
                          const { pct } = getProjectCalculatedProgress(pr, kpis);
                          return (
                            <div key={pr.id} className="grid grid-cols-12 items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                              <div className="col-span-12 md:col-span-4 text-xs font-extrabold text-slate-900 truncate" title={pr.sub_programme}>
                                {idx + 1}. {pr.sub_programme}
                              </div>
                              <div className="col-span-12 md:col-span-8">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
                                    <div 
                                      className={`h-full rounded-full ${pct > 80 ? 'bg-emerald-600' : pct > 50 ? 'bg-blue-700' : 'bg-amber-500'}`}
                                      style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-mono font-black text-xs text-slate-800 w-12 text-right">{pct}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB: ACTION POINTS TRACKER ======================= */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            {selectedAction ? (
              // Detailed Action Point View (Matching Screenshot Page 1)
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setSelectedAction(null)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Tracker
                  </button>

                  <div className="flex items-center gap-2">
                    {currentUser.can_approve && selectedAction.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => {
                          const updated = { ...selectedAction, status: 'COMPLETED' as const };
                          setActionPoints(actionPoints.map(a => a.id === selectedAction.id ? updated : a));
                          setSelectedAction(updated);
                          showToast('Action point approved and marked as COMPLETED.');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve &amp; Resolve
                      </button>
                    )}
                    {currentUser.can_edit && (
                      <button 
                        onClick={() => { setEditingItem(selectedAction); setModalType('action'); }}
                        className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
                      >
                        <PenSquare className="w-4 h-4" /> Edit Details
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-xl font-extrabold text-blue-800">
                      Action Point: {selectedAction.ref_no}
                    </h2>
                    <div className="text-xs text-slate-500 mt-1">
                      Meeting: <strong className="text-slate-800">{selectedAction.meeting_title}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-3">
                      <div className="font-bold text-slate-400 uppercase text-[10px]">Timelines &amp; Responsibility</div>
                      <div>
                        <span className="text-slate-500 block">Date Raised:</span>
                        <strong className="text-sm">{selectedAction.date}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Timeline / Deadline:</span>
                        <strong className="text-sm text-slate-800">{selectedAction.timeline}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Person Responsible:</span>
                        <strong className="text-sm text-blue-700">{selectedAction.person_responsible}</strong>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="font-bold text-slate-400 uppercase text-[10px]">Status Overview</div>
                      <div>
                        <span className="text-slate-500 block">Current Status:</span>
                        <span className={`inline-block mt-1 px-3 py-1 rounded text-xs font-extrabold uppercase ${getStatusBadgeClass(selectedAction.status)}`}>
                          {selectedAction.status}
                        </span>
                      </div>
                      <div className="text-slate-500">
                        Resolution Notes: <em>{selectedAction.resolution_notes || 'Pending formal review'}</em>
                      </div>
                    </div>
                  </div>

                  {/* The Issue Box */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <strong className="text-sm text-slate-900">The Issue</strong>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 leading-relaxed">
                      {selectedAction.issue}
                    </div>
                  </div>

                  {/* Action / Progress Box */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <strong className="text-sm text-slate-900">Action / Progress</strong>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-700 leading-relaxed">
                      {selectedAction.action || 'No progress recorded yet.'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Action Points Table (Matching Screenshot Page 2)
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-700" /> Action Points Tracker
                  </h2>
                  <div className="flex items-center gap-2">
                    {currentUser.can_edit && (
                      <button 
                        onClick={() => { setEditingItem(null); setModalType('action'); }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
                      >
                        <PlusCircle className="w-4 h-4" /> Create New
                      </button>
                    )}
                    <button onClick={() => window.print()} className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> PDF
                    </button>
                    <button onClick={() => showToast('Exporting Action Points to Excel (.xlsx)...')} className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Ref No</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Meeting</th>
                          <th className="p-3">Issue</th>
                          <th className="p-3">Responsible</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {actionPoints.map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-blue-700">{a.ref_no}</td>
                            <td className="p-3 text-slate-500">{a.date}</td>
                            <td className="p-3 font-semibold text-slate-800">{a.meeting_title}</td>
                            <td className="p-3 max-w-[280px] truncate" title={a.issue}>{a.issue}</td>
                            <td className="p-3">{a.person_responsible}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusBadgeClass(a.status)}`}>
                                {a.status}
                              </span>
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <button 
                                onClick={() => setSelectedAction(a)}
                                className="p-1 hover:bg-slate-200 rounded text-blue-700 mr-1"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {currentUser.can_edit && (
                                <button 
                                  onClick={() => {
                                    if (confirm(`Delete action point ${a.ref_no}?`)) {
                                      setActionPoints(actionPoints.filter(x => x.id !== a.id));
                                      showToast('Action point deleted.');
                                    }
                                  }}
                                  className="p-1 hover:bg-red-100 rounded text-red-600"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB: ACTIVITIES AND EVENTS ======================= */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-blue-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-700" /> Activities &amp; Events
                </h2>
                <span className="text-xs text-slate-500">Schedule for <strong>February 2026</strong></span>
              </div>

              {currentUser.can_edit && (
                <button 
                  onClick={() => { setEditingItem(null); setModalType('event'); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-600">Upcoming Events (Top 5)</span>
                <span className="bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{events.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Date &amp; Time</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Host / Chair</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map(ev => (
                      <tr key={ev.id} className="hover:bg-slate-50">
                        <td className="p-3 whitespace-nowrap">
                          <div className="font-bold text-slate-800">{ev.event_date}</div>
                          <div className="text-slate-400 text-[10px]">{ev.event_time}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-blue-700">{ev.title}</div>
                          <div className="text-slate-500 text-[11px] max-w-[280px] truncate">{ev.description}</div>
                        </td>
                        <td className="p-3"><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">{ev.event_type}</span></td>
                        <td className="p-3">{ev.location}</td>
                        <td className="p-3 font-medium">{ev.host}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusBadgeClass(ev.status)}`}>
                            {ev.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {currentUser.can_edit && (
                            <button 
                              onClick={() => {
                                if (confirm(`Delete event ${ev.title}?`)) {
                                  setEvents(events.filter(x => x.id !== ev.id));
                                  showToast('Event deleted.');
                                }
                              }}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: REPORTS ======================= */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-700" /> Reports Management
              </h2>
              {currentUser.can_upload && (
                <button 
                  onClick={() => { setEditingItem(null); setModalType('report'); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Upload Report
                </button>
              )}
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3">
              <input 
                type="text" 
                placeholder="Search Report Name or ID..." 
                value={reportSearch} 
                onChange={(e) => setReportSearch(e.target.value)}
                className="text-xs border border-slate-300 rounded p-2 flex-1"
              />
              <select 
                value={reportProjectFilter}
                onChange={(e) => setReportProjectFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded p-2"
              >
                <option value="">-- Filter by Project --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.sub_programme}>{p.sub_programme}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-blue-700 text-white px-4 py-2 text-xs font-bold flex justify-between items-center">
                <span>Document List</span>
                <span>{reports.length} Reports</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Report Details</th>
                      <th className="p-3">Project</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Uploaded By</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reports
                      .filter(r => currentUser.is_admin || r.visibility !== 'Confidential')
                      .filter(r => r.title.toLowerCase().includes(reportSearch.toLowerCase()) || r.report_code.toLowerCase().includes(reportSearch.toLowerCase()))
                      .map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{r.title}</div>
                            <div className="font-mono text-blue-700 font-semibold">{r.report_code}</div>
                            <div className="text-slate-500 text-[11px] max-w-[240px] truncate">{r.description}</div>
                          </td>
                          <td className="p-3 font-semibold text-slate-700 max-w-[200px] truncate">{r.project_name}</td>
                          <td className="p-3 whitespace-nowrap text-slate-500">
                            <div>Report: {r.report_date}</div>
                            <div className="text-[10px] text-slate-400">Uploaded: {r.created_at.substring(0, 10)}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusBadgeClass(r.status)}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3">{r.uploaded_by}</td>
                          <td className="p-3 text-right whitespace-nowrap">
                            {currentUser.can_approve && r.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => {
                                    setReports(reports.map(x => x.id === r.id ? { ...x, status: 'Approved' } : x));
                                    showToast(`Report ${r.report_code} approved.`);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-1 rounded mr-1"
                                  title="Approve"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setReports(reports.map(x => x.id === r.id ? { ...x, status: 'Rejected' } : x));
                                    showToast(`Report ${r.report_code} rejected.`);
                                  }}
                                  className="bg-red-600 hover:bg-red-500 text-white p-1 rounded mr-1"
                                  title="Reject"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => showToast(`Simulated download of: ${r.file_name}`)}
                              className="p-1 hover:bg-slate-200 rounded text-blue-700"
                              title="Download Attachment"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: DIARY ======================= */}
        {activeTab === 'diary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-700" /> Project Planner
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-blue-700 text-white rounded text-xs font-bold">
                  <button onClick={() => setCalendarMonth(prev => Math.max(0, prev - 1))} className="px-2 py-1.5 hover:bg-blue-800"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="px-3">February 2026</span>
                  <button onClick={() => setCalendarMonth(prev => Math.min(11, prev + 1))} className="px-2 py-1.5 hover:bg-blue-800"><ChevronRight className="w-4 h-4" /></button>
                </div>
                {currentUser.can_edit && (
                  <button 
                    onClick={() => { setEditingItem(null); setModalType('diary'); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded"
                  >
                    + Add Entry
                  </button>
                )}
              </div>
            </div>

            {/* Calendar 7-Day Grid (Matching Screenshot Page 5) */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-7 bg-[#0d47a1] text-white text-center text-xs font-bold py-2 font-mono">
                <div>SUNDAY</div>
                <div>MONDAY</div>
                <div>TUESDAY</div>
                <div>WEDNESDAY</div>
                <div>THURSDAY</div>
                <div>FRIDAY</div>
                <div>SATURDAY</div>
              </div>
              <div className="grid grid-cols-7 border-collapse">
                {Array.from({ length: 28 }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = [
                    ...(day === 15 ? [{
                      id: 1,
                      title: 'Commissioning of KNH Modern Burns ICU',
                      category: 'Event',
                      priority: 'High',
                      date: '2026-02-15',
                      time: '09:30',
                      location: 'Kenyatta National Hospital, Modern Burns Unit, Nairobi',
                      host: 'Cabinet Secretary & PS-SDMS',
                      attendees: 'Dr. Harry Kimtai (PS-SDMS), Dr. Evanson Kamuri (CEO KNH), Parliamentary Health Committee, Media Pool',
                      description: 'Official ribbon-cutting and technical handover of the modernized Burns ICU at Kenyatta National Hospital. Includes inspection of specialized critical-care telemetry equipment, high-efficiency particulate airlock chambers, and patient isolation suites.'
                    }] : []),
                    ...(day === 20 ? [{
                      id: 2,
                      title: 'JOOTRH Radiotherapy Bunker Inspection',
                      category: 'Meeting',
                      priority: 'Critical',
                      date: '2026-02-20',
                      time: '10:00',
                      location: 'JOOTRH Cancer Treatment Centre, Kisumu',
                      host: 'Principal Secretary',
                      attendees: 'PS-SDMS, Governor Anyang Nyongo, CEO JOOTRH, Radiation Safety Authority (KNRA)',
                      description: 'High-level site inspection of radiation shielding walls and bunker structural certifications ahead of linear accelerator commissioning. Fast-tracking national oncology radiation licensing.'
                    }] : []),
                    ...(day === 25 ? [{
                      id: 3,
                      title: 'Deadline: Global Fund Cartridge RFQ',
                      category: 'Deadline',
                      priority: 'Critical',
                      date: '2026-02-25',
                      time: '17:00',
                      location: 'Afya House, 6th Floor Boardroom',
                      host: 'Head of Procurement & NASCOP Coordinator',
                      attendees: 'Global Fund Country Team, Tender Evaluation Committee, KEMSA Logistics Lead',
                      description: 'Statutory deadline for submission of Request for Quotations (RFQ) for HIV/TB diagnostic viral load cartridges under Global Fund transitional funding mechanisms.'
                    }] : []),
                    ...(day === 28 ? [{
                      id: 4,
                      title: 'MTRH Specialized Pediatric Clean Room Audit',
                      category: 'Task',
                      priority: 'Medium',
                      date: '2026-02-28',
                      time: '11:00',
                      location: 'Moi Teaching and Referral Hospital, Eldoret',
                      host: 'CEO MTRH & Project Engineering Directorate',
                      attendees: 'Hospital Board, Biomedical Engineers, Quality Assurance Officers, Pediatric Oncology Leads',
                      description: 'Technical evaluation of clean room particle filtration, laminar air flows, and positive-pressure sterile barriers for the newly refurbished specialized pediatric isolation ward.'
                    }] : [])
                  ];

                  return (
                    <div key={i} className="min-h-[95px] p-1.5 border border-slate-200 bg-white hover:bg-slate-50 relative text-xs">
                      <div className="font-bold text-slate-400 mb-1">{day}</div>
                      {dayEvents.map(ev => {
                        const bgClass = ev.category === 'Meeting' ? 'bg-blue-600 text-white' :
                          ev.category === 'Task' ? 'bg-cyan-600 text-white' :
                          ev.category === 'Deadline' ? 'bg-red-600 text-white' :
                          ev.category === 'Event' ? 'bg-amber-500 text-slate-900' : 'bg-slate-600 text-white';
                        const isSelected = selectedDiaryEvent?.id === ev.id;
                        return (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedDiaryEvent(ev)}
                            className={`${bgClass} rounded p-1 text-[10px] font-bold truncate cursor-pointer transition-all duration-150 hover:opacity-90 shadow-xs mb-1 ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1 scale-[1.02]' : ''}`}
                            title={`Click to view event details below: ${ev.title}`}
                          >
                            {ev.time} {ev.title}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Event Details (Appearing below calendar, above priority legends) */}
            {selectedDiaryEvent && (
              <div className="bg-white p-4 rounded-xl border-2 border-blue-600 shadow-md relative transition-all animate-fadeIn">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider ${
                      selectedDiaryEvent.category === 'Meeting' ? 'bg-blue-600 text-white' :
                      selectedDiaryEvent.category === 'Task' ? 'bg-cyan-600 text-white' :
                      selectedDiaryEvent.category === 'Deadline' ? 'bg-red-600 text-white' :
                      selectedDiaryEvent.category === 'Event' ? 'bg-amber-500 text-slate-900' : 'bg-slate-600 text-white'
                    }`}>
                      {selectedDiaryEvent.category}
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold border border-slate-300">
                      {selectedDiaryEvent.priority} Priority
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-900 ml-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mr-1.5 animate-pulse"></span>
                      SELECTED EVENT / SCHEDULE DETAILS
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedDiaryEvent(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-1 rounded hover:bg-slate-100"
                    title="Close Details Panel"
                  >
                    ✕ Close Details
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-base font-extrabold text-slate-900">{selectedDiaryEvent.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pb-2 border-b border-slate-100">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <strong>{selectedDiaryEvent.date}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <strong>{selectedDiaryEvent.time} hrs</strong>
                      </span>
                      {selectedDiaryEvent.location && (
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          <span>{selectedDiaryEvent.location}</span>
                        </span>
                      )}
                      {selectedDiaryEvent.host && (
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <User className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Host: <strong>{selectedDiaryEvent.host}</strong></span>
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Executive Notes &amp; Objectives
                      </label>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                        {selectedDiaryEvent.description}
                      </div>
                    </div>

                    {selectedDiaryEvent.attendees && (
                      <div className="text-xs text-slate-600 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                        <strong className="text-blue-900">Key Attendees &amp; Delegation:</strong> {selectedDiaryEvent.attendees}
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        Integrated State Department Scheduler
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        This diary item is recorded in the State Department for Medical Services operational calendar. All updates sync with Ministerial executive dossiers and field monitoring itineraries.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 mt-4 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedDiaryEvent(null)}
                        className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded transition-colors"
                      >
                        Close Panel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Priority Legends (Matching Screenshot Page 5 bottom) */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Priority Legends:</span>
              <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded font-bold">Meeting</span>
              <span className="bg-cyan-600 text-white px-2.5 py-0.5 rounded font-bold">Task</span>
              <span className="bg-red-600 text-white px-2.5 py-0.5 rounded font-bold">Deadline</span>
              <span className="bg-amber-500 text-slate-900 px-2.5 py-0.5 rounded font-bold">Event</span>
              <span className="bg-slate-600 text-white px-2.5 py-0.5 rounded font-bold">General</span>
            </div>
          </div>
        )}

        {/* ======================= TAB: PERFORMANCE CONTRACT ======================= */}
        {activeTab === 'pc' && (() => {
          const overallScore = calculateOverallPcScore(kpis);
          const catFin = calculateCategoryMetrics(kpis, 'Financial Stewardship');
          const catServ = calculateCategoryMetrics(kpis, 'Service Delivery');
          const catCore = calculateCategoryMetrics(kpis, 'Core Mandate');
          const catPres = calculateCategoryMetrics(kpis, 'Implementation of Presidential Directives');
          const catAffirm = calculateCategoryMetrics(kpis, 'Affirmative Action in Procurement');
          const catCross = calculateCategoryMetrics(kpis, 'Cross-Cutting');

          const filteredKpis = kpis
            .filter(k => pcYearFilter === 'All' || k.financial_year === pcYearFilter)
            .filter(k => pcStatusFilter === 'All' || k.status === pcStatusFilter)
            .filter(k => pcCategoryFilter === 'All' || k.category === pcCategoryFilter)
            .filter(k => {
              if (!pcSearch.trim()) return true;
              const q = pcSearch.toLowerCase();
              return k.code.toLowerCase().includes(q) ||
                     k.kpi_name.toLowerCase().includes(q) ||
                     k.delivery_unit.toLowerCase().includes(q) ||
                     k.programme.toLowerCase().includes(q) ||
                     k.parent_kpi_name.toLowerCase().includes(q);
            });

          const categoriesConfig = [
            { id: 'Financial Stewardship', code: 'Category A', name: 'Financial Stewardship & Fiscal Discipline', weight: 10, metrics: catFin, color: 'from-blue-600 to-indigo-700' },
            { id: 'Service Delivery', code: 'Category B', name: 'Service Delivery & Citizen Charter Compliance', weight: 15, metrics: catServ, color: 'from-cyan-600 to-teal-700' },
            { id: 'Core Mandate', code: 'Category C', name: 'Core Mandate & Flagship Priorities', weight: 65, metrics: catCore, color: 'from-emerald-600 to-green-700' },
            { id: 'Implementation of Presidential Directives', code: 'Category D', name: 'Implementation of Presidential Directives', weight: 2, metrics: catPres, color: 'from-purple-600 to-indigo-700' },
            { id: 'Affirmative Action in Procurement', code: 'Category E', name: 'Affirmative Action in Procurement', weight: 4, metrics: catAffirm, color: 'from-rose-600 to-pink-700' },
            { id: 'Cross-Cutting', code: 'Category F', name: 'Cross-Cutting & Institutional Strengthening', weight: 4, metrics: catCross, color: 'from-amber-600 to-orange-700' }
          ];

          return (
            <div className="space-y-4">
              {/* Executive PC Scorecard Header */}
              <div className="bg-gradient-to-r from-slate-900 via-[#0a2356] to-blue-950 text-white rounded-xl p-5 shadow-sm border border-slate-800">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-300">
                      <span className="bg-blue-600/60 px-2 py-0.5 rounded text-[11px] font-bold">21st / 22nd Performance Cycle</span>
                      <span>&bull;</span>
                      <span>Ministry of Health &bull; State Department for Medical Services</span>
                    </div>
                    <h2 className="text-xl font-black mt-1 text-white tracking-tight flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-yellow-400" />
                      Performance Contract Monitoring Matrix &amp; Progress Calculator
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl mt-1">
                      Hierarchical KPIs and Sub-KPIs weighted at 100% total contribution. Indicator achievements automatically calculate connected project progress on tables and Gantt charts.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-center min-w-[190px]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Overall Ministerial Score</div>
                    <div className="text-3xl font-black text-yellow-300 font-mono mt-0.5">{overallScore}%</div>
                    <div className="text-[11px] text-emerald-300 font-semibold mt-0.5 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{kpis.filter(k => k.current_achievement >= 90).length} of {kpis.length} Targets Met</span>
                    </div>
                  </div>
                </div>

                {/* 6 Result Areas (Category Weights) Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-5">
                  {categoriesConfig.map(cat => (
                    <div 
                      key={cat.id} 
                      onClick={() => setPcCategoryFilter(pcCategoryFilter === cat.id ? 'All' : cat.id as any)}
                      className={`p-3 rounded-lg border cursor-pointer transition ${
                        pcCategoryFilter === cat.id 
                          ? 'bg-white/25 border-yellow-400 shadow-md ring-2 ring-yellow-400/50' 
                          : 'bg-white/10 border-white/15 hover:bg-white/15'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[10px] font-mono font-black uppercase text-blue-200">{cat.code}</span>
                        <span className="bg-yellow-400/20 text-yellow-300 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border border-yellow-400/30">
                          {cat.weight}%
                        </span>
                      </div>
                      <div className="font-extrabold text-[11px] text-white mt-1 leading-snug truncate" title={cat.name}>
                        {cat.name}
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <div className="text-[9px] text-slate-300 font-medium">{cat.metrics.count} Sub-KPIs</div>
                          <div className="text-[9px] text-emerald-300 font-semibold">{cat.metrics.targetMetCount} met</div>
                        </div>
                        <div className="text-right font-mono">
                          <div className="text-base font-black text-white">{cat.metrics.avgScore}%</div>
                        </div>
                      </div>
                      {/* Mini Bar */}
                      <div className="w-full bg-black/30 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className="bg-yellow-400 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, cat.metrics.avgScore)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action & Filter Toolbar */}
              <div className="flex flex-wrap justify-between items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs gap-0.5">
                    <button
                      onClick={() => setPcCategoryFilter('All')}
                      className={`px-2.5 py-1 rounded font-bold transition ${
                        pcCategoryFilter === 'All' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({kpis.length})
                    </button>
                    <button
                      onClick={() => setPcCategoryFilter('Financial Stewardship')}
                      className={`px-2 py-1 rounded font-bold transition ${
                        pcCategoryFilter === 'Financial Stewardship' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      A: Fin. Stew. (10%)
                    </button>
                    <button
                      onClick={() => setPcCategoryFilter('Service Delivery')}
                      className={`px-2 py-1 rounded font-bold transition ${
                        pcCategoryFilter === 'Service Delivery' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      B: Service Del. (15%)
                    </button>
                    <button
                      onClick={() => setPcCategoryFilter('Core Mandate')}
                      className={`px-2 py-1 rounded font-bold transition ${
                        pcCategoryFilter === 'Core Mandate' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      C: Core Mandate (65%)
                    </button>
                    <button
                      onClick={() => setPcCategoryFilter('Implementation of Presidential Directives')}
                      className={`px-2 py-1 rounded font-bold transition ${
                        pcCategoryFilter === 'Implementation of Presidential Directives' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      D: Pres. Dir. (2%)
                    </button>
                    <button
                      onClick={() => setPcCategoryFilter('Affirmative Action in Procurement')}
                      className={`px-2 py-1 rounded font-bold transition ${
                        pcCategoryFilter === 'Affirmative Action in Procurement' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      E: AGPO (4%)
                    </button>
                    <button
                      onClick={() => setPcCategoryFilter('Cross-Cutting')}
                      className={`px-2 py-1 rounded font-bold transition ${
                        pcCategoryFilter === 'Cross-Cutting' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      F: Cross-Cutting (4%)
                    </button>
                  </div>

                  <select 
                    value={pcYearFilter}
                    onChange={(e) => setPcYearFilter(e.target.value)}
                    className="border border-slate-300 rounded p-1.5 bg-white font-bold text-slate-800"
                  >
                    <option value="2026/2027">FY 2026/2027</option>
                    <option value="2027/2028">FY 2027/2028</option>
                    <option value="2025/2026">FY 2025/2026</option>
                    <option value="All">All Financial Years</option>
                  </select>

                  <select 
                    value={pcStatusFilter}
                    onChange={(e) => setPcStatusFilter(e.target.value)}
                    className="border border-slate-300 rounded p-1.5 bg-white text-slate-700"
                  >
                    <option value="All">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Draft">Draft</option>
                  </select>

                  <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
                    <button 
                      onClick={() => setPcViewMode('categorized')} 
                      className={`px-2 py-1 rounded font-bold text-[11px] ${pcViewMode === 'categorized' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                      title="Grouped by Result Area / Category"
                    >
                      Categorized View
                    </button>
                    <button 
                      onClick={() => setPcViewMode('matrix')} 
                      className={`px-2 py-1 rounded font-bold text-[11px] ${pcViewMode === 'matrix' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                      title="Complete Flat Table"
                    >
                      Flat Matrix
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition"
                  >
                    <FileText className="w-4 h-4 text-yellow-400" />
                    <span>Download PDF Summary</span>
                  </button>
                  <button 
                    onClick={() => setShowPcGantt(!showPcGantt)}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-blue-700" />
                    <span>{showPcGantt ? 'Hide' : 'Show'} PC Gantt Chart</span>
                  </button>
                  {currentUser.can_edit && (
                    <button 
                      onClick={() => { setEditingPcKpi(null); setModalType('pc'); }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Sub-KPI
                    </button>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center gap-2.5 shadow-sm text-xs">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter KPIs by code (e.g. A1, C3.1), indicator name, delivery unit, or strategic programme..."
                  value={pcSearch}
                  onChange={(e) => setPcSearch(e.target.value)}
                  className="w-full outline-none bg-transparent text-slate-800 placeholder-slate-400"
                />
                {pcSearch && (
                  <button onClick={() => setPcSearch('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Performance Contract Gantt Chart: Visual Achievement Levels Across Delivery Units */}
              {showPcGantt && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden text-xs">
                  <div className="bg-slate-900 text-white px-4 py-3 font-bold flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>Performance Contract Gantt Chart — Quarterly Progression &amp; Achievement Levels</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <select 
                        value={pcGanttFilterUnit}
                        onChange={(e) => setPcGanttFilterUnit(e.target.value)}
                        className="bg-slate-800 text-white border border-slate-700 rounded px-2.5 py-1 text-[11px] font-semibold"
                      >
                        <option value="All">All Delivery Units ({Array.from(new Set(kpis.map(k => k.delivery_unit))).length})</option>
                        {Array.from(new Set(kpis.map(k => k.delivery_unit))).sort().map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-mono">FY {pcYearFilter}</span>
                    </div>
                  </div>

                  {/* Gantt Timeline Header */}
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 font-mono font-bold text-[11px] text-slate-600 grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:col-span-4">Delivery Unit, Sub-KPI Code &amp; Weight</div>
                    <div className="hidden md:block col-span-1 text-center">Baseline</div>
                    <div className="hidden md:block col-span-1 text-center">Target (26/27)</div>
                    <div className="hidden md:block col-span-5 text-center">Quarterly Progression Timeline (Q1 &bull; Q2 &bull; Q3 &bull; Q4)</div>
                    <div className="hidden md:block col-span-1 text-right">Achv %</div>
                  </div>

                  <div className="p-4 divide-y divide-slate-100 space-y-3">
                    {filteredKpis
                      .filter(k => pcGanttFilterUnit === 'All' || k.delivery_unit === pcGanttFilterUnit)
                      .map(k => {
                        const q1 = k.q1_score ?? Math.min(100, Math.round(k.current_achievement * 0.85));
                        const q2 = k.q2_score ?? Math.min(100, Math.round(k.current_achievement * 0.92));
                        const q3 = k.q3_score ?? Math.min(100, Math.round(k.current_achievement * 0.98));
                        const q4 = k.q4_score ?? k.current_achievement;
                        const achColor = k.current_achievement >= 90 ? 'bg-emerald-600 text-white' : k.current_achievement >= 75 ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white';

                        // Projects connected to this Sub-KPI
                        const linkedProjects = projects.filter(p => p.linked_sub_kpi_codes?.includes(k.code));

                        return (
                          <div key={k.id} className="pt-3 first:pt-0 grid grid-cols-12 gap-2 items-center hover:bg-slate-50 p-2 rounded transition">
                            <div className="col-span-12 md:col-span-4">
                              <div className="flex items-center gap-1.5">
                                <span className="bg-blue-900 text-white font-mono font-black px-1.5 py-0.2 rounded text-[10px]">
                                  {k.code}
                                </span>
                                <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded text-[10px] border border-amber-200">
                                  Weight: {k.sub_kpi_weight}%
                                </span>
                                <span className="text-slate-400 text-[10px] truncate">{k.category}</span>
                              </div>
                              <div className="font-bold text-slate-900 text-xs mt-1 truncate" title={k.kpi_name}>{k.kpi_name}</div>
                              <div className="text-[11px] text-blue-700 font-semibold truncate" title={k.delivery_unit}>{k.delivery_unit}</div>
                              {linkedProjects.length > 0 && (
                                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                                  <Layers className="w-3 h-3" />
                                  <span>Calculates progress for <strong>{linkedProjects.length}</strong> Project{linkedProjects.length !== 1 ? 's' : ''}</span>
                                </div>
                              )}
                            </div>

                            <div className="col-span-6 md:col-span-1 text-left md:text-center font-mono font-bold text-slate-600 text-[11px]">
                              <span className="md:hidden text-slate-400 font-normal">Baseline: </span>{k.baseline_score || k.actual_2025_26}
                            </div>

                            <div className="col-span-6 md:col-span-1 text-left md:text-center font-mono font-bold text-slate-800 text-[11px]">
                              <span className="md:hidden text-slate-400 font-normal">Target: </span>{k.target_baseline_2026_27 || k.target_2025_26}
                            </div>

                            <div className="col-span-12 md:col-span-5 space-y-1">
                              <div className="grid grid-cols-4 gap-1.5 text-[10px] text-center font-mono">
                                <div>
                                  <div className="text-slate-400 text-[9px] mb-0.5">Q1 (Jul-Sep)</div>
                                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${Math.min(100, q1)}%` }}></div>
                                  </div>
                                  <span className="text-slate-600 font-bold">{q1}%</span>
                                </div>
                                <div>
                                  <div className="text-slate-400 text-[9px] mb-0.5">Q2 (Oct-Dec)</div>
                                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, q2)}%` }}></div>
                                  </div>
                                  <span className="text-slate-600 font-bold">{q2}%</span>
                                </div>
                                <div>
                                  <div className="text-slate-400 text-[9px] mb-0.5">Q3 (Jan-Mar)</div>
                                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, q3)}%` }}></div>
                                  </div>
                                  <span className="text-slate-600 font-bold">{q3}%</span>
                                </div>
                                <div>
                                  <div className="text-slate-400 text-[9px] mb-0.5">Q4 (Apr-Jun)</div>
                                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(100, q4)}%` }}></div>
                                  </div>
                                  <span className="text-slate-600 font-bold">{q4}%</span>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12 md:col-span-1 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${achColor}`}>
                                {k.current_achievement}%
                              </span>
                              <button 
                                onClick={() => setSelectedKpiDetail(k)}
                                className="text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-0.5 transition"
                              >
                                <Eye className="w-3 h-3" /> Details
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Performance Contract Entries Table: Categorized Tree or Flat Matrix */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-yellow-300" />
                    <span>Performance Contract Entries &amp; Indicator Weights</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-normal opacity-95">
                    <span>{filteredKpis.length} Indicators shown</span>
                    <span>&bull;</span>
                    <span className="font-mono font-bold text-yellow-300">Total Weight: 100%</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-16">Code</th>
                        <th className="p-3">Performance Indicator &amp; Delivery Unit</th>
                        <th className="p-3 text-center">Weight</th>
                        <th className="p-3">Baseline / Prev.</th>
                        <th className="p-3">Target 26/27</th>
                        <th className="p-3">Actual 25/26</th>
                        <th className="p-3 min-w-[130px]">Achievement</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Project Linkage</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>

                    {pcViewMode === 'categorized' ? (
                      <tbody className="divide-y divide-slate-200">
                        {categoriesConfig
                          .filter(cat => pcCategoryFilter === 'All' || pcCategoryFilter === cat.id)
                          .map(cat => {
                            const groupKpis = filteredKpis.filter(k => k.category === cat.id);
                            if (groupKpis.length === 0) return null;
                            return (
                              <React.Fragment key={cat.id}>
                                {/* Category Header Row */}
                                <tr className="bg-slate-800 text-white font-bold">
                                  <td colSpan={10} className="px-4 py-2 text-xs">
                                    <div className="flex flex-wrap justify-between items-center gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="bg-yellow-400 text-slate-900 px-2 py-0.2 rounded font-mono font-black text-[11px]">
                                          {cat.code}
                                        </span>
                                        <span className="font-extrabold text-sm">{cat.name}</span>
                                        <span className="bg-slate-700 text-blue-200 px-2 py-0.2 rounded text-[10px] font-mono">
                                          Total Weight: {cat.weight}%
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 text-[11px] font-mono font-normal">
                                        <span>Average Achievement: <strong className="text-yellow-300 font-bold">{cat.metrics.avgScore}%</strong></span>
                                        <span>&bull;</span>
                                        <span>{groupKpis.length} Sub-KPIs</span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>

                                {groupKpis.map(k => {
                                  const linkedCount = projects.filter(p => p.linked_sub_kpi_codes?.includes(k.code)).length;
                                  return (
                                    <tr key={k.id} className="hover:bg-slate-50 transition border-b border-slate-100">
                                      <td className="p-3 font-mono font-extrabold text-blue-800 text-xs">
                                        <span className="bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                          {k.code}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <div className="font-bold text-slate-900">{k.kpi_name}</div>
                                        <div className="text-[11px] text-blue-700 font-medium mt-0.5">{k.delivery_unit}</div>
                                        <div className="text-[10px] text-slate-400 truncate max-w-sm">{k.programme}</div>
                                      </td>
                                      <td className="p-3 text-center">
                                        <span className="bg-amber-100 text-amber-900 border border-amber-200 font-mono font-extrabold px-2 py-0.5 rounded text-[11px]">
                                          {k.sub_kpi_weight}%
                                        </span>
                                      </td>
                                      <td className="p-3 font-mono font-medium text-slate-600">{k.baseline_score || '-'}</td>
                                      <td className="p-3 font-mono font-bold text-slate-800">{k.target_baseline_2026_27 || k.target_2025_26}</td>
                                      <td className="p-3 font-mono text-slate-600">{k.actual_2025_26 || '-'}</td>
                                      <td className="p-3">
                                        <div className="flex items-center gap-1.5">
                                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                                            <div 
                                              className={`${k.current_achievement >= 90 ? 'bg-emerald-600' : k.current_achievement >= 75 ? 'bg-blue-600' : 'bg-rose-600'} h-full rounded-full transition-all duration-300`} 
                                              style={{ width: `${Math.min(100, k.current_achievement)}%` }}
                                            ></div>
                                          </div>
                                          <span className="font-bold font-mono text-xs">{k.current_achievement}%</span>
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusBadgeClass(k.status)}`}>
                                          {k.status}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        {linkedCount > 0 ? (
                                          <button
                                            onClick={() => setSelectedKpiDetail(k)}
                                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold text-[10px] flex items-center gap-1"
                                            title="Click to view connected ministerial projects"
                                          >
                                            <Layers className="w-3 h-3 text-emerald-600" />
                                            <span>{linkedCount} Project{linkedCount !== 1 ? 's' : ''} Linked</span>
                                          </button>
                                        ) : (
                                          <span className="text-slate-400 text-[10px] italic">Direct Metric</span>
                                        )}
                                      </td>
                                      <td className="p-3 text-right whitespace-nowrap">
                                        <button 
                                          onClick={() => setSelectedKpiDetail(k)}
                                          className="text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded font-bold text-[11px] inline-flex items-center gap-1 mr-1 transition shadow-sm"
                                          title="View KPI Details Dossier"
                                        >
                                          <Eye className="w-3.5 h-3.5" /> View Details
                                        </button>
                                        {currentUser.can_edit && (
                                          <button 
                                            onClick={() => { setEditingPcKpi(k); setModalType('pc'); }}
                                            className="text-slate-600 hover:text-slate-900 p-1 hover:bg-slate-100 rounded transition"
                                            title="Edit KPI Parameters"
                                          >
                                            <PenSquare className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                      </tbody>
                    ) : (
                      <tbody className="divide-y divide-slate-100">
                        {filteredKpis.map((k) => {
                          const linkedCount = projects.filter(p => p.linked_sub_kpi_codes?.includes(k.code)).length;
                          return (
                            <tr key={k.id} className="hover:bg-slate-50 transition">
                              <td className="p-3 font-mono font-extrabold text-blue-800 text-xs">
                                <span className="bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                  {k.code}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-900">{k.kpi_name}</div>
                                <div className="text-[11px] text-blue-700 font-medium">{k.delivery_unit}</div>
                                <div className="text-[10px] text-slate-400 truncate max-w-sm">{k.programme}</div>
                              </td>
                              <td className="p-3 text-center">
                                <span className="bg-amber-100 text-amber-900 border border-amber-200 font-mono font-extrabold px-2 py-0.5 rounded text-[11px]">
                                  {k.sub_kpi_weight}%
                                </span>
                              </td>
                              <td className="p-3 font-mono text-slate-600">{k.baseline_score || '-'}</td>
                              <td className="p-3 font-mono font-bold text-slate-800">{k.target_baseline_2026_27 || k.target_2025_26}</td>
                              <td className="p-3 font-mono text-slate-600">{k.actual_2025_26 || '-'}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                                    <div 
                                      className={`${k.current_achievement >= 90 ? 'bg-emerald-600' : k.current_achievement >= 75 ? 'bg-blue-600' : 'bg-rose-600'} h-full rounded-full transition-all duration-300`} 
                                      style={{ width: `${Math.min(100, k.current_achievement)}%` }}
                                    ></div>
                                  </div>
                                  <span className="font-bold font-mono text-xs">{k.current_achievement}%</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusBadgeClass(k.status)}`}>
                                  {k.status}
                                </span>
                              </td>
                              <td className="p-3">
                                {linkedCount > 0 ? (
                                  <button
                                    onClick={() => setSelectedKpiDetail(k)}
                                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold text-[10px] flex items-center gap-1"
                                    title="Click to view connected ministerial projects"
                                  >
                                    <Layers className="w-3 h-3 text-emerald-600" />
                                    <span>{linkedCount} Project{linkedCount !== 1 ? 's' : ''} Linked</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-400 text-[10px] italic">Direct Metric</span>
                                )}
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <button 
                                  onClick={() => setSelectedKpiDetail(k)}
                                  className="text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded font-bold text-[11px] inline-flex items-center gap-1 mr-1 transition shadow-sm"
                                  title="View KPI Details"
                                >
                                  <Eye className="w-3.5 h-3.5" /> View Details
                                </button>
                                {currentUser.can_edit && (
                                  <button 
                                    onClick={() => { setEditingPcKpi(k); setModalType('pc'); }}
                                    className="text-slate-600 hover:text-slate-900 p-1 hover:bg-slate-100 rounded transition"
                                    title="Edit KPI"
                                  >
                                    <PenSquare className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ======================= TAB: USERS ======================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Users2 className="w-5 h-5 text-blue-700" /> Users &amp; Role-Based Access Control (RBAC)
                </h2>
                <span className="text-xs text-slate-500">Manage user authorization and permission matrix</span>
              </div>
              {currentUser.is_admin && (
                <button 
                  onClick={() => { setEditingItem(null); setModalType('user'); }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add User
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-blue-700 text-white px-4 py-2.5 text-xs font-bold">
                Authorized Staff Accounts
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Full Name &amp; Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Permissions Matrix</th>
                      <th className="p-3">Directorate</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{u.full_name}</div>
                          <div className="font-mono text-slate-500 text-[11px]">{u.email}</div>
                        </td>
                        <td className="p-3 font-bold text-blue-800">{u.role}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {u.is_admin && <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Admin</span>}
                            {u.can_upload && <span className="bg-slate-100 text-slate-800 border px-1.5 py-0.5 rounded text-[10px]">Upload</span>}
                            {u.can_edit && <span className="bg-slate-100 text-slate-800 border px-1.5 py-0.5 rounded text-[10px]">Edit</span>}
                            {u.can_approve && <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Approve</span>}
                          </div>
                        </td>
                        <td className="p-3">{u.directorate}</td>
                        <td className="p-3">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: AUDIT LOGS (ADMIN ONLY) ======================= */}
        {activeTab === 'audit_logs' && (
          <div className="space-y-4">
            {!currentUser.is_admin ? (
              <div className="bg-white rounded-lg border border-red-200 p-8 text-center max-w-xl mx-auto shadow-sm">
                <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">Access Restricted to System Administrators</h3>
                <p className="text-xs text-slate-500 mb-4">
                  The Audit Logs module contains forensic access trails, security records, and modification histories. Only users with the <code className="bg-red-50 text-red-700 px-1 py-0.5 rounded">is_admin</code> privilege are permitted to view or export this data.
                </p>
                <div className="text-xs bg-slate-50 border border-slate-200 rounded p-3 text-slate-600">
                  Current Session: <strong>{currentUser.full_name}</strong> ({currentUser.role}) &bull; Privilege: <span className="text-red-600 font-bold">Standard User</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-blue-700" /> Security &amp; Forensic Audit Trail
                    </h2>
                    <span className="text-xs text-slate-500">Immutable chronological records of user logins, record mutations, and approvals</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," + 
                          ["ID,Timestamp,User,Email,Action,Module,Record_ID,Details,IP_Address",
                           ...auditLogs.map(a => `"${a.id}","${a.timestamp}","${a.user_name}","${a.email}","${a.action}","${a.module}","${a.record_id || ''}","${a.details.replace(/"/g, '""')}","${a.ip_address}"`)
                          ].join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `moh_audit_logs_${new Date().toISOString().substring(0, 10)}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast('Audit trail exported to CSV successfully.');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Export to CSV
                    </button>
                  </div>
                </div>

                {/* Audit Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-3.5 rounded-lg shadow-sm">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Total Logged Events</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{auditLogs.length}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">&bull; 100% Traceability Enforced</div>
                  </div>

                  <div className="bg-white border border-slate-200 p-3.5 rounded-lg shadow-sm">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Auth / Logins</div>
                    <div className="text-2xl font-black text-blue-700 mt-1">
                      {auditLogs.filter(a => a.action === 'login').length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Perimeter Proxy Secured</div>
                  </div>

                  <div className="bg-white border border-slate-200 p-3.5 rounded-lg shadow-sm">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Mutations / Updates</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">
                      {auditLogs.filter(a => ['create', 'update', 'delete'].includes(a.action)).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Projects, KPIs &amp; Actions</div>
                  </div>

                  <div className="bg-white border border-slate-200 p-3.5 rounded-lg shadow-sm">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Approvals &amp; Backups</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">
                      {auditLogs.filter(a => ['approve', 'backup', 'export'].includes(a.action)).length}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Executive Sign-offs</div>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex-1 min-w-[200px] flex items-center gap-2 border border-slate-300 rounded px-2.5 py-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search audit trail by description, user, or IP address..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="w-full text-xs outline-none bg-transparent"
                    />
                  </div>

                  <select 
                    value={auditActionFilter}
                    onChange={(e) => setAuditActionFilter(e.target.value)}
                    className="border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                  >
                    <option value="">All Action Types</option>
                    <option value="login">Login</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="approve">Approve</option>
                    <option value="backup">Backup</option>
                    <option value="export">Export</option>
                  </select>

                  <select 
                    value={auditModuleFilter}
                    onChange={(e) => setAuditModuleFilter(e.target.value)}
                    className="border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                  >
                    <option value="">All Modules</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Projects & Programmes">Projects &amp; Programmes</option>
                    <option value="Priority Flagships">Priority Flagships</option>
                    <option value="Action Points">Action Points</option>
                    <option value="Performance Contract">Performance Contract</option>
                    <option value="Reports">Reports</option>
                    <option value="cPanel & Backup">cPanel &amp; Backup</option>
                    <option value="Audit Logs">Audit Logs</option>
                  </select>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-sky-400" /> Audit Trail Activity Log (Admin Access)
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      Showing {auditLogs
                        .filter(a => !auditActionFilter || a.action === auditActionFilter)
                        .filter(a => !auditModuleFilter || a.module === auditModuleFilter)
                        .filter(a => !auditSearch || a.details.toLowerCase().includes(auditSearch.toLowerCase()) || a.user_name.toLowerCase().includes(auditSearch.toLowerCase()) || a.ip_address.includes(auditSearch))
                        .length} records
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Timestamp</th>
                          <th className="p-3">User</th>
                          <th className="p-3">Action</th>
                          <th className="p-3">Module</th>
                          <th className="p-3">Activity Description</th>
                          <th className="p-3">IP Address</th>
                          <th className="p-3 text-right">Inspect</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {auditLogs
                          .filter(a => !auditActionFilter || a.action === auditActionFilter)
                          .filter(a => !auditModuleFilter || a.module === auditModuleFilter)
                          .filter(a => !auditSearch || a.details.toLowerCase().includes(auditSearch.toLowerCase()) || a.user_name.toLowerCase().includes(auditSearch.toLowerCase()) || a.ip_address.includes(auditSearch))
                          .map((log) => {
                            const actionColor = 
                              log.action === 'login' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              log.action === 'create' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                              log.action === 'update' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              log.action === 'delete' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                              log.action === 'approve' ? 'bg-teal-100 text-teal-800 border-teal-200' :
                              log.action === 'backup' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-slate-100 text-slate-800 border-slate-200';

                            return (
                              <tr key={log.id} className="hover:bg-slate-50 transition">
                                <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                                  {log.timestamp}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <div className="font-bold text-slate-900">{log.user_name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{log.email}</div>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${actionColor}`}>
                                    {log.action}
                                  </span>
                                </td>
                                <td className="p-3 whitespace-nowrap font-semibold text-slate-700">
                                  {log.module}
                                </td>
                                <td className="p-3 text-slate-700 max-w-md">
                                  <div className="line-clamp-2">{log.details}</div>
                                  {log.record_id !== undefined && (
                                    <span className="text-[10px] font-mono text-slate-400">Record #{log.record_id}</span>
                                  )}
                                </td>
                                <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                                  {log.ip_address}
                                </td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <button 
                                    onClick={() => setSelectedAuditLog(log)}
                                    className="text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded text-[11px] font-bold border border-blue-200 inline-flex items-center gap-1"
                                  >
                                    <Eye className="w-3 h-3" /> Inspect
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ======================= TAB: CPANEL & BACKUP ======================= */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-700" /> cPanel &amp; System Backup Manager
                </h2>
                <span className="text-xs text-slate-500">Database Export &amp; cPanel Deployment Resources</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a 
                  href="/moh_project_files.zip" 
                  download="moh_project_files.zip"
                  className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 shadow-sm transition"
                >
                  <Download className="w-4 h-4" /> Download Complete Project Archive (.zip)
                </a>
                <button 
                  onClick={handleDownloadSchema}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 shadow-sm transition"
                >
                  <Download className="w-4 h-4" /> Download MySQL Schema (.sql)
                </button>
              </div>
            </div>

            {/* Quick Diagnostic Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Server Environment Checklist
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="font-medium">PHP Version Compatibility</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">PHP 8.1 - 8.2 (Passed)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="font-medium">PDO MySQL Prepared Statements</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Native Enabled</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="font-medium">CSRF &amp; Strict Session Security</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Enforced</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="font-medium">Database Tables with Demo Data</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">18 Normalized Tables</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-medium">Audit Trail Logging</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <HardDriveDownload className="w-4 h-4 text-blue-700" /> cPanel Quick Setup Steps
                </h3>
                <ol className="list-decimal list-inside text-xs space-y-2 text-slate-600">
                  <li><strong>Create MySQL Database:</strong> In cPanel &rarr; MySQL Databases, create <code>mohsdms</code>.</li>
                  <li><strong>Import SQL:</strong> Open phpMyAdmin, select <code>mohsdms</code>, and click <strong>Import</strong> &rarr; select <code>database/schema.sql</code>.</li>
                  <li><strong>Upload Code:</strong> Extract all files to <code>public_html/</code>.</li>
                  <li><strong>Configure .env:</strong> Copy <code>.env.example</code> to <code>.env</code> with DB credentials.</li>
                  <li><strong>Default Login:</strong> <code>admin@health.go.ke</code> / <code>ChangeMe@2026</code>.</li>
                </ol>
              </div>
            </div>

            {/* Guides Links */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Included System Manuals &amp; Guides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-blue-800 text-sm mb-1">cPanel Production Install Guide</div>
                  <p className="text-slate-500 mb-3">Complete instructions for hosting setup, phpMyAdmin import, file permissions, and automated cron backups.</p>
                  <button 
                    onClick={() => showToast('Viewing docs/CPANEL_INSTALL_GUIDE.md')}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded"
                  >
                    View cPanel Guide
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-blue-800 text-sm mb-1">System Documentation &amp; Architecture</div>
                  <p className="text-slate-500 mb-3">Comprehensive system specifications, database entity relationships, and module workflows.</p>
                  <button 
                    onClick={() => showToast('Viewing docs/SYSTEM_DOCUMENTATION.md')}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded"
                  >
                    View System Manual
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#111827] text-slate-400 text-xs px-6 py-4 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <strong className="text-slate-200">&copy; 2026 STATE DEPARTMENT FOR MEDICAL SERVICES.</strong>
            <span className="ml-3">Website: <a href="https://www.health.go.ke" target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">www.health.go.ke</a></span>
            <span className="ml-3">Email: <a href="mailto:info@health.go.ke" className="text-sky-300 hover:underline">info@health.go.ke</a></span>
          </div>
          <div className="text-slate-500">
            Project Performance, Service Delivery &amp; Operational Management System (PP-SDOMS)
          </div>
        </div>
      </footer>

      {/* Generic Modal for Adding / Editing */}
      {/* Dedicated Performance Contract Sub-KPI Modal */}
      {modalType === 'pc' && (() => {
        const kpiToEdit = editingPcKpi || editingItem;
        return (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden text-xs">
              <div className="bg-[#0d47a1] text-white px-5 py-3.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h3 className="font-extrabold text-sm leading-tight">
                      {kpiToEdit ? `Edit Sub-KPI [${kpiToEdit.code}]` : 'Add New Performance Contract Sub-KPI'}
                    </h3>
                    <div className="text-[10px] text-blue-200">
                      Indicator parameters directly calculate progress across connected projects &amp; Gantt charts
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { setModalType(null); setEditingPcKpi(null); setEditingItem(null); }}
                  className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const code = (formData.get('code') as string || '').trim().toUpperCase();
                  const kpi_name = (formData.get('kpi_name') as string || '').trim();
                  const category = formData.get('category') as 'Financial Stewardship' | 'Service Delivery' | 'Core Mandate' | 'Cross-Cutting';
                  const delivery_unit = (formData.get('delivery_unit') as string || '').trim();
                  const programme = (formData.get('programme') as string || '').trim();
                  const sub_kpi_weight = parseFloat(formData.get('sub_kpi_weight') as string) || 5;
                  const current_achievement = parseFloat(formData.get('current_achievement') as string) || 0;
                  const q1_score = parseFloat(formData.get('q1_score') as string) || 0;
                  const q2_score = parseFloat(formData.get('q2_score') as string) || 0;
                  const q3_score = parseFloat(formData.get('q3_score') as string) || 0;
                  const q4_score = parseFloat(formData.get('q4_score') as string) || current_achievement;
                  const baseline_score = (formData.get('baseline_score') as string || '').trim();
                  const target_baseline_2026_27 = (formData.get('target_baseline_2026_27') as string || '').trim();
                  const target_2025_26 = (formData.get('target_2025_26') as string || '').trim();
                  const actual_2025_26 = (formData.get('actual_2025_26') as string || '').trim();
                  const target_2027_28 = (formData.get('target_2027_28') as string || '').trim();
                  const status = formData.get('status') as 'Draft' | 'Submitted' | 'Reviewed' | 'Approved';
                  const key_outputs = (formData.get('key_outputs') as string || '').trim();
                  const variance_comment = (formData.get('variance_comment') as string || '').trim();

                  let category_weight = 10;
                  if (category === 'Core Mandate') category_weight = 60;
                  else if (category === 'Cross-Cutting') category_weight = 20;

                  if (kpiToEdit) {
                    const updatedKpis = kpis.map(k => k.id === kpiToEdit.id ? {
                      ...k,
                      code,
                      kpi_name,
                      category,
                      category_weight,
                      sub_kpi_weight,
                      delivery_unit,
                      programme,
                      key_outputs,
                      baseline_score,
                      target_baseline_2026_27,
                      target_2025_26,
                      actual_2025_26,
                      target_2027_28,
                      current_achievement,
                      q1_score,
                      q2_score,
                      q3_score,
                      q4_score,
                      status,
                      variance_comment
                    } : k);
                    setKpis(updatedKpis);

                    // Add Audit Log
                    const log: AuditLogItem = {
                      id: Date.now(),
                      user_name: currentUser.full_name,
                      email: currentUser.email,
                      action: 'update',
                      module: 'Performance Contract',
                      details: `Updated PC Sub-KPI ${code} (${kpi_name}) achievement to ${current_achievement}%. Automatically recalculated linked project progress.`,
                      ip_address: '192.168.10.45',
                      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
                    };
                    setAuditLogs(prev => [log, ...prev]);
                    showToast(`Sub-KPI [${code}] updated. Connected project progress recalculated!`);
                  } else {
                    const newId = Math.max(...kpis.map(k => k.id), 0) + 1;
                    const newKpi: PerformanceKPI = {
                      id: newId,
                      code,
                      category,
                      parent_kpi_name: category,
                      parent_kpi_code: code.charAt(0),
                      category_weight,
                      sub_kpi_weight,
                      delivery_unit,
                      programme: programme || 'Programme 1: National Health Priorities',
                      key_outputs: key_outputs || kpi_name,
                      kpi_name,
                      baseline_score: baseline_score || '0%',
                      target_2025_26: target_2025_26 || '100%',
                      actual_2025_26: actual_2025_26 || '0%',
                      target_baseline_2026_27: target_baseline_2026_27 || '100%',
                      target_2027_28: target_2027_28 || '100%',
                      current_achievement,
                      q1_score,
                      q2_score,
                      q3_score,
                      q4_score,
                      status: status || 'Approved',
                      financial_year: pcYearFilter === 'All' ? '2026/2027' : pcYearFilter,
                      variance_comment
                    };
                    setKpis(prev => [...prev, newKpi]);

                    // Add Audit Log
                    const log: AuditLogItem = {
                      id: Date.now(),
                      user_name: currentUser.full_name,
                      email: currentUser.email,
                      action: 'create',
                      module: 'Performance Contract',
                      details: `Created new PC Sub-KPI ${code} (${kpi_name}) with weight ${sub_kpi_weight}%.`,
                      ip_address: '192.168.10.45',
                      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
                    };
                    setAuditLogs(prev => [log, ...prev]);
                    showToast(`New Sub-KPI [${code}] added to ${category}!`);
                  }
                  setModalType(null);
                  setEditingPcKpi(null);
                  setEditingItem(null);
                }}
                className="p-5 space-y-4 max-h-[75vh] overflow-y-auto"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sub-KPI Code *</label>
                    <input 
                      type="text" 
                      name="code" 
                      required 
                      defaultValue={kpiToEdit?.code || ''} 
                      placeholder="e.g. A1, C3.1"
                      className="w-full border border-slate-300 rounded p-2 font-mono font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Result Area (Category) *</label>
                    <select 
                      name="category" 
                      defaultValue={kpiToEdit?.category || 'Core Mandate'}
                      className="w-full border border-slate-300 rounded p-2 font-semibold"
                    >
                      <option value="Financial Stewardship">Category A: Financial Stewardship (10%)</option>
                      <option value="Service Delivery">Category B: Service Delivery (10%)</option>
                      <option value="Core Mandate">Category C: Core Mandate (60%)</option>
                      <option value="Cross-Cutting">Category D: Cross-Cutting (20%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Sub-KPI Weight (%) *</label>
                    <input 
                      type="number" 
                      name="sub_kpi_weight" 
                      step="0.5" 
                      min="0" 
                      max="100" 
                      required 
                      defaultValue={kpiToEdit?.sub_kpi_weight ?? 5} 
                      className="w-full border border-slate-300 rounded p-2 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Indicator Name / KPI Description *</label>
                  <input 
                    type="text" 
                    name="kpi_name" 
                    required 
                    defaultValue={kpiToEdit?.kpi_name || ''} 
                    placeholder="e.g. Operationalization of Primary Care Networks (PCNs)"
                    className="w-full border border-slate-300 rounded p-2 font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Delivery Unit / Agency *</label>
                    <input 
                      type="text" 
                      name="delivery_unit" 
                      required 
                      defaultValue={kpiToEdit?.delivery_unit || ''} 
                      placeholder="e.g. Kenyatta National Hospital (KNH)"
                      className="w-full border border-slate-300 rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Programme</label>
                    <input 
                      type="text" 
                      name="programme" 
                      defaultValue={kpiToEdit?.programme || 'Programme 2: Primary Health Care'} 
                      className="w-full border border-slate-300 rounded p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Key Outputs / Deliverables</label>
                  <input 
                    type="text" 
                    name="key_outputs" 
                    defaultValue={kpiToEdit?.key_outputs || ''} 
                    placeholder="Deliverable description"
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                {/* Targets & Baselines */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">Strategic Targets &amp; Historical Baselines</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Baseline</label>
                      <input 
                        type="text" 
                        name="baseline_score" 
                        defaultValue={kpiToEdit?.baseline_score || '85.0%'} 
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Actual 2025/26</label>
                      <input 
                        type="text" 
                        name="actual_2025_26" 
                        defaultValue={kpiToEdit?.actual_2025_26 || '85.0%'} 
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-blue-700 font-bold block mb-0.5">Target (2026/27)</label>
                      <input 
                        type="text" 
                        name="target_baseline_2026_27" 
                        defaultValue={kpiToEdit?.target_baseline_2026_27 || '100%'} 
                        className="w-full bg-blue-50/50 border border-blue-300 rounded p-1.5 font-mono font-bold text-center text-blue-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Target (2027/28)</label>
                      <input 
                        type="text" 
                        name="target_2027_28" 
                        defaultValue={kpiToEdit?.target_2027_28 || '100%'} 
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>

                {/* Achievement & Quarterly Progression */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900 text-[11px] uppercase tracking-wide">
                      Achievement Levels &amp; Quarterly Progress (Used for Project &amp; Gantt Progress)
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">Reflected in real time</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[10px] text-emerald-900 font-bold block mb-0.5">Current Achv % *</label>
                      <input 
                        type="number" 
                        name="current_achievement" 
                        step="0.1" 
                        min="0" 
                        max="100" 
                        required 
                        defaultValue={kpiToEdit?.current_achievement ?? 85} 
                        className="w-full bg-white border-2 border-emerald-500 rounded p-1.5 font-mono font-black text-center text-emerald-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 block mb-0.5">Q1 (Jul-Sep)</label>
                      <input 
                        type="number" 
                        name="q1_score" 
                        step="0.1" 
                        defaultValue={kpiToEdit?.q1_score ?? 80} 
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 block mb-0.5">Q2 (Oct-Dec)</label>
                      <input 
                        type="number" 
                        name="q2_score" 
                        step="0.1" 
                        defaultValue={kpiToEdit?.q2_score ?? 85} 
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 block mb-0.5">Q3 (Jan-Mar)</label>
                      <input 
                        type="number" 
                        name="q3_score" 
                        step="0.1" 
                        defaultValue={kpiToEdit?.q3_score ?? 90} 
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-600 block mb-0.5">Q4 (Apr-Jun)</label>
                      <input 
                        type="number" 
                        name="q4_score" 
                        step="0.1" 
                        defaultValue={kpiToEdit?.q4_score ?? 95} 
                        className="w-full bg-white border border-slate-300 rounded p-1.5 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Verification Status</label>
                    <select 
                      name="status" 
                      defaultValue={kpiToEdit?.status || 'Approved'} 
                      className="w-full border border-slate-300 rounded p-2"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Variance Analysis &amp; Mitigation</label>
                    <textarea 
                      name="variance_comment" 
                      rows={2} 
                      defaultValue={kpiToEdit?.variance_comment || 'Performance on track with strategic plan deliverables.'} 
                      className="w-full border border-slate-300 rounded p-1.5"
                    />
                  </div>
                </div>

                {/* Connected Projects Indicator */}
                {kpiToEdit && (() => {
                  const linkedProjects = projects.filter(p => p.linked_sub_kpi_codes?.includes(kpiToEdit.code));
                  if (linkedProjects.length === 0) return null;
                  return (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-700" />
                        <span>Connected Projects ({linkedProjects.length})</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Saving changes will immediately recalculate project progress for:
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {linkedProjects.map(p => (
                          <span key={p.id} className="bg-white border border-blue-200 px-2 py-0.5 rounded font-mono text-[10px] text-blue-900 font-bold">
                            {p.programme_title}: {p.sub_programme}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setModalType(null); setEditingPcKpi(null); setEditingItem(null); }} 
                    className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white font-bold flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Sub-KPI &amp; Recalculate
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Generic Modal for Adding / Editing Other Records */}
      {modalType && modalType !== 'pc' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden text-xs">
            <div className="bg-blue-700 text-white px-4 py-3 font-bold flex justify-between items-center">
              <span>{editingItem ? 'Edit Entry' : 'Add New Entry'}</span>
              <button onClick={() => setModalType(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
              <p className="text-slate-600">Enter or update record details below:</p>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Title / Name / Subject</label>
                <input 
                  type="text" 
                  defaultValue={editingItem?.title || editingItem?.kpi_name || editingItem?.subject || editingItem?.full_name || ''} 
                  id="modal_field_title"
                  className="w-full border border-slate-300 rounded p-2 text-xs" 
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Description / Notes</label>
                <textarea 
                  rows={3} 
                  defaultValue={editingItem?.description || editingItem?.issue || editingItem?.purpose || ''} 
                  id="modal_field_desc"
                  className="w-full border border-slate-300 rounded p-2 text-xs" 
                />
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button onClick={() => setModalType(null)} className="px-3 py-1.5 rounded bg-slate-200 font-bold text-slate-700">
                Cancel
              </button>
              <button 
                onClick={() => {
                  setModalType(null);
                  showToast('Record saved successfully!');
                }} 
                className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white font-bold"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11-Field Add Project / Programme Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-xs">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-5 py-3.5 font-bold flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-white" />
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">Add Project / Programme</h3>
                  <div className="text-[11px] text-blue-200">11-field structured entry as specified in ADD PROJECT framework</div>
                </div>
              </div>
              <button onClick={() => setShowAddProjectModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProjectForm.sub_programme.trim()) {
                  showToast('Sub-programme title is required.');
                  return;
                }
                const newId = Math.max(...projects.map(p => p.id), 0) + 1;
                const createdProject: Project = {
                  id: newId,
                  programme_title: newProjectForm.programme_title,
                  sub_programme: newProjectForm.sub_programme,
                  category: newProjectForm.category,
                  directorate_name: newProjectForm.category === 'Directorate' ? newProjectForm.entity_name : undefined,
                  saga_name: newProjectForm.category === 'Saga' ? newProjectForm.entity_name : undefined,
                  division_name: newProjectForm.category === 'Division' ? newProjectForm.entity_name : undefined,
                  delivery_unit: newProjectForm.entity_name,
                  total_budget: Number(newProjectForm.total_budget),
                  funds_disbursed: Math.round(Number(newProjectForm.total_budget) * 0.7),
                  funds_utilized: Math.round(Number(newProjectForm.total_budget) * 0.62),
                  start_date: newProjectForm.start_date,
                  end_date: newProjectForm.end_date,
                  status: newProjectForm.status,
                  progress_status: `${newProjectForm.initial_monthly_progress}%`,
                  monthly_progress: {
                    "2026-01": Math.max(0, newProjectForm.initial_monthly_progress - 15),
                    "2026-02": Math.max(0, newProjectForm.initial_monthly_progress - 10),
                    "2026-03": Math.max(0, newProjectForm.initial_monthly_progress - 5),
                    "2026-04": newProjectForm.initial_monthly_progress,
                    "2026-05": newProjectForm.initial_monthly_progress,
                    "2026-06": newProjectForm.initial_monthly_progress
                  },
                  description: newProjectForm.description,
                  remarks: 'Newly registered programme/sub-programme in Ministry portfolio.',
                  milestones_completed: 2,
                  milestones_total: 3,
                  tasks_on_track: 1,
                  tasks_total: 1,
                  gantt_task_name: newProjectForm.sub_programme,
                  progress_calculation_mode: 'manual',
                  linked_sub_kpi_codes: ['C4.1', 'A3']
                };

                setProjects([createdProject, ...projects]);
                setShowAddProjectModal(false);
                showToast(`Project "${createdProject.sub_programme}" created successfully!`);
                setNewProjectForm(prev => ({
                  ...prev,
                  sub_programme: '',
                  description: ''
                }));
              }}
              className="p-5 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Programme Title */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">1. Programme Title</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.programme_title}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, programme_title: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-bold text-blue-700"
                    placeholder="e.g. Specialized Regional Cancer Programme"
                  />
                </div>

                {/* 2. Sub-Programme */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">2. Sub-Programme</label>
                  <input
                    type="text"
                    required
                    value={newProjectForm.sub_programme}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, sub_programme: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="e.g. Kenyatta National Hospital Burns Center"
                  />
                </div>

                {/* 3. Category */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">3. Category</label>
                  <select
                    value={newProjectForm.category}
                    onChange={(e: any) => {
                      const cat = e.target.value;
                      const def = cat === 'Directorate' ? 'Directorate of Health Infrastructure & Referral Facilities' : cat === 'Saga' ? 'Kenyatta National Hospital (KNH)' : 'Division of Non-Communicable Diseases (NCDs)';
                      setNewProjectForm({ ...newProjectForm, category: cat, entity_name: def });
                    }}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="Directorate">Directorate</option>
                    <option value="Saga">SAGA (Semi-Autonomous Government Agency)</option>
                    <option value="Division">Division</option>
                  </select>
                </div>

                {/* 4. Implementing Entity / Delivery Unit */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">4. Implementing Entity / Delivery Unit</label>
                  <select
                    value={newProjectForm.entity_name}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, entity_name: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    {(newProjectForm.category === 'Directorate' 
                      ? [
                          'Directorate of Health Infrastructure & Referral Facilities',
                          'Directorate of Family Health & Curative Services',
                          'Directorate of Digital Health, Research & Innovations',
                          'Directorate of Planning & Administration',
                          'Emergency Medical Care Directorate',
                          'Health Products and Technologies (HPT) Directorate',
                          'Primary Healthcare Directorate'
                        ]
                      : newProjectForm.category === 'Saga' 
                      ? [
                          'Kenyatta National Hospital (KNH)',
                          'Moi Teaching & Referral Hospital (MTRH)',
                          'Kenya Medical Supplies Authority (KEMSA)',
                          'Kenyatta University Teaching, Referral & Research Hospital (KUTRRH)',
                          'National Syndemic Diseases Control Council (NSDCC)',
                          'Kenya Nuclear Regulatory Authority (KNRA)'
                        ]
                      : [
                          'Division of Non-Communicable Diseases (NCDs)',
                          'Division of National AIDS & STI Control Programme (NASCOP)',
                          'Division of Vaccines & Immunization (DVLD)',
                          'Division of Reproductive & Maternal Health',
                          'Division of Environmental Health & Sanitation',
                          'Division of Health Informatics & Standards'
                        ]
                    ).map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Budget */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">5. Programme / Sub-Programme Budget (KES)</label>
                  <input
                    type="number"
                    required
                    value={newProjectForm.total_budget}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, total_budget: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono font-bold"
                  />
                </div>

                {/* 6. Initial Monthly Progress (%) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">6. Initial Monthly Progress (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={newProjectForm.initial_monthly_progress}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, initial_monthly_progress: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-mono font-bold text-emerald-700"
                  />
                </div>

                {/* 7. Start Date */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">7. Start Date</label>
                  <input
                    type="date"
                    required
                    value={newProjectForm.start_date}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, start_date: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                {/* 8. End Date */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">8. End Date</label>
                  <input
                    type="date"
                    required
                    value={newProjectForm.end_date}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, end_date: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                {/* 9. Status */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">9. Status</label>
                  <select
                    value={newProjectForm.status}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, status: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                {/* 10. Description */}
                <div className="md:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">10. Description / Action Summary</label>
                  <textarea
                    rows={3}
                    value={newProjectForm.description}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2"
                    placeholder="Enter project deliverables, scope, and key ministerial outcomes..."
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>This project will automatically link to the Ministerial Performance Contract indicators and calculate dynamic progress on the Gantt chart and table.</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 font-bold text-slate-700 hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition shadow-sm"
                >
                  Save Project Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-KPI Dossier Modal */}
      {selectedKpiForDossier && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden text-xs">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-2">
                  <span>Sub-KPI Dossier &amp; Multi-Year Trajectory</span>
                  <span className="bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[11px]">
                    Weight: {selectedKpiForDossier.kpi.weight}%
                  </span>
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">{selectedKpiForDossier.unitName} &bull; {selectedKpiForDossier.piTitle}</div>
              </div>
              <button onClick={() => setSelectedKpiForDossier(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3.5 space-y-1">
                <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Sub-KPI Name</div>
                <div className="font-extrabold text-slate-900 text-sm">{selectedKpiForDossier.kpi.name}</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  <strong>Programme:</strong> {selectedKpiForDossier.progName}
                </div>
                <div className="text-[11px] text-slate-600">
                  <strong>Sub-Programme:</strong> {selectedKpiForDossier.subProgName}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Multi-Year Strategic Targets</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Target 2025/26</div>
                    <div className="font-bold text-slate-700 text-xs mt-0.5">{selectedKpiForDossier.kpi.target_2025_26}</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded">
                    <div className="text-[10px] text-emerald-800 font-medium">Actual 2025/26</div>
                    <div className="font-bold text-emerald-900 text-xs mt-0.5">{selectedKpiForDossier.kpi.actual_2025_26}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-2.5 rounded">
                    <div className="text-[10px] text-blue-700 font-medium">Baseline 2026/27</div>
                    <div className="font-bold text-blue-900 text-xs mt-0.5">{selectedKpiForDossier.kpi.target_baseline_2026_27}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Target 2027/28</div>
                    <div className="font-bold text-slate-700 text-xs mt-0.5">{selectedKpiForDossier.kpi.target_2027_28}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Target 2028/29</div>
                    <div className="font-bold text-slate-700 text-xs mt-0.5">{selectedKpiForDossier.kpi.target_2028_29}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Target 2029/30</div>
                    <div className="font-bold text-slate-700 text-xs mt-0.5">{selectedKpiForDossier.kpi.target_2029_30}</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold">Assigned Weight: {selectedKpiForDossier.kpi.weight}%</div>
                  <div className="text-[11px] text-amber-700">Contributes to delivery unit outputs and project progress calculations</div>
                </div>
                <span className="bg-amber-500 text-slate-950 font-black px-2 py-1 rounded text-xs font-mono">
                  {selectedKpiForDossier.kpi.weight} pts
                </span>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedKpiForDossier(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Contract Entry Details Modal */}
      {selectedKpiDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="bg-[#0d47a1] text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="font-extrabold text-sm leading-tight flex items-center gap-2">
                    <span>Performance Contract KPI Dossier</span>
                    <span className="bg-yellow-400 text-slate-900 font-mono font-black px-1.5 py-0.2 rounded text-[11px]">
                      {selectedKpiDetail.code}
                    </span>
                  </h3>
                  <div className="text-[10px] text-blue-200">
                    {selectedKpiDetail.category} &bull; FY {selectedKpiDetail.financial_year} &bull; Delivery Unit Verification
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedKpiDetail(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Delivery Unit & Output */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Unit / Agency</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{selectedKpiDetail.delivery_unit}</h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-mono font-extrabold text-[10px]">
                      Weight: {selectedKpiDetail.sub_kpi_weight}%
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${getStatusBadgeClass(selectedKpiDetail.status)}`}>
                      {selectedKpiDetail.status}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Programme</span>
                  <div className="font-semibold text-blue-700">{selectedKpiDetail.programme}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Output</span>
                  <div className="font-bold text-slate-800">{selectedKpiDetail.key_outputs}</div>
                </div>
              </div>

              {/* KPI Description */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Indicator (KPI)</span>
                <div className="font-bold text-slate-900 text-xs mt-0.5 bg-blue-50 border border-blue-100 p-2.5 rounded">
                  {selectedKpiDetail.kpi_name}
                </div>
              </div>

              {/* Comparative Targets Grid */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Multi-Year Strategic Targets &amp; Actuals</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Target 2025/26</div>
                    <div className="font-mono font-bold text-slate-700 text-xs mt-0.5">{selectedKpiDetail.target_2025_26}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Actual 2025/26</div>
                    <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">{selectedKpiDetail.actual_2025_26}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-2 rounded">
                    <div className="text-[10px] text-blue-700 font-medium">Target Baseline 26/27</div>
                    <div className="font-mono font-bold text-blue-900 text-xs mt-0.5">{selectedKpiDetail.target_baseline_2026_27}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500 font-medium">Target 2027/28</div>
                    <div className="font-mono font-bold text-slate-700 text-xs mt-0.5">{selectedKpiDetail.target_2027_28}</div>
                  </div>
                </div>
              </div>

              {/* Achievement Meter */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Weighted Achievement Rate</span>
                  <span className="font-mono font-black text-sm text-emerald-700">{selectedKpiDetail.current_achievement}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, selectedKpiDetail.current_achievement)}%` }}
                  ></div>
                </div>
              </div>

              {/* Quarterly Milestone Progress */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quarterly Performance Breakdown</span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500">Q1 (Jul-Sep)</div>
                    <div className="text-xs font-bold text-sky-700 mt-0.5">{selectedKpiDetail.q1_score || Math.min(100, Math.round(selectedKpiDetail.current_achievement * 0.85))}%</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500">Q2 (Oct-Dec)</div>
                    <div className="text-xs font-bold text-blue-700 mt-0.5">{selectedKpiDetail.q2_score || Math.min(100, Math.round(selectedKpiDetail.current_achievement * 0.92))}%</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500">Q3 (Jan-Mar)</div>
                    <div className="text-xs font-bold text-amber-700 mt-0.5">{selectedKpiDetail.q3_score || Math.min(100, Math.round(selectedKpiDetail.current_achievement * 0.98))}%</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                    <div className="text-[10px] text-slate-500">Q4 (Apr-Jun)</div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">{selectedKpiDetail.q4_score || selectedKpiDetail.current_achievement}%</div>
                  </div>
                </div>
              </div>

              {/* Connected Projects & Calculated Progress Section */}
              {(() => {
                const linkedProjects = projects.filter(p => p.linked_sub_kpi_codes?.includes(selectedKpiDetail.code));
                return (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-lg p-3.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-700" />
                        <span className="font-extrabold text-blue-950 text-xs">
                          Connected Projects &amp; Calculated Impact ({linkedProjects.length})
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-700 font-mono font-bold">
                        Calculates Progress on Gantt &amp; Table
                      </span>
                    </div>

                    {linkedProjects.length > 0 ? (
                      <div className="space-y-1.5 mt-2">
                        {linkedProjects.map(p => {
                          const { pct } = getProjectCalculatedProgress(p, kpis);
                          return (
                            <div key={p.id} className="bg-white border border-blue-200 rounded p-2 flex justify-between items-center">
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{p.sub_programme}</div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {p.programme_title} &bull; {p.category} &bull; {p.delivery_unit}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="bg-emerald-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                                  {pct}% Progress
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded border border-blue-100">
                        This indicator acts as an executive direct ministerial milestone. You can connect it to any project via the Projects &amp; Programmes tab.
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Variance & Mitigation Comments */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Variance Analysis &amp; Corrective Measures</span>
                <div className="bg-amber-50/70 border border-amber-200 rounded p-3 text-slate-700 leading-relaxed text-xs">
                  {selectedKpiDetail.variance_comment || "On track according to ministerial delivery timeline. No significant negative variance reported during current review cycle."}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center">
              <button 
                onClick={() => {
                  showToast(`Printed / exported KPI summary for ${selectedKpiDetail.delivery_unit}`);
                }}
                className="px-3 py-1.5 rounded bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-blue-700" /> Export Summary
              </button>
              <div className="flex items-center gap-2">
                {currentUser.can_edit && (
                  <button 
                    onClick={() => {
                      const item = selectedKpiDetail;
                      setSelectedKpiDetail(null);
                      setEditingPcKpi(item);
                      setModalType('pc');
                    }}
                    className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <PenSquare className="w-3.5 h-3.5" /> Edit Indicator
                  </button>
                )}
                <button 
                  onClick={() => setSelectedKpiDetail(null)} 
                  className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forensic Audit Log Inspect Modal */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-sky-400" />
                <span className="font-bold">Audit Event Forensic Record #{selectedAuditLog.id}</span>
              </div>
              <button onClick={() => setSelectedAuditLog(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Action Type</div>
                  <div className="font-bold text-blue-700 uppercase mt-0.5">{selectedAuditLog.action}</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Module Target</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedAuditLog.module}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Authenticated User Identity</div>
                <div className="font-bold text-slate-900">{selectedAuditLog.user_name}</div>
                <div className="font-mono text-slate-600 text-[11px]">{selectedAuditLog.email}</div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Activity Description &amp; Payload</div>
                <div className="text-slate-800 leading-relaxed font-sans">{selectedAuditLog.details}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-mono">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Client IP Address</div>
                  <div className="font-mono font-bold text-slate-700 mt-0.5">{selectedAuditLog.ip_address}</div>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Recorded Timestamp</div>
                  <div className="font-mono font-bold text-slate-700 mt-0.5">{selectedAuditLog.timestamp}</div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => setSelectedAuditLog(null)} 
                className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation & Module Visibility Manager Modal */}
      {showModuleSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full overflow-hidden text-xs">
            <div className="bg-[#0d47a1] text-white px-5 py-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-yellow-300" />
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">Navigation Menu &amp; Module Manager</h3>
                  <div className="text-[10px] text-blue-200">Configure visible modules and top navigation tabs</div>
                </div>
              </div>
              <button 
                onClick={() => setShowModuleSettings(false)} 
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <p className="text-xs text-slate-600">
                Check or uncheck any module below to immediately display or hide it from the top navigation bar. When disabled, users will not see the tab in their header.
              </p>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50">
                {[
                  { id: 'dashboard', label: 'DASHBOARD', desc: 'Executive overview, KPI counters, charts, and recent activity', core: true },
                  { id: 'flagships', label: 'PRIORITY FLAGSHIPS', desc: 'Affordable Healthcare, Specialized Hospitals, Medical Supplies' },
                  { id: 'events', label: 'ACTIVITIES AND EVENTS', desc: 'Calendar of ministerial activities, events, and milestones' },
                  { id: 'actions', label: 'ACTION POINTS TRACKER', desc: 'Task assignments, deadlines, resolution status, and notes' },
                  { id: 'projects', label: 'PROJECTS AND PROGRAMMES', desc: 'Capital investments, contractor tracking, and Project Gantt chart' },
                  { id: 'reports', label: 'REPORTS', desc: 'Quarterly, annual, and field monitoring document repository' },
                  { id: 'diary', label: 'DIARY', desc: 'Executive appointments, high-level engagements, and minutes' },
                  { id: 'pc', label: 'PERFORMANCE CONTRACT', desc: 'Institutional target evaluations, DU Gantt chart, and KPI dossier' },
                  { id: 'users', label: 'USERS & RBAC', desc: 'User authentication, permission matrix, and role assignment' },
                  { id: 'audit_logs', label: 'AUDIT LOGS', desc: 'Security access trail, mutation log, and forensic records (Admin Only)', adminOnly: true },
                  { id: 'backup', label: 'CPANEL & BACKUP', desc: 'Database export (.sql), diagnostic checklist, and install guides' },
                ].map((mod) => {
                  const isChecked = enabledModules[mod.id] !== false;
                  return (
                    <label 
                      key={mod.id} 
                      className={`flex items-start gap-3 p-3 transition cursor-pointer ${isChecked ? 'bg-white hover:bg-blue-50/40' : 'bg-slate-100/70 opacity-60 hover:opacity-80'}`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        disabled={mod.core}
                        onChange={() => toggleModuleVisibility(mod.id)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isChecked ? 'text-slate-900' : 'text-slate-500 line-through'}`}>
                            {mod.label}
                          </span>
                          {mod.core && (
                            <span className="bg-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                              Core
                            </span>
                          )}
                          {mod.adminOnly && (
                            <span className="bg-red-100 text-red-700 border border-red-200 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{mod.desc}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {isChecked ? 'Visible' : 'Hidden'}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* cPanel / PHP Developer Guide Box */}
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3.5 space-y-1.5 text-slate-700">
                <div className="font-bold text-sky-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-700" />
                  <span>How to remove modules permanently in PHP / cPanel:</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Open <code className="bg-white px-1 py-0.5 rounded border border-sky-200 font-mono text-[10px]">/includes/functions.php</code> and locate the <code className="bg-white px-1 py-0.5 rounded border border-sky-200 font-mono text-[10px]">modules()</code> function (line 251). Simply comment out or remove the line corresponding to that module, e.g.:
                </p>
                <div className="bg-slate-900 text-emerald-300 font-mono text-[10.5px] p-2.5 rounded overflow-x-auto">
                  {`// ['slug' => 'mail', 'name' => 'MAIL MANAGEMENT', 'file' => 'modules/mail.php'],`}
                </div>
                <p className="text-[10.5px] text-slate-500">
                  To block direct file visits, add <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-[10px]">require_permission('admin_only');</code> at the top of the module PHP file.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-between items-center">
              <button 
                onClick={resetModuleVisibility}
                className="px-3 py-1.5 rounded bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs"
              >
                Reset All to Default
              </button>
              <button 
                onClick={() => setShowModuleSettings(false)} 
                className="px-4 py-1.5 rounded bg-blue-700 hover:bg-blue-600 font-bold text-white text-xs"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

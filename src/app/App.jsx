import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { StarbooksSidebar } from "../components/layout/StarbooksSidebar";
import { TopBar } from "../components/layout/TopBar";
import { Toast } from "../components/ui/Toast";
import { AuditLog } from "../components/ui/AuditLog";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { ChatBot } from "../components/ui/ChatBot";
import { Dashboard } from "../features/dashboard/Dashboard";
import { ProvincesPage } from "../features/analytics/ProvincesPage";
import { CitiesPage } from "../features/analytics/CitiesPage";
import { BarangaysPage } from "../features/analytics/BarangaysPage";
import { MonitoringPage } from "../features/monitoring/MonitoringPage";
import { ArchivePage } from "../features/archive/ArchivePage";
import { DataEntryPage } from "../features/data-entry/DataEntryPage";
import { StarbooksPage } from "../features/starbooks/StarbooksPage";
import { SettingsPage } from "../features/settings/SettingsPage";
import { LoginPage } from "../features/auth/LoginPage";
import { usePersistedState } from "../shared/hooks/usePersistedState";
import { useToastNotification } from "../shared/hooks/useToastNotification";
import { useAuditLog } from "../shared/hooks/useAuditLog";
import { auditService, ENTITY_TYPES } from "../shared/services/auditService";
import { LS_KEYS } from "../shared/constants";
import { INITIAL_PROJECTS, INITIAL_EQUIPMENT } from "../shared/utils/Utils";

// Auto-logout configuration
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

function AppContent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = usePersistedState("cest_logged_in", false);
  const [projects, setProjects] = usePersistedState(LS_KEYS.projects, INITIAL_PROJECTS);
  const [equipment, setEquipment] = usePersistedState(LS_KEYS.equipment, INITIAL_EQUIPMENT);
  const [archivedProjects, setArchivedProjects] = usePersistedState("cest_archived_projects", []);
  const [darkMode, setDarkMode] = usePersistedState("darkMode", false);

  const [activePage, setActivePage] = useState("dashboard");
  const [activeSystem, setActiveSystem] = usePersistedState("active_system", "cest"); // "cest" or "starbooks"
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCollapsed, setIsCollapsed] = usePersistedState("sidebar_collapsed", false);

  const { toasts, success, warning, removeToast } = useToastNotification();
  const { logs } = useAuditLog();

  // Add sample audit logs on first load
  useEffect(() => {
    const hasInitializedLogs = localStorage.getItem('cest_audit_initialized');
    if (!hasInitializedLogs) {
      // Add some sample logs
      auditService.logCreate(ENTITY_TYPES.PROJECT, 'CEST 2.0 - Gonzaga', 'Municipality: Gonzaga, Budget: ₱150,000');
      auditService.logUpload(ENTITY_TYPES.EQUIPMENT, 'Desktop Computer Set', 'Quantity: 5, Location: Gonzaga');
      auditService.logUpdate(ENTITY_TYPES.PROJECT, 'SEL Project - Isabela', 'Status changed to Ongoing');
      localStorage.setItem('cest_audit_initialized', 'true');
    }
  }, []);

  // Handle system switching
  const handleSwitchSystem = () => {
    const newSystem = activeSystem === "cest" ? "starbooks" : "cest";
    setActiveSystem(newSystem);
    
    if (newSystem === "starbooks") {
      setActivePage("starbooks");
      navigate("/starbooks");
      auditService.logUpdate(ENTITY_TYPES.SYSTEM, 'System Switch', 'Switched to STARBOOKS system');
      success("Switched to STARBOOKS system");
    } else {
      setActivePage("dashboard");
      navigate("/dashboard");
      auditService.logUpdate(ENTITY_TYPES.SYSTEM, 'System Switch', 'Switched to CEST system');
      success("Switched to CEST system");
    }
  };

  // Auto-logout functionality
  useEffect(() => {
    if (!isLoggedIn) return;

    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsLoggedIn(false);
        navigate("/");
        warning('You have been logged out due to inactivity');
      }, INACTIVITY_TIMEOUT);
    };

    ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [isLoggedIn, navigate, setIsLoggedIn, warning]);

  const uniqueComm = new Set(projects.map((p) => p.community)).size;

  // Apply dark mode class to html element
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Close panels when clicking outside
  useEffect(() => {
    const handleClick = () => {
      if (showAuditLog || showSettings) {
        setShowAuditLog(false);
        setShowSettings(false);
      }
    };
    
    if (showAuditLog || showSettings) {
      setTimeout(() => {
        document.addEventListener('click', handleClick);
      }, 0);
      
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showAuditLog, showSettings]);

  // Archive functions
  const handleRestore = (projectId) => {
    const projectToRestore = archivedProjects.find(p => p.id === projectId);
    if (projectToRestore) {
      setArchivedProjects(archivedProjects.filter(p => p.id !== projectId));
      auditService.logRestore(ENTITY_TYPES.PROJECT, projectToRestore.project);
      success(`Project "${projectToRestore.project}" restored successfully!`);
    }
  };

  const handlePermanentDelete = (projectId) => {
    const projectToDelete = archivedProjects.find(p => p.id === projectId);
    if (projectToDelete) {
      setArchivedProjects(archivedProjects.filter(p => p.id !== projectId));
      auditService.logDelete(ENTITY_TYPES.PROJECT, projectToDelete.project);
    }
  };

  // Data Entry functions
  const handleAddProject = (projectData) => {
    setProjects([...projects, projectData]);
    auditService.logCreate(
      ENTITY_TYPES.PROJECT, 
      projectData.project,
      `Municipality: ${projectData.municipality}, Budget: ₱${projectData.amountFunded?.toLocaleString()}`
    );
    success('Project added successfully!');
  };

  const handleAddEquipment = (equipmentData) => {
    setEquipment([...equipment, equipmentData]);
    auditService.logCreate(
      ENTITY_TYPES.EQUIPMENT,
      equipmentData.name || equipmentData.type,
      `Quantity: ${equipmentData.quantity}, Location: ${equipmentData.location}`
    );
    success('Equipment added successfully!');
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} darkMode={darkMode} />;
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{
      background: darkMode 
        ? 'linear-gradient(to bottom right, #020617, #0f172a, #020617)' 
        : 'linear-gradient(to bottom right, #f8fafc, #dbeafe, #e0e7ff)'
    }}>
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Conditional Sidebar based on active system */}
      {activeSystem === "starbooks" ? (
        <StarbooksSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onSwitchSystem={handleSwitchSystem}
          onLogout={() => {
            setIsLoggedIn(false);
            navigate("/");
          }}
        />
      ) : (
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onSwitchSystem={handleSwitchSystem}
          onLogout={() => {
            setIsLoggedIn(false);
            navigate("/");
          }}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          activePage={activePage}
          auditLogCount={logs.length}
          setShowAuditLog={setShowAuditLog}
          setShowSettings={setShowSettings}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          projects={projects}
          onNavigateToProject={(project) => {
            setActivePage("dashboard");
            // Navigate to project details if needed
          }}
        />

        <main className="flex-1 overflow-auto p-8 scrollbar-thin">
          {/* Settings Modal */}
          {showSettings && (
            <SettingsPage 
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onClose={() => setShowSettings(false)}
            />
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                activeSystem === "starbooks" ? (
                  <Navigate to="/starbooks" replace />
                ) : activePage === "dashboard" ? (
                  <Dashboard 
                    projects={projects} 
                    equipment={equipment} 
                    uniqueComm={uniqueComm}
                    darkMode={darkMode}
                  />
                ) : activePage === "analytics" ? (
                  <ProvincesPage projects={projects} darkMode={darkMode} />
                ) : activePage === "monitoring" ? (
                  <MonitoringPage projects={projects} darkMode={darkMode} />
                ) : activePage === "archive" ? (
                  <ArchivePage 
                    archivedProjects={archivedProjects}
                    onRestore={handleRestore}
                    onPermanentDelete={handlePermanentDelete}
                    darkMode={darkMode}
                  />
                ) : activePage === "dataentry" ? (
                  <DataEntryPage
                    projects={projects}
                    equipment={equipment}
                    onAddProject={handleAddProject}
                    onAddEquipment={handleAddEquipment}
                    darkMode={darkMode}
                  />
                ) : activePage === "starbooks" ? (
                  <StarbooksPage darkMode={darkMode} activePage={activePage} />
                ) : (
                  <PlaceholderPage activePage={activePage} darkMode={darkMode} />
                )
              }
            />
            <Route
              path="/analytics"
              element={<ProvincesPage projects={projects} darkMode={darkMode} />}
            />
            <Route
              path="/analytics/provinces/:provinceId"
              element={<CitiesPage projects={projects} darkMode={darkMode} />}
            />
            <Route
              path="/analytics/provinces/:provinceId/cities/:cityName"
              element={<BarangaysPage projects={projects} darkMode={darkMode} />}
            />
            <Route
              path="/monitoring"
              element={<MonitoringPage projects={projects} darkMode={darkMode} />}
            />
            <Route
              path="/archive"
              element={
                <ArchivePage 
                  archivedProjects={archivedProjects}
                  onRestore={handleRestore}
                  onPermanentDelete={handlePermanentDelete}
                  darkMode={darkMode}
                />
              }
            />
            <Route
              path="/dataentry"
              element={
                <DataEntryPage
                  projects={projects}
                  equipment={equipment}
                  onAddProject={handleAddProject}
                  onAddEquipment={handleAddEquipment}
                  darkMode={darkMode}
                />
              }
            />
            <Route
              path="/starbooks"
              element={<StarbooksPage darkMode={darkMode} activePage={activePage} />}
            />
          </Routes>
        </main>

        {/* Audit Log Panel */}
        {showAuditLog && (
          <AuditLog 
            logs={logs}
            onClose={() => setShowAuditLog(false)}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* ChatBot Assistant */}
      <ChatBot 
        darkMode={darkMode}
        projects={projects}
        equipment={equipment}
        onNavigate={(page) => {
          setActivePage(page);
          const route = {
            dashboard: "/dashboard",
            analytics: "/analytics",
            dataentry: "/dataentry",
            monitoring: "/monitoring",
            archive: "/archive"
          }[page];
          if (route) navigate(route);
        }} 
      />
    </div>
  );
}

// Placeholder component for non-dashboard pages
function PlaceholderPage({ activePage, darkMode }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div 
        className="text-center p-12 rounded-3xl backdrop-blur-xl shadow-2xl max-w-md animate-fade-in"
        style={{
          backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: darkMode ? '#1e293b' : '#e2e8f0'
        }}
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow">
          <span className="text-5xl">
            {activePage === "dataentry" && "✏️"}
            {activePage === "projects" && "📁"}
            {activePage === "starbooks" && "📚"}
            {activePage === "trainings" && "🎓"}
          </span>
        </div>
        <h2 className="text-3xl font-bold mb-3 gradient-text">
          {activePage === "dataentry" && "Data Entry"}
          {activePage === "projects" && "Projects"}
          {activePage === "starbooks" && "Starbooks"}
          {activePage === "trainings" && "Trainings"}
        </h2>
        <p className="font-medium mb-4" style={{ color: darkMode ? '#94a3b8' : '#475569' }}>
          This feature is coming soon
        </p>
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.3)' : '#dbeafe',
            color: darkMode ? '#60a5fa' : '#2563eb'
          }}
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          In Development
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { TopBar } from "../components/layout/TopBar";
import { Toast } from "../components/ui/Toast";
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
import { LS_KEYS } from "../shared/constants";
import { INITIAL_PROJECTS, INITIAL_EQUIPMENT } from "../shared/utils/Utils";

function AppContent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = usePersistedState("cest_logged_in", false);
  const [projects, setProjects] = usePersistedState(LS_KEYS.projects, INITIAL_PROJECTS);
  const [equipment, setEquipment] = usePersistedState(LS_KEYS.equipment, INITIAL_EQUIPMENT);
  const [archivedProjects, setArchivedProjects] = usePersistedState("cest_archived_projects", []);
  const [notifications, setNotifications] = usePersistedState(LS_KEYS.notifications, [
    {
      id: 1,
      title: "New Project Added",
      message: "A new CEST 2.0 project has been added in Gonzaga",
      time: "5 minutes ago",
      read: false,
      type: "success"
    },
    {
      id: 2,
      title: "Budget Update",
      message: "Total budget has reached ₱1.4M across all municipalities",
      time: "1 hour ago",
      read: false,
      type: "info"
    },
    {
      id: 3,
      title: "Training Scheduled",
      message: "Community training scheduled for next week in Peñablanca",
      time: "3 hours ago",
      read: true,
      type: "warning"
    }
  ]);
  const [darkMode, setDarkMode] = usePersistedState("darkMode", false);

  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCollapsed, setIsCollapsed] = usePersistedState("sidebar_collapsed", false);

  const { toasts, success, warning, removeToast } = useToastNotification();

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (!isLoggedIn) return;

    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsLoggedIn(false);
        navigate("/");
        warning('You have been logged out due to inactivity');
      }, INACTIVITY_TIMEOUT);
    };

    // Events that indicate user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [isLoggedIn, navigate, setIsLoggedIn, warning]);

  const uniqueComm = new Set(projects.map((p) => p.community)).size;
  const unreadCount = notifications.filter((n) => !n.read).length;

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
      if (showNotifs || showSettings) {
        setShowNotifs(false);
        setShowSettings(false);
      }
    };
    
    if (showNotifs || showSettings) {
      setTimeout(() => {
        document.addEventListener('click', handleClick);
      }, 0);
      
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showNotifs, showSettings]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Archive functions
  const handleRestore = (projectId) => {
    const projectToRestore = archivedProjects.find(p => p.id === projectId);
    if (projectToRestore) {
      // Remove from archive
      setArchivedProjects(archivedProjects.filter(p => p.id !== projectId));
      // Note: In a real app, you'd add back to projects here
      // For now, just show a toast notification
      console.log("Project restored:", projectToRestore);
    }
  };

  const handlePermanentDelete = (projectId) => {
    setArchivedProjects(archivedProjects.filter(p => p.id !== projectId));
  };

  // Data Entry functions
  const handleAddProject = (projectData) => {
    setProjects([...projects, projectData]);
    success('Project added successfully!');
  };

  const handleAddEquipment = (equipmentData) => {
    setEquipment([...equipment, equipmentData]);
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

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onLogout={() => {
          setIsLoggedIn(false);
          navigate("/");
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          activePage={activePage}
          unreadCount={unreadCount}
          setShowNotifs={setShowNotifs}
          setShowSettings={setShowSettings}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          projects={projects}
          onNavigateToProject={(project) => {
            setActivePage("dashboard");
            console.log("Navigate to project:", project);
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
                activePage === "dashboard" ? (
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
                  <StarbooksPage darkMode={darkMode} />
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
              element={<StarbooksPage darkMode={darkMode} />}
            />
          </Routes>
        </main>

        {/* Notification Panel */}
        {showNotifs && (
          <div 
            className="absolute top-20 right-6 w-96 max-h-[600px] rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50"
            style={{
              backgroundColor: darkMode ? '#0f172a' : '#ffffff',
              border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b" style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium px-3 py-1 rounded-lg transition-colors"
                    style={{
                      color: '#004A98',
                      background: darkMode ? 'rgba(0, 74, 152, 0.1)' : 'rgba(0, 74, 152, 0.08)'
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                    No notifications
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-4 border-b transition-colors cursor-pointer"
                    style={{
                      borderColor: darkMode ? '#1e293b' : '#e5e7eb',
                      backgroundColor: notif.read ? 'transparent' : (darkMode ? 'rgba(0, 74, 152, 0.05)' : 'rgba(0, 74, 152, 0.03)')
                    }}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{
                          backgroundColor: notif.read ? (darkMode ? '#334155' : '#cbd5e1') : '#004A98'
                        }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                            {notif.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                            style={{ color: '#ef4444' }}
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-sm mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          {notif.message}
                        </p>
                        <p className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
            {activePage === "kpireports" && "📊"}
          </span>
        </div>
        <h2 className="text-3xl font-bold mb-3 gradient-text">
          {activePage === "dataentry" && "Data Entry"}
          {activePage === "projects" && "Projects"}
          {activePage === "starbooks" && "Starbooks"}
          {activePage === "trainings" && "Trainings"}
          {activePage === "kpireports" && "KPI Reports"}
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

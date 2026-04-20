import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../shared/hooks/useAuth.jsx";
import { Sidebar } from "../components/layout/Sidebar";
import { StarbooksSidebar } from "../components/layout/StarbooksSidebar";
import { TopBar } from "../components/layout/TopBar";
import { Toast } from "../components/ui/Toast";
import { AuditLog } from "../components/ui/AuditLog";
import { LoadingScreen } from "../components/ui/LoadingScreen";
import { ChatBot } from "../components/ui/ChatBot";
import ErrorBoundary from "../components/ui/ErrorBoundary";
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
import TrainingsPage from "../features/trainings/TrainingsPage";
import { usePersistedState } from "../shared/hooks/usePersistedState";
import { useToastNotification } from "../shared/hooks/useToastNotification";
import { useAuditLog } from "../shared/hooks/useAuditLog";
import { auditService, ENTITY_TYPES } from "../shared/services/auditService";
import { db, supabase } from "../shared/services/supabaseClient";
import { LS_KEYS } from "../shared/constants";
import { INITIAL_PROJECTS, INITIAL_EQUIPMENT } from "../shared/utils/Utils";

// Auto-logout configuration
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

function AppContent() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Replace localStorage with Supabase data
  const [projects, setProjects] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [archivedProjects, setArchivedProjects] = useState([]);
  const [darkMode, setDarkMode] = usePersistedState("darkMode", false);

  const [activePage, setActivePage] = useState("dashboard");
  const [activeSystem, setActiveSystem] = usePersistedState("active_system", "cest"); // "cest" or "starbooks"
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCollapsed, setIsCollapsed] = usePersistedState("sidebar_collapsed", false);

  const { toasts, success, warning, error, removeToast } = useToastNotification();
  const { logs } = useAuditLog();
  const dataLoadedRef = useRef(false);

  // Load data from Supabase when user is authenticated — only once
  useEffect(() => {
    if (user && !authLoading && !dataLoadedRef.current) {
      dataLoadedRef.current = true;
      loadSupabaseData();
    }
    // Reset if user logs out so next login reloads fresh
    if (!user && !authLoading) {
      dataLoadedRef.current = false;
    }
  }, [user, authLoading]);

  // Failsafe: Force loading completion after reasonable time
  useEffect(() => {
    const failsafeTimeout = setTimeout(() => {
      if (loadingData) {
        console.warn('Data loading failsafe triggered, forcing completion');
        setLoadingData(false);
      }
    }, 15000); // 15 seconds max

    return () => clearTimeout(failsafeTimeout);
  }, [loadingData]);

  const loadSupabaseData = async () => {
    try {
      setLoadingData(true);
      console.log('Loading data from Supabase...');
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Data loading timeout')), 10000)
      );
      
      const [projectsData, equipmentData] = await Promise.race([
        Promise.allSettled([
          db.getProjects(),
          db.getEquipment(),
        ]),
        timeoutPromise
      ]);
      
      // Handle projects data
      if (projectsData.status === 'fulfilled') {
        setProjects(projectsData.value || []);
        console.log('Projects loaded:', projectsData.value?.length || 0);
      } else {
        console.error('Failed to load projects:', projectsData.reason);
        setProjects([]);
        // Don't show error toast during initial load to prevent UI blocking
        console.warn('Projects loading failed, continuing with empty array');
      }
      
      // Handle equipment data
      if (equipmentData.status === 'fulfilled') {
        setEquipment(equipmentData.value || []);
        console.log('Equipment loaded:', equipmentData.value?.length || 0);
      } else {
        console.error('Failed to load equipment:', equipmentData.reason);
        setEquipment([]);
        // Don't show error toast during initial load to prevent UI blocking
        console.warn('Equipment loading failed, continuing with empty array');
      }

      // Load archived items with timeout — each independently so one failure doesn't block others
      try {
        const archivedPromise = Promise.allSettled([
          db.getArchivedProjects(),
          db.getArchivedEquipment(),
          supabase.from('trainings').select('*').eq('is_archived', true).order('archived_at', { ascending: false }),
        ]);
        
        const [archivedP, archivedE, archivedTRes] = await Promise.race([
          archivedPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Archive loading timeout')), 5000))
        ]);

        const archivedItems = [
          ...(archivedP.status === 'fulfilled' ? archivedP.value : []).map(p => ({ ...p, _type: 'project' })),
          ...(archivedE.status === 'fulfilled' ? archivedE.value : []).map(e => ({ ...e, _type: 'equipment' })),
          ...((archivedTRes.status === 'fulfilled' ? archivedTRes.value.data : null) || []).map(t => ({ ...t, _type: 'training' })),
        ];
        
        setArchivedProjects(archivedItems);
        console.log('Archived items loaded:', archivedItems.length);
      } catch (archiveErr) {
        console.warn('Archive loading failed, continuing without archived items:', archiveErr);
        setArchivedProjects([]);
      }

      console.log('Data loading completed successfully');
    } catch (err) {
      console.error('Critical error loading data:', err);
      // Set empty arrays to prevent undefined errors
      setProjects([]);
      setEquipment([]);
      setArchivedProjects([]);
      
      // Only show error if it's not a timeout
      if (!err.message.includes('timeout')) {
        error('Failed to load data: ' + err.message);
      } else {
        console.warn('Data loading timed out, continuing with empty data');
      }
    } finally {
      setLoadingData(false);
    }
  };

  // Realtime subscriptions — keep UI in sync with database changes
  useEffect(() => {
    if (!user) return;

    // Temporarily disable realtime to prevent WebSocket issues
    // TODO: Re-enable when WebSocket connection is stable
    /*
    const channel = supabase
      .channel('realtime-cest')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, async () => {
        const data = await db.getProjects();
        setProjects(data || []);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, async () => {
        const data = await db.getProjects();
        setProjects(data || []);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'equipment' }, async () => {
        const data = await db.getEquipment();
        setEquipment(data || []);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'equipment' }, async () => {
        const data = await db.getEquipment();
        setEquipment(data || []);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    */
  }, [user]);

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
    if (!user) return;

    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(async () => {
        await signOut();
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
  }, [user, navigate, signOut, warning]);

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
  const handleArchiveProject = async (project) => {
    try {
      if (archivedProjects.some(p => String(p.id) === String(project.id))) return;
      setProjects(prev => prev.filter(p => p.id !== project.id));
      await db.deleteProject(project.id);
      setArchivedProjects(prev => [...prev, { ...project, _type: 'project', archived_at: new Date().toISOString() }]);
      auditService.logDelete(ENTITY_TYPES.PROJECT, project.project_title || project.project);
      success(`Project moved to archive`);
    } catch (err) {
      setProjects(prev => [...prev, project]);
      error('Failed to archive project: ' + err.message);
    }
  };

  const handleArchiveEquipment = async (item) => {
    try {
      if (archivedProjects.some(p => String(p.id) === String(item.id))) return;
      setEquipment(prev => prev.filter(e => e.id !== item.id));
      await db.deleteEquipment(item.id);
      setArchivedProjects(prev => [...prev, { ...item, _type: 'equipment', archived_at: new Date().toISOString() }]);
      auditService.logDelete(ENTITY_TYPES.EQUIPMENT, item.equipment_name || item.equipmentName);
      success(`Equipment moved to archive`);
    } catch (err) {
      setEquipment(prev => [...prev, item]);
      error('Failed to archive equipment: ' + err.message);
    }
  };

  const handleRestore = async (itemId) => {
    const item = archivedProjects.find(p => String(p.id) === String(itemId));
    if (!item) return;
    try {
      if (item._type === 'equipment') {
        await db.restoreEquipment(item.id);
        setEquipment(prev => [...prev, { ...item, is_archived: false }]);
        auditService.logRestore(ENTITY_TYPES.EQUIPMENT, item.equipment_name || item.equipmentName);
      } else if (item._type === 'training') {
        await supabase.from('trainings').update({ is_archived: false, archived_at: null }).eq('id', item.id);
        auditService.logRestore(ENTITY_TYPES.PROJECT, item.title);
      } else {
        await db.restoreProject(item.id);
        setProjects(prev => [...prev, { ...item, is_archived: false }]);
        auditService.logRestore(ENTITY_TYPES.PROJECT, item.project_title || item.project);
      }
      setArchivedProjects(prev => prev.filter(p => String(p.id) !== String(itemId)));
      success(`Restored successfully!`);
    } catch (err) {
      error('Failed to restore: ' + err.message);
    }
  };

  const handlePermanentDelete = async (itemId) => {
    const item = archivedProjects.find(p => String(p.id) === String(itemId));
    if (!item) return;
    
    // Remove from UI immediately
    setArchivedProjects(prev => prev.filter(p => String(p.id) !== String(itemId)));
    
    try {
      if (item._type === 'equipment') {
        await db.permanentDeleteEquipment(item.id);
      } else if (item._type === 'training') {
        const { error: tErr } = await supabase.from('trainings').delete().eq('id', item.id);
        if (tErr) throw tErr;
      } else {
        await db.permanentDeleteProject(item.id);
      }
      success('Permanently deleted');
    } catch (err) {
      // Rollback — put it back if DB delete failed
      setArchivedProjects(prev => [...prev, item]);
      error('Failed to permanently delete: ' + err.message);
    }
  };

  // Data Entry functions with Supabase
  const handleAddProject = async (projectData) => {
    try {
      console.log('handleAddProject called with:', projectData);
      
      // Create the project first
      const newProject = await db.createProject(projectData);
      console.log('Project created successfully:', newProject);
      
      // Add project components relationships if any
      if (projectData.components && projectData.components.length > 0) {
        console.log('Adding components:', projectData.components);
        for (const componentCode of projectData.components) {
          await db.addProjectComponent(newProject.id, componentCode);
        }
      }
      
      // Add project community types relationships if any
      if (projectData.communities && projectData.communities.length > 0) {
        console.log('Adding communities:', projectData.communities);
        for (const communityCode of projectData.communities) {
          await db.addProjectCommunityType(newProject.id, communityCode);
        }
      }
      
      // Reload projects to get the updated data with relationships
      console.log('Reloading data...');
      await loadSupabaseData();
      
      auditService.logCreate(
        ENTITY_TYPES.PROJECT, 
        projectData.project_title,
        `Municipality: ${projectData.municipality_id}, Budget: ₱${projectData.amount_funded?.toLocaleString()}`
      );
      success('Project added successfully!');
      
      // Return the created project so the modal can link equipment to it
      return newProject;
    } catch (err) {
      console.error('Error adding project:', err);
      console.error('Error details:', err.message, err.details, err.hint);
      error('Failed to add project: ' + (err.message || 'Unknown error'));
      throw err; // Re-throw so the modal can handle the error
    }
  };

  const handleAddEquipment = async (equipmentData) => {
    try {
      const newEquipment = await db.createEquipment(equipmentData);
      
      // Reload data to show the new equipment
      await loadSupabaseData();
      
      auditService.logCreate(
        ENTITY_TYPES.EQUIPMENT,
        equipmentData.equipment_name,
        `Quantity: ${equipmentData.units}, Location: ${equipmentData.municipality}`
      );
      success('Equipment added successfully!');
    } catch (err) {
      console.error('Error adding equipment:', err);
      error('Failed to add equipment: ' + (err.message || 'Unknown error'));
    }
  };

  const handleUpdateProject = async (id, projectData) => {
    try {
      console.log('Updating project with data:', projectData);
      
      const { components, communities, ...rest } = projectData;
      const updated = await db.updateProject(id, rest);
      console.log('Project updated successfully:', updated);
      
      // Handle components and communities updates if provided
      if (components && Array.isArray(components)) {
        console.log('Updating project components:', components);
        // Note: For now we just update the main project data
        // Component relationships would need separate handling
      }
      
      if (communities && Array.isArray(communities)) {
        console.log('Updating project communities:', communities);
        // Note: For now we just update the main project data
        // Community relationships would need separate handling
      }
      
      // Reload data to ensure we get the latest state with relationships
      await loadSupabaseData();
      
      auditService.logUpdate(
        ENTITY_TYPES.PROJECT,
        projectData.project_title || projectData.project,
        `Updated project details`
      );
      success('Project updated successfully!');
    } catch (err) {
      console.error('Error updating project:', err);
      error('Failed to update project: ' + err.message);
    }
  };

  const handleUpdateEquipment = async (id, equipmentData) => {
    try {
      console.log('Updating equipment with data:', equipmentData);
      
      const updatePayload = {
        year: equipmentData.year,
        municipality_id: equipmentData.municipality_id,
        community: equipmentData.community,
        equipment_name: equipmentData.equipment_name || equipmentData.equipmentName,
        units: parseInt(equipmentData.units) || 0,
        units_per_year: equipmentData.units_per_year ? parseInt(equipmentData.units_per_year) : null,
        component_id: equipmentData.component_id || equipmentData.component,
        project_title: equipmentData.project_title || null
      };
      
      console.log('Update payload:', updatePayload);
      
      const updated = await db.updateEquipment(id, updatePayload);
      console.log('Equipment updated successfully:', updated);
      
      // Reload data to ensure we get the latest state with relationships
      await loadSupabaseData();
      
      auditService.logUpdate(
        ENTITY_TYPES.EQUIPMENT,
        equipmentData.equipment_name || equipmentData.equipmentName,
        `Updated equipment details`
      );
      success('Equipment updated successfully!');
    } catch (err) {
      console.error('Error updating equipment:', err);
      error('Failed to update equipment: ' + err.message);
    }
  };

  if (authLoading || isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} darkMode={darkMode} />;
  }

  if (!user) {
    return <LoginPage darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  if (loadingData) {
    return <LoadingScreen onComplete={() => {}} darkMode={darkMode} />;
  }

  return (
    <ErrorBoundary darkMode={darkMode}>
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
            onLogout={async () => {
              await signOut();
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
            onLogout={async () => {
              await signOut();
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
                      onDeleteProject={handleArchiveProject}
                      onDeleteEquipment={handleArchiveEquipment}
                      onUpdateProject={handleUpdateProject}
                      onUpdateEquipment={handleUpdateEquipment}
                      darkMode={darkMode}
                      isLoading={loadingData}
                    />
                  ) : activePage === "trainings" ? (
                    <TrainingsPage darkMode={darkMode} onArchiveTraining={(item) => setArchivedProjects(prev => [...prev, item])} />
                  ) : activePage === "starbooks" ? (
                    <StarbooksPage darkMode={darkMode} activePage={activePage} />
                  ) : activePage?.startsWith("starbooks") ? (
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
                    onDeleteProject={handleArchiveProject}
                    onDeleteEquipment={handleArchiveEquipment}
                    onUpdateProject={handleUpdateProject}
                    onUpdateEquipment={handleUpdateEquipment}
                    darkMode={darkMode}
                    isLoading={loadingData}
                  />
                }
              />
              <Route
                path="/starbooks"
                element={<StarbooksPage darkMode={darkMode} activePage={activePage} />}
              />
              <Route
                path="/trainings"
                element={<TrainingsPage darkMode={darkMode} onArchiveTraining={(item) => setArchivedProjects(prev => [...prev, item])} />}
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
    </ErrorBoundary>
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

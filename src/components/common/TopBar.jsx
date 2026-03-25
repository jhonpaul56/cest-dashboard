import { Menu, Sun, Moon, Bell, Settings, Search, X } from "lucide-react";
import { useState } from "react";

const NAV_LABELS = {
  dashboard: "Dashboard",
  dataentry: "Data Entry",
  projects: "Projects",
  trainings: "Trainings",
  kpireports: "KPI Reports",
};

export const TopBar = ({
  activePage,
  unreadCount,
  setShowNotifs,
  setShowSettings,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  projects = [],
  onNavigateToProject,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const headerStyles = {
    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
    boxShadow: darkMode 
      ? '0 4px 24px rgba(0, 0, 0, 0.3)' 
      : '0 4px 24px rgba(0, 74, 152, 0.08)'
  };

  const buttonStyles = {
    color: darkMode ? '#94a3b8' : '#475569',
    background: darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(71, 85, 105, 0.05)'
  };

  const themeButtonStyles = {
    backgroundColor: darkMode ? '#422006' : '#fef3c7',
    borderColor: darkMode ? '#92400e' : '#fcd34d',
    color: darkMode ? '#fbbf24' : '#d97706',
    boxShadow: darkMode 
      ? '0 4px 12px rgba(251, 191, 36, 0.3)' 
      : '0 4px 12px rgba(217, 119, 6, 0.3)'
  };

  const filteredProjects = projects.filter(p => 
    searchQuery.length > 0 && (
      p.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.municipality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.community?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.year?.toString().includes(searchQuery)
    )
  );

  const handleSearchClick = () => {
    setShowSearch(true);
    setShowNotifs(false);
    setShowSettings(false);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  return (
    <>
      <header 
        className="h-20 px-6 flex items-center justify-between border-b backdrop-blur-xl relative overflow-hidden"
        style={headerStyles}
      >
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          color: '#004A98'
        }} />

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden p-2.5 rounded-xl transition-all duration-200 hover:scale-110"
            style={buttonStyles}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
              {NAV_LABELS[activePage]}
            </h1>
            <p className="text-xs font-semibold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Welcome back! Here's your overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSearchClick}
              className="p-2.5 rounded-xl transition-all duration-200 hover:scale-110 group"
              style={buttonStyles}
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-12 border-2 group"
              style={themeButtonStyles}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(false);
                setShowNotifs((v) => !v);
                setShowSearch(false);
              }}
              className="relative p-2.5 rounded-xl transition-all duration-200 hover:scale-110 group"
              style={buttonStyles}
            >
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifs(false);
                setShowSettings((v) => !v);
                setShowSearch(false);
              }}
              className="p-2.5 rounded-xl transition-all duration-200 hover:scale-110 hover:rotate-90 group"
              style={buttonStyles}
            >
              <Settings className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </header>

      {showSearch && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
            onClick={handleCloseSearch}
          />
          <div 
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="rounded-xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}>
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects by name, municipality, community, or year..."
                    className="flex-1 bg-transparent outline-none text-base"
                    style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
                    autoFocus
                  />
                  <button
                    onClick={handleCloseSearch}
                    className="p-1.5 rounded-lg hover:bg-opacity-10 transition-colors"
                    style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {searchQuery.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                      Start typing to search projects...
                    </p>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                      No projects found matching "{searchQuery}"
                    </p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredProjects.slice(0, 10).map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          if (onNavigateToProject) {
                            onNavigateToProject(project);
                          }
                          handleCloseSearch();
                        }}
                        className="w-full p-3 rounded-lg text-left transition-all duration-200 hover:scale-[1.01]"
                        style={{
                          background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.9)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)';
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 
                              className="text-sm font-semibold mb-1 line-clamp-1"
                              style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
                            >
                              {project.project}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span 
                                className="text-xs px-2 py-0.5 rounded-md font-medium"
                                style={{
                                  background: '#004A98',
                                  color: '#ffffff'
                                }}
                              >
                                {project.year}
                              </span>
                              <span 
                                className="text-xs"
                                style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                              >
                                {project.municipality}
                              </span>
                              {project.community && (
                                <>
                                  <span style={{ color: darkMode ? '#475569' : '#cbd5e1' }}>•</span>
                                  <span 
                                    className="text-xs"
                                    style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                                  >
                                    {project.community}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p 
                              className="text-xs font-medium"
                              style={{ color: darkMode ? '#64748b' : '#94a3b8' }}
                            >
                              Budget
                            </p>
                            <p 
                              className="text-sm font-bold"
                              style={{ color: '#10b981' }}
                            >
                              ₱{Number(project.amountFunded || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {filteredProjects.length > 10 && (
                      <p 
                        className="text-xs text-center py-3"
                        style={{ color: darkMode ? '#64748b' : '#94a3b8' }}
                      >
                        Showing 10 of {filteredProjects.length} results
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

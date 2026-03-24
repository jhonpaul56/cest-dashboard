import { Menu, Sun, Moon, Bell, Settings, Search, TrendingUp } from "lucide-react";

const NAV_LABELS = {
  dashboard: "Dashboard",
  dataentry: "Data Entry",
  projects: "Projects",
  trainings: "Trainings",
  kpireports: "KPI Reports",
};

export const TopBar = ({
  activePage,
  projects,
  uniqueComm,
  unreadCount,
  showNotifs,
  setShowNotifs,
  showSettings,
  setShowSettings,
  setSidebarOpen,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header 
      className="h-20 px-6 flex items-center justify-between border-b backdrop-blur-xl"
      style={{
        backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: darkMode ? '#1e293b' : '#e2e8f0'
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="lg:hidden p-2.5 rounded-xl transition-colors"
          style={{
            color: darkMode ? '#94a3b8' : '#475569'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold" style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>
            {NAV_LABELS[activePage]}
          </h1>
          <p className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            Welcome back! Here's your overview
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Stats Pills */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
            <TrendingUp className="w-4 h-4" />
            <div className="text-left">
              <p className="text-[10px] font-medium opacity-90">Projects</p>
              <p className="text-sm font-bold">{projects.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            <div className="text-left">
              <p className="text-[10px] font-medium opacity-90">Communities</p>
              <p className="text-sm font-bold">{uniqueComm}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            className="p-2.5 rounded-xl transition-colors"
            style={{ color: darkMode ? '#94a3b8' : '#475569' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl transition-colors border-2"
            style={{
              backgroundColor: darkMode ? '#422006' : '#fef3c7',
              borderColor: darkMode ? '#92400e' : '#fcd34d',
              color: darkMode ? '#fbbf24' : '#d97706'
            }}
            title={darkMode ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(false);
              setShowNotifs((v) => !v);
            }}
            className="relative p-2.5 rounded-xl transition-colors"
            style={{ color: darkMode ? '#94a3b8' : '#475569' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifs(false);
              setShowSettings((v) => !v);
            }}
            className="p-2.5 rounded-xl transition-colors"
            style={{ color: darkMode ? '#94a3b8' : '#475569' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

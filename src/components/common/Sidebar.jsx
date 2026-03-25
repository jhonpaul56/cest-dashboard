import { 
  LayoutDashboard, 
  FileText, 
  GraduationCap, 
  BarChart3, 
  LogOut, 
  Activity, 
  Archive, 
  ChevronLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { COMPONENTS } from "../../constants";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "monitoring", icon: Activity, label: "Monitoring" },
  { id: "dataentry", icon: FileText, label: "Data Entry" },
  { id: "trainings", icon: GraduationCap, label: "Trainings" },
  { id: "archive", icon: Archive, label: "Archive" },
  { id: "kpireports", icon: BarChart3, label: "KPI Reports" },
];

const ROUTES = {
  dashboard: "/dashboard",
  analytics: "/analytics",
  monitoring: "/monitoring",
  archive: "/archive",
  dataentry: "/dataentry",
};

export const Sidebar = ({ 
  activePage, 
  setActivePage, 
  sidebarOpen, 
  setSidebarOpen, 
  darkMode, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  const navigate = useNavigate();

  const handleNavigation = (itemId) => {
    setActivePage(itemId);
    setSidebarOpen(false);
    
    const route = ROUTES[itemId];
    if (route) {
      navigate(route);
    }
  };

  const sidebarStyles = {
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    borderColor: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)',
    width: sidebarOpen || !isCollapsed ? '288px' : '80px',
    boxShadow: darkMode 
      ? '4px 0 20px rgba(0, 0, 0, 0.4)' 
      : '4px 0 20px rgba(0, 0, 0, 0.05)'
  };

  const headerStyles = {
    borderColor: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)',
    background: darkMode 
      ? 'linear-gradient(180deg, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.98) 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)'
  };

  const headerHoverStyles = {
    background: darkMode 
      ? 'linear-gradient(180deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 0.4) 100%)'
      : 'linear-gradient(180deg, #ffffff 0%, rgba(241, 245, 249, 0.8) 100%)'
  };

  const logoStyles = {
    background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
    boxShadow: darkMode 
      ? '0 4px 12px rgba(0, 74, 152, 0.3)' 
      : '0 4px 12px rgba(0, 74, 152, 0.2)'
  };

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen
          border-r flex flex-col z-50 lg:z-auto
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-72"}
        `}
        style={sidebarStyles}
      >
        <button
          onClick={handleToggle}
          className={`w-full border-b transition-all duration-200 group cursor-pointer ${
            isCollapsed ? 'px-4 py-6' : 'px-6 py-5'
          }`}
          style={headerStyles}
          onMouseEnter={(e) => e.currentTarget.style.background = headerHoverStyles.background}
          onMouseLeave={(e) => e.currentTarget.style.background = headerStyles.background}
          title={isCollapsed ? "Click to expand sidebar" : "Click to collapse sidebar"}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105" 
                  style={logoStyles}
                >
                  <img 
                    src="https://caraga.dost.gov.ph/wp-content/uploads/2020/10/dostlogo.png" 
                    alt="DOST Logo" 
                    className="w-7 h-7 object-contain" 
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h1 
                  className="text-base font-bold tracking-tight transition-colors duration-200" 
                  style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
                >
                  CEST 2.0
                </h1>
                <p 
                  className="text-[11px] font-medium transition-colors duration-200" 
                  style={{ color: '#64748b' }}
                >
                  DOST Dashboard
                </p>
              </div>
              <div className="flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
                <ChevronLeft 
                  className="w-4 h-4" 
                  style={{ color: darkMode ? '#94a3b8' : '#64748b' }} 
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105" 
                style={logoStyles}
              >
                <img 
                  src="https://caraga.dost.gov.ph/wp-content/uploads/2020/10/dostlogo.png" 
                  alt="DOST Logo" 
                  className="w-7 h-7 object-contain" 
                />
              </div>
            </div>
          )}
        </button>

        <nav className={`flex-1 overflow-y-auto scrollbar-thin ${isCollapsed ? 'px-3 py-4' : 'px-4 py-4'}`}>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              const buttonStyles = {
                background: isActive 
                  ? 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)'
                  : 'transparent',
                boxShadow: isActive 
                  ? (darkMode ? '0 2px 8px rgba(0, 74, 152, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 2px 8px rgba(0, 74, 152, 0.3)')
                  : 'none'
              };

              const iconContainerStyles = {
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isActive 
                  ? 'rgba(255, 255, 255, 0.2)'
                  : (darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)'),
                color: isActive ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b')
              };

              const labelColor = isActive ? '#ffffff' : (darkMode ? '#cbd5e1' : '#334155');

              const badgeStyles = {
                background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#004A98',
                color: '#ffffff'
              };

              const handleHover = (e, isHovering) => {
                if (!isActive) {
                  e.currentTarget.style.background = isHovering
                    ? (darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(241, 245, 249, 0.8)')
                    : 'transparent';
                }
              };
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full group relative rounded-lg transition-all duration-200
                    ${isCollapsed ? 'flex justify-center' : 'flex items-center'}
                  `}
                  style={buttonStyles}
                  title={isCollapsed ? item.label : ""}
                  onMouseEnter={(e) => handleHover(e, true)}
                  onMouseLeave={(e) => handleHover(e, false)}
                >
                  {isActive && !isCollapsed && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full" 
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                      }}
                    />
                  )}

                  <div className={`flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2.5'} w-full`}>
                    <div 
                      className="flex-shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                      style={iconContainerStyles}
                    >
                      <Icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <span 
                          className="flex-1 text-left text-[13px] font-semibold tracking-wide"
                          style={{ color: labelColor }}
                        >
                          {item.label}
                        </span>
                        
                        {item.id === "kpireports" && (
                          <span 
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                            style={badgeStyles}
                          >
                            {Object.keys(COMPONENTS).length}
                          </span>
                        )}
                      </>
                    )}

                    {isCollapsed && item.id === "kpireports" && (
                      <div 
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" 
                        style={{
                          background: '#004A98',
                          color: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {Object.keys(COMPONENTS).length}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        <div 
          className={`border-t ${isCollapsed ? 'px-3 py-4' : 'px-4 py-4'}`}
          style={{
            borderColor: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)'
          }}
        >
          <button 
            className={`w-full rounded-lg transition-all duration-200 group ${
              isCollapsed ? 'flex justify-center' : 'flex items-center'
            }`}
            style={{
              background: darkMode ? 'rgba(220, 38, 38, 0.12)' : 'rgba(220, 38, 38, 0.08)',
              color: darkMode ? '#fca5a5' : '#dc2626'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = darkMode ? 'rgba(220, 38, 38, 0.18)' : 'rgba(220, 38, 38, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = darkMode ? 'rgba(220, 38, 38, 0.12)' : 'rgba(220, 38, 38, 0.08)';
            }}
            title={isCollapsed ? "Logout" : ""}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2.5'} w-full`}>
              <div 
                className="flex-shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: darkMode ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.15)'
                }}
              >
                <LogOut className="w-[18px] h-[18px]" strokeWidth={2.5} />
              </div>
              {!isCollapsed && (
                <span className="flex-1 text-left text-[13px] font-semibold tracking-wide">
                  Logout
                </span>
              )}
            </div>
          </button>
        </div>

        {!isCollapsed && (
          <div 
            className="px-4 py-3 border-t"
            style={{
              borderColor: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(226, 232, 240, 0.8)',
              background: darkMode 
                ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 1) 100%)'
                : 'linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)'
            }}
          >
            <div className="text-center space-y-0.5">
              <p 
                className="text-[10px] font-semibold" 
                style={{ 
                  color: darkMode ? '#475569' : '#94a3b8',
                  letterSpacing: '0.02em'
                }}
              >
                © {new Date().getFullYear()} DOST
              </p>
              <p 
                className="text-[9px] font-medium" 
                style={{ 
                  color: darkMode ? '#334155' : '#cbd5e1',
                  letterSpacing: '0.01em'
                }}
              >
                Department of Science and Technology
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

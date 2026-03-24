import { LayoutDashboard, FileText, FolderKanban, GraduationCap, BarChart3, LogOut, Sparkles } from "lucide-react";
import logo from "../../assets/logo.png";
import { COMPONENTS } from "../../constants";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "dataentry", icon: FileText, label: "Data Entry" },
  { id: "projects", icon: FolderKanban, label: "Projects" },
  { id: "trainings", icon: GraduationCap, label: "Trainings" },
  { id: "kpireports", icon: BarChart3, label: "KPI Reports" },
];

export const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen, darkMode }) => {
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
          fixed lg:static top-0 left-0 h-screen w-80
          backdrop-blur-xl
          border-r
          flex flex-col z-50 lg:z-auto
          transition-all duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: darkMode ? '#1e293b' : '#e2e8f0'
        }}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-lg opacity-50 animate-pulse-slow" style={{ background: '#004A98' }}></div>
              <div className="relative p-3 rounded-2xl" style={{ background: '#004A98' }}>
                <img src="https://caraga.dost.gov.ph/wp-content/uploads/2020/10/dostlogo.png" alt="DOST Logo" className="w-12 h-12 object-contain" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#004A98' }}>CEST 2.0</h1>
              <p className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#475569' }}>
                DOST Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-2">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`
                  w-full group relative overflow-hidden
                  rounded-2xl transition-all duration-300
                  animate-slide-in
                  ${isActive
                    ? "shadow-lg"
                    : "hover:shadow-md"
                  }
                `}
              >
                {/* Background - DOST Blue */}
                {isActive && (
                  <div className="absolute inset-0 opacity-100" style={{ background: '#004A98' }}></div>
                )}
                
                {/* Hover Effect - DOST Blue */}
                {!isActive && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: '#004A98' }}></div>
                )}

                {/* Content */}
                <div 
                  className="relative flex items-center gap-3 px-4 py-4"
                  style={{
                    color: isActive ? '#ffffff' : (darkMode ? '#cbd5e1' : '#334155')
                  }}
                >
                  <div 
                    className="p-2 rounded-xl transition-all"
                    style={{
                      backgroundColor: isActive 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : (darkMode ? '#1e293b' : '#f1f5f9')
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <span className="flex-1 text-left font-semibold text-sm">
                    {item.label}
                  </span>
                  
                  {item.id === "kpireports" && (
                    <span 
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: isActive 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : '#004A98',
                        color: isActive 
                          ? '#ffffff' 
                          : '#ffffff'
                      }}
                    >
                      {Object.keys(COMPONENTS).length}
                    </span>
                  )}

                  {isActive && (
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div 
          className="p-4"
          style={{
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: darkMode ? '#1e293b' : '#e2e8f0'
          }}
        >
          <button 
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 group"
            style={{
              color: darkMode ? '#f87171' : '#dc2626',
              backgroundColor: darkMode ? 'rgba(220, 38, 38, 0.2)' : '#fef2f2'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? 'rgba(220, 38, 38, 0.3)' : '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? 'rgba(220, 38, 38, 0.2)' : '#fef2f2';
            }}
          >
            <div 
              className="p-2 rounded-xl group-hover:scale-110 transition-transform"
              style={{
                backgroundColor: darkMode ? 'rgba(220, 38, 38, 0.3)' : '#fee2e2'
              }}
            >
              <LogOut className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div 
          className="p-4"
          style={{
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: darkMode ? '#1e293b' : '#e2e8f0'
          }}
        >
          <div className="text-center">
            <p className="text-[10px] font-bold" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
              © {new Date().getFullYear()} DOST
            </p>
            <p className="text-[9px]" style={{ color: darkMode ? '#475569' : '#cbd5e1' }}>
              Department of Science and Technology
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

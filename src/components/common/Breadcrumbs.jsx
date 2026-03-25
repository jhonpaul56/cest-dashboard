import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Breadcrumbs = ({ items, darkMode }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-2 mb-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
        style={{
          background: darkMode ? 'rgba(0, 74, 152, 0.1)' : 'rgba(0, 74, 152, 0.05)',
          color: '#004A98'
        }}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
            
            {isLast ? (
              <span 
                className="px-3 py-2 rounded-lg text-sm font-bold"
                style={{
                  background: darkMode ? '#1e293b' : '#f1f5f9',
                  color: darkMode ? '#f8fafc' : '#0f172a'
                }}
              >
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => item.path && navigate(item.path)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  background: 'transparent',
                  color: darkMode ? '#94a3b8' : '#64748b'
                }}
              >
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
};

import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Breadcrumb = ({ items, darkMode }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-2 mb-6">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
        style={{
          color: darkMode ? "#94a3b8" : "#64748b",
          backgroundColor: darkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? "#1e293b" : "#f1f5f9";
          e.currentTarget.style.color = "#004A98";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)";
          e.currentTarget.style.color = darkMode ? "#94a3b8" : "#64748b";
        }}
      >
        <Home className="w-4 h-4" />
        <span>Dashboard</span>
      </button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4" style={{ color: darkMode ? "#475569" : "#cbd5e1" }} />
          {item.path ? (
            <button
              onClick={() => navigate(item.path)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                color: darkMode ? "#94a3b8" : "#64748b",
                backgroundColor: darkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? "#1e293b" : "#f1f5f9";
                e.currentTarget.style.color = "#004A98";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? "rgba(30, 41, 59, 0.5)" : "rgba(248, 250, 252, 0.8)";
                e.currentTarget.style.color = darkMode ? "#94a3b8" : "#64748b";
              }}
            >
              {item.label}
            </button>
          ) : (
            <span
              className="px-3 py-1.5 rounded-lg text-sm font-semibold"
              style={{
                color: "#004A98",
                backgroundColor: darkMode ? "rgba(0, 74, 152, 0.15)" : "rgba(0, 74, 152, 0.1)",
              }}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

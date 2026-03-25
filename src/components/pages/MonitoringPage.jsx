import { useState } from "react";
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Filter } from "lucide-react";
import { fmt } from "../../utils/helpers";
import { COMP_COLORS } from "../../constants";

export const MonitoringPage = ({ projects, darkMode }) => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [componentFilter, setComponentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    const matchComponent = componentFilter === "All" || p.components?.includes(componentFilter);
    const matchSearch = !searchTerm || 
      p.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.municipality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.community?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchComponent && matchSearch;
  });

  // Calculate statistics
  const stats = {
    total: projects.length,
    ongoing: projects.filter(p => p.status === "Ongoing").length,
    liquidated: projects.filter(p => p.status === "Liquidated").length,
    finished: projects.filter(p => p.status === "Finished").length,
  };

  const cardStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.5)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const getStatusColor = (status) => {
    if (status === "Ongoing") return { bg: darkMode ? "rgba(16, 185, 129, 0.1)" : "#f0fdf4", text: "#10b981", border: darkMode ? "rgba(16, 185, 129, 0.2)" : "#86efac" };
    if (status === "Liquidated") return { bg: darkMode ? "rgba(245, 158, 11, 0.1)" : "#fef3c7", text: "#f59e0b", border: darkMode ? "rgba(245, 158, 11, 0.2)" : "#fcd34d" };
    return { bg: darkMode ? "rgba(59, 130, 246, 0.1)" : "#dbeafe", text: "#3b82f6", border: darkMode ? "rgba(59, 130, 246, 0.2)" : "#93c5fd" };
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
          Project Monitoring
        </h1>
        <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          Track and monitor all CEST 2.0 projects across Region II
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: stats.total, icon: TrendingUp, color: "#004A98" },
          { label: "Ongoing", value: stats.ongoing, icon: Clock, color: "#10b981" },
          { label: "Liquidated", value: stats.liquidated, icon: AlertCircle, color: "#f59e0b" },
          { label: "Finished", value: stats.finished, icon: CheckCircle, color: "#3b82f6" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl p-5" style={cardStyle}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ background: `${stat.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                {stat.label}
              </p>
              <p className="text-2xl font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-xl p-5" style={cardStyle}>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" style={{ color: '#004A98' }} />
          <h3 className="text-lg font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
            Filters
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="px-4 py-2.5 rounded-lg text-sm font-medium outline-none transition-all duration-200"
            style={{
              background: darkMode ? '#1e293b' : '#f8fafc',
              color: darkMode ? '#f8fafc' : '#0f172a',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            }}
            onFocus={(e) => (e.target.style.borderColor = '#004A98')}
            onBlur={(e) => (e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0')}
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium outline-none cursor-pointer transition-all duration-200"
            style={{
              background: darkMode ? '#1e293b' : '#f8fafc',
              color: darkMode ? '#f8fafc' : '#0f172a',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            }}
          >
            <option value="All">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Liquidated">Liquidated</option>
            <option value="Finished">Finished</option>
          </select>

          {/* Component Filter */}
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium outline-none cursor-pointer transition-all duration-200"
            style={{
              background: darkMode ? '#1e293b' : '#f8fafc',
              color: darkMode ? '#f8fafc' : '#0f172a',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            }}
          >
            <option value="All">All Components</option>
            <option value="sel">SEL - Sustainable Enterprise & Livelihoods</option>
            <option value="hn">HN - Health & Nutrition</option>
            <option value="hrd">HRD - Human Resource Development</option>
            <option value="drrm">DRRM - DRRM & CCA</option>
            <option value="bgcet">BGCET - Bio-Circular-Green Economy</option>
            <option value="dg">DG - Digital Governance</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          {(statusFilter !== "All" || componentFilter !== "All" || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter("All");
                setComponentFilter("All");
                setSearchTerm("");
              }}
              className="text-sm font-medium px-3 py-1 rounded-lg transition-colors"
              style={{
                color: '#004A98',
                background: darkMode ? 'rgba(0, 74, 152, 0.1)' : 'rgba(0, 74, 152, 0.08)'
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={cardStyle}>
            <p className="text-sm" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
              No projects found matching your filters.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const statusColors = getStatusColor(project.status);
            return (
              <div key={project.id} className="rounded-xl p-6 transition-all duration-200 hover:scale-[1.01]" style={cardStyle}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: '#004A98', color: '#ffffff' }}>
                        {project.year}
                      </span>
                      <span className="text-sm font-medium" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                        {project.municipality}
                      </span>
                      <span style={{ color: darkMode ? '#475569' : '#cbd5e1' }}>•</span>
                      <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        {project.community}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-base font-semibold mb-3" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {project.project}
                    </h3>

                    {/* Status and Components */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded border"
                        style={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                          borderColor: statusColors.border
                        }}
                      >
                        {project.status}
                      </span>
                      {project.components?.map((c) => (
                        <span 
                          key={c} 
                          className="text-xs font-medium px-2 py-1 rounded" 
                          style={{ 
                            backgroundColor: `${COMP_COLORS[c]}20`, 
                            color: COMP_COLORS[c] 
                          }}
                        >
                          {c.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="text-right">
                    <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                      Budget
                    </p>
                    <p className="text-2xl font-semibold" style={{ color: '#10b981' }}>
                      {fmt(project.amountFunded)}
                    </p>
                    {project.amountPerYear > 0 && (
                      <p className="text-sm mt-1" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                        {fmt(project.amountPerYear)}/year
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

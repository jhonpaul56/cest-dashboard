import { useState } from "react";
import { TrendingUp, Users, Package } from "lucide-react";
import { fmt } from "../../utils/helpers";
import { COMPONENTS, COMP_COLORS } from "../../constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Peso Icon
const PesoIcon = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 6h8a4 4 0 0 1 0 8H8V6z" />
    <line x1="8" y1="6" x2="8" y2="20" />
    <line x1="4" y1="10" x2="12" y2="10" />
    <line x1="4" y1="14" x2="12" y2="14" />
  </svg>
);

export const Dashboard = ({ projects, equipment, uniqueComm, darkMode }) => {
  const [selectedView, setSelectedView] = useState("overview");
  const [yearFilter, setYearFilter] = useState("All");
  const [search, setSearch] = useState("");

  const totalFunds = projects.reduce((s, p) => s + Number(p.amountFunded || 0), 0);
  const years = ["All", ...Array.from(new Set(projects.map((p) => Number(p.year)).filter(Boolean))).sort()];

  const filteredProjects = projects.filter((p) => {
    const matchSearch = !search || p.project?.toLowerCase().includes(search.toLowerCase()) || 
                        p.community?.toLowerCase().includes(search.toLowerCase()) || 
                        p.municipality?.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === "All" || String(p.year) === String(yearFilter);
    return matchSearch && matchYear;
  });

  const allMunicipalities = Array.from(new Set(projects.map((p) => p.municipality))).filter(Boolean).sort();
  const barData = allMunicipalities
    .map((m) => ({
      name: m.length > 10 ? m.substring(0, 8) + '...' : m,
      fullName: m,
      budget: projects.filter((p) => p.municipality === m).reduce((s, p) => s + Number(p.amountFunded), 0),
    }))
    .filter((d) => d.budget > 0)
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 6);

  const maxBudget = barData.reduce((m, d) => Math.max(m, d.budget), 0);
  const fmtChart = (v) => (maxBudget >= 1_000_000 ? `₱${(v / 1_000_000).toFixed(1)}M` : `₱${(v / 1_000).toFixed(0)}k`);

  const compCounts = Object.entries(COMPONENTS)
    .map(([k]) => ({
      name: k.toUpperCase(),
      fullName: COMPONENTS[k],
      value: projects.filter((p) => p.components.includes(k)).length,
    }))
    .filter((d) => d.value > 0);

  // Modern muted color palette with DOST blue
  const MODERN_COLORS = ["#004A98", "#0066CC", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];

  const getStatusColor = (status) => {
    if (status === "Ongoing") return darkMode ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (status === "Liquidated") return darkMode ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-amber-700 bg-amber-50 border-amber-200";
    return darkMode ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-blue-700 bg-blue-50 border-blue-200";
  };

  // Modern card style
  const cardStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: darkMode 
      ? '0 1px 3px rgba(0, 0, 0, 0.5)' 
      : '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Clean Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            CEST 2.0 Project Management
          </p>
        </div>

        {/* Modern Appealing Tabs */}
        <div className="flex gap-2 p-1.5 rounded-xl backdrop-blur-sm" style={{ 
          background: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)',
          border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
          boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          {[
            { id: "overview", label: "Overview" },
            { id: "projects", label: "Projects" },
            { id: "analytics", label: "Analytics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id)}
              className="relative px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300"
              style={
                selectedView === tab.id
                  ? {
                      background: '#004A98',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(0, 74, 152, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-1px)'
                    }
                  : {
                      background: 'transparent',
                      color: darkMode ? '#94a3b8' : '#64748b'
                    }
              }
              onMouseEnter={(e) => {
                if (selectedView !== tab.id) {
                  e.currentTarget.style.background = darkMode ? 'rgba(0, 74, 152, 0.1)' : 'rgba(0, 74, 152, 0.08)';
                  e.currentTarget.style.color = '#004A98';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedView !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedView === "overview" && (
        <>
          {/* Stats Grid - Clean & Minimal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Projects", value: projects.length, icon: TrendingUp, color: "#004A98" },
              { label: "Communities", value: uniqueComm, icon: Users, color: "#10b981" },
              { label: "Total Budget", value: fmt(totalFunds), icon: PesoIcon, color: "#004A98" },
              { label: "Equipment", value: equipment.length, icon: Package, color: "#f59e0b" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl p-6 transition-all duration-200 hover:scale-[1.02]" style={cardStyle}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ background: `${stat.color}15` }}>
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                    {stat.label}
                  </p>
                  <p className="text-3xl font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Recent Projects - Clean List */}
          <div className="rounded-xl p-6" style={cardStyle}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Recent Projects
              </h2>
              <button
                onClick={() => setSelectedView("projects")}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  background: '#004A98',
                  color: '#ffffff',
                }}
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-lg border transition-all duration-200 hover:border-indigo-500/50"
                  style={{
                    background: darkMode ? '#1e293b' : '#f8fafc',
                    borderColor: darkMode ? '#334155' : '#e2e8f0'
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: '#004A98', color: '#ffffff' }}>
                          {p.year}
                        </span>
                        <span className="text-sm font-medium" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                          {p.municipality}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {p.project}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(p.status)}`}>
                          {p.status}
                        </span>
                        {p.components.slice(0, 2).map((c) => (
                          <span key={c} className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: `${COMP_COLORS[c]}20`, color: COMP_COLORS[c] }}>
                            {c.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold" style={{ color: '#10b981' }}>
                        {fmt(p.amountFunded)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Projects Tab */}
      {selectedView === "projects" && (
        <>
          {/* Clean Search Bar */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full px-4 py-2.5 rounded-lg text-sm font-medium outline-none transition-all duration-200"
                  style={{
                    background: darkMode ? '#1e293b' : '#f8fafc',
                    color: darkMode ? '#f8fafc' : '#0f172a',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#004A98'}
                  onBlur={(e) => e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'}
                />
              </div>
              
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium outline-none cursor-pointer transition-all duration-200"
                style={{
                  background: darkMode ? '#1e293b' : '#f8fafc',
                  color: darkMode ? '#f8fafc' : '#0f172a',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  minWidth: '140px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#004A98'}
                onBlur={(e) => e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>
                ))}
              </select>

              <div className="px-4 py-2.5 rounded-lg text-sm font-semibold text-center" style={{ background: '#004A98', color: '#ffffff', minWidth: '100px' }}>
                {filteredProjects.length} / {projects.length}
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-3">
            {filteredProjects.map((p) => (
              <div key={p.id} className="rounded-xl p-6 transition-all duration-200 hover:scale-[1.01]" style={cardStyle}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: '#004A98', color: '#ffffff' }}>
                        {p.year}
                      </span>
                      <span className="text-sm font-medium" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                        {p.municipality}
                      </span>
                      <span style={{ color: darkMode ? '#475569' : '#cbd5e1' }}>•</span>
                      <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        {p.community}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-semibold mb-3" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {p.project}
                    </h3>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(p.status)}`}>
                        {p.status}
                      </span>
                      {p.components.map((c) => (
                        <span key={c} className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: `${COMP_COLORS[c]}20`, color: COMP_COLORS[c] }}>
                          {c.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                      Budget
                    </p>
                    <p className="text-2xl font-semibold" style={{ color: '#10b981' }}>
                      {fmt(p.amountFunded)}
                    </p>
                    {p.amountPerYear > 0 && (
                      <p className="text-sm mt-1" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                        {fmt(p.amountPerYear)}/year
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Analytics Tab */}
      {selectedView === "analytics" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modern Bar Chart */}
            <div className="rounded-xl p-6" style={cardStyle}>
              <h3 className="text-lg font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Budget Distribution
              </h3>
              <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Top municipalities by budget
              </p>
              
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }}
                    angle={0}
                    textAnchor="middle"
                    interval={0}
                    tickLine={false}
                    axisLine={{ stroke: darkMode ? "#334155" : "#e5e7eb", strokeWidth: 1 }}
                    height={35}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }} 
                    tickFormatter={fmtChart} 
                    tickLine={false} 
                    axisLine={false}
                    width={60}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div 
                            className="p-3 rounded-lg"
                            style={{
                              background: darkMode ? '#0f172a' : '#ffffff',
                              border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
                              boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          >
                            <p className="font-semibold text-xs mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                              {payload[0].payload.fullName}
                            </p>
                            <p className="font-bold text-lg" style={{ color: '#004A98' }}>
                              {fmtChart(payload[0].value)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ fill: darkMode ? 'rgba(148, 163, 184, 0.05)' : 'rgba(226, 232, 240, 0.5)' }}
                  />
                  <Bar 
                    dataKey="budget" 
                    radius={[6, 6, 0, 0]} 
                    fill="#004A98"
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Modern Donut Chart */}
            <div className="rounded-xl p-6" style={cardStyle}>
              <h3 className="text-lg font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Component Distribution
              </h3>
              <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                CEST 2.0 breakdown
              </p>
              
              {compCounts.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={compCounts}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={70}
                      dataKey="value"
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {compCounts.map((_, i) => (
                        <Cell 
                          key={i} 
                          fill={MODERN_COLORS[i % MODERN_COLORS.length]}
                          stroke={darkMode ? '#0f172a' : '#ffffff'}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div 
                              className="p-3 rounded-lg"
                              style={{
                                background: darkMode ? '#0f172a' : '#ffffff',
                                border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
                                boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)'
                              }}
                            >
                              <p className="font-semibold text-xs mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                                {payload[0].payload.fullName}
                              </p>
                              <p className="font-bold text-lg" style={{ color: payload[0].fill }}>
                                {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px]">
                  <p className="text-sm" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                    No data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Component Analysis */}
          <div className="rounded-xl p-6" style={cardStyle}>
            <h3 className="text-lg font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
              Component Analysis
            </h3>
            <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Detailed breakdown by component
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(COMPONENTS).map(([key, name]) => {
                const count = projects.filter((p) => p.components.includes(key)).length;
                const percentage = projects.length > 0 ? ((count / projects.length) * 100).toFixed(1) : 0;
                
                return (
                  <div 
                    key={key}
                    className="p-5 rounded-lg border transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: darkMode ? '#1e293b' : '#f8fafc',
                      borderColor: darkMode ? '#334155' : '#e2e8f0'
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: `${COMP_COLORS[key]}20`, color: COMP_COLORS[key] }}>
                        {key.toUpperCase()}
                      </span>
                      <span className="text-2xl font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {count}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium mb-3" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {name}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? '#0f172a' : '#e5e7eb' }}>
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%`, backgroundColor: COMP_COLORS[key] }}
                        ></div>
                      </div>
                      <p className="text-xs font-medium" style={{ color: COMP_COLORS[key] }}>
                        {percentage}% of projects
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

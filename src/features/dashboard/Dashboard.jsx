import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, Package, Info, FileText, MapPin, X, Eye } from "lucide-react";
import { fmt, getStatusColor, getCardStyle, formatCurrencyShort } from "../../shared/utils/helpers";
import { COMPONENTS, COMP_COLORS } from "../../shared/constants";
import { HoverTooltip } from "../../components/ui/Tooltip";
import { getAllProvinces } from "../../shared/data/regionII";
import { transformProjects, transformEquipmentList } from "../../shared/utils/dataTransform";
import { safeString, safeProjectTitle, safeEquipmentName, safeDisplayName } from "../../shared/utils/safeRender";
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

export const Dashboard = ({ projects = [], equipment = [], uniqueComm = 0, darkMode }) => {
  const navigate = useNavigate();

  // Transform Supabase data structure to match expected format
  const transformedProjects = transformProjects(projects);
  const transformedEquipment = transformEquipmentList(equipment || []);
  const [selectedView, setSelectedView] = useState("overview");
  const [yearFilter, setYearFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showComponentLegend, setShowComponentLegend] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const totalFunds = transformedProjects.reduce((s, p) => s + Number(p.amountFunded || 0), 0);
  const years = ["All", ...Array.from(new Set(transformedProjects.map((p) => Number(p.year)).filter(Boolean))).sort()];

  const filteredProjects = transformedProjects.filter((p) => {
    const matchSearch = !search || p.project?.toLowerCase().includes(search.toLowerCase()) || 
                        p.community?.toLowerCase().includes(search.toLowerCase()) || 
                        p.municipality?.toLowerCase().includes(search.toLowerCase());
    const matchYear = yearFilter === "All" || String(p.year) === String(yearFilter);
    return matchSearch && matchYear;
  });

  // Get official provinces for region overview
  const officialProvinces = getAllProvinces();

  const barData = officialProvinces
    .map((province) => {
      const provinceProjects = transformedProjects.filter(
        (p) => p.province?.toLowerCase() === province.name.toLowerCase()
      );
      return {
        name: province.code,
        fullName: province.name,
        id: province.id,
        budget: provinceProjects.reduce((s, p) => s + Number(p.amountFunded || 0), 0),
      };
    })
    .sort((a, b) => b.budget - a.budget);

  const compCounts = Object.entries(COMPONENTS)
    .map(([k]) => ({
      name: k.toUpperCase(),
      fullName: COMPONENTS[k],
      value: transformedProjects.filter((p) => p.components?.includes(k)).length,
    }))
    .filter((d) => d.value > 0);

  // Modern muted color palette with DOST blue
  const MODERN_COLORS = ["#004A98", "#0066CC", "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];

  // Modern card style with subtle elevation
  const cardStyle = getCardStyle(darkMode);

  const handleViewDetails = (item, index) => {
    const itemWithDisplayId = {
      ...item,
      displayId: `Project #${index + 1}`
    };
    setSelectedItem(itemWithDisplayId);
    setShowDetailModal(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Enhanced Premium Tab Design */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex gap-2 p-2 rounded-2xl" style={{ 
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9), rgba(241, 245, 249, 0.8))',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.5)'}`,
          boxShadow: darkMode 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 74, 152, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
        }}>
          {[
            { id: "overview", label: "Overview", icon: "📊", gradient: "linear-gradient(135deg, #004A98 0%, #0066CC 100%)" },
            { id: "projects", label: "Projects", icon: "📁", gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
            { id: "analytics", label: "Analytics", icon: "📈", gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id)}
              className="relative px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center gap-3 group overflow-hidden"
              style={
                selectedView === tab.id
                  ? {
                      background: tab.gradient,
                      color: '#ffffff',
                      boxShadow: '0 8px 25px rgba(0, 74, 152, 0.4), 0 3px 10px rgba(0, 0, 0, 0.2)',
                      transform: 'translateY(-1px)'
                    }
                  : {
                      background: 'transparent',
                      color: darkMode ? '#94a3b8' : '#64748b'
                    }
              }
            >
              {/* Hover effect background */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: tab.gradient }}
              ></div>
              
              <span className="text-lg relative z-10 group-hover:scale-110 transition-transform duration-300">
                {tab.icon}
              </span>
              <span className="relative z-10">{tab.label}</span>
              
              {/* Active indicator */}
              {selectedView === tab.id && (
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                ></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedView === "overview" && (
        <>
          {/* Enhanced Premium Stats Grid with Micro-interactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: "Total Projects", 
                value: transformedProjects.length, 
                icon: TrendingUp, 
                color: "#004A98", 
                bgColor: "rgba(0, 74, 152, 0.1)",
                gradient: "linear-gradient(135deg, #004A98 0%, #0066CC 100%)"
              },
              { 
                label: "Communities", 
                value: uniqueComm, 
                icon: Users, 
                color: "#10b981", 
                bgColor: "rgba(16, 185, 129, 0.1)",
                gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              },
              { 
                label: "Total Budget", 
                value: fmt(totalFunds), 
                icon: PesoIcon, 
                color: "#004A98", 
                bgColor: "rgba(0, 74, 152, 0.1)",
                gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              },
              { 
                label: "Equipment", 
                value: equipment.length, 
                icon: Package, 
                color: "#8b5cf6", 
                bgColor: "rgba(139, 92, 246, 0.1)",
                gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label} 
                  className="group rounded-2xl p-6 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl relative overflow-hidden cursor-pointer" 
                  style={{
                    ...cardStyle,
                    animationDelay: `${index * 150}ms`,
                    background: darkMode 
                      ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    border: `1px solid ${darkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(226, 232, 240, 0.5)'}`,
                    boxShadow: darkMode 
                      ? '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 10px 40px rgba(0, 74, 152, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {/* Animated background gradient on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: stat.gradient }}
                  ></div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-500" style={{ background: stat.color }}></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 rounded-full opacity-30 group-hover:opacity-80 transition-opacity duration-700" style={{ background: stat.color }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{ 
                          background: stat.bgColor,
                          boxShadow: `0 8px 25px ${stat.color}20`
                        }}
                      >
                        <Icon className="w-6 h-6 transition-all duration-300" style={{ color: stat.color }} />
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: stat.color }}
                      ></div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                        {stat.label}
                      </p>
                      <p className="text-3xl font-black group-hover:scale-110 transition-transform duration-300" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {stat.value}
                      </p>
                    </div>
                    
                    {/* Progress bar animation */}
                    <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000 group-hover:w-full"
                        style={{ 
                          backgroundColor: stat.color,
                          width: '60%'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium Recent Projects Section */}
          <div className="rounded-xl p-6" style={cardStyle}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Recent Projects
                </h2>
                <p className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                  Latest activities and updates
                </p>
              </div>
              <button
                onClick={() => setSelectedView("projects")}
                className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
                  color: '#ffffff',
                }}
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {transformedProjects.slice(0, 5).map((p, index) => (
                <div
                  key={`${p.id}-${index}`}
                  onClick={() => handleViewDetails(p, index)}
                  className="group p-4 rounded-lg border transition-all duration-300 hover:shadow-md hover:border-blue-500/30 cursor-pointer"
                  style={{
                    background: darkMode 
                      ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.5) 0%, rgba(30, 41, 59, 0.3) 100%)'
                      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ 
                          background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)', 
                          color: '#ffffff'
                        }}>
                          {p.year}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                          color: '#ffffff'
                        }}>
                          Project #{index + 1}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: darkMode ? '#cbd5e1' : '#6b7280' }}>
                          {typeof p.municipality === 'object' ? p.municipality?.name || 'Unknown' : p.municipality || 'Unknown'}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {p.project}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getStatusColor(p.status, darkMode)}`}>
                          {p.status}
                        </span>
                        {(p.components || []).filter(Boolean).slice(0, 2).map((c, index) => (
                          <HoverTooltip
                            key={`${c}-${index}`}
                            content={COMPONENTS[c] || c}
                            position="auto"
                            darkMode={darkMode}
                            delay={150}
                          >
                            <span 
                              className="text-xs font-semibold px-3 py-1.5 rounded-xl cursor-help transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden group" 
                              style={{ 
                                background: `linear-gradient(135deg, ${COMP_COLORS[c] || '#64748b'}15, ${COMP_COLORS[c] || '#64748b'}25)`,
                                color: COMP_COLORS[c] || '#64748b',
                                border: `2px solid ${COMP_COLORS[c] || '#64748b'}30`,
                                boxShadow: `0 3px 10px ${COMP_COLORS[c] || '#64748b'}20`
                              }}
                            >
                              {/* Shine effect */}
                              <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-all duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"
                                style={{ width: '50%' }}
                              />
                              <span className="relative z-10">{c?.toUpperCase() || 'N/A'}</span>
                            </span>
                          </HoverTooltip>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium mb-1" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                        Budget
                      </p>
                      <p className="text-xl font-bold" style={{ color: '#10b981' }}>
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
                {filteredProjects.length} / {transformedProjects.length}
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-3">
            {filteredProjects.map((p, index) => (
              <div 
                key={`${p.id}-${index}`} 
                onClick={() => handleViewDetails(p, index)}
                className="rounded-xl p-6 transition-all duration-200 hover:scale-[1.01] cursor-pointer" 
                style={cardStyle}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: '#004A98', color: '#ffffff' }}>
                        {p.year}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: '#10b981', color: '#ffffff' }}>
                        Project #{index + 1}
                      </span>
                      <span className="text-sm font-medium" style={{ color: darkMode ? '#cbd5e1' : '#6b7280' }}>
                        {typeof p.municipality === 'object' ? p.municipality?.name || 'Unknown' : p.municipality || 'Unknown'}
                      </span>
                      <span style={{ color: darkMode ? '#6b7280' : '#cbd5e1' }}>•</span>
                      <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                        {p.community}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-semibold mb-3" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {p.project}
                    </h3>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(p.status, darkMode)}`}>
                        {p.status}
                      </span>
                      {(p.components || []).filter(Boolean).map((c, index) => (
                        <HoverTooltip
                          key={`${c}-${index}`}
                          content={COMPONENTS[c] || c}
                          position="auto"
                          darkMode={darkMode}
                          delay={150}
                        >
                          <span 
                            className="text-xs font-medium px-3 py-1.5 rounded-xl cursor-help transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden group" 
                            style={{ 
                              background: `linear-gradient(135deg, ${COMP_COLORS[c] || '#64748b'}15, ${COMP_COLORS[c] || '#64748b'}25)`,
                              color: COMP_COLORS[c] || '#64748b',
                              border: `2px solid ${COMP_COLORS[c] || '#64748b'}30`,
                              boxShadow: `0 3px 10px ${COMP_COLORS[c] || '#64748b'}20`
                            }}
                          >
                            {/* Shine effect */}
                            <div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-all duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"
                              style={{ width: '50%' }}
                            />
                            <span className="relative z-10">{c?.toUpperCase() || 'N/A'}</span>
                          </span>
                        </HoverTooltip>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs font-medium mb-1 uppercase tracking-wide" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                      Budget
                    </p>
                    <p className="text-2xl font-semibold" style={{ color: '#10b981' }}>
                      {fmt(p.amountFunded)}
                    </p>
                    {p.amountPerYear > 0 && (
                      <p className="text-sm mt-1" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
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
          {/* Header with Component Legend Button */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Region II Analytics
              </h2>
              <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                Aggregated data across Region II provinces - Click any province to drill down
              </p>
            </div>
            <button
              onClick={() => setShowComponentLegend(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: darkMode ? '#1e293b' : '#f8fafc',
                color: '#004A98',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              }}
            >
              <Info className="w-4 h-4" />
              Component Legend
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Modern Bar Chart - Provinces */}
                <div className="rounded-xl p-6" style={cardStyle}>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    Budget Distribution
                  </h3>
                  <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                    Top provinces by budget - Click to drill down
                  </p>
                  
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: darkMode ? "#94a3b8" : "#6b7280", fontWeight: 500 }}
                        angle={0}
                        textAnchor="middle"
                        interval={0}
                        tickLine={false}
                        axisLine={{ stroke: darkMode ? "#334155" : "#e5e7eb", strokeWidth: 1 }}
                        height={35}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: darkMode ? "#94a3b8" : "#6b7280", fontWeight: 500 }} 
                        tickFormatter={formatCurrencyShort} 
                        tickLine={false} 
                        axisLine={false}
                        width={60}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div 
                                className="p-3 rounded-lg cursor-pointer"
                                style={{
                                  background: darkMode ? '#0f172a' : '#ffffff',
                                  border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
                                  boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                                onClick={() => navigate(`/analytics/provinces/${payload[0].payload.id}`)}
                              >
                                <p className="font-semibold text-xs mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                                  {payload[0].payload.fullName}
                                </p>
                                <p className="font-bold text-lg" style={{ color: '#004A98' }}>
                                  {formatCurrencyShort(payload[0].value)}
                                </p>
                                <p className="text-xs mt-1" style={{ color: '#10b981' }}>
                                  Click to view details →
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
                        onClick={(data) => navigate(`/analytics/provinces/${data.id}`)}
                        style={{ cursor: 'pointer' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Modern Donut Chart */}
                <div className="rounded-xl p-6" style={cardStyle}>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    Component Distribution
                  </h3>
                  <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
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
                      <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
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
                <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                  Detailed breakdown by component
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(COMPONENTS).map(([key, name]) => {
                    const count = transformedProjects.filter((p) => p.components?.includes(key)).length;
                    const percentage = transformedProjects.length > 0 ? ((count / transformedProjects.length) * 100).toFixed(1) : 0;
                    
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
                        
                        <p className="text-sm font-medium mb-3" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
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

      {/* Component Legend Modal */}
      {showComponentLegend && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-backdrop-fade-in"
            onClick={() => setShowComponentLegend(false)}
          />
        <div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl z-50 animate-modal-fade-in"
          style={{
            background: darkMode ? '#0f172a' : '#ffffff',
            border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b" style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  CEST 2.0 Component Legend
                </h2>
                <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                  Community Empowerment through Science & Technology
                </p>
              </div>
              <button
                onClick={() => setShowComponentLegend(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: darkMode ? '#1e293b' : '#f1f5f9',
                  color: darkMode ? '#f8fafc' : '#0f172a'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {Object.entries(COMPONENTS).map(([key, fullName]) => (
              <div 
                key={key}
                className="p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: `${COMP_COLORS[key]}10`,
                  borderColor: `${COMP_COLORS[key]}40`
                }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${COMP_COLORS[key]}30` }}
                  >
                    <span className="text-xl font-bold" style={{ color: COMP_COLORS[key] }}>
                      {key.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-1" style={{ color: COMP_COLORS[key] }}>
                      {key.toUpperCase()}
                    </h3>
                    <p className="text-base font-semibold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {fullName}
                    </p>
                    <p className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                      {key === 'sel' && 'Focuses on sustainable livelihood projects and enterprise development in communities'}
                      {key === 'hn' && 'Addresses health and nutrition needs through science and technology interventions'}
                      {key === 'hrd' && 'Develops human resources through education, training, and capacity building'}
                      {key === 'drrm' && 'Disaster Risk Reduction Management and Climate Change Adaptation initiatives'}
                      {key === 'bgcet' && 'Promotes bio-circular-green economy technologies for sustainable development'}
                      {key === 'dg' && 'Implements digital governance tools and ICT solutions for communities'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t" style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}>
            <button
              onClick={() => setShowComponentLegend(false)}
              className="w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
                color: '#ffffff'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </>
    )}

    {/* Detail Modal */}
    {showDetailModal && selectedItem && (() => {
      const isProject = !!(selectedItem.project || selectedItem.project_title);
      const title = selectedItem.project || selectedItem.project_title || selectedItem.equipment_name || selectedItem.equipmentName || 'Unknown';
      const municipality = typeof selectedItem.municipality === 'object' ? selectedItem.municipality?.name : selectedItem.municipality;
      const province = typeof selectedItem.province === 'object' ? selectedItem.province?.name : selectedItem.province;
      const benef = selectedItem.beneficiaries || {};
      const benefTotal = (benef.male||0)+(benef.female||0)+(benef.ips||0)+(benef.fourps||0)+(benef.pwd||0)+(benef.senior||0);
      const communities = selectedItem.communities || [];
      const components = selectedItem.components || [];

      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowDetailModal(false)}>
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            style={{
              background: darkMode ? 'linear-gradient(145deg, #1e293b, #0f172a)' : 'linear-gradient(145deg, #ffffff, #f8fafc)',
              border: `1px solid ${darkMode ? 'rgba(148,163,184,0.15)' : 'rgba(0,74,152,0.1)'}`,
              boxShadow: darkMode ? '0 40px 80px rgba(0,0,0,0.6)' : '0 40px 80px rgba(0,74,152,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="relative p-6 rounded-t-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #004A98 0%, #0066CC 50%, #10b981 100%)' }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                    {isProject ? <FileText className="w-7 h-7 text-white" /> : <Package className="w-7 h-7 text-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}>
                        {selectedItem.displayId}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                        {selectedItem.year || 'N/A'}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
                    <p className="text-sm text-blue-100 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {municipality || 'Unknown'}{province ? `, ${province}` : ''}
                      {selectedItem.community ? ` • ${selectedItem.community}` : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-xl transition-all duration-200 flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">

              {/* Status + Stakeholders row */}
              {isProject && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl" style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,74,152,0.04)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Status</p>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${getStatusColor(selectedItem.status, darkMode)}`}>
                      {selectedItem.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl" style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,74,152,0.04)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Stakeholders</p>
                    <p className="text-sm font-bold" style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}>
                      {typeof selectedItem.stakeholders === 'object'
                        ? Object.entries(selectedItem.stakeholders || {})
                            .filter(([k, v]) => k !== 'othersLabel' && v && v !== 0)
                            .map(([k]) => k.toUpperCase()).join(', ') || '—'
                        : selectedItem.stakeholders || '—'}
                    </p>
                  </div>
                </div>
              )}

              {/* Budget */}
              {isProject && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#10b981' }}>Amount Funded</p>
                    <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{fmt(selectedItem.amountFunded || selectedItem.amount_funded || 0)}</p>
                  </div>
                  <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(0,74,152,0.1), rgba(0,74,152,0.05))', border: '1px solid rgba(0,74,152,0.2)' }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#004A98' }}>Amount Per Year</p>
                    <p className="text-2xl font-bold" style={{ color: '#004A98' }}>{fmt(selectedItem.amountPerYear || selectedItem.amount_per_year || 0)}</p>
                  </div>
                </div>
              )}

              {/* Components */}
              {isProject && components.length > 0 && (
                <div className="p-4 rounded-2xl" style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,74,152,0.04)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>CEST Components</p>
                  <div className="flex flex-wrap gap-2">
                    {components.map((c, i) => {
                      const componentKey = typeof c === 'object' ? c.id || c.component?.id || c : c;
                      const componentName = typeof c === 'object' ? c.name || c.component?.name || componentKey : componentKey;
                      return (
                        <HoverTooltip
                          key={i}
                          content={COMPONENTS[componentKey] || componentName}
                          position="auto"
                          darkMode={darkMode}
                          delay={150}
                        >
                          <span 
                            className="px-4 py-2 rounded-2xl text-xs font-bold cursor-help transition-all duration-300 hover:scale-110 hover:shadow-xl relative overflow-hidden group"
                            style={{ 
                              background: `linear-gradient(135deg, ${COMP_COLORS[componentKey] || '#64748b'}15, ${COMP_COLORS[componentKey] || '#64748b'}25)`, 
                              color: COMP_COLORS[componentKey] || '#64748b', 
                              border: `2px solid ${COMP_COLORS[componentKey] || '#64748b'}40`,
                              boxShadow: `0 4px 15px ${COMP_COLORS[componentKey] || '#64748b'}20`
                            }}
                          >
                            {/* Shine effect on hover */}
                            <div 
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                              style={{ width: '50%' }}
                            />
                            <span className="relative z-10">{String(componentKey)?.toUpperCase()}</span>
                          </span>
                        </HoverTooltip>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Equipment Details */}
              {isProject && (() => {
                // Get equipment linked to this project
                const projectTitle = safeProjectTitle(selectedItem);
                const linkedEquipment = transformedEquipment.filter(eq => {
                  const isLinkedToProject = (
                    // Link by project_id (most reliable)
                    (eq.project_id && selectedItem.id && String(eq.project_id) === String(selectedItem.id)) ||
                    // Link by matching project titles (direct comparison)
                    (projectTitle && eq.project_title && projectTitle === eq.project_title) ||
                    // Link by matching project titles (transformed)
                    (projectTitle && safeProjectTitle(eq) && projectTitle === safeProjectTitle(eq)) ||
                    // Legacy linking methods
                    (eq.projectName === projectTitle) ||
                    (eq.project?.project_title === projectTitle)
                  );
                  return isLinkedToProject;
                });

                if (linkedEquipment.length === 0) return null;

                return (
                  <div className="p-4 rounded-2xl" style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,74,152,0.04)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                      Equipment Details <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: '#10b98120', color: '#10b981' }}>
                        {linkedEquipment.length} item{linkedEquipment.length !== 1 ? 's' : ''}
                      </span>
                    </p>
                    <div className="space-y-3">
                      {linkedEquipment.map((eq, index) => (
                        <div 
                          key={`equipment-${eq.id}-${index}`}
                          className="p-3 rounded-xl border transition-all duration-200 hover:shadow-md"
                          style={{
                            background: darkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.03)',
                            borderColor: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                            borderLeft: '3px solid #10b981'
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: '#10b981', color: '#ffffff' }}>
                                  {eq.year || 'N/A'}
                                </span>
                                <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: '#f59e0b', color: '#ffffff' }}>
                                  Equipment #{index + 1}
                                </span>
                              </div>
                              <h5 className="text-sm font-semibold mb-1" style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}>
                                {safeEquipmentName(eq) || 'Untitled Equipment'}
                              </h5>
                              <div className="flex items-center gap-3 text-xs mb-2" style={{ color: darkMode ? '#cbd5e1' : '#4b5563' }}>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="font-semibold">{eq.municipality || 'Unknown Location'}</span>
                                </div>
                                <span>•</span>
                                <span className="font-semibold">{eq.community || 'N/A'}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Package className="w-3 h-3" />
                                  <span className="font-semibold">{eq.units || 0} units</span>
                                </div>
                              </div>
                              {/* Component badge */}
                              {eq.component_id && (
                                <div className="flex items-center gap-1">
                                  <span 
                                    className="text-xs font-medium px-2 py-1 rounded-lg"
                                    style={{
                                      background: `${COMP_COLORS[eq.component_id] || '#64748b'}20`,
                                      color: COMP_COLORS[eq.component_id] || '#64748b',
                                      border: `1px solid ${COMP_COLORS[eq.component_id] || '#64748b'}40`
                                    }}
                                  >
                                    {String(eq.component_id)?.toUpperCase() || 'N/A'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium mb-1" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                                Total Units
                              </p>
                              <p className="text-lg font-bold" style={{ color: '#10b981' }}>
                                {eq.units || 0}
                              </p>
                              {eq.units_per_year && (
                                <p className="text-xs mt-1" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                                  {eq.units_per_year}/year
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Beneficiaries */}
              {isProject && benefTotal > 0 && (
                <div className="p-4 rounded-2xl" style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,74,152,0.04)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>
                    No. of Beneficiaries <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: '#004A9820', color: '#004A98' }}>Total: {benefTotal}</span>
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[['Male', benef.male], ['Female', benef.female], ['IPs', benef.ips], ['4Ps', benef.fourps], ['PWD', benef.pwd], ['Senior', benef.senior]].map(([label, val]) => (
                      <div key={label} className="text-center p-2 rounded-xl" style={{ background: darkMode ? '#1e293b' : '#f1f5f9' }}>
                        <p className="text-lg font-bold" style={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}>{val || 0}</p>
                        <p className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Community Types */}
              {isProject && communities.length > 0 && (
                <div className="p-4 rounded-2xl" style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,74,152,0.04)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Community Types</p>
                  <div className="flex flex-wrap gap-2">
                    {communities.map((c, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize"
                        style={{ background: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#cbd5e1' : '#374151' }}>
                        🏘️ {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachment */}
              {selectedItem.file_name && selectedItem.file_data && (
                <div className="p-4 rounded-2xl" style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,74,152,0.04)', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>Attachment</p>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: darkMode ? '#1e293b' : '#f1f5f9' }}>
                    <FileText className="w-8 h-8 flex-shrink-0" style={{ color: '#ef4444' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>{selectedItem.file_name}</p>
                      <p className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#6b7280' }}>PDF Document</p>
                    </div>
                    <button
                      onClick={() => window.open(selectedItem.file_data, '_blank')}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #004A98, #0066CC)' }}>
                      <Eye className="w-3 h-3" /> View PDF
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer with Close button */}
            <div className="px-6 pb-6 pt-4 flex justify-end gap-3 border-t sticky bottom-0"
              style={{
                borderColor: darkMode ? '#334155' : '#e2e8f0',
                background: darkMode ? 'linear-gradient(145deg, #1e293b, #0f172a)' : 'linear-gradient(145deg, #ffffff, #f8fafc)'
              }}>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{ background: darkMode ? '#334155' : '#f1f5f9', color: darkMode ? '#94a3b8' : '#64748b' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      );
    })()}
    
    {/* Enhanced CSS Animations */}
    <style>{`
      @keyframes backdrop-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes modal-fade-in {
        from { 
          opacity: 0; 
          transform: translate(-50%, -50%) scale(0.9);
        }
        to { 
          opacity: 1; 
          transform: translate(-50%, -50%) scale(1);
        }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-5px) rotate(1deg); }
        66% { transform: translateY(2px) rotate(-1deg); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 5px rgba(0, 74, 152, 0.3); }
        50% { box-shadow: 0 0 20px rgba(0, 74, 152, 0.6); }
      }
      
      .animate-backdrop-fade-in {
        animation: backdrop-fade-in 0.3s ease-out;
      }
      
      .animate-modal-fade-in {
        animation: modal-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }
    `}</style>
    </div>
  );
};

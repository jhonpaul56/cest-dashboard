import { ArrowLeft } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fmt } from "../../utils/helpers";

export const MunicipalitiesPage = ({ projects, darkMode, onBack, onSelectMunicipality }) => {
  // Get ALL municipalities from projects data
  const municipalities = Array.from(
    new Set(projects.map(p => p.municipality))
  ).filter(Boolean).sort();

  const municipalityData = municipalities.map(municipality => {
    const munProjects = projects.filter(p => p.municipality === municipality);
    const totalBudget = munProjects.reduce((sum, p) => sum + Number(p.amountFunded || 0), 0);
    
    return {
      name: municipality.length > 15 ? municipality.substring(0, 13) + '...' : municipality,
      fullName: municipality,
      projects: munProjects.length,
      budget: totalBudget,
      communities: new Set(munProjects.map(p => p.community)).size
    };
  }).sort((a, b) => b.budget - a.budget);

  const cardStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.5)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const maxBudget = Math.max(...municipalityData.map(d => d.budget));
  const fmtChart = (v) => (maxBudget >= 1_000_000 ? `₱${(v / 1_000_000).toFixed(1)}M` : `₱${(v / 1_000).toFixed(0)}k`);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={onBack}
          className="font-medium transition-colors hover:underline"
          style={{ color: '#004A98' }}
        >
          Analytics
        </button>
        <span style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>/</span>
        <span className="font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
          Municipalities
        </span>
      </div>

      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            background: darkMode ? '#1e293b' : '#f1f5f9',
            color: darkMode ? '#f8fafc' : '#0f172a'
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
            All Municipalities
          </h1>
          <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            Region II - Cagayan Valley
          </p>
        </div>
      </div>

      {/* Municipality Chart */}
      <div className="rounded-xl p-6" style={cardStyle}>
        <h3 className="text-lg font-semibold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
          Budget by Municipality
        </h3>
        <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          Budget allocation across all municipalities
        </p>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={municipalityData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }}
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
                      <p className="font-bold text-lg mb-1" style={{ color: '#004A98' }}>
                        {fmtChart(payload[0].value)}
                      </p>
                      <p className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        {payload[0].payload.projects} projects
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="budget" radius={[6, 6, 0, 0]} fill="#004A98" maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Municipality Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {municipalityData.map((municipality) => (
          <button
            key={municipality.fullName}
            onClick={() => onSelectMunicipality(municipality.fullName)}
            className="text-left rounded-xl p-6 transition-all duration-200 hover:scale-[1.02]"
            style={cardStyle}
          >
            <h3 className="text-lg font-semibold mb-3" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
              {municipality.fullName}
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Projects
                </span>
                <span className="text-lg font-bold" style={{ color: '#004A98' }}>
                  {municipality.projects}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Budget
                </span>
                <span className="text-lg font-bold" style={{ color: '#10b981' }}>
                  {fmt(municipality.budget)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Communities
                </span>
                <span className="text-lg font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  {municipality.communities}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t" style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}>
              <span className="text-sm font-medium" style={{ color: '#004A98' }}>
                View Barangays →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, TrendingUp, ArrowRight, MapPin } from "lucide-react";
import { Breadcrumb } from "../common/Breadcrumb";
import { fmt } from "../../utils/helpers";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getAllProvinces } from "../../data/regionII";

const CHART_COLORS = ["#004A98", "#0066CC", "#3b82f6", "#8b5cf6", "#10b981"];

export const ProvincesPage = ({ projects, darkMode }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Get official Region II provinces
  const REGION_II_PROVINCES = getAllProvinces();

  // Calculate province-level data
  const provinceData = REGION_II_PROVINCES.map((province) => {
    const provinceProjects = projects.filter(
      (p) => p.province?.toLowerCase() === province.name.toLowerCase()
    );
    
    const totalBudget = provinceProjects.reduce((sum, p) => sum + Number(p.amountFunded || 0), 0);
    const municipalities = new Set(provinceProjects.map((p) => p.municipality)).size;
    const barangays = new Set(provinceProjects.map((p) => p.community)).size;

    return {
      ...province,
      projectCount: provinceProjects.length,
      totalBudget,
      municipalities,
      barangays,
    };
  }).filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Chart data - top provinces by budget
  const chartData = provinceData
    .filter((p) => p.totalBudget > 0)
    .sort((a, b) => b.totalBudget - a.totalBudget)
    .map((p) => ({
      name: p.code,
      fullName: p.name,
      budget: p.totalBudget,
    }));

  const maxBudget = chartData.reduce((m, d) => Math.max(m, d.budget), 0);
  const fmtChart = (v) =>
    maxBudget >= 1_000_000 ? `₱${(v / 1_000_000).toFixed(1)}M` : `₱${(v / 1_000).toFixed(0)}k`;

  // Pie chart data - budget distribution
  const pieData = chartData.map((d, i) => ({
    name: d.fullName,
    value: d.budget,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const totalBudget = provinceData.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalProjects = provinceData.reduce((sum, p) => sum + p.projectCount, 0);
  const totalMunicipalities = provinceData.reduce((sum, p) => sum + p.municipalities, 0);
  const totalBarangays = provinceData.reduce((sum, p) => sum + p.barangays, 0);

  const cardStyle = {
    background: darkMode ? "#0f172a" : "#ffffff",
    border: `1px solid ${darkMode ? "#1e293b" : "#e5e7eb"}`,
    boxShadow: darkMode ? "0 1px 3px rgba(0, 0, 0, 0.5)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <Breadcrumb items={[{ label: "Region II Analytics" }]} darkMode={darkMode} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
            Region II - Cagayan Valley
          </h1>
          <p className="text-sm" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
            Select a province to view detailed analytics
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: fmt(totalBudget), icon: TrendingUp, color: "#004A98" },
          { label: "Total Projects", value: totalProjects, icon: Building2, color: "#10b981" },
          { label: "Municipalities/Cities", value: totalMunicipalities, icon: Building2, color: "#f59e0b" },
          { label: "Barangays", value: totalBarangays, icon: MapPin, color: "#8b5cf6" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl p-5" style={cardStyle}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ background: `${stat.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                {stat.label}
              </p>
              <p className="text-2xl font-semibold" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="rounded-xl p-5" style={cardStyle}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search provinces..."
          className="w-full px-4 py-2.5 rounded-lg text-sm font-medium outline-none transition-all duration-200"
          style={{
            background: darkMode ? "#1e293b" : "#f8fafc",
            color: darkMode ? "#f8fafc" : "#0f172a",
            border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
          }}
          onFocus={(e) => (e.target.style.borderColor = "#004A98")}
          onBlur={(e) => (e.target.style.borderColor = darkMode ? "#334155" : "#e2e8f0")}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        {chartData.length > 0 && (
          <div className="rounded-xl p-6" style={cardStyle}>
            <h3 className="text-lg font-semibold mb-1" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
              Budget Distribution
            </h3>
            <p className="text-sm mb-6" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
              Total budget by province
            </p>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: darkMode ? "#334155" : "#e5e7eb", strokeWidth: 1 }}
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
                            background: darkMode ? "#0f172a" : "#ffffff",
                            border: `1px solid ${darkMode ? "#1e293b" : "#e5e7eb"}`,
                            boxShadow: darkMode
                              ? "0 4px 12px rgba(0,0,0,0.5)"
                              : "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        >
                          <p
                            className="font-semibold text-xs mb-1"
                            style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}
                          >
                            {payload[0].payload.fullName}
                          </p>
                          <p className="font-bold text-lg" style={{ color: "#004A98" }}>
                            {fmtChart(payload[0].value)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ fill: darkMode ? "rgba(148, 163, 184, 0.05)" : "rgba(226, 232, 240, 0.5)" }}
                />
                <Bar dataKey="budget" radius={[6, 6, 0, 0]} fill="#004A98" maxBarSize={80} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <div className="rounded-xl p-6" style={cardStyle}>
            <h3 className="text-lg font-semibold mb-1" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
              Budget Share
            </h3>
            <p className="text-sm mb-6" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
              Percentage distribution across provinces
            </p>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  dataKey="value"
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                      stroke={darkMode ? "#0f172a" : "#ffffff"}
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
                            background: darkMode ? "#0f172a" : "#ffffff",
                            border: `1px solid ${darkMode ? "#1e293b" : "#e5e7eb"}`,
                            boxShadow: darkMode
                              ? "0 4px 12px rgba(0,0,0,0.5)"
                              : "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                        >
                          <p
                            className="font-semibold text-xs mb-1"
                            style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}
                          >
                            {payload[0].name}
                          </p>
                          <p className="font-bold text-lg" style={{ color: payload[0].payload.color }}>
                            {fmtChart(payload[0].value)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Province Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {provinceData.map((province) => (
          <button
            key={province.id}
            onClick={() => navigate(`/analytics/provinces/${province.id}`)}
            className="text-left rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] group"
            style={cardStyle}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ background: "rgba(0, 74, 152, 0.1)" }}
              >
                <Building2 className="w-6 h-6" style={{ color: "#004A98" }} />
              </div>
              <ArrowRight
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                style={{ color: darkMode ? "#64748b" : "#94a3b8" }}
              />
            </div>

            <h3 className="text-xl font-semibold mb-2" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
              {province.name}
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                  Projects
                </span>
                <span className="text-sm font-semibold" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  {province.projectCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                  Municipalities/Cities
                </span>
                <span className="text-sm font-semibold" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  {province.municipalities}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                  Barangays
                </span>
                <span className="text-sm font-semibold" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
                  {province.barangays}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: darkMode ? "#1e293b" : "#e5e7eb" }}>
                <span className="text-sm font-medium" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                  Total Budget
                </span>
                <span className="text-lg font-bold" style={{ color: "#10b981" }}>
                  {fmt(province.totalBudget)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

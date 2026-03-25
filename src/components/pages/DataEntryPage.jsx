import { useState } from "react";
import { Plus, FileText, Package, TrendingUp, MapPin, Building2, Users } from "lucide-react";
import { COMP_COLORS } from "../../constants";
import { AddProjectModal } from "../modals/AddProjectModal";
import { AddEquipmentModal } from "../modals/AddEquipmentModal";

export const DataEntryPage = ({ projects, equipment, onAddProject, onAddEquipment, darkMode }) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);

  // Calculate statistics
  const totalProjects = projects.length;
  const totalEquipment = equipment.length;
  const uniqueCommunities = new Set(projects.map(p => p.community)).size;
  const uniqueMunicipalities = new Set([...projects.map(p => p.municipality), ...equipment.map(e => e.municipality)]).size;
  const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.amountFunded) || 0), 0);

  // Get municipality breakdown
  const municipalityStats = {};
  [...projects, ...equipment].forEach(item => {
    const muni = item.municipality;
    if (!municipalityStats[muni]) {
      municipalityStats[muni] = { projects: 0, equipment: 0, budget: 0 };
    }
    if (item.project) {
      municipalityStats[muni].projects++;
      municipalityStats[muni].budget += parseFloat(item.amountFunded) || 0;
    } else {
      municipalityStats[muni].equipment++;
    }
  });

  const topMunicipalities = Object.entries(municipalityStats)
    .sort((a, b) => (b[1].projects + b[1].equipment) - (a[1].projects + a[1].equipment))
    .slice(0, 5);

  return (
    <div className="max-w-[1800px] mx-auto space-y-6">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl p-8" style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #004A98 0%, #0066CC 50%, #10b981 100%)'
          : 'linear-gradient(135deg, #004A98 0%, #0066CC 50%, #10b981 100%)',
        boxShadow: '0 10px 40px rgba(0, 74, 152, 0.3)'
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">
                Data Entry Portal
              </h1>
              <p className="text-white/90 text-sm">
                Manage CEST 2.0 projects and equipment records across Region II
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#004A98'
                }}
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
              <button
                onClick={() => setShowEquipmentModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#10b981'
                }}
              >
                <Plus className="w-5 h-5" />
                Add Equipment
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-5 gap-4">
            <StatCard
              icon={FileText}
              label="Total Projects"
              value={totalProjects}
              color="rgba(255, 255, 255, 0.95)"
              textColor="#004A98"
            />
            <StatCard
              icon={Package}
              label="Total Equipment"
              value={totalEquipment}
              color="rgba(255, 255, 255, 0.95)"
              textColor="#10b981"
            />
            <StatCard
              icon={Building2}
              label="Municipalities"
              value={uniqueMunicipalities}
              color="rgba(255, 255, 255, 0.95)"
              textColor="#8b5cf6"
            />
            <StatCard
              icon={Users}
              label="Communities"
              value={uniqueCommunities}
              color="rgba(255, 255, 255, 0.95)"
              textColor="#f59e0b"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Budget"
              value={`₱${(totalBudget / 1000000).toFixed(2)}M`}
              color="rgba(255, 255, 255, 0.95)"
              textColor="#ef4444"
            />
          </div>
        </div>
      </div>

      {/* Municipality Details Section */}
      <div className="rounded-xl overflow-hidden" style={{
        background: darkMode ? '#0f172a' : '#ffffff',
        border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="p-6 border-b" style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <MapPin className="w-5 h-5" style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Top Municipalities
              </h2>
              <p className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Most active municipalities by project and equipment count
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {topMunicipalities.length > 0 ? (
              topMunicipalities.map(([muni, stats], index) => (
                <MunicipalityCard
                  key={muni}
                  rank={index + 1}
                  municipality={muni}
                  projects={stats.projects}
                  equipment={stats.equipment}
                  budget={stats.budget}
                  darkMode={darkMode}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: darkMode ? '#475569' : '#cbd5e1' }} />
                <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  No municipality data available yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout - Projects & Equipment */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Projects Section */}
        <ProjectsSection 
          projects={projects}
          onAdd={() => setShowProjectModal(true)}
          darkMode={darkMode}
        />

        {/* Equipment Section */}
        <EquipmentSection 
          equipment={equipment}
          onAdd={() => setShowEquipmentModal(true)}
          darkMode={darkMode}
        />
      </div>

      {/* Add Project Modal */}
      {showProjectModal && (
        <AddProjectModal
          onClose={() => setShowProjectModal(false)}
          onSave={onAddProject}
          darkMode={darkMode}
        />
      )}

      {/* Add Equipment Modal */}
      {showEquipmentModal && (
        <AddEquipmentModal
          onClose={() => setShowEquipmentModal(false)}
          onSave={onAddEquipment}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};


// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, textColor }) => (
  <div className="p-4 rounded-xl transition-all duration-200 hover:scale-105" style={{ background: color }}>
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg" style={{ background: `${textColor}20` }}>
        <Icon className="w-5 h-5" style={{ color: textColor }} />
      </div>
    </div>
    <div className="text-2xl font-bold mb-1" style={{ color: textColor }}>
      {value}
    </div>
    <div className="text-xs font-medium" style={{ color: textColor, opacity: 0.8 }}>
      {label}
    </div>
  </div>
);


// Municipality Card Component
const MunicipalityCard = ({ rank, municipality, projects, equipment, budget, darkMode }) => {
  const total = projects + equipment;
  const maxTotal = 20; // For progress bar calculation
  const percentage = Math.min((total / maxTotal) * 100, 100);

  return (
    <div 
      className="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg"
      style={{
        background: darkMode ? '#1e293b' : '#f8fafc',
        borderColor: darkMode ? '#334155' : '#e2e8f0'
      }}
    >
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
          style={{
            background: rank === 1 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' :
                       rank === 2 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                       rank === 3 ? 'linear-gradient(135deg, #fb923c, #ea580c)' :
                       darkMode ? '#334155' : '#e2e8f0',
            color: rank <= 3 ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b')
          }}
        >
          {rank}
        </div>

        {/* Municipality Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
            {municipality}
          </h3>
          <div className="flex items-center gap-4 text-xs mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" style={{ color: '#004A98' }} />
              <span className="font-semibold">{projects}</span> projects
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" style={{ color: '#10b981' }} />
              <span className="font-semibold">{equipment}</span> equipment
            </div>
            {budget > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" style={{ color: '#f59e0b' }} />
                <span className="font-semibold">₱{(budget / 1000000).toFixed(2)}M</span>
              </div>
            )}
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: darkMode ? '#0f172a' : '#e2e8f0' }}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, #004A98, #10b981)'
              }}
            ></div>
          </div>
        </div>

        {/* Total Badge */}
        <div 
          className="px-4 py-2 rounded-lg text-center flex-shrink-0"
          style={{
            background: darkMode ? '#334155' : '#f1f5f9'
          }}
        >
          <div className="text-xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
            {total}
          </div>
          <div className="text-[10px] font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            TOTAL
          </div>
        </div>
      </div>
    </div>
  );
};


// Projects Section Component
const ProjectsSection = ({ projects, onAdd, darkMode }) => {
  const cardStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="rounded-xl overflow-hidden" style={cardStyle}>
      {/* Header */}
      <div className="p-6 border-b" style={{ 
        borderColor: darkMode ? '#1e293b' : '#e5e7eb',
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(0, 74, 152, 0.1), rgba(0, 102, 204, 0.05))'
          : 'linear-gradient(135deg, rgba(0, 74, 152, 0.05), rgba(0, 102, 204, 0.02))'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ 
              background: 'linear-gradient(135deg, #004A98, #0066CC)',
              boxShadow: '0 4px 12px rgba(0, 74, 152, 0.3)'
            }}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Projects
              </h2>
              <p className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                {projects.length} CEST 2.0 project records
              </p>
            </div>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 74, 152, 0.3)'
            }}
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Project List */}
      <div className="p-4 max-h-[600px] overflow-y-auto scrollbar-card">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
              background: darkMode ? 'rgba(0, 74, 152, 0.1)' : 'rgba(0, 74, 152, 0.05)'
            }}>
              <FileText className="w-10 h-10" style={{ color: darkMode ? '#475569' : '#cbd5e1' }} />
            </div>
            <p className="text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              No projects yet
            </p>
            <p className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
              Click "Add New" to create your first project record
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 50).map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                style={{
                  background: darkMode ? '#1e293b' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#e2e8f0'
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 line-clamp-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {project.project}
                    </h3>
                    <div className="flex items-center gap-3 text-xs mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="font-semibold">{project.municipality}</span>
                      </div>
                      <span>•</span>
                      <span className="font-semibold">{project.year}</span>
                      {project.amountFunded && (
                        <>
                          <span>•</span>
                          <span className="font-semibold">₱{parseFloat(project.amountFunded).toLocaleString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span 
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{
                      background: project.status === 'Ongoing' ? 'rgba(16, 185, 129, 0.15)' : 
                                 project.status === 'Finished' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: project.status === 'Ongoing' ? '#10b981' : 
                             project.status === 'Finished' ? '#3b82f6' : '#f59e0b'
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {project.components?.slice(0, 4).map((c) => (
                    <span 
                      key={c}
                      className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{
                        backgroundColor: `${COMP_COLORS[c]}25`,
                        color: COMP_COLORS[c],
                        border: `1px solid ${COMP_COLORS[c]}40`
                      }}
                    >
                      {c.toUpperCase()}
                    </span>
                  ))}
                  {project.components?.length > 4 && (
                    <span 
                      className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{
                        backgroundColor: darkMode ? '#334155' : '#f1f5f9',
                        color: darkMode ? '#94a3b8' : '#64748b'
                      }}
                    >
                      +{project.components.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// Equipment Section Component
const EquipmentSection = ({ equipment, onAdd, darkMode }) => {
  const cardStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div className="rounded-xl overflow-hidden" style={cardStyle}>
      {/* Header */}
      <div className="p-6 border-b" style={{ 
        borderColor: darkMode ? '#1e293b' : '#e5e7eb',
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.02))'
      }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Equipment
              </h2>
              <p className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                {equipment.length} technology and equipment records
              </p>
            </div>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Equipment List */}
      <div className="p-4 max-h-[600px] overflow-y-auto scrollbar-card">
        {equipment.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
              background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
            }}>
              <Package className="w-10 h-10" style={{ color: darkMode ? '#475569' : '#cbd5e1' }} />
            </div>
            <p className="text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              No equipment yet
            </p>
            <p className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
              Click "Add New" to create your first equipment record
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {equipment.slice(0, 50).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                style={{
                  background: darkMode ? '#1e293b' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#e2e8f0'
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {item.equipment}
                    </h3>
                    <div className="flex items-center gap-3 text-xs" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="font-semibold">{item.municipality}</span>
                      </div>
                      <span>•</span>
                      <span className="font-semibold">{item.year}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span className="font-semibold">{item.units} units</span>
                      </div>
                    </div>
                  </div>
                  <span 
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: `${COMP_COLORS[item.component]}25`,
                      color: COMP_COLORS[item.component],
                      border: `1px solid ${COMP_COLORS[item.component]}40`
                    }}
                  >
                    {item.component?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from "react";
import { Plus, FileText, Package, TrendingUp, MapPin, Building2, Users, Calendar, X } from "lucide-react";
import { COMP_COLORS } from "../../shared/constants";
import { AddProjectEquipmentModal } from "../../components/forms/AddProjectEquipmentModal";

export const DataEntryPage = ({ projects, equipment, onAddProject, onAddEquipment, darkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // Calculate statistics
  const totalProjects = projects.length;
  const totalEquipment = equipment.length;
  const uniqueCommunities = new Set(projects.map(p => p.community)).size;
  const uniqueMunicipalities = new Set([...projects.map(p => p.municipality), ...equipment.map(e => e.municipality)]).size;
  const totalBudget = projects.reduce((sum, p) => sum + (parseFloat(p.amountFunded) || 0), 0);

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
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#004A98'
                }}
              >
                <Plus className="w-5 h-5" />
                Add Project & Equipment
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

      {/* Unified Projects & Equipment Section */}
      <div className="rounded-xl overflow-hidden" style={{
        background: darkMode ? '#0f172a' : '#ffffff',
        border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ 
          borderColor: darkMode ? '#1e293b' : '#e5e7eb',
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(0, 74, 152, 0.1), rgba(16, 185, 129, 0.1))'
            : 'linear-gradient(135deg, rgba(0, 74, 152, 0.05), rgba(16, 185, 129, 0.05))'
        }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl" style={{ 
                background: 'linear-gradient(135deg, #004A98, #10b981)',
                boxShadow: '0 4px 12px rgba(0, 74, 152, 0.3)'
              }}>
                <div className="flex items-center gap-1">
                  <FileText className="w-5 h-5 text-white" />
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Projects & Equipment
                </h2>
                <p className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  {projects.length} projects • {equipment.length} equipment records
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #004A98 0%, #10b981 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(0, 74, 152, 0.3)'
              }}
            >
              <Plus className="w-4 h-4" />
              Add Project & Equipment
            </button>
          </div>
        </div>

        {/* Combined List */}
        <div className="p-4 max-h-[600px] overflow-y-auto scrollbar-card">
          {projects.length === 0 && equipment.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{
                background: darkMode ? 'rgba(0, 74, 152, 0.1)' : 'rgba(0, 74, 152, 0.05)'
              }}>
                <div className="flex items-center gap-1">
                  <FileText className="w-8 h-8" style={{ color: darkMode ? '#475569' : '#cbd5e1' }} />
                  <Package className="w-8 h-8" style={{ color: darkMode ? '#475569' : '#cbd5e1' }} />
                </div>
              </div>
              <p className="text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                No records yet
              </p>
              <p className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                Click "Add Project & Equipment" to create your first records
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Projects */}
              {projects.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                    <FileText className="w-4 h-4" style={{ color: '#004A98' }} />
                    <h3 className="text-sm font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      Projects ({projects.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {projects.slice(0, 25).map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleViewDetails(project)}
                        className="p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        style={{
                          background: darkMode ? '#1e293b' : '#ffffff',
                          borderColor: darkMode ? '#334155' : '#e2e8f0'
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-bold mb-2 line-clamp-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                              {project.project}
                            </h4>
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
                </div>
              )}

              {/* Equipment */}
              {equipment.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                    <Package className="w-4 h-4" style={{ color: '#10b981' }} />
                    <h3 className="text-sm font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      Equipment ({equipment.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {equipment.slice(0, 25).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleViewDetails(item)}
                        className="p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                        style={{
                          background: darkMode ? '#1e293b' : '#ffffff',
                          borderColor: darkMode ? '#334155' : '#e2e8f0'
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                              {item.equipment}
                            </h4>
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Unified Modal */}
      {showModal && (
        <AddProjectEquipmentModal
          onClose={() => setShowModal(false)}
          onSaveProject={onAddProject}
          onSaveEquipment={onAddEquipment}
          darkMode={darkMode}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-[9999]"
            style={{
              animation: 'backdropFadeIn 0.2s ease-out forwards'
            }}
            onClick={() => setShowDetailModal(false)}
          />
          <div 
            className="fixed w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl"
            style={{
              background: darkMode ? '#1e293b' : '#ffffff',
              border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10000,
              animation: 'modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              className="sticky top-0 p-6 border-b flex-shrink-0" 
              style={{ 
                background: darkMode ? '#1e293b' : '#ffffff',
                borderColor: darkMode ? '#334155' : '#e2e8f0'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl" 
                    style={{ 
                      background: 'rgba(0, 74, 152, 0.1)'
                    }}
                  >
                    {selectedItem.project ? (
                      <FileText className="w-6 h-6" style={{ color: '#004A98' }} />
                    ) : (
                      <Package className="w-6 h-6" style={{ color: '#004A98' }} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {selectedItem.project ? 'Project Details' : 'Equipment Details'}
                      </h2>
                      <span 
                        className="text-xs font-bold px-3 py-1.5 rounded-lg"
                        style={{
                          background: 'rgba(0, 74, 152, 0.15)',
                          color: '#004A98',
                          border: '1px solid rgba(0, 74, 152, 0.3)'
                        }}
                      >
                        {selectedItem.project ? selectedItem.status : selectedItem.component?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm flex items-center gap-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      <MapPin className="w-4 h-4" />
                      {selectedItem.municipality}, {selectedItem.province || 'Cagayan'} • {selectedItem.year}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-xl hover:bg-red-500/10 transition-all duration-200"
                >
                  <X className="w-6 h-6" style={{ color: '#ef4444' }} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar-card">
              <div className="space-y-6">
                {/* Main Information */}
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 74, 152, 0.1)' }}>
                      <Building2 className="w-5 h-5" style={{ color: '#004A98' }} />
                    </div>
                    {selectedItem.project ? 'Project Information' : 'Equipment Information'}
                  </h3>
                  
                  <div 
                    className="p-4 rounded-xl" 
                    style={{ 
                      background: darkMode ? '#334155' : '#f8fafc',
                      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`
                    }}
                  >
                    <h4 className="text-base font-bold mb-4" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {selectedItem.project || selectedItem.equipment}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-bold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            Location
                          </label>
                          <div className="flex items-center gap-2 mt-1 p-3 rounded-lg" style={{ 
                            background: darkMode ? '#1e293b' : '#ffffff',
                            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                          }}>
                            <MapPin className="w-4 h-4" style={{ color: '#004A98' }} />
                            <span className="font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                              {selectedItem.municipality}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-bold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            Year
                          </label>
                          <div className="flex items-center gap-2 mt-1 p-3 rounded-lg" style={{ 
                            background: darkMode ? '#1e293b' : '#ffffff',
                            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                          }}>
                            <Calendar className="w-4 h-4" style={{ color: '#004A98' }} />
                            <span className="font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                              {selectedItem.year}
                            </span>
                          </div>
                        </div>

                        {selectedItem.community && (
                          <div>
                            <label className="text-sm font-bold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                              Community
                            </label>
                            <div className="flex items-center gap-2 mt-1 p-3 rounded-lg" style={{ 
                              background: darkMode ? '#1e293b' : '#ffffff',
                              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                            }}>
                              <Users className="w-4 h-4" style={{ color: '#004A98' }} />
                              <span className="font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                                {selectedItem.community}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {selectedItem.project && selectedItem.amountFunded && (
                          <div>
                            <label className="text-sm font-bold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                              Amount Funded
                            </label>
                            <div className="flex items-center gap-2 mt-1 p-3 rounded-lg" style={{ 
                              background: darkMode ? '#1e293b' : '#ffffff',
                              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                            }}>
                              <TrendingUp className="w-4 h-4" style={{ color: '#004A98' }} />
                              <span className="font-semibold text-lg" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                                ₱{parseFloat(selectedItem.amountFunded).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {selectedItem.equipment && selectedItem.units && (
                          <div>
                            <label className="text-sm font-bold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                              Units
                            </label>
                            <div className="flex items-center gap-2 mt-1 p-3 rounded-lg" style={{ 
                              background: darkMode ? '#1e293b' : '#ffffff',
                              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                            }}>
                              <Package className="w-4 h-4" style={{ color: '#004A98' }} />
                              <span className="font-semibold text-lg" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                                {selectedItem.units} units
                              </span>
                            </div>
                          </div>
                        )}

                        {selectedItem.beneficiaries && (
                          <div>
                            <label className="text-sm font-bold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                              Beneficiaries
                            </label>
                            <div className="flex items-center gap-2 mt-1 p-3 rounded-lg" style={{ 
                              background: darkMode ? '#1e293b' : '#ffffff',
                              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                            }}>
                              <Users className="w-4 h-4" style={{ color: '#004A98' }} />
                              <span className="font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                                {typeof selectedItem.beneficiaries === 'object' 
                                  ? selectedItem.beneficiaries.total || 'N/A'
                                  : selectedItem.beneficiaries}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Beneficiaries Breakdown */}
                {selectedItem.beneficiaries && typeof selectedItem.beneficiaries === 'object' && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 74, 152, 0.1)' }}>
                        <Users className="w-5 h-5" style={{ color: '#004A98' }} />
                      </div>
                      Beneficiaries Breakdown
                    </h3>
                    
                    <div 
                      className="p-4 rounded-xl" 
                      style={{ 
                        background: darkMode ? '#334155' : '#f8fafc',
                        border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`
                      }}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(selectedItem.beneficiaries).map(([key, value]) => (
                          <div 
                            key={key} 
                            className="text-center p-3 rounded-lg" 
                            style={{ 
                              background: darkMode ? '#1e293b' : '#ffffff',
                              border: `1px solid rgba(0, 74, 152, 0.2)`
                            }}
                          >
                            <div 
                              className="text-2xl font-bold mb-1" 
                              style={{ color: '#004A98' }}
                            >
                              {value || 0}
                            </div>
                            <div className="text-xs font-bold uppercase" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                              {key === 'ips' ? 'Indigenous' : 
                               key === 'fourps' ? '4Ps' : 
                               key === 'pwd' ? 'PWD' : 
                               key.charAt(0).toUpperCase() + key.slice(1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Components/Categories */}
                {selectedItem.components && selectedItem.components.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 74, 152, 0.1)' }}>
                        <Package className="w-5 h-5" style={{ color: '#004A98' }} />
                      </div>
                      Project Components
                    </h3>
                    
                    <div 
                      className="p-4 rounded-xl" 
                      style={{ 
                        background: darkMode ? '#334155' : '#f8fafc',
                        border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`
                      }}
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.components.map((component) => (
                          <div
                            key={component}
                            className="px-3 py-2 rounded-lg font-bold text-sm"
                            style={{
                              background: 'rgba(0, 74, 152, 0.15)',
                              color: '#004A98',
                              border: '1px solid rgba(0, 74, 152, 0.3)'
                            }}
                          >
                            {component.toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Equipment - Only show for projects */}
                {selectedItem.project && (() => {
                  const relatedEquipment = equipment.filter(eq => 
                    eq.municipality === selectedItem.municipality && 
                    eq.year === selectedItem.year
                  );
                  
                  if (relatedEquipment.length > 0) {
                    return (
                      <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                          <div className="p-2 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <Package className="w-5 h-5" style={{ color: '#10b981' }} />
                          </div>
                          Related Equipment ({relatedEquipment.length})
                        </h3>
                        
                        <div 
                          className="p-4 rounded-xl" 
                          style={{ 
                            background: darkMode ? '#334155' : '#f8fafc',
                            border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`
                          }}
                        >
                          <div className="space-y-3">
                            {relatedEquipment.map((eq) => (
                              <div
                                key={eq.id}
                                className="p-3 rounded-lg border"
                                style={{
                                  background: darkMode ? '#1e293b' : '#ffffff',
                                  borderColor: darkMode ? '#334155' : '#e2e8f0'
                                }}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                                      {eq.equipment}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                                      <div className="flex items-center gap-1">
                                        <Package className="w-3 h-3" />
                                        <span className="font-semibold">{eq.units} units</span>
                                      </div>
                                      <span>•</span>
                                      <span className="font-semibold">{eq.year}</span>
                                    </div>
                                  </div>
                                  <span 
                                    className="text-xs font-bold px-2 py-1 rounded-lg"
                                    style={{
                                      backgroundColor: `${COMP_COLORS[eq.component]}25`,
                                      color: COMP_COLORS[eq.component],
                                      border: `1px solid ${COMP_COLORS[eq.component]}40`
                                    }}
                                  >
                                    {eq.component?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Additional Details */}
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(0, 74, 152, 0.1)' }}>
                      <FileText className="w-5 h-5" style={{ color: '#004A98' }} />
                    </div>
                    Additional Information
                  </h3>
                  
                  <div 
                    className="p-4 rounded-xl" 
                    style={{ 
                      background: darkMode ? '#334155' : '#f8fafc',
                      border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold mb-2 block" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          Record ID
                        </label>
                        <span 
                          className="font-mono text-sm px-3 py-2 rounded-lg block" 
                          style={{ 
                            background: darkMode ? '#1e293b' : '#ffffff',
                            color: darkMode ? '#f8fafc' : '#0f172a',
                            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                          }}
                        >
                          {selectedItem.id}
                        </span>
                      </div>

                      <div>
                        <label className="text-sm font-bold mb-2 block" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          Type
                        </label>
                        <span 
                          className="font-semibold px-3 py-2 rounded-lg block" 
                          style={{ 
                            color: '#004A98',
                            background: 'rgba(0, 74, 152, 0.1)',
                            border: '1px solid rgba(0, 74, 152, 0.3)'
                          }}
                        >
                          {selectedItem.project ? 'CEST 2.0 Project' : 'Technology Equipment'}
                        </span>
                      </div>
                    </div>

                    {selectedItem.description && (
                      <div className="mt-4">
                        <label className="text-sm font-bold mb-2 block" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          Description
                        </label>
                        <p 
                          className="text-sm leading-relaxed p-3 rounded-lg" 
                          style={{ 
                            color: darkMode ? '#f8fafc' : '#0f172a',
                            background: darkMode ? '#1e293b' : '#ffffff',
                            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                          }}
                        >
                          {selectedItem.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="sticky bottom-0 p-4 border-t flex-shrink-0" 
              style={{ 
                background: darkMode ? '#1e293b' : '#ffffff',
                borderColor: darkMode ? '#334155' : '#e2e8f0'
              }}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 rounded-xl font-bold transition-all duration-200 hover:scale-105"
                  style={{
                    background: '#004A98',
                    color: '#ffffff'
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes backdropFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes modalAppear {
              0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
              }
              100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
              }
            }
          `}</style>
        </>
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

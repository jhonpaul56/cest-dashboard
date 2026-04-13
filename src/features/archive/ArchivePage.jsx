import { useState } from "react";
import { Archive, RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { fmt } from "../../shared/utils/helpers";
import { COMP_COLORS } from "../../shared/constants";

export const ArchivePage = ({ archivedProjects, onRestore, onPermanentDelete, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredArchived = archivedProjects.filter((p) =>
    !searchTerm ||
    p.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.municipality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.community?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.5)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
  };

  const handlePermanentDelete = (id) => {
    onPermanentDelete(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Archive className="w-8 h-8" style={{ color: '#004A98' }} />
          <h1 className="text-2xl font-semibold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
            Archive
          </h1>
        </div>
        <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          Deleted projects are stored here for 30 days before permanent removal
        </p>
      </div>

      {/* Info Banner */}
      <div 
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          background: darkMode ? 'rgba(245, 158, 11, 0.1)' : '#fef3c7',
          border: `1px solid ${darkMode ? 'rgba(245, 158, 11, 0.2)' : '#fcd34d'}`
        }}
      >
        <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#f59e0b' }} />
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#f59e0b' }}>
            Archive Notice
          </p>
          <p className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            Projects in the archive can be restored or permanently deleted. Permanent deletion cannot be undone.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl p-5" style={cardStyle}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search archived projects..."
          className="w-full px-4 py-2.5 rounded-lg text-sm font-medium outline-none transition-all duration-200"
          style={{
            background: darkMode ? '#1e293b' : '#f8fafc',
            color: darkMode ? '#f8fafc' : '#0f172a',
            border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          }}
          onFocus={(e) => (e.target.style.borderColor = '#004A98')}
          onBlur={(e) => (e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0')}
        />
        <p className="text-sm mt-3" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          {filteredArchived.length} archived project{filteredArchived.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Archived Projects */}
      {filteredArchived.length === 0 ? (
        <div className="rounded-xl p-10 text-center" style={cardStyle}>
          <Archive className="w-16 h-16 mx-auto mb-4" style={{ color: darkMode ? '#475569' : '#cbd5e1' }} />
          <p className="text-lg font-semibold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
            {searchTerm ? 'No archived projects found' : 'Archive is empty'}
          </p>
          <p className="text-sm" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
            {searchTerm ? 'Try a different search term' : 'Deleted projects will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArchived.map((project) => (
            <div key={project.id} className="rounded-xl p-6" style={cardStyle}>
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: '#6b7280', color: '#ffffff' }}>
                      {project.year}
                    </span>
                    <span className="text-sm font-medium" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                      {project.municipality}
                    </span>
                    <span style={{ color: darkMode ? '#475569' : '#cbd5e1' }}>•</span>
                    <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {project.community}
                    </span>
                    {project.archivedDate && (
                      <>
                        <span style={{ color: darkMode ? '#475569' : '#cbd5e1' }}>•</span>
                        <span className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                          Archived: {new Date(project.archivedDate).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Project Title */}
                  <h3 className="text-base font-semibold mb-3" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    {project.project}
                  </h3>

                  {/* Components */}
                  <div className="flex items-center gap-2 flex-wrap">
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

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onRestore(project.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: darkMode ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4',
                      color: '#10b981',
                      border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.2)' : '#86efac'}`
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(project.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: darkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                      color: '#ef4444',
                      border: `1px solid ${darkMode ? 'rgba(239, 68, 68, 0.2)' : '#fecaca'}`
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            style={{
              animation: 'backdropFadeIn 0.2s ease-out forwards'
            }}
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div 
            className="fixed w-full max-w-md rounded-2xl shadow-2xl z-[51]"
            style={{
              background: darkMode ? '#0f172a' : '#ffffff',
              border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    Permanent Delete
                  </h3>
                  <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-sm mb-6" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                Are you sure you want to permanently delete this project? This will remove all data and cannot be recovered.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: darkMode ? '#1e293b' : '#f1f5f9',
                    color: darkMode ? '#f8fafc' : '#0f172a'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePermanentDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: '#ef4444',
                    color: '#ffffff'
                  }}
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
    </div>
  );
};

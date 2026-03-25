import { AlertTriangle, X } from "lucide-react";

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
  darkMode 
}) => {
  if (!isOpen) return null;

  const typeColors = {
    danger: {
      bg: '#ef4444',
      bgLight: 'rgba(239, 68, 68, 0.1)',
      border: '#dc2626'
    },
    warning: {
      bg: '#f59e0b',
      bgLight: 'rgba(245, 158, 11, 0.1)',
      border: '#d97706'
    },
    info: {
      bg: '#3b82f6',
      bgLight: 'rgba(59, 130, 246, 0.1)',
      border: '#2563eb'
    }
  };

  const colors = typeColors[type];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] animate-fade-in"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-2xl z-[60] animate-scale-in"
        style={{
          background: darkMode ? '#1e293b' : '#ffffff',
          border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ 
          borderColor: darkMode ? '#334155' : '#e5e7eb'
        }}>
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-xl flex-shrink-0"
              style={{ 
                background: colors.bgLight,
                border: `2px solid ${colors.border}`
              }}
            >
              <AlertTriangle className="w-6 h-6" style={{ color: colors.bg }} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
              style={{
                background: darkMode ? '#334155' : '#f1f5f9',
                color: darkMode ? '#f8fafc' : '#0f172a'
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: darkMode ? '#334155' : '#e2e8f0',
              color: darkMode ? '#f8fafc' : '#0f172a'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: colors.bg,
              color: '#ffffff',
              boxShadow: `0 4px 12px ${colors.bg}40`
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};

export const Modal = ({ title, onClose, children, maxWidth = "max-w-2xl" }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fade-in">
      <div 
        className={`
          bg-white rounded-2xl w-full ${maxWidth} max-h-[92vh] 
          overflow-hidden shadow-2xl animate-scale-in
          border border-gray-100
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-50 to-blue-50 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-extrabold text-primary-800 flex items-center gap-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all duration-200 hover:rotate-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Body with custom scrollbar */}
        <div className="px-6 py-5 overflow-y-auto scrollbar-thin max-h-[calc(92vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

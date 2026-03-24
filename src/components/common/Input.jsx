export const Input = ({ label, error, icon, className = "", ...props }) => {
  return (
    <div className="mb-3.5">
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-white border-2 rounded-xl text-gray-900 px-4 py-2.5 text-sm
            outline-none transition-all duration-200
            ${icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            }
            hover:border-gray-300
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-red-500 text-xs">⚠️</span>
          <span className="text-red-500 text-xs font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export const Select = ({ label, error, icon, children, className = "", ...props }) => {
  return (
    <div className="mb-3.5">
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <select
          className={`
            w-full bg-white border-2 rounded-xl text-gray-900 px-4 py-2.5 text-sm
            outline-none transition-all duration-200 appearance-none
            ${icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            }
            hover:border-gray-300
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-red-500 text-xs">⚠️</span>
          <span className="text-red-500 text-xs font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export const Textarea = ({ label, error, className = "", ...props }) => {
  return (
    <div className="mb-3.5">
      {label && (
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full bg-white border-2 rounded-xl text-gray-900 px-4 py-2.5 text-sm
          outline-none transition-all duration-200 resize-vertical min-h-[100px]
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
          }
          hover:border-gray-300
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-red-500 text-xs">⚠️</span>
          <span className="text-red-500 text-xs font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

const variants = {
  primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 hover:-translate-y-0.5 active:translate-y-0",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-5 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-soft",
  danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:-translate-y-0.5 active:translate-y-0",
  dangerOutline: "bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-5 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-soft",
  blueOutline: "bg-blue-50 hover:bg-blue-100 text-primary-700 font-bold py-2 px-5 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-soft",
  success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-all duration-200",
  small: "py-1.5 px-3 text-xs rounded-lg font-semibold",
};

export const Button = ({ variant = "primary", children, className = "", disabled, ...props }) => {
  return (
    <button 
      className={`
        ${variants[variant]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
        inline-flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

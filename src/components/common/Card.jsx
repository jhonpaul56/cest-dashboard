export const Card = ({ children, className = "", hover = false }) => {
  return (
    <div className={`
      bg-white rounded-2xl shadow-soft border border-gray-100
      ${hover ? "hover-lift cursor-pointer" : ""}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`px-5 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = "" }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

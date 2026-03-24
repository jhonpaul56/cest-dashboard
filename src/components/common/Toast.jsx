export const Toast = ({ message, color }) => {
  if (!message) return null;

  const getIcon = () => {
    if (color === "#16a34a" || color.includes("green")) return "✅";
    if (color === "#ef4444" || color.includes("red")) return "❌";
    if (color === "#f59e0b" || color.includes("orange")) return "⚠️";
    return "ℹ️";
  };

  return (
    <div
      className="fixed top-6 right-6 z-[4000] rounded-2xl px-5 py-4 font-bold text-sm text-white shadow-2xl animate-slide-in-right max-w-md backdrop-blur-sm border-2 border-white/20"
      style={{ 
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl animate-bounce-subtle">{getIcon()}</span>
        <span className="flex-1">{message}</span>
      </div>
    </div>
  );
};

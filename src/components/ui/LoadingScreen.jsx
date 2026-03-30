import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete, darkMode }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    "Initializing System...",
    "Loading Resources...",
    "Connecting to Database...",
    "Preparing Dashboard...",
    "Almost Ready..."
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const stageInterval = setInterval(() => {
      setStage(prev => (prev + 1) % stages.length);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[100] overflow-hidden"
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #004A98 0%, #0066CC 50%, #004A98 100%)'
      }}
    >
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 text-center px-6">
        <div className="mb-8 relative">
          <div 
            className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
              boxShadow: '0 8px 32px rgba(0, 74, 152, 0.4)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <img 
              src="https://caraga.dost.gov.ph/wp-content/uploads/2020/10/dostlogo.png" 
              alt="DOST Logo" 
              className="w-16 h-16 object-contain relative z-10"
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))'
              }}
            />
          </div>
        </div>

        <h1 
          className="text-3xl font-bold mb-2"
          style={{ 
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          CEST 2.0
        </h1>
        
        <p 
          className="text-sm mb-8 opacity-90"
          style={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          Community Empowerment through Science & Technology
        </p>

        <div className="max-w-xs mx-auto mb-4">
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{
              background: darkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0066CC 0%, #10b981 100%)',
                boxShadow: '0 0 8px rgba(0, 102, 204, 0.4)'
              }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p 
              className="text-xs font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {stages[stage]}
            </p>
            <p 
              className="text-xs font-bold"
              style={{ color: '#10b981' }}
            >
              {progress}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#0066CC',
                animation: `bounce 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

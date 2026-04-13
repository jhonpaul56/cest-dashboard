import { useState } from "react";
import { PageSwitcher } from "./PageSwitcher";
import { CompactPageSwitcher } from "./CompactPageSwitcher";

export const PageSwitcherDemo = ({ darkMode }) => {
  const [activePage1, setActivePage1] = useState("cest");
  const [activePage2, setActivePage2] = useState("starbooks");

  const cardStyle = {
    background: darkMode 
      ? 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: darkMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
      : '0 8px 32px rgba(0, 0, 0, 0.08)',
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 p-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 
          className="text-4xl font-bold"
          style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
        >
          Page Switcher Components
        </h1>
        <p 
          className="text-lg"
          style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
        >
          Modern, responsive UI components for switching between STARBOOKS and CEST systems
        </p>
      </div>

      {/* Full Page Switcher */}
      <div className="space-y-6">
        <div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
          >
            Full Page Switcher
          </h2>
          <p 
            className="text-sm"
            style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
          >
            Best for main navigation or dedicated switching pages
          </p>
        </div>
        
        <PageSwitcher 
          activePage={activePage1}
          onPageChange={setActivePage1}
          darkMode={darkMode}
        />

        {/* Demo Content */}
        <div className="rounded-2xl p-8 text-center" style={cardStyle}>
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
          >
            Currently Viewing: {activePage1.toUpperCase()}
          </h3>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            {activePage1 === "cest" 
              ? "Community Empowerment through Science and Technology Dashboard"
              : "Science & Technology Academic Research-Based Openly Operated KioskS"
            }
          </p>
        </div>
      </div>

      {/* Compact Page Switcher */}
      <div className="space-y-6">
        <div>
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
          >
            Compact Page Switcher
          </h2>
          <p 
            className="text-sm"
            style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
          >
            Perfect for top bars, headers, or space-constrained areas
          </p>
        </div>
        
        <div className="flex justify-center">
          <CompactPageSwitcher 
            activePage={activePage2}
            onPageChange={setActivePage2}
            darkMode={darkMode}
          />
        </div>

        {/* Demo Content */}
        <div className="rounded-2xl p-8 text-center" style={cardStyle}>
          <h3 
            className="text-xl font-bold mb-2"
            style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
          >
            Currently Viewing: {activePage2.toUpperCase()}
          </h3>
          <p style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            {activePage2 === "cest" 
              ? "Community Empowerment through Science and Technology Dashboard"
              : "Science & Technology Academic Research-Based Openly Operated KioskS"
            }
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Responsive Design",
            description: "Adapts seamlessly to all screen sizes and devices"
          },
          {
            title: "Smooth Animations",
            description: "Delightful transitions and hover effects"
          },
          {
            title: "Accessible",
            description: "Keyboard navigation and screen reader friendly"
          }
        ].map((feature, index) => (
          <div 
            key={index}
            className="rounded-xl p-6 text-center transition-all duration-300 hover:scale-105"
            style={cardStyle}
          >
            <h4 
              className="text-lg font-bold mb-2"
              style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}
            >
              {feature.title}
            </h4>
            <p 
              className="text-sm"
              style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

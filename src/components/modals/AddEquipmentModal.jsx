import { useState } from "react";
import { X } from "lucide-react";
import { COMPONENTS } from "../../constants";
import { getAllProvinces, getMunicipalitiesByProvince } from "../../data/regionII";

export const AddEquipmentModal = ({ onClose, onSave, darkMode }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    province: "",
    municipality: "",
    community: "",
    equipment: "",
    units: "",
    unitsPerYear: "",
    component: ""
  });

  const [errors, setErrors] = useState({});
  const [municipalities, setMunicipalities] = useState([]);

  const provinces = getAllProvinces();

  const handleProvinceChange = (provinceId) => {
    setFormData({ ...formData, province: provinceId, municipality: "" });
    const munis = getMunicipalitiesByProvince(provinceId);
    setMunicipalities(munis);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.municipality) newErrors.municipality = "Municipality is required";
    if (!formData.community) newErrors.community = "Community is required";
    if (!formData.equipment) newErrors.equipment = "Equipment/Technology is required";
    if (!formData.units) newErrors.units = "Number of units is required";
    if (!formData.component) newErrors.component = "Component is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const finalData = {
        ...formData,
        id: Date.now()
      };
      onSave(finalData);
      onClose();
    }
  };

  const modalStyle = {
    background: darkMode ? '#1e293b' : '#ffffff',
    border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`
  };

  const inputStyle = {
    background: darkMode ? '#0f172a' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#0f172a',
    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
      />
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl z-50 animate-scale-in"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ 
          borderColor: darkMode ? '#334155' : '#e5e7eb',
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.05))'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl" style={{ 
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Add Equipment
                </h2>
                <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Fill in the equipment details below
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl transition-all duration-200 hover:scale-110"
              style={{
                background: darkMode ? '#334155' : '#f1f5f9',
                color: darkMode ? '#f8fafc' : '#0f172a'
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto scrollbar-card">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#10b981' }}>
              BASIC INFORMATION
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Year */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Year <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={inputStyle}
                />
                {errors.year && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.year}</p>}
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Province <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none cursor-pointer"
                    style={{
                      ...inputStyle,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${darkMode ? '%23f8fafc' : '%230f172a'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="" style={{ background: darkMode ? '#0f172a' : '#ffffff' }}>Select Province</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id} style={{ background: darkMode ? '#0f172a' : '#ffffff' }}>{p.name}</option>
                    ))}
                  </select>
                </div>
                {errors.province && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.province}</p>}
              </div>

              {/* Municipality */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Municipality <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      ...inputStyle,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${darkMode ? '%23f8fafc' : '%230f172a'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                    disabled={!formData.province}
                  >
                    <option value="" style={{ background: darkMode ? '#0f172a' : '#ffffff' }}>Select Municipality</option>
                    {municipalities.map((m) => (
                      <option key={m.name} value={m.name} style={{ background: darkMode ? '#0f172a' : '#ffffff' }}>{m.name}</option>
                    ))}
                  </select>
                </div>
                {errors.municipality && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.municipality}</p>}
              </div>

              {/* Community */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Community <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.community}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                  placeholder="Barangay name"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={inputStyle}
                />
                {errors.community && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.community}</p>}
              </div>
            </div>
          </div>

          {/* Equipment Details */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#10b981' }}>
              EQUIPMENT DETAILS
            </h3>
            
            {/* Equipment/Technology */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Equipment / Technology <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                placeholder="Enter equipment or technology name"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all"
                style={inputStyle}
              />
              {errors.equipment && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.equipment}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* No. of Units */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  No. of Units <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={inputStyle}
                />
                {errors.units && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.units}</p>}
              </div>

              {/* Units Per Year */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Units per Year
                </label>
                <input
                  type="number"
                  value={formData.unitsPerYear}
                  onChange={(e) => setFormData({ ...formData, unitsPerYear: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Component */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#10b981' }}>
              COMPONENT <span style={{ color: '#ef4444' }}>*</span>
            </h3>
            <div className="relative">
              <select
                value={formData.component}
                onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none cursor-pointer"
                style={{
                  ...inputStyle,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${darkMode ? '%23f8fafc' : '%230f172a'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" style={{ background: darkMode ? '#0f172a' : '#ffffff' }}>Select Component</option>
                {Object.entries(COMPONENTS).map(([key, fullName]) => (
                  <option key={key} value={key} style={{ background: darkMode ? '#0f172a' : '#ffffff' }}>
                    {key.toUpperCase()} — {fullName}
                  </option>
                ))}
              </select>
            </div>
            {errors.component && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.component}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3" style={{ 
          borderColor: darkMode ? '#334155' : '#e5e7eb',
          background: darkMode ? '#1e293b' : '#f8fafc'
        }}>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: darkMode ? '#334155' : '#e2e8f0',
              color: darkMode ? '#f8fafc' : '#0f172a'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            Save Equipment
          </button>
        </div>
      </div>
    </>
  );
};

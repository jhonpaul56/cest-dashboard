import { useState, useEffect } from "react";
import { X, Upload, Check } from "lucide-react";
import { COMPONENTS, COMP_COLORS, COMMUNITY_TYPES, COMMUNITY_COLORS, STATUS_OPTIONS } from "../../shared/constants";
import { getAllProvinces, getMunicipalitiesByProvince } from "../../shared/data/regionII";
import { LoadingButton } from "../ui/LoadingButton";
import { useKeyboardShortcuts } from "../../shared/hooks/useKeyboardShortcuts";

export const AddProjectEquipmentModal = ({ onClose, onSaveProject, onSaveEquipment, darkMode }) => {
  const [formData, setFormData] = useState({
    // Common fields
    year: new Date().getFullYear(),
    province: "",
    municipality: "",
    community: "",
    
    // Project specific fields
    project: "",
    amountFunded: "",
    amountPerYear: "",
    status: "Ongoing",
    components: [],
    communities: [],
    beneficiaries: { male: 0, female: 0, ips: 0, fourps: 0, pwd: 0, senior: 0, total: 0 },
    stakeholders: { lgu: 0, plgu: 0, blgu: 0, pnp: 0, suc: 0, others: 0, othersLabel: "" },
    fileData: null,
    fileName: "",
    fileType: "",
    
    // Equipment specific fields
    equipment: "",
    units: "",
    unitsPerYear: "",
    component: ""
  });

  const [errors, setErrors] = useState({});
  const [municipalities, setMunicipalities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const provinces = getAllProvinces();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'escape': onClose,
    'ctrl+s': (e) => {
      e.preventDefault();
      handleSubmit();
    }
  });

  const handleProvinceChange = (provinceId) => {
    setFormData({ ...formData, province: provinceId, municipality: "" });
    const munis = getMunicipalitiesByProvince(provinceId);
    setMunicipalities(munis);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          fileData: reader.result,
          fileName: file.name,
          fileType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleComponent = (comp) => {
    const newComponents = formData.components.includes(comp)
      ? formData.components.filter(c => c !== comp)
      : [...formData.components, comp];
    setFormData({ ...formData, components: newComponents });
  };

  const toggleCommunity = (comm) => {
    const newCommunities = formData.communities.includes(comm)
      ? formData.communities.filter(c => c !== comm)
      : [...formData.communities, comm];
    setFormData({ ...formData, communities: newCommunities });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common required fields
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.municipality) newErrors.municipality = "Municipality is required";
    if (!formData.community) newErrors.community = "Community is required";
    
    // Determine if this is a project or equipment entry based on filled fields
    const hasProjectFields = formData.project || formData.amountFunded || formData.components.length > 0;
    const hasEquipmentFields = formData.equipment || formData.units || formData.component;
    
    if (!hasProjectFields && !hasEquipmentFields) {
      newErrors.general = "Please fill either project details or equipment details";
    }
    
    // Validate project fields if any project data is entered
    if (hasProjectFields) {
      if (!formData.project) newErrors.project = "Project title is required";
      if (!formData.amountFunded) newErrors.amountFunded = "Amount funded is required";
      if (formData.components.length === 0) newErrors.components = "Select at least one component";
    }
    
    // Validate equipment fields if any equipment data is entered
    if (hasEquipmentFields) {
      if (!formData.equipment) newErrors.equipment = "Equipment/Technology is required";
      if (!formData.units) newErrors.units = "Number of units is required";
      if (!formData.component) newErrors.component = "Component is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Determine what type of data to save based on filled fields
      const hasProjectFields = formData.project || formData.amountFunded || formData.components.length > 0;
      const hasEquipmentFields = formData.equipment || formData.units || formData.component;
      
      if (hasProjectFields) {
        // Calculate total beneficiaries
        const total = parseInt(formData.beneficiaries.male || 0) + parseInt(formData.beneficiaries.female || 0);
        const projectData = {
          year: formData.year,
          province: formData.province,
          municipality: formData.municipality,
          community: formData.community,
          project: formData.project,
          amountFunded: formData.amountFunded,
          amountPerYear: formData.amountPerYear,
          status: formData.status,
          components: formData.components,
          communities: formData.communities,
          beneficiaries: { ...formData.beneficiaries, total },
          stakeholders: formData.stakeholders,
          fileData: formData.fileData,
          fileName: formData.fileName,
          fileType: formData.fileType,
          id: Date.now()
        };
        onSaveProject(projectData);
      }
      
      if (hasEquipmentFields) {
        const equipmentData = {
          year: formData.year,
          province: formData.province,
          municipality: formData.municipality,
          community: formData.community,
          equipment: formData.equipment,
          units: formData.units,
          unitsPerYear: formData.unitsPerYear,
          component: formData.component,
          id: Date.now() + 1 // Ensure unique ID if both are saved
        };
        onSaveEquipment(equipmentData);
      }
      
      setIsSubmitting(false);
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
        className="fixed inset-0 bg-black/60 z-[9999]"
        style={{
          animation: 'backdropFadeIn 0.2s ease-out forwards'
        }}
        onClick={onClose}
      />
      <div 
        className="fixed w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl z-[10000]"
        style={{
          ...modalStyle,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ 
          borderColor: darkMode ? '#334155' : '#e5e7eb',
          background: darkMode 
            ? 'rgba(0, 74, 152, 0.1)'
            : 'rgba(0, 74, 152, 0.05)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl" 
                style={{ 
                  background: '#004A98'
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Add Project & Equipment
                </h2>
                <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Fill in project and/or equipment details below
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
        <div className="p-6 space-y-6 max-h-[calc(90vh-240px)] overflow-y-auto scrollbar-card">
          {/* General Error Message */}
          {errors.general && (
            <div 
              className="p-4 rounded-xl border-2 bg-red-50" 
              style={{
                borderColor: '#fecaca',
                background: darkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2'
              }}
            >
              <p className="text-sm font-medium" style={{ color: '#ef4444' }}>{errors.general}</p>
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#004A98' }}>
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
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  style={inputStyle}
                />
                {errors.year && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.year}</p>}
              </div>

              {/* Province */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Province <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => {
                    setFormData({ ...formData, province: e.target.value, municipality: "" });
                    const munis = getMunicipalitiesByProvince(e.target.value);
                    setMunicipalities(munis);
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                  style={inputStyle}
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.province && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.province}</p>}
              </div>
              {/* Municipality */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Municipality <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50"
                  style={inputStyle}
                  disabled={!formData.province}
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((m) => (
                    <option key={m.name} value={m.name}>{m.name}</option>
                  ))}
                </select>
                {errors.municipality && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.municipality}</p>}
              </div>

              {/* Community */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Community / Beneficiaries <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.community}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                  placeholder="Barangay name"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={inputStyle}
                />
                {errors.community && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.community}</p>}
              </div>
            </div>
          </div>
          {/* Project Details Section */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#004A98' }}>
              PROJECT DETAILS
            </h3>
            <p className="text-xs mb-4" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Fill this section if you're adding a project
            </p>
            
            {/* Project Title */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Project Title
              </label>
              <textarea
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                placeholder="Enter project title..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={inputStyle}
              />
              {errors.project && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.project}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Amount Funded */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Amount Funded (₱)
                </label>
                <input
                  type="number"
                  value={formData.amountFunded}
                  onChange={(e) => setFormData({ ...formData, amountFunded: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={inputStyle}
                />
                {errors.amountFunded && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.amountFunded}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* CEST 2.0 Components */}
            <div>
              <h4 className="text-sm font-bold mb-2" style={{ color: '#004A98' }}>
                CEST 2.0 COMPONENTS
              </h4>
              <p className="text-xs mb-4" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Select all applicable components for the project
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(COMPONENTS).map(([key, fullName]) => (
                  <button
                    key={key}
                    onClick={() => toggleComponent(key)}
                    className="p-4 rounded-xl border-2 transition-all duration-200 text-left"
                    style={{
                      borderColor: formData.components.includes(key) ? '#004A98' : (darkMode ? '#334155' : '#e2e8f0'),
                      background: formData.components.includes(key) ? 'rgba(0, 74, 152, 0.1)' : (darkMode ? '#0f172a' : '#ffffff')
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: formData.components.includes(key) ? '#004A98' : (darkMode ? '#334155' : '#e2e8f0')
                        }}
                      >
                        {formData.components.includes(key) && (
                          <Check className="w-4 h-4" style={{ color: '#ffffff' }} />
                        )}
                      </div>
                      <span className="text-xs font-bold" style={{ color: '#004A98' }}>
                        {key.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-medium leading-tight" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                      {fullName}
                    </p>
                  </button>
                ))}
              </div>
              {errors.components && <p className="text-xs mt-2 font-medium" style={{ color: '#ef4444' }}>{errors.components}</p>}
            </div>
          </div>
          {/* Equipment Details Section */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#10b981' }}>
              EQUIPMENT DETAILS
            </h3>
            <p className="text-xs mb-4" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Fill this section if you're adding equipment/technology
            </p>
            
            {/* Equipment/Technology */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Equipment / Technology
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
                  No. of Units
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

              {/* Component */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Component
                </label>
                <select
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
                  style={inputStyle}
                >
                  <option value="">Select Component</option>
                  {Object.entries(COMPONENTS).map(([key, fullName]) => (
                    <option key={key} value={key}>
                      {key.toUpperCase()} — {fullName}
                    </option>
                  ))}
                </select>
                {errors.component && <p className="text-xs mt-1.5 font-medium" style={{ color: '#ef4444' }}>{errors.component}</p>}
              </div>
            </div>
          </div>
          {/* Beneficiaries Section (Optional) */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#6366f1' }}>
              BENEFICIARIES (Optional)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Male
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries.male}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    beneficiaries: { ...formData.beneficiaries, male: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Female
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries.female}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    beneficiaries: { ...formData.beneficiaries, female: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  IPS
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries.ips}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    beneficiaries: { ...formData.beneficiaries, ips: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  4Ps
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries.fourps}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    beneficiaries: { ...formData.beneficiaries, fourps: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  PWD
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries.pwd}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    beneficiaries: { ...formData.beneficiaries, pwd: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Senior Citizens
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries.senior}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    beneficiaries: { ...formData.beneficiaries, senior: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div 
          className="p-6 border-t flex items-center justify-between" 
          style={{ 
            borderColor: darkMode ? '#334155' : '#e5e7eb',
            background: darkMode ? '#1e293b' : '#f8fafc'
          }}
        >
          <div className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
            <kbd className="px-2 py-1 rounded" style={{ background: darkMode ? '#0f172a' : '#e2e8f0' }}>Esc</kbd> to cancel · 
            <kbd className="px-2 py-1 rounded ml-2" style={{ background: darkMode ? '#0f172a' : '#e2e8f0' }}>Ctrl+S</kbd> to save
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: darkMode ? '#334155' : '#e2e8f0',
                color: darkMode ? '#f8fafc' : '#0f172a'
              }}
            >
              Cancel
            </button>
            <LoadingButton
              onClick={handleSubmit}
              loading={isSubmitting}
              variant="primary"
              style={{
                background: '#004A98',
                color: '#ffffff'
              }}
            >
              Save Project & Equipment
            </LoadingButton>
          </div>
        </div>
      </div>

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
    </>
  );
};
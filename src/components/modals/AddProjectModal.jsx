import { useState, useEffect } from "react";
import { X, Upload, Check } from "lucide-react";
import { COMPONENTS, COMP_COLORS, COMMUNITY_TYPES, COMMUNITY_COLORS, STATUS_OPTIONS } from "../../constants";
import { getAllProvinces, getMunicipalitiesByProvince } from "../../data/regionII";
import { LoadingButton } from "../common/LoadingButton";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";

export const AddProjectModal = ({ onClose, onSave, darkMode }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    province: "",
    municipality: "",
    community: "",
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
    fileType: ""
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

  // Auto-save draft to localStorage
  useEffect(() => {
    const draftKey = 'project_draft';
    const saveDraft = setTimeout(() => {
      if (formData.project || formData.community) {
        localStorage.setItem(draftKey, JSON.stringify(formData));
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(saveDraft);
  }, [formData]);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.year) newErrors.year = "Year is required";
    if (!formData.province) newErrors.province = "Province is required";
    if (!formData.municipality) newErrors.municipality = "Municipality is required";
    if (!formData.community) newErrors.community = "Community is required";
    if (!formData.project) newErrors.project = "Project title is required";
    if (!formData.amountFunded) newErrors.amountFunded = "Amount funded is required";
    if (formData.components.length === 0) newErrors.components = "Select at least one component";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Calculate total beneficiaries
      const total = parseInt(formData.beneficiaries.male || 0) + parseInt(formData.beneficiaries.female || 0);
      const finalData = {
        ...formData,
        beneficiaries: { ...formData.beneficiaries, total },
        id: Date.now()
      };
      
      onSave(finalData);
      
      // Clear draft
      localStorage.removeItem('project_draft');
      
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
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-fade-in"
        onClick={onClose}
      />
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl z-50 animate-scale-in"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="p-6 border-b" style={{ 
          borderColor: darkMode ? '#334155' : '#e5e7eb',
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(0, 74, 152, 0.15), rgba(0, 102, 204, 0.1))'
            : 'linear-gradient(135deg, rgba(0, 74, 152, 0.08), rgba(0, 102, 204, 0.05))'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl" style={{ 
                background: 'linear-gradient(135deg, #004A98, #0066CC)',
                boxShadow: '0 4px 12px rgba(0, 74, 152, 0.3)'
              }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Add New Project
                </h2>
                <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Fill in the project details below
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
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
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
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Project Details */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#004A98' }}>
              PROJECT DETAILS
            </h3>
            
            {/* Project Title */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Project Title <span style={{ color: '#ef4444' }}>*</span>
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

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Attach Project File (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="project-file"
                />
                <label
                  htmlFor="project-file"
                  className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/50"
                  style={{
                    borderColor: formData.fileName ? '#10b981' : (darkMode ? '#334155' : '#cbd5e1'),
                    background: formData.fileName 
                      ? (darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)')
                      : (darkMode ? '#0f172a' : '#ffffff')
                  }}
                >
                  {formData.fileName ? (
                    <>
                      <Check className="w-5 h-5" style={{ color: '#10b981' }} />
                      <span className="text-sm font-bold" style={{ color: '#10b981' }}>
                        {formData.fileName}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" style={{ color: darkMode ? '#94a3b8' : '#64748b' }} />
                      <span className="text-sm font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Click to upload PDF, DOC, or Image
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Amount Funded */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Amount Funded (₱) <span style={{ color: '#ef4444' }}>*</span>
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

              {/* Amount Per Year */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Amount per Year (₱)
                </label>
                <input
                  type="number"
                  value={formData.amountPerYear}
                  onChange={(e) => setFormData({ ...formData, amountPerYear: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={inputStyle}
                />
              </div>

              {/* Status */}
              <div className="col-span-2">
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  Status <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    style={{
                      ...inputStyle,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${darkMode ? '%23f8fafc' : '%230f172a'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status} style={{ background: darkMode ? '#0f172a' : '#ffffff' }}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>


          {/* CEST 2.0 Components */}
          <div>
            <h3 className="text-sm font-bold mb-2" style={{ color: '#004A98' }}>
              CEST 2.0 COMPONENTS <span style={{ color: '#ef4444' }}>*</span>
            </h3>
            <p className="text-xs mb-4" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Select all applicable components
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(COMPONENTS).map(([key, fullName]) => (
                <button
                  key={key}
                  onClick={() => toggleComponent(key)}
                  className="p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105"
                  style={{
                    borderColor: formData.components.includes(key) ? COMP_COLORS[key] : (darkMode ? '#334155' : '#e2e8f0'),
                    background: formData.components.includes(key) ? `${COMP_COLORS[key]}20` : (darkMode ? '#0f172a' : '#ffffff'),
                    boxShadow: formData.components.includes(key) ? `0 4px 12px ${COMP_COLORS[key]}40` : 'none'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                      style={{
                        background: formData.components.includes(key) ? COMP_COLORS[key] : (darkMode ? '#334155' : '#e2e8f0')
                      }}
                    >
                      {formData.components.includes(key) && (
                        <Check className="w-4 h-4" style={{ color: '#ffffff' }} />
                      )}
                    </div>
                    <span className="text-xs font-bold" style={{ color: COMP_COLORS[key] }}>
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

          {/* Community Types */}
          <div>
            <h3 className="text-sm font-bold mb-2" style={{ color: '#004A98' }}>
              COMMUNITY TYPES
            </h3>
            <p className="text-xs mb-4" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Select all applicable community types
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COMMUNITY_TYPES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleCommunity(key)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105"
                  style={{
                    background: formData.communities.includes(key) ? COMMUNITY_COLORS[key] : (darkMode ? '#0f172a' : '#f1f5f9'),
                    color: formData.communities.includes(key) ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b'),
                    border: `2px solid ${formData.communities.includes(key) ? COMMUNITY_COLORS[key] : 'transparent'}`,
                    boxShadow: formData.communities.includes(key) ? `0 4px 12px ${COMMUNITY_COLORS[key]}40` : 'none'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Beneficiaries */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#004A98' }}>
              NO. OF BENEFICIARIES
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Male
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries.male}
                  onChange={(e) => setFormData({ ...formData, beneficiaries: { ...formData.beneficiaries, male: e.target.value }})}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Female
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries.female}
                  onChange={(e) => setFormData({ ...formData, beneficiaries: { ...formData.beneficiaries, female: e.target.value }})}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Total (Auto)
                </label>
                <input
                  type="number"
                  value={parseInt(formData.beneficiaries.male || 0) + parseInt(formData.beneficiaries.female || 0)}
                  disabled
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <h4 className="text-xs font-bold mt-5 mb-3" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
              Beneficiary Sectors
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {['ips', 'fourps', 'pwd', 'senior'].map((sector) => (
                <div key={sector}>
                  <label className="block text-xs font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                    {sector === 'ips' ? "IP's" : sector === 'fourps' ? "4P's" : sector === 'pwd' ? 'PWD' : 'Senior'}
                  </label>
                  <input
                    type="number"
                    value={formData.beneficiaries[sector]}
                    onChange={(e) => setFormData({ ...formData, beneficiaries: { ...formData.beneficiaries, [sector]: e.target.value }})}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          <div>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#004A98' }}>
              STAKEHOLDERS
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {['lgu', 'plgu', 'blgu', 'pnp', 'suc'].map((stakeholder) => (
                <div key={stakeholder}>
                  <label className="block text-xs font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                    {stakeholder.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    value={formData.stakeholders[stakeholder]}
                    onChange={(e) => setFormData({ ...formData, stakeholders: { ...formData.stakeholders, [stakeholder]: e.target.value }})}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Others
                </label>
                <input
                  type="number"
                  value={formData.stakeholders.others}
                  onChange={(e) => setFormData({ ...formData, stakeholders: { ...formData.stakeholders, others: e.target.value }})}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={inputStyle}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Others (Specify)
              </label>
              <input
                type="text"
                value={formData.stakeholders.othersLabel}
                onChange={(e) => setFormData({ ...formData, stakeholders: { ...formData.stakeholders, othersLabel: e.target.value }})}
                placeholder="Specify other stakeholders"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-between" style={{ 
          borderColor: darkMode ? '#334155' : '#e5e7eb',
          background: darkMode ? '#1e293b' : '#f8fafc'
        }}>
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
            >
              Save Project
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
};

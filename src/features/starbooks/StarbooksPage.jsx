import { useState } from "react";
import { BookOpen, MapPin, Users, Plus, Search, Filter, Edit, Trash2, Eye, Package, CheckCircle, Clock, Phone, X, Calendar, Monitor, Tablet, Activity, Download, RefreshCw, Star } from "lucide-react";
import { DocumentationPage } from "./DocumentationPage";

export const StarbooksPage = ({ darkMode, activePage = "starbooks" }) => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Map activePage to content sections
  const getPageTitle = () => {
    switch(activePage) {
      case "starbooks": return "Inventory Management";
      case "starbooks-locations": return "Locations";
      case "starbooks-users": return "Users Management";
      case "starbooks-reports": return "Reports & Analytics";
      case "starbooks-maintenance": return "Maintenance Center";
      case "starbooks-docs": return "Documentation";
      default: return "Inventory Management";
    }
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUnit, setNewUnit] = useState({
    location: "",
    municipality: "",
    province: "Cagayan",
    serialNumber: "",
    status: "Active",
    condition: "Excellent",
    components: [],
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    notes: ""
  });

  // Enhanced STARBOOKS inventory data with more visual appeal
  const [starbooksInventory, setStarbooksInventory] = useState([
    {
      id: "SB-001",
      serialNumber: "STARBOOKS-2024-001",
      location: "Tuguegarao City Hall",
      municipality: "Tuguegarao City",
      province: "Cagayan",
      status: "Active",
      dateDeployed: "2024-01-15",
      lastMaintenance: "2024-03-01",
      condition: "Excellent",
      beneficiaries: 450,
      monthlyUsage: 1250,
      components: ["Kiosk", "Laptop", "Tablets", "Solar Panel"],
      contact: "Mayor's Office",
      contactPerson: "Hon. Jefferson Soriano",
      contactPhone: "+63 78 844 1621",
      contactEmail: "mayor@tuguegarao.gov.ph",
      notes: "High usage, excellent condition",
      images: [
        "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop"
      ],
      specifications: {
        kioskModel: "STARBOOKS Pro 2024",
        laptopSpecs: "Intel i5, 8GB RAM, 256GB SSD",
        tabletCount: 4,
        solarCapacity: "500W Solar Panel System",
        internetConnection: "Fiber Optic 50Mbps",
        powerBackup: "UPS 2000VA"
      },
      usageStats: {
        dailyAverage: 42,
        peakHours: "2:00 PM - 5:00 PM",
        popularContent: ["Science Modules", "Math Resources", "Research Papers"],
        userDemographics: {
          students: 65,
          teachers: 20,
          researchers: 10,
          general: 5
        }
      },
      maintenanceHistory: [
        { date: "2024-03-01", type: "Regular Maintenance", technician: "John Doe", notes: "All systems operational" },
        { date: "2024-01-15", type: "Initial Setup", technician: "Jane Smith", notes: "Installation completed successfully" }
      ],
      rating: 4.8,
      uptime: 98.5
    },
    {
      id: "SB-002", 
      serialNumber: "STARBOOKS-2024-002",
      location: "Peñablanca Elementary School",
      municipality: "Peñablanca",
      province: "Cagayan",
      status: "Active",
      dateDeployed: "2024-02-10",
      lastMaintenance: "2024-03-15",
      condition: "Good",
      beneficiaries: 320,
      monthlyUsage: 890,
      components: ["Kiosk", "Laptop", "Tablets"],
      contact: "School Principal",
      contactPerson: "Dr. Maria Santos",
      contactPhone: "+63 78 844 2345",
      contactEmail: "principal@penablanca-elem.edu.ph",
      notes: "Regular maintenance scheduled",
      images: [
        "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
      ],
      specifications: {
        kioskModel: "STARBOOKS Standard 2024",
        laptopSpecs: "Intel i3, 4GB RAM, 128GB SSD",
        tabletCount: 3,
        solarCapacity: "300W Solar Panel System",
        internetConnection: "DSL 25Mbps",
        powerBackup: "UPS 1500VA"
      },
      usageStats: {
        dailyAverage: 28,
        peakHours: "10:00 AM - 12:00 PM",
        popularContent: ["Educational Games", "E-books", "Video Tutorials"],
        userDemographics: {
          students: 80,
          teachers: 15,
          researchers: 3,
          general: 2
        }
      },
      maintenanceHistory: [
        { date: "2024-03-15", type: "Regular Maintenance", technician: "Mike Johnson", notes: "Software updates completed" },
        { date: "2024-02-10", type: "Initial Setup", technician: "Sarah Lee", notes: "School deployment successful" }
      ],
      rating: 4.6,
      uptime: 95.2
    },
    {
      id: "SB-003",
      serialNumber: "STARBOOKS-2024-003", 
      location: "Gonzaga Public Library",
      municipality: "Gonzaga",
      province: "Cagayan",
      status: "Maintenance",
      dateDeployed: "2023-11-20",
      lastMaintenance: "2024-02-28",
      condition: "Fair",
      beneficiaries: 180,
      monthlyUsage: 420,
      components: ["Kiosk", "Laptop"],
      contact: "Librarian",
      contactPerson: "Ms. Elena Rodriguez",
      contactPhone: "+63 78 844 3456",
      contactEmail: "librarian@gonzaga-library.gov.ph",
      notes: "Tablet replacement needed",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop"
      ],
      specifications: {
        kioskModel: "STARBOOKS Lite 2023",
        laptopSpecs: "Intel i3, 4GB RAM, 128GB SSD",
        tabletCount: 0,
        solarCapacity: "200W Solar Panel System",
        internetConnection: "Wireless 15Mbps",
        powerBackup: "UPS 1000VA"
      },
      usageStats: {
        dailyAverage: 14,
        peakHours: "1:00 PM - 4:00 PM",
        popularContent: ["Research Database", "Digital Books", "Academic Papers"],
        userDemographics: {
          students: 45,
          teachers: 25,
          researchers: 25,
          general: 5
        }
      },
      maintenanceHistory: [
        { date: "2024-02-28", type: "Repair", technician: "Alex Chen", notes: "Tablet system needs replacement" },
        { date: "2023-11-20", type: "Initial Setup", technician: "David Kim", notes: "Library installation completed" }
      ],
      rating: 4.2,
      uptime: 87.3
    },
    {
      id: "SB-004",
      serialNumber: "STARBOOKS-2024-004",
      location: "Aparri Community Center", 
      municipality: "Aparri",
      province: "Cagayan",
      status: "Inactive",
      dateDeployed: "2023-08-05",
      lastMaintenance: "2024-01-10",
      condition: "Poor",
      beneficiaries: 95,
      monthlyUsage: 150,
      components: ["Kiosk"],
      contact: "Barangay Captain",
      contactPerson: "Brgy. Capt. Roberto Valdez",
      contactPhone: "+63 78 844 4567",
      contactEmail: "captain@aparri-barangay.gov.ph",
      notes: "Requires major repairs",
      images: [
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
      ],
      specifications: {
        kioskModel: "STARBOOKS Basic 2023",
        laptopSpecs: "Intel Celeron, 4GB RAM, 64GB SSD",
        tabletCount: 0,
        solarCapacity: "100W Solar Panel System",
        internetConnection: "Mobile Data 10Mbps",
        powerBackup: "UPS 500VA"
      },
      usageStats: {
        dailyAverage: 5,
        peakHours: "3:00 PM - 6:00 PM",
        popularContent: ["Basic Computer Skills", "Government Services Info"],
        userDemographics: {
          students: 30,
          teachers: 10,
          researchers: 5,
          general: 55
        }
      },
      maintenanceHistory: [
        { date: "2024-01-10", type: "Diagnostic", technician: "Lisa Wong", notes: "Multiple hardware failures detected" },
        { date: "2023-08-05", type: "Initial Setup", technician: "Mark Garcia", notes: "Community center deployment" }
      ],
      rating: 3.1,
      uptime: 45.8
    }
  ]);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setShowDetailModal(true);
  };

  const handleAddUnit = async () => {
    if (!newUnit.location || !newUnit.municipality || !newUnit.serialNumber) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const unitToAdd = {
      ...newUnit,
      id: `SB-${String(starbooksInventory.length + 1).padStart(3, '0')}`,
      dateDeployed: new Date().toISOString().split('T')[0],
      lastMaintenance: new Date().toISOString().split('T')[0],
      beneficiaries: 0,
      monthlyUsage: 0,
      images: ["https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600&fit=crop"],
      specifications: {
        kioskModel: "STARBOOKS Standard 2024",
        laptopSpecs: "Intel i3, 4GB RAM, 128GB SSD",
        tabletCount: 2,
        solarCapacity: "300W Solar Panel System",
        internetConnection: "DSL 25Mbps",
        powerBackup: "UPS 1500VA"
      },
      usageStats: {
        dailyAverage: 0,
        peakHours: "N/A",
        popularContent: [],
        userDemographics: { students: 0, teachers: 0, researchers: 0, general: 0 }
      },
      maintenanceHistory: [
        { date: new Date().toISOString().split('T')[0], type: "Initial Setup", technician: "System Admin", notes: "New unit deployment" }
      ],
      rating: 5.0,
      uptime: 100
    };

    setStarbooksInventory([...starbooksInventory, unitToAdd]);
    setNewUnit({
      location: "",
      municipality: "",
      province: "Cagayan",
      serialNumber: "",
      status: "Active",
      condition: "Excellent",
      components: [],
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      notes: ""
    });
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  const handleDeleteUnit = (id) => {
    setStarbooksInventory(starbooksInventory.filter(item => item.id !== id));
  };

  const filteredInventory = starbooksInventory.filter(item => {
    const matchesSearch = item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.municipality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#10b981';
      case 'maintenance': return '#f59e0b';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const cardStyle = {
    background: darkMode 
      ? 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    border: `1px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`,
    boxShadow: darkMode 
      ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)' 
      : '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
  };

  const tabStyle = (isActive) => ({
    background: isActive 
      ? 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)'
      : 'transparent',
    color: isActive ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b'),
    border: `1px solid ${isActive ? '#004A98' : (darkMode ? '#334155' : '#e2e8f0')}`,
    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isActive ? '0 8px 25px rgba(0, 74, 152, 0.4)' : 'none'
  });

  // Stats for header
  const headerStats = [
    { 
      label: "Total Units", 
      value: starbooksInventory.length, 
      icon: Package, 
      color: "rgba(255, 255, 255, 0.95)",
      textColor: "#004A98",
      subtitle: "Deployed kiosks",
      trend: "+12%"
    },
    { 
      label: "Active Units", 
      value: starbooksInventory.filter(s => s.status === "Active").length, 
      icon: CheckCircle, 
      color: "rgba(255, 255, 255, 0.95)",
      textColor: "#10b981",
      subtitle: "Currently operational",
      trend: "+8%"
    },
    { 
      label: "Under Maintenance", 
      value: starbooksInventory.filter(s => s.status === "Maintenance").length, 
      icon: Clock, 
      color: "rgba(255, 255, 255, 0.95)",
      textColor: "#f59e0b",
      subtitle: "Needs attention",
      trend: "-5%"
    },
    { 
      label: "Total Beneficiaries", 
      value: starbooksInventory.reduce((sum, s) => sum + s.beneficiaries, 0).toLocaleString(), 
      icon: Users, 
      color: "rgba(255, 255, 255, 0.95)",
      textColor: "#8b5cf6",
      subtitle: "People served",
      trend: "+23%"
    }
  ];
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in">
      {/* Content based on active tab */}
      {activePage === "starbooks-docs" ? (
        // Show Documentation Gallery
        <DocumentationPage darkMode={darkMode} />
      ) : activePage !== "starbooks" ? (
        // Show placeholder for other sections
        <div className="flex items-center justify-center min-h-[400px]">
          <div 
            className="text-center p-12 rounded-3xl backdrop-blur-xl shadow-2xl max-w-md animate-fade-in"
            style={{
              background: darkMode 
                ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)'
                : 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
              border: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`
            }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-glow">
              <span className="text-5xl">
                {activePage === "starbooks-locations" && "📍"}
                {activePage === "starbooks-users" && "👥"}
                {activePage === "starbooks-reports" && "📊"}
                {activePage === "starbooks-maintenance" && "🔧"}
                {activePage === "starbooks-docs" && "📚"}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-3 gradient-text">
              {getPageTitle()}
            </h2>
            <p className="font-medium mb-4" style={{ color: darkMode ? '#94a3b8' : '#475569' }}>
              This section is coming soon
            </p>
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.3)' : '#d1fae5',
                color: darkMode ? '#10b981' : '#059669'
              }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              In Development
            </div>
          </div>
        </div>
      ) : activeTab === "inventory" && (
        <div className="space-y-6">
          {/* Simple Header with Stats Summary */}
          <div className="rounded-2xl p-6" style={{
            ...cardStyle,
            background: darkMode 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  STARBOOKS Inventory
                </h1>
                <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Manage and track STARBOOKS kiosks deployment across Region II
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff'
                }}
              >
                <Plus className="w-5 h-5" />
                Add New Unit
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ 
                background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`
              }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                    <Package className="w-5 h-5" style={{ color: '#10b981' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {starbooksInventory.length}
                    </div>
                    <div className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Total Units
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ 
                background: darkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
                border: `1px solid ${darkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)'}`
              }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {starbooksInventory.filter(s => s.status === "Active").length}
                    </div>
                    <div className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ 
                background: darkMode ? 'rgba(251, 146, 60, 0.1)' : 'rgba(251, 146, 60, 0.05)',
                border: `1px solid ${darkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.15)'}`
              }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(251, 146, 60, 0.2)' }}>
                    <Clock className="w-5 h-5" style={{ color: '#fb923c' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {starbooksInventory.filter(s => s.status === "Maintenance").length}
                    </div>
                    <div className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Maintenance
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl transition-all duration-300 hover:scale-105" style={{ 
                background: darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
                border: `1px solid ${darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`
              }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                    <Users className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {starbooksInventory.reduce((sum, s) => sum + s.beneficiaries, 0).toLocaleString()}
                    </div>
                    <div className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Beneficiaries
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="rounded-2xl p-6" style={cardStyle}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, municipality, or serial number..."
                  className="w-full pl-12 pr-6 py-4 rounded-xl text-sm outline-none transition-all duration-300 group-hover:shadow-lg focus:shadow-xl"
                  style={{
                    background: darkMode ? '#1e293b' : '#f8fafc',
                    color: darkMode ? '#f8fafc' : '#0f172a',
                    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-8 py-4 rounded-xl text-sm outline-none cursor-pointer transition-all duration-300 hover:shadow-lg appearance-none"
                  style={{
                    background: darkMode ? '#1e293b' : '#f8fafc',
                    color: darkMode ? '#f8fafc' : '#0f172a',
                    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                    minWidth: '200px'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">✓ Active Units</option>
                  <option value="maintenance">⚠ Under Maintenance</option>
                  <option value="inactive">✕ Inactive Units</option>
                </select>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button 
                  className="p-4 rounded-xl transition-all duration-300 hover:scale-110 group"
                  style={{
                    background: darkMode ? '#1e293b' : '#f8fafc',
                    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                  }}
                  title="Export to Excel"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: '#10b981' }} />
                </button>
                <button 
                  className="p-4 rounded-xl transition-all duration-300 hover:scale-110 group"
                  style={{
                    background: darkMode ? '#1e293b' : '#f8fafc',
                    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                  }}
                  title="Refresh Data"
                >
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" style={{ color: '#004A98' }} />
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Showing <span className="font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>{filteredInventory.length}</span> of <span className="font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>{starbooksInventory.length}</span> units
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm font-medium px-3 py-1 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    color: '#10b981',
                    background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
                  }}
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Inventory List */}
          <div className="space-y-4">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={cardStyle}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: darkMode ? 'rgba(100, 116, 139, 0.1)' : 'rgba(148, 163, 184, 0.1)' }}>
                  <Package className="w-10 h-10" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  {searchQuery || statusFilter !== 'all' ? 'No units found' : 'No STARBOOKS units yet'}
                </h3>
                <p className="text-lg mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Get started by adding your first STARBOOKS unit'}
                </p>
                <button
                  onClick={() => {
                    if (searchQuery || statusFilter !== 'all') {
                      setSearchQuery('');
                      setStatusFilter('all');
                    } else {
                      setShowAddModal(true);
                    }
                  }}
                  className="px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff'
                  }}
                >
                  {searchQuery || statusFilter !== 'all' ? 'Clear Filters' : 'Add Your First Unit'}
                </button>
              </div>
            ) : (
              filteredInventory.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group cursor-pointer animate-slide-up"
                style={{
                  ...cardStyle,
                  animationDelay: `${index * 50}ms`,
                  border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}
                onClick={() => handleViewDetails(item)}
              >
                {/* Status Banner */}
                <div className="h-2" style={{ 
                  background: `linear-gradient(90deg, ${getStatusColor(item.status)} 0%, ${getStatusColor(item.status)}dd 100%)`
                }} />

                {/* Header Row */}
                <div className="p-6 border-b" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg" style={{ background: `${getStatusColor(item.status)}20` }}>
                          <Package className="w-5 h-5" style={{ color: getStatusColor(item.status) }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold group-hover:text-green-600 transition-colors truncate" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                            {item.location}
                          </h3>
                          <p className="text-sm font-mono" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            {item.serialNumber}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span 
                            className="px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 shadow-sm"
                            style={{ 
                              background: `${getStatusColor(item.status)}`, 
                              color: '#ffffff'
                            }}
                          >
                            {item.status}
                          </span>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: darkMode ? '#1e293b' : '#fef3c7' }}>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold" style={{ color: darkMode ? '#fbbf24' : '#f59e0b' }}>{item.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ 
                          background: darkMode ? '#1e293b' : '#f1f5f9',
                          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                        }}>
                          <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#10b981' }} />
                          <span style={{ color: darkMode ? '#cbd5e1' : '#475569' }} className="font-medium">{item.municipality}, {item.province}</span>
                        </div>
                        <span 
                          className="px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{ 
                            background: `${getConditionColor(item.condition)}20`, 
                            color: getConditionColor(item.condition),
                            border: `1px solid ${getConditionColor(item.condition)}40`
                          }}
                        >
                          Condition: {item.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Row */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Components & Contact */}
                    <div className="lg:col-span-2 space-y-5">
                      {/* Components */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 rounded-lg" style={{ background: darkMode ? '#1e293b' : '#f1f5f9' }}>
                            <Package className="w-4 h-4" style={{ color: '#10b981' }} />
                          </div>
                          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            Installed Components
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.components.map((component, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:scale-105"
                              style={{ 
                                background: darkMode ? '#1e293b' : '#f1f5f9',
                                color: darkMode ? '#cbd5e1' : '#475569',
                                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                              }}
                            >
                              ✓ {component}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-1.5 rounded-lg" style={{ background: darkMode ? '#1e293b' : '#f1f5f9' }}>
                            <Phone className="w-4 h-4" style={{ color: '#3b82f6' }} />
                          </div>
                          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            Contact Information
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm p-3 rounded-lg" style={{ 
                          background: darkMode ? '#1e293b' : '#f1f5f9',
                          color: darkMode ? '#cbd5e1' : '#475569'
                        }}>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                            <span className="font-semibold">{item.contactPerson}</span>
                          </div>
                          <span className="opacity-50">•</span>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" style={{ color: '#10b981' }} />
                            <span>{item.contactPhone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="space-y-3">
                      <div className="p-5 rounded-xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ 
                        background: darkMode 
                          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
                        border: `2px solid ${darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`
                      }}>
                        <Users className="w-7 h-7 mx-auto mb-3" style={{ color: '#8b5cf6' }} />
                        <div className="text-3xl font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                          {item.beneficiaries.toLocaleString()}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wide" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          Beneficiaries
                        </div>
                      </div>
                      <div className="p-5 rounded-xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg" style={{ 
                        background: darkMode 
                          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
                        border: `2px solid ${darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`
                      }}>
                        <Activity className="w-7 h-7 mx-auto mb-3" style={{ color: '#10b981' }} />
                        <div className="text-3xl font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                          {item.uptime}%
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wide" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          Uptime
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="px-6 py-4 border-t flex items-center justify-between" style={{ 
                  borderColor: darkMode ? '#334155' : '#e2e8f0',
                  background: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.8)'
                }}>
                  <div className="flex items-center gap-4 text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: darkMode ? '#1e293b' : '#ffffff' }}>
                      <Calendar className="w-4 h-4" style={{ color: '#3b82f6' }} />
                      <span className="font-medium">Deployed: {new Date(item.dateDeployed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <span className="font-mono font-bold px-3 py-1.5 rounded-lg" style={{ 
                      color: '#10b981',
                      background: darkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
                    }}>
                      {item.id}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item);
                      }}
                      className="px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 text-sm font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff'
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2.5 rounded-lg transition-all duration-300 hover:scale-110"
                      style={{
                        background: darkMode ? '#1e293b' : '#f1f5f9',
                        color: '#3b82f6',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                      title="Edit Unit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${item.location}?`)) {
                          handleDeleteUnit(item.id);
                        }
                      }}
                      className="p-2.5 rounded-lg transition-all duration-300 hover:scale-110"
                      style={{
                        background: darkMode ? '#1e293b' : '#f1f5f9',
                        color: '#ef4444',
                        border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                      title="Delete Unit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4 animate-backdrop-fade-in">
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl animate-modal-fade-in"
            style={{
              ...cardStyle,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 p-8 border-b" style={{ 
              background: darkMode ? '#0f172a' : '#ffffff',
              borderColor: darkMode ? '#334155' : '#e2e8f0'
            }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{ background: '#004A9820' }}>
                    <Plus className="w-8 h-8" style={{ color: '#004A98' }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      Add New STARBOOKS Unit
                    </h2>
                    <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Deploy a new STARBOOKS kiosk to expand digital library access
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-6 h-6" style={{ color: '#ef4444' }} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  <MapPin className="w-5 h-5" style={{ color: '#004A98' }} />
                  Location Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Location Name *
                    </label>
                    <input
                      type="text"
                      value={newUnit.location}
                      onChange={(e) => setNewUnit({...newUnit, location: e.target.value})}
                      placeholder="e.g., Tuguegarao City Hall"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                      style={{
                        background: darkMode ? '#1e293b' : '#f8fafc',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Municipality *
                    </label>
                    <input
                      type="text"
                      value={newUnit.municipality}
                      onChange={(e) => setNewUnit({...newUnit, municipality: e.target.value})}
                      placeholder="e.g., Tuguegarao City"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                      style={{
                        background: darkMode ? '#1e293b' : '#f8fafc',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Province
                    </label>
                    <select
                      value={newUnit.province}
                      onChange={(e) => setNewUnit({...newUnit, province: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                      style={{
                        background: darkMode ? '#1e293b' : '#f8fafc',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                    >
                      <option value="Cagayan">Cagayan</option>
                      <option value="Isabela">Isabela</option>
                      <option value="Nueva Vizcaya">Nueva Vizcaya</option>
                      <option value="Quirino">Quirino</option>
                      <option value="Batanes">Batanes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      value={newUnit.serialNumber}
                      onChange={(e) => setNewUnit({...newUnit, serialNumber: e.target.value})}
                      placeholder="e.g., STARBOOKS-2024-005"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                      style={{
                        background: darkMode ? '#1e293b' : '#f8fafc',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Unit Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  <Package className="w-5 h-5" style={{ color: '#004A98' }} />
                  Unit Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Status
                    </label>
                    <select
                      value={newUnit.status}
                      onChange={(e) => setNewUnit({...newUnit, status: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                      style={{
                        background: darkMode ? '#1e293b' : '#f8fafc',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Condition
                    </label>
                    <select
                      value={newUnit.condition}
                      onChange={(e) => setNewUnit({...newUnit, condition: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                      style={{
                        background: darkMode ? '#1e293b' : '#f8fafc',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  <Phone className="w-5 h-5" style={{ color: '#004A98' }} />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={newUnit.contactPerson}
                      onChange={(e) => setNewUnit({...newUnit, contactPerson: e.target.value})}
                      placeholder="e.g., Dr. Maria Santos"
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                      style={{
                        background: darkMode ? '#1e293b' : '#f8fafc',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                        border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={newUnit.contactPhone}
                        onChange={(e) => setNewUnit({...newUnit, contactPhone: e.target.value})}
                        placeholder="e.g., +63 78 844 1621"
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                        style={{
                          background: darkMode ? '#1e293b' : '#f8fafc',
                          color: darkMode ? '#f8fafc' : '#0f172a',
                          border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={newUnit.contactEmail}
                        onChange={(e) => setNewUnit({...newUnit, contactEmail: e.target.value})}
                        placeholder="e.g., contact@example.gov.ph"
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
                        style={{
                          background: darkMode ? '#1e293b' : '#f8fafc',
                          color: darkMode ? '#f8fafc' : '#0f172a',
                          border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Additional Notes
                </label>
                <textarea
                  value={newUnit.notes}
                  onChange={(e) => setNewUnit({...newUnit, notes: e.target.value})}
                  placeholder="Any additional information about this STARBOOKS unit..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 resize-none"
                  style={{
                    background: darkMode ? '#1e293b' : '#f8fafc',
                    color: darkMode ? '#f8fafc' : '#0f172a',
                    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 p-8 border-t" style={{ 
              background: darkMode ? '#0f172a' : '#ffffff',
              borderColor: darkMode ? '#334155' : '#e2e8f0'
            }}>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                  style={{
                    background: darkMode ? '#374151' : '#f3f4f6',
                    color: darkMode ? '#f8fafc' : '#374151'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUnit}
                  disabled={!newUnit.location || !newUnit.municipality || !newUnit.serialNumber || isSubmitting}
                  className="px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
                    color: '#ffffff'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Adding Unit...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add STARBOOKS Unit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9997] p-4 animate-backdrop-fade-in">
          <div 
            className="w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-3xl animate-modal-fade-in"
            style={{
              ...cardStyle,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Modal Header */}
            <div className="p-8 border-b" style={{ 
              background: darkMode ? '#0f172a' : '#ffffff',
              borderColor: darkMode ? '#334155' : '#e2e8f0'
            }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{ background: '#004A9820' }}>
                    <Eye className="w-8 h-8" style={{ color: '#004A98' }} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {selectedItem.location}
                    </h2>
                    <p className="text-lg" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {selectedItem.serialNumber} • {selectedItem.municipality}, {selectedItem.province}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-3 rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-8 h-8" style={{ color: '#ef4444' }} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex h-[calc(95vh-200px)]">
              {/* Left Panel - Images */}
              <div className="w-1/2 p-8 border-r" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-bold mb-4" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                    Unit Images
                  </h3>
                  
                  {/* Main Image */}
                  <div className="flex-1 mb-4 rounded-2xl overflow-hidden">
                    <img
                      src={selectedItem.images[currentImageIndex]}
                      alt={`${selectedItem.location} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Image Thumbnails */}
                  {selectedItem.images.length > 1 && (
                    <div className="flex gap-2">
                      {selectedItem.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                            currentImageIndex === index ? 'ring-4 ring-blue-500' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel - Details */}
              <div className="w-1/2 p-8 overflow-y-auto">
                <div className="space-y-8">
                  {/* Status & Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span 
                        className="px-4 py-2 rounded-full text-sm font-bold"
                        style={{ 
                          background: `${getStatusColor(selectedItem.status)}20`, 
                          color: getStatusColor(selectedItem.status) 
                        }}
                      >
                        {selectedItem.status}
                      </span>
                      <span 
                        className="px-4 py-2 rounded-full text-sm font-bold"
                        style={{ 
                          background: `${getConditionColor(selectedItem.condition)}20`, 
                          color: getConditionColor(selectedItem.condition) 
                        }}
                      >
                        {selectedItem.condition}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {selectedItem.rating}
                      </span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl text-center" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                      <Users className="w-8 h-8 mx-auto mb-2" style={{ color: '#8b5cf6' }} />
                      <div className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {selectedItem.beneficiaries}
                      </div>
                      <div className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Beneficiaries
                      </div>
                    </div>
                    <div className="p-4 rounded-xl text-center" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                      <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: '#10b981' }} />
                      <div className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {selectedItem.uptime}%
                      </div>
                      <div className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Uptime
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      <Phone className="w-5 h-5" style={{ color: '#004A98' }} />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: '#004A98' }}></div>
                        <span style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          Contact Person: <strong style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>{selectedItem.contactPerson}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }}></div>
                        <span style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          Phone: <strong style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>{selectedItem.contactPhone}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }}></div>
                        <span style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                          Email: <strong style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>{selectedItem.contactEmail}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      <Monitor className="w-5 h-5" style={{ color: '#004A98' }} />
                      Technical Specifications
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(selectedItem.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-3 rounded-lg" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                          <span className="font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage Statistics */}
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      <Activity className="w-5 h-5" style={{ color: '#004A98' }} />
                      Usage Statistics
                    </h4>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                        <div className="flex justify-between items-center mb-2">
                          <span style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Daily Average Users</span>
                          <span className="font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                            {selectedItem.usageStats.dailyAverage}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Peak Hours</span>
                          <span className="font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                            {selectedItem.usageStats.peakHours}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance History */}
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      <Calendar className="w-5 h-5" style={{ color: '#004A98' }} />
                      Maintenance History
                    </h4>
                    <div className="space-y-3">
                      {selectedItem.maintenanceHistory.map((record, index) => (
                        <div key={index} className="p-4 rounded-xl border-l-4" style={{ 
                          background: darkMode ? '#1e293b' : '#f8fafc',
                          borderColor: record.type === 'Initial Setup' ? '#10b981' : '#f59e0b'
                        }}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                              {record.type}
                            </span>
                            <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                              {new Date(record.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                            Technician: {record.technician}
                          </p>
                          <p className="text-sm" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                            {record.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
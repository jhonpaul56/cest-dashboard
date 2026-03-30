import { useState } from "react";
import { BookOpen, MapPin, Users, Plus, Search, Filter, Edit, Trash2, Eye, Package, CheckCircle, Clock, TrendingUp, Phone, X, Calendar, Monitor, Tablet, Activity, BarChart3, Download, RefreshCw, Settings, Star } from "lucide-react";

export const StarbooksPage = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
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
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl p-8" style={{
        background: 'linear-gradient(135deg, #004A98 0%, #0066CC 30%, #10b981 70%, #059669 100%)',
        boxShadow: '0 20px 60px rgba(0, 74, 152, 0.3)'
      }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px, 30px 30px'
        }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  STARBOOKS Inventory
                </h1>
                <p className="text-white/90 text-lg">
                  Science & Technology Academic Research-Based Openly Operated KioskS
                </p>
                <p className="text-white/70 text-sm mt-1">
                  Manage and track STARBOOKS kiosks deployment across Region II
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/95 text-blue-600 backdrop-blur-sm"
            >
              <Plus className="w-6 h-6" />
              Add STARBOOKS Unit
            </button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {headerStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ background: stat.color }}>
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ background: `${stat.textColor}20` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: stat.textColor }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold px-2 py-1 rounded-full" style={{ 
                        background: stat.trend.startsWith('+') ? '#10b98120' : '#ef444420',
                        color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444'
                      }}>
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2" style={{ color: `${stat.textColor}80` }}>
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mb-1" style={{ color: stat.textColor }}>
                      {stat.value}
                    </p>
                    <p className="text-xs" style={{ color: `${stat.textColor}60` }}>
                      {stat.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { id: "inventory", label: "Inventory Management", icon: Package, description: "View and manage all units" },
          { id: "analytics", label: "Analytics Dashboard", icon: BarChart3, description: "Usage statistics and insights" },
          { id: "maintenance", label: "Maintenance Center", icon: Settings, description: "Service history and scheduling" }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-105 group"
              style={tabStyle(activeTab === tab.id)}
            >
              <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <div className="text-left">
                <div>{tab.label}</div>
                <div className="text-xs opacity-70 font-normal">{tab.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content based on active tab */}
      {activeTab === "inventory" && (
        <div className="space-y-8">
          {/* Enhanced Search and Filters */}
          <div className="rounded-2xl p-8" style={cardStyle}>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Advanced Search */}
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
                  onFocus={(e) => e.target.style.borderColor = '#004A98'}
                  onBlur={(e) => e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-8 py-4 rounded-xl text-sm outline-none cursor-pointer transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: darkMode ? '#1e293b' : '#f8fafc',
                    color: darkMode ? '#f8fafc' : '#0f172a',
                    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Units</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="inactive">Inactive Units</option>
                </select>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button className="p-4 rounded-xl transition-all duration-300 hover:scale-110" style={{
                  background: darkMode ? '#1e293b' : '#f8fafc',
                  border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  <Download className="w-5 h-5" style={{ color: '#10b981' }} />
                </button>
                <button className="p-4 rounded-xl transition-all duration-300 hover:scale-110" style={{
                  background: darkMode ? '#1e293b' : '#f8fafc',
                  border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
                }}>
                  <RefreshCw className="w-5 h-5" style={{ color: '#004A98' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Inventory Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredInventory.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer animate-slide-up"
                style={{
                  ...cardStyle,
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.location}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                      style={{ 
                        background: `${getStatusColor(item.status)}20`, 
                        color: getStatusColor(item.status),
                        border: `1px solid ${getStatusColor(item.status)}40`
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-white">{item.rating}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(item);
                      }}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                      <Edit className="w-4 h-4 text-white" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUnit(item.id);
                      }}
                      className="p-2 rounded-full bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {item.location}
                    </h3>
                    <p className="text-sm font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {item.serialNumber}
                    </p>
                  </div>

                  {/* Condition & Location */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ 
                        background: `${getConditionColor(item.condition)}20`, 
                        color: getConditionColor(item.condition) 
                      }}
                    >
                      {item.condition}
                    </span>
                    <div className="flex items-center gap-1 text-xs" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      <MapPin className="w-3 h-3" />
                      {item.municipality}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 rounded-xl" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                      </div>
                      <div className="text-lg font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {item.beneficiaries}
                      </div>
                      <div className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Beneficiaries
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-xl" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Activity className="w-4 h-4" style={{ color: '#10b981' }} />
                      </div>
                      <div className="text-lg font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                        {item.uptime}%
                      </div>
                      <div className="text-xs" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                        Uptime
                      </div>
                    </div>
                  </div>

                  {/* Components */}
                  <div className="mb-4">
                    <p className="text-xs font-bold mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Components:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.components.map((component, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 rounded-md text-xs font-medium"
                          style={{ 
                            background: darkMode ? '#334155' : '#e2e8f0',
                            color: darkMode ? '#f8fafc' : '#0f172a'
                          }}
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                    <div className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                      Deployed: {new Date(item.dateDeployed).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-bold" style={{ color: '#004A98' }}>
                      ID: {item.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-20 rounded-2xl" style={cardStyle}>
              <Package className="w-20 h-20 mx-auto mb-6" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                No STARBOOKS units found
              </h3>
              <p className="text-lg mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #004A98 0%, #0066CC 100%)',
                  color: '#ffffff'
                }}
              >
                Add Your First Unit
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Usage Analytics */}
          <div className="rounded-2xl p-8" style={cardStyle}>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8" style={{ color: '#004A98' }} />
              <h3 className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Usage Analytics
              </h3>
            </div>
            <div className="space-y-6">
              {starbooksInventory.map((item) => (
                <div key={item.id} className="p-4 rounded-xl" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {item.location}
                    </span>
                    <span className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {item.monthlyUsage} sessions
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: darkMode ? '#334155' : '#e2e8f0' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min((item.monthlyUsage / 1500) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #004A98, #10b981)'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="rounded-2xl p-8" style={cardStyle}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8" style={{ color: '#10b981' }} />
              <h3 className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                Performance Metrics
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 rounded-xl" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#004A98' }}>
                  {(starbooksInventory.reduce((sum, item) => sum + item.uptime, 0) / starbooksInventory.length).toFixed(1)}%
                </div>
                <div className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Average Uptime
                </div>
              </div>
              <div className="text-center p-6 rounded-xl" style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}>
                <div className="text-3xl font-bold mb-2" style={{ color: '#10b981' }}>
                  {(starbooksInventory.reduce((sum, item) => sum + item.rating, 0) / starbooksInventory.length).toFixed(1)}
                </div>
                <div className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  Average Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="rounded-2xl p-8" style={cardStyle}>
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8" style={{ color: '#f59e0b' }} />
            <h3 className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
              Maintenance Center
            </h3>
          </div>
          <div className="space-y-4">
            {starbooksInventory.map((item) => (
              <div key={item.id} className="p-6 rounded-xl border-l-4" style={{ 
                background: darkMode ? '#1e293b' : '#f8fafc',
                borderColor: getStatusColor(item.status)
              }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {item.location}
                    </h4>
                    <p className="text-sm mb-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      Last Maintenance: {new Date(item.lastMaintenance).toLocaleDateString()}
                    </p>
                    <p className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                      {item.notes}
                    </p>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      background: `${getStatusColor(item.status)}20`, 
                      color: getStatusColor(item.status) 
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9998] p-4 animate-backdrop-fade-in">
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl animate-modal-slide-in"
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
                  <Settings className="w-5 h-5" style={{ color: '#004A98' }} />
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
            className="w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-3xl animate-modal-zoom-in"
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
                      <BarChart3 className="w-5 h-5" style={{ color: '#004A98' }} />
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
import { useState } from "react";
import { MapPin, Image as ImageIcon, Calendar, X, ZoomIn, Download, Filter, Search } from "lucide-react";

export const DocumentationPage = ({ darkMode }) => {
  const [selectedCity, setSelectedCity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample documentation data organized by city
  const documentationData = [
    {
      id: 1,
      city: "Tuguegarao City",
      location: "City Hall",
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600&fit=crop",
      date: "2024-01-15",
      description: "STARBOOKS installation at Tuguegarao City Hall",
      category: "Installation"
    },
    {
      id: 2,
      city: "Tuguegarao City",
      location: "Public Library",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      date: "2024-01-20",
      description: "Community training session",
      category: "Training"
    },
    {
      id: 3,
      city: "Peñablanca",
      location: "Elementary School",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop",
      date: "2024-02-10",
      description: "STARBOOKS setup at Peñablanca Elementary",
      category: "Installation"
    },
    {
      id: 4,
      city: "Peñablanca",
      location: "Community Center",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
      date: "2024-02-15",
      description: "Student orientation program",
      category: "Training"
    },
    {
      id: 5,
      city: "Gonzaga",
      location: "Public Library",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      date: "2023-11-20",
      description: "Library integration project",
      category: "Installation"
    },
    {
      id: 6,
      city: "Gonzaga",
      location: "Municipal Hall",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
      date: "2023-12-05",
      description: "Maintenance check and updates",
      category: "Maintenance"
    },
    {
      id: 7,
      city: "Aparri",
      location: "Community Center",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
      date: "2023-08-05",
      description: "Initial deployment",
      category: "Installation"
    },
    {
      id: 8,
      city: "Aparri",
      location: "Barangay Hall",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
      date: "2024-01-10",
      description: "Equipment inspection",
      category: "Maintenance"
    }
  ];

  const cities = ["all", ...new Set(documentationData.map(item => item.city))];

  const filteredData = documentationData.filter(item => {
    const matchesCity = selectedCity === "all" || item.city === selectedCity;
    const matchesSearch = item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const groupedByCity = filteredData.reduce((acc, item) => {
    if (!acc[item.city]) {
      acc[item.city] = [];
    }
    acc[item.city].push(item);
    return acc;
  }, {});

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
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8" style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)'
      }}>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <ImageIcon className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Documentation Gallery
                </h1>
                <p className="text-white/90 text-lg">
                  Visual documentation of STARBOOKS installations across Region II
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="rounded-2xl p-4 bg-white/95">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{documentationData.length}</div>
                  <div className="text-xs text-gray-600">Total Images</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-4 bg-white/95">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{cities.length - 1}</div>
                  <div className="text-xs text-gray-600">Cities</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-4 bg-white/95">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">2024</div>
                  <div className="text-xs text-gray-600">Latest Year</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-4 bg-white/95">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Filter className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{filteredData.length}</div>
                  <div className="text-xs text-gray-600">Filtered</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location or description..."
              className="w-full pl-12 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
              style={{
                background: darkMode ? '#1e293b' : '#f8fafc',
                color: darkMode ? '#f8fafc' : '#0f172a',
                border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`
              }}
            />
          </div>

          {/* City Filter */}
          <div className="flex gap-2 flex-wrap">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: selectedCity === city 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : (darkMode ? '#1e293b' : '#f1f5f9'),
                  color: selectedCity === city ? '#ffffff' : (darkMode ? '#cbd5e1' : '#475569'),
                  border: `2px solid ${selectedCity === city ? '#10b981' : (darkMode ? '#334155' : '#e2e8f0')}`
                }}
              >
                {city === "all" ? "All Cities" : city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery by City */}
      {Object.keys(groupedByCity).length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={cardStyle}>
          <ImageIcon className="w-20 h-20 mx-auto mb-6" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
          <h3 className="text-2xl font-bold mb-3" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
            No images found
          </h3>
          <p className="text-lg" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        Object.keys(groupedByCity).map((city) => (
          <div key={city} className="space-y-4">
            {/* City Header */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                  {city}
                </h2>
                <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  {groupedByCity[city].length} image{groupedByCity[city].length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupedByCity[city].map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer"
                  style={{
                    ...cardStyle,
                    animationDelay: `${index * 100}ms`
                  }}
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.description}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                        style={{ 
                          background: 'rgba(16, 185, 129, 0.9)', 
                          color: '#ffffff'
                        }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Zoom Icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="absolute bottom-3 right-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                        <Calendar className="w-3 h-3 text-white" />
                        <span className="text-xs font-semibold text-white">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {item.location}
                    </h3>
                    <p className="text-sm line-clamp-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Image Modal */}
      {selectedImage && (
        <>
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] animate-fade-in"
            onClick={() => setSelectedImage(null)}
          />
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl z-[9999] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: darkMode ? '#0f172a' : '#ffffff',
                border: `2px solid ${darkMode ? '#1e293b' : '#e5e7eb'}`
              }}
            >
              {/* Header */}
              <div 
                className="p-6 border-b flex items-center justify-between"
                style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {selectedImage.city} - {selectedImage.location}
                    </h3>
                    <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {new Date(selectedImage.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-6 h-6" style={{ color: '#ef4444' }} />
                </button>
              </div>

              {/* Image */}
              <div className="relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.description}
                  className="w-full h-auto max-h-[70vh] object-contain"
                  style={{ background: darkMode ? '#1e293b' : '#f8fafc' }}
                />
              </div>

              {/* Footer */}
              <div 
                className="p-6 border-t"
                style={{ borderColor: darkMode ? '#1e293b' : '#e5e7eb' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                      Description
                    </p>
                    <p className="text-base" style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>
                      {selectedImage.description}
                    </p>
                  </div>
                  <button
                    className="px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

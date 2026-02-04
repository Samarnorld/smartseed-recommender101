import { useState } from 'react';
import { Menu, X, Home, MapPin, TrendingUp, Database, Sprout, Layers, Info, Target, Square, Map as MapIcon } from 'lucide-react';
import logo from 'figma:asset/bfff5ac931bd296881f58b314ebeddff6dce0c23.png';
import Sidebar from './Sidebar';
import MapView from './MapView';
import InfoPanel from './InfoPanel';
import WardSelectionModal from './WardSelectionModal';
import LocationModeSelector, { SpatialMode } from './LocationModeSelector';
import { LocationContext } from '../App';

interface DashboardProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'recommendations' | 'explorer' | 'admin') => void;
  selectedCounty: string;
  onCountySelect: (county: string) => void;
  isAdmin?: boolean;
  locationContext: LocationContext;
  onLocationContextChange: (context: LocationContext) => void;
  selectedWard: string;
  onWardSelect: (ward: string) => void;
  onLocationDataUpdate?: (data: any) => void;
}

export default function Dashboard({ 
  onNavigate, 
  selectedCounty, 
  onCountySelect, 
  isAdmin = false,
  locationContext,
  onLocationContextChange,
  selectedWard,
  onWardSelect,
  onLocationDataUpdate
}: DashboardProps) {
  const [showWardModal, setShowWardModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>(['suitability']);
  const [selectedVariety, setSelectedVariety] = useState<string>('all');
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [spatialMode, setSpatialMode] = useState<SpatialMode>(null);
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragCurrentY, setDragCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [panelHeight, setPanelHeight] = useState<'min' | 'half' | 'full'>('half');
  const [mapStyle, setMapStyle] = useState<'openstreetmap' | 'satellite'>('openstreetmap');
  
  // Store previous ward context before drawing point/area
  const [previousWardContext, setPreviousWardContext] = useState<{
    ward: string;
    location: any;
    locationContext: LocationContext;
  } | null>(null);

  const handleLocationClick = (location: any) => {
    console.log('Dashboard handleLocationClick called with:', location);
    setSelectedLocation(location);
    setInfoPanelOpen(true);
    
    // If a ward is clicked, update the selected ward
    if (location.type === 'ward' && location.name) {
      console.log('Updating selected ward to:', location.name);
      onWardSelect(location.name);
    }
    
    // Close other panels on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
      setShowLocationSelector(false);
    }
  };

  const handleCloseInfoPanel = () => {
    setInfoPanelOpen(false);
    setSelectedLocation(null);
  };

  const handleLayerToggle = (layer: string) => {
    setActiveLayers(prev =>
      prev.includes(layer)
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };

  const handleCountySelect = (county: string) => {
    onCountySelect(county);
    setShowWardModal(true);
  };

  const handleSpatialModeChange = (mode: SpatialMode) => {
    setSpatialMode(mode);
    if (mode === null) {
      setCurrentContext(null);
    }
  };

  const handleClearSelection = () => {
    console.log('Clearing selection - restoring previous ward context');
    
    // Reset spatial mode
    setSpatialMode(null);
    setCurrentContext(null);
    
    // Restore previous ward context if it exists
    if (previousWardContext) {
      console.log('Restoring previous ward context:', previousWardContext);
      
      // Restore ward selection
      onWardSelect(previousWardContext.ward);
      
      // Restore location context
      onLocationContextChange(previousWardContext.locationContext);
      
      // Restore info panel with previous location
      if (previousWardContext.location) {
        setSelectedLocation(previousWardContext.location);
        setInfoPanelOpen(true);
      } else {
        setInfoPanelOpen(false);
        setSelectedLocation(null);
      }
      
      // Clear the stored context
      setPreviousWardContext(null);
    } else {
      // No previous context, just close panels
      setInfoPanelOpen(false);
      setSelectedLocation(null);
    }
    
    // Reset panel height on mobile
    setPanelHeight('half');
  };

  const handleCoordinateSelect = (coordinate: { lat: number; lng: number; name: string }) => {
    console.log('Coordinate selected from sidebar:', coordinate);
    
    // Store previous ward context
    setPreviousWardContext({
      ward: selectedWard,
      location: selectedLocation,
      locationContext: locationContext,
    });
    
    // Create location data for the coordinate
    const locationData = {
      name: coordinate.name,
      suitability: Math.floor(Math.random() * 30) + 65,
      county: selectedCounty,
      coordinates: { lat: coordinate.lat, lng: coordinate.lng },
      rainfall: Math.floor(Math.random() * 500) + 800,
      temperature: Math.floor(Math.random() * 5) + 20,
      ndvi: (Math.random() * 0.4 + 0.5).toFixed(2),
      soilType: ['Clay Loam', 'Sandy Loam', 'Silty Clay'][Math.floor(Math.random() * 3)],
      type: 'point',
      buffer: '500m',
    };

    // Update location context to zoom to coordinate
    onLocationContextChange({
      type: 'point',
      name: coordinate.name,
      coordinates: { lat: coordinate.lat, lng: coordinate.lng },
      buffer: '500m',
      zoom: 15,
    });

    // Open info panel with location data
    handleLocationClick(locationData);
  };

  const handlePolygonComplete = (polygon: { vertices: Array<{ lat: number; lng: number }>, area: number, name: string }) => {
    console.log('Polygon completed from sidebar:', polygon);

    // Calculate center of polygon
    const centerLat = polygon.vertices.reduce((sum, v) => sum + v.lat, 0) / polygon.vertices.length;
    const centerLng = polygon.vertices.reduce((sum, v) => sum + v.lng, 0) / polygon.vertices.length;

    // Calculate bounds
    const lats = polygon.vertices.map(v => v.lat);
    const lngs = polygon.vertices.map(v => v.lng);
    const bounds = {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };

    // Store previous ward context
    setPreviousWardContext({
      ward: selectedWard,
      location: selectedLocation,
      locationContext: locationContext,
    });
    
    // Create location data for the polygon
    const locationData = {
      name: polygon.name,
      suitability: Math.floor(Math.random() * 30) + 65,
      county: selectedCounty,
      coordinates: { lat: centerLat, lng: centerLng },
      rainfall: Math.floor(Math.random() * 500) + 800,
      temperature: Math.floor(Math.random() * 5) + 20,
      ndvi: (Math.random() * 0.4 + 0.5).toFixed(2),
      soilType: ['Clay Loam', 'Sandy Loam', 'Silty Clay'][Math.floor(Math.random() * 3)],
      type: 'area',
      area: `${polygon.area.toFixed(2)} hectares`,
      vertices: polygon.vertices,
      bounds,
    };

    // Update location context to zoom to polygon
    onLocationContextChange({
      type: 'area',
      name: polygon.name,
      coordinates: { lat: centerLat, lng: centerLng },
      area: `${polygon.area.toFixed(2)} hectares`,
      bounds,
      zoom: 14,
    });

    // Open info panel with location data
    handleLocationClick(locationData);
  };

  const handleSpatialSelection = (data: any) => {
    // Called when user completes a spatial selection (point, area, or admin)
    
    // Store previous ward context before changing to point/area
    if (data.type === 'point' || data.type === 'area') {
      setPreviousWardContext({
        ward: selectedWard,
        location: selectedLocation,
        locationContext: locationContext,
      });
    }
    
    setCurrentContext(data.name);
    handleLocationClick(data);
    
    // Update the central location context
    if (data.type === 'point') {
      onLocationContextChange({
        type: 'point',
        name: `${data.coordinates.lat.toFixed(4)}, ${data.coordinates.lng.toFixed(4)}`,
        coordinates: data.coordinates,
        buffer: data.buffer,
        zoom: 15,
      });
    } else if (data.type === 'area') {
      onLocationContextChange({
        type: 'area',
        name: `${data.coordinates.lat.toFixed(4)}, ${data.coordinates.lng.toFixed(4)}`,
        coordinates: data.coordinates,
        area: data.area,
        bounds: data.bounds,
        zoom: 14,
      });
    }
    
    // Close location selector on mobile
    if (window.innerWidth < 768) {
      setShowLocationSelector(false);
    }
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(currentY);
    setDragCurrentY(currentY);
    setIsDragging(true);
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragCurrentY(currentY);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const deltaY = dragCurrentY - dragStartY;
    
    // Drag down to minimize or close
    if (deltaY > 100) {
      if (panelHeight === 'full') {
        setPanelHeight('half');
      } else if (panelHeight === 'half') {
        setPanelHeight('min');
      } else {
        // Close panel if dragging down from minimized state
        setInfoPanelOpen(false);
        setPanelHeight('half');
      }
    } 
    // Drag up to expand
    else if (deltaY < -100) {
      if (panelHeight === 'min') {
        setPanelHeight('half');
      } else if (panelHeight === 'half') {
        setPanelHeight('full');
      }
    }
    
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* County Selection Modal */}
      {showWardModal && (
        <WardSelectionModal
          onSelect={(ward) => {
            onWardSelect(ward);
            setShowWardModal(false);
          }}
          onClose={() => setShowWardModal(false)}
          currentWard={selectedWard}
          onNavigate={onNavigate}
          onLocationContextChange={onLocationContextChange}
        />
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700 shadow-lg z-50 flex-shrink-0">
        <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center">
                <img src={logo} alt="SmartSeed Recommender Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white text-xs sm:text-base font-bold">SmartSeed Recommender</h1>
                <p className="text-[10px] sm:text-xs text-emerald-300 hidden sm:block font-medium">GIS Dashboard</p>
              </div>
            </div>

            {/* Right: County Selection + Navigation Menu */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* County Selector */}
              <button
                onClick={() => setShowWardModal(true)}
                className="flex items-center gap-1.5 bg-green-800/50 hover:bg-green-800 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-[10px] sm:text-sm border border-green-700 hover:border-emerald-500/50 font-bold font-normal"
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {locationContext.type === 'point' || locationContext.type === 'area' ? (
                  <>
                    <span className="hidden lg:inline">{locationContext.name}</span>
                    <span className="lg:hidden">{locationContext.name.substring(0, 12)}...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden lg:inline">{selectedWard === 'All Wards' ? 'Nandi County' : selectedWard}</span>
                    <span className="lg:hidden">{selectedWard === 'All Wards' ? 'Nandi County' : selectedWard.substring(0, 10)}</span>
                  </>
                )}
              </button>

              {/* Navigation Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNavMenu(!showNavMenu)}
                  className="p-1.5 sm:p-2.5 hover:bg-green-800/50 rounded-lg sm:rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95 border border-green-700/50 hover:border-emerald-500/50"
                >
                  {showNavMenu ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>

                {/* Enhanced Navigation Dropdown Menu */}
                {showNavMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                      onClick={() => setShowNavMenu(false)}
                    ></div>
                    
                    {/* Menu */}
                    <div className="absolute top-full right-0 mt-2 sm:mt-3 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 p-2 sm:p-3 min-w-[250px] sm:min-w-[280px] z-[70]">
                      <div className="mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <img src={logo} alt="Logo" className="w-4 h-4 sm:w-5 sm:h-5 object-contain brightness-0 invert" />
                          </div>
                          <div>
                            <p className="text-[10px] sm:text-xs font-bold text-gray-900">Navigation</p>
                            <p className="text-[9px] sm:text-xs text-gray-500">SmartSeed Platform</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            onNavigate('landing');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-lg sm:rounded-xl transition-all group"
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-xs sm:text-sm font-bold text-gray-900">Home</p>
                            <p className="text-[10px] sm:text-xs text-gray-600">Landing page</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('dashboard');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg sm:rounded-xl transition-all group bg-blue-50 border border-blue-200"
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-xs sm:text-sm font-bold text-gray-900">Dashboard</p>
                            <p className="text-[10px] sm:text-xs text-gray-600">GIS mapping & layers</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('recommendations');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-lg sm:rounded-xl transition-all group"
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-xs sm:text-sm font-bold text-gray-900">Recommendations</p>
                            <p className="text-[10px] sm:text-xs text-gray-600">Seed variety suggestions</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('explorer');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg sm:rounded-xl transition-all group"
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-xs sm:text-sm font-bold text-gray-900">Data Explorer</p>
                            <p className="text-[10px] sm:text-xs text-gray-600">Analytics & insights</p>
                          </div>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setShowNavMenu(false);
                            }}
                            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 rounded-lg sm:rounded-xl transition-all group"
                          >
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Database className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-xs sm:text-sm font-bold text-gray-900">Admin Portal</p>
                              <p className="text-[10px] sm:text-xs text-gray-600">System management</p>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Desktop Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div
          className={`hidden lg:block ${
            sidebarOpen ? 'w-72' : 'w-0'
          } transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden shadow-lg z-10`}
        >
          <Sidebar
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
            selectedVariety={selectedVariety}
            onVarietyChange={setSelectedVariety}
            onCoordinateSelect={handleCoordinateSelect}
            onPolygonComplete={handlePolygonComplete}
            mapStyle={mapStyle}
            onMapStyleChange={setMapStyle}
          />
        </div>

        {/* Desktop Sidebar Toggle - Top Left */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute left-2 top-2 bg-white border border-gray-200 rounded-lg p-2.5 shadow-md hover:bg-gray-50 z-20 transition-all items-center gap-2"
          style={{ marginLeft: sidebarOpen ? '18rem' : '0' }}
          title={sidebarOpen ? 'Hide Layers Panel' : 'Show Layers Panel'}
        >
          <Layers className="w-5 h-5 text-gray-700" />
        </button>

        {/* Map View */}
        <div className="flex-1 relative z-0">
          <MapView
            selectedCounty={selectedCounty}
            activeLayers={activeLayers}
            selectedVariety={selectedVariety}
            onLocationClick={handleLocationClick}
            spatialMode={spatialMode}
            onSpatialSelection={handleSpatialSelection}
            onSpatialModeChange={handleSpatialModeChange}
            currentContext={currentContext}
            onClearSelection={handleClearSelection}
            locationContext={locationContext}
            sidebarOpen={sidebarOpen}
            mapStyle={mapStyle}
            onMapStyleChange={setMapStyle}
          />

          {/* Mobile Layers Toggle - Top Left */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden absolute left-2 top-2 bg-white border border-gray-200 rounded-lg p-2.5 shadow-md hover:bg-gray-50 z-[1000] transition-all"
            title={sidebarOpen ? 'Hide Layers Panel' : 'Show Layers Panel'}
          >
            <Layers className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Desktop Info Panel */}
        <div
          className={`hidden lg:block ${
            infoPanelOpen ? 'w-96' : 'w-0'
          } transition-all duration-300 bg-white border-l border-gray-200 overflow-hidden shadow-lg z-10`}
        >
          <InfoPanel
            location={selectedLocation}
            onClose={handleCloseInfoPanel}
            onNavigateToExplorer={() => onNavigate('explorer')}
          />
        </div>

        {/* Mobile Sidebar Panel (Left Side) */}
        {sidebarOpen && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div className="lg:hidden fixed top-0 left-0 bottom-0 bg-white shadow-2xl z-50 w-[280px] overflow-y-auto animate-in slide-in-from-left duration-300">
              <div className="sticky top-0 bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Map Layers</h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-green-800/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <Sidebar
                  activeLayers={activeLayers}
                  onLayerToggle={handleLayerToggle}
                  selectedVariety={selectedVariety}
                  onVarietyChange={setSelectedVariety}
                  onCoordinateSelect={handleCoordinateSelect}
                  onPolygonComplete={handlePolygonComplete}
                  mapStyle={mapStyle}
                  onMapStyleChange={setMapStyle}
                />
              </div>
            </div>
          </>
        )}

        {/* Mobile Info Panel (Draggable Bottom Sheet) */}
        {infoPanelOpen && selectedLocation && (
          <div 
            className={`lg:hidden fixed left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[60] ${
              isDragging ? '' : 'transition-all duration-300 ease-out'
            }`}
            style={{
              bottom: 0,
              height: 
                panelHeight === 'min' ? '120px' :
                panelHeight === 'half' ? '50vh' :
                '85vh',
              transform: isDragging ? `translateY(${Math.max(0, dragCurrentY - dragStartY)}px)` : 'translateY(0)',
            }}
          >
            {/* Drag Handle */}
            <div 
              className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none select-none"
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Panel Content */}
            <div className="overflow-y-auto" style={{ height: 'calc(100% - 40px)' }}>
              <InfoPanel
                location={selectedLocation}
                onClose={handleCloseInfoPanel}
                onNavigateToExplorer={() => onNavigate('explorer')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
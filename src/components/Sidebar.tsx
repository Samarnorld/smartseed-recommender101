import { MapPin, Layers, Sprout, Info, Navigation, Trash2, Plus, Check, Map, Satellite } from 'lucide-react';
import { useState } from 'react';

interface SavedCoordinate {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

interface PolygonVertex {
  lat: number;
  lng: number;
}

interface SidebarProps {
  activeLayers: string[];
  onLayerToggle: (layer: string) => void;
  selectedVariety: string;
  onVarietyChange: (variety: string) => void;
  onCoordinateSelect?: (coordinate: { lat: number; lng: number; name: string }) => void;
  onPolygonComplete?: (polygon: { vertices: Array<{ lat: number; lng: number }>, area: number, name: string }) => void;
  mapStyle: 'openstreetmap' | 'satellite';
  onMapStyleChange: (style: 'openstreetmap' | 'satellite') => void;
}

export default function Sidebar({
  activeLayers,
  onLayerToggle,
  selectedVariety,
  onVarietyChange,
  onCoordinateSelect,
  onPolygonComplete,
  mapStyle,
  onMapStyleChange,
}: SidebarProps) {
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [savedCoordinates, setSavedCoordinates] = useState<SavedCoordinate[]>([]);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [captureMode, setCaptureMode] = useState<'point' | 'polygon'>('point');
  const [polygonVertices, setPolygonVertices] = useState<PolygonVertex[]>([]);

  const environmentalLayers = [
    { id: 'suitability', name: 'Suitability Zones', color: 'bg-green-500' },
    { id: 'ndvi', name: 'NDVI (Vegetation)', color: 'bg-emerald-500' },
    { id: 'rainfall', name: 'Rainfall', color: 'bg-blue-500' },
    { id: 'temperature', name: 'Temperature', color: 'bg-orange-500' },
    { id: 'elevation', name: 'Elevation (Terrain)', color: 'bg-slate-600' }, // ⛰️ ADD THIS LINE
    { id: 'soil', name: 'Soil Type', color: 'bg-amber-500' },
  ];


  const seedVarieties = [
    { id: 'all', name: 'All Varieties' },
    { id: 'dh04', name: 'DH04 - High Yield' },
    { id: 'h614', name: 'H614 - Drought Resistant' },
    { id: 'kh500', name: 'KH500 - Early Maturity' },
    { id: 'ph3253', name: 'PH3253 - Disease Resistant' },
    { id: 'sc627', name: 'SC627 - All-round' },
  ];

  const handleCaptureGPS = () => {
    setIsCapturingGPS(true);
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      setIsCapturingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatInput(lat.toFixed(6));
        setLngInput(lng.toFixed(6));
        setIsCapturingGPS(false);
        setGpsError('');
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        
        // Check for permissions policy message first
        if (error && error.message && error.message.includes('permissions policy')) {
          errorMessage = 'GPS is disabled by browser policy. This feature may not work in embedded iframes or restricted contexts. Please try using the manual coordinate input below.';
        }
        // Then check error codes
        else if (error && typeof error.code === 'number') {
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = 'Location access denied. Please enable location permissions in your browser settings and reload the page.';
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = 'Location unavailable. Please check your device GPS settings and try again.';
              break;
            case 3: // TIMEOUT
              errorMessage = 'Location request timed out. Please try again or enter coordinates manually.';
              break;
            default:
              errorMessage = error.message || 'Unknown GPS error occurred. Please use manual coordinate input.';
          }
        } else if (error && error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = 'GPS service unavailable. Please enter coordinates manually below.';
        }
        
        setGpsError(errorMessage);
        setIsCapturingGPS(false);
        console.error('GPS Error details:', { error, code: error?.code, message: error?.message });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSaveCoordinate = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }

    const newCoordinate: SavedCoordinate = {
      id: Date.now().toString(),
      lat,
      lng,
      name: `Point ${savedCoordinates.length + 1}`,
    };

    setSavedCoordinates([...savedCoordinates, newCoordinate]);
    setLatInput('');
    setLngInput('');
  };

  const handleDeleteCoordinate = (id: string) => {
    setSavedCoordinates(savedCoordinates.filter(coord => coord.id !== id));
  };

  const handleSelectCoordinate = (coordinate: SavedCoordinate) => {
    if (onCoordinateSelect) {
      onCoordinateSelect({
        lat: coordinate.lat,
        lng: coordinate.lng,
        name: coordinate.name,
      });
    }
  };

  const handleAddPolygonVertex = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }

    setPolygonVertices([...polygonVertices, { lat, lng }]);
    setLatInput('');
    setLngInput('');
  };

  const handleDeletePolygonVertex = (index: number) => {
    setPolygonVertices(polygonVertices.filter((_, i) => i !== index));
  };

  const handleCompletePolygon = () => {
    if (polygonVertices.length < 3) {
      alert('A polygon requires at least 3 points');
      return;
    }

    // Calculate area using Shoelace formula (in square meters approximately)
    const area = calculatePolygonArea(polygonVertices);
    
    if (onPolygonComplete) {
      onPolygonComplete({
        vertices: polygonVertices,
        area: area,
        name: `Farm Area (${polygonVertices.length} vertices)`
      });
    }

    // Reset polygon vertices
    setPolygonVertices([]);
    setCaptureMode('point');
  };

  const handleClearPolygon = () => {
    setPolygonVertices([]);
    setCaptureMode('point');
  };

  // Calculate polygon area using Shoelace formula (returns area in hectares)
  const calculatePolygonArea = (vertices: PolygonVertex[]): number => {
    if (vertices.length < 3) return 0;

    // Convert lat/lng to approximate meters for area calculation
    const R = 6371000; // Earth's radius in meters
    
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      const lat1 = vertices[i].lat * Math.PI / 180;
      const lat2 = vertices[j].lat * Math.PI / 180;
      const lng1 = vertices[i].lng * Math.PI / 180;
      const lng2 = vertices[j].lng * Math.PI / 180;
      
      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    
    area = Math.abs(area * R * R / 2);
    
    // Convert square meters to hectares
    return area / 10000;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="relative p-5 xl:p-6 border-b-2 border-emerald-400/30 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 shadow-xl overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400/10 rounded-full blur-2xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-md shadow-lg border border-white/30">
              <Layers className="w-5 h-5 xl:w-6 xl:h-6 text-white drop-shadow-md" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg xl:text-xl drop-shadow-md">Map Controls</h2>
              <p className="text-xs xl:text-sm text-white/90 font-medium mt-0.5">Configure layers and filters</p>
            </div>
          </div>
          
          {/* Accent line */}
          <div className="mt-3 h-1 w-16 bg-gradient-to-r from-white/60 via-emerald-200/60 to-transparent rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* Saved Coordinates List */}
        {savedCoordinates.length > 0 && (
          <div className="p-4 xl:p-5 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900">Saved Points</h3>
                  <p className="text-xs text-gray-600">{savedCoordinates.length} location{savedCoordinates.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {savedCoordinates.map((coord, index) => (
                <div
                  key={coord.id}
                  className="group p-3.5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => handleSelectCoordinate(coord)}
                >
                  {/* Accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-green-700">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{coord.name}</span>
                      </div>
                      <div className="ml-10 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Lat:</span>
                          <span className="text-xs text-gray-800 font-mono">{coord.lat.toFixed(6)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Lng:</span>
                          <span className="text-xs text-gray-800 font-mono">{coord.lng.toFixed(6)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCoordinate(coord.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                      title="Delete coordinate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-green-600 group-hover:text-green-700">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Click to view on map</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Style Selector */}
        <div className="p-4 xl:p-5 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-600 rounded-xl shadow-md">
              {mapStyle === 'satellite' ? (
                <Satellite className="w-5 h-5 text-white" />
              ) : (
                <Map className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-gray-900 font-bold">Map Style</h3>
              <p className="text-xs text-gray-600 font-medium">Base map layer</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <label
              className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all group border-2 ${
                mapStyle === 'openstreetmap'
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 shadow-md'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <input
                type="radio"
                name="mapStyle"
                value="openstreetmap"
                checked={mapStyle === 'openstreetmap'}
                onChange={() => onMapStyleChange('openstreetmap')}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-transform hover:scale-110"
              />
              <div className="flex items-center gap-2.5 flex-1">
                <div className="flex-1">
                  <span className={`text-sm font-medium transition-colors ${mapStyle === 'openstreetmap' ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    OpenStreetMap
                  </span>
                  <p className="text-xs text-gray-600">Standard street map</p>
                </div>
              </div>
            </label>
            <label
              className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer transition-all group border-2 ${
                mapStyle === 'satellite'
                  ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-400 shadow-md'
                  : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <input
                type="radio"
                name="mapStyle"
                value="satellite"
                checked={mapStyle === 'satellite'}
                onChange={() => onMapStyleChange('satellite')}
                className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer transition-transform hover:scale-110"
              />
              <div className="flex items-center gap-2.5 flex-1">
                <div className="flex-1">
                  <span className={`text-sm font-medium transition-colors ${mapStyle === 'satellite' ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    Satellite View
                  </span>
                  <p className="text-xs text-gray-600">ESRI aerial imagery</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Environmental Layers */}
        <div className="p-4 xl:p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-green-50 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-600 via-emerald-600 to-green-600 rounded-xl shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold">Environmental Layers</h3>
              <p className="text-xs text-gray-600 font-medium">Toggle map overlays</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {environmentalLayers.map((layer) => (
              <label
                key={layer.id}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all group border border-gray-200 hover:border-green-300 hover:shadow-md"
              >
                <input
                  type="checkbox"
                  checked={activeLayers.includes(layer.id)}
                  onChange={() => onLayerToggle(layer.id)}
                  className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer transition-transform hover:scale-110"
                />
                <div className={`w-5 h-5 rounded-lg ${layer.color} shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all border border-gray-200`}></div>
                <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900 font-medium transition-colors">{layer.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Seed Variety Selection */}
        <div className="p-4 xl:p-5 border-b border-gray-200">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-xl shadow-md">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold">Seed Variety Filter</h3>
              <p className="text-xs text-gray-600 font-medium">Select maize variety</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {seedVarieties.map((variety) => (
              <label
                key={variety.id}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all group border border-gray-200 hover:border-green-300 hover:shadow-md"
              >
                <input
                  type="radio"
                  name="variety"
                  value={variety.id}
                  checked={selectedVariety === variety.id}
                  onChange={(e) => onVarietyChange(e.target.value)}
                  className="w-4 h-4 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer transition-transform hover:scale-110"
                />
                <div className="flex items-center gap-2.5 flex-1">
                  <div className={`w-2 h-2 rounded-full transition-all ${selectedVariety === variety.id ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium transition-colors">{variety.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 xl:p-5 bg-gradient-to-br from-slate-50 via-gray-50 to-green-50 border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 bg-gradient-to-br from-slate-600 via-gray-600 to-slate-700 rounded-xl shadow-md">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold">Suitability Legend</h3>
              <p className="text-xs text-gray-600 font-medium">Score interpretation</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all border border-gray-200 hover:border-green-400 hover:shadow-md group cursor-pointer">
              <div className="w-10 h-5 bg-gradient-to-r from-green-700 to-green-600 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all border border-green-800"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900 transition-colors">Very High</span>
                <span className="text-xs text-gray-500 ml-1.5">(85-100%)</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all border border-gray-200 hover:border-green-300 hover:shadow-md group cursor-pointer">
              <div className="w-10 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all border border-green-600"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900 transition-colors">High</span>
                <span className="text-xs text-gray-500 ml-1.5">(70-85%)</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 transition-all border border-gray-200 hover:border-yellow-300 hover:shadow-md group cursor-pointer">
              <div className="w-10 h-5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all border border-yellow-600"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900 transition-colors">Moderate</span>
                <span className="text-xs text-gray-500 ml-1.5">(50-70%)</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all border border-gray-200 hover:border-orange-300 hover:shadow-md group cursor-pointer">
              <div className="w-10 h-5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all border border-orange-600"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900 transition-colors">Low</span>
                <span className="text-xs text-gray-500 ml-1.5">(30-50%)</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all border border-gray-200 hover:border-red-300 hover:shadow-md group cursor-pointer">
              <div className="w-10 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all border border-red-600"></div>
              <div className="flex-1">
                <span className="text-sm text-gray-800 font-medium group-hover:text-gray-900 transition-colors">Very Low</span>
                <span className="text-xs text-gray-500 ml-1.5">&lt;30%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
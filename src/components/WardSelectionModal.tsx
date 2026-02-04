import { useState, useEffect } from 'react';
import { X, Search, MapPin, Check, Home, Loader } from 'lucide-react';
import { fetchWards, parseWardsFromGeoJSON, type WardData } from '../utils/api';

interface WardSelectionModalProps {
  onSelect: (ward: string) => void;
  onClose: () => void;
  currentWard?: string;
  onNavigate?: (view: 'recommendations') => void;
  onLocationContextChange?: (context: any) => void;
}

export default function WardSelectionModal({ onSelect, onClose, currentWard, onNavigate, onLocationContextChange }: WardSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [wards, setWards] = useState<WardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wards from API on mount
  useEffect(() => {
    const loadWards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching wards from API...');
        
        const wardsGeoJSON = await fetchWards();
        const parsedWards = parseWardsFromGeoJSON(wardsGeoJSON);
        
        setWards(parsedWards);
        console.log('Wards loaded successfully:', parsedWards.length);
      } catch (err) {
        console.error('Failed to load wards:', err);
        setError('Failed to load wards from server');
        // Set fallback dummy data
        setWards(getDummyWards());
      } finally {
        setIsLoading(false);
      }
    };

    loadWards();
  }, []);

  const filteredWards = wards.filter(ward =>
    ward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ward.subCounty && ward.subCounty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group wards by sub-county
  const wardsBySubCounty = filteredWards.reduce((acc, ward) => {
    const subCounty = ward.subCounty || 'Other';
    if (!acc[subCounty]) {
      acc[subCounty] = [];
    }
    acc[subCounty].push(ward);
    return acc;
  }, {} as Record<string, WardData[]>);

  // Fallback dummy data in case API fails
  function getDummyWards(): WardData[] {
    return [
      { name: 'Nandi Hills', subCounty: 'Nandi Hills', population: 18500, elevation: '2080m' },
      { name: 'Chepkunyuk', subCounty: 'Nandi Hills', population: 15200, elevation: '2100m' },
      { name: 'Ol Lessos', subCounty: 'Nandi Hills', population: 12800, elevation: '2050m' },
      { name: 'Kapchorua', subCounty: 'Nandi Hills', population: 14300, elevation: '2150m' },
      { name: 'Kaptel/Kamoiywo', subCounty: 'Chesumei', population: 16700, elevation: '1950m' },
      { name: 'Kiptuya', subCounty: 'Chesumei', population: 13900, elevation: '1980m' },
      { name: 'Kosirai', subCounty: 'Chesumei', population: 15600, elevation: '2000m' },
      { name: 'Lelmokwo/Ngechek', subCounty: 'Chesumei', population: 14800, elevation: '1920m' },
      { name: "Chemundu/Kapng'etuny", subCounty: 'Chesumei', population: 12500, elevation: '1970m' },
      { name: 'Chepkumia', subCounty: 'Emgwen', population: 17200, elevation: '2030m' },
      { name: 'Kapkangani', subCounty: 'Emgwen', population: 15800, elevation: '2080m' },
      { name: 'Kapsabet', subCounty: 'Emgwen', population: 22400, elevation: '2100m' },
      { name: 'Kilibwoni', subCounty: 'Emgwen', population: 14200, elevation: '2050m' },
      { name: 'Chepterwai', subCounty: 'Mosop', population: 16300, elevation: '2200m' },
      { name: 'Kabisaga', subCounty: 'Mosop', population: 13700, elevation: '2180m' },
      { name: 'Kabiyet', subCounty: 'Mosop', population: 15900, elevation: '2250m' },
      { name: 'Kipkaren', subCounty: 'Mosop', population: 18100, elevation: '2150m' },
      { name: 'Mosop', subCounty: 'Mosop', population: 14600, elevation: '2220m' },
      { name: 'Ndalat', subCounty: 'Mosop', population: 13200, elevation: '2190m' },
      { name: 'Kabwareng', subCounty: 'Aldai', population: 15400, elevation: '1900m' },
      { name: 'Kemeloi-Maraba', subCounty: 'Aldai', population: 14100, elevation: '1950m' },
      { name: 'Kobujoi', subCounty: 'Aldai', population: 16800, elevation: '1880m' },
      { name: 'Koyo-Ndurio', subCounty: 'Aldai', population: 13500, elevation: '1920m' },
      { name: 'Terik', subCounty: 'Aldai', population: 12900, elevation: '1850m' },
      { name: 'Chemelil/Chemase', subCounty: 'Tinderet', population: 17600, elevation: '2050m' },
      { name: 'Kapsimotwo', subCounty: 'Tinderet', population: 15300, elevation: '2100m' },
      { name: 'Kokwet', subCounty: 'Tinderet', population: 14700, elevation: '2080m' },
      { name: 'Songhor/Soba', subCounty: 'Tinderet', population: 16200, elevation: '2020m' },
      { name: 'Tindiret', subCounty: 'Tinderet', population: 18900, elevation: '2150m' },
    ];
  }

  const handleWardSelection = (ward: WardData | null) => {
    const isAllWards = ward === null;
    const wardName = isAllWards ? 'All Wards' : ward!.name;
    
    // Update ward selection
    onSelect(wardName);
    
    // Update location context if handler provided
    if (onLocationContextChange && ward && ward.center) {
      onLocationContextChange({
        type: 'ward',
        name: ward.name,
        coordinates: ward.center,
        zoom: 13,
      });
    }
    
    // Navigate to recommendations if handler provided
    if (onNavigate) {
      onNavigate('recommendations');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <h2 className="text-green-900 text-sm sm:text-lg font-bold">Nandi County - Ward Selection</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Select a ward to view localized data and recommendations</p>
          </div>
          {currentWard && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="p-3 sm:p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ward or sub-county name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </div>

          {/* View All Wards Button */}
          <button
            onClick={() => handleWardSelection(null)}
            className={`mt-3 w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all hover:shadow-md ${
              currentWard === 'All Wards'
                ? 'border-green-600 bg-green-50'
                : 'border-blue-300 bg-blue-50/50 hover:border-blue-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-gray-900 text-sm sm:text-base font-bold block">View All Wards</span>
                  <span className="text-xs sm:text-sm text-gray-600">County-wide data across all 30 wards</span>
                </div>
              </div>
              {currentWard === 'All Wards' && (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </div>
          </button>
        </div>

        {/* Content - Wards List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-10 h-10 text-gray-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(wardsBySubCounty).map(([subCounty, wards]) => (
                <div key={subCounty}>
                  <div className="mb-2 sm:mb-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-green-200 to-transparent"></div>
                    <h3 className="text-green-900 text-xs sm:text-sm font-bold uppercase tracking-wide">
                      {subCounty} Sub-County
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-green-200 to-transparent"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {wards.map((ward) => (
                      <button
                        key={ward.name}
                        onClick={() => handleWardSelection(ward)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all hover:shadow-md group ${
                          currentWard === ward.name
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              currentWard === ward.name
                                ? 'bg-green-100'
                                : 'bg-gray-100 group-hover:bg-green-100'
                            }`}>
                              <MapPin className={`w-4 h-4 ${
                                currentWard === ward.name
                                  ? 'text-green-600'
                                  : 'text-gray-600 group-hover:text-green-600'
                              }`} />
                            </div>
                            <span className={`text-sm sm:text-base font-bold ${
                              currentWard === ward.name ? 'text-green-900' : 'text-gray-900'
                            }`}>
                              {ward.name}
                            </span>
                          </div>
                          {currentWard === ward.name && (
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Population:</span>
                            <span className="font-semibold text-gray-700">{ward.population?.toLocaleString() || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Elevation:</span>
                            <span className="font-semibold text-gray-700">{ward.elevation || 'N/A'}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredWards.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No wards found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-200 p-2.5 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50">
          <p className="text-xs sm:text-sm text-green-900 text-center font-medium">
            <span className="font-bold">30 Wards</span> across <span className="font-bold">6 Sub-Counties</span> in Nandi County
          </p>
        </div>
      </div>
    </div>
  );
}
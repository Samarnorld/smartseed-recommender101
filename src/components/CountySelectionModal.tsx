import { useState } from 'react';
import { X, Search, MapPin, Check } from 'lucide-react';

interface CountySelectionModalProps {
  onSelect: (county: string) => void;
  onClose: () => void;
  currentCounty: string;
}

export default function CountySelectionModal({ onSelect, onClose, currentCounty }: CountySelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const kenyanCounties = [
    { name: 'Nandi', region: 'Rift Valley', status: 'active', coverage: 100 },
    { name: 'Uasin Gishu', region: 'Rift Valley', status: 'coming-soon', coverage: 0 },
    { name: 'Trans Nzoia', region: 'Rift Valley', status: 'coming-soon', coverage: 0 },
    { name: 'Nakuru', region: 'Rift Valley', status: 'coming-soon', coverage: 0 },
    { name: 'Narok', region: 'Rift Valley', status: 'coming-soon', coverage: 0 },
    { name: 'Bomet', region: 'Rift Valley', status: 'coming-soon', coverage: 0 },
    { name: 'Kericho', region: 'Rift Valley', status: 'coming-soon', coverage: 0 },
    { name: 'Bungoma', region: 'Western', status: 'coming-soon', coverage: 0 },
    { name: 'Kakamega', region: 'Western', status: 'coming-soon', coverage: 0 },
    { name: 'Kisumu', region: 'Nyanza', status: 'coming-soon', coverage: 0 },
    { name: 'Siaya', region: 'Nyanza', status: 'coming-soon', coverage: 0 },
    { name: 'Machakos', region: 'Eastern', status: 'coming-soon', coverage: 0 },
    { name: 'Kitui', region: 'Eastern', status: 'coming-soon', coverage: 0 },
    { name: 'Embu', region: 'Eastern', status: 'coming-soon', coverage: 0 },
    { name: 'Meru', region: 'Eastern', status: 'coming-soon', coverage: 0 },
  ];

  const filteredCounties = kenyanCounties.filter(county =>
    county.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    county.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCounties = filteredCounties.filter(c => c.status === 'active');
  const comingSoonCounties = filteredCounties.filter(c => c.status === 'coming-soon');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-green-900 text-sm sm:text-lg font-bold">Select County</h2>
            <p className="text-xs sm:text-sm text-gray-600">Choose a county to view data and recommendations</p>
          </div>
          {currentCounty && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>

        {/* Search and View Toggle */}
        <div className="p-3 sm:p-6 border-b border-gray-200 space-y-2 sm:space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by county or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium ${
                viewMode === 'map'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          {viewMode === 'list' ? (
            <div className="space-y-3 sm:space-y-6">
              {/* Active Counties */}
              {activeCounties.length > 0 && (
                <div>
                  <h3 className="text-green-900 mb-2 sm:mb-3 text-xs sm:text-base font-bold">Available Now</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {activeCounties.map((county) => (
                      <button
                        key={county.name}
                        onClick={() => onSelect(county.name)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all hover:shadow-md ${
                          currentCounty === county.name
                            ? 'border-green-600 bg-green-50'
                            : 'border-green-300 bg-green-50/50 hover:border-green-400'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1 sm:mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            <span className="text-green-900 text-sm sm:text-base font-bold">{county.name}</span>
                          </div>
                          {currentCounty === county.name && (
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">{county.region}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div className="bg-green-600 h-1.5 sm:h-2 rounded-full" style={{ width: `${county.coverage}%` }} />
                          </div>
                          <span className="text-xs text-green-700 font-semibold">{county.coverage}%</span>
                        </div>
                        <span className="inline-block mt-1.5 sm:mt-2 text-xs bg-green-600 text-white px-2 py-0.5 sm:py-1 rounded font-medium">
                          Full Coverage
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Coming Soon Counties */}
              {comingSoonCounties.length > 0 && (
                <div>
                  <h3 className="text-gray-900 mb-2 sm:mb-3 text-xs sm:text-base font-bold">Coming Soon</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {comingSoonCounties.map((county) => (
                      <div
                        key={county.name}
                        className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-gray-50 opacity-60"
                      >
                        <div className="flex items-start justify-between mb-1 sm:mb-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-400" />
                            <span className="text-gray-700 text-xs sm:text-base font-semibold">{county.name}</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{county.region}</p>
                        <span className="inline-block text-xs bg-gray-300 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                          Coming Soon
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Map View */
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-8 border-2 border-green-200 min-h-[300px] sm:min-h-[400px] relative">
              <div className="text-center">
                <MapPin className="w-10 h-10 sm:w-16 sm:h-16 text-green-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-green-900 mb-1 sm:mb-2 text-sm sm:text-base font-bold">Interactive Map View</h3>
                <p className="text-gray-600 mb-3 sm:mb-6 text-xs sm:text-sm">Click on counties to select them</p>
              </div>

              {/* Simplified Kenya Map Representation */}
              <div className="relative w-full max-w-md mx-auto h-48 sm:h-80 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                {/* Nandi County (Active) */}
                <button
                  onClick={() => onSelect('Nandi')}
                  className="absolute w-12 h-12 sm:w-20 sm:h-20 bg-green-500 hover:bg-green-600 rounded-lg border-2 border-green-700 transition-all hover:scale-110 flex items-center justify-center group"
                  style={{ left: '35%', top: '40%' }}
                  title="Nandi County"
                >
                  <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Nandi
                  </span>
                </button>

                {/* Other counties (Coming Soon) */}
                <div
                  className="absolute w-10 h-10 sm:w-16 sm:h-16 bg-gray-300 rounded-lg border-2 border-gray-400 opacity-50"
                  style={{ left: '50%', top: '35%' }}
                  title="Uasin Gishu - Coming Soon"
                />
                <div
                  className="absolute w-10 h-10 sm:w-16 sm:h-16 bg-gray-300 rounded-lg border-2 border-gray-400 opacity-50"
                  style={{ left: '40%', top: '25%' }}
                  title="Trans Nzoia - Coming Soon"
                />
                <div
                  className="absolute w-10 h-10 sm:w-16 sm:h-16 bg-gray-300 rounded-lg border-2 border-gray-400 opacity-50"
                  style={{ left: '55%', top: '50%' }}
                  title="Nakuru - Coming Soon"
                />
                <div
                  className="absolute w-10 h-10 sm:w-16 sm:h-16 bg-gray-300 rounded-lg border-2 border-gray-400 opacity-50"
                  style={{ left: '20%', top: '45%' }}
                  title="Kakamega - Coming Soon"
                />
              </div>

              <div className="mt-3 sm:mt-6 flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded border-2 border-green-700"></div>
                  <span className="text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded border-2 border-gray-400"></div>
                  <span className="text-gray-700">Coming Soon</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-200 p-2.5 sm:p-4 bg-blue-50">
          <p className="text-xs sm:text-sm text-blue-900 text-center">
            Currently serving Nandi County with plans to expand across Kenya. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
}
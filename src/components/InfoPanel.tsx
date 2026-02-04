import { X, MapPin, Droplets, Thermometer, Leaf, Mountain, Sprout, TrendingUp, AlertCircle } from 'lucide-react';

interface InfoPanelProps {
  location: any;
  onClose: () => void;
  onNavigateToExplorer?: () => void;
}

export default function InfoPanel({ location, onClose, onNavigateToExplorer }: InfoPanelProps) {
  if (!location) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MapPin className="w-10 h-10 text-gray-500" />
          </div>
          <p className="text-gray-600 font-medium">Click on the map to view location details</p>
          <p className="text-sm text-gray-500 mt-2">Select any point to see environmental data</p>
        </div>
      </div>
    );
  }

  const getSuitabilityLevel = (score: number) => {
    if (score >= 85) return { label: 'Very High', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300', gradient: 'from-green-500 to-emerald-600' };
    if (score >= 70) return { label: 'High', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', gradient: 'from-green-400 to-emerald-500' };
    if (score >= 50) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', gradient: 'from-yellow-400 to-orange-500' };
    if (score >= 30) return { label: 'Low', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', gradient: 'from-orange-400 to-red-500' };
    return { label: 'Very Low', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', gradient: 'from-red-400 to-red-600' };
  };

  const suitability = getSuitabilityLevel(location.suitability);

  const recommendedVarieties = [
    { name: 'DH04', score: location.suitability, traits: 'High yield, medium maturity' },
    { name: 'H614', score: Math.max(55, location.suitability - 10), traits: 'Drought resistant' },
    { name: 'KH500', score: Math.max(60, location.suitability - 5), traits: 'Early maturity, 90-100 days' },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl">
      <div className="flex flex-col">
        {/* Header - Enhanced with gradient */}
        <div className="bg-green-600 p-4 sticky top-0 z-10 md:relative md:z-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" />
              <div>
                <h3 className="text-white font-semibold">Location Details</h3>
                <p className="text-sm text-green-100">{location.name || 'Selected Location'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content - Enhanced styling */}
        <div className="p-5 space-y-5">
          {/* Overall Suitability - Premium card */}
          <div className={`${suitability.bg} border-2 ${suitability.border} rounded-2xl p-5 shadow-lg backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-1">Overall Suitability</span>
                <span className={`text-xs ${suitability.color} font-semibold uppercase tracking-wide`}>{suitability.label}</span>
              </div>
              <div className={`text-4xl font-bold ${suitability.color} flex items-center gap-1`}>
                {location.suitability}
                <span className="text-lg">%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner overflow-hidden">
              <div
                className={`bg-gradient-to-r ${suitability.gradient} h-3 rounded-full transition-all duration-500 shadow-md`}
                style={{ width: `${location.suitability}%` }}
              />
            </div>
          </div>

          {/* Location Info - Card style */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200">
            <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-gray-600" />
              </div>
              Location Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="text-gray-600 text-xs font-medium block mb-1">County</span>
                <p className="text-gray-900 font-bold">{location.county}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="text-gray-600 text-xs font-medium block mb-1">Zone</span>
                <p className="text-gray-900 font-bold">{location.name}</p>
              </div>
            </div>
          </div>

          {/* Environmental Conditions - Enhanced cards */}
          <div>
            <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              Environmental Conditions
            </h4>
            <div className="space-y-3">
              <div className="group hover:scale-[1.02] transition-all duration-200">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border-2 border-blue-200 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Droplets className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 font-medium mb-0.5">Annual Rainfall</p>
                      <p className="text-blue-900 font-bold text-lg">{location.rainfall} mm</p>
                    </div>
                  </div>
                  <span className="text-xs text-blue-700 bg-blue-200 px-3 py-1.5 rounded-full font-bold shadow-sm">Good</span>
                </div>
              </div>

              <div className="group hover:scale-[1.02] transition-all duration-200">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl border-2 border-orange-200 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Thermometer className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-orange-700 font-medium mb-0.5">Avg Temperature</p>
                      <p className="text-orange-900 font-bold text-lg">{location.temperature}°C</p>
                    </div>
                  </div>
                  <span className="text-xs text-orange-700 bg-orange-200 px-3 py-1.5 rounded-full font-bold shadow-sm">Optimal</span>
                </div>
              </div>

              <div className="group hover:scale-[1.02] transition-all duration-200">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border-2 border-green-200 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium mb-0.5">NDVI Index</p>
                      <p className="text-green-900 font-bold text-lg">{location.ndvi}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-700 bg-green-200 px-3 py-1.5 rounded-full font-bold shadow-sm">Healthy</span>
                </div>
              </div>

              <div className="group hover:scale-[1.02] transition-all duration-200">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl border-2 border-amber-200 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Mountain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-700 font-medium mb-0.5">Soil Type</p>
                      <p className="text-amber-900 font-bold text-lg">{location.soilType}</p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-700 bg-amber-200 px-3 py-1.5 rounded-full font-bold shadow-sm">Suitable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Seed Varieties - Premium cards */}
          <div>
            <h4 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg flex items-center justify-center">
                <Sprout className="w-4 h-4 text-green-600" />
              </div>
              Recommended Seed Varieties
            </h4>
            <div className="space-y-3">
              {recommendedVarieties.map((variety, index) => (
                <div
                  key={variety.name}
                  className={`group hover:scale-[1.02] transition-all duration-200 p-4 rounded-xl border-2 shadow-md ${
                    index === 0
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                          <span>⭐</span> Top Pick
                        </div>
                      )}
                      <span className={`font-bold ${index === 0 ? 'text-green-900' : 'text-gray-900'}`}>{variety.name}</span>
                    </div>
                    <div className={`text-right ${index === 0 ? 'text-green-700' : 'text-gray-700'}`}>
                      <span className="text-xl font-bold">{variety.score}</span>
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {variety.traits}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 shadow-inner overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-md' : 'bg-gray-400'
                      }`}
                      style={{ width: `${variety.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Insights - Enhanced */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                  Performance Insights
                </h5>
                <p className="text-sm text-blue-800 leading-relaxed">
                  This location shows strong potential for maize cultivation. Expected yield: <span className="font-bold">25-30 bags/acre</span> with proper management.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations - Enhanced */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5 className="text-amber-900 font-bold mb-2">Recommendations</h5>
                <ul className="text-sm text-amber-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Consider drought-resistant varieties if rainfall is inconsistent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Optimal planting window: March-April</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Apply appropriate soil amendments for pH balance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Fertilizer Recommendations - Coming Soon */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="text-purple-900 font-bold mb-2">Fertilizer Recommendations</h5>
                <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2 border border-purple-200">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-purple-700 italic">Feature coming soon! We're working on personalized fertilizer recommendations for your area.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Now part of scroll */}
          <div className="pt-2 pb-3 space-y-3">
            <button 
              onClick={onNavigateToExplorer}
              className="w-full px-5 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Get Detailed Report
            </button>
            <button className="w-full px-5 py-3.5 bg-white text-green-600 border-2 border-green-600 rounded-xl hover:bg-green-50 transition-all duration-200 font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              Save Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
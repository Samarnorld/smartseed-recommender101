import { useState } from 'react';
import { Menu, X, Home, MapPin, Search, Sprout, TrendingUp, Calendar, Droplets, Shield, Star, Info, CheckCircle, AlertCircle, Database } from 'lucide-react';
import logo from 'figma:asset/bfff5ac931bd296881f58b314ebeddff6dce0c23.png';
import { LocationContext } from '../App';

interface SeedRecommendationsProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'recommendations' | 'explorer' | 'admin') => void;
  selectedCounty: string;
  isAdmin?: boolean;
  locationContext: LocationContext;
  selectedWard?: string;
}

export default function SeedRecommendations({ onNavigate, selectedCounty, isAdmin, locationContext, selectedWard = 'All Wards' }: SeedRecommendationsProps) {
  const [location, setLocation] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showCountyModal, setShowCountyModal] = useState(false);

  const seedVarieties = [
    {
      id: 'dh04',
      name: 'DH04',
      score: 92,
      company: 'Western Seed Company',
      maturity: '115-125 days',
      yield: '30-35 bags/acre',
      traits: ['High Yield', 'Medium Maturity', 'Disease Resistant'],
      description: 'Excellent performer in high-altitude areas with good rainfall. Recommended for commercial farming.',
      rainfall: '800-1200mm',
      altitude: '1500-2400m',
      advantages: ['Very high yield potential', 'Good disease tolerance', 'Strong stalks'],
      considerations: ['Requires good soil fertility', 'Needs adequate rainfall'],
    },
    {
      id: 'h614',
      name: 'H614',
      score: 88,
      company: 'Kenya Seed Company',
      maturity: '120-130 days',
      yield: '28-32 bags/acre',
      traits: ['Drought Resistant', 'Long Maturity', 'High Quality Grain'],
      description: 'Ideal for areas with variable rainfall patterns. Excellent drought tolerance.',
      rainfall: '600-1000mm',
      altitude: '1200-2200m',
      advantages: ['Excellent drought tolerance', 'Stable yields', 'Good grain quality'],
      considerations: ['Longer growing season', 'Moderate yield potential'],
    },
    {
      id: 'kh500',
      name: 'KH500',
      score: 85,
      company: 'Kenya Highlands Seed',
      maturity: '90-100 days',
      yield: '25-30 bags/acre',
      traits: ['Early Maturity', 'Fast Growing', 'Good Adaptability'],
      description: 'Perfect for short season planting and early harvest. Good adaptability to various conditions.',
      rainfall: '700-1100mm',
      altitude: '1000-2400m',
      advantages: ['Early harvest', 'Multiple seasons possible', 'Wide adaptability'],
      considerations: ['Moderate yield', 'Requires proper timing'],
    },
    {
      id: 'ph3253',
      name: 'PH3253',
      score: 83,
      company: 'Pioneer Seeds',
      maturity: '110-120 days',
      yield: '27-33 bags/acre',
      traits: ['Disease Resistant', 'Strong Stalks', 'Good Grain Fill'],
      description: 'Robust variety with excellent disease resistance. Good for areas with disease pressure.',
      rainfall: '750-1150mm',
      altitude: '1300-2300m',
      advantages: ['Superior disease resistance', 'Strong plant structure', 'Good standability'],
      considerations: ['Premium seed price', 'Requires good management'],
    },
    {
      id: 'sc627',
      name: 'SC627',
      score: 80,
      company: 'Seed Co Kenya',
      maturity: '105-115 days',
      yield: '26-31 bags/acre',
      traits: ['All-round', 'Balanced Performance', 'Good Recovery'],
      description: 'Well-balanced variety suitable for various conditions. Reliable performance across seasons.',
      rainfall: '700-1100mm',
      altitude: '1200-2300m',
      advantages: ['Consistent performance', 'Good stress tolerance', 'Versatile'],
      considerations: ['Not specialized for any extreme condition'],
    },
  ];

  const handleSearch = () => {
    if (location.trim()) {
      setSearchSubmitted(true);
    }
  };

  const handleVarietyClick = (variety: any) => {
    setSelectedVariety(variety);
    setShowDetailsModal(true);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700 shadow-lg sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 xl:w-11 xl:h-11 flex items-center justify-center">
                <img src={logo} alt="SmartSeed Recommender Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white text-sm sm:text-base xl:text-lg font-bold">SmartSeed Recommender</h1>
                <p className="text-xs xl:text-sm text-emerald-300 hidden sm:block font-medium">Seed Recommendations</p>
              </div>
            </div>

            {/* Right: County Selection + Navigation Menu */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowCountyModal(true)}
                className="flex items-center gap-2 bg-green-800/50 hover:bg-green-800 text-white px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm border border-green-700 hover:border-emerald-500/50"
              >
                <MapPin className="w-4 h-4" />
                {locationContext.type === 'point' || locationContext.type === 'area' ? (
                  <span className="hidden md:inline">{locationContext.name}</span>
                ) : (
                  <span className="hidden md:inline">{selectedWard === 'All Wards' ? 'Nandi County' : selectedWard}</span>
                )}
              </button>

              {/* Navigation Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNavMenu(!showNavMenu)}
                  className="p-2.5 hover:bg-green-800/50 rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95 border border-green-700/50 hover:border-emerald-500/50"
                >
                  {showNavMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                    <div className="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 min-w-[280px] z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-2 px-3 py-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <img src={logo} alt="Logo" className="w-5 h-5 object-contain brightness-0 invert" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">Navigation</p>
                            <p className="text-xs text-gray-500">SmartSeed Platform</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            onNavigate('landing');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all group"
                        >
                          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Home className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-bold text-gray-900">Home</p>
                            <p className="text-xs text-gray-600">Landing page</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('dashboard');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all group"
                        >
                          <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Database className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-bold text-gray-900">Dashboard</p>
                            <p className="text-xs text-gray-600">GIS mapping & layers</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('recommendations');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all group bg-emerald-50 border border-emerald-200"
                        >
                          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sprout className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-bold text-gray-900">Recommendations</p>
                            <p className="text-xs text-gray-600">Seed variety suggestions</p>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('explorer');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all group"
                        >
                          <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-bold text-gray-900">Data Explorer</p>
                            <p className="text-xs text-gray-600">Analytics & insights</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 xl:py-16">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 mb-6 sm:mb-8 border border-gray-200">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-green-900 text-center mb-2 text-lg sm:text-xl">Get Location-Specific Recommendations</h2>
            <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Enter your location to receive personalized seed variety recommendations based on local conditions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location (e.g., Kapsabet, Nandi County)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Get Recommendations</span>
                <span className="sm:hidden">Search</span>
              </button>
            </div>

            {selectedCounty && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs sm:text-sm text-green-900 text-center">
                Currently viewing recommendations for: <span className="font-semibold">
                  {locationContext.type === 'point' && `Point: ${locationContext.name}`}
                  {locationContext.type === 'area' && `Area: ${locationContext.name}`}
                  {locationContext.type === 'ward' && locationContext.name}
                  {locationContext.type === 'county' && selectedCounty}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {(searchSubmitted || selectedCounty) && (
          <div className="space-y-4 sm:space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4 gap-3">
                <div>
                  <h3 className="text-white mb-1 text-base sm:text-lg">
                    Recommendations for {
                      locationContext.type === 'point' 
                        ? `Point: ${locationContext.name}` 
                        : locationContext.type === 'area' 
                        ? `Area: ${locationContext.name}` 
                        : locationContext.type === 'ward' 
                        ? locationContext.name 
                        : location || selectedCounty || 'Your Location'
                    }
                  </h3>
                  <p className="text-green-100 text-xs sm:text-sm">Based on current environmental conditions and historical data</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-xs sm:text-sm text-green-100">Confidence</p>
                  <p className="text-xl sm:text-2xl text-white">94%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                  <Droplets className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                  <p className="text-xs text-green-100">Rainfall</p>
                  <p className="text-white text-sm sm:text-base">1,050 mm</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                  <p className="text-xs text-green-100">Altitude</p>
                  <p className="text-white text-sm sm:text-base">1,850 m</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                  <p className="text-xs text-green-100">Best Season</p>
                  <p className="text-white text-sm sm:text-base">Mar-Apr</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                  <p className="text-xs text-green-100">Risk Level</p>
                  <p className="text-white text-sm sm:text-base">Low</p>
                </div>
              </div>
            </div>

            {/* Seed Varieties List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
                <h3 className="text-gray-900">Top Recommended Varieties</h3>
                <span className="text-xs sm:text-sm text-gray-600">{seedVarieties.length} varieties analyzed</span>
              </div>

              {seedVarieties.map((variety, index) => (
                <div
                  key={variety.id}
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all border-2 overflow-hidden ${
                    index === 0 ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start gap-2 sm:gap-3 mb-2">
                          {index === 0 && (
                            <div className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Top Pick
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                            <span className="text-xl sm:text-2xl">#{index + 1}</span>
                          </div>
                        </div>
                        <h4 className="text-green-900 mb-1 text-base sm:text-lg">{variety.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{variety.company}</p>
                        <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">{variety.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                          {variety.traits.map((trait) => (
                            <span
                              key={trait}
                              className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="lg:text-right">
                        <div className="inline-flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                          <span className="text-2xl sm:text-3xl text-green-700">{variety.score}</span>
                          <span className="text-xs text-gray-600">Suitability</span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Maturity Period</p>
                        <p className="text-gray-900 text-sm sm:text-base">{variety.maturity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Expected Yield</p>
                        <p className="text-gray-900 text-sm sm:text-base">{variety.yield}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Rainfall Range</p>
                        <p className="text-gray-900 text-sm sm:text-base">{variety.rainfall}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Altitude Range</p>
                        <p className="text-gray-900 text-sm sm:text-base">{variety.altitude}</p>
                      </div>
                    </div>

                    {/* Advantages and Considerations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="text-green-900 text-xs sm:text-sm mb-2">✓ Advantages</h5>
                        <ul className="space-y-1">
                          {variety.advantages.map((adv, i) => (
                            <li key={i} className="text-xs sm:text-sm text-green-800">• {adv}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h5 className="text-amber-900 text-xs sm:text-sm mb-2">! Considerations</h5>
                        <ul className="space-y-1">
                          {variety.considerations.map((con, i) => (
                            <li key={i} className="text-xs sm:text-sm text-amber-800">• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm text-gray-600">Recommended planting: March - April</span>
                    <button
                      onClick={() => handleVarietyClick(variety)}
                      className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Get Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!searchSubmitted && !selectedCounty && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Enter Your Location</h3>
            <p className="text-gray-600">Get started by entering your location to receive personalized seed recommendations</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedVariety && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-gray-900 text-lg sm:text-xl font-semibold">Complete Variety Details</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">Comprehensive information for {selectedVariety.name}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-2 sm:gap-3 mb-3">
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Recommended
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
                      Rank #{seedVarieties.findIndex(v => v.id === selectedVariety.id) + 1}
                    </div>
                  </div>
                  <h4 className="text-green-900 mb-2 text-xl sm:text-2xl font-bold">{selectedVariety.name}</h4>
                  <p className="text-sm sm:text-base text-gray-700 mb-2 font-medium">{selectedVariety.company}</p>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{selectedVariety.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedVariety.traits.map((trait: string) => (
                      <span
                        key={trait}
                        className="px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-full text-xs font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:text-right flex-shrink-0">
                  <div className="inline-flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg">
                    <span className="text-4xl sm:text-5xl font-bold text-white">{selectedVariety.score}</span>
                    <span className="text-xs sm:text-sm text-green-100 font-medium mt-1">Suitability Score</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div>
                <h5 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-green-600" />
                  Key Performance Metrics
                </h5>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                    <Calendar className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Maturity Period</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">{selectedVariety.maturity}</p>
                  </div>
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                    <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Expected Yield</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">{selectedVariety.yield}</p>
                  </div>
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                    <Droplets className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Rainfall Range</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">{selectedVariety.rainfall}</p>
                  </div>
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-300 transition-colors">
                    <MapPin className="w-5 h-5 text-orange-600 mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Altitude Range</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">{selectedVariety.altitude}</p>
                  </div>
                </div>
              </div>

              {/* Advantages and Considerations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 bg-green-50 rounded-xl border-2 border-green-200">
                  <h5 className="text-green-900 font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Key Advantages
                  </h5>
                  <ul className="space-y-2">
                    {selectedVariety.advantages.map((adv: string, i: number) => (
                      <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 sm:p-5 bg-amber-50 rounded-xl border-2 border-amber-200">
                  <h5 className="text-amber-900 font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Important Considerations
                  </h5>
                  <ul className="space-y-2">
                    {selectedVariety.considerations.map((con: string, i: number) => (
                      <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="text-amber-600 font-bold mt-0.5">!</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional Information */}
              <div className="p-4 sm:p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                <h5 className="text-blue-900 font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Planting Recommendations
                </h5>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><span className="font-semibold">Best Planting Season:</span> March - April (Long rains)</p>
                  <p><span className="font-semibold">Alternative Season:</span> September - October (Short rains, if applicable)</p>
                  <p><span className="font-semibold">Spacing:</span> 75cm x 25cm (recommended for optimal yield)</p>
                  <p><span className="font-semibold">Seed Rate:</span> 10-12 kg/acre</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-600">
                <p className="font-medium">Need more information?</p>
                <p>Contact your local agricultural extension officer</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Close
                </button>
                <button className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-semibold shadow-lg shadow-green-500/20">
                  Save to Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { MapPin, TrendingUp, Database, ArrowRight, ChevronDown, Menu, X, Home, Sprout, LogOut } from 'lucide-react';
import heroImage from 'figma:asset/5e25c6c038ecd78f23bb6453b71467354e3bd141.png';
import logo from 'figma:asset/bfff5ac931bd296881f58b314ebeddff6dce0c23.png';
import maizeFieldBg from 'figma:asset/bfff5ac931bd296881f58b314ebeddff6dce0c23.png';
import { useState } from 'react';
import { LocationContext } from '../App';
import Footer from './Footer';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'recommendations' | 'explorer' | 'admin') => void;
  isAdmin?: boolean;
  locationContext: LocationContext;
  selectedCounty: string;
  onLogout: () => void;
}

export default function LandingPage({ onNavigate, isAdmin = false, locationContext, selectedCounty, onLogout }: LandingPageProps) {
  const [showNavMenu, setShowNavMenu] = useState(false);

  const scrollToContent = () => {
    const nextSection = document.querySelector('#coverage-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50">
      {/* Header - Jungle Green Navbar */}
      <header className="sticky top-0 bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700 shadow-lg z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 xl:w-11 xl:h-11 flex items-center justify-center">
                <img src={logo} alt="SmartSeed Recommender Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white text-sm sm:text-base xl:text-lg font-bold">SmartSeed Recommender</h1>
                <p className="text-xs xl:text-sm text-emerald-300 hidden sm:block font-medium">Nandi County Agricultural Intelligence</p>
              </div>
            </div>

            {/* Right: Navigation Menu Button + Login Button */}
            <div className="flex items-center gap-2 sm:gap-3">
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
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all group bg-green-50 border border-green-200"
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
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all group"
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
                      
                      {isAdmin && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setShowNavMenu(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg transition-all text-sm font-semibold text-gray-700 border border-gray-300"
                          >
                            <span>Admin Portal</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg transition-all text-sm font-semibold text-gray-700 border border-gray-300"
                        >
                          <span>Logout</span>
                          <LogOut className="w-4 h-4" />
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

      {/* Hero Section with Maize Field Background */}
      <section className="relative text-white min-h-[calc(100vh-80px)] flex flex-col">
        {/* Maize Field Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        ></div>
        
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

        <div className="flex-1 flex items-center">
  <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10 py-16 sm:py-20 xl:py-24 w-full">
          <div className="text-center space-y-6 sm:space-y-8 xl:space-y-10 mb-10 sm:mb-12 xl:mb-16">
            <div className="inline-block px-4 sm:px-6 xl:px-8 py-2 sm:py-2.5 xl:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-3 sm:mb-4">
              <p className="text-emerald-300 text-xs sm:text-sm xl:text-base font-semibold tracking-wide">
                Data-driven agricultural intelligence
              </p>

            </div>
            
            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold leading-tight tracking-tight drop-shadow-2xl px-2">
              Smart Maize Seed Recommendations
            </h1>
            
            <p className="text-emerald-100/90 text-sm sm:text-lg xl:text-xl 2xl:text-2xl max-w-4xl mx-auto leading-relaxed px-3 sm:px-6 drop-shadow-lg">
              Using satellite imagery, climate data, and soil information to recommend the best maize seed varieties at county, ward, or farm level. Make data-driven decisions to maximize your yield.
            </p>
          </div>

          <div className="flex flex-row items-center justify-center gap-3 sm:gap-5 xl:gap-6 max-w-3xl mx-auto">
            <button
              onClick={() => onNavigate('dashboard')}
              className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-3 xl:gap-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white px-6 sm:px-12 xl:px-14 py-3 sm:py-5 xl:py-6 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl shadow-emerald-500/40 hover:shadow-3xl hover:shadow-emerald-500/60 text-sm sm:text-lg xl:text-xl font-bold border-2 border-white/30 w-full sm:w-auto hover:scale-[1.02] overflow-hidden"
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <span className="relative z-10">
                Map Dashboard
              </span>

            </button>
            <button
              onClick={() => onNavigate('recommendations')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 sm:px-10 xl:px-12 py-2.5 sm:py-5 xl:py-6 rounded-lg sm:rounded-xl transition-all border-2 border-white/30 hover:border-white/50 text-sm sm:text-lg xl:text-xl font-semibold w-full sm:w-auto hover:scale-105"
            >
              Seed Recommendations
            </button>
          </div>
        </div>
        </div>
        

        {/* Animated Scroll Down Indicator */}
        <div className="pb-6 flex justify-center z-20">
          <button
            onClick={scrollToContent}
            aria-label="Scroll to content"
            className="flex flex-col items-center gap-1 text-white/80 hover:text-emerald-300 transition-colors"
          >
            <span className="text-xs tracking-wide uppercase opacity-80">
              Scroll
            </span>
            <ChevronDown className="w-6 h-6 animate-pulse" />
          </button>
        </div>

      </section>

      {/* Coverage Map Preview - Modern redesign */}
      <section
        id="coverage-section"
        className="bg-gradient-to-b from-white via-emerald-50/40 to-teal-50 border-t border-emerald-200"
      >

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    {/* Header */}
<div className="mb-12 text-center flex flex-col items-center">
  <div className="flex items-center gap-2 mb-2">
    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
      Current coverage
    </h2>
  </div>

  <p className="text-slate-600 max-w-xl">
    SmartSeed is currently piloted in selected regions with complete
    spatial, climate, and soil datasets.
  </p>
</div>

    {/* Coverage grid */}
<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Active coverage */}
      <div className="rounded-2xl p-6 bg-white border border-emerald-300 shadow-md">
        <div className="flex items-center gap-3 mb-4">
  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
    <MapPin className="w-5 h-5 text-emerald-700" />
  </div>
  <h3 className="text-lg font-semibold text-slate-900">
    Nandi County
  </h3>
</div>

        <p className="text-slate-600 mb-4">
          County-wide agricultural intelligence coverage across all wards.
        </p>

        <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
          <li>• County and ward boundaries</li>
          <li>• Climate and rainfall datasets</li>
          <li>• Soil property layers</li>
          <li>• Crop suitability indicators</li>
        </ul>

        <button
          onClick={() => onNavigate('dashboard')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700 transition"
        >
          View on map
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Placeholder */}
      <div className="border border-dashed border-slate-300 rounded-xl p-6 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          More regions coming
        </h3>
        <p className="text-slate-600 text-sm">
          Additional counties will be added as datasets are validated and
          integrated.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Footer - Modern design */}
      <Footer />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-white/95 backdrop-blur-sm p-3 sm:p-6 xl:p-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-white/50 hover:border-emerald-200 hover:-translate-y-1">
      <div className="w-10 h-10 sm:w-14 sm:h-14 xl:w-16 xl:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white mb-2 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
        {icon}
      </div>
      <h4 className="text-slate-900 mb-1 sm:mb-2 text-xs sm:text-base xl:text-lg font-bold">{title}</h4>
      <p className="text-[10px] sm:text-sm xl:text-base text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
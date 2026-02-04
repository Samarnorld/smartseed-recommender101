import { useState } from 'react';
import { Menu, X, Upload, Database, Activity, Settings, Users, Map, FileText, CheckCircle, AlertCircle, Clock, Home, Sprout, TrendingUp, Edit, Trash2, Plus, Download, Shield, Key, BookOpen, RefreshCw, Search, Filter, MoreVertical, MapPin } from 'lucide-react';
import logo from 'figma:asset/bfff5ac931bd296881f58b314ebeddff6dce0c23.png';
import { LocationContext } from '../App';

interface AdminPortalProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'recommendations' | 'explorer' | 'admin') => void;
  locationContext: LocationContext;
  selectedCounty: string;
}

export default function AdminPortal({ onNavigate, locationContext, selectedCounty }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'counties' | 'varieties' | 'upload' | 'users' | 'logs' | 'monitoring' | 'settings'>('overview');
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const systemStats = [
    { label: 'Total Counties', value: '1', icon: Map, color: 'blue', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200', change: '+0 this month', trend: 'neutral' },
    { label: 'Active Users', value: '247', icon: Users, color: 'green', bgColor: 'bg-green-50', iconColor: 'text-green-600', borderColor: 'border-green-200', change: '+23 this week', trend: 'up' },
    { label: 'Datasets', value: '12', icon: Database, color: 'purple', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200', change: '+2 this month', trend: 'up' },
    { label: 'Seed Varieties', value: '28', icon: Sprout, color: 'emerald', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', borderColor: 'border-emerald-200', change: '+3 this month', trend: 'up' },
  ];

  const counties = [
    { id: 1, name: 'Nandi County', region: 'Rift Valley', datasets: 12, users: 89, status: 'active', coverage: '95%', lastUpdate: '2024-11-25' },
    { id: 2, name: 'Uasin Gishu County', region: 'Rift Valley', datasets: 0, users: 0, status: 'pending', coverage: '0%', lastUpdate: 'N/A' },
    { id: 3, name: 'Trans-Nzoia County', region: 'Rift Valley', datasets: 0, users: 0, status: 'pending', coverage: '0%', lastUpdate: 'N/A' },
  ];

  const seedVarieties = [
    { id: 1, name: 'H614', type: 'Hybrid', maturity: '120-130 days', yield: '8-12 tons/ha', altitude: '1200-2100m', rainfall: '800-1200mm', status: 'active', trials: 45 },
    { id: 2, name: 'DH04', type: 'Hybrid', maturity: '130-140 days', yield: '7-11 tons/ha', altitude: '1000-2000m', rainfall: '750-1100mm', status: 'active', trials: 38 },
    { id: 3, name: 'H513', type: 'Hybrid', maturity: '125-135 days', yield: '7.5-11.5 tons/ha', altitude: '1100-2000m', rainfall: '800-1150mm', status: 'active', trials: 42 },
    { id: 4, name: 'PHB30G19', type: 'Hybrid', maturity: '115-125 days', yield: '8.5-13 tons/ha', altitude: '1300-2200m', rainfall: '850-1250mm', status: 'active', trials: 51 },
    { id: 5, name: 'KH500-20A', type: 'Hybrid', maturity: '135-145 days', yield: '7-10.5 tons/ha', altitude: '900-1900m', rainfall: '700-1000mm', status: 'inactive', trials: 28 },
  ];

  const users = [
    { id: 1, name: 'Dr. James Kiplagat', email: 'j.kiplagat@smartseed.ke', role: 'Admin', county: 'Nandi', lastLogin: '2024-11-25 14:30', status: 'active' },
    { id: 2, name: 'Sarah Mwangi', email: 's.mwangi@smartseed.ke', role: 'Agronomist', county: 'Nandi', lastLogin: '2024-11-25 10:15', status: 'active' },
    { id: 3, name: 'Peter Ochieng', email: 'p.ochieng@smartseed.ke', role: 'Extension Officer', county: 'Nandi', lastLogin: '2024-11-24 16:45', status: 'active' },
    { id: 4, name: 'Mary Chebet', email: 'm.chebet@smartseed.ke', role: 'Data Analyst', county: 'Nandi', lastLogin: '2024-11-23 09:20', status: 'active' },
    { id: 5, name: 'David Kamau', email: 'd.kamau@smartseed.ke', role: 'Farmer', county: 'Nandi', lastLogin: '2024-11-20 11:30', status: 'inactive' },
  ];

  const auditLogs = [
    { id: 1, user: 'Dr. James Kiplagat', action: 'Uploaded dataset', details: 'Nandi_NDVI_Nov2024.tif', timestamp: '2024-11-25 14:30', type: 'upload' },
    { id: 2, user: 'Sarah Mwangi', action: 'Updated seed variety', details: 'H614 yield parameters', timestamp: '2024-11-25 10:15', type: 'update' },
    { id: 3, user: 'Mary Chebet', action: 'Generated report', details: 'Monthly performance report', timestamp: '2024-11-24 16:45', type: 'report' },
    { id: 4, user: 'Dr. James Kiplagat', action: 'Added new user', details: 'Peter Ochieng - Extension Officer', timestamp: '2024-11-24 09:30', type: 'create' },
    { id: 5, user: 'System', action: 'Model retrained', details: 'Suitability Predictor - Accuracy: 94.2%', timestamp: '2024-11-23 02:00', type: 'system' },
  ];

  const recentUploads = [
    { id: 1, name: 'Nandi_NDVI_Nov2024.tif', type: 'NDVI', date: '2024-11-25', status: 'processed', size: '45.2 MB', county: 'Nandi' },
    { id: 2, name: 'Rainfall_Data_Q4.csv', type: 'Rainfall', date: '2024-11-24', status: 'processing', size: '2.1 MB', county: 'Nandi' },
    { id: 3, name: 'Soil_Analysis_Nandi.shp', type: 'Soil', date: '2024-11-23', status: 'processed', size: '8.7 MB', county: 'Nandi' },
    { id: 4, name: 'Temperature_Nov2024.nc', type: 'Temperature', date: '2024-11-22', status: 'processed', size: '12.4 MB', county: 'Nandi' },
  ];

  const modelPerformance = [
    { model: 'Suitability Predictor', accuracy: '94.2%', status: 'healthy', lastRun: '2 hours ago', predictions: 425, avgResponse: '245ms' },
    { model: 'Yield Estimator', accuracy: '91.8%', status: 'healthy', lastRun: '4 hours ago', predictions: 312, avgResponse: '198ms' },
    { model: 'Climate Analyzer', accuracy: '96.5%', status: 'healthy', lastRun: '1 hour ago', predictions: 510, avgResponse: '312ms' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Consistent Navigation */}
      <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700 shadow-lg sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Brand (Clickable to Home) */}
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 xl:w-11 xl:h-11 flex items-center justify-center">
                <img src={logo} alt="SmartSeed Recommender Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white text-sm sm:text-base xl:text-lg font-bold">SmartSeed Recommender</h1>
                <p className="text-xs xl:text-sm text-emerald-300 hidden sm:block font-medium text-left">Admin Portal</p>
              </div>
            </button>

            {/* Right: Desktop Navigation + Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Location Context Button */}
              <button
                className="flex items-center gap-2 bg-green-800/50 hover:bg-green-800 text-white px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm border border-green-700 hover:border-emerald-500/50"
              >
                <MapPin className="w-4 h-4" />
                {locationContext.type === 'point' || locationContext.type === 'area' ? (
                  <span className="hidden md:inline">{locationContext.name}</span>
                ) : (
                  <span className="hidden md:inline">{selectedCounty}</span>
                )}
              </button>

              {/* Desktop Navigation Links - Hidden on mobile, visible on lg and up */}
              <nav className="hidden lg:flex items-center gap-6">
                <button
                  onClick={() => onNavigate('landing')}
                  className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-800/50"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">Home</span>
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-800/50"
                >
                  <Database className="w-4 h-4" />
                  <span className="font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-800/50"
                >
                  <Sprout className="w-4 h-4" />
                  <span className="font-medium">Recommendations</span>
                </button>
                <button
                  onClick={() => onNavigate('explorer')}
                  className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-green-800/50"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Data Explorer</span>
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-2 text-white bg-green-800/50 px-3 py-2 rounded-lg border border-amber-500/50"
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin Portal</span>
                </button>
              </nav>

              {/* Mobile Hamburger Menu Button - Only visible on mobile (below lg) */}
              <div className="lg:hidden relative">
                <button
                  onClick={() => setShowNavMenu(!showNavMenu)}
                  className="p-2.5 hover:bg-green-800/50 rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95 border border-green-700/50 hover:border-emerald-500/50"
                >
                  {showNavMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                {/* Mobile Navigation Dropdown Menu */}
                {showNavMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                      onClick={() => setShowNavMenu(false)}
                    ></div>
                    
                    {/* Menu - positioned on the right */}
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

                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setShowNavMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 rounded-xl transition-all group bg-amber-50 border border-amber-200"
                        >
                          <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Shield className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-bold text-gray-900">Admin Portal</p>
                            <p className="text-xs text-gray-600">System management</p>
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
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'counties', label: 'Counties', icon: Map },
              { id: 'varieties', label: 'Seed Varieties', icon: Sprout },
              { id: 'upload', label: 'Data Upload', icon: Upload },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'logs', label: 'Audit Logs', icon: BookOpen },
              { id: 'monitoring', label: 'AI Models', icon: Database },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap transition-all text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-green-600 text-green-600 bg-green-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {systemStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 sm:p-6 border ${stat.borderColor} hover:shadow-xl transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      {stat.trend === 'up' && (
                        <span className="text-green-600 text-xs font-semibold px-2 py-1 bg-green-50 rounded-full">↑</span>
                      )}
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600 mb-2 font-medium">{stat.label}</p>
                    <p className="text-xs text-green-600 font-semibold">{stat.change}</p>
                  </div>
                );
              })}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-bold text-base sm:text-lg">Recent Dataset Uploads</h3>
                  <button className="text-green-600 hover:text-green-700 text-sm font-semibold">View All</button>
                </div>
                <div className="space-y-3">
                  {recentUploads.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all border border-gray-200">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{upload.name}</p>
                          <p className="text-xs text-gray-600">{upload.type} • {upload.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {upload.status === 'processed' ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <CheckCircle className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-orange-600 font-semibold">
                            <Clock className="w-4 h-4 animate-spin" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Performance */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 font-bold text-base sm:text-lg">AI Model Health</h3>
                  <button className="text-green-600 hover:text-green-700 text-sm font-semibold">Details</button>
                </div>
                <div className="space-y-3">
                  {modelPerformance.map((model) => (
                    <div key={model.model} className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">{model.model}</span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          {model.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Accuracy: </span>
                          <span className="font-bold text-green-600">{model.accuracy}</span>
                        </div>
                        <span className="text-gray-500">Last run: {model.lastRun}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Status Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-4 sm:p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-green-900 font-bold mb-1">All Systems Operational</h4>
                  <p className="text-sm text-green-700">All services are running smoothly. No issues detected in the last 24 hours.</p>
                  <p className="text-xs text-green-600 mt-2 font-medium">Last system check: 2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Counties Management Tab */}
        {activeTab === 'counties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <div>
                <h3 className="text-gray-900 font-bold text-lg">County Management</h3>
                <p className="text-sm text-gray-600 mt-1">Manage counties and their coverage areas</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-semibold">
                <Plus className="w-4 h-4" />
                Add County
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">County</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Region</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Datasets</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Users</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Coverage</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {counties.map((county) => (
                      <tr key={county.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Map className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{county.name}</p>
                              <p className="text-xs text-gray-600 md:hidden">{county.region}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{county.region}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-semibold hidden sm:table-cell">{county.datasets}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-semibold hidden lg:table-cell">{county.users}</td>
                        <td className="px-4 sm:px-6 py-4">
                          {county.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-semibold hidden xl:table-cell">{county.coverage}</td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Seed Varieties Management Tab */}
        {activeTab === 'varieties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <div>
                <h3 className="text-gray-900 font-bold text-lg">Seed Varieties Management</h3>
                <p className="text-sm text-gray-600 mt-1">Manage maize seed varieties and their parameters</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-semibold">
                <Plus className="w-4 h-4" />
                Add Variety
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Variety</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Maturity</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Yield</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Altitude</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Rainfall</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {seedVarieties.map((variety) => (
                      <tr key={variety.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <Sprout className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{variety.name}</p>
                              <p className="text-xs text-gray-600">{variety.type} • {variety.trials} trials</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{variety.maturity}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 font-semibold hidden md:table-cell">{variety.yield}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">{variety.altitude}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">{variety.rainfall}</td>
                        <td className="px-4 sm:px-6 py-4">
                          {variety.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Data Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
              <h3 className="text-gray-900 font-bold text-lg mb-2">Upload New Dataset</h3>
              <p className="text-gray-600 mb-6">Upload environmental data, satellite imagery, or crop trial results</p>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center hover:border-green-500 transition-all cursor-pointer bg-gradient-to-br from-gray-50 to-green-50/30 hover:shadow-inner">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-900 font-semibold mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-sm text-gray-600 mb-4">Supported formats: .tif, .shp, .csv, .nc, .json • Max size: 500MB</p>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-semibold">
                  Select Files
                </button>
              </div>

              {/* Dataset Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6">
                {['NDVI', 'Rainfall', 'Temperature', 'Soil', 'Elevation', 'Crop Trials'].map((type) => (
                  <button
                    key={type}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left group"
                  >
                    <p className="text-gray-900 font-semibold group-hover:text-green-600">{type}</p>
                    <p className="text-xs text-gray-600 mt-1">Select dataset type</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Guidelines */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-lg">
              <h4 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Upload Guidelines
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Ensure all geospatial data includes proper coordinate reference systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>File sizes should not exceed 500MB per upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Include metadata files (.xml) when available</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Name files using the convention: [County]_[Type]_[Date]</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Verify data quality before uploading to minimize processing errors</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <div>
                <h3 className="text-gray-900 font-bold text-lg">User Management</h3>
                <p className="text-sm text-gray-600 mt-1">Manage platform users and permissions</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-semibold">
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Role</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">County</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Last Login</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{user.county}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs text-gray-500 hidden xl:table-cell">{user.lastLogin}</td>
                        <td className="px-4 sm:px-6 py-4">
                          {user.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">Audit Logs</h3>
                  <p className="text-sm text-gray-600 mt-1">Track all system activities and user actions</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold">
                  <Download className="w-4 h-4" />
                  Export Logs
                </button>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          log.type === 'upload' ? 'bg-blue-100' :
                          log.type === 'update' ? 'bg-purple-100' :
                          log.type === 'create' ? 'bg-green-100' :
                          log.type === 'report' ? 'bg-orange-100' :
                          'bg-gray-100'
                        }`}>
                          {log.type === 'upload' && <Upload className={`w-5 h-5 text-blue-600`} />}
                          {log.type === 'update' && <Edit className={`w-5 h-5 text-purple-600`} />}
                          {log.type === 'create' && <Plus className={`w-5 h-5 text-green-600`} />}
                          {log.type === 'report' && <FileText className={`w-5 h-5 text-orange-600`} />}
                          {log.type === 'system' && <RefreshCw className={`w-5 h-5 text-gray-600`} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-bold text-gray-900">{log.user}</p>
                            <span className="text-gray-400">•</span>
                            <p className="text-sm text-gray-600">{log.action}</p>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{log.details}</p>
                          <p className="text-xs text-gray-500">{log.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Model Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-gray-900 font-bold text-lg mb-4">AI Model Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-md">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Overall Health</p>
                  <p className="text-2xl font-bold text-green-600">Excellent</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-md">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-blue-600">94.2%</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 shadow-md">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Predictions Today</p>
                  <p className="text-2xl font-bold text-purple-600">1,247</p>
                </div>
              </div>

              {/* Detailed Model Stats */}
              <div className="space-y-4">
                {modelPerformance.map((model) => (
                  <div key={model.model} className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-gray-900 font-bold mb-1">{model.model}</h4>
                        <p className="text-sm text-gray-600">Last run: {model.lastRun}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                        {model.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Accuracy</p>
                        <p className="text-gray-900 font-bold text-lg">{model.accuracy}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Predictions</p>
                        <p className="text-gray-900 font-bold text-lg">{model.predictions}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Avg Response</p>
                        <p className="text-gray-900 font-bold text-lg">{model.avgResponse}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-gray-900 font-bold text-lg mb-4">System Alerts</h3>
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 flex items-start gap-3 shadow-md">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-900 font-bold">All systems operational</p>
                    <p className="text-sm text-green-700">No issues detected in the last 24 hours</p>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 flex items-start gap-3 shadow-md">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-900 font-bold">Scheduled maintenance</p>
                    <p className="text-sm text-blue-700">System update planned for December 1, 2024 at 02:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-gray-900 font-bold text-lg mb-4">System Configuration</h3>
              <div className="space-y-4">
                {[
                  { label: 'Automatic Data Processing', description: 'Automatically process uploaded datasets', checked: true },
                  { label: 'Email Notifications', description: 'Receive email alerts for system events', checked: true },
                  { label: 'Model Auto-Retraining', description: 'Automatically retrain models with new data', checked: false },
                  { label: 'API Access', description: 'Enable external API access for integrations', checked: true },
                  { label: 'Data Quality Checks', description: 'Validate data quality before processing', checked: true },
                ].map((setting) => (
                  <div key={setting.label} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-900 font-semibold">{setting.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={setting.checked} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">{setting.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Backup & Export */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-gray-900 font-bold text-lg mb-4">Backup & Export</h3>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all mb-3 font-semibold flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Backup System Data
                </button>
                <button className="w-full px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Export Reports
                </button>
              </div>

              {/* API Keys */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-gray-900 font-bold text-lg mb-4">API Management</h3>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all mb-3 font-semibold flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" />
                  Generate API Key
                </button>
                <button className="w-full px-4 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  Manage Permissions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
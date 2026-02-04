import { useState } from 'react';
import { ArrowLeft, TrendingUp, Droplets, Thermometer, Leaf, Calendar, Download, Menu, X, Home, Database, Sprout, BarChart3, Activity, CloudRain, Sun, Wind, MapPin } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import logo from 'figma:asset/bfff5ac931bd296881f58b314ebeddff6dce0c23.png';
import { LocationContext } from '../App';

interface DataExplorerProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'recommendations' | 'explorer' | 'admin') => void;
  selectedCounty: string;
  isAdmin?: boolean;
  locationContext: LocationContext;
  selectedWard: string;
}

export default function DataExplorer({ onNavigate, selectedCounty, isAdmin = false, locationContext, selectedWard }: DataExplorerProps) {
  const [selectedDataType, setSelectedDataType] = useState<'rainfall' | 'temperature' | 'ndvi' | 'soil'>('rainfall');
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('6m');
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [showCountyModal, setShowCountyModal] = useState(false);

  // Full year dataset for rainfall
  const rainfallDataFull = [
    { month: 'Jan 2024', value: 165, historical: 172, optimal: 160 },
    { month: 'Feb 2024', value: 132, historical: 125, optimal: 130 },
    { month: 'Mar 2024', value: 189, historical: 195, optimal: 185 },
    { month: 'Apr 2024', value: 256, historical: 248, optimal: 250 },
    { month: 'May 2024', value: 198, historical: 205, optimal: 200 },
    { month: 'Jun 2024', value: 145, historical: 138, optimal: 140 },
    { month: 'Jul 2024', value: 122, historical: 128, optimal: 125 },
    { month: 'Aug 2024', value: 145, historical: 152, optimal: 140 },
    { month: 'Sep 2024', value: 178, historical: 171, optimal: 165 },
    { month: 'Oct 2024', value: 225, historical: 218, optimal: 210 },
    { month: 'Nov 2024', value: 242, historical: 235, optimal: 230 },
    { month: 'Dec 2024', value: 198, historical: 205, optimal: 195 },
  ];

  // Full year dataset for temperature
  const temperatureDataFull = [
    { month: 'Jan 2024', min: 15, max: 25, avg: 20, optimal: 21 },
    { month: 'Feb 2024', min: 15, max: 26, avg: 21, optimal: 22 },
    { month: 'Mar 2024', min: 16, max: 26, avg: 21, optimal: 22 },
    { month: 'Apr 2024', min: 15, max: 24, avg: 20, optimal: 21 },
    { month: 'May 2024', min: 14, max: 23, avg: 19, optimal: 20 },
    { month: 'Jun 2024', min: 13, max: 22, avg: 18, optimal: 19 },
    { month: 'Jul 2024', min: 13, max: 22, avg: 17, optimal: 18 },
    { month: 'Aug 2024', min: 14, max: 24, avg: 19, optimal: 20 },
    { month: 'Sep 2024', min: 15, max: 25, avg: 20, optimal: 21 },
    { month: 'Oct 2024', min: 15, max: 24, avg: 19, optimal: 20 },
    { month: 'Nov 2024', min: 14, max: 23, avg: 18, optimal: 19 },
    { month: 'Dec 2024', min: 14, max: 24, avg: 19, optimal: 20 },
  ];

  // Full year dataset for NDVI
  const ndviDataFull = [
    { month: 'Jan 2024', value: 0.58, optimal: 0.60, threshold: 0.50 },
    { month: 'Feb 2024', value: 0.55, optimal: 0.60, threshold: 0.50 },
    { month: 'Mar 2024', value: 0.65, optimal: 0.65, threshold: 0.50 },
    { month: 'Apr 2024', value: 0.78, optimal: 0.75, threshold: 0.50 },
    { month: 'May 2024', value: 0.72, optimal: 0.70, threshold: 0.50 },
    { month: 'Jun 2024', value: 0.68, optimal: 0.65, threshold: 0.50 },
    { month: 'Jul 2024', value: 0.60, optimal: 0.60, threshold: 0.50 },
    { month: 'Aug 2024', value: 0.62, optimal: 0.65, threshold: 0.50 },
    { month: 'Sep 2024', value: 0.68, optimal: 0.65, threshold: 0.50 },
    { month: 'Oct 2024', value: 0.75, optimal: 0.70, threshold: 0.50 },
    { month: 'Nov 2024', value: 0.72, optimal: 0.70, threshold: 0.50 },
    { month: 'Dec 2024', value: 0.65, optimal: 0.65, threshold: 0.50 },
  ];

  // Full year dataset for weather patterns
  const weatherPatternsDataFull = [
    { month: 'Jan 2024', sunshine: 7.2, humidity: 65, windSpeed: 9 },
    { month: 'Feb 2024', sunshine: 7.5, humidity: 62, windSpeed: 10 },
    { month: 'Mar 2024', sunshine: 7.0, humidity: 68, windSpeed: 8 },
    { month: 'Apr 2024', sunshine: 6.5, humidity: 75, windSpeed: 7 },
    { month: 'May 2024', sunshine: 6.2, humidity: 72, windSpeed: 6 },
    { month: 'Jun 2024', sunshine: 6.0, humidity: 70, windSpeed: 7 },
    { month: 'Jul 2024', sunshine: 6.3, humidity: 68, windSpeed: 8 },
    { month: 'Aug 2024', sunshine: 6.5, humidity: 65, windSpeed: 8 },
    { month: 'Sep 2024', sunshine: 7.0, humidity: 68, windSpeed: 9 },
    { month: 'Oct 2024', sunshine: 6.8, humidity: 72, windSpeed: 7 },
    { month: 'Nov 2024', sunshine: 6.2, humidity: 75, windSpeed: 6 },
    { month: 'Dec 2024', sunshine: 6.5, humidity: 70, windSpeed: 8 },
  ];

  // Function to filter data based on time range
  const getFilteredData = (fullData: any[]) => {
    const dataLength = fullData.length;
    switch (timeRange) {
      case '1m':
        return fullData.slice(dataLength - 1); // Last 1 month
      case '3m':
        return fullData.slice(dataLength - 3); // Last 3 months
      case '6m':
        return fullData.slice(dataLength - 6); // Last 6 months
      case '1y':
        return fullData; // Full year
      default:
        return fullData.slice(dataLength - 6);
    }
  };

  // Get filtered data based on time range
  const rainfallData = getFilteredData(rainfallDataFull);
  const temperatureData = getFilteredData(temperatureDataFull);
  const ndviData = getFilteredData(ndviDataFull);
  const weatherPatternsData = getFilteredData(weatherPatternsDataFull);

  const soilData = [
    { parameter: 'pH', value: 6.5, optimal: 6.5, max: 7.0 },
    { parameter: 'Nitrogen', value: 75, optimal: 80, max: 100 },
    { parameter: 'Phosphorus', value: 65, optimal: 70, max: 100 },
    { parameter: 'Potassium', value: 80, optimal: 85, max: 100 },
    { parameter: 'Organic Matter', value: 70, optimal: 75, max: 100 },
  ];

  const cropPerformanceData = [
    { variety: 'H614', yield: 85, area: 30 },
    { variety: 'DH04', yield: 78, area: 25 },
    { variety: 'H513', yield: 82, area: 20 },
    { variety: 'PHB30G19', yield: 88, area: 15 },
    { variety: 'Others', yield: 75, area: 10 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  const dataTypes = [
    { id: 'rainfall', name: 'Rainfall', icon: Droplets, color: 'blue', unit: 'mm', bgColor: 'bg-blue-50', borderColor: 'border-blue-500', textColor: 'text-blue-900', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { id: 'temperature', name: 'Temperature', icon: Thermometer, color: 'orange', unit: '°C', bgColor: 'bg-orange-50', borderColor: 'border-orange-500', textColor: 'text-orange-900', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
    { id: 'ndvi', name: 'NDVI', icon: Leaf, color: 'green', unit: 'index', bgColor: 'bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-900', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { id: 'soil', name: 'Soil Health', icon: Activity, color: 'purple', unit: 'score', bgColor: 'bg-purple-50', borderColor: 'border-purple-500', textColor: 'text-purple-900', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  const getCurrentData = () => {
    switch (selectedDataType) {
      case 'rainfall':
        return rainfallData;
      case 'temperature':
        return temperatureData;
      case 'ndvi':
        return ndviData;
      case 'soil':
        return soilData;
      default:
        return rainfallData;
    }
  };

  const getStats = () => {
    const data = getCurrentData();
    switch (selectedDataType) {
      case 'rainfall':
        const totalRainfall = rainfallData.reduce((sum, item) => sum + item.value, 0);
        const avgRainfall = Math.round(totalRainfall / rainfallData.length);
        const historicalAvg = Math.round(rainfallData.reduce((sum, item) => sum + item.historical, 0) / rainfallData.length);
        const rainfallTrend = ((avgRainfall - historicalAvg) / historicalAvg * 100).toFixed(1);
        return { 
          current: `${totalRainfall}mm`, 
          average: `${avgRainfall}mm/month`, 
          trend: `${rainfallTrend > 0 ? '+' : ''}${rainfallTrend}%`,
          quality: '98%'
        };
      case 'temperature':
        const avgTemp = Math.round(temperatureData.reduce((sum, item) => sum + item.avg, 0) / temperatureData.length);
        return { 
          current: `${avgTemp}°C`, 
          average: '19-20°C', 
          trend: '+2.1%',
          quality: '97%'
        };
      case 'ndvi':
        const avgNdvi = (ndviData.reduce((sum, item) => sum + item.value, 0) / ndviData.length).toFixed(2);
        const optimalNdvi = (ndviData.reduce((sum, item) => sum + item.optimal, 0) / ndviData.length).toFixed(2);
        const ndviTrend = ((parseFloat(avgNdvi) - parseFloat(optimalNdvi)) / parseFloat(optimalNdvi) * 100).toFixed(1);
        return { 
          current: avgNdvi, 
          average: optimalNdvi, 
          trend: `${ndviTrend > 0 ? '+' : ''}${ndviTrend}%`,
          quality: '99%'
        };
      case 'soil':
        const avgSoil = Math.round(soilData.reduce((sum, item) => sum + item.value, 0) / soilData.length);
        return { 
          current: `${avgSoil}/100`, 
          average: '73/100', 
          trend: '+4.2%',
          quality: '96%'
        };
      default:
        return { current: 'N/A', average: 'N/A', trend: 'N/A', quality: 'N/A' };
    }
  };

  const stats = getStats();
  const currentType = dataTypes.find(t => t.id === selectedDataType)!;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Header - Consistent with Dashboard */}
      <header className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b border-green-700 shadow-lg z-50 flex-shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 xl:w-11 xl:h-11 flex items-center justify-center">
                <img src={logo} alt="SmartSeed Recommender Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-white text-sm sm:text-base xl:text-lg font-bold">SmartSeed Recommender</h1>
                <p className="text-xs xl:text-sm text-emerald-300 hidden sm:block font-medium">Data Explorer</p>
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
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all group bg-purple-50 border border-purple-200"
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
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* County Display & Quick Actions */}
          {selectedCounty && (
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5">Viewing data for</p>
                    <p className="text-lg sm:text-xl font-bold text-green-900">
                      {locationContext.type === 'point' && `Point: ${locationContext.name}`}
                      {locationContext.type === 'area' && `Area: ${locationContext.name}`}
                      {locationContext.type === 'ward' && (selectedWard && selectedWard !== 'All Wards' ? selectedWard : selectedCounty)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600">Last updated: January 1, 2026</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setComparisonMode(!comparisonMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-md ${
                      comparisonMode
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    Compare Data
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all text-sm font-medium shadow-md text-gray-700">
                    <Download className="w-4 h-4" />
                    Export All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Type Selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {dataTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedDataType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedDataType(type.id as any)}
                  className={`group relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? `${type.borderColor} ${type.bgColor} shadow-xl scale-105`
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:scale-102'
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all ${
                      isSelected ? type.iconBg : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${
                        isSelected ? type.iconColor : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <span className={`block text-sm sm:text-base font-bold ${isSelected ? type.textColor : 'text-gray-900'}`}>
                        {type.name}
                      </span>
                      {isSelected && (
                        <span className="block text-xs text-gray-600 mt-1">
                          Active • {type.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              );
            })}</div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 sm:p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Current Period</p>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stats.current}</p>
              <div className="flex items-center gap-1">
                <div className={`text-xs sm:text-sm font-semibold ${stats.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.trend}
                </div>
                <span className="text-xs text-gray-600">vs historical</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-4 sm:p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Historical Average</p>
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stats.average}</p>
              <p className="text-xs sm:text-sm text-gray-600">Last 5 years baseline</p>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-4 sm:p-6 border border-green-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Data Quality</p>
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{stats.quality}</p>
              <p className="text-xs sm:text-sm text-green-600 font-semibold">Excellent coverage</p>
            </div>

            <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg p-4 sm:p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">Data Points</p>
                <Database className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">2,847</p>
              <p className="text-xs sm:text-sm text-gray-600">Measurements collected</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 text-sm sm:text-base font-bold">Time Range Selection</h3>
                  <p className="text-xs text-gray-600">Adjust data visualization period</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
                {(['1m', '3m', '6m', '1y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2.5 rounded-lg transition-all text-xs sm:text-sm font-semibold whitespace-nowrap shadow-md ${
                      timeRange === range
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range === '1m' && '1 Month'}
                    {range === '3m' && '3 Months'}
                    {range === '6m' && '6 Months'}
                    {range === '1y' && '1 Year'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${currentType.iconBg} rounded-lg flex items-center justify-center`}>
                  <currentType.icon className={`w-5 h-5 ${currentType.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-base sm:text-lg">{currentType.name} Analysis</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Historical trends and current measurements</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-300 rounded-lg transition-all text-xs sm:text-sm font-semibold shadow-md">
                <Download className="w-4 h-4" />
                Export Chart
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
              <ResponsiveContainer width="100%" height={350}>
                {selectedDataType === 'rainfall' && (
                  <BarChart data={rainfallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="value" fill="#3b82f6" name="Current Year" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="historical" fill="#94a3b8" name="Historical Avg" radius={[8, 8, 0, 0]} />
                    {comparisonMode && <Bar dataKey="optimal" fill="#10b981" name="Optimal Range" radius={[8, 8, 0, 0]} />}
                  </BarChart>
                )}
                {selectedDataType === 'temperature' && (
                  <AreaChart data={temperatureData}>
                    <defs>
                      <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fdba74" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fdba74" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="max" stroke="#f97316" fillOpacity={1} fill="url(#colorMax)" name="Max Temp" />
                    <Area type="monotone" dataKey="avg" stroke="#fb923c" fillOpacity={1} fill="url(#colorAvg)" name="Avg Temp" />
                    <Area type="monotone" dataKey="min" stroke="#fdba74" fillOpacity={1} fill="url(#colorMin)" name="Min Temp" />
                  </AreaChart>
                )}
                {selectedDataType === 'ndvi' && (
                  <LineChart data={ndviData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis domain={[0, 1]} stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} name="Current NDVI" dot={{ fill: '#22c55e', r: 5 }} />
                    <Line type="monotone" dataKey="optimal" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Optimal Range" dot={{ fill: '#94a3b8', r: 4 }} />
                    {comparisonMode && <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" name="Min Threshold" dot={{ fill: '#ef4444', r: 4 }} />}
                  </LineChart>
                )}
                {selectedDataType === 'soil' && (
                  <RadarChart data={soilData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="parameter" style={{ fontSize: '11px' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: '10px' }} />
                    <Radar name="Current Value" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    <Radar name="Optimal Value" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Crop Performance Chart */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-base">Crop Performance</h4>
                  <p className="text-xs text-gray-600">Yield by variety (tons/ha)</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={cropPerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="yield"
                    >
                      {cropPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weather Patterns */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-base">Weather Patterns</h4>
                  <p className="text-xs text-gray-600">Multi-parameter analysis</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weatherPatternsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="sunshine" stroke="#f59e0b" strokeWidth={2} name="Sunshine (hrs)" dot={{ fill: '#f59e0b', r: 4 }} />
                    <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} name="Humidity (%)" dot={{ fill: '#3b82f6', r: 4 }} />
                    <Line type="monotone" dataKey="windSpeed" stroke="#10b981" strokeWidth={2} name="Wind (km/h)" dot={{ fill: '#10b981', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Insights and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Insights */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 sm:p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-gray-900 font-bold text-base">Key Insights</h4>
              </div>
              <div className="space-y-3">
                {selectedDataType === 'rainfall' && (
                  <>
                    <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Droplets className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-900 font-medium">Rainfall is 8% above historical average - excellent for maize growth</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-900 font-medium">Optimal moisture conditions detected across all monitored zones</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-900 font-medium">Peak rainfall expected in October-November planting window</p>
                      </div>
                    </div>
                  </>
                )}
                {selectedDataType === 'temperature' && (
                  <>
                    <div className="p-3 sm:p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Thermometer className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-orange-900 font-medium">Temperature range ideal for maize germination (18-22°C)</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-900 font-medium">Minimal temperature stress predicted for growing season</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Sun className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-900 font-medium">Cool nights (14-15°C) favor optimal grain development</p>
                      </div>
                    </div>
                  </>
                )}
                {selectedDataType === 'ndvi' && (
                  <>
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Leaf className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-900 font-medium">Vegetation health index 5% above optimal baseline levels</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-emerald-900 font-medium">Strong photosynthetic activity indicates healthy crop growth</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-teal-50 rounded-lg border-l-4 border-teal-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-teal-900 font-medium">Favorable growing conditions maintained throughout season</p>
                      </div>
                    </div>
                  </>
                )}
                {selectedDataType === 'soil' && (
                  <>
                    <div className="p-3 sm:p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-purple-900 font-medium">Soil pH at optimal level (6.5) for maize nutrient uptake</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-900 font-medium">Potassium levels excellent - supports strong root development</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Database className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-900 font-medium">Nitrogen slightly below optimal - consider supplementation</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-4 sm:p-6 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-gray-900 font-bold text-base">Action Recommendations</h4>
              </div>
              <div className="space-y-3">
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-green-500 shadow-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="text-sm text-green-900 font-medium">Proceed with planned planting schedule - all indicators favorable</p>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 shadow-sm">
                  <div className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900 font-medium">Monitor soil moisture levels weekly during germination phase</p>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 shadow-sm">
                  <div className="flex items-start gap-2">
                    <Activity className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-purple-900 font-medium">Apply recommended fertilizer based on soil test results</p>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500 shadow-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-900 font-medium">Schedule next data collection in 2 weeks for trend analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SeedRecommendations from './components/SeedRecommendations';
import DataExplorer from './components/DataExplorer';
import AdminPortal from './components/AdminPortal';

type View = 'landing' | 'dashboard' | 'recommendations' | 'explorer' | 'admin';
type UserRole = 'user' | 'admin' | null;

export interface LocationContext {
  type: 'ward' | 'point' | 'area';
  name: string;
  coordinates: { lat: number; lng: number };
  zoom?: number;
  ward?: string;
  buffer?: string;
  area?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  vertices?: Array<{ lat: number; lng: number }>;
}

// Helper functions for localStorage
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem('smartseed_auth');
    if (stored) {
      const { isAuthenticated, userRole } = JSON.parse(stored);
      return { isAuthenticated, userRole };
    }
  } catch (error) {
    console.error('Error reading auth from localStorage:', error);
  }
  return { isAuthenticated: false, userRole: null };
};

const setStoredAuth = (isAuthenticated: boolean, userRole: UserRole) => {
  try {
    localStorage.setItem('smartseed_auth', JSON.stringify({ isAuthenticated, userRole }));
  } catch (error) {
    console.error('Error saving auth to localStorage:', error);
  }
};

const getStoredView = (): View => {
  try {
    const stored = localStorage.getItem('smartseed_currentView');
    if (stored) {
      return stored as View;
    }
  } catch (error) {
    console.error('Error reading view from localStorage:', error);
  }
  return 'landing';
};

const setStoredView = (view: View) => {
  try {
    localStorage.setItem('smartseed_currentView', view);
  } catch (error) {
    console.error('Error saving view to localStorage:', error);
  }
};

export default function App() {
  // Initialize auth state from localStorage
  const storedAuth = getStoredAuth();
  const [userRole, setUserRole] = useState<UserRole>(storedAuth.userRole);
  const [isAuthenticated, setIsAuthenticated] = useState(storedAuth.isAuthenticated);
  
  // Initialize current view from localStorage
  const [currentView, setCurrentView] = useState<View>(getStoredView());
  const [selectedCounty, setSelectedCounty] = useState<string>('Nandi County');
  const [selectedWard, setSelectedWard] = useState<string>('All Wards');
  
  // Central location context
  const [locationContext, setLocationContext] = useState<LocationContext>({
    type: 'ward',
    name: 'Nandi County',
    coordinates: { lat: 0.1807, lng: 35.4314 },
    zoom: 10,
  });
  
  // Store selected location data for info panel
  const [selectedLocationData, setSelectedLocationData] = useState<any>(null);

  const handleLogin = (role: 'user' | 'admin') => {
    setUserRole(role);
    setIsAuthenticated(true);
    setStoredAuth(true, role);
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    setStoredAuth(false, null);
    setCurrentView('landing');
    setStoredView('landing');
  };

  const handleNavigate = (view: View) => {
    // Protect admin portal - only admins can access
    if (view === 'admin' && userRole !== 'admin') {
      return;
    }
    setCurrentView(view);
    setStoredView(view);
  };

  const handleCountySelect = (county: string) => {
    setSelectedCounty(county);
  };

  const handleWardSelect = (ward: string) => {
    console.log('App.tsx handleWardSelect:', ward);
    setSelectedWard(ward);
    // Location context will be updated by Dashboard when it gets ward coordinates
  };
  
  const handleLocationDataUpdate = (data: any) => {
    console.log('App.tsx handleLocationDataUpdate:', data);
    setSelectedLocationData(data);
  };

  const handleLocationContextChange = (context: LocationContext) => {
    console.log('App.tsx handleLocationContextChange:', context);
    setLocationContext(context);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {currentView === 'landing' && (
        <LandingPage 
          onNavigate={handleNavigate} 
          isAdmin={userRole === 'admin'} 
          locationContext={locationContext}
          selectedCounty={selectedCounty}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'dashboard' && (
        <Dashboard 
          onNavigate={handleNavigate}
          selectedCounty={selectedCounty}
          onCountySelect={handleCountySelect}
          isAdmin={userRole === 'admin'}
          locationContext={locationContext}
          onLocationContextChange={handleLocationContextChange}
          selectedWard={selectedWard}
          onWardSelect={handleWardSelect}
          onLocationDataUpdate={handleLocationDataUpdate}
        />
      )}
      {currentView === 'recommendations' && (
        <div className="h-full overflow-y-auto">
          <SeedRecommendations 
            onNavigate={handleNavigate}
            selectedCounty={selectedCounty}
            isAdmin={userRole === 'admin'}
            locationContext={locationContext}
            selectedWard={selectedWard}
          />
        </div>
      )}
      {currentView === 'explorer' && (
        <DataExplorer 
          onNavigate={handleNavigate}
          selectedCounty={selectedCounty}
          isAdmin={userRole === 'admin'}
          locationContext={locationContext}
          selectedWard={selectedWard}
        />
      )}
      {currentView === 'admin' && userRole === 'admin' && (
        <AdminPortal 
          onNavigate={handleNavigate} 
          locationContext={locationContext}
          selectedCounty={selectedCounty}
        />
      )}
    </div>
  );
}
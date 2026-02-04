import { MapPin, Square, Map as MapIcon, X } from 'lucide-react';

export type SpatialMode = 'point' | 'area' | 'admin' | null;

interface LocationModeSelectorProps {
  activeMode: SpatialMode;
  onModeChange: (mode: SpatialMode) => void;
  currentContext: string | null;
  onClearSelection: () => void;
}

export default function LocationModeSelector({ 
  activeMode, 
  onModeChange, 
  currentContext,
  onClearSelection 
}: LocationModeSelectorProps) {
  const modes = [
    {
      id: 'point' as SpatialMode,
      name: 'Select Point',
      icon: MapPin,
      description: 'Farm location with buffer zone',
      color: 'blue',
    },
    {
      id: 'area' as SpatialMode,
      name: 'Draw Area',
      icon: Square,
      description: 'Custom farm boundary',
      color: 'purple',
    },
    {
      id: 'admin' as SpatialMode,
      name: 'Select Ward/County',
      icon: MapIcon,
      description: 'Administrative boundary',
      color: 'green',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-gray-900 font-bold text-sm mb-1">Location Selection Mode</h3>
        <p className="text-xs text-gray-600">Choose how to define your area of interest</p>
      </div>

      {/* Current Context Display */}
      {currentContext && activeMode && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-xs text-gray-600">Active Context</p>
                <p className="text-sm text-green-900 font-medium">{currentContext}</p>
              </div>
            </div>
            <button
              onClick={onClearSelection}
              className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4 text-green-700" />
            </button>
          </div>
        </div>
      )}

      {/* Mode Selection Buttons */}
      <div className="space-y-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          
          const buttonStyles = isActive
            ? mode.color === 'blue'
              ? 'bg-blue-50 border-blue-500'
              : mode.color === 'purple'
              ? 'bg-purple-50 border-purple-500'
              : 'bg-green-50 border-green-500'
            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50';
          
          const iconBgStyles = isActive
            ? mode.color === 'blue'
              ? 'bg-blue-100'
              : mode.color === 'purple'
              ? 'bg-purple-100'
              : 'bg-green-100'
            : 'bg-gray-100';
          
          const iconStyles = isActive
            ? mode.color === 'blue'
              ? 'text-blue-600'
              : mode.color === 'purple'
              ? 'text-purple-600'
              : 'text-green-600'
            : 'text-gray-600';
          
          const textStyles = isActive
            ? mode.color === 'blue'
              ? 'text-blue-900'
              : mode.color === 'purple'
              ? 'text-purple-900'
              : 'text-green-900'
            : 'text-gray-900';
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(isActive ? null : mode.id)}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${buttonStyles}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgStyles}`}>
                  <Icon className={`w-5 h-5 ${iconStyles}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${textStyles}`}>
                      {mode.name}
                    </span>
                    {isActive && (
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{mode.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      {activeMode && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900 font-medium mb-1">Instructions:</p>
          <p className="text-xs text-blue-800">
            {activeMode === 'point' && 'Click anywhere on the map to select a farm location. A buffer zone will be automatically created.'}
            {activeMode === 'area' && 'Click to start drawing, then click additional points to define your farm boundary. Double-click to finish.'}
            {activeMode === 'admin' && 'Click on a ward or county boundary on the map, or use the county selector in the header.'}
          </p>
        </div>
      )}
    </div>
  );
}
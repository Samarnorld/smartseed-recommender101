import { useEffect, useRef, useState } from 'react';
import { LocationContext } from '../App';
import { ZoomIn, ZoomOut, Maximize2, MapPin, Square, Map as MapIcon, X, Navigation, Satellite } from 'lucide-react';
import { fetchCountyBoundary, fetchWards, parseWardsFromGeoJSON, createWardCentersLookup, type GeoJSONFeature, type GeoJSONFeatureCollection } from '../utils/api';

declare global {
  interface Window {
    L: any;
  }
}

type SpatialMode = 'point' | 'area' | 'draw' | 'admin' | null;


interface MapViewProps {
  selectedCounty: string;
  activeLayers: string[];
  selectedVariety: string;
  onLocationClick: (location: any) => void;
  spatialMode?: SpatialMode;
  onSpatialSelection?: (data: any) => void;
  onSpatialModeChange?: (mode: SpatialMode) => void;
  currentContext?: string | null;
  onClearSelection?: () => void;
  locationContext?: LocationContext;
  sidebarOpen?: boolean;
  mapStyle: 'openstreetmap' | 'satellite';
  onMapStyleChange: (style: 'openstreetmap' | 'satellite') => void;
}

// API data states
export default function MapView({ 
  selectedCounty, 
  activeLayers, 
  selectedVariety, 
  onLocationClick, 
  spatialMode, 
  onSpatialSelection, 
  onSpatialModeChange, 
  currentContext, 
  onClearSelection,
  locationContext,
  sidebarOpen,
  mapStyle,
  onMapStyleChange
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<any>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const drawingLayerRef = useRef<any>(null);
  const bufferLayerRef = useRef<any>(null);
  const previousModeRef = useRef<SpatialMode>(null);
  const tileLayerRef = useRef<any>(null);
  
  // API data states
  const [countyBoundaryData, setCountyBoundaryData] = useState<GeoJSONFeature | GeoJSONFeatureCollection | null>(null);
  const [wardsData, setWardsData] = useState<GeoJSONFeatureCollection | null>(null);
  const [wardCenters, setWardCenters] = useState<{ [key: string]: { lat: number; lng: number } }>({});
  const [isLoadingBoundaries, setIsLoadingBoundaries] = useState(true);

  // Fetch boundaries data on mount
  useEffect(() => {
    const loadBoundariesData = async () => {
      try {
        setIsLoadingBoundaries(true);
        console.log('Fetching boundaries from API...');
        
        const [countyData, wardsGeoJSON] = await Promise.all([
          fetchCountyBoundary(),
          fetchWards()
        ]);
        
        setCountyBoundaryData(countyData);
        setWardsData(wardsGeoJSON);
        
        // Parse wards and create centers lookup
        const parsedWards = parseWardsFromGeoJSON(wardsGeoJSON);
        const centers = createWardCentersLookup(parsedWards);
        setWardCenters(centers);
        
        console.log('Boundaries loaded successfully:', { 
          county: countyData, 
          wards: parsedWards.length,
          centers: Object.keys(centers).length
        });
      } catch (error) {
        console.error('Failed to load boundaries:', error);
        // Keep empty states - the component will use fallback values
      } finally {
        setIsLoadingBoundaries(false);
      }
    };

    loadBoundariesData();
  }, []);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => {
        console.log('Leaflet loaded');
        setMapLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Leaflet');
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && selectedCounty && !mapRef.current && !isLoadingBoundaries) {
      initializeMap();
    }
  }, [mapLoaded, selectedCounty, isLoadingBoundaries, countyBoundaryData]);

  // Re-add ward boundaries when data becomes available
  useEffect(() => {
    if (mapRef.current && wardsData && !isLoadingBoundaries && window.L) {
      const map = mapRef.current;
      const L = window.L;
      
      // Remove old ward layer if it exists
      if (layersRef.current.wards) {
        map.removeLayer(layersRef.current.wards);
        delete layersRef.current.wards;
      }
      
      // Add new ward boundaries
      addWardBoundaries(map, L);
    }
  }, [wardsData, isLoadingBoundaries]);

  useEffect(() => {
    if (mapRef.current && selectedCounty) {
      updateLayers();
    }
  }, [activeLayers]);

  // Invalidate map size when sidebar opens/closes to prevent blurriness
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      // Wait for transition to complete before invalidating size
      const timer = setTimeout(() => {
        mapRef.current.invalidateSize();
        console.log('Map size invalidated after sidebar toggle');
      }, 350); // Slightly longer than the 300ms transition duration

      return () => clearTimeout(timer);
    }
  }, [sidebarOpen, mapLoaded]);

  // Handle map style changes from Sidebar
  useEffect(() => {
    if (!mapRef.current || !window.L || !mapLoaded) return;

    const map = mapRef.current;
    const L = window.L;

    // Remove current tile layer
    map.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer based on mapStyle
    if (mapStyle === 'satellite') {
      tileLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
      }).addTo(map);
      console.log('Switched to Satellite view');
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      console.log('Switched to Street Map view');
    }
  }, [mapStyle, mapLoaded]);

  // Auto-zoom to location context
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !window.L) return;

    const map = mapRef.current;
    const L = window.L;

    // Validate locationContext has required properties
    if (!locationContext || !locationContext.type) return;

    if (locationContext.type === 'point') {
      // Validate coordinates exist
      if (!locationContext.coordinates || 
          typeof locationContext.coordinates.lat !== 'number' || 
          typeof locationContext.coordinates.lng !== 'number') {
        console.warn('Invalid point coordinates:', locationContext.coordinates);
        return;
      }
      
      // Zoom to point
      map.setView(
        [locationContext.coordinates.lat, locationContext.coordinates.lng],
        locationContext.zoom || 15,
        { animate: true, duration: 1 }
      );
      console.log('Zoomed to point:', locationContext.coordinates);
    } else if (locationContext.type === 'area' && locationContext.bounds) {
      // Validate bounds exist
      if (!locationContext.bounds ||
          typeof locationContext.bounds.north !== 'number' ||
          typeof locationContext.bounds.south !== 'number' ||
          typeof locationContext.bounds.east !== 'number' ||
          typeof locationContext.bounds.west !== 'number') {
        console.warn('Invalid area bounds:', locationContext.bounds);
        return;
      }
      
      // Zoom to area bounds
      const bounds = L.latLngBounds(
        [locationContext.bounds.south, locationContext.bounds.west],
        [locationContext.bounds.north, locationContext.bounds.east]
      );
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
      console.log('Zoomed to area bounds:', locationContext.bounds);

      // If we have vertices, draw the polygon
      if ('vertices' in locationContext && Array.isArray(locationContext.vertices)) {
        // Remove previous polygon if exists
        if (drawingLayerRef.current) {
          map.removeLayer(drawingLayerRef.current);
        }

        // Draw the polygon from vertices
        const vertices = locationContext.vertices as Array<{ lat: number; lng: number }>;
        const polygon = L.polygon(
          vertices.map(v => [v.lat, v.lng]),
          {
            color: '#8b5cf6',
            fillColor: '#8b5cf6',
            fillOpacity: 0.3,
            weight: 3,
          }
        ).addTo(map);

        drawingLayerRef.current = polygon;
        console.log('Drew polygon from sidebar vertices:', vertices);
      }
    } else if (locationContext.type === 'ward') {
      // Validate ward name exists
      if (!locationContext.name) {
        console.warn('Invalid ward name:', locationContext.name);
        return;
      }
      
      // Keep existing ward zoom logic
      const ward = locationContext.name;
      const wardCenter = wardCenters[ward] || { lat: 0.1807, lng: 35.1314 };
      map.setView([wardCenter.lat, wardCenter.lng], 12, { animate: true, duration: 1 });
      console.log('Zoomed to ward:', ward);
    }
  }, [locationContext, mapLoaded, wardCenters]);

  // Handle spatial mode changes
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    const map = mapRef.current;
    const L = window.L;

    // Update ward layer interactivity based on spatial mode
    if (layersRef.current.wards) {
      const wardLayer = layersRef.current.wards;
      
      // Disable ward clicks when in point or area mode, enable only when no mode is active
      const shouldBeInteractive = spatialMode === null;
      
      wardLayer.eachLayer((layer: any) => {
        if (shouldBeInteractive) {
          layer.options.interactive = true;
          // Re-enable click events
          layer.on('click', (e: any) => {
            console.log('Ward boundary clicked');
            // The actual click handler is already bound in addWardBoundaries
          });
        } else {
          layer.options.interactive = false;
          // Remove all click events to prevent any interaction
          layer.off('click');
        }
      });
      
      console.log(`Ward boundaries ${shouldBeInteractive ? 'enabled' : 'disabled'} for clicking (spatialMode: ${spatialMode})`);
    }

    // Clear drawings only when currentContext is null (explicit clear action)
    if (currentContext === null && (drawingLayerRef.current || bufferLayerRef.current)) {
      if (drawingLayerRef.current) {
        map.removeLayer(drawingLayerRef.current);
        drawingLayerRef.current = null;
      }
      if (bufferLayerRef.current) {
        map.removeLayer(bufferLayerRef.current);
        bufferLayerRef.current = null;
      }
    }

    // Remove previous click handlers
    map.off('click');
    map.off('dblclick');

    // Reset cursor to default
    const mapContainer = mapContainerRef.current;
    if (mapContainer) {
      mapContainer.style.cursor = '';
    }

    if (spatialMode === 'point') {
      // Set cursor for point selection
      if (mapContainer) {
        mapContainer.style.cursor = 'crosshair';
      }

      // Point selection mode
      map.on('click', (e: any) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Clear previous point
        if (drawingLayerRef.current) {
          map.removeLayer(drawingLayerRef.current);
        }
        if (bufferLayerRef.current) {
          map.removeLayer(bufferLayerRef.current);
        }

        // Add point marker with pin icon
        const pointIcon = L.divIcon({
          className: 'custom-point-marker',
          html: `
            <div style="position: relative; width: 32px; height: 40px;">
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C9.373 0 4 5.373 4 12c0 8.5 12 28 12 28s12-19.5 12-28c0-6.627-5.373-12-12-12z" fill="#3b82f6"/>
                <path d="M16 0C9.373 0 4 5.373 4 12c0 8.5 12 28 12 28s12-19.5 12-28c0-6.627-5.373-12-12-12z" stroke="white" stroke-width="2"/>
                <circle cx="16" cy="12" r="5" fill="white"/>
              </svg>
            </div>
          `,
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([lat, lng], { icon: pointIcon }).addTo(map);
        drawingLayerRef.current = marker;

        // Create buffer zone (500m radius)
        const buffer = L.circle([lat, lng], {
          radius: 500,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
          weight: 2,
        }).addTo(map);
        bufferLayerRef.current = buffer;

        // Generate location data
        const locationData = {
          name: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
          displayName: `Point: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
          suitability: Math.floor(Math.random() * 30) + 65,
          county: selectedCounty,
          coordinates: { lat, lng },
          rainfall: Math.floor(Math.random() * 500) + 800,
          temperature: Math.floor(Math.random() * 5) + 20,
          ndvi: (Math.random() * 0.4 + 0.5).toFixed(2),
          soilType: ['Clay Loam', 'Sandy Loam', 'Silty Clay'][Math.floor(Math.random() * 3)],
          type: 'point',
          buffer: '500m',
        };

        if (onSpatialSelection) {
          onSpatialSelection(locationData);
        }

        // Don't automatically deactivate point mode - keep it active
        // User can click again to select a different point
      });

    } else if (spatialMode === 'area') {
      // Set cursor for area drawing
      if (mapContainer) {
        mapContainer.style.cursor = 'crosshair';
      }

      // Area drawing mode
      const drawnPoints: any[] = [];
      let tempLine: any = null;
      const pointMarkers: any[] = [];

      // Keyboard handler for undoing last point
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          if (drawnPoints.length > 0) {
            // Remove last point
            drawnPoints.pop();
            
            // Remove last marker
            const lastMarker = pointMarkers.pop();
            if (lastMarker) {
              map.removeLayer(lastMarker);
            }
            
            // Redraw temp line
            if (tempLine) {
              map.removeLayer(tempLine);
            }
            if (drawnPoints.length > 1) {
              tempLine = L.polyline(drawnPoints, {
                color: '#8b5cf6',
                weight: 2,
                dashArray: '5, 5',
              }).addTo(map);
            }
            
            console.log(`Removed last point. Remaining points: ${drawnPoints.length}`);
          } else if (e.key === 'Escape') {
            // ESC with no points - exit area mode
            if (onSpatialModeChange) {
              onSpatialModeChange(null);
            }
          }
        }
      };

      // Add keyboard listener
      document.addEventListener('keydown', handleKeyPress);

      map.on('click', (e: any) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        drawnPoints.push([lat, lng]);

        // Add point marker
        const pointIcon = L.divIcon({
          className: 'custom-point-marker',
          html: `
            <div style="width: 12px; height: 12px; background: #8b5cf6; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker([lat, lng], { icon: pointIcon }).addTo(map);
        pointMarkers.push(marker);

        // Draw temporary line
        if (tempLine) {
          map.removeLayer(tempLine);
        }
        if (drawnPoints.length > 1) {
          tempLine = L.polyline(drawnPoints, {
            color: '#8b5cf6',
            weight: 2,
            dashArray: '5, 5',
          }).addTo(map);
        }
      });

      map.on('dblclick', (e: any) => {
        if (drawnPoints.length < 3) {
          alert('Please select at least 3 points to create an area. Press ESC or Backspace to undo points.');
          return;
        }

        // Remove keyboard listener
        document.removeEventListener('keydown', handleKeyPress);

        // Remove temp line and point markers
        if (tempLine) {
          map.removeLayer(tempLine);
        }
        pointMarkers.forEach(marker => map.removeLayer(marker));

        // Create final polygon
        const polygon = L.polygon(drawnPoints, {
          color: '#8b5cf6',
          fillColor: '#8b5cf6',
          fillOpacity: 0.3,
          weight: 2,
        }).addTo(map);

        drawingLayerRef.current = polygon;

        // Calculate center and bounds
        const bounds = polygon.getBounds();
        const center = bounds.getCenter();
        const area = (L.GeometryUtil && L.GeometryUtil.geodesicArea) 
          ? (L.GeometryUtil.geodesicArea(polygon.getLatLngs()[0]) / 10000).toFixed(2)
          : 'N/A';

        // Store vertices for later use
        const vertices = drawnPoints.map(p => ({ lat: p[0], lng: p[1] }));

        // Generate location data with coordinates instead of ward name
        const locationData = {
          name: `${center.lat.toFixed(4)}°N, ${center.lng.toFixed(4)}°E`,
          displayName: `Custom Area: ${center.lat.toFixed(4)}°N, ${center.lng.toFixed(4)}°E`,
          suitability: Math.floor(Math.random() * 30) + 65,
          county: selectedCounty,
          coordinates: { lat: center.lat, lng: center.lng },
          rainfall: Math.floor(Math.random() * 500) + 800,
          temperature: Math.floor(Math.random() * 5) + 20,
          ndvi: (Math.random() * 0.4 + 0.5).toFixed(2),
          soilType: ['Clay Loam', 'Sandy Loam', 'Silty Clay'][Math.floor(Math.random() * 3)],
          type: 'area',
          area: area + ' hectares',
          points: drawnPoints.length,
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
          },
          vertices: vertices
        };

        if (onSpatialSelection) {
          onSpatialSelection(locationData);
        }

        // Reset cursor
        if (mapContainer) {
          mapContainer.style.cursor = '';
        }

        // Reset for next drawing - don't remove the polygon, it stays visible
        map.off('click');
        map.off('dblclick');
      });

      // Cleanup function to remove keyboard listener if mode changes
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    } else if (spatialMode === 'admin') {
      // Set cursor for admin zone selection
      if (mapContainer) {
        mapContainer.style.cursor = 'pointer';
      }
    }
  }, [spatialMode, currentContext, onSpatialSelection, selectedCounty]);

  const initializeMap = () => {
    if (!mapContainerRef.current || mapRef.current || !window.L) {
      console.log('Cannot initialize map:', { 
        hasContainer: !!mapContainerRef.current, 
        hasMap: !!mapRef.current, 
        hasLeaflet: !!window.L 
      });
      return;
    }

    console.log('Initializing map...');
    const L = window.L;
    
    try {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [0.1807, 35.4314], // Nandi County
        zoom: 10,
        zoomControl: false,
      });

      mapRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      console.log('Map tiles added');

      // Add county boundary from API data or fallback to hardcoded
      if (!countyBoundaryData || isLoadingBoundaries) {
          console.error('No county boundary data available — map will load without boundary');
          return;
        }

        const countyLayer = L.geoJSON(countyBoundaryData, {
          style: {
          color: '#166534',   
          weight: 1.2,       
          fillOpacity: 0,     
        },
          onEachFeature: (feature: any, layer: any) => {
            const countyName =
              feature.properties?.name ||
              feature.properties?.NAME ||
              feature.properties?.COUNTY ||
              'Nandi County';

            layer.bindPopup(`<strong>${countyName}</strong><br>County Boundary`);
          }
        }).addTo(map);

        map.fitBounds(countyLayer.getBounds(), {
          padding: [30, 30],
        });

        layersRef.current.boundary = countyLayer;
        console.log('County boundary added and map fitted to bounds');


      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const addWardBoundaries = (map: any, L: any) => {
    console.log('=== addWardBoundaries called ===');
    console.log('wardsData:', wardsData);
    
    if (!wardsData) {
      console.log('No ward data available');
      return;
    }

    try {
      // Debug: Log the first feature to see what properties are available
      if (wardsData.features && wardsData.features.length > 0) {
        console.log('Total wards:', wardsData.features.length);
        console.log('First ward feature:', wardsData.features[0]);
        console.log('First ward feature properties:', wardsData.features[0].properties);
        console.log('All property keys:', Object.keys(wardsData.features[0].properties));
      }

      // Add GeoJSON layer for ward boundaries
      const wardLayer = L.geoJSON(wardsData, {
        style: (feature: any) => {
          return {
            color: '#10b981',
            weight: 1,
            fillColor: '#34d399',
            fillOpacity: 0.2,
            className: 'ward-boundary'
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          // Debug: Log all properties for this feature
          console.log('Ward feature properties:', feature.properties);
          
          // Get ward name - prioritize NAME (uppercase) since that's the correct property
          const wardName = feature.properties?.NAME ||
                          feature.properties?.name || 
                          feature.properties?.WARD_NAME || 
                          feature.properties?.Ward_Name || 
                          feature.properties?.ward_name ||
                          feature.properties?.Name ||
                          feature.properties?.ADM3_EN ||
                          feature.properties?.WARDNAME ||
                          feature.properties?.WardName ||
                          feature.properties?.ward ||
                          feature.properties?.Ward ||
                          'Unknown Ward';
          
          const subCounty = feature.properties?.SUB_COUNTY || 
                           feature.properties?.sub_county || 
                           feature.properties?.SubCounty ||
                           feature.properties?.SUBCOUNTY ||
                           feature.properties?.ADM2_EN ||
                           '';

          console.log('Extracted ward name:', wardName, 'Sub-county:', subCounty);

          // Bind popup with ward information
          layer.bindPopup(`
            <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
              <strong style="color: #1f2937; font-size: 14px;">${wardName}</strong><br>
              ${subCounty ? `<span style="color: #6b7280; font-size: 12px;">${subCounty} Sub-County</span><br>` : ''}
              <span style="color: #10b981; font-size: 12px; font-weight: 600;">Click for detailed analysis</span>
            </div>
          `);

          // Add hover effect
          layer.on('mouseover', function(e: any) {
            const layer = e.target;
            layer.setStyle({
              fillOpacity: 0.5,
              weight: 3,
              color: '#059669'
            });
          });

          layer.on('mouseout', function(e: any) {
            wardLayer.resetStyle(e.target);
          });

          // Click handler to show ward details
          layer.on('click', (e: any) => {
            console.log('Ward clicked:', wardName);
            L.DomEvent.stopPropagation(e);
            
            // Get center of the ward
            const bounds = layer.getBounds();
            const center = bounds.getCenter();
            
            // Generate ward data for the info panel
            onLocationClick({
              name: wardName,
              suitability: Math.floor(Math.random() * 30) + 65, // 65-95 range
              county: selectedCounty,
              subCounty: subCounty,
              coordinates: { lat: center.lat, lng: center.lng },
              rainfall: Math.floor(Math.random() * 500) + 800,
              temperature: Math.floor(Math.random() * 5) + 20,
              ndvi: (Math.random() * 0.4 + 0.5).toFixed(2),
              soilType: ['Clay Loam', 'Sandy Loam', 'Silty Clay'][Math.floor(Math.random() * 3)],
              type: 'ward'
            });
          });
        }
      }).addTo(map);

      layersRef.current.wards = wardLayer;
      console.log('Ward boundaries added from API');
    } catch (error) {
      console.error('Error adding ward boundaries:', error);
    }
  };

  const updateLayers = () => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Toggle suitability zones
    if (layersRef.current.suitability) {
      layersRef.current.suitability.forEach((layer: any) => {
        if (activeLayers.includes('suitability')) {
          if (!map.hasLayer(layer)) {
            map.addLayer(layer);
          }
        } else {
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        }
      });
    }

    // Add/remove overlay layers
    const overlays = ['ndvi', 'rainfall', 'temperature'];
    overlays.forEach((layerName) => {
      if (activeLayers.includes(layerName) && !layersRef.current[layerName]) {
        const L = window.L;
        const colors: any = {
          ndvi: 'rgba(16, 185, 129, 0.15)',
          rainfall: 'rgba(59, 130, 246, 0.15)',
          temperature: 'rgba(249, 115, 22, 0.15)',
        };

        const overlay = L.polygon([
          [0.2500, 35.0500],
          [0.2500, 35.2500],
          [0.1000, 35.3000],
          [-0.0500, 35.2500],
          [-0.1000, 35.1000],
          [0.0500, 35.0000],
          [0.2000, 35.0200],
        ], {
          color: 'transparent',
          fillColor: colors[layerName],
          fillOpacity: 1,
          interactive: false,
        }).addTo(map);

        layersRef.current[layerName] = overlay;
      } else if (!activeLayers.includes(layerName) && layersRef.current[layerName]) {
        map.removeLayer(layersRef.current[layerName]);
        delete layersRef.current[layerName];
      }
    });
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
  if (mapRef.current && layersRef.current.boundary) {
    mapRef.current.fitBounds(layersRef.current.boundary.getBounds(), {
      padding: [30, 30],
    });
  }
};


  return (
    <div className="relative w-full h-full bg-gray-100">
      {selectedCounty ? (
        <>
          <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />

          {/* Loading Overlay - Only show when map itself is loading, not boundaries */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-sm z-[2000]">
              <div className="text-center bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200">
                <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-800 font-semibold text-lg mb-2">
                  Initializing map...
                </p>
                <p className="text-gray-600 text-sm">Please wait</p>
              </div>
            </div>
          )}
          
          {/* Ward Boundaries Loading Indicator - Small, unobtrusive */}
          {mapLoaded && isLoadingBoundaries && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
              <p className="text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                Loading ward boundaries<span className="inline-flex ml-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                </span>
              </p>
            </div>
          )}

          {/* Map Controls - Top Left, below Layers toggle */}
          <div className="absolute top-16 left-2 sm:left-4 flex flex-col gap-2 z-[1000]">
            <button
              onClick={handleZoomIn}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg shadow-md hover:bg-gray-50 flex items-center justify-center border border-gray-200"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg shadow-md hover:bg-gray-50 flex items-center justify-center border border-gray-200"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            <button
              onClick={handleResetView}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg shadow-md hover:bg-gray-50 flex items-center justify-center border border-gray-200"
              title="Reset View"
            >
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            {/* Divider */}
            {onSpatialModeChange && (
              <div className="w-full h-px bg-gray-300 my-1"></div>
            )}

            {/* Location Selection Mode Icons */}
            {onSpatialModeChange && (
              <>
                {/* Point Selection */}
                <button
                  onClick={() => onSpatialModeChange(spatialMode === 'point' ? null : 'point')}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg shadow-md flex items-center justify-center border transition-all ${
                    spatialMode === 'point' 
                      ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                  title="Select Point - Click on map to select farm location"
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Area Drawing */}
                <button
                  onClick={() => onSpatialModeChange(spatialMode === 'area' ? null : 'area')}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg shadow-md flex items-center justify-center border transition-all ${
                    spatialMode === 'area' 
                      ? 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                  title="Draw Area - Draw custom farm boundary"
                >
                  <Square className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Clear Selection Button */}
                {currentContext && spatialMode && onClearSelection && (
                  <button
                    onClick={onClearSelection}
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 flex items-center justify-center border border-red-600 transition-all"
                    title="Clear Selection"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Active Layers Indicator */}
          {activeLayers.length > 0 && (
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-2 rounded-lg shadow-md border border-gray-200 z-[1000] pointer-events-none max-w-[150px] sm:max-w-none">
              <p className="text-xs text-gray-600 mb-1">Active Layers: {activeLayers.length}</p>
              <div className="flex flex-wrap gap-1">
                {activeLayers.map(layer => (
                  <span key={layer} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    {layer}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* No County Selected Message */
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-2">No County Selected</h3>
            <p className="text-gray-600 mb-4">Select a county to view environmental data and seed suitability zones</p>
          </div>
        </div>
      )}
    </div>
  );
}
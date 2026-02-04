// API Configuration and Utilities
import { auth } from "../firebase";

const API_BASE_URL = 'https://smartseed-backend.onrender.com/api';

// Type definitions for GeoJSON
export interface GeoJSONGeometry {
  type: string;
  coordinates: any;
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    name?: string;
    WARD_NAME?: string;
    Ward_Name?: string;
    [key: string]: any;
  };
  geometry: GeoJSONGeometry;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface WardData {
  name: string;
  subCounty?: string;
  population?: number;
  elevation?: string;
  geometry?: GeoJSONGeometry;
  center?: { lat: number; lng: number };
}

/**
 * Get authentication headers for API requests
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const token = await user.getIdToken(true);

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Get headers for public API endpoints (no authentication required)
 */
function getPublicHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

/**
 * Fetch Nandi County boundary
 */
export async function fetchCountyBoundary(): Promise<GeoJSONFeature | GeoJSONFeatureCollection> {
  try {
    const headers = getPublicHeaders();

    const response = await fetch(
      `${API_BASE_URL}/boundaries/counties/nandi`,
      { 
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'omit'
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch county boundary: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('County boundary fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching county boundary:', error);
    throw error;
  }
}

/**
 * Fetch Nandi County wards
 */
export async function fetchWards(): Promise<GeoJSONFeatureCollection> {
  try {
    const headers = getPublicHeaders();
    
    const response = await fetch(
      `${API_BASE_URL}/boundaries/wards?county=nandi`,
      { 
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'omit'
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch wards: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Wards fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
}

/**
 * Calculate center of a GeoJSON polygon
 */
export function calculatePolygonCenter(geometry: GeoJSONGeometry): { lat: number; lng: number } {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    console.warn('Geometry is not a Polygon or MultiPolygon');
    return { lat: 0, lng: 0 };
  }

  let coordinates: number[][][] = [];
  
  if (geometry.type === 'Polygon') {
    coordinates = [geometry.coordinates[0]]; // First ring of the polygon
  } else if (geometry.type === 'MultiPolygon') {
    // For MultiPolygon, use the first polygon's first ring
    coordinates = [geometry.coordinates[0][0]];
  }

  // Calculate centroid
  let latSum = 0;
  let lngSum = 0;
  let pointCount = 0;

  coordinates.forEach(ring => {
    ring.forEach(coord => {
      lngSum += coord[0]; // GeoJSON is [lng, lat]
      latSum += coord[1];
      pointCount++;
    });
  });

  return {
    lat: latSum / pointCount,
    lng: lngSum / pointCount
  };
}

/**
 * Parse wards from GeoJSON and extract useful data
 */
export function parseWardsFromGeoJSON(geoJSON: GeoJSONFeatureCollection): WardData[] {
  if (!geoJSON || !geoJSON.features) {
    console.error('Invalid GeoJSON data');
    return [];
  }

  return geoJSON.features.map(feature => {
    // Try different property names for ward name - prioritize NAME (uppercase)
    const wardName = feature.properties.NAME ||
                     feature.properties.name || 
                     feature.properties.WARD_NAME || 
                     feature.properties.Ward_Name || 
                     feature.properties.ward_name ||
                     feature.properties.Name ||
                     feature.properties.ADM3_EN ||
                     feature.properties.WARDNAME ||
                     feature.properties.WardName ||
                     feature.properties.ward ||
                     feature.properties.Ward ||
                     'Unknown Ward';

    const center = calculatePolygonCenter(feature.geometry);

    return {
      name: wardName,
      subCounty: feature.properties.SUB_COUNTY || 
                 feature.properties.sub_county || 
                 feature.properties.SubCounty ||
                 feature.properties.SUBCOUNTY ||
                 feature.properties.ADM2_EN,
      population: feature.properties.population || feature.properties.POPULATION,
      elevation: feature.properties.elevation || feature.properties.ELEVATION,
      geometry: feature.geometry,
      center: center
    };
  });
}

/**
 * Create a ward centers lookup object from ward data
 */
export function createWardCentersLookup(wards: WardData[]): { [key: string]: { lat: number; lng: number } } {
  const lookup: { [key: string]: { lat: number; lng: number } } = {};
  
  wards.forEach(ward => {
    if (ward.center) {
      lookup[ward.name] = ward.center;
    }
  });

  return lookup;
}
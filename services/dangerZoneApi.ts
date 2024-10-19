import AsyncStorage from '@react-native-async-storage/async-storage';
import { dangerZoneController } from '../apiControllers/dangerZoneController';

export const getNearbyDangerZones = async (lat: number, lon: number, radius: number = 2) => {
  try {
    const storedDangerZoneRange = await AsyncStorage.getItem('dangerZoneRange');
    const effectiveRadius = storedDangerZoneRange ? parseFloat(storedDangerZoneRange) : radius;
    
    const response = await dangerZoneController.getNearbyZones(lat, lon, effectiveRadius);
    
    return response.dangerZones;
  } catch (error) {
    console.error('Error fetching nearby danger zones:', error);
    throw error;
  }
};

export const addDangerZone = async (lat: number, lon: number, description: string) => {
  try {
    const response = await dangerZoneController.addDangerZone(lat, lon, description);
    return response;
  } catch (error) {
    console.error('Error adding danger zone:', error);
    throw error;
  }
};

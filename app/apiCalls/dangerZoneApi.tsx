import { BACKEND_URL } from '../const';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getNearbyDangerZones = async (lat: number, lon: number, radius: number = 2) => {
  try {
    const storedDangerZoneRange = await AsyncStorage.getItem('dangerZoneRange');
    const effectiveRadius = storedDangerZoneRange ? parseFloat(storedDangerZoneRange) : radius;
    const response = await fetch(`${BACKEND_URL}/database/dangerZone/nearby?lat=${lat}&lon=${lon}&radius=${effectiveRadius}`);
    console.log(response.status);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json().then(data => data.dangerZones);
  } catch (error) {
    console.error('Error fetching nearby danger zones:', error);
    throw error;
  }
};

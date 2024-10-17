import { BACKEND_URL } from '../const';

export const getNearbyDangerZones = async (lat: number, lon: number, radius: number = 2) => {
  try {
    const response = await fetch(`${BACKEND_URL}/database/dangerZone/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json().then(data => data.dangerZones);
  } catch (error) {
    console.error('Error fetching nearby danger zones:', error);
    throw error;
  }
};

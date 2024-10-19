import { BACKEND_URL_DANGER_ZONE } from '../app/const';

const API_URL = `${BACKEND_URL_DANGER_ZONE}/database/dangerZone`;

export const dangerZoneController = {
  getNearbyZones: async (lat: number, lon: number, radius: number): Promise<any> => {
    console.log(`Fetching nearby danger zones at (${lat}, ${lon}) within ${radius} km`);
    try {
      const response = await fetch(`${API_URL}/nearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat,
          lon,
          radius
        }),
      });
      if (!response.ok) {
        console.error(`Failed to fetch nearby danger zones. Status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Successfully fetched nearby danger zones`);
      return data;
    } catch (error) {
      console.error('Error in getNearbyZones:', error);
      throw new Error('Failed to fetch nearby danger zones');
    }
  },

  addDangerZone: async (lat: number, lon: number, description: string): Promise<any> => {
    console.log(`Adding new danger zone at (${lat}, ${lon}) with description: ${description}`);
    try {
      const response = await fetch(`${API_URL}/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat,
          lon,
          description,
        }),
      });
      const data = await response.json();
      console.log('Successfully added new danger zone');
      return data;
    } catch (error) {
      console.error('Error in addDangerZone:', error);
      throw new Error('Failed to add danger zone');
    }
  },
};

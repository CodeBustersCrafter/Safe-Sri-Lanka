import { BACKEND_URL } from '../const';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getNearbyFriends = async (userId: number, lat: number, lon: number, radius: number = 50) => {
  try {
    const url = new URL(`${BACKEND_URL}/database/relationship/nearby`);
    url.searchParams.append('userId', userId.toString());
    url.searchParams.append('lat', lat.toString());
    url.searchParams.append('lon', lon.toString());
    
    const storedFriendRange = await AsyncStorage.getItem('friendRange');
    const effectiveRadius = storedFriendRange ? parseFloat(storedFriendRange) : radius;
    url.searchParams.append('radius', effectiveRadius.toString());

    const response = await fetch(url.toString());
    console.log(response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.friends;
  } catch (error) {
    console.error('Error fetching nearby friends:', error);
    throw error;
  }
};

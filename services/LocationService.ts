import * as Location from 'expo-location';
import { sendLocationToServer } from './ApiService';

export const startLocationTracking = async (callback: (location: Location.LocationObject) => void) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  const trackLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        await sendLocationToServer(location);
        callback(location);
      } catch (error) {
        console.error('Error tracking location:', error);
      }
    };

  trackLocation();
};

export const getCurrentLocation = async (): Promise<Location.LocationObject> => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  return await Location.getCurrentPositionAsync({});
};
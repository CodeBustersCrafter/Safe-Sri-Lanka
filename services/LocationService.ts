import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendLocationToServer } from '@/apiControllers/traceController';

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

      let uid: number;
      try {
        uid = parseInt(await AsyncStorage.getItem('uid') || '1', 10);
        if (isNaN(uid)) {
          uid = 1;
          await AsyncStorage.setItem('uid', uid.toString());
        }
      } catch (error) {
        console.error('Error accessing AsyncStorage:', error);
        uid = 1;  // Default to 1 if there's an error
      }

      // Process the location data
      console.log("Location: ", location.coords.latitude, location.coords.longitude, location.timestamp);

      // Prepare the location data
      const locationData = {
        id: uid,
        location: `${location.coords.latitude}_${location.coords.longitude}`,
        timestamp: location.timestamp,
      };

      // Instead of sending to server, we'll just log it
      console.log('Location data prepared:', locationData);

      sendLocationToServer(locationData);

      callback(location);
    } catch (error) {
      console.error('Error tracking location:', error);
      if (error instanceof TypeError && error.message === 'Network request failed') {
        console.log('Network error occurred. Please check your internet connection.');
      } else {
        console.log('An unexpected error occurred:', error);
      }
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
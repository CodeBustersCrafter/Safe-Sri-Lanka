import * as Location from 'expo-location';

export const startLocationTracking = async (callback: (location: Location.LocationObject) => void) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
    },
    callback
  );
};

export const getCurrentLocation = async (): Promise<Location.LocationObject> => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  return await Location.getCurrentPositionAsync({});
};
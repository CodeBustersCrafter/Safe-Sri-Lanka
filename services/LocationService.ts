import * as Location from 'expo-location';

export const startLocationTracking = async (callback: (location: Location.LocationObject) => void) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000*6,
      distanceInterval: 10,
    },
    (location) => {
      sendLocationToBackend(location);
      callback(location);
    }
  );
};
// Function to send location to the backend
const sendLocationToBackend = async (location: Location.LocationObject) => {
  try {
    const response = await fetch('http://localhost:8080/safe_srilanka/database/trace', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        location: location.coords.latitude + "," + location.coords.longitude,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to send location to backend');
    }
  } catch (error) {
    console.error('Error sending location to backend:', error);
  }
};

export const getCurrentLocation = async (): Promise<Location.LocationObject> => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  return await Location.getCurrentPositionAsync({});
};
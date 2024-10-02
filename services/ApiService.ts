import { LocationObject } from 'expo-location';

// This is a placeholder function. Replace the URL with your actual backend URL when it's ready.
const BACKEND_URL = 'https://your-ballerina-backend-url.com/update-location';

export const sendLocationToServer = async (location: LocationObject): Promise<void> => {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: location.timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send location to server');
    }

    console.log('Location sent successfully');
  } catch (error) {
    console.error('Error sending location to server:', error);
    // You might want to implement retry logic or error handling here
  }
};
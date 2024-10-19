import { BACKEND_URL_TRACE } from '../app/const';

export const sendLocationToServer = async (locationData: { id: number, location: string, timestamp: number }): Promise<void> => {
  console.log('Attempting to send location to server:', locationData);
  try {
    console.log('Sending POST request to:', `${BACKEND_URL_TRACE}/database/trace/insert`);
    const response = await fetch(`${BACKEND_URL_TRACE}/database/trace/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "id": locationData.id,
        "location": locationData.location,
        "timestamp": locationData.timestamp
      }),
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      console.error('Server responded with an error. Status:', response.status);
      throw new Error('Failed to send location to server');
    }

    console.log('Location sent successfully');
    const responseData = await response.json();
    console.log('Server response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error sending location to server:', error);
    if (error instanceof TypeError && error.message === 'Network request failed') {
      console.log('Network error occurred. Please check your internet connection.');
    } else {
      console.log('An unexpected error occurred:', error);
    }
    throw error;
  }
};

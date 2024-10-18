import { BACKEND_URL_SOS } from '../const';

export const sendSOSSignal = async (senderId: number, lat: number, lon: number) => {
  try {
    const response = await fetch(`${BACKEND_URL_SOS}/sos/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: Math.round(senderId),
        lat: lat.toString(),
        lon: lon.toString()
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to send SOS signal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending SOS signal:', error);
    throw error;
  }
};


export const getNearbySOSSignals = async (lat: number, lon: number, radius: number = 5) => {
  try {
    const response = await fetch(`${BACKEND_URL_SOS}/sos/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
    if (!response.ok) {
      throw new Error('Failed to fetch nearby SOS signals');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nearby SOS signals:', error);
    throw error;
  }
};

export const generateOTP = async (sosId: number, email: string) => {
  try {
    const response = await fetch(`${BACKEND_URL_SOS}/sos/generateOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sosId, email }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate OTP');
    }
    const data = await response.json();
    return {
      status: data.status,
      message: data.message,
      otp: data.otp // This will now be passed to SOS.tsx
    };
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error;
  }
};

export const deactivateSOS = async (sosId: number, otp: string) => {
  try {
    const response = await fetch(`${BACKEND_URL_SOS}/sos/deactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sosId, otp }),
    });
    if (!response.ok) {
      throw new Error('Failed to deactivate SOS signal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deactivating SOS signal:', error);
    throw error;
  }
};

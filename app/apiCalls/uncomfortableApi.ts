import { BACKEND_URL_UNCOMFORTABLE } from '../const';

export const sendUncomfortableSignal = async (senderId: number, lat: number, lon: number, description: string) => {
  try {
    const response = await fetch(`${BACKEND_URL_UNCOMFORTABLE}/uncomfortable/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: Math.round(senderId),
        lat: lat.toString(),
        lon: lon.toString(),
        description: description
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to send Uncomfortable signal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending Uncomfortable signal:', error);
    throw error;
  }
};


export const getNearbyUncomfortableSignals = async (lat: number, lon: number, radius: number = 5) => {
  try {
    const response = await fetch(`${BACKEND_URL_UNCOMFORTABLE}/uncomfortable/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
    if (!response.ok) {
      throw new Error('Failed to fetch nearby Uncomfortable signals');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching nearby Uncomfortable signals:', error);
    throw error;
  }
};

export const deactivateUncomfortableSignal = async (uncomfortableId: number) => {
  try {
    const response = await fetch(`${BACKEND_URL_UNCOMFORTABLE}/uncomfortable/deactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uncomfortableId }),
    });
    if (!response.ok) {
      throw new Error('Failed to deactivate Uncomfortable signal');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deactivating Uncomfortable signal:', error);
    throw error;
  }
};
// export const generateOTP = async (sosId: number, email: string) => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/uncomfortable/generateOTP`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ sosId, email }),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to generate OTP');
//     }
//     const data = await response.json();
//     return {
//       status: data.status,
//       message: data.message,
//       otp: data.otp // This will now be passed to SOS.tsx
//     };
//   } catch (error) {
//     console.error('Error generating OTP:', error);
//     throw error;
//   }
// };

// export const deactivateSOS = async (sosId: number, otp: string) => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/uncomfortable/deactivate`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ sosId, otp }),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to deactivate SOS signal');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error deactivating SOS signal:', error);
//     throw error;
//   }
// };

import { sendSOSSignal as sendSOSSignalController, getNearbySOSSignals as getNearbySOSSignalsController, generateOTP as generateOTPController, deactivateSOS as deactivateSOSController } from '../apiControllers/sosController';

export const sendSOSSignal = async (senderId: string, lat: number, lon: number, userName: string, locationName: string) => {
  try {
    return await sendSOSSignalController(senderId, lat, lon, userName, locationName);
  } catch (error) {
    console.error('Error sending SOS signal:', error);
    throw error;
  }
};

export const getNearbySOSSignals = async (lat: number, lon: number, radius: number = 5) => {
  try {
    return await getNearbySOSSignalsController(lat, lon, radius);
  } catch (error) {
    console.error('Error fetching nearby SOS signals:', error);
    throw error;
  }
};

export const generateOTP = async (sosId: number, email: string) => {
  try {
    const data = await generateOTPController(sosId, email);
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
    return await deactivateSOSController(sosId, otp);
  } catch (error) {
    console.error('Error deactivating SOS signal:', error);
    throw error;
  }
};

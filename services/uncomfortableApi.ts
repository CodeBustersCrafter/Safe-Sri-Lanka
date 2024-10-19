import { sendUncomfortableSignal as sendUncomfortableSignalController, getNearbyUncomfortableSignals as getNearbyUncomfortableSignalsController, deactivateUncomfortableSignal as deactivateUncomfortableSignalController } from '../apiControllers/sosUncomfortableController';

export const sendUncomfortableSignal = async (senderId: number, lat: number, lon: number, description: string) => {
  try {
    const data = await sendUncomfortableSignalController(senderId, lat, lon, description);
    return data;
  } catch (error) {
    console.error('Error sending Uncomfortable signal:', error);
    throw error;
  }
};

export const getNearbyUncomfortableSignals = async (lat: number, lon: number, radius: number = 5) => {
  try {
    const data = await getNearbyUncomfortableSignalsController(lat, lon, radius);
    return data;
  } catch (error) {
    console.error('Error fetching nearby Uncomfortable signals:', error);
    throw error;
  }
};

export const deactivateUncomfortableSignal = async (uncomfortableId: number) => {
  try {
    const data = await deactivateUncomfortableSignalController(uncomfortableId);
    return data;
  } catch (error) {
    console.error('Error deactivating Uncomfortable signal:', error);
    throw error;
  }
};
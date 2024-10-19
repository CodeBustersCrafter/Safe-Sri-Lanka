import { BACKEND_URL_SOS } from '../app/const';

export const sendSOSSignal = async (senderId: string, lat: number, lon: number, userName: string, locationName: string) => {
  const response = await fetch(`${BACKEND_URL_SOS}/sos/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      senderId: senderId.toString(),
      lat: lat.toString(),
      lon: lon.toString(),
      userName,
      locationName
    }),
  });
  return await response.json();
};

export const getNearbySOSSignals = async (lat: number, lon: number, radius: number = 5) => {
  const response = await fetch(`${BACKEND_URL_SOS}/sos/nearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lat: lat.toString(),
      lon: lon.toString(),
      radius: radius.toString()
    }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const generateOTP = async (sosId: number, email: string) => {
  const response = await fetch(`${BACKEND_URL_SOS}/sos/generateOTP`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sosId, email }),
  });
  return await response.json();
};

export const deactivateSOS = async (sosId: number, otp: string) => {
  const response = await fetch(`${BACKEND_URL_SOS}/sos/deactivate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sosId, otp }),
  });
  return await response.json();
};

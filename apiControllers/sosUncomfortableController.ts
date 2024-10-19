import { BACKEND_URL_UNCOMFORTABLE } from '../app/const';

export const sendUncomfortableSignal = async (senderId: number, lat: number, lon: number, description: string) => {
  const response = await fetch(`${BACKEND_URL_UNCOMFORTABLE}/uncomfortable/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      senderId: senderId.toString(),
      lat: lat.toString(),
      lon: lon.toString(),
      description: description
    }),
  });
  return await response.json();
};

export const getNearbyUncomfortableSignals = async (lat: number, lon: number, radius: number = 5) => {
  const response = await fetch(`${BACKEND_URL_UNCOMFORTABLE}/uncomfortable/nearby`, {
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

export const deactivateUncomfortableSignal = async (uncomfortableId: number) => {
  const response = await fetch(`${BACKEND_URL_UNCOMFORTABLE}/uncomfortable/deactivate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uncomfortableId }),
  });
  return await response.json();
};
import { Linking } from 'react-native';
import { BACKEND_URL } from '../const';

export const handleSOSDeepLink = async (url: string, navigation: any) => {
  const sosId = url.split('sosId=')[1];
  if (sosId) {
    try {
      const response = await fetch(`${BACKEND_URL}/safe_srilanka/sos/details/${sosId}`);
      const data = await response.json();
      if (data.status !== 'error') {
        navigation.navigate('SOSMap', {
          lat: data.lat,
          lon: data.lon,
          senderId: data.sender_id,
          senderName: data.sender_name
        });
      } else {
        console.error('Error fetching SOS details:', data.message);
      }
    } catch (error) {
      console.error('Error handling SOS deep link:', error);
    }
  }
};

export const setupDeepLinking = (navigation: any) => {
  Linking.addEventListener('url', ({ url }) => {
    if (url.includes('sos')) {
      handleSOSDeepLink(url, navigation);
    }
  });
};

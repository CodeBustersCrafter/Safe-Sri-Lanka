import { Alert } from 'react-native';
import { LocationObject } from 'expo-location';
// This is a placeholder function. Replace the URL with your actual backend URL when it's ready.
const BACKEND_URL = 'http://16.170.245.231:8080/safe_srilanka';

// export const sendLocationToServer = async (location: LocationObject): Promise<void> => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/database/trace/insert`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         timestamp: location.timestamp,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to send location to server');
//     }

//     console.log('Location sent successfully');
//   } catch (error) {
//     console.error('Error sending location to server:', error);
//     // You might want to implement retry logic or error handling here
//   }
// };

// New function to update profile
export const updateProfile = async (profileData: {
  id: string;
  name: string;
  mobile: string;
  email: string;
  location: string;
  profileImage: string | null;
}): Promise<void> => {
  try {
    const response = await fetch(`${BACKEND_URL}/profile/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: profileData.id,
        name: profileData.name,
        mobile: profileData.mobile,
        email: profileData.email,
        location: profileData.location,
        profileImage: profileData.profileImage,
      }),
    });

    const data = await response.json();
    if (data.status === 'success') {
      Alert.alert('Success', 'Profile updated successfully.');
    } else {
      Alert.alert('Error', data.error || 'Something went wrong.');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to update profile.');
    console.error('Error updating profile:', error);
  }
};
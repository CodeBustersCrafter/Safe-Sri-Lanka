import { Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This is a placeholder function. Replace the URL with your actual backend URL when it's ready.
const BACKEND_URL = 'http://172.18.128.1:8080/safe_srilanka';

export const sendLocationToServer = async (location: Location.LocationObject): Promise<void> => {
  console.log("Location: ", location.coords.latitude, location.coords.longitude, location.timestamp);
  try {
    // Get uid from local storage, if empty set it to 1
    let uid: number;
    try {
      uid = parseInt(await AsyncStorage.getItem('uid') || '1', 10);
      if (isNaN(uid)) {
        uid = 1;
        await AsyncStorage.setItem('uid', uid.toString());
      }
    } catch (error) {
      console.error('Error accessing AsyncStorage:', error);
      uid = 1;  // Default to 1 if there's an error
    }

    const response = await fetch(`${BACKEND_URL}/database/trace/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: uid,
        location: `${location.coords.latitude}_${location.coords.longitude}`,
        timestamp: location.timestamp,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send location to server');
    }

    console.log('Location sent successfully');
  } catch (error) {
    console.error('Error sending location to server:', error);
    if (error instanceof TypeError && error.message === 'Network request failed') {
      // Handle network errors
      console.log('Network error occurred. Please check your internet connection.');
      // You might want to implement retry logic here
    } else {
      // Handle other types of errors
      console.log('An unexpected error occurred:', error);
    }
    // Rethrow the error to be handled by the caller if needed
    throw error;
  }
};

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
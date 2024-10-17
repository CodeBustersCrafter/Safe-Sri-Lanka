import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../app/const';

const API_URL = `${BACKEND_URL}/database/profile`;

interface UserProfile {
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  location: string;
  profileImage: string;
}

export const fetchUserProfile = async (id: number): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_URL}/getProfile?id=${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (!data.value) {
      throw new Error('Failed to fetch user profile');
    }
    console.log('Fetched user profile:', data.value);
    return {
      name: data.value.name,
      mobile: data.value.mobile,
      whatsapp: data.value.whatsapp,
      email: data.value.email,
      location: data.value.location,
      profileImage: data.value.profileImage
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

export const saveUserProfile = async (profileData: UserProfile): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/addProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to save user profile');
    }
    return data;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('Failed to save user profile');
  }
};

export const updateUserProfile = async (profileData: UserProfile): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to update user profile');
    }
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
};

export const deleteUserProfile = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/remove?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to delete user profile');
    }
    return data;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
};

export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
  try {
    const response = await fetch(`${API_URL}/getProfiles`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all user profiles:', error);
    throw new Error('Failed to fetch all user profiles');
  }
};

// Local storage functions for offline support
export const saveProfileLocally = async (profile: UserProfile): Promise<any> => {
  try {
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile locally:', error);
  }
};

export const getLocalProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileString = await AsyncStorage.getItem('userProfile');
    return profileString ? JSON.parse(profileString) : null;
  } catch (error) {
    console.error('Error getting local profile:', error);
    return null;
  }
};

export const removeLocalProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('userProfile');
  } catch (error) {
    console.error('Error removing local profile:', error);
  }
};
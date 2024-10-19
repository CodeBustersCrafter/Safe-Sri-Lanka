import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileController } from '../apiControllers/profileController';
import { UserProfile } from '../app/const';

export const fetchUserProfile = async (id: string): Promise<UserProfile> => {
  try {
    const data = await profileController.getProfile(parseInt(id));
    console.log(data.profile);
    if (!data.profile) {
      throw new Error('Failed to fetch user profile');
    }
    console.log('Fetched user profile:', data.profile.value);
    console.log('Fetched user profile:', data.profile.value.profileImage);
    return {
      name: data.profile.value.name,
      mobile: data.profile.value.mobile,
      whatsapp: data.profile.value.whatsapp,
      email: data.profile.value.email,
      location: data.profile.value.location,
      profileImage: data.profile.value.profileImage
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

export const saveUserProfile = async (profileData: UserProfile): Promise<any> => {
  try {
    const data = await profileController.addProfile(profileData);
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
    const data = await profileController.updateProfile(profileData);
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
    const data = await profileController.removeProfile(id);
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
    const uid = await AsyncStorage.getItem('uid');
    if (!uid) {
      throw new Error('User ID not found in local storage');
    }
    const data = await profileController.getProfiles(uid);
    if (data.status === 'success') {
      return data.profiles;
    } else {
      throw new Error('Failed to fetch all user profiles');
    }
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


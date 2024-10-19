import AsyncStorage from '@react-native-async-storage/async-storage';
import { relationshipController} from '../apiControllers/relationshipController';

export const getNearbyFriends = async (userId: number, lat: number, lon: number, radius: number = 50) => {
  try {
    const storedFriendRange = await AsyncStorage.getItem('friendRange');
    const effectiveRadius = storedFriendRange ? parseFloat(storedFriendRange) : radius;
    
    const response = await relationshipController.getNearbyFriends(userId, lat, lon, effectiveRadius);
    
    if (!response.ok) {
      throw new Error('Failed to fetch nearby friends');
    }
    
    return response.friends;
  } catch (error) {
    console.error('Error fetching nearby friends:', error);
    throw error;
  }
};

export const getFriendRelationships = async (userId: number) => {
  try {
    const response = await relationshipController.getFriendRelationships(userId);
    if (!response.ok) {
      throw new Error('Failed to fetch friend relationships');
    }
    return response.relationships;
  } catch (error) {
    console.error('Error fetching friend relationships:', error);
    throw error;
  }
};

export const removeFriend = async (userId: number, friendId: number) => {
  try {
    const response = await relationshipController.removeFriend(userId, friendId);
    if (!response.ok) {
      throw new Error('Failed to remove friend');
    }
    console.log(response);
    return response.status;
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

export const addFriend = async (userId: number, friendId: number) => {
  try {
    const response = await relationshipController.addFriend(userId, friendId);
    if (!response.ok) {
      throw new Error('Failed to add friend');
    }
    return response;
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};





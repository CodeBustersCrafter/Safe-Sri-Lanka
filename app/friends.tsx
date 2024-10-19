import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addFriend } from '../services/friendsApi';
import { getAllUserProfiles} from '../services/userService';
import { fetchImage } from '../apiControllers/utileController';
interface UserProfile {
  id: number;
  name: string;
  mobile: string;
  email: string;
  location: string;
  whatsapp: string;
  profileImage: string;
}

export default function FriendsScreen() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [fetchedImages, setFetchedImages] = useState<Map<string, string>>(new Map());
  useEffect(() => {
    fetchProfiles();
    getCurrentUserId();
  }, []);

  const getCurrentUserId = async () => {
    const userId = await AsyncStorage.getItem('uid');
    setCurrentUserId(userId);
    console.log(userId);
  };
  
  const fetchProfiles = async () => {
    try {
      const data = await getAllUserProfiles();
      if (data && Array.isArray(data)) {
        // Filter out the current user's profile
        const filteredData = data.filter((profile) => profile.email.toString() !== currentUserId);
        console.log(filteredData);
        setProfiles(filteredData as UserProfile[]);
        const imageMap = new Map<string, string>();
        await Promise.all(filteredData.map(async (profile) => {
          const image = await fetchImage(profile.profileImage);
          imageMap.set(profile.id.toString(), image);
        }));
        setFetchedImages(imageMap);
      } else {
        console.error('Unexpected data format:', data);
        Alert.alert('Error', 'Failed to load user profiles');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      Alert.alert('Error', 'Failed to load user profiles');
    }
  };

  const handleConnect = async (userId: number) => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please log in to connect with users');
      return;
    }

    Alert.alert('Connect', `Do you want to connect with this user?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Connect',
        onPress: async () => {
          try {
            const result = await addFriend(parseInt(currentUserId), userId);
            if (result.status === 'success') {
              Alert.alert('Success', 'Connection request sent successfully');
            } else {
              throw new Error(result.message || 'Failed to send connection request');
            }
          } catch (error) {
            console.error('Error connecting with user:', error);
            Alert.alert('Error', 'Failed to send connection request');
          }
        },
      },
    ]);
  };

  const renderUserCard = (user: UserProfile) => (
    <View key={user.id} style={styles.card}>
      <Image
        source={fetchedImages.get(user.id.toString()) === "" || fetchedImages.get(user.id.toString()) === null 
          ? require('../assets/images/default-profile-image.png')
          : { uri: `data:image/jpeg;base64,${fetchedImages.get(user.id.toString())}` }}
        style={styles.profileImage}
      />
      <View style={styles.userInfo}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.details}>{user.location}</Text>
        <Text style={styles.details}>{user.email}</Text>
      </View>
      <TouchableOpacity onPress={() => handleConnect(user.id)} style={styles.connectButton}>
        <Ionicons name="add-circle-outline" size={24} color="#4c669f" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Connect with Users</Text>
      {profiles.map(renderUserCard)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  connectButton: {
    padding: 10,
  },
});

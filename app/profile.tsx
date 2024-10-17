// app/profile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ProfilePicture from '../components/ProfilePicture';
import EditableField from '../components/EditableField';
import FriendsCard from '../components/FriendsCard';
import { Ionicons } from '@expo/vector-icons';
import { fetchUserProfile, saveUserProfile, updateUserProfile } from '../services/userService'
import { BACKEND_URL } from './const';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [uid, setUid] = useState<string | null>(null);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  const [showFriends, setShowFriends] = useState(false);

  interface UserProfile {
    id: string;
    name: string;
    location: string;
    email: string;
  }

  useEffect(() => {
    const checkUid = async () => {
      const storedUid = await AsyncStorage.getItem('uid');
      setUid(storedUid);
      if (storedUid) {
        try {
          const userData = await fetchUserProfile(parseInt(storedUid));
          setName(userData.name || '');
          setMobile(userData.mobile || '');
          setWhatsapp(userData.whatsapp || '');
          setEmail(userData.email || '');
          setLocation(userData.location || '');
          setImageUri(userData.profileImage || '');
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to load user data');
          setUid(null);
        }
      }
    };
    checkUid();
  }, []);

  const handleSaveOrUpdate = async () => {
    try {
      const profileData = {
        id: uid,
        name,
        mobile,
        whatsapp,
        email,
        location,
        profileImage: imageUri || '',
      };
      if (uid) {
        await updateUserProfile(profileData);
        Alert.alert('Profile Updated', 'Your profile information has been updated.');
      } else {
        const result = await saveUserProfile(profileData);
        if(result.status === 'success'){
          const newUid = result.id;
          if (newUid !== undefined && newUid !== null) {
            await AsyncStorage.setItem('uid', newUid.toString());
            setUid(newUid.toString());
            Alert.alert('Profile Saved', 'Your profile has been created.');
          } else {
            throw new Error('Invalid UID received from server');
          }
        }
      }
    } catch (error) {
      console.error('Error saving/updating profile:', error);
      Alert.alert('Error', 'Failed to save/update profile');
    }
  };

  const fetchFriends = async () => {
    console.log('Fetching friends for UID:', uid);
    try {
      const response = await fetch(`${BACKEND_URL}/database/relationship/getRelationship?id=${uid}`);
      const data = await response.json();
      console.log('Received friend data:', data);
      if (data && data.relationships && data.relationships.length > 0) {
        console.log('Setting friends:', data.relationships);
        setFriends(data.relationships.map((friend: any) => ({
          id: friend.user2,
          name: friend.name,
          whatsapp: friend.whatsapp,
          mobile: friend.mobile,
          location: friend.location,
          profileImage: friend.profileImage,
          email: friend.email
        })));
      } else {
        console.log('No friends data found in response');
        setFriends([]);
        Alert.alert(
          'No Friends Found',
          'Would you like to add friends from existing users?',
          [
            {
              text: 'Yes',
              onPress: () => navigateToAddFriends(),
            },
            {
              text: 'No',
              style: 'cancel',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      Alert.alert('Error', 'Failed to load friends');
    }
  };

  const navigateToAddFriends = () => {
    console.log('Navigating to add friends screen');
    navigation.navigate('friends' as never);
  };

  const handleFriendsPress = () => {
    console.log('Friends card pressed');
    if (uid) {
      if (showFriends) {
        setShowFriends(false);
      } else {
        fetchFriends();
        setShowFriends(true);
      }
    } else {
      console.log('No UID available, cannot fetch friends');
      Alert.alert('Error', 'Please save your profile before viewing friends');
    }
  };

  const renderAddFriendButton = () => (
    <TouchableOpacity onPress={navigateToAddFriends} style={styles.addFriendButton}>
      <Ionicons name="add-circle-outline" size={24} color="white" />
      <Text style={styles.addFriendText}>Add New Friend</Text>
    </TouchableOpacity>
  );

  const renderFriendCard = (friendId: string, friendName: string, friendLocation: string, friendEmail: string) => {
    console.log('Rendering friend card for ID:', friendId);
    return (
      <View key={friendId} style={styles.card}>
        <Image
          source={{ uri: `${BACKEND_URL}/images/${friendId}` }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{friendName}</Text>
          <Text style={styles.details}>Location: {friendLocation}</Text>
          <Text style={styles.details}>Email: {friendEmail}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDisconnect(friendId)} style={styles.connectButton}>
          <Ionicons name="remove-circle-outline" size={24} color="#4c669f" />
        </TouchableOpacity>
      </View>
    );
  };

  const handleDisconnect = async (friendId: string) => {
    console.log('Attempting to disconnect from friend:', friendId);
    Alert.alert(
      'Confirm Disconnection',
      'Are you sure you want to remove this friend?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/database/relationship/deleteRelationship`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user1: uid, user2: friendId }),  
              });
              const data = await response.json();
              console.log('Disconnection response:', data);
              if (data.status === 'success') {
                setFriends(friends.filter((friend) => friend.id !== friendId));
                Alert.alert('Friend Removed', 'You are no longer connected to this friend.');
              } else {
                throw new Error('Failed to remove friend');
              }
            } catch (error) {
              console.error('Error disconnecting friend:', error);
              Alert.alert('Error', 'Failed to remove friend');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfilePicture
        imageUri={imageUri}
        setImageUri={setImageUri}
      />
      <EditableField
        icon="person-outline"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <EditableField
        icon="call-outline"
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <EditableField
        icon="call-outline"
        placeholder="WhatsApp Number"
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
      />
      <EditableField
        icon="mail-outline"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <EditableField
        icon="location-outline"
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveOrUpdate}>
        <Ionicons name={uid ? "refresh-outline" : "save-outline"} size={24} color="#fff" />
        <Text style={styles.saveButtonText}>{uid ? "Update" : "Save"}</Text>
      </TouchableOpacity>
      <FriendsCard onPress={handleFriendsPress} />
      {showFriends && renderAddFriendButton()}
      {showFriends && friends.map((friend) => renderFriendCard(friend.id, friend.name, friend.location, friend.email))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addFriendButton: {
    flexDirection: 'row',
    backgroundColor: '#4c669f',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  addFriendText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
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
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  connectButton: {
    padding: 5,
  },
  container: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    flexGrow: 1,
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#4c669f',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
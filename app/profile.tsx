// app/profile.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import ProfilePicture from '../components/ProfilePicture';
import EditableField from '../components/EditableField';
import FriendsCard from '../components/FriendsCard';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState<string>('John Doe');
  const [mobile, setMobile] = useState<string>('123-456-7890');
  const [email, setEmail] = useState<string>('johndoe@example.com');
  const [location, setLocation] = useState<string>('New York, USA');

  const handleSave = () => {
    // Here you would typically send the updated profile data to your backend
    Alert.alert('Profile Saved', 'Your profile information has been updated.');
  };

  const handleFriendsPress = () => {
    // Navigate to Friends screen (to be implemented)
    Alert.alert('Friends', 'Navigate to Friends screen.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfilePicture imageUri={imageUri} setImageUri={setImageUri} />
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
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={24} color="#fff" />
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      <FriendsCard onPress={handleFriendsPress} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    flexGrow: 1,
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#4c669f',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
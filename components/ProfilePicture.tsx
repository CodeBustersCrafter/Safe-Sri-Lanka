// components/ProfilePicture.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ProfilePictureProps {
  imageUri: string | null;
  setImageUri: (uri: string) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ imageUri, setImageUri }) => {
  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permissions are required!');
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Send image to server and save it
      try {
        const formData = new FormData();
        formData.append('image', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'profile_picture.jpg',
        } as any);

        const response = await fetch('http://172.18.128.1:8080/safe_srilanka/database/profile/uploadImage', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        if (data.status === 'success') {
          // Save the returned image filename
          const imageUrl = data.filename;
          setImageUri(imageUrl);
        } else {
          throw new Error(data.message || 'Failed to save image on server');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}> 
        {imageUri ? (
          <Image 
            source={{ uri: `http://172.18.128.1:8080/safe_srilanka/images/${imageUri}` }} 
            style={styles.image} 
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={40} color="#aaa" />
          </View>
        )}
        <View style={styles.editIcon}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 5,
  },
});

export default ProfilePicture;
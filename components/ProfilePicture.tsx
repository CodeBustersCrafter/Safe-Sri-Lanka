// components/ProfilePicture.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../apiControllers/utileController';

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
      try {
        const filename = await uploadImage(result.assets[0].uri);
        setImageUri(filename);
        console.log('Image uploaded successfully:', filename);
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
            source={imageUri === "" || imageUri === null 
              ? require('../assets/images/default-profile-image.png')
              : { uri: `data:image/jpeg;base64,${imageUri}` }}
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
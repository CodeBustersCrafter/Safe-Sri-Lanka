import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera'; // Updated import
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router'; // Ensure correct import

export default function SOSScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const router = useRouter(); // Initialize router correctly

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaStatus.status === 'granted');
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        const video = await cameraRef.current.recordAsync({
          maxDuration: 300, // 5 minutes
          quality: Camera.Constants.VideoQuality['480p'], // Ensure correct usage
        });
        if (hasMediaLibraryPermission) {
          const asset = await MediaLibrary.createAssetAsync(video.uri);
          Alert.alert('Recording Saved', 'Your SOS video has been saved.');
          // TODO: Implement sending the video to selected users via backend
        }
        router.back(); // Navigate back using router.back()
      } catch (error) {
        console.error('Recording Error:', error);
        Alert.alert('Recording Error', 'An error occurred while recording.');
      }
    } else {
      Alert.alert('Camera Error', 'Camera is not ready.');
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  if (hasCameraPermission === null || hasMediaLibraryPermission === null) {
    return <View style={styles.loadingContainer}><Text>Loading Permissions...</Text></View>;
  }
  if (hasCameraPermission === false) {
    return <View style={styles.permissionContainer}><Text>No access to camera.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={cameraRef}
        type={CameraType.back} // Correct usage of CameraType
      >
        <View style={styles.buttonContainer}>
          <Button title="Start SOS" onPress={startRecording} />
          <Button title="Stop" onPress={stopRecording} />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});
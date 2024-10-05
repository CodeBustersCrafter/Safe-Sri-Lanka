import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AddRecordingButton from '../../components/AddRecordingButton';
import { getSelectedRecording } from '../../services/AudioService';
import { initiateFakeCall, stopFakeCall } from '../../services/FakeCallService';

export default function FakeCallScreen() {
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    requestPermissions();
    const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    return () => subscription.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSelectedRecording();
    }, [])
  );

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  };

  const loadSelectedRecording = async () => {
    const recording = await getSelectedRecording();
    console.log('Loaded selected recording:', recording);
    setSelectedRecording(recording);
  };

  const handleGetFakeCall = () => {
    if (selectedRecording) {
      initiateFakeCall(selectedRecording);
      setIsCallActive(true);
    } else {
      alert('Please select a recording first');
    }
  };

  const handleStopCall = async () => {
    await stopFakeCall();
    setIsCallActive(false);
  };

  const handleNotificationResponse = (response) => {
    console.log('Notification response received');
    setIsCallActive(true);
  };

  return (
    <LinearGradient
      colors={['#f0f0f0', '#e0e0e0']}
      style={styles.container}
    >
      <Text style={styles.title}>Fake Call Screen</Text>
      <Link href="/RecordingsManager" asChild>
        <AddRecordingButton />
      </Link>
      <View style={styles.spacer} />
      {!isCallActive ? (
        <TouchableOpacity onPress={handleGetFakeCall}>
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.button}
          >
            <Ionicons name="call" size={24} color="white" />
            <Text style={styles.buttonText}>Get Fake Call</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleStopCall}>
          <LinearGradient
            colors={['#ff4b4b', '#ff0000']}
            style={styles.button}
          >
            <Ionicons name="close-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Stop Call</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      {selectedRecording && (
        <View style={styles.recordingCard}>
          <Text style={styles.recordingCardTitle}>Selected Recording:</Text>
          <Text style={styles.selectedRecording}>{selectedRecording.name}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  spacer: {
    height: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  recordingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  selectedRecording: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
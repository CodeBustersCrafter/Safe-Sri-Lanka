import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
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
    <View style={styles.container}>
      <Text style={styles.text}>Fake Call Screen</Text>
      <Link href="/RecordingsManager" asChild>
        <AddRecordingButton />
      </Link>
      <View style={styles.spacer} />
      {!isCallActive ? (
        <Button title="Get Fake Call" onPress={handleGetFakeCall} />
      ) : (
        <Button title="Stop Call" onPress={handleStopCall} color="red" />
      )}
      {selectedRecording && (
        <Text style={styles.selectedRecording}>
          Selected: {selectedRecording.name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  spacer: {
    height: 20
  },
  selectedRecording: {
    marginTop: 10,
    fontStyle: 'italic'
  }
});
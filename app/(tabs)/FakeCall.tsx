import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AddRecordingButton from '../../components/AddRecordingButton';
import { getSelectedRecording } from '../../services/AudioService';
import { initiateFakeCall, stopFakeCall } from '../../services/FakeCallService';
import FakeCallModal from '../../components/FakeCallModal';

export default function FakeCallScreen() {
  const [selectedRecording, setSelectedRecording] = useState<{ uri: string; name: string } | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [callerName, setCallerName] = useState('John Doe');
  const router = useRouter();

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
        alert('Failed to get notification permissions!');
        return;
      }
    } else {
      alert('Must use a physical device for notifications');
    }
  };

  const loadSelectedRecording = async () => {
    const recording = await getSelectedRecording();
    console.log('Loaded selected recording:', recording);
    setSelectedRecording(recording);
  };

  const handleGetFakeCall = async () => {
    if (selectedRecording) {
      const randomName = getRandomCallerName();
      setCallerName(randomName);
      console.log('Initiating fake call...');
      await initiateFakeCall(selectedRecording);
      setIsModalVisible(true);
    } else {
      alert('Please select a recording first');
    }
  };

  const handleAcceptCall = async () => {
    console.log('Call accepted');
    setIsModalVisible(false);
    setIsCallActive(true);
    Alert.alert('Call Answered', 'Playing your recording');
    // The recording playback is handled in FakeCallService
  };

  const handleDeclineCall = () => {
    console.log('Call declined');
    setIsModalVisible(false);
    stopFakeCall();
    Alert.alert('Call Declined', 'You have declined the call.');
  };

  const handleNotificationResponse = (response: any) => {
    console.log('Notification response received');
    setIsCallActive(true);
  };

  const getRandomCallerName = () => {
    const callerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
    return callerNames[Math.floor(Math.random() * callerNames.length)];
  };

  const handleStopCall = async () => {
    await stopFakeCall();
    setIsCallActive(false);
    Alert.alert('Call Ended', 'You have ended the call.');
  };

  // Handler for navigating to RecordingsManager
  const handleAddRecording = () => {
    router.push('/RecordingsManager');
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#80deea']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>Fake Call Simulator</Text>
      
      {/* Add Recording Button */}
      <AddRecordingButton onPress={handleAddRecording} isRecording={false} />

      {/* Simulate Incoming Call Button */}
      <TouchableOpacity style={styles.button} onPress={handleGetFakeCall}>
        <Ionicons name="call-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Get Fake Call</Text>
      </TouchableOpacity>

      {/* Stop Call Button */}
      {isCallActive && (
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStopCall}>
          <Ionicons name="call-sharp" size={24} color="white" />
          <Text style={styles.buttonText}>Stop Call</Text>
        </TouchableOpacity>
      )}

      {/* Selected Recording Display */}
      {selectedRecording && (
        <View style={styles.recordingCard}>
          <Text style={styles.recordingCardTitle}>Selected Recording:</Text>
          <Text style={styles.selectedRecording}>{selectedRecording.name}</Text>
        </View>
      )}

      {/* Fake Call Modal */}
      <FakeCallModal
        isVisible={isModalVisible}
        callerName={callerName}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00796B',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 15,
  },
  stopButton: {
    backgroundColor: '#D32F2F',
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
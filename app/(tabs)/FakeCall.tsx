import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getSelectedRecording,Recording } from '../../services/AudioService';
import { initiateFakeCall, stopFakeCall } from '../../services/FakeCallService';
import FakeCallModal from '../../components/FakeCallModal';
import CallActiveModal from '../../components/CallActiveModal';

export default function FakeCallScreen() {
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [callerName, setCallerName] = useState('John Doe');
  const [callDuration, setCallDuration] = useState(0);
  const router = useRouter();
  const callTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestPermissions();
    const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    return () => {
      subscription.remove();
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      stopFakeCall(); // Ensure stopping fake call on unmount
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSelectedRecording();
    }, [])
  );

  const requestPermissions = async () => {
    // Notification Permissions
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('fake-call', {
        name: 'Fake Call',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  const loadSelectedRecording = async () => {
    const recording = await getSelectedRecording();
    setSelectedRecording(recording);
    if (!recording) {
      Alert.alert('No Ringtone Selected', 'Please select a ringtone in Recordings Manager.');
    }
  };

  const handleGetFakeCall = async () => {
    if (selectedRecording) {
      const randomName = getRandomCallerName();
      setCallerName(randomName);
      console.log('Initiating fake call...');
      await initiateFakeCall(selectedRecording);
      setIsModalVisible(true);
    } else {
      Alert.alert('No Ringtone Selected', 'Please select a ringtone in Recordings Manager.');
    }
  };

  const handleAcceptCall = async () => {
    console.log('Call accepted');
    setIsModalVisible(false);
    setIsCallActive(true);
    Alert.alert('Call Answered', 'Playing your selected ringtone.');

    // Start Call Duration Timer
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const handleDeclineCall = () => {
    console.log('Call declined');
    setIsModalVisible(false);
    stopFakeCall();
    Alert.alert('Call Declined', 'You have declined the call.');
  };

  const handleEndCall = async () => {
    await stopFakeCall();
    setIsCallActive(false);
    setCallDuration(0);
    Alert.alert('Call Ended', 'You have ended the call.');
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
  };

  const handleNotificationResponse = (response: any) => {
    console.log('Notification response received');
    handleAcceptCall();
  };

  const getRandomCallerName = () => {
    const callerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
    return callerNames[Math.floor(Math.random() * callerNames.length)];
  };

  return (
    <LinearGradient colors={['#3A3A3A', '#1F1F1F']} style={styles.container}>
      <Text style={styles.title}>Fake Call Simulator</Text>
      <TouchableOpacity style={styles.callButton} onPress={handleGetFakeCall}>
        <Ionicons name="call-outline" size={48} color="white" />
        <Text style={styles.buttonText}>Start Fake Call</Text>
      </TouchableOpacity>

      <FakeCallModal
        isVisible={isModalVisible}
        callerName={callerName}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />

      <CallActiveModal
        isVisible={isCallActive}
        callDuration={callDuration}
        onEndCall={handleEndCall}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
  },
  callButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
    fontWeight: '600',
  },
});
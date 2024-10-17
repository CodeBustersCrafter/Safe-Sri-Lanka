import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Recording } from '../services/AudioService';

interface FakeCallModalProps {
  isVisible: boolean;
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const FakeCallModal: React.FC<FakeCallModalProps> = ({
  isVisible,
  callerName,
  onAccept,
  onDecline,
}) => {
  const ringtoneRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (isVisible) {
      playRingtone();
    } else {
      stopAndUnloadRingtone();
    }

    return () => {
      stopAndUnloadRingtone();
    };
  }, [isVisible]);

  const playRingtone = async () => {
    try {
      ringtoneRef.current = new Audio.Sound();
      const ringtoneSource = require('../assets/ringtones/default_ringtone.mp3');

      await ringtoneRef.current.loadAsync(ringtoneSource);
      await ringtoneRef.current.setIsLoopingAsync(true);
      await ringtoneRef.current.playAsync();
    } catch (error) {
      console.error('Error playing ringtone:', error);
      Alert.alert('Error', 'Unable to play the ringtone.');
    }
  };

  const stopAndUnloadRingtone = async () => {
    try {
      if (ringtoneRef.current) {
        await ringtoneRef.current.stopAsync();
        await ringtoneRef.current.unloadAsync();
        ringtoneRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping ringtone:', error);
    }
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5} style={styles.modal}>
      <View style={styles.container}>
        <Ionicons name="person-circle-outline" size={64} color="#333" />
        <Text style={styles.callerName}>{callerName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
            <Ionicons name="close-circle" size={50} color="#D32F2F" />
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Ionicons name="call" size={50} color="#4CAF50" />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center', // Center the modal vertically
    alignItems: 'center', // Center the modal horizontally
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
    borderRadius: 20,
    width: '80%', // Adjust width as needed
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  declineButton: {
    alignItems: 'center',
    marginRight: 40,
  },
  acceptButton: {
    alignItems: 'center',
    marginLeft: 40,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default FakeCallModal;
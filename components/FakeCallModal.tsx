import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Recording } from '../services/AudioService';

const { width, height } = Dimensions.get('window');

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
    <Modal isVisible={isVisible} backdropOpacity={1} style={styles.modal}>
      <SafeAreaView style={styles.container}>
        <View style={styles.callerInfo}>
          <Ionicons name="person-circle-outline" size={100} color="#FFF" />
          <Text style={styles.callerName}>{callerName}</Text>
          <Text style={styles.callStatus}>Incoming call</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
            <Ionicons name="call" size={40} color="#FFF" style={styles.rotatedIcon} />
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Ionicons name="call" size={40} color="#FFF" />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  callerInfo: {
    alignItems: 'center',
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
  },
  callStatus: {
    fontSize: 18,
    color: '#ecf0f1',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  declineButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 50,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 16,
  },
  rotatedIcon: {
    transform: [{ rotate: '135deg' }],
  },
});

export default FakeCallModal;
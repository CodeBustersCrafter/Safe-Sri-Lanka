import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  let ringtone: Audio.Sound | undefined;

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isVisible) {
      playRingtone();
    }

    return () => {
      if (ringtone) {
        ringtone
          .stopAsync()
          .then(() => ringtone.unloadAsync())
          .catch((e) => console.log('Error stopping/unloading ringtone:', e));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const playRingtone = async () => {
    ringtone = new Audio.Sound();
    try {
      const ringtoneSource = require('../assets/ringtones/default_ringtone.mp3');

      // Log the ringtone source to verify it's not undefined
      console.log('Ringtone Source:', ringtoneSource);

      await ringtone.loadAsync(ringtoneSource);
      await ringtone.setIsLoopingAsync(true);
      await ringtone.playAsync();
    } catch (error) {
      console.log('Error playing ringtone:', error);
    }
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5} style={styles.modal}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <StatusBar hidden={true} />
        <Ionicons name="call" size={64} color="#4CAF50" />
        <Text style={styles.callerName}>{callerName}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
            <Ionicons name="call-outline" size={32} color="#FF5252" />
            <Text style={styles.buttonText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Ionicons name="call-outline" size={32} color="#4CAF50" />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: 22,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
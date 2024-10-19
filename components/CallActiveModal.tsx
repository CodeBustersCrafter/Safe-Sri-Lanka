import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface CallActiveModalProps {
  isVisible: boolean;
  callDuration: number;
  onEndCall: () => void;
}

const CallActiveModal: React.FC<CallActiveModalProps> = ({
  isVisible,
  callDuration,
  onEndCall,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const toggleMute = () => setIsMuted((prev) => !prev);
  const toggleSpeaker = () => setIsSpeakerOn((prev) => !prev);

  return (
    <Modal isVisible={isVisible} backdropOpacity={1} style={styles.modal}>
      <SafeAreaView style={styles.container}>
        <View style={styles.callerInfo}>
          <Ionicons name="person-circle-outline" size={100} color="#FFF" />
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleMute}>
            <Ionicons name={isMuted ? 'mic-off' : 'mic'} size={30} color="#FFF" />
            <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={toggleSpeaker}>
            <Ionicons name={isSpeakerOn ? 'volume-high' : 'volume-medium'} size={30} color="#FFF" />
            <Text style={styles.buttonText}>{isSpeakerOn ? 'Speaker Off' : 'Speaker On'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
          <Ionicons name="call" size={40} color="#FFF" style={styles.rotatedIcon} />
        </TouchableOpacity>
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
  callDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    alignItems: 'center',
  },
  endCallButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    marginTop: 5,
    fontSize: 14,
  },
  rotatedIcon: {
    transform: [{ rotate: '135deg' }],
  },
});

export default CallActiveModal;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

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

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    // Since this is a fake mute, there's no actual audio handling.
    // In a real scenario, you'd handle audio streams here.
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5} style={styles.modal}>
      <View style={styles.container}>
        <Ionicons name="call" size={64} color="#4CAF50" />
        <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
            <Ionicons
              name={isMuted ? 'mic-off' : 'mic'}
              size={36}
              color={isMuted ? '#D32F2F' : '#4CAF50'}
            />
            <Text style={styles.buttonText}>
              {isMuted ? 'Muted' : 'Mute'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
            <Ionicons name="call-sharp" size={48} color="white" />
            <Text style={styles.buttonText}>End Call</Text>
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
  callDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  muteButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  endCallButton: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
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
});

export default CallActiveModal;
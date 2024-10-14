import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

interface CallActiveModalProps {
  isVisible: boolean;
  callDuration: number;
  onEndCall: () => void;
  onMute: () => void;
  onAddCall: () => void;
}

const CallActiveModal: React.FC<CallActiveModalProps> = ({
  isVisible,
  callDuration,
  onEndCall,
  onMute,
  onAddCall,
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.status}>Call in Progress</Text>
        <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={onMute}>
            <Ionicons name="mic-off-outline" size={32} color="#4CAF50" />
            <Text style={styles.buttonText}>Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onAddCall}>
            <Ionicons name="add-outline" size={32} color="#4CAF50" />
            <Text style={styles.buttonText}>Add Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endCallButton} onPress={onEndCall}>
            <Ionicons name="call-sharp" size={32} color="#fff" />
            <Text style={styles.endCallText}>End Call</Text>
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
    backgroundColor: '#333', // Dark background
    padding: 30,
    alignItems: 'center',
    borderRadius: 20,
    minWidth: '80%',
  },
  status: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  iconButton: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 16,
  },
  endCallButton: {
    alignItems: 'center',
    backgroundColor: '#D32F2F', // Red background for End Call
    padding: 10,
    borderRadius: 50,
  },
  endCallText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 16,
  },
});

export default CallActiveModal;
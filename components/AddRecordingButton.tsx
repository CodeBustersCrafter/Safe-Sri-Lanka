import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AddRecordingButtonProps {
  onPress: () => void;
  isRecording?: boolean;
}

const AddRecordingButton: React.FC<AddRecordingButtonProps> = ({ onPress, isRecording }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>
        {isRecording ? 'Stop Recording' : 'Add Recording'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddRecordingButton;
import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AddRecordingButtonProps {
  onPress: () => void;
  isRecording: boolean;
}

const AddRecordingButton = forwardRef<TouchableOpacity, AddRecordingButtonProps>(
  ({ onPress, isRecording }, ref) => {
    return (
      <TouchableOpacity ref={ref} style={styles.button} onPress={onPress}>
        <Ionicons name={isRecording ? 'stop-circle' : 'mic-circle-outline'} size={24} color="white" />
        <Text style={styles.text}>{isRecording ? 'Stop Recording' : 'Add Recording'}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AddRecordingButton;
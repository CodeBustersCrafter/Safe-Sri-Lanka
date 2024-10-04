import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddRecordingButton = forwardRef<TouchableOpacity, any>((props, ref) => {
  return (
    <TouchableOpacity ref={ref} style={styles.button} {...props}>
      <Text style={styles.text}>Add Recording</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddRecordingButton;
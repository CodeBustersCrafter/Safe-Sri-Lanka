import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function SOSScreen() {
  console.log('SOSScreen Rendered');
  return (
    <View style={styles.container}>
      {/* Emergency Button */}
      <TouchableOpacity style={styles.emergencyButton}>
        <Text style={styles.buttonText}>Emergency</Text>
      </TouchableOpacity>

      {/* Uncomfortable Situation Button */}
      <TouchableOpacity style={styles.uncomfortableButton}>
        <Text style={styles.buttonText}>Uncomfortable Situation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3A3A', // Dark Ash Color
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyButton: {
    width: '90%',
    height: height / 3, // Occupies approximately 33% of the screen height
    backgroundColor: '#FF3B30', // Red Background
    borderColor: '#000', // Black Border
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Space between buttons
  },
  uncomfortableButton: {
    width: '90%',
    height: height / 3, // Occupies approximately 33% of the screen height
    backgroundColor: '#FFD700', // Gold Background
    borderColor: '#000', // Black Border
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black Text for Contrast
    textAlign: 'center',
  },
});
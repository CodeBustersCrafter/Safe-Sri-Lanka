import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../const';
import { LocationObject } from 'expo-location';

const { height } = Dimensions.get('window');

export default function SOSScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const handleEmergencyPress = async () => {
    if (!location) {
      Alert.alert('Error', 'Unable to get your current location');
      return;
    }

    const userId = await AsyncStorage.getItem('uid');
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/sos/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: parseInt(userId),
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        Alert.alert('SOS Sent', 'Your emergency signal has been sent to nearby people and your friends.');
      } else {
        Alert.alert('Error', 'Failed to send SOS signal');
      }
    } catch (error) {
      console.error('Error sending SOS signal:', error);
      Alert.alert('Error', 'Failed to send SOS signal');
    }
  };

  const handleUncomfortablePress = () => {
    // Implement uncomfortable situation handling
    console.log('Uncomfortable Situation Button Pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyPress}>
        <Text style={styles.buttonText}>Emergency</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uncomfortableButton} onPress={handleUncomfortablePress}>
        <Text style={styles.buttonText}>Uncomfortable Situation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3A3A3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyButton: {
    width: '90%',
    height: height / 3,
    backgroundColor: '#FF3B30',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uncomfortableButton: {
    width: '90%',
    height: height / 3,
    backgroundColor: '#FFD700',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});

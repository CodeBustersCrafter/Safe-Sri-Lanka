import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '../const';
import { LocationObject } from 'expo-location';
import { generateOTP, deactivateSOS, sendSOSSignal } from '../apiCalls/sosApi';

const { height } = Dimensions.get('window');

export default function SOSScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [sosId, setSosId] = useState<number | null>(null);
  const [otp, setOtp] = useState(''); 
  const [showOtpInput, setShowOtpInput] = useState(false);

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
    if (isEmergencyActive) {
      // Deactivation process
      const uid = await AsyncStorage.getItem('uid');
      if (!uid) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
      const userProfile = await fetch(`${BACKEND_URL}/database/profile/getProfile?id=${uid}`).then(res => res.json());
      const userEmail = userProfile.value.email;
      if (!userEmail) {
        Alert.alert('Error', 'User email not found');
        return;
      }
      try {
        const otpResponse = await generateOTP(sosId!, userEmail);
        if (otpResponse.status === 'success') {
          Alert.alert('OTP Generated', `Your OTP is: ${otpResponse.otp}`);
        } else {
          Alert.alert('Error', 'Failed to generate OTP');
        }
        setShowOtpInput(true);
      } catch (error) {
        console.error('Error generating OTP:', error);
        Alert.alert('Error', 'Failed to generate OTP');
      }
    } else {
      // Activation process
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
        const response = await sendSOSSignal(Number(userId),location.coords.latitude, location.coords.longitude);
        if (response.status === 'success') {
          setIsEmergencyActive(true);
          setSosId(response.sosId);
          Alert.alert('SOS Activated', 'Your emergency signal has been sent to nearby people and your friends.');
        } else {
          Alert.alert('Error', 'Failed to send SOS signal');
        }
      } catch (error) {
        console.error('Error sending SOS signal:', error);
        Alert.alert('Error', 'Failed to send SOS signal');
      }
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const result = await deactivateSOS(sosId!, otp);
      if (result.status === 'success') {
        setIsEmergencyActive(false);
        setSosId(null);
        setOtp('');
        setShowOtpInput(false);
        Alert.alert('SOS Deactivated', 'Your emergency signal has been deactivated.');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error deactivating SOS:', error);
      Alert.alert('Error', 'Failed to deactivate SOS signal');
    }
  };

  const handleUncomfortablePress = () => {
    // Implement uncomfortable situation handling
    console.log('Uncomfortable Situation Button Pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.emergencyButton, isEmergencyActive && styles.activeEmergencyButton]} 
        onPress={handleEmergencyPress}
      >
        <Text style={styles.buttonText}>
          {isEmergencyActive ? 'Deactivate Emergency' : 'Activate Emergency'}
        </Text>
      </TouchableOpacity>

      {showOtpInput && (
        <View style={styles.otpContainer}>
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.otpSubmitButton} onPress={handleOtpSubmit}>
            <Text style={styles.otpSubmitText}>Submit OTP</Text>
          </TouchableOpacity>
        </View>
      )}

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
  activeEmergencyButton: {
    backgroundColor: '#FF8C00',
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
  otpContainer: {
    width: '90%',
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  otpSubmitButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  otpSubmitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

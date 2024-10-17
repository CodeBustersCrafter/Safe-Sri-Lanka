import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';

const AddDangerZone = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const router = useRouter();

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }
    console.log("Getting current location");
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location.coords);
      console.log("Location obtained:", location.coords);
    } catch (error) {
      console.error("Error getting current position:", error);
      alert("Failed to get current location. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      alert('Please get your current location first.');
      return;
    }

    try {
      const response = await fetch('http://172.18.128.1:8080/safe_srilanka/database/dangerZone/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: location.latitude,
          lon: location.longitude,
          description: description,
        }),
      });

      if (response.ok) {
        alert('Danger zone added successfully!');
        router.back();
      } else {
        throw new Error('Failed to add danger zone');
      }
    } catch (error) {
      console.error('Error adding danger zone:', error);
      alert('Failed to add danger zone. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Danger Zone</Text>
      <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </TouchableOpacity>
      {location && (
        <View style={styles.locationCard}>
          <Text style={styles.locationCardTitle}>Current Location</Text>
          <Text style={styles.locationCardText}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationCardText}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Description (max 250 characters)"
        value={description}
        onChangeText={setDescription}
        maxLength={250}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  locationCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  locationCardText: {
    color: 'black',
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  button: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  locationText: {
    color: 'white',
    marginBottom: 20,
    fontSize: 16,
  },
});

export default AddDangerZone;

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';
import { BACKEND_URL } from './const';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';

const AddDangerZone = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [tempLocation, setTempLocation] = useState<LocationObjectCoords | null>(null);
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

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
      const response = await fetch(`${BACKEND_URL}/database/dangerZone/insert`, {
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

  const openMap = () => {
    setIsMapVisible(true);
  };

  const closeMap = () => {
    setIsMapVisible(false);
    setTempLocation(null);
  };

  const handleMapLongPress = (event: any) => {
    setTempLocation(event.nativeEvent.coordinate);
  };

  const handleConfirmLocation = () => {
    if (tempLocation) {
      setLocation(tempLocation);
      closeMap();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Danger Zone</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>Get Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openMap}>
          <Text style={styles.buttonText}>Select Location on Map</Text>
        </TouchableOpacity>
      </View>
      {location && (
        <View style={styles.locationCard}>
          <Text style={styles.locationCardTitle}>Selected Location</Text>
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
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <Modal isVisible={isMapVisible} onBackdropPress={closeMap}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location?.latitude || 7.8731,
              longitude: location?.longitude || 80.7718,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onLongPress={handleMapLongPress}
          >
            {tempLocation && (
              <Marker
                coordinate={{
                  latitude: tempLocation.latitude,
                  longitude: tempLocation.longitude,
                }}
              />
            )}
          </MapView>
          <View style={styles.mapButtonContainer}>
            <TouchableOpacity style={styles.mapButton} onPress={closeMap}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton} onPress={handleConfirmLocation}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
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
  mapContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  mapButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  mapButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
});

export default AddDangerZone;

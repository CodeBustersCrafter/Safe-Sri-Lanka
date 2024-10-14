import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { startLocationTracking, getCurrentLocation } from '../../services/LocationService';
import { sendLocationToServer } from '../../services/ApiService';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation);
        fetchCity(currentLocation.coords);
      } catch (error) {
        setErrorMsg('Failed to get current location');
        console.error(error);
      }
    })();
  }, []);

  const fetchCity = async (coords: Location.LocationCoords) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(coords);
      if (reverseGeocode.length > 0) {
        const { city } = reverseGeocode[0];
        setCity(city);
      } else {
        setCity('Unknown');
      }
    } catch (error) {
      console.error('Failed to fetch city name:', error);
      setCity('Unknown');
    }
  };

  const startTracking = async () => {
    setIsTracking(true);
    try {
      await startLocationTracking((newLocation) => {
        setLocation(newLocation);
        sendLocationToServer(newLocation);
        fetchCity(newLocation.coords);
      });
    } catch (error) {
      setErrorMsg('Failed to start tracking');
      setIsTracking(false);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
          />
        </MapView>
      )}
      {city && (
        <View style={styles.cityCard}>
          <Ionicons name="location-sharp" size={20} color="black" style={styles.cityIcon} />
          <Text style={styles.cityText}>You are currently in {city}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isTracking && styles.trackingButton]}
          onPress={startTracking}
          disabled={isTracking}
        >
          <Ionicons name={isTracking ? "location" : "location-outline"} size={24} color="white" />
          <Text style={styles.buttonText}>{isTracking ? "Tracking..." : "Track Me"}</Text>
        </TouchableOpacity>
      </View>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  cityCard: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gold',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
    // Simulating double border by adding an outer border and inner content padding
    // Since React Native doesn't support double borders directly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cityIcon: {
    marginRight: 8,
  },
  cityText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.9)', // Semi-transparent green
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  trackingButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)', // Semi-transparent blue
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    color: 'red',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 4,
  },
});
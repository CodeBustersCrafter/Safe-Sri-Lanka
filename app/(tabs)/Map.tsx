import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Alert, Image } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { startLocationTracking, getCurrentLocation } from '../../services/LocationService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getNearbyDangerZones } from '../../services/dangerZoneApi';
import { getNearbyFriends } from '../../services/friendsApi';
import { getNearbySOSSignals } from '../../services/sosApi';
import { getNearbyUncomfortableSignals } from '../../services/uncomfortableApi'; // Add this import

const { width, height } = Dimensions.get('window');

interface DangerZone {
  id: number;
  lat: number;
  lon: number;
  description: string;
  distance: number;
}

interface Friend {
  id: number;
  name: string;
  profileImage: string;
  lat: number;
  lon: number;
  distance: number;
}

interface SOSSignal {
  id: number;
  sender_id: number;
  sender_name: string;
  lat: number;
  lon: number;
  timestamp: string;
  distance: number;
}

interface UncomfortableSignal {
  id: number;
  sender_id: number;
  sender_name: string;
  lat: number;
  lon: number;
  timestamp: string;
  distance: number;
  description: string;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [dangerZones, setDangerZones] = useState<DangerZone[]>([]);
  const [isDangerZoneMode, setIsDangerZoneMode] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isFriendMode, setIsFriendMode] = useState(false);
  const [sosSignals, setSOSSignals] = useState<SOSSignal[]>([]);
  const [uncomfortableSignals, setUncomfortableSignals] = useState<UncomfortableSignal[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation);
        fetchCity(currentLocation);
        fetchDangerZones(currentLocation.coords.latitude, currentLocation.coords.longitude);
        const userId = await AsyncStorage.getItem('uid');
        if (userId) {
          fetchFriends(parseInt(userId), currentLocation.coords.latitude, currentLocation.coords.longitude);
        }
      } catch (error) {
        setErrorMsg('Failed to get current location');
        console.error(error);
      }
    })();
  }, []);

  const fetchCity = async (coords: Location.LocationObject) => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(coords.coords);
      if (reverseGeocode.length > 0) {
        const { city } = reverseGeocode[0];
        setCity(city || 'Unknown');
      } else {
        setCity('Unknown');
      }
    } catch (error) {
      console.error('Failed to fetch city name:', error);
      setCity('Unknown');
    }
  };

  const fetchDangerZones = async (lat: number, lon: number) => {
    try {
      const zones = await getNearbyDangerZones(lat, lon);
      console.log('Fetched danger zones:', zones);
      setDangerZones(zones);
    } catch (error) {
      console.error('Failed to fetch danger zones:', error);
    }
  };

  const fetchFriends = async (userId: number, lat: number, lon: number) => {
    try {
      const nearbyFriends = await getNearbyFriends(userId, lat, lon);
      console.log('Fetched friends:', nearbyFriends);
      setFriends(nearbyFriends);
    } catch (error) {
      console.error('Failed to fetch nearby friends:', error);
    }
  };

  const fetchSOSSignals = async (lat: number, lon: number) => {
    try {
      const signals = await getNearbySOSSignals(lat, lon);
      setSOSSignals(signals);
      console.log('Fetched SOS signals:', signals);
    } catch (error) {
      console.error('Failed to fetch nearby SOS signals:', error);
    }
  };

  const fetchUncomfortableSignals = async (lat: number, lon: number) => {
    try {
      const signals = await getNearbyUncomfortableSignals(lat, lon);
      setUncomfortableSignals(signals);
      console.log('Fetched Uncomfortable signals:', signals);
    } catch (error) {
      console.error('Failed to fetch nearby Uncomfortable signals:', error);
    }
  };

  const updateLocation = useCallback((newLocation: Location.LocationObject) => {
    setLocation(newLocation);
    console.log('Fetching SOS and Uncomfortable signals');
    fetchSOSSignals(newLocation.coords.latitude, newLocation.coords.longitude);
    fetchUncomfortableSignals(newLocation.coords.latitude, newLocation.coords.longitude); 
  
  }, [isTracking]);

  const toggleTracking = useCallback(() => {
    setIsTracking((prevIsTracking) => {
      if (prevIsTracking) {
        console.log("Stopping tracking");
        if (trackingIntervalRef.current) {
          clearInterval(trackingIntervalRef.current);
          trackingIntervalRef.current = null;
        }
        console.log("Tracking stopped");
      } else {
        console.log("Starting tracking");
        startLocationTracking(updateLocation);
        trackingIntervalRef.current = setInterval(() => {
          console.log("Tracking");
          startLocationTracking(updateLocation);
        }, 10000); // for 10 seconds
      }
      return !prevIsTracking;
    });
  }, [updateLocation]);

  const handleToggleTracking = () => {
    AsyncStorage.getItem('uid').then(uid => {
      if (uid) {
        toggleTracking();
      } else {
        Alert.alert('Profile Required', 'Please set up your profile before using tracking functionality.');
      }
    }).catch(error => {
      console.error('Error checking UID:', error);
      Alert.alert('Error', 'Unable to start tracking. Please try again.');
    });
  };

  const toggleDangerZoneMode = () => {
    setIsDangerZoneMode(prevMode => {
      if (!prevMode) {
        // Refresh danger zones data when turning on the mode
        
          if (location) {
            fetchDangerZones(location.coords.latitude, location.coords.longitude);
          }
        
      }
      return !prevMode;
    });
  };

  const toggleFriendMode = () => {
    setIsFriendMode(prevMode => {
      if (!prevMode) {
        // Refresh friends data when turning on the mode
        if (location) {
          AsyncStorage.getItem('uid').then(userId => {
            if (userId) {
              fetchFriends(parseInt(userId), location.coords.latitude, location.coords.longitude);
            }
          });
        }
      }
      return !prevMode;
    });
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
          {isDangerZoneMode && dangerZones.map((zone: DangerZone) => (
            <React.Fragment key={zone.id}>
              <Marker
                coordinate={{
                  latitude: zone.lat,
                  longitude: zone.lon,
                }}
                title="Danger Zone"
                description={`${zone.description} => Distance: ${zone.distance.toFixed(2)} km`}
                pinColor="red"
              />
              <Circle
                center={{
                  latitude: zone.lat,
                  longitude: zone.lon,
                }}
                radius={100}
                fillColor="rgba(255, 0, 0, 0.1)"
                strokeColor="rgba(255, 0, 0, 0.3)"
              />
            </React.Fragment>
          ))}
          {isFriendMode && friends.map((friend: Friend) => (
            <Marker
              key={friend.id}
              coordinate={{
                latitude: friend.lat,
                longitude: friend.lon,
              }}
              title={friend.name}
              description={`Distance: ${friend.distance.toFixed(2)} km`}
            >
              <Image
                source={require('../../assets/images/default-profile-image.png')}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            </Marker>
          ))}
          {isTracking && sosSignals && Array.isArray(sosSignals) && sosSignals.map((signal: SOSSignal) => (
            <Marker
              key={`sos-${signal.id}`}
              coordinate={{
                latitude: signal.lat,
                longitude: signal.lon,
              }}
              title={`SOS: ${signal.sender_name}`}
              description={`Distance: ${signal.distance.toFixed(2)} km, Time: ${new Date(signal.timestamp).toLocaleString()}`}
            >
              <View style={styles.sosMarker}>
                <Ionicons name="warning" size={24} color="red" />
              </View>
            </Marker>
          ))}
          {isTracking && uncomfortableSignals && Array.isArray(uncomfortableSignals) && uncomfortableSignals.map((signal: UncomfortableSignal) => (
            <Marker
              key={`uncomfortable-${signal.id}`}
              coordinate={{
                latitude: signal.lat,
                longitude: signal.lon,
              }}
              title={`Uncomfortable: ${signal.sender_name}`}
              description={`${signal.description} => Distance: ${signal.distance.toFixed(2)} km, Time: ${new Date(signal.timestamp).toLocaleString()}`}
            >
              <View style={styles.uncomfortableMarker}>
                <Ionicons name="alert-circle" size={24} color="orange" />
              </View>
            </Marker>
          ))}
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
          onPress={handleToggleTracking}
        >
          <Ionicons name={isTracking ? "location" : "location-outline"} size={24} color="white" />
          <Text style={styles.buttonText}>{isTracking ? "Stop Tracking" : "Track Me"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, isFriendMode && styles.friendButton]}
          onPress={toggleFriendMode}
        >
          <Ionicons name={isFriendMode ? "people" : "people-outline"} size={24} color="white" />
          <Text style={styles.buttonText}>{isFriendMode ? "Hide Friends" : "Show Friends"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isDangerZoneMode && styles.dangerZoneButton]}
          onPress={toggleDangerZoneMode}
        >
          <Ionicons name={isDangerZoneMode ? "warning" : "warning-outline"} size={24} color="white" />
          <Text style={styles.buttonText}>{isDangerZoneMode ? "Hide Danger Zones" : "Show Danger Zones"}</Text>
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
    bottom: 10,
    alignSelf: 'flex-start',
    left: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
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
    marginBottom: 10,
  },
  trackingButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)', // Semi-transparent blue
  },
  dangerZoneButton: {
    backgroundColor: 'rgba(255, 87, 34, 0.9)', // Semi-transparent orange
  },
  friendButton: {
    backgroundColor: 'rgba(156, 39, 176, 0.9)', // Semi-transparent purple
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
  sosMarker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: 'red',
  },
  uncomfortableMarker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: 'orange',
  },
});

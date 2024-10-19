import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const [friendRange, setFriendRange] = useState('5');
  const [dangerZoneRange, setDangerZoneRange] = useState('10');
  const [isBackendCallEnabled, setIsBackendCallEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedFriendRange = await AsyncStorage.getItem('friendRange');
      const storedDangerZoneRange = await AsyncStorage.getItem('dangerZoneRange');
      if (storedFriendRange) setFriendRange(storedFriendRange);
      if (storedDangerZoneRange) setDangerZoneRange(storedDangerZoneRange);
      const storedBackendCallEnabled = await AsyncStorage.getItem('backendCallEnabled');
      if (storedBackendCallEnabled) setIsBackendCallEnabled(storedBackendCallEnabled === 'true');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleFriendRangeChange = (value: string) => {
    setFriendRange(value);
    saveSettings('friendRange', value);
  };

  const handleDangerZoneRangeChange = (value: string) => {
    setDangerZoneRange(value);
    saveSettings('dangerZoneRange', value);
  };

  const toggleBackendCall = () => {
    const newValue = !isBackendCallEnabled;
    setIsBackendCallEnabled(newValue);
    saveSettings('backendCallEnabled', newValue.toString());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Range Settings</Text>
        
        <View style={styles.rangeContainer}>
          <Text style={styles.rangeTitle}>Friends Range: {friendRange} km</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={friendRange}
            onChangeText={handleFriendRangeChange}
            placeholder="Enter range (1-50)"
          />
        </View>

        <View style={styles.rangeContainer}>
          <Text style={styles.rangeTitle}>Danger Zone Range: {dangerZoneRange} km</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={dangerZoneRange}
            onChangeText={handleDangerZoneRangeChange}
            placeholder="Enter range (1-50)"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Premium SOS Call Settings</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Enable Call & SMS services</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isBackendCallEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleBackendCall}
            value={isBackendCallEnabled}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help</Text>
        <TouchableOpacity style={styles.helpItem}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.helpText}>How to use the app</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpItem}>
          <Ionicons name="warning-outline" size={24} color="#FF9500" />
          <Text style={styles.helpText}>Safety tips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpItem}>
          <Ionicons name="call-outline" size={24} color="#4CD964" />
          <Text style={styles.helpText}>Contact support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontSize: 16,
    color: '#3A3A3C',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1C1C1E',
  },
  rangeContainer: {
    marginBottom: 20,
  },
  rangeTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#3A3A3C',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  helpText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#3A3A3C',
  },
});

export default Settings;

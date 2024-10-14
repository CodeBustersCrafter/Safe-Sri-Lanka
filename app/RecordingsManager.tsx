import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import AddRecordingButton from '../components/AddRecordingButton';
import { startRecording, stopRecording, getRecordings, setSelectedRecording } from '../services/AudioService';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface Recording {
  uri: string;
  name: string;
}

export default function RecordingsManager() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    try {
      const loadedRecordings = await getRecordings();
      setRecordings(loadedRecordings);
    } catch (error) {
      console.log('Error loading recordings:', error);
      Alert.alert('Error', 'Failed to load recordings.');
    }
  };

  const handleStartRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await startRecording();
        setIsRecording(true);
      } else {
        Alert.alert('Permission Denied', 'Audio permissions are required to record.');
      }
    } catch (error) {
      console.log('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
      setIsRecording(false);
      await loadRecordings();
      Alert.alert('Recording Saved', 'Your recording has been saved successfully.');
    } catch (error) {
      console.log('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const handleSelectRecording = async (recording: Recording) => {
    try {
      await setSelectedRecording(recording);
      Alert.alert('Recording Selected', `Selected: ${recording.name}`);
      router.back();
    } catch (error) {
      console.log('Error selecting recording:', error);
      Alert.alert('Error', 'Failed to select recording.');
    }
  };

  const renderItem = ({ item }: { item: Recording }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectRecording(item)}>
      <View style={styles.itemContent}>
        <Ionicons name="mic-circle-outline" size={24} color="#00796B" />
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
      <Ionicons name="play-outline" size={24} color="#00796B" />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#e0f7fa', '#80deea']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>Your Recordings</Text>

      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No recordings available.</Text>}
      />

      <AddRecordingButton
        onPress={isRecording ? handleStopRecording : handleStartRecording}
        isRecording={isRecording}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
  },
});

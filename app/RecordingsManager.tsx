import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { setSelectedRecording, getSelectedRecording, defaultRecordings, Recording } from '../services/AudioService';

export default function RecordingsManager() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecordingState] = useState<Recording | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadRecordings();
  }, []);

  useEffect(() => {
    // Fetch the currently selected recording
    const fetchSelectedRecording = async () => {
      const recording = await getSelectedRecording();
      setSelectedRecordingState(recording);
    };
    fetchSelectedRecording();
  }, []);

  const loadRecordings = () => {
    setRecordings(defaultRecordings);
  };

  const handleSelectRecording = async (recording: Recording) => {
    await setSelectedRecording(recording);
    setSelectedRecordingState(recording);
    Alert.alert('Recording Selected', `You have selected: ${recording.name}`);
  };

  const handlePlayRecording = async (recording: Recording) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recording.uri.toString() },
        { shouldPlay: true }
      );
      // Automatically unload the sound after playback finishes
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing recording:', error);
      Alert.alert('Playback Error', 'Unable to play the selected recording.');
    }
  };

  const renderItem = ({ item }: { item: Recording }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectRecording(item)}>
      <View style={styles.itemContent}>
        <Ionicons name="musical-notes-outline" size={24} color="#333" />
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => handlePlayRecording(item)}>
        <Ionicons name="play-circle-outline" size={30} color="#4CAF50" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Ringtone</Text>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item, index) => `recording-${index}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No recordings available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  list: {
    flexGrow: 1,
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
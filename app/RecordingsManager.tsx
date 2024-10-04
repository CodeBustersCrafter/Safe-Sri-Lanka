import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import AddRecordingButton from '../components/AddRecordingButton';
import { startRecording, stopRecording, getRecordings, setSelectedRecording } from '../services/AudioService';
import { useRouter } from 'expo-router';

export default function RecordingsManager() {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadRecordings();
  }, []);

  const loadRecordings = async () => {
    const loadedRecordings = await getRecordings();
    setRecordings(loadedRecordings);
  };

  const handleStartRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status === 'granted') {
      await startRecording();
      setIsRecording(true);
    }
  };

  const handleStopRecording = async () => {
    await stopRecording();
    setIsRecording(false);
    await loadRecordings();
  };

  const handleSelectRecording = async (recording) => {
    await setSelectedRecording(recording);
    alert(`Selected: ${recording.name}`);
    router.back();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectRecording(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recordings}
        renderItem={renderItem}
        keyExtractor={(item) => item.uri}
        style={styles.list}
      />
      <AddRecordingButton
        onPress={isRecording ? handleStopRecording : handleStartRecording}
        isRecording={isRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    width: '100%',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
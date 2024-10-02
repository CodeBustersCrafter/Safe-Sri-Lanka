import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import RecordingsList from '../components/RecordingsList';
import AddRecordingButton from '../components/AddRecordingButton';
import { startRecording, stopRecording, getRecordings } from '../services/AudioService';


export default function RecordingsManager() {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

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
    const uri = await stopRecording();
    setIsRecording(false);
    if (uri) {
      setRecordings([...recordings, { uri, name: `Recording ${recordings.length + 1}` }]);
    }
  };

  return (
    <View style={styles.container}>
      <RecordingsList recordings={recordings} />
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
});
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECORDINGS_DIRECTORY = `${FileSystem.documentDirectory}recordings/`;
const SELECTED_RECORDING_KEY = 'selectedRecording';

let recording: Audio.Recording | null = null;

// Function to start recording
export const startRecording = async () => {
  try {
    console.log('Requesting permissions..');
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    console.log('Starting recording..');
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recording = newRecording;
    console.log('Recording started');
  } catch (err) {
    console.error('Failed to start recording', err);
  }
};

// Function to stop recording
export const stopRecording = async () => {
  console.log('Stopping recording..');
  if (!recording) {
    console.log('No active recording');
    return null;
  }
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  console.log('Recording stopped and stored at', uri);
  recording = null;
  if (uri) {
    await saveRecording(uri);
    return uri;
  }
  return null;
};

// Function to save the recording to the recordings directory
const saveRecording = async (uri: string) => {
  const fileName = `recording-${Date.now()}.m4a`;
  const newUri = `${RECORDINGS_DIRECTORY}${fileName}`;
  await FileSystem.makeDirectoryAsync(RECORDINGS_DIRECTORY, { intermediates: true });
  await FileSystem.moveAsync({
    from: uri,
    to: newUri,
  });
  console.log('Recording saved to', newUri);
};

// Function to get all recordings
export const getRecordings = async () => {
  console.log('Getting recordings..');
  const directoryInfo = await FileSystem.getInfoAsync(RECORDINGS_DIRECTORY);
  if (!directoryInfo.exists) {
    console.log('Recordings directory does not exist');
    return [];
  }

  const recordings = await FileSystem.readDirectoryAsync(RECORDINGS_DIRECTORY);
  console.log('Found recordings:', recordings);
  return recordings.map((fileName, index) => ({
    uri: `${RECORDINGS_DIRECTORY}${fileName}`,
    name: `Recording ${index + 1}`,
  }));
};

// Function to set the selected recording
export const setSelectedRecording = async (recording: { uri: string; name: string }) => {
  await AsyncStorage.setItem(SELECTED_RECORDING_KEY, JSON.stringify(recording));
  console.log('Selected recording set:', recording);
};

// Function to get the selected recording
export const getSelectedRecording = async () => {
  const selectedRecording = await AsyncStorage.getItem(SELECTED_RECORDING_KEY);
  console.log('Retrieved selected recording:', selectedRecording);
  return selectedRecording ? JSON.parse(selectedRecording) : null;
};
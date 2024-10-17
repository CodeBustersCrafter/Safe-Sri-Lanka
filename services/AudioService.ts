import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing selected recording in AsyncStorage
const SELECTED_RECORDING_KEY = 'selectedRecording';

// Recording interface
export interface Recording {
  uri: number; // number since we're using require for default recordings
  name: string;
  isDefault: boolean;
}

// Define default recordings with MP3 files
export const defaultRecordings: Recording[] = [
  {
    uri: require('../assets/default_recordings/sinhala.mp3'),
    name: 'සිංහල', // Sinhala Translation
    isDefault: true,
  },
  {
    uri: require('../assets/default_recordings/english.mp3'),
    name: 'English',
    isDefault: true,
  },
  {
    uri: require('../assets/default_recordings/tamil.mp3'),
    name: 'தமிழ்', // Tamil Translation
    isDefault: true,
  },
];

// Function to set the selected recording
export const setSelectedRecording = async (recording: Recording) => {
  await AsyncStorage.setItem(SELECTED_RECORDING_KEY, JSON.stringify(recording));
  console.log('Selected recording set:', recording);
};

// Function to get the selected recording
export const getSelectedRecording = async (): Promise<Recording | null> => {
  const selectedRecording = await AsyncStorage.getItem(SELECTED_RECORDING_KEY);
  console.log('Retrieved selected recording:', selectedRecording);
  return selectedRecording ? JSON.parse(selectedRecording) : null;
};
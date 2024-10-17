import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';

// Key for storing selected recording in AsyncStorage
const SELECTED_RECORDING_KEY = 'selectedRecording';

// Recording interface
export interface Recording {
  name: string;
  source: number;
  isDefault: boolean;
}

// Define default recordings with MP3 files
export const defaultRecordings: Recording[] = [
  {
    name: 'සිංහල',
    source: require('../assets/default_recordings/sinhala.mp3'),
    isDefault: true,
  },
  {
    name: 'English',
    source: require('../assets/default_recordings/english.mp3'),
    isDefault: true,
  },
  {
    name: 'Tamil',
    source: require('../assets/default_recordings/tamil.mp3'),
    isDefault: true,
  },
];

// Function to set the selected recording
export const setSelectedRecording = async (recording: Recording) => {
  await AsyncStorage.setItem(SELECTED_RECORDING_KEY, JSON.stringify({
    name: recording.name,
    source: recording.source,
    isDefault: recording.isDefault
  }));
  console.log('Selected recording set:', recording);
};

// Function to get the selected recording
export const getSelectedRecording = async (): Promise<Recording | null> => {
  const selectedRecording = await AsyncStorage.getItem(SELECTED_RECORDING_KEY);
  console.log('Retrieved selected recording:', selectedRecording);
  if (selectedRecording) {
    const parsed = JSON.parse(selectedRecording);
    // Ensure the source is correctly retrieved
    if (typeof parsed.source === 'number') {
      return parsed as Recording;
    } else {
      // If source is not a number, find the matching recording from defaultRecordings
      return defaultRecordings.find(r => r.name === parsed.name) || null;
    }
  }
  return null;
};

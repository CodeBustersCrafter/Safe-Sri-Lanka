import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the recordings directory (no longer needed since we are removing user recordings)
const SELECTED_RECORDING_KEY = 'selectedRecording';

// Define default recordings with MP3 files
export const defaultRecordings = [
  {
    uri: require('../assets/default_recordings/sinhala.mp3'),
    name: 'සිංහල සුබ දවසක්!',
    isDefault: true,
  },
  {
    uri: require('../assets/default_recordings/english.mp3'),
    name: 'Good Day!',
    isDefault: true,
  },
  {
    uri: require('../assets/default_recordings/tamil.mp3'),
    name: 'நண்பர்களே, இன்று நல்ல நாள்!',
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

// Recording interface
export interface Recording {
  uri: string | number; // number for default recordings (require)
  name: string;
  isDefault: boolean;
}
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
    name: 'Sinhala',
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
  try {
    await AsyncStorage.setItem(SELECTED_RECORDING_KEY, JSON.stringify(recording));
    console.log('Selected recording set:', recording);
  } catch (error) {
    console.error('Error setting selected recording:', error);
    throw error;
  }
};

// Function to get the selected recording
export const getSelectedRecording = async (): Promise<Recording | null> => {
  try {
    const selectedRecording = await AsyncStorage.getItem(SELECTED_RECORDING_KEY);
    console.log('Retrieved selected recording:', selectedRecording);
    return selectedRecording ? JSON.parse(selectedRecording) : null;
  } catch (error) {
    console.error('Error getting selected recording:', error);
    return null;
  }
};

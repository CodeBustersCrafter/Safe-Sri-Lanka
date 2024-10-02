import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

let recording: Audio.Recording | null = null;

export const startRecording = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recording = newRecording;
  } catch (err) {
    console.error('Failed to start recording', err);
  }
};

export const stopRecording = async () => {
  if (!recording) {
    return null;
  }
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    recording = null;
    return uri;
  } catch (err) {
    console.error('Failed to stop recording', err);
  }
};

export const getRecordings = async () => {
  const recordingsDirectory = `${FileSystem.documentDirectory}recordings/`;
  const directoryInfo = await FileSystem.getInfoAsync(recordingsDirectory);
  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(recordingsDirectory);
    return [];
  }

  const recordings = await FileSystem.readDirectoryAsync(recordingsDirectory);
  return recordings.map((fileName, index) => ({
    uri: `${recordingsDirectory}${fileName}`,
    name: `Recording ${index + 1}`,
  }));
};
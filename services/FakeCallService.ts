import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { Recording, getSelectedRecording } from './AudioService';

let sound: Audio.Sound | null = null;

export const playRecording = async () => {
  try {
    const recording = await getSelectedRecording();
    if (!recording) {
      throw new Error('No recording selected');
    }
    console.log('Attempting to play recording:', recording);
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(recording.source);
    sound = newSound;
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
    console.log('Recording playback started');
  } catch (error) {
    console.error('Error playing recording:', error);
    Alert.alert('Playback Error', 'Unable to play the selected recording.');
  }
};

export const stopFakeCall = async () => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
    await Notifications.dismissAllNotificationsAsync();
    console.log('Fake call stopped');
  } catch (error) {
    console.error('Error stopping fake call:', error);
  }
};

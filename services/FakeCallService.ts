import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import { Recording } from './AudioService';
import { Asset } from 'expo-asset';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

// Define background task
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  if (error) {
    console.error('Error in background notification task:', error);
    return;
  }
  console.log('Received a notification in the background!', data);
});

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false, // We'll handle sound manually
    shouldSetBadge: false,
  }),
});

let sound: Audio.Sound | null = null;

// Function to play the selected recording
export const playRecording = async (recording: Recording) => {
  try {
    console.log(`Attempting to play recording: ${recording.name}`);
    console.log('Recording source:', recording.source);
    
    if (!recording.source) {
      throw new Error('Recording source is undefined');
    }

    if (sound) {
      console.log('Unloading existing sound.');
      await sound.unloadAsync();
      sound = null;
    }
    
    // Load the asset
    console.log('Loading asset...');
    const asset = Asset.fromModule(recording.source);
    console.log('Asset created:', asset);
    await asset.downloadAsync();
    console.log('Asset downloaded');
    
    console.log('Creating new Audio.Sound...');
    sound = new Audio.Sound();
    console.log('Loading sound...');
    await sound.loadAsync(asset);
    console.log('Sound loaded successfully.');
    await sound.setIsLoopingAsync(true);
    console.log('Looping set. Starting playback...');
    await sound.playAsync();
    console.log('Playback started.');
  } catch (error) {
    console.error('Error playing recording:', error);
    Alert.alert('Playback Error', 'Unable to play the selected recording.');
  }
};

// Function to stop the fake call (stop playback and dismiss notifications)
export const stopFakeCall = async () => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
    await Notifications.dismissAllNotificationsAsync();
    console.log('Fake call stopped.');
  } catch (error) {
    console.error('Error stopping fake call:', error);
  }
};

// Listen to notification response to handle answer
Notifications.addNotificationResponseReceivedListener((response) => {
  const recording: Recording = response.notification.request.content.data.recording;
  console.log('Handling notification response, playing recording:', recording);
  playRecording(recording)
    .then(() => {
      Alert.alert('Call Accepted', `Playing "${recording.name}"`);
    })
    .catch((error) => {
      console.error('Error handling call acceptance:', error);
    });
});

// Register the background task
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

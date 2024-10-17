import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import { Recording } from './AudioService';

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
export async function playRecording(recording: Recording) {
  try {
    if (recording.isDefault) {
      // For default recordings, use the required asset
      const { sound: newSound } = await Audio.Sound.createAsync(
        recording.uri,
        { shouldPlay: true }
      );
      sound = newSound;
      // Set looping to true for continuous playback during the call
      await sound.setIsLoopingAsync(true);
    } else {
      // No user recordings; this block should never be called
      console.warn('User recordings are not supported.');
    }

    if (Platform.OS === 'android') {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playsInSilentModeIOS: true,
      });
    }
  } catch (error) {
    console.error('Error playing recording:', error);
  }
}

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
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
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
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
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
    } else {
      // No user recordings; this block can be removed
      console.warn('User recordings are not supported.');
    }
  } catch (error) {
    console.error('Error playing recording:', error);
  }
}

// Function to initiate a fake call
export const initiateFakeCall = async (recording: Recording) => {
  console.log('Initiating fake call with recording:', recording);

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('fake-call', {
      name: 'Fake Call',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Incoming Call',
      body: 'Tap to answer',
      data: { recording },
      sound: 'default_ringtone.mp3', // Ensure this sound file is correctly placed and is MP3
      priority: Notifications.AndroidNotificationPriority.MAX,
      vibrate: [0, 250, 250, 250],
    },
    trigger: { seconds: 1 }, // Trigger immediately
  });

  console.log('Scheduled notification with ID:', notificationId);

  if (Platform.OS === 'android') {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playsInSilentModeIOS: true,
      playsThroughSilentSwitch: true,
    });
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
  playRecording(recording);
});

// Register the background task
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
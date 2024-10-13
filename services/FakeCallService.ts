import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  if (error) {
    console.error('Error in background notification task:', error);
    return;
  }
  console.log('Received a notification in the background!', data);
});

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
async function playAudio(recording) {
  try {
    console.log('Creating sound object...');
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: recording.uri },
      { shouldPlay: true }
    );
    sound = newSound;
    console.log('Sound object created, playing...');
    await sound.playAsync();
    console.log('Fake call audio started');
  } catch (error) {
    console.error('Error playing fake call audio:', error);
  }
}

// Function to initiate a fake call
export const initiateFakeCall = async (recording) => {
  console.log('Initiating fake call...', recording);

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
      sound: 'default_ringtone.mp3', // Ensure this sound file is correctly placed
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
    });
  }
};

// Function to stop the fake call
export const stopFakeCall = async () => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
  await Notifications.dismissAllNotificationsAsync();
};

// Listen to notification response to handle answer
Notifications.addNotificationResponseReceivedListener((response) => {
  const recording = response.notification.request.content.data.recording;
  console.log('Handling notification response, playing recording:', recording);
  playAudio(recording);
});

// Register the background task
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Received a notification in the background!');
  // You can add custom logic here for background notification handling
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

let sound = null;

async function playAudio(recording) {
  try {
    console.log('Creating sound object...');
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: recording.uri },
      { shouldPlay: true, isLooping: true }
    );
    sound = newSound;
    console.log('Sound object created, playing...');
    await sound.playAsync();
    console.log('Fake call audio started');
  } catch (error) {
    console.error('Error playing fake call audio:', error);
  }
}

export const initiateFakeCall = async (recording) => {
  console.log('Initiating fake call in 5 seconds...', recording);

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
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250],
    },
    trigger: { seconds: 5 },
  });

  console.log('Scheduled notification with ID:', notificationId);

  if (Platform.OS === 'android') {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  }

  setTimeout(() => {
    console.log('Timeout reached, playing audio...');
    playAudio(recording);
  }, 5000);
};

export const stopFakeCall = async () => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
  await Notifications.dismissAllNotificationsAsync();
};

Notifications.addNotificationResponseReceivedListener((response) => {
  const recording = response.notification.request.content.data.recording;
  playAudio(recording);
});

// Register the background task
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
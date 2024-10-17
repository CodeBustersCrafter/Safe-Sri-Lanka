import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import TopBar from '../components/TopBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          header: () => <TopBar />,
          contentStyle: { backgroundColor: 'black' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="RecordingsManager"
          options={{
            title: 'Recordings',
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            title: 'Notifications',
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen
          name="friends"
          options={{
            title: 'Friends',
          }}
        />
        <Stack.Screen
          name="dangerZones"
          options={{
            title: 'Danger Zones',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
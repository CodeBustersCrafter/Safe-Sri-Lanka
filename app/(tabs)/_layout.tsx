import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, Text, StyleSheet } from 'react-native';

export default function TabsLayout() {
  const colorSchemeMode = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorSchemeMode === 'dark' ? '#fff' : '#000',
        tabBarInactiveTintColor: colorSchemeMode === 'dark' ? '#888' : '#666',
        tabBarStyle: { backgroundColor: colorSchemeMode === 'dark' ? '#000' : '#fff' },
        headerShown: false,
        headerStyle: { backgroundColor: colorSchemeMode === 'dark' ? '#000' : '#fff' },
        headerTintColor: colorSchemeMode === 'dark' ? '#fff' : '#000',
      }}
    >
      {/* Map Tab */}
      <Tabs.Screen
        name="Map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.emoji, focused && styles.activeEmoji]}>
              {focused ? '🌍' : '🗺️'}
            </Text>
          ),
        }}
      />

      {/* Helpline Tab */}
      <Tabs.Screen
        name="Helpline"
        options={{
          title: 'Helpline',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.emoji, focused && styles.activeEmoji]}>
              {focused ? '☎️' : '📞'}
            </Text>
          ),
        }}
      />
      
      {/* SOS Tab */}
      <Tabs.Screen
        name="SOS"
        options={{
          title: 'SOS',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.emoji, focused && styles.activeEmoji, styles.sosEmoji]}>
              🆘
            </Text>
          ),
        }}
      />
      
      {/* Fake Call Tab */}
      <Tabs.Screen
        name="FakeCall"
        options={{
          title: 'Fake Call',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.emoji, focused && styles.activeEmoji]}>
              {focused ? '📱' : '🚫📞'}
            </Text>
          ),
        }}
      />

      {/* AI Assistant Tab */}
      <Tabs.Screen
        name="AI_Assistant"
        options={{
          title: 'AI Assistant',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.emoji, focused && styles.activeEmoji]}>
              {focused ? '🤖' : '💬'}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 24,
  },
  activeEmoji: {
    fontSize: 28,
  },
  sosEmoji: {
    fontWeight: 'bold',
  },
});
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const getTabBarIcon = (name: string, color: string) => {
    return ({ focused, size }: { focused: boolean; size: number }) => (
      <Ionicons 
        name={focused ? name : `${name}-outline`} 
        size={size} 
        color={focused ? color : (isDarkMode ? '#888' : '#8E8E93')} 
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#fff' : '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#888' : '#8E8E93',
        tabBarStyle: { 
          backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7',
          borderTopColor: isDarkMode ? '#38383A' : '#C6C6C8',
        },
        headerShown: false,
        headerStyle: { backgroundColor: isDarkMode ? '#000' : '#fff' },
        headerTintColor: isDarkMode ? '#fff' : '#000',
      }}
    >
      {/* Map Tab */}
      <Tabs.Screen
        name="Map"
        options={{
          title: 'Map',
          tabBarIcon: getTabBarIcon('map', '#4CAF50'), // Green
        }}
      />

      {/* Helpline Tab */}
      <Tabs.Screen
        name="Helpline"
        options={{
          title: 'Helpline',
          tabBarIcon: getTabBarIcon('call', '#2196F3'), // Blue
        }}
      />
      
      {/* SOS Tab */}
      <Tabs.Screen
        name="SOS"
        options={{
          title: 'SOS',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24, color: focused ? '#FF9800' : (isDarkMode ? '#888' : '#8E8E93') }}>
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
          tabBarIcon: getTabBarIcon('phone-portrait', '#E91E63'), // Pink
        }}
      />

      {/* AI Assistant Tab */}
      <Tabs.Screen
        name="AI_Assistant"
        options={{
          title: 'AI Assistant',
          tabBarIcon: getTabBarIcon('chatbubble-ellipses', '#9C27B0'), // Purple
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // You can add custom styles here if needed
});
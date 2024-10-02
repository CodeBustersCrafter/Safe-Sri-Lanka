import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import TabBarIcon from '@/components/navigation/TabBarIcon';

export default function TabsLayout() {
  console.log('TabsLayout Rendered'); // Log when TabsLayout is rendered
  const colorSchemeMode = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorSchemeMode === 'dark' ? '#fff' : '#000',
        tabBarStyle: { backgroundColor: colorSchemeMode === 'dark' ? '#000' : '#fff' },
        headerShown: true,
      }}
    >
      {/* Map Tab */}
      <Tabs.Screen
        name="Map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => {
            console.log('Rendering Map Tab Icon'); // Log icon rendering
            return <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />;
          },
        }}
      />

      {/* Helpline Tab */}
      <Tabs.Screen
        name="Helpline"
        options={{
          title: 'Helpline',
          tabBarIcon: ({ color, focused }) => {
            console.log('Rendering Helpline Tab Icon'); // Log icon rendering
            return <TabBarIcon name={focused ? 'call' : 'call-outline'} color={color} />;
          },
        }}
      />
      
      {/* SOS Tab */}
      <Tabs.Screen
        name="SOS"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color, focused }) => {
            console.log('Rendering SOS Tab Icon'); // Log icon rendering
            return <TabBarIcon name={focused ? 'alert-circle' : 'alert-circle-outline'} color={color} />;
          },
        }}
      />
      
      {/* Fake Call Tab */}
      <Tabs.Screen
        name="FakeCall"
        options={{
          title: 'Fake Call',
          tabBarIcon: ({ color, focused }) => {
            console.log('Rendering FakeCall Tab Icon'); // Log icon rendering
            return <TabBarIcon name={focused ? 'phone-portrait' : 'phone-portrait-outline'} color={color} />;
          },
        }}
      />

      {/* AI Assistant Tab */}
      <Tabs.Screen
        name="AI_Assistant"
        options={{
          title: 'AI Assistant',
          tabBarIcon: ({ color, focused }) => {
            console.log('Rendering AI_Assistant Tab Icon'); // Log icon rendering
            return <TabBarIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
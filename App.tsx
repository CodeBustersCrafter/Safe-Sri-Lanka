import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { setupDeepLinking } from './app/utils/deeplinking';
import { connectWebSocket, closeWebSocket } from './app/utils/websocket';
import SOSMapScreen from './app/screens/SOSMapScreen';

// Import your other screens

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  SOSMap: { lat: number; lon: number; senderId: string; senderName: string };
  // Add other screen params here
};

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    setupDeepLinking(navigationRef.current);
    connectWebSocket((data: any) => {
      if (data.type === 'sos') {
        Alert.alert(
          'SOS Alert',
          'Someone nearby needs help!',
          [
            { 
              text: 'View', 
              onPress: () => navigationRef.current?.navigate('SOSMap', {
                lat: data.lat,
                lon: data.lon,
                senderId: data.senderId,
                senderName: data.senderName
              })
            },
            { text: 'Dismiss', style: 'cancel' },
          ]
        );
      }
    });

    return () => {
      closeWebSocket();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {/* Your other screens */}
        <Stack.Screen name="SOSMap" component={SOSMapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

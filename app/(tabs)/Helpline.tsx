import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Linking from 'expo-linking';

export default function HelplineScreen() {
  const helplineNumber = 'tel:+1234567890'; // Replace with actual helpline number

  const makeCall = async () => {
    const supported = await Linking.canOpenURL(helplineNumber);
    if (supported) {
      await Linking.openURL(helplineNumber);
    } else {
      Alert.alert(`Don't know how to handle this number: ${helplineNumber}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Emergency Helpline</Text>
      <Button title="Call Helpline" onPress={makeCall} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});
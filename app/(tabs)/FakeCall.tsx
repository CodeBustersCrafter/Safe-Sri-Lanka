import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

export default function FakeCallScreen() {
  const initiateFakeCall = () => {
    // TODO: Implement fake call functionality
    Alert.alert('Fake Call', 'This feature will be implemented later.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fake Call</Text>
      <Button title="Start Fake Call" onPress={initiateFakeCall} />
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
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AI_AssistantScreen() {
    console.log('AI_AssistantScreen Rendered');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AI Assistant - Coming Soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
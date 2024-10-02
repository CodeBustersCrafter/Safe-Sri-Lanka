import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import AddRecordingButton from '../../components/AddRecordingButton';

export default function FakeCallScreen() {
  console.log('FakeCallScreen Rendered');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fake Call Screen</Text>
      <Link href="/RecordingsManager" asChild>
        <AddRecordingButton />
      </Link>
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
    fontWeight: 'bold',
    marginBottom: 20
  }
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TopBar = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safe Sri Lanka</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.button}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.button}>
          <Ionicons name="person-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a4a4a',
    fontFamily: 'Arial-BoldMT', // You can change this to a custom font if desired
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 16,
  },
});

export default TopBar;
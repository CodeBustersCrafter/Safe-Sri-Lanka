import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TopBar = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <Text style={styles.title}>Safe Sri Lanka</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => router.push('/addDangerZones')} style={styles.button}>
            <Ionicons name="warning-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.button}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.button}>
            <Ionicons name="person-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'black',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'System',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 16,
  },
});

export default TopBar;
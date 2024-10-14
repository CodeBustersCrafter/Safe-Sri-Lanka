import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { emergencyNumbers, EmergencyNumber } from '@/data/emergencyNumbers';

const GOLD = '#FFD700';
const DARK_ASH = '#555555';
const BLACK = '#000000';

export default function HelplineScreen() {
  const callNumber = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderItem = ({ item }: { item: EmergencyNumber }) => (
    <TouchableOpacity style={styles.card} onPress={() => callNumber(item.number)}>
      <Ionicons name="call-outline" size={24} color={BLACK} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.number}>{item.number}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Emergency Helplines</Text>
      <FlatList
        data={emergencyNumbers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background for consistency
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: BLACK,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GOLD,
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: BLACK,
    // Simulating double border by adding an outer border and inner padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BLACK,
    marginBottom: 4,
  },
  number: {
    fontSize: 24, // Increased font size from 20 to 24
    fontWeight: 'bold',
    color: DARK_ASH, // Changed color from GREEN to DARK_ASH
  },
});
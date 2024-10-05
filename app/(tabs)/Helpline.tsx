import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { useColorScheme } from 'react-native';
import { emergencyNumbers, EmergencyNumber } from '@/data/emergencyNumbers';

export default function HelplineScreen() {
  const colorScheme = useColorScheme();

  const callNumber = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderItem = ({ item }: { item: EmergencyNumber }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' }
      ]}
      onPress={() => callNumber(item.number)}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          {item.title}
        </Text>
        <Text style={[styles.number, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
          {item.number}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#f0f0f0' }]}>
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
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
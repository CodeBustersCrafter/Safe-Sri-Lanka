// components/FriendsCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FriendsCardProps {
  onPress: () => void;
}

const FriendsCard: React.FC<FriendsCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name="people" size={24} color="#555" />
      <Text style={styles.text}>Friends</Text>
      <Ionicons name="chevron-forward" size={24} color="#555" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
  },
});

export default FriendsCard;
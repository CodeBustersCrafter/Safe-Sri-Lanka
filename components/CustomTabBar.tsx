import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

const TabBarIcon = ({ name, color }: { name: string; color: string }) => {
  return <Ionicons name={name} size={24} color={color} />;
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = (() => {
          switch (label) {
            case 'Home':
              return 'home';
            case 'Explore':
              return 'compass';
            case 'Map':
              return 'map';
            case 'Helpline':
              return 'call';
            case 'Fake Call':
              return 'phone-portrait';
            default:
              return 'ellipse';
          }
        })();

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tab}
          >
            <TabBarIcon name={iconName} color={isFocused ? '#673ab7' : '#222'} />
          </TouchableOpacity>
        );
      })}

      {/* Adjusted SOS Button Position */}
      <TouchableOpacity
        style={styles.sosButton}
        onPress={() => router.push('/SOS')} // Navigate to SOS screen using router.push
        activeOpacity={0.7}
      >
        <Ionicons name="alert-circle" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative', // Ensure the container allows absolutely positioned children
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: Platform.OS === 'ios' ? 0.5 : 0,
    borderTopColor: '#ccc',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 10 : 0, // Added padding to prevent overlap
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  sosButton: {
    position: 'absolute',
    top: -20, // Move the button upwards by 20 units
    alignSelf: 'center',
    backgroundColor: '#ff3b30',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
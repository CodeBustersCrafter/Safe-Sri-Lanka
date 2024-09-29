import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

// Extract the 'name' prop type from Ionicons
type IonIconName = React.ComponentProps<typeof Ionicons>['name'];

type TabBarIconProps = {
  name: IonIconName;
  color: string;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color }) => {
  console.log(`TabBarIcon Props - Name: ${name}, Color: ${color}`); // Log received props

  // List of valid Ionicons names used in the app
  const validIconNames: IonIconName[] = [
    'map',
    'map-outline',
    'call',
    'call-outline',
    'phone-portrait',
    'phone-portrait-outline',
    'alert-circle',
    'alert-circle-outline',
    'chatbubbles',
    'chatbubbles-outline',
  ];

  // Fallback icon in case of invalid name
  const iconName: IonIconName = validIconNames.includes(name) ? name : 'help-circle-outline';
  console.log(`Selected Icon Name: ${iconName}`); // Log the final icon name being used

  return <Ionicons name={iconName} size={24} color={color} />;
};

export default TabBarIcon;
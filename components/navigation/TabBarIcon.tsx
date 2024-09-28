import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

type TabBarIconProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color }) => {
  return <Ionicons name={name} size={24} color={color} />;
};

export default TabBarIcon;
import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorSchemeCustom() {
  return useNativeColorScheme();
}
import { Platform } from 'react-native';

// Define the backend URL based on the platform
export const BACKEND_URL = Platform.select({
  // Fallback for web or other platforms
  default: 'http://192.168.56.1:8080/safe_srilanka',

});

// If you have a production URL, you can add a condition like this:
// export const BACKEND_URL = __DEV__
//   ? Platform.select({
//       ios: 'http://localhost:3000',
//       android: 'http://10.0.2.2:3000',
//       default: 'http://localhost:3000',
//     })
//   : 'https://your-production-backend-url.com';

import { Platform } from 'react-native';

// Define the backend URL based on the platform
export const BACKEND_URL = Platform.select({
  // Fallback for web or other platforms
<<<<<<< HEAD
  default: 'http://192.168.56.1:8080/safe_srilanka',
=======
 default: 'http://192.168.1.2:8080/safe_srilanka',

>>>>>>> 1b89f32dbf37b31fa37cd5e9deb73b68a68b61b7

});

// If you have a production URL, you can add a condition like this:
// export const BACKEND_URL = __DEV__
//   ? Platform.select({
//       ios: 'http://localhost:3000',
//       android: 'http://10.0.2.2:3000',
//       default: 'http://localhost:3000',
//     })
//   : 'https://your-production-backend-url.com';

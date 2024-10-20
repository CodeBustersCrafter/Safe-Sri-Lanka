# Safe-Sri-Lanka

Safe-Sri-Lanka is a mobile application designed to enhance safety and security for residents and visitors in Sri Lanka. The app features an SOS button for emergency situations, real-time location tracking, and access to helplines.

## 📚 Table of Contents

1. [Features](#-features)
2. [Prerequisites](#️-prerequisites)
3. [Project Structure](#-project-structure)
4. [Database Setup](#️-database-setup)
5. [Network Configuration](#-network-configuration)
6. [Running the Application](#-running-the-application)
7. [Usage](#-usage)
8. [API Endpoints](#-api-endpoints)
9. [Troubleshooting](#-troubleshooting)
10. [Contributing](#-contributing)
11. [License](#-license)

## 🛠 Features

- **SOS Button:** Instantly send your location and alert emergency contacts.
- **Real-Time Location Tracking:** Monitor your whereabouts in real-time.
- **AI Chatbot:** Get instant assistance through an agentic, RAG-based implementation that provides intelligent and context-aware support.
- **Helpline Access:** Direct access to various emergency and support helplines.
- **Fake Call:** Simulate incoming calls to manage personal situations discreetly.
- **Customizable Settings:** Tailor the app according to your preferences.
- **Danger Zone Alerts:** Receive notifications about nearby danger zones.
- **Relationship Management:** Connect with friends and family for enhanced safety.

## ⚙️ Prerequisites

- npm (Node package manager)
- Git
- Expo Go app on your mobile device
- Ballerina runtime (for backend development)
- MySQL database (version 5.7 or higher recommended)

## 🗂 Project Structure

- **api/**: Contains the Ballerina backend code.
  - **safe-srilanka/**: Main backend application directory.
    - **modules/**: Contains various modules including database, controllers, etc.
    - **main.bal**: Entry point for the backend application.
- **app/**: Contains the React Native frontend components.
- **components/**: Houses reusable React components used in the application.
- **hooks/**: Custom React hooks for various functionalities.
- **assets/**: Stores fonts, images, and other static assets.
- **package.json**: Lists all the dependencies for the frontend project.
- **db.sql**: SQL file for setting up the database schema.

## 🗄️ Database Setup

1. Create a new database locally using the `db.sql` file provided in the project.

2. Update the database configuration:
   - Open `api/safe-srilanka/modules/database/database.bal`
   - Modify the `dbUsers` and `dbPasswords` arrays with your local MySQL username and password.

## 🌐 Network Configuration

For the application to communicate with the backend properly, you need to update the IP address in two files:

1. For the backend:
   - Open `api/safe-srilanka/main.bal`
   - Locate the `const string backendIp` line
   - Change it to your PC's IP address

   Example:
   ```
   const string backendIp = "192.168.56.2";
   ```

2. For the frontend:
   - Open `app/const.tsx`
   - Find the `BASE_URL` constant
   - Update it with your PC's IP address

   Example:
   ```typescript
   const BASE_URL = 'http://192.168.56.2';
   ```

Note: 
- The structure of these configurations is different between the backend and frontend files. Make sure to use the correct syntax for each.
- If you're using an emulator, use your PC's IP address.
- If you're using a physical device, use the Expo link shown in the terminal after running `npx expo start`.

## 🚀 Running the Application

1. Start the Ballerina backend:
   Navigate to the project root directory and run:
   ```bash
   bal.bat run api\safe-srilanka
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Launch the app on your device or emulator:

   - On Android Emulator/Device: Press `a` in the terminal.
   - On iOS Simulator (macOS only): Press `i` in the terminal.
   - Using Expo Go App: Open the Expo Go app and scan the QR code displayed in the terminal.

Make sure your device/emulator and development machine are on the same network for the app to communicate with the backend properly.

## 📱 Usage

Access the app via the Expo Go app or emulator. Use the interface to:
- Send SOS alerts
- Access helplines
- Simulate fake calls
- Track your location
- Manage relationships
- View and report danger zones
   
## 🔌 API Endpoints

The application provides several API endpoints for various functionalities:

1. Profile Management:
   - GET /safe_srilanka/database/profile
   - POST /safe_srilanka/database/profile

2. SOS and Uncomfortable Signals:
   - POST /safe_srilanka/database/sos
   - POST /safe_srilanka/database/uncomfortable

3. Location Tracking:
   - POST /safe_srilanka/database/trace

4. Danger Zone Management:
   - POST /safe_srilanka/database/dangerzone

5. Relationship Management:
   - POST /safe_srilanka/database/relationship

For detailed API documentation, refer to the individual controller modules in the `api/safe-srilanka/modules/` directory.

## 🐛 Troubleshooting
   If you encounter any issues:
   
   - Ensure all dependencies are correctly installed.
   - Verify that your environment is set up correctly for the Expo app.
   - Check if the required ports (19000 for Expo) are available.
   - If you need further assistance, please contact us at teamcognic.ai@gmail.com.
   
## 🤝 Contributing
   Contributions are welcome! Please fork the repository and create a pull request with your features or fixes.

## 📄 License
   This project is licensed under the MIT License.
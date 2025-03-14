# Safe-Sri-Lanka

Safe-Sri-Lanka is a comprehensive mobile application specially developed for women's safety, designed to enhance security for female residents and visitors in Sri Lanka. The app features an SOS button for emergency situations, real-time location tracking, access to helplines, and an AI-powered chatbot for intelligent assistance. With additional features like danger zone alerts and relationship management, Safe-Sri-Lanka aims to provide women with peace of mind and immediate support when needed. This user-friendly interface empowers people to navigate their surroundings with confidence and access help quickly in potentially unsafe situations.

<div align="center">
  <a href="https://youtu.be/hV0jOnzFcdI?si=VOCYdYhFcp6bbert">
    <img src="https://github.com/CodeBustersCrafter/iwb350-cognic-ai/blob/main/Tumblain.jpg" alt="Safe-Sri-Lanka Demo" width="600">
  </a>
  <br>
  <a href="https://youtu.be/hV0jOnzFcdI?si=VOCYdYhFcp6bbert">
    <img src="https://img.icons8.com/color/48/000000/youtube-play.png" alt="Play Video">
  </a>
  <br>
  <i>Watch the Safe-Sri-Lanka Demo Video</i>
</div>


## 📚 Table of Contents

1. [Features](#-features)
2. [Prerequisites](#️-prerequisites)
3. [Project Structure](#-project-structure)
4. [Database Setup](#️-database-setup)
5. [Network Configuration](#-network-configuration)
6. [Running the Application](#-running-the-application)
7. [Troubleshooting](#-troubleshooting)
8. [Contributing](#-contributing)
9. [License](#-license)

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

- **apiControllers/**: Contains TypeScript controllers for API interactions.

- **app/**: Contains the React Native frontend components.

- **Python_backend/**: Python backend services.
  - **Chatbots/**: Chatbot implementation.
  - **Call and sms services/**: Services for calls and SMS.

- **services/**: Contains service layer for the application.
  
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

4. Python Servers (Not Required already deployed in AWS):

   All Python servers have been deployed on our AWS server, so you don't need to worry about running them locally. However, if you need to run and test them:

   - Request the `.env` file from us by emailing teamcognic.ai@gmail.com
   - To run the chatbot part:
     ```bash
     python "Python_backend/Chatbots/main_chatbot.py"
     ```
   - To run the call server:
     ```bash
     python "Python_backend/Call and sms services/call_server.py"
     ```
   - For the call server, you also need to:
     1. Download and install ngrok
     2. In the ngrok terminal, run: `ngrok http 5000`
     3. Take the public forwarding URL provided by ngrok
     4. Replace the `server_address` in the `call.py` file with this URL for smooth integration

Make sure your device/emulator and development machine are on the same network for the app to communicate with the backend properly.

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

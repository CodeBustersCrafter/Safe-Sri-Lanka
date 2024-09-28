```markdown
# Safe-Sri-Lanka

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Expo SDK](https://img.shields.io/badge/Expo-SDK_51.0.0-blue)

Safe-Sri-Lanka is a mobile application designed to enhance safety and security for residents and visitors in Sri Lanka. The app features an SOS button for emergency situations, real-time location tracking, access to helplines, and more.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **SOS Button:** Instantly send your location and alert emergency contacts.
- **Real-Time Location Tracking:** Monitor your whereabouts in real-time.
- **Helpline Access:** Direct access to various emergency and support helplines.
- **Fake Call:** Simulate incoming calls to manage personal situations discreetly.
- **Customizable Settings:** Tailor the app according to your preferences.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Git Installed:** [Download Git](https://git-scm.com/downloads) and install it on your machine.
- **Node.js and npm Installed:** [Download Node.js](https://nodejs.org/) (includes npm). Ensure you have Node.js version 14.x or higher.
- **GitHub Account:** All collaborators should have a [GitHub](https://github.com/) account.
- **Expo Go App:** Install the [Expo Go](https://expo.dev/client) app on your mobile device for testing.

## Installation

Follow these steps to set up the Safe-Sri-Lanka project locally.

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/your-username/Safe-Sri-Lanka.git
```

*Replace `your-username` with your actual GitHub username.*

### 2. Navigate to the Project Directory

Move into the project directory:

```bash
cd Safe-Sri-Lanka
```

### 3. Install Dependencies

Install the project dependencies using `npm` or `yarn`:

Using **npm**:

```bash
npm install
```

Using **yarn**:

```bash
yarn install
```

### 4. Install Expo Packages Using `npx`

Since the global `expo-cli` is deprecated, use `npx` to run Expo commands locally within the project.

#### Install `expo-camera` and Other Dependencies

Ensure you install `expo-camera`, `expo-media-library`, and `expo-router` using `npx` to maintain compatibility with your Expo SDK version.

```bash
npx expo install expo-camera expo-media-library expo-router
```

*You can add other Expo packages as needed in a similar manner.*

### 5. Verify Installation

After installation, your `package.json` should list the installed dependencies. Confirm by checking:

```bash
cat package.json
```

Look for entries like `"expo-camera"`, `"expo-media-library"`, and `"expo-router"` under `dependencies`.

## Running the Project

Use `npx` to interact with Expo CLI commands without needing a global installation.

### 1. Start the Expo Development Server

```bash
npx expo start
```

This command will start the development server and open the Expo Dev Tools in your browser.

### 2. Launch the App on Your Device or Emulator

- **On Android Emulator/Device:** Press `a` in the terminal where the Expo server is running.
- **On iOS Simulator (macOS only):** Press `i` in the terminal.
- **Using Expo Go App:**
  - Open the Expo Go app on your mobile device.
  - Scan the QR code displayed in the terminal or browser to load the app.

### 3. Clear Cache If Needed

If you encounter issues, try clearing the cache:

```bash
npx expo start -c
```

## Project Structure

Here's an overview of the project's directory structure:

```
Safe-Sri-Lanka/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── explore.tsx
│   │   ├── index.tsx
│   │   ├── Map.tsx
│   │   ├── Helpline.tsx
│   │   ├── FakeCall.tsx
│   │   └── SOS.tsx
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   └── +html.tsx
├── components/
│   ├── CustomTabBar.tsx
│   ├── navigation/
│   │   └── TabBarIcon.tsx
│   └── ... (other components)
├── hooks/
│   └── useColorScheme.ts
├── assets/
│   └── fonts/
│       └── SpaceMono-Regular.ttf
├── package.json
├── app.json
├── tsconfig.json
├── babel.config.js
├── .gitignore
└── README.md
```

## Contributing

We welcome contributions from the community! Follow these steps to get started:

### 1. Fork the Repository

Click the **Fork** button at the top-right corner of the repository page to create a personal copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/your-username/Safe-Sri-Lanka.git
```

### 3. Create a New Branch

Create a branch for your feature or bug fix:

```bash
git checkout -b feature/YourFeatureName
```

### 4. Make Your Changes

Implement your feature or fix the bug in your local repository.

### 5. Commit Your Changes

Stage and commit your changes with a descriptive message:

```bash
git add .
git commit -m "Add feature XYZ"
```

### 6. Push to Your Fork

Push your changes to GitHub:

```bash
git push origin feature/YourFeatureName
```

### 7. Open a Pull Request

- Navigate to your forked repository on GitHub.
- Click the **Compare & pull request** button.
- Provide a clear description of your changes.
- Submit the pull request for review.

### Contribution Guidelines

- **Code of Conduct:** Adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).
- **Commit Messages:** Use clear and descriptive commit messages.
- **Branch Naming:** Use `feature/` or `bugfix/` prefixes for branches.
- **Testing:** Ensure your changes do not break existing functionality.
- **Documentation:** Update documentation as necessary.

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or support, please contact:

- **Your Name:** [your-email@example.com](mailto:your-email@example.com)
- **GitHub Profile:** [your-username](https://github.com/your-username)

---

*Thank you for contributing to Safe-Sri-Lanka! Together, we can make Sri Lanka a safer place.*

```

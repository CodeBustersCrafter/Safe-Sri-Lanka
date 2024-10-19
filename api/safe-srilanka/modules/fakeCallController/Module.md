# Fake Call Controller Module

> Enhancing user safety through simulated emergency calls

## 📞 Module Summary

This module provides API endpoints for managing fake calls, enabling users to simulate emergency situations and deter potential threats within the Safe Sri Lanka application.

## 🌟 Module Overview

The Fake Call Controller is an innovative component of the Safe Sri Lanka application, designed to:

- **Simulate Emergency Calls**: Generate realistic fake calls to create a deterrent effect
- **Customize Call Scenarios**: Allow users to set up various emergency call scenarios
- **Integrate with User Profiles**: Utilize user information for personalized call simulations
- **Enhance Personal Safety**: Provide users with an additional tool for self-protection
- **Support Discreet Operations**: Enable users to activate fake calls subtly in threatening situations

### 🔑 Key Features

- **Fake Call Generation**: API endpoints for initiating and managing simulated emergency calls
- **Scenario Customization**: Allow users to pre-configure different call scenarios
- **Real-time Audio Playback**: Simulate authentic call audio for added realism
- **Timer-based Activation**: Enable users to schedule fake calls in advance
- **Integration with Other Safety Features**: Seamlessly work with SOS and location tracking modules

### 📊 Core API Endpoints

The `fakeCallController.bal` file implements the following main API endpoints:

1. `POST /fake-call/initiate`: Start a new fake call
2. `GET /fake-call/scenarios`: Retrieve available fake call scenarios
3. `POST /fake-call/customize`: Create or update a custom call scenario
4. `GET /fake-call/active`: Check the status of any ongoing fake call
5. `POST /fake-call/end`: Terminate an active fake call

### 🔧 Implementation Details

- Utilizes audio processing libraries for realistic call simulation
- Implements secure and efficient call scenario management
- Ensures low-latency response for immediate call activation
- Provides detailed logging and analytics for user safety insights

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

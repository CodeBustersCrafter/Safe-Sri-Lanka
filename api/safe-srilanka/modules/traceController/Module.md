# Trace Controller Module

> Empowering user safety through advanced location tracking and management

## 📍 Module Summary

This module manages user location data, providing APIs for tracking, analyzing, and retrieving location information to enhance user safety and emergency response capabilities.

## 🌟 Module Overview

The Trace Controller is a critical component of the Safe Sri Lanka application, designed to:

- **Record User Locations**: Securely capture and store real-time user location data
- **Retrieve Location History**: Fetch historical location data for analysis and reporting
- **Support Emergency Response**: Provide crucial location information during SOS situations
- **Enhance User Safety**: Enable features like movement pattern analysis and last known location retrieval

### 🔑 Key Features

- **Real-time Location Updates**: API endpoints for continuous user location tracking
- **Historical Data Retrieval**: Efficient querying of past location data
- **Privacy-focused Design**: Implement strict data protection and user consent mechanisms
- **Integration with Other Modules**: Seamless interaction with SOS and Danger Zone features

### 📊 Core Functions

The `traceController.bal` file implements the following main API endpoints:

1. `POST /trace/location`: Record a new user location
2. `GET /trace/history`: Retrieve a user's location history within a specified date range
3. `GET /trace/patterns`: Analyze a user's movement patterns
4. `GET /trace/last-location`: Fetch the most recent location for a specific user

### 🔧 Implementation Details

- Utilizes the `traceModel` for database operations
- Implements robust error handling and logging
- Ensures data integrity and consistency across operations
- Provides detailed API documentation for easy integration

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

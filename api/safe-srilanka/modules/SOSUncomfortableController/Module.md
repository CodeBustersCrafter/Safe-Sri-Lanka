# SOS Uncomfortable Controller Module

> Empowering users to report and manage uncomfortable situations

## 🚨 Module Summary

This module provides API endpoints for managing the SOS Uncomfortable feature, allowing users to report uncomfortable situations and retrieve relevant information.

## 🌟 Module Overview

The SOS Uncomfortable Controller is a critical component of the Safe Sri Lanka application, designed to:

- **Report Uncomfortable Situations**: Enable users to quickly signal discomfort
- **Notify Relevant Parties**: Alert connected users and nearby individuals
- **Retrieve Signal Information**: Provide detailed data about reported situations
- **Manage Emergency Responses**: Support the lifecycle of uncomfortable signals

### 🔑 Key Features

- **Real-time Reporting**: Instant submission of uncomfortable signals
- **Geolocation Integration**: Precise location tracking for accurate response
- **Notification System**: Alert relevant parties based on relationships and proximity
- **Detailed Signal Retrieval**: Access comprehensive information about reported situations
- **Signal Management**: Support for deactivating resolved uncomfortable signals

### 📊 Core API Endpoints

The `SOSUncomfortableController.bal` file implements the following main API endpoints:

1. `POST /sos/uncomfortable`: Report a new uncomfortable situation
2. `GET /sos/uncomfortable/{id}`: Retrieve details of a specific uncomfortable signal
3. `GET /sos/uncomfortable/nearby`: Find nearby active uncomfortable signals
4. `PUT /sos/uncomfortable/{id}/deactivate`: Deactivate a resolved uncomfortable signal

### 🔧 Implementation Details

- Utilizes the `SOSUncomfortableModel` for data operations
- Implements robust error handling and input validation
- Ensures data integrity and user privacy
- Provides detailed API documentation for easy integration

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

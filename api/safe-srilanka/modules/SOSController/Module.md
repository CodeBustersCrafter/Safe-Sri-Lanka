# SOS Controller Module

> Empowering rapid emergency response through efficient API management

## 🚨 Module Summary

This module provides API endpoints for managing SOS signals, enabling quick and effective emergency responses in critical situations.

## 🌟 Module Overview

The SOS Controller is a crucial component of the Safe Sri Lanka application, designed to:

- **Initiate Emergency Signals**: Allow users to quickly send SOS alerts
- **Notify Relevant Parties**: Alert connected users and emergency services
- **Retrieve Signal Information**: Provide detailed data about ongoing emergencies
- **Manage Emergency Responses**: Support the lifecycle of SOS signals

### 🔑 Key Features

- **Real-time Signal Processing**: Instant submission and retrieval of SOS alerts
- **Geolocation Integration**: Precise location tracking for accurate emergency response
- **Notification System**: Alert relevant parties based on relationships and proximity
- **Detailed Signal Retrieval**: Access comprehensive information about reported emergencies
- **Signal Management**: Support for updating and resolving SOS situations

### 📊 Core API Endpoints

The `SOSController.bal` file implements the following main API endpoints:

1. `POST /sos`: Initiate a new SOS signal
2. `GET /sos/{id}`: Retrieve details of a specific SOS signal
3. `GET /sos/nearby`: Find nearby active SOS signals
4. `PUT /sos/{id}/update`: Update the status of an SOS signal

### 🔧 Implementation Details

- Utilizes the `SOSModel` for data operations
- Implements robust error handling and input validation
- Ensures data integrity and user privacy
- Provides detailed API documentation for easy integration

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

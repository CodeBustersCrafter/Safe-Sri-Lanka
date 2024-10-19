# SOS Model Module

> Empowering emergency response through efficient data management

## 🚨 Module Summary

This module manages the core data operations for the SOS feature, enabling quick and effective emergency responses in critical situations.

## 🌟 Module Overview

The SOS Model is a crucial component of the Safe Sri Lanka application, designed to:

- **Record Emergency Signals**: Securely store and manage SOS alerts
- **Identify Recipients**: Determine who should be notified during an emergency
- **Retrieve Signal Details**: Fetch comprehensive information about reported emergencies
- **Track Signal Status**: Monitor and update the lifecycle of SOS alerts

### 🔑 Key Features

- **Real-time Data Processing**: Instant recording and retrieval of SOS signals
- **Geolocation Integration**: Precise location tracking for accurate emergency response
- **Relationship-based Notifications**: Alert relevant parties based on user connections
- **Detailed Signal Information**: Store and retrieve comprehensive emergency details
- **Signal Lifecycle Management**: Support activation, updates, and resolution of SOS alerts

### ���� Core Functions

The `SOSModel.bal` file implements the following main functions:

1. `insertSOSSignal(int senderId, decimal lat, decimal lon) returns sql:ExecutionResult|error`
2. `getRecipientsForSOS(int senderId, decimal lat, decimal lon) returns stream<record {}, error?>`
3. `getSOSDetails(int sosId) returns record {}|error?`
4. `updateSOSOTP(int sosId, string otp) returns sql:ExecutionResult|error`

### 🔧 Implementation Details

- Utilizes Ballerina's `sql` module for efficient database operations
- Implements robust error handling and data validation
- Ensures data integrity and user privacy
- Provides seamless integration with other modules in the application

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

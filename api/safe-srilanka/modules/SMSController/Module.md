# SMS Controller Module

> Enabling efficient communication through SMS integration

## 📱 Module Summary

This module provides API endpoints for managing SMS communications, facilitating quick and reliable messaging within the Safe Sri Lanka application.

## 🌟 Module Overview

The SMS Controller is a vital component of the Safe Sri Lanka application, designed to:

- **Send SMS Messages**: Allow the system to send SMS notifications to users
- **Verify Phone Numbers**: Implement SMS-based phone number verification
- **Manage Message Logs**: Keep track of sent messages for auditing purposes
- **Handle Delivery Reports**: Process and store SMS delivery statuses

### 🔑 Key Features

- **Efficient Message Dispatch**: Quick and reliable SMS sending capabilities
- **Verification System**: Secure phone number verification process
- **Logging and Auditing**: Comprehensive tracking of all SMS activities
- **Delivery Status Tracking**: Monitor the status of sent messages
- **Integration with Telecom APIs**: Seamless connection with SMS gateways

### 📊 Core API Endpoints

The `SMSController.bal` file implements the following main API endpoints:

1. `POST /sms/send`: Send an SMS message
2. `POST /sms/verify`: Initiate or complete phone number verification
3. `GET /sms/status/{id}`: Check the delivery status of a sent message
4. `GET /sms/logs`: Retrieve SMS sending logs

### 🔧 Implementation Details

- Utilizes the `SMSModel` for data operations
- Implements robust error handling and rate limiting
- Ensures message delivery and tracks failed attempts
- Provides detailed API documentation for easy integration

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

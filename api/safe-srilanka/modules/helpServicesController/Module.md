# Help Services Controller Module

> Empowering users with essential support and emergency assistance features

## 🆘 Module Summary

This module provides API endpoints for managing help services, enabling users to access critical support and emergency assistance features within the Safe Sri Lanka application.

## 🌟 Module Overview

The Help Services Controller is a vital component of the Safe Sri Lanka application, designed to:

- **Manage Emergency Contacts**: API endpoints for adding, updating, and retrieving emergency contacts
- **Handle SOS Alerts**: Facilitate the creation and management of SOS alerts
- **Provide Safety Information**: Offer access to safety guidelines and local emergency services
- **Support User Assistance**: Enable users to request and receive help in various situations
- **Integrate with Other Modules**: Seamlessly interact with location tracking and user profile features

### 🔑 Key Features

- **Emergency Contact Management**: Comprehensive API for managing user's emergency contacts
- **SOS Alert System**: Robust endpoints for creating and managing distress signals
- **Safety Resource Access**: Provide users with crucial safety information and guidelines
- **Help Request Handling**: Facilitate user requests for assistance in various scenarios
- **Integration with Location Services**: Utilize user location data for targeted assistance

### 📊 Core API Endpoints

The `helpServicesController.bal` file implements the following main API endpoints:

1. `POST /emergency-contacts`: Add a new emergency contact
2. `GET /emergency-contacts`: Retrieve user's emergency contacts
3. `POST /sos-alert`: Create a new SOS alert
4. `GET /safety-guidelines`: Access safety information and guidelines
5. `POST /help-request`: Submit a request for assistance

### 🔧 Implementation Details

- Utilizes the `helpServicesModel` for database operations
- Implements thorough input validation and error handling
- Ensures data consistency and privacy across operations
- Provides detailed API documentation for easy integration

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

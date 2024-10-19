# Profile Controller Module

> Empowering user identity management and personalization through robust API endpoints

## 👤 Module Summary

This module provides API endpoints for managing user profiles, enabling secure creation, retrieval, updating, and deletion of user information to support personalized safety features and emergency response capabilities.

## 🌟 Module Overview

The Profile Controller is a core component of the Safe Sri Lanka application, designed to:

- **Manage User Profiles**: API endpoints for creating, updating, and deleting user profiles
- **Retrieve User Information**: Secure methods to access user data
- **Support Authentication**: Integrate with authentication systems for secure profile management
- **Enable Personalization**: Facilitate customization of app features based on user preferences
- **Enhance Emergency Response**: Provide critical user information during SOS situations

### 🔑 Key Features

- **Profile CRUD Operations**: Comprehensive API for profile management
- **Data Validation**: Ensure data integrity and consistency
- **Privacy Controls**: Implement user consent and data protection mechanisms
- **Integration with Other Modules**: Seamless interaction with related features
- **Error Handling**: Robust error management and informative responses

### 📊 Core API Endpoints

The `profileController.bal` file implements the following main API endpoints:

1. `POST /profiles`: Create a new user profile
2. `GET /profiles/{userId}`: Retrieve a specific user's profile
3. `PUT /profiles/{userId}`: Update an existing user profile
4. `DELETE /profiles/{userId}`: Remove a user profile

### 🔧 Implementation Details

- Utilizes the `profileModel` for database operations
- Implements thorough input validation and error handling
- Ensures data consistency across operations
- Provides detailed API documentation for easy integration

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

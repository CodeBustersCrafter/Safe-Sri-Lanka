# Profile Model Module

> Empowering user identity management and personalization for enhanced safety features

## 👤 Module Summary

This module manages user profile data, enabling secure storage, retrieval, and updating of user information to support personalized safety features and emergency response capabilities.

## 🌟 Module Overview

The Profile Model is a core component of the Safe Sri Lanka application, designed to:

- **Store User Information**: Securely manage personal and contact details
- **Support User Authentication**: Provide data for user login and verification
- **Enable Personalization**: Allow customization of app features based on user preferences
- **Facilitate Emergency Response**: Store critical information for SOS situations
- **Manage Privacy Settings**: Control access to user data based on privacy preferences

### 🔑 Key Features

- **Profile Creation**: API for establishing new user profiles
- **Profile Management**: Update, retrieve, and delete user information
- **Data Encryption**: Ensure sensitive user data is securely stored
- **Integration with Other Modules**: Support features like relationship management and location tracking
- **Audit Logging**: Track changes to user profiles for security and compliance

### 📊 Core Functions

The `profileModel.bal` file implements the following main functions:

1. `createUserProfile(UserProfile profile) returns sql:ExecutionResult|sql:Error`
2. `getUserProfile(int userId) returns UserProfile|error`
3. `updateUserProfile(int userId, UserProfile updatedProfile) returns sql:ExecutionResult|sql:Error`
4. `deleteUserProfile(int userId) returns sql:ExecutionResult|sql:Error`

### 🔧 Implementation Details

- Utilizes Ballerina's `sql` module for database operations
- Implements robust error handling and input validation
- Ensures data integrity and consistency across operations
- Provides detailed documentation for easy integration with other modules

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

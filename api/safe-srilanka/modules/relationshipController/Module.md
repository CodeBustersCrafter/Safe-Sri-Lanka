# Relationship Controller Module

> Empowering user connections and safety networks through robust relationship management APIs

## 👥 Module Summary

This module provides API endpoints for managing user relationships, enabling the creation and maintenance of safety networks to enhance user protection and emergency response capabilities.

## 🌟 Module Overview

The Relationship Controller is a crucial component of the Safe Sri Lanka application, designed to:

- **Establish User Connections**: API endpoints for creating and managing relationships between users
- **Define Relationship Types**: Support various relationship categories (e.g., family, friends, colleagues)
- **Manage Trust Levels**: Implement trust-based permissions for information sharing
- **Support Emergency Contacts**: Identify and prioritize contacts for SOS situations
- **Enable Privacy Controls**: Allow users to manage their relationship visibility and permissions

### 🔑 Key Features

- **Relationship Creation**: API for establishing connections between users
- **Relationship Management**: Update, delete, and query user relationships
- **Trust Level System**: Implement and manage trust-based permissions
- **Privacy Settings**: Allow users to control their relationship visibility
- **Emergency Contact Prioritization**: Identify key contacts for emergency situations

### 📊 Core API Endpoints

The `relationshipController.bal` file implements the following main API endpoints:

1. `POST /relationships`: Create a new relationship between users
2. `PUT /relationships/{id}`: Update an existing relationship
3. `GET /relationships/{userId}`: Retrieve relationships for a specific user
4. `DELETE /relationships/{id}`: Remove a relationship
5. `GET /relationships/{userId}/emergency-contacts`: Get emergency contacts for a user

### 🔧 Implementation Details

- Utilizes the `relationshipModel` for database operations
- Implements robust error handling and input validation
- Ensures data integrity and consistency across operations
- Provides detailed API documentation for easy integration

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

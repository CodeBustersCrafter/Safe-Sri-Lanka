# Relationship Model Module

> Empowering user connections and safety networks through robust relationship management

## 👥 Module Summary

This module manages user relationships, enabling the creation and maintenance of safety networks to enhance user protection and emergency response capabilities.

## 🌟 Module Overview

The Relationship Model is a crucial component of the Safe Sri Lanka application, designed to:

- **Establish User Connections**: Create and manage relationships between users
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

### 📊 Core Functions

The `relationshipModel.bal` file implements the following main functions:

1. `createRelationship(int userId1, int userId2, string relationType) returns sql:ExecutionResult|sql:Error`
   - Establishes a new relationship between two users
   - Returns the execution result or an error if creation fails

2. `updateRelationshipTrust(int relationshipId, int trustLevel) returns sql:ExecutionResult|sql:Error`
   - Updates the trust level for a specific relationship
   - Returns the execution result or an error if update fails

3. `getEmergencyContacts(int userId) returns stream<record {}, error?>`
   - Retrieves a list of emergency contacts for a user
   - Returns a stream of contact records or an error if retrieval fails

4. `deleteRelationship(int relationshipId) returns sql:ExecutionResult|sql:Error`
   - Removes a relationship between users
   - Returns the execution result or an error if deletion fails

### 🔧 Implementation Details

- Utilizes Ballerina's `sql` module for database operations
- Implements efficient data storage and retrieval mechanisms
- Ensures data integrity and consistency across operations
- Provides detailed error handling and logging for troubleshooting

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

# Models Module

> Defining core data structures for the Safe Sri Lanka application

## 📊 Module Summary

This module defines the essential data models and structures used throughout the Safe Sri Lanka application, ensuring consistency and type safety across all modules.

## 🌟 Module Overview

The Models module is a fundamental component of the Safe Sri Lanka application, designed to:

- **Define Data Structures**: Establish clear and consistent data models for all application entities
- **Ensure Type Safety**: Provide strongly-typed structures for robust application development
- **Facilitate Data Validation**: Include built-in validation rules for data integrity
- **Support Serialization**: Enable easy conversion between different data formats (e.g., JSON, XML)
- **Enhance Code Readability**: Offer clear and self-documenting data structures

### 🔑 Key Features

- **User Profile Model**: Define structure for user personal information
- **Location Data Model**: Represent geographical coordinates and related metadata
- **Emergency Contact Model**: Structure for storing and managing emergency contacts
- **SOS Alert Model**: Define the format for SOS alerts and related information
- **Danger Zone Model**: Represent areas of potential danger or risk

### 📊 Core Models

The module includes the following main data models:

1. `UserProfile`: Represents user account information
2. `Location`: Defines structure for geographical location data
3. `EmergencyContact`: Stores information about user's emergency contacts
4. `SOSAlert`: Represents an SOS alert raised by a user
5. `DangerZone`: Defines areas marked as potentially dangerous

### 🔧 Implementation Details

- Utilizes Ballerina's robust type system for clear and concise model definitions
- Implements data validation rules within the models where appropriate
- Provides utility functions for data conversion and manipulation
- Ensures compatibility with database operations and API endpoints

For more information on Ballerina module documentation, refer to the [official Ballerina documentation](https://lib.ballerina.io/ballerina/io/latest).

# Danger Zone Controller Module

> Enhancing safety through real-time danger zone management

## 🚨 Module Summary

This module manages and provides information about danger zones, helping users stay informed and safe in potentially hazardous areas.

## 🌟 Module Overview

The Danger Zone Controller is a crucial component of the Safe Sri Lanka application, designed to:

- **Identify Danger Zones**: Pinpoint and track areas of potential risk or danger
- **Provide Real-time Updates**: Offer up-to-date information on current danger zones
- **Alert Users**: Notify users when they approach or enter a designated danger zone
- **Manage Zone Data**: Allow authorized personnel to add, update, or remove danger zone information

### 🔑 Key Features

- **Geolocation Integration**: Uses precise GPS data to accurately locate and track danger zones
- **Dynamic Zone Management**: Enables real-time addition, modification, and removal of danger zones
- **User Proximity Alerts**: Sends timely notifications to users near or within danger zones
- **Detailed Zone Information**: Provides comprehensive details about each danger zone, including description and distance
- **API Integration**: Offers robust API endpoints for seamless integration with other modules and external systems

### 📊 Core Functions

The `dangerZoneController.bal` file implements the following main functions:

1. `getNearbyDangerZones(json payload) returns json|error`
   - Retrieves danger zones within a specified radius of given coordinates
   - Calculates distances from the user's location
   - Returns a JSON array of nearby danger zones or an empty array if none found

2. `insertDangerZone(json payload) returns json|error`
   - Adds a new danger zone to the system
   - Validates input data (latitude, longitude, description) before insertion
   - Returns a success message or an error if insertion fails

### 🔧 Implementation Details

- Utilizes the `dangerZoneModel` for database operations
- Implements error handling for database queries and data processing
- Converts between different data types (json, decimal, string) as needed
- Logs operations for debugging and monitoring purposes

### 📡 API Usage

#### Get Nearby Danger Zones

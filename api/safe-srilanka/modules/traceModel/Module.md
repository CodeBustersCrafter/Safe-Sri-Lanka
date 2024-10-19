# Trace Model Module

> Empowering user safety through advanced location tracking and analysis

## 📍 Module Summary

This module manages user location data, enabling real-time tracking and historical analysis to enhance user safety and emergency response capabilities.

## 🌟 Module Overview

The Trace Model is a critical component of the Safe Sri Lanka application, designed to:

- **Record User Locations**: Securely store and manage user location data
- **Analyze Movement Patterns**: Process historical data to identify user routines and anomalies
- **Support Emergency Response**: Provide crucial location information during SOS situations
- **Enhance User Safety**: Enable features like route suggestions and danger zone alerts

### 🔑 Key Features

- **Real-time Tracking**: Continuously update and store user locations
- **Historical Data Analysis**: Process past location data for insights and patterns
- **Privacy-focused Design**: Implement strict data protection and user consent mechanisms
- **Geospatial Queries**: Support complex location-based searches and calculations
- **Integration with Other Modules**: Seamlessly work with SOS and Danger Zone features

### 📊 Core Functions

The `traceModel.bal` file implements the following main functions:

1. `insertUserLocation(int userId, decimal lat, decimal lon) returns sql:ExecutionResult|sql:Error`
   - Records a new user location in the database
   - Returns the execution result or an error if insertion fails

2. `getUserLocationHistory(int userId, string startDate, string endDate) returns stream<record {}, error?>`
   - Retrieves a user's location history within a specified date range
   - Returns a stream of location records or an error if retrieval fails

3. `analyzeUserMovementPatterns(int userId) returns json|error`
   - Processes a user's historical location data to identify patterns
   - Returns a JSON object with movement analysis or an error if processing fails

4. `getLastKnownLocation(int userId) returns record {}|error?`
   - Fetches the most recent location data for a specific user
   - Returns a record with location details or an error if not found

### 🔧 Implementation Details

- Utilizes Ballerina's `sql` module for database operations
- Implements efficient data storage and retrieval mechanisms
- Ensures data integrity and consistency across operations
- Provides detailed error handling and logging for troubleshooting

For more detailed API documentation, please refer to the [Ballerina Standard Library](https://lib.ballerina.io/ballerina/io/latest).

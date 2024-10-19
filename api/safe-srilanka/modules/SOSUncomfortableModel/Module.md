# SOS Uncomfortable Model Module

> Empowering users to signal discomfort and manage emergency situations

## 📢 Module Summary

This module handles the data operations for the SOS Uncomfortable feature, allowing users to report uncomfortable situations and manage emergency responses.

## 🌟 Module Overview

The SOS Uncomfortable Model is a critical component of the Safe Sri Lanka application, designed to:

- **Record Uncomfortable Signals**: Store user-reported uncomfortable situations
- **Identify Recipients**: Determine who should be notified of an uncomfortable signal
- **Retrieve Signal Details**: Fetch comprehensive information about reported situations
- **Locate Nearby Signals**: Find active uncomfortable signals in the vicinity
- **Manage Signal Status**: Allow deactivation of resolved situations

### 🔑 Key Features

- **Geolocation Integration**: Uses precise GPS data to record and locate uncomfortable signals
- **Relationship-based Notifications**: Notifies connected users and nearby individuals
- **Detailed Signal Information**: Stores and retrieves comprehensive details about each reported situation
- **Proximity-based Queries**: Finds nearby active signals within a specified radius
- **Signal Lifecycle Management**: Supports deactivation of resolved uncomfortable situations

### 📊 Core Functions

The `SOSUncomfortableModel.bal` file implements the following main functions:

1. `insertUncomfortableSignal(int senderId, decimal lat, decimal lon, string description) returns sql:ExecutionResult|sql:Error`
   - Records a new uncomfortable signal in the database
   - Returns the execution result or an error if insertion fails

2. `getRecipientsForUncomfortable(int senderId, decimal lat, decimal lon) returns stream<record {}, error?>`
   - Identifies recipients for an uncomfortable signal notification
   - Returns a stream of potential recipients based on relationships and proximity

3. `getUncomfortableDetails(int uncomfortableId) returns record {}|error?`
   - Retrieves detailed information about a specific uncomfortable signal
   - Returns a record with signal details and sender information

4. `getNearbyUncomfortableSignals(decimal lat, decimal lon, decimal radius = 5) returns stream<record {}, error?>`
   - Finds active uncomfortable signals within a specified radius
   - Returns a stream of nearby signals with distance calculations

5. `deactivateUncomfortableSignal(int uncomfortableId) returns sql:ExecutionResult|sql:Error`
   - Deactivates (deletes) a resolved uncomfortable signal
   - Returns the execution result or an error if deactivation fails

### 🔧 Implementation Details

- Utilizes `ballerinax/mysql` for database operations
- Implements complex SQL queries for efficient data retrieval and filtering
- Uses parameterized queries to prevent SQL injection
- Calculates distances using the Haversine formula for accurate proximity results

### 🔗 Module Usage

This module is primarily used by the SOSUncomfortableController to handle data operations related to uncomfortable signals. It provides a robust foundation for managing emergency situations and ensuring user safety.

For detailed API documentation, please refer to the individual function descriptions in the `SOSUncomfortableModel.bal` file.

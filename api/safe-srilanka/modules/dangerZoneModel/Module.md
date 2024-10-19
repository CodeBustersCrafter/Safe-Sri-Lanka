# Danger Zone Model

> Efficient management of danger zones for enhanced safety

## 🚨 Module Summary

This module provides core functionality for managing danger zone data in the Safe Sri Lanka application, enabling efficient retrieval and insertion of danger zone information.

## 🌟 Module Overview

The Danger Zone Model is a crucial component that:

- **Retrieves Nearby Danger Zones**: Efficiently fetches danger zones within a specified radius of given coordinates
- **Inserts New Danger Zones**: Allows the addition of new danger zones to the database

### 🔑 Key Features

- **Geospatial Querying**: Utilizes SQL to calculate distances and find nearby danger zones
- **Parameterized Queries**: Ensures safe and efficient database operations
- **Stream Processing**: Returns query results as a stream for efficient memory usage
- **Error Handling**: Provides clear error information for robust application behavior

### 📊 Core Functions

1. `getNearbyDangerZones(decimal userLat, decimal userLon, decimal radius) returns stream<record {}, error?>`
   - Retrieves danger zones within the specified radius of the given coordinates
   - Calculates distances using the Haversine formula
   - Returns a stream of records containing danger zone information

2. `insertDangerZone(decimal lat, decimal lon, string description) returns sql:ExecutionResult|sql:Error`
   - Inserts a new danger zone into the database
   - Takes latitude, longitude, and description as parameters
   - Returns the result of the database operation or an error

### 🔧 Implementation Details

- Uses `ballerinax/mysql` for database operations
- Implements parameterized SQL queries for security and efficiency
- Logs operations for debugging and monitoring purposes

For more detailed information on usage and implementation, please refer to the source code and API documentation.

import ballerinax/mysql.driver as _;
import ballerinax/mysql;

// MySQL Database configuration
configurable string dbUser = "root";
configurable string dbPassword = "root";
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "safe_sri_lanka";
configurable int poolSize = 5;

// Create a connection pool to store multiple clients
public final mysql:Client[] clientPool = [];

// Initialize the client pool
function init() {
    foreach int i in 0 ..< poolSize {
        mysql:Client|error dbClient = new (
            host = dbHost,
            user = dbUser,
            password = dbPassword,
            database = dbName,
            port = dbPort
        );
        if (dbClient is mysql:Client) {
            clientPool.push(dbClient);
        } else {
            panic error("Failed to initialize database client: " + dbClient.message());
        }
    }
}

// Function to get a client from the pool
public int pointer = 0;
public function getClient() returns mysql:Client {
    int index = pointer % poolSize;
    pointer = pointer + 1;
    return clientPool[index];
}




// public function getUserProfile(string userId) returns json|error {
//     io:println(userId);
//     io:println("get user profile is called from the database");
//     sql:ParameterizedQuery query = `SELECT * FROM profile WHERE id = ${userId}`;
//     stream<record {}, error?> resultStream = dbClient1->query(query);
//     record {}|error? result = check resultStream.next();
//     if (result is record {}) {
//         return result.toJson();
//     } else {
//         return {};
//     }
// }
// public function getUserProfiles() returns json|error {
//     io:println("get user profile is called from the database ALL");
//     sql:ParameterizedQuery query = `SELECT * FROM profile`;
//     stream<record {}, error?> resultStream = dbClient1->query(query);
//     record {}|error? result = check resultStream.next();
//     if (result is record {}) {
//         return result.toJson();
//     } else {
//         return {};
//     }
// }
// public function addProfile(json payload) returns json|error {
//     io:println(payload);
//     io:println("add profile is called from the database");
//     sql:ParameterizedQuery query = `INSERT INTO profile (id, name, mobile, whatsapp, email, location, profileImage) VALUES (${(check payload.id).toString()}, ${(check payload.name).toString()}, ${(check payload.mobile).toString()}, 
//     ${(check payload.whatsapp).toString()}, ${(check payload.email).toString()}, ${(check payload.location).toString()}, 
//     ${(check payload.profileImage).toString()})`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success" };
//     } else {
//         return { "status": "error" };
//     }
// }
// // Insert trace
// public function insertTrace(int id, string location) returns json|error {
//     sql:ParameterizedQuery query = `INSERT INTO trace (id, timestamp, location) VALUES (${id}, CURRENT_TIMESTAMP(), ${location})`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     // Extract lat and lon from the location string
//     int? index = location.indexOf("_");
//     if (index is int) {
//         string latStr = location.substring(0,index);
//         string lonStr = location.substring(index + 1);
//         decimal lat = check decimal:fromString(latStr);
//         decimal lon = check decimal:fromString(lonStr);
//         _ = check updateCurrentLocation(id, lat, lon);
//     }
//     if (result is sql:ExecutionResult) {
//         return { "status": "success", "message": "Trace inserted successfully" };
//     } else {
//         return { "status": "error", "message": "Failed to insert trace" };
//     }
// }
// // Get current location
// public function getCurrentLocation(int userId) returns json|error {
//     sql:ParameterizedQuery query = `SELECT lat, lon FROM current_location WHERE id = ${userId}`;
//     stream<record {}, error?> resultStream = dbClient1->query(query);
//     record {}|error? result = check resultStream.next();
//     if (result is record {}) {
//         return result.toJson();
//     } else {
//         return { "status": "error", "message": "Current location not found" };
//     }
// }

// // Update or insert current location
// public function updateCurrentLocation(int userId, decimal lat, decimal lon) returns json|error {
//     // First, check if a record exists for the given userId
//     sql:ParameterizedQuery checkQuery = `SELECT id FROM current_location WHERE id = ${userId}`;
//     stream<record {}, error?> checkStream = dbClient1->query(checkQuery);
//     record {}|error? checkResult = checkStream.next();

//     sql:ParameterizedQuery query;
//     if (checkResult is ()) {
//         // If no record exists, insert a new one
//         query = `INSERT INTO current_location (id, lat, lon) VALUES (${userId}, ${lat}, ${lon})`;
//     } else {
//         // If a record exists, update it
//         query = `UPDATE current_location SET lat = ${lat}, lon = ${lon} WHERE id = ${userId}`;
//     }
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success", "message": "Current location upserted successfully" };
//     } else {
//         return { "status": "error", "message": "Failed to upsert current location" };
//     }
// }


// // Insert danger zone
// public function insertDangerZone(int id, decimal lat, decimal lon, string description) returns json|error {
//     sql:ParameterizedQuery query = `INSERT INTO danger_zone (id, lat, lon, description) VALUES (${id}, ${lat}, ${lon}, ${description})`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success", "message": "Danger zone inserted successfully" };
//     } else {
//         return { "status": "error", "message": "Failed to insert danger zone" };
//     }
// }

// // Insert current location
// public function insertCurrentLocation(int id, decimal lat, decimal lon) returns json|error {
//     sql:ParameterizedQuery query = `INSERT INTO current_location (id, lat, lon) VALUES (${id}, ${lat}, ${lon})`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success", "message": "Current location inserted successfully" };
//     } else {
//         return { "status": "error", "message": "Failed to insert current location" };
//     }
// }

// // Insert relationship
// public function insertRelationship(int user1, int user2) returns json|error {
//     sql:ParameterizedQuery query = `INSERT INTO relationship (user1, user2) VALUES (${user1}, ${user2})`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success", "message": "Relationship inserted successfully" };
//     } else {
//         return { "status": "error", "message": "Failed to insert relationship" };
//     }
// }

// // Update profile
// public function updateProfile(int id, json payload) returns json|error {
//     sql:ParameterizedQuery query = `UPDATE profile SET 
//         name = ${(check payload.name).toString()}, 
//         mobile = ${(check payload.mobile).toString()}, 
//         whatsapp = ${(check payload.whatsapp).toString()}, 
//         email = ${(check payload.email).toString()}, 
//         location = ${(check payload.location).toString()}, 
//         profileImage = ${(check payload.profileImage).toString()} 
//         WHERE id = ${id}`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success", "message": "Profile updated successfully" };
//     } else {
//         return { "status": "error", "message": "Failed to update profile" };
//     }
// }

// // Update relationship
// public function updateRelationship(int user1, int user2, int newUser2) returns json|error {
//     sql:ParameterizedQuery query = `UPDATE relationship SET user2 = ${newUser2} WHERE user1 = ${user1} AND user2 = ${user2}`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success", "message": "Relationship updated successfully" };
//     } else {
//         return { "status": "error", "message": "Failed to update relationship" };
//     }
// }

// // Delete profile
// public function deleteProfile(int id) returns json|error {
//     sql:ParameterizedQuery query = `DELETE FROM profile WHERE id = ${id}`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success", "message": "Profile deleted successfully" };
//     } else {
//         return { "status": "error", "message": "Failed to delete profile" };
//     }
// }



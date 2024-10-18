import ballerinax/mysql.driver as _;
import ballerinax/mysql;
import ballerina/sql;
import ballerina/io;

// MySQL Database configuration
configurable string dbUser = "root";
configurable string dbPassword = "root";
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "safe_sri_lanka";

mysql:Client dbClient1 = check new (host = dbHost, user = dbUser, password = dbPassword, database = dbName, port = dbPort, options = {
});

public function getUserProfile(string userId) returns json|error {
    io:println(userId);
    io:println("get user profile is called from the database");
    sql:ParameterizedQuery query = `SELECT * FROM profile WHERE id = ${userId}`;
    stream<record {}, error?> resultStream = dbClient1->query(query);
    record {}|error? result = check resultStream.next();
    io:println(result);
    if (result is record {}) {
        return result.toJson();
    } else {
        return {};
    }
}
public function getUserProfiles() returns json|error {
    io:println("get user profiles is called from the database");
    sql:ParameterizedQuery query = `SELECT * FROM profile`;
    stream<record {}, error?> resultStream = dbClient1->query(query);
    json[] profiles = [];
    error? e = resultStream.forEach(function(record {} profile) {
        profiles.push(profile.toJson());
    });
    if (e is error) {
        return e;
    }
    return profiles.toJson();
}
// public function addProfile(json payload) returns json|error {
//     io:println(payload);
//     io:println("add profile is called from the database");
//     //sql:ParameterizedQuery query = `INSERT INTO profile (id, name, mobile, whatsapp, email, location, profileImage) VALUES (${(check payload.id).toString()}, ${(check payload.name).toString()}, ${(check payload.mobile).toString()}, 
//     //${(check payload.whatsapp).toString()}, ${(check payload.email).toString()}, ${(check payload.location).toString()}, 
//     //${(check payload.profileImage).toString()})`;

//     sql:ParameterizedQuery query = `
//     CALL AddProfile(${(check payload.name).toString()}, ${(check payload.mobile).toString()}, 
//     ${(check payload.whatsapp).toString()}, ${(check payload.email).toString()}, ${(check payload.location).toString()}, 
//     ${(check payload.profileImage).toString()}, @id);
//     SELECT @id AS id;`;
//     sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
//     if (result is sql:ExecutionResult) {
//         return { "status": "success" };
//     } else {
//         return { "status": "error" };
//     }
// }

public function addProfile(json payload) returns json|error {
    io:println(payload);
    io:println("add profile is called from the database");
    
    sql:ParameterizedQuery callQuery = `
    CALL InsertProfile(${(check payload.name).toString()}, ${(check payload.mobile).toString()}, 
    ${(check payload.whatsapp).toString()}, ${(check payload.email).toString()}, ${(check payload.location).toString()}, 
    ${(check payload.profileImage).toString()}, @id);`;
    
    sql:ExecutionResult|sql:Error callResult = dbClient1->execute(callQuery);
    
    if (callResult is sql:Error) {
        return { "status": "error", "message": callResult.message() };
    }
    
    sql:ParameterizedQuery selectQuery = `SELECT @id AS new_id;`;
    stream<record {}, sql:Error?> resultStream = dbClient1->query(selectQuery);
    record {|record {} value;|}|sql:Error? result = resultStream.next();
    
    if (result is record {|record {} value;|}) {
        int|error id = int:fromString(result.value["new_id"].toString());
        if (id is int) {
            return { "status": "success", "id": id };
        } else {
            return { "status": "error", "message": "Failed to parse ID" };
        }
    } else if (result is sql:Error) {
        return { "status": "error", "message": result.message() };
    } else {
        return { "status": "error", "message": "No result returned" };
    }
}
// Insert trace
public function insertTrace(int id, string location) returns json|error {
    sql:ParameterizedQuery query = `INSERT INTO trace (id, timestamp, location) VALUES (${id}, CURRENT_TIMESTAMP(), ${location})`;
    sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
    // Extract lat and lon from the location string
    int? index = location.indexOf("_");
    if (index is int) {
        string latStr = location.substring(0,index);
        string lonStr = location.substring(index + 1);
        decimal lat = check decimal:fromString(latStr);
        decimal lon = check decimal:fromString(lonStr);
        _ = check updateCurrentLocation(id, lat, lon);
    }
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Trace inserted successfully" };
    } else {
        return { "status": "error", "message": "Failed to insert trace" };
    }
}

// Insert danger zone
public function insertDangerZone(decimal lat, decimal lon, string description) returns json|error {
    sql:ParameterizedQuery query = `INSERT INTO danger_zone (lat, lon, description) VALUES (${lat}, ${lon}, ${description})`;
    sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Danger zone inserted successfully" };
    } else {
        return { "status": "error", "message": "Failed to insert danger zone" };
    }
}

// Insert current location
public function insertCurrentLocation(int id, decimal lat, decimal lon) returns json|error {
    sql:ParameterizedQuery query = `INSERT INTO current_location (id, lat, lon) VALUES (${id}, ${lat}, ${lon})`;
    sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Current location inserted successfully" };
    } else {
        return { "status": "error", "message": "Failed to insert current location" };
    }
}

// Insert relationship
public function insertRelationship(int user1, int user2) returns json|error {
    sql:ParameterizedQuery query = `INSERT INTO relationship (user1, user2) VALUES (${user1}, ${user2})`;
    sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Relationship inserted successfully" };
    } else {
        return { "status": "error", "message": "Failed to insert relationship" };
    }
}

// Update current location
public function updateCurrentLocation(int userId, decimal lat, decimal lon) returns json|error {
    // First, check if a record exists for the given userId
    sql:ParameterizedQuery checkQuery = `SELECT id FROM current_location WHERE id = ${userId}`;
    stream<record {}, error?> checkStream = dbClient1->query(checkQuery);
    record {}|error? checkResult = checkStream.next();

    sql:ParameterizedQuery query;
    if (checkResult is ()) {
        // If no record exists, insert a new one
        query = `INSERT INTO current_location (id, lat, lon) VALUES (${userId}, ${lat}, ${lon})`;
    } else {
        // If a record exists, update it
        query = `UPDATE current_location SET lat = ${lat}, lon = ${lon} WHERE id = ${userId}`;
    }
    sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Current location upserted successfully" };
    } else {
        return { "status": "error", "message": "Failed to upsert current location" };
    }
}
// Update profile
public function updateProfile(int id, json payload) returns json|error {
    sql:ParameterizedQuery query = `UPDATE profile SET 
        name = ${(check payload.name).toString()}, 
        mobile = ${(check payload.mobile).toString()}, 
        whatsapp = ${(check payload.whatsapp).toString()}, 
        email = ${(check payload.email).toString()}, 
        location = ${(check payload.location).toString()}, 
        profileImage = ${(check payload.profileImage).toString()} 
        WHERE id = ${id}`;
    sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Profile updated successfully" };
    } else {
        return { "status": "error", "message": "Failed to update profile" };
    }
}


public function getRelationship(int id) returns json|error {
    sql:ParameterizedQuery query = `SELECT * FROM relationship INNER JOIN profile ON relationship.user2 = profile.id WHERE user1 = ${id}`;
    stream<record {}, error?> resultStream = dbClient1->query(query);
    json[] relationships = [];
    check from record {} relationship in resultStream
        do {
            relationships.push(relationship.toJson());
        };
    io:println(relationships);
    if relationships.length() > 0 {
        return { "status": "success", "relationships": relationships };
    } else {
        return { "status": "success", "relationships": [] };
    }
}

// Delete relationship
public function deleteRelationship(int user1, int user2) returns json|error {
    sql:ParameterizedQuery query = `DELETE FROM relationship WHERE user1 = ${user1} AND user2 = ${user2}`;
    sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Relationship deleted successfully" };
    } else {
        return { "status": "error", "message": "Failed to delete relationship" };
    }
}

// Delete profile
public function deleteProfile(int id) returns json|error {
    sql:ParameterizedQuery query = `DELETE FROM profile WHERE id = ${id}`;
    sql:ExecutionResult|sql:Error result = dbClient1->execute(query);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Profile deleted successfully" };
    } else {
        return { "status": "error", "message": "Failed to delete profile" };
    }
}



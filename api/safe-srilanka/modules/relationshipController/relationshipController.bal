import safe_srilanka.relationshipModel;
import ballerina/sql;
import ballerina/log;

public function insertRelationship(json payload) returns json|error {
    log:printInfo("Inserting new relationship");
    int user1 = check int:fromString((check payload.user1).toString());
    int user2 = check int:fromString((check payload.user2).toString());

    var result = relationshipModel:insertRelationship(user1, user2);
    if (result is sql:ExecutionResult) {
        log:printInfo("Relationship inserted successfully");
        return { "status": "success", "message": "Relationship inserted successfully" };
    } else {
        log:printError("Error inserting relationship", 'error = result);
        return { "status": "error", "message": "Failed to insert relationship" };
    }
}

public function getRelationship(json payload) returns json|error {
    log:printInfo("Fetching relationship");
    int id = check int:fromString((check payload.id).toString());
    var resultStream = relationshipModel:getRelationship(id);
    json[] relationships = [];

    check from var relationship in resultStream
        do {
            relationships.push(relationship.toJson());
        };

    if relationships.length() > 0 {
        log:printInfo("Relationships fetched successfully", count = relationships.length());
        return { "status": "success", "relationships": relationships };
    } else {
        log:printInfo("No relationships found for the given id", id = id);
        return { "status": "success", "relationships": [] };
    }
}

public function deleteRelationship(json payload) returns json|error {
    log:printInfo("Deleting relationship");
    int user1 = check int:fromString((check payload.user1).toString());
    int user2 = check int:fromString((check payload.user2).toString());

    var result = relationshipModel:deleteRelationship(user1, user2);
    if (result is sql:ExecutionResult) {
        log:printInfo("Relationship deleted successfully");
        return { "status": "success", "message": "Relationship deleted successfully" };
    } else {
        log:printError("Error deleting relationship", 'error = result);
        return { "status": "error", "message": "Failed to delete relationship" };
    }
}

public function getNearbyFriends(json payload) returns json|error {
    log:printInfo("Fetching nearby friends");
    int userId = check int:fromString((check payload.userId).toString());
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());
    decimal radius = check decimal:fromString((check payload.radius).toString());

    // Call the model function to get nearby friends
    var resultStream = relationshipModel:getNearbyFriends(userId, lat, lon, radius);
    json[] nearbyFriends = [];

    // Process the result stream
    check from var friend in resultStream
        do {
            nearbyFriends.push(friend.toJson());
        };

    if nearbyFriends.length() > 0 {
        log:printInfo("Nearby friends fetched successfully", count = nearbyFriends.length());
        return { "status": "success", "nearbyFriends": nearbyFriends };
    } else {
        log:printInfo("No nearby friends found", userId = userId, lat = lat, lon = lon, radius = radius);
        return { "status": "success", "nearbyFriends": [] };
    }
}

import ballerina/io;
import safe_srilanka.relationshipModel;
import ballerina/sql;

public function insertRelationship(json payload) returns json|error {
    int user1 = check payload.user1.ensureType();
    int user2 = check payload.user2.ensureType();

    var result = relationshipModel:insertRelationship(user1, user2);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Relationship inserted successfully" };
    } else {
        io:println("Error inserting relationship: ", result.message());
        return { "status": "error", "message": "Failed to insert relationship" };
    }
}

public function getRelationship(int id) returns json|error {
    var resultStream = relationshipModel:getRelationship(id);
    json[] relationships = [];

    check from var relationship in resultStream
        do {
            relationships.push(relationship.toJson());
        };

    if relationships.length() > 0 {
        return { "status": "success", "relationships": relationships };
    } else {
        return { "status": "success", "relationships": [] };
    }
}

public function deleteRelationship(json payload) returns json|error {
    int user1 = check payload.user1.ensureType();
    int user2 = check payload.user2.ensureType();

    var result = relationshipModel:deleteRelationship(user1, user2);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Relationship deleted successfully" };
    } else {
        io:println("Error deleting relationship: ", result.message());
        return { "status": "error", "message": "Failed to delete relationship" };
    }
}

public function getNearbyFriends(json payload) returns json|error {
    int userId = check payload.userId.ensureType();
    decimal lat = check payload.lat.ensureType();
    decimal lon = check payload.lon.ensureType();
    decimal radius = check payload.radius.ensureType();

    // Call the model function to get nearby friends
    var resultStream = relationshipModel:getNearbyFriends(userId, lat, lon, radius);
    json[] nearbyFriends = [];

    // Process the result stream
    check from var friend in resultStream
        do {
            nearbyFriends.push(friend.toJson());
        };

    if nearbyFriends.length() > 0 {
        return { "status": "success", "nearbyFriends": nearbyFriends };
    } else {
        return { "status": "success", "nearbyFriends": [] };
    }
}


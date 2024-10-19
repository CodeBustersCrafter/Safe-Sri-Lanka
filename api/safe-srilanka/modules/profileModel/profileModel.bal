import ballerinax/mysql;
import ballerina/sql;
import ballerina/io;
import safe_srilanka.database as database;
import safe_srilanka.models as models;

mysql:Client dbClient = database:getClient();
public function getUserProfile(string userId) returns stream<record {}, error?> {
    io:println(userId);
    io:println("get user profile is called from the database");
    sql:ParameterizedQuery query = `SELECT * FROM profile WHERE id = ${userId}`;
    stream<record {}, error?> resultStream = dbClient->query(query);
    io:println(resultStream);
    return resultStream;
}
public function getUserProfiles(string userId) returns stream<record {}, error?> {
    io:println("get user profiles is called from the database");
    io:println("Fetching profiles for user ID: " + userId);
    sql:ParameterizedQuery query = `SELECT * FROM profile WHERE NOT id = ${userId}`;
    stream<record {}, error?> resultStream = dbClient->query(query);
    return resultStream;
}

public function addProfile(models:UserProfile payload) returns json|error {
    io:println(payload);
    io:println("add profile is called from the database");

    // First part: Insert the profile
    sql:ParameterizedQuery insertQuery = `
    CALL InsertProfile(${(payload.name).toString()}, ${(payload.mobile).toString()}, 
    ${(payload.whatsapp).toString()}, ${(payload.email).toString()}, ${(payload.location).toString()}, 
    ${(payload.profileImage).toString()}, @id);`;
    
    sql:ExecutionResult|sql:Error insertResult = dbClient->execute(insertQuery);
    
    if (insertResult is sql:Error) {
        return { "status": "error", "message": insertResult.message() };
    }
    
    // Second part: Retrieve the inserted ID
    sql:ParameterizedQuery selectQuery = `SELECT @id AS new_id;`;
    stream<record {}, error?> resultStream = dbClient->query(selectQuery);
    record {}|error? result = resultStream.next();
    
    if (result is record {}) {
        int|error id = int:fromString(result["new_id"].toString());
        if (id is int) {
            return { "status": "success", "id": id };
        } else {
            return { "status": "error", "message": "Failed to parse ID" };
        }
    } else if (result is error) {
        return { "status": "error", "message": error:message(result) };
    } else {
        return { "status": "error", "message": "No result returned" };
    }
}
// Update profile
public function updateProfile(models:UserProfile payload) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery query = `UPDATE profile SET 
        name = ${(payload.name).toString()}, 
        mobile = ${(payload.mobile).toString()}, 
        whatsapp = ${(payload.whatsapp).toString()}, 
        email = ${(payload.email).toString()}, 
        location = ${(payload.location).toString()}, 
        profileImage = ${(payload.profileImage).toString()} 
        WHERE id = ${payload.id}`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    return result;
}

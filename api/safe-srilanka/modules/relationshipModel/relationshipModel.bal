import ballerinax/mysql;
import ballerina/sql;
import safe_srilanka.database as database;

mysql:Client dbClient = database:getClient();

// Insert relationship
public function insertRelationship(int user1, int user2) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery query = `INSERT INTO relationship (user1, user2) VALUES (${user1}, ${user2})`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    return result;
}

public function getRelationship(int id) returns stream<record {}, error?> {
    sql:ParameterizedQuery query = `SELECT * FROM relationship INNER JOIN profile ON relationship.user2 = profile.id WHERE user1 = ${id}`;
    stream<record {}, error?> resultStream = dbClient->query(query);
    return resultStream;
}

// Delete relationship
public function deleteRelationship(int user1, int user2) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery query = `DELETE FROM relationship WHERE user1 = ${user1} AND user2 = ${user2}`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    return result;
}

public function getNearbyFriends(int userId, decimal lat, decimal lon, decimal radius) returns stream<record {}, error?> {
    sql:ParameterizedQuery query = `SELECT * FROM relationship INNER JOIN profile ON relationship.user2 = profile.id WHERE user1 = ${userId} AND ST_Distance_Sphere(POINT(${lon}, ${lat}), profile.location) <= ${radius}`;
    stream<record {}, error?> resultStream = dbClient->query(query);
    return resultStream;
}

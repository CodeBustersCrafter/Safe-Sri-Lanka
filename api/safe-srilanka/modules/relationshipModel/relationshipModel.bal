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
    sql:ParameterizedQuery query = `
        SELECT r.user2 as id, p.name, p.mobile, p.whatsapp, p.email, p.profileImage, cl.lat, cl.lon,
               (6371 * acos(cos(radians(${lat})) * cos(radians(cl.lat)) * cos(radians(cl.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(cl.lat)))) AS distance
        FROM relationship r
        INNER JOIN profile p ON r.user2 = p.id
        INNER JOIN current_location cl ON r.user2 = cl.id
        WHERE r.user1 = ${userId}
        HAVING distance < ${radius}
        ORDER BY distance
    `;
    stream<record {}, error?> resultStream = dbClient->query(query);
    return resultStream;
}

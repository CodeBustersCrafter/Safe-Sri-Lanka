import ballerinax/mysql;
import ballerina/sql;
import ballerina/io;
import safe_srilanka.database as database;

mysql:Client dbClient = database:getClient();

public function getNearbyDangerZones(decimal userLat, decimal userLon, decimal radius) returns stream<record {}, error?> {
    io:println("getNearbyDangerZones is called from the database");
    sql:ParameterizedQuery query = `
        SELECT id, lat, lon, description, 
               (6371 * acos(cos(radians(${userLat})) * cos(radians(lat)) * cos(radians(lon) - radians(${userLon})) + sin(radians(${userLat})) * sin(radians(lat)))) AS distance
        FROM danger_zone
        HAVING distance < ${radius}
        ORDER BY distance
    `;

    stream<record {}, error?> resultStream = dbClient->query(query);
    return resultStream;
}
public function insertDangerZone(decimal lat, decimal lon, string description) returns sql:ExecutionResult|sql:Error {
    io:println("insertDangerZone is called from the database");
    sql:ParameterizedQuery query = `INSERT INTO danger_zone (lat, lon, description) VALUES (${lat}, ${lon}, ${description})`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    return result;
}
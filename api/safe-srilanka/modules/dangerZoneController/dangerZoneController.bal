import ballerinax/mysql;
import ballerina/sql;
import ballerina/io;

// MySQL Database configuration
configurable string dbUser = "root";
configurable string dbPassword = "root";
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "safe_sri_lanka";

mysql:Client dbClient = check new (host = dbHost, user = dbUser, password = dbPassword, database = dbName, port = dbPort, options = {
});

public function getNearbyDangerZones(decimal userLat, decimal userLon, decimal radius) returns json|error {
    io:println("Fetching nearby danger zones");
    sql:ParameterizedQuery query = `
        SELECT id, lat, lon, description, 
               (6371 * acos(cos(radians(${userLat})) * cos(radians(lat)) * cos(radians(lon) - radians(${userLon})) + sin(radians(${userLat})) * sin(radians(lat)))) AS distance
        FROM danger_zone
        HAVING distance < ${radius}
        ORDER BY distance
    `;

    stream<record {}, error?> resultStream = dbClient->query(query);

    json[] dangerZones = [];
    check from record {} entry in resultStream
        do {
            dangerZones.push({
                id: entry["id"],
                lat: entry["lat"],
                lon: entry["lon"],
                description: entry["description"],
                distance: entry["distance"]
            }.toJson());
        };

    io:println(dangerZones);
    if dangerZones.length() > 0 {
        return { "status": "success", "dangerZones": dangerZones };
    } else {
        return { "status": "success", "dangerZones": [] };
    }
}

public function insertDangerZone(decimal lat, decimal lon, string description) returns json|error {
    io:println("Inserting new danger zone");
    sql:ParameterizedQuery query = `INSERT INTO danger_zone (lat, lon, description) VALUES (${lat}, ${lon}, ${description})`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Danger zone inserted successfully" };
    } else {
        return { "status": "error", "message": "Failed to insert danger zone" };
    }
}

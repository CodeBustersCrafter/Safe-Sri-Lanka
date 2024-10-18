import ballerinax/mysql;
import ballerina/sql;
import ballerina/io;

configurable string dbUser = "root";
configurable string dbPassword = "Akindu/19275";
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "safe_sri_lanka";

mysql:Client dbClient = check new (host = dbHost, user = dbUser, password = dbPassword, database = dbName, port = dbPort);

public function getNearbyFriends(int userId, decimal userLat, decimal userLon, decimal radius) returns json|error {
    io:println("Fetching nearby friends");
    sql:ParameterizedQuery query = `
        SELECT p.id, p.name, p.profileImage, cl.lat, cl.lon,
               (6371 * acos(cos(radians(${userLat})) * cos(radians(cl.lat)) * cos(radians(cl.lon) - radians(${userLon})) + sin(radians(${userLat})) * sin(radians(cl.lat)))) AS distance
        FROM profile p
        JOIN current_location cl ON p.id = cl.id
        JOIN relationship r ON r.user2 = p.id
        WHERE r.user1 = ${userId}
        HAVING distance < ${radius}
        ORDER BY distance
    `;

    stream<record {}, error?> resultStream = dbClient->query(query);

    json[] friends = [];
    check from record {} entry in resultStream
        do {
            friends.push({
                id: entry["id"],
                name: entry["name"],
                profileImage: entry["profileImage"],
                lat: entry["lat"],
                lon: entry["lon"],
                distance: entry["distance"]
            }.toJson());
        };

    io:println("Friends: ", friends);
    if friends.length() > 0 {
        return { "status": "success", "friends": friends };
    } else {
        return { "status": "success", "friends": [] };
    }
}


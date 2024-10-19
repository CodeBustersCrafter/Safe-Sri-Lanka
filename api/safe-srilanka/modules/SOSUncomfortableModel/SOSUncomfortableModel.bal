import ballerinax/mysql;
import ballerina/sql;
import safe_srilanka.database as database;

mysql:Client dbClient = database:getClient();
public function insertUncomfortableSignal(int senderId, decimal lat, decimal lon, string description) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery query = `INSERT INTO uncomfortable_signal (sender_id, lat, lon, description) VALUES (${senderId}, ${lat}, ${lon}, ${description})`;
    return dbClient->execute(query);
}

public function getRecipientsForUncomfortable(int senderId, decimal lat, decimal lon) returns stream<record {}, error?> {
    sql:ParameterizedQuery query = `
        (SELECT p.id, p.name, p.mobile, p.whatsapp
        FROM relationship r
        JOIN profile p ON r.user2 = p.id
        WHERE r.user1 = ${senderId})
        UNION
        (SELECT p.id, p.name, p.mobile, p.whatsapp
        FROM profile p
        JOIN current_location cl ON p.id = cl.id
        WHERE p.id != ${senderId}
        AND (6371 * acos(cos(radians(${lat})) * cos(radians(cl.lat)) * cos(radians(cl.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(cl.lat)))) < 5)
    `;

    return dbClient->query(query);
}

public function getUncomfortableDetails(int uncomfortableId) returns record {}|error? {
    sql:ParameterizedQuery query = `
        SELECT u.*, p.name as sender_name
        FROM uncomfortable_signal u
        JOIN profile p ON u.sender_id = p.id
        WHERE u.id = ${uncomfortableId}
    `;

    stream<record {}, error?> resultStream = dbClient->query(query);
    return resultStream.next();
}

public function getNearbyUncomfortableSignals(decimal lat, decimal lon, decimal radius = 5) returns stream<record {}, error?> {
    sql:ParameterizedQuery query = `
        SELECT u.id, u.sender_id, u.lat, u.lon, u.timestamp, u.description, p.name as sender_name,
               (6371 * acos(cos(radians(${lat})) * cos(radians(u.lat)) * cos(radians(u.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(u.lat)))) AS distance
        FROM uncomfortable_signal u
        JOIN profile p ON u.sender_id = p.id
        WHERE u.is_active = TRUE
        HAVING distance < ${radius}
        ORDER BY u.timestamp DESC
        LIMIT 10
    `;

    return dbClient->query(query);
}

public function deactivateUncomfortableSignal(int uncomfortableId) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery query = `DELETE FROM uncomfortable_signal WHERE id = ${uncomfortableId}`;
    return dbClient->execute(query);
}

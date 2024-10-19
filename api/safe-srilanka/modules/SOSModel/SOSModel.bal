import ballerinax/mysql;
import ballerina/sql;
import safe_srilanka.database as database;

mysql:Client dbClient = database:getClient();

public function insertSOSSignal(int senderId, decimal lat, decimal lon) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery query = `INSERT INTO sos_signal (sender_id, lat, lon) VALUES (${senderId}, ${lat}, ${lon})`;
    return dbClient->execute(query);
}

public function getSOSDetails(int sosId) returns record {}|error? {
    sql:ParameterizedQuery query = `
        SELECT s.*, p.name as sender_name
        FROM sos_signal s
        JOIN profile p ON s.sender_id = p.id
        WHERE s.id = ${sosId}
    `;

    stream<record {}, error?> resultStream = dbClient->query(query);
    return resultStream.next();
}

public function getNearbySOSSignals(decimal lat, decimal lon, decimal radius) returns stream<record {}, error?> {
    sql:ParameterizedQuery query = `
        SELECT s.id, s.sender_id, s.lat, s.lon, s.timestamp, p.name as sender_name,
               (6371 * acos(cos(radians(${lat})) * cos(radians(s.lat)) * cos(radians(s.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(s.lat)))) AS distance
        FROM sos_signal s
        JOIN profile p ON s.sender_id = p.id
        WHERE s.is_active = TRUE
        HAVING distance < ${radius}
        ORDER BY s.timestamp DESC
        LIMIT 10
    `;

    return dbClient->query(query);
}

public function updateSOSOTP(int sosId, string otp) returns sql:ExecutionResult|error {
    sql:ParameterizedQuery query = `UPDATE sos_signal SET otp = ${otp} WHERE id = ${sosId}`;
    return dbClient->execute(query);
}

public function verifyAndDeleteSOSSignal(int sosId, string otp) returns sql:ExecutionResult|error? {
    sql:ParameterizedQuery verifyQuery = `SELECT * FROM sos_signal WHERE id = ${sosId} AND otp = ${otp}`;
    stream<record {}, error?> resultStream = dbClient->query(verifyQuery);
    record {}|error? result = check resultStream.next();

    if (result is record {}) {
        sql:ParameterizedQuery deleteQuery = `DELETE FROM sos_signal WHERE id = ${sosId}`;
        return dbClient->execute(deleteQuery);
    }

    return null;
}

public function getRecipientsForSOS(int senderId, decimal lat, decimal lon) returns stream<record {}, error?> {
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

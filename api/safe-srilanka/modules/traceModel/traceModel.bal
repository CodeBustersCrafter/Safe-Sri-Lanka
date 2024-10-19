import ballerinax/mysql;
import ballerina/sql;
import safe_srilanka.database as database;

mysql:Client dbClient = database:getClient();

public function insertTrace(int id, string location) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery query = `INSERT INTO trace (id, timestamp, location) VALUES (${id}, CURRENT_TIMESTAMP(), ${location})`;
    return dbClient->execute(query);
}

public function insertCurrentLocation(int id, decimal lat, decimal lon) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery query = `INSERT INTO current_location (id, lat, lon) VALUES (${id}, ${lat}, ${lon})`;
    return dbClient->execute(query);
}

public function updateCurrentLocation(int userId, decimal lat, decimal lon) returns sql:ExecutionResult|sql:Error {
    sql:ParameterizedQuery checkQuery = `SELECT id FROM current_location WHERE id = ${userId}`;
    stream<record {}, error?> checkStream = dbClient->query(checkQuery);
    record {}|error? checkResult = checkStream.next();

    sql:ParameterizedQuery query;
    if (checkResult is ()) {
        query = `INSERT INTO current_location (id, lat, lon) VALUES (${userId}, ${lat}, ${lon})`;
    } else {
        query = `UPDATE current_location SET lat = ${lat}, lon = ${lon} WHERE id = ${userId}`;
    }
    return dbClient->execute(query);
}

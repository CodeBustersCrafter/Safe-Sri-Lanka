import ballerinax/mysql.driver as _;
import ballerinax/mysql;
import ballerina/sql;
import ballerina/io;
// MySQL Database configuration
configurable string dbUser = "root";
configurable string dbPassword = "root";
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "safe_sri_lanka";

mysql:Client dbClient1 = check new (host = dbHost, user = dbUser, password = dbPassword, database = dbName, port = dbPort, options = {
});

public function getUserProfile(string userId) returns json|error {
    io:println(userId);
    io:println("get user profile is called from the database");
    sql:ParameterizedQuery query = `SELECT * FROM profile WHERE id = ${userId}`;
    stream<record {}, error?> resultStream = dbClient1->query(query);
    record {}|error? result = check resultStream.next();
    if (result is record {}) {
        return result.toJson();
    } else {
        return {};
    }
}
public function getUserProfiles() returns json|error {
    io:println("get user profile is called from the database ALL");
    sql:ParameterizedQuery query = `SELECT * FROM profile`;
    stream<record {}, error?> resultStream = dbClient1->query(query);
    record {}|error? result = check resultStream.next();
    if (result is record {}) {
        return result.toJson();
    } else {
        return {};
    }
}


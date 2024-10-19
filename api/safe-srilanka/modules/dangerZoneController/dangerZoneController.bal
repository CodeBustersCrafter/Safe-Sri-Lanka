import ballerina/io;
import ballerina/sql;
import safe_srilanka.dangerZoneModel as dangerZoneModel;
import safe_srilanka.models as models;
import ballerina/log;
public function getNearbyDangerZones(json payload) returns json|error {
    io:println("Fetching nearby danger zones");
    decimal userLat = check decimal:fromString((check payload.lat).toString());
    decimal userLon = check decimal:fromString((check payload.lon).toString());
    decimal radius = check decimal:fromString((check payload.radius).toString());
    stream<record {}, error?> resultStream = dangerZoneModel:getNearbyDangerZones(userLat, userLon, radius);
    json[] dangerZones = [];
    error? streamError = from record {} entry in resultStream
        do {
            models:DangerZone dangerZone = {
                id: <int>entry["id"],
                lat: <decimal>entry["lat"],
                lon: <decimal>entry["lon"],
                description: <string>entry["description"],
                distance: <decimal>entry["distance"]
            };
            dangerZones.push(dangerZone.toJson());
        };

    if (streamError is error) {
        return { "status": "error", "message": streamError.message() };
    }

    io:println(dangerZones);
    if dangerZones.length() > 0 {
        return { "status": "success", "dangerZones": dangerZones };
    } else {
        return { "status": "success", "dangerZones": [] };
    }
}

public function insertDangerZone(json payload) returns json|error {
    io:println("Inserting new danger zone");
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());
    string description = check payload.description.ensureType();
    sql:ExecutionResult|sql:Error result = dangerZoneModel:insertDangerZone(lat, lon, description);
    if result is sql:ExecutionResult {
        return { "status": "success", "message": "Danger zone inserted successfully" };
    } else {
        log:printInfo(result.message());
        return { "status": "error", "message": "Failed to insert danger zone: " + result.message() };
    }
}

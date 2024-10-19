import safe_srilanka.traceModel;
import ballerina/sql;

// Insert trace
public function insertTrace(json payload) returns json|error {
    int id = check int:fromString((check payload.id).toString());
    string location = check payload.location.ensureType();
    if (location == "") {
        return error("Location cannot be empty");
    }
    sql:ExecutionResult|sql:Error result = check traceModel:insertTrace(id, location);
    // Extract lat and lon from the location string
    if (result is sql:ExecutionResult) {
        int? index = location.indexOf("_");
        if (index is int) {
            string latStr = location.substring(0, index);
            string lonStr = location.substring(index + 1);
            decimal lat = check decimal:fromString(latStr);
            decimal lon = check decimal:fromString(lonStr);
            json updateResult = updateCurrentLocation(id, lat, lon);
            return { "status": "success", "message": "Trace inserted successfully", "currentLocation": updateResult };
        }
        return { "status": "error", "message": "Trace inserted successfully. but failed to update current location" };
    } else {
        return { "status": "error", "message": "Failed to insert trace" };
    }
}

// Insert current location
public function insertCurrentLocation(json payload) returns json|error {
    int id = check int:fromString((check payload.id).toString());
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());
    sql:ExecutionResult|sql:Error result = check traceModel:insertCurrentLocation(id, lat, lon);
    
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Current location inserted successfully" };
    } else {
        return { "status": "error", "message": "Failed to insert current location" };
    }
}

// Update current location
public function updateCurrentLocation(int id, decimal lat, decimal lon) returns json {
    sql:ExecutionResult|sql:Error result = traceModel:updateCurrentLocation(id, lat, lon);
    
    if (result is sql:ExecutionResult) {
        return { "status": "success", "message": "Current location upserted successfully" };
    } else {
        return { "status": "error", "message": "Failed to upsert current location" };
    }
}
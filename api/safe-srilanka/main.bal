import ballerina/http;
import safe_srilanka.controllers as controllers;
import safe_srilanka.databaseController as databaseController;
import ballerina/io;

// Define the port for the HTTP listener
const int PORT = 8080;

// Create an HTTP listener
listener http:Listener apiListener = new(PORT);

// Start the services
service /safe_srilanka/helpline on apiListener {
    resource function get helpline() returns json {
        return controllers:getHelplineNumbers();
    }
};

// Mount the FakeCall service
service /safe_srilanka/fakecall on apiListener {
    resource function post initiate(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            return controllers:initiateFakeCall(payload);
        } else {
            return { "error": "Invalid payload" };
        }
    }

    resource function post stop() returns json|error {
        return controllers:stopFakeCall();
    }
}

// Mount the Recordings service
service /safe_srilanka/recordings on apiListener {
    resource function get list() returns json {
        return controllers:listRecordings();
    }

    resource function post add(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            return controllers:addRecording(payload);
        } else {
            return { "error": "Invalid payload" };
        }
    }
}

// Mount the AI Assistant service
service /safe_srilanka/ai_assistant on apiListener {
    resource function post chat(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            return controllers:aiChat(payload);
        } else {
            return { "error": "Invalid payload" };
        }
    }
}
// Profile Service
service /safe_srilanka/profile on apiListener {
    resource function post update(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            return controllers:updateProfile(payload);
        } else {
            return { "error": "Invalid payload" };
        }
    }
    resource function get getProfile(http:Request req, string id) returns json|error  {
        io:println(id);
        io:println("get profile is called");
        return databaseController:getUserProfile(id);
    }
    resource function get getProfiles(http:Request req) returns json|error  {
        io:println("get profiles is called");
        io:println("get profile is called");
        return databaseController:getUserProfiles();
    }
    resource function post addProfile(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            return databaseController:addProfile(payload);
        } else {
            return { "error": "Invalid payload" };
        }
    }

    resource function put update(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check payload.id.ensureType();
            return databaseController:updateProfile(id, payload);
        } else {
            return { "error": "Invalid payload" };
        }
    }

    resource function delete remove(http:Request req, int id) returns json|error {
        return databaseController:deleteProfile(id);
    }
}


// Insert trace
service /safe_srilanka/trace on apiListener {
    resource function post insert(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check payload.id.ensureType();
            string location = check payload.location.ensureType();
            return databaseController:insertTrace(id, location);
        } else {
            return { "error": "Invalid payload" };
        }
    }
}

// Insert danger zone
service /safe_srilanka/dangerZone on apiListener {
    resource function post insert(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check payload.id.ensureType();
            decimal lat = check payload.lat.ensureType();
            decimal lon = check payload.lon.ensureType();
            string description = check payload.description.ensureType();
            return databaseController:insertDangerZone(id, lat, lon, description);
        } else {
            return { "error": "Invalid payload" };
        }
    }
}

// Insert current location
service /safe_srilanka/currentLocation on apiListener {
    resource function post insert(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check payload.id.ensureType();
            decimal lat = check payload.lat.ensureType();
            decimal lon = check payload.lon.ensureType();
            return databaseController:insertCurrentLocation(id, lat, lon);
        } else {
            return { "error": "Invalid payload" };
        }
    }

    resource function put update(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check payload.id.ensureType();
            decimal lat = check payload.lat.ensureType();
            decimal lon = check payload.lon.ensureType();
            return databaseController:updateCurrentLocation(id, lat, lon);
        } else {
            return { "error": "Invalid payload" };
        }
    }
}

// Insert relationship
service /safe_srilanka/relationship on apiListener {
    resource function post insert(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            int user1 = check payload.user1.ensureType();
            int user2 = check payload.user2.ensureType();
            return databaseController:insertRelationship(user1, user2);
        } else {
            return { "error": "Invalid payload" };
        }
    }

    resource function put update(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            int user1 = check payload.user1.ensureType();
            int user2 = check payload.user2.ensureType();
            int newUser2 = check payload.newUser2.ensureType();
            return databaseController:updateRelationship(user1, user2, newUser2);
        } else {
            return { "error": "Invalid payload" };
        }
    }
}


public function main() returns error? {
    // Start the HTTP listener
    check apiListener.'start();
}
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
service /safe_srilanka/profileUpdate on apiListener {
    resource function post update(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            return controllers:updateProfile(payload);
        } else {
            return { "error": "Invalid payload" };
        }
    }
}
service /safe_srilanka/profileGet on apiListener {
    resource function get getProfile(http:Request req, string id) returns json|error  {
        io:println(id);
        io:println("get profile is called");
        return databaseController:getUserProfile(id);
    }
}
service /safe_srilanka/profilesGet on apiListener {
    resource function get getProfiles(http:Request req) returns json|error  {
        io:println("get profiles is called");
        io:println("get profile is called");
        return databaseController:getUserProfiles();
    }
}

service /safe_srilanka/profileAdd on apiListener {
    resource function post addProfile(http:Request req) returns json|error {
        var payload = req.getJsonPayload();
        if (payload is json) {
            return databaseController:addProfile(payload);
        } else {
            return { "error": "Invalid payload" };
        }
    }
}
public function main() returns error? {
    // Start the HTTP listener
    check apiListener.'start();
}
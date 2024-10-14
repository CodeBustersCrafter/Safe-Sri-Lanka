import ballerina/http;
import safe_srilanka.controllers as controllers;

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

    resource function get getProfile(http:Request req, string id) returns json|error {
        return controllers:getProfile(id);
    }
}

public function main() returns error? {
    // Start the HTTP listener
    check apiListener.'start();
}
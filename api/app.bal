import ballerina/http;
import api.controllers;

// Define the port for the HTTP listener
const int PORT = 8080;

// Create an HTTP listener
listener http:Listener apiListener = new(PORT);

// Start the services
service /api on apiListener {
    // Mount the Helpline service
    service /helpline {
        resource function get helpline() returns json {
            return controllers:getHelplineNumbers();
        }
    }

    // Mount the FakeCall service
    service /fakecall {
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
    service /recordings {
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
    service /ai_assistant {
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
    service /profile {
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
}


import ballerina/http;
import safe_srilanka.controllers as controllers;
import safe_srilanka.databaseController as databaseController;
import ballerina/io;
import ballerina/mime;
import ballerina/file;
import ballerina/os;

// Define the port for the HTTP listener
const int PORT = 8080;

// Use environment variable for backend IP
string backendIp = os:getEnv("BACKEND_IP");

// Create an HTTP listener
listener http:Listener apiListener = new(PORT, config = {
    host: backendIp
});

// Start the services
service /safe_srilanka/helpline on apiListener {
    resource function get helpline() returns json {
        io:println("Fetching helpline numbers");
        return controllers:getHelplineNumbers();
    }
};

// Mount the FakeCall service
service /safe_srilanka/fakecall on apiListener {
    resource function post initiate(http:Request req) returns json|error {
        io:println("Initiating fake call");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return controllers:initiateFakeCall(payload);
        } else {
            io:println("Error: Invalid payload for fake call initiation");
            return { "error": "Invalid payload" };
        }
    }

    resource function post stop() returns json|error {
        io:println("Stopping fake call");
        return controllers:stopFakeCall();
    }
}

// Mount the Recordings service
service /safe_srilanka/recordings on apiListener {
    resource function get list() returns json {
        io:println("Listing recordings");
        return controllers:listRecordings();
    }

    resource function post add(http:Request req) returns json|error {
        io:println("Adding new recording");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return controllers:addRecording(payload);
        } else {
            io:println("Error: Invalid payload for adding recording");
            return { "error": "Invalid payload" };
        }
    }
}

// Mount the AI Assistant service
service /safe_srilanka/ai_assistant on apiListener {
    resource function post chat(http:Request req) returns json|error {
        io:println("Processing AI chat request");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return controllers:aiChat(payload);
        } else {
            io:println("Error: Invalid payload for AI chat");
            return { "error": "Invalid payload" };
        }
    }
}
// Profile Service
service /safe_srilanka/database/profile on apiListener {
    resource function get getProfile(http:Request req, string id) returns json|error  {
        io:println("Fetching profile for ID: " + id);
        return databaseController:getUserProfile(id);
    }
    resource function get getProfiles(http:Request req) returns json|error  {
        io:println("Fetching all profiles");
        return databaseController:getUserProfiles();
    }
    resource function post addProfile(http:Request req) returns json|error {
        io:println("Adding new profile");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return databaseController:addProfile(payload);
        } else {
            io:println("Error: Invalid payload for adding profile");
            return { "error": "Invalid payload" };
        }
    }
    resource function post uploadImage(http:Request req) returns json|error {
        io:println("Uploading image");
        var payload = req.getBodyParts();
        if (payload is mime:Entity[]) {
            foreach var part in payload {
                if (part.getContentDisposition().name == "image") {
                    byte[] imageBytes = check part.getByteArray();
                    string base64Image = imageBytes.toBase64();
                    return controllers:uploadImage(base64Image);
                }
            }
            io:println("Error: No profile image found in the payload");
            return { "error": "No profile image found" };
        } else {
            io:println("Error: Invalid payload for uploading image");
            return { "error": "Invalid payload" };
        }
    }

    resource function put update(http:Request req) returns json|error {
        io:println("Updating profile");
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check int:fromString((check payload.id).toString());
            return databaseController:updateProfile(id, payload);
        } else {
            io:println("Error: Invalid payload for profile update");
            return { "error": "Invalid payload" };
        }
    }

    resource function delete remove(http:Request req, int id) returns json|error {
        io:println("Deleting profile with ID: " + id.toString());
        return databaseController:deleteProfile(id);
    }
}


// Insert trace
service /safe_srilanka/database/trace on apiListener {
    resource function post insert(http:Request req) returns json|error {
        io:println("Inserting new trace");
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check int:fromString((check payload.id).toString());
            string location = check payload.location.ensureType();
            return databaseController:insertTrace(id, location);
        } else {
            io:println("Error: Invalid payload for inserting trace");
            return { "error": "Invalid payload" };
        }
    }
}

// Insert danger zone
service /safe_srilanka/database/dangerZone on apiListener {
    resource function post insert(http:Request req) returns json|error {
        io:println("Inserting new danger zone");
        var payload = req.getJsonPayload();
        if (payload is json) {
            decimal lat = check decimal:fromString((check payload.lat).toString());
            decimal lon = check decimal:fromString((check payload.lon).toString());
            string description = check payload.description.ensureType();
            return databaseController:insertDangerZone(lat, lon, description);
        } else {
            io:println("Error: Invalid payload for inserting danger zone");
            return { "error": "Invalid payload" };
        }
    }
}

// Insert current location
service /safe_srilanka/database/currentLocation on apiListener {
    resource function post insert(http:Request req) returns json|error {
        io:println("Inserting current location");
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check int:fromString((check payload.id).toString());
            decimal lat = check decimal:fromString((check payload.lat).toString());
            decimal lon = check decimal:fromString((check payload.lon).toString());
            return databaseController:insertCurrentLocation(id, lat, lon);
        } else {
            io:println("Error: Invalid payload for inserting current location");
            return { "error": "Invalid payload" };
        }
    }

    resource function put update(http:Request req) returns json|error {
        io:println("Updating current location");
        var payload = req.getJsonPayload();
        if (payload is json) {
            int id = check int:fromString((check payload.id).toString());
            decimal lat = check decimal:fromString((check payload.lat).toString());
            decimal lon = check decimal:fromString((check payload.lon).toString());
            return databaseController:updateCurrentLocation(id, lat, lon);
        } else {
            io:println("Error: Invalid payload for updating current location");
            return { "error": "Invalid payload" };
        }
    }
}

// Insert relationship
service /safe_srilanka/database/relationship on apiListener {
    resource function post insert(http:Request req) returns json|error {
        io:println("Inserting new relationship");
        var payload = req.getJsonPayload();
        if (payload is json) {
            int user1 = check int:fromString((check payload.user1).toString());
            int user2 = check int:fromString((check payload.user2).toString());
            return databaseController:insertRelationship(user1, user2);
        } else {
            io:println("Error: Invalid payload for inserting relationship");
            return { "error": "Invalid payload" };
        }
    }

    resource function post deleteRelationship(http:Request req) returns json|error {
        io:println("Deleting relationship");
        var payload = req.getJsonPayload();
        io:println(payload);
        if (payload is json) {
            int user1 = check int:fromString((check payload.user1).toString());
            int user2 = check int:fromString((check payload.user2).toString());
            return databaseController:deleteRelationship(user1, user2);
        } else {
            io:println("Error: Invalid payload for deleting relationship");
            return { "error": "Invalid payload for deleting relationship" };
        }
    }

    resource function get getRelationship(http:Request req, int id) returns json|error {
        io:println("Fetching relationship for ID: " + id.toString());
        return databaseController:getRelationship(id);
    }
}

// Serve image files
service /safe_srilanka/images on apiListener {
    resource function get [string filename](http:Request req) returns error|http:Response {
        string filePath = "C:\\Users\\SAHAN\\DarkShadow\\Competitions\\ballerina\\Safe-Sri-Lanka\\api\\safe-srilanka\\images\\"+filename;
        http:Response response = new;

        if (check file:test(filePath, file:EXISTS)) {
            byte[] fileContent = check io:fileReadBytes(filePath);
            response.setPayload(fileContent);
            response.setHeader("Content-Type", "image/jpeg");
        } else {
            response.statusCode = 404;
            response.setTextPayload("Image not found");
        }

        return response;
    }
}



public function main() returns error? {
    io:println("Starting Safe Sri Lanka API server on port " + PORT.toString());
    // Start the HTTP listener
    check apiListener.'start();
    io:println("Safe Sri Lanka API server started successfully");
}
import ballerina/http;
import ballerina/io;
import ballerina/mime;
import ballerina/os;
import safe_srilanka.dangerZoneController as dangerZoneController;
import safe_srilanka.SOSController as sosController;
import safe_srilanka.SOSUncomfortableController as uncomfortableController;
import safe_srilanka.aiChatBotController as aiChatBotController;
import safe_srilanka.fakeCallController as fakeCallController;
import safe_srilanka.helpServicesController as helpServicesController;
import safe_srilanka.profileController as profileController;
import safe_srilanka.traceController as traceController;
import safe_srilanka.utilController as utilController;
import safe_srilanka.relationshipController as relationshipController;

// Define the port for the HTTP listener
const int HELPLINE_PORT = 8080;
const int SOS_PORT = 8083;
const int UNCOMFORTABLE_PORT = 8082;
const int AI_CHAT_PORT = 8084;
const int FAKE_CALL_PORT = 8085;
const int DATABASE_PORT = 8086;
const int PROFILE_PORT = 8087;
const int TRACE_PORT = 8088;
const int DANGER_ZONE_PORT = 8089;
const int IMAGES_PORT = 8091;
const int RELATIONSHIP_PORT = 8092;
// Use environment variable for backend IP
string backendIp = os:getEnv("BACKEND_IP");

// Create HTTP listeners
listener http:Listener helplineListener = new(HELPLINE_PORT, config = {
    host: backendIp
});
listener http:Listener sosListener = new(SOS_PORT, config = {
    host: backendIp
});
listener http:Listener uncomfortableListener = new(UNCOMFORTABLE_PORT, config = {
    host: backendIp
});
listener http:Listener aiChatListener = new(AI_CHAT_PORT, config = {
    host: backendIp
});
listener http:Listener fakeCallListener = new(FAKE_CALL_PORT, config = {
    host: backendIp
});
listener http:Listener databaseListener = new(DATABASE_PORT, config = {
    host: backendIp
});
listener http:Listener profileListener = new(PROFILE_PORT, config = {
    host: backendIp
});
listener http:Listener traceListener = new(TRACE_PORT, config = {
    host: backendIp
});
listener http:Listener dangerZoneListener = new(DANGER_ZONE_PORT, config = {
    host: backendIp
});
listener http:Listener imagesListener = new(IMAGES_PORT, config = {
    host: backendIp
});
listener http:Listener relationshipListener = new(RELATIONSHIP_PORT, config = {
    host: backendIp
});


// AI Chat Bot Service
service /safe_srilanka/ai_assistant on aiChatListener {
    resource function post chat(http:Request req) returns json|error {
        io:println("Processing AI chat request");
        var payload = req.getJsonPayload();
        if (payload is json) {
            string message = check payload.message.ensureType();
            return aiChatBotController:chatWithAI(message);
        } else {
            io:println("Error: Invalid payload for AI chat");
            return { "error": "Invalid payload" };
        }
    }
}

//Danger Zone Service
service /safe_srilanka/database/dangerZone on databaseListener {
    //Insert danger zone
    resource function post insert(http:Request req) returns json|error {
        io:println("Inserting new danger zone");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return dangerZoneController:insertDangerZone(payload);
        } else {
            io:println("Error: Invalid payload for inserting danger zone");
            return { "error": "Invalid payload" };
        }
    }

    //Get nearby danger zones
    resource function get nearby(http:Request req) returns json|error {
        io:println("Fetching nearby danger zones");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return dangerZoneController:getNearbyDangerZones(payload);
        } else {
            io:println("Error: Invalid payload for fetching nearby danger zones");
            return { "error": "Invalid payload" };
        }
    }
}

// helpline services
service /safe_srilanka/helpline on helplineListener {
    resource function get helpline() returns json {
        io:println("Fetching helpline numbers");
        return helpServicesController:getHelplineNumbers();
    }
};

// FakeCall service
service /safe_srilanka/fakecall on fakeCallListener {
    resource function post initiate(http:Request req) returns json|error {
        io:println("Initiating fake call");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return fakeCallController:initiateFakeCall(payload);
        } else {
            io:println("Error: Invalid payload for fake call initiation");
            return { "error": "Invalid payload" };
        }
    }

    resource function post stop() returns json|error {
        io:println("Stopping fake call");
        return fakeCallController:stopFakeCall();
    }

    resource function get list() returns json {
        io:println("Listing recordings");
        return fakeCallController:listRecordings();
    }

    resource function post add(http:Request req) returns json|error {
        io:println("Adding new recording");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return fakeCallController:addRecording(payload);
        } else {
            io:println("Error: Invalid payload for adding recording");
            return { "error": "Invalid payload" };
        }
    }
}


// Profile Service
service /safe_srilanka/database/profile on profileListener {
    resource function post getProfile(http:Request req) returns json|error {
        io:println("Fetching profile");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return profileController:getProfile(payload);
        } else {
            io:println("Error: Invalid payload for fetching profile");
            return { "error": "Invalid payload" };
        }
    }
    resource function get getProfiles(http:Request req) returns json|error  {
        io:println("Fetching all profiles");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return profileController:getProfiles(payload);
        } else {
            io:println("Error: Invalid payload for fetching profiles");
            return { "error": "Invalid payload" };
        }
    }
    resource function post addProfile(http:Request req) returns json|error {
        io:println("Adding new profile");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return profileController:addProfile(payload);
        } else {
            io:println("Error: Invalid payload for adding profile");
            return { "error": "Invalid payload" };
        }
    }
    resource function post uploadImage(http:Request req) returns json|error {
        io:println("Uploading image");
        var payload = req.getBodyParts();
        if (payload is mime:Entity[]) {
            return profileController:uploadImage(payload);
        } else {
            io:println("Error: Invalid payload for uploading image");
            return { "error": "Invalid payload", "details": "Expected mime:Entity[] for image upload" };
        }
    }

    resource function put update(http:Request req) returns json|error {
        io:println("Updating profile");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return profileController:updateProfile(payload);
        } else {
            io:println("Error: Invalid payload for profile update");
            return { "error": "Invalid payload" };
        }
    }
}


// Insert trace
service /safe_srilanka/database/trace on traceListener {
    resource function post insert(http:Request req) returns json|error {
        io:println("Inserting new trace");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return traceController:insertTrace(payload);
        } else {
            io:println("Error: Invalid payload for inserting trace");
            return { "error": "Invalid payload" };
        }
    }
    resource function post insertCurrentLocation(http:Request req) returns json|error {
        io:println("Inserting current location");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return traceController:insertCurrentLocation(payload);
        } else {
            io:println("Error: Invalid payload for inserting current location");
            return { "error": "Invalid payload" };
        }
    }
}


// Insert relationship
service /safe_srilanka/database/relationship on relationshipListener {
    resource function post insert(http:Request req) returns json|error {
        io:println("Inserting new relationship");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return relationshipController:insertRelationship(payload);
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
            return relationshipController:deleteRelationship(payload);
        } else {
            io:println("Error: Invalid payload for deleting relationship");
            return { "error": "Invalid payload for deleting relationship" };
        }
    }

    // Add this new service
    resource function get nearby(http:Request req) returns json|error {
        io:println("Fetching nearby friends");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return relationshipController:getNearbyFriends(payload);
        } else {
            io:println("Error: Invalid payload for fetching nearby friends");
            return { "error": "Invalid payload" };
        }
    }
    resource function get getRelationship(http:Request req, int id) returns json|error {
        io:println("Fetching relationship for ID: " + id.toString());
        return relationshipController:getRelationship(id);
    }
}

// SOS HTTP service
service /safe_srilanka/sos on sosListener {
    resource function post send(http:Request req) returns json|error {
        io:println("Sending SOS signal");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return sosController:sendSOSSignal(payload);
        } else {
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function get details/[int sosId]() returns json|error {
        io:println("Fetching SOS details for ID: " + sosId.toString());
        return sosController:getSOSDetails({ "sosId": sosId });
    }

    resource function get nearby(decimal lat, decimal lon, decimal radius = 5) returns json|error {
        io:println("Fetching nearby SOS signals");
        return sosController:getNearbySOSSignals({ "lat": lat, "lon": lon, "radius": radius });
    }

    resource function post generateOTP(http:Request req) returns json|error {
        io:println("Generating OTP for SOS deactivation");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return sosController:generateOTP(payload);
        } else {
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function post deactivate(http:Request req) returns json|error {
        io:println("Deactivating SOS signal");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return sosController:verifyOTPAndDeleteSOSSignal(payload);
        } else {
            return { "status": "error", "message": "Invalid payload" };
        }
    }
}

// Uncomfortable HTTP service
service /safe_srilanka/uncomfortable on uncomfortableListener {
    resource function post send(http:Request req) returns json|error {
        io:println("Sending Uncomfortable signal");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return uncomfortableController:sendUncomfortableSignal(payload);
        } else {
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function get details/[int uncomfortableId]() returns json|error {
        io:println("Fetching Uncomfortable details for ID: " + uncomfortableId.toString());
        return uncomfortableController:getUncomfortableDetails({ "uncomfortableId": uncomfortableId });
    }

    resource function get nearby(decimal lat, decimal lon, decimal radius = 5) returns json|error {
        io:println("Fetching nearby Uncomfortable signals");
        return uncomfortableController:getNearbyUncomfortableSignals({ "lat": lat, "lon": lon, "radius": radius });
    }

    resource function post deactivate(http:Request req) returns json|error {
        io:println("Deactivating Uncomfortable signal");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return uncomfortableController:deactivateUncomfortableSignal(payload);
        } else {
            return { "status": "error", "message": "Invalid payload" };
        }
    }
}

// Util Service
service /safe_srilanka/util on imagesListener {
    resource function get image(http:Request req, string filename) returns json|error {
        json payload = { "filename": filename };
        return utilController:serveImage(payload);
    }
}

public function main() returns error? {
    io:println("Starting Safe Sri Lanka API server on following ports:");
    // Start the HTTP listeners
    check helplineListener.'start();
    check sosListener.'start();
    check uncomfortableListener.'start();
    check aiChatListener.'start();
    check fakeCallListener.'start();
    check databaseListener.'start();
    check profileListener.'start();
    check traceListener.'start();
    check dangerZoneListener.'start();
    io:println("Safe Sri Lanka API server started successfully on ports:");
    io:println("  - Main API: " + HELPLINE_PORT.toString());
    io:println("  - SOS: " + SOS_PORT.toString());
    io:println("  - Uncomfortable: " + UNCOMFORTABLE_PORT.toString());
    io:println("  - AI Chat: " + AI_CHAT_PORT.toString());
    io:println("  - Fake Call: " + FAKE_CALL_PORT.toString());
    io:println("  - Database: " + DATABASE_PORT.toString());
    io:println("  - Profile: " + PROFILE_PORT.toString());
    io:println("  - Trace: " + TRACE_PORT.toString());
    io:println("  - Danger Zone: " + DANGER_ZONE_PORT.toString());
}

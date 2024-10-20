import ballerina/http;
import ballerina/mime;
import ballerina/log;
import safe_srilanka.dangerZoneController as dangerZoneController;
import safe_srilanka.SOSController as sosController;
import safe_srilanka.SOSUncomfortableController as uncomfortableController;
import safe_srilanka.aiChatBotController as aiChatBotController;
import safe_srilanka.profileController as profileController;
import safe_srilanka.traceController as traceController;
import safe_srilanka.utilController as utilController;
import safe_srilanka.relationshipController as relationshipController;

const int SOS_PORT = 9000;
const int UNCOMFORTABLE_PORT = 9001;
const int AI_CHAT_PORT = 9002;
const int PROFILE_PORT = 9003;
const int TRACE_PORT = 9004;
const int DANGER_ZONE_PORT = 9005;
const int IMAGES_PORT = 9006;
const int RELATIONSHIP_PORT = 9007;

// Define backend IP
const string backendIp = "ADD YOUR IP HERE(Refer README.md)";

// Create HTTP listeners
listener http:Listener sosListener = new(SOS_PORT, config = {
    host: backendIp
});
listener http:Listener uncomfortableListener = new(UNCOMFORTABLE_PORT, config = {
    host: backendIp
});
listener http:Listener aiChatListener = new(AI_CHAT_PORT, config = {
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
    resource function post chat(http:Request req) returns json|error? {
        log:printInfo("Processing AI chat request");
        var payload = req.getJsonPayload();
        if (payload is json) {
            string message = check payload.message.ensureType();
            log:printInfo("AI chat message received: " + message);
            return aiChatBotController:chatWithAI(message);
        } else {
            log:printError("Error: Invalid payload for AI chat");
            return { "error": "Invalid payload" };
        }
    }
}

//Danger Zone Service
service /safe_srilanka/database/dangerZone on dangerZoneListener {
    //Insert danger zone
    resource function post insert(http:Request req) returns json|error {
        log:printInfo("Inserting new danger zone");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return dangerZoneController:insertDangerZone(payload);
        } else {
            log:printError("Error: Invalid payload for inserting danger zone");
            return { "error": "Invalid payload" };
        }
    }

    //Get nearby danger zones
    resource function post nearby(http:Request req) returns json|error {
        log:printInfo("Fetching nearby danger zones");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return dangerZoneController:getNearbyDangerZones(payload);
        } else {
            log:printError("Error: Invalid payload for fetching nearby danger zones");
            return { "error": "Invalid payload" };
        }
    }
}


// Profile Service
service /safe_srilanka/database/profile on profileListener {
    resource function post getProfile(http:Request req) returns json|error {
        log:printInfo("Fetching profile");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return profileController:getProfile(payload);
        } else {
            log:printError("Error: Invalid payload for fetching profile");
            return { "error": "Invalid payload" };
        }
    }
    resource function post getProfiles(http:Request req) returns json|error  {
        log:printInfo("Fetching all profiles");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return profileController:getProfiles(payload);
        } else {
            log:printError("Error: Invalid payload for fetching profiles");
            return { "error": "Invalid payload" };
        }
    }
    resource function post addProfile(http:Request req) returns json|error {
        log:printInfo("Adding new profile");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return profileController:addProfile(payload);
        } else {
            log:printError("Error: Invalid payload for adding profile");
            return { "error": "Invalid payload" };
        }
    }


    resource function put update(http:Request req) returns json|error {
        log:printInfo("Updating profile");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return profileController:updateProfile(payload);
        } else {
            log:printError("Error: Invalid payload for profile update");
            return { "error": "Invalid payload" };
        }
    }
}


// Insert trace
service /safe_srilanka/database/trace on traceListener {
    resource function post insert(http:Request req) returns json|error {
        log:printInfo("Inserting new trace");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return traceController:insertTrace(payload);
        } else {
            log:printError("Error: Invalid payload for inserting trace");
            return { "error": "Invalid payload" };
        }
    }
    resource function post insertCurrentLocation(http:Request req) returns json|error {
        log:printInfo("Inserting current location");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return traceController:insertCurrentLocation(payload);
        } else {
            log:printError("Error: Invalid payload for inserting current location");
            return { "error": "Invalid payload" };
        }
    }
}


// Insert relationship
service /safe_srilanka/database/relationship on relationshipListener {
    resource function post insert(http:Request req) returns json|error {
        log:printInfo("Inserting new relationship");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return relationshipController:insertRelationship(payload);
        } else {
            log:printError("Error: Invalid payload for inserting relationship");
            return { "error": "Invalid payload" };
        }
    }

    resource function post deleteRelationship(http:Request req) returns json|error {
        log:printInfo("Deleting relationship");
        var payload = req.getJsonPayload();
        log:printInfo("Payload: " + (check payload).toString());
        if (payload is json) {
            return relationshipController:deleteRelationship(payload);
        } else {
            log:printError("Error: Invalid payload for deleting relationship");
            return { "error": "Invalid payload for deleting relationship" };
        }
    }

    // Add this new service
    resource function post nearby(http:Request req) returns json|error {
        log:printInfo("Fetching nearby friends");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return relationshipController:getNearbyFriends(payload);
        } else {
            log:printError("Error: Invalid payload for fetching nearby friends");
            return { "error": "Invalid payload" };
        }
    }
    resource function post getRelationship(http:Request req) returns json|error {
        log:printInfo("Fetching relationship");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return relationshipController:getRelationship(payload);
        } else {
            log:printError("Error: Invalid payload for fetching relationship");
            return { "error": "Invalid payload" };
        }
    }
}

// SOS HTTP service
service /safe_srilanka/sos on sosListener {
    resource function post send(http:Request req) returns json|error {
        log:printInfo("Sending SOS signal");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return sosController:sendSOSSignal(payload);
        } else {
            log:printError("Error: Invalid payload for sending SOS signal");
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function post details(http:Request req) returns json|error {
        log:printInfo("Fetching SOS details");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return sosController:getSOSDetails(payload);
        } else {
            log:printError("Error: Invalid payload for fetching SOS details");
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function post nearby(http:Request req) returns json|error {
        log:printInfo("Fetching nearby SOS signals");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return sosController:getNearbySOSSignals(payload);
        } else {
            log:printError("Error: Invalid payload for fetching nearby SOS signals");
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function post generateOTP(http:Request req) returns json|error {
        log:printInfo("Generating OTP for SOS deactivation");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return sosController:generateOTP(payload);
        } else {
            log:printError("Error: Invalid payload for generating OTP");
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function post deactivate(http:Request req) returns json|error {
        log:printInfo("Deactivating SOS signal");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return sosController:verifyOTPAndDeleteSOSSignal(payload);
        } else {
            log:printError("Error: Invalid payload for deactivating SOS signal");
            return { "status": "error", "message": "Invalid payload" };
        }
    }
}

// Uncomfortable HTTP service
service /safe_srilanka/uncomfortable on uncomfortableListener {
    resource function post send(http:Request req) returns json|error {
        log:printInfo("Sending Uncomfortable signal");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return uncomfortableController:sendUncomfortableSignal(payload);
        } else {
            log:printError("Error: Invalid payload for sending Uncomfortable signal");
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function post details(http:Request req) returns json|error {
        log:printInfo("Fetching Uncomfortable details");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return uncomfortableController:getUncomfortableDetails(payload);
        } else {
            log:printError("Error: Invalid payload for fetching Uncomfortable details");
            return { "status": "error", "message": "Invalid payload" };
        }
    }
    resource function post nearby(http:Request req) returns json|error {
        log:printInfo("Fetching nearby Uncomfortable signals");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return uncomfortableController:getNearbyUncomfortableSignals(payload);
        } else {
            log:printError("Error: Invalid payload for fetching nearby Uncomfortable signals");
            return { "status": "error", "message": "Invalid payload" };
        }
    }

    resource function post deactivate(http:Request req) returns json|error {
        log:printInfo("Deactivating Uncomfortable signal");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return uncomfortableController:deactivateUncomfortableSignal(payload);
        } else {
            log:printError("Error: Invalid payload for deactivating Uncomfortable signal");
            return { "status": "error", "message": "Invalid payload" };
        }
    }
}

// Util Service
service /safe_srilanka/util on imagesListener {
    resource function post image(http:Request req) returns json|error {
        log:printInfo("Serving image");
        var payload = req.getJsonPayload();
        if (payload is json) {
            return utilController:serveImage(payload);
        } else {
            log:printError("Error: Invalid payload for serving image");
            return {
                "status": "error",
                "message": "Invalid payload"
            };
        }
    }
    resource function post uploadImage(http:Request req) returns json|error {
        log:printInfo("Uploading image");
        var payload = req.getBodyParts();
        if (payload is mime:Entity[]) {
            return profileController:uploadImage(payload);
        } else {
            log:printError("Error: Invalid payload for uploading image");
            return { "error": "Invalid payload", "details": "Expected mime:Entity[] for image upload" };
        }
    }
}

public function main() returns error? {
    log:printInfo("Starting Safe Sri Lanka API server on following ports:");
    // Start the HTTP listeners
    check sosListener.'start();
    check uncomfortableListener.'start();
    check aiChatListener.'start();
    check profileListener.'start();
    check traceListener.'start();
    check dangerZoneListener.'start();
    check imagesListener.'start();
    check relationshipListener.'start();
    log:printInfo("Safe Sri Lanka API server started successfully on ports:");
    log:printInfo("  - SOS: " + SOS_PORT.toString());
    log:printInfo("  - Uncomfortable: " + UNCOMFORTABLE_PORT.toString());
    log:printInfo("  - AI Chat: " + AI_CHAT_PORT.toString());
    log:printInfo("  - Profile: " + PROFILE_PORT.toString());
    log:printInfo("  - Trace: " + TRACE_PORT.toString());
    log:printInfo("  - Danger Zone: " + DANGER_ZONE_PORT.toString());
    log:printInfo("  - Images: " + IMAGES_PORT.toString());
    log:printInfo("  - Relationship: " + RELATIONSHIP_PORT.toString());
}

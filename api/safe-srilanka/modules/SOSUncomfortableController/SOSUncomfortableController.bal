import ballerina/io;
import ballerina/websocket;
import safe_srilanka.SOSUncomfortableModel as SOSUncomfortableModel;
import safe_srilanka.models as models;

// WebSocket connections store
public map<websocket:Caller> connections = {};

public function sendUncomfortableSignal(json payload) returns json|error {
    int senderId = check int:fromString((check payload.senderId).toString());
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());
    string description = check payload.description.ensureType();

    var result = check SOSUncomfortableModel:insertUncomfortableSignal(senderId, lat, lon, description);
    int uncomfortableId = <int>result.lastInsertId;

    // Get friends and nearby people
    stream<record {}, error?> recipientsStream = SOSUncomfortableModel:getRecipientsForUncomfortable(senderId, lat, lon);
    json[] recipients = [];
    check from record {} entry in recipientsStream
        do {
            recipients.push(entry.toJson());
        };

    // Send messages
    _ = check sendSMSMessages(recipients, uncomfortableId, senderId, lat, lon);
    _ = check sendWhatsAppMessages(recipients, uncomfortableId, senderId, lat, lon);

    // Broadcast Uncomfortable signal to all connected WebSocket clients
    models:UncomfortableMessage uncomfortableMessage = {
        types: "uncomfortable",
        senderId: senderId,
        lat: lat,
        lon: lon,
        uncomfortableId: uncomfortableId
    };
    foreach var [_, connection] in connections.entries() {
        _ = check connection->writeMessage(uncomfortableMessage.toJson());
    }

    return { "status": "success", "message": "Uncomfortable signal sent", "uncomfortableId": uncomfortableId };
}

function sendSMSMessages(json[] recipients, int uncomfortableId, int senderId, decimal lat, decimal lon) returns error? {
    io:println("Sending SMS messages for Uncomfortable ID: " + uncomfortableId.toString());
    // Implement SMS sending logic here
    io:println("SMS messages sent successfully for Uncomfortable ID: ", uncomfortableId.toString());
}

function sendWhatsAppMessages(json[] recipients, int uncomfortableId, int senderId, decimal lat, decimal lon) returns error? {
    io:println("Sending WhatsApp messages for Uncomfortable ID: ", uncomfortableId.toString());
    // Implement WhatsApp sending logic here
}

public function getUncomfortableDetails(json payload) returns json|error {
    int uncomfortableId = check int:fromString((check payload.uncomfortableId).toString());
    var result = check SOSUncomfortableModel:getUncomfortableDetails(uncomfortableId);
    if (result is record {}) {
        return result.toJson();
    } else {
        return { "status": "error", "message": "Uncomfortable signal not found" };
    }
}

public function getNearbyUncomfortableSignals(json payload) returns json|error {
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());
    decimal radius = 5;
    if (payload.radius != ()) {
        radius = check decimal:fromString((check payload.radius).toString());
    }

    stream<record {}, error?> resultStream = SOSUncomfortableModel:getNearbyUncomfortableSignals(lat, lon, radius);
    json[] uncomfortableSignals = [];

    check from record {} entry in resultStream
        do {
            uncomfortableSignals.push(entry.toJson());
        };

    return uncomfortableSignals;
}

public function deactivateUncomfortableSignal(json payload) returns json|error {
    int uncomfortableId = check int:fromString((check payload.uncomfortableId).toString());
    _ = check SOSUncomfortableModel:deactivateUncomfortableSignal(uncomfortableId);
    return { "status": "success", "message": "Uncomfortable signal deleted successfully" };
}

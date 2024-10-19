import ballerina/io;
import ballerina/random;
import ballerina/websocket;
import safe_srilanka.SOSModel as SOSModel;
import safe_srilanka.models as models;

// WebSocket connections store
public map<websocket:Caller> connections = {};

public function sendSOSSignal(json payload) returns json|error {
    int senderId = check int:fromString((check payload.senderId).toString());
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());

    var result = check SOSModel:insertSOSSignal(senderId, lat, lon);
    int sosId = <int>result.lastInsertId;

    // Get friends and nearby people
    stream<record {}, error?> recipientsStream = SOSModel:getRecipientsForSOS(senderId, lat, lon);
    json[] recipients = [];
    check from record {} entry in recipientsStream
        do {
            recipients.push(entry.toJson());
        };

    // Send messages
    _ = check sendSMSMessages(recipients, sosId, senderId, lat, lon);
    _ = check sendWhatsAppMessages(recipients, sosId, senderId, lat, lon);

    // Broadcast SOS signal to all connected WebSocket clients
    models:SOSMessage sosMessage = {
        types: "sos",
        senderId: senderId,
        lat: lat,
        lon: lon,
        sosId: sosId
    };
    foreach var [_, connection] in connections.entries() {
        _ = check connection->writeMessage(sosMessage.toJson());
    }

    return { "status": "success", "message": "SOS signal sent", "sosId": sosId };
}

function sendSMSMessages(json[] recipients, int sosId, int senderId, decimal lat, decimal lon) returns error? {
    io:println("Sending SMS messages for SOS ID: " + sosId.toString());
    // Implement SMS sending logic here
    io:println("SMS messages sent successfully for SOS ID: ", sosId.toString());
}

function sendWhatsAppMessages(json[] recipients, int sosId, int senderId, decimal lat, decimal lon) returns error? {
    io:println("Sending WhatsApp messages for SOS ID: ", sosId.toString());
    // Implement WhatsApp sending logic here
}

public function getSOSDetails(json payload) returns json|error {
    int sosId = check int:fromString((check payload.sosId).toString());
    var result = check SOSModel:getSOSDetails(sosId);
    if (result is record {}) {
        return result.toJson();
    } else {
        return { "status": "error", "message": "SOS signal not found" };
    }
}

public function getNearbySOSSignals(json payload) returns json|error {
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());
    decimal radius = payload.radius is () ? 5 : check decimal:fromString((check payload.radius).toString());

    stream<record {}, error?> resultStream = SOSModel:getNearbySOSSignals(lat, lon, radius);
    json[] sosSignals = [];

    check from record {} entry in resultStream
        do {
            sosSignals.push(entry.toJson());
        };

    return sosSignals;
}

public function generateOTP(json payload) returns json|error {
    int sosId = check int:fromString((check payload.sosId).toString());
    int|random:Error randomInt = random:createIntInRange(100000, 999999);
    if randomInt is random:Error {
        return { "status": "error", "message": "Failed to generate OTP" };
    }
    string otp = randomInt.toString();
    _ = check SOSModel:updateSOSOTP(sosId, otp);
    return { "status": "success", "message": "OTP generated successfully", "otp": otp };
}

public function sendOTPEmail(json payload) returns json|error {
    string recipientEmail = check (check payload.email).toString();
    string otp = check (check payload.otp).toString();
    // Instead of sending an email, we'll return the OTP to the front end
    return {
        "status": "success",
        "message": "OTP generated successfully",
        "otp": otp
    };
}

public function verifyOTPAndDeleteSOSSignal(json payload) returns json|error {
    int sosId = check int:fromString((check payload.sosId).toString());
    string otp = check (check payload.otp).toString();
    var result = check SOSModel:verifyAndDeleteSOSSignal(sosId, otp);
    if (result is ()) {
        return { "status": "error", "message": "Invalid OTP or SOS ID" };
    } else {
        return { "status": "success", "message": "SOS signal deleted successfully" };
    }
}

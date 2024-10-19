import ballerina/io;
import ballerina/random;
import ballerina/websocket;
import safe_srilanka.SOSModel as SOSModel;
import safe_srilanka.models as models;
import ballerina/http;
import ballerina/log;

// WebSocket connections store
public map<websocket:Caller> connections = {};

public function sendSOSSignal(json payload) returns json|error {
    log:printInfo("Sending SOS signal");
    int senderId = check int:fromString((check payload.senderId).toString());
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());
    string userName = check payload.userName;
    string locationName = check payload.locationName;
    string isBackendCallEnabled = check payload.isBackendCallEnabled;

    var result = check SOSModel:insertSOSSignal(senderId, lat, lon);
    int sosId = <int>result.lastInsertId;
    log:printInfo(string `SOS signal inserted with ID: ${sosId}`);

    // Get friends and nearby people
    stream<record {}, error?> recipientsStream = SOSModel:getRecipientsForSOS(senderId, lat, lon);
    json[] recipients = [];
    check from record {} entry in recipientsStream
        do {
            recipients.push(entry.toJson());
        };
    log:printInfo(string `Found ${recipients.length()} recipients for SOS signal`);

    // Send SMS
    if (isBackendCallEnabled.toString() == "true") {
        _ = check sendSMSMessage(userName, locationName, lat, lon);
    }else{
        log:printInfo("Backend call is disabled");
    }

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
    log:printInfo("SOS signal broadcasted to all connected WebSocket clients");
    log:printInfo("Initiating calls and messages for friends and nearby clients");

    return { "status": "success", "message": "SOS signal sent", "sosId": sosId };
}

function sendSMSMessage(string userName, string locationName, decimal lat, decimal lon) returns error? {
    log:printInfo("Sending SMS message");
    // Call the Python SMS service
    http:Client smsClient = check new ("http://16.171.175.237:7000");  // Adjust the port if needed
    json smsPayload = {
        "userName": userName,
        "locationName": locationName,
        "lat": lat.toString(),
        "lon": lon.toString()
    };
    io:println("Sending SMS message to: ",smsPayload.userName);
    http:Response smsResponse = check smsClient->post("/send-sms", smsPayload);
    if (smsResponse.statusCode != 200) {
        log:printError("Failed to send SMS");
        return error("Failed to send SMS");
    }
    log:printInfo("SMS sent successfully");
    http:Response callResponse = check smsClient->post("/make-call", smsPayload);
    if (callResponse.statusCode != 200) {
        log:printError("Failed to make call");
        return error("Failed to make call");
    }
    log:printInfo("Call made successfully");
}

function sendWhatsAppMessages(json[] recipients, int sosId, int senderId, decimal lat, decimal lon) returns error? {
    log:printInfo(string `Sending WhatsApp messages for SOS ID: ${sosId}`);
    io:println("Sending WhatsApp messages for SOS ID: ", sosId.toString());
    // Implement WhatsApp sending logic here
}

public function getSOSDetails(json payload) returns json|error {
    log:printInfo("Getting SOS details");
    int sosId = check int:fromString((check payload.sosId).toString());
    var result = check SOSModel:getSOSDetails(sosId);
    if (result is record {}) {
        log:printInfo(string `SOS details retrieved for ID: ${sosId}`);
        return result.toJson();
    } else {
        log:printError(string `SOS signal not found for ID: ${sosId}`);
        return { "status": "error", "message": "SOS signal not found" };
    }
}

public function getNearbySOSSignals(json payload) returns json|error {
    log:printInfo("Getting nearby SOS signals");
    decimal lat = check decimal:fromString((check payload.lat).toString());
    decimal lon = check decimal:fromString((check payload.lon).toString());
    decimal radius = payload.radius is () ? 5 : check decimal:fromString((check payload.radius).toString());

    stream<record {}, error?> resultStream = SOSModel:getNearbySOSSignals(lat, lon, radius);
    json[] sosSignals = [];

    check from record {} entry in resultStream
        do {
            sosSignals.push(entry.toJson());
        };

    log:printInfo(string `Found ${sosSignals.length()} nearby SOS signals`);
    return sosSignals;
}

public function generateOTP(json payload) returns json|error {
    log:printInfo("Generating OTP");
    int sosId = check int:fromString((check payload.sosId).toString());
    int|random:Error randomInt = random:createIntInRange(100000, 999999);
    if randomInt is random:Error {
        log:printError("Failed to generate OTP");
        return { "status": "error", "message": "Failed to generate OTP" };
    }
    string otp = randomInt.toString();
    _ = check SOSModel:updateSOSOTP(sosId, otp);
    log:printInfo(string `OTP generated successfully for SOS ID: ${sosId}`);
    return { "status": "success", "message": "OTP generated successfully", "otp": otp };
}

public function sendOTPEmail(json payload) returns json|error {
    log:printInfo("Sending OTP email");
    string recipientEmail = (check payload.email).toString();
    string otp = (check payload.otp).toString();
    // Instead of sending an email, we'll return the OTP to the front end
    log:printInfo(string `OTP generated for email: ${recipientEmail}`);
    return {
        "status": "success",
        "message": "OTP generated successfully",
        "otp": otp
    };
}

public function verifyOTPAndDeleteSOSSignal(json payload) returns json|error {
    log:printInfo("Verifying OTP and deleting SOS signal");
    int sosId = check int:fromString((check payload.sosId).toString());
    string otp = (check payload.otp).toString();
    var result = check SOSModel:verifyAndDeleteSOSSignal(sosId, otp);
    if (result is ()) {
        log:printError(string `Invalid OTP or SOS ID: ${sosId}`);
        return { "status": "error", "message": "Invalid OTP or SOS ID" };
    } else {
        log:printInfo(string `SOS signal deleted successfully for ID: ${sosId}`);
        return { "status": "success", "message": "SOS signal deleted successfully" };
    }
}

import ballerinax/mysql;
import ballerina/sql;
import ballerina/io;
import ballerina/websocket;
// import ballerina/random;
// import safe_srilanka.SMSController as SMSController;

configurable string dbUser = "root";
configurable string dbPassword = "root";
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "safe_sri_lanka";

mysql:Client dbClient = check new (host = dbHost, user = dbUser, password = dbPassword, database = dbName, port = dbPort);

// WebSocket connections store
public map<websocket:Caller> connections = {};

public function sendUncomfortableSignal(int senderId, float lat, float lon, string description) returns json|error {
    sql:ParameterizedQuery query = `INSERT INTO uncomfortable_signal (sender_id, lat, lon, description) VALUES (${senderId}, ${lat}, ${lon}, ${description})`;
    sql:ExecutionResult result = check dbClient->execute(query);
    int uncomfortableId = <int>result.lastInsertId;

    // Get friends and nearby people
    json[] recipients = check getRecipientsForUncomfortable(senderId, lat, lon);

    // Send messages
    _ = check sendSMSMessages(recipients, uncomfortableId, senderId, lat, lon);
    _ = check sendWhatsAppMessages(recipients, uncomfortableId, senderId, lat, lon);

    // Broadcast Uncomfortable signal to all connected WebSocket clients
    json uncomfortableMessage = {
        "type": "uncomfortable",
        "senderId": senderId,
        "lat": lat,
        "lon": lon,
        "uncomfortableId": uncomfortableId
    };
    foreach var [_, connection] in connections.entries() {
        _ = check connection->writeMessage(uncomfortableMessage);
    }

    return { "status": "success", "message": "Uncomfortable signal sent", "uncomfortableId": uncomfortableId };
}

function getRecipientsForUncomfortable(int senderId, float lat, float lon) returns json[]|error {
    sql:ParameterizedQuery friendsQuery = `
        SELECT p.id, p.name, p.mobile, p.whatsapp
        FROM relationship r
        JOIN profile p ON r.user2 = p.id
        WHERE r.user1 = ${senderId}
    `;

    sql:ParameterizedQuery nearbyQuery = `
        SELECT p.id, p.name, p.mobile, p.whatsapp,
               (6371 * acos(cos(radians(${lat})) * cos(radians(cl.lat)) * cos(radians(cl.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(cl.lat)))) AS distance
        FROM profile p
        JOIN current_location cl ON p.id = cl.id
        WHERE p.id != ${senderId}
        HAVING distance < 5 -- 5 km radius
        ORDER BY distance
    `;

    stream<record {}, error?> friendsStream = dbClient->query(friendsQuery);
    stream<record {}, error?> nearbyStream = dbClient->query(nearbyQuery);

    json[] AllRecipients = [];

    check from record {} entry in friendsStream
        do {
            AllRecipients.push(entry.toJson());
        };

    check from record {} entry in nearbyStream
        do {
            AllRecipients.push(entry.toJson());
        };

    io:println(AllRecipients);
    return AllRecipients;
}

function sendSMSMessages(json[] recipients, int uncomfortableId, int senderId, float lat, float lon) returns error? {
    io:println("Sending SMS messages for Uncomfortable ID: " + uncomfortableId.toString());
    
    // string message = string `SOS Alert! Your friend (ID: ${senderId}) needs help. Location: ${lat}, ${lon}. SOS ID: ${sosId}`;
    
    // foreach var recipient in recipients {
    //     if (recipient is map<json>) {
    //         string? mobileJson = check recipient.mobile;
    //         if (mobileJson is string) {
    //             check SMSController:sendSMS(mobileJson, message);
    //         }
    //     }
    // }
    
    io:println("SMS messages sent successfully for Uncomfortable ID: ", uncomfortableId.toString());
}

function sendWhatsAppMessages(json[] recipients, int uncomfortableId, int senderId, float lat, float lon) returns error? {
    // Implement WhatsApp sending logic here
    // You may need to use WhatsApp Business API or a third-party service
    io:println("Sending WhatsApp messages for Uncomfortable ID: ", uncomfortableId.toString());
}

public function getUncomfortableDetails(int uncomfortableId) returns json|error {
    sql:ParameterizedQuery query = `
        SELECT u.*, p.name as sender_name
        FROM uncomfortable_signal u
        JOIN profile p ON u.sender_id = p.id
        WHERE u.id = ${uncomfortableId}
    `;

    stream<record {}, error?> resultStream = dbClient->query(query);
    record {}|error? result = check resultStream.next();

    if (result is record {}) {
        return result.toJson();
    } else {
        return { "status": "error", "message": "Uncomfortable signal not found" };
    }
}

public function getNearbyUncomfortableSignals(float lat, float lon, float radius = 5) returns json|error {
    sql:ParameterizedQuery query = `
        SELECT u.id, u.sender_id, u.lat, u.lon, u.timestamp, u.description, p.name as sender_name,
               (6371 * acos(cos(radians(${lat})) * cos(radians(u.lat)) * cos(radians(u.lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(u.lat)))) AS distance
        FROM uncomfortable_signal u
        JOIN profile p ON u.sender_id = p.id
        WHERE u.is_active = TRUE
        HAVING distance < ${radius}
        ORDER BY u.timestamp DESC
        LIMIT 10
    `;

    stream<record {}, error?> resultStream = dbClient->query(query);
    json[] uncomfortableSignals = [];

    check from record {} entry in resultStream
        do {
            uncomfortableSignals.push(entry.toJson());
        };

    return uncomfortableSignals;
}

public function deactivateUncomfortableSignal(int uncomfortableId) returns json|error {
    sql:ParameterizedQuery query = `DELETE FROM uncomfortable_signal WHERE id = ${uncomfortableId}`;
    _ = check dbClient->execute(query);
    return { "status": "success", "message": "Uncomfortable signal deleted successfully" };
}

// public function generateOTP(int uncomfortableId) returns string|error {
//     int|random:Error randomInt = random:createIntInRange(100000, 999999);
//     if randomInt is random:Error {
//         return error("Failed to generate OTP");
//     }
//     string otp = randomInt.toString();
//     sql:ParameterizedQuery query = `UPDATE uncomfortable_signal SET otp = ${otp} WHERE id = ${uncomfortableId}`;
//     _ = check dbClient->execute(query);
//     return otp;
// }

// public function sendOTPEmail(string recipientEmail, string otp) returns json {
//     // Instead of sending an email, we'll return the OTP to the front end
//     return {
//         "status": "success",
//         "message": "OTP generated successfully",
//         "otp": otp
//     };
// }

// public function verifyOTPAndDeleteUncomfortableSignal(int uncomfortableId, string otp) returns json|error {
//     sql:ParameterizedQuery query = `SELECT * FROM uncomfortable_signal WHERE id = ${uncomfortableId} AND otp = ${otp}`;
//     stream<record {}, error?> resultStream = dbClient->query(query);
//     record {}|error? result = check resultStream.next();

//     if (result is record {}) {
//         sql:ParameterizedQuery deleteQuery = `DELETE FROM uncomfortable_signal WHERE id = ${uncomfortableId}`;
//         _ = check dbClient->execute(deleteQuery);
//         return { "status": "success", "message": "Uncomfortable signal deleted successfully" };
//     } else {
//         return { "status": "error", "message": "Invalid OTP or Uncomfortable ID" };
//     }
// }

import ballerina/log;
import ballerina/http;

// Define a structure for Emergency Numbers
type EmergencyNumber record {
    string id;
    string emoji;
    string title;
    string number;
};

// In-memory storage for Emergency Numbers
final EmergencyNumber[] emergencyNumbers = [
    { id: "1", emoji: "🚨", title: "Emergency Services", number: "911" },
    { id: "2", emoji: "🚑", title: "Ambulance", number: "102" },
    { id: "3", emoji: "🚒", title: "Fire Department", number: "101" },
    { id: "4", emoji: "👮", title: "Police", number: "100" },
    { id: "5", emoji: "🆘", title: "Women's Helpline", number: "1091" },
    { id: "6", emoji: "👶", title: "Child Helpline", number: "1098" }
];

// In-memory storage for recordings
map<string, json> recordings = {};

// Function to get Helpline Numbers
public function getHelplineNumbers() returns json {
    return { "helplines": emergencyNumbers };
}

// Function to initiate a Fake Call
public function initiateFakeCall(json payload) returns json|error {
    string? recordingName = payload["recording_name"].toString();
    if (recordingName is string) {
        // Simulate initiating a fake call
        log:printInfo("Initiating fake call with recording: " + recordingName);
        return { "status": "Fake call initiated", "recording": recordingName };
    } else {
        return { "error": "Recording name is required" };
    }
}

// Function to stop a Fake Call
public function stopFakeCall() returns json|error {
    // Simulate stopping a fake call
    log:printInfo("Stopping fake call");
    return { "status": "Fake call stopped" };
}

// Function to list all recordings
public function listRecordings() returns json {
    json[] recordingList = [];
    foreach var [key, value] in recordings.entries() {
        recordingList.push(value);
    }
    return { "recordings": recordingList };
}

// Function to add a new recording
public function addRecording(json payload) returns json|error {
    string? name = payload["name"].toString();
    string? filePath = payload["file_path"].toString();

    if (name is string && filePath is string) {
        string id = string `R-${recordings.length()}-${name}`;
        json recording = { "id": id, "name": name, "file_path": filePath };
        recordings[id] = recording;
        log:printInfo("Added new recording: " + name);
        return { "status": "Recording added", "recording": recording };
    } else {
        return { "error": "Invalid recording data" };
    }
}

// Function to handle AI Chat
public function aiChat(json payload) returns json|error {
    string? message = payload["message"].toString();
    if (message is string) {
        // Simulate AI chatbot response
        string aiResponse = "You said: " + message;
        log:printInfo("AI Chat received message: " + message);
        return { "response": aiResponse };
    } else {
        return { "error": "Message is required" };
    }
}
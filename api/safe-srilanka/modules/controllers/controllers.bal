import ballerina/log;
import safe_srilanka.models as models;
import safe_srilanka.aiChatBot as aiChatBot;
import ballerina/random;
import ballerina/lang.array;
import ballerina/io;
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
map<json> recordings = {};

// Function to get Helpline Numbers
public function getHelplineNumbers() returns json {
    return { "helplines": emergencyNumbers }.toJson();
}

// Function to initiate a Fake Call
public function initiateFakeCall(json payload) returns json|error {
    string recordingName = check payload.recording_name.ensureType();
    // Simulate initiating a fake call
    log:printInfo("Initiating fake call with recording: " + recordingName);
    return { "status": "Fake call initiated", "recording": recordingName };
}

// Function to stop a Fake Call
public function stopFakeCall() returns json {
    // Simulate stopping a fake call
    log:printInfo("Stopping fake call");
    return { "status": "Fake call stopped" };
}

// Function to list all recordings
public function listRecordings() returns json {
    return recordings;
}

// Function to add a new recording
public function addRecording(json payload) returns json|error {
    string name = check payload.name.ensureType();
    string filePath = check payload.file_path.ensureType();

    string id = string `R-${recordings.length()}-${name}`;
    json recording = { "id": id, "name": name, "file_path": filePath };
    recordings[id] = recording;
    log:printInfo("Added new recording: " + name);
    return { "status": "Recording added", "recording": recording };
}

// Function to handle AI Chat
public function aiChat(json payload) returns json|error {
    string message = check payload.message.ensureType();
    // Simulate AI chatbot response
    //string aiResponse = "You said: " + message;
    //log:printInfo("AI Chat received message: " + message);
    return aiChatBot:chatWithAI(message);
}

// In-memory storage for user profiles (Replace with MongoDB integration)
map<models:UserProfile> userProfiles = {};

public function uploadImage(json payload) returns json|error {
    io:println(payload);
    io:println("upload image is called from the database");
    // Generate a random number for the image filename
    int randomNumber = check random:createIntInRange(1000, 9999);
    string filename = randomNumber.toString() + ".jpg";

    // Extract the base64 image data from the payload
    string imageData = payload.toString();

    // Decode the base64 image data
    byte[]|error decodedImage = check array:fromBase64(imageData);
    if (decodedImage is error) {
        return { "status": "error", "message": "Failed to decode image data: " + decodedImage.message() };
    }

    // Save the image to a local file
    string filePath = "./images/" + filename;
    error? writeResult = io:fileWriteBytes(filePath, decodedImage);
    if (writeResult is error) {
        return { "status": "error", "message": "Failed to write image file: " + writeResult.message() };
    }

    // Return the filename
    return {
        "status": "success",
        "message": "Image uploaded successfully",
        "filename": filename
    };
}

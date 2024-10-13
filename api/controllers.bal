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

// Define a structure for User Profile
type UserProfile record {
    string id;
    string name;
    string mobile;
    string email;
    string location;
    string profileImage; // URL or base64 string
};

// In-memory storage for user profiles (Replace with MongoDB integration)
map<UserProfile> userProfiles = {};

// Function to update User Profile
public function updateProfile(json payload) returns json|error {
    string? id = payload["id"].toString(); // Assuming you pass a user ID
    string? name = payload["name"].toString();
    string? mobile = payload["mobile"].toString();
    string? email = payload["email"].toString();
    string? location = payload["location"].toString();
    string? profileImage = payload["profileImage"].toString();

    if (id is string && name is string && mobile is string && email is string && location is string) {
        UserProfile profile = {
            id: id,
            name: name,
            mobile: mobile,
            email: email,
            location: location,
            profileImage: profileImage is string ? profileImage : ""
        };

        userProfiles[id] = profile;
        log:printInfo("Profile updated for user: " + name);
        return { "status": "success", "profile": profile };
    } else {
        return { "error": "Invalid profile data" };
    }
}

// Function to get User Profile
public function getProfile(string id) returns json|error {
    UserProfile? profile = userProfiles[id];
    if (profile is UserProfile) {
        return profile;
    } else {
        return { "error": "Profile not found" };
    }
}
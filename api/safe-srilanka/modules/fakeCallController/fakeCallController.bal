import ballerina/log;

// In-memory storage for recordings
map<json> recordings = {};


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
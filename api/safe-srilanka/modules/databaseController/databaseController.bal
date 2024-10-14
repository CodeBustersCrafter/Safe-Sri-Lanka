import safe_srilanka.models as models;    
import safe_srilanka.database as database;
import ballerina/io;

public  function addProfile(json payload) returns json|error {
    map<models:UserProfile> userProfiles = {};

    int id = check payload.id.ensureType();
    string name = check payload.name.ensureType();
    string mobile = check payload.mobile.ensureType();
    string whatsapp = check payload.whatsapp.ensureType();
    string email = check payload.email.ensureType();
    string location = check payload.location.ensureType();
    string profileImage = check payload.profileImage.ensureType();

    if (userProfiles.hasKey(id.toString())) {
        return error("Profile with this ID already exists");
    }

    models:UserProfile newProfile = {
        id,
        name,
        mobile,
        whatsapp,
        email,
        location,
        profileImage
    };

    userProfiles[id.toString()] = newProfile;
    //json result = check database:insertProfile(newProfile.toJson());
    return { "status": "success", "profile": newProfile.toJson() };
}

public function getUserProfile(string userId) returns json|error {
    io:println(userId,"is recieved to the database controller");
    return database:getUserProfile(userId);
}
public function getUserProfiles() returns json|error {
    io:println("All are recieved to the database controller");
    return database:getUserProfiles();
}

// Insert trace
public function insertTrace(int id, string location) returns json|error {
    return database:insertTrace(id, location);
}

// Insert danger zone
public function insertDangerZone(int id, decimal lat, decimal lon, string description) returns json|error {
    return database:insertDangerZone(id, lat, lon, description);
}

// Insert current location
public function insertCurrentLocation(int id, decimal lat, decimal lon) returns json|error {
    return database:insertCurrentLocation(id, lat, lon);
}

// Insert relationship
public function insertRelationship(int user1, int user2) returns json|error {
    return database:insertRelationship(user1, user2);
}

// Update current location
public function updateCurrentLocation(int id, decimal lat, decimal lon) returns json|error {
    return database:updateCurrentLocation(id, lat, lon);
}

// Update profile
public function updateProfile(int id, json payload) returns json|error {
    return database:updateProfile(id, payload);
}

// Update relationship
public function updateRelationship(int user1, int user2, int newUser2) returns json|error {
    return database:updateRelationship(user1, user2, newUser2);
}

// Delete profile
public function deleteProfile(int id) returns json|error {
    return database:deleteProfile(id);
}

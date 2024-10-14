import safe_srilanka.models as models;    
import safe_srilanka.database as database;
import ballerina/io;

public  function addProfile(json payload) returns json|error {
    map<models:UserProfile> userProfiles = {};

    int id = check payload.id.ensureType();
    string name = check payload.name.ensureType();
    string mobile = check payload.mobile.ensureType();
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

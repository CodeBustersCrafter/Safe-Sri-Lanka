import ballerina/io;
import safe_srilanka.profileModel as profileModel;
import ballerina/mime;
import ballerina/sql;
import safe_srilanka.models as models;
import safe_srilanka.utilController as utilController;

public function getProfile(json payload) returns json|error {
    string id = check payload.id.ensureType();
    io:println("Fetching profile for ID: " + id);
    stream<record {}, error?> profileStream = profileModel:getUserProfile(id);
    record {}|error? result = profileStream.next();
    io:println(result);
    if (result is record {}) {
        return { "status": "success", "profile": result.toJson() };
    } else {
        return { "status": "error", "message": "Profile not found" };
    }

}

public function getProfiles(json payload) returns json|error {
    io:println("Fetching all profiles");
    string userId = check payload.id.ensureType();
    stream<record {}, error?> profilesStream = profileModel:getUserProfiles(userId);
    json[] profiles = [];
    check from record {} profile in profilesStream
        do {
            profiles.push(profile.toJson());
        };
    if profiles.length() > 0 {
        return { "status": "success", "profiles": profiles };
    } else {
        return { "status": "success", "profiles": [] };
    }
}
public function addProfile(json payload) returns json|error {
    io:println("Adding new profile");
    models:UserProfile profile = {
        id: 0,
        name: check payload.name.ensureType(),
        mobile: check payload.mobile.ensureType(),
        whatsapp: check payload.whatsapp.ensureType(),
        email: check payload.email.ensureType(),
        location: check payload.location.ensureType(),
        profileImage: check payload.profileImage.ensureType()
    };
    return profileModel:addProfile(profile);
}

public function updateProfile(json payload) returns json|error {
    int id = check int:fromString((check payload.id).toString());
    io:println("Updating profile with ID: " + id.toString());
    models:UserProfile updatedProfile = {
        id: id,
        name: check payload.name.ensureType(),
        mobile: check payload.mobile.ensureType(),
        whatsapp: check payload.whatsapp.ensureType(),
        email: check payload.email.ensureType(),
        location: check payload.location.ensureType(),
        profileImage: check payload.profileImage.ensureType()
    };
    sql:ExecutionResult|sql:Error result = profileModel:updateProfile(updatedProfile);
    if result is sql:ExecutionResult {
        return {
            "status": "success",
            "message": "Profile updated successfully",
            "profile": updatedProfile.toJson()
        };
    } else {
        return {
            "status": "error",
            "message": "Failed to update profile",
            "error": result.message()
        };
    }
}

public function uploadImage(mime:Entity[] payload) returns json|error {
    foreach var part in payload {
        if (part.getContentDisposition().name == "image") {
            byte[] imageBytes = check part.getByteArray();
            string base64Image = imageBytes.toBase64();
            return utilController:uploadImage(base64Image);
        }
    }
    io:println("Error: No profile image found in the payload");
    return { "error": "No profile image found" };    
}

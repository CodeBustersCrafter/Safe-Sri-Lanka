import ballerina/random;
import ballerina/lang.array;
import ballerina/io;
import ballerina/file;

public function uploadImage(string base64Image) returns json|error {
    io:println("Upload image is called from the database");
    // Generate a random number for the image filename
    int randomNumber = check random:createIntInRange(1, 99999999);
    string filename = randomNumber.toString() + ".jpg";

    // Decode the base64 image data
    byte[]|error decodedImage = array:fromBase64(base64Image);
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

// Serve image files
public function serveImage(json payload) returns json|error {
    string filename = check payload.filename.ensureType();
    string filePath = "./images/" + filename;

    if (check file:test(filePath, file:EXISTS)) {
        byte[] fileContent = check io:fileReadBytes(filePath);
        string base64Image = array:toBase64(fileContent);
        return {
            "status": "success",
            "message": "Image served successfully",
            "image": base64Image,
            "contentType": "image/jpeg"
        };
    } else {
        return {
            "status": "error",
            "message": "Image not found"
        };
    }
}


import ballerina/http;
import ballerina/io;

configurable string pythonServiceUrl = "http://localhost:8000";

public function chatWithAI(string message) returns json|error {
    http:Client pythonClient = check new (pythonServiceUrl,timeout = 1200);

    json payload = {
        "message": message
    };

    http:Response response = check pythonClient->post("/chat", payload);
    if (response.statusCode == 200) {
        json responsePayload = check response.getJsonPayload();
        return responsePayload;
    } else {
        io:println("Error from Python service: " + response.statusCode.toString());
        return error("Failed to get response from Python service");
    }
}
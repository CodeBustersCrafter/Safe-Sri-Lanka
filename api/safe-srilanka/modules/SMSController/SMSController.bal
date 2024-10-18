import ballerina/http;
import ballerina/io;
import ballerina/url;

public function sendSMS(string toPhoneNumber, string messageBody) returns error? {
    // Twilio API base URL
    string twilioBaseUrl = "https://api.twilio.com/2010-04-01/Accounts";
    
    // Your Twilio Account SID and Auth Token
    string accountSID = "AC70a8a32f65c19edb6b82c6298566b6cd";
    string authToken = "e224bec02cc3d18f20d6eb328c5d4ead";
    
    // Check if credentials are empty
    if (accountSID == "" || authToken == "") {
        return error("Twilio credentials are missing. Please check your environment variables.");
    }

    // Create an HTTP client with Basic Authentication (for Twilio)
    http:Client twilioClient = check new (twilioBaseUrl,
        auth = {
            username: accountSID,
            password: authToken
        }
    );

    // SMS message details
    string fromPhoneNumber = "+94776053830"; // Twilio phone number
    string testPhoneNumber = "+94765820661";
    if (toPhoneNumber != "") {
        testPhoneNumber = toPhoneNumber;
    }

    // Build the message payload and explicitly URL encode it
    string payload = string `From=${check url:encode("+15005550006", "UTF-8")}` +
                     string `&To=${check url:encode(testPhoneNumber, "UTF-8")}` +
                     string `&Body=${check url:encode(messageBody, "UTF-8")}`;

    string urlPath = string `/Messages.json`;
    http:Response response = check twilioClient->post("/" + accountSID + urlPath, payload,
        {"Content-Type": "application/x-www-form-urlencoded"}
    );

    // Print the response status and body
    io:println("Status Code: ", response.statusCode);
    string responseBody = check response.getTextPayload();
    io:println("Response Body: ", responseBody);

    if (response.statusCode == 200 || response.statusCode == 201) {
        io:println("SMS sent successfully!");
    } else {
        io:println("Failed to send SMS. Please check the response body for details.");
    }
}

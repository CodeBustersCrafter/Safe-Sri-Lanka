// Tried to implement SMS sending functionality but it's not working so used python backend for that
// import ballerina/io;
// import ballerinax/twilio;

// configurable string accountSid = ?;
// configurable string authToken = ?;

// // Twilio configurations
// twilio:ConnectionConfig twilioConfig = {
//     auth: {
//         username: accountSid,
//         password: authToken
//     }
// };

// public function main() returns error? {
//     // Create the Twilio client
//     twilio:Client twilio = check new (twilioConfig);

//     // Create the message request
//     twilio:CreateMessageRequest messageRequest = {
//         To: "+94712345678", // Phone number to send the message
//         From: "+14843140730", // Twilio phone number
//         Body: "Hello from Ballerina"
//     };
//     // Send the message
//     twilio:Message response = check twilio->createMessage(messageRequest);

//     // Print the response
//     io:print(response);
// }
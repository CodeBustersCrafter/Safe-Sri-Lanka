from flask import Flask, Response, request
from twilio.twiml.voice_response import VoiceResponse

app = Flask(__name__)

@app.route("/twiml", methods=['GET', 'POST'])
def twiml():
    # Create a TwiML response
    response = VoiceResponse()

    # Custom message with user details
    user_name = request.args.get('name', 'Unknown')
    location = request.args.get('location', 'Unknown location')
    message = f"This is an emergency. The user's name is {user_name}, and her current location is {location}. Repeating again, The user's name is {user_name}, and her current location is {location}. Repeating for the third time, The user's name is {user_name}, and her current location is {location}."

    # Add message to the TwiML response
    response.say(message, voice="woman")

    # Return TwiML response as XML
    return Response(str(response), mimetype='text/xml')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
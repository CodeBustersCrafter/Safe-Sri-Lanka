from flask import Flask, request, jsonify
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
client = Client(account_sid, auth_token)

@app.route('/send-sms', methods=['POST'])
def send_sms():
    data = request.json
    user_name = data['userName']
    location_name = data['locationName']
    lat = data['lat']
    lon = data['lon']

    message_body = f"SOS Alert! {user_name} needs help. Location: {location_name}. Coordinates: {lat}, {lon}"

    message = client.messages.create(
        from_=os.environ.get("TWILIO_PHONE_NUMBER"),
        body=message_body,
        to='+94705226048'  # Replace with the actual emergency number
    )

    return jsonify({"status": "success", "message_sid": message.sid}), 200

if __name__ == '__main__':
    app.run(port=5000)
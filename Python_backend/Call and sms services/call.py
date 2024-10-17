import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()


# Use environment variables for sensitive information
account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
phone_number = os.environ.get("TWILIO_PHONE_NUMBER")
client = Client(account_sid, auth_token)

# Replace with your actual server address
server_address = "https://5457-2401-dd00-10-20-ade7-2468-7204-f119.ngrok-free.app"

user_name = "Kamala perera"
location = "University of Moratuwa"

call = client.calls.create(
  url=f"{server_address}/twiml?name={user_name}&location={location}",
  to="+94705226048",
  from_=phone_number
)

print(call.sid)
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
client = Client(account_sid, auth_token)

user_name = "Kamala Perera"
location = "University of Moratuwa"

message = client.messages.create(
  from_=os.environ.get("TWILIO_PHONE_NUMBER"),
  body=f"This is an emergency. The user's name is {user_name}, and her current location is {location}.",
  to='+94705226048'
)

print(message.sid)
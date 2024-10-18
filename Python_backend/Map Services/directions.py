import requests
import re
import os
from dotenv import load_dotenv

load_dotenv()

def get_directions(api_key, origin, destination, origin_lat, origin_lng, dest_lat, dest_lng):
    # Google Maps Directions API endpoint
    url = "https://maps.googleapis.com/maps/api/directions/json"
    
    # Set up the parameters for the API request
    params = {
        # "origin": origin,
        # "destination": destination,
        "origin": f"{origin_lat},{origin_lng}", # Starting point as lat,lng
        "destination": f"{dest_lat},{dest_lng}", # Ending point as lat,lng
        "key": api_key,             # API key
        "mode": "driving",          # Travel mode (e.g., driving, walking, bicycling)
        "language": "en"            # Language for the directions
    }
    
    # Make the request to the API
    response = requests.get(url, params=params)
    
    # Parse the response
    directions = response.json()
    
    # Initialize an empty string to store all directions
    all_directions = ""
    
    # Check if the API request was successful
    if directions['status'] == 'OK':
        # Extract the steps from the first route and leg
        steps = directions['routes'][0]['legs'][0]['steps']
        
        # Build the text-based directions in a more readable format
        for idx, step in enumerate(steps):
            # Extract the main instruction
            instruction = re.sub('<[^<]+?>', '', step['html_instructions'])
            
            # Add the step number and main instruction
            all_directions += f"Step {idx + 1}: {instruction}\n"
            
            # Check for additional information
            if 'maneuver' in step:
                all_directions += f"    Maneuver: {step['maneuver']}\n"
            
            if 'distance' in step:
                all_directions += f"    Distance: {step['distance']['text']}\n"
            
            if 'duration' in step:
                all_directions += f"    Duration: {step['duration']['text']}\n"
            
            # Check for any warnings or notes
            if 'notes' in step:
                all_directions += f"    Note: {step['notes']}\n"
            
            all_directions += "\n"  # Add a blank line between steps for readability
        
        # Print all directions at once
        print(all_directions)
    else:
        print("Error fetching directions:", directions['status'])

# Example usage:
Google_API_Key = os.getenv("Google_API_Key")
origin = "Colombo, Sri Lanka"
destination = "Kandy, Sri Lanka"

# Latitude and Longitude for the origin (Colombo, Sri Lanka)
origin_lat = 6.9271
origin_lng = 79.8612

# Latitude and Longitude for the destination (Kandy, Sri Lanka)
dest_lat = 7.2906
dest_lng = 80.6337

get_directions(Google_API_Key, origin, destination, origin_lat, origin_lng, dest_lat, dest_lng)

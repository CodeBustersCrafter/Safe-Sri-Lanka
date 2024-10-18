# import requests
# import json

# def get_routes(api_key, origin_lat, origin_lng, dest_lat, dest_lng):
#     # Routes API endpoint
#     url = "https://routes.googleapis.com/directions/v2:computeRoutes"

#     # Define the request headers and parameters
#     headers = {
#         "Content-Type": "application/json",
#         "X-Goog-Api-Key": api_key,  # Include your API key here
#         "X-Goog-FieldMask": "routes.legs.steps.navigationInstruction"  # Request only the step-by-step instructions
#     }
    
#     # Define the request body (origin and destination with lat/lng coordinates)
#     body = {
#         "origin": {
#             "location": {
#                 "latLng": {
#                     "latitude": origin_lat,  # Latitude for the origin
#                     "longitude": origin_lng  # Longitude for the origin
#                 }
#             }
#         },
#         "destination": {
#             "location": {
#                 "latLng": {
#                     "latitude": dest_lat,  # Latitude for the destination
#                     "longitude": dest_lng  # Longitude for the destination
#                 }
#             }
#         },
#         "travelMode": "DRIVE",  # Travel mode, can also be WALK, BICYCLE, etc.
#         "routingPreference": "TRAFFIC_AWARE",  # Optimize the route based on traffic conditions
#         "computeAlternativeRoutes": False,     # Only return the best route (not alternatives)
#         "routeModifiers": {
#             "avoidTolls": False,  # Can avoid tolls if set to True
#             "avoidHighways": False,  # Can avoid highways if set to True
#             "avoidFerries": False  # Can avoid ferries if set to True
#         },
#         "languageCode": "en-US",  # Language for the route instructions
#         "units": "METRIC"  # Metric units for distance (can be IMPERIAL for miles)
#     }
    
#     # Make the POST request to the Routes API
#     response = requests.post(url, headers=headers, data=json.dumps(body))
    
#     # Check for a successful request
#     if response.status_code == 200:
#         data = response.json()  # Parse the JSON response
        
#         # Access the steps of the route
#         steps = data['routes'][0]['legs'][0]['steps']  # Get the steps of the first route and first leg

#         # Print each step's navigation instructions
#         for idx, step in enumerate(steps):
#             # Safeguard against missing 'navigationInstruction'
#             if 'navigationInstruction' in step:
#                 print(f"Step {idx + 1}: {step['navigationInstruction']['instructions']}")
#             else:
#                 print(f"Step {idx + 1}: No detailed instructions for this step")
    
#     else:
#         print(f"Error fetching routes: {response.status_code}, {response.text}")
#         return None

# # Example usage:
# api_key = "AIzaSyCrv-hyFaQHFigg2WJ_CEKJ327yi-CdLfU"

# # Latitude and Longitude for the origin (e.g., Colombo, Sri Lanka)
# origin_lat = 6.9271
# origin_lng = 79.8612

# # Latitude and Longitude for the destination (e.g., Kandy, Sri Lanka)
# dest_lat = 7.2906
# dest_lng = 80.6337

# # Call the function to get and print the routes
# get_routes(api_key, origin_lat, origin_lng, dest_lat, dest_lng)

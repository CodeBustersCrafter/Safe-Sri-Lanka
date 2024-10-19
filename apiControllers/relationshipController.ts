import { BACKEND_URL_RELATIONSHIP } from '../app/const';

const API_URL = `${BACKEND_URL_RELATIONSHIP}/database/relationship`;

export const relationshipController = {
  addFriend: async (userId: number, friendId: number): Promise<any> => {
    console.log(`Adding friend ${friendId} for user ${userId}`);
    try {
      const response = await fetch(`${API_URL}/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "user1": userId.toString(),
          "user2": friendId.toString()
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        console.log(`Successfully added friend ${friendId} for user ${userId}`);
        return {
          ok: true,
          status: 'success'
        };
      } else {
        console.error('Error in addFriend:', data.message);
        return {
          ok: false,
          error: data.message
        };
      }
    } catch (error) {
      console.error('Error in addFriend:', error);
      return {
        ok: false,
        error: (error as Error).message
      };
    }
  },

  getNearbyFriends: async (userId: number, lat: number, lon: number, radius: number): Promise<any> => {
    console.log(`Fetching nearby friends for user ${userId} at (${lat}, ${lon}) within ${radius} km`);
    try {
      const response = await fetch(`${API_URL}/nearby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "userId": userId.toString(),
          "lat": lat.toString(),
          "lon": lon.toString(),
          "radius":radius.toString()
        }),
      });


      const data = await response.json();
      if (data.status === 'success') {
        console.log(`Successfully fetched ${data.nearbyFriends.length} nearby friends`);
        return {
          ok: true,
          friends: data.nearbyFriends
        };
      } else {
        console.error('Error in getNearbyFriends:', data.message);
        return {
          ok: false,
          error: data.message
        };
      }
    } catch (error) {
      console.error('Error in getNearbyFriends:', error);
      return {
        ok: false,
        error: (error as Error).message
      };
    }
  },

  getFriendRelationships: async (userId: number): Promise<any> => {
    console.log(`Fetching friend relationships for user ${userId}`);
    try {
      const response = await fetch(`${API_URL}/getRelationship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "id": userId.toString() }),
      });
    
      const data = await response.json();
      console.log(`Successfully fetched friend relationships for user ${userId}`);
      console.log(data);
      return {
        ok: true,
        relationships: data.relationships
      };
    } catch (error) {
      console.error('Error in getFriendRelationships:', error);
      return {
        ok: false,
        error: (error as Error).message
      };
    }
  },

  removeFriend: async (userId: number, friendId: number): Promise<any> => {
    console.log(`Removing friend ${friendId} for user ${userId}`);
    try {
      const response = await fetch(`${API_URL}/deleteRelationship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1: userId, user2: friendId }),
      });
     
      console.log(`Successfully removed friend ${friendId} for user ${userId}`);
      return {
        ok: true,
        status: 'success'
      };
    } catch (error) { 
      console.error('Error in removeFriend:', error);
      return {
        ok: false,
        error: (error as Error).message
      };
    }
  }
};

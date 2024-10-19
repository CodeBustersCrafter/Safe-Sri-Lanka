import { BACKEND_URL_PROFILE, UserProfile } from '../app/const';

const API_URL = `${BACKEND_URL_PROFILE}/database/profile`;

export const profileController = {
  getProfile: async (id: number): Promise<any> => {
    console.log(`Fetching profile for id: ${id}`);
    try {
      const response = await fetch(`${API_URL}/getProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "id": id.toString() }),
      });
    
      const data = await response.json();
      if (data.status === "error") {
        console.error(`Failed to fetch profile. Status: ${data.message}`);
        throw new Error(`Server error: ${data.message}`);
      }
      console.log(`Successfully fetched profile for id: ${id}`);
      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  },

  addProfile: async (profileData: UserProfile): Promise<any> => {
    console.log('Adding new profile:', profileData);
    try {
      const response = await fetch(`${API_URL}/addProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        console.error(`Failed to add profile. Status: ${response.status}`);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Successfully added new profile');
      return data;
    } catch (error) {
      console.error('Error in addProfile:', error);
      throw error;
    }
  },

  updateProfile: async (profileData: UserProfile): Promise<any> => {
    console.log('Updating profile:', profileData);
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        console.error(`Failed to update profile. Status: ${response.status}`);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Successfully updated profile');
      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },

  removeProfile: async (id: number): Promise<any> => {
    console.log(`Removing profile with id: ${id}`);
    try {
      const response = await fetch(`${API_URL}/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        console.error(`Failed to remove profile. Status: ${response.status}`);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(`Successfully removed profile with id: ${id}`);
      return data;
    } catch (error) {
      console.error('Error in removeProfile:', error);
      throw error;
    }
  },

  getProfiles: async (id: string): Promise<{status: string, profiles: UserProfile[]}> => {
    console.log('Fetching all profiles');
    try {
      const response = await fetch(`${API_URL}/getProfiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"id": id}),
      });
      if (!response.ok) {
        console.error(`Failed to fetch profiles. Status: ${response.status}`);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(`Successfully fetched ${data.length} profiles`);
      return {
        status: 'success',
        profiles: data.profiles
      };
    } catch (error) {
      console.error('Error in getProfiles:', error);
      throw error;
    }
  },
};

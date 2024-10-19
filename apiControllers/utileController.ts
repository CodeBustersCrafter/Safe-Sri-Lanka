import path from 'path';
import { BACKEND_URL_IMAGES } from '../app/const';

export const uploadImage = async (imageUri: string): Promise<string> => {
  try {
    
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile_picture.jpg',
    } as any);

    const response = await fetch(`${BACKEND_URL_IMAGES}/util/uploadImage`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    if (data.status === 'success') {
      return data.filename;
    } else {
      throw new Error(data.message || 'Failed to save image on server');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Invalid payload for serving image');
  }
};

export const fetchImage = async (filename: string): Promise<string> => {
  if (filename === null || filename === undefined || filename === '') {
    // Convert default image to base64 string
    // Since we can't use fs, we'll return a placeholder string instead
    // In a real-world scenario, you might want to use a static base64 string of a default image
    return '';
  }
  try {
    console.log("Fetching image:", filename);
    const response = await fetch(`${BACKEND_URL_IMAGES}/util/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename }),
    });

    // if (!response.ok) {
    //   console.log("Response:", response);
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
        
    const data = await response.json();
    if (data.status === 'success') {
      return data.image;
    } else {
      throw new Error(data.message || 'Failed to fetch image from server');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

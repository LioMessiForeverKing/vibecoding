// this save images onto imgbb

import axios from 'axios';

/**
 * Uploads an image to ImgBB and returns the URL of the uploaded image.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export async function uploadToImgBB(imageFile: File): Promise<string> {
  try {
    // Get the API key from environment variables
    const imgBBAPIKey = process.env.imgBBAPIKey;

    if (!imgBBAPIKey) {
      throw new Error('ImgBB API key is missing. Please set it in .env.local');
    }

    // Convert the image file to a Base64 string
    const formData = new FormData();
    formData.append('key', imgBBAPIKey);

    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(imageFile);
    });

    const base64Image = await base64Promise;
    formData.append('image', base64Image.split(',')[1]); // Remove the "data:image/*;base64," prefix

    // Make the POST request to ImgBB
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the URL of the uploaded image
    return response.data.data.url;
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    throw error;
  }
}
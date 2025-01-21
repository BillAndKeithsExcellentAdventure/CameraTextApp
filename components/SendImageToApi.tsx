import * as FileSystem from 'expo-file-system';

const sendImageToApi = async (imageUri: string, apiUrl: string) => {
  try {
    // Read the file as a binary string
    const fileContents = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create a form data object
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    // Send the file to the API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const responseData = await response.json();
    console.log('Image uploaded successfully:', responseData);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

export default sendImageToApi;
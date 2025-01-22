import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface Metadata {
  latitude?: number;
  longitude?: number;
  dateTime?: any;
}

const ExtractImageMetadata = async (imageUri: string): Promise<Metadata> => {
  const metadata: Metadata = {};

  try {
    const fileContents = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });


  } catch (error) {
      console.error('Error extracting metadata:', error);
  }

  return metadata;
};

export default ExtractImageMetadata;
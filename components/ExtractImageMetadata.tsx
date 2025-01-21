import * as FileSystem from 'expo-file-system';
import Exif from 'react-native-exif';
import { Alert } from 'react-native';

interface Metadata {
  latitude?: number;
  longitude?: number;
  dateTime?: string;
  errorLevel?: ('info' | 'warning' | 'error');
}

interface ExifData {
  GPSLatitude?: number;
  GPSLongitude?: number;
  DateTime?: string;
  [key: string]: any;
}

interface ExifError {
  message: string;
}


const ExtractImageMetadata = async (imageUri: string): Promise<Metadata> => {
  const metadata: Metadata = {};

  try {
    const fileContents = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const base64Image = `data:image/jpeg;base64,${fileContents}`;

    Exif.getExif(base64Image, (error: ExifError | null, 
                                  exifData: ExifData | null) => {
      if (error) {
        metadata.error = error.message;
        console.error('Error extracting metadata:', error);
      } else {
        if (exifData?.GPSLatitude && exifData.GPSLongitude) {
          metadata.latitude = exifData.GPSLatitude;
          metadata.longitude = exifData.GPSLongitude;
        }
        if (exifData?.DateTime) {
          metadata.dateTime = exifData.DateTime;
        }
      }
    });
  } catch (error) {
    metadata.error = (error as Error).message;
    console.error('Error extracting metadata:', error);
    Alert.alert('Info', `ready for image: ${imageUri}.`);
  }

  return metadata;
};

export default ExtractImageMetadata;
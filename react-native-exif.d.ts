declare module 'react-native-exif' {
    interface ExifData {
      GPSLatitude?: number;
      GPSLongitude?: number;
      DateTime?: string;
      [key: string]: any;
    }
  
    interface ExifError {
      message: string;
    }
  
    function getExif(
      uri: string,
      callback: (error: ExifError | null, exifData: ExifData | null) => void
    ): void;
  
    export { getExif, ExifData, ExifError };
  }
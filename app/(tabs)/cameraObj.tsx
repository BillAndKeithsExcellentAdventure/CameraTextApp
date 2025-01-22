import React, { useState, useEffect } from "react";
import { View, Button, Image, Alert, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import ExtractImageMetadata from "@/components/ExtractImageMetadata";

const CameraObj: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  const [location, setLocation] = useState<Location.LocationObject | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  
  async function getLocation ():Promise<void> {
        try {
          // Request permissions to access the user's location
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            setLoading(false);
            return;
          }
  
          // Get the user's current location
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
        } catch (error) {
          setErrorMsg("Failed to fetch location. Please try again.");
        } finally {
          setLoading(false);
        }
      };    

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await getLocation();
    }
  };

  const saveImageToLocal = async () => {
    
    console.info("Saving image to local storage.");
    if (image) {
      const fileName = image.split("/").pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      try {
        await FileSystem.copyAsync({
          from: image,
          to: newPath,
        });
        Alert.alert("Success", `Image saved to local storage! Path: ${image}`);
      } catch (error) {
        Alert.alert("Error", "Failed to save image to local storage.");
      }
    }
  };

  const extractMetaData = async () => {    
    console.info("Saving image to local storage.");
    if (image) {
        const handleExtractMetadata = async (imageUri: string) => {
        try {
          const metadata = await ExtractImageMetadata(imageUri);
          console.log('Extracted Metadata:', metadata);
        } catch (error) {
          console.error('Error handling metadata extraction:', error);
        }
      };

      const gps = handleExtractMetadata(image);
      gps.then((result) => {
        console.log(`result: ${result}`);
      }).catch((error) => {
        console.error(`error: ${error}`);
      });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open Camera" onPress={openCamera} />
      {image && (
        <>
          <View>
            <View>
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
              />
            </View>
            <View>
            <Button title="Save Image" onPress={saveImageToLocal} />
            <Text style={{color: "red", fontSize: 30}}>{location?JSON.stringify(location):"Unknown"}</Text>
            <Button title="Save Image" onPress={extractMetaData} />
            </View>
          </View>
        </>
      )}
    </View>
  );
};


export default CameraObj;

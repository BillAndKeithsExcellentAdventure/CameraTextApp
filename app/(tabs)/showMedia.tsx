import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

interface ImageInfo {
  latitude?: number;
  longitude?: number;
  dateTime?: any;
  uri?: string;
  filename?: string;
  id?: string;
}

export default function showMedia() {
  const [permissionResponse, setPermissionResponse] =
    useState<MediaLibrary.PermissionResponse | null>(null);
  const [assets, setAssets] = useState<MediaLibrary.Asset[] | null>(null);
  const [images, setImages] = useState<ImageInfo[] | null>(null);

  useEffect(() => {
    (async () => {
      const response = await MediaLibrary.requestPermissionsAsync();
      setPermissionResponse(response);
    })();
  }, []);

  const getAssets = async () => {
    if (permissionResponse?.status !== "granted") {
      return;
    }

    const fetchedAssets = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      first: 100,
    });
    setAssets(fetchedAssets.assets);

    const imgArray: ImageInfo[] = await fetchedAssets.assets.reduce<Promise<ImageInfo[]>>(async (accPromise, asset) => {
        const acc = await accPromise;
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
      
        // Conditional inclusion
        if (assetInfo?.location?.latitude && assetInfo?.location?.longitude) {
          acc.push({
            uri: asset.uri,
            id: asset.id,
            filename: asset.filename,
            latitude: assetInfo.location.latitude,
            longitude: assetInfo.location.longitude,
          });
        }
      
        return acc;
      }, Promise.resolve([] as ImageInfo[]));

    setImages(imgArray);
  };

  return (
    <View style={styles.container}>
      <Button title="Get Assets" onPress={getAssets} />
      {images && (
        <ScrollView>
          {images.map((img) => (
            <View key={img.id}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <Text style={styles.text}>{img.filename}</Text>
              <Text style={styles.text}>{img.latitude}</Text>
              <Text style={styles.text}>{img.longitude}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 400,
    height: 400,
    margin: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },
});

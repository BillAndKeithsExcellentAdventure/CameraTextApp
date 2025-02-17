import React, { useState, useEffect } from "react";
import { Button, Text, View, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import MapComponent from "@/components/MapComponent";

interface ImageInfo {
    latitude: number;
    longitude: number;
    dateTime?: any;
    uri?: string;
    filename: string;
    id?: string;
}

export default function showMedia() {
    const [permissionResponse, setPermissionResponse] = useState<MediaLibrary.PermissionResponse | null>(null);
    const [assets, setAssets] = useState<MediaLibrary.Asset[] | null>(null);
    const [images, setImages] = useState<ImageInfo[] | null>(null);
    const [showMap, setShowMap] = useState<boolean>(false);
    const [currentLat, setCurrentLat] = useState<number>(0);
    const [currentLong, setCurrentLong] = useState<number>(0);
    const [currentFilename, setCurrentFilename] = useState<string>("");

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
            first: 200,
        });
        setAssets(fetchedAssets.assets);

        const imgArray: ImageInfo[] = await fetchedAssets.assets.reduce<Promise<ImageInfo[]>>(
            async (accPromise, asset) => {
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
            },
            Promise.resolve([] as ImageInfo[])
        );

        setImages(imgArray);
    };

    const openMap = (latitude: number, longitude: number, filename: string) => {
        setCurrentLat(latitude);
        setCurrentLong(longitude);
        setCurrentFilename(filename);
        setShowMap(true);
    };

    const closeMap = () => {
        setShowMap(false);
    };

    return (
        <View style={styles.container}>
            <Button
                title="Get Assets"
                onPress={getAssets}
            />
            {images && !showMap && (
                <ScrollView>
                    {images.map((img) => (
                        <View key={img.id}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => openMap(img.latitude, img.longitude, img.filename)}>
                                <Image
                                    source={{ uri: img.uri }}
                                    style={styles.image}
                                />
                                <Text style={styles.text}>{img.filename}</Text>
                                <Text style={styles.text}>{img.latitude}</Text>
                                <Text style={styles.text}>{img.longitude}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}
            {showMap && (
                <View style={styles.mapContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={closeMap}>
                        <Text style={styles.text}>Hide Map</Text>
                    </TouchableOpacity>
                    <MapComponent
                        latitude={currentLat}
                        longitude={currentLong}
                        markerTitle={currentFilename}
                    />
                </View>
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
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    image: {
        width: 150,
        height: 150,
        margin: 5,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        margin: 10,
    },
    mapContainer: {
        flex: 1, // Allow the map to take the rest of the screen
    },
});

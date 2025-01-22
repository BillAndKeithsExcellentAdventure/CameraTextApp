import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, ScrollView } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";

const EARTH_RADIUS = 6378137; // Earth's radius in meters (WGS84)

const MapWithAreaCalculation: React.FC = () => {
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [region, setRegion] = useState({
    latitude: 39.5987742, 
    longitude: -84.1352643,
    latitudeDelta: 0.0025,
    longitudeDelta: 0.0025,
  });
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    () => {
      const { location, errorMsg } = useCurrentLocation();
      if (location?.coords.latitude && location?.coords.longitude) {
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };
  }, []);

  // Function to convert degrees to radians
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const calculateLinearDistance = (coordinates: [number, number][]): number => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
    const haversineDistance = ([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number => {
      const R = 6371e3; // Earth's radius in meters
      const φ1 = toRadians(lat1);
      const φ2 = toRadians(lat2);
      const Δφ = toRadians(lat2 - lat1);
      const Δλ = toRadians(lon2 - lon1);
  
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
      return R * c; // Distance in meters
    };
  
    let totalDistance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      totalDistance += haversineDistance(coordinates[i], coordinates[i + 1]);
    }
  
    return totalDistance * 3.28084; // Total distance in feet
  };

// filepath: /C:/Users/KeithBertram/source/repos/CameraTextApp/components/MapWithAreaCalculations.tsx
const calculatePolygonArea = (coordinates: [number, number][]): number => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
  
    const R = 6371e3; // Earth's radius in meters
    let area = 0;
  
    if (coordinates.length > 2) {
      for (let i = 0; i < coordinates.length; i++) {
        const [lat1, lon1] = coordinates[i];
        const [lat2, lon2] = coordinates[(i + 1) % coordinates.length];
  
        const φ1 = toRadians(lat1);
        const φ2 = toRadians(lat2);
        const Δλ = toRadians(lon2 - lon1);
  
        const segmentArea = (R * R * Δλ * (Math.sin(φ2) - Math.sin(φ1))) / 2;
        area += segmentArea;
      }
    }
  
    const areaInSquareMeters = Math.abs(area); // Area in square meters
    const areaInSquareFeet = areaInSquareMeters * 10.7639; // Convert to square feet
  
    return areaInSquareFeet;
  };

  const handleReset = async () => {
    setCoordinates([]); // Reset the coordinates for a new calculation
    setMessages([]); // Clear the messages
  };

  // Record the current location
  const handleRecordLocation = async () => {
    console.info("Recording location...");

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }
    console.info("ready to get current position...");
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    console.info("ready to get current position...");
    const { latitude, longitude } = location.coords;
    
    console.info(`Location recorded: ${latitude}, ${longitude} (Accuracy: ${location.coords.accuracy} meters)`);    
    setMessages((prev) => [...prev, `${latitude}, ${longitude}`]);

    // Add the new coordinate to the array
    const updatedCoordinates = [...coordinates, [latitude, longitude] as [number, number]];

    console.info(`done updating coordinates: ${updatedCoordinates.length} coordinates are in the array.`);

    setCoordinates(updatedCoordinates);

    // Update map's region to the current location
    setRegion((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));

    console.info(` done updating region: ${region.latitude}, ${region.longitude}`);
    

    if (updatedCoordinates.length > 1) {
        const dist = calculateLinearDistance(updatedCoordinates);
        setMessages((prev) => [...prev, `linear distance: ${dist.toFixed(2)} feet`]);
        }

    if (updatedCoordinates.length > 2) {
      // Close the polygon by adding the first coordinate as the last point
      const closedPolygon = [...updatedCoordinates, updatedCoordinates[0]];
      const area = calculatePolygonArea(closedPolygon);
      closedPolygon.map((coord, index) => console.info(`Point ${index + 1}: ${coord[0]}, ${coord[1]}`));
      setMessages((prev) => [...prev, `area: ${area.toFixed(2)} square feet`]);
      console.info(`Area: ${area} feet`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.coordContainer}>
        {messages.map((msg, index) => (
          <View key={index}>
            <Text style={styles.text}>{`${msg}`}</Text>
          </View>
        ))}
      </ScrollView>
      <MapView style={styles.map} region={region} onRegionChangeComplete={(newRegion) => setRegion(newRegion)}>
        {/* Display markers for each coordinate */}
        {coordinates.length === 1 && (coordinates.map(([lat, lon], index) => (
          <Marker key={index} coordinate={{ latitude: lat, longitude: lon }} title={`Point ${index + 1}`} />
        )))}
                {coordinates.length > 1 && (
          <Polyline
            coordinates={coordinates.map(([latitude, longitude]) => ({ latitude, longitude }))}
            strokeColor="#000" // black color
            strokeWidth={3}
          />
        )}
      </MapView>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Record Location" onPress={handleRecordLocation}/>
        </View>
        <View style={styles.button}>
          <Button title="Reset" onPress={handleReset} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  coordContainer: {
    top: 30,
    margin: 10,
    width:40
  },
  map: {
    flex: 4,
  },
  text: {
    fontSize: 12,
    color: "gray",
  },
  button: {
    margin: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: "25%",
    transform: [{ translateX: -175 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    overflow: "hidden",
    width: 150,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 5,
  },
});

export default MapWithAreaCalculation;

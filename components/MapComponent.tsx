import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

interface MapProps {
  latitude: number; // Latitude to locate
  longitude: number; // Longitude to locate
  markerTitle?: string; // Optional marker title
}

const MapComponent: React.FC<MapProps> = ({ latitude, longitude, markerTitle }) => {
  // Define the initial region for the map
  const initialRegion: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.05, // Zoom level (smaller values = closer zoom)
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion} // Center the map on the provided lat/lon
      >
        {/* Marker to indicate the location */}
        <Marker
          coordinate={{ latitude, longitude }}
          title={markerTitle || 'Location'}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width, // Full width of the screen
    height: Dimensions.get('window').height, // Full height of the screen
  },
});

export default MapComponent;

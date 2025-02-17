// filepath: /C:/Users/KeithBertram/source/repos/CameraTextApp/components/MapComponent.native.tsx
import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';

const MapComponent = ({ region, coordinates, onRegionChangeComplete }) => (
  <MapView style={{ flex: 1 }} region={region} onRegionChangeComplete={onRegionChangeComplete}>
    {coordinates.map(([lat, lon], index) => (
      <Marker key={index} coordinate={{ latitude: lat, longitude: lon }} title={`Point ${index + 1}`} />
    ))}
    {coordinates.length > 1 && (
      <Polyline
        coordinates={coordinates.map(([latitude, longitude]) => ({ latitude, longitude }))}
        strokeColor="#000" // black color
        strokeWidth={3}
      />
    )}
  </MapView>
);

export default MapComponent;
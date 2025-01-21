import { useState, useEffect } from "react";
import * as Location from "expo-location";

export function useCurrentLocation():{
  location?: Location.LocationObject;
  errorMsg?: string;
  loading: boolean;
}  {
  const [location, setLocation] = useState<Location.LocationObject | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  return { location, errorMsg, loading };
}

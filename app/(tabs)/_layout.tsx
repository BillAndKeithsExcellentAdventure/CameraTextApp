import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="overlayCameraObj"
        options={{
          title: "Overlay",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="photo-camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="showMedia"
        options={{
          title: "Media",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="image" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cameraObj"
        options={{
          title: "Camera",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="MapWithCoordinates"
        options={{
          title: "Area",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="wallpaper" color={color} />,
        }}
      />
      <Tabs.Screen
        name="JobDatabase"
        options={{
          title: "DB",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="wallpaper" color={color} />,
        }}
      />      
    </Tabs>
  );
}

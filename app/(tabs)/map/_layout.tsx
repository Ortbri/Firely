import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const MapStack = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[map]" options={{ }} />
    </Stack>
  );
};

export default MapStack;

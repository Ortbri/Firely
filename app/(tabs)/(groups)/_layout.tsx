import { Stack } from "expo-router";
import React from "react";

const GroupStack = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Messages" }} />
      <Stack.Screen name="[id]" />
    </Stack>
  );
};

export default GroupStack;

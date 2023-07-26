import { Stack } from "expo-router";
import React from "react";

const HomeStack = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="createjob"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="[jobid]" />
    </Stack>
  );
};

export default HomeStack;

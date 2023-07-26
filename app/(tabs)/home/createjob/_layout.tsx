import { Stack } from "expo-router";
import React from "react";

const CreateStack = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen name="[preview]" options={{ title: "Preview" }} />
    </Stack>
  );
};

export default CreateStack;

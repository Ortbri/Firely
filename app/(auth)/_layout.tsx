import React from "react";
import { Stack } from "expo-router";

const AuthStack = () => {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ headerShown: false, title: "login" }}
      />
      <Stack.Screen
        name="register"
        options={{
          // headerTransparent: true,
          title: "Create Account",
          headerBackTitle: "Login",
          headerTransparent: true,
          headerTintColor: "black",
        }}
      />
    </Stack>
  );
};

export default AuthStack;

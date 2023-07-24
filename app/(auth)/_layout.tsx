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
      <Stack.Screen
        name="name"
        options={{
          headerTransparent: true,
          title: "Name",
          headerBackTitle: "Register",
          headerTintColor: "black",
        }}
      />
      <Stack.Screen
        name="dob"
        options={{
          headerTransparent: true,
          title: "Date of Birth",
          headerBackTitle: "Name",
          headerTintColor: "black",
        }}
      />
    </Stack>
  );
};

export default AuthStack;

import { Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "@/config/FirebaseConfig";

const OnboardingStack = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="stripe"
        options={{
          headerTitle: "Stripe",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default OnboardingStack;

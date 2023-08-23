import { Stack } from "expo-router";
import React from "react";
import { Button, Pressable } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { FIREBASE_AUTH } from "@/config/FirebaseConfig";
import { NavigationBarStyle } from "@stripe/stripe-react-native/lib/typescript/src/types/ThreeDSecure";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const OnboardingStack = () => {
  const router = useRouter();
  const headerLeft = () => (
    <Pressable onPress={router.back} style={{}}>
      <MaterialIcons name="keyboard-arrow-down" size={28} color="black" />
    </Pressable>
  );
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

      <Stack.Screen
        name="stripeweb"
        options={{
          headerTitle: "Create Account",
          headerShown: true,
          presentation: "modal",
          headerLeft: headerLeft,
        }}
      />
    </Stack>
  );
};

export default OnboardingStack;

import { Stack } from "expo-router";
import React from "react";
import { Button } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "@/config/FirebaseConfig";

const ProfileStack = () => {
  const { user, initialized } = useAuth();

  const doLogout = () => {
    console.log("logout");
    signOut(FIREBASE_AUTH);
  };
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Profile",
          headerRight: () => (
            <Button onPress={doLogout} title="Logout"></Button>
          ),
        }}
      />
      <Stack.Screen
        name="setting"
        options={{
          headerTitle: "Settings",
          headerRight: () => (
            <Button onPress={doLogout} title="Logout"></Button>
          ),
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          headerTitle: "Payment",
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          headerTitle: "Checkout",
        }}
      />
      <Stack.Screen
        name="marketplace"
        options={{
          headerTitle: "marketplace",
        }}
      />
      <Stack.Screen
        name="ui"
        options={{
          headerTitle: "marketplace",
        }}
      />
    </Stack>
  );
};

export default ProfileStack;

import { View, Text, StyleSheet, Image } from "react-native";
import { Button, ButtonText } from "@gluestack-ui/react";
import { usePathname, useRouter } from "expo-router";
import React from "react";

export default function onboarding() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 12,
    },
    title: {
      flex: 1,
      fontSize: 40,
      fontWeight: "bold",
      marginBottom: 12,
    },
    buttonContainer: {
      marginBottom: 30,
    },
  });
  const router = useRouter();
  const createUser = () => {
    console.log("create user");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start earning within your community</Text>

      <Button
        size="md"
        onPress={() => router.push("/(tabs)/profile/onboarding/stripe")}
        style={styles.buttonContainer}
      >
        <ButtonText>Become a worker?</ButtonText>
      </Button>
    </View>
  );
}

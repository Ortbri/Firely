import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import React from "react";

const HomePage = () => {
  const router = useRouter();
  const handlePress = () => {
    console.log("Pressed");
    router.push("/(tabs)/home/3455");
  };
  return (
    <View>
      <Text onPress={handlePress}>Home page stuff</Text>
    </View>
  );
};

export default HomePage;

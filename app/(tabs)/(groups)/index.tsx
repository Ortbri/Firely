import { View, Text } from "react-native";

import React from "react";
import { useRouter } from "expo-router";

const groups = () => {
  const router = useRouter();
  const handlePress = () => {
    console.log("Pressed");
    router.push("/123");
  };
  return (
    <View>
      <Text onPress={handlePress}>groups</Text>
    </View>
  );
};

export default groups;

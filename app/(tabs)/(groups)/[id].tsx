import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const ChatPage = () => {
  const handlePress = () => {
    console.log("Pressed");
  };

  return (
    <View>
      <Text onPress={handlePress}>id</Text>
    </View>
  );
};

export default ChatPage;

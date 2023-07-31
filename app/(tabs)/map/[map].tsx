import { View, Text } from "react-native";
import { useLocalSearchParams, useSearchParams } from "expo-router";
import React from "react";

const Maping = () => {
  const { locationId, name } = useSearchParams();
  console.log("passed over", locationId);
  return (
    <View>
      <Text>Maping {locationId}</Text>
      <Text>location: {name}</Text>
    </View>
  );
};

export default Maping;

import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Job = () => {
  // const { id } = useSearchParams();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Job {id}</Text>
    </View>
  );
};

export default Job;

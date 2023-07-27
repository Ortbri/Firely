import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
// import { Image } from "expo-image";

const Preview = () => {
  const { jobTitle, description, location, imageUri } = useLocalSearchParams();

  console.log("passed over: ", jobTitle, description, location, imageUri);

  return (
    <View>
      <Image
        source={{ uri: imageUri }}
        style={{ width: "100%", height: 250 }}
      />

      <Text style={{ fontSize: 24, fontWeight: "bold", alignSelf: "center" }}>
        Preview
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "600", alignSelf: "center" }}>
        Job: {jobTitle}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "400", alignSelf: "center" }}>
        Description: {description}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "400", alignSelf: "center" }}>
        Location: {location}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: { width: "100%", height: 250 },
});
export default Preview;

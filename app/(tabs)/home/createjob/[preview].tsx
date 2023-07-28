import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import React from "react";
import { Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
// import { Image } from "expo-image";

const Preview = () => {
  const { jobTitle, description, location, imageUri } = useLocalSearchParams();

  console.log("passed over: ", jobTitle, description, location);

  const renderItem = ({ item }) => {
    return <Image source={{ uri: item }} style={styles.image} />;
  };

  return (
    <View>
      {/* RENDERING 1 IMAGE ONLY */}
      <Image
        source={{ uri: imageUri }}
        style={{ width: "100%", height: 250 }}
      />
      {/* RENDERING 1 IMAGE ONLY */}

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
      {/* <FlatList
        data={Array.isArray(imageUris) ? imageUris : [imageUris]}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        horizontal // Set this to true if you want the images to be horizontally scrollable
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  image: { width: 200, height: 250, margin: 5, borderRadius: 5 },
});
export default Preview;

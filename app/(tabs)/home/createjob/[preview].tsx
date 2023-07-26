import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";

const Preview = () => {
  const { jobTitle, description, location, images } = useLocalSearchParams();

  console.log("passed over: ", jobTitle, description, location, images);

  return (
    <View>
      {/* try expo image */}
      {/* <Image
        source={{ uri: imageUri }}
        style={{ width: "100%", height: 250 }}
      /> */}
      {/* <ScrollView horizontal>
        {images.map(
          (image: { uri: any }, index: React.Key | null | undefined) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={styles.image}
            />
          )
        )}
      </ScrollView> */}
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

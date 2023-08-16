import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

export default function Marketplace() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "lightblue",
    },
    personContainer: {
      margin: 12,
      backgroundColor: "white",
      borderRadius: 12,
      padding: 12,
    },
    person: {
      fontSize: 20,
    },
    details: {},
  });
  const handleButton = () => {
    console.log("Pressed me");
  };
  return (
    <View style={styles.container}>
      <Pressable style={styles.personContainer} onPress={handleButton}>
        <Text style={styles.person}>Person</Text>
        <Text style={styles.details}>total: $45</Text>
      </Pressable>
    </View>
  );
}

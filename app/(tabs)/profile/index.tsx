import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import React from "react";

const profile = () => {
  return (
    <View>
      <Link href="/(tabs)/profile/setting" asChild>
        <Pressable style={{ margin: 24 }}>
          <Text>Settings Page</Text>
        </Pressable>
      </Link>
      <View style={{ borderWidth: 0.3, borderColor: "lightgrey" }} />
      <Link href="/(tabs)/profile/payment" asChild>
        <Pressable style={{ margin: 24 }}>
          <Text>Payment Page</Text>
        </Pressable>
      </Link>
      <View style={{ borderWidth: 0.3, borderColor: "lightgrey" }} />
      <Link href="/(tabs)/profile/checkout" asChild>
        <Pressable style={{ margin: 24 }}>
          <Text>Checkout</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default profile;

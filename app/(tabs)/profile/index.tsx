import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { useAuth } from "@/context/AuthContext";

const profile = () => {
  const user = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "black", padding: 12 }}>
        <Text style={{ alignSelf: "center", padding: 6, color: "white" }}>
          {user.user?.email}
        </Text>
        <Text style={{ alignSelf: "center", padding: 6, color: "white" }}>
          {user.user?.uid}
        </Text>
      </View>
      <View style={{ borderTopWidth: 0.3, borderTopColor: "lightgrey" }} />
      <Link href="/(tabs)/profile/setting" asChild>
        <Pressable style={{ padding: 24 }}>
          <Text>Settings Page</Text>
        </Pressable>
      </Link>
      <View style={{ borderTopWidth: 0.3, borderTopColor: "lightgrey" }} />

      <Link href="/(tabs)/profile/payment" asChild>
        <Pressable style={{ padding: 24 }}>
          <Text>Payment Page</Text>
        </Pressable>
      </Link>
      <View style={{ borderTopWidth: 0.3, borderTopColor: "lightgrey" }} />

      <Link href="/(tabs)/profile/checkout" asChild>
        <Pressable style={{ padding: 24 }}>
          <Text>Checkout</Text>
        </Pressable>
      </Link>
      <View style={{ borderTopWidth: 0.3, borderTopColor: "lightgrey" }} />
      <Link href="/(tabs)/profile/marketplace" asChild>
        <Pressable style={{ padding: 24 }}>
          <Text>Marketplace</Text>
        </Pressable>
      </Link>
      <View style={{ borderTopWidth: 0.3, borderTopColor: "lightgrey" }} />
      <Link href="/(tabs)/profile/ui" asChild>
        <Pressable style={{ padding: 24 }}>
          <Text>ui</Text>
        </Pressable>
      </Link>
      <View style={{ borderTopWidth: 0.3, borderTopColor: "lightgrey" }} />
      <Link href="/(tabs)/profile/onboarding" asChild>
        <Pressable style={{ padding: 24 }}>
          <Text>Onboarding</Text>
        </Pressable>
      </Link>
      <View style={{ borderTopWidth: 0.3, borderTopColor: "lightgrey" }} />
    </View>
  );
};

export default profile;

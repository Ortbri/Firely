// Was using View, but did not automatically redirect. i added the redirect, now redirecting.

import React from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <View>
      <Text>Welcome Back!</Text>
    </View>
  );
}
// import * as React from "react";
// import { View } from "react-native";

// export default function Index() {
//   return <View />;
// }

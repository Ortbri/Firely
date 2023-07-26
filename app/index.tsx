// Was using View, but did not automatically redirect. i added the redirect, now redirecting.

import React from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const { user } = useAuth();

  if (!user) {
    console.log("redirecting to login");
    return <Redirect href="/login" />;
  } else if (user) {
    // it doenst use this redirect i use it as a safety redirect
    console.log("redirect to home");
    return <Redirect href="/(tabs)/home" />;
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

import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { AuthContext, AuthProvider } from "@/context/AuthContext";

const InitialLayout = () => {
  const { user, initialized } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    console.log("startPage");
    if (!initialized) return;

    console.log("forward to page");

    if (user) {
      console.log("User exixts, forward to inside ");
      router.push("/(tabs)/groups");
    } else {
      console.log("User does not exist, forward to Login ");
      router.push("/(auth)/login");
    }
  }, [user, initialized]);
  return (
    <View style={styles.container}>
      {initialized ? <></> : <Text>Loading...</Text>}
    </View>
  );
};

const StartPage = () => {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartPage;

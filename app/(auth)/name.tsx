import { View, Text, Pressable, TextInput } from "react-native";
import { useSearchParams, Link } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Name = () => {
  const { username, email, password } = useSearchParams();
  //   console.log(username, email, password);

  const [firstName, setFirstName] = React.useState("");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // backgroundColor: "red",
        justifyContent: "center",
      }}
    >
      <Text style={{ alignSelf: "center" }}>{username}</Text>
      <TextInput
        style={{
          borderColor: "#ccc",
          borderWidth: 0.3,
          height: 40,
          //   width: 200,
          //   flex: 1,
          padding: 12,
          margin: 12,
        }}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
      />
      <Link
        style={{ alignSelf: "center" }}
        href={{
          pathname: "/(auth)/dob",
          params: { username, email, password, firstName },
        }}
      >
        <Text style={{ fontSize: 24, alignSelf: "center" }}>DOB</Text>
      </Link>
    </SafeAreaView>
  );
};

export default Name;

import { Link } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth/react-native";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Pressable,
  Text,
} from "react-native";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";
import Spinner from "react-native-loading-spinner-overlay";

const Login = ({}) => {
  const [email, setEmail] = useState("brian.ort02@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      console.log("signed in");
    } catch (error) {
      console.error("There was an error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <Image
        style={styles.logo}
        source={{
          uri: "https://images.squarespace-cdn.com/content/v1/633cc37e9f892b0dd57c2dbd/0c3536c6-f8e6-454b-9368-7e612c09dc92/icon+onlyCL+.png",
        }} // replace with your own image URL
      />
      <TextInput
        placeholder="simon@galaxies.dev"
        value={email}
        onChangeText={setEmail}
        style={styles.inputField}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
      />
      <Button onPress={handleLogin} title="Login"></Button>

      <Link href="/(auth)/register" asChild>
        <Pressable style={styles.button}>
          <Text>Don't have an account? Register</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5FCFF",
  },
  logo: {
    width: 100,
    height: 77,
    alignSelf: "center",
    marginBottom: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 10,
    alignItems: "center",
  },
});

export default Login;

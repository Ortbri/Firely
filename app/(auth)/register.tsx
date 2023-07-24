import {
  UserCredential,
  createUserWithEmailAndPassword,
} from "firebase/auth/react-native";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../config/FirebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const Register = ({}) => {
  const [username, setUsername] = useState("Orbit");
  const [email, setEmail] = useState("Brian.ort02@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleRegistration = async () => {
    router.push({
      pathname: "/(auth)/name",
      params: {
        username: username,
        email: email,
        password: password,
      },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="GalacticHero42"
        value={username}
        onChangeText={setUsername}
        style={styles.inputField}
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

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button onPress={handleRegistration} title="Continue..."></Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default Register;

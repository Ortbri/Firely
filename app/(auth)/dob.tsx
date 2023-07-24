import {
  UserCredential,
  createUserWithEmailAndPassword,
} from "firebase/auth/react-native";
import React, { useState } from "react";
import { Text, SafeAreaView, Button } from "react-native";
import { useSearchParams } from "expo-router";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../config/FirebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const Dob = () => {
  const [loading, setLoading] = useState(false);
  const { username, email, password, firstName } = useSearchParams();

  const handleRegistration = async () => {
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      createUserInformation(user);
    } catch (error) {
      console.error("There was an error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUserInformation = async (user: UserCredential) => {
    try {
      const docRef = await setDoc(doc(FIRESTORE_DB, `users/${user.user.uid}`), {
        email: user.user.email,
        username,
        firstName,
      });
    } catch (error) {
      console.error("There was an error creating user information:", error);
    }
  };

  return (
    <SafeAreaView
      style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
    >
      <Text>Dob: {username}</Text>
      <Text>Dob: {email}</Text>
      <Text>Dob: {password}</Text>
      <Text>Dob: {firstName}</Text>
      <Button title="Dob" onPress={handleRegistration} />
    </SafeAreaView>
  );
};

export default Dob;

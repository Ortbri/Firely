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
      await setDoc(doc(FIRESTORE_DB, `users/${user.user.uid}`), {
        email: user.user.email,
        username,
        firstName,
      });

      console.log(
        "User information document created successfully for user:",
        user.user.uid
      );
    } catch (error) {
      console.error("Error creating user information:", error);
      // Log additional information for debugging purposes
      console.log("User UID:", user.user.uid);
      console.log("Email:", user.user.email);
      console.log("Username:", username);
      console.log("FirstName:", firstName);
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

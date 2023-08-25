import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Button, ButtonText } from "@gluestack-ui/react";
import { Stack, usePathname, useRouter } from "expo-router";
import React from "react";
import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";

export default function Stripe() {
  const screenHeight = Dimensions.get("window").height;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 12,
    },
    title: {
      // flex: 1,
      fontSize: 40,

      fontWeight: "bold",
      marginBottom: 12,
    },
    titletwo: { flex: 1, fontSize: 22, fontWeight: "500", color: "#212427" },
    subtitle: {
      flex: 1,
      fontSize: 22,
      fontWeight: "500",
      marginBottom: 12,
      color: "#212427",
    },
    buttonContainer: {
      // flex: 1,
      marginBottom: 30,
      padding: 4,
    },
    webview: {
      // flex: 1,
      height: screenHeight,
    },
  });
  const userId = useAuth().user?.uid;
  const router = useRouter();

  const createUser = async () => {
    console.log("Creating user worker:", userId);

    try {
      // Check if the stripe_supplier document exists for the given UID
      const stripeSupplierDocRef = doc(
        collection(FIRESTORE_DB, "stripe_supplier"),
        userId
      );
      const stripeSupplierDocSnapshot = await getDoc(stripeSupplierDocRef);

      if (!stripeSupplierDocSnapshot.exists()) {
        // If the document doesn't exist, create it
        const userData = {
          account_id: "", // Set this to the Stripe account ID
          // otherDetails: "", // Add any other details you want to store
        };

        await setDoc(stripeSupplierDocRef, userData);
        console.log("User worker created successfully");
      } else {
        console.log("User worker already exists");
      }
    } catch (error) {
      console.error("Error creating user worker:", error);
    }
  };

  const testButton = async () => {
    try {
      const userDocRef = doc(
        collection(FIRESTORE_DB, "stripe_supplier"),
        userId
      );

      // Reset account_link to an empty string
      await setDoc(userDocRef, { account_link: "" }, { merge: true });

      console.log("Account link reset successfully");
    } catch (error) {
      console.error("Error resetting account link:", error);
    }
    router.push("/(tabs)/profile/onboarding/stripeweb");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Steps to complete</Text>
      <Text style={styles.titletwo}>this may take longer than 5 minutes</Text>
      <Text style={styles.subtitle}>Step 1</Text>
      <Text style={styles.subtitle}>Step 2</Text>
      <Text style={styles.subtitle}>Step 3</Text>

      <Button bg="black" onPress={createUser} style={styles.buttonContainer}>
        <ButtonText>Create Account</ButtonText>
      </Button>
      <Button
        size="md"
        onPress={testButton}
        variant="outline"
        style={styles.buttonContainer}
      >
        <ButtonText>Test Link</ButtonText>
      </Button>
    </View>
  );
}

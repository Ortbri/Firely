import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";

import { useStripe } from "@stripe/stripe-react-native";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";

export default function Checkout() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 24,
    },
    numberTotal: {
      flex: 1,
      fontSize: 40,
      fontWeight: "700",
      alignSelf: "center",
    },
    button: { backgroundColor: "black", padding: 12, margin: 24 },
    buttonText: { color: "white", alignSelf: "center" },
  });

  const user = useAuth();
  const totalAmount = 20;
  const { presentPaymentSheet, initPaymentSheet } = useStripe();
  const [paymentData, setPaymentData] = useState({
    paymentIntentClientSecret: "",
    ephemeralKeySecret: "",
    customer: "",
  });
  console.log(paymentData);

  useEffect(() => {
    const checkoutSessionDocRef = doc(
      collection(FIRESTORE_DB, "users", user.user?.uid, "checkout_sessions"),
      "SESSION_ID" // Use the same unique ID as created in the onCheckout function
    );

    const unsubscribe = onSnapshot(checkoutSessionDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const sessionData = snapshot.data();
        setPaymentData({
          paymentIntentClientSecret: sessionData.paymentIntentClientSecret,
          ephemeralKeySecret: sessionData.ephemeralKeySecret,
          customer: sessionData.customer,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onCheckout = async () => {
    if (!totalAmount) {
      Alert.alert("Invalid Amount", "Please enter a valid total amount.");
      return;
    }

    const amountInCents = parseFloat(totalAmount) * 100;

    try {
      // Delete the existing checkout session document (if it exists)
      const checkoutSessionDocRef = doc(
        collection(FIRESTORE_DB, "users", user.user?.uid, "checkout_sessions"),
        "SESSION_ID"
      );
      await deleteDoc(checkoutSessionDocRef);

      // Create a new checkout session in Firestore with the same session ID
      await setDoc(checkoutSessionDocRef, {
        client: "mobile",
        mode: "payment",
        amount: amountInCents,
        currency: "usd",
      });

      // Initialize and present the payment sheet here
      initializeAndPresentPaymentSheet();
    } catch (error) {
      console.error("Payment session update error:", error);
    }
  };

  const initializeAndPresentPaymentSheet = async () => {
    try {
      console.log("Initializing and Presenting Payment Sheet...");

      if (
        paymentData.paymentIntentClientSecret &&
        paymentData.ephemeralKeySecret &&
        paymentData.customer
      ) {
        // Initialize Payment Sheet
        await initPaymentSheet({
          merchantDisplayName: "Your Merchant Name",
          customerId: paymentData.customer,
          customerEphemeralKeySecret: paymentData.ephemeralKeySecret,
          paymentIntentClientSecret: paymentData.paymentIntentClientSecret,
        });

        // Present Payment Sheet
        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
          console.error("Payment sheet presentation error:", paymentError);

          // If there's an error, delete the previous session
          const checkoutSessionDocRef = doc(
            collection(
              FIRESTORE_DB,
              "users",
              user.user?.uid,
              "checkout_sessions"
            ),
            "SESSION_ID"
          );
          await deleteDoc(checkoutSessionDocRef);

          console.log("Previous session deleted due to payment sheet error.");
        } else {
          console.log("Payment Sheet presented successfully");
        }
      } else {
        console.log("Payment data is not yet available.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.numberTotal}>{totalAmount}</Text>
      <Pressable style={styles.button} onPress={onCheckout}>
        <Text style={styles.buttonText}>Checkout</Text>
      </Pressable>
    </View>
  );
}

import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { Button, ButtonText } from "@gluestack-ui/react";
import axios from "axios";
import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";

export default function Marketplace() {
  const userId = useAuth().user?.uid;
  console.log("userId", userId);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isLoading, setLoading] = useState(false);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "lightblue",
    },
    margins: { marginHorizontal: 12, paddingTop: 12 },
    personContainer: {
      paddingVertical: 12,
      backgroundColor: "white",
      borderRadius: 12,
      padding: 12,
    },
    person: {
      fontSize: 20,
    },
    details: {},
  });
  const createPaymentDocument = async (userId, paymentData) => {
    try {
      const paymentsCollectionRef = collection(
        FIRESTORE_DB,
        `stripe_customers/${userId}/payments`
      );
      await addDoc(paymentsCollectionRef, paymentData);
      console.log("Payment document created successfully");
    } catch (error) {
      console.error("Error creating payment document:", error);
    }
  };

  // Usage example
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const paymentData = {
        amount: 1000, // Example amount in cents
        currency: "usd", // Example currency
        // Add any other relevant payment data
      };
      await createPaymentDocument(userId, paymentData);
    } catch (error) {
      console.error("Error initiating payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.margins}>
        <Pressable style={styles.personContainer}>
          <Text style={styles.person}>Person</Text>
          <Text style={styles.details}>total: $45</Text>
        </Pressable>
      </View>
      <View style={styles.margins}>
        <Button onPress={handleCheckout}>
          <ButtonText>Checkout</ButtonText>
        </Button>
      </View>
    </View>
  );
}

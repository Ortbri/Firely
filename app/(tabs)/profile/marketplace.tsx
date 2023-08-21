import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
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
  getDocs,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";

export default function Marketplace() {
  const userId = useAuth().user?.uid;

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isLoading, setLoading] = useState(false);
  // const [paymentData, setPaymentData] = useState({
  //   paymentIntentClientSecret: null,
  //   ephemeralKeySecret: null,
  //   customer: null,
  // });

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

      // Optional: Update the Firestore document to trigger the Firestore function
      const paymentDocRef = doc(
        FIRESTORE_DB,
        `stripe_customers/${userId}/payments`
      );
      await setDoc(paymentDocRef, paymentData); // This triggers the Firestore function
      console.log("Firestore document updated to trigger function");
    } catch (error) {
      console.error("Error creating payment document:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      // Check if the payment document already exists
      // If it doesn't exist, create the payment document
      const paymentDocumentRef = doc(
        FIRESTORE_DB,
        `stripe_customers/${userId}/payments/payment`
      );
      const paymentDocumentSnapshot = await getDoc(paymentDocumentRef);

      if (!paymentDocumentSnapshot.exists()) {
        const paymentData = {
          amount: 12000, // Example amount in cents
          currency: "usd", // Example currency
          // ... any other relevant payment data
        };

        await createPaymentDocument(userId, paymentData);
      }

      // Continue with payment process

      // 2. Initialize the Payment Sheet
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret:
          "pi_3NhfibIM1aKfC7VY0TLwbZht_secret_pZjdiqGlO8K0TomUkNc2ijtNe", // Replace with actual client secret
      });

      if (error) {
        console.error("Error initializing payment sheet:", error);
        return;
      }

      // 3. Present the Payment Sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.error("Error presenting payment sheet:", paymentError);
        // Handle the payment error, show an alert, etc.
        return;
      }

      // 4. Payment succeeded
      console.log("Payment successful");
    } catch (error) {
      console.error("An error occurred:", error);
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

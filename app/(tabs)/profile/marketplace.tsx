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
  const userId = useAuth().user?.uid;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isLoading, setLoading] = useState(false);

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

  const handleCheckout = async () => {
    try {
      const paymentId = "66AQkeN8YQh5MeotYJLE"; // Replace with the actual payment ID

      const paymentDocumentRef = doc(
        FIRESTORE_DB,
        `stripe_customers/${userId}/payments/${paymentId}`
      );
      const paymentDocumentSnapshot = await getDoc(paymentDocumentRef);

      // Check if the payment document exists
      if (paymentDocumentSnapshot.exists()) {
        const paymentData = paymentDocumentSnapshot.data();
        const clientSecret = paymentData.client_secret;

        // Initialize the Payment Sheet
        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
        });

        if (error) {
          console.error("Error initializing payment sheet:", error);
          return;
        }

        // Present the Payment Sheet
        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
          console.error("Error presenting payment sheet:", paymentError);
          // Handle the payment error, show an alert, etc.
          return;
        }

        // Payment succeeded
        console.log("Payment successful");
      } else {
        console.error("Payment document does not exist");
      }
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

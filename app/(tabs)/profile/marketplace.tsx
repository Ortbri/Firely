import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
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
  const [paymentAmount, setPaymentAmount] = useState("");

  const createPaymentDocument = async (
    userId: string,
    paymentData: {
      amount: number; // Example amount in cents
      currency: string;
    }
  ) => {
    try {
      const paymentsCollectionRef = collection(
        FIRESTORE_DB,
        `stripe_customers/${userId}/payments`
      );
      const paymentDocRef = await addDoc(paymentsCollectionRef, paymentData);
      console.log(
        "Payment document created successfully with ID:",
        paymentDocRef.id
      );
      return paymentDocRef.id;
    } catch (error) {
      console.error("Error creating payment document:", error);
      return null;
    }
  };

  const amountInCents = parseFloat(paymentAmount) * 100;
  console.log(amountInCents);
  const handleCheckout = async () => {
    try {
      if (!userId) {
        console.error("User ID not available");
        return;
      }

      const paymentData = {
        amount: amountInCents, // Example amount in cents
        currency: "usd", // Example currency
        // ... any other relevant payment data
      };
      const paymentId = await createPaymentDocument(userId, paymentData);
      console.log(paymentId);
      if (!paymentId) {
        console.error("Failed to create payment document", paymentId);
        return;
      }

      // Initiate the payment flow once the client_secret is available
      const initiatePaymentFlow = async () => {
        const paymentDocumentRef = doc(
          FIRESTORE_DB,
          `stripe_customers/${userId}/payments/${paymentId}`
        );
        const paymentDocumentSnapshot = await getDoc(paymentDocumentRef);

        if (paymentDocumentSnapshot.exists()) {
          const paymentData = paymentDocumentSnapshot.data();
          const clientSecret = paymentData.client_secret;

          if (clientSecret) {
            // Initialize the Payment Sheet
            const { error } = await initPaymentSheet({
              paymentIntentClientSecret: clientSecret,
              merchantDisplayName: "Colonly",
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
            // Client secret not yet available, retry after a delay
            setTimeout(initiatePaymentFlow, 1000); // Adjust delay as needed
          }
        } else {
          console.error("Payment document does not exist");
        }
      };

      // Start the payment flow
      initiatePaymentFlow();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.margins}>
        <Pressable style={styles.personContainer}>
          <Text style={styles.person}>Person</Text>
          <Text style={styles.details}>
            Stripe total with cents: {amountInCents}
          </Text>
          <TextInput
            placeholder="Enter amount"
            keyboardType="number-pad"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
          />
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

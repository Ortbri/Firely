import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native"; // Added Alert
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";

export default function PaymentScreen() {
  const user = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [totalAmount, setTotalAmount] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [ephemeralKeySecret, setEphemeralKeySecret] = useState("");
  const [customer, setCustomer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkoutSessionDocRef = doc(
      collection(FIRESTORE_DB, "users", user.user?.uid, "checkout_sessions"),
      "SESSION_ID"
    );

    const unsubscribe = onSnapshot(checkoutSessionDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const sessionData = snapshot.data();
        setClientSecret(sessionData.paymentIntentClientSecret);
        setEphemeralKeySecret(sessionData.ephemeralKeySecret);
        setCustomer(sessionData.customer);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePayment = async () => {
    if (!totalAmount) {
      Alert.alert("Invalid Amount", "Please enter a valid total amount."); // Alert for invalid amount
      return;
    }

    const amountInCents = parseFloat(totalAmount) * 100;

    try {
      setLoading(true);

      // Check if the user has a Stripe customer ID
      const userDocRef = doc(collection(FIRESTORE_DB, "users"), user.user?.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const stripeCustomerId = userData.stripeId;

        await setDoc(
          doc(
            collection(
              FIRESTORE_DB,
              "users",
              user.user?.uid,
              "checkout_sessions"
            ),
            "SESSION_ID"
          ),
          {
            client: "mobile",
            mode: "payment",
            amount: amountInCents,
            currency: "usd",
            paymentIntentClientSecret: clientSecret,
            ephemeralKeySecret: ephemeralKeySecret,
            customer: stripeCustomerId,
          }
        );

        await initializePaymentSheet();
        await openPaymentSheet();
      } else {
        console.error("User data not found for the logged-in user");
      }
    } catch (error) {
      console.error("Payment sheet error:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializePaymentSheet = async () => {
    try {
      console.log("Initializing Payment Sheet...");

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Your Merchant Name",
        customerId: customer, // Use the Stripe customer ID
        customerEphemeralKeySecret: ephemeralKeySecret,
        paymentIntentClientSecret: clientSecret,
      });

      if (initError) {
        console.error("Payment sheet initialization error:", initError);
      }
    } catch (error) {
      console.error(
        "An error occurred during Payment Sheet initialization:",
        error
      );
    }
  };

  const openPaymentSheet = async () => {
    try {
      console.log("Opening Payment Sheet...");

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.error("Payment sheet presentation error:", paymentError);
      } else {
        console.log("Payment Sheet presented successfully");
      }
    } catch (error) {
      console.error("An error occurred while opening Payment Sheet:", error);
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 100, alignSelf: "center" }}>{totalAmount}</Text>
      <Text style={{ alignSelf: "center" }}>Enter Total Amount</Text>
      <TextInput
        placeholder="Enter total amount"
        value={totalAmount}
        onChangeText={(text) => setTotalAmount(text)}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          margin: 10,
          borderRadius: 12,
        }}
      />
      <Button title="Pay" onPress={handlePayment} disabled={loading} />
      {/* Disabled during loading */}
    </View>
  );
}

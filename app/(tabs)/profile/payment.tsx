import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput } from "react-native";
import {
  CardField,
  StripeProvider,
  useStripe,
} from "@stripe/stripe-react-native";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";

export default function PaymentScreen() {
  const user = useAuth();
  // console.log("profile", user, "uid HERE", user.user?.uid);
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
      console.log("Please enter a valid total amount.");
      return;
    }

    // Convert total amount to cents (Stripe requires amounts in cents)
    const amountInCents = parseFloat(totalAmount) * 100;

    try {
      setLoading(true);

      // Send the payment session data to Firebase to trigger the mobile payment sheet
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
          customer: user.user?.uid,
        }
      );

      console.log("Payment session created for amount:", amountInCents);

      await initializePaymentSheet();
      await openPaymentSheet();
    } catch (error) {
      console.error("Payment sheet error:", error);
    } finally {
      setLoading(false);

      // Reset the state for the next payment attempt
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Your Merchant Name",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKeySecret,
      paymentIntentClientSecret: clientSecret,
    });

    if (error) {
      throw error;
    }
  };

  const openPaymentSheet = async () => {
    const { error: paymentError } = await presentPaymentSheet();
    if (paymentError) {
      throw paymentError;
    }
  };

  return (
    <View>
      <Text>Enter Total Amount:</Text>
      <TextInput
        placeholder="Enter total amount"
        value={totalAmount}
        onChangeText={(text) => setTotalAmount(text)}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginVertical: 10,
        }}
      />
      <Text style={{ fontSize: 40 }}>{totalAmount}</Text>
      <Text>Enter Your Card Details:</Text>
      <CardField
        postalCodeEnabled={false}
        onCardChange={(cardDetails) => {
          // console.log("cardDetails", cardDetails);
        }}
        style={{
          width: "100%",
          height: 50,
          marginVertical: 10,
        }}
      />
      <Button title="Pay" onPress={handlePayment} />
    </View>
  );
}

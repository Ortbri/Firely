import React from "react";
import { View, Text, Button } from "react-native";
import { CardField } from "@stripe/stripe-react-native";

function PaymentScreen() {
  const handlePayment = async () => {
    // Handle the payment logic here
    console.log("handlePayment");
  };

  return (
    <View>
      <Text>Enter Your Card Details</Text>
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        onCardChange={(cardDetails) => {
          console.log("cardDetails", cardDetails);
        }}
        style={{
          width: "100%",
          height: 50,
          marginVertical: 30,
        }}
      />
      <Button title="Pay" onPress={handlePayment} />
    </View>
  );
}

export default PaymentScreen;

import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import {
  ArrowDownIcon,
  Button,
  ButtonText,
  CheckCircleIcon,
  ChevronLeftIcon,
} from "@gluestack-ui/react";
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
import * as Linking from "expo-linking";
import { WebView } from "react-native-webview";
import { ScrollView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

// test account ID: acct_1Ni1KDIAsq4TQBbB
// test onboarding link: https://connect.stripe.com/d/setup/e/_OV1Mm75SB35WXYEWq3sx2BT9FF/YWNjdF8xTmkxS0RJQXNxNFRRQmJC/7b5ad3d78d774128e

export default function StripeWeb() {
  const screenHeight = Dimensions.get("window").height;
  const styles = StyleSheet.create({
    container: {
      //   flex: 1,
      //   marginHorizontal: 12,
    },
    title: {
      fontSize: 40,
      fontWeight: "bold",
      //   marginBottom: 12,
    },
    titletwo: { flex: 1, fontSize: 22, fontWeight: "500", color: "#212427" },
    subtitle: {
      //   flex: 1,
      fontSize: 22,
      fontWeight: "500",
      marginBottom: 12,
      color: "#212427",
    },
    buttonContainer: {
      marginBottom: 30,
      padding: 4,
    },
    webview: {
      //   flex: 1,
      height: screenHeight,
    },
  });

  const testAccountId = "acct_1NiJ9XRAlknMlzHA";

  const testOnboardingLink =
    "https://connect.stripe.com/d/setup/e/_OVJndGpsuR1WseKPuo8R2MqJol/YWNjdF8xTmlKOVhSQWxrbk1sekhB/222aef10c10fefb6e";
  const userId = useAuth().user?.uid;
  console.log(userId);
  const router = useRouter();
  const createUser = async () => {
    try {
      // Create a document in Firestore to trigger the Cloud Function
      const workersCollection = collection(
        FIRESTORE_DB,
        `stripe/${userId}/workers`
      );
      await addDoc(workersCollection, {});
      console.log("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const testButton = async () => {
    // Test onboarding link
    const testOnboardingLink =
      "https://connect.stripe.com/d/setup/e/_OV1Mm75SB35WXYEWq3sx2BT9FF/YWNjdF8xTmkxS0RJQXNxNFRRQmJC/7b5ad3d78d774128e";

    // Check if the device can open the provided link
    const canOpenLink = await Linking.canOpenURL(testOnboardingLink);

    if (canOpenLink) {
      // Open the test onboarding link in the browser
      await Linking.openURL(testOnboardingLink);
      console.log("Opening test onboarding link...");
    } else {
      console.error("Cannot open test onboarding link.");
    }
  };

  return (
    <>
      <StatusBar style="light" animated />
      <WebView style={styles.webview} source={{ uri: testOnboardingLink }} />
    </>
  );
}

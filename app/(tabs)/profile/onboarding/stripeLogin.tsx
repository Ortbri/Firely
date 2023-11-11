import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  ArrowDownIcon,
  // Button,
  ButtonText,
  CheckCircleIcon,
  ChevronLeftIcon,
} from "@gluestack-ui/react";
import { Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function StripeLogin() {
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
      // flex: 1,
      height: screenHeight,
    },
  });

  const userId = useAuth().user?.uid;
  const [loading, setLoading] = useState(true);
  const [webViewUri, setWebViewUri] = useState(null);
  const [error, setError] = useState(null);

  const getAccountLinkAndOpenOnboarding = async () => {
    try {
      const userDocRef = doc(
        collection(FIRESTORE_DB, "stripe_supplier"),
        userId
      );
      let userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // changed to from account_link to login_linking from stripeWeb file
        let accountLink = userDocSnapshot.data().login_linking;
        console.log("Account link:", accountLink);

        // If account_link is empty, retry loading it a few times
        let maxRetries = 6;
        let retryCount = 0;
        while (!accountLink && retryCount < maxRetries) {
          console.log("Retrying loading account link...");
          wait(3000); // Wait for a certain amount of time before retrying
          userDocSnapshot = await getDoc(userDocRef);
          accountLink = userDocSnapshot.data().login_linking;
          retryCount++;
          console.log("Retry count:");
        }

        if (!accountLink) {
          console.error("Account link is empty after retries.");
          return;
        }

        // Check if the device can open the provided link
        const canOpenLink = await Linking.canOpenURL(accountLink);

        if (canOpenLink) {
          // Set the account link URI to open in WebView
          setWebViewUri(accountLink);
        } else {
          console.error("Cannot open account onboarding link.");
        }
      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error retrieving account link:", error);
    }
  };

  const wait = (milliseconds: number | undefined) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const retryLoading = async () => {
    setError(null);
    setLoading(true);
    await wait(3000); // Wait for a certain amount of time before retrying
    getAccountLinkAndOpenOnboarding();
  };

  useEffect(() => {
    getAccountLinkAndOpenOnboarding();
  }, []);

  const onLoadEnd = () => {
    setLoading(false);
  };
  return (
    <>
      <StatusBar style="light" animated />

      <View style={{ flex: 1 }}>
        {error ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Error loading content. Please try again.</Text>
            <Button title="Retry" onPress={retryLoading} />
          </View>
        ) : (
          webViewUri && (
            <WebView
              style={styles.webview}
              source={{ uri: webViewUri }}
              onError={(error) => console.error("WebView Error:", error)}
              onLoadEnd={onLoadEnd}
            />
          )
        )}
        {loading && !error && (
          <ActivityIndicator
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              right: "50%",
            }}
            size={22}
            color="#ffbb00"
          />
        )}
      </View>
    </>
  );
}

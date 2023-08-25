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
      // flex: 1,
      height: screenHeight,
    },
  });

  const userId = useAuth().user?.uid;
  console.log(userId);
  const router = useRouter();

  const [webViewUri, setWebViewUri] = useState(null);

  const getAccountLinkAndOpenOnboarding = async () => {
    try {
      const userDocRef = doc(
        collection(FIRESTORE_DB, "stripe_supplier"),
        userId
      );
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const accountLink = userDocSnapshot.data().account_link;

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

  useEffect(() => {
    if (webViewUri) {
      // WebView has a URI to load
      return () => {
        // Clean up
        setWebViewUri(null);
      };
    }
  }, [webViewUri]);

  return (
    <>
      <StatusBar style="light" animated />
      <View style={{ flex: 1 }}>
        <Button style={{}} onPress={getAccountLinkAndOpenOnboarding}>
          <ButtonText>helooooo</ButtonText>
        </Button>
        {webViewUri && (
          <WebView
            style={styles.webview}
            source={{ uri: webViewUri }}
            onError={(error) => console.error("WebView Error:", error)}
          />
        )}
      </View>
    </>
  );
}

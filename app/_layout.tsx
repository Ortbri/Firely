import { Slot, useRouter, useSegments } from "expo-router";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";

const RootLayout = () => {
  return (
    <StripeProvider
      publishableKey="pk_test_51LfqbDIM1aKfC7VYU3d6X8rnm6TkZoUEWaXMwB2kKUCubeDya7bdhr8Mf9bU89xEO8ZJYOt7zntkSbTw0zf40fY300mREFabrb"
      // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for apple
    >
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </StripeProvider>
  );
};

export default RootLayout;

// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { SplashScreen, Stack } from 'expo-router';
// import { useEffect } from 'react';
// import { useColorScheme } from 'react-native';

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from 'expo-router';

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: '(tabs)',
// };

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [loaded, error] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//     ...FontAwesome.font,
//   });

//   // Expo Router uses Error Boundaries to catch errors in the navigation tree.
//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return <RootLayoutNav />;
// }

// function RootLayoutNav() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
//       </Stack>
//     </ThemeProvider>
//   );
// }

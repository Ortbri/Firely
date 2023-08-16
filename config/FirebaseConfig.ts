// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage  from "@react-native-async-storage/async-storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRTv-MesCzjA3n3LeUnM_yxdom5gzWxuw",
  authDomain: "cloud-b5c63.firebaseapp.com",
  projectId: "cloud-b5c63",
  storageBucket: "cloud-b5c63.appspot.com",
  messagingSenderId: "784984681182",
  appId: "1:784984681182:web:10f1dbb5f48266b42d304f"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
export const FIREBASE_APP = initializeApp(firebaseConfig);
 export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
 export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
   persistence: getReactNativePersistence(AsyncStorage),
 });
// export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_DB = getFirestore(FIREBASE_APP);
// export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
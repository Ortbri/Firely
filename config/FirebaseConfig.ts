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
  apiKey: "AIzaSyAM-IhxKKYC4WCj-2zL0SASp3kdrRrvWlQ",
  authDomain: "firely-eceb1.firebaseapp.com",
  projectId: "firely-eceb1",
  storageBucket: "firely-eceb1.appspot.com",
  messagingSenderId: "517684313681",
  appId: "1:517684313681:web:8a89f991e338f0ef6b4270"
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
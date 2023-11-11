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
  apiKey: "AIzaSyBChBSf1wLzcHGgBSlBTl72fx0LMzaTsTA",
  authDomain: "functions-849f0.firebaseapp.com",
  projectId: "functions-849f0",
  storageBucket: "functions-849f0.appspot.com",
  messagingSenderId: "742397313746",
  appId: "1:742397313746:web:aa4a78ac29bd578acea30b"
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
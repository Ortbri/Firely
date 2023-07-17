// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// import { getFirestore} from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMoOGT2qDxDYUZQ8qeyx1Zz9gc6OSIYfE",
  authDomain: "firely-be8a2.firebaseapp.com",
  projectId: "firely-be8a2",
  storageBucket: "firely-be8a2.appspot.com",
  messagingSenderId: "1058637858926",
  appId: "1:1058637858926:web:318c6bd5903034f9393e7f"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// export const FIREBASE_DB = getFirestore(FIREBASE_APP);
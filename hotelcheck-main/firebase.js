import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import * as appconfig from "./config/secrets"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: appconfig.FIREBASE_API_KEY,
  authDomain: "hotelcheckmoco.firebaseapp.com",
  projectId: "hotelcheckmoco",
  storageBucket: "hotelcheckmoco.appspot.com",
  messagingSenderId: "452565010257",
  appId: "1:452565010257:web:9a845d8dc5b941c563f570",
  measurementId: "G-S0L9705V4P"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth();
const firestore = firebase.firestore();

export{auth, firestore, firebase};
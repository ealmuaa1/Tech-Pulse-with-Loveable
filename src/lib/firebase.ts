import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsKtFSPm9jpKSIi-IFBBBpxbyiehAxUls",
  authDomain: "tech-pulse-802c6.firebaseapp.com",
  projectId: "tech-pulse-802c6",
  storageBucket: "tech-pulse-802c6.firebasestorage.app",
  messagingSenderId: "557033711180",
  appId: "1:557033711180:web:884c6fab824716733036e9",
  measurementId: "G-VT8ELFSNVK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported (browser environment)
let analytics = null;
isSupported().then((yes) => yes && (analytics = getAnalytics(app)));

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, auth, db };

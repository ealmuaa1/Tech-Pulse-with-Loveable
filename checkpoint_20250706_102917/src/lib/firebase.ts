// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsKtFSPm9jpKSIi-IFBBBpxbyiehAxUls",
  authDomain: "tech-pulse-802c6.firebaseapp.com",
  projectId: "tech-pulse-802c6",
  storageBucket: "tech-pulse-802c6.appspot.com", // FIXED typo: should be appspot.com
  messagingSenderId: "557033711180",
  appId: "1:557033711180:web:884c6fab824716733036e9",
  measurementId: "G-VT8ELFSNVK",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

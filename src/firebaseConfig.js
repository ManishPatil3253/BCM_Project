// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. Import Storage

// TODO: Replace this with your own Firebase project configuration!
const firebaseConfig = {
  apiKey: "AIzaSyBYpF2qOTObvrGpVBOXZ7-JN_ysffHMOw8",
  authDomain: "projectbcm-d8b38.firebaseapp.com",
  projectId: "projectbcm-d8b38",
  storageBucket: "projectbcm-d8b38.firebasestorage.app",
  messagingSenderId: "668971971323",
  appId: "1:668971971323:web:47dae524b6f8fffd30765e",
  measurementId: "G-SLYQSHGKKV"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 2. Initialize and export Storage
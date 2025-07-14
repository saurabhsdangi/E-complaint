// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoUwfEe0_nVq6vfOc8LVuYOPUA7FWcTLA",
  authDomain: "mern-357c2.firebaseapp.com",
  projectId: "mern-357c2",
  storageBucket: "mern-357c2.firebasestorage.app",
  messagingSenderId: "737521592587",
  appId: "1:737521592587:web:9a489dcaa0459ec8da9a0e"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase Auth
export const auth = getAuth(app);

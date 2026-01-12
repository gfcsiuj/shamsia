import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrGIE8vh1xjoeH0kZ1Dv7NJhFPIBLRLZ4",
  authDomain: "shamsia-52f90.firebaseapp.com",
  projectId: "shamsia-52f90",
  storageBucket: "shamsia-52f90.firebasestorage.app",
  messagingSenderId: "340388368868",
  appId: "1:340388368868:web:77d978f88d2869a425b7f1",
  measurementId: "G-83CZP0KL20"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics conditionally to handle environments where it's not supported
isSupported().then((yes) => {
  if (yes) {
    getAnalytics(app);
  }
}).catch(() => {});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
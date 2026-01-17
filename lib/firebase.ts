import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/analytics";

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
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
// const analytics = firebase.analytics(); // Analytics often fails in some dev environments if not configured, optional
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export default app;
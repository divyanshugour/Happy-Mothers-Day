import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmHX6irvXOs6GBbDqT706kvOO087MoIlA",
  authDomain: "happy-mothers-day-924a1.firebaseapp.com",
  projectId: "happy-mothers-day-924a1",
  storageBucket: "happy-mothers-day-924a1.firebasestorage.app",
  messagingSenderId: "296323748842",
  appId: "1:296323748842:web:78c8b8fbe6627d348f9893",
  measurementId: "G-5DDLRBB60R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

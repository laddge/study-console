// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8iHzBtTOZBKvDNVJfu_bAVQRhf69Em-0",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "study.laddge.net",
  projectId: "study-console",
  storageBucket: "study-console.appspot.com",
  messagingSenderId: "1174056240",
  appId: "1:1174056240:web:ee5b427c2a08676acdecf5",
  measurementId: "G-THSSYFQ22R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app);

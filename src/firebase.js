// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8iHzBtTOZBKvDNVJfu_bAVQRhf69Em-0",
  authDomain: "study.laddge.net",
  projectId: "study-console",
  storageBucket: "study-console.appspot.com",
  messagingSenderId: "1174056240",
  appId: "1:1174056240:web:ee5b427c2a08676acdecf5",
  measurementId: "G-THSSYFQ22R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

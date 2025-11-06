// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7n3-j3ansXVWyYdHXfum9-W-o5c55EzU",
  authDomain: "ss99-35d8f.firebaseapp.com",
  projectId: "ss99-35d8f",
  storageBucket: "ss99-35d8f.appspot.com",
  messagingSenderId: "538495467374",
  appId: "1:538495467374:web:91dd8b5d03b989dafc4b7f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

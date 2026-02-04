import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4gKv_5Bbj5jkYCJRi9-Jhzc6U8Nv4T5U",
  authDomain: "smartseed-fdb58.firebaseapp.com",
  projectId: "smartseed-fdb58",
  storageBucket: "smartseed-fdb58.firebasestorage.app",
  messagingSenderId: "247349924293",
  appId: "1:247349924293:web:22a7972e3ce2390a4b7bac",
};

const app = initializeApp(firebaseConfig);

// THIS is what we'll use everywhere
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
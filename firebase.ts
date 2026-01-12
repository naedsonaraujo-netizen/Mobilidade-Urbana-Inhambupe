
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configurações extraídas do seu google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyAj-6R3UNx_OKr6RTcY0xd5y8icTlU3EEE",
  authDomain: "akiten.firebaseapp.com",
  projectId: "akiten",
  storageBucket: "akiten.firebasestorage.app",
  messagingSenderId: "1012765701462",
  appId: "1:1012765701462:android:347881c4fb3f876a6a12f7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

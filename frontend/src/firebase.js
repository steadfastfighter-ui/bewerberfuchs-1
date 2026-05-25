import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD55s4moqt-NqKPmXXVmRJUx7H8NIgVRHE",
  authDomain: "bewerberfuchs-5a996.firebaseapp.com",
  projectId: "bewerberfuchs-5a996",
  storageBucket: "bewerberfuchs-5a996.firebasestorage.app",
  messagingSenderId: "137927252744",
  appId: "1:137927252744:web:e1f6f87cce615cf23aaabd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
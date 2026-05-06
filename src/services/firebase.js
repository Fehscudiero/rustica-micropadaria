// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDK0rcHnXyVOC84T5bIxwPp5Cr-_b0E248",
  authDomain: "rustica-d131a.firebaseapp.com",
  projectId: "rustica-d131a",
  storageBucket: "rustica-d131a.firebasestorage.app",
  messagingSenderId: "383211307867",
  appId: "1:383211307867:web:33b869510c535b0cb9907e"
};

// Inicializa o app e exporta a instância do banco de dados (Firestore)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
 apiKey: "AIzaSyD0sN_fQnP0E7IA87eZ96Gjq-U5Tyrk52Q",
  authDomain: "microloan-app.firebaseapp.com",
  databaseURL: "https://microloan-app-default-rtdb.firebaseio.com",
  projectId: "microloan-app",
  storageBucket: "microloan-app.firebasestorage.app",
  messagingSenderId: "344959827055",
  appId: "1:344959827055:web:68efcbf849a3ae2991219a",
  measurementId: "G-X5X1Q3FKDK"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Configuration Firebase pour NE Battle Royale
// IMPORTANT: Remplacez ces valeurs par votre propre configuration Firebase
// Pour obtenir votre config:
// 1. Allez sur https://console.firebase.google.com/
// 2. Créez un nouveau projet ou utilisez un existant
// 3. Ajoutez une application Web
// 4. Copiez la configuration fournie ici
// 5. Activez "Realtime Database" dans la console Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2Ox6EjEnq3jkpepBR1SBNqiY6m2Wh3LM",
  authDomain: "ne-battle-royale.firebaseapp.com",
  projectId: "ne-battle-royale",
  storageBucket: "ne-battle-royale.firebasestorage.app",
  messagingSenderId: "612745279766",
  appId: "1:612745279766:web:5a086ae06f40c16994f837",
  measurementId: "G-H0BRJYYFQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);

// Exporter la database
window.database = firebase.database();

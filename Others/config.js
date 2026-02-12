// Configuration Firebase pour NE Battle Royale
// IMPORTANT: Remplacez ces valeurs par votre propre configuration Firebase
// Pour obtenir votre config:
// 1. Allez sur https://console.firebase.google.com/
// 2. Créez un nouveau projet ou utilisez un existant
// 3. Ajoutez une application Web
// 4. Copiez la configuration fournie ici
// 5. Activez "Realtime Database" dans la console Firebase

const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://VOTRE_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "VOTRE_PROJECT_ID",
    storageBucket: "VOTRE_PROJECT_ID.appspot.com",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);

// Exporter la database
window.database = firebase.database();

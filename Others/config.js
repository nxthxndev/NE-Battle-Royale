// Configuration Firebase - CDN Compat (GitHub Pages)
const firebaseConfig = {
    apiKey: "AIzaSyB2Ox6EjEnq3jkpepBR1SBNqiY6m2Wh3LM",
    authDomain: "ne-battle-royale.firebaseapp.com",
    databaseURL: "https://ne-battle-royale-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "ne-battle-royale",
    storageBucket: "ne-battle-royale.firebasestorage.app",
    messagingSenderId: "612745279766",
    appId: "1:612745279766:web:5a086ae06f40c16994f837"
};

firebase.initializeApp(firebaseConfig);
window.database = firebase.database();

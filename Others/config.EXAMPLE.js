// ====================================================================
// EXEMPLE DE CONFIGURATION FIREBASE
// ====================================================================
// Suivez ces étapes pour obtenir votre propre configuration :
//
// 1. Allez sur https://console.firebase.google.com/
// 2. Cliquez sur "Ajouter un projet" ou sélectionnez un projet existant
// 3. Donnez un nom à votre projet : "NE-Battle-Royale"
// 4. Activez Google Analytics si vous voulez (optionnel)
// 5. Une fois le projet créé, cliquez sur l'icône Web (</>)
// 6. Donnez un surnom à votre app : "NE-BR-Web"
// 7. NE cochez PAS "Configurer Firebase Hosting" pour l'instant
// 8. Firebase va générer votre configuration - COPIEZ-LA
// 9. Remplacez la configuration ci-dessous avec la vôtre
//
// EXEMPLE de ce que Firebase vous donnera :
// ====================================================================

const firebaseConfig = {
    apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "ne-battle-royale-12345.firebaseapp.com",
    databaseURL: "https://ne-battle-royale-12345-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ne-battle-royale-12345",
    storageBucket: "ne-battle-royale-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// ====================================================================
// APRÈS AVOIR CONFIGURÉ :
// ====================================================================
// 1. Activez "Realtime Database" dans Firebase Console
//    - Dans le menu de gauche : Build → Realtime Database
//    - Cliquez sur "Créer une base de données"
//    - Sélectionnez un emplacement (ex: europe-west1)
//    - Commencez en "mode test" (règles publiques)
//
// 2. (Optionnel) Configurez les règles de sécurité :
//    - Allez dans l'onglet "Règles"
//    - Remplacez par :
//    {
//      "rules": {
//        "players": {
//          ".read": true,
//          ".write": true,
//          "$playerId": {
//            ".validate": "newData.hasChildren(['username', 'skin', 'joinedAt', 'lastActive'])"
//          }
//        }
//      }
//    }
//
// 3. Testez votre application !
// ====================================================================

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);

// Exporter la database pour l'utiliser dans l'app
window.database = firebase.database();

// ====================================================================
// SÉCURITÉ - NOTES IMPORTANTES :
// ====================================================================
// - En mode "test", n'importe qui peut lire/écrire vos données
// - C'est OK pour le développement mais PAS pour la production
// - Configurez des règles de sécurité appropriées avant le déploiement
// - Ne commitez PAS ce fichier sur GitHub avec vos vraies clés
//   (ou assurez-vous de restreindre l'accès via Firebase)
// ====================================================================

// Gestionnaire de joueurs pour NE Battle Royale
// Gère la connexion, déconnexion, validation des pseudos et synchronisation temps réel

class PlayerManager {
    constructor() {
        this.currentPlayer = null;
        this.players = {};
        this.database = window.database;
        this.playersRef = this.database.ref('players');
        this.usernameTaken = false;
    }

    // Validation du pseudo
    validateUsername(username) {
        const errors = [];
        
        if (username.length < 5) {
            errors.push("Le pseudo doit contenir au moins 5 caractères");
        }
        if (username.length > 20) {
            errors.push("Le pseudo ne peut pas dépasser 20 caractères");
        }
        
        const validPattern = /^[a-zA-Z0-9]+$/;
        if (!validPattern.test(username)) {
            errors.push("Le pseudo ne peut contenir que des lettres et des chiffres");
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // Vérifier si le pseudo est déjà pris
    async isUsernameTaken(username) {
        const snapshot = await this.playersRef.once('value');
        const players = snapshot.val() || {};
        
        return Object.values(players).some(
            player => player.username.toLowerCase() === username.toLowerCase()
        );
    }

    // Connexion d'un joueur
    async joinLobby(username, skin = 'default') {
        const validation = this.validateUsername(username);
        
        if (!validation.valid) {
            throw new Error(validation.errors[0]);
        }

        const taken = await this.isUsernameTaken(username);
        if (taken) {
            throw new Error("Ce pseudo est déjà utilisé");
        }

        const playerRef = this.playersRef.push();
        const playerId = playerRef.key;
        
        this.currentPlayer = {
            id: playerId,
            username: username,
            skin: skin,
            joinedAt: Date.now(),
            lastActive: Date.now()
        };

        await playerRef.set(this.currentPlayer);
        playerRef.onDisconnect().remove();
        this.startHeartbeat(playerRef);

        localStorage.setItem('nebr_username', username);
        localStorage.setItem('nebr_playerId', playerId);
        localStorage.setItem('nebr_skin', skin);

        return this.currentPlayer;
    }

    // Heartbeat pour maintenir la connexion active
    startHeartbeat(playerRef) {
        this.heartbeatInterval = setInterval(() => {
            if (this.currentPlayer) {
                playerRef.update({
                    lastActive: Date.now()
                });
            }
        }, 30000);
    }

    // Changer le skin
    async changeSkin(newSkin) {
        if (!this.currentPlayer) return;
        
        this.currentPlayer.skin = newSkin;
        await this.playersRef.child(this.currentPlayer.id).update({
            skin: newSkin
        });
        
        localStorage.setItem('nebr_skin', newSkin);
    }

    // Déconnexion propre
    async leaveLobby() {
        if (this.currentPlayer) {
            await this.playersRef.child(this.currentPlayer.id).remove();
            clearInterval(this.heartbeatInterval);
            this.currentPlayer = null;
        }
    }

    // Écouter les changements de la liste des joueurs
    onPlayersChange(callback) {
        this.playersRef.on('value', (snapshot) => {
            const players = snapshot.val() || {};
            this.players = players;
            
            const playersList = Object.entries(players).map(([id, data]) => ({
                id,
                ...data
            })).sort((a, b) => a.joinedAt - b.joinedAt);
            
            callback(playersList);
        });
    }

    // Arrêter d'écouter les changements
    stopListening() {
        this.playersRef.off();
    }

    // Récupérer la session sauvegardée
    getSavedSession() {
        const username = localStorage.getItem('nebr_username');
        const playerId = localStorage.getItem('nebr_playerId');
        const skin = localStorage.getItem('nebr_skin') || 'default';
        
        return { username, playerId, skin };
    }

    // Nettoyer la session sauvegardée
    clearSavedSession() {
        localStorage.removeItem('nebr_username');
        localStorage.removeItem('nebr_playerId');
        localStorage.removeItem('nebr_skin');
    }

    // Changer de pseudo
    async changeUsername(newUsername) {
        if (!this.currentPlayer) return;

        const validation = this.validateUsername(newUsername);
        if (!validation.valid) {
            throw new Error(validation.errors[0]);
        }

        const taken = await this.isUsernameTaken(newUsername);
        if (taken) {
            throw new Error("Ce pseudo est déjà utilisé");
        }

        this.currentPlayer.username = newUsername;
        await this.playersRef.child(this.currentPlayer.id).update({
            username: newUsername
        });

        localStorage.setItem('nebr_username', newUsername);
    }
}

// Exporter
window.PlayerManager = PlayerManager;

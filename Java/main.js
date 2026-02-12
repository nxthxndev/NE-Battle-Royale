// Fichier principal de NE Battle Royale
// Orchestre l'interface, la connexion et la scène 3D

class NEBattleRoyale {
    constructor() {
        this.playerManager = new PlayerManager();
        this.lobby3D = null;
        this.currentSkin = 'default';
        
        this.init();
    }

    async init() {
        // Éléments DOM
        this.usernameModal = document.getElementById('usernameModal');
        this.lobbyInterface = document.getElementById('lobbyInterface');
        this.usernameInput = document.getElementById('usernameInput');
        this.confirmUsernameBtn = document.getElementById('confirmUsername');
        this.usernameError = document.getElementById('usernameError');
        this.currentUsernameDisplay = document.getElementById('currentUsername');
        this.playersList = document.getElementById('playersList');
        this.playerCount = document.getElementById('playerCount');
        this.changeUsernameBtn = document.getElementById('changeUsername');
        this.connectionStatus = document.getElementById('connectionStatus');

        // Event listeners
        this.setupEventListeners();

        // Vérifier si une session existe
        await this.checkExistingSession();
    }

    setupEventListeners() {
        // Confirmation du pseudo
        this.confirmUsernameBtn.addEventListener('click', () => this.handleUsernameConfirm());
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUsernameConfirm();
            }
        });

        // Input en temps réel - nettoyage des caractères invalides
        this.usernameInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
            this.usernameError.textContent = '';
        });

        // Changement de pseudo
        this.changeUsernameBtn.addEventListener('click', () => this.handleChangeUsername());

        // Sélection de skin
        document.querySelectorAll('.skin-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const skinType = e.currentTarget.dataset.skin;
                this.handleSkinChange(skinType);
            });
        });

        // Bouton Play (placeholder pour le futur)
        document.querySelector('.btn-play').addEventListener('click', () => {
            alert('Le matchmaking sera disponible bientôt ! 🎮');
        });

        // Bouton Stats (placeholder)
        document.querySelector('.btn-stats').addEventListener('click', () => {
            alert('Les statistiques seront disponibles bientôt ! 📊');
        });

        // Déconnexion propre à la fermeture
        window.addEventListener('beforeunload', () => {
            this.playerManager.leaveLobby();
        });
    }

    async checkExistingSession() {
        const { username, skin } = this.playerManager.getSavedSession();
        
        if (username) {
            // Tenter de rejoindre avec le pseudo sauvegardé
            try {
                await this.joinLobby(username, skin);
            } catch (error) {
                // Si le pseudo est pris, forcer une nouvelle connexion
                this.playerManager.clearSavedSession();
                this.showUsernameModal();
            }
        } else {
            this.showUsernameModal();
        }
    }

    showUsernameModal() {
        this.usernameModal.classList.remove('hidden');
        this.lobbyInterface.classList.add('hidden');
        this.usernameInput.focus();
    }

    async handleUsernameConfirm() {
        const username = this.usernameInput.value.trim();
        
        if (!username) {
            this.showError('Veuillez entrer un pseudo');
            return;
        }

        try {
            // Désactiver le bouton pendant la vérification
            this.confirmUsernameBtn.disabled = true;
            this.confirmUsernameBtn.textContent = 'Vérification...';
            
            await this.joinLobby(username, this.currentSkin);
            
        } catch (error) {
            this.showError(error.message);
            this.confirmUsernameBtn.disabled = false;
            this.confirmUsernameBtn.textContent = 'Rejoindre le lobby';
        }
    }

    async joinLobby(username, skin = 'default') {
        // Rejoindre avec le PlayerManager
        const player = await this.playerManager.joinLobby(username, skin);
        
        // Masquer le modal et afficher le lobby
        this.usernameModal.classList.add('hidden');
        this.lobbyInterface.classList.remove('hidden');
        
        // Afficher le pseudo
        this.currentUsernameDisplay.textContent = player.username;
        
        // Initialiser la scène 3D
        this.initLobby3D(skin);
        
        // Commencer à écouter les changements de joueurs
        this.playerManager.onPlayersChange((players) => {
            this.updatePlayersList(players);
        });
        
        // Réinitialiser le formulaire
        this.usernameInput.value = '';
        this.confirmUsernameBtn.disabled = false;
        this.confirmUsernameBtn.textContent = 'Rejoindre le lobby';
        
        this.updateConnectionStatus('Connecté', true);
    }

    initLobby3D(skin) {
        if (!this.lobby3D) {
            this.lobby3D = new Lobby3D('lobby3d');
        }
        this.lobby3D.changeSkin(skin);
        this.currentSkin = skin;
        
        // Activer le bon bouton de skin
        document.querySelectorAll('.skin-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.skin === skin) {
                btn.classList.add('active');
            }
        });
    }

    updatePlayersList(players) {
        this.playersList.innerHTML = '';
        this.playerCount.textContent = players.length;

        players.forEach(player => {
            const playerItem = document.createElement('div');
            playerItem.className = 'player-item';
            
            const isCurrentUser = player.id === this.playerManager.currentPlayer?.id;
            
            playerItem.innerHTML = `
                <div class="player-avatar-small">
                    <div class="player-avatar-inner"></div>
                </div>
                <span class="player-name">${player.username}${isCurrentUser ? ' (Vous)' : ''}</span>
                <div class="player-status"></div>
            `;
            
            this.playersList.appendChild(playerItem);
        });
    }

    async handleSkinChange(skinType) {
        if (skinType === this.currentSkin) return;
        
        this.currentSkin = skinType;
        
        // Mettre à jour visuellement
        document.querySelectorAll('.skin-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.skin === skinType) {
                btn.classList.add('active');
            }
        });
        
        // Mettre à jour la scène 3D
        if (this.lobby3D) {
            this.lobby3D.changeSkin(skinType);
        }
        
        // Sauvegarder dans Firebase
        await this.playerManager.changeSkin(skinType);
    }

    async handleChangeUsername() {
        const newUsername = prompt('Entrez votre nouveau pseudo (5-20 caractères, lettres et chiffres uniquement):');
        
        if (!newUsername) return;
        
        try {
            await this.playerManager.changeUsername(newUsername);
            this.currentUsernameDisplay.textContent = newUsername;
            alert('Pseudo changé avec succès !');
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }

    showError(message) {
        this.usernameError.textContent = message;
        this.usernameError.style.animation = 'none';
        setTimeout(() => {
            this.usernameError.style.animation = 'slideUp 0.3s ease';
        }, 10);
    }

    updateConnectionStatus(status, connected) {
        this.connectionStatus.textContent = status;
        const dot = document.querySelector('.status-dot');
        if (connected) {
            dot.style.background = 'var(--success)';
            dot.style.boxShadow = '0 0 10px var(--success)';
        } else {
            dot.style.background = 'var(--error)';
            dot.style.boxShadow = '0 0 10px var(--error)';
        }
    }
}

// Initialiser l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NEBattleRoyale();
});

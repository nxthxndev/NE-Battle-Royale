// Gestionnaire de la scène 3D du lobby
// Utilise Three.js pour créer un environnement 3D immersif

class Lobby3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.character = null;
        this.platform = null;
        this.lights = [];
        this.animationId = null;
        this.currentSkin = 'default';
        
        this.init();
    }

    init() {
        // Créer la scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.Fog(0x0a0e27, 10, 50);

        // Créer la caméra
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.parentElement.clientWidth / this.canvas.parentElement.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 1, 0);

        // Créer le renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(
            this.canvas.parentElement.clientWidth,
            this.canvas.parentElement.clientHeight
        );
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Ajouter les lumières
        this.setupLights();

        // Créer la plateforme
        this.createPlatform();

        // Créer le personnage
        this.createCharacter();

        // Ajouter des éléments décoratifs
        this.createEnvironment();

        // Gérer le redimensionnement
        window.addEventListener('resize', () => this.onResize());

        // Démarrer l'animation
        this.animate();
    }

    setupLights() {
        // Lumière ambiante
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        this.scene.add(ambientLight);

        // Lumière directionnelle principale (cyan)
        const mainLight = new THREE.DirectionalLight(0x00d9ff, 2);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        this.scene.add(mainLight);

        // Lumière d'accentuation (magenta)
        const accentLight = new THREE.DirectionalLight(0xff006e, 1.5);
        accentLight.position.set(-5, 5, -5);
        this.scene.add(accentLight);

        // Point lights pour l'ambiance
        const pointLight1 = new THREE.PointLight(0x00d9ff, 2, 15);
        pointLight1.position.set(3, 1, 3);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff006e, 2, 15);
        pointLight2.position.set(-3, 1, -3);
        this.scene.add(pointLight2);

        this.lights.push(pointLight1, pointLight2);
    }

    createPlatform() {
        // Plateforme hexagonale futuriste
        const hexShape = new THREE.Shape();
        const radius = 4;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
                hexShape.moveTo(x, y);
            } else {
                hexShape.lineTo(x, y);
            }
        }
        hexShape.lineTo(Math.cos(0) * radius, Math.sin(0) * radius);

        const extrudeSettings = {
            depth: 0.3,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 3
        };

        const geometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({
            color: 0x14193c,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0x00d9ff,
            emissiveIntensity: 0.1
        });

        this.platform = new THREE.Mesh(geometry, material);
        this.platform.rotation.x = -Math.PI / 2;
        this.platform.position.y = -0.15;
        this.platform.receiveShadow = true;
        this.scene.add(this.platform);

        // Ajouter un contour lumineux
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00d9ff,
            linewidth: 2
        });
        const outline = new THREE.LineSegments(edges, lineMaterial);
        this.platform.add(outline);
    }

    createCharacter() {
        this.character = new THREE.Group();

        // Corps principal (capsule approximée)
        const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x8e44ad,
            metalness: 0.3,
            roughness: 0.7
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.2;
        body.castShadow = true;
        this.character.add(body);

        // Tête
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdbac,
            metalness: 0.1,
            roughness: 0.8
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2;
        head.castShadow = true;
        this.character.add(head);

        // Visière/Casque futuriste
        const visorGeometry = new THREE.SphereGeometry(0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const visorMaterial = new THREE.MeshStandardMaterial({
            color: 0x00d9ff,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x00d9ff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.7
        });
        const visor = new THREE.Mesh(visorGeometry, visorMaterial);
        visor.position.y = 2;
        visor.rotation.x = -0.2;
        this.character.add(visor);

        // Bras gauche
        const armGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.8, 8);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0x8e44ad,
            metalness: 0.3,
            roughness: 0.7
        });
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.5, 1.4, 0);
        leftArm.rotation.z = 0.3;
        leftArm.castShadow = true;
        this.character.add(leftArm);

        // Bras droit
        const rightArm = leftArm.clone();
        rightArm.position.set(0.5, 1.4, 0);
        rightArm.rotation.z = -0.3;
        this.character.add(rightArm);

        // Jambe gauche
        const legGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.9, 8);
        const legMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            metalness: 0.4,
            roughness: 0.6
        });
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, 0.5, 0);
        leftLeg.castShadow = true;
        this.character.add(leftLeg);

        // Jambe droite
        const rightLeg = leftLeg.clone();
        rightLeg.position.set(0.2, 0.5, 0);
        this.character.add(rightLeg);

        // Accessoires lumineux
        const glowGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.8
        });
        
        const chestGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        chestGlow.position.set(0, 1.2, 0.36);
        this.character.add(chestGlow);

        // Sauvegarder les parties pour le changement de skin
        this.character.userData = {
            body: body,
            leftArm: leftArm,
            rightArm: rightArm,
            visor: visor
        };

        this.scene.add(this.character);
    }

    createEnvironment() {
        // Particules flottantes
        const particleCount = 100;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x00d9ff,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particles);
        this.particles = particles;

        // Grille au sol
        const gridHelper = new THREE.GridHelper(20, 20, 0x00d9ff, 0x14193c);
        gridHelper.position.y = -0.3;
        gridHelper.material.opacity = 0.3;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    changeSkin(skinType) {
        this.currentSkin = skinType;
        const { body, leftArm, rightArm, visor } = this.character.userData;

        const skinColors = {
            default: { body: 0x8e44ad, visor: 0x00d9ff },
            blue: { body: 0x0088ff, visor: 0x00d9ff },
            red: { body: 0xff006e, visor: 0xff4757 },
            green: { body: 0x00b894, visor: 0x00ff88 }
        };

        const colors = skinColors[skinType] || skinColors.default;

        body.material.color.setHex(colors.body);
        leftArm.material.color.setHex(colors.body);
        rightArm.material.color.setHex(colors.body);
        visor.material.color.setHex(colors.visor);
        visor.material.emissive.setHex(colors.visor);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Rotation du personnage
        if (this.character) {
            this.character.rotation.y = Math.sin(time * 0.5) * 0.3;
            this.character.position.y = Math.sin(time * 2) * 0.05;
        }

        // Rotation de la plateforme
        if (this.platform) {
            this.platform.rotation.z += 0.001;
        }

        // Animation des lumières
        this.lights.forEach((light, index) => {
            light.intensity = 2 + Math.sin(time * 2 + index * Math.PI) * 0.5;
        });

        // Animation des particules
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        const width = this.canvas.parentElement.clientWidth;
        const height = this.canvas.parentElement.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer.dispose();
    }
}

// Exporter
window.Lobby3D = Lobby3D;

// Esoteric Animation System for Berhu Login

class EsotericAnimation {
    constructor() {
        this.container = document.getElementById('esotericIcons');
        this.icons = this.getEsotericIcons();
        this.maxIcons = window.innerWidth <= 480 ? 5 : window.innerWidth <= 768 ? 8 : 15;
        this.spawnInterval = window.innerWidth <= 480 ? 5000 : window.innerWidth <= 768 ? 4000 : 3000;
        this.activeIcons = new Set();
        
        this.init();
    }

    // Get Esoteric Icons Collection
    getEsotericIcons() {
        return {
            // Mystical Symbols
            mystical: [
                { icon: 'ॐ', class: 'mystical', size: '1.5rem' },
                { icon: '☯', class: 'mystical', size: '1.2rem' },
                { icon: '∞', class: 'mystical', size: '1.3rem' },
                { icon: '⚡', class: 'mystical', size: '1.4rem' },
                { icon: '✨', class: 'mystical', size: '1.1rem' },
                { icon: '🔮', class: 'mystical', size: '1.6rem' },
                { icon: '⭐', class: 'mystical', size: '1.2rem' },
                { icon: '💫', class: 'mystical', size: '1.3rem' },
                { icon: '🌟', class: 'mystical', size: '1.1rem' },
                { icon: '✦', class: 'mystical', size: '1.2rem' }
            ],
            
            // Nature Elements
            nature: [
                { icon: '🌿', class: 'nature', size: '1.4rem' },
                { icon: '🍃', class: 'nature', size: '1.2rem' },
                { icon: '🌸', class: 'nature', size: '1.3rem' },
                { icon: '🌺', class: 'nature', size: '1.4rem' },
                { icon: '🌻', class: 'nature', size: '1.5rem' },
                { icon: '🌷', class: 'nature', size: '1.2rem' },
                { icon: '🌹', class: 'nature', size: '1.3rem' },
                { icon: '🌾', class: 'nature', size: '1.1rem' },
                { icon: '🌱', class: 'nature', size: '1.0rem' },
                { icon: '🍀', class: 'nature', size: '1.2rem' }
            ],
            
            // Celestial Bodies
            celestial: [
                { icon: '☀️', class: 'celestial', size: '1.6rem' },
                { icon: '🌙', class: 'celestial', size: '1.4rem' },
                { icon: '⭐', class: 'celestial', size: '1.1rem' },
                { icon: '🌟', class: 'celestial', size: '1.2rem' },
                { icon: '💫', class: 'celestial', size: '1.3rem' },
                { icon: '☄️', class: 'celestial', size: '1.5rem' },
                { icon: '🌠', class: 'celestial', size: '1.4rem' },
                { icon: '🌌', class: 'celestial', size: '1.8rem' },
                { icon: '🌃', class: 'celestial', size: '1.6rem' },
                { icon: '🌄', class: 'celestial', size: '1.7rem' }
            ],
            
            // Spiritual Symbols
            spiritual: [
                { icon: '❤️', class: 'spiritual', size: '1.3rem' },
                { icon: '🕊️', class: 'spiritual', size: '1.4rem' },
                { icon: '🧘‍♀️', class: 'spiritual', size: '1.6rem' },
                { icon: '🙏', class: 'spiritual', size: '1.4rem' },
                { icon: '🤲', class: 'spiritual', size: '1.3rem' },
                { icon: '💖', class: 'spiritual', size: '1.2rem' },
                { icon: '💗', class: 'spiritual', size: '1.1rem' },
                { icon: '💝', class: 'spiritual', size: '1.3rem' },
                { icon: '🕯️', class: 'spiritual', size: '1.2rem' },
                { icon: '🔥', class: 'spiritual', size: '1.4rem' }
            ],
            
            // Energy Symbols
            energy: [
                { icon: '⚡', class: 'energy', size: '1.4rem' },
                { icon: '💎', class: 'energy', size: '1.3rem' },
                { icon: '🔮', class: 'energy', size: '1.5rem' },
                { icon: '✨', class: 'energy', size: '1.1rem' },
                { icon: '🌈', class: 'energy', size: '1.8rem' },
                { icon: '💫', class: 'energy', size: '1.2rem' },
                { icon: '⭐', class: 'energy', size: '1.0rem' },
                { icon: '🔆', class: 'energy', size: '1.3rem' },
                { icon: '🔅', class: 'energy', size: '1.2rem' },
                { icon: '✦', class: 'energy', size: '1.1rem' }
            ]
        };
    }

    // Initialize Animation
    init() {
        if (!this.container) return;
        
        // Add CSS styles
        this.addStyles();
        
        // Start spawning icons
        this.startSpawning();
        
        // Handle visibility changes
        this.handleVisibility();
        
        // Handle resize
        this.handleResize();
    }

    // Add CSS Styles
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .esoteric-icon {
                position: absolute;
                font-size: var(--icon-size, 1.2rem);
                opacity: 0;
                pointer-events: auto;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: var(--layer, 1);
                text-shadow: 0 0 10px currentColor;
                animation: floatDown var(--duration, 25s) linear forwards;
                will-change: transform, opacity;
                transform: translateZ(0);
                backface-visibility: hidden;
            }

            .esoteric-icon:hover {
                transform: scale(1.3) translateZ(0);
                opacity: 0.4 !important;
                filter: drop-shadow(0 0 15px currentColor);
            }

            .esoteric-icon.clicked {
                transform: scale(2) translateZ(0) rotate(360deg);
                opacity: 0.6 !important;
                filter: drop-shadow(0 0 25px currentColor);
                transition: all 0.5s ease;
            }

            .esoteric-icon.mystical {
                color: #9333ea;
            }

            .esoteric-icon.nature {
                color: #22c55e;
            }

            .esoteric-icon.celestial {
                color: #fbbf24;
            }

            .esoteric-icon.spiritual {
                color: #ec4899;
            }

            .esoteric-icon.energy {
                color: #3b82f6;
            }

            @keyframes floatDown {
                0% {
                    transform: translateY(-50px) translateZ(0) rotate(0deg);
                    opacity: 0;
                }

                10% {
                    opacity: 0.6;
                }

                90% {
                    opacity: 0.6;
                }

                100% {
                    transform: translateY(calc(100vh + 50px)) translateZ(0) rotate(360deg);
                    opacity: 0;
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1) translateZ(0);
                }
                50% {
                    transform: scale(1.1) translateZ(0);
                }
            }

            .esoteric-icon.pulse {
                animation: pulse 2s ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
                .esoteric-icon {
                    animation: none;
                    opacity: 0.3;
                    transform: translateY(0) translateZ(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Start Spawning Icons
    startSpawning() {
        // Spawn initial icons
        for (let i = 0; i < Math.min(3, this.maxIcons); i++) {
            setTimeout(() => this.spawnIcon(), i * 500);
        }
        
        // Continue spawning
        this.spawnTimer = setInterval(() => {
            if (this.activeIcons.size < this.maxIcons) {
                this.spawnIcon();
            }
        }, this.spawnInterval);
    }

    // Spawn Single Icon
    spawnIcon() {
        if (!this.container) return;
        
        // Get random category and icon
        const categories = Object.keys(this.icons);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const categoryIcons = this.icons[category];
        const iconData = categoryIcons[Math.floor(Math.random() * categoryIcons.length)];
        
        // Create icon element
        const icon = document.createElement('div');
        icon.className = `esoteric-icon ${iconData.class}`;
        icon.textContent = iconData.icon;
        icon.style.setProperty('--icon-size', iconData.size);
        
        // Random position
        const xPos = this.getRandomPosition();
        icon.style.left = xPos + '%';
        
        // Random duration
        const duration = this.getRandomDuration();
        icon.style.setProperty('--duration', duration + 's');
        
        // Random layer
        const layer = Math.floor(Math.random() * 3) + 1;
        icon.style.setProperty('--layer', layer);
        
        // Add click handler
        icon.addEventListener('click', (e) => this.handleIconClick(e, icon));
        
        // Add to container
        this.container.appendChild(icon);
        this.activeIcons.add(icon);
        
        // Remove after animation
        setTimeout(() => {
            this.removeIcon(icon);
        }, duration * 1000);
    }

    // Get Random Position
    getRandomPosition() {
        // Distribute icons across the screen with better spacing
        const zones = [
            { min: 5, max: 30 },   // Left side
            { min: 35, max: 65 },  // Center
            { min: 70, max: 95 }  // Right side
        ];
        
        const zone = zones[Math.floor(Math.random() * zones.length)];
        return Math.random() * (zone.max - zone.min) + zone.min;
    }

    // Get Random Duration
    getRandomDuration() {
        const durations = [15, 20, 25, 30, 35, 40];
        return durations[Math.floor(Math.random() * durations.length)];
    }

    // Handle Icon Click
    handleIconClick(e, icon) {
        e.stopPropagation();
        
        // Add clicked animation
        icon.classList.add('clicked');
        
        // Create sparkle effect
        this.createSparkles(e.clientX, e.clientY, icon.className);
        
        // Remove after animation
        setTimeout(() => {
            this.removeIcon(icon);
        }, 500);
    }

    // Create Sparkles Effect
    createSparkles(x, y, iconClass) {
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.textContent = '✨';
            sparkle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: 0.8rem;
                color: ${this.getIconColor(iconClass)};
                pointer-events: none;
                z-index: 9999;
                animation: sparkle-burst 0.8s ease-out forwards;
            `;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 800);
        }
    }

    // Get Icon Color
    getIconColor(className) {
        if (className.includes('mystical')) return '#9333ea';
        if (className.includes('nature')) return '#22c55e';
        if (className.includes('celestial')) return '#fbbf24';
        if (className.includes('spiritual')) return '#ec4899';
        if (className.includes('energy')) return '#3b82f6';
        return '#ffffff';
    }

    // Remove Icon
    removeIcon(icon) {
        if (icon && icon.parentNode) {
            icon.remove();
            this.activeIcons.delete(icon);
        }
    }

    // Handle Visibility Changes
    handleVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(this.spawnTimer);
            } else {
                this.startSpawning();
            }
        });
    }

    // Handle Resize
    handleResize() {
        window.addEventListener('resize', () => {
            // Update max icons based on new screen size
            const newMaxIcons = window.innerWidth <= 480 ? 5 : window.innerWidth <= 768 ? 8 : 15;
            const newSpawnInterval = window.innerWidth <= 480 ? 5000 : window.innerWidth <= 768 ? 4000 : 3000;
            
            if (newMaxIcons !== this.maxIcons || newSpawnInterval !== this.spawnInterval) {
                this.maxIcons = newMaxIcons;
                this.spawnInterval = newSpawnInterval;
                
                // Restart spawning with new settings
                clearInterval(this.spawnTimer);
                this.startSpawning();
            }
        });
    }

    // Cleanup
    destroy() {
        clearInterval(this.spawnTimer);
        this.activeIcons.forEach(icon => this.removeIcon(icon));
    }
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle-burst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx, 0), var(--ty, 0)) scale(0);
            opacity: 0;
        }
    }
    
    .sparkle:nth-child(1) { --tx: -20px; --ty: -20px; }
    .sparkle:nth-child(2) { --tx: 0px; --ty: -25px; }
    .sparkle:nth-child(3) { --tx: 20px; --ty: -20px; }
    .sparkle:nth-child(4) { --tx: -25px; --ty: 0px; }
    .sparkle:nth-child(5) { --tx: 25px; --ty: 0px; }
    .sparkle:nth-child(6) { --tx: -20px; --ty: 20px; }
    .sparkle:nth-child(7) { --tx: 0px; --ty: 25px; }
    .sparkle:nth-child(8) { --tx: 20px; --ty: 20px; }
`;
document.head.appendChild(sparkleStyle);

// Export to global scope
window.EsotericAnimation = EsotericAnimation;

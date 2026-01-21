// Orbital Menu JavaScript for Berhu Platform

class OrbitalMenu {
    constructor() {
        this.menu = document.getElementById('orbitalMenu');
        this.isAnimating = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserSession();
        this.setupEventListeners();
        this.initializeAnimations();
        this.addSpiritualElements();
    }

    // Load User Session
    loadUserSession() {
        try {
            const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
            if (session) {
                const sessionData = JSON.parse(session);
                this.currentUser = sessionData.user;
                this.updateProfileImage();
            }
        } catch (error) {
            console.error('Error loading session:', error);
        }
    }

    // Update Profile Image
    updateProfileImage() {
        if (this.currentUser && this.currentUser.avatar) {
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = this.currentUser.avatar;
            }
        }
    }

    // Setup Event Listeners
    setupEventListeners() {
        // Menu item hover effects
        const menuItems = document.querySelectorAll('.orbital-menu__item');
        
        menuItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => this.handleItemHover(item, index));
            item.addEventListener('mouseleave', () => this.handleItemLeave(item, index));
            item.addEventListener('click', (e) => this.handleItemClick(e, item, index));
        });

        // Profile image interactions
        const profilePic = document.querySelector('.orbital-menu__center-pic');
        if (profilePic) {
            profilePic.addEventListener('click', () => this.handleProfileClick());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // Handle Item Hover
    handleItemHover(item, index) {
        if (this.isAnimating) return;
        
        const link = item.querySelector('.orbital-menu__link');
        const icon = item.querySelector('.orbital-menu__link-icon');
        const text = item.querySelector('.orbital-menu__link-text');

        // Enhanced hover effects
        link.style.transform = 'scale(1.15)';
        link.style.filter = 'brightness(1.3)';
        
        // Add glow effect
        link.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.8)';
        
        // Subtle rotation
        item.style.transform = `rotate(${index * 45}deg) scale(1.05)`;
    }

    // Handle Item Leave
    handleItemLeave(item, index) {
        const link = item.querySelector('.orbital-menu__link');
        
        link.style.transform = 'scale(1)';
        link.style.filter = 'brightness(1)';
        link.style.boxShadow = 'none';
        item.style.transform = `rotate(${index * 45}deg)`;
    }

    // Handle Item Click
    handleItemClick(e, item, index) {
        const link = item.querySelector('.orbital-menu__link');
        const href = link.getAttribute('href');
        
        // Add click animation
        this.isAnimating = true;
        link.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            link.style.transform = 'scale(1)';
            this.isAnimating = false;
        }, 200);

        // Handle internal links
        if (href.startsWith('#')) {
            e.preventDefault();
            this.handleInternalAction(href.substring(1));
        }

        // Add haptic feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    // Handle Internal Actions
    handleInternalAction(action) {
        switch (action) {
            case 'history':
                this.showHistory();
                break;
            case 'meditations':
                this.showMeditations();
                break;
            case 'settings':
                this.showSettings();
                break;
            case 'logout':
                this.logout();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    // Handle Profile Click
    handleProfileClick() {
        this.showProfileDetails();
    }

    // Show History Modal
    showHistory() {
        const modal = this.createModal('Histórico de Sessões', this.getHistoryContent());
        this.openModal(modal);
    }

    // Show Meditations Modal
    showMeditations() {
        const modal = this.createModal('Meditações Guiadas', this.getMeditationsContent());
        this.openModal(modal);
    }

    // Show Settings Modal
    showSettings() {
        const modal = this.createModal('Configurações', this.getSettingsContent());
        this.openModal(modal);
    }

    // Show Profile Details
    showProfileDetails() {
        const modal = this.createModal('Meu Perfil', this.getProfileContent());
        this.openModal(modal);
    }

    // Get History Content
    getHistoryContent() {
        return `
            <div class="space-y-4">
                <div class="session-card">
                    <div class="flex justify-between items-center p-4 bg-white bg-opacity-10 rounded-lg">
                        <div>
                            <h4 class="font-semibold text-white">Sessão de Reiki</h4>
                            <p class="text-sm opacity-80">15/01/2026 - 14:00</p>
                            <p class="text-xs opacity-60 mt-1">Duração: 60 minutos</p>
                        </div>
                        <div class="text-right">
                            <span class="badge badge-success">Concluída</span>
                            <div class="mt-2">
                                <button class="btn btn-sm btn-secondary">Ver Detalhes</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="session-card">
                    <div class="flex justify-between items-center p-4 bg-white bg-opacity-10 rounded-lg">
                        <div>
                            <h4 class="font-semibold text-white">Meditação Guiada</h4>
                            <p class="text-sm opacity-80">10/01/2026 - 10:00</p>
                            <p class="text-xs opacity-60 mt-1">Duração: 45 minutos</p>
                        </div>
                        <div class="text-right">
                            <span class="badge badge-success">Concluída</span>
                            <div class="mt-2">
                                <button class="btn btn-sm btn-secondary">Ver Detalhes</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="session-card">
                    <div class="flex justify-between items-center p-4 bg-white bg-opacity-10 rounded-lg">
                        <div>
                            <h4 class="font-semibold text-white">Avaliação Terapêutica</h4>
                            <p class="text-sm opacity-80">05/01/2026 - 16:00</p>
                            <p class="text-xs opacity-60 mt-1">Duração: 90 minutos</p>
                        </div>
                        <div class="text-right">
                            <span class="badge badge-warning">Em andamento</span>
                            <div class="mt-2">
                                <button class="btn btn-sm btn-primary">Continuar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Get Meditations Content
    getMeditationsContent() {
        return `
            <div class="grid grid-cols-1 gap-4">
                <div class="meditation-card">
                    <div class="p-4 bg-white bg-opacity-10 rounded-lg">
                        <h4 class="font-semibold text-white mb-2">Meditação para Ansiedade</h4>
                        <p class="text-sm opacity-80 mb-3">Reduza a ansiedade com técnicas de respiração profunda e mindfulness.</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-clock text-xs opacity-60"></i>
                                <span class="text-xs opacity-60">15 minutos</span>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="this.startMeditation('anxiety')">
                                <i class="fas fa-play mr-2"></i>Iniciar
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="meditation-card">
                    <div class="p-4 bg-white bg-opacity-10 rounded-lg">
                        <h4 class="font-semibold text-white mb-2">Meditação de Chakras</h4>
                        <p class="text-sm opacity-80 mb-3">Alinhe seus centros de energia com esta meditação poderosa.</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-clock text-xs opacity-60"></i>
                                <span class="text-xs opacity-60">20 minutos</span>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="this.startMeditation('chakras')">
                                <i class="fas fa-play mr-2"></i>Iniciar
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="meditation-card">
                    <div class="p-4 bg-white bg-opacity-10 rounded-lg">
                        <h4 class="font-semibold text-white mb-2">Meditação para Sono</h4>
                        <p class="text-sm opacity-80 mb-3">Tenha um sono reparador e profundo com esta meditação noturna.</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-clock text-xs opacity-60"></i>
                                <span class="text-xs opacity-60">30 minutos</span>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="this.startMeditation('sleep')">
                                <i class="fas fa-play mr-2"></i>Iniciar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Get Settings Content
    getSettingsContent() {
        return `
            <form class="space-y-4" onsubmit="this.saveSettings(event)">
                <div class="form-group">
                    <label class="form-label">Notificações</label>
                    <div class="space-y-2">
                        <div class="flex items-center space-x-3">
                            <input type="checkbox" id="session-notifications" class="form-checkbox" checked>
                            <label for="session-notifications">Lembretes de sessões</label>
                        </div>
                        <div class="flex items-center space-x-3">
                            <input type="checkbox" id="meditation-reminders" class="form-checkbox" checked>
                            <label for="meditation-reminders">Lembretes de meditação</label>
                        </div>
                        <div class="flex items-center space-x-3">
                            <input type="checkbox" id="newsletter" class="form-checkbox">
                            <label for="newsletter">Newsletter semanal</label>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Idioma</label>
                    <select class="form-input">
                        <option>Português (BR)</option>
                        <option>English</option>
                        <option>Español</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Fuso Horário</label>
                    <select class="form-input">
                        <option>Brasília (GMT-3)</option>
                        <option>New York (GMT-5)</option>
                        <option>London (GMT+0)</option>
                        <option>Tokyo (GMT+9)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Tema da Interface</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="this.setTheme('spiritual')">Espiritual</button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="this.setTheme('minimal')">Minimalista</button>
                        <button type="button" class="btn btn-secondary btn-sm" onclick="this.setTheme('nature')">Natureza</button>
                    </div>
                </div>
                
                <div class="flex space-x-3">
                    <button type="submit" class="btn btn-primary">Salvar Configurações</button>
                    <button type="button" class="btn btn-secondary" onclick="this.closeModal()">Cancelar</button>
                </div>
            </form>
        `;
    }

    // Get Profile Content
    getProfileContent() {
        if (!this.currentUser) {
            return '<p>Carregando informações do perfil...</p>';
        }

        return `
            <div class="space-y-4">
                <div class="text-center">
                    <img src="${this.currentUser.avatar || 'https://picsum.photos/seed/default-avatar/200/200.jpg'}" 
                         alt="Perfil" 
                         class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-400">
                    <h3 class="text-xl font-semibold text-white">${this.currentUser.name}</h3>
                    <p class="text-sm opacity-80">${this.currentUser.email}</p>
                    <span class="badge badge-primary mt-2">${this.getPlanLabel(this.currentUser.plan)}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="bg-white bg-opacity-10 rounded-lg p-3">
                        <div class="text-2xl font-bold text-purple-300">12</div>
                        <div class="text-xs opacity-80">Sessões Concluídas</div>
                    </div>
                    <div class="bg-white bg-opacity-10 rounded-lg p-3">
                        <div class="text-2xl font-bold text-purple-300">8</div>
                        <div class="text-xs opacity-80">Cursos em Progresso</div>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <button class="btn btn-primary w-full">Editar Perfil</button>
                    <button class="btn btn-secondary w-full">Ver Estatísticas</button>
                    <button class="btn btn-secondary w-full">Baixar Dados</button>
                </div>
            </div>
        `;
    }

    // Get Plan Label
    getPlanLabel(plan) {
        const plans = {
            'basic': 'Básico',
            'premium': 'Premium',
            'therapist': 'Terapeuta',
            'admin': 'Administrador'
        };
        return plans[plan] || 'Básico';
    }

    // Create Modal
    createModal(title, content) {
        return `
            <div class="modal" id="dynamicModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="this.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
    }

    // Open Modal
    openModal(modalHTML) {
        // Remove existing modal
        const existingModal = document.getElementById('dynamicModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal with animation
        setTimeout(() => {
            const modal = document.getElementById('dynamicModal');
            if (modal) {
                modal.classList.add('active');
            }
        }, 100);
    }

    // Close Modal
    closeModal() {
        const modal = document.getElementById('dynamicModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // Initialize Animations
    initializeAnimations() {
        // Add floating particles
        this.createFloatingParticles();
        
        // Add subtle parallax effect
        this.setupParallax();
    }

    // Create Floating Particles
    createFloatingParticles() {
        const particleCount = 20;
        const container = document.querySelector('.orbital-menu');
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                pointer-events: none;
                z-index: 1;
            `;
            container.appendChild(particle);
        }
    }

    // Setup Parallax
    setupParallax() {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
            const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
            
            const menu = document.querySelector('.orbital-menu__list');
            if (menu) {
                menu.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
            }
        });
    }

    // Add Spiritual Elements
    addSpiritualElements() {
        // Add sacred geometry patterns
        this.addSacredGeometry();
        
        // Add energy waves
        this.addEnergyWaves();
    }

    // Add Sacred Geometry
    addSacredGeometry() {
        const container = document.querySelector('.orbital-menu');
        const geometry = document.createElement('div');
        geometry.className = 'sacred-geometry';
        geometry.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 600px;
            height: 600px;
            margin: -300px 0 0 -300px;
            border: 1px solid rgba(212, 175, 55, 0.1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            animation: rotate 120s linear infinite;
        `;
        container.appendChild(geometry);
    }

    // Add Energy Waves
    addEnergyWaves() {
        const container = document.querySelector('.orbital-menu');
        
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'energy-wave';
            wave.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${400 + i * 100}px;
                height: ${400 + i * 100}px;
                margin: ${-(200 + i * 50)}px 0 0 ${-(200 + i * 50)}px;
                border: 2px solid rgba(102, 126, 234, ${0.3 - i * 0.1});
                border-radius: 50%;
                pointer-events: none;
                z-index: ${5 - i};
                animation: pulse ${3 + i}s ease-in-out infinite;
            `;
            container.appendChild(wave);
        }
    }

    // Handle Keyboard Navigation
    handleKeyboard(e) {
        if (e.key === 'Escape') {
            this.closeModal();
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            this.navigateMenu(e.key === 'ArrowRight' ? 1 : -1);
        }
        
        // Enter to activate
        if (e.key === 'Enter') {
            this.activateCurrentItem();
        }
    }

    // Navigate Menu
    navigateMenu(direction) {
        const items = document.querySelectorAll('.orbital-menu__item');
        const currentIndex = Array.from(items).findIndex(item => item.classList.contains('focused'));
        
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = items.length - 1;
        if (nextIndex >= items.length) nextIndex = 0;
        
        // Remove focus from current
        if (currentIndex >= 0) {
            items[currentIndex].classList.remove('focused');
        }
        
        // Add focus to next
        items[nextIndex].classList.add('focused');
        this.handleItemHover(items[nextIndex], nextIndex);
    }

    // Activate Current Item
    activateCurrentItem() {
        const focused = document.querySelector('.orbital-menu__item.focused');
        if (focused) {
            const link = focused.querySelector('.orbital-menu__link');
            link.click();
        }
    }

    // Logout
    logout() {
        if (confirm('Tem certeza que deseja sair da sua jornada espiritual?')) {
            localStorage.removeItem('berhu_session');
            sessionStorage.removeItem('berhu_session');
            window.location.href = 'auth.html';
        }
    }

    // Start Meditation
    startMeditation(type) {
        console.log('Starting meditation:', type);
        // This would integrate with audio playback
        this.showNotification('Iniciando meditação...', 'success');
    }

    // Save Settings
    saveSettings(e) {
        e.preventDefault();
        // Save settings to backend
        this.showNotification('Configurações salvas com sucesso!', 'success');
        this.closeModal();
    }

    // Set Theme
    setTheme(theme) {
        document.body.className = `theme-${theme}`;
        this.showNotification(`Tema ${theme} aplicado!`, 'success');
    }

    // Show Notification
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
        
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        notification.classList.add(colors[type] || colors.info);
        notification.innerHTML = `
            <div class="flex items-center text-white">
                <span class="mr-3">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('translate-x-0');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
    }
    
    .orbital-menu__item.focused .orbital-menu__link {
        transform: scale(1.2);
        box-shadow: 0 0 40px rgba(102, 126, 234, 1);
    }
    
    .floating-particle {
        animation: float linear infinite;
    }
    
    .energy-wave {
        animation: pulse ease-in-out infinite;
    }
    
    .sacred-geometry {
        animation: rotate linear infinite;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.orbitalMenu = new OrbitalMenu();
});

// Make functions globally accessible
window.showHistory = () => window.orbitalMenu.showHistory();
window.showMeditations = () => window.orbitalMenu.showMeditations();
window.showSettings = () => window.orbitalMenu.showSettings();
window.logout = () => window.orbitalMenu.logout();

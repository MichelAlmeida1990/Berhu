// Profile Page JavaScript for Berhu Platform

// Initialize Profile Page
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

// Initialize Profile
function initializeProfile() {
    checkSession();
    loadUserProfile();
    setupEventListeners();
    loadSessionHistory();
    updateStats();
}

// Check User Session
function checkSession() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    
    if (!session) {
        window.location.href = 'auth.html';
        return;
    }
    
    try {
        const sessionData = JSON.parse(session);
        if (new Date(sessionData.expiresAt) <= new Date()) {
            localStorage.removeItem('berhu_session');
            sessionStorage.removeItem('berhu_session');
            window.location.href = 'auth.html';
            return;
        }
        
        window.currentUser = sessionData.user;
    } catch (error) {
        console.error('Invalid session:', error);
        window.location.href = 'auth.html';
    }
}

// Load User Profile
function loadUserProfile() {
    if (!window.currentUser) return;
    
    const user = window.currentUser;
    
    // Update user info
    document.getElementById('user-name').textContent = user.name || 'Usuário';
    document.getElementById('user-email').textContent = user.email || '';
    document.getElementById('user-plan').textContent = getPlanDisplayName(user.plan || 'basic');
    
    // Update form fields
    document.getElementById('name-input').value = user.name || '';
    document.getElementById('email-input').value = user.email || '';
    document.getElementById('phone-input').value = user.phone || '';
    document.getElementById('birthdate-input').value = user.birthdate || '';
    document.getElementById('bio-input').value = user.bio || '';
    
    // Load avatar
    loadAvatar(user.avatar);
}

// Get Plan Display Name
function getPlanDisplayName(plan) {
    const plans = {
        'basic': 'Básico',
        'premium': 'Premium',
        'therapist': 'Terapeuta',
        'admin': 'Administrador'
    };
    return plans[plan] || 'Básico';
}

// Load Avatar
function loadAvatar(avatarUrl) {
    const avatarImage = document.getElementById('avatar-image');
    const avatarInitial = document.getElementById('avatar-initial');
    const userName = window.currentUser.name || 'Usuário';
    
    if (avatarUrl) {
        avatarImage.src = avatarUrl;
        avatarImage.classList.remove('hidden');
        avatarInitial.classList.add('hidden');
    } else {
        // Show initial
        const initial = userName.charAt(0).toUpperCase();
        avatarInitial.textContent = initial;
        avatarInitial.classList.remove('hidden');
        avatarImage.classList.add('hidden');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Avatar upload
    setupAvatarUpload();
    
    // Quick action buttons
    setupQuickActions();
}

// Setup Avatar Upload
function setupAvatarUpload() {
    const avatarUploadBtn = document.getElementById('avatar-upload-btn');
    const avatarInput = document.getElementById('avatar-input');
    
    if (avatarUploadBtn && avatarInput) {
        avatarUploadBtn.addEventListener('click', () => {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
}

// Handle Avatar Upload
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecione uma imagem válida', 'error');
        return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('A imagem deve ter no máximo 5MB', 'error');
        return;
    }
    
    // Read and display image
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // Update avatar display
        const avatarImage = document.getElementById('avatar-image');
        const avatarInitial = document.getElementById('avatar-initial');
        
        avatarImage.src = imageUrl;
        avatarImage.classList.remove('hidden');
        avatarInitial.classList.add('hidden');
        
        // Save to user profile
        saveAvatar(imageUrl);
    };
    
    reader.readAsDataURL(file);
}

// Save Avatar
function saveAvatar(imageUrl) {
    // Update current user
    window.currentUser.avatar = imageUrl;
    
    // Update session
    updateSession();
    
    // Show success message
    showNotification('Avatar atualizado com sucesso!', 'success');
}

// Handle Profile Update
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        phone: document.getElementById('phone-input').value,
        birthdate: document.getElementById('birthdate-input').value,
        bio: document.getElementById('bio-input').value
    };
    
    // Validate required fields
    if (!formData.name || !formData.email) {
        showNotification('Nome e e-mail são obrigatórios', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('E-mail inválido', 'error');
        return;
    }
    
    // Show loading
    showLoading('Atualizando perfil...');
    
    // Simulate API call
    setTimeout(() => {
        // Update user data
        Object.assign(window.currentUser, formData);
        
        // Update session
        updateSession();
        
        // Update display
        document.getElementById('user-name').textContent = formData.name;
        document.getElementById('user-email').textContent = formData.email;
        
        // Hide loading
        hideLoading();
        
        // Show success message
        showNotification('Perfil atualizado com sucesso!', 'success');
    }, 1000);
}

// Update Session
function updateSession() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            sessionData.user = window.currentUser;
            
            // Determine storage type
            const storage = localStorage.getItem('berhu_session') ? localStorage : sessionStorage;
            storage.setItem('berhu_session', JSON.stringify(sessionData));
        } catch (error) {
            console.error('Error updating session:', error);
        }
    }
}

// Setup Quick Actions
function setupQuickActions() {
    const quickActions = document.querySelectorAll('.space-y-3 button');
    
    quickActions.forEach((button, index) => {
        button.addEventListener('click', () => {
            switch(index) {
                case 0: // Agendar Sessão
                    window.location.href = 'appointments.html';
                    break;
                case 1: // Ver Cursos
                    window.location.href = 'courses.html';
                    break;
                case 2: // Baixar Materiais
                    showNotification('Área de downloads em desenvolvimento', 'info');
                    break;
            }
        });
    });
}

// Load Session History
function loadSessionHistory() {
    const historyContainer = document.getElementById('session-history');
    if (!historyContainer) return;
    
    // Mock session data
    const sessions = [
        {
            id: 1,
            type: 'Reiki',
            date: '2024-01-15',
            therapist: 'Fabiana Berkana',
            status: 'completed',
            evaluation: {
                rating: 5,
                evolution: 'Excelente progresso na conexão energética',
                improvements: ['Foco aumentado', 'Equilíbrio emocional'],
                challenges: ['Ansiedade social']
            }
        },
        {
            id: 2,
            type: 'Meditação Guiada',
            date: '2024-01-08',
            therapist: 'Fabiana Berkana',
            status: 'completed',
            evaluation: {
                rating: 4,
                evolution: 'Bom desenvolvimento na prática meditativa',
                improvements: ['Clareza mental', 'Paciência'],
                challenges: ['Dificuldade em manter foco']
            }
        },
        {
            id: 3,
            type: 'Leitura de Aura',
            date: '2024-01-01',
            therapist: 'Fabiana Berkana',
            status: 'completed',
            evaluation: {
                rating: 5,
                evolution: 'Primeiros passos no autoconhecimento',
                improvements: ['Autoconsciência', 'Percepção energética'],
                challenges: ['Bloqueios antigos']
            }
        }
    ];
    
    historyContainer.innerHTML = '';
    
    sessions.forEach(session => {
        const sessionCard = createSessionCard(session);
        historyContainer.appendChild(sessionCard);
    });
}

// Create Session Card
function createSessionCard(session) {
    const card = document.createElement('div');
    card.className = 'history-item bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10';
    
    const statusColor = session.status === 'completed' ? 'green' : 'yellow';
    const statusText = session.status === 'completed' ? 'Concluída' : 'Agendada';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div>
                <h4 class="font-semibold text-lg">${session.type}</h4>
                <p class="text-sm text-gray-400">com ${session.therapist}</p>
            </div>
            <span class="bg-${statusColor}-600 bg-opacity-20 px-2 py-1 rounded text-${statusColor}-300 text-sm">
                ${statusText}
            </span>
        </div>
        
        <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-400">
                <i class="fas fa-calendar mr-1"></i>
                ${formatDate(session.date)}
            </span>
            <div class="star-rating">
                ${generateStars(session.evaluation?.rating || 0)}
            </div>
        </div>
        
        ${session.evaluation ? `
            <div class="evaluation-section bg-purple-600 bg-opacity-10 rounded-lg p-3 border border-purple-500 border-opacity-30">
                <h5 class="font-semibold text-purple-300 mb-2">
                    <i class="fas fa-clipboard-check mr-2"></i>Avaliação da Terapeuta
                </h5>
                <p class="text-sm text-gray-300 mb-2">${session.evaluation.evolution}</p>
                
                ${session.evaluation.improvements?.length > 0 ? `
                    <div class="mb-2">
                        <span class="text-xs text-green-400 font-semibold">
                            <i class="fas fa-arrow-up mr-1"></i>Melhorias:
                        </span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${session.evaluation.improvements.map(improvement => 
                                `<span class="text-xs bg-green-600 bg-opacity-20 px-2 py-1 rounded">${improvement}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${session.evaluation.challenges?.length > 0 ? `
                    <div>
                        <span class="text-xs text-orange-400 font-semibold">
                            <i class="fas fa-exclamation-triangle mr-1"></i>Desafios:
                        </span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${session.evaluation.challenges.map(challenge => 
                                `<span class="text-xs bg-orange-600 bg-opacity-20 px-2 py-1 rounded">${challenge}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        ` : ''}
    `;
    
    return card;
}

// Generate Star Rating HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-yellow-400"></i>';
        } else {
            stars += '<i class="far fa-star text-gray-400"></i>';
        }
    }
    return stars;
}

// Update Stats
function updateStats() {
    // Mock stats - in real app, this would come from API
    const stats = {
        sessions: 24,
        courses: 6,
        achievements: 12
    };
    
    document.getElementById('session-count').textContent = stats.sessions;
    document.getElementById('courses-count').textContent = stats.courses;
    document.getElementById('achievements-count').textContent = stats.achievements;
    
    // Update progress bar with animation
    setTimeout(() => {
        const progressBar = document.getElementById('progress-bar');
        const progressPercentage = document.getElementById('progress-percentage');
        
        progressBar.style.width = '85%';
        progressPercentage.textContent = '85%';
    }, 500);
}

// Logout
function logout() {
    localStorage.removeItem('berhu_session');
    sessionStorage.removeItem('berhu_session');
    window.location.href = 'auth.html';
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Show Notification (reuse from main script)
function showNotification(message, type = 'info', duration = 5000) {
    if (window.Berhu && window.Berhu.showNotification) {
        window.Berhu.showNotification(message, type, duration);
    } else {
        // Fallback notification
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Show/Hide Loading (reuse from main script)
function showLoading(message = 'Carregando...') {
    if (window.Berhu && window.Berhu.showLoading) {
        window.Berhu.showLoading(message);
    } else {
        // Fallback loading
        console.log('LOADING:', message);
    }
}

function hideLoading() {
    if (window.Berhu && window.Berhu.hideLoading) {
        window.Berhu.hideLoading();
    } else {
        // Fallback
        console.log('LOADING HIDDEN');
    }
}

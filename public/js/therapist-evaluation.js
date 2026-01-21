// Therapist Evaluation JavaScript for Berhu Platform

// Clients Data
const clients = {
    1: {
        id: 1,
        name: 'Usuária Demo',
        email: 'demo@berhu.com',
        plan: 'premium',
        sessions: 24,
        avatar: null,
        initial: 'UD',
        color: 'purple'
    },
    2: {
        id: 2,
        name: 'Maria Client',
        email: 'maria@berhu.com',
        plan: 'basic',
        sessions: 12,
        avatar: null,
        initial: 'MC',
        color: 'green'
    },
    3: {
        id: 3,
        name: 'João Silva',
        email: 'joao@berhu.com',
        plan: 'premium',
        sessions: 8,
        avatar: null,
        initial: 'JS',
        color: 'blue'
    }
};

// Global Variables
let selectedClient = null;
let currentRating = 0;
let improvements = [];
let challenges = [];
let evaluationData = {};

// Initialize Therapist Evaluation Page
document.addEventListener('DOMContentLoaded', function() {
    initializeTherapistEvaluation();
});

// Initialize Therapist Evaluation
function initializeTherapistEvaluation() {
    checkSession();
    setupEventListeners();
    loadRecentEvaluations();
}

// Check User Session and Permissions
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
        
        // Check if user is therapist or admin
        const isTherapist = window.currentUser.email === 'therapist@berhu.com' || 
                          window.currentUser.plan === 'therapist' || 
                          window.currentUser.plan === 'admin';
        
        if (!isTherapist) {
            showNotification('Acesso restrito a terapeutas', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
        
    } catch (error) {
        console.error('Invalid session:', error);
        window.location.href = 'auth.html';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Client selection
    document.querySelectorAll('.client-card').forEach(card => {
        card.addEventListener('click', function() {
            selectClient(this.dataset.client);
        });
    });
    
    // Star rating
    document.querySelectorAll('#star-rating i').forEach(star => {
        star.addEventListener('click', function() {
            setRating(parseInt(this.dataset.rating));
        });
    });
    
    // Metric sliders
    document.querySelectorAll('.metric-range').forEach(slider => {
        slider.addEventListener('input', function() {
            updateMetricValue(this);
        });
    });
    
    // Enter key for dynamic lists
    document.getElementById('improvement-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addImprovement();
        }
    });
    
    document.getElementById('challenge-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addChallenge();
        }
    });
    
    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// Select Client
function selectClient(clientId) {
    selectedClient = clients[clientId];
    
    // Update UI
    document.querySelectorAll('.client-card').forEach(card => {
        card.classList.remove('selected', 'bg-purple-600', 'bg-opacity-20');
    });
    
    document.querySelector(`[data-client="${clientId}"]`).classList.add('selected', 'bg-purple-600', 'bg-opacity-20');
    
    // Show evaluation form
    document.getElementById('evaluation-form-container').classList.remove('hidden');
    
    // Update client info
    updateClientInfo();
    
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('session-date').value = today;
    
    // Scroll to form
    document.getElementById('evaluation-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Update Client Info
function updateClientInfo() {
    if (!selectedClient) return;
    
    document.getElementById('selected-client-info').innerHTML = `
        <div class="space-y-3">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-${selectedClient.color}-600 rounded-full flex items-center justify-center">
                    <span class="font-bold">${selectedClient.initial}</span>
                </div>
                <div>
                    <h4 class="font-semibold">${selectedClient.name}</h4>
                    <p class="text-sm text-gray-400">${selectedClient.email}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-400">Plano:</span>
                    <span class="ml-2 font-semibold">${selectedClient.plan}</span>
                </div>
                <div>
                    <span class="text-gray-400">Sessões:</span>
                    <span class="ml-2 font-semibold">${selectedClient.sessions}</span>
                </div>
            </div>
        </div>
    `;
}

// Set Star Rating
function setRating(rating) {
    currentRating = rating;
    
    // Update stars
    document.querySelectorAll('#star-rating i').forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('text-gray-400');
            star.classList.add('text-yellow-400');
        } else {
            star.classList.remove('text-yellow-400');
            star.classList.add('text-gray-400');
        }
    });
    
    // Update rating text
    const ratingTexts = ['', 'Insuficiente', 'Regular', 'Bom', 'Muito Bom', 'Excelente'];
    document.getElementById('rating-text').textContent = ratingTexts[rating];
    
    updateEvaluationSummary();
}

// Update Metric Value
function updateMetricValue(slider) {
    const value = slider.value;
    const valueDisplay = slider.parentElement.querySelector('.metric-value');
    valueDisplay.textContent = value + '%';
    
    updateEvaluationSummary();
}

// Add Improvement
function addImprovement() {
    const input = document.getElementById('improvement-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    improvements.push(text);
    updateImprovementsList();
    input.value = '';
    
    updateEvaluationSummary();
}

// Update Improvements List
function updateImprovementsList() {
    const list = document.getElementById('improvements-list');
    list.innerHTML = '';
    
    improvements.forEach((improvement, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between bg-green-600 bg-opacity-20 rounded-lg px-3 py-2';
        item.innerHTML = `
            <span class="text-sm">${improvement}</span>
            <button onclick="removeImprovement(${index})" class="text-red-400 hover:text-red-300">
                <i class="fas fa-times"></i>
            </button>
        `;
        list.appendChild(item);
    });
}

// Remove Improvement
function removeImprovement(index) {
    improvements.splice(index, 1);
    updateImprovementsList();
    updateEvaluationSummary();
}

// Add Challenge
function addChallenge() {
    const input = document.getElementById('challenge-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    challenges.push(text);
    updateChallengesList();
    input.value = '';
    
    updateEvaluationSummary();
}

// Update Challenges List
function updateChallengesList() {
    const list = document.getElementById('challenges-list');
    list.innerHTML = '';
    
    challenges.forEach((challenge, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between bg-orange-600 bg-opacity-20 rounded-lg px-3 py-2';
        item.innerHTML = `
            <span class="text-sm">${challenge}</span>
            <button onclick="removeChallenge(${index})" class="text-red-400 hover:text-red-300">
                <i class="fas fa-times"></i>
            </button>
        `;
        list.appendChild(item);
    });
}

// Remove Challenge
function removeChallenge(index) {
    challenges.splice(index, 1);
    updateChallengesList();
    updateEvaluationSummary();
}

// Update Evaluation Summary
function updateEvaluationSummary() {
    const summary = document.getElementById('evaluation-summary');
    
    const sessionType = document.getElementById('session-type').value;
    const sessionDate = document.getElementById('session-date').value;
    const evolution = document.getElementById('evolution').value;
    
    if (!currentRating && !sessionType && !sessionDate && !evolution && improvements.length === 0 && challenges.length === 0) {
        summary.innerHTML = '<p class="text-gray-400 text-sm">Preencha o formulário para ver o resumo</p>';
        return;
    }
    
    // Calculate average metrics
    const metrics = {};
    document.querySelectorAll('.metric-range').forEach(slider => {
        metrics[slider.dataset.metric] = parseInt(slider.value);
    });
    
    const averageMetric = Object.values(metrics).reduce((a, b) => a + b, 0) / Object.values(metrics).length;
    
    summary.innerHTML = `
        <div class="space-y-3">
            ${currentRating ? `
                <div class="flex justify-between">
                    <span class="text-sm text-gray-400">Avaliação:</span>
                    <span class="text-sm font-semibold">${generateStars(currentRating)}</span>
                </div>
            ` : ''}
            
            ${sessionType ? `
                <div class="flex justify-between">
                    <span class="text-sm text-gray-400">Tipo:</span>
                    <span class="text-sm font-semibold">${getSessionTypeName(sessionType)}</span>
                </div>
            ` : ''}
            
            ${sessionDate ? `
                <div class="flex justify-between">
                    <span class="text-sm text-gray-400">Data:</span>
                    <span class="text-sm font-semibold">${formatDate(sessionDate)}</span>
                </div>
            ` : ''}
            
            <div class="flex justify-between">
                <span class="text-sm text-gray-400">Métrica Média:</span>
                <span class="text-sm font-semibold">${Math.round(averageMetric)}%</span>
            </div>
            
            ${improvements.length > 0 ? `
                <div>
                    <span class="text-sm text-gray-400">Melhorias:</span>
                    <span class="text-sm font-semibold text-green-300 ml-2">${improvements.length}</span>
                </div>
            ` : ''}
            
            ${challenges.length > 0 ? `
                <div>
                    <span class="text-sm text-gray-400">Desafios:</span>
                    <span class="text-sm font-semibold text-orange-300 ml-2">${challenges.length}</span>
                </div>
            ` : ''}
        </div>
    `;
}

// Generate Stars HTML
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-yellow-400 text-xs"></i>';
        } else {
            stars += '<i class="far fa-star text-gray-400 text-xs"></i>';
        }
    }
    return stars;
}

// Get Session Type Name
function getSessionTypeName(type) {
    const types = {
        reiki: 'Reiki',
        meditation: 'Meditação',
        astrology: 'Astrologia',
        crystals: 'Cristais',
        consultation: 'Consulta'
    };
    return types[type] || type;
}

// Save Draft
function saveDraft() {
    if (!selectedClient) {
        showNotification('Selecione um cliente primeiro', 'error');
        return;
    }
    
    collectEvaluationData();
    
    // Save to localStorage as draft
    const drafts = JSON.parse(localStorage.getItem('berhu_evaluation_drafts') || '[]');
    drafts.push({
        ...evaluationData,
        isDraft: true,
        savedAt: new Date().toISOString()
    });
    
    localStorage.setItem('berhu_evaluation_drafts', JSON.stringify(drafts));
    
    showNotification('Rascunho salvo com sucesso', 'success');
}

// Submit Evaluation
function submitEvaluation() {
    if (!selectedClient) {
        showNotification('Selecione um cliente primeiro', 'error');
        return;
    }
    
    // Validate required fields
    if (!currentRating) {
        showNotification('Por favor, selecione uma classificação por estrelas', 'error');
        return;
    }
    
    const sessionDate = document.getElementById('session-date').value;
    const sessionType = document.getElementById('session-type').value;
    
    if (!sessionDate || !sessionType) {
        showNotification('Por favor, preencha a data e o tipo da sessão', 'error');
        return;
    }
    
    // Collect evaluation data
    collectEvaluationData();
    
    // Add therapist info
    evaluationData.therapist = {
        name: window.currentUser.name,
        email: window.currentUser.email
    };
    
    evaluationData.isDraft = false;
    evaluationData.submittedAt = new Date().toISOString();
    
    // Save evaluation
    saveEvaluation(evaluationData);
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    resetForm();
}

// Collect Evaluation Data
function collectEvaluationData() {
    const metrics = {};
    document.querySelectorAll('.metric-range').forEach(slider => {
        metrics[slider.dataset.metric] = parseInt(slider.value);
    });
    
    evaluationData = {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        sessionDate: document.getElementById('session-date').value,
        sessionType: document.getElementById('session-type').value,
        sessionDuration: document.getElementById('session-duration').value || 60,
        rating: currentRating,
        metrics: metrics,
        evolution: document.getElementById('evolution').value,
        recommendations: document.getElementById('recommendations').value,
        nextSession: document.getElementById('nextSession').value,
        generalNotes: document.getElementById('generalNotes').value,
        improvements: improvements,
        challenges: challenges
    };
}

// Save Evaluation
function saveEvaluation(evaluation) {
    // Get existing evaluations
    const evaluations = JSON.parse(localStorage.getItem('berhu_evaluations') || '[]');
    
    // Add new evaluation
    evaluations.push(evaluation);
    
    // Save to localStorage
    localStorage.setItem('berhu_evaluations', JSON.stringify(evaluations));
    
    // Also add to client's session history
    addToClientHistory(evaluation);
    
    // Update recent evaluations display
    loadRecentEvaluations();
}

// Add to Client History
function addToClientHistory(evaluation) {
    const sessionHistory = JSON.parse(localStorage.getItem('berhu_session_history') || '[]');
    
    const historyEntry = {
        id: Date.now(),
        clientId: evaluation.clientId,
        clientName: evaluation.clientName,
        type: evaluation.sessionType,
        date: evaluation.sessionDate,
        therapist: evaluation.therapist.name,
        status: 'completed',
        therapistEvaluation: {
            rating: evaluation.rating,
            evolution: evaluation.evolution,
            recommendations: evaluation.recommendations,
            nextSession: evaluation.nextSession,
            improvements: evaluation.improvements,
            challenges: evaluation.challenges,
            metrics: evaluation.metrics
        },
        createdAt: evaluation.submittedAt
    };
    
    sessionHistory.push(historyEntry);
    localStorage.setItem('berhu_session_history', JSON.stringify(sessionHistory));
}

// Show Success Modal
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Success Modal
function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Reset Form
function resetForm() {
    // Clear selections
    selectedClient = null;
    currentRating = 0;
    improvements = [];
    challenges = [];
    evaluationData = {};
    
    // Reset UI
    document.querySelectorAll('.client-card').forEach(card => {
        card.classList.remove('selected', 'bg-purple-600', 'bg-opacity-20');
    });
    
    document.getElementById('evaluation-form-container').classList.add('hidden');
    
    // Reset form fields
    document.getElementById('session-date').value = '';
    document.getElementById('session-type').value = '';
    document.getElementById('session-duration').value = '';
    document.getElementById('evolution').value = '';
    document.getElementById('recommendations').value = '';
    document.getElementById('nextSession').value = '';
    document.getElementById('generalNotes').value = '';
    
    // Reset stars
    document.querySelectorAll('#star-rating i').forEach(star => {
        star.classList.remove('text-yellow-400');
        star.classList.add('text-gray-400');
    });
    document.getElementById('rating-text').textContent = 'Selecione uma classificação';
    
    // Reset sliders
    document.querySelectorAll('.metric-range').forEach(slider => {
        slider.value = 50;
        updateMetricValue(slider);
    });
    
    // Clear lists
    updateImprovementsList();
    updateChallengesList();
    
    // Update summary
    updateEvaluationSummary();
}

// Load Recent Evaluations
function loadRecentEvaluations() {
    const container = document.getElementById('recent-evaluations');
    const evaluations = JSON.parse(localStorage.getItem('berhu_evaluations') || '[]');
    
    if (evaluations.length === 0) {
        container.innerHTML = '<p class="text-gray-400 text-sm">Nenhuma avaliação recente</p>';
        return;
    }
    
    // Sort by date (most recent first)
    evaluations.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    
    // Show last 5 evaluations
    const recentEvaluations = evaluations.slice(0, 5);
    
    container.innerHTML = '';
    recentEvaluations.forEach(evaluation => {
        const evaluationCard = createRecentEvaluationCard(evaluation);
        container.appendChild(evaluationCard);
    });
}

// Create Recent Evaluation Card
function createRecentEvaluationCard(evaluation) {
    const card = document.createElement('div');
    card.className = 'bg-white bg-opacity-5 rounded-lg p-3 border border-white border-opacity-10';
    
    const date = new Date(evaluation.submittedAt);
    const dateStr = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <div>
                <h4 class="font-semibold text-sm">${evaluation.clientName}</h4>
                <p class="text-xs text-gray-400">${getSessionTypeName(evaluation.sessionType)}</p>
            </div>
            <div class="text-right">
                <div class="text-xs">${generateStars(evaluation.rating)}</div>
                <p class="text-xs text-gray-400">${dateStr}</p>
            </div>
        </div>
        
        ${evaluation.evolution ? `
            <p class="text-xs text-gray-300 line-clamp-2">${evaluation.evolution}</p>
        ` : ''}
    `;
    
    return card;
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

// Logout
function logout() {
    localStorage.removeItem('berhu_session');
    sessionStorage.removeItem('berhu_session');
    window.location.href = 'auth.html';
}

// Show Notification
function showNotification(message, type = 'info', duration = 5000) {
    if (window.Berhu && window.Berhu.showNotification) {
        window.Berhu.showNotification(message, type, duration);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

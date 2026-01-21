// Therapy History and Evaluation System
class TherapyHistoryManager {
    constructor() {
        this.sessions = this.loadSessions();
        this.evaluations = this.loadEvaluations();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderSessionHistory();
        this.renderEvaluations();
        this.updateStatistics();
    }

    // Data Management
    loadSessions() {
        const stored = localStorage.getItem('therapy_sessions');
        return stored ? JSON.parse(stored) : this.generateMockSessions();
    }

    loadEvaluations() {
        const stored = localStorage.getItem('therapy_evaluations');
        return stored ? JSON.parse(stored) : this.generateMockEvaluations();
    }

    saveSessions() {
        localStorage.setItem('therapy_sessions', JSON.stringify(this.sessions));
    }

    saveEvaluations() {
        localStorage.setItem('therapy_evaluations', JSON.stringify(this.evaluations));
    }

    // Mock Data Generation
    generateMockSessions() {
        return [
            {
                id: 1,
                date: '2024-01-15',
                type: 'Reiki',
                duration: 60,
                therapist: 'Fabiana Berkana',
                status: 'completed',
                notes: 'Primeira sessão de alinhamento energético',
                evaluationId: 1
            },
            {
                id: 2,
                date: '2024-01-22',
                type: 'Meditação Guiada',
                duration: 45,
                therapist: 'Fabiana Berkana',
                status: 'completed',
                notes: 'Meditação para conexão com o eu superior',
                evaluationId: 2
            },
            {
                id: 3,
                date: '2024-02-05',
                type: 'Terapia com Cristais',
                duration: 90,
                therapist: 'Fabiana Berkana',
                status: 'completed',
                notes: 'Limpeza áurica profunda com cristais',
                evaluationId: 3
            },
            {
                id: 4,
                date: '2024-02-12',
                type: 'Astrologia',
                duration: 60,
                therapist: 'Fabiana Berkana',
                status: 'completed',
                notes: 'Leitura de mapa astral e orientações',
                evaluationId: 4
            }
        ];
    }

    generateMockEvaluations() {
        return [
            {
                id: 1,
                sessionId: 1,
                date: '2024-01-15',
                overallWellbeing: 7,
                emotionalState: 6,
                energyLevel: 8,
                sleepQuality: 7,
                stressLevel: 4,
                physicalSymptoms: 2,
                mentalClarity: 7,
                spiritualConnection: 8,
                comments: 'Senti uma paz profunda durante a sessão. Energia mais equilibrada.',
                improvements: ['Mais calma', 'Melhor sono'],
                challenges: ['Ansiedade matinal'],
                goals: ['Continuar com meditação diária', 'Praticar gratidão']
            },
            {
                id: 2,
                sessionId: 2,
                date: '2024-01-22',
                overallWellbeing: 8,
                emotionalState: 8,
                energyLevel: 7,
                sleepQuality: 8,
                stressLevel: 3,
                physicalSymptoms: 1,
                mentalClarity: 9,
                spiritualConnection: 9,
                comments: 'Experiência transcendente. Conexão muito forte com meu eu interior.',
                improvements: ['Clareza mental', 'Paz interior'],
                challenges: ['Dificuldade em manter o estado meditativo'],
                goals: ['Meditar por mais tempo', 'Profundizar prática']
            },
            {
                id: 3,
                sessionId: 3,
                date: '2024-02-05',
                overallWellbeing: 9,
                emotionalState: 9,
                energyLevel: 9,
                sleepQuality: 8,
                stressLevel: 2,
                physicalSymptoms: 0,
                mentalClarity: 8,
                spiritualConnection: 10,
                comments: 'Sensação de renascimento. Muitas energias densas foram liberadas.',
                improvements: ['Vitalidade', 'Leveza', 'Alegria'],
                challenges: ['Processo de liberação emocional intensa'],
                goals: ['Continuar limpeza', 'Integrar novas energias']
            },
            {
                id: 4,
                sessionId: 4,
                date: '2024-02-12',
                overallWellbeing: 8,
                emotionalState: 7,
                energyLevel: 8,
                sleepQuality: 7,
                stressLevel: 3,
                physicalSymptoms: 1,
                mentalClarity: 9,
                spiritualConnection: 8,
                comments: 'Compreensão profunda do meu propósito. Orientações valiosas.',
                improvements: ['Direção clara', 'Autoconhecimento'],
                challenges: ['Mudanças necessárias assustadoras'],
                goals: ['Seguir intuição', 'Fazer mudanças alinhadas']
            }
        ];
    }

    // Session Management
    addSession(sessionData) {
        const newSession = {
            id: Date.now(),
            ...sessionData,
            date: new Date().toISOString().split('T')[0],
            status: 'completed'
        };
        this.sessions.push(newSession);
        this.saveSessions();
        this.renderSessionHistory();
        this.updateStatistics();
    }

    // Evaluation Management
    addEvaluation(evaluationData) {
        const newEvaluation = {
            id: Date.now(),
            ...evaluationData,
            date: new Date().toISOString().split('T')[0]
        };
        this.evaluations.push(newEvaluation);
        this.saveEvaluations();
        this.renderEvaluations();
        this.updateStatistics();
        this.updateProgressCharts();
    }

    // Rendering Methods
    renderSessionHistory() {
        const container = document.getElementById('session-history');
        if (!container) return;

        const sortedSessions = [...this.sessions].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        container.innerHTML = sortedSessions.map(session => {
            const evaluation = this.evaluations.find(e => e.sessionId === session.id);
            const evaluationScore = evaluation ? this.calculateOverallScore(evaluation) : null;

            return `
                <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h4 class="font-semibold text-white">${session.type}</h4>
                            <p class="text-sm text-gray-300">${this.formatDate(session.date)}</p>
                            <p class="text-sm text-gray-300">${session.therapist} • ${session.duration} min</p>
                        </div>
                        <div class="text-right">
                            ${evaluationScore ? `
                                <div class="text-sm text-gray-300">Avaliação</div>
                                <div class="text-lg font-bold ${this.getScoreColor(evaluationScore)}">${evaluationScore}/10</div>
                            ` : '<div class="text-sm text-gray-400">Sem avaliação</div>'}
                        </div>
                    </div>
                    <p class="text-sm text-gray-200 mb-3">${session.notes}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs px-2 py-1 bg-green-600 bg-opacity-20 text-green-300 rounded-full">
                            ${this.getStatusText(session.status)}
                        </span>
                        <div class="space-x-2">
                            ${evaluation ? `
                                <button onclick="therapyHistory.viewEvaluation(${evaluation.id})" 
                                        class="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded transition">
                                    Ver Avaliação
                                </button>
                            ` : ''}
                            <button onclick="therapyHistory.evaluateSession(${session.id})" 
                                    class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition">
                                ${evaluation ? 'Editar Avaliação' : 'Avaliar'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderEvaluations() {
        const container = document.getElementById('evaluations-list');
        if (!container) return;

        const sortedEvaluations = [...this.evaluations].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        container.innerHTML = sortedEvaluations.map(evaluation => {
            const session = this.sessions.find(s => s.id === evaluation.sessionId);
            const overallScore = this.calculateOverallScore(evaluation);

            return `
                <div class="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h4 class="font-semibold text-white">Avaliação - ${session?.type || 'Sessão'}</h4>
                            <p class="text-sm text-gray-300">${this.formatDate(evaluation.date)}</p>
                        </div>
                        <div class="text-lg font-bold ${this.getScoreColor(overallScore)}">
                            ${overallScore}/10
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 mb-3">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-300">Bem-estar:</span>
                            <span class="text-white">${evaluation.overallWellbeing}/10</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-300">Emocional:</span>
                            <span class="text-white">${evaluation.emotionalState}/10</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-300">Energia:</span>
                            <span class="text-white">${evaluation.energyLevel}/10</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-300">Sono:</span>
                            <span class="text-white">${evaluation.sleepQuality}/10</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-300">Estresse:</span>
                            <span class="text-white">${evaluation.stressLevel}/10</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-300">Clareza:</span>
                            <span class="text-white">${evaluation.mentalClarity}/10</span>
                        </div>
                    </div>
                    
                    ${evaluation.comments ? `
                        <div class="mb-3">
                            <p class="text-sm text-gray-300 mb-1">Comentários:</p>
                            <p class="text-sm text-white">${evaluation.comments}</p>
                        </div>
                    ` : ''}
                    
                    <div class="flex justify-end space-x-2">
                        <button onclick="therapyHistory.viewEvaluation(${evaluation.id})" 
                                class="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded transition">
                            Ver Detalhes
                        </button>
                        <button onclick="therapyHistory.editEvaluation(${evaluation.id})" 
                                class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition">
                            Editar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // UI Methods
    viewEvaluation(evaluationId) {
        const evaluation = this.evaluations.find(e => e.id === evaluationId);
        if (!evaluation) return;

        const modal = this.createEvaluationModal(evaluation);
        document.body.appendChild(modal);
    }

    evaluateSession(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) return;

        const existingEvaluation = this.evaluations.find(e => e.sessionId === sessionId);
        const modal = this.createEvaluationModal(existingEvaluation, session);
        document.body.appendChild(modal);
    }

    editEvaluation(evaluationId) {
        this.evaluateSession(evaluationId);
    }

    createEvaluationModal(evaluation = null, session = null) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white border-opacity-20">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-white">
                        ${evaluation ? 'Editar' : 'Nova'} Avaliação Terapêutica
                    </h3>
                    <button onclick="this.closest('.fixed').remove()" 
                            class="text-gray-400 hover:text-white transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                ${session ? `
                    <div class="mb-4 p-3 bg-white bg-opacity-10 rounded-lg">
                        <p class="text-sm text-gray-300">Sessão: <span class="text-white font-semibold">${session.type}</span></p>
                        <p class="text-sm text-gray-300">Data: <span class="text-white">${this.formatDate(session.date)}</span></p>
                    </div>
                ` : ''}
                
                <form id="evaluation-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">
                                Bem-estar Geral (1-10)
                            </label>
                            <input type="range" min="1" max="10" value="${evaluation?.overallWellbeing || 7}" 
                                   class="w-full" id="overallWellbeing">
                            <div class="text-center text-white font-bold" id="overallWellbeing-value">
                                ${evaluation?.overallWellbeing || 7}
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">
                                Estado Emocional (1-10)
                            </label>
                            <input type="range" min="1" max="10" value="${evaluation?.emotionalState || 7}" 
                                   class="w-full" id="emotionalState">
                            <div class="text-center text-white font-bold" id="emotionalState-value">
                                ${evaluation?.emotionalState || 7}
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">
                                Nível de Energia (1-10)
                            </label>
                            <input type="range" min="1" max="10" value="${evaluation?.energyLevel || 7}" 
                                   class="w-full" id="energyLevel">
                            <div class="text-center text-white font-bold" id="energyLevel-value">
                                ${evaluation?.energyLevel || 7}
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">
                                Qualidade do Sono (1-10)
                            </label>
                            <input type="range" min="1" max="10" value="${evaluation?.sleepQuality || 7}" 
                                   class="w-full" id="sleepQuality">
                            <div class="text-center text-white font-bold" id="sleepQuality-value">
                                ${evaluation?.sleepQuality || 7}
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">
                                Nível de Estresse (1-10)
                            </label>
                            <input type="range" min="1" max="10" value="${evaluation?.stressLevel || 3}" 
                                   class="w-full" id="stressLevel">
                            <div class="text-center text-white font-bold" id="stressLevel-value">
                                ${evaluation?.stressLevel || 3}
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">
                                Clareza Mental (1-10)
                            </label>
                            <input type="range" min="1" max="10" value="${evaluation?.mentalClarity || 7}" 
                                   class="w-full" id="mentalClarity">
                            <div class="text-center text-white font-bold" id="mentalClarity-value">
                                ${evaluation?.mentalClarity || 7}
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-white mb-2">
                                Conexão Espiritual (1-10)
                            </label>
                            <input type="range" min="1" max="10" value="${evaluation?.spiritualConnection || 8}" 
                                   class="w-full" id="spiritualConnection">
                            <div class="text-center text-white font-bold" id="spiritualConnection-value">
                                ${evaluation?.spiritualConnection || 8}
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-white mb-2">
                            Comentários sobre a sessão
                        </label>
                        <textarea rows="3" class="form-input w-full" id="comments" 
                                  placeholder="Como você se sentiu durante e após a sessão?">${evaluation?.comments || ''}</textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-white mb-2">
                            Melhorias percebidas
                        </label>
                        <input type="text" class="form-input w-full" id="improvements" 
                               placeholder="Ex: Mais calma, melhor sono, clareza mental" 
                               value="${evaluation?.improvements?.join(', ') || ''}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-white mb-2">
                            Desafios atuais
                        </label>
                        <input type="text" class="form-input w-full" id="challenges" 
                               placeholder="Ex: Ansiedade, dificuldade de concentração" 
                               value="${evaluation?.challenges?.join(', ') || ''}">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-white mb-2">
                            Metas para próximos atendimentos
                        </label>
                        <input type="text" class="form-input w-full" id="goals" 
                               placeholder="Ex: Meditar diariamente, praticar gratidão" 
                               value="${evaluation?.goals?.join(', ') || ''}">
                    </div>
                    
                    <div class="flex justify-end space-x-4">
                        <button type="button" onclick="this.closest('.fixed').remove()" 
                                class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
                            Cancelar
                        </button>
                        <button type="submit" class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition">
                            ${evaluation ? 'Atualizar' : 'Salvar'} Avaliação
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Setup form handlers
        const form = modal.querySelector('#evaluation-form');
        const sliders = modal.querySelectorAll('input[type="range"]');
        
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueDisplay = document.getElementById(`${e.target.id}-value`);
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEvaluationSubmit(e, evaluation, session);
        });

        return modal;
    }

    handleEvaluationSubmit(event, existingEvaluation, session) {
        const formData = new FormData(event.target);
        
        const evaluationData = {
            sessionId: session?.id || existingEvaluation?.sessionId,
            overallWellbeing: parseInt(document.getElementById('overallWellbeing').value),
            emotionalState: parseInt(document.getElementById('emotionalState').value),
            energyLevel: parseInt(document.getElementById('energyLevel').value),
            sleepQuality: parseInt(document.getElementById('sleepQuality').value),
            stressLevel: parseInt(document.getElementById('stressLevel').value),
            physicalSymptoms: 0, // Can be added later
            mentalClarity: parseInt(document.getElementById('mentalClarity').value),
            spiritualConnection: parseInt(document.getElementById('spiritualConnection').value),
            comments: document.getElementById('comments').value,
            improvements: document.getElementById('improvements').value.split(',').map(i => i.trim()).filter(i => i),
            challenges: document.getElementById('challenges').value.split(',').map(i => i.trim()).filter(i => i),
            goals: document.getElementById('goals').value.split(',').map(i => i.trim()).filter(i => i)
        };

        if (existingEvaluation) {
            // Update existing evaluation
            const index = this.evaluations.findIndex(e => e.id === existingEvaluation.id);
            this.evaluations[index] = { ...existingEvaluation, ...evaluationData };
        } else {
            // Add new evaluation
            this.addEvaluation(evaluationData);
        }

        this.saveEvaluations();
        this.renderSessionHistory();
        this.renderEvaluations();
        this.updateStatistics();
        this.updateProgressCharts();

        // Close modal
        event.target.closest('.fixed').remove();

        // Show success message
        this.showNotification('Avaliação salva com sucesso!', 'success');
    }

    // Statistics and Charts
    updateStatistics() {
        this.updateSessionStats();
        this.updateEvaluationStats();
    }

    updateSessionStats() {
        const totalSessions = this.sessions.length;
        const completedSessions = this.sessions.filter(s => s.status === 'completed').length;
        const evaluatedSessions = this.sessions.filter(s => 
            this.evaluations.find(e => e.sessionId === s.id)
        ).length;

        const sessionCountEl = document.getElementById('session-count');
        if (sessionCountEl) {
            sessionCountEl.textContent = totalSessions;
        }
    }

    updateEvaluationStats() {
        const avgScore = this.calculateAverageScore();
        const progressEl = document.getElementById('progress-percentage');
        const progressBar = document.getElementById('progress-bar');

        if (progressEl) {
            progressEl.textContent = `${Math.round(avgScore * 10)}%`;
        }
        if (progressBar) {
            progressBar.style.width = `${avgScore * 10}%`;
        }
    }

    updateProgressCharts() {
        // This would update charts if Chart.js or similar is implemented
        console.log('Charts would be updated here');
    }

    // Utility Methods
    calculateOverallScore(evaluation) {
        const scores = [
            evaluation.overallWellbeing,
            evaluation.emotionalState,
            evaluation.energyLevel,
            evaluation.sleepQuality,
            (10 - evaluation.stressLevel), // Invert stress level
            evaluation.mentalClarity,
            evaluation.spiritualConnection
        ];
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    calculateAverageScore() {
        if (this.evaluations.length === 0) return 0;
        const totalScore = this.evaluations.reduce((sum, eval) => 
            sum + this.calculateOverallScore(eval), 0
        );
        return totalScore / this.evaluations.length / 10; // Convert to 0-1 scale
    }

    getScoreColor(score) {
        if (score >= 8) return 'text-green-400';
        if (score >= 6) return 'text-yellow-400';
        return 'text-red-400';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    getStatusText(status) {
        const statusMap = {
            'completed': 'Concluída',
            'cancelled': 'Cancelada',
            'pending': 'Pendente'
        };
        return statusMap[status] || status;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 ${
            type === 'success' ? 'bg-green-600' : 
            type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    setupEventListeners() {
        // Event listeners can be setup here if needed
    }
}

// Initialize the therapy history manager
let therapyHistory;
document.addEventListener('DOMContentLoaded', () => {
    therapyHistory = new TherapyHistoryManager();
});

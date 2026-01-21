// Therapy Evolution Charts
class TherapyCharts {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.setupCharts();
        this.updateCharts();
    }

    setupCharts() {
        this.setupEvolutionChart();
        this.setupCategoryRadarChart();
        this.setupProgressChart();
    }

    setupEvolutionChart() {
        const ctx = document.getElementById('evolution-chart');
        if (!ctx) return;

        const evaluations = this.getEvaluationsData();
        const labels = evaluations.map(e => this.formatDate(e.date));
        const datasets = this.createEvolutionDatasets(evaluations);

        this.charts.evolution = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }

    setupCategoryRadarChart() {
        const ctx = document.getElementById('category-radar-chart');
        if (!ctx) return;

        const latestEvaluation = this.getLatestEvaluation();
        if (!latestEvaluation) return;

        const data = {
            labels: ['Bem-estar', 'Emocional', 'Energia', 'Sono', 'Clareza', 'Espiritual'],
            datasets: [{
                label: 'Avaliação Atual',
                data: [
                    latestEvaluation.overallWellbeing,
                    latestEvaluation.emotionalState,
                    latestEvaluation.energyLevel,
                    latestEvaluation.sleepQuality,
                    latestEvaluation.mentalClarity,
                    latestEvaluation.spiritualConnection
                ],
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                borderColor: 'rgba(147, 51, 234, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(147, 51, 234, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(147, 51, 234, 1)'
            }]
        };

        this.charts.radar = new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            color: '#ffffff'
                        },
                        ticks: {
                            color: '#ffffff',
                            backdropColor: 'transparent'
                        }
                    }
                }
            }
        });
    }

    setupProgressChart() {
        const ctx = document.getElementById('progress-distribution-chart');
        if (!ctx) return;

        const evaluations = this.getEvaluationsData();
        const distribution = this.calculateProgressDistribution(evaluations);

        this.charts.progress = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Excelente (8-10)', 'Bom (6-7)', 'Regular (4-5)', 'Precisa Melhorar (1-3)'],
                datasets: [{
                    data: distribution,
                    backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgba(34, 197, 94, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(251, 191, 36, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }
                }
            }
        });
    }

    createEvolutionDatasets(evaluations) {
        const colors = {
            overall: { border: 'rgba(147, 51, 234, 1)', bg: 'rgba(147, 51, 234, 0.1)' },
            emotional: { border: 'rgba(236, 72, 153, 1)', bg: 'rgba(236, 72, 153, 0.1)' },
            energy: { border: 'rgba(34, 197, 94, 1)', bg: 'rgba(34, 197, 94, 0.1)' },
            clarity: { border: 'rgba(59, 130, 246, 1)', bg: 'rgba(59, 130, 246, 0.1)' },
            spiritual: { border: 'rgba(168, 85, 247, 1)', bg: 'rgba(168, 85, 247, 0.1)' }
        };

        return [
            {
                label: 'Bem-estar Geral',
                data: evaluations.map(e => e.overallWellbeing),
                borderColor: colors.overall.border,
                backgroundColor: colors.overall.bg,
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Estado Emocional',
                data: evaluations.map(e => e.emotionalState),
                borderColor: colors.emotional.border,
                backgroundColor: colors.emotional.bg,
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Nível de Energia',
                data: evaluations.map(e => e.energyLevel),
                borderColor: colors.energy.border,
                backgroundColor: colors.energy.bg,
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Clareza Mental',
                data: evaluations.map(e => e.mentalClarity),
                borderColor: colors.clarity.border,
                backgroundColor: colors.clarity.bg,
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Conexão Espiritual',
                data: evaluations.map(e => e.spiritualConnection),
                borderColor: colors.spiritual.border,
                backgroundColor: colors.spiritual.bg,
                borderWidth: 2,
                tension: 0.4
            }
        ];
    }

    updateCharts() {
        this.updateStatistics();
        this.updateGoals();
        this.calculateImprovementRate();
        this.calculateConsistencyRate();
    }

    updateStatistics() {
        const evaluations = this.getEvaluationsData();
        if (evaluations.length === 0) return;

        const averages = this.calculateAverages(evaluations);
        
        this.updateElement('avg-wellbeing', averages.overallWellbeing);
        this.updateElement('avg-energy', averages.energyLevel);
        this.updateElement('avg-clarity', averages.mentalClarity);
        this.updateElement('avg-spiritual', averages.spiritualConnection);
        this.updateElement('evaluation-count', evaluations.length);
    }

    updateGoals() {
        const evaluations = this.getEvaluationsData();
        const goalsContainer = document.getElementById('goals-container');
        if (!goalsContainer || evaluations.length === 0) return;

        const allGoals = [];
        evaluations.forEach(evaluation => {
            if (evaluation.goals) {
                allGoals.push(...evaluation.goals);
            }
        });

        const goalFrequency = this.calculateGoalFrequency(allGoals);
        const topGoals = Object.entries(goalFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        goalsContainer.innerHTML = topGoals.map(([goal, frequency]) => `
            <div class="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <i class="fas fa-target text-white text-sm"></i>
                    </div>
                    <div>
                        <p class="text-white font-medium">${goal}</p>
                        <p class="text-xs text-gray-300">Mencionado ${frequency} vezes</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-300">Progresso</div>
                    <div class="w-20 bg-white bg-opacity-20 rounded-full h-2 mt-1">
                        <div class="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full" 
                             style="width: ${Math.min(frequency * 20, 100)}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    calculateImprovementRate() {
        const evaluations = this.getEvaluationsData();
        if (evaluations.length < 2) return;

        const first = evaluations[0];
        const last = evaluations[evaluations.length - 1];
        
        const firstScore = this.calculateOverallScore(first);
        const lastScore = this.calculateOverallScore(last);
        
        const improvement = ((lastScore - firstScore) / firstScore) * 100;
        
        this.updateElement('improvement-rate', `${improvement > 0 ? '+' : ''}${improvement.toFixed(1)}%`);
    }

    calculateConsistencyRate() {
        const evaluations = this.getEvaluationsData();
        if (evaluations.length === 0) return;

        const scores = evaluations.map(e => this.calculateOverallScore(e));
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
        const consistency = Math.max(0, 100 - (variance / average) * 100);
        
        this.updateElement('consistency-rate', `${consistency.toFixed(1)}%`);
    }

    // Utility Methods
    getEvaluationsData() {
        if (window.therapyHistory) {
            return window.therapyHistory.evaluations;
        }
        
        const stored = localStorage.getItem('therapy_evaluations');
        return stored ? JSON.parse(stored) : [];
    }

    getLatestEvaluation() {
        const evaluations = this.getEvaluationsData();
        if (evaluations.length === 0) return null;
        
        return evaluations.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    }

    calculateOverallScore(evaluation) {
        const scores = [
            evaluation.overallWellbeing,
            evaluation.emotionalState,
            evaluation.energyLevel,
            evaluation.sleepQuality,
            (10 - evaluation.stressLevel),
            evaluation.mentalClarity,
            evaluation.spiritualConnection
        ];
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    calculateAverages(evaluations) {
        const totals = {
            overallWellbeing: 0,
            emotionalState: 0,
            energyLevel: 0,
            sleepQuality: 0,
            stressLevel: 0,
            mentalClarity: 0,
            spiritualConnection: 0
        };

        evaluations.forEach(evaluation => {
            Object.keys(totals).forEach(key => {
                totals[key] += evaluation[key] || 0;
            });
        });

        const count = evaluations.length;
        Object.keys(totals).forEach(key => {
            totals[key] = Math.round(totals[key] / count);
        });

        return totals;
    }

    calculateProgressDistribution(evaluations) {
        const distribution = [0, 0, 0, 0]; // excellent, good, regular, poor
        
        evaluations.forEach(evaluation => {
            const score = this.calculateOverallScore(evaluation);
            if (score >= 8) distribution[0]++;
            else if (score >= 6) distribution[1]++;
            else if (score >= 4) distribution[2]++;
            else distribution[3]++;
        });

        return distribution;
    }

    calculateGoalFrequency(goals) {
        const frequency = {};
        goals.forEach(goal => {
            const normalizedGoal = goal.toLowerCase().trim();
            frequency[normalizedGoal] = (frequency[normalizedGoal] || 0) + 1;
        });
        return frequency;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        });
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Public Methods
    refresh() {
        if (this.charts.evolution) {
            this.charts.evolution.destroy();
        }
        if (this.charts.radar) {
            this.charts.radar.destroy();
        }
        if (this.charts.progress) {
            this.charts.progress.destroy();
        }
        
        this.setupCharts();
        this.updateCharts();
    }
}

// Initialize charts when DOM is ready
let therapyCharts;
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for therapy history to load
    setTimeout(() => {
        therapyCharts = new TherapyCharts();
    }, 100);
});

// Make charts globally accessible
window.therapyCharts = therapyCharts;

/* ========================================
   BERHU MODAL SYSTEM - JAVASCRIPT
   Versão 2.0 - Refeito do Zero
   ======================================== */

class BerhuModalSystem {
    constructor() {
        this.activeModal = null;
        this.modalStack = [];
        this.init();
    }

    init() {
        // Adicionar estilos CSS ao head se ainda não existirem
        this.ensureStyles();
        
        // Previnir scroll do body quando modal estiver aberto
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });
    }

    ensureStyles() {
        if (!document.querySelector('#berhu-modal-styles')) {
            const link = document.createElement('link');
            link.id = 'berhu-modal-styles';
            link.rel = 'stylesheet';
            link.href = 'assets/css/modals.css';
            document.head.appendChild(link);
        }
    }

    createModal(options = {}) {
        const {
            title = 'Modal',
            content = '',
            size = 'medium',
            showClose = true,
            closeOnOverlay = true,
            footer = null
        } = options;

        // Criar overlay
        const overlay = document.createElement('div');
        overlay.className = 'berhu-modal-overlay';
        
        // Criar modal container
        const modal = document.createElement('div');
        modal.className = `berhu-modal berhu-modal-${size}`;
        
        // Criar header
        const header = document.createElement('div');
        header.className = 'berhu-modal-header';
        header.innerHTML = `
            <h3 class="berhu-modal-title">${title}</h3>
            ${showClose ? '<button class="berhu-modal-close" aria-label="Fechar">×</button>' : ''}
        `;
        
        // Criar body
        const body = document.createElement('div');
        body.className = 'berhu-modal-body';
        if (typeof content === 'string') {
            body.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            body.appendChild(content);
        }
        
        // Montar modal
        modal.appendChild(header);
        modal.appendChild(body);
        
        // Adicionar footer se existir
        if (footer) {
            const footerElement = document.createElement('div');
            footerElement.className = 'berhu-modal-footer';
            footerElement.innerHTML = footer;
            modal.appendChild(footerElement);
        }
        
        // Adicionar ao overlay
        overlay.appendChild(modal);
        
        // Event listeners
        if (showClose) {
            const closeBtn = header.querySelector('.berhu-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeModal());
            }
        }
        
        if (closeOnOverlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeModal();
                }
            });
        }
        
        return overlay;
    }

    openModal(options = {}) {
        // Fechar modal existente
        if (this.activeModal) {
            this.closeModal(false);
        }
        
        // Criar novo modal
        const modal = this.createModal(options);
        
        // Adicionar ao DOM
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Ativar com delay para animação
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Guardar referência
        this.activeModal = modal;
        this.modalStack.push(modal);
        
        return modal;
    }

    closeModal(animate = true) {
        if (!this.activeModal) return;
        
        const modal = this.activeModal;
        
        if (animate) {
            modal.classList.remove('active');
            
            // Remover do DOM após animação
            setTimeout(() => {
                this.removeModal(modal);
            }, 300);
        } else {
            this.removeModal(modal);
        }
        
        // Restaurar scroll
        document.body.style.overflow = '';
        
        // Limpar referências
        this.activeModal = null;
        this.modalStack = this.modalStack.filter(m => m !== modal);
    }

    removeModal(modal) {
        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }

    closeAllModals() {
        while (this.activeModal) {
            this.closeModal(false);
        }
    }
}

// Instância global do sistema de modais
window.BerhuModal = new BerhuModalSystem();

/* ========================================
   MODAL TEMPLATES ESPECÍFICOS
   ======================================== */

// Modal de Agendamento de Sessão
window.BerhuModalTemplates = {
    scheduleSession: function() {
        const patients = window.patientsData || [];
        
        const content = `
            <form id="berhu-schedule-form" class="berhu-form">
                <div class="berhu-grid berhu-grid-2">
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Paciente *</label>
                        <select class="berhu-form-select" name="patient" required>
                            <option value="">Selecione...</option>
                            ${patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Tipo de Sessão *</label>
                        <select class="berhu-form-select" name="type" required>
                            <option value="">Selecione...</option>
                            <option value="Limpeza Áurica">Limpeza Áurica</option>
                            <option value="Reiki">Reiki</option>
                            <option value="Meditação Chakras">Meditação Chakras</option>
                            <option value="Meditação Mindfulness">Meditação Mindfulness</option>
                            <option value="Meditação Curativa">Meditação Curativa</option>
                            <option value="Leitura de Aura">Leitura de Aura</option>
                            <option value="Cristais">Cristais</option>
                            <option value="Astrologia Terapêutica">Astrologia Terapêutica</option>
                        </select>
                    </div>
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Data *</label>
                        <input type="date" class="berhu-form-input" name="date" required>
                    </div>
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Horário *</label>
                        <input type="time" class="berhu-form-input" name="time" required>
                    </div>
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Duração (minutos) *</label>
                        <input type="number" class="berhu-form-input" name="duration" min="30" max="180" value="60" required>
                    </div>
                </div>
                <div class="berhu-form-group">
                    <label class="berhu-form-label">Observações</label>
                    <textarea class="berhu-form-textarea" name="notes" rows="3" placeholder="Observações sobre a sessão..."></textarea>
                </div>
            </form>
        `;
        
        const footer = `
            <button type="button" class="berhu-btn berhu-btn-secondary" onclick="BerhuModal.closeModal()">Cancelar</button>
            <button type="button" class="berhu-btn berhu-btn-primary" onclick="BerhuModalTemplates.saveSchedule()">
                <i class="fas fa-calendar-check"></i>
                Agendar Sessão
            </button>
        `;
        
        return {
            title: 'Agendar Nova Sessão',
            content: content,
            size: 'medium',
            footer: footer
        };
    },

    newPatient: function() {
        const content = `
            <form id="berhu-new-patient-form" class="berhu-form">
                <div class="berhu-grid berhu-grid-2">
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Nome Completo *</label>
                        <input type="text" class="berhu-form-input" name="name" required>
                    </div>
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Email *</label>
                        <input type="email" class="berhu-form-input" name="email" required>
                    </div>
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Telefone *</label>
                        <input type="tel" class="berhu-form-input" name="phone" required>
                    </div>
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Data de Nascimento *</label>
                        <input type="date" class="berhu-form-input" name="birthDate" required>
                    </div>
                </div>
                <div class="berhu-form-group">
                    <label class="berhu-form-label">Diagnóstico Energético *</label>
                    <input type="text" class="berhu-form-input" name="diagnosis" placeholder="Ex: Desequilíbrio Energético e Bloqueio Emocional" required>
                </div>
                <div class="berhu-form-group">
                    <label class="berhu-form-label">Sintomas Energéticos</label>
                    <textarea class="berhu-form-textarea" name="symptoms" rows="3" placeholder="Separe os sintomas com vírgula..."></textarea>
                </div>
                <div class="berhu-grid berhu-grid-2">
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Nível de Risco *</label>
                        <select class="berhu-form-select" name="riskLevel" required>
                            <option value="">Selecione...</option>
                            <option value="Baixo">Baixo</option>
                            <option value="Moderado">Moderado</option>
                            <option value="Alto">Alto</option>
                        </select>
                    </div>
                    <div class="berhu-form-group">
                        <label class="berhu-form-label">Perfil Energético</label>
                        <input type="text" class="berhu-form-input" name="energeticProfile" placeholder="Descrição do perfil energético...">
                    </div>
                </div>
            </form>
        `;
        
        const footer = `
            <button type="button" class="berhu-btn berhu-btn-secondary" onclick="BerhuModal.closeModal()">Cancelar</button>
            <button type="button" class="berhu-btn berhu-btn-primary" onclick="BerhuModalTemplates.savePatient()">
                <i class="fas fa-save"></i>
                Salvar Paciente
            </button>
        `;
        
        return {
            title: 'Adicionar Novo Paciente',
            content: content,
            size: 'large',
            footer: footer
        };
    },

    reports: function() {
        const patients = window.patientsData || [];
        
        const content = `
            <div class="berhu-grid berhu-grid-2">
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 0.5rem;">
                    <h4 style="color: #a78bfa; margin-bottom: 1rem; font-size: 1.125rem;">Estatísticas de Pacientes</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Total de Pacientes:</span>
                            <strong>${patients.length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Pacientes Ativos:</span>
                            <strong style="color: #10b981;">${patients.filter(p => p.status === 'active').length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Alto Risco:</span>
                            <strong style="color: #ef4444;">${patients.filter(p => p.riskLevel === 'Alto').length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Baixo Risco:</span>
                            <strong style="color: #3b82f6;">${patients.filter(p => p.riskLevel === 'Baixo').length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Médio Risco:</span>
                            <strong style="color: #f59e0b;">${patients.filter(p => p.riskLevel === 'Moderado').length}</strong>
                        </div>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 0.5rem;">
                    <h4 style="color: #10b981; margin-bottom: 1rem; font-size: 1.125rem;">Estatísticas de Tratamentos</h4>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Limpeza Áurica:</span>
                            <strong>${patients.filter(p => p.treatments && p.treatments.includes('Limpeza Áurica')).length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Reiki:</span>
                            <strong>${patients.filter(p => p.treatments && p.treatments.includes('Reiki')).length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Meditação:</span>
                            <strong>${patients.filter(p => p.treatments && p.treatments.some(t => t.includes('Meditação'))).length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Cristais:</span>
                            <strong>${patients.filter(p => p.treatments && p.treatments.includes('Cristais')).length}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: rgba(255,255,255,0.7);">Leitura de Aura:</span>
                            <strong>${patients.filter(p => p.treatments && p.treatments.includes('Leitura de Aura')).length}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const footer = `
            <button type="button" class="berhu-btn berhu-btn-secondary" onclick="BerhuModal.closeModal()">Fechar</button>
        `;
        
        return {
            title: 'Relatórios Clínicos',
            content: content,
            size: 'large',
            footer: footer
        };
    },

    // Funções de salvamento
    saveSchedule: function() {
        const form = document.getElementById('berhu-schedule-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validação básica
        if (!data.patient || !data.type || !data.date || !data.time || !data.duration) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Encontrar paciente
        const patient = window.patientsData.find(p => p.id == data.patient);
        if (!patient) {
            this.showNotification('Paciente não encontrado', 'error');
            return;
        }
        
        // Criar agendamento
        const schedule = {
            id: Date.now(),
            patientId: parseInt(data.patient),
            patientName: patient.name,
            type: data.type,
            date: data.date,
            time: data.time,
            duration: parseInt(data.duration),
            notes: data.notes || '',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };
        
        // Salvar no localStorage
        const schedules = JSON.parse(localStorage.getItem('berhu_schedules') || '[]');
        schedules.push(schedule);
        localStorage.setItem('berhu_schedules', JSON.stringify(schedules));
        
        // Atualizar paciente
        patient.nextSession = data.date;
        
        // Fechar modal
        BerhuModal.closeModal();
        
        // Sucesso
        this.showNotification('Sessão agendada com sucesso!', 'success');
        
        // Recarregar sessões se existir a função
        if (typeof loadScheduledSessions === 'function') {
            loadScheduledSessions();
        }
    },

    savePatient: function() {
        const form = document.getElementById('berhu-new-patient-form');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validação básica
        const requiredFields = ['name', 'email', 'phone', 'birthDate', 'diagnosis', 'riskLevel'];
        const missing = requiredFields.filter(field => !data[field]);
        
        if (missing.length > 0) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Criar paciente
        const newPatient = {
            id: Date.now(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            birthDate: data.birthDate,
            diagnosis: data.diagnosis,
            symptoms: data.symptoms ? data.symptoms.split(',').map(s => s.trim()).filter(s => s) : ['A ser avaliado'],
            riskLevel: data.riskLevel,
            lastSession: new Date().toISOString().split('T')[0],
            nextSession: '',
            status: 'active',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            treatments: ['Avaliação inicial'],
            evolution: 'Paciente em início de tratamento',
            energeticProfile: data.energeticProfile || 'A ser avaliado',
            crisisHistory: 'Sem histórico de crises',
            totalSessions: 0
        };
        
        // Adicionar aos dados
        if (!window.patientsData) window.patientsData = [];
        window.patientsData.push(newPatient);
        
        // Fechar modal
        BerhuModal.closeModal();
        
        // Sucesso
        this.showNotification('Paciente adicionado com sucesso!', 'success');
        
        // Recarregar lista se existir a função
        if (typeof renderPatientsList === 'function') {
            renderPatientsList(window.patientsData);
        }
    },

    showNotification: function(message, type = 'info') {
        // Remover notificação existente
        const existing = document.querySelector('.berhu-notification');
        if (existing) {
            existing.remove();
        }
        
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `berhu-notification berhu-notification-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer;">×</button>
            </div>
        `;
        
        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 1rem;
            border-radius: 0.5rem;
            z-index: 1000000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Cor baseada no tipo
        const colors = {
            success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.style.color = 'white';
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remover
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
};

/* ========================================
   FUNÇÕES DE COMPATIBILIDADE (LEGACY)
   ======================================== */

// Manter compatibilidade com código antigo
window.showScheduleModal = function() {
    const template = BerhuModalTemplates.scheduleSession();
    BerhuModal.openModal(template);
};

window.showNewPatientModal = function() {
    const template = BerhuModalTemplates.newPatient();
    BerhuModal.openModal(template);
};

window.showReportsModal = function() {
    const template = BerhuModalTemplates.reports();
    BerhuModal.openModal(template);
};

window.showModal = function(title, content) {
    BerhuModal.openModal({
        title: title,
        content: content,
        size: 'medium'
    });
};

// Inicialização
console.log('✅ Berhu Modal System 2.0 carregado com sucesso');

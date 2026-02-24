// Clinical Admin Panel JavaScript for Berhu Platform

// Global Variables
let currentPatient = null;
let patientsData = [];
let evaluationsData = [];

// Make patientsData globally accessible
window.patientsData = patientsData;

// Initialize Application
function initializeApp() {
    checkSession();
    setupEventListeners();
    loadPatients();
    loadHighRiskPatients();
    loadPendingEvaluations();
    loadRecentActivities();
    loadScheduledSessions(); // Load scheduled sessions on initialization
    setupEvaluationForm();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Check Session
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
        
        // Check if user is admin
        const isAdmin = window.currentUser.email === 'admin@berhu.com' || 
                      window.currentUser.plan === 'admin';
        
        if (!isAdmin) {
            showNotification('Acesso restrito a administradores clínicos', 'error');
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
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Patient search and filter
    document.getElementById('patient-search').addEventListener('input', filterPatients);
    document.getElementById('patient-filter').addEventListener('change', filterPatients);
}

// Logout Function
function logout() {
    // Clear session
    localStorage.removeItem('berhu_session');
    sessionStorage.removeItem('berhu_session');
    
    // Clear global variables
    window.currentUser = null;
    window.sessionData = null;
    
    // Redirect to login
    window.location.href = 'auth.html';
}

// Load Patients
function loadPatients() {
    // Mock patients data with spiritual/energetic approach
    patientsData = [
        {
            id: 1,
            name: 'Usuária Demo',
            email: 'demo@berhu.com',
            phone: '(11) 98765-4321',
            birthDate: '1990-05-15',
            diagnosis: 'Desequilíbrio Energético e Bloqueio Emocional',
            symptoms: ['Ansiedade energética', 'Chakras bloqueados', 'Aura densa', 'Estresse espiritual'],
            riskLevel: 'Baixo',
            lastSession: '2024-01-15',
            nextSession: '2024-01-22',
            status: 'active',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            treatments: ['Limpeza Áurica', 'Reiki', 'Meditação Chakras'],
            evolution: 'Boa resposta aos tratamentos energéticos. Aura mais limpa e chakras alinhados.',
            energeticProfile: 'Sensitiva com forte intuição, canal de energia aberto',
            crisisHistory: 'Sem crises energéticas recentes. Campo áurico estável.',
            totalSessions: 12
        },
        {
            id: 2,
            name: 'Maria Client',
            email: 'maria@berhu.com',
            phone: '(11) 91234-5678',
            birthDate: '1985-08-22',
            diagnosis: 'Luto Energético e Desconexão Espiritual',
            symptoms: ['Energia pesada', 'Desconexão espiritual', 'Chakra cardíaco fechado', 'Baixa vibração'],
            riskLevel: 'Moderado',
            lastSession: '2024-01-14',
            nextSession: '2024-01-21',
            status: 'active',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            treatments: ['Leitura de Aura', 'Meditação Curativa', 'Cristais'],
            evolution: 'Resposta moderada. Chakra cardíaco começando a abrir, mas ainda com bloqueios.',
            energeticProfile: 'Alma sensível com necessidade de cura emocional profunda',
            crisisHistory: 'Crise espiritual há 3 meses. Processo de reconexão em andamento.',
            totalSessions: 8
        },
        {
            id: 3,
            name: 'Ana Santos',
            email: 'ana@berhu.com',
            phone: '(11) 97654-3210',
            birthDate: '1992-12-10',
            diagnosis: 'Instabilidade Energética Severa',
            symptoms: ['Flutuações energéticas', 'Aura fragmentada', 'Chakras desalinhados', 'Sensibilidade extrema'],
            riskLevel: 'Alto',
            lastSession: '2024-01-12',
            nextSession: '2024-01-19',
            status: 'active',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            treatments: ['Limpeza Áurica Profunda', 'Reiki avançado', 'Astrologia Terapêutica'],
            evolution: 'Resposta lenta. Campo energético instável, mas com momentos de clareza.',
            energeticProfile: 'Canal energético muito aberto, sensitividade elevada, alma antiga',
            crisisHistory: 'Múltiplas crises energéticas. Necessita acompanhamento frequente.',
            totalSessions: 24
        },
        {
            id: 4,
            name: 'João Silva',
            email: 'joao@berhu.com',
            phone: '(11) 99876-5432',
            birthDate: '1988-03-25',
            diagnosis: 'Esgotamento Energético (Burnout Espiritual)',
            symptoms: ['Aura esgotada', 'Chakras enfraquecidos', 'Fadiga energética', 'Desconexão'],
            riskLevel: 'Baixo',
            lastSession: '2024-01-13',
            nextSession: '2024-01-20',
            status: 'active',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            treatments: ['Reiki', 'Meditação Mindfulness', 'Cristais energéticos'],
            evolution: 'Excelente resposta. Campo energético revitalizado após 2 sessões.',
            energeticProfile: 'Guia espiritual em desenvolvimento, canal de energia em expansão',
            crisisHistory: 'Sem crises energéticas. Campo estável e fortalecido.',
            totalSessions: 6
        },
        {
            id: 5,
            name: 'Carlos Oliveira',
            email: 'carlos@berhu.com',
            phone: '(11) 92345-6789',
            birthDate: '1980-07-18',
            diagnosis: 'Obsessão Energética e Padrões Densos',
            symptoms: ['Energias densas', 'Padrões repetitivos', 'Medo energético', 'Bloqueios mentais'],
            riskLevel: 'Moderado',
            lastSession: '2024-01-11',
            nextSession: 'A ser reagendado',
            status: 'cancelled',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            treatments: ['Limpeza Áurica intensiva', 'Cristais de proteção', 'Astrologia cármica'],
            evolution: 'Resposta parcial. Padrões densos reduzidos, mas ainda presentes.',
            energeticProfile: 'Alma em processo de liberação, necessita proteção energética',
            crisisHistory: 'Crises de medo energético. Processo de limpeza em andamento.',
            totalSessions: 15
        }
    ];
    
    renderPatientsList(window.patientsData);
}

// Render Patients List
function renderPatientsList(patients) {
    const patientsList = document.getElementById('patients-list');
    
    if (!patients || patients.length === 0) {
        patientsList.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                Nenhum paciente encontrado
            </div>
        `;
        return;
    }
    
    console.log('🎨 Renderizando pacientes com histórico...');
    
    patientsList.innerHTML = patients.map(patient => {
        // Buscar histórico de sessões do paciente
        const allSessions = JSON.parse(localStorage.getItem('berhu_all_sessions') || '[]');
        const patientSessions = allSessions.filter(session => session.patientId === patient.id);
        
        console.log(`📊 Paciente ${patient.name}: ${patientSessions.length} sessões`);
        
        // Estatísticas do paciente
        const totalSessions = patientSessions.length;
        const completedSessions = patientSessions.filter(s => s.status === 'completed').length;
        const lastSession = patientSessions
            .filter(s => s.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        
        // Próxima sessão agendada
        const nextSession = patientSessions
            .filter(s => s.status === 'scheduled')
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        
        return `
            <div class="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 cursor-pointer transition"
                 onclick="selectPatient(${patient.id})">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">${patient.name.charAt(0)}</span>
                        </div>
                        <div>
                            <div class="font-medium">${patient.name}</div>
                            <div class="text-sm text-gray-400">${patient.diagnosis}</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(patient.riskLevel)}">
                            ${patient.riskLevel}
                        </span>
                        <div class="text-xs text-gray-400 mt-1">Última: ${formatDate(patient.lastSession)}</div>
                    </div>
                </div>
                
                <!-- Histórico Resumido -->
                <div class="bg-black bg-opacity-20 rounded-lg p-3 mt-3">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-sm font-medium text-purple-300">
                            <i class="fas fa-history mr-1"></i>Histórico de Atendimentos
                        </h4>
                        <span class="text-xs text-gray-400">${totalSessions} sessões</span>
                    </div>
                    
                    ${totalSessions > 0 ? `
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div class="text-center">
                                <div class="text-lg font-bold text-green-400">${completedSessions}</div>
                                <div class="text-gray-400">Concluídas</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-bold text-blue-400">${totalSessions - completedSessions}</div>
                                <div class="text-gray-400">Pendentes</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-bold text-purple-400">${Math.round((completedSessions / totalSessions) * 100)}%</div>
                                <div class="text-gray-400">Conclusão</div>
                            </div>
                        </div>
                        
                        ${lastSession ? `
                            <div class="mt-3 pt-3 border-t border-gray-600">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <span class="text-gray-400">Última sessão:</span>
                                        <span class="ml-2 text-sm">${lastSession.type}</span>
                                    </div>
                                    <span class="text-xs text-gray-400">${formatDate(lastSession.date)}</span>
                                </div>
                                ${lastSession.evolution ? `
                                    <div class="mt-1">
                                        <span class="text-gray-400">Evolução:</span>
                                        <span class="ml-2 text-xs text-green-400">${lastSession.evolution}</span>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                        
                        ${nextSession ? `
                            <div class="mt-3 pt-3 border-t border-gray-600">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <span class="text-gray-400">Próxima sessão:</span>
                                        <span class="ml-2 text-sm text-blue-400">${nextSession.type}</span>
                                    </div>
                                    <span class="text-xs text-blue-400">${formatDate(nextSession.date)} ${nextSession.time || ''}</span>
                                </div>
                            </div>
                        ` : ''}
                        
                        <!-- Últimas 3 sessões -->
                        ${patientSessions.length > 0 ? `
                            <div class="mt-3 pt-3 border-t border-gray-600">
                                <div class="text-xs text-gray-400 mb-2">Últimas sessões:</div>
                                <div class="space-y-1">
                                    ${patientSessions
                                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                                        .slice(0, 3)
                                        .map(session => {
                                            const statusColors = {
                                                'completed': 'text-green-400',
                                                'cancelled': 'text-red-400',
                                                'no-show': 'text-yellow-400',
                                                'scheduled': 'text-blue-400'
                                            };
                                            const statusTexts = {
                                                'completed': 'Concluído',
                                                'cancelled': 'Cancelado',
                                                'no-show': 'Não compareceu',
                                                'scheduled': 'Agendado'
                                            };
                                            return `
                                                <div class="flex items-center justify-between text-xs">
                                                    <span>${session.type}</span>
                                                    <div class="flex items-center gap-2">
                                                        <span class="${statusColors[session.status]}">${statusTexts[session.status]}</span>
                                                        <span class="text-gray-400">${formatDate(session.date)}</span>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                </div>
                            </div>
                        ` : ''}
                    ` : `
                        <div class="text-center py-2 text-gray-400 text-xs">
                            Nenhuma sessão registrada
                        </div>
                    `}
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Renderização concluída');
}

// Tornar a função global
window.renderPatientsList = renderPatientsList;

// Select Patient
function selectPatient(patientId) {
    currentPatient = patientsData.find(p => p.id === patientId);
    if (!currentPatient) return;
    
    // Show patient record section
    document.getElementById('patient-record-section').classList.remove('hidden');
    
    // Load patient information
    loadPatientRecord();
    
    // Scroll to patient record
    document.getElementById('patient-record-section').scrollIntoView({ behavior: 'smooth' });
}

// Export All Records
window.exportAllRecords = function() {
    showNotification('Exportando prontuários...', 'info');
    
    // Collect all patient data
    const patients = patientsData.map(patient => ({
        Nome: patient.name,
        Email: patient.email,
        Telefone: patient.phone,
        'Data de Nascimento': patient.birthDate,
        'Diagnóstico Energético': patient.diagnosis,
        'Sintomas': patient.symptoms.join('; '),
        'Nível de Risco': patient.riskLevel,
        Terapeuta: patient.therapist,
        'Última Sessão': patient.lastSession,
        'Próxima Sessão': patient.nextSession,
        'Total de Sessões': patient.totalSessions,
        'Perfil Energético': patient.energeticProfile,
        'Evolução': patient.evolution,
        'Tratamentos': patient.treatments.join('; '),
        'Histórico de Crises': patient.crisisHistory
    }));
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nome,Email,Telefone,Data de Nascimento,Diagnóstico Energético,Sintomas,Nível de Risco,Terapeuta,Última Sessão,Próxima Sessão,Total de Sessões,Perfil Energético,Evolução,Tratamentos,Histórico de Crises\n";
    
    patients.forEach(patient => {
        csvContent += `"${patient.Nome}","${patient.Email}","${patient.Telefone}","${patient['Data de Nascimento']}","${patient['Diagnóstico Energético']}","${patient.Sintomas}","${patient['Nível de Risco']}","${patient.Terapeuta}","${patient['Última Sessão']}","${patient['Próxima Sessão']}","${patient['Total de Sessões']}","${patient['Perfil Energético']}","${patient.Evolução}","${patient.Tratamentos}","${patient['Histórico de Crises']}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `prontuarios_berhu_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
        showNotification('Prontuários exportados com sucesso!', 'success');
        addRecentActivity('export', 'Exportação de prontuários realizada');
    }, 1000);
};

// Load Patient Sessions
function loadPatientRecord() {
    if (!currentPatient) return;
    
    // Patient Info
    document.getElementById('patient-info').innerHTML = `
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
                <label class="text-sm text-gray-400">Nome</label>
                <p class="text-white font-medium">${currentPatient.name}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Email</label>
                <p class="text-white">${currentPatient.email}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Telefone</label>
                <p class="text-white">${currentPatient.phone}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Data de Nascimento</label>
                <p class="text-white">${formatDate(currentPatient.birthDate)}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Diagnóstico Energético</label>
                <p class="text-white font-medium">${currentPatient.diagnosis}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Terapeuta</label>
                <p class="text-white">${currentPatient.therapist}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Última Sessão</label>
                <p class="text-white">${formatDate(currentPatient.lastSession)}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Próxima Sessão</label>
                <p class="text-white">${currentPatient.nextSession || 'A definir'}</p>
            </div>
        </div>
    `;
    
    // Clinical Assessment
    document.getElementById('clinical-assessment').innerHTML = `
        <div class="bg-purple-600 bg-opacity-20 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-purple-300 mb-3">Avaliação Energética</h4>
            <div class="space-y-3">
                <div>
                    <label class="text-sm text-gray-400">Sintomas Energéticos</label>
                    <div class="flex flex-wrap gap-2 mt-1">
                        ${currentPatient.symptoms.map(symptom => `
                            <span class="px-2 py-1 bg-purple-600 bg-opacity-30 rounded text-xs text-white">
                                ${symptom}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <label class="text-sm text-gray-400">Tratamentos Realizados</label>
                    <div class="space-y-1">
                        ${currentPatient.treatments.map(treatment => `
                            <p class="text-white text-sm">• ${treatment}</p>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <label class="text-sm text-gray-400">Evolução Energética</label>
                    <p class="text-white text-sm">${currentPatient.evolution}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-indigo-600 bg-opacity-20 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-indigo-300 mb-3">Perfil Energético</h4>
            <p class="text-white text-sm">${currentPatient.energeticProfile}</p>
        </div>
        
        <div class="bg-indigo-600 bg-opacity-20 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-indigo-300 mb-3">Tipo de Sessão Energética</h4>
            <select id="eval-type" class="form-input w-full" required>
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
        
        <div class="bg-indigo-600 bg-opacity-20 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-indigo-300 mb-3">Observações Energéticas</h4>
            <textarea id="eval-notes" rows="4" class="form-input w-full" 
                      placeholder="Descreva a sessão, estado do campo áurico, chakras, energias observadas..." required></textarea>
        </div>
        
        <div class="bg-indigo-600 bg-opacity-20 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-indigo-300 mb-3">Evolução Energética</h4>
            <select id="eval-evolution" class="form-input w-full" required>
                <option value="">Selecione...</option>
                <option value="Retrocesso Energético">Retrocesso Energético</option>
                <option value="Estável">Estável</option>
                <option value="Melhora Leve">Melhora Leve</option>
                <option value="Melhora Significativa">Melhora Significativa</option>
                <option value="Alinhamento Completo">Alinhamento Completo</option>
                <option value="Ascensão Energética">Ascensão Energética</option>
            </select>
        </div>
        
        <div class="bg-indigo-600 bg-opacity-20 rounded-lg p-4">
            <h4 class="text-lg font-semibold text-indigo-300 mb-3">Recomendações Energéticas</h4>
            <textarea id="eval-recommendations" rows="3" class="form-input w-full" 
                      placeholder="Recomendações para o paciente (meditações, cristais, proteção, etc.)..." required></textarea>
        </div>
    `;
    
    // Load sessions history
    loadPatientSessions();
}
function loadPatientSessions() {
    // Mock sessions data for current patient - spiritual treatments
    const sessions = [
        {
            id: 1,
            date: '2024-01-15',
            type: 'Limpeza Áurica',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            duration: 60,
            notes: 'Sessão poderosa de limpeza áurica. Campo energético do paciente estava muito denso. Realizada técnica de varredura energética com cristais de ametista e quartzo transparente.',
            evaluation: 'Excelente resposta. Aura do paciente está 70% mais limpa. Chakras começando a se alinhar naturalmente.'
        },
        {
            id: 2,
            date: '2024-01-08',
            type: 'Reiki',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            duration: 45,
            notes: 'Sessão de Reiki nível avançado. Canal de energia do paciente estava bloqueado no chakra cardíaco. Utilizados símbolos de cura emocional.',
            evaluation: 'Boa abertura do chakra cardíaco. Paciente relatou sensação de leveza e paz interior.'
        },
        {
            id: 3,
            date: '2024-01-01',
            type: 'Meditação Chakras',
            therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
            duration: 90,
            notes: 'Meditação guiada focada no alinhamento dos 7 chakras principais. Paciente conseguiu manter o foco e visualizar cada centro energético.',
            evaluation: 'Progresso notável na consciência corporal energética. Paciente mais conectado com seu corpo sutil.'
        }
    ];
    
    const sessionsList = document.getElementById('sessions-list');
    sessionsList.innerHTML = sessions.map(session => `
        <div class="bg-black bg-opacity-20 rounded-lg p-3">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <div class="font-medium">${session.type} - ${formatDate(session.date)}</div>
                    <div class="text-sm text-gray-400">${session.therapist} • ${session.duration} min</div>
                </div>
                <button onclick="viewSessionDetails(${session.id})" class="text-blue-400 hover:text-blue-300 text-sm">
                    Ver detalhes
                </button>
            </div>
            <div class="text-sm text-gray-300">
                <p><strong>Observações Energéticas:</strong> ${session.notes}</p>
                <p class="mt-1"><strong>Avaliação:</strong> ${session.evaluation}</p>
            </div>
        </div>
    `).join('');
}

// Setup Evaluation Form
function setupEvaluationForm() {
    const form = document.getElementById('evaluation-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveEvaluation();
        });
        
        // Set today's date as default
        document.getElementById('eval-date').valueAsDate = new Date();
    }
}

// Save Evaluation
function saveEvaluation() {
    if (!currentPatient) {
        showNotification('Selecione um paciente primeiro', 'error');
        return;
    }
    
    const evaluation = {
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        date: document.getElementById('eval-date').value,
        type: document.getElementById('eval-type').value,
        notes: document.getElementById('eval-notes').value,
        evolution: document.getElementById('eval-evolution').value,
        recommendations: document.getElementById('eval-recommendations').value,
        nextSession: document.getElementById('eval-next-session').value,
        therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
        timestamp: new Date().toISOString()
    };
    
    // Add to evaluations data
    evaluationsData.push(evaluation);
    
    // Update patient's next session
    if (evaluation.nextSession) {
        currentPatient.nextSession = evaluation.nextSession;
        loadPatientRecord();
    }
    
    // Show success message
    showNotification('Avaliação salva com sucesso!', 'success');
    
    // Reset form
    resetEvaluationForm();
    
    // Update recent activities
    addRecentActivity('evaluation', `Avaliação registrada para ${currentPatient.name}`);
    
    // Refresh patient sessions
    loadPatientSessions();
}

// Reset Evaluation Form
function resetEvaluationForm() {
    const form = document.getElementById('evaluation-form');
    if (form) {
        form.reset();
        document.getElementById('eval-date').valueAsDate = new Date();
    }
}

// Filter Patients
function filterPatients() {
    const searchTerm = document.getElementById('patient-search').value.toLowerCase();
    const filterType = document.getElementById('patient-filter').value;
    
    let filtered = [...patientsData];
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(patient => 
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm) ||
            patient.diagnosis.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by type
    if (filterType === 'high-risk') {
        filtered = filtered.filter(p => p.riskLevel === 'Alto');
    } else if (filterType === 'recent') {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        filtered = filtered.filter(p => new Date(p.lastSession) >= lastWeek);
    } else if (filterType === 'pending-eval') {
        filtered = filtered.filter(p => !p.nextSession || new Date(p.nextSession) <= new Date());
    }
    
    renderPatientsList(filtered);
}

// Load High Risk Patients
function loadHighRiskPatients() {
    const highRiskPatients = patientsData.filter(p => p.riskLevel === 'Alto');
    const container = document.getElementById('high-risk-patients');
    
    if (highRiskPatients.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">Nenhum paciente em alto risco</p>';
        return;
    }
    
    container.innerHTML = highRiskPatients.map(patient => `
        <div class="bg-black bg-opacity-20 rounded-lg p-3">
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-medium text-sm">${patient.name}</div>
                    <div class="text-xs text-gray-400">${patient.diagnosis}</div>
                </div>
                <button onclick="selectPatient(${patient.id})" class="text-red-400 hover:text-red-300 text-sm">
                    Ver prontuário
                </button>
            </div>
        </div>
    `).join('');
}

// Load Pending Evaluations
function loadPendingEvaluations() {
    const pendingPatients = patientsData.filter(p => {
        if (!p.nextSession) return false;
        return new Date(p.nextSession) <= new Date();
    });
    
    const container = document.getElementById('pending-evaluations');
    
    if (pendingPatients.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">Nenhuma avaliação pendente</p>';
        return;
    }
    
    container.innerHTML = pendingPatients.map(patient => `
        <div class="bg-black bg-opacity-20 rounded-lg p-3">
            <div class="flex justify-between items-center">
                <div>
                    <div class="font-medium text-sm">${patient.name}</div>
                    <div class="text-xs text-gray-400">Avaliação pendente desde ${formatDate(patient.nextSession)}</div>
                </div>
                <button onclick="selectPatient(${patient.id})" class="text-yellow-400 hover:text-yellow-300 text-sm">
                    Avaliar agora
                </button>
            </div>
        </div>
    `).join('');
}

// Load Recent Activities
function loadRecentActivities() {
    const activities = [
        { type: 'evaluation', description: 'Avaliação registrada para Maria Client', time: '2 horas atrás' },
        { type: 'session', description: 'Sessão de Reiki concluída com Usuária Demo', time: '4 horas atrás' },
        { type: 'alert', description: 'Paciente Ana Santos em crise - contatoado', time: '1 dia atrás' },
        { type: 'evaluation', description: 'Avaliação registrada para João Silva', time: '2 dias atrás' }
    ];
    
    const container = document.getElementById('recent-activities');
    container.innerHTML = activities.map(activity => `
        <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-${activity.type === 'alert' ? 'red' : activity.type === 'evaluation' ? 'yellow' : 'blue'}-400 rounded-full mt-2"></div>
            <div class="flex-1">
                <p class="text-sm">${activity.description}</p>
                <p class="text-xs text-gray-400">${activity.time}</p>
            </div>
        </div>
    `).join('');
}

// Add Recent Activity
function addRecentActivity(type, description) {
    // This would typically update a database
    console.log('Activity added:', { type, description, time: new Date() });
    loadRecentActivities();
}

// View Session Details
function viewSessionDetails(sessionId) {
    // Mock session details
    const session = {
        id: sessionId,
        date: '2024-01-15',
        type: 'Reiki',
        notes: 'Sessão energética poderosa com foco em alinhamento dos chakras.',
        evaluation: 'Boa resposta ao tratamento.'
    };
    
    showModal('Detalhes da Sessão', `
        <div class="space-y-4">
            <div>
                <label class="text-sm text-gray-400">Data</label>
                <p class="text-white">${formatDate(session.date)}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Tipo</label>
                <p class="text-white">${session.type}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Notas</label>
                <p class="text-white bg-black bg-opacity-20 p-3 rounded">${session.notes}</p>
            </div>
            <div>
                <label class="text-sm text-gray-400">Avaliação</label>
                <p class="text-white bg-black bg-opacity-20 p-3 rounded">${session.evaluation}</p>
            </div>
        </div>
    `);
}

// Print Patient Record
window.printPatientRecord = function() {
    if (!currentPatient) {
        showNotification('Selecione um paciente primeiro', 'error');
        return;
    }
    
    // Create printable content
    const printContent = `
        <html>
            <head>
                <title>Prontuário Clínico - ${currentPatient.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    .section h3 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
                    .field { margin-bottom: 10px; }
                    .field label { font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Prontuário Clínico</h1>
                    <h2>${currentPatient.name}</h2>
                    <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="section">
                    <h3>Informações do Paciente</h3>
                    <div class="field"><label>Nome:</label> ${currentPatient.name}</div>
                    <div class="field"><label>Email:</label> ${currentPatient.email}</div>
                    <div class="field"><label>Telefone:</label> ${currentPatient.phone}</div>
                    <div class="field"><label>Diagnóstico:</label> ${currentPatient.diagnosis}</div>
                </div>
                
                <div class="section">
                    <h3>Avaliação Clínica</h3>
                    <div class="field"><label>Sintomas:</label> ${currentPatient.symptoms.join(', ')}</div>
                    <div class="field"><label>Medicações:</label> ${currentPatient.medications.join(', ')}</div>
                    <div class="field"><label>Evolução:</label> ${currentPatient.evolution}</div>
                </div>
                
                <div class="section">
                    <h3>Histórico de Crises</h3>
                    <div class="field">${currentPatient.crisisHistory}</div>
                </div>
                
                <div class="section">
                    <p><small>Documento gerado em ${new Date().toLocaleString('pt-BR')} - Confidencial</small></p>
                </div>
            </body>
        </html>
    `;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    showNotification('Prontuário enviado para impressão', 'success');
}

// Export Patient Record
window.exportPatientRecord = function() {
    if (!currentPatient) {
        showNotification('Selecione um paciente primeiro', 'error');
        return;
    }
    
    // Create CSV content
    const csvContent = [
        ['Dados do Paciente', ''],
        ['Nome', currentPatient.name],
        ['Email', currentPatient.email],
        ['Telefone', currentPatient.phone],
        ['Diagnóstico', currentPatient.diagnosis],
        ['Sintomas', currentPatient.symptoms.join('; ')],
        ['Medicações', currentPatient.medications.join('; ')],
        ['Evolução', currentPatient.evolution],
        ['Histórico de Crises', currentPatient.crisisHistory]
    ].map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `prontuario_${currentPatient.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Prontuário exportado com sucesso', 'success');
}

// Show Modal
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full mx-4 border border-white border-opacity-20">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-semibold text-white">${title}</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-300">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${content}
        </div>
    `;

    document.body.appendChild(modal);
}

// Show New Patient Modal
window.showNewPatientModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content max-w-3xl">
            <div class="modal-header">
                <h3 class="modal-title">Adicionar Novo Paciente</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="new-patient-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Nome Completo *</label>
                            <input type="text" id="new-patient-name" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Email *</label>
                            <input type="email" id="new-patient-email" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Telefone *</label>
                            <input type="tel" id="new-patient-phone" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Data de Nascimento *</label>
                            <input type="date" id="new-patient-birthdate" class="form-input w-full" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Diagnóstico Energético *</label>
                        <input type="text" id="new-patient-diagnosis" class="form-input w-full" placeholder="Ex: Desequilíbrio Energético e Bloqueio Emocional" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Sintomas Energéticos</label>
                        <textarea id="new-patient-symptoms" rows="3" class="form-input w-full" placeholder="Separe os sintomas com vírgula..."></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Nível de Risco *</label>
                        <select id="new-patient-risk" class="form-input w-full" required>
                            <option value="">Selecione...</option>
                            <option value="Baixo">Baixo</option>
                            <option value="Moderado">Moderado</option>
                            <option value="Alto">Alto</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Perfil Energético</label>
                        <textarea id="new-patient-profile" rows="2" class="form-input w-full" placeholder="Descrição do perfil energético do paciente..."></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Tratamentos Recomendados</label>
                        <textarea id="new-patient-treatments" rows="2" class="form-input w-full" placeholder="Ex: Limpeza Áurica, Reiki, Meditação..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                <button type="button" onclick="saveNewPatient()" class="btn btn-primary">
                    <i class="fas fa-save mr-2"></i>Salvar Paciente
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Save New Patient
window.saveNewPatient = function() {
    const name = document.getElementById('new-patient-name').value;
    const email = document.getElementById('new-patient-email').value;
    const phone = document.getElementById('new-patient-phone').value;
    const birthdate = document.getElementById('new-patient-birthdate').value;
    const diagnosis = document.getElementById('new-patient-diagnosis').value;
    const symptoms = document.getElementById('new-patient-symptoms').value.split(',').map(s => s.trim()).filter(s => s);
    const riskLevel = document.getElementById('new-patient-risk').value;
    const energeticProfile = document.getElementById('new-patient-profile').value;
    const treatments = document.getElementById('new-patient-treatments').value.split(',').map(t => t.trim()).filter(t => t);

    if (!name || !email || !phone || !birthdate || !diagnosis || !riskLevel) {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }

    const newPatient = {
        id: Date.now(),
        name,
        email,
        phone,
        birthDate: birthdate,
        diagnosis,
        symptoms: symptoms.length > 0 ? symptoms : ['A ser avaliado'],
        riskLevel,
        lastSession: new Date().toISOString().split('T')[0],
        nextSession: '',
        status: 'active',
        therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
        treatments: treatments.length > 0 ? treatments : ['Avaliação inicial'],
        evolution: 'Paciente em início de tratamento',
        energeticProfile: energeticProfile || 'A ser avaliado',
        crisisHistory: 'Sem histórico de crises',
        totalSessions: 0
    };

    // Add to patients data
    patientsData.push(newPatient);

    // Update UI
    renderPatientsList(window.patientsData);

    // Close modal
    document.querySelector('.modal').remove();
    document.body.style.overflow = '';

    // Show success
    showNotification('Paciente adicionado com sucesso!', 'success');
    addRecentActivity('patient', `Paciente "${name}" adicionado`);
}

// Helper Functions
function getRiskLevelColor(riskLevel) {
    const colors = {
        'Baixo': 'bg-green-600 text-white',
        'Moderado': 'bg-yellow-600 text-white',
        'Alto': 'bg-red-600 text-white'
    };
    return colors[riskLevel] || 'bg-gray-600 text-white';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
    // Set color based on type
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
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Show Schedule Modal
window.showScheduleModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content max-w-2xl">
            <div class="modal-header">
                <h3 class="modal-title">Agendar Nova Sessão</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="schedule-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Paciente *</label>
                            <select id="schedule-patient" class="form-input w-full" required>
                                <option value="">Selecione...</option>
                                ${window.patientsData.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Tipo de Sessão *</label>
                            <select id="schedule-type" class="form-input w-full" required>
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
                        <div>
                            <label class="block text-sm font-medium mb-2">Data *</label>
                            <input type="date" id="schedule-date" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Horário *</label>
                            <input type="time" id="schedule-time" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Duração (minutos) *</label>
                            <input type="number" id="schedule-duration" class="form-input w-full" min="30" max="180" value="60" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Observações</label>
                        <textarea id="schedule-notes" rows="3" class="form-input w-full" placeholder="Observações sobre a sessão..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                <button type="button" onclick="saveSchedule()" class="btn btn-primary">
                    <i class="fas fa-calendar-check mr-2"></i>Agendar Sessão
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
};

// Save Schedule
window.saveSchedule = function() {
    const patientId = document.getElementById('schedule-patient').value;
    const type = document.getElementById('schedule-type').value;
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    const duration = document.getElementById('schedule-duration').value;
    const notes = document.getElementById('schedule-notes').value;
    
    if (!patientId || !type || !date || !time || !duration) {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    const patient = window.patientsData.find(p => p.id == patientId);
    if (!patient) {
        showNotification('Paciente não encontrado', 'error');
        return;
    }
    
    const schedule = {
        id: Date.now(),
        patientId: parseInt(patientId),
        patientName: patient.name,
        type,
        date,
        time,
        duration: parseInt(duration),
        notes,
        therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage - UNIFICADO
    const allSessions = JSON.parse(localStorage.getItem('berhu_all_sessions') || '[]');
    allSessions.push(schedule);
    localStorage.setItem('berhu_all_sessions', JSON.stringify(allSessions));
    
    // Update patient next session
    patient.nextSession = date;
    renderPatientsList(window.patientsData);
    
    // Close modal
    document.querySelector('.modal').remove();
    document.body.style.overflow = '';
    
    // Show success
    showNotification('Sessão agendada com sucesso!', 'success');
    addRecentActivity('schedule', `Sessão "${type}" agendada para ${patient.name}`);
};

// Show Reports Modal
window.showReportsModal = function() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content max-w-5xl">
            <div class="modal-header">
                <h3 class="modal-title">Relatórios Clínicos</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Patient Statistics -->
                    <div class="bg-white bg-opacity-10 rounded-lg p-6">
                        <h4 class="text-lg font-semibold mb-4 text-purple-300">Estatísticas de Pacientes</h4>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Total de Pacientes:</span>
                                <span class="font-semibold">${patientsData.length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Pacientes Ativos:</span>
                                <span class="text-green-400">${patientsData.filter(p => p.status === 'active').length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Alto Risco:</span>
                                <span class="text-red-400">${patientsData.filter(p => p.riskLevel === 'Alto').length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Baixo Risco:</span>
                                <span class="text-blue-400">${patientsData.filter(p => p.riskLevel === 'Baixo').length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Médio Risco:</span>
                                <span class="text-yellow-400">${patientsData.filter(p => p.riskLevel === 'Moderado').length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Treatment Statistics -->
                    <div class="bg-white bg-opacity-10 rounded-lg p-6">
                        <h4 class="text-lg font-semibold mb-4 text-green-300">Estatísticas de Tratamentos</h4>
                        <div class="space-y-3">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Limpeza Áurica:</span>
                                <span class="font-semibold">${patientsData.filter(p => p.treatments.includes('Limpeza Áurica')).length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Reiki:</span>
                                <span class="font-semibold">${patientsData.filter(p => p.treatments.includes('Reiki')).length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Meditação:</span>
                                <span class="font-semibold">${patientsData.filter(p => p.treatments.includes('Meditação')).length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Cristais:</span>
                                <span class="font-semibold">${patientsData.filter(p => p.treatments.includes('Cristais')).length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Leitura de Aura:</span>
                                <span class="font-semibold">${patientsData.filter(p => p.treatments.includes('Leitura de Aura')).length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Fechar</button>
                <button type="button" onclick="generatePDFReport()" class="btn btn-primary">
                    <i class="fas fa-file-pdf mr-2"></i>Gerar Relatório PDF
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
};

// Generate PDF Report
window.generatePDFReport = function() {
    showNotification('Gerando relatório PDF...', 'info');
    
    setTimeout(() => {
        showNotification('Relatório PDF gerado com sucesso!', 'success');
        addRecentActivity('report', 'Relatório clínico gerado');
        document.querySelector('.modal').remove();
        document.body.style.overflow = '';
    }, 2000);
};

function getSessionToken() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    if (!session) return null;
    try {
        return JSON.parse(session).token;
    } catch (e) {
        return null;
    }
}

// Load Scheduled Sessions (real data from API)
window.loadScheduledSessions = async function() {
    const container = document.getElementById('scheduled-sessions');
    container.innerHTML = '<p class="text-center text-gray-500 py-8"><i class="fas fa-spinner fa-spin mr-2"></i>Carregando sessões...</p>';

    const token = getSessionToken();
    if (!token) {
        container.innerHTML = '<p class="text-sm text-gray-400">Sessão expirada. Faça login novamente.</p>';
        return;
    }

    try {
        const response = await fetch('/api/therapist/appointments', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao carregar agendamentos');
        }

        const scheduled = (data || []).filter(a => a.status === 'scheduled');

        if (scheduled.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-400">Nenhuma sessão aguardando confirmação</p>';
            return;
        }

        scheduled.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}:00`);
            const dateB = new Date(`${b.date}T${b.time}:00`);
            return dateA - dateB;
        });

        container.innerHTML = scheduled.map(a => {
            const isToday = a.date === new Date().toISOString().split('T')[0];
            const isTomorrow = a.date === new Date(Date.now() + 86400000).toISOString().split('T')[0];

            let dateLabel = formatDate(a.date);
            if (isToday) dateLabel = 'Hoje';
            if (isTomorrow) dateLabel = 'Amanhã';

            return `
                <div class="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 shadow-lg">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                                    <i class="fas fa-calendar-alt text-purple-300"></i>
                                </div>
                                <div>
                                    <div class="font-bold text-white">${a.user_name || 'Cliente'}</div>
                                    <div class="text-sm text-gray-400">${a.user_email || ''}</div>
                                </div>
                                ${isToday ? '<span class="px-3 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-200 font-semibold">Hoje</span>' : ''}
                                ${isTomorrow ? '<span class="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-200 font-semibold">Amanhã</span>' : ''}
                            </div>

                            <div class="text-sm text-gray-200 font-semibold mb-2">${a.service}</div>

                            <div class="grid grid-cols-2 gap-3 text-sm text-gray-300">
                                <div class="flex items-center gap-2"><i class="fas fa-calendar-day text-gray-400"></i>${dateLabel}</div>
                                <div class="flex items-center gap-2"><i class="fas fa-clock text-gray-400"></i>${a.time}</div>
                            </div>

                            ${a.notes ? `
                                <div class="mt-3 p-3 bg-black/20 rounded-lg border border-white/5">
                                    <p class="text-xs text-gray-300">${a.notes}</p>
                                </div>
                            ` : ''}
                        </div>

                        <div class="flex flex-col gap-2">
                            <button onclick="confirmAppointment(${a.id})" class="bg-green-600/20 hover:bg-green-600/30 text-green-200 px-3 py-2 rounded-lg text-xs font-semibold transition">
                                <i class="fas fa-check mr-2"></i>Confirmar
                            </button>
                            <button onclick="cancelAppointmentByTherapist(${a.id})" class="bg-red-600/20 hover:bg-red-600/30 text-red-200 px-3 py-2 rounded-lg text-xs font-semibold transition">
                                <i class="fas fa-times mr-2"></i>Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        container.innerHTML = `<p class="text-sm text-gray-400">${error.message}</p>`;
    }
};

window.confirmAppointment = async function(appointmentId) {
    const token = getSessionToken();
    if (!token) return;
    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'confirmed' })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao confirmar');
        }
        showNotification('Agendamento confirmado com sucesso!', 'success');
        loadScheduledSessions();
    } catch (error) {
        showNotification(error.message || 'Erro ao confirmar', 'error');
    }
};

window.cancelAppointmentByTherapist = async function(appointmentId) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
        return;
    }
    const token = getSessionToken();
    if (!token) return;
    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'cancelled' })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Erro ao cancelar');
        }
        showNotification('Agendamento cancelado com sucesso!', 'success');
        loadScheduledSessions();
    } catch (error) {
        showNotification(error.message || 'Erro ao cancelar', 'error');
    }
};

// Edit Scheduled Session
window.editScheduledSession = function(sessionId) {
    const allSessions = JSON.parse(localStorage.getItem('berhu_all_sessions') || '[]');
    const session = allSessions.find(s => s.id === sessionId);
    
    if (!session) {
        showNotification('Sessão não encontrada', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content max-w-2xl">
            <div class="modal-header">
                <h3 class="modal-title">Editar Sessão Agendada</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="edit-schedule-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Paciente</label>
                            <input type="text" value="${session.patientName}" class="form-input w-full" readonly>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Tipo de Sessão *</label>
                            <select id="edit-schedule-type" class="form-input w-full" required>
                                <option value="Limpeza Áurica" ${session.type === 'Limpeza Áurica' ? 'selected' : ''}>Limpeza Áurica</option>
                                <option value="Reiki" ${session.type === 'Reiki' ? 'selected' : ''}>Reiki</option>
                                <option value="Meditação Chakras" ${session.type === 'Meditação Chakras' ? 'selected' : ''}>Meditação Chakras</option>
                                <option value="Meditação Mindfulness" ${session.type === 'Meditação Mindfulness' ? 'selected' : ''}>Meditação Mindfulness</option>
                                <option value="Meditação Curativa" ${session.type === 'Meditação Curativa' ? 'selected' : ''}>Meditação Curativa</option>
                                <option value="Leitura de Aura" ${session.type === 'Leitura de Aura' ? 'selected' : ''}>Leitura de Aura</option>
                                <option value="Cristais" ${session.type === 'Cristais' ? 'selected' : ''}>Cristais</option>
                                <option value="Astrologia Terapêutica" ${session.type === 'Astrologia Terapêutica' ? 'selected' : ''}>Astrologia Terapêutica</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Data *</label>
                            <input type="date" id="edit-schedule-date" value="${session.date}" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Horário *</label>
                            <input type="time" id="edit-schedule-time" value="${session.time}" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Duração (minutos) *</label>
                            <input type="number" id="edit-schedule-duration" value="${session.duration}" class="form-input w-full" min="30" max="180" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Observações</label>
                        <textarea id="edit-schedule-notes" rows="3" class="form-input w-full" placeholder="Observações sobre a sessão...">${session.notes || ''}</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                <button type="button" onclick="updateScheduledSession(${sessionId})" class="btn btn-primary">
                    <i class="fas fa-save mr-2"></i>Atualizar Sessão
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
};

// Update Scheduled Session
window.updateScheduledSession = function(sessionId) {
    const allSessions = JSON.parse(localStorage.getItem('berhu_all_sessions') || '[]');
    const sessionIndex = allSessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
        showNotification('Sessão não encontrada', 'error');
        return;
    }
    
    const type = document.getElementById('edit-schedule-type').value;
    const date = document.getElementById('edit-schedule-date').value;
    const time = document.getElementById('edit-schedule-time').value;
    const duration = document.getElementById('edit-schedule-duration').value;
    const notes = document.getElementById('edit-schedule-notes').value;
    
    if (!type || !date || !time || !duration) {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    // Save to localStorage - UNIFICADO
    allSessions[sessionIndex] = {
        ...allSessions[sessionIndex],
        type,
        date,
        time,
        duration: parseInt(duration),
        notes,
        therapist: 'Fabiane Berkana - Terapeuta de Astralidade',
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('berhu_all_sessions', JSON.stringify(allSessions));
    
    // Update patient next session
    const patient = patientsData.find(p => p.id === allSessions[sessionIndex].patientId);
    if (patient) {
        patient.nextSession = date;
        renderPatientsList(window.patientsData);
    }
    
    // Close modal
    document.querySelector('.modal').remove();
    document.body.style.overflow = '';
    
    // Reload sessions
    loadScheduledSessions();
    
    // Show success
    showNotification('Sessão atualizada com sucesso!', 'success');
    addRecentActivity('schedule', `Sessão "${type}" atualizada para ${allSessions[sessionIndex].patientName}`);
};

// Cancel Scheduled Session
window.cancelScheduledSession = function(sessionId) {
    if (!confirm('Tem certeza que deseja cancelar esta sessão?')) {
        return;
    }
    
    const allSessions = JSON.parse(localStorage.getItem('berhu_all_sessions') || '[]');
    const sessionIndex = allSessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
        showNotification('Sessão não encontrada', 'error');
        return;
    }
    
    const session = allSessions[sessionIndex];
    
    // Update session status to cancelled
    allSessions[sessionIndex].status = 'cancelled';
    allSessions[sessionIndex].cancelledAt = new Date().toISOString();
    
    localStorage.setItem('berhu_all_sessions', JSON.stringify(allSessions));
    
    // Update patient next session
    const patient = patientsData.find(p => p.id === session.patientId);
    if (patient) {
        patient.nextSession = '';
        renderPatientsList(window.patientsData);
    }
    
    // Reload sessions
    loadScheduledSessions();
    
    // Show success
    showNotification('Sessão cancelada com sucesso!', 'success');
    addRecentActivity('schedule', `Sessão "${session.type}" cancelada para ${session.patientName}`);
};

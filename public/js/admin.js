// Admin Panel JavaScript for Berhu Platform

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

// Initialize Admin
function initializeAdmin() {
    checkAdminAccess();
    setupEventListeners();
    loadClients();
    loadCourses();
    loadFiles();
    loadActivityLog();
    loadRecentActivities();
    loadServiceHistory();
}

// Check Admin Access
function checkAdminAccess() {
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
            showNotification('Acesso restrito a administradores', 'error');
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
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Client search and filter
    document.getElementById('client-search').addEventListener('input', filterClients);
    document.getElementById('client-filter').addEventListener('change', filterClients);
    
    // Service history filters
    document.getElementById('history-filter-client').addEventListener('change', filterServiceHistory);
    document.getElementById('history-filter-period').addEventListener('change', filterServiceHistory);
    
    // File upload
    setupFileUpload();
    
    // Modal file input
    document.getElementById('modal-file-input').addEventListener('change', previewFiles);
    
    // Course upload
    setupCourseUpload();
}

// Load Clients
function loadClients() {
    const mockClients = [
        {
            id: 1,
            name: 'Usuária Demo',
            email: 'demo@berhu.com',
            plan: 'premium',
            sessions: 24,
            status: 'active',
            lastActive: '2024-01-15',
            joinedAt: '2023-06-01'
        },
        {
            id: 2,
            name: 'Maria Client',
            email: 'maria@berhu.com',
            plan: 'basic',
            sessions: 12,
            status: 'active',
            lastActive: '2024-01-14',
            joinedAt: '2023-08-15'
        },
        {
            id: 3,
            name: 'João Silva',
            email: 'joao@berhu.com',
            plan: 'premium',
            sessions: 8,
            status: 'active',
            lastActive: '2024-01-13',
            joinedAt: '2023-10-20'
        },
        {
            id: 4,
            name: 'Ana Santos',
            email: 'ana@berhu.com',
            plan: 'basic',
            sessions: 6,
            status: 'inactive',
            lastActive: '2023-12-20',
            joinedAt: '2023-09-10'
        },
        {
            id: 5,
            name: 'Carlos Oliveira',
            email: 'carlos@berhu.com',
            plan: 'premium',
            sessions: 18,
            status: 'active',
            lastActive: '2024-01-15',
            joinedAt: '2023-07-05'
        }
    ];
    
    renderClientsTable(mockClients);
}

// Render Clients Table
function renderClientsTable(clients) {
    const tableBody = document.getElementById('clients-table');
    tableBody.innerHTML = '';
    
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.className = 'border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition';
        
        const planColors = {
            basic: 'gray',
            premium: 'purple',
            therapist: 'green',
            admin: 'red'
        };
        
        const planColor = planColors[client.plan] || 'gray';
        
        const statusColors = {
            active: 'green',
            inactive: 'red',
            suspended: 'yellow'
        };
        
        const statusColor = statusColors[client.status] || 'gray';
        
        row.innerHTML = `
            <td class="py-3 px-4">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-${planColor}-600 rounded-full flex items-center justify-center">
                        <span class="text-xs font-bold">${client.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                        <div class="font-semibold">${client.name}</div>
                        <div class="text-xs text-gray-400">${client.email}</div>
                    </div>
                </div>
            </td>
            <td class="py-3 px-4">
                <span class="bg-${planColor}-600 bg-opacity-20 px-2 py-1 rounded text-xs font-semibold text-${planColor}-300">
                    ${client.plan}
                </span>
            </td>
            <td class="py-3 px-4">
                <div class="text-center">
                    <div class="font-semibold">${client.sessions}</div>
                    <div class="text-xs text-gray-400">sessões</div>
                </div>
            </td>
            <td class="py-3 px-4">
                <span class="bg-${statusColor}-600 bg-opacity-20 px-2 py-1 rounded text-xs font-semibold text-${statusColor}-300">
                    ${client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                </span>
            </td>
            <td class="py-3 px-4">
                <div class="flex space-x-2">
                    <button onclick="viewClient(${client.id})" class="text-blue-400 hover:text-blue-300 transition" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editClient(${client.id})" class="text-green-400 hover:text-green-300 transition" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteClient(${client.id})" class="text-red-400 hover:text-red-300 transition" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Filter Clients
function filterClients() {
    const searchTerm = document.getElementById('client-search').value.toLowerCase();
    const planFilter = document.getElementById('client-filter').value;
    
    // This would typically filter from a database
    // For demo, we'll just reload all clients
    loadClients();
}

// Setup File Upload
function setupFileUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    
    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });
        
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
}

// Handle Files
function handleFiles(files) {
    const validFiles = Array.from(files).filter(file => {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        return validTypes.includes(file.type) && file.size <= maxSize;
    });
    
    if (validFiles.length === 0) {
        showNotification('Nenhum arquivo válido selecionado', 'error');
        return;
    }
    
    uploadFiles(validFiles);
}

// Upload Files
function uploadFiles(files) {
    showLoading('Fazendo upload dos arquivos...');
    
    // Simulate upload process
    setTimeout(() => {
        hideLoading();
        
        // Add files to list
        const filesList = document.getElementById('files-list');
        files.forEach(file => {
            const fileItem = createFileItem(file);
            filesList.appendChild(fileItem);
        });
        
        showNotification(`${files.length} arquivo(s) enviado(s) com sucesso`, 'success');
        
        // Clear file input
        document.getElementById('file-input').value = '';
        
        // Update activity log
        addActivity('upload', `${files.length} arquivo(s) enviado(s)`);
    }, 2000);
}

// Create File Item
function createFileItem(file) {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between bg-white bg-opacity-5 rounded-lg p-3 border border-white border-opacity-10';
    
    const fileIcon = getFileIcon(file.type);
    const fileSize = formatFileSize(file.size);
    
    item.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="${fileIcon} text-2xl text-purple-400"></i>
            <div>
                <div class="font-semibold">${file.name}</div>
                <div class="text-xs text-gray-400">${fileSize}</div>
            </div>
        </div>
        <div class="flex space-x-2">
            <button onclick="downloadFile('${file.name}')" class="text-blue-400 hover:text-blue-300 transition" title="Download">
                <i class="fas fa-download"></i>
            </button>
            <button onclick="deleteFile('${file.name}')" class="text-red-400 hover:text-red-300 transition" title="Excluir">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return item;
}

// Get File Icon
function getFileIcon(fileType) {
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word')) return 'fas fa-file-word';
    if (fileType.includes('image')) return 'fas fa-file-image';
    return 'fas fa-file';
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load Courses
function loadCourses() {
    const mockCourses = [
        {
            id: 1,
            title: 'Curso de Meditação Guiada',
            category: 'meditation',
            price: 197.00,
            duration: 8,
            level: 'beginner',
            students: 45,
            rating: 4.8,
            status: 'active',
            createdAt: '2024-01-10',
            image: 'meditation-course.jpg'
        },
        {
            id: 2,
            title: 'Reiki Nível 1',
            category: 'reiki',
            price: 297.00,
            duration: 12,
            level: 'beginner',
            students: 32,
            rating: 4.9,
            status: 'active',
            createdAt: '2024-01-08',
            image: 'reiki-course.jpg'
        },
        {
            id: 3,
            title: 'Terapia com Cristais',
            category: 'crystals',
            price: 247.00,
            duration: 10,
            level: 'intermediate',
            students: 28,
            rating: 4.7,
            status: 'active',
            createdAt: '2024-01-05',
            image: 'crystals-course.jpg'
        },
        {
            id: 4,
            title: 'Astrologia Básica',
            category: 'astrology',
            price: 347.00,
            duration: 16,
            level: 'beginner',
            students: 18,
            rating: 4.6,
            status: 'draft',
            createdAt: '2024-01-03',
            image: 'astrology-course.jpg'
        }
    ];
    
    renderCoursesList(mockCourses);
}

// Render Courses List
function renderCoursesList(courses) {
    const coursesList = document.getElementById('courses-list');
    coursesList.innerHTML = '';
    
    courses.forEach(course => {
        const courseItem = createCourseItem(course);
        coursesList.appendChild(courseItem);
    });
}

// Create Course Item
function createCourseItem(course) {
    const item = document.createElement('div');
    item.className = 'bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10';
    
    const categoryColors = {
        meditation: 'purple',
        reiki: 'green',
        crystals: 'pink',
        astrology: 'blue',
        therapy: 'yellow',
        wellness: 'indigo'
    };
    
    const categoryColor = categoryColors[course.category] || 'gray';
    
    const statusColors = {
        active: 'green',
        draft: 'yellow',
        archived: 'gray'
    };
    
    const statusColor = statusColors[course.status] || 'gray';
    
    const levelText = {
        beginner: 'Iniciante',
        intermediate: 'Intermediário',
        advanced: 'Avançado'
    };
    
    const categoryText = {
        meditation: 'Meditação',
        reiki: 'Reiki',
        crystals: 'Cristais',
        astrology: 'Astrologia',
        therapy: 'Terapia',
        wellness: 'Bem-estar'
    };
    
    item.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-${categoryColor}-600 rounded-lg flex items-center justify-center">
                    <i class="fas fa-book text-white text-xl"></i>
                </div>
                <div>
                    <h4 class="font-semibold text-lg">${course.title}</h4>
                    <div class="flex items-center space-x-3 text-sm text-gray-400">
                        <span class="bg-${categoryColor}-600 bg-opacity-20 px-2 py-1 rounded text-xs text-${categoryColor}-300">
                            ${categoryText[course.category]}
                        </span>
                        <span>${levelText[course.level]}</span>
                        <span>${course.duration}h</span>
                        <span class="flex items-center">
                            <i class="fas fa-star text-yellow-400 mr-1"></i>${course.rating}
                        </span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <span>${course.students} alunos</span>
                        <span>R$ ${course.price.toFixed(2)}</span>
                        <span class="bg-${statusColor}-600 bg-opacity-20 px-2 py-1 rounded text-xs text-${statusColor}-300">
                            ${course.status === 'active' ? 'Ativo' : course.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex space-x-2">
                <button onclick="viewCourse(${course.id})" class="text-blue-400 hover:text-blue-300 transition" title="Ver">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editCourse(${course.id})" class="text-green-400 hover:text-green-300 transition" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="duplicateCourse(${course.id})" class="text-purple-400 hover:text-purple-300 transition" title="Duplicar">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="deleteCourse(${course.id})" class="text-red-400 hover:text-red-300 transition" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return item;
}

// Setup Course Upload
function setupCourseUpload() {
    // Course image upload
    document.getElementById('course-image').addEventListener('change', previewCourseImage);
    
    // Course materials upload
    document.getElementById('course-materials').addEventListener('change', previewCourseMaterials);
}

// Preview Course Image
function previewCourseImage(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('course-image-preview');
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-lg">`;
        };
        reader.readAsDataURL(file);
    }
}

// Preview Course Materials
function previewCourseMaterials(e) {
    const files = e.target.files;
    const list = document.getElementById('course-materials-list');
    list.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'flex items-center justify-between bg-white bg-opacity-5 rounded p-2';
        
        const fileIcon = getFileIcon(file.type);
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="${fileIcon} text-purple-400"></i>
                <span class="text-sm">${file.name}</span>
                <span class="text-xs text-gray-400">(${fileSize})</span>
            </div>
            <button type="button" onclick="this.parentElement.remove()" class="text-red-400 hover:text-red-300">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        list.appendChild(fileItem);
    });
}

// Course Upload Modal Functions
function showCourseUploadModal() {
    document.getElementById('course-upload-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCourseUploadModal() {
    const modal = document.getElementById('course-upload-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('course-form');
        if (form) {
            form.reset();
        }
        
        document.getElementById('course-image-preview').innerHTML = '<i class="fas fa-image text-gray-400 text-2xl"></i>';
        document.getElementById('course-materials-list').innerHTML = '';
        
        // Reset modules to just one
        const modulesContainer = document.getElementById('course-modules');
        modulesContainer.innerHTML = `
            <div class="module-item bg-white bg-opacity-5 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold">Módulo 1</h4>
                    <button type="button" onclick="removeModule(this)" class="text-red-400 hover:text-red-300">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <input type="text" placeholder="Título do módulo" class="form-input w-full mb-2">
                <textarea placeholder="Descrição do módulo" rows="2" class="form-input w-full"></textarea>
        <div class="module-item bg-white bg-opacity-5 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
                <h4 class="font-semibold">Módulo 1</h4>
                <button type="button" onclick="removeModule(this)" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <input type="text" placeholder="Título do módulo" class="form-input w-full mb-2">
            <textarea placeholder="Descrição do módulo" rows="2" class="form-input w-full"></textarea>
        </div>
    `;
}

// Add Module
function addModule() {
    const modulesContainer = document.getElementById('course-modules');
    const moduleCount = modulesContainer.children.length + 1;
    
    const moduleItem = document.createElement('div');
    moduleItem.className = 'module-item bg-white bg-opacity-5 rounded-lg p-4';
    moduleItem.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold">Módulo ${moduleCount}</h4>
            <button type="button" onclick="removeModule(this)" class="text-red-400 hover:text-red-300">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <input type="text" placeholder="Título do módulo" class="form-input w-full mb-2">
        <textarea placeholder="Descrição do módulo" rows="2" class="form-input w-full"></textarea>
    `;
    
    modulesContainer.appendChild(moduleItem);
}

// Remove Module
function removeModule(button) {
    const modulesContainer = document.getElementById('course-modules');
    if (modulesContainer.children.length > 1) {
        button.closest('.module-item').remove();
        
        // Renumber remaining modules
        Array.from(modulesContainer.children).forEach((module, index) => {
            module.querySelector('h4').textContent = `Módulo ${index + 1}`;
        });
    } else {
        showNotification('O curso deve ter pelo menos um módulo', 'error');
    }
}

// Save Course
function saveCourse() {
    const form = document.getElementById('course-form');
    const formData = new FormData(form);
    
    // Validate required fields
    const title = document.getElementById('course-title').value;
    const category = document.getElementById('course-category').value;
    const description = document.getElementById('course-description').value;
    const price = document.getElementById('course-price').value;
    const duration = document.getElementById('course-duration').value;
    const level = document.getElementById('course-level').value;
    
    if (!title || !category || !description || !price || !duration || !level) {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    // Collect modules
    const modules = [];
    const moduleItems = document.querySelectorAll('.module-item');
    
    moduleItems.forEach((item, index) => {
        const moduleTitle = item.querySelector('input').value;
        const moduleDescription = item.querySelector('textarea').value;
        
        if (moduleTitle && moduleDescription) {
            modules.push({
                id: index + 1,
                title: moduleTitle,
                description: moduleDescription
            });
        }
    });
    
    if (modules.length === 0) {
        showNotification('Adicione pelo menos um módulo ao curso', 'error');
        return;
    }
    
    // Create course object
    const course = {
        id: Date.now(),
        title: title,
        category: category,
        description: description,
        price: parseFloat(price),
        duration: parseInt(duration),
        level: level,
        modules: modules,
        status: 'draft',
        createdAt: new Date().toISOString(),
        students: 0,
        rating: 0
    };
    
    // Show loading
    showLoading('Salvando curso...');
    
    // Simulate save process
    setTimeout(() => {
        hideLoading();
        
        // Save to localStorage
        const courses = JSON.parse(localStorage.getItem('berhu_courses') || '[]');
        courses.push(course);
        localStorage.setItem('berhu_courses', JSON.stringify(courses));
        
        // Update UI
        loadCourses();
        closeCourseUploadModal();
        
        // Show success message
        showNotification('Curso salvo com sucesso!', 'success');
        
        // Add activity log
        addActivity('course', `Curso "${title}" criado`);
    }, 2000);
}

// Course Management Functions
function viewCourse(courseId) {
    showNotification(`Visualizando curso #${courseId}`, 'info');
}

function editCourse(courseId) {
    showNotification(`Editando curso #${courseId}`, 'info');
}

function duplicateCourse(courseId) {
    if (confirm('Deseja duplicar este curso?')) {
        showNotification(`Curso #${courseId} duplicado`, 'success');
        addActivity('course', `Curso #${courseId} duplicado`);
        loadCourses();
    }
}

function deleteCourse(courseId) {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
        showNotification(`Curso #${courseId} excluído`, 'success');
        addActivity('delete', `Curso #${courseId} excluído`);
        loadCourses();
    }
}

// Load Files
function loadFiles() {
    const mockFiles = [
        { name: 'guia_meditacao.pdf', type: 'application/pdf', size: 2048576, uploadedAt: '2024-01-15' },
        { name: 'terapia_cristais.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1048576, uploadedAt: '2024-01-14' },
        { name: 'logo_berhu.png', type: 'image/png', size: 524288, uploadedAt: '2024-01-13' }
    ];
    
    const filesList = document.getElementById('files-list');
    filesList.innerHTML = '';
    
    mockFiles.forEach(file => {
        const fileItem = createFileItem(file);
        filesList.appendChild(fileItem);
    });
}

// Load Activity Log
function loadActivityLog() {
    const mockActivities = [
        { action: 'login', user: 'Fabiana Berkana', timestamp: '2024-01-15 14:30', details: 'Acesso ao painel terapêutico' },
        { action: 'evaluation', user: 'Fabiana Berkana', timestamp: '2024-01-15 13:45', details: 'Avaliação da cliente: Usuária Demo' },
        { action: 'appointment', user: 'Usuária Demo', timestamp: '2024-01-15 10:20', details: 'Agendamento: Reiki' },
        { action: 'purchase', user: 'João Silva', timestamp: '2024-01-14 16:15', details: 'Compra: Curso de Meditação' },
        { action: 'upload', user: 'Administrador', timestamp: '2024-01-14 09:30', details: 'Upload: 3 arquivos' }
    ];
    
    const activityLog = document.getElementById('activity-log');
    activityLog.innerHTML = '';
    
    mockActivities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityLog.appendChild(activityItem);
    });
}

// Create Activity Item
function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between bg-white bg-opacity-5 rounded-lg p-3 border border-white border-opacity-10';
    
    const actionIcon = getActivityIcon(activity.action);
    const actionColor = getActivityColor(activity.action);
    
    item.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="${actionIcon} text-${actionColor}-400"></i>
            <div>
                <div class="font-semibold">${activity.user}</div>
                <div class="text-sm text-gray-300">${activity.details}</div>
            </div>
        </div>
        <div class="text-xs text-gray-400">${activity.timestamp}</div>
    `;
    
    return item;
}

// Get Activity Icon
function getActivityIcon(action) {
    const icons = {
        login: 'fas fa-sign-in-alt',
        evaluation: 'fas fa-clipboard-check',
        appointment: 'fas fa-calendar-check',
        purchase: 'fas fa-shopping-cart',
        upload: 'fas fa-upload',
        delete: 'fas fa-trash'
    };
    return icons[action] || 'fas fa-info-circle';
}

// Get Activity Color
function getActivityColor(action) {
    const colors = {
        login: 'blue',
        evaluation: 'purple',
        appointment: 'green',
        purchase: 'yellow',
        upload: 'blue',
        delete: 'red'
    };
    return colors[action] || 'gray';
}

// Load Recent Activities
function loadRecentActivities() {
    const recentActivities = document.getElementById('recent-activities');
    
    // Load last 5 activities
    const activities = [
        { action: 'Novo cliente cadastrado', time: '5 minutos atrás' },
        { action: '3 avaliações concluídas', time: '1 hora atrás' },
        { action: 'Upload de materiais', time: '2 horas atrás' },
        { action: 'Backup realizado', time: '3 horas atrás' },
        { action: 'Sistema atualizado', time: '1 dia atrás' }
    ];
    
    recentActivities.innerHTML = '';
    
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between text-sm';
        item.innerHTML = `
            <span class="text-gray-300">${activity.action}</span>
            <span class="text-gray-400 text-xs">${activity.time}</span>
        `;
        recentActivities.appendChild(item);
    });
}

// Add Activity
function addActivity(action, details) {
    const activity = {
        action: action,
        user: window.currentUser.name,
        timestamp: new Date().toLocaleString('pt-BR'),
        details: details
    };
    
    // Add to activity log
    const activityLog = document.getElementById('activity-log');
    const activityItem = createActivityItem(activity);
    activityLog.insertBefore(activityItem, activityLog.firstChild);
    
    // Update recent activities
    loadRecentActivities();
}

// Modal Functions
function showUploadModal() {
    document.getElementById('upload-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeUploadModal() {
    document.getElementById('upload-modal').classList.add('hidden');
    document.body.style.overflow = '';
    document.getElementById('modal-file-input').value = '';
    document.getElementById('upload-preview').innerHTML = '';
}

function previewFiles(e) {
    const files = e.target.files;
    const preview = document.getElementById('upload-preview');
    preview.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'flex items-center justify-between bg-white bg-opacity-5 rounded p-2';
        fileItem.innerHTML = `
            <span class="text-sm">${file.name}</span>
            <span class="text-xs text-gray-400">${formatFileSize(file.size)}</span>
        `;
        preview.appendChild(fileItem);
    });
}

// Client Management Functions
function viewClient(clientId) {
    showNotification(`Visualizando cliente #${clientId}`, 'info');
}

function editClient(clientId) {
    showNotification(`Editando cliente #${clientId}`, 'info');
}

    function deleteClient(clientId) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        showNotification(`Cliente #${clientId} excluído`, 'success');
        addActivity('delete', `Cliente #${clientId} excluído`);
        loadClients();
    }
}

// Show Add Client Modal
function showAddClientModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content max-w-2xl">
            <div class="modal-header">
                <h3 class="modal-title">Adicionar Novo Cliente</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="add-client-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Nome Completo</label>
                            <input type="text" id="client-name" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Email</label>
                            <input type="email" id="client-email" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Telefone</label>
                            <input type="tel" id="client-phone" class="form-input w-full" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Data de Nascimento</label>
                            <input type="date" id="client-birthdate" class="form-input w-full" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Plano</label>
                        <select id="client-plan" class="form-input w-full" required>
                            <option value="">Selecione...</option>
                            <option value="basic">Básico</option>
                            <option value="premium">Premium</option>
                            <option value="vip">VIP</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Observações</label>
                        <textarea id="client-notes" rows="3" class="form-input w-full" placeholder="Observações sobre o cliente..."></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                <button type="button" onclick="saveNewClient()" class="btn btn-primary">
                    <i class="fas fa-save mr-2"></i>Salvar Cliente
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Save New Client
function saveNewClient() {
    const name = document.getElementById('client-name').value;
    const email = document.getElementById('client-email').value;
    const phone = document.getElementById('client-phone').value;
    const birthdate = document.getElementById('client-birthdate').value;
    const plan = document.getElementById('client-plan').value;
    const notes = document.getElementById('client-notes').value;
    
    if (!name || !email || !phone || !birthdate || !plan) {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    const newClient = {
        id: Date.now(),
        name,
        email,
        phone,
        birthdate,
        plan,
        notes,
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    // Save to localStorage
    const clients = JSON.parse(localStorage.getItem('berhu_clients') || '[]');
    clients.push(newClient);
    localStorage.setItem('berhu_clients', JSON.stringify(clients));
    
    // Update UI
    loadClients();
    
    // Close modal
    document.querySelector('.modal').remove();
    document.body.style.overflow = '';
    
    // Show success
    showNotification('Cliente adicionado com sucesso!', 'success');
    addActivity('client', `Cliente "${name}" adicionado`);
}

// File Management Functions
function downloadFile(filename) {
    showNotification(`Baixando arquivo: ${filename}`, 'info');
}

function deleteFile(filename) {
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
        showNotification(`Arquivo ${filename} excluído`, 'success');
        addActivity('delete', `Arquivo ${filename} excluído`);
        loadFiles();
    }
}

// Admin Functions
function exportData() {
    showNotification('Exportando dados do sistema...', 'info');
    
    // Collect all data
    const data = {
        clients: JSON.parse(localStorage.getItem('berhu_clients') || '[]'),
        courses: JSON.parse(localStorage.getItem('berhu_courses') || '[]'),
        activities: JSON.parse(localStorage.getItem('berhu_activities') || '[]'),
        exportDate: new Date().toISOString(),
        exportedBy: window.currentUser.name
    };
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Clients CSV
    csvContent += "CLIENTES\n";
    csvContent += "Nome,Email,Telefone,Data de Nascimento,Plano,Status,Criado em\n";
    data.clients.forEach(client => {
        csvContent += `"${client.name}","${client.email}","${client.phone}","${client.birthdate}","${client.plan}","${client.status}","${client.createdAt}"\n`;
    });
    
    csvContent += "\nCURSOS\n";
    csvContent += "Título,Categoria,Duração,Preço,Nível,Status,Criado em\n";
    data.courses.forEach(course => {
        csvContent += `"${course.title}","${course.category}","${course.duration}","${course.price}","${course.level}","${course.status}","${course.createdAt}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `berhu_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
        showNotification('Dados exportados com sucesso!', 'success');
        addActivity('export', 'Exportação de dados realizada');
    }, 1000);
}

function showReportsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content max-w-4xl">
            <div class="modal-header">
                <h3 class="modal-title">Relatórios do Sistema</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Clients Report -->
                    <div class="bg-white bg-opacity-10 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold">Clientes</h4>
                            <i class="fas fa-users text-blue-400 text-2xl"></i>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Total:</span>
                                <span class="font-semibold">${JSON.parse(localStorage.getItem('berhu_clients') || '[]').length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Ativos:</span>
                                <span class="text-green-400">${JSON.parse(localStorage.getItem('berhu_clients') || '[]').filter(c => c.status === 'active').length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Premium:</span>
                                <span class="text-purple-400">${JSON.parse(localStorage.getItem('berhu_clients') || '[]').filter(c => c.plan === 'premium').length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Courses Report -->
                    <div class="bg-white bg-opacity-10 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold">Cursos</h4>
                            <i class="fas fa-graduation-cap text-green-400 text-2xl"></i>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Total:</span>
                                <span class="font-semibold">${JSON.parse(localStorage.getItem('berhu_courses') || '[]').length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Ativos:</span>
                                <span class="text-green-400">${JSON.parse(localStorage.getItem('berhu_courses') || '[]').filter(c => c.status === 'active').length}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Rascunhos:</span>
                                <span class="text-yellow-400">${JSON.parse(localStorage.getItem('berhu_courses') || '[]').filter(c => c.status === 'draft').length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Revenue Report -->
                    <div class="bg-white bg-opacity-10 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold">Receitas</h4>
                            <i class="fas fa-dollar-sign text-yellow-400 text-2xl"></i>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Total:</span>
                                <span class="font-semibold">R$ ${JSON.parse(localStorage.getItem('berhu_courses') || '[]').reduce((sum, c) => sum + (c.price || 0), 0).toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Este mês:</span>
                                <span class="text-green-400">R$ ${(Math.random() * 5000 + 2000).toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Média:</span>
                                <span class="text-blue-400">R$ ${(Math.random() * 500 + 200).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sessions Report -->
                    <div class="bg-white bg-opacity-10 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold">Sessões</h4>
                            <i class="fas fa-calendar-check text-purple-400 text-2xl"></i>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Este mês:</span>
                                <span class="font-semibold">${Math.floor(Math.random() * 50 + 20)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Concluídas:</span>
                                <span class="text-green-400">${Math.floor(Math.random() * 40 + 15)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Canceladas:</span>
                                <span class="text-red-400">${Math.floor(Math.random() * 10 + 2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Performance Report -->
                    <div class="bg-white bg-opacity-10 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold">Performance</h4>
                            <i class="fas fa-chart-line text-indigo-400 text-2xl"></i>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Satisfação:</span>
                                <span class="text-green-400">4.8/5.0</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Retenção:</span>
                                <span class="text-blue-400">87%</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Conversão:</span>
                                <span class="text-purple-400">23%</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- System Health -->
                    <div class="bg-white bg-opacity-10 rounded-lg p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-lg font-semibold">Sistema</h4>
                            <i class="fas fa-heartbeat text-red-400 text-2xl"></i>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Status:</span>
                                <span class="text-green-400">Online</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Uso:</span>
                                <span class="text-blue-400">45%</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Último backup:</span>
                                <span class="text-gray-400">2 horas atrás</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Fechar</button>
                <button type="button" onclick="generatePDFReport()" class="btn btn-primary">
                    <i class="fas fa-file-pdf mr-2"></i>Gerar PDF
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content max-w-2xl">
            <div class="modal-header">
                <h3 class="modal-title">Configurações do Sistema</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Configurações Gerais</h4>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Nome da Terapeuta:</label>
                                <input type="text" value="Fabiane Berkana" class="form-input w-64" readonly>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Email de Contato:</label>
                                <input type="email" value="fabiane@berhu.com" class="form-input w-64" readonly>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Telefone:</label>
                                <input type="tel" value="(11) 99999-8888" class="form-input w-64" readonly>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Configurações de Notificação</h4>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Notificações por Email:</label>
                                <input type="checkbox" checked class="form-checkbox">
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Alertas de Alto Risco:</label>
                                <input type="checkbox" checked class="form-checkbox">
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Lembretes de Sessão:</label>
                                <input type="checkbox" checked class="form-checkbox">
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Backup e Segurança</h4>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Backup Automático:</label>
                                <select class="form-input w-32">
                                    <option value="daily">Diário</option>
                                    <option value="weekly" selected>Semanal</option>
                                    <option value="monthly">Mensal</option>
                                </select>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Último Backup:</label>
                                <span class="text-gray-400">2 horas atrás</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-medium">Limpeza de Cache:</label>
                                <button class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                                    Limpar Cache
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
                <button type="button" onclick="saveSettings()" class="btn btn-primary">
                    <i class="fas fa-save mr-2"></i>Salvar Configurações
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Save Settings
function saveSettings() {
    showNotification('Configurações salvas com sucesso!', 'success');
    addActivity('settings', 'Configurações do sistema atualizadas');
    document.querySelector('.modal').remove();
    document.body.style.overflow = '';
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

// Show/Hide Loading
function showLoading(message = 'Carregando...') {
    if (window.Berhu && window.Berhu.showLoading) {
        window.Berhu.showLoading(message);
    } else {
        console.log('LOADING:', message);
    }
}

function hideLoading() {
    if (window.Berhu && window.Berhu.hideLoading) {
        window.Berhu.hideLoading();
    } else {
        console.log('LOADING HIDDEN');
    }
}

// Load Complete Service History
function loadServiceHistory() {
    const serviceHistoryTable = document.getElementById('service-history-table');
    const historyFilterClient = document.getElementById('history-filter-client');
    
    // Mock service history data with clinical information
    const mockServiceHistory = [
        {
            id: 1,
            date: '2024-01-15',
            time: '14:00',
            clientName: 'Usuária Demo',
            clientEmail: 'demo@berhu.com',
            type: 'Reiki',
            therapist: 'Fabiana Berkana',
            duration: 60,
            status: 'completed',
            rating: 5,
            price: 250,
            notes: 'Sessão energética poderosa com foco em alinhamento dos chakras.',
            // Clinical information
            clinicalNotes: 'Paciente apresenta ansiedade generalizada com sintomas de insônia. Relata melhora significativa após 3 sessões. Chakra cardíaco bloqueado emocionalmente.',
            symptoms: ['Ansiedade', 'Insônia', 'Estresse crônico'],
            diagnosis: 'Transtorno de Ansiedade Generalizada (TAG)',
            medications: ['Sertralina 50mg', 'Melatonina 3mg'],
            evolution: 'Boa resposta ao tratamento. Redução de 40% nos sintomas ansiosos.',
            recommendations: ['Continuar meditação diária', 'Técnicas de respiração', 'Acompanhamento quinzenal'],
            nextSession: '2024-01-22',
            riskLevel: 'Baixo',
            crisisHistory: 'Sem crises recentes. Última crise de pânico há 2 meses.'
        },
        {
            id: 2,
            date: '2024-01-14',
            time: '10:00',
            clientName: 'Maria Client',
            clientEmail: 'maria@berhu.com',
            type: 'Meditação Guiada',
            therapist: 'Fabiana Berkana',
            duration: 45,
            status: 'completed',
            rating: 4,
            price: 150,
            notes: 'Meditação profunda para redução de ansiedade e estresse.',
            // Clinical information
            clinicalNotes: 'Paciente com depressão leve. Dificuldade em aceitar perda recente. Trabalhando o luto através de meditações de aceitação.',
            symptoms: ['Depressão', 'Luto não resolvido', 'Baixa autoestima'],
            diagnosis: 'Episódio Depressivo Leve',
            medications: ['Fluoxetina 20mg'],
            evolution: 'Resposta moderada. Ainda com dificuldades emocionais, mas com melhora na aceitação.',
            recommendations: ['Técnicas de mindfulness', 'Grupos de apoio', 'Exercícios físicos leves'],
            nextSession: '2024-01-21',
            riskLevel: 'Moderado',
            crisisHistory: 'Histórico de ideação suicida no passado. Monitoramento necessário.'
        },
        {
            id: 3,
            date: '2024-01-13',
            time: '16:00',
            clientName: 'João Silva',
            clientEmail: 'joao@berhu.com',
            type: 'Cristais',
            therapist: 'Fabiana Berkana',
            duration: 90,
            status: 'completed',
            rating: 5,
            price: 300,
            notes: 'Terapia com cristais e pedras energéticas.',
            // Clinical information
            clinicalNotes: 'Paciente com burnout profissional. Alta irritabilidade e esgotamento emocional. Cristais de ametista e quartzo rosa mostraram boa resposta.',
            symptoms: ['Burnout', 'Irritabilidade', 'Esgotamento emocional', 'Dores de cabeça tensionais'],
            diagnosis: 'Síndrome de Burnout',
            medications: ['Não utiliza medicação'],
            evolution: 'Excelente resposta. Redução significativa dos sintomas após 2 sessões.',
            recommendations: ['Equilíbrio trabalho-vida', 'Técnicas de relaxamento', 'Férias programadas'],
            nextSession: '2024-01-20',
            riskLevel: 'Baixo',
            crisisHistory: 'Sem histórico de crises. Estável emocionalmente.'
        },
        {
            id: 4,
            date: '2024-01-12',
            time: '09:00',
            clientName: 'Ana Santos',
            clientEmail: 'ana@berhu.com',
            type: 'Astrologia',
            therapist: 'Fabiana Berkana',
            duration: 60,
            status: 'completed',
            rating: 4,
            price: 200,
            notes: 'Mapa astral e consultas astrológicas.',
            // Clinical information
            clinicalNotes: 'Paciente com transtorno de personalidade borderline. Instabilidade emocional e relacionamentos conturbados. Trabalhando autoconhecimento através da astrologia terapêutica.',
            symptoms: ['Instabilidade emocional', 'Medo de abandono', 'Autoimagem distorcida'],
            diagnosis: 'Transtorno de Personalidade Borderline',
            medications: ['Olanzapina 5mg', 'Diazepam 5mg (SOS)'],
            evolution: 'Resposta lenta mas consistente. Melhora na regulação emocional.',
            recommendations: ['Terapia dialético-comportamental', 'Grupo de habilidades sociais', 'Diário emocional'],
            nextSession: '2024-01-19',
            riskLevel: 'Alto',
            crisisHistory: 'Múltiplas crises de autoagressão. Hospitalizada 2 vezes no último ano.'
        },
        {
            id: 5,
            date: '2024-01-11',
            time: '15:00',
            clientName: 'Carlos Oliveira',
            clientEmail: 'carlos@berhu.com',
            type: 'Reiki',
            therapist: 'Fabiana Berkana',
            duration: 60,
            status: 'cancelled',
            rating: 0,
            price: 0,
            notes: 'Cliente cancelou com 24h de antecedência.',
            // Clinical information
            clinicalNotes: 'Paciente com TOC (Transtorno Obsessivo-Compulsivo). Compulsões de verificação e contaminação. Alto nível de ansiedade.',
            symptoms: ['TOC', 'Compulsões', 'Ansiedade severa', 'Depressão secundária'],
            diagnosis: 'Transtorno Obsessivo-Compulsivo',
            medications: ['Fluvoxamina 100mg', 'Clonazepam 0.5mg'],
            evolution: 'Resposta parcial. Compulsões reduzidas em 30%, mas ainda presentes.',
            recommendations: ['ERP (Terapia de Exposição e Prevenção de Resposta)', 'Mindfulness', 'Exercícios de relaxamento'],
            nextSession: 'A ser reagendado',
            riskLevel: 'Moderado',
            crisisHistory: 'Crises de pânico quando exposto a contaminantes. Histórico de internamento.'
        },
        {
            id: 6,
            date: '2024-01-10',
            time: '11:00',
            clientName: 'Usuária Demo',
            clientEmail: 'demo@berhu.com',
            type: 'Limpeza Áurica',
            therapist: 'Fabiana Berkana',
            duration: 75,
            status: 'completed',
            rating: 5,
            price: 280,
            notes: 'Remoção de energias densas e revitalização do campo energético.',
            // Clinical information
            clinicalNotes: 'Sessão de acompanhamento. Paciente relatando sonhos mais tranquilos e redução da insônia. Campo áurico mais limpo e vibrante.',
            symptoms: ['Ansiedade (em remissão parcial)', 'Insônia (melhorada)', 'Estresse crônico'],
            diagnosis: 'Transtorno de Ansiedade Generalizada (em remissão parcial)',
            medications: ['Sertralina 50mg', 'Melatonina 3mg'],
            evolution: 'Excelente evolução. Paciente mais estável emocionalmente.',
            recommendations: ['Manter meditação', 'Reduzir carga de trabalho', 'Continuar acompanhamento'],
            nextSession: '2024-01-24',
            riskLevel: 'Baixo',
            crisisHistory: 'Sem crises recentes. Estável.'
        }
    ];
    
    // Store globally for filtering
    window.serviceHistoryData = mockServiceHistory;
    
    // Populate client filter
    const clients = [...new Set(mockServiceHistory.map(s => s.clientName))];
    historyFilterClient.innerHTML = '<option value="">Todos os Clientes</option>';
    clients.forEach(client => {
        historyFilterClient.innerHTML += `<option value="${client}">${client}</option>`;
    });
    
    // Render service history
    renderServiceHistory(mockServiceHistory);
    
    // Update statistics
    updateServiceHistoryStats(mockServiceHistory);
}

// Render Service History Table (Clinical Records)
function renderServiceHistory(historyData) {
    const serviceHistoryTable = document.getElementById('service-history-table');
    
    if (!historyData || historyData.length === 0) {
        serviceHistoryTable.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-8 text-gray-400">
                    Nenhum prontuário encontrado
                </td>
            </tr>
        `;
        return;
    }
    
    serviceHistoryTable.innerHTML = historyData.map(session => `
        <tr class="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5">
            <td class="py-3 px-4">
                <div>
                    <div class="font-medium">${formatDate(session.date)}</div>
                    <div class="text-sm text-gray-400">${session.time}</div>
                </div>
            </td>
            <td class="py-3 px-4">
                <div>
                    <div class="font-medium">${session.clientName}</div>
                    <div class="text-sm text-gray-400">${session.clientEmail}</div>
                </div>
            </td>
            <td class="py-3 px-4">
                <div class="text-sm">
                    <div class="font-medium">${session.diagnosis}</div>
                    <div class="text-xs text-gray-400">${session.symptoms.slice(0, 2).join(', ')}${session.symptoms.length > 2 ? '...' : ''}</div>
                </div>
            </td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(session.riskLevel)}">
                    ${session.riskLevel}
                </span>
            </td>
            <td class="py-3 px-4">${session.therapist}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.status)}">
                    ${getStatusText(session.status)}
                </span>
            </td>
            <td class="py-3 px-4">
                <div class="flex space-x-2">
                    <button onclick="viewSessionDetails(${session.id})" class="text-blue-400 hover:text-blue-300" title="Ver Prontuário Completo">
                        <i class="fas fa-file-medical"></i>
                    </button>
                    <button onclick="printMedicalRecord(${session.id})" class="text-green-400 hover:text-green-300" title="Imprimir Prontuário">
                        <i class="fas fa-print"></i>
                    </button>
                    <button onclick="editMedicalRecord(${session.id})" class="text-yellow-400 hover:text-yellow-300" title="Editar Prontuário">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Filter Service History
function filterServiceHistory() {
    const clientFilter = document.getElementById('history-filter-client').value;
    const periodFilter = document.getElementById('history-filter-period').value;
    
    let filteredData = [...window.serviceHistoryData];
    
    // Filter by client
    if (clientFilter) {
        filteredData = filteredData.filter(session => session.clientName === clientFilter);
    }
    
    // Filter by period
    if (periodFilter !== 'all') {
        const days = parseInt(periodFilter);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        filteredData = filteredData.filter(session => new Date(session.date) >= cutoffDate);
    }
    
    // Sort by date (most recent first)
    filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    renderServiceHistory(filteredData);
    updateServiceHistoryStats(filteredData);
}

// Update Service History Statistics
function updateServiceHistoryStats(historyData) {
    const totalSessions = historyData.length;
    const completedSessions = historyData.filter(s => s.status === 'completed').length;
    const ratings = historyData.filter(s => s.rating > 0).map(s => s.rating);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '0.0';
    const revenue = historyData.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.price, 0);
    
    document.getElementById('total-sessions').textContent = totalSessions;
    document.getElementById('completed-sessions').textContent = completedSessions;
    document.getElementById('avg-rating').textContent = avgRating;
    document.getElementById('revenue').textContent = `R$ ${revenue.toLocaleString('pt-BR')}`;
}

// View Session Details (Clinical Record)
function viewSessionDetails(sessionId) {
    const session = window.serviceHistoryData.find(s => s.id === sessionId);
    if (!session) return;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 max-w-4xl w-full mx-4 border border-white border-opacity-20 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-semibold text-white">Prontuário Clínico Completo</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-gray-300">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <!-- Patient Information -->
            <div class="bg-purple-600 bg-opacity-20 rounded-lg p-4 mb-6">
                <h4 class="text-lg font-semibold text-purple-300 mb-3">Informações do Paciente</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label class="text-sm text-gray-400">Nome</label>
                        <p class="text-white font-medium">${session.clientName}</p>
                    </div>
                    <div>
                        <label class="text-sm text-gray-400">Email</label>
                        <p class="text-white">${session.clientEmail}</p>
                    </div>
                    <div>
                        <label class="text-sm text-gray-400">Data da Sessão</label>
                        <p class="text-white">${formatDate(session.date)} às ${session.time}</p>
                    </div>
                    <div>
                        <label class="text-sm text-gray-400">Próxima Sessão</label>
                        <p class="text-white">${session.nextSession || 'A definir'}</p>
                    </div>
                </div>
            </div>
            
            <!-- Clinical Assessment -->
            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <div class="bg-blue-600 bg-opacity-20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-blue-300 mb-3">Avaliação Clínica</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="text-sm text-gray-400">Diagnóstico</label>
                            <p class="text-white font-medium">${session.diagnosis}</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">Sintomas Principais</label>
                            <div class="flex flex-wrap gap-2 mt-1">
                                ${session.symptoms.map(symptom => `
                                    <span class="px-2 py-1 bg-blue-600 bg-opacity-30 rounded text-xs text-white">
                                        ${symptom}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">Nível de Risco</label>
                            <p class="text-white">
                                <span class="px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(session.riskLevel)}">
                                    ${session.riskLevel}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-600 bg-opacity-20 rounded-lg p-4">
                    <h4 class="text-lg font-semibold text-green-300 mb-3">Tratamento</h4>
                    <div class="space-y-3">
                        <div>
                            <label class="text-sm text-gray-400">Medicações</label>
                            <div class="space-y-1">
                                ${session.medications.map(med => `
                                    <p class="text-white text-sm">• ${med}</p>
                                `).join('')}
                            </div>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">Evolução</label>
                            <p class="text-white text-sm">${session.evolution}</p>
                        </div>
                        <div>
                            <label class="text-sm text-gray-400">Recomendações</label>
                            <div class="space-y-1">
                                ${session.recommendations.map(rec => `
                                    <p class="text-white text-sm">• ${rec}</p>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Session Details -->
            <div class="bg-yellow-600 bg-opacity-20 rounded-lg p-4 mb-6">
                <h4 class="text-lg font-semibold text-yellow-300 mb-3">Detalhes da Sessão</h4>
                <div class="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="text-sm text-gray-400">Tipo de Terapia</label>
                        <p class="text-white">${session.type}</p>
                    </div>
                    <div>
                        <label class="text-sm text-gray-400">Terapeuta</label>
                        <p class="text-white">${session.therapist}</p>
                    </div>
                    <div>
                        <label class="text-sm text-gray-400">Duração</label>
                        <p class="text-white">${session.duration} minutos</p>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="text-sm text-gray-400">Notas Clínicas da Sessão</label>
                    <p class="text-white bg-black bg-opacity-20 p-3 rounded mt-1">${session.clinicalNotes}</p>
                </div>
                
                <div class="mb-4">
                    <label class="text-sm text-gray-400">Observações Gerais</label>
                    <p class="text-white bg-black bg-opacity-20 p-3 rounded mt-1">${session.notes}</p>
                </div>
                
                <div>
                    <label class="text-sm text-gray-400">Avaliação do Paciente</label>
                    <div class="flex items-center mt-1">
                        ${session.rating > 0 ? generateStars(session.rating) : '<span class="text-gray-400">Não avaliado</span>'}
                        <span class="ml-2 text-sm text-gray-400">(${session.rating}/5)</span>
                    </div>
                </div>
            </div>
            
            <!-- Crisis History -->
            <div class="bg-red-600 bg-opacity-20 rounded-lg p-4 mb-6">
                <h4 class="text-lg font-semibold text-red-300 mb-3">Histórico de Crises</h4>
                <p class="text-white bg-black bg-opacity-20 p-3 rounded">${session.crisisHistory}</p>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3">
                <button onclick="printMedicalRecord(${session.id})" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
                    <i class="fas fa-print mr-2"></i>Imprimir Prontuário
                </button>
                <button onclick="editMedicalRecord(${session.id})" class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition">
                    <i class="fas fa-edit mr-2"></i>Editar Prontuário
                </button>
                <button onclick="this.closest('.fixed').remove()" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition">
                    Fechar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Edit Session
function editSession(sessionId) {
    const session = window.serviceHistoryData.find(s => s.id === sessionId);
    if (!session) return;
    
    showNotification('Funcionalidade de edição em desenvolvimento', 'info');
}

// Delete Session
function deleteSession(sessionId) {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
        // Remove from global data
        window.serviceHistoryData = window.serviceHistoryData.filter(s => s.id !== sessionId);
        
        // Re-render
        filterServiceHistory();
        
        // Log activity
        logActivity('delete', `Sessão ${sessionId} excluída`);
        
        showNotification('Sessão excluída com sucesso', 'success');
    }
}

// Export Service History
function exportServiceHistory() {
    const data = window.serviceHistoryData;
    
    // Create CSV content
    const headers = ['Data', 'Cliente', 'Email', 'Tipo', 'Terapeuta', 'Duração', 'Status', 'Avaliação', 'Valor'];
    const csvContent = [
        headers.join(','),
        ...data.map(session => [
            session.date,
            session.clientName,
            session.clientEmail,
            session.type,
            session.therapist,
            session.duration,
            session.status,
            session.rating,
            session.price
        ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historico_atendimentos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Histórico exportado com sucesso', 'success');
}

// Helper Functions
function getServiceTypeColor(type) {
    const colors = {
        'Reiki': 'bg-purple-600 text-white',
        'Meditação Guiada': 'bg-blue-600 text-white',
        'Cristais': 'bg-green-600 text-white',
        'Astrologia': 'bg-yellow-600 text-white',
        'Limpeza Áurica': 'bg-pink-600 text-white'
    };
    return colors[type] || 'bg-gray-600 text-white';
}

function getStatusColor(status) {
    const colors = {
        'completed': 'bg-green-600 text-white',
        'cancelled': 'bg-red-600 text-white',
        'scheduled': 'bg-blue-600 text-white',
        'in-progress': 'bg-yellow-600 text-white'
    };
    return colors[status] || 'bg-gray-600 text-white';
}

function getStatusText(status) {
    const texts = {
        'completed': 'Concluída',
        'cancelled': 'Cancelada',
        'scheduled': 'Agendada',
        'in-progress': 'Em andamento'
    };
    return texts[status] || status;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'text-yellow-400' : 'text-gray-600'}"></i>`;
    }
    return stars;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Get Risk Level Color
function getRiskLevelColor(riskLevel) {
    const colors = {
        'Baixo': 'bg-green-600 text-white',
        'Moderado': 'bg-yellow-600 text-white',
        'Alto': 'bg-red-600 text-white'
    };
    return colors[riskLevel] || 'bg-gray-600 text-white';
}

// Print Medical Record
function printMedicalRecord(sessionId) {
    const session = window.serviceHistoryData.find(s => s.id === sessionId);
    if (!session) return;
    
    // Create printable content
    const printContent = `
        <html>
            <head>
                <title>Prontuário Clínico - ${session.clientName}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    .section h3 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
                    .field { margin-bottom: 10px; }
                    .field label { font-weight: bold; }
                    .risk-high { color: #dc2626; font-weight: bold; }
                    .risk-moderate { color: #f59e0b; font-weight: bold; }
                    .risk-low { color: #10b981; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Prontuário Clínico</h1>
                    <h2>${session.clientName}</h2>
                    <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="section">
                    <h3>Informações do Paciente</h3>
                    <div class="field"><label>Nome:</label> ${session.clientName}</div>
                    <div class="field"><label>Email:</label> ${session.clientEmail}</div>
                    <div class="field"><label>Data da Sessão:</label> ${formatDate(session.date)} às ${session.time}</div>
                </div>
                
                <div class="section">
                    <h3>Avaliação Clínica</h3>
                    <div class="field"><label>Diagnóstico:</label> ${session.diagnosis}</div>
                    <div class="field"><label>Sintomas:</label> ${session.symptoms.join(', ')}</div>
                    <div class="field"><label>Nível de Risco:</label> <span class="risk-${session.riskLevel.toLowerCase()}">${session.riskLevel}</span></div>
                </div>
                
                <div class="section">
                    <h3>Tratamento</h3>
                    <div class="field"><label>Medicações:</label> ${session.medications.join(', ')}</div>
                    <div class="field"><label>Evolução:</label> ${session.evolution}</div>
                    <div class="field"><label>Recomendações:</label> ${session.recommendations.join(', ')}</div>
                </div>
                
                <div class="section">
                    <h3>Sessão Atual</h3>
                    <div class="field"><label>Tipo:</label> ${session.type}</div>
                    <div class="field"><label>Terapeuta:</label> ${session.therapist}</div>
                    <div class="field"><label>Duração:</label> ${session.duration} minutos</div>
                    <div class="field"><label>Notas Clínicas:</label> ${session.clinicalNotes}</div>
                    <div class="field"><label>Observações:</label> ${session.notes}</div>
                </div>
                
                <div class="section">
                    <h3>Histórico de Crises</h3>
                    <div class="field">${session.crisisHistory}</div>
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

// Edit Medical Record
function editMedicalRecord(sessionId) {
    const session = window.serviceHistoryData.find(s => s.id === sessionId);
    if (!session) return;
    
    showNotification('Funcionalidade de edição de prontuário em desenvolvimento', 'info');
}

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close modals with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal:not(.hidden)');
            modals.forEach(modal => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
    
    // Prevent modal content clicks from closing modal
    document.addEventListener('click', function(e) {
        if (e.target.closest('.modal-content')) {
            e.stopPropagation();
        }
    });
});

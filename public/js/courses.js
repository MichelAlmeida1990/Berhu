// Courses Page JavaScript for Berhu Platform

// Courses Data
const coursesData = [
    {
        id: 1,
        title: "Meditação para Iniciantes",
        category: "meditation",
        price: 197,
        originalPrice: 297,
        rating: 4.8,
        students: 1234,
        duration: "6 semanas",
        level: "Iniciante",
        image: "https://picsum.photos/seed/meditation1/400/300.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Aprenda as bases da meditação e transforme sua vida com práticas simples e eficazes.",
        instructor: "Fabiana Berkana",
        lessons: 24,
        certificate: true,
        highlights: [
            "Técnicas de respiração",
            "Meditação guiada",
            "Mindfulness",
            "Redução de estresse"
        ]
    },
    {
        id: 2,
        title: "Reiki Nível 1 - Iniciação",
        category: "therapy",
        price: 297,
        originalPrice: 397,
        rating: 4.9,
        students: 892,
        duration: "8 semanas",
        level: "Iniciante",
        image: "https://picsum.photos/seed/reiki1/400/300.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Iniciação completa em Reiki, incluindo alinhamento dos chakras e técnicas de cura.",
        instructor: "Fabiana Berkana",
        lessons: 32,
        certificate: true,
        highlights: [
            "História do Reiki",
            "Posicionamento das mãos",
            "Auto-aplicação",
            "Cura em outros"
        ]
    },
    {
        id: 3,
        title: "Leitura de Mapa Astral",
        category: "workshop",
        price: 147,
        originalPrice: 197,
        rating: 4.7,
        students: 567,
        duration: "4 semanas",
        level: "Intermediário",
        image: "https://picsum.photos/seed/astrology1/400/300.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Aprenda a interpretar mapas astrais e entender as influências cósmicas em sua vida.",
        instructor: "Fabiana Berkana",
        lessons: 16,
        certificate: true,
        highlights: [
            "Signos e casas",
            "Planetas e aspectos",
            "Previsões astrológicas",
            "Sinastria"
        ]
    },
    {
        id: 4,
        title: "Terapia com Cristais",
        category: "therapy",
        price: 247,
        originalPrice: 347,
        rating: 4.6,
        students: 445,
        duration: "6 semanas",
        level: "Intermediário",
        image: "https://picsum.photos/seed/crystals1/400/300.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Domine a arte da terapia com cristais e pedras energéticas para cura e equilíbrio.",
        instructor: "Fabiana Berkana",
        lessons: 20,
        certificate: true,
        highlights: [
            "Propriedades dos cristais",
            "Limpeza energética",
            "Grades de cristais",
            "Meditação com cristais"
        ]
    },
    {
        id: 5,
        title: "E-book: Manual de Autoconhecimento",
        category: "ebook",
        price: 47,
        originalPrice: 97,
        rating: 4.5,
        students: 2341,
        duration: "Autônomo",
        level: "Todos",
        image: "https://picsum.photos/seed/ebook1/400/300.jpg",
        description: "Guia completo para autoconhecimento e desenvolvimento pessoal espiritual.",
        instructor: "Fabiana Berkana",
        lessons: 0,
        certificate: false,
        highlights: [
            "150+ páginas",
            "Exercícios práticos",
            "Meditações guiadas",
            "Download imediato"
        ]
    },
    {
        id: 6,
        title: "Workshop de Chakras",
        category: "workshop",
        price: 197,
        originalPrice: 247,
        rating: 4.8,
        students: 789,
        duration: "2 dias",
        level: "Iniciante",
        image: "https://picsum.photos/seed/chakras1/400/300.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Workshop intensivo para equilibrar e ativar seus centros energéticos.",
        instructor: "Fabiana Berkana",
        lessons: 8,
        certificate: true,
        highlights: [
            "7 chakras principais",
            "Diagnóstico energético",
            "Técnicas de ativação",
            "Meditações específicas"
        ]
    },
    {
        id: 7,
        title: "Curso Avançado de Meditação",
        category: "meditation",
        price: 397,
        originalPrice: 497,
        rating: 4.9,
        students: 234,
        duration: "12 semanas",
        level: "Avançado",
        image: "https://picsum.photos/seed/meditation2/400/300.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Aprofunde sua prática meditativa com técnicas avançadas e estados expandidos de consciência.",
        instructor: "Fabiana Berkana",
        lessons: 48,
        certificate: true,
        highlights: [
            "Meditação transcendental",
            "Estados alterados",
            "Visualização criativa",
            "Retiros espirituais"
        ]
    },
    {
        id: 8,
        title: "Numerologia Cabalística",
        category: "course",
        price: 347,
        originalPrice: 447,
        rating: 4.7,
        students: 156,
        duration: "8 semanas",
        level: "Intermediário",
        image: "https://picsum.photos/seed/numerology1/400/300.jpg",
        video: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Estudo profundo da numerologia e sua aplicação na vida prática e espiritual.",
        instructor: "Fabiana Berkana",
        lessons: 24,
        certificate: true,
        highlights: [
            "Números mestres",
            "Ano pessoal",
            "Compatibilidade",
            "Ciclos de vida"
        ]
    }
];

// Global Variables
let filteredCourses = [...coursesData];
let currentCourse = null;
let displayedCourses = 8;

// Initialize Courses Page
document.addEventListener('DOMContentLoaded', function() {
    initializeCourses();
});

// Initialize Courses
function initializeCourses() {
    checkSession();
    setupEventListeners();
    renderCourses();
    setupFilters();
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

// Setup Event Listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreCourses);
    }
    
    // Purchase button
    const purchaseBtn = document.getElementById('purchase-btn');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', purchaseCourse);
    }
}

// Setup Filters
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterCourses);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCourses);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterCourses);
    }
}

// Filter Courses
function filterCourses() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    
    // Filter by search and category
    filteredCourses = coursesData.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                            course.description.toLowerCase().includes(searchTerm) ||
                            course.instructor.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !category || course.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort courses
    switch(sortBy) {
        case 'popular':
            filteredCourses.sort((a, b) => b.students - a.students);
            break;
        case 'price-low':
            filteredCourses.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCourses.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredCourses.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
        default:
            filteredCourses.sort((a, b) => b.id - a.id);
            break;
    }
    
    // Reset displayed courses and re-render
    displayedCourses = 8;
    renderCourses();
}

// Render Courses
function renderCourses() {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const coursesToShow = filteredCourses.slice(0, displayedCourses);
    
    coursesToShow.forEach(course => {
        const courseCard = createCourseCard(course);
        grid.appendChild(courseCard);
    });
    
    // Update load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = filteredCourses.length > displayedCourses ? 'inline-flex' : 'none';
    }
    
    // Add animation
    setTimeout(() => {
        document.querySelectorAll('.course-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 100);
}

// Create Course Card
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card bg-white bg-opacity-10 backdrop-blur-lg rounded-xl overflow-hidden border border-white border-opacity-20';
    
    const categoryColors = {
        meditation: 'purple',
        therapy: 'green',
        workshop: 'blue',
        ebook: 'pink',
        course: 'yellow'
    };
    
    const categoryColor = categoryColors[course.category] || 'purple';
    
    card.innerHTML = `
        <div class="video-thumbnail relative h-48 cursor-pointer" onclick="openCourseModal(${course.id})">
            <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div class="play-button">
                    <i class="fas fa-play text-purple-600 text-xl ml-1"></i>
                </div>
            </div>
            <span class="category-badge absolute top-2 left-2 bg-${categoryColor}-600 bg-opacity-80 px-2 py-1 rounded text-xs font-semibold">
                ${getCategoryName(course.category)}
            </span>
            ${course.originalPrice > course.price ? `
                <span class="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    -${Math.round((1 - course.price / course.originalPrice) * 100)}%
                </span>
            ` : ''}
        </div>
        
        <div class="p-4">
            <h3 class="text-lg font-semibold mb-2 line-clamp-2">${course.title}</h3>
            <p class="text-gray-300 text-sm mb-3 line-clamp-2">${course.description}</p>
            
            <div class="flex items-center justify-between mb-3">
                <div class="star-rating text-sm">
                    ${generateStars(course.rating)}
                    <span class="text-gray-400 ml-1">(${course.rating})</span>
                </div>
                <span class="text-xs text-gray-400">
                    <i class="fas fa-users mr-1"></i>${course.students}
                </span>
            </div>
            
            <div class="flex items-center justify-between mb-3">
                <span class="text-xs text-gray-400">
                    <i class="fas fa-clock mr-1"></i>${course.duration}
                </span>
                <span class="text-xs text-gray-400">
                    <i class="fas fa-signal mr-1"></i>${course.level}
                </span>
            </div>
            
            <div class="flex items-center justify-between mb-4">
                <div>
                    ${course.originalPrice > course.price ? `
                        <span class="text-gray-400 line-through text-sm">R$ ${course.originalPrice}</span>
                    ` : ''}
                    <div class="text-xl font-bold text-${categoryColor}-300">R$ ${course.price}</div>
                </div>
                ${course.certificate ? `
                    <span class="text-xs bg-green-600 bg-opacity-20 px-2 py-1 rounded text-green-300">
                        <i class="fas fa-certificate mr-1"></i>Certificado
                    </span>
                ` : ''}
            </div>
            
            <button onclick="openCourseModal(${course.id})" 
                    class="w-full bg-${categoryColor}-600 hover:bg-${categoryColor}-700 py-2 rounded-lg transition">
                Ver Detalhes
            </button>
        </div>
    `;
    
    return card;
}

// Get Category Name
function getCategoryName(category) {
    const names = {
        meditation: 'Meditação',
        therapy: 'Terapia',
        workshop: 'Workshop',
        ebook: 'E-book',
        course: 'Curso'
    };
    return names[category] || 'Outro';
}

// Generate Stars
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star text-yellow-400"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
        } else {
            stars += '<i class="far fa-star text-gray-400"></i>';
        }
    }
    
    return stars;
}

// Open Course Modal
function openCourseModal(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    currentCourse = course;
    
    const modal = document.getElementById('course-modal');
    const modalContent = document.getElementById('course-modal-content');
    
    modalContent.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div>
                <div class="video-thumbnail relative h-64 rounded-lg overflow-hidden mb-4">
                    <video src="${course.video}" controls class="w-full h-full object-cover"></video>
                </div>
                <img src="${course.image}" alt="${course.title}" class="w-full rounded-lg">
            </div>
            
            <div>
                <h2 class="text-2xl font-bold mb-4">${course.title}</h2>
                
                <div class="flex items-center space-x-4 mb-4">
                    <div class="star-rating">
                        ${generateStars(course.rating)}
                        <span class="text-gray-400 ml-2">(${course.rating} · ${course.students} alunos)</span>
                    </div>
                </div>
                
                <p class="text-gray-300 mb-6">${course.description}</p>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-white bg-opacity-5 rounded-lg p-3">
                        <i class="fas fa-clock text-purple-400 mr-2"></i>
                        <span class="text-sm">Duração: ${course.duration}</span>
                    </div>
                    <div class="bg-white bg-opacity-5 rounded-lg p-3">
                        <i class="fas fa-signal text-purple-400 mr-2"></i>
                        <span class="text-sm">Nível: ${course.level}</span>
                    </div>
                    <div class="bg-white bg-opacity-5 rounded-lg p-3">
                        <i class="fas fa-user text-purple-400 mr-2"></i>
                        <span class="text-sm">Instrutor: ${course.instructor}</span>
                    </div>
                    ${course.lessons > 0 ? `
                        <div class="bg-white bg-opacity-5 rounded-lg p-3">
                            <i class="fas fa-play-circle text-purple-400 mr-2"></i>
                            <span class="text-sm">${course.lessons} aulas</span>
                        </div>
                    ` : ''}
                </div>
                
                ${course.highlights?.length > 0 ? `
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-3">O que você vai aprender:</h3>
                        <ul class="space-y-2">
                            ${course.highlights.map(highlight => `
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-400 mr-2 mt-1"></i>
                                    <span class="text-gray-300">${highlight}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="bg-purple-600 bg-opacity-20 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            ${course.originalPrice > course.price ? `
                                <span class="text-gray-400 line-through text-sm">R$ ${course.originalPrice}</span>
                            ` : ''}
                            <div class="text-3xl font-bold text-purple-300">R$ ${course.price}</div>
                        </div>
                        ${course.certificate ? `
                            <div class="text-right">
                                <i class="fas fa-certificate text-green-400 text-2xl"></i>
                                <p class="text-xs text-gray-300 mt-1">Certificado</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Course Modal
function closeCourseModal() {
    const modal = document.getElementById('course-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentCourse = null;
}

// Purchase Course
function purchaseCourse() {
    if (!currentCourse) return;
    
    // Show loading
    showLoading('Processando compra...');
    
    // Simulate purchase process
    setTimeout(() => {
        hideLoading();
        showNotification(`Compra do curso "${currentCourse.title}" realizada com sucesso!`, 'success');
        closeCourseModal();
    }, 2000);
}

// Load More Courses
function loadMoreCourses() {
    displayedCourses += 4;
    renderCourses();
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

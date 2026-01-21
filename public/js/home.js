// Simplified Main JavaScript for Berhu Platform

// Global Variables
let currentUser = null;
let sessionData = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    checkSession();
    initializeLogo();
    initializeNavigation();
    initializeProductCards();
    checkAdminAccess();
    initializeAnimations();
}

// Check User Session
function checkSession() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    
    if (session) {
        try {
            sessionData = JSON.parse(session);
            currentUser = sessionData.user;
            
            // Check if session is expired
            if (sessionData.expiresAt && new Date(sessionData.expiresAt) <= new Date()) {
                console.log('Session expired, redirecting to login');
                logout();
                return;
            }
            
            console.log('Valid session found:', currentUser);
            
            // Update UI to show logged in state
            updateNavigationUI(true);
            
        } catch (error) {
            console.error('Error parsing session:', error);
            logout();
        }
    } else {
        console.log('No session found');
        updateNavigationUI(false);
    }
}

// Update Navigation UI based on auth state
function updateNavigationUI(isLoggedIn) {
    const loginBtn = document.getElementById('nav-login-btn');
    const ctaBtn = document.getElementById('nav-cta-btn');
    
    if (isLoggedIn && currentUser) {
        // User is logged in
        if (loginBtn) {
            loginBtn.textContent = `Olá, ${currentUser.name.split(' ')[0]}`;
            loginBtn.href = '#';
            loginBtn.style.cursor = 'default';
        }
        
        if (ctaBtn) {
            // Determine dashboard link based on role
            let dashboardLink = 'profile.html';
            if (currentUser.plan === 'admin' || currentUser.email === 'admin@berhu.com') {
                dashboardLink = 'admin-clinical.html';
            } else if (currentUser.plan === 'therapist') {
                dashboardLink = 'therapist-dashboard.html'; // Hypothetical
            }
            
            ctaBtn.textContent = 'Meu Painel';
            ctaBtn.href = dashboardLink;
            ctaBtn.classList.remove('border-white/20');
            ctaBtn.classList.add('bg-purple-600', 'border-transparent', 'hover:bg-purple-700');
        }
    } else {
        // User is guest
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.href = 'auth.html';
        }
        
        if (ctaBtn) {
            ctaBtn.textContent = 'Começar Agora';
            ctaBtn.href = 'auth.html';
        }
    }
}

// Initialize Logo
function initializeLogo() {
    const logoContainer = document.getElementById('logo-container');
    if (logoContainer) {
        logoContainer.innerHTML = `
            <div class="w-12 h-12 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center">
                    <i class="fas fa-om text-white text-lg"></i>
                </div>
                <div class="absolute inset-0 flex items-center justify-center opacity-30">
                    <i class="fas fa-star text-white text-xs"></i>
                </div>
            </div>
        `;
    }
}

// Initialize Navigation
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Add admin clinical link if user is admin
    if (currentUser && (currentUser.email === 'admin@berhu.com' || currentUser.plan === 'admin')) {
        addAdminClinicalLink();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add Admin Clinical Link
function addAdminClinicalLink() {
    const nav = document.querySelector('.hidden.md\\:flex.items-center.space-x-6');
    if (nav) {
        const adminLink = document.createElement('a');
        adminLink.href = 'admin-clinical.html';
        adminLink.className = 'text-purple-300 font-semibold hover:text-purple-400 transition';
        adminLink.innerHTML = '<i class="fas fa-user-md mr-2"></i>Painel Clínico';
        nav.appendChild(adminLink);
    }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Initialize Product Cards
function initializeProductCards() {
    // Add hover effects to product cards
    const cards = document.querySelectorAll('.product-card, .course-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Check Admin Access
function checkAdminAccess() {
    // Check if current page requires admin access
    if (window.location.pathname.includes('admin.html')) {
        if (!currentUser || currentUser.plan !== 'admin') {
            showNotification('Acesso restrito a administradores', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

// Initialize Animations
function initializeAnimations() {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Show Notification
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

// Hide Notification
function hideNotification() {
    const notification = document.querySelector('.notification');
    if (notification) {
        notification.remove();
    }
}

// Show Loading
function showLoading(message = 'Carregando...') {
    // Remove existing loading
    hideLoading();
    
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingDiv.innerHTML = `
        <div class="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p class="text-white">${message}</p>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

// Hide Loading
function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// Logout
function logout() {
    // Clear session
    localStorage.removeItem('berhu_session');
    sessionStorage.removeItem('berhu_session');
    
    // Clear global variables
    currentUser = null;
    sessionData = null;
    
    // Redirect to login
    window.location.href = 'auth.html';
}

// Format Date
function formatDate(dateString, options = {}) {
    const date = new Date(dateString);
    
    const defaultOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    
    return date.toLocaleDateString('pt-BR', { ...defaultOptions, ...options });
}

// Format Currency
function formatCurrency(amount, currency = 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar texto', 'error');
    });
}

// Print Page
function printPage() {
    window.print();
}

// Scroll to Top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Export functions to global scope
window.Berhu = {
    showNotification,
    hideNotification,
    showLoading,
    hideLoading,
    logout,
    formatDate,
    formatCurrency,
    copyToClipboard,
    printPage,
    scrollToTop,
    currentUser,
    sessionData
};

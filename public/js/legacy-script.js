// Main JavaScript for Berhu Platform

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
            
            // Redirect admin to clinical panel
            if (currentUser.email === 'admin@berhu.com' || currentUser.plan === 'admin') {
                // Only redirect if not already on admin pages
                if (!window.location.pathname.includes('admin') && !window.location.pathname.includes('auth')) {
                    console.log('Admin user, redirecting to clinical panel');
                    window.location.href = 'admin-clinical.html';
                    return;
                }
            }
        } catch (error) {
            console.error('Error parsing session:', error);
            logout();
        }
    } else {
        console.log('No session found, redirecting to login');
        // Only redirect if we're not already on login page
        if (!window.location.pathname.includes('auth.html')) {
            window.location.href = 'auth.html';
        }
    }
}

// Create Mock Session for Demo
function createMockSession() {
    const mockUser = {
        id: 1,
        name: 'Usuária Demo',
        email: 'demo@berhu.com',
        plan: 'premium',
        avatar: null,
        createdAt: new Date().toISOString()
    };
    
    const mockSession = {
        user: mockUser,
        token: 'demo-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    localStorage.setItem('berhu_session', JSON.stringify(mockSession));
    sessionData = mockSession;
    currentUser = mockUser;
    
    console.log('Mock session created:', currentUser);
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
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Close Mobile Menu
function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

// Initialize Product Cards
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productName = this.querySelector('h3').textContent;
            const productPrice = this.querySelector('.font-bold').textContent;
            
            showProductModal(productName, productPrice);
        });
    });
}

// Show Product Modal
function showProductModal(productName, productPrice) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('productModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Detalhes do Produto</h3>
                    <button class="modal-close" onclick="closeProductModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="productModalContent"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeProductModal()">Fechar</button>
                    <button class="btn btn-primary" onclick="purchaseProduct()">Comprar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Update modal content
    const content = modal.querySelector('#productModalContent');
    content.innerHTML = `
        <h4 class="text-xl font-semibold mb-4">${productName}</h4>
        <p class="text-gray-300 mb-4">Este produto oferece transformação profunda e conexão espiritual.</p>
        <div class="bg-purple-600 bg-opacity-20 rounded-lg p-4 mb-4">
            <p class="text-2xl font-bold text-purple-300">${productPrice}</p>
        </div>
        <ul class="space-y-2 text-gray-300">
            <li><i class="fas fa-check text-green-400 mr-2"></i>Conteúdo exclusivo</li>
            <li><i class="fas fa-check text-green-400 mr-2"></i>Acesso vitalício</li>
            <li><i class="fas fa-check text-green-400 mr-2"></i>Suporte dedicado</li>
            <li><i class="fas fa-check text-green-400 mr-2"></i>Atualizações gratuitas</li>
        </ul>
    `;
    
    modal.classList.add('active');
}

// Close Product Modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Purchase Product
function purchaseProduct() {
    showNotification('Compra simulada com sucesso!', 'success');
    closeProductModal();
}

// Check Admin Access
function checkAdminAccess() {
    if (!currentUser) return;
    
    const isAdmin = currentUser.email === 'admin@berhu.com' || currentUser.plan === 'admin';
    const isTherapist = currentUser.email === 'therapist@berhu.com' || currentUser.plan === 'therapist' || currentUser.plan === 'admin';
    
    // Show/hide admin link
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.style.display = isAdmin ? 'inline-flex' : 'none';
    }
    
    // Show/hide therapist link
    const therapistLink = document.getElementById('therapistLink');
    if (therapistLink) {
        therapistLink.style.display = isTherapist ? 'inline-flex' : 'none';
    }
}

// Initialize Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
    
    // Add animation classes to cards
    document.querySelectorAll('.card, .product-card').forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Show Notification
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${getNotificationIcon(type)} mr-2"></i>
            <span>${message}</span>
            <button class="ml-auto" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-hide
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
}

// Hide Notification
function hideNotification(notification) {
    if (notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Get Notification Icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Show Loading
function showLoading(message = 'Carregando...') {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'modal active';
    overlay.innerHTML = `
        <div class="modal-content">
            <div class="text-center">
                <div class="loading loading-lg mx-auto mb-4"></div>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

// Hide Loading
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.remove();
        document.body.style.overflow = '';
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

// Core JavaScript for Berhu Platform

// Global Variables
window.Berhu = {
    user: null,
    session: null,
    config: {
        apiBaseUrl: '/api',
        version: '1.0.0',
        environment: 'development'
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    checkSession();
    initializeNavigation();
    initializeModals();
    initializeNotifications();
    initializeForms();
    initializeAnimations();
}

// Check User Session
function checkSession() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    
    if (session) {
        try {
            window.Berhu.session = JSON.parse(session);
            window.Berhu.user = window.Berhu.session.user;
            
            // Update UI with user data
            updateUserInterface();
            
            // Check page access permissions
            checkPageAccess();
            
        } catch (error) {
            console.error('Error parsing session:', error);
            logout();
        }
    } else {
        // Redirect to login if not on auth page
        if (!isAuthPage()) {
            window.location.href = 'auth.html';
        }
    }
}

// Update User Interface
function updateUserInterface() {
    if (!window.Berhu.user) return;
    
    // Update user name displays
    const userNameElements = document.querySelectorAll('[data-user-name]');
    userNameElements.forEach(element => {
        element.textContent = window.Berhu.user.name || 'Usuária';
    });
    
    // Update user email displays
    const userEmailElements = document.querySelectorAll('[data-user-email]');
    userEmailElements.forEach(element => {
        element.textContent = window.Berhu.user.email || '';
    });
    
    // Update user avatar
    const userAvatarElements = document.querySelectorAll('[data-user-avatar]');
    userAvatarElements.forEach(element => {
        if (window.Berhu.user.avatar) {
            element.src = window.Berhu.user.avatar;
        }
    });
    
    // Show/hide elements based on user role
    updateRoleBasedElements();
}

// Update Role-Based Elements
function updateRoleBasedElements() {
    const user = window.Berhu.user;
    const isAdmin = user.email === 'admin@berhu.com' || user.plan === 'admin';
    const isTherapist = user.email === 'therapist@berhu.com' || user.plan === 'therapist' || user.plan === 'admin';
    
    // Admin elements
    const adminElements = document.querySelectorAll('[data-require-admin]');
    adminElements.forEach(element => {
        element.style.display = isAdmin ? '' : 'none';
    });
    
    // Therapist elements
    const therapistElements = document.querySelectorAll('[data-require-therapist]');
    therapistElements.forEach(element => {
        element.style.display = isTherapist ? '' : 'none';
    });
    
    // Logged-in elements
    const loggedInElements = document.querySelectorAll('[data-require-auth]');
    loggedInElements.forEach(element => {
        element.style.display = '';
    });
    
    // Guest elements
    const guestElements = document.querySelectorAll('[data-require-guest]');
    guestElements.forEach(element => {
        element.style.display = 'none';
    });
}

// Check Page Access
function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop();
    const user = window.Berhu.user;
    
    // Admin pages
    if (currentPage === 'admin.html') {
        const isAdmin = user.email === 'admin@berhu.com' || user.plan === 'admin';
        if (!isAdmin) {
            showNotification('Acesso negado. Você não tem permissões de administrador.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
    
    // Therapist pages
    if (currentPage === 'therapist-evaluation.html') {
        const isTherapist = user.email === 'therapist@berhu.com' || user.plan === 'therapist' || user.plan === 'admin';
        if (!isTherapist) {
            showNotification('Acesso negado. Você não tem permissões de terapeuta.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

// Initialize Navigation
function initializeNavigation() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    
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

// Initialize Modals
function initializeModals() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

// Initialize Notifications
function initializeNotifications() {
    // Auto-hide notifications after 5 seconds
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
    });
}

// Initialize Forms
function initializeForms() {
    // Handle form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
    
    // Handle input validation
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
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
}

// Handle Form Submit
function handleFormSubmit(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Disable submit button
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processando...';
    }
    
    // Simulate form submission
    setTimeout(() => {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-check mr-2"></i>Enviar';
        }
        
        // Show success message
        showNotification('Formulário enviado com sucesso!', 'success');
        
        // Reset form
        form.reset();
        
    }, 2000);
}

// Validate Input
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    
    // Remove previous validation states
    input.classList.remove('border-red-500', 'border-green-500');
    
    if (required && !value) {
        input.classList.add('border-red-500');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('border-red-500');
            return false;
        }
    }
    
    input.classList.add('border-green-500');
    return true;
}

// Show Modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Modal
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Show Notification
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${getNotificationIcon(type)} mr-2"></i>
            <span>${message}</span>
            <button class="ml-auto" onclick="hideNotification(this.parentElement.parentElement)">
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
                <div class="loading-spinner mx-auto mb-4"></div>
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
    window.Berhu.user = null;
    window.Berhu.session = null;
    
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

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if Auth Page
function isAuthPage() {
    const authPages = ['auth.html', 'login.html', 'register.html'];
    const currentPage = window.location.pathname.split('/').pop();
    return authPages.includes(currentPage);
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar texto', 'error');
    });
}

// Download File
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

// Export Global Functions
window.Berhu.showModal = showModal;
window.Berhu.closeModal = closeModal;
window.Berhu.showNotification = showNotification;
window.Berhu.hideNotification = hideNotification;
window.Berhu.showLoading = showLoading;
window.Berhu.hideLoading = hideLoading;
window.Berhu.logout = logout;
window.Berhu.formatDate = formatDate;
window.Berhu.formatCurrency = formatCurrency;
window.Berhu.formatFileSize = formatFileSize;
window.Berhu.generateUUID = generateUUID;
window.Berhu.debounce = debounce;
window.Berhu.throttle = throttle;
window.Berhu.copyToClipboard = copyToClipboard;
window.Berhu.downloadFile = downloadFile;
window.Berhu.printPage = printPage;
window.Berhu.scrollToTop = scrollToTop;

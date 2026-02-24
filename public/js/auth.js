// Authentication JavaScript for Berhu Platform

// Initialize Auth Page (only on auth routes)
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'auth.html' || currentPage === 'auth') {
        initializeAuth();
    }
});

// Initialize Authentication
function initializeAuth() {
    // Initialize esoteric animation
    if (window.EsotericAnimation) {
        new EsotericAnimation();
    }
    
    // Check if already logged in
    checkExistingSession();
    
    // Setup form listeners
    setupFormListeners();
    
    // Setup social login buttons
    setupSocialLogin();
}

// Check Existing Session
function checkExistingSession() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            if (new Date(sessionData.expiresAt) > new Date()) {
                // Valid session, redirect to dashboard
                window.location.href = 'index.html';
                return;
            } else {
                // Expired session, clear it
                localStorage.removeItem('berhu_session');
                sessionStorage.removeItem('berhu_session');
            }
        } catch (error) {
            console.error('Invalid session format:', error);
            localStorage.removeItem('berhu_session');
            sessionStorage.removeItem('berhu_session');
        }
    }
}

// Setup Form Listeners
function setupFormListeners() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Add input validation
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    
    if (loginEmailInput) {
        loginEmailInput.addEventListener('blur', validateEmail);
    }
    
    if (loginPasswordInput) {
        loginPasswordInput.addEventListener('blur', validatePassword);
    }

    // Setup tab switching
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    
    if (loginTab) {
        loginTab.addEventListener('click', switchToLogin);
    }
    
    if (registerTab) {
        registerTab.addEventListener('click', switchToRegister);
    }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate inputs
    if (!validateEmail() || !validatePassword()) {
        showNotification('Por favor, corrija os erros no formulário', 'error');
        return;
    }
    
    // Show loading
    showLoading('Autenticando...');
    
    // Authenticate with API
    authenticateUser(email, password, remember);
}

// Authenticate User
async function authenticateUser(email, password, remember) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Create session
            const sessionData = {
                user: data.user,
                token: data.token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };

            // Store session
            if (remember) {
                localStorage.setItem('berhu_session', JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem('berhu_session', JSON.stringify(sessionData));
            }

            hideLoading();
            showNotification('Login realizado com sucesso!', 'success');
            
            // Redirect based on user type
            setTimeout(() => {
                if (data.user.email === 'admin@berhu.com' || data.user.plan === 'admin') {
                    window.location.href = 'admin-clinical.html';
                } else {
                    window.location.href = '/';
                }
            }, 1000);
        } else {
            hideLoading();
            showNotification(data.error || 'Erro ao fazer login', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Login error:', error);
        showNotification('Erro de conexão. Tente novamente.', 'error');
    }
}

// Validate Email
function validateEmail() {
    const emailInput = document.getElementById('login-email') || document.getElementById('register-email');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(emailInput, 'Email é obrigatório');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showFieldError(emailInput, 'Email inválido');
        return false;
    }
    
    clearFieldError(emailInput);
    return true;
}

// Validate Password
function validatePassword() {
    const passwordInput = document.getElementById('login-password') || document.getElementById('register-password');
    const password = passwordInput.value;
    
    if (!password) {
        showFieldError(passwordInput, 'Senha é obrigatória');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError(passwordInput, 'Senha deve ter pelo menos 6 caracteres');
        return false;
    }
    
    clearFieldError(passwordInput);
    return true;
}

// Show Field Error
function showFieldError(field, message) {
    field.classList.add('border-red-500');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-400 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Clear Field Error
function clearFieldError(field) {
    field.classList.remove('border-red-500');
    
    // Remove error message
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Setup Social Login
function setupSocialLogin() {
    const googleBtn = document.getElementById('google-login');
    const facebookBtn = document.getElementById('facebook-login');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showNotification('Login com Google em desenvolvimento', 'info');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            showNotification('Login com Facebook em desenvolvimento', 'info');
        });
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

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }
    
    // Show loading
    showLoading('Criando conta...');
    
    // Register with API
    registerUser(name, email, password);
}

// Register User
async function registerUser(name, email, password) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            hideLoading();
            showNotification('Conta criada com sucesso!', 'success');
            
            // Switch to login form
            setTimeout(() => {
                switchToLogin();
            }, 1500);
        } else {
            hideLoading();
            showNotification(data.error || 'Erro ao criar conta', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Register error:', error);
        showNotification('Erro de conexão. Tente novamente.', 'error');
    }
}

// Switch to Login Form
function switchToLogin() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerTab = document.getElementById('register-tab');
    const loginTab = document.getElementById('login-tab');
    
    // Animate Register Out
    registerForm.classList.remove('translate-x-0', 'opacity-100');
    registerForm.classList.add('translate-x-full', 'opacity-0');
    
    setTimeout(() => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        
        // Slight delay to allow display:block to apply before animating opacity
        setTimeout(() => {
            loginForm.classList.remove('-translate-x-full', 'opacity-0');
            loginForm.classList.add('translate-x-0', 'opacity-100');
        }, 50);
    }, 300);

    // Update Tabs
    if (registerTab) {
        registerTab.classList.remove('bg-white/10', 'text-white', 'shadow-lg');
        registerTab.classList.add('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
    }
    if (loginTab) {
        loginTab.classList.add('bg-white/10', 'text-white', 'shadow-lg');
        loginTab.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
    }
}

// Switch to Register Form
function switchToRegister() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerTab = document.getElementById('register-tab');
    const loginTab = document.getElementById('login-tab');
    
    // Animate Login Out
    loginForm.classList.remove('translate-x-0', 'opacity-100');
    loginForm.classList.add('-translate-x-full', 'opacity-0');
    
    setTimeout(() => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        
        // Slight delay to allow display:block to apply before animating opacity
        setTimeout(() => {
            registerForm.classList.remove('translate-x-full', 'opacity-0');
            registerForm.classList.add('translate-x-0', 'opacity-100');
        }, 50);
    }, 300);

    // Update Tabs
    if (registerTab) {
        registerTab.classList.add('bg-white/10', 'text-white', 'shadow-lg');
        registerTab.classList.remove('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
    }
    if (loginTab) {
        loginTab.classList.remove('bg-white/10', 'text-white', 'shadow-lg');
        loginTab.classList.add('text-gray-400', 'hover:text-white', 'hover:bg-white/5');
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('berhu_session');
    sessionStorage.removeItem('berhu_session');
    window.location.href = 'auth.html';
}

// Check authentication and redirect if not logged in (for other pages)
function checkAuth() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    
    if (!session) {
        window.location.href = 'auth.html';
        return false;
    }
    
    try {
        const sessionData = JSON.parse(session);
        
        // Check if session is expired
        if (sessionData.expiresAt && new Date(sessionData.expiresAt) <= new Date()) {
            localStorage.removeItem('berhu_session');
            sessionStorage.removeItem('berhu_session');
            window.location.href = 'auth.html';
            return false;
        }
        
        return sessionData;
    } catch (error) {
        console.error('Invalid session format:', error);
        localStorage.removeItem('berhu_session');
        sessionStorage.removeItem('berhu_session');
        window.location.href = 'auth.html';
        return false;
    }
}

// Get current user
function getCurrentUser() {
    const sessionData = checkAuth();
    return sessionData ? sessionData.user : null;
}

// Get auth token
function getAuthToken() {
    const session = localStorage.getItem('berhu_session') || sessionStorage.getItem('berhu_session');
    if (!session) return null;
    
    try {
        const sessionData = JSON.parse(session);
        return sessionData.token;
    } catch (error) {
        console.error('Error parsing session:', error);
        return null;
    }
}

// Export functions for global use
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.getAuthToken = getAuthToken;
window.logout = logout;

// Fill Demo Account
function fillDemo(email) {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = 'demo123';
}

// Export functions for global access
window.authFunctions = {
    switchToLogin,
    switchToRegister,
    logout,
    showNotification,
    showLoading,
    hideLoading,
    fillDemo
};

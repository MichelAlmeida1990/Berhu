/**
 * Berhu Theme Manager
 * Handles common visual elements like ambient backgrounds and glass styles across pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
});

function initializeTheme() {
    injectAmbientBackground();
    injectGlassStyles();
    setupScrollEffects();
}

function injectAmbientBackground() {
    // Prevent duplicate injection
    if (document.querySelector('.ambient-light-container')) return;

    const container = document.createElement('div');
    container.className = 'ambient-light-container fixed inset-0 overflow-hidden pointer-events-none z-0';
    container.innerHTML = `
        <div class="ambient-light bg-purple-600 w-[500px] h-[500px] top-[-10%] left-[-10%] animate-pulse-slow"></div>
        <div class="ambient-light bg-blue-600 w-[400px] h-[400px] bottom-[-10%] right-[-10%] animate-pulse-slow" style="animation-delay: 2s;"></div>
        <div class="ambient-light bg-pink-600 w-[300px] h-[300px] top-[40%] left-[60%] opacity-40 animate-float"></div>
    `;
    
    // Insert as the first child of body to be behind everything
    document.body.insertBefore(container, document.body.firstChild);
}

function injectGlassStyles() {
    // Add custom styles if not present
    if (document.getElementById('berhu-theme-styles')) return;

    const style = document.createElement('style');
    style.id = 'berhu-theme-styles';
    style.textContent = `
        /* Glass Styles */
        .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        
        .glass-panel-dark {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .glass-button {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .glass-button:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
        }

        /* Ambient Light */
        .ambient-light {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            z-index: 0;
            opacity: 0.6;
        }

        /* Animations */
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0a0a0f; 
        }
        ::-webkit-scrollbar-thumb {
            background: #333; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }
    `;
    document.head.appendChild(style);
}

function setupScrollEffects() {
    const navbar = document.querySelector('nav');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-[#0a0a0f]/80', 'backdrop-blur-xl', 'border-b', 'border-white/5');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-[#0a0a0f]/80', 'backdrop-blur-xl', 'border-b', 'border-white/5');
            navbar.classList.add('bg-transparent');
        }
    });
}

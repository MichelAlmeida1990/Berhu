// Component JavaScript for Berhu Platform

// Modal Component
class Modal {
    constructor(element) {
        this.element = element;
        this.content = element.querySelector('.modal-content');
        this.closeBtn = element.querySelector('.modal-close');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Close on outside click
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.close();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    open() {
        this.element.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const focusableElements = this.content.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
    
    close() {
        this.element.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
        
        // Return focus to trigger element
        if (this.triggerElement) {
            this.triggerElement.focus();
        }
    }
    
    static show(modalId, triggerElement = null) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new Modal(modalElement);
            modal.triggerElement = triggerElement;
            modal.open();
            return modal;
        }
        return null;
    }
}

// Dropdown Component
class Dropdown {
    constructor(element) {
        this.element = element;
        this.toggle = element.querySelector('.dropdown-toggle');
        this.menu = element.querySelector('.dropdown-menu');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target)) {
                this.close();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        this.element.classList.add('active');
        this.isOpen = true;
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            if (dropdown !== this.element) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    close() {
        this.element.classList.remove('active');
        this.isOpen = false;
    }
}

// Tab Component
class Tabs {
    constructor(element) {
        this.element = element;
        this.tabButtons = element.querySelectorAll('.tab');
        this.tabContents = element.querySelectorAll('.tab-content');
        
        this.init();
    }
    
    init() {
        this.tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.showTab(index);
            });
        });
        
        // Show first tab by default
        if (this.tabButtons.length > 0) {
            this.showTab(0);
        }
    }
    
    showTab(index) {
        // Hide all tabs
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        
        // Show selected tab
        this.tabButtons[index].classList.add('active');
        if (this.tabContents[index]) {
            this.tabContents[index].classList.add('active');
        }
    }
}

// Accordion Component
class Accordion {
    constructor(element) {
        this.element = element;
        this.items = element.querySelectorAll('.accordion-item');
        
        this.init();
    }
    
    init() {
        this.items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            header.addEventListener('click', () => {
                this.toggleItem(item);
            });
            
            // Set initial height
            if (!item.classList.contains('active')) {
                content.style.maxHeight = '0';
            }
        });
    }
    
    toggleItem(item) {
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');
        
        // Close all other items
        this.items.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.accordion-content');
                otherContent.style.maxHeight = '0';
            }
        });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
            content.style.maxHeight = '0';
        } else {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
}

// Form Component
class BerhuForm {
    constructor(element) {
        this.element = element;
        this.submitBtn = element.querySelector('button[type="submit"]');
        this.inputs = element.querySelectorAll('input, textarea, select');
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Input validation
        this.inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('input', () => {
                this.clearValidation(input);
            });
        });
    }
    
    handleSubmit() {
        const formData = new FormData(this.element);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (this.validateForm()) {
            this.showLoading();
            
            // Simulate submission
            setTimeout(() => {
                this.hideLoading();
                this.showSuccess();
                this.element.reset();
            }, 2000);
        }
    }
    
    validateForm() {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateInput(input) {
        const value = input.value.trim();
        const isRequired = input.hasAttribute('required');
        
        // Clear previous validation
        input.classList.remove('border-red-500', 'border-green-500');
        
        if (isRequired && !value) {
            input.classList.add('border-red-500');
            return false;
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('border-red-500');
                return false;
            }
        }
        
        input.classList.add('border-green-500');
        return true;
    }
    
    clearValidation(input) {
        input.classList.remove('border-red-500', 'border-green-500');
    }
    
    showLoading() {
        if (this.submitBtn) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processando...';
        }
    }
    
    hideLoading() {
        if (this.submitBtn) {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Enviar';
        }
    }
    
    showSuccess() {
        if (window.Berhu && window.Berhu.showNotification) {
            window.Berhu.showNotification('Formulário enviado com sucesso!', 'success');
        } else {
            console.log('Formulário enviado!');
        }
    }
}

// Notification Component
class Notification {
    constructor(message, type = 'info', duration = 5000) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.element = null;
        
        this.create();
        this.show();
    }
    
    create() {
        this.element = document.createElement('div');
        this.element.className = `notification notification-${this.type}`;
        this.element.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${this.getIcon()} mr-2"></i>
                <span>${this.message}</span>
                <button class="ml-auto" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(this.element);
    }
    
    show() {
        // Trigger reflow for animation
        this.element.offsetHeight;
        this.element.classList.add('show');
        
        // Auto-hide
        setTimeout(() => {
            this.hide();
        }, this.duration);
    }
    
    hide() {
        this.element.classList.remove('show');
        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.remove();
            }
        }, 300);
    }
    
    getIcon() {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[this.type] || 'info-circle';
    }
    
    static show(message, type, duration) {
        return new Notification(message, type, duration);
    }
}

// Loading Component
class Loading {
    constructor(message = 'Carregando...') {
        this.message = message;
        this.element = null;
        
        this.create();
        this.show();
    }
    
    create() {
        this.element = document.createElement('div');
        this.element.id = 'loading-overlay';
        this.element.className = 'modal active';
        this.element.innerHTML = `
            <div class="modal-content">
                <div class="text-center">
                    <div class="loading loading-lg mx-auto mb-4"></div>
                    <p>${this.message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.element);
        document.body.style.overflow = 'hidden';
    }
    
    show() {
        this.element.classList.add('active');
    }
    
    hide() {
        if (this.element) {
            this.element.remove();
            document.body.style.overflow = '';
        }
    }
    
    static show(message) {
        return new Loading(message);
    }
}

// Tooltip Component
class Tooltip {
    constructor(element, text, position = 'top') {
        this.element = element;
        this.text = text;
        this.position = position;
        this.tooltipElement = null;
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('mouseenter', () => this.show());
        this.element.addEventListener('mouseleave', () => this.hide());
        
        // Touch devices
        this.element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.show();
        });
        
        this.element.addEventListener('touchend', () => {
            setTimeout(() => this.hide(), 100);
        });
    }
    
    create() {
        this.tooltipElement = document.createElement('div');
        this.tooltipElement.className = 'tooltip-text';
        this.tooltipElement.textContent = this.text;
        
        this.element.appendChild(this.tooltipElement);
        
        // Position tooltip
        this.positionTooltip();
    }
    
    show() {
        if (!this.tooltipElement) {
            this.create();
        }
    }
    
    hide() {
        if (this.tooltipElement) {
            this.tooltipElement.remove();
            this.tooltipElement = null;
        }
    }
    
    positionTooltip() {
        const rect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        
        let top, left;
        
        switch (this.position) {
            case 'top':
                top = -tooltipRect.height - 5;
                left = (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.height + 5;
                left = (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = (rect.height - tooltipRect.height) / 2;
                left = -tooltipRect.width - 5;
                break;
            case 'right':
                top = (rect.height - tooltipRect.height) / 2;
                left = rect.width + 5;
                break;
        }
        
        this.tooltipElement.style.top = `${top}px`;
        this.tooltipElement.style.left = `${left}px`;
    }
}

// Carousel Component
class Carousel {
    constructor(element) {
        this.element = element;
        this.container = element.querySelector('.carousel-container');
        this.items = element.querySelectorAll('.carousel-item');
        this.prevBtn = element.querySelector('.carousel-prev');
        this.nextBtn = element.querySelector('.carousel-next');
        this.indicators = element.querySelector('.carousel-indicators');
        
        this.currentIndex = 0;
        this.autoplayInterval = null;
        
        this.init();
    }
    
    init() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        // Touch support
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
        
        // Keyboard support
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
        
        // Autoplay
        this.startAutoplay();
        
        // Pause on hover
        this.element.addEventListener('mouseenter', () => this.stopAutoplay());
        this.element.addEventListener('mouseleave', () => this.startAutoplay());
    }
    
    show(index) {
        if (index < 0) index = this.items.length - 1;
        if (index >= this.items.length) index = 0;
        
        this.currentIndex = index;
        
        // Update container position
        this.container.style.transform = `translateX(-${index * 100}%)`;
        
        // Update indicators
        if (this.indicators) {
            const indicatorButtons = this.indicators.querySelectorAll('button');
            indicatorButtons.forEach((btn, i) => {
                btn.classList.toggle('active', i === index);
            });
        }
    }
    
    next() {
        this.show(this.currentIndex + 1);
    }
    
    prev() {
        this.show(this.currentIndex - 1);
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, 5000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    document.querySelectorAll('.modal').forEach(modal => {
        new Modal(modal);
    });
    
    // Initialize dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        new Dropdown(dropdown);
    });
    
    // Initialize tabs
    document.querySelectorAll('.tabs').forEach(tabs => {
        new Tabs(tabs);
    });
    
    // Initialize accordions
    document.querySelectorAll('.accordion').forEach(accordion => {
        new Accordion(accordion);
    });
    
    // Initialize forms
    document.querySelectorAll('form').forEach(form => {
        new BerhuForm(form);
    });
    
    // Initialize carousels
    document.querySelectorAll('.carousel').forEach(carousel => {
        new Carousel(carousel);
    });
    
    // Initialize tooltips
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        const text = element.getAttribute('data-tooltip');
        const position = element.getAttribute('data-tooltip-position') || 'top';
        new Tooltip(element, text, position);
    });
});

// Export components
window.Berhu.Components = {
    Modal,
    Dropdown,
    Tabs,
    Accordion,
    Form: BerhuForm,
    Notification,
    Loading,
    Tooltip,
    Carousel
};

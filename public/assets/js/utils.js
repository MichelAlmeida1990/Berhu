// Utility Functions for Berhu Platform

// Storage Utilities
const Storage = {
    get: (key, defaultValue = null) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key} to storage:`, error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from storage:`, error);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
};

// Session Storage Utilities
const SessionStorage = {
    get: (key, defaultValue = null) => {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Error getting ${key} from session storage:`, error);
            return defaultValue;
        }
    },
    
    set: (key, value) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key} to session storage:`, error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from session storage:`, error);
            return false;
        }
    },
    
    clear: () => {
        try {
            sessionStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing session storage:', error);
            return false;
        }
    }
};

// Validation Utilities
const Validation = {
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    phone: (phone) => {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    },
    
    cpf: (cpf) => {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return cpfRegex.test(cpf);
    },
    
    password: (password) => {
        return password.length >= 8;
    },
    
    required: (value) => {
        return value && value.trim().length > 0;
    },
    
    minLength: (value, min) => {
        return value && value.length >= min;
    },
    
    maxLength: (value, max) => {
        return value && value.length <= max;
    },
    
    number: (value) => {
        return !isNaN(value) && value.trim() !== '';
    },
    
    positive: (value) => {
        return Validation.number(value) && parseFloat(value) > 0;
    },
    
    url: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// Form Utilities
const Form = {
    serialize: (form) => {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    },
    
    validate: (form, rules) => {
        const errors = {};
        const data = Form.serialize(form);
        
        for (let field in rules) {
            const fieldRules = rules[field];
            const value = data[field];
            
            for (let rule of fieldRules) {
                if (rule.required && !Validation.required(value)) {
                    errors[field] = rule.message || 'Este campo é obrigatório';
                    break;
                }
                
                if (rule.type && !Validation[rule.type](value)) {
                    errors[field] = rule.message || 'Valor inválido';
                    break;
                }
                
                if (rule.minLength && !Validation.minLength(value, rule.minLength)) {
                    errors[field] = rule.message || `Mínimo de ${rule.minLength} caracteres`;
                    break;
                }
                
                if (rule.maxLength && !Validation.maxLength(value, rule.maxLength)) {
                    errors[field] = rule.message || `Máximo de ${rule.maxLength} caracteres`;
                    break;
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors,
            data: data
        };
    },
    
    reset: (form) => {
        form.reset();
        
        // Remove validation classes
        form.querySelectorAll('.border-red-500, .border-green-500').forEach(element => {
            element.classList.remove('border-red-500', 'border-green-500');
        });
    }
};

// API Utilities
const API = {
    get: async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API GET error:', error);
            throw error;
        }
    },
    
    post: async (url, data, options = {}) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API POST error:', error);
            throw error;
        }
    },
    
    put: async (url, data, options = {}) => {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API PUT error:', error);
            throw error;
        }
    },
    
    delete: async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API DELETE error:', error);
            throw error;
        }
    }
};

// Date Utilities
const DateUtils = {
    format: (date, options = {}) => {
        const defaultOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        
        return new Date(date).toLocaleDateString('pt-BR', { ...defaultOptions, ...options });
    },
    
    formatTime: (date, options = {}) => {
        const defaultOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return new Date(date).toLocaleTimeString('pt-BR', { ...defaultOptions, ...options });
    },
    
    formatDateTime: (date, options = {}) => {
        const defaultOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return new Date(date).toLocaleString('pt-BR', { ...defaultOptions, ...options });
    },
    
    addDays: (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    },
    
    addMonths: (date, months) => {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    },
    
    isToday: (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },
    
    isPast: (date) => {
        return date < new Date();
    },
    
    isFuture: (date) => {
        return date > new Date();
    },
    
    getDaysInMonth: (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    },
    
    getFirstDayOfMonth: (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }
};

// String Utilities
const StringUtils = {
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    titleCase: (str) => {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },
    
    slugify: (str) => {
        return str
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    
    truncate: (str, length, suffix = '...') => {
        if (str.length <= length) return str;
        return str.substring(0, length - suffix.length) + suffix;
    },
    
    stripHtml: (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    },
    
    escapeHtml: (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return text.replace(/[&<>"']/g, (m) => map[m]);
    },
    
    random: (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// Array Utilities
const ArrayUtils = {
    unique: (array) => {
        return [...new Set(array)];
    },
    
    shuffle: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    chunk: (array, size) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
    
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },
    
    sortBy: (array, key, direction = 'asc') => {
        return [...array].sort((a, b) => {
            if (direction === 'asc') {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });
    },
    
    flatten: (array) => {
        return array.reduce((flat, item) => {
            return flat.concat(Array.isArray(item) ? ArrayUtils.flatten(item) : item);
        }, []);
    }
};

// Object Utilities
const ObjectUtils = {
    deepClone: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },
    
    merge: (target, source) => {
        return { ...target, ...source };
    },
    
    pick: (obj, keys) => {
        return keys.reduce((result, key) => {
            if (key in obj) {
                result[key] = obj[key];
            }
            return result;
        }, {});
    },
    
    omit: (obj, keys) => {
        const result = { ...obj };
        keys.forEach(key => delete result[key]);
        return result;
    },
    
    isEmpty: (obj) => {
        return Object.keys(obj).length === 0;
    },
    
    hasKey: (obj, key) => {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }
};

// Math Utilities
const MathUtils = {
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    round: (num, precision = 0) => {
        const factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    },
    
    clamp: (num, min, max) => {
        return Math.min(Math.max(num, min), max);
    },
    
    percentage: (value, total) => {
        return (value / total) * 100;
    },
    
    average: (array) => {
        return array.reduce((sum, num) => sum + num, 0) / array.length;
    },
    
    sum: (array) => {
        return array.reduce((sum, num) => sum + num, 0);
    },
    
    max: (array) => {
        return Math.max(...array);
    },
    
    min: (array) => {
        return Math.min(...array);
    }
};

// Color Utilities
const ColorUtils = {
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    rgbToHex: (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    lighten: (hex, percent) => {
        const rgb = ColorUtils.hexToRgb(hex);
        if (!rgb) return hex;
        
        const factor = percent / 100;
        const r = Math.round(Math.min(255, rgb.r + (255 - rgb.r) * factor));
        const g = Math.round(Math.min(255, rgb.g + (255 - rgb.g) * factor));
        const b = Math.round(Math.min(255, rgb.b + (255 - rgb.b) * factor));
        
        return ColorUtils.rgbToHex(r, g, b);
    },
    
    darken: (hex, percent) => {
        const rgb = ColorUtils.hexToRgb(hex);
        if (!rgb) return hex;
        
        const factor = percent / 100;
        const r = Math.round(Math.max(0, rgb.r - rgb.r * factor));
        const g = Math.round(Math.max(0, rgb.g - rgb.g * factor));
        const b = Math.round(Math.max(0, rgb.b - rgb.b * factor));
        
        return ColorUtils.rgbToHex(r, g, b);
    }
};

// Export utilities
window.Berhu.Utils = {
    Storage,
    SessionStorage,
    Validation,
    Form,
    API,
    DateUtils,
    StringUtils,
    ArrayUtils,
    ObjectUtils,
    MathUtils,
    ColorUtils
};

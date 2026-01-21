// Validation utilities for Berhu Platform

class ValidationUtils {
    // Email validation
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation (Brazilian format)
    static validatePhone(phone) {
        const phoneRegex = /^\(?(\d{2})\)?[-. ]?(\d{4,5})[-. ]?(\d{4})$/;
        return phoneRegex.test(phone);
    }

    // CPF validation (Brazilian document)
    static validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) {
            remainder = 0;
        }
        if (remainder !== parseInt(cpf.substring(9, 10))) {
            return false;
        }

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) {
            remainder = 0;
        }
        if (remainder !== parseInt(cpf.substring(10, 11))) {
            return false;
        }

        return true;
    }

    // Password validation
    static validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
            errors: {
                length: password.length < minLength ? `Mínimo de ${minLength} caracteres` : null,
                uppercase: !hasUpperCase ? 'Pelo menos uma letra maiúscula' : null,
                lowercase: !hasLowerCase ? 'Pelo menos uma letra minúscula' : null,
                numbers: !hasNumbers ? 'Pelo menos um número' : null,
                special: !hasSpecialChar ? 'Pelo menos um caractere especial' : null
            }
        };
    }

    // Date validation
    static validateDate(dateString, minAge = 18, maxAge = 120) {
        const date = new Date(dateString);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();

        const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

        return {
            isValid: date <= today && actualAge >= minAge && actualAge <= maxAge,
            age: actualAge,
            errors: {
                future: date > today ? 'Data não pode ser no futuro' : null,
                tooYoung: actualAge < minAge ? `Mínimo de ${minAge} anos` : null,
                tooOld: actualAge > maxAge ? `Máximo de ${maxAge} anos` : null
            }
        };
    }

    // Required field validation
    static validateRequired(value, fieldName = 'Campo') {
        const trimmedValue = value.toString().trim();
        return {
            isValid: trimmedValue.length > 0,
            error: trimmedValue.length === 0 ? `${fieldName} é obrigatório` : null
        };
    }

    // Length validation
    static validateLength(value, minLength, maxLength, fieldName = 'Campo') {
        const length = value.toString().trim().length;
        return {
            isValid: length >= minLength && length <= maxLength,
            errors: {
                minLength: length < minLength ? `${fieldName} deve ter pelo menos ${minLength} caracteres` : null,
                maxLength: length > maxLength ? `${fieldName} deve ter no máximo ${maxLength} caracteres` : null
            }
        };
    }

    // Number validation
    static validateNumber(value, min = null, max = null, fieldName = 'Campo') {
        const num = parseFloat(value);
        const isNumber = !isNaN(num);

        return {
            isValid: isNumber && (min === null || num >= min) && (max === null || num <= max),
            errors: {
                notNumber: !isNumber ? `${fieldName} deve ser um número` : null,
                min: min !== null && num < min ? `${fieldName} deve ser pelo menos ${min}` : null,
                max: max !== null && num > max ? `${fieldName} deve ser no máximo ${max}` : null
            }
        };
    }

    // Form validation helper
    static validateForm(formElement, rules) {
        const errors = {};
        let isValid = true;

        Object.keys(rules).forEach(fieldName => {
            const field = formElement.querySelector(`[name="${fieldName}"]`);
            if (!field) return;

            const fieldRules = rules[fieldName];
            const fieldValue = field.value;
            const fieldErrors = [];

            fieldRules.forEach(rule => {
                const result = this.validateField(fieldValue, rule);
                if (!result.isValid) {
                    fieldErrors.push(result.error);
                    isValid = false;
                }
            });

            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors;
                this.showFieldError(field, fieldErrors);
            } else {
                this.clearFieldError(field);
            }
        });

        return { isValid, errors };
    }

    // Single field validation
    static validateField(value, rule) {
        switch (rule.type) {
            case 'required':
                return this.validateRequired(value, rule.message || 'Campo obrigatório');
            case 'email':
                return {
                    isValid: this.validateEmail(value),
                    error: this.validateEmail(value) ? null : 'E-mail inválido'
                };
            case 'phone':
                return {
                    isValid: this.validatePhone(value),
                    error: this.validatePhone(value) ? null : 'Telefone inválido'
                };
            case 'cpf':
                return {
                    isValid: this.validateCPF(value),
                    error: this.validateCPF(value) ? null : 'CPF inválido'
                };
            case 'password':
                return this.validatePassword(value);
            case 'date':
                const dateValidation = this.validateDate(value, rule.minAge, rule.maxAge);
                return {
                    isValid: dateValidation.isValid,
                    error: Object.values(dateValidation.errors).filter(e => e).join(', ') || null
                };
            case 'length':
                const lengthValidation = this.validateLength(value, rule.min, rule.max, rule.message);
                return {
                    isValid: lengthValidation.isValid,
                    error: Object.values(lengthValidation.errors).filter(e => e).join(', ') || null
                };
            case 'number':
                const numberValidation = this.validateNumber(value, rule.min, rule.max, rule.message);
                return {
                    isValid: numberValidation.isValid,
                    error: Object.values(numberValidation.errors).filter(e => e).join(', ') || null
                };
            default:
                return { isValid: true, error: null };
        }
    }

    // Show field error
    static showFieldError(field, errors) {
        field.classList.add('border-red-500', 'focus:border-red-500');
        field.classList.remove('border-green-500', 'focus:border-green-500');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error text-red-400 text-sm mt-1';
        errorElement.textContent = Array.isArray(errors) ? errors.join(', ') : errors;
        field.parentNode.appendChild(errorElement);
    }

    // Clear field error
    static clearFieldError(field) {
        field.classList.remove('border-red-500', 'focus:border-red-500');
        field.classList.add('border-green-500', 'focus:border-green-500');

        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Clear all field errors
    static clearAllErrors(formElement) {
        formElement.querySelectorAll('.border-red-500').forEach(field => {
            field.classList.remove('border-red-500', 'focus:border-red-500');
        });
        formElement.querySelectorAll('.field-error').forEach(error => {
            error.remove();
        });
    }
}

// Export for use in other files
window.ValidationUtils = ValidationUtils;

// Error handling utilities for Berhu Platform

class ErrorHandler {
    static errorTypes = {
        VALIDATION: 'validation',
        NETWORK: 'network',
        AUTHENTICATION: 'authentication',
        AUTHORIZATION: 'authorization',
        NOT_FOUND: 'not_found',
        SERVER: 'server',
        CLIENT: 'client',
        STORAGE: 'storage',
        UNKNOWN: 'unknown'
    };

    static errorMessages = {
        [this.errorTypes.VALIDATION]: 'Dados inválidos. Por favor, verifique as informações.',
        [this.errorTypes.NETWORK]: 'Erro de conexão. Verifique sua internet e tente novamente.',
        [this.errorTypes.AUTHENTICATION]: 'Não autenticado. Por favor, faça login.',
        [this.errorTypes.AUTHORIZATION]: 'Acesso negado. Você não tem permissão para esta ação.',
        [this.errorTypes.NOT_FOUND]: 'Recurso não encontrado.',
        [this.errorTypes.SERVER]: 'Erro no servidor. Tente novamente mais tarde.',
        [this.errorTypes.CLIENT]: 'Erro no aplicativo. Recarregue a página e tente novamente.',
        [this.errorTypes.STORAGE]: 'Erro ao salvar dados. Verifique o espaço de armazenamento.',
        [this.errorTypes.UNKNOWN]: 'Ocorreu um erro inesperado. Tente novamente.'
    };

    static handleError(error, context = '') {
        const errorInfo = this.classifyError(error);
        
        // Log error for debugging
        this.logError(error, errorInfo, context);
        
        // Show user-friendly message
        this.showErrorMessage(errorInfo, context);
        
        // Report to monitoring service (in production)
        this.reportError(error, errorInfo, context);
        
        return errorInfo;
    }

    static classifyError(error) {
        if (!error) {
            return {
                type: this.errorTypes.UNKNOWN,
                message: this.errorMessages[this.errorTypes.UNKNOWN],
                originalError: null,
                userMessage: 'Ocorreu um erro desconhecido.'
            };
        }

        // Network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return {
                type: this.errorTypes.NETWORK,
                message: this.errorMessages[this.errorTypes.NETWORK],
                originalError: error,
                userMessage: 'Erro de conexão. Verifique sua internet.'
            };
        }

        // HTTP status errors
        if (error.status) {
            switch (error.status) {
                case 400:
                    return {
                        type: this.errorTypes.VALIDATION,
                        message: this.errorMessages[this.errorTypes.VALIDATION],
                        originalError: error,
                        userMessage: error.message || 'Dados inválidos.'
                    };
                case 401:
                    return {
                        type: this.errorTypes.AUTHENTICATION,
                        message: this.errorMessages[this.errorTypes.AUTHENTICATION],
                        originalError: error,
                        userMessage: 'Sessão expirada. Faça login novamente.'
                    };
                case 403:
                    return {
                        type: this.errorTypes.AUTHORIZATION,
                        message: this.errorMessages[this.errorTypes.AUTHORIZATION],
                        originalError: error,
                        userMessage: 'Você não tem permissão para esta ação.'
                    };
                case 404:
                    return {
                        type: this.errorTypes.NOT_FOUND,
                        message: this.errorMessages[this.errorTypes.NOT_FOUND],
                        originalError: error,
                        userMessage: 'Página não encontrada.'
                    };
                case 500:
                case 502:
                case 503:
                case 504:
                    return {
                        type: this.errorTypes.SERVER,
                        message: this.errorMessages[this.errorTypes.SERVER],
                        originalError: error,
                        userMessage: 'Servidor indisponível. Tente novamente.'
                    };
                default:
                    return {
                        type: this.errorTypes.UNKNOWN,
                        message: this.errorMessages[this.errorTypes.UNKNOWN],
                        originalError: error,
                        userMessage: `Erro ${error.status}: ${error.statusText || 'Desconhecido'}`
                    };
            }
        }

        // Storage errors
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            return {
                type: this.errorTypes.STORAGE,
                message: this.errorMessages[this.errorTypes.STORAGE],
                originalError: error,
                userMessage: 'Armazenamento cheio. Limpe dados desnecessários.'
            };
        }

        // Validation errors
        if (error.name === 'ValidationError' || error.message.includes('validation')) {
            return {
                type: this.errorTypes.VALIDATION,
                message: this.errorMessages[this.errorTypes.VALIDATION],
                originalError: error,
                userMessage: error.message || 'Dados inválidos.'
            };
        }

        // Default
        return {
            type: this.errorTypes.UNKNOWN,
            message: this.errorMessages[this.errorTypes.UNKNOWN],
            originalError: error,
            userMessage: error.message || 'Ocorreu um erro inesperado.'
        };
    }

    static showErrorMessage(errorInfo, context = '') {
        const message = context ? `${context}: ${errorInfo.userMessage}` : errorInfo.userMessage;
        
        if (window.Berhu && window.Berhu.showNotification) {
            window.Berhu.showNotification(message, 'error', 8000);
        } else {
            // Fallback: alert
            console.error('Error:', message);
            alert(message);
        }

        // Show detailed error in development
        if (this.isDevelopment()) {
            console.group('🚨 Error Details');
            console.error('Type:', errorInfo.type);
            console.error('Message:', errorInfo.message);
            console.error('Context:', context);
            console.error('Original Error:', errorInfo.originalError);
            console.groupEnd();
        }
    }

    static logError(error, errorInfo, context) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: errorInfo.type,
            message: errorInfo.message,
            context: context,
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: window.Berhu?.user?.email || 'anonymous',
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack
            }
        };

        // Store in localStorage for debugging
        const errorLogs = JSON.parse(localStorage.getItem('berhu_error_logs') || '[]');
        errorLogs.unshift(logEntry);
        
        // Keep only last 50 errors
        if (errorLogs.length > 50) {
            errorLogs.splice(50);
        }
        
        localStorage.setItem('berhu_error_logs', JSON.stringify(errorLogs));
    }

    static reportError(error, errorInfo, context) {
        // In production, send to monitoring service
        if (!this.isDevelopment()) {
            // Example: Send to Sentry, LogRocket, etc.
            // Sentry.captureException(error, { 
            //     tags: { context: context, type: errorInfo.type }
            // });
        }
    }

    static isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('dev');
    }

    static getErrorLogs() {
        return JSON.parse(localStorage.getItem('berhu_error_logs') || '[]');
    }

    static clearErrorLogs() {
        localStorage.removeItem('berhu_error_logs');
    }

    static createError(type, message, originalError = null) {
        const error = new Error(message);
        error.name = type;
        error.originalError = originalError;
        return error;
    }

    // Async error wrapper
    static async withErrorHandling(asyncFn, context = '') {
        try {
            return await asyncFn();
        } catch (error) {
            this.handleError(error, context);
            throw error;
        }
    }

    // Sync error wrapper
    static withErrorHandlingSync(fn, context = '') {
        try {
            return fn();
        } catch (error) {
            this.handleError(error, context);
            throw error;
        }
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    ErrorHandler.handleError(event.error, 'Global JavaScript Error');
});

window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handleError(event.reason, 'Unhandled Promise Rejection');
});

// Export for use in other files
window.ErrorHandler = ErrorHandler;

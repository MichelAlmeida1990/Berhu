// Performance optimization utilities for Berhu Platform

class PerformanceOptimizer {
    static metrics = {
        pageLoad: null,
        firstPaint: null,
        firstContentfulPaint: null,
        domInteractive: null,
        domComplete: null
    };

    static init() {
        this.measurePageLoad();
        this.setupIntersectionObserver();
        this.setupLazyLoading();
        this.optimizeImages();
        this.setupResourceHints();
    }

    // Measure page load performance
    static measurePageLoad() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                
                this.metrics = {
                    pageLoad: navigation.loadEventEnd - navigation.loadEventStart,
                    firstPaint: this.getPaintTime('first-paint'),
                    firstContentfulPaint: this.getPaintTime('first-contentful-paint'),
                    domInteractive: navigation.domInteractive - navigation.navigationStart,
                    domComplete: navigation.domComplete - navigation.navigationStart
                };

                this.logPerformanceMetrics();
                this.optimizeBasedOnMetrics();
            });
        }
    }

    static getPaintTime(name) {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            const paintEntry = paintEntries.find(entry => entry.name === name);
            return paintEntry ? paintEntry.startTime : null;
        }
        return null;
    }

    static logPerformanceMetrics() {
        console.group('📊 Performance Metrics');
        Object.entries(this.metrics).forEach(([metric, value]) => {
            if (value !== null) {
                console.log(`${metric}: ${value.toFixed(2)}ms`);
            }
        });
        console.groupEnd();
    }

    static optimizeBasedOnMetrics() {
        // Optimize based on slow metrics
        if (this.metrics.pageLoad > 3000) {
            this.enableAggressiveOptimizations();
        }
        
        if (this.metrics.firstContentfulPaint > 2000) {
            this.optimizeCriticalRenderingPath();
        }
    }

    // Setup Intersection Observer for lazy loading
    static setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe elements with data-lazy attribute
        document.querySelectorAll('[data-lazy]').forEach(el => {
            observer.observe(el);
        });
    }

    // Load lazy element
    static loadElement(element) {
        const elementType = element.dataset.lazy;
        
        switch (elementType) {
            case 'image':
                this.loadLazyImage(element);
                break;
            case 'component':
                this.loadLazyComponent(element);
                break;
            case 'script':
                this.loadLazyScript(element);
                break;
            default:
                element.classList.add('loaded');
        }
    }

    // Load lazy image
    static loadLazyImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.onload = () => {
                img.classList.add('loaded');
                img.classList.remove('loading');
            };
            img.classList.add('loading');
        }
    }

    // Load lazy component
    static loadLazyComponent(container) {
        const componentUrl = container.dataset.component;
        if (componentUrl) {
            fetch(componentUrl)
                .then(response => response.text())
                .then(html => {
                    container.innerHTML = html;
                    container.classList.add('loaded');
                })
                .catch(error => {
                    console.error('Error loading component:', error);
                    container.innerHTML = '<div class="error">Failed to load component</div>';
                });
        }
    }

    // Load lazy script
    static loadLazyScript(scriptContainer) {
        const scriptUrl = scriptContainer.dataset.script;
        if (scriptUrl) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = () => {
                scriptContainer.classList.add('loaded');
            };
            script.onerror = () => {
                scriptContainer.innerHTML = '<div class="error">Failed to load script</div>';
            };
            document.head.appendChild(script);
        }
    }

    // Setup general lazy loading
    static setupLazyLoading() {
        // Lazy load images
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.classList.add('lazy-image');
        });

        // Lazy load iframes
        document.querySelectorAll('iframe[data-src]').forEach(iframe => {
            iframe.classList.add('lazy-iframe');
        });
    }

    // Optimize images
    static optimizeImages() {
        // Add loading="lazy" to images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });

        // Convert images to WebP if supported
        if (this.supportsWebP()) {
            document.querySelectorAll('img[data-webp]').forEach(img => {
                const webpSrc = img.dataset.webp;
                if (webpSrc) {
                    img.src = webpSrc;
                }
            });
        }
    }

    // Check WebP support
    static supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Setup resource hints
    static setupResourceHints() {
        // DNS prefetch for external domains
        const domains = [
            'fonts.googleapis.com',
            'cdnjs.cloudflare.com',
            'cdn.jsdelivr.net'
        ];

        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });

        // Preconnect for critical resources
        const criticalDomains = ['fonts.googleapis.com'];
        criticalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = `https://${domain}`;
            document.head.appendChild(link);
        });
    }

    // Enable aggressive optimizations
    static enableAggressiveOptimizations() {
        // Reduce animation complexity
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Disable non-essential animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.remove('animate-on-scroll');
        });
        
        // Optimize images further
        this.compressImages();
    }

    // Optimize critical rendering path
    static optimizeCriticalRenderingPath() {
        // Inline critical CSS
        this.inlineCriticalCSS();
        
        // Defer non-critical CSS
        this.deferNonCriticalCSS();
        
        // Optimize font loading
        this.optimizeFontLoading();
    }

    // Inline critical CSS
    static inlineCriticalCSS() {
        const criticalCSS = `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
            .loading { opacity: 0; transition: opacity 0.3s; }
            .loaded { opacity: 1; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Defer non-critical CSS
    static deferNonCriticalCSS() {
        document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])').forEach(link => {
            link.media = 'print';
            link.onload = function() {
                this.media = 'all';
            };
        });
    }

    // Optimize font loading
    static optimizeFontLoading() {
        document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach(link => {
            link.rel = 'preload';
            link.as = 'style';
            link.onload = function() {
                this.rel = 'stylesheet';
            };
        });
    }

    // Compress images (placeholder - would need backend service)
    static compressImages() {
        // This would typically involve a service like TinyPNG
        console.log('Image compression enabled');
    }

    // Monitor performance continuously
    static startPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 100) { // Log slow operations
                        console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });

            observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
        }
    }

    // Memory management
    static optimizeMemory() {
        // Clean up event listeners
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                const memory = window.performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected, triggering cleanup');
                    this.cleanup();
                }
            }, 30000);
        }
    }

    // Cleanup unused resources
    static cleanup() {
        // Clear old error logs
        const errorLogs = JSON.parse(localStorage.getItem('berhu_error_logs') || '[]');
        if (errorLogs.length > 20) {
            localStorage.setItem('berhu_error_logs', JSON.stringify(errorLogs.slice(0, 20)));
        }

        // Clear old cache
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.includes('old-')) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            });
        }
    }

    // Debounce heavy operations
    static debounce(func, wait) {
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

    // Throttle scroll events
    static throttleScroll(callback) {
        let ticking = false;
        return function() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    callback();
                    ticking = false;
                });
                ticking = true;
            }
        };
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    PerformanceOptimizer.init();
    PerformanceOptimizer.startPerformanceMonitoring();
    PerformanceOptimizer.optimizeMemory();
});

// Export for use in other files
window.PerformanceOptimizer = PerformanceOptimizer;

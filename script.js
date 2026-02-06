// ============================================================
// Theme Toggle (Dark/Light Mode)
// ============================================================

const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Get stored theme preference or system preference
function getThemePreference() {
    const stored = localStorage.getItem('theme');
    if (stored) {
        return stored;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Initialize theme
function initTheme() {
    const theme = getThemePreference();
    setTheme(theme);
}

// Set theme
function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

// Update theme icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const theme = e.matches ? 'dark' : 'light';
    setTheme(theme);
});

// ============================================================
// Mobile Navigation
// ============================================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================================
// Active Navigation Link
// ============================================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ============================================================
// Smooth Scroll Behavior (enhanced)
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================================
// Scroll Animations (Intersection Observer)
// ============================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skill categories, project cards, achievement cards
document.querySelectorAll('.skill-category, .project-card, .achievement-card, .experience-item').forEach(el => {
    observer.observe(el);
});

// ============================================================
// Form Validation & Email Handling
// ============================================================

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle contact email link
const contactButton = document.querySelector('.contact-cta a');
if (contactButton && contactButton.href.startsWith('mailto:')) {
    contactButton.addEventListener('click', function(e) {
        // Allow default mailto behavior
        // The actual email address should be replaced in the HTML
    });
}

// ============================================================
// Stats Counter Animation
// ============================================================

function animateStatNumber(element, target) {
    if (element.textContent.includes('∞') || element.textContent.includes('+')) {
        return; // Skip infinity and '+' symbols
    }

    const start = 0;
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();

    const animate = () => {
        const now = Date.now();
        const progress = (now - startTime) / duration;

        if (progress < 1) {
            const value = Math.floor(target * progress);
            element.textContent = value.toLocaleString();
            requestAnimationFrame(animate);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    animate();
}

// Trigger stat animations when section comes into view
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                const targets = [4, 20, 300]; // Numbers to animate to

                stats.forEach((stat, index) => {
                    if (targets[index]) {
                        animateStatNumber(stat, targets[index]);
                    }
                });

                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ============================================================
// Copy to Clipboard Function
// ============================================================

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('Copied to clipboard!');
}

// ============================================================
// Notification System
// ============================================================

function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInUp 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out forwards';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, duration);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================================
// Page Load Optimization
// ============================================================

// Prefetch or preload resources
window.addEventListener('load', () => {
    // Page fully loaded
    console.log('Portfolio loaded successfully');
});

// ============================================================
// Keyboard Navigation
// ============================================================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Navigation with keyboard
    if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }
});

// ============================================================
// Analytics (Optional - Replace with your tracking)
// ============================================================

function trackEvent(eventName, eventData = {}) {
    // Replace with your analytics provider
    // Example: Mixpanel, Google Analytics, etc.
    console.log(`Event: ${eventName}`, eventData);
}

// Track page views
trackEvent('page_view', {
    page: 'portfolio',
    url: window.location.href
});

// Track CTA clicks
document.querySelectorAll('.btn-primary, .contact-link').forEach(element => {
    element.addEventListener('click', () => {
        const text = element.textContent.trim();
        trackEvent('cta_click', { cta: text });
    });
});

// ============================================================
// Performance Monitoring
// ============================================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime + 'ms');
    });
}

// ============================================================
// Lazy Loading Images (for future optimization)
// ============================================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================================
// Service Worker Registration (Optional)
// ============================================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed - continue without it
    });
}

// ============================================================
// Initialization
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateActiveNavLink();
});

// Update active link on page load
window.addEventListener('load', updateActiveNavLink);

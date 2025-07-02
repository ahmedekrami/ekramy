// Language switching functionality
let currentLang = 'ar';

// Language content object
const content = {
    ar: {
        dir: 'rtl',
        lang: 'ar'
    },
    en: {
        dir: 'ltr', 
        lang: 'en'
    }
};

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initLanguageToggle();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initNavbarScroll();
});

// Language Toggle Functionality
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const langText = document.getElementById('langText');
    
    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        switchLanguage();
    });
}

function switchLanguage() {
    const html = document.documentElement;
    const langText = document.getElementById('langText');
    
    // Update HTML attributes
    html.setAttribute('lang', content[currentLang].lang);
    html.setAttribute('dir', content[currentLang].dir);
    
    // Update language toggle button text
    langText.textContent = currentLang === 'ar' ? 'English' : 'العربية';
    
    // Show/hide language-specific content
    const arElements = document.querySelectorAll('.ar-text');
    const enElements = document.querySelectorAll('.en-text');
    
    if (currentLang === 'ar') {
        arElements.forEach(el => el.style.display = '');
        enElements.forEach(el => el.style.display = 'none');
    } else {
        arElements.forEach(el => el.style.display = 'none');
        enElements.forEach(el => el.style.display = '');
    }
    
    // Add transition effect
    document.body.style.opacity = '0.8';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 200);
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Contact Form Functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('.form-control');
    
    // Add placeholder attribute for floating labels
    inputs.forEach(input => {
        input.setAttribute('placeholder', ' ');
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
    
    // Input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

function handleFormSubmission() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification(
            currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields',
            'error'
        );
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification(
            currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address',
            'error'  
        );
        return;
    }
    
    // Simulate form submission
    showLoadingState();
    
    setTimeout(() => {
        showNotification(
            currentLang === 'ar' ? 'تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.' : 'Your message has been sent successfully! I will contact you soon.',
            'success'
        );
        document.getElementById('contactForm').reset();
        hideLoadingState();
    }, 2000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 1002;
            animation: slideInRight 0.3s ease;
            max-width: 350px;
        }
        
        [dir="rtl"] .notification {
            right: auto;
            left: 20px;
            animation: slideInLeft 0.3s ease;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = currentLang === 'ar' ? 
            'slideInLeft 0.3s ease reverse' : 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 4000);
}

function showLoadingState() {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span class="ar-text">جاري الإرسال...</span>
        <span class="en-text" style="display: none;">Sending...</span>
    `;
    
    // Update visibility based on current language
    if (currentLang === 'en') {
        submitBtn.querySelector('.ar-text').style.display = 'none';
        submitBtn.querySelector('.en-text').style.display = '';
    }
    
    submitBtn.dataset.originalText = originalText;
}

function hideLoadingState() {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = submitBtn.dataset.originalText;
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bootstrapCollapse = new bootstrap.Collapse(navbarCollapse);
                    bootstrapCollapse.hide();
                }
            }
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(29, 23, 22, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(29, 23, 22, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        }
        
        // Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        const rate = scrolled * -0.5;
        heroSection.style.transform = `translateY(${rate}px)`;
    }
});

// Course Cards Hover Effect Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Dynamic Typing Effect for Hero Title (Optional Enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const arText = 'إكرامي عبد اللطيف';
    const enText = 'Ekramy Abdellatif';
    
    let currentText = currentLang === 'ar' ? arText : enText;
    let charIndex = 0;
    
    function typeChar() {
        if (charIndex < currentText.length) {
            heroTitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeChar, 100);
        }
    }
    
    // Uncomment the line below if you want to enable typing effect
    // typeChar();
}

// Loading Screen (Optional)
function initLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p class="loader-text">
                <span class="ar-text">جاري التحميل...</span>
                <span class="en-text" style="display: none;">Loading...</span>
            </p>
        </div>
    `;
    
    const loaderStyles = document.createElement('style');
    loaderStyles.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        
        .loader-content {
            text-align: center;
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(243, 188, 119, 0.3);
            border-top: 3px solid var(--highlight-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        .loader-text {
            color: var(--highlight-color);
            font-size: 1.2rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(loaderStyles);
    document.body.appendChild(loader);
    
    // Update loader text based on language
    if (currentLang === 'en') {
        loader.querySelector('.ar-text').style.display = 'none';
        loader.querySelector('.en-text').style.display = '';
    }
    
    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
                if (loaderStyles.parentNode) {
                    loaderStyles.parentNode.removeChild(loaderStyles);
                }
            }, 500);
        }, 1000);
    });
}

// Initialize loading screen
// initLoadingScreen();

// Add scroll-to-top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    const btnStyles = document.createElement('style');
    btnStyles.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--accent-color);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: var(--transition);
            z-index: 999;
            box-shadow: var(--shadow-glow);
        }
        
        [dir="rtl"] .scroll-to-top {
            right: auto;
            left: 110px;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            background: var(--highlight-color);
            transform: translateY(-3px);
            box-shadow: var(--shadow-hover);
        }
    `;
    
    document.head.appendChild(btnStyles);
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
addScrollToTopButton();
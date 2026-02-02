// community.js - Community Hub page functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCommunityPage, 300);
});

function initCommunityPage() {
    console.log('👥 Initializing Community Hub page');
    
    try {
        // Wait for common.js components
        if (typeof initializeCommon === 'function') {
            console.log('✅ Common.js detected - using shared functionality');
        }
        
        // Initialize page-specific functionality
        initAOS();
        initScrollAnimations();
        initTouchEvents();
        initSocialCardAnimations();
        initDiscordPreview();
        
        console.log('✅ Community Hub page initialized');
    } catch (error) {
        console.error('❌ Error initializing Community Hub page:', error);
    }
}

// ========== PAGE-SPECIFIC AOS ANIMATIONS ==========
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 ? 'mobile' : false
        });
        
        // Refresh AOS on window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                AOS.refresh();
            }, 250);
        });
    }
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.social-card, .resource-card, .guideline-card, .related-card, ' +
        '.takeaway-item, .feature-highlight, .channel'
    );
    
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        function animateElements() {
            animatedElements.forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
                
                if (isVisible) {
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, index * 50);
                }
            });
        }
        
        window.addEventListener('scroll', animateElements);
        animateElements(); // Initial check
    }
}

// ========== SOCIAL CARD ANIMATIONS ==========
function initSocialCardAnimations() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        // Add click feedback
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return; // Don't interfere with link clicks
            
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Add hover effects
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.social-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.social-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        }
    });
}

// ========== DISCORD PREVIEW INTERACTIVITY ==========
function initDiscordPreview() {
    const previewChannels = document.querySelectorAll('.preview-channels .channel');
    const discordCta = document.querySelector('.discord-large-btn');
    
    if (!previewChannels.length) return;
    
    // Add click animation to preview channels
    previewChannels.forEach(channel => {
       

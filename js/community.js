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
        channel.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all channels
            previewChannels.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked channel
            this.classList.add('active');
            
            // Animate click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add pulse animation to Discord CTA
    if (discordCta) {
        setInterval(() => {
            discordCta.style.boxShadow = '0 0 0 0 rgba(88, 101, 242, 0.7)';
            setTimeout(() => {
                discordCta.style.boxShadow = '0 0 0 10px rgba(88, 101, 242, 0)';
            }, 10);
        }, 3000);
    }
}

// ========== TOUCH EVENTS ==========
function initTouchEvents() {
    // Add touch feedback for interactive elements
    document.querySelectorAll('.social-card, .resource-card, .guideline-card, .related-card').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
}

// ========== MEMBER COUNT ANIMATION ==========
function animateMemberCounts() {
    const memberCounts = document.querySelectorAll('.member-count');
    
    memberCounts.forEach(countElement => {
        const countSpan = countElement.querySelector('span');
        if (!countSpan) return;
        
        const originalText = countSpan.textContent;
        const match = originalText.match(/(\d+)(.+)/);
        
        if (match) {
            const number = parseInt(match[1]);
            const text = match[2];
            
            // Animate the number
            let current = 0;
            const increment = number / 50; // 50 steps
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    countSpan.textContent = number.toLocaleString() + text;
                    clearInterval(timer);
                } else {
                    countSpan.textContent = Math.floor(current).toLocaleString() + text;
                }
            }, 30);
        }
    });
}

// ========== SOCIAL SHARE FUNCTIONALITY ==========
function initSocialShare() {
    // Add share buttons functionality
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent('Join the RebelInuX community!');
            
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                    break;
                case 'discord':
                    // Discord doesn't have a direct share URL
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        alert('Community link copied to clipboard! Share it in Discord.');
                    });
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// ========== ADD TOUCH-ACTIVE CLASS STYLES ==========
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .touch-active {
            opacity: 0.7 !important;
            transform: scale(0.98) !important;
            transition: all 0.1s ease !important;
        }
        
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Initial state for scroll animations */
        .social-card, .resource-card, .guideline-card, .related-card,
        .takeaway-item, .feature-highlight, .channel {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        /* Discord CTA pulse animation */
        @keyframes discordPulse {
            0% {
                box-shadow: 0 0 0 0 rgba(88, 101, 242, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(88, 101, 242, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(88, 101, 242, 0);
            }
        }
        
        .discord-large-btn {
            animation: discordPulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
});

// ========== INITIALIZE ON LOAD ==========
// Start member count animation after page loads
setTimeout(animateMemberCounts, 1000);

// Initialize social share buttons
setTimeout(initSocialShare, 500);

// Export functions for global use
window.initCommunityPage = initCommunityPage;
window.animateMemberCounts = animateMemberCounts;
window.initSocialShare = initSocialShare;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunityPage);
} else {
    initCommunityPage();
}

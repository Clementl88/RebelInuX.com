// ========== GLOBAL STATE & CONFIGURATION ==========
const CONFIG = {
    debug: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    contractAddress: 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump',
    animationDelay: 100,
    mobileBreakpoint: 768
};

let isMobileMenuOpen = false;
let activeDropdown = null;

// ========== UTILITY FUNCTIONS ==========
function debounce(func, wait) {
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

function log(message, type = 'info') {
    if (CONFIG.debug) {
        const timestamp = new Date().toLocaleTimeString();
        const styles = {
            info: 'color: #4CAF50; font-weight: bold;',
            warn: 'color: #FF9800; font-weight: bold;',
            error: 'color: #F44336; font-weight: bold;',
            event: 'color: #2196F3; font-weight: bold;'
        };
        console.log(`%c[${timestamp}] ${message}`, styles[type] || styles.info);
    }
}

function isMobile() {
    return window.innerWidth <= CONFIG.mobileBreakpoint;
}

// ========== LOADER MANAGEMENT ==========
function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    loader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    
    setTimeout(() => {
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
        log('Loader hidden');
    }, 500);
}

// ========== PREMIUM MOBILE NAVIGATION ==========
function setupPremiumMobileNavigation() {
    log('Setting up premium mobile navigation...', 'event');
    
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navDesktop = document.getElementById('nav-desktop');
    const body = document.body;
    
    if (!mobileToggle || !navDesktop) {
        log('Mobile navigation elements not found', 'warn');
        return;
    }
    
    // Add attention pulse on first load
    setTimeout(() => {
        mobileToggle.classList.add('pulse');
        setTimeout(() => {
            mobileToggle.classList.remove('pulse');
        }, 4000);
    }, 2000);
    
    // Enhanced click handler
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpening = !navDesktop.classList.contains('active');
        
        log(`Mobile toggle clicked - Opening: ${isOpening}, Mobile: ${isMobile()}`, 'event');
        
        // Haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
        
        if (isOpening) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    });
    
    function openMobileMenu() {
        // Lock body scroll
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
        
        // Open navigation
        navDesktop.classList.add('active');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        navDesktop.setAttribute('aria-hidden', 'false');
        
        // Trap focus for accessibility
        trapFocusInMenu(navDesktop);
        
        // Add event listeners
        setTimeout(() => {
            document.addEventListener('click', handleBackdropClick);
            document.addEventListener('keydown', handleEscapeKey);
        }, 10);
        
        // Staggered animation for menu items
        const menuItems = navDesktop.querySelectorAll('.nav-link, .dropbtn');
        menuItems.forEach((item, index) => {
            item.style.transitionDelay = `${0.1 + (index * 0.05)}s`;
        });
        
        isMobileMenuOpen = true;
        log('Mobile menu opened');
    }
    
    function closeMobileMenu() {
        // Unlock body scroll
        body.classList.remove('menu-open');
        body.style.overflow = '';
        
        // Close navigation
        navDesktop.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        navDesktop.setAttribute('aria-hidden', 'true');
        
        // Remove event listeners
        document.removeEventListener('click', handleBackdropClick);
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Reset animation delays
        const menuItems = navDesktop.querySelectorAll('.nav-link, .dropbtn');
        menuItems.forEach(item => {
            item.style.transitionDelay = '';
        });
        
        // Return focus to toggle button
        mobileToggle.focus();
        
        // Close any open dropdowns
        closeAllDropdowns();
        
        isMobileMenuOpen = false;
        log('Mobile menu closed');
    }
    
    function handleBackdropClick(e) {
        if (!navDesktop.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    }
    
    function handleEscapeKey(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeMobileMenu();
        }
    }
    
    function trapFocusInMenu(menuElement) {
        const focusableElements = menuElement.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        setTimeout(() => firstElement.focus(), 100);
        
        // Trap focus within menu
        menuElement.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    // Handle window resize
    const handleResize = debounce(() => {
        if (!isMobile() && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Touch gestures for mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    navDesktop.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    navDesktop.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        const swipeDistance = touchStartY - touchEndY;
        
        // Swipe down to close if at the top of the menu
        if (swipeDistance > 50 && navDesktop.scrollTop <= 0) {
            closeMobileMenu();
        }
    }, { passive: true });
    
    log('Premium mobile navigation setup complete');
}

// ========== DROPDOWN MANAGEMENT ==========
function setupDropdowns() {
    log('Setting up dropdowns...', 'event');
    
    const dropdowns = document.querySelectorAll('.dropdown');
    const buyDropdowns = document.querySelectorAll('.buy-dropdown');
    
    log(`Found ${dropdowns.length} dropdowns and ${buyDropdowns.length} buy dropdowns`);
    
    // Handle regular dropdowns
    dropdowns.forEach((dropdown, index) => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (!dropbtn || !content) return;
        
        dropbtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            log(`Dropdown ${index + 1} clicked`, 'event');
            
            const isActive = dropdown.classList.contains('active');
            const isMobileView = isMobile();
            
            if (isMobileView) {
                // Mobile dropdown behavior
                if (!isActive) {
                    // Close all other dropdowns
                    closeAllDropdowns();
                    
                    // Open this dropdown
                    dropdown.classList.add('active');
                    dropbtn.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    
                    activeDropdown = dropdown;
                    log(`Mobile dropdown ${index + 1} opened`);
                } else {
                    closeDropdown(dropdown);
                }
            } else {
                // Desktop dropdown behavior
                if (!isActive) {
                    closeAllDropdowns();
                    dropdown.classList.add('active');
                    dropbtn.setAttribute('aria-expanded', 'true');
                    log(`Desktop dropdown ${index + 1} opened`);
                } else {
                    closeDropdown(dropdown);
                }
            }
        });
    });
    
    // Handle buy dropdowns
    buyDropdowns.forEach((buyDropdown, index) => {
        const buyToggle = buyDropdown.querySelector('.buy-toggle');
        const buyOptions = buyDropdown.querySelector('.buy-options');
        
        if (!buyToggle || !buyOptions) return;
        
        buyToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            log(`Buy dropdown ${index + 1} clicked`, 'event');
            
            const isActive = buyDropdown.classList.contains('active');
            const isMobileView = isMobile();
            
            if (!isActive) {
                // Close all other dropdowns
                closeAllDropdowns();
                
                // Open this dropdown
                buyDropdown.classList.add('active');
                buyToggle.classList.add('active');
                buyToggle.setAttribute('aria-expanded', 'true');
                
                if (isMobileView) {
                    // Mobile specific behavior
                    document.body.style.overflow = 'hidden';
                }
                
                activeDropdown = buyDropdown;
                log(`Buy dropdown ${index + 1} opened`);
            } else {
                closeBuyDropdown(buyDropdown);
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const clickedDropdown = e.target.closest('.dropdown');
        const clickedBuyDropdown = e.target.closest('.buy-dropdown');
        
        if (!clickedDropdown && !clickedBuyDropdown) {
            closeAllDropdowns();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeAllDropdowns();
        }
    });
    
    log('Dropdowns setup complete');
}

function closeAllDropdowns() {
    log('Closing all dropdowns...', 'event');
    
    // Close regular dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        closeDropdown(dropdown);
    });
    
    // Close buy dropdowns
    document.querySelectorAll('.buy-dropdown').forEach(buyDropdown => {
        closeBuyDropdown(buyDropdown);
    });
    
    // Reset body overflow for mobile
    if (isMobile()) {
        document.body.style.overflow = '';
    }
    
    activeDropdown = null;
}

function closeDropdown(dropdown) {
    const dropbtn = dropdown.querySelector('.dropbtn');
    const content = dropdown.querySelector('.dropdown-content');
    
    dropdown.classList.remove('active');
    
    if (dropbtn) {
        dropbtn.classList.remove('active');
        dropbtn.setAttribute('aria-expanded', 'false');
    }
    
    if (content && isMobile()) {
        content.style.maxHeight = null;
    }
}

function closeBuyDropdown(buyDropdown) {
    const buyToggle = buyDropdown.querySelector('.buy-toggle');
    const buyOptions = buyDropdown.querySelector('.buy-options');
    
    buyDropdown.classList.remove('active');
    
    if (buyToggle) {
        buyToggle.classList.remove('active');
        buyToggle.setAttribute('aria-expanded', 'false');
    }
    
    if (buyOptions && isMobile()) {
        buyOptions.style.transform = 'translateY(100%)';
    }
}

// ========== HEADER SCROLL EFFECT ==========
function setupHeaderScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let ticking = false;
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    updateHeader();
    log('Header scroll effect initialized');
}

// ========== BUY DROPDOWN CONTRACT COPY ==========
function setupContractCopy() {
    window.copyContract = function() {
        const copyMessage = document.getElementById('copyMessage');
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(CONFIG.contractAddress)
                .then(() => {
                    showCopySuccess(copyMessage);
                })
                .catch(err => {
                    console.error('Failed to copy contract:', err);
                    fallbackCopy(CONFIG.contractAddress);
                });
        } else {
            // Fallback for older browsers
            fallbackCopy(CONFIG.contractAddress);
        }
    };
    
    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            const copyMessage = document.getElementById('copyMessage');
            showCopySuccess(copyMessage);
        } catch (err) {
            console.error('Fallback copy failed:', err);
            alert('Failed to copy contract address. Please copy manually: ' + text);
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopySuccess(element) {
        if (element) {
            element.classList.add('show');
            setTimeout(() => {
                element.classList.remove('show');
            }, 2000);
        }
    }
    
    log('Contract copy functionality setup');
}

// ========== BACK TO TOP BUTTON ==========
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    let ticking = false;
    
    function updateBackToTop() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateBackToTop);
            ticking = true;
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            const firstFocusable = document.querySelector('header a, header button');
            if (firstFocusable) firstFocusable.focus();
        }, 500);
    });
    
    log('Back to top button setup complete');
}

// ========== ACTIVE NAVIGATION ==========
function setActiveNavItem() {
    log('Setting active navigation item...', 'event');
    
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Remove active from all nav items
    document.querySelectorAll('.nav-link, .dropbtn').forEach(el => {
        el.classList.remove('active');
    });
    
    // Define active page mapping
    const pageMap = {
        'index.html': '.brand-link',
        'trade.html': '.nav-trade',
        'epoch-rewards.html': '.nav-rewards',
        'tokenomics.html': '.nav-tokenomics',
        'security.html': '.nav-security',
        'community.html': '.nav-community',
        'governance.html': '.nav-governance',
        'roadmap.html': '.nav-roadmap',
        'integrity.html': '.nav-integrity',
        'artwork.html': '.nav-artwork',
        'REBL-calculator.html': '.nav-calculator',
        'whitepaper.html': '.nav-whitepaper'
    };
    
    const selector = pageMap[currentPage];
    if (selector) {
        const activeElement = document.querySelector(selector);
        if (activeElement) {
            activeElement.classList.add('active');
            
            // If it's in a dropdown, also mark the dropdown button as active
            const dropdown = activeElement.closest('.dropdown-content');
            if (dropdown) {
                const dropdownBtn = dropdown.previousElementSibling;
                if (dropdownBtn && dropdownBtn.classList.contains('dropbtn')) {
                    dropdownBtn.classList.add('active');
                }
            }
            
            log(`Active page set to: ${currentPage}`);
        }
    }
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
function setupPerformance() {
    // Use passive event listeners for touch events
    const options = { passive: true };
    
    document.addEventListener('touchstart', function() {}, options);
    document.addEventListener('touchmove', function() {}, options);
    document.addEventListener('touchend', function() {}, options);
    
    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        document.body.classList.add('resizing');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.body.classList.remove('resizing');
        }, 250);
    });
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    log('Performance optimizations applied');
}

// ========== INITIALIZATION ==========
function initializeCommon() {
    log('🚀 Initializing common functionality...', 'event');
    
    try {
        // 1. Hide loader
        hideLoader();
        
        // 2. Setup performance optimizations
        setupPerformance();
        
        // 3. Setup header scroll effect
        setupHeaderScrollEffect();
        
        // 4. Setup premium mobile navigation
        setupPremiumMobileNavigation();
        
        // 5. Setup dropdowns
        setupDropdowns();
        
        // 6. Setup contract copy
        setupContractCopy();
        
        // 7. Setup back to top
        setupBackToTop();
        
        // 8. Set active navigation item
        setActiveNavItem();
        
        // 9. Add JavaScript detection class
        document.body.classList.add('js-enabled');
        
        log('✅ All functionality initialized successfully');
        
        // Debug commands for development
        if (CONFIG.debug) {
            window.debugInfo = function() {
                console.log('=== DEBUG INFORMATION ===');
                console.log('Mobile Menu Open:', isMobileMenuOpen);
                console.log('Active Dropdown:', activeDropdown);
                console.log('Is Mobile:', isMobile());
                console.log('Window Size:', window.innerWidth, 'x', window.innerHeight);
                console.log('Scroll Position:', window.scrollY);
            };
            console.log('🔧 Debug commands available: debugInfo()');
        }
    } catch (error) {
        log(`Error initializing common functionality: ${error}`, 'error');
    }
}

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    log('📄 DOM Content Loaded');
    
    // Start initialization with a small delay
    setTimeout(initializeCommon, CONFIG.animationDelay);
});

// ========== EXPORT FUNCTIONS ==========
window.setupPremiumMobileNavigation = setupPremiumMobileNavigation;
window.setupDropdowns = setupDropdowns;
window.setupBackToTop = setupBackToTop;
window.setActiveNavItem = setActiveNavItem;
window.closeAllDropdowns = closeAllDropdowns;
window.initializeCommon = initializeCommon;
window.copyContract = window.copyContract || function() {
    console.warn('copyContract function not available');
};

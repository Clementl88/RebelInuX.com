// js/common.js - Professional mobile navigation with premium animations

// ========== GLOBAL STATE ==========
let isMobileMenuOpen = false;
let isDropdownOpen = false;

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
    console.log('📜 Header scroll effect initialized');
}

// ========== BUY DROPDOWN TOGGLE ==========
function setupBuyDropdown() {
    console.log('🛒 Setting up Buy dropdown...');
    
    const buyToggles = document.querySelectorAll('.buy-toggle');
    const buyDropdowns = document.querySelectorAll('.buy-dropdown');
    
    if (buyToggles.length === 0 || buyDropdowns.length === 0) {
        console.warn('⚠️ No buy dropdown elements found');
        return;
    }
    
    // Remove any existing event listeners by cloning
    buyToggles.forEach((toggle) => {
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
    });
    
    // Re-select the fresh buttons
    const freshBuyToggles = document.querySelectorAll('.buy-toggle');
    
    freshBuyToggles.forEach((toggle, index) => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.buy-dropdown');
            if (!dropdown) return;
            
            const isActive = dropdown.classList.contains('active');
            const isMobile = window.innerWidth <= 768;
            
            console.log(`🛒 Buy dropdown clicked - Active: ${isActive}, Mobile: ${isMobile}`);
            
            // Close all other dropdowns
            closeAllDropdowns();
            
            // Toggle this dropdown
            if (!isActive) {
                dropdown.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                if (isMobile) {
                    isDropdownOpen = true;
                    document.body.classList.add('dropdown-open');
                }
                
                console.log(`✅ Buy dropdown ${index + 1} opened`);
            } else {
                dropdown.classList.remove('active');
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                
                if (isMobile) {
                    isDropdownOpen = false;
                    document.body.classList.remove('dropdown-open');
                }
                
                console.log(`✅ Buy dropdown ${index + 1} closed`);
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        
        if (!e.target.closest('.buy-dropdown') && !e.target.closest('.dropdown')) {
            buyDropdowns.forEach(d => {
                d.classList.remove('active');
                const toggle = d.querySelector('.buy-toggle');
                if (toggle) {
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
            
            if (isMobile && isDropdownOpen) {
                isDropdownOpen = false;
                document.body.classList.remove('dropdown-open');
            }
        }
    });
    
    // Copy contract address function
    window.copyContract = function() {
        const contract = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
        const copyMessage = document.getElementById('copyMessage');
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(contract)
                .then(() => {
                    showCopySuccess(copyMessage);
                })
                .catch(err => {
                    console.error('Failed to copy contract:', err);
                    fallbackCopy(contract);
                });
        } else {
            // Fallback for older browsers
            fallbackCopy(contract);
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
    
    console.log('✅ Buy dropdown setup complete');
}

// ========== PREMIUM MOBILE NAVIGATION ==========
function setupMobileNavigation() {
    console.log('📱 Setting up premium mobile navigation...');
    
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navDesktop = document.getElementById('nav-desktop');
    
    if (!mobileToggle || !navDesktop) {
        console.warn('⚠️ Mobile navigation elements not found');
        return;
    }
    
    // Set up staggered animation delays
    function setupStaggeredAnimation() {
        const menuItems = navDesktop.querySelectorAll('a:not(.buy-toggle), .dropdown, .buy-dropdown.mobile-only');
        menuItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
            item.style.transitionDelay = `${index * 0.05}s`;
        });
    }
    
    // Close mobile navigation function
    function closeMobileNav() {
        navDesktop.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        navDesktop.setAttribute('aria-hidden', 'true');
        
        // Reset body
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        
        // Close all dropdowns
        closeAllDropdowns();
        
        // Reset animation delays
        const menuItems = navDesktop.querySelectorAll('a:not(.buy-toggle), .dropdown');
        menuItems.forEach(item => {
            item.style.transitionDelay = '';
        });
        
        isMobileMenuOpen = false;
        console.log('📱 Mobile navigation closed');
    }
    
    // Open mobile navigation function
    function openMobileNav() {
        navDesktop.classList.add('active');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        navDesktop.setAttribute('aria-hidden', 'false');
        
        // Set up animations
        setupStaggeredAnimation();
        
        // Lock body scroll
        document.body.classList.add('nav-open');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        setTimeout(() => {
            const firstFocusable = navDesktop.querySelector('a:not(.buy-toggle), .dropbtn');
            if (firstFocusable) firstFocusable.focus();
        }, 100);
        
        isMobileMenuOpen = true;
        console.log('📱 Mobile navigation opened');
    }
    
    // Main toggle click handler
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpening = !navDesktop.classList.contains('active');
        
        if (isOpening) {
            openMobileNav();
        } else {
            closeMobileNav();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768) return;
        
        if (isMobileMenuOpen && 
            !e.target.closest('#nav-desktop') && 
            !e.target.closest('#mobileNavToggle')) {
            closeMobileNav();
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileNav();
            mobileToggle.focus();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                closeMobileNav();
            }
        }, 250);
    });
    
    // Add swipe to close on mobile
    let touchStartY = 0;
    let touchStartX = 0;
    
    navDesktop.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    navDesktop.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        
        const swipeDistanceY = touchEndY - touchStartY;
        const swipeDistanceX = Math.abs(touchEndX - touchStartX);
        
        // Only close if it's a significant downward swipe (not a horizontal swipe)
        if (swipeDistanceY > 100 && swipeDistanceX < 50) {
            closeMobileNav();
        }
    }, { passive: true });
    
    console.log('✅ Premium mobile navigation setup complete');
}

// ========== DROPDOWN MANAGEMENT ==========
function setupDropdowns() {
    console.log('🔽 Setting up dropdowns...');
    
    const dropbtns = document.querySelectorAll('.dropbtn');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    console.log(`Found ${dropbtns.length} dropdown buttons and ${dropdowns.length} dropdowns`);
    
    if (dropbtns.length === 0 || dropdowns.length === 0) {
        console.warn('⚠️ Dropdown elements not found');
        return;
    }
    
    // Remove any existing event listeners by cloning
    dropbtns.forEach((dropbtn) => {
        const newDropbtn = dropbtn.cloneNode(true);
        dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
    });
    
    // Re-select fresh buttons
    const freshDropbtns = document.querySelectorAll('.dropbtn');
    
    freshDropbtns.forEach((dropbtn, index) => {
        dropbtn.addEventListener('click', function(e) {
            console.log(`🎯 Dropdown ${index + 1} clicked`);
            
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.dropdown');
            if (!dropdown) return;
            
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (!dropdownContent) return;
            
            const isMobile = window.innerWidth <= 768;
            const isOpen = dropdown.classList.contains('active');
            
            console.log(`📱 Dropdown state - Open: ${isOpen}, Mobile: ${isMobile}`);
            
            // Close all other dropdowns first
            closeAllDropdowns();
            
            // Close buy dropdowns
            document.querySelectorAll('.buy-dropdown').forEach(d => {
                d.classList.remove('active');
                const toggle = d.querySelector('.buy-toggle');
                if (toggle) {
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle this dropdown
            if (!isOpen) {
                dropdown.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                if (isMobile) {
                    isDropdownOpen = true;
                    document.body.classList.add('dropdown-open');
                }
                
                console.log('✅ Dropdown opened');
            } else {
                dropdown.classList.remove('active');
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                
                if (isMobile) {
                    isDropdownOpen = false;
                    document.body.classList.remove('dropdown-open');
                }
                
                console.log('✅ Dropdown closed');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Don't close if clicking inside an open dropdown
            if (e.target.closest('.dropdown.active') || 
                e.target.closest('.buy-dropdown.active') ||
                e.target.closest('#mobileNavToggle')) {
                return;
            }
        }
        
        if (!e.target.closest('.dropdown') && !e.target.closest('.buy-dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // Handle dropdown item clicks (for mobile)
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function() {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Close the dropdown after a short delay
                const dropdown = this.closest('.dropdown');
                if (dropdown) {
                    setTimeout(() => {
                        closeDropdown(dropdown);
                    }, 300);
                }
            }
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            
            if (!isMobile) {
                // Reset to desktop
                closeAllDropdowns();
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.style.maxHeight = '';
                });
                document.body.classList.remove('dropdown-open');
                document.body.classList.remove('nav-open');
                document.body.style.overflow = '';
            } else {
                // Reset mobile styles
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    if (!content.closest('.dropdown')?.classList.contains('active')) {
                        content.style.maxHeight = '0';
                    }
                });
            }
        }, 250);
    });
    
    console.log('✅ Dropdowns setup complete');
}

function closeAllDropdowns() {
    const isMobile = window.innerWidth <= 768;
    
    console.log('🔽 Closing all dropdowns...');
    
    // Remove active class from dropdown containers
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
    
    // Remove active class from buttons and reset aria
    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
    });
    
    // Close buy dropdowns
    document.querySelectorAll('.buy-dropdown').forEach(d => {
        d.classList.remove('active');
        const toggle = d.querySelector('.buy-toggle');
        if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Reset body classes
    if (isMobile) {
        isDropdownOpen = false;
        document.body.classList.remove('dropdown-open');
    }
}

function closeDropdown(dropdownElement) {
    if (!dropdownElement) return;
    
    const isMobile = window.innerWidth <= 768;
    const dropbtn = dropdownElement.querySelector('.dropbtn');
    const dropdownContent = dropdownElement.querySelector('.dropdown-content');
    
    dropdownElement.classList.remove('active');
    
    if (dropbtn) {
        dropbtn.classList.remove('active');
        dropbtn.setAttribute('aria-expanded', 'false');
    }
    
    if (dropdownContent && isMobile) {
        dropdownContent.style.maxHeight = '0';
    }
    
    if (isMobile) {
        isDropdownOpen = false;
        document.body.classList.remove('dropdown-open');
    }
}

// ========== BACK TO TOP ==========
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
    
    console.log('⬆️ Back to top button setup complete');
}

// ========== ACTIVE NAVIGATION ==========
function setActiveNavItem() {
    console.log('📍 Setting active navigation item...');
    
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Remove active from all nav items
    document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
        el.classList.remove('active');
    });
    
    // Define active page mapping
    const pageMap = {
        'index.html': 'a[href="index.html"]',
        'trade.html': 'a.nav-trade',
        'epoch-rewards.html': 'a.nav-rewards',
        'tokenomics.html': 'a.nav-tokenomics',
        'security.html': 'a.nav-security',
        'community.html': 'a.nav-community',
        'governance.html': 'a.nav-governance',
        'roadmap.html': 'a.nav-roadmap',
        'integrity.html': 'a.nav-integrity',
        'artwork.html': 'a.nav-artwork',
        'REBL-calculator.html': 'a.nav-calculator',
        'whitepaper.html': 'a.nav-whitepaper'
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
        }
    }
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
function setupPerformance() {
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            window.dispatchEvent(new Event('resizeDone'));
        }, 250);
    });
    
    // Lazy load images
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
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Use passive event listeners for touch events
    const options = { passive: true };
    
    document.addEventListener('touchstart', function() {}, options);
    document.addEventListener('touchmove', function() {}, options);
    document.addEventListener('touchend', function() {}, options);
    
    // Debounce resize events for mobile
    let resizeTimer;
    window.addEventListener('resize', function() {
        document.body.classList.add('resizing');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.body.classList.remove('resizing');
        }, 250);
    });
    
    // Optimize animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });
        
        document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
            observer.observe(el);
        });
    }
}

// ========== DEBUG FUNCTION ==========
function debugMobileDropdowns() {
    console.log('=== MOBILE DROPDOWN DEBUG ===');
    console.log('Window width:', window.innerWidth);
    console.log('Is mobile?', window.innerWidth <= 768);
    console.log('Is mobile menu open?', isMobileMenuOpen);
    console.log('Is dropdown open?', isDropdownOpen);
    
    // Check dropdown elements
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach((dropdown, i) => {
        const isActive = dropdown.classList.contains('active');
        const content = dropdown.querySelector('.dropdown-content');
        const computedStyle = window.getComputedStyle(content);
        
        console.log(`Dropdown ${i + 1}:`, {
            isActive: isActive,
            display: computedStyle.display,
            opacity: computedStyle.opacity,
            visibility: computedStyle.visibility,
            maxHeight: computedStyle.maxHeight,
            transform: computedStyle.transform
        });
    });
    
    // Check buy dropdown
    const buyDropdown = document.querySelector('.buy-dropdown');
    if (buyDropdown) {
        const isActive = buyDropdown.classList.contains('active');
        const content = buyDropdown.querySelector('.buy-options');
        const computedStyle = window.getComputedStyle(content);
        
        console.log('Buy dropdown:', {
            isActive: isActive,
            display: computedStyle.display,
            opacity: computedStyle.opacity,
            visibility: computedStyle.visibility,
            transform: computedStyle.transform
        });
    }
}

// ========== LOADER ==========
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
    }
}

// ========== INITIALIZE EVERYTHING ==========
function initializeCommon() {
    console.log('🚀 Initializing common functionality...');
    
    try {
        // 1. Hide loader
        hideLoader();
        
        // 2. Setup performance optimizations
        setupPerformance();
        
        // 3. Setup header scroll effect
        setupHeaderScrollEffect();
        
        // 4. Setup mobile navigation
        setupMobileNavigation();
        
        // 5. Setup dropdowns
        setupDropdowns();
        
        // 6. Setup buy dropdown
        setupBuyDropdown();
        
        // 7. Setup back to top
        setupBackToTop();
        
        // 8. Set active navigation item
        setActiveNavItem();
        
        // 9. Add body class for JavaScript detection
        document.body.classList.add('js-enabled');
        
        console.log('✅ Common functionality initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing common functionality:', error);
    }
}

// ========== INITIALIZE ON DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded (common.js)');
    
    // Start initialization with a small delay
    setTimeout(initializeCommon, 100);
    
    // Add debug command to window for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugMobileDropdowns = debugMobileDropdowns;
        console.log('🔧 Debug commands available: debugMobileDropdowns()');
    }
});

// ========== EXPORT FUNCTIONS FOR OTHER FILES ==========
window.setupMobileNavigation = setupMobileNavigation;
window.setupDropdowns = setupDropdowns;
window.setupBackToTop = setupBackToTop;
window.setActiveNavItem = setActiveNavItem;
window.closeAllDropdowns = closeAllDropdowns;
window.closeMobileNav = closeMobileNav;
window.initializeCommon = initializeCommon;

// common.js - Professional mobile navigation with premium animations
// COMPLETE FIXED VERSION - More button works every timeù

// ========== GLOBAL STATE ==========
let isMobileMenuOpen = false;
let isDropdownOpen = false;
let activeDropdown = null;

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
}

// ========== SINGLE DROPDOWN SYSTEM (Handles ALL dropdowns) ==========
function setupDropdownSystem() {
    console.log('🔽 Setting up unified dropdown system...');
    
    // Get all dropdown elements
    const dropbtns = document.querySelectorAll('.dropbtn');
    const dropdowns = document.querySelectorAll('.dropdown');
    const buyToggles = document.querySelectorAll('.buy-toggle');
    const buyDropdowns = document.querySelectorAll('.buy-dropdown');
    
    // ========== CLOSE ALL DROPDOWNS FUNCTION ==========
    function closeAllDropdowns() {
        console.log('🔽 Closing all dropdowns');
        
        dropdowns.forEach(d => {
            d.classList.remove('active');
            const btn = d.querySelector('.dropbtn');
            if (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
        
        buyDropdowns.forEach(d => {
            d.classList.remove('active');
            const toggle = d.querySelector('.buy-toggle');
            if (toggle) {
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Reset mobile state
        if (window.innerWidth <= 768) {
            isDropdownOpen = false;
            document.body.classList.remove('dropdown-open');
        }
        
        activeDropdown = null;
    }
    
    // ========== CLOSE OTHER DROPDOWNS ==========
    function closeOtherDropdowns(currentElement) {
        const isMobile = window.innerWidth <= 768;
        
        // Close all dropdowns except the current one
        dropdowns.forEach(d => {
            if (d !== currentElement.closest('.dropdown') && 
                d !== currentElement.closest('.buy-dropdown')) {
                d.classList.remove('active');
                const btn = d.querySelector('.dropbtn');
                if (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        // Close buy dropdowns except current
        buyDropdowns.forEach(d => {
            if (d !== currentElement.closest('.buy-dropdown') && 
                d !== currentElement.closest('.dropdown')) {
                d.classList.remove('active');
                const toggle = d.querySelector('.buy-toggle');
                if (toggle) {
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        if (isMobile && !currentElement.closest('.dropdown') && !currentElement.closest('.buy-dropdown')) {
            document.body.classList.remove('dropdown-open');
        }
    }
    
    // ========== DROPDOWN BUTTON CLICK HANDLER ==========
    function handleDropdownClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropbtn = e.currentTarget;
        const dropdown = dropbtn.closest('.dropdown');
        const isMobile = window.innerWidth <= 768;
        
        console.log('🎯 Dropdown clicked:', dropbtn.textContent.trim());
        
        // Close other dropdowns first
        closeOtherDropdowns(dropbtn);
        
        // Check if this dropdown is already active
        const isActive = dropdown.classList.contains('active');
        
        if (!isActive) {
            // Open dropdown
            dropdown.classList.add('active');
            dropbtn.classList.add('active');
            dropbtn.setAttribute('aria-expanded', 'true');
            activeDropdown = dropdown;
            
            if (isMobile) {
                isDropdownOpen = true;
                document.body.classList.add('dropdown-open');
            }
            
            console.log('✅ Dropdown opened');
        } else {
            // Close dropdown
            dropdown.classList.remove('active');
            dropbtn.classList.remove('active');
            dropbtn.setAttribute('aria-expanded', 'false');
            activeDropdown = null;
            
            if (isMobile) {
                isDropdownOpen = false;
                document.body.classList.remove('dropdown-open');
            }
            
            console.log('✅ Dropdown closed');
        }
    }
    
    // ========== BUY TOGGLE CLICK HANDLER ==========
    function handleBuyToggleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const toggle = e.currentTarget;
        const dropdown = toggle.closest('.buy-dropdown');
        const isMobile = window.innerWidth <= 768;
        
        console.log('🛒 Buy toggle clicked');
        
        // Close other dropdowns first
        closeOtherDropdowns(toggle);
        
        // Check if this dropdown is already active
        const isActive = dropdown.classList.contains('active');
        
        if (!isActive) {
            // Open dropdown
            dropdown.classList.add('active');
            toggle.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            activeDropdown = dropdown;
            
            if (isMobile) {
                isDropdownOpen = true;
                document.body.classList.add('dropdown-open');
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('nav-desktop');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.getElementById('mobileNavToggle')?.classList.remove('active');
                    document.body.classList.remove('nav-open');
                    isMobileMenuOpen = false;
                }
            }
            
            console.log('✅ Buy dropdown opened');
        } else {
            // Close dropdown
            dropdown.classList.remove('active');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            activeDropdown = null;
            
            if (isMobile) {
                isDropdownOpen = false;
                document.body.classList.remove('dropdown-open');
            }
            
            console.log('✅ Buy dropdown closed');
        }
    }
    
    // ========== SETUP EVENT LISTENERS ==========
    
    // Setup dropdown buttons
    dropbtns.forEach(dropbtn => {
        // Remove existing listeners by cloning
        const newDropbtn = dropbtn.cloneNode(true);
        dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
    });
    
    // Re-select fresh buttons and add listeners
    document.querySelectorAll('.dropbtn').forEach(dropbtn => {
        dropbtn.addEventListener('click', handleDropdownClick);
    });
    
    // Setup buy toggles
    buyToggles.forEach(toggle => {
        // Remove existing listeners by cloning
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
    });
    
    // Re-select fresh toggles and add listeners
    document.querySelectorAll('.buy-toggle').forEach(toggle => {
        toggle.addEventListener('click', handleBuyToggleClick);
    });
    
    // ========== CLICK OUTSIDE HANDLER ==========
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        const clickedInsideDropdown = e.target.closest('.dropdown') || e.target.closest('.buy-dropdown');
        const clickedToggle = e.target.closest('.dropbtn') || e.target.closest('.buy-toggle');
        
        // If clicking outside any dropdown or toggle
        if (!clickedInsideDropdown && !clickedToggle) {
            closeAllDropdowns();
            
            if (isMobile) {
                document.body.classList.remove('dropdown-open');
            }
        }
    });
    
    // ========== ESCAPE KEY HANDLER ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
            
            if (window.innerWidth <= 768) {
                document.body.classList.remove('dropdown-open');
            }
        }
    });
    
    // ========== WINDOW RESIZE HANDLER ==========
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Reset mobile states on desktop
                closeAllDropdowns();
                document.body.classList.remove('dropdown-open');
                document.body.classList.remove('nav-open');
            }
        }, 250);
    });
    
    console.log('✅ Unified dropdown system setup complete');
}

// ========== MOBILE NAVIGATION ==========
function setupMobileNavigation() {
    console.log('📱 Setting up mobile navigation...');
    
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navDesktop = document.getElementById('nav-desktop');
    
    if (!mobileToggle || !navDesktop) {
        console.warn('⚠️ Mobile navigation elements not found');
        return;
    }
    
    // Set up staggered animation delays
    function setupStaggeredAnimation() {
        const menuItems = navDesktop.querySelectorAll('a:not(.buy-toggle), .dropdown, .buy-dropdown.mobile-buy');
        menuItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
            item.style.transitionDelay = `${index * 0.05}s`;
        });
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
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown, .buy-dropdown').forEach(d => {
                d.classList.remove('active');
                const toggle = d.querySelector('.dropbtn, .buy-toggle');
                if (toggle) {
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
            document.body.classList.remove('dropdown-open');
        }
        
        // Reset animation delays
        const menuItems = navDesktop.querySelectorAll('a:not(.buy-toggle), .dropdown');
        menuItems.forEach(item => {
            item.style.transitionDelay = '';
        });
        
        isMobileMenuOpen = false;
        console.log('📱 Mobile navigation closed');
    }
    
    console.log('✅ Mobile navigation setup complete');
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
    
    // Use passive event listeners for touch events
    const options = { passive: true };
    
    document.addEventListener('touchstart', function() {}, options);
    document.addEventListener('touchmove', function() {}, options);
    document.addEventListener('touchend', function() {}, options);
    
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

// ========== COPY CONTRACT FUNCTION ==========
window.copyContract = function() {
    const contract = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    const copyMessage = document.getElementById('copyMessage');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(contract)
            .then(() => {
                if (copyMessage) {
                    copyMessage.classList.add('show');
                    setTimeout(() => {
                        copyMessage.classList.remove('show');
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy contract:', err);
                fallbackCopy(contract);
            });
    } else {
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
        if (copyMessage) {
            copyMessage.classList.add('show');
            setTimeout(() => {
                copyMessage.classList.remove('show');
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy contract address. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// ========== DEBUG FUNCTION ==========
function debugMobileDropdowns() {
    console.log('=== MOBILE DROPDOWN DEBUG ===');
    console.log('Window width:', window.innerWidth);
    console.log('Is mobile?', window.innerWidth <= 768);
    console.log('Is mobile menu open?', isMobileMenuOpen);
    console.log('Is dropdown open?', isDropdownOpen);
    console.log('Active dropdown:', activeDropdown);
    
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
        
        // 4. Setup mobile navigation (SIMPLIFIED - no dropdown logic)
        setupMobileNavigation();
        
        // 5. Setup unified dropdown system (Handles ALL dropdowns)
        setupDropdownSystem();
        
        // 6. Setup back to top
        setupBackToTop();
        
        // 7. Set active navigation item
        setActiveNavItem();
        
        // 8. Add body class for JavaScript detection
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
window.setupDropdownSystem = setupDropdownSystem;
window.setupBackToTop = setupBackToTop;
window.setActiveNavItem = setActiveNavItem;
window.closeAllDropdowns = function() {
    // This function is now inside setupDropdownSystem
    // For external access, trigger click on body
    document.body.click();
};
window.closeMobileNav = function() {
    const navDesktop = document.getElementById('nav-desktop');
    const mobileToggle = document.getElementById('mobileNavToggle');
    
    if (navDesktop && navDesktop.classList.contains('active')) {
        navDesktop.classList.remove('active');
        mobileToggle?.classList.remove('active');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        isMobileMenuOpen = false;
    }
};
window.initializeCommon = initializeCommon;

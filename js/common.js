// js/common.js - Main functionality for all pages

// ========== GLOBAL STATE ==========
let isMobileMenuOpen = false;

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
    
    // Initial check
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
    
    buyToggles.forEach((toggle) => {
        // Remove any existing event listeners by cloning
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
            
            // Close all other dropdowns
            closeAllDropdowns();
            
            // On mobile, don't close mobile nav when opening buy dropdown
            if (isMobile && isActive) {
                // If closing the buy dropdown, also close mobile nav if needed
                const navDesktop = document.getElementById('nav-desktop');
                if (navDesktop && navDesktop.classList.contains('active')) {
                    // Keep mobile nav open
                }
            }
            
            // Toggle this dropdown
            if (!isActive) {
                dropdown.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                console.log(`🛒 Buy dropdown ${index + 1} opened on ${isMobile ? 'mobile' : 'desktop'}`);
            } else {
                dropdown.classList.remove('active');
                this.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                console.log(`🛒 Buy dropdown ${index + 1} closed`);
            }
        });
        
        console.log(`✅ Buy toggle ${index + 1} event listener attached`);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.buy-dropdown') && !e.target.closest('.dropdown')) {
            buyDropdowns.forEach(d => {
                d.classList.remove('active');
                d.querySelector('.buy-toggle')?.classList.remove('active');
                d.querySelector('.buy-toggle')?.setAttribute('aria-expanded', 'false');
            });
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

// ========== MOBILE NAVIGATION ==========
function setupMobileNavigation() {
    console.log('📱 Setting up mobile navigation...');
    
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navDesktop = document.getElementById('nav-desktop');
    
    if (!mobileToggle || !navDesktop) {
        console.warn('⚠️ Mobile navigation elements not found');
        return;
    }
    
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpening = !navDesktop.classList.contains('active');
        isMobileMenuOpen = isOpening;
        
        // Toggle mobile nav
        navDesktop.classList.toggle('active');
        this.classList.toggle('active');
        
        // Update aria attributes
        if (navDesktop.classList.contains('active')) {
            document.body.classList.add('nav-open');
            this.setAttribute('aria-expanded', 'true');
            navDesktop.setAttribute('aria-hidden', 'false');
        } else {
            document.body.classList.remove('nav-open');
            this.setAttribute('aria-expanded', 'false');
            navDesktop.setAttribute('aria-hidden', 'true');
        }
        
        // Close dropdowns when opening nav
        if (isOpening) {
            closeAllDropdowns();
        }
        
        console.log('📱 Mobile nav toggled:', navDesktop.classList.contains('active') ? 'open' : 'closed');
    });
    
    // Close nav when clicking outside (mobile only)
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768) return;
        
        if (navDesktop.classList.contains('active') && 
            !e.target.closest('#nav-desktop') && 
            !e.target.closest('#mobileNavToggle')) {
            closeMobileNav();
        }
    });
    
    // Close nav when pressing escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    });
    
    console.log('✅ Mobile navigation setup complete');
}

function closeMobileNav() {
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navDesktop = document.getElementById('nav-desktop');
    
    if (navDesktop) {
        navDesktop.classList.remove('active');
        navDesktop.setAttribute('aria-hidden', 'true');
    }
    if (mobileToggle) {
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }
    
    document.body.classList.remove('nav-open');
    isMobileMenuOpen = false;
    closeAllDropdowns();
    
    console.log('📱 Mobile nav closed');
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
    
    // Add click event to each dropdown button
    dropbtns.forEach((dropbtn) => {
        // Clone and replace to remove existing listeners
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
            
            // Close all other dropdowns first
            closeAllDropdowns();
            
            // Close buy dropdowns
            document.querySelectorAll('.buy-dropdown').forEach(d => {
                d.classList.remove('active');
                d.querySelector('.buy-toggle')?.classList.remove('active');
                d.querySelector('.buy-toggle')?.setAttribute('aria-expanded', 'false');
            });
            
            // Toggle this dropdown
            if (!isOpen) {
                dropdown.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                console.log('🟢 Dropdown opened on', isMobile ? 'mobile' : 'desktop');
            } else {
                closeDropdown(dropdown);
                console.log('🔴 Dropdown closed');
            }
        });
        
        console.log(`✅ Dropdown button ${index + 1} event listener attached`);
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            const navDesktop = document.getElementById('nav-desktop');
            if (navDesktop && navDesktop.classList.contains('active')) {
                // If mobile nav is open and click is inside it, allow dropdowns to work
                if (e.target.closest('.dropdown') || e.target.closest('.buy-dropdown')) {
                    return;
                }
            }
        }
        
        if (!e.target.closest('.dropdown') && !e.target.closest('.buy-dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Reset to desktop
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.style.maxHeight = '';
                    content.style.transform = '';
                });
                document.querySelectorAll('.buy-options').forEach(options => {
                    options.style.transform = '';
                });
            }
        }, 250);
    });
    
    console.log('✅ Dropdowns setup complete');
}

function closeAllDropdowns() {
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
        d.querySelector('.buy-toggle')?.classList.remove('active');
        d.querySelector('.buy-toggle')?.setAttribute('aria-expanded', 'false');
    });
    
    console.log('🔽 All dropdowns closed');
}

function closeDropdown(dropdownElement) {
    if (!dropdownElement) return;
    
    const dropbtn = dropdownElement.querySelector('.dropbtn');
    
    dropdownElement.classList.remove('active');
    
    if (dropbtn) {
        dropbtn.classList.remove('active');
        dropbtn.setAttribute('aria-expanded', 'false');
    }
    
    console.log('🔽 Dropdown closed');
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
        
        // Focus management for accessibility
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
    console.log('Current page:', currentPage);
    
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
            
            console.log(`✅ Active element set: ${selector}`);
        } else {
            console.warn(`⚠️ Could not find active element: ${selector}`);
        }
    } else {
        console.log(`ℹ️ No active mapping for: ${currentPage}`);
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
}

// ========== MOBILE BUY BUTTON OPTIMIZATION ==========
function setupMobileBuyButton() {
    console.log('📱 Setting up mobile buy button optimization...');
    
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    
    const buyDropdowns = document.querySelectorAll('.buy-dropdown');
    
    buyDropdowns.forEach((dropdown) => {
        const buyToggle = dropdown.querySelector('.buy-toggle');
        const buyOptions = dropdown.querySelector('.buy-options');
        
        if (!buyToggle || !buyOptions) return;
        
        // Add touch feedback for mobile
        buyToggle.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        buyToggle.addEventListener('touchend', function() {
            this.style.transform = '';
        });
        
        // Handle buy option clicks on mobile
        const buyOptionsLinks = buyOptions.querySelectorAll('.buy-option');
        buyOptionsLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Close the buy options
                dropdown.classList.remove('active');
                buyToggle.classList.remove('active');
                buyToggle.setAttribute('aria-expanded', 'false');
                
                // Close mobile nav if it's open
                const navDesktop = document.getElementById('nav-desktop');
                if (navDesktop && navDesktop.classList.contains('active')) {
                    closeMobileNav();
                }
            });
        });
    });
    
    // Update on resize
    window.addEventListener('resize', function() {
        const isNowMobile = window.innerWidth <= 768;
        if (isNowMobile !== isMobile) {
            setTimeout(setupMobileBuyButton, 100);
        }
    });
    
    console.log('✅ Mobile buy button optimization complete');
}

// ========== LOADER ==========
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        // Add fade out animation
        loader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 500);
        
        console.log('👋 Loader hidden');
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
        
        // 9. Setup mobile buy button optimization
        setupMobileBuyButton();
        
        // 10. Add body class for JavaScript detection
        document.body.classList.add('js-enabled');
        
        console.log('✅ Common functionality initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing common functionality:', error);
    }
}

// ========== DEBUG FUNCTIONS ==========
function debugDropdowns() {
    console.log('=== DROPDOWN DEBUG ===');
    console.log('Window width:', window.innerWidth);
    console.log('Is mobile?', window.innerWidth <= 768);
    console.log('Is mobile menu open?', isMobileMenuOpen);
    console.log('Dropdown buttons:', document.querySelectorAll('.dropbtn').length);
    console.log('Dropdown contents:', document.querySelectorAll('.dropdown-content').length);
    console.log('Buy dropdowns:', document.querySelectorAll('.buy-dropdown').length);
}

// ========== INITIALIZE ON DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded (common.js)');
    
    // Start initialization with a small delay
    setTimeout(initializeCommon, 100);
    
    // Add debug command to window for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugDropdowns = debugDropdowns;
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

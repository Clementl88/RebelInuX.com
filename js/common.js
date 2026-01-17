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
    
    buyToggles.forEach((toggle, index) => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.buy-dropdown');
            if (!dropdown) return;
            
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            closeAllDropdowns();
            closeMobileNav();
            
            // Toggle this dropdown
            if (!isActive) {
                dropdown.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                console.log(`🛒 Buy dropdown ${index + 1} opened`);
            } else {
                dropdown.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.buy-dropdown')) {
            buyDropdowns.forEach(d => {
                d.classList.remove('active');
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
    dropbtns.forEach((dropbtn, index) => {
        // Skip if already has our event listener
        if (dropbtn.dataset.dropdownInitialized === 'true') {
            return;
        }
        
        dropbtn.dataset.dropdownInitialized = 'true';
        
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
                d.querySelector('.buy-toggle')?.setAttribute('aria-expanded', 'false');
            });
            
            // Toggle this dropdown
            if (!isOpen) {
                dropdown.classList.add('active');
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                if (isMobile) {
                    // For mobile, calculate max-height based on content
                    const itemCount = dropdownContent.querySelectorAll('a').length;
                    const itemHeight = 60; // Approximate height per item in mobile
                    const calculatedHeight = Math.min(itemCount * itemHeight, 600);
                    dropdownContent.style.maxHeight = calculatedHeight + 'px';
                } else {
                    // For desktop, show with opacity transition
                    dropdownContent.style.display = 'block';
                    setTimeout(() => {
                        dropdownContent.style.opacity = '1';
                        dropdownContent.style.visibility = 'visible';
                        dropdownContent.style.maxHeight = '800px';
                    }, 10);
                }
                console.log('🟢 Dropdown opened');
            } else {
                closeDropdown(dropdown);
                console.log('🔴 Dropdown closed');
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown') && !e.target.closest('.buy-dropdown')) {
            closeAllDropdowns();
        }
    });
    
    // Handle dropdown item clicks
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function() {
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Close dropdown immediately on mobile
                const dropdown = this.closest('.dropdown');
                if (dropdown) {
                    setTimeout(() => {
                        closeDropdown(dropdown);
                    }, 100);
                }
            } else {
                // Keep desktop behavior
                setTimeout(() => {
                    closeAllDropdowns();
                }, 300);
            }
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close dropdowns when switching to desktop
            if (window.innerWidth > 768) {
                closeAllDropdowns();
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.style.display = 'none';
                    content.style.maxHeight = '';
                    content.style.opacity = '';
                    content.style.visibility = '';
                });
            } else {
                // Reset mobile dropdown styles
                document.querySelectorAll('.dropdown-content').forEach(content => {
                    content.style.maxHeight = '0';
                    content.style.opacity = '0';
                    content.style.visibility = 'hidden';
                });
            }
        }, 250);
    });
    
    console.log('✅ Dropdowns setup complete');
}

function closeAllDropdowns() {
    const isMobile = window.innerWidth <= 768;
    
    // Hide all dropdown contents
    document.querySelectorAll('.dropdown-content').forEach(content => {
        if (isMobile) {
            content.style.maxHeight = '0';
        } else {
            content.style.display = 'none';
        }
        content.style.opacity = '0';
        content.style.visibility = 'hidden';
    });
    
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
        d.querySelector('.buy-toggle')?.setAttribute('aria-expanded', 'false');
    });
    
    console.log('🔽 All dropdowns closed');
}

function closeDropdown(dropdownElement) {
    if (!dropdownElement) return;
    
    const dropdownContent = dropdownElement.querySelector('.dropdown-content');
    const dropbtn = dropdownElement.querySelector('.dropbtn');
    
    if (dropdownContent) {
        dropdownContent.style.maxHeight = '0';
        dropdownContent.style.opacity = '0';
        dropdownContent.style.visibility = 'hidden';
        setTimeout(() => {
            if (dropdownContent.style.opacity === '0') {
                dropdownContent.style.display = 'none';
            }
        }, 300);
    }
    
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
        
        // 9. Add body class for JavaScript detection
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
    
    document.querySelectorAll('.dropbtn').forEach((btn, i) => {
        console.log(`Button ${i}:`, {
            text: btn.textContent.trim(),
            hasListener: btn.dataset.dropdownInitialized === 'true',
            isActive: btn.classList.contains('active'),
            parentActive: btn.closest('.dropdown')?.classList.contains('active')
        });
    });
}

// ========== INITIALIZE ON DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded (common.js)');
    
    // Start initialization with a small delay
    setTimeout(initializeCommon, 100);
    
    // Add debug command to window for development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.debugDropdowns = debugDropdowns;
        window.debugComponents = function() {
            console.log('=== COMPONENTS DEBUG ===');
            console.log('Mobile menu state:', isMobileMenuOpen);
            console.log('Body classes:', document.body.className);
        };
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

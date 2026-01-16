// js/common.js - Main functionality for all pages
// Version: 2.0.0 - Optimized & Cleaned

// ========== CONFIGURATION & CONSTANTS ==========
const CONFIG = {
  DEBUG: window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.search.includes('debug=true'),
  
  CONTRACT_ADDRESS: 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump',
  
  SCROLL_THRESHOLD: 50,
  BACK_TO_TOP_THRESHOLD: 300,
  
  BREAKPOINTS: {
    MOBILE: 768
  },
  
  ANIMATION_TIMING: {
    DROPDOWN_CLOSE_DELAY: 300,
    LOADER_FADE_OUT: 500,
    COPY_MESSAGE_SHOW: 2000,
    DEBOUNCE_RESIZE: 250
  }
};

const SELECTORS = {
  HEADER: 'header',
  BUY_TOGGLE: '.buy-toggle',
  BUY_DROPDOWN: '.buy-dropdown',
  BUY_OPTIONS: '.buy-option',
  MOBILE_TOGGLE: '#mobileNavToggle',
  NAV_DESKTOP: '#nav-desktop',
  DROPDOWN: '.dropdown',
  DROPDOWN_BTN: '.dropbtn',
  DROPDOWN_CONTENT: '.dropdown-content',
  BACK_TO_TOP: '#backToTop',
  LOADER: '#loader',
  COPY_MESSAGE: '#copyMessage',
  COPY_MESSAGE_MOBILE: '#copyMessageMobile'
};

// ========== UTILITY FUNCTIONS ==========
class Logger {
  static log(...args) {
    if (CONFIG.DEBUG) console.log('📝', ...args);
  }
  
  static warn(...args) {
    if (CONFIG.DEBUG) console.warn('⚠️', ...args);
  }
  
  static error(...args) {
    console.error('❌', ...args);
  }
  
  static info(...args) {
    if (CONFIG.DEBUG) console.info('ℹ️', ...args);
  }
}

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

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========== DOM CACHE ==========
const DOMCache = {
  elements: {},
  
  get(selector, forceRefresh = false) {
    if (!this.elements[selector] || forceRefresh) {
      this.elements[selector] = document.querySelector(selector);
    }
    return this.elements[selector];
  },
  
  getAll(selector, forceRefresh = false) {
    if (!this.elements[selector] || forceRefresh) {
      this.elements[selector] = document.querySelectorAll(selector);
    }
    return this.elements[selector];
  },
  
  clear() {
    this.elements = {};
  }
};

// ========== HEADER SCROLL EFFECT ==========
function setupHeaderScrollEffect() {
  const header = DOMCache.get(SELECTORS.HEADER);
  if (!header) {
    Logger.warn('Header element not found');
    return;
  }
  
  let ticking = false;
  
  function updateHeader() {
    if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }
  
  const throttledScroll = throttle(() => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, 16); // ~60fps
  
  window.addEventListener('scroll', throttledScroll, { passive: true });
  
  // Initial check
  updateHeader();
  Logger.log('Header scroll effect initialized');
}

// ========== BUY DROPDOWN TOGGLE ==========
function setupBuyDropdown() {
  Logger.log('Setting up Buy dropdown...');
  
  const buyToggles = DOMCache.getAll(SELECTORS.BUY_TOGGLE);
  const buyDropdowns = DOMCache.getAll(SELECTORS.BUY_DROPDOWN);
  
  if (buyToggles.length === 0 || buyDropdowns.length === 0) {
    Logger.warn('No buy dropdown elements found');
    return;
  }
  
  buyToggles.forEach((toggle, index) => {
    // Remove existing event listeners by cloning
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    newToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest(SELECTORS.BUY_DROPDOWN);
      if (!dropdown) return;
      
      const isActive = dropdown.classList.contains('active');
      
      // Close all other dropdowns
      closeAllDropdowns();
      
      // Toggle this dropdown
      if (!isActive) {
        dropdown.classList.add('active');
        Logger.log(`Buy dropdown ${index + 1} opened`);
      }
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest(SELECTORS.BUY_DROPDOWN) && 
        !e.target.closest(SELECTORS.DROPDOWN)) {
      buyDropdowns.forEach(d => d.classList.remove('active'));
    }
  });
  
  // Close buy dropdown when clicking a buy option
  const buyOptions = DOMCache.getAll(SELECTORS.BUY_OPTIONS);
  buyOptions.forEach(option => {
    option.addEventListener('click', function() {
      setTimeout(() => {
        buyDropdowns.forEach(d => d.classList.remove('active'));
      }, CONFIG.ANIMATION_TIMING.DROPDOWN_CLOSE_DELAY);
    });
  });
  
  Logger.log('Buy dropdown setup complete');
}

// Copy contract address function
function initCopyContract() {
  window.copyContract = function() {
    const copyMessage = DOMCache.get(SELECTORS.COPY_MESSAGE);
    const copyMessageMobile = DOMCache.get(SELECTORS.COPY_MESSAGE_MOBILE);
    
    const showSuccess = (element) => {
      if (element) {
        element.classList.add('show');
        setTimeout(() => {
          element.classList.remove('show');
        }, CONFIG.ANIMATION_TIMING.COPY_MESSAGE_SHOW);
      }
    };
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONFIG.CONTRACT_ADDRESS)
        .then(() => {
          showSuccess(copyMessage);
          showSuccess(copyMessageMobile);
        })
        .catch(err => {
          Logger.error('Failed to copy contract:', err);
          fallbackCopy(CONFIG.CONTRACT_ADDRESS);
        });
    } else {
      // Fallback for older browsers
      fallbackCopy(CONFIG.CONTRACT_ADDRESS);
    }
    
    function fallbackCopy(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        showSuccess(copyMessage);
        showSuccess(copyMessageMobile);
      } catch (err) {
        Logger.error('Fallback copy failed:', err);
        alert('Failed to copy contract address. Please copy manually: ' + text);
      }
      
      document.body.removeChild(textArea);
    }
  };
}

// ========== MOBILE NAVIGATION ==========
function setupMobileNavigation() {
  Logger.log('Setting up mobile navigation...');
  
  const mobileToggle = DOMCache.get(SELECTORS.MOBILE_TOGGLE);
  const navDesktop = DOMCache.get(SELECTORS.NAV_DESKTOP);
  
  if (!mobileToggle || !navDesktop) {
    Logger.warn('Mobile navigation elements not found');
    return;
  }
  
  // Remove any existing event listeners
  const newToggle = mobileToggle.cloneNode(true);
  mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
  
  newToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isOpening = !navDesktop.classList.contains('active');
    navDesktop.classList.toggle('active');
    
    // Update icon
    this.innerHTML = navDesktop.classList.contains('active') ? 
      '<i class="fas fa-times"></i>' : 
      '<i class="fas fa-bars"></i>';
    
    // Toggle body scroll and aria attributes
    if (navDesktop.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
      this.setAttribute('aria-expanded', 'true');
      navDesktop.setAttribute('aria-hidden', 'false');
    } else {
      document.body.style.overflow = '';
      this.setAttribute('aria-expanded', 'false');
      navDesktop.setAttribute('aria-hidden', 'true');
    }
    
    // Close dropdowns when opening nav
    if (isOpening) {
      closeAllDropdowns();
    }
    
    Logger.log('Mobile nav toggled:', navDesktop.classList.contains('active') ? 'open' : 'closed');
  });
  
  // Close nav when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth > CONFIG.BREAKPOINTS.MOBILE) return;
    
    if (navDesktop.classList.contains('active') && 
        !e.target.closest(SELECTORS.NAV_DESKTOP) && 
        !e.target.closest(SELECTORS.MOBILE_TOGGLE)) {
      closeMobileNav();
    }
  });
  
  // Close nav when pressing escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });
  
  Logger.log('Mobile navigation setup complete');
}

function closeMobileNav() {
  const mobileToggle = DOMCache.get(SELECTORS.MOBILE_TOGGLE);
  const navDesktop = DOMCache.get(SELECTORS.NAV_DESKTOP);
  
  if (navDesktop) {
    navDesktop.classList.remove('active');
    navDesktop.setAttribute('aria-hidden', 'true');
  }
  if (mobileToggle) {
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
  closeAllDropdowns();
  
  Logger.log('Mobile nav closed');
}

// ========== DROPDOWNS ==========
function setupDropdowns() {
  Logger.log('Setting up dropdowns...');
  
  const dropbtns = DOMCache.getAll(SELECTORS.DROPDOWN_BTN);
  
  Logger.info(`Found ${dropbtns.length} dropdown buttons`);
  
  if (dropbtns.length === 0) {
    Logger.warn('Dropdown elements not found');
    return;
  }
  
  // Add click event to each dropdown button
  dropbtns.forEach((dropbtn, index) => {
    // Remove existing event listeners
    const newDropbtn = dropbtn.cloneNode(true);
    dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
    
    newDropbtn.addEventListener('click', function(e) {
      Logger.info(`Dropdown ${index + 1} clicked`);
      
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest(SELECTORS.DROPDOWN);
      if (!dropdown) return;
      
      const dropdownContent = dropdown.querySelector(SELECTORS.DROPDOWN_CONTENT);
      if (!dropdownContent) return;
      
      const isMobile = window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE;
      const isOpen = dropdown.classList.contains('active');
      
      // Close all other dropdowns first (including buy dropdowns)
      closeAllDropdowns();
      
      // Toggle this dropdown
      if (!isOpen) {
        dropdown.classList.add('active');
        
        if (isMobile) {
          // For mobile, use max-height animation
          dropdownContent.style.display = 'block';
          setTimeout(() => {
            dropdownContent.style.maxHeight = '600px';
          }, 10);
        } else {
          // For desktop, just show it
          dropdownContent.style.display = 'block';
        }
        Logger.log('Dropdown opened');
      } else {
        dropdown.classList.remove('active');
        dropdownContent.style.display = 'none';
        if (isMobile) {
          dropdownContent.style.maxHeight = '0';
        }
        Logger.log('Dropdown closed');
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest(SELECTORS.DROPDOWN) && 
        !e.target.closest(SELECTORS.BUY_DROPDOWN)) {
      closeAllDropdowns();
    }
  });
  
  // Close dropdown when clicking a link inside
  document.querySelectorAll(`${SELECTORS.DROPDOWN_CONTENT} a`).forEach(link => {
    link.addEventListener('click', function() {
      setTimeout(() => {
        closeAllDropdowns();
        
        if (window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE) {
          closeMobileNav();
        }
      }, CONFIG.ANIMATION_TIMING.DROPDOWN_CLOSE_DELAY);
    });
  });
  
  Logger.log('Dropdowns setup complete');
}

function closeAllDropdowns() {
  // Close all dropdowns
  DOMCache.getAll(SELECTORS.DROPDOWN).forEach(dropdown => {
    dropdown.classList.remove('active');
    const content = dropdown.querySelector(SELECTORS.DROPDOWN_CONTENT);
    if (content) {
      content.style.display = 'none';
      if (window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE) {
        content.style.maxHeight = '0';
      }
    }
  });
  
  // Close buy dropdowns
  DOMCache.getAll(SELECTORS.BUY_DROPDOWN).forEach(dropdown => {
    dropdown.classList.remove('active');
  });
}

// ========== BACK TO TOP ==========
function setupBackToTop() {
  const backToTop = DOMCache.get(SELECTORS.BACK_TO_TOP);
  if (!backToTop) {
    Logger.warn('Back to top button not found');
    return;
  }
  
  let ticking = false;
  
  function updateBackToTop() {
    if (window.pageYOffset > CONFIG.BACK_TO_TOP_THRESHOLD) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
    ticking = false;
  }
  
  const throttledScroll = throttle(() => {
    if (!ticking) {
      window.requestAnimationFrame(updateBackToTop);
      ticking = true;
    }
  }, 16);
  
  window.addEventListener('scroll', throttledScroll, { passive: true });
  
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
  
  Logger.log('Back to top button setup complete');
}

// ========== ACTIVE NAVIGATION ==========
function setActiveNavItem() {
  Logger.log('Setting active navigation item...');
  
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  Logger.info('Current page:', currentPage);
  
  // Remove active from all nav items
  document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
    el.classList.remove('active');
  });
  
  // Define active page mapping
  const pageMap = {
    'index.html': 'a[href="index.html"]',
    'trade.html': 'a.nav-trade',
    'epoch-rewards.html': 'a.nav-rewards',
    'rebl-calculator.html': 'a.nav-rewards',
    'tokenomics.html': 'a.nav-tokenomics',
    'security.html': 'a.nav-security',
    'community.html': 'a.nav-community',
    'governance.html': 'a.nav-governance',
    'roadmap.html': 'a.nav-roadmap',
    'integrity.html': 'a.nav-integrity',
    'artwork.html': 'a.nav-artwork',
    'whitepaper.html': 'a.nav-whitepaper'
  };
  
  const selector = pageMap[currentPage];
  if (selector) {
    const activeElement = document.querySelector(selector);
    if (activeElement) {
      activeElement.classList.add('active');
      
      // If it's in a dropdown, also mark the dropdown button as active
      const dropdown = activeElement.closest(SELECTORS.DROPDOWN_CONTENT);
      if (dropdown) {
        const dropdownBtn = dropdown.previousElementSibling;
        if (dropdownBtn && dropdownBtn.classList.contains('dropbtn')) {
          dropdownBtn.classList.add('active');
        }
      }
      
      Logger.log(`Active element set: ${selector}`);
    } else {
      Logger.warn(`Could not find active element: ${selector}`);
    }
  } else {
    Logger.info(`No active mapping for: ${currentPage}`);
  }
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
function setupPerformance() {
  // Debounce resize events
  const debouncedResize = debounce(() => {
    window.dispatchEvent(new Event('resizeDone'));
    DOMCache.clear(); // Clear cache on resize
  }, CONFIG.ANIMATION_TIMING.DEBOUNCE_RESIZE);
  
  window.addEventListener('resize', debouncedResize);
  
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
          Logger.log('Lazy loaded image:', img.src);
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
  const loader = DOMCache.get(SELECTORS.LOADER);
  if (loader) {
    // Add fade out animation
    loader.style.transition = `opacity ${CONFIG.ANIMATION_TIMING.LOADER_FADE_OUT}ms ease, visibility ${CONFIG.ANIMATION_TIMING.LOADER_FADE_OUT}ms ease`;
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, CONFIG.ANIMATION_TIMING.LOADER_FADE_OUT);
    
    Logger.log('Loader hidden');
  }
}

// ========== INITIALIZE EVERYTHING ==========
function initializeCommon() {
  Logger.log('Initializing common functionality...');
  
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
    
    // 7. Initialize copy contract function
    initCopyContract();
    
    // 8. Setup back to top
    setupBackToTop();
    
    // 9. Set active navigation item
    setActiveNavItem();
    
    // 10. Add body class for JavaScript detection
    document.body.classList.add('js-enabled');
    
    Logger.log('Common functionality initialized successfully');
  } catch (error) {
    Logger.error('Error initializing common functionality:', error);
  }
}

// ========== DEBUG FUNCTIONS ==========
function debugDropdowns() {
  if (!CONFIG.DEBUG) return;
  
  Logger.log('=== DROPDOWN DEBUG ===');
  Logger.log('Window width:', window.innerWidth);
  Logger.log('Is mobile?', window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE);
  Logger.log('Dropdown buttons:', DOMCache.getAll(SELECTORS.DROPDOWN_BTN).length);
  Logger.log('Dropdown contents:', DOMCache.getAll(SELECTORS.DROPDOWN_CONTENT).length);
  Logger.log('Buy dropdowns:', DOMCache.getAll(SELECTORS.BUY_DROPDOWN).length);
  
  DOMCache.getAll(SELECTORS.DROPDOWN_BTN).forEach((btn, i) => {
    Logger.log(`Button ${i}:`, {
      text: btn.textContent.trim(),
      isActive: btn.classList.contains('active'),
      parentActive: btn.closest(SELECTORS.DROPDOWN)?.classList.contains('active')
    });
  });
}

// ========== INITIALIZE ON DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
  Logger.log('DOM Content Loaded (common.js)');
  
  // Start initialization with a small delay
  setTimeout(initializeCommon, 100);
  
  // Add debug command to window for development
  if (CONFIG.DEBUG) {
    window.debugDropdowns = debugDropdowns;
    window.debugComponents = function() {
      Logger.log('=== COMPONENTS DEBUG ===');
      Logger.log('Components loaded:', window.componentsLoaded);
      Logger.log('Components loading:', window.componentsLoading);
    };
    window.CONFIG = CONFIG; // Expose config for debugging
  }
});

// ========== EXPORT FUNCTIONS FOR OTHER FILES ==========
(function() {
  // Create a namespace to avoid polluting global scope
  window.Common = {
    initialize: initializeCommon,
    closeMobileNav: closeMobileNav,
    closeAllDropdowns: closeAllDropdowns,
    setupDropdowns: setupDropdowns,
    setupBackToTop: setupBackToTop,
    setActiveNavItem: setActiveNavItem,
    
    // Utility functions
    debounce: debounce,
    throttle: throttle,
    
    // Debug functions
    debug: CONFIG.DEBUG ? {
      dropdowns: debugDropdowns,
      config: CONFIG,
      cache: DOMCache
    } : null
  };
})();

// ========== CLEANUP ON PAGE UNLOAD ==========
window.addEventListener('beforeunload', function() {
  // Clean up any intervals or observers
  DOMCache.clear();
});

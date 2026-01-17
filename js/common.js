// js/common.js - Main functionality for all pages

// ========== PERFORMANCE & UTILITY FUNCTIONS ==========
const utils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  isMobile: () => window.innerWidth <= 768,

  isTouchDevice: () => {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
  }
};

// ========== ERROR HANDLING ==========
const errorHandler = {
  log: (message, error = null, level = 'info') => {
    const prefix = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅'
    }[level];
    
    console.log(`${prefix} ${message}`);
    if (error) console.error(error);
  },

  componentNotFound: (componentName) => {
    errorHandler.log(`${componentName} elements not found`, null, 'warn');
  }
};

// ========== HEADER SCROLL EFFECT ==========
function setupHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;
  
  const updateHeader = utils.throttle(() => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, 100);
  
  window.addEventListener('scroll', updateHeader);
  updateHeader(); // Initial check
  
  errorHandler.log('Header scroll effect initialized', null, 'success');
}

// ========== ENHANCED BUY DROPDOWN ==========
function setupBuyDropdown() {
  errorHandler.log('Setting up Buy dropdown...');
  
  const buyToggles = document.querySelectorAll('.buy-toggle');
  const buyDropdowns = document.querySelectorAll('.buy-dropdown');
  
  if (buyToggles.length === 0 || buyDropdowns.length === 0) {
    errorHandler.componentNotFound('Buy dropdown');
    return;
  }

  // Enhanced copy contract function with QR code generation
  window.copyContract = async function(source = 'desktop') {
    const contract = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    const copyMessage = document.getElementById('copyMessage');
    const copyMessageMobile = document.getElementById('copyMessageMobile');
    
    const showSuccess = (element) => {
      if (element) {
        element.classList.add('show');
        element.textContent = 'Copied to clipboard!';
        setTimeout(() => element.classList.remove('show'), 2000);
      }
    };

    try {
      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(contract);
        showSuccess(copyMessage);
        showSuccess(copyMessageMobile);
        
        // Analytics event (optional)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'contract_copy', {
            'event_category': 'engagement',
            'event_label': source
          });
        }
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (err) {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = contract;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (success) {
        showSuccess(copyMessage);
        showSuccess(copyMessageMobile);
      } else {
        // Show manual copy option
        const manualCopy = confirm(
          'Copy failed. Please copy manually:\n\n' + 
          contract + '\n\nClick OK to select the text.'
        );
        if (manualCopy) {
          const contractEl = document.querySelector('.contract-value');
          if (contractEl) {
            const range = document.createRange();
            range.selectNodeContents(contractEl);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }
    }
  };

  // Enhanced buy option click handler with analytics
  function setupBuyOptionAnalytics() {
    document.querySelectorAll('.buy-option').forEach(option => {
      option.addEventListener('click', function(e) {
        const platform = this.querySelector('.option-title')?.textContent || 'unknown';
        const category = this.closest('.option-group')?.querySelector('.group-title')?.textContent || 'other';
        
        // Analytics event (optional)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'buy_option_click', {
            'event_category': 'engagement',
            'event_label': `${category}:${platform}`,
            'transport_type': 'beacon'
          });
        }
        
        // Optional: Add loading state for external links
        if (utils.isMobile()) {
          const icon = this.querySelector('.option-icon i');
          if (icon) {
            const originalIcon = icon.className;
            icon.className = 'fas fa-spinner fa-spin';
            
            setTimeout(() => {
              icon.className = originalIcon;
            }, 1000);
          }
        }
        
        // Close dropdown after click with delay for visual feedback
        setTimeout(() => {
          buyDropdowns.forEach(d => d.classList.remove('active'));
        }, 150);
      });
    });
  }

  // Keyboard navigation for buy dropdown
  function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const activeDropdown = document.querySelector('.buy-dropdown.active');
      if (!activeDropdown) return;
      
      const options = activeDropdown.querySelectorAll('.buy-option');
      if (options.length === 0) return;
      
      const currentFocus = document.activeElement;
      const currentIndex = Array.from(options).indexOf(currentFocus);
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          options[nextIndex].focus();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          options[prevIndex].focus();
          break;
          
        case 'Escape':
          buyDropdowns.forEach(d => d.classList.remove('active'));
          document.querySelector('.buy-toggle')?.focus();
          break;
          
        case 'Enter':
        case ' ':
          if (currentFocus.classList.contains('contract-value')) {
            e.preventDefault();
            copyContract('keyboard');
          }
          break;
      }
    });
  }

  // Toggle functionality
  buyToggles.forEach((toggle) => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.buy-dropdown');
      if (!dropdown) return;
      
      const isActive = dropdown.classList.contains('active');
      
      // Close all other dropdowns
      document.querySelectorAll('.buy-dropdown, .dropdown').forEach(el => {
        el.classList.remove('active');
        el.querySelector('.dropbtn')?.setAttribute('aria-expanded', 'false');
      });
      
      // Toggle this dropdown
      if (!isActive) {
        dropdown.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        
        // Focus first buy option for keyboard users
        setTimeout(() => {
          const firstOption = dropdown.querySelector('.buy-option');
          if (firstOption) firstOption.focus();
        }, 10);
      } else {
        this.setAttribute('aria-expanded', 'false');
      }
      
      errorHandler.log(`Buy dropdown ${isActive ? 'closed' : 'opened'}`, null, 'info');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.buy-dropdown') && !e.target.closest('.dropdown')) {
      buyDropdowns.forEach(d => {
        d.classList.remove('active');
        d.querySelector('.buy-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Setup additional features
  setupBuyOptionAnalytics();
  setupKeyboardNavigation();
  
  errorHandler.log('Buy dropdown setup complete', null, 'success');
}

// ========== MOBILE NAVIGATION ==========
function setupMobileNavigation() {
  errorHandler.log('Setting up mobile navigation...');
  
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!mobileToggle || !navDesktop) {
    errorHandler.componentNotFound('Mobile navigation');
    return;
  }

  function toggleMobileNav() {
    const isOpening = !navDesktop.classList.contains('active');
    navDesktop.classList.toggle('active');
    
    // Update icon and ARIA
    mobileToggle.innerHTML = navDesktop.classList.contains('active') ? 
      '<i class="fas fa-times"></i>' : 
      '<i class="fas fa-bars"></i>';
    mobileToggle.setAttribute('aria-expanded', navDesktop.classList.contains('active'));
    
    // Toggle body scroll
    document.body.style.overflow = navDesktop.classList.contains('active') ? 'hidden' : '';
    
    // Close dropdowns when opening nav
    if (isOpening) {
      closeAllDropdowns();
    }
    
    // Focus management for accessibility
    if (navDesktop.classList.contains('active')) {
      setTimeout(() => {
        const firstNavItem = navDesktop.querySelector('a, .dropbtn');
        if (firstNavItem) firstNavItem.focus();
      }, 100);
    }
    
    errorHandler.log(`Mobile nav ${navDesktop.classList.contains('active') ? 'opened' : 'closed'}`, null, 'info');
  }

  function closeMobileNav() {
    navDesktop.classList.remove('active');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    closeAllDropdowns();
    mobileToggle.focus();
  }

  // Event listeners
  mobileToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileNav();
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDesktop.classList.contains('active')) {
      closeMobileNav();
    }
  });

  // Close on outside click (mobile only)
  if (utils.isTouchDevice()) {
    document.addEventListener('touchstart', (e) => {
      if (navDesktop.classList.contains('active') && 
          !e.target.closest('#nav-desktop') && 
          !e.target.closest('#mobileNavToggle')) {
        closeMobileNav();
      }
    });
  } else {
    document.addEventListener('click', (e) => {
      if (utils.isMobile() && 
          navDesktop.classList.contains('active') && 
          !e.target.closest('#nav-desktop') && 
          !e.target.closest('#mobileNavToggle')) {
        closeMobileNav();
      }
    });
  }

  errorHandler.log('Mobile navigation setup complete', null, 'success');
  
  return { closeMobileNav };
}

// ========== DROPDOWNS ==========
function setupDropdowns() {
  errorHandler.log('Setting up dropdowns...');
  
  const dropbtns = document.querySelectorAll('.dropbtn');
  const dropdowns = document.querySelectorAll('.dropdown');
  
  if (dropbtns.length === 0 || dropdowns.length === 0) {
    errorHandler.componentNotFound('Dropdowns');
    return;
  }

  function toggleDropdown(dropdown, isOpening) {
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    const dropbtn = dropdown.querySelector('.dropbtn');
    
    if (!dropdownContent || !dropbtn) return;
    
    if (isOpening) {
      dropdown.classList.add('active');
      dropbtn.classList.add('active');
      dropbtn.setAttribute('aria-expanded', 'true');
      
      if (utils.isMobile()) {
        const itemCount = dropdownContent.querySelectorAll('a').length;
        const itemHeight = 50;
        const calculatedHeight = Math.min(itemCount * itemHeight, 800);
        dropdownContent.style.maxHeight = `${calculatedHeight}px`;
        dropdownContent.style.opacity = '1';
        dropdownContent.style.visibility = 'visible';
      } else {
        dropdownContent.style.display = 'block';
        dropdownContent.style.opacity = '1';
        dropdownContent.style.visibility = 'visible';
      }
    } else {
      closeDropdown(dropdown);
    }
  }

  dropbtns.forEach((dropbtn) => {
    dropbtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.dropdown');
      if (!dropdown) return;
      
      const isActive = dropdown.classList.contains('active');
      
      // Close all other dropdowns
      closeAllDropdowns();
      document.querySelectorAll('.buy-dropdown').forEach(d => d.classList.remove('active'));
      
      // Toggle this dropdown
      toggleDropdown(dropdown, !isActive);
    });
  });

  // Enhanced click outside handling
  document.addEventListener('click', (e) => {
    const isMobile = utils.isMobile();
    
    if (isMobile) {
      const navDesktop = document.getElementById('nav-desktop');
      if (navDesktop && navDesktop.classList.contains('active')) {
        if (e.target.closest('#nav-desktop')) return;
      }
    }
    
    if (!e.target.closest('.dropdown') && !e.target.closest('.buy-dropdown')) {
      closeAllDropdowns();
    }
  });

  // Keyboard navigation for dropdowns
  document.addEventListener('keydown', (e) => {
    const activeDropdown = document.querySelector('.dropdown.active');
    if (!activeDropdown) return;
    
    const dropdownItems = activeDropdown.querySelectorAll('.dropdown-content a');
    if (dropdownItems.length === 0) return;
    
    const currentFocus = document.activeElement;
    const currentIndex = Array.from(dropdownItems).indexOf(currentFocus);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < dropdownItems.length - 1 ? currentIndex + 1 : 0;
        dropdownItems[nextIndex].focus();
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : dropdownItems.length - 1;
        dropdownItems[prevIndex].focus();
        break;
        
      case 'Escape':
        closeAllDropdowns();
        activeDropdown.querySelector('.dropbtn')?.focus();
        break;
    }
  });

  // Handle window resize
  const handleResize = utils.debounce(() => {
    if (!utils.isMobile()) {
      closeAllDropdowns();
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
        content.style.maxHeight = '';
      });
    } else {
      document.querySelectorAll('.dropdown-content').forEach(content => {
        if (!content.closest('.dropdown.active')) {
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          content.style.visibility = 'hidden';
        }
      });
    }
  }, 250);
  
  window.addEventListener('resize', handleResize);

  errorHandler.log('Dropdowns setup complete', null, 'success');
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown, .buy-dropdown').forEach(element => {
    const dropdownContent = element.querySelector('.dropdown-content');
    const button = element.querySelector('.dropbtn, .buy-toggle');
    
    if (dropdownContent) {
      dropdownContent.style.maxHeight = '0';
      dropdownContent.style.opacity = '0';
      dropdownContent.style.visibility = 'hidden';
      dropdownContent.style.display = 'none';
    }
    
    element.classList.remove('active');
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });
}

function closeDropdown(dropdownElement) {
  if (!dropdownElement) return;
  
  const dropdownContent = dropdownElement.querySelector('.dropdown-content');
  const button = dropdownElement.querySelector('.dropbtn');
  
  if (dropdownContent) {
    dropdownContent.style.maxHeight = '0';
    dropdownContent.style.opacity = '0';
    dropdownContent.style.visibility = 'hidden';
  }
  
  dropdownElement.classList.remove('active');
  if (button) {
    button.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
  }
}

// ========== BACK TO TOP ==========
function setupBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  const updateVisibility = utils.throttle(() => {
    backToTop.classList.toggle('visible', window.pageYOffset > 300);
  }, 100);

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Accessibility: Focus management
    setTimeout(() => {
      const firstFocusable = document.querySelector('header a, header button');
      if (firstFocusable) firstFocusable.focus();
    }, 500);
  });

  window.addEventListener('scroll', updateVisibility);
  updateVisibility(); // Initial check

  errorHandler.log('Back to top button setup complete', null, 'success');
}

// ========== ACTIVE NAVIGATION ==========
function setActiveNavItem() {
  errorHandler.log('Setting active navigation item...');
  
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  // Clear all active states
  document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
    el.classList.remove('active');
  });

  // Page mapping
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
    'whitepaper.html': 'a.nav-whitepaper',
    'calculator.html': 'a.nav-calculator' // Added for calculator page
  };

  const selector = pageMap[currentPage];
  if (selector) {
    const activeElement = document.querySelector(selector);
    if (activeElement) {
      activeElement.classList.add('active');
      
      // If in dropdown, activate parent dropdown
      const dropdown = activeElement.closest('.dropdown-content');
      if (dropdown) {
        const dropdownBtn = dropdown.previousElementSibling;
        if (dropdownBtn?.classList.contains('dropbtn')) {
          dropdownBtn.classList.add('active');
        }
      }
      
      errorHandler.log(`Active element set: ${selector}`, null, 'success');
    } else {
      errorHandler.log(`Could not find active element: ${selector}`, null, 'warn');
    }
  } else {
    errorHandler.log(`No active mapping for: ${currentPage}`, null, 'info');
  }
}

// ========== PERFORMANCE OPTIMIZATIONS ==========
function setupPerformance() {
  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
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

  // Font loading optimization
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }

  // Preload critical resources
  const preloadLinks = document.querySelectorAll('link[rel="preload"]');
  preloadLinks.forEach(link => {
    link.onload = () => {
      link.setAttribute('data-loaded', 'true');
    };
  });
}

// ========== LOADER ==========
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  return new Promise(resolve => {
    loader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
      errorHandler.log('Loader hidden', null, 'success');
      resolve();
    }, 500);
  });
}

// ========== INITIALIZE EVERYTHING ==========
async function initializeCommon() {
  errorHandler.log('Initializing common functionality...');
  
  try {
    // Setup performance first
    setupPerformance();
    
    // Hide loader
    await hideLoader();
    
    // Setup components
    setupHeaderScrollEffect();
    setupMobileNavigation();
    setupDropdowns();
    setupBuyDropdown();
    setupBackToTop();
    setActiveNavItem();
    
    // Add JS detection class
    document.body.classList.add('js-enabled');
    
    // Dispatch custom event for other scripts
    document.dispatchEvent(new CustomEvent('common:initialized'));
    
    errorHandler.log('Common functionality initialized successfully', null, 'success');
  } catch (error) {
    errorHandler.log('Error initializing common functionality', error, 'error');
  }
}

// ========== EXPORT FUNCTIONS ==========
window.common = {
  utils,
  errorHandler,
  setupMobileNavigation,
  setupDropdowns,
  setupBuyDropdown,
  setupBackToTop,
  setActiveNavItem,
  closeAllDropdowns,
  initializeCommon
};

// ========== INITIALIZE ON DOM READY ==========
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeCommon, 100);
  });
} else {
  setTimeout(initializeCommon, 100);
}

// ========== DEBUG TOOLS (Development only) ==========
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.debug = {
    dropdowns: () => {
      console.group('Dropdown Debug');
      console.log('Window width:', window.innerWidth);
      console.log('Is mobile?', utils.isMobile());
      console.log('Active dropdowns:', document.querySelectorAll('.dropdown.active, .buy-dropdown.active').length);
      console.table(Array.from(document.querySelectorAll('.dropbtn, .buy-toggle')).map(btn => ({
        text: btn.textContent.trim(),
        isActive: btn.classList.contains('active'),
        ariaExpanded: btn.getAttribute('aria-expanded'),
        parentActive: btn.closest('.dropdown, .buy-dropdown')?.classList.contains('active')
      })));
      console.groupEnd();
    },
    
    performance: () => {
      console.group('Performance');
      console.log('DOM elements:', document.querySelectorAll('*').length);
      console.log('Images loaded:', document.querySelectorAll('img[data-loaded="true"]').length);
      console.log('Fonts ready:', document.fonts?.ready || 'Not available');
      console.groupEnd();
    }
  };
}

// js/common.js - Main functionality for all pages

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
    // Remove existing event listeners by cloning
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    newToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.buy-dropdown');
      if (!dropdown) return;
      
      const isActive = dropdown.classList.contains('active');
      
      // Close all other dropdowns
      closeAllDropdowns();
      document.querySelectorAll('.buy-dropdown').forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('active');
        }
      });
      
      // Toggle this dropdown
      if (!isActive) {
        dropdown.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        console.log('🛒 Buy dropdown opened');
      } else {
        dropdown.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
      }
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.buy-dropdown') && !e.target.closest('.dropdown')) {
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
  
  // Initialize aria attributes
  mobileToggle.setAttribute('aria-expanded', 'false');
  navDesktop.setAttribute('aria-hidden', 'true');
  
  mobileToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    // Update button state
    this.setAttribute('aria-expanded', newState);
    
    // Update navigation
    navDesktop.setAttribute('aria-hidden', !newState);
    
    // Toggle active class based on aria-expanded
    if (newState) {
      navDesktop.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Close other dropdowns
      closeAllDropdowns();
    } else {
      navDesktop.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    console.log('📱 Mobile nav toggled:', newState ? 'open' : 'closed');
  });
  
  // Close when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth > 768) return;
    
    const navActive = navDesktop.classList.contains('active');
    const clickedInsideNav = navDesktop.contains(e.target);
    const clickedToggle = mobileToggle.contains(e.target);
    
    if (navActive && !clickedInsideNav && !clickedToggle) {
      closeMobileNav();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navDesktop.classList.contains('active')) {
      closeMobileNav();
    }
  });
  
  // Close mobile nav when clicking a link
  document.querySelectorAll('#nav-desktop a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        closeMobileNav();
      }
    });
  });
  
  console.log('✅ Mobile navigation setup complete');
}

function closeMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (mobileToggle) {
    mobileToggle.setAttribute('aria-expanded', 'false');
  }
  
  if (navDesktop) {
    navDesktop.setAttribute('aria-hidden', 'true');
    navDesktop.classList.remove('active');
  }
  
  document.body.style.overflow = '';
  closeAllDropdowns();
  
  console.log('📱 Mobile nav closed');
}

// ========== DROPDOWNS ==========
function setupDropdowns() {
  console.log('🔽 Setting up dropdowns...');
  
  const dropbtns = document.querySelectorAll('.dropbtn');
  
  dropbtns.forEach((dropbtn) => {
    // Clone to remove existing listeners
    const newBtn = dropbtn.cloneNode(true);
    dropbtn.parentNode.replaceChild(newBtn, dropbtn);
    
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.dropdown');
      if (!dropdown) return;
      
      const isActive = dropdown.classList.contains('active');
      const isMobile = window.innerWidth <= 768;
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown.active').forEach(d => {
        if (d !== dropdown) {
          closeDropdown(d);
        }
      });
      
      // Close buy dropdowns
      document.querySelectorAll('.buy-dropdown.active').forEach(d => {
        d.classList.remove('active');
        d.querySelector('.buy-toggle')?.setAttribute('aria-expanded', 'false');
      });
      
      if (isActive) {
        closeDropdown(dropdown);
      } else {
        // Open this dropdown
        dropdown.classList.add('active');
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        if (dropdownContent) {
          if (isMobile) {
            dropdownContent.style.display = 'block';
            setTimeout(() => {
              dropdownContent.style.maxHeight = dropdownContent.scrollHeight + 'px';
              dropdownContent.style.opacity = '1';
              dropdownContent.style.visibility = 'visible';
            }, 10);
          } else {
            dropdownContent.style.display = 'block';
            dropdownContent.style.opacity = '1';
            dropdownContent.style.visibility = 'visible';
          }
        }
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && 
        !e.target.closest('.buy-dropdown') &&
        !e.target.closest('#mobileNavToggle')) {
      closeAllDropdowns();
    }
  });
  
  // Close dropdown when clicking a link (mobile only)
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      const dropdown = this.closest('.dropdown');
      if (dropdown && window.innerWidth <= 768) {
        // Close immediately on mobile
        setTimeout(() => {
          closeDropdown(dropdown);
        }, 300);
      }
    });
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        // Reset dropdown styles on desktop
        document.querySelectorAll('.dropdown-content').forEach(content => {
          content.style.maxHeight = '';
          content.style.display = 'none';
        });
      }
    }, 250);
  });
  
  console.log('✅ Dropdowns setup complete');
}

function closeAllDropdowns() {
  const isMobile = window.innerWidth <= 768;
  
  // Close all dropdowns
  document.querySelectorAll('.dropdown.active').forEach(dropdown => {
    closeDropdown(dropdown);
  });
  
  // Reset dropdown contents
  document.querySelectorAll('.dropdown-content').forEach(content => {
    if (isMobile) {
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.visibility = 'hidden';
    } else {
      content.style.display = 'none';
    }
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
  const isMobile = window.innerWidth <= 768;
  
  if (dropdownContent) {
    if (isMobile) {
      dropdownContent.style.maxHeight = '0';
      dropdownContent.style.opacity = '0';
      dropdownContent.style.visibility = 'hidden';
      setTimeout(() => {
        dropdownContent.style.display = 'none';
      }, 300);
    } else {
      dropdownContent.style.display = 'none';
      dropdownContent.style.opacity = '0';
      dropdownContent.style.visibility = 'hidden';
    }
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
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ========== INITIALIZE EVERYTHING ==========
function initializeCommon() {
  console.log('🚀 Initializing common functionality...');
  
  try {
    // 1. Setup performance optimizations
    setupPerformance();
    
    // 2. Setup header scroll effect
    setupHeaderScrollEffect();
    
    // 3. Setup mobile navigation
    setupMobileNavigation();
    
    // 4. Setup dropdowns
    setupDropdowns();
    
    // 5. Setup buy dropdown
    setupBuyDropdown();
    
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

// ========== DEBUG FUNCTIONS ==========
function debugDropdowns() {
  console.log('=== DROPDOWN DEBUG ===');
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile?', window.innerWidth <= 768);
  console.log('Dropdown buttons:', document.querySelectorAll('.dropbtn').length);
  console.log('Dropdown contents:', document.querySelectorAll('.dropdown-content').length);
  console.log('Buy dropdowns:', document.querySelectorAll('.buy-dropdown').length);
}

// ========== INITIALIZE ON DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM Content Loaded (common.js)');
  
  // Start initialization
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

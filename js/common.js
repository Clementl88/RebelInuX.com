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
  
  buyToggles.forEach((toggle, index) => {
    // Remove existing event listeners
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    newToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.buy-dropdown');
      if (!dropdown) return;
      
      const isActive = dropdown.classList.contains('active');
      
      // Close all other buy dropdowns
      buyDropdowns.forEach(d => d.classList.remove('active'));
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown').forEach(d => {
        d.classList.remove('active');
      });
      
      // Toggle this dropdown
      if (!isActive) {
        dropdown.classList.add('active');
        console.log(`🛒 Buy dropdown ${index + 1} opened`);
      }
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.buy-dropdown') && !e.target.closest('.dropdown')) {
      buyDropdowns.forEach(d => d.classList.remove('active'));
    }
  });
  
  // Close buy dropdown when clicking a buy option
  document.querySelectorAll('.buy-option').forEach(option => {
    option.addEventListener('click', function() {
      setTimeout(() => {
        buyDropdowns.forEach(d => d.classList.remove('active'));
      }, 300);
    });
  });
  
  // Copy contract address function
  window.copyContract = function() {
    const contract = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    const copyMessage = document.getElementById('copyMessage');
    const copyMessageMobile = document.getElementById('copyMessageMobile');
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(contract)
        .then(() => {
          showCopySuccess(copyMessage);
          showCopySuccess(copyMessageMobile);
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
      const copyMessageMobile = document.getElementById('copyMessageMobile');
      showCopySuccess(copyMessage);
      showCopySuccess(copyMessageMobile);
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
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileToggle.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
  closeAllDropdowns();
  
  console.log('📱 Mobile nav closed');
}

// ========== DROPDOWNS ==========
// ========== DROPDOWNS ==========
function setupDropdowns() {
  console.log('🔽 Setting up dropdowns...');
  
  const dropbtns = document.querySelectorAll('.dropbtn');
  
  console.log(`Found ${dropbtns.length} dropdown buttons`);
  
  if (dropbtns.length === 0) {
    console.warn('⚠️ Dropdown elements not found');
    return;
  }
  
  // Add click event to each dropdown button
  dropbtns.forEach((dropbtn, index) => {
    // Remove existing event listeners
    const newDropbtn = dropbtn.cloneNode(true);
    dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
    
    newDropbtn.addEventListener('click', function(e) {
      console.log(`🎯 Dropdown ${index + 1} clicked`);
      
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.dropdown');
      if (!dropdown) return;
      
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      if (!dropdownContent) return;
      
      const isMobile = window.innerWidth <= 768;
      const isOpen = dropdown.classList.contains('active');
      
      // Close all other dropdowns first (including buy dropdowns)
      document.querySelectorAll('.dropdown, .buy-dropdown').forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('active');
          const content = d.querySelector('.dropdown-content, .buy-options');
          if (content) {
            content.style.display = 'none';
            if (isMobile) {
              content.style.maxHeight = '0';
            }
          }
        }
      });
      
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
        console.log('🟢 Dropdown opened');
      } else {
        dropdown.classList.remove('active');
        dropdownContent.style.display = 'none';
        if (isMobile) {
          dropdownContent.style.maxHeight = '0';
        }
        console.log('🔴 Dropdown closed');
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown') && !e.target.closest('.buy-dropdown')) {
      document.querySelectorAll('.dropdown, .buy-dropdown').forEach(d => {
        d.classList.remove('active');
        const content = d.querySelector('.dropdown-content, .buy-options');
        if (content) {
          content.style.display = 'none';
          if (window.innerWidth <= 768) {
            content.style.maxHeight = '0';
          }
        }
      });
    }
  });
  
  // Close dropdown when clicking a link inside
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      setTimeout(() => {
        document.querySelectorAll('.dropdown').forEach(d => {
          d.classList.remove('active');
          const content = d.querySelector('.dropdown-content');
          if (content) {
            content.style.display = 'none';
            if (window.innerWidth <= 768) {
              content.style.maxHeight = '0';
            }
          }
        });
        
        if (window.innerWidth <= 768) {
          closeMobileNav();
        }
      }, 300);
    });
  });
  
  console.log('✅ Dropdowns setup complete');
}
function closeAllDropdowns() {
  document.querySelectorAll('.dropdown, .buy-dropdown').forEach(d => {
    d.classList.remove('active');
    const content = d.querySelector('.dropdown-content, .buy-options');
    if (content) {
      content.style.display = 'none';
      if (window.innerWidth <= 768) {
        content.style.maxHeight = '0';
      }
    }
  });
}
function closeAllDropdowns() {
  // Hide all dropdown contents
  document.querySelectorAll('.dropdown-content').forEach(content => {
    content.style.display = 'none';
    content.style.maxHeight = '0';
    content.classList.remove('active');
  });
  
  // Remove active class from dropdown containers
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.classList.remove('active');
  });
  
  // Remove active class from buttons
  document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Close buy dropdowns
  document.querySelectorAll('.buy-dropdown').forEach(d => {
    d.classList.remove('active');
  });
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

// ========== DEBUG FUNCTIONS ==========
function debugDropdowns() {
  console.log('=== DROPDOWN DEBUG ===');
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile?', window.innerWidth <= 768);
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
      console.log('Components loaded:', window.componentsLoaded);
      console.log('Components loading:', window.componentsLoading);
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

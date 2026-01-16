// js/common.js - Main functionality for all pages

// ========== HEADER SCROLL EFFECT ==========
function setupHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  console.log('📜 Header scroll effect initialized');
}

// ========== BUY DROPDOWN TOGGLE ==========
function setupBuyDropdown() {
  console.log('🛒 Setting up Buy dropdown...');
  
  const buyToggles = document.querySelectorAll('.buy-toggle');
  
  buyToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.buy-dropdown');
      const isActive = dropdown.classList.contains('active');
      
      // Close all other buy dropdowns
      document.querySelectorAll('.buy-dropdown').forEach(d => {
        d.classList.remove('active');
      });
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown').forEach(d => {
        const content = d.querySelector('.dropdown-content');
        if (content) content.style.display = 'none';
      });
      
      // Toggle this dropdown
      if (!isActive) {
        dropdown.classList.add('active');
        console.log('🛒 Buy dropdown opened');
      }
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.buy-dropdown') && !e.target.closest('.dropdown')) {
      document.querySelectorAll('.buy-dropdown').forEach(d => {
        d.classList.remove('active');
      });
    }
  });
  
  // Close buy dropdown when clicking a buy option
  document.querySelectorAll('.buy-option').forEach(option => {
    option.addEventListener('click', function() {
      setTimeout(() => {
        document.querySelectorAll('.buy-dropdown').forEach(d => {
          d.classList.remove('active');
        });
      }, 300);
    });
  });
  
  // Copy contract address function
  window.copyContract = function() {
    const contract = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    navigator.clipboard.writeText(contract).then(() => {
      // Show message on desktop
      const message = document.getElementById('copyMessage');
      if (message) {
        message.classList.add('show');
        setTimeout(() => {
          message.classList.remove('show');
        }, 2000);
      }
      
      // Show message on mobile
      const mobileMessage = document.getElementById('copyMessageMobile');
      if (mobileMessage) {
        mobileMessage.classList.add('show');
        setTimeout(() => {
          mobileMessage.classList.remove('show');
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy contract:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = contract;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    });
  };
  
  console.log('✅ Buy dropdown setup complete');
}

// Global initialization function
function initializeCommon() {
  console.log('🚀 Initializing common functionality...');
  
  // 1. Hide loader
  hideLoader();
  
  // 2. Initialize components (will be called after components load)
  if (typeof initializeComponents === 'function') {
    // Wait a bit for components to load
    setTimeout(() => {
      if (!window.componentsLoaded) {
        console.log('⏳ Components not loaded yet, waiting...');
        // Try again in 500ms
        setTimeout(initializeCommon, 500);
        return;
      }
    }, 100);
  }
  
  // 3. Setup back to top (can run immediately)
  setupBackToTop();
  
  // 4. Setup header scroll effect
  setupHeaderScrollEffect();
  
  // 5. Setup buy dropdown
  setupBuyDropdown();
  
  console.log('✅ Common functionality initialized');
}

// ========== LOADER ==========
function hideLoader() {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      console.log('👋 Loader hidden');
    }
  }, 500);
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
    this.innerHTML = navDesktop.classList.contains('active') ? '×' : '☰';
    
    // Toggle body scroll
    document.body.style.overflow = navDesktop.classList.contains('active') ? 'hidden' : '';
    
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
  
  console.log('✅ Mobile navigation setup complete');
}

function closeMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (navDesktop) navDesktop.classList.remove('active');
  if (mobileToggle) mobileToggle.innerHTML = '☰';
  document.body.style.overflow = '';
  closeAllDropdowns();
  
  console.log('📱 Mobile nav closed');
}

// ========== DROPDOWNS ==========
function setupDropdowns() {
  console.log('🔽 Setting up dropdowns...');
  
  const dropbtns = document.querySelectorAll('.dropbtn');
  console.log(`Found ${dropbtns.length} dropdown buttons`);
  
  if (dropbtns.length === 0) {
    console.warn('⚠️ No dropdown buttons found');
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
      const isOpen = dropdownContent.style.display === 'block' || 
                     dropdownContent.classList.contains('active');
      
      // Close all other dropdowns first
      closeAllDropdowns();
      
      // Close buy dropdowns
      document.querySelectorAll('.buy-dropdown').forEach(d => {
        d.classList.remove('active');
      });
      
      // Toggle this dropdown
      if (!isOpen) {
        if (isMobile) {
          // For mobile, use class for CSS animation
          dropdownContent.classList.add('active');
          dropdown.classList.add('active');
        } else {
          // For desktop, use display
          dropdownContent.style.display = 'block';
        }
        this.classList.add('active');
        console.log('🟢 Dropdown opened');
      } else {
        console.log('🔴 Dropdown closed');
        // Already closed by closeAllDropdowns()
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      closeAllDropdowns();
    }
  });
  
  // Close dropdown when clicking a link inside (mobile)
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          closeAllDropdowns();
          closeMobileNav();
        }, 300);
      }
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    // Close dropdowns when switching to desktop
    if (window.innerWidth > 768) {
      closeAllDropdowns();
    }
  });
  
  console.log('✅ Dropdowns setup complete');
}

function closeAllDropdowns() {
  // Hide all dropdown contents
  document.querySelectorAll('.dropdown-content').forEach(content => {
    content.style.display = 'none';
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
}

// ========== BACK TO TOP ==========
function setupBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  
  window.addEventListener('scroll', function() {
    backToTop.classList.toggle('visible', window.pageYOffset > 300);
  });
  
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  console.log('⬆️ Back to top button setup complete');
}

// ========== ACTIVE NAVIGATION ==========
function setActiveNavItem() {
  console.log('📍 Setting active navigation item...');
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  console.log('Current page:', currentPage);
  
  // Remove active from all
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
    'security.html': '.dropbtn.nav-more',
    'community.html': '.dropbtn.nav-more',
    'governance.html': '.dropbtn.nav-more',
    'roadmap.html': '.dropbtn.nav-more',
    'integrity.html': '.dropbtn.nav-more',
    'artwork.html': '.dropbtn.nav-more',
    'whitepaper.html': '.dropbtn.nav-more'
  };
  
  const selector = pageMap[currentPage];
  if (selector) {
    const activeElement = document.querySelector(selector);
    if (activeElement) {
      activeElement.classList.add('active');
      console.log(`✅ Active element set: ${selector}`);
    } else {
      console.warn(`⚠️ Could not find active element: ${selector}`);
    }
  } else {
    console.log(`ℹ️ No active mapping for: ${currentPage}`);
  }
}

// ========== DEBUG

// ========== DEBUG FUNCTIONS ==========
function debugDropdowns() {
  console.log('=== DROPDOWN DEBUG ===');
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile?', window.innerWidth <= 768);
  console.log('Dropdown buttons:', document.querySelectorAll('.dropbtn').length);
  console.log('Dropdown contents:', document.querySelectorAll('.dropdown-content').length);
  
  document.querySelectorAll('.dropbtn').forEach((btn, i) => {
    console.log(`Button ${i}:`, {
      text: btn.textContent.trim(),
      hasListener: btn.dataset.dropdownInitialized === 'true',
      isActive: btn.classList.contains('active')
    });
  });
  
  // Force re-initialize if needed
  console.log('🔄 Re-initializing dropdowns...');
  setupDropdowns();
}

// ========== INITIALIZE ON DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM Content Loaded (common.js)');
  
  // Start initialization
  setTimeout(initializeCommon, 100);
  
  // Add debug command to window
  window.debugDropdowns = debugDropdowns;
});

// Export functions for includes.js
window.setupMobileNavigation = setupMobileNavigation;
window.setupDropdowns = setupDropdowns;
window.setupBackToTop = setupBackToTop;
window.setActiveNavItem = setActiveNavItem;
window.closeAllDropdowns = closeAllDropdowns;
window.closeMobileNav = closeMobileNav;

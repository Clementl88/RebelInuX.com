// js/common.js - Common functionality for all pages

// Initialize common components
function initializeCommon() {
  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 500);
  
  // Initialize mobile navigation FIRST
  setupMobileNav();
  
  // Setup mobile dropdown
  setupMobileDropdown();
  
  // Other initializations
  initBackToTop();
  setActiveNavItem();
  initScrollAnimations();
  
  console.log('Common components initialized');
}

// ========== SIMPLE MOBILE NAVIGATION ==========
function setupMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  const mobileBuyContainer = document.getElementById('mobileBuyContainer');
  
  if (!mobileToggle || !navDesktop) return;
  
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    const isOpening = !navDesktop.classList.contains('active');
    navDesktop.classList.toggle('active');
    
    // Toggle mobile buy button visibility
    if (navDesktop.classList.contains('active')) {
      if (mobileBuyContainer) {
        mobileBuyContainer.style.display = 'block';
      }
      this.innerHTML = '×'; // Close icon
      document.body.style.overflow = 'hidden';
    } else {
      if (mobileBuyContainer) {
        mobileBuyContainer.style.display = 'none';
      }
      this.innerHTML = '☰'; // Hamburger icon
      document.body.style.overflow = '';
    }
    
    // Close any open dropdowns when toggling mobile nav
    closeAllDropdowns();
  });
  
  // Close menu when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth > 768) return; // Desktop: don't handle
    
    if (!navDesktop.contains(e.target) && 
        !mobileToggle.contains(e.target) &&
        !mobileBuyContainer?.contains(e.target)) {
      navDesktop.classList.remove('active');
      mobileToggle.innerHTML = '☰';
      document.body.style.overflow = '';
      if (mobileBuyContainer) {
        mobileBuyContainer.style.display = 'none';
      }
      closeAllDropdowns();
    }
  });
  
  // Close menu on window resize to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      navDesktop.classList.remove('active');
      mobileToggle.innerHTML = '☰';
      document.body.style.overflow = '';
      if (mobileBuyContainer) {
        mobileBuyContainer.style.display = 'none';
      }
      closeAllDropdowns();
    }
  });
}

// ========== SIMPLE MOBILE DROPDOWN ==========
function setupMobileDropdown() {
  console.log('📱 Setting up mobile dropdown...');
  
  const dropbtns = document.querySelectorAll('.dropbtn');
  console.log(`Found ${dropbtns.length} dropdown buttons`);
  
  // Only setup on mobile
  if (window.innerWidth > 768) {
    console.log('Desktop mode - skipping mobile dropdown setup');
    return;
  }
  
  // Helper function to close all dropdowns
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content').forEach(content => {
      content.style.display = 'none';
    });
    document.querySelectorAll('.dropbtn').forEach(btn => {
      btn.classList.remove('active');
    });
  }
  
  // Add click handler to each dropdown button
  dropbtns.forEach(dropbtn => {
    dropbtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.dropdown');
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      const isOpen = dropdownContent.style.display === 'block';
      
      // Close all dropdowns first
      closeAllDropdowns();
      
      // Toggle this dropdown
      if (!isOpen) {
        dropdownContent.style.display = 'block';
        this.classList.add('active');
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth > 768) return;
    
    if (!e.target.closest('.dropdown')) {
      closeAllDropdowns();
    }
  });
  
  // Close dropdown when clicking a link inside
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        closeAllDropdowns();
      }
    });
  });
  
  console.log('✅ Mobile dropdown setup complete');
}

// ========== BACK TO TOP ==========
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  
  window.addEventListener('scroll', function() {
    backToTop.classList.toggle('visible', window.pageYOffset > 300);
  });
  
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== ACTIVE NAVIGATION ==========
function setActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
    el.classList.remove('active');
  });
  
  const activeSelectors = {
    'index.html': 'a[href="index.html"]',
    'epoch-rewards.html': 'a.nav-rewards',
    'rebl-calculator.html': 'a.nav-rewards',
    'trade.html': 'a.nav-trade',
    'tokenomics.html': 'a.nav-tokenomics',
    'security.html': '.dropbtn.nav-more',
    'community.html': '.dropbtn.nav-more',
    'governance.html': '.dropbtn.nav-more',
    'roadmap.html': '.dropbtn.nav-more',
    'integrity.html': '.dropbtn.nav-more',
    'artwork.html': '.dropbtn.nav-more',
    'whitepaper.html': '.dropbtn.nav-more'
  };
  
  const selector = activeSelectors[currentPage];
  if (selector) {
    document.querySelector(selector)?.classList.add('active');
  }
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  const cards = document.querySelectorAll('.social-card, .voting-card, .event-content, .chat-message, .stat-card');
  
  if (!cards.length) return;
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  function animateCards() {
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }
  
  window.addEventListener('scroll', animateCards);
  animateCards();
}

// ========== DEBUG & TEST ==========
function testMobileDropdown() {
  console.log('=== MOBILE DROPDOWN TEST ===');
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile?', window.innerWidth <= 768);
  console.log('Dropdown buttons found:', document.querySelectorAll('.dropbtn').length);
  console.log('Dropdown contents found:', document.querySelectorAll('.dropdown-content').length);
}

// ========== INITIALIZE ==========
// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM Content Loaded - Initializing...');
  
  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 500);
  
  // Setup mobile navigation FIRST
  setupMobileNav();
  
  // Test dropdown functionality
  testDropdownFunctionality();
  
  // Setup mobile dropdown
  setupMobileDropdown();
  
  // Other initializations
  initBackToTop();
  setActiveNavItem();
  initScrollAnimations();
  
  console.log('✅ Common components initialized');
});

// js/common.js - Simple, working version

// ========== MOBILE NAVIGATION ==========
function setupMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  console.log('Setting up mobile nav...', { mobileToggle, navDesktop });
  
  if (!mobileToggle || !navDesktop) {
    console.error('Mobile nav elements not found!');
    return;
  }
  
  // Toggle mobile menu
  mobileToggle.addEventListener('click', function(e) {
    console.log('Mobile toggle clicked');
    e.stopPropagation();
    
    navDesktop.classList.toggle('active');
    
    if (navDesktop.classList.contains('active')) {
      this.innerHTML = '×'; // Close icon
      document.body.style.overflow = 'hidden';
    } else {
      this.innerHTML = '☰'; // Hamburger icon
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth > 768) return;
    
    if (!navDesktop.contains(e.target) && !mobileToggle.contains(e.target)) {
      navDesktop.classList.remove('active');
      mobileToggle.innerHTML = '☰';
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on window resize to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      navDesktop.classList.remove('active');
      mobileToggle.innerHTML = '☰';
      document.body.style.overflow = '';
    }
  });
  
  console.log('Mobile nav setup complete');
}

// ========== DROPDOWN FUNCTIONALITY ==========
function setupDropdowns() {
  console.log('Setting up dropdowns...');
  
  const dropdownBtn = document.getElementById('moreDropdownBtn');
  const dropdownContent = document.getElementById('moreDropdownContent');
  
  if (!dropdownBtn || !dropdownContent) {
    console.log('Dropdown elements not found');
    return;
  }
  
  console.log('Dropdown elements found');
  
  // Desktop: Hover behavior
  if (window.innerWidth > 768) {
    const dropdown = dropdownBtn.closest('.dropdown');
    
    dropdownBtn.addEventListener('mouseenter', function() {
      console.log('Hover on desktop');
      dropdownContent.style.display = 'block';
      dropdownBtn.classList.add('active');
    });
    
    dropdown.addEventListener('mouseleave', function() {
      setTimeout(() => {
        if (!dropdown.matches(':hover') && !dropdownBtn.matches(':hover')) {
          dropdownContent.style.display = 'none';
          dropdownBtn.classList.remove('active');
        }
      }, 100);
    });
  }
  
  // Mobile: Click behavior
  if (window.innerWidth <= 768) {
    console.log('Setting up mobile dropdown');
    
    dropdownBtn.addEventListener('click', function(e) {
      console.log('Dropdown clicked on mobile');
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = dropdownContent.style.display === 'block';
      
      if (isOpen) {
        dropdownContent.style.display = 'none';
        dropdownBtn.classList.remove('active');
      } else {
        dropdownContent.style.display = 'block';
        dropdownBtn.classList.add('active');
      }
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth > 768) return;
      
      if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
        dropdownContent.style.display = 'none';
        dropdownBtn.classList.remove('active');
      }
    });
  }
  
  // Handle resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      dropdownContent.style.display = 'none';
      dropdownBtn.classList.remove('active');
    }
  });
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

// ========== INITIALIZE EVERYTHING ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM Content Loaded - Initializing...');
  
  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 500);
  
  // Setup mobile navigation FIRST
  setupMobileNav();
  
  // Setup dropdowns
  setupDropdowns();
  
  // Other initializations
  initBackToTop();
  setActiveNavItem();
  initScrollAnimations();
  
  console.log('✅ All components initialized');
});

// ========== DEBUG FUNCTION ==========
function debugMenu() {
  console.log('=== MENU DEBUG ===');
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile?', window.innerWidth <= 768);
  
  const toggle = document.getElementById('mobileNavToggle');
  const nav = document.getElementById('nav-desktop');
  
  console.log('Toggle found:', !!toggle);
  console.log('Nav found:', !!nav);
  console.log('Toggle HTML:', toggle?.outerHTML);
  
  if (toggle) {
    console.log('Toggle clickable test:');
    toggle.addEventListener('click', function() {
      console.log('✅ Toggle button works!');
    }, { once: true });
  }
}

// Run debug
setTimeout(debugMenu, 1000);

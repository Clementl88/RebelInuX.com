// js/common.js - Common functionality for all pages

// Initialize common components
function initializeCommon() {
  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 500);
  
  // Initialize mobile navigation
  setupMobileNav();
  
  // Setup mobile dropdown - SIMPLE VERSION
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
  
  if (!mobileToggle || !navDesktop) return;
  
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    navDesktop.classList.toggle('active');
    
    // Toggle between ☰ and × symbols (for text icon)
    if (navDesktop.classList.contains('active')) {
      this.innerHTML = '×'; // Close icon
      document.body.style.overflow = 'hidden';
    } else {
      this.innerHTML = '☰'; // Hamburger icon
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navDesktop.contains(e.target) && !mobileToggle.contains(e.target)) {
      navDesktop.classList.remove('active');
      mobileToggle.innerHTML = '☰';
      document.body.style.overflow = '';
    }
  });
}

// ========== GUARANTEED MOBILE DROPDOWN ==========
function setupMobileDropdown() {
  console.log('Setting up mobile dropdown...');
  
  // Use event delegation for reliability
  document.addEventListener('click', function(e) {
    // Check if we're on mobile
    if (window.innerWidth > 768) return;
    
    // Check if clicked on dropdown button
    if (e.target.closest('.dropbtn')) {
      const dropbtn = e.target.closest('.dropbtn');
      const dropdown = dropbtn.closest('.dropdown');
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      
      // Prevent default only for mobile
      e.preventDefault();
      e.stopPropagation();
      
      // Check if this dropdown is already open
      const isOpen = dropdownContent.style.display === 'block';
      
      // Close ALL other dropdowns first
      document.querySelectorAll('.dropdown-content').forEach(content => {
        if (content !== dropdownContent) {
          content.style.display = 'none';
        }
      });
      
      // Remove active from ALL other buttons
      document.querySelectorAll('.dropbtn').forEach(btn => {
        if (btn !== dropbtn) {
          btn.classList.remove('active');
        }
      });
      
      // Toggle current dropdown
      if (!isOpen) {
        dropdownContent.style.display = 'block';
        dropbtn.classList.add('active');
      } else {
        dropdownContent.style.display = 'none';
        dropbtn.classList.remove('active');
      }
    }
    
    // Close dropdown if clicking outside
    if (!e.target.closest('.dropdown') && !e.target.closest('.dropbtn')) {
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
      });
      document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.classList.remove('active');
      });
    }
    
    // Close dropdown if clicking a link inside
    if (e.target.closest('.dropdown-content a')) {
      setTimeout(() => {
        const dropdownContent = e.target.closest('.dropdown-content');
        if (dropdownContent) {
          dropdownContent.style.display = 'none';
        }
        const dropbtn = e.target.closest('.dropdown')?.querySelector('.dropbtn');
        if (dropbtn) {
          dropbtn.classList.remove('active');
        }
      }, 100);
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Reset for desktop
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = '';
      });
      document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.classList.remove('active');
      });
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

// ========== DEBUG & TEST ==========
function testMobileDropdown() {
  console.log('=== MOBILE DROPDOWN TEST ===');
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile?', window.innerWidth <= 768);
  console.log('Dropdown buttons found:', document.querySelectorAll('.dropbtn').length);
  console.log('Dropdown contents found:', document.querySelectorAll('.dropdown-content').length);
  
  // Add test click handlers
  document.querySelectorAll('.dropbtn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      console.log(`Dropdown button ${i} clicked!`);
    });
  });
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
  initializeCommon();
  testMobileDropdown();
  
  // Force mobile dropdown to work
  setTimeout(() => {
    console.log('Forcing mobile dropdown initialization...');
    setupMobileDropdown();
  }, 1000);
});

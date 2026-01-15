// js/common.js - Common functionality for all pages

// Initialize common components
function initializeCommon() {
  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 500);
  }
  
  // Initialize all components
  initializeMobileNav();
  initializeMobileDropdown();
  initBackToTop();
  setActiveNavItem();
  initScrollAnimations();
  initializeMobileTouch();
  
  console.log('Common components initialized');
}

// ========== MOBILE NAVIGATION ==========
function initializeMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!mobileToggle || !navDesktop) return;
  
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    const isActive = navDesktop.classList.contains('active');
    
    if (isActive) {
      // Close menu
      navDesktop.classList.remove('active');
      this.querySelector('i').className = 'fas fa-bars';
      document.body.style.overflow = '';
    } else {
      // Open menu
      navDesktop.classList.add('active');
      this.querySelector('i').className = 'fas fa-times';
      document.body.style.overflow = 'hidden';
    }
  });
  
  // Close menu when clicking regular links
  document.querySelectorAll('#nav-desktop a:not(.dropbtn):not(.mobile-buy-button)').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navDesktop.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fas fa-bars';
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && 
        navDesktop.classList.contains('active') &&
        !navDesktop.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      navDesktop.classList.remove('active');
      mobileToggle.querySelector('i').className = 'fas fa-bars';
      document.body.style.overflow = '';
    }
  });
}

// ========== GUARANTEED MOBILE DROPDOWN ==========
function initializeMobileDropdown() {
  const dropbtns = document.querySelectorAll('.dropbtn');
  
  if (!dropbtns.length) return;
  
  // Simple direct onclick handler
  dropbtns.forEach(dropbtn => {
    // Use onclick for guaranteed execution
    dropbtn.onclick = function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdownContent = this.nextElementSibling;
        const isOpen = dropdownContent.style.display === 'block';
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(content => {
          if (content !== dropdownContent) {
            content.style.display = 'none';
          }
        });
        
        // Remove active from other buttons
        document.querySelectorAll('.dropbtn').forEach(btn => {
          if (btn !== this) {
            btn.classList.remove('active');
          }
        });
        
        // Toggle current
        if (!isOpen) {
          dropdownContent.style.display = 'block';
          this.classList.add('active');
        } else {
          dropdownContent.style.display = 'none';
          this.classList.remove('active');
        }
        
        return false;
      }
    };
  });
  
  // Close dropdowns when clicking links inside
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        const dropdownContent = this.closest('.dropdown-content');
        const dropbtn = this.closest('.dropdown')?.querySelector('.dropbtn');
        
        if (dropdownContent) dropdownContent.style.display = 'none';
        if (dropbtn) dropbtn.classList.remove('active');
      }
    });
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

// ========== ACTIVE NAVIGATION HIGHLIGHT ==========
function setActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Remove all active classes
  document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
    el.classList.remove('active');
  });
  
  // Set active based on page
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
    const element = document.querySelector(selector);
    if (element) element.classList.add('active');
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

// ========== MOBILE TOUCH ==========
function initializeMobileTouch() {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
  }, false);
}

// ========== INITIALIZE EVERYTHING ==========
document.addEventListener('DOMContentLoaded', initializeCommon);

// Debug info
console.log('Common.js loaded successfully');
console.log('Window width:', window.innerWidth);
console.log('Mobile mode:', window.innerWidth <= 768);

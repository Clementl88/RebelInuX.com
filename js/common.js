// js/common.js - Common functionality for all pages

// Initialize common components
function initializeCommon() {
  // Hide loader
  setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 500);
  
  // Initialize all components
  initializeMobileNav();
  initBackToTop();
  setActiveNavItem();
  initScrollAnimations();
  initializeMobileTouch();
  
  // Force mobile dropdown initialization
  setTimeout(initializeMobileDropdown, 100);
  
  console.log('Common components initialized');
}

// ========== MOBILE NAVIGATION ==========
function initializeMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!mobileToggle || !navDesktop) return;
  
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    navDesktop.classList.toggle('active');
    
    const icon = this.querySelector('i');
    if (navDesktop.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
      document.body.style.overflow = 'hidden';
      
      // Show mobile buy button when menu opens
      const mobileBuyBtn = document.querySelector('.mobile-buy-container');
      if (mobileBuyBtn) {
        mobileBuyBtn.style.display = 'block';
      }
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      document.body.style.overflow = '';
      
      // Hide mobile buy button when menu closes
      const mobileBuyBtn = document.querySelector('.mobile-buy-container');
      if (mobileBuyBtn) {
        mobileBuyBtn.style.display = 'none';
      }
    }
  });
  
  // Close menu when clicking regular links
  document.querySelectorAll('#nav-desktop a:not(.dropbtn):not(.mobile-buy-button)').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768 && navDesktop.classList.contains('active')) {
        navDesktop.classList.remove('active');
        mobileToggle.querySelector('i').classList.remove('fa-times');
        mobileToggle.querySelector('i').classList.add('fa-bars');
        document.body.style.overflow = '';
      }
    });
  });
}

// ========== SIMPLE MOBILE DROPDOWN FIX ==========
function initializeMobileDropdown() {
  console.log('Initializing mobile dropdown...');
  
  const dropbtns = document.querySelectorAll('.dropbtn');
  console.log('Found', dropbtns.length, 'dropdown buttons');
  
  if (!dropbtns.length) return;
  
  // Simple click handler
  dropbtns.forEach(dropbtn => {
    // Remove any existing listeners
    const newDropbtn = dropbtn.cloneNode(true);
    dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
    
    // Add fresh listener
    newDropbtn.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Mobile dropdown clicked');
        
        const dropdownContent = this.nextElementSibling;
        const isOpen = dropdownContent.style.display === 'block';
        
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(content => {
          if (content !== dropdownContent) {
            content.style.display = 'none';
          }
        });
        
        // Toggle current dropdown
        if (!isOpen) {
          dropdownContent.style.display = 'block';
          this.classList.add('active');
        } else {
          dropdownContent.style.display = 'none';
          this.classList.remove('active');
        }
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
          content.style.display = 'none';
        });
        document.querySelectorAll('.dropbtn').forEach(btn => {
          btn.classList.remove('active');
        });
      }
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
  const pageMap = {
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
  
  const selector = pageMap[currentPage];
  if (selector) {
    document.querySelector(selector)?.classList.add('active');
  }
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  const cards = document.querySelectorAll('.social-card, .voting-card, .event-content, .chat-message, .stat-card');
  
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
  
  // Initialize
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
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
document.addEventListener('DOMContentLoaded', function() {
  initializeCommon();
  
  // Force check on resize
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
});

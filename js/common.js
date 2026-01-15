// js/common.js - Common functionality for all pages

// Initialize common components
function initializeCommon() {
  // Hide loader
  setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1000);
  
  // Initialize mobile navigation
  initializeMobileNav();
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize back-to-top button
  initBackToTop();
  
  // Set active navigation item
  setActiveNavItem();
  
  // Initialize animations
  initScrollAnimations();
  
  console.log('Common components initialized');
}

// ========== MOBILE NAVIGATION ==========
function initializeMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!mobileToggle || !navDesktop) return;
  
  // Close menu function
  function closeMobileMenu() {
    navDesktop.classList.remove('active');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
    document.body.style.overflow = '';
  }
  
  // Open menu function
  function openMobileMenu() {
    navDesktop.classList.add('active');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    }
    document.body.style.overflow = 'hidden';
  }
  
  // Toggle menu
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    
    if (navDesktop.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
  
  // Close mobile nav when clicking on a link (except Buy button)
  document.querySelectorAll('#nav-desktop a:not(.mobile-buy-button)').forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });
  
  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && 
        navDesktop.classList.contains('active') &&
        !navDesktop.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navDesktop.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

// ========== MOBILE DROPDOWN ==========
function initializeMobileDropdown() {
  const dropbtns = document.querySelectorAll('.dropbtn');
  
  if (!dropbtns.length) return;
  
  dropbtns.forEach(dropbtn => {
    dropbtn.addEventListener('click', function(e) {
      // Only handle on mobile
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdownContent = this.nextElementSibling;
        const isActive = dropdownContent.style.display === 'block' || 
                        dropdownContent.classList.contains('active');
        
        // Close all other dropdowns first
        document.querySelectorAll('.dropdown-content').forEach(content => {
          if (content !== dropdownContent) {
            content.style.display = 'none';
            content.classList.remove('active');
          }
        });
        
        // Remove active class from other dropdown buttons
        document.querySelectorAll('.dropbtn').forEach(btn => {
          if (btn !== this) {
            btn.classList.remove('active');
          }
        });
        
        // Toggle this dropdown
        if (!isActive) {
          dropdownContent.style.display = 'block';
          dropdownContent.classList.add('active');
          this.classList.add('active');
        } else {
          dropdownContent.style.display = 'none';
          dropdownContent.classList.remove('active');
          this.classList.remove('active');
        }
      }
    });
  });
  
  // Close dropdown when clicking a link inside it (mobile only)
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        const dropdownContent = this.closest('.dropdown-content');
        const dropbtn = this.closest('.dropdown')?.querySelector('.dropbtn');
        
        if (dropdownContent) {
          dropdownContent.style.display = 'none';
          dropdownContent.classList.remove('active');
        }
        if (dropbtn) {
          dropbtn.classList.remove('active');
        }
      }
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const dropdownContents = document.querySelectorAll('.dropdown-content');
    const dropbtns = document.querySelectorAll('.dropbtn');
    
    if (window.innerWidth > 768) {
      // Reset styles for desktop
      dropdownContents.forEach(content => {
        content.style.display = '';
        content.classList.remove('active');
      });
      
      dropbtns.forEach(dropbtn => {
        dropbtn.classList.remove('active');
      });
    }
  });
}

// ========== BACK TO TOP ==========
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== ACTIVE NAVIGATION HIGHLIGHT ==========
function setActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop();
  
  // Remove all active classes from nav items
  document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
    el.classList.remove('active');
  });
  
  // Set active based on current page
  if (currentPage === 'index.html' || currentPage === '') {
    // Home page
    document.querySelector('a[href="index.html"]')?.classList.add('active');
  } else if (currentPage === 'epoch-rewards.html') {
    document.querySelector('a.nav-rewards')?.classList.add('active');
  } else if (currentPage === 'rebl-calculator.html') {
    document.querySelector('a.nav-rewards')?.classList.add('active');
  } else if (currentPage === 'trade.html') {
    document.querySelector('a.nav-trade')?.classList.add('active');
  } else if (currentPage === 'tokenomics.html') {
    document.querySelector('a.nav-tokenomics')?.classList.add('active');
  } else if (currentPage === 'security.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
  } else if (currentPage === 'community.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
  } else if (currentPage === 'governance.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
  } else if (currentPage === 'roadmap.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
  } else if (currentPage === 'integrity.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
  } else if (currentPage === 'artwork.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
  } else if (currentPage === 'whitepaper.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
  }
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  const cards = document.querySelectorAll('.social-card, .voting-card, .event-content, .chat-message, .stat-card');
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

// ========== MOBILE TOUCH IMPROVEMENTS ==========
function initializeMobileTouch() {
  // Prevent zoom on double-tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Add touch feedback for buttons
  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    });
    
    element.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    });
  });
}

// ========== WINDOW RESIZE HANDLER ==========
window.addEventListener('resize', function() {
  // Reset dropdown on desktop
  if (window.innerWidth > 768) {
    const dropdownContents = document.querySelectorAll('.dropdown-content');
    const dropbtns = document.querySelectorAll('.dropbtn');
    
    dropdownContents.forEach(content => {
      content.style.display = '';
      content.classList.remove('active');
    });
    
    dropbtns.forEach(dropbtn => {
      dropbtn.classList.remove('active');
    });
  }
});

// ========== ORIENTATION CHANGE ==========
window.addEventListener('orientationchange', function() {
  // Close mobile menu on orientation change
  if (window.innerWidth > 768) {
    const nav = document.getElementById('nav-desktop');
    if (nav) nav.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeCommon();
  initializeMobileTouch();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeCommon };
}

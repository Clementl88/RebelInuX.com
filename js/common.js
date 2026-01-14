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
  
  mobileToggle.addEventListener('click', function() {
    navDesktop.classList.toggle('active');
    const icon = this.querySelector('i');
    
    if (navDesktop.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
      document.body.style.overflow = 'hidden';
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      document.body.style.overflow = '';
    }
  });
  
  // Close mobile nav when clicking on a link
  document.querySelectorAll('#nav-desktop a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navDesktop.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close mobile nav when clicking outside
  document.addEventListener('click', function(event) {
    const nav = document.getElementById('nav-desktop');
    const toggle = document.getElementById('mobileNavToggle');
    
    if (window.innerWidth <= 768 && 
        nav.classList.contains('active') && 
        !nav.contains(event.target) && 
        !toggle.contains(event.target)) {
      nav.classList.remove('active');
      const toggleIcon = toggle.querySelector('i');
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
      }
      document.body.style.overflow = '';
    }
  });
}

// ========== MOBILE DROPDOWN ==========
function initializeMobileDropdown() {
  const dropbtns = document.querySelectorAll('.dropbtn');
  
  if (!dropbtns.length) return;
  
  // Mobile dropdown toggle for each dropdown
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
          content.style.display = 'none';
          content.classList.remove('active');
        });
        
        // Remove active class from all dropdown buttons
        document.querySelectorAll('.dropbtn').forEach(btn => {
          btn.classList.remove('active');
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
  
  // Close dropdown when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const dropdowns = document.querySelectorAll('.dropdown');
      let clickedInsideDropdown = false;
      
      dropdowns.forEach(dropdown => {
        if (dropdown.contains(e.target)) {
          clickedInsideDropdown = true;
        }
      });
      
      if (!clickedInsideDropdown) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
          content.style.display = 'none';
          content.classList.remove('active');
        });
        
        document.querySelectorAll('.dropbtn').forEach(dropbtn => {
          dropbtn.classList.remove('active');
        });
      }
    }
  });
  
  // Close dropdown when clicking a link inside it
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
    document.querySelector('.dropbtn.nav-rewards')?.classList.add('active');
    document.querySelector('a.nav-rewards-overview')?.classList.add('active');
  } else if (currentPage === 'rebl-calculator.html') {
    document.querySelector('.dropbtn.nav-rewards')?.classList.add('active');
    document.querySelector('a.nav-calculator')?.classList.add('active');
  } else if (currentPage === 'trade.html') {
    document.querySelector('a.nav-trade')?.classList.add('active');
  } else if (currentPage === 'tokenomics.html') {
    document.querySelector('a.nav-tokenomics')?.classList.add('active');
  } else if (currentPage === 'security.html') {
    document.querySelector('a.nav-security')?.classList.add('active');
  } else if (currentPage === 'community.html') {
    document.querySelector('a.nav-community')?.classList.add('active');
  } else if (currentPage === 'governance.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
    document.querySelector('a.nav-governance')?.classList.add('active');
  } else if (currentPage === 'roadmap.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
    document.querySelector('a.nav-roadmap')?.classList.add('active');
  } else if (currentPage === 'integrity.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
    document.querySelector('a.nav-integrity')?.classList.add('active');
  } else if (currentPage === 'artwork.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
    document.querySelector('a.nav-artwork')?.classList.add('active');
  } else if (currentPage === 'whitepaper.html') {
    document.querySelector('.dropbtn.nav-more')?.classList.add('active');
    document.querySelector('a.nav-whitepaper')?.classList.add('active');
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

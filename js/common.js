// js/common.js - Common functionality for all pages

// ========== UNIVERSAL DROPDOWN FUNCTIONALITY ==========
function initUniversalDropdowns() {
  console.log('🌐 Initializing universal dropdowns...');
  
  const dropbtns = document.querySelectorAll('.dropbtn');
  console.log(`Found ${dropbtns.length} dropdown buttons`);
  
  // Desktop: Hover behavior
  if (window.innerWidth > 768) {
    console.log('Desktop mode - hover behavior active');
    
    // Close dropdowns when clicking outside on desktop
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
          content.style.display = 'none';
        });
        document.querySelectorAll('.dropbtn').forEach(btn => {
          btn.classList.remove('active');
        });
      }
    });
    
    // Show/hide on hover for desktop
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.addEventListener('mouseenter', function() {
        const content = this.querySelector('.dropdown-content');
        const button = this.querySelector('.dropbtn');
        if (content) content.style.display = 'block';
        if (button) button.classList.add('active');
      });
      
      dropdown.addEventListener('mouseleave', function() {
        const content = this.querySelector('.dropdown-content');
        const button = this.querySelector('.dropbtn');
        if (content) content.style.display = 'none';
        if (button) button.classList.remove('active');
      });
    });
    
    return; // Exit for desktop
  }
  
  // MOBILE: Click behavior
  console.log('Mobile mode - click behavior active');
  
  dropbtns.forEach(dropbtn => {
    dropbtn.addEventListener('click', function(e) {
      console.log('🎯 Mobile dropdown clicked');
      
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.closest('.dropdown');
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      const isOpen = dropdownContent.style.display === 'block';
      
      // Close all other dropdowns
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
      });
      document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Toggle this dropdown
      if (!isOpen) {
        console.log('🟢 Opening dropdown');
        dropdownContent.style.display = 'block';
        this.classList.add('active');
      } else {
        console.log('🔴 Closing dropdown');
        dropdownContent.style.display = 'none';
        this.classList.remove('active');
      }
    });
  });
  
  // Close dropdowns when clicking outside on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth > 768) return;
    
    if (!e.target.closest('.dropdown') && !e.target.closest('#mobileNavToggle')) {
      console.log('🌍 Clicking outside - closing all dropdowns');
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
      });
      document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.classList.remove('active');
      });
    }
  });
  
  // Close dropdown when clicking a link inside (mobile)
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        console.log('🔗 Link clicked - closing dropdown');
        const dropdown = this.closest('.dropdown');
        if (dropdown) {
          const dropdownContent = dropdown.querySelector('.dropdown-content');
          const dropbtn = dropdown.querySelector('.dropbtn');
          if (dropdownContent) dropdownContent.style.display = 'none';
          if (dropbtn) dropbtn.classList.remove('active');
        }
      }
    });
  });
  
  console.log('✅ Universal dropdowns initialized');
}

// ========== SIMPLE MOBILE NAVIGATION ==========
function setupMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!mobileToggle || !navDesktop) return;
  
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    const isOpening = !navDesktop.classList.contains('active');
    navDesktop.classList.toggle('active');
    
    // Close any open dropdowns when opening mobile nav
    if (isOpening) {
      closeAllDropdowns();
    }
    
    // Toggle between ☰ and × symbols
    if (navDesktop.classList.contains('active')) {
      this.innerHTML = '×';
      document.body.style.overflow = 'hidden';
    } else {
      this.innerHTML = '☰';
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
      closeAllDropdowns();
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
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-content').forEach(content => {
    content.style.display = 'none';
  });
  document.querySelectorAll('.dropbtn').forEach(btn => {
    btn.classList.remove('active');
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
  
  // Initialize universal dropdowns (for ALL pages)
  initUniversalDropdowns();
  
  // Other initializations
  initBackToTop();
  setActiveNavItem();
  initScrollAnimations();
  
  console.log('✅ Common components initialized');
});

// Handle window resize for dropdowns
window.addEventListener('resize', function() {
  // Reinitialize dropdowns on resize
  setTimeout(initUniversalDropdowns, 100);
});

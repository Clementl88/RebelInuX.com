// js/common.js - Common functionality for all pages

// ========== DROPDOWN FUNCTIONALITY ==========
function setupDropdowns() {
  console.log('Setting up dropdowns...');
  
  // Get the dropdown button and content
  const dropdownBtn = document.getElementById('moreDropdownBtn');
  const dropdownContent = document.getElementById('moreDropdownContent');
  
  if (!dropdownBtn || !dropdownContent) {
    console.log('Dropdown elements not found');
    return;
  }
  
  console.log('Dropdown elements found:', { dropdownBtn, dropdownContent });
  
  // Function to close dropdown
  function closeDropdown() {
    console.log('Closing dropdown');
    dropdownContent.style.display = 'none';
    dropdownBtn.classList.remove('active');
  }
  
  // Function to open dropdown
  function openDropdown() {
    console.log('Opening dropdown');
    dropdownContent.style.display = 'block';
    dropdownBtn.classList.add('active');
  }
  
  // Function to toggle dropdown
  function toggleDropdown() {
    console.log('Toggle dropdown clicked');
    const isOpen = dropdownContent.style.display === 'block';
    console.log('Is currently open?', isOpen);
    
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }
  
  // DESKTOP: Hover behavior
  if (window.innerWidth > 768) {
    console.log('Setting up desktop hover behavior');
    
    // Show on hover
    dropdownBtn.addEventListener('mouseenter', function() {
      console.log('Mouse entered dropdown (desktop)');
      openDropdown();
    });
    
    // Hide when mouse leaves
    const dropdown = document.getElementById('moreDropdown');
    dropdown.addEventListener('mouseleave', function() {
      console.log('Mouse left dropdown (desktop)');
      setTimeout(() => {
        // Only close if mouse is not in dropdown or button
        if (!dropdown.matches(':hover') && !dropdownBtn.matches(':hover')) {
          closeDropdown();
        }
      }, 100);
    });
  }
  
  // MOBILE: Click behavior
  if (window.innerWidth <= 768) {
    console.log('Setting up mobile click behavior');
    
    // Toggle on click
    dropdownBtn.addEventListener('click', function(e) {
      console.log('Dropdown button clicked (mobile)');
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      console.log('Document clicked (mobile)');
      if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
        closeDropdown();
      }
    });
    
    // Close when clicking a link inside
    dropdownContent.addEventListener('click', function(e) {
      console.log('Dropdown content clicked (mobile)');
      if (e.target.tagName === 'A') {
        setTimeout(closeDropdown, 300); // Small delay for navigation
      }
    });
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    console.log('Window resized');
    // Close dropdown on resize
    closeDropdown();
    
    // Re-initialize if needed
    setTimeout(setupDropdowns, 100);
  });
  
  console.log('Dropdown setup complete');
}

// ========== MOBILE NAVIGATION ==========
function setupMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!mobileToggle || !navDesktop) return;
  
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    
    const isOpening = !navDesktop.classList.contains('active');
    navDesktop.classList.toggle('active');
    
    if (navDesktop.classList.contains('active')) {
      this.innerHTML = '×';
      document.body.style.overflow = 'hidden';
    } else {
      this.innerHTML = '☰';
      document.body.style.overflow = '';
      
      // Close dropdown when closing mobile nav
      const dropdownContent = document.getElementById('moreDropdownContent');
      const dropdownBtn = document.getElementById('moreDropdownBtn');
      if (dropdownContent) dropdownContent.style.display = 'none';
      if (dropdownBtn) dropdownBtn.classList.remove('active');
    }
  });
  
  // Close menu when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth > 768) return;
    
    if (!navDesktop.contains(e.target) && !mobileToggle.contains(e.target)) {
      navDesktop.classList.remove('active');
      mobileToggle.innerHTML = '☰';
      document.body.style.overflow = '';
      
      // Close dropdown
      const dropdownContent = document.getElementById('moreDropdownContent');
      const dropdownBtn = document.getElementById('moreDropdownBtn');
      if (dropdownContent) dropdownContent.style.display = 'none';
      if (dropdownBtn) dropdownBtn.classList.remove('active');
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

// ========== DEBUG FUNCTION ==========
function debugDropdown() {
  console.log('=== DROPDOWN DEBUG ===');
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile?', window.innerWidth <= 768);
  
  const btn = document.getElementById('moreDropdownBtn');
  const content = document.getElementById('moreDropdownContent');
  
  console.log('Button found:', !!btn);
  console.log('Content found:', !!content);
  console.log('Button HTML:', btn?.outerHTML);
  console.log('Content display style:', content?.style.display);
  
  // Test if button is clickable
  if (btn) {
    console.log('Button position:', btn.getBoundingClientRect());
    console.log('Button has onclick?', btn.onclick);
    
    // Add test click handler
    btn.addEventListener('click', function() {
      console.log('TEST: Button was clicked!');
    }, { once: true });
  }
}

// ========== INITIALIZE EVERYTHING ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM Content Loaded - Initializing...');
  
  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 500);
  
  // Setup mobile navigation
  setupMobileNav();
  
  // Setup dropdowns
  setupDropdowns();
  
  // Other initializations
  initBackToTop();
  setActiveNavItem();
  initScrollAnimations();
  
  console.log('✅ All components initialized');
  
  // Run debug on page load
  setTimeout(debugDropdown, 1000);
});

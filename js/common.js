// js/common.js - SIMPLIFIED & RELIABLE Common functionality

// ========== MAIN INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOM Content Loaded - Starting initialization...');
  
  // 1. Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 500);
  
  // 2. Setup mobile navigation
  setupMobileNavigation();
  
  // 3. Setup dropdowns (this is the key function)
  setupDropdowns();
  
  // 4. Setup back to top
  setupBackToTop();
  
  // 5. Set active nav item
  setActiveNavItem();
  
  console.log('✅ All common components initialized');
});

// ========== SIMPLE MOBILE NAVIGATION ==========
function setupMobileNavigation() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!mobileToggle || !navDesktop) return;
  
  mobileToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isOpening = !navDesktop.classList.contains('active');
    navDesktop.classList.toggle('active');
    
    // Toggle icon
    this.innerHTML = navDesktop.classList.contains('active') ? '×' : '☰';
    
    // Toggle body scroll
    document.body.style.overflow = navDesktop.classList.contains('active') ? 'hidden' : '';
    
    // Close all dropdowns when opening nav
    if (isOpening) {
      closeAllDropdowns();
    }
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
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });
}

function closeMobileNav() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (navDesktop) navDesktop.classList.remove('active');
  if (mobileToggle) mobileToggle.innerHTML = '☰';
  document.body.style.overflow = '';
  closeAllDropdowns();
}

// ========== DROPDOWNS - SIMPLE & RELIABLE ==========
function setupDropdowns() {
  console.log('Setting up dropdowns...');
  
  // Get ALL dropdown buttons on the page
  const dropbtns = document.querySelectorAll('.dropbtn');
  console.log(`Found ${dropbtns.length} dropdown buttons`);
  
  // Add click event to each dropdown button
  dropbtns.forEach(dropbtn => {
    // Remove any existing listeners (prevent duplicates)
    const newDropbtn = dropbtn.cloneNode(true);
    dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
    
    // Add click event to the new button
    newDropbtn.addEventListener('click', handleDropdownClick);
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      closeAllDropdowns();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    // On mobile, ensure dropdowns are closed when switching to desktop
    if (window.innerWidth > 768) {
      closeAllDropdowns();
    }
  });
}

function handleDropdownClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('Dropdown clicked!');
  
  const dropdown = this.closest('.dropdown');
  const dropdownContent = dropdown.querySelector('.dropdown-content');
  const isMobile = window.innerWidth <= 768;
  
  // If desktop, just toggle
  if (!isMobile) {
    const isOpen = dropdownContent.style.display === 'block';
    
    // Close all dropdowns first
    closeAllDropdowns();
    
    // Toggle this one
    if (!isOpen) {
      dropdownContent.style.display = 'block';
      this.classList.add('active');
    }
    return;
  }
  
  // MOBILE SPECIFIC LOGIC
  const isOpen = dropdownContent.style.display === 'block';
  
  // Close all dropdowns first
  closeAllDropdowns();
  
  // Toggle this dropdown
  if (!isOpen) {
    dropdownContent.style.display = 'block';
    this.classList.add('active');
    console.log('Mobile dropdown opened');
  }
  
  // Close dropdown when clicking a link inside
  dropdownContent.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          closeAllDropdowns();
          closeMobileNav(); // Also close mobile nav when link is clicked
        }, 300);
      }
    });
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
function setupBackToTop() {
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
    document.querySelector(selector)?.classList.add('active');
  }
}

// ========== DEBUG HELPER ==========
function debugDropdowns() {
  console.log('=== DEBUG INFO ===');
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile?', window.innerWidth <= 768);
  console.log('Dropdown buttons:', document.querySelectorAll('.dropbtn').length);
  console.log('Dropdown contents:', document.querySelectorAll('.dropdown-content').length);
  
  // Check if event listeners are attached
  document.querySelectorAll('.dropbtn').forEach((btn, i) => {
    console.log(`Button ${i}:`, btn.outerHTML.substring(0, 50) + '...');
  });
}

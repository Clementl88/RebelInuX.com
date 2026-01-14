// js/common.js - Common functionality for all pages

// Initialize common components
function initializeCommon() {
  // Hide loader
  setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1000);
  
  // Initialize Tippy.js tooltips if available
  if (typeof tippy !== 'undefined') {
    tippy('[data-tippy-content]', {
      theme: 'light-border',
      arrow: true,
      placement: 'top',
      allowHTML: true,
    });
  }
  
  // Initialize mobile navigation
  initializeMobileNav();
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize back-to-top button
  initBackToTop();
  
  // Initialize tab functionality (if exists on page)
  if (document.querySelector('.stat-tab')) {
    initStatsTabs();
  }
  
  // Animate cards on scroll
  initScrollAnimations();
  
  // Set active navigation item
  setActiveNavItem();
  
  // Initialize countdowns (if they exist on page)
  if (document.getElementById('days1')) {
    updateCountdown1();
    updateCountdown2();
    setInterval(updateCountdown1, 1000);
    setInterval(updateCountdown2, 1000);
  }
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
}

// ========== MOBILE DROPDOWN ==========
function initializeMobileDropdown() {
  const dropbtn = document.querySelector('.dropbtn');
  const dropdownContent = document.querySelector('.dropdown-content');
  
  if (!dropbtn || !dropdownContent) return;
  
  // Mobile dropdown toggle
  dropbtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const isActive = dropdownContent.style.display === 'block' || 
                    dropdownContent.classList.contains('active');
    
    if (!isActive) {
      dropdownContent.style.display = 'block';
      dropdownContent.classList.add('active');
      dropbtn.classList.add('active');
    } else {
      dropdownContent.style.display = 'none';
      dropdownContent.classList.remove('active');
      dropbtn.classList.remove('active');
    }
  });
  
  // Close dropdown when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (!e.target.closest('.dropdown') && dropdownContent) {
        dropdownContent.style.display = 'none';
        dropdownContent.classList.remove('active');
        const dropbtn = document.querySelector('.dropbtn');
        if (dropbtn) dropbtn.classList.remove('active');
      }
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

// ========== STATS TABS ==========
function initStatsTabs() {
  const tabButtons = document.querySelectorAll('.stat-tab');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      showStatTab(tabName);
    });
  });
}

function showStatTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.stat-tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.stat-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab content
  const targetTab = document.getElementById(tabName + '-stats');
  if (targetTab) targetTab.classList.add('active');
  
  // Activate clicked tab button
  const activeButton = document.querySelector(`.stat-tab[data-tab="${tabName}"]`);
  if (activeButton) activeButton.classList.add('active');
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
  const cards = document.querySelectorAll('.stat-card, .step-card, .countdown-box, .key-card');
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

// ========== ACTIVE NAVIGATION HIGHLIGHT ==========
function setActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop();
  
  // Remove all active classes from nav items
  document.querySelectorAll('#nav-desktop a, .dropbtn').forEach(el => {
    el.classList.remove('active');
  });
  
  // Set active based on current page
  if (currentPage === 'epoch-rewards.html') {
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
  }
  // Add more conditions for other pages as needed
}

// ========== WINDOW RESIZE HANDLER ==========
window.addEventListener('resize', function() {
  // Reset dropdown on desktop
  if (window.innerWidth > 768) {
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropbtn = document.querySelector('.dropbtn');
    
    if (dropdownContent) {
      dropdownContent.style.display = '';
      dropdownContent.classList.remove('active');
    }
    if (dropbtn) dropbtn.classList.remove('active');
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeCommon };
}

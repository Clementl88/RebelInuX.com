/// integrity.js - Integrity page functionality

// Initialize after page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initIntegrityPage, 300);
});

function initIntegrityPage() {
  console.log('Initializing Integrity page');
  
  // Initialize animations
  initAnimations();
  
  // Initialize interactive elements
  initInteractiveElements();
  
  // Initialize scroll effects
  initScrollEffects();
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
}

// ========== ANIMATIONS ==========
function initAnimations() {
  console.log('Initializing integrity page animations');
  
  // Add staggered animation to principle cards
  const cards = document.querySelectorAll('.principle-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });
  
  // Add hover glow effect to cards
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (this.classList.contains('prohibit')) {
        this.style.boxShadow = '0 20px 40px rgba(255, 51, 102, 0.25)';
      } else {
        this.style.boxShadow = '0 20px 40px rgba(255, 204, 0, 0.25)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    });
  });
}

// ========== INTERACTIVE ELEMENTS ==========
function initInteractiveElements() {
  console.log('Initializing interactive elements');
  
  // Add click effect to verification items
  const verificationItems = document.querySelectorAll('.verification-item');
  verificationItems.forEach(item => {
    item.addEventListener('click', function() {
      // Create ripple effect
      createRippleEffect(this, 'rgba(255, 255, 255, 0.1)');
      
      // Temporary scale effect
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
  
  // Add pulse animation to security badge
  const securityBadge = document.querySelector('.security-badge');
  if (securityBadge) {
    setInterval(() => {
      securityBadge.style.boxShadow = '0 0 30px rgba(255, 51, 102, 0.5)';
      setTimeout(() => {
        securityBadge.style.boxShadow = '0 0 30px rgba(255, 51, 102, 0.3)';
      }, 1000);
    }, 3000);
  }
}

// ========== SCROLL EFFECTS ==========
function initScrollEffects() {
  console.log('Initializing scroll effects');
  
  // Parallax effect for hero section
  const hero = document.querySelector('.page-hero--integrity');
  if (hero) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = 'translate3d(0, ' + rate + 'px, 0)';
    });
  }
  
  // Reveal animations on scroll
  const revealElements = document.querySelectorAll('.value-indicator, .commitment-highlight');
  
  function revealOnScroll() {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }
    });
  }
  
  // Set initial state
  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
  });
  
  // Check on load and scroll
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
}

// ========== MOBILE DROPDOWN ==========
function initializeMobileDropdown() {
  const dropbtn = document.querySelector('.dropbtn');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!dropbtn) return;
  
  // Mobile dropdown toggle
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
}

// ========== UTILITY FUNCTIONS ==========
function createRippleEffect(element, color = 'rgba(255, 255, 255, 0.3)') {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: ${color};
    transform: scale(0);
    animation: ripple 0.6s linear;
    width: ${size}px;
    height: ${size}px;
    top: ${y}px;
    left: ${x}px;
    pointer-events: none;
  `;
  
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    ripple.remove();
    style.remove();
  }, 600);
}

// ========== CTA BUTTON EFFECTS ==========
function enhanceCTAButtons() {
  const ctaButtons = document.querySelectorAll('.cta-button');
  
  ctaButtons.forEach(button => {
    // Add hover effect
    button.addEventListener('mouseenter', function() {
      if (this.classList.contains('gold')) {
        this.style.background = 'linear-gradient(135deg, #e6b800, var(--rebel-gold))';
      } else {
        this.style.background = 'linear-gradient(135deg, #d62828, var(--rebel-red))';
      }
    });
    
    button.addEventListener('mouseleave', function() {
      if (this.classList.contains('gold')) {
        this.style.background = 'var(--rebel-gold)';
      } else {
        this.style.background = 'var(--rebel-red)';
      }
    });
    
    // Add click effect
    button.addEventListener('click', function() {
      createRippleEffect(this, 'rgba(255, 255, 255, 0.5)');
    });
  });
}

// ========== LOADER ==========
function initLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    // Simulate content loading
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      
      // Initialize other features after loader hides
      setTimeout(() => {
        enhanceCTAButtons();
      }, 300);
    }, 1000);
  }
}

// ========== BACK TO TOP ==========
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ========== INITIALIZE EVERYTHING ==========
function initializeAll() {
  initLoader();
  initBackToTop();
  initIntegrityPage();
}

// Export functions if needed
window.initIntegrityPage = initIntegrityPage;
window.initializeMobileDropdown = initializeMobileDropdown;

// Initialize on load
initializeAll();

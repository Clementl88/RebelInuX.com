// community.js - Community Hub page functionality
// RebelInuX Community Hub - Complete functionality

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('RebelInuX Community Hub - Initializing');
  
  // Wait for common components to load
  setTimeout(initCommunityPage, 500);
});

function initCommunityPage() {
  console.log('Community Hub page initialized');
  
  // Initialize all components
  initMobileNavigation();
  initCommunityStats();
  initSocialCards();
  initVotingCards();
  initFAQAccordion();
  initCommunityBenefits();
  initGetInvolvedSteps();
  initRelatedCards();
  initAOSAnimations();
  initScrollAnimations();
  initEventListeners();
  
  // Show welcome message
  showToast('Welcome to RebelInuX Community Hub!', 'info');
}

// ========== MOBILE NAVIGATION ==========
function initMobileNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const dropbtns = document.querySelectorAll('.dropbtn');
  
  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Mobile dropdown functionality
  dropbtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = this.nextElementSibling;
        const isActive = dropdown.classList.contains('active');
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown-content.active').forEach(item => {
          if (item !== dropdown) {
            item.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        if (!isActive) {
          dropdown.classList.add('active');
          this.classList.add('active');
        } else {
          dropdown.classList.remove('active');
          this.classList.remove('active');
        }
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-content.active').forEach(item => {
        item.classList.remove('active');
      });
      document.querySelectorAll('.dropbtn.active').forEach(btn => {
        btn.classList.remove('active');
      });
    }
  });
}

// ========== COMMUNITY STATISTICS ==========
function initCommunityStats() {
  console.log('Initializing community statistics');
  
  // Update stats immediately
  updateCommunityStats();
  
  // Update every 5 minutes (300000ms)
  setInterval(updateCommunityStats, 300000);
  
  // Add hover effects to stat items
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-5px)';
      item.style.boxShadow = '0 10px 20px rgba(255, 204, 0, 0.2)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'translateY(0)';
      item.style.boxShadow = 'none';
    });
    
    // Touch feedback
    item.addEventListener('touchstart', () => {
      item.classList.add('touch-active');
    });
    
    item.addEventListener('touchend', () => {
      setTimeout(() => {
        item.classList.remove('touch-active');
      }, 200);
    });
  });
}

async function updateCommunityStats() {
  try {
    // Current community statistics
    const stats = {
      telegram: 278,
      twitter: 440,
      discord: 65,
      zora: 432
    };
    
    // Animate counters
    animateCounter('telegramMembers', stats.telegram, '+');
    animateCounter('xFollowers', stats.twitter, '+');
    animateCounter('discordMembers', stats.discord, '+');
    animateCounter('zoraFollowers', stats.zora, '+');
    
    console.log('Community stats updated:', stats);
    
  } catch (error) {
    console.error('Error updating community stats:', error);
  }
}

function animateCounter(elementId, target, suffix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const currentText = element.textContent;
  const current = parseInt(currentText.replace(/[^\d]/g, '')) || 0;
  
  // Only animate if value has changed
  if (current === target) return;
  
  const duration = 1000; // 1 second
  const steps = 60;
  const increment = (target - current) / steps;
  let step = 0;
  
  const timer = setInterval(() => {
    step++;
    const newValue = Math.floor(current + (increment * step));
    
    if (step >= steps || (increment > 0 && newValue >= target) || (increment < 0 && newValue <= target)) {
      element.textContent = target + suffix;
      clearInterval(timer);
      
      // Add celebration effect for significant increases
      if (target > current) {
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
        }, 300);
      }
    } else {
      element.textContent = newValue + suffix;
    }
  }, duration / steps);
}

// ========== SOCIAL CARDS ==========
function initSocialCards() {
  const socialCards = document.querySelectorAll('.social-card');
  
  socialCards.forEach(card => {
    // Click handler
    card.addEventListener('click', function(e) {
      // Don't prevent default for actual links
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('Coming soon!', 'info');
      }
      
      // Add click feedback
      this.classList.add('card-clicked');
      setTimeout(() => {
        this.classList.remove('card-clicked');
      }, 300);
    });
    
    // Hover effects
    card.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.social-icon');
        const button = this.querySelector('.social-button');
        
        if (icon) {
          icon.style.transform = 'scale(1.15) rotate(5deg)';
        }
        if (button) {
          button.style.transform = 'translateX(5px)';
          button.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
        }
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.social-icon');
        const button = this.querySelector('.social-button');
        
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
        if (button) {
          button.style.transform = 'translateX(0)';
          button.style.boxShadow = 'none';
        }
      }
    });
    
    // Touch feedback
    card.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    });
    
    card.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('touch-active');
      }, 200);
    });
  });
}

// ========== VOTING CARDS ==========
function initVotingCards() {
  const votingCards = document.querySelectorAll('.voting-card');
  const votingButtons = document.querySelectorAll('.voting-card .cta-button');
  
  votingCards.forEach(card => {
    // Hover effects
    card.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.voting-icon');
        if (icon) {
          icon.style.transform = 'scale(1.15) rotate(10deg)';
          icon.style.boxShadow = '0 8px 25px rgba(255, 51, 102, 0.5)';
        }
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.voting-icon');
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
          icon.style.boxShadow = '0 4px 15px rgba(255, 51, 102, 0.3)';
        }
      }
    });
    
    // Touch feedback
    card.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    });
    
    card.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('touch-active');
      }, 200);
    });
  });
  
  // Voting button click handlers
  votingButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Track voting click
      trackVotingClick(this.closest('.voting-card').querySelector('h3').textContent);
    });
  });
}

function trackVotingClick(platform) {
  console.log(`Voting clicked for: ${platform}`);
  
  // Store in localStorage for daily reminder
  const today = new Date().toDateString();
  const votes = JSON.parse(localStorage.getItem('rebelinux_votes') || '{}');
  votes[today] = votes[today] || [];
  if (!votes[today].includes(platform)) {
    votes[today].push(platform);
    localStorage.setItem('rebelinux_votes', JSON.stringify(votes));
    
    // Check if all platforms voted today
    checkDailyVotingProgress(votes[today]);
  }
}

function checkDailyVotingProgress(votedPlatforms) {
  const allPlatforms = ['Coinsniper', 'Coinvote', 'Gemfinder', 'CoinHunt'];
  const votedCount = votedPlatforms.length;
  
  if (votedCount === allPlatforms.length) {
    showToast('🎉 Amazing! You\'ve voted on all platforms today!', 'success');
    
    // Add celebration effect
    const missionHeader = document.querySelector('.mission-header');
    if (missionHeader) {
      missionHeader.style.animation = 'pulse 1s 3';
    }
  } else if (votedCount > 0) {
    showToast(`Great! ${votedCount}/4 voting platforms completed today`, 'info');
  }
}

// ========== FAQ ACCORDION ==========
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach((item) => {
    // Add click handler
    item.addEventListener('click', (e) => {
      toggleFAQItem(item);
    });
    
    // Add keyboard support
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-expanded', 'false');
    
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQItem(item);
      }
    });
    
    // Add hover effects
    item.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        this.style.transform = 'translateY(-5px)';
      }
    });
    
    item.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768 && !this.classList.contains('active')) {
        this.style.transform = 'translateY(0)';
      }
    });
  });
  
  // Open first FAQ by default on load
  if (faqItems.length > 0) {
    setTimeout(() => {
      toggleFAQItem(faqItems[0], true);
    }, 1500);
  }
}

function toggleFAQItem(item, initial = false) {
  const isActive = item.classList.contains('active');
  
  // Close all other items (except when initializing first item)
  if (!initial) {
    document.querySelectorAll('.faq-item.active').forEach(activeItem => {
      if (activeItem !== item) {
        activeItem.classList.remove('active');
        activeItem.setAttribute('aria-expanded', 'false');
        activeItem.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Toggle current item
  if (!isActive) {
    item.classList.add('active');
    item.setAttribute('aria-expanded', 'true');
    if (window.innerWidth > 768) {
      item.style.transform = 'translateY(-5px)';
    }
  } else {
    item.classList.remove('active');
    item.setAttribute('aria-expanded', 'false');
    if (window.innerWidth > 768) {
      item.style.transform = 'translateY(0)';
    }
  }
}

// ========== COMMUNITY BENEFITS ==========
function initCommunityBenefits() {
  const benefitCards = document.querySelectorAll('.benefit-card');
  
  benefitCards.forEach(card => {
    // Add hover effects
    card.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.benefit-icon');
        if (icon) {
          icon.style.transform = 'scale(1.1)';
          icon.style.color = '#ffcc00';
        }
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.benefit-icon');
        if (icon) {
          icon.style.transform = 'scale(1)';
          icon.style.color = '';
        }
      }
    });
    
    // Click handler for mobile expansion
    if (window.innerWidth <= 768) {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('expanded');
      });
    }
  });
}

// ========== GET INVOLVED STEPS ==========
function initGetInvolvedSteps() {
  const stepItems = document.querySelectorAll('.step-item');
  const stepActions = document.querySelectorAll('.step-action');
  
  stepItems.forEach(item => {
    // Add hover effect
    item.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        this.style.transform = 'translateX(10px)';
        this.style.boxShadow = '0 10px 30px rgba(255, 204, 0, 0.2)';
      }
    });
    
    item.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        this.style.transform = 'translateX(0)';
        this.style.boxShadow = 'none';
      }
    });
  });
  
  // Step action click handlers
  stepActions.forEach(action => {
    action.addEventListener('click', function(e) {
      if (this.getAttribute('href')) {
        showToast('Opening link...', 'info');
      }
    });
  });
}

// ========== RELATED CARDS ==========
function initRelatedCards() {
  const relatedCards = document.querySelectorAll('.related-card');
  
  relatedCards.forEach(card => {
    // Hover effects
    card.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.related-icon');
        const arrow = this.querySelector('.related-arrow');
        
        if (icon) icon.style.transform = 'scale(1.1)';
        if (arrow) arrow.style.transform = 'translateX(5px)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.related-icon');
        const arrow = this.querySelector('.related-arrow');
        
        if (icon) icon.style.transform = 'scale(1)';
        if (arrow) arrow.style.transform = 'translateX(0)';
      }
    });
    
    // Click feedback
    card.addEventListener('click', function() {
      this.classList.add('card-clicked');
      setTimeout(() => {
        this.classList.remove('card-clicked');
      }, 300);
    });
  });
}

// ========== ANIMATIONS ==========
function initAOSAnimations() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      delay: 100,
      disable: function() {
        return window.innerWidth < 768;
      },
      startEvent: 'DOMContentLoaded'
    });
    
    // Refresh AOS on load and resize
    window.addEventListener('load', () => AOS.refresh());
    window.addEventListener('resize', debounce(() => AOS.refresh(), 250));
  }
}

function initScrollAnimations() {
  // Use Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements
  const elementsToAnimate = document.querySelectorAll(
    '.social-card, .benefit-card, .voting-card, .guideline-item, .step-item, .faq-item, .related-card, .mission-highlight'
  );
  
  elementsToAnimate.forEach(el => observer.observe(el));
}

// ========== EVENT LISTENERS ==========
function initEventListeners() {
  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', scrollToTop);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', debounce(() => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, 100));
  }
  
  // Social platform buttons in hero
  const heroButtons = document.querySelectorAll('.hero-buttons .cta-button');
  heroButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const text = this.textContent.trim();
      if (text.includes('Telegram')) {
        showToast('Joining Telegram community...', 'info');
      } else if (text.includes('Voting')) {
        showToast('Navigating to voting missions...', 'info');
      } else if (text.includes('Guidelines')) {
        showToast('Viewing community guidelines...', 'info');
      }
    });
  });
  
  // Final CTA buttons
  const ctaButtons = document.querySelectorAll('main section:last-of-type .cta-button');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      const text = this.textContent.trim();
      showToast(`Awesome! ${text}`, 'success');
    });
  });
}

// ========== UTILITY FUNCTIONS ==========
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'info') {
  // Remove existing toast
  const existingToast = document.querySelector('.rebel-toast');
  if (existingToast) existingToast.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `rebel-toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  
  // Icons for different types
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-circle'
  };
  
  toast.innerHTML = `
    <i class="${icons[type] || icons.info}"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add styles
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : 
                 type === 'error' ? '#f44336' : 
                 type === 'warning' ? '#ff9800' : '#2196F3'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 350px;
    transform: translateY(100px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);
  
  // Close button
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    hideToast(toast);
  });
  
  // Auto-remove after 4 seconds
  const autoRemove = setTimeout(() => {
    hideToast(toast);
  }, 4000);
  
  // Function to hide toast
  function hideToast(toastElement) {
    clearTimeout(autoRemove);
    toastElement.style.transform = 'translateY(100px)';
    toastElement.style.opacity = '0';
    setTimeout(() => {
      if (toastElement.parentNode) {
        toastElement.parentNode.removeChild(toastElement);
      }
    }, 300);
  }
}

// ========== GLOBAL EXPORTS ==========
// Make functions available globally if needed
window.RebelInuXCommunity = {
  init: initCommunityPage,
  showToast: showToast,
  updateStats: updateCommunityStats,
  toggleFAQ: toggleFAQItem,
  scrollToTop: scrollToTop
};

// ========== ADDITIONAL STYLES ==========
// Add dynamic styles for animations
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    /* Animation classes */
    .animated-in {
      animation: fadeInUp 0.6s ease forwards;
    }
    
    .card-clicked {
      animation: clickPulse 0.3s ease;
    }
    
    .touch-active {
      opacity: 0.9 !important;
      transform: scale(0.98) !important;
    }
    
    /* Back to top button */
    .back-to-top {
      transition: all 0.3s ease;
      opacity: 0;
      pointer-events: none;
    }
    
    .back-to-top.visible {
      opacity: 1;
      pointer-events: all;
    }
    
    /* Toast close button */
    .toast-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      margin-left: 10px;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
    
    /* Keyframe animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes clickPulse {
      0% { transform: scale(1); }
      50% { transform: scale(0.98); }
      100% { transform: scale(1); }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(255, 204, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0); }
    }
    
    /* Mobile menu */
    .menu-open {
      overflow: hidden;
    }
    
    /* FAQ item states */
    .faq-item.active {
      background: rgba(0, 0, 0, 0.6) !important;
    }
  `;
  document.head.appendChild(style);
});

// ========== PERFORMANCE OPTIMIZATIONS ==========
// Request Animation Frame for smooth animations
function animateWithRAF(callback) {
  let ticking = false;
  return function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
}

// Throttle scroll events
window.addEventListener('scroll', animateWithRAF(function() {
  // Any scroll-based animations
}), { passive: true });

// ========== ERROR HANDLING ==========
window.addEventListener('error', function(e) {
  console.error('Community Hub Error:', e.error);
  showToast('An error occurred. Please refresh the page.', 'error');
});

// ========== OFFLINE SUPPORT ==========
window.addEventListener('online', function() {
  showToast('Back online!', 'success');
});

window.addEventListener('offline', function() {
  showToast('You are currently offline. Some features may be limited.', 'warning');
});

console.log('RebelInuX Community Hub JavaScript loaded successfully');

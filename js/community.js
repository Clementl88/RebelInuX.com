// community.js - Community Hub page functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initCommunityPage, 300);
});

function initCommunityPage() {
  console.log('Initializing Community Hub page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize community data
  initCommunityData();
  
  // Initialize animations
  initScrollAnimations();
  
  // Initialize AOS animations
  initAOS();
  
  // Initialize chat interactions
  initChatInteractions();
  
  // Initialize social cards
  initSocialCards();
}

// ========== AOS ANIMATIONS ==========
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.innerWidth < 768 ? 'mobile' : false
    });
    
    // Refresh AOS on window resize
    window.addEventListener('resize', function() {
      AOS.refresh();
    });
  }
}

// ========== MOBILE DROPDOWN FUNCTIONALITY ==========
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

// ========== COMMUNITY DATA FUNCTIONS ==========
function initCommunityData() {
  console.log('Initializing community data');
  
  // Fetch and update community stats
  updateCommunityStats();
  
  // Initialize chat messages
  initChatMessages();
  
  // Start periodic updates
  setInterval(updateCommunityStats, 60000); // Update every minute
}

async function updateCommunityStats() {
  try {
    // In a real implementation, you would fetch these from APIs
    const stats = {
      holders: 67,
      telegram: 500,
      twitter: 1000
    };
    
    // Update stat counters with animation
    animateCounter('holderCount', stats.holders);
    animateCounter('telegramMembers', stats.telegram);
    animateCounter('xFollowers', stats.twitter);
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating community stats:', error);
  }
}

function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const current = parseInt(element.textContent.replace('+', '')) || 0;
  if (current === target) return;
  
  const duration = 1000; // 1 second
  const increment = (target - current) / (duration / 16);
  
  let currentValue = current;
  const timer = setInterval(() => {
    currentValue += increment;
    if ((increment > 0 && currentValue >= target) || (increment < 0 && currentValue <= target)) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(currentValue) + '+';
    }
  }, 16);
}

function updateLastUpdated() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const timestampElement = document.querySelector('.update-time');
  if (timestampElement) {
    timestampElement.textContent = `Last Updated: ${timeString}`;
  }
}

// ========== CHAT INTERACTIONS ==========
function initChatInteractions() {
  const chatPreview = document.querySelector('.chat-preview');
  if (!chatPreview) return;
  
  // Auto-scroll to bottom
  chatPreview.scrollTop = chatPreview.scrollHeight;
  
  // Add click handler for chat rules
  const chatRules = document.querySelector('.chat-rules');
  if (chatRules) {
    chatRules.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        this.classList.toggle('expanded');
      }
    });
  }
}

function initChatMessages() {
  // In a real implementation, you would fetch chat messages from an API
  const messages = [
    { author: "Rebel_Bot", text: "Welcome new rebels! 🎉", time: "1 min ago" },
    { author: "CryptoMax", text: "Just bought more $REBL! 🚀", time: "3 min ago" },
    { author: "DeFiQueen", text: "Love the transparency in this project!", time: "5 min ago" },
    { author: "MoonWalker", text: "When's the next AMA?", time: "8 min ago" }
  ];
  
  // You could use this to dynamically update chat messages
  return messages;
}

// ========== SOCIAL CARDS ==========
function initSocialCards() {
  const socialCards = document.querySelectorAll('.social-card');
  
  socialCards.forEach(card => {
    // Add click handler for mobile
    card.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        this.classList.toggle('expanded');
      }
    });
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.social-icon');
        if (icon) {
          icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.social-icon');
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
      }
    });
  });
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.social-card, .feature-card, .benefit-card, .update-card, .process-step, .step-item, .faq-item, .related-card'
  );
  
  // Use Intersection Observer for better performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    window.addEventListener('scroll', animateElements);
    animateElements(); // Initial check
  }
}

function animateElements() {
  const animatedElements = document.querySelectorAll(
    '.social-card, .feature-card, .benefit-card, .update-card, .process-step, .step-item, .faq-item, .related-card'
  );
  
  animatedElements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
    
    if (isVisible) {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 50);
    }
  });
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'info') {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Style toast
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  
  document.body.appendChild(toast);
  
  // Add animation styles if not already present
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// ========== EVENT HANDLERS ==========
function joinTelegram() {
  window.open('https://t.me/RebelInuX', '_blank');
  showToast('Opening Telegram...', 'info');
}

function followTwitter() {
  window.open('https://x.com/RebelInuX', '_blank');
  showToast('Opening X (Twitter)...', 'info');
}

// ========== GLOBAL EXPORTS ==========
window.joinTelegram = joinTelegram;
window.followTwitter = followTwitter;
window.initializeMobileDropdown = initializeMobileDropdown;
window.showToast = showToast;

// Add touch-active class styles
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .touch-active {
      opacity: 0.7 !important;
      transform: scale(0.98) !important;
      transition: all 0.1s ease !important;
    }
    
    .social-card.expanded,
    .chat-rules.expanded {
      transform: scale(1.02) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
});

// governance.js - Governance Portal page functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initGovernancePage, 300);
});

function initGovernancePage() {
  console.log('Initializing Governance Portal page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize governance data
  initGovernanceData();
  
  // Initialize animations
  initScrollAnimations();
  
  // Initialize AOS animations
  initAOS();
  
  // Initialize accordion functionality
  initAccordion();
  
  // Initialize stats animation
  initStatsAnimation();
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

// ========== GOVERNANCE DATA FUNCTIONS ==========
function initGovernanceData() {
  console.log('Initializing governance data');
  
  // Fetch and update governance stats
  updateGovernanceStats();
  
  // Start periodic updates
  setInterval(updateGovernanceStats, 60000); // Update every minute
}

async function updateGovernanceStats() {
  try {
    // In a real implementation, you would fetch these from APIs
    const stats = {
      dualModel: "Dual",
      activeVoting: "2 Systems",
      participants: 67,
      daoLaunch: "2026"
    };
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating governance stats:', error);
  }
}

function initStatsAnimation() {
  // Animate stat numbers
  document.querySelectorAll('.stat-number').forEach((stat, index) => {
    const originalValue = stat.textContent;
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      stat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      stat.style.opacity = '1';
      stat.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
}

function updateLastUpdated() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const timestampElement = document.querySelector('.update-time');
  if (timestampElement) {
    timestampElement.textContent = `Last Updated: ${timeString}`;
  }
}

// ========== ACCORDION FUNCTIONALITY ==========
function initAccordion() {
  const accordionItems = document.querySelectorAll('.faq-item');
  
  accordionItems.forEach(item => {
    const header = item.querySelector('h4');
    const content = item.querySelector('p');
    
    if (header && content) {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => {
        const isActive = content.style.maxHeight && content.style.maxHeight !== '0px';
        
        // Close all other items
        document.querySelectorAll('.faq-item p').forEach(p => {
          p.style.maxHeight = '0';
          p.style.opacity = '0';
          p.style.paddingTop = '0';
          p.style.paddingBottom = '0';
          p.style.overflow = 'hidden';
          p.style.transition = 'all 0.3s ease';
        });
        
        // Reset all icons
        document.querySelectorAll('.faq-item h4 i.fa-chevron-down').forEach(icon => {
          icon.classList.remove('fa-rotate-180');
        });
        
        if (!isActive) {
          // Open this item
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
          content.style.paddingTop = '10px';
          content.style.paddingBottom = '10px';
          
          // Rotate icon
          const icon = header.querySelector('i.fa-chevron-down');
          if (icon) {
            icon.classList.add('fa-rotate-180');
          }
        }
      });
      
      // Initialize all as closed
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.paddingTop = '0';
      content.style.paddingBottom = '0';
      content.style.overflow = 'hidden';
      content.style.transition = 'all 0.3s ease';
    }
  });
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.principle-item, .process-step, .related-card, .faq-item, .content-card'
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
    '.principle-item, .process-step, .related-card, .faq-item, .content-card'
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
function showToast(message, type = 'info', duration = 3000) {
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
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// ========== GLOBAL EXPORTS ==========
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
    
    .faq-item h4 {
      cursor: pointer;
      transition: color 0.3s ease;
    }
    
    .faq-item h4:hover {
      color: var(--rebel-gold);
    }
    
    .faq-item h4 i.fa-chevron-down {
      transition: transform 0.3s ease;
      float: right;
      margin-left: 10px;
    }
    
    .faq-item h4 i.fa-chevron-down.fa-rotate-180 {
      transform: rotate(180deg);
    }
  `;
  document.head.appendChild(style);
});

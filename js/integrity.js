// integrity.js - Enhanced Integrity page functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initIntegrityPage, 300);
});

function initIntegrityPage() {
  console.log('Initializing enhanced Integrity page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize security data
  initSecurityData();
  
  // Initialize animations
  initScrollAnimations();
  
  // Initialize AOS animations
  initAOS();
  
  // Initialize touch events
  initTouchEvents();
  
  // Initialize principle card interactions
  initPrincipleCards();
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

// ========== SECURITY DATA FUNCTIONS ==========
function initSecurityData() {
  console.log('Initializing security data');
  
  // Fetch and update holder count
  updateHolderCount();
  
  // Update verification timestamps
  updateVerificationTimestamps();
  
  // Initialize copy contract functionality
  initCopyContract();
  
  // Initialize real-time data
  initRealTimeData();
}

async function updateHolderCount() {
  try {
    // In a real implementation, you would fetch this from an API
    const holderCount = 67; // Static for now
    
    // Update all holder count elements
    document.querySelectorAll('.metric-item .metric-value').forEach(el => {
      if (el.textContent.includes('67')) {
        el.textContent = holderCount.toLocaleString();
      }
    });
    
    // Animate the update
    const elements = document.querySelectorAll('.takeaway-value');
    elements.forEach(el => {
      if (el.textContent.includes('67')) {
        animateCounter(el, holderCount);
      }
    });
    
  } catch (error) {
    console.error('Error updating holder count:', error);
  }
}

function updateVerificationTimestamps() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const dateString = now.toLocaleDateString();
  
  // Update timestamp in commitment section
  const timestampElement = document.querySelector('.update-time');
  if (timestampElement) {
    timestampElement.textContent = `Last Updated: ${dateString} ${timeString}`;
  }
}

// ========== PRINCIPLE CARD INTERACTIONS ==========
function initPrincipleCards() {
  const principleCards = document.querySelectorAll('.principle-card');
  
  principleCards.forEach(card => {
    // Add click handler for mobile
    card.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        this.classList.toggle('expanded');
      }
    });
    
    // Add hover effects
    card.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.card-icon');
        if (icon) {
          icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        const icon = this.querySelector('.card-icon');
        if (icon) {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }
      }
    });
  });
}

// ========== CONTRACT FUNCTIONS ==========
function initCopyContract() {
  console.log('Contract copy functionality initialized');
  
  // Add copy event to all copy buttons
  const copyButtons = document.querySelectorAll('.copy-button');
  copyButtons.forEach(button => {
    button.addEventListener('click', copyContract);
  });
}

function copyContract(event) {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;
  const originalText = button.textContent;
  
  navigator.clipboard.writeText(contractAddress).then(() => {
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#4CAF50';
    button.style.transform = 'scale(0.95)';
    
    showToast('Contract address copied to clipboard!', 'success');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
      button.style.transform = '';
    }, 2000);
    
  }).catch(err => {
    console.error('Failed to copy: ', err);
    button.innerHTML = '<i class="fas fa-times"></i> Failed';
    button.style.background = '#f44336';
    showToast('Failed to copy. Please try again.', 'error');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
    }, 2000);
  });
}

function addToWallet() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;
  
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  
  // Show instructions for adding to wallet
  showToast('Check your wallet for token addition prompt', 'info');
  
  // Try to add token automatically
  try {
    if (typeof window.solana !== 'undefined') {
      // For Phantom wallet
      window.solana.request({
        method: 'addToken',
        params: {
          address: contractAddress,
          symbol: 'REBL',
          decimals: 9,
          image: 'https://i.imgur.com/gEuSg1Y.webp'
        }
      }).then(() => {
        showToast('$REBL added to wallet successfully!', 'success');
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      }).catch(err => {
        console.error('Failed to add token:', err);
        showManualInstructions(contractAddress);
        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      });
    } else {
      showManualInstructions(contractAddress);
      setTimeout(() => {
        button.innerHTML = originalHTML;
      }, 2000);
    }
  } catch (error) {
    console.error('Error adding to wallet:', error);
    showManualInstructions(contractAddress);
    setTimeout(() => {
      button.innerHTML = originalHTML;
    }, 2000);
  }
}

function showManualInstructions(contractAddress) {
  const instructions = `To add $REBL to your wallet:
1. Open your wallet (Phantom, Solflare, etc.)
2. Click "Add Token" or "Import Token"
3. Paste this address: ${contractAddress}
4. Confirm addition`;

  showToast('Instructions shown in alert', 'info');
  setTimeout(() => {
    alert(instructions);
  }, 100);
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.takeaway-item, .security-card, .checklist-item, .audit-card, .faq-item, .related-card, .principle-card, .verification-stat'
  );
  
  // Set initial state
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  function animateElements() {
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
    
    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    window.addEventListener('scroll', animateElements);
    animateElements(); // Initial check
  }
}

function animateCounter(element, target) {
  const duration = 1000; // 1 second
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  
  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// ========== TOUCH EVENTS ==========
function initTouchEvents() {
  // Prevent zoom on double-tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
  
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

// ========== REAL-TIME DATA ==========
function initRealTimeData() {
  // This would connect to your API or blockchain to get real-time data
  // For now, we'll simulate with static data
  
  // Update verification status
  updateVerificationStatus();
  
  // Start periodic updates
  setInterval(updateVerificationStatus, 30000); // Update every 30 seconds
}

function updateVerificationStatus() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  // Update status indicators
  const statusElements = document.querySelectorAll('.status-indicator');
  statusElements.forEach(el => {
    el.innerHTML = `<i class="fas fa-circle" style="color: #4CAF50; font-size: 0.8em;"></i> Verified ${timeString}`;
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

// ========== GLOBAL EXPORTS ==========
window.copyContract = copyContract;
window.addToWallet = addToWallet;
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
    
    .principle-card.expanded {
      transform: scale(1.02) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
});

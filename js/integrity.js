/// integrity.js - Integrity page functionality matching epoch-rewards structure

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initIntegrityPage, 300);
});

function initIntegrityPage() {
  console.log('Initializing Integrity page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize security data
  initSecurityData();
  
  // Initialize animations
  initScrollAnimations();
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
    
  } catch (error) {
    console.error('Error updating holder count:', error);
  }
}

function updateVerificationTimestamps() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const dateString = now.toLocaleDateString();
  
  // You can add timestamp elements to your HTML if needed
  const timestampElements = document.querySelectorAll('.update-time');
  if (timestampElements.length > 0) {
    timestampElements.forEach(el => {
      el.textContent = `Updated: ${timeString}`;
    });
  }
}

// ========== CONTRACT FUNCTIONS ==========
function initCopyContract() {
  console.log('Contract copy functionality initialized');
}

function copyContract() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;
  
  navigator.clipboard.writeText(contractAddress).then(() => {
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#4CAF50';
    
    showToast('Contract address copied to clipboard!', 'success');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
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
  
  // Provide instructions
  const instructions = `To add $REBL to your wallet:
1. Open your wallet (Phantom, Solflare, etc.)
2. Click "Add Token" or "Import Token"
3. Paste this address: ${contractAddress}
4. Confirm addition`;

  alert(instructions);
  
  setTimeout(() => {
    button.innerHTML = originalHTML;
  }, 2000);
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const cards = document.querySelectorAll('.takeaway-item, .security-card, .checklist-item, .audit-card, .faq-item, .related-card');
  
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
        }, index * 50);
      }
    });
  }
  
  window.addEventListener('scroll', animateCards);
  animateCards(); // Initial check
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
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
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
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toast animation styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
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
document.head.appendChild(toastStyle);

// ========== GLOBAL EXPORTS ==========
window.copyContract = copyContract;
window.addToWallet = addToWallet;
window.initializeMobileDropdown = initializeMobileDropdown;

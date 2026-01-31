// integrity.js - Minimal functionality

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initIntegrityPage, 300);
});

function initIntegrityPage() {
  console.log('Integrity page initialized');
  
  // Initialize contract copy functionality
  initContractFunctions();
  
  // Initialize security status
  initSecurityStatus();
}

function initContractFunctions() {
  console.log('Contract functions initialized');
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
    console.error('Failed to copy:', err);
    button.innerHTML = '<i class="fas fa-times"></i> Failed';
    button.style.background = '#f44336';
    showToast('Failed to copy. Please try again.', 'error');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
    }, 2000);
  });
}

function initSecurityStatus() {
  // Fetch holder count from API
  fetchHolderCount();
  
  // Update timestamps
  updateTimestamps();
}

function fetchHolderCount() {
  // In a real implementation, fetch from API
  // For now, use static data
  const holderCount = 67;
  const holderElements = document.querySelectorAll('#holder-count, #solscan-holders');
  
  holderElements.forEach(el => {
    if (el) el.textContent = holderCount;
  });
}

function updateTimestamps() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  document.querySelectorAll('.update-time').forEach(el => {
    if (el.textContent.includes('Updated:')) {
      el.textContent = `Updated: ${timeString}`;
    }
  });
}

function showToast(message, type = 'info') {
  // Create simple toast
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    font-weight: 600;
    z-index: 9999;
    animation: slideUp 0.3s ease;
  `;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement('style');
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

// Make functions global
window.copyContract = copyContract;

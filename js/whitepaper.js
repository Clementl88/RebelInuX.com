/// whitepaper.js - Whitepaper page functionality

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initWhitepaperPage, 300);
});

function initWhitepaperPage() {
  console.log('Initializing Whitepaper page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize download tracking
  initDownloadTracking();
  
  // Initialize AOS animations
  initAOS();
  
  // Initialize touch events
  initTouchEvents();
  
  // Initialize print functionality
  initPrintFunctionality();
}

function initDownloadTracking() {
  // Track download button clicks
  const downloadButtons = document.querySelectorAll('.download-button');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (this.href && this.href.includes('.pdf')) {
        trackDownload('whitepaper_pdf');
      }
    });
  });
}

function trackDownload(type) {
  // In a real implementation, you would send this to analytics
  console.log(`Download tracked: ${type}`);
  
  // Show download confirmation
  if (type === 'whitepaper_pdf') {
    showToast('Starting download...', 'info');
  }
}

function initPrintFunctionality() {
  // Add print event to print button
  const printButton = document.querySelector('.option-button');
  if (printButton && printButton.textContent.includes('Print')) {
    printButton.addEventListener('click', printWhitepaper);
  }
}

function printWhitepaper() {
  showToast('Opening print dialog...', 'info');
  
  // Create print iframe
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = 'https://rebelinux.fun/RebelInuX_White_Paper.pdf';
  document.body.appendChild(iframe);
  
  // Wait for iframe to load, then print
  iframe.onload = function() {
    setTimeout(() => {
      iframe.contentWindow.print();
      // Remove iframe after print dialog closes
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 1000);
  };
}

function showMobileWarning() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const message = `For best experience on mobile:
1. Tap and hold the download link
2. Select "Download" or "Save link"
3. Open with your preferred PDF reader
    
Or use the "View in Browser" option for instant viewing.`;
    
    showToast('Mobile instructions shown', 'info');
    setTimeout(() => {
      alert(message);
    }, 100);
  } else {
    showToast('You are on desktop. Direct download should work fine.', 'info');
  }
}

function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.innerWidth < 768 ? 'mobile' : false
    });
    
    window.addEventListener('resize', function() {
      AOS.refresh();
    });
  }
}

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
  
  // Add touch feedback
  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    });
    
    element.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    });
  });
}

// Toast notification function
function showToast(message, type = 'info') {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
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
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Global exports
window.printWhitepaper = printWhitepaper;
window.showMobileWarning = showMobileWarning;
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
  `;
  document.head.appendChild(style);
});

// whitepaper.js - Whitepaper download page functionality

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initWhitepaperPage, 300);
});

function initWhitepaperPage() {
  console.log('Initializing Whitepaper page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize download functionality
  initDownloadFunctionality();
  
  // Initialize AOS animations
  initAOS();
  
  // Initialize touch events
  initTouchEvents();
  
  // Initialize file size display
  updateFileSizeDisplay();
}

function initDownloadFunctionality() {
  // Add click handlers to all download buttons
  const downloadButtons = document.querySelectorAll('.download-btn, .doc-btn');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (!this.classList.contains('download-btn')) return;
      
      // Add loading state
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
      this.disabled = true;
      
      // Simulate download delay
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
        trackDownload('whitepaper_pdf');
        showDownloadSuccess();
      }, 1500);
    });
  });
}

function updateFileSizeDisplay() {
  // Update all file size displays
  const fileSizeElements = document.querySelectorAll('.info-value');
  fileSizeElements.forEach(el => {
    if (el.textContent.includes('MB') || el.textContent.includes('KB')) {
      // You could fetch actual file size here
      el.textContent = '2.4 MB';
    }
  });
}

// Global functions for HTML onclick handlers
function downloadWhitepaper() {
  const button = document.querySelector('.download-btn');
  if (button) button.click();
}

function viewWhitepaperOnline() {
  const url = 'https://docs.google.com/viewer?url=https://rebelinux.fun/RebelInuX_White_Paper.pdf';
  window.open(url, '_blank', 'noopener,noreferrer');
  
  // Track view action
  trackDownload('whitepaper_view_online');
  showToast('Opening whitepaper in new tab...', 'info');
}

function downloadFormat(format) {
  let message = '';
  switch(format) {
    case 'epub':
      message = 'EPUB format will be available soon. For now, please use the PDF version.';
      break;
    case 'txt':
      message = 'Text format will be available soon. For now, please use the PDF version.';
      break;
    case 'mobi':
      message = 'MOBI format will be available soon. For now, please use the PDF version.';
      break;
    default:
      message = 'Alternative format coming soon. Please use the PDF version.';
  }
  
  showToast(message, 'warning');
  trackDownload(`whitepaper_${format}_request`);
}

function downloadDocument(type) {
  let message = '';
  let fileName = '';
  
  switch(type) {
    case 'tokenomics':
      message = 'Tokenomics document download will be available soon.';
      fileName = 'RebelInuX_Tokenomics.pdf';
      break;
    case 'audit':
      message = 'Security audit report download will be available soon.';
      fileName = 'RebelInuX_Security_Audit.pdf';
      break;
    case 'roadmap':
      message = 'Technical roadmap download will be available soon.';
      fileName = 'RebelInuX_Roadmap.pdf';
      break;
    default:
      message = 'Document download will be available soon.';
      fileName = 'RebelInuX_Document.pdf';
  }
  
  // Create a temporary download simulation
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = 'data:application/pdf;base64,'; // Empty PDF
  link.download = fileName;
  document.body.appendChild(link);
  
  showToast(`${message} Simulating download...`, 'info');
  
  setTimeout(() => {
    link.click();
    document.body.removeChild(link);
    trackDownload(`document_${type}`);
  }, 500);
}

function trackDownload(type) {
  // In a real implementation, you would send this to analytics
  console.log(`Download tracked: ${type} - ${new Date().toISOString()}`);
  
  // Store in localStorage for session tracking
  const downloads = JSON.parse(localStorage.getItem('rebelinux_downloads') || '[]');
  downloads.push({
    type: type,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
  localStorage.setItem('rebelinux_downloads', JSON.stringify(downloads));
}

function showDownloadSuccess() {
  showToast('✅ Whitepaper download started!', 'success');
  
  // Show additional info after download
  setTimeout(() => {
    const info = `📄 Download Tips:
• Save the PDF to your preferred location
• Open with Adobe Reader or any PDF viewer
• Recommended: Create a backup copy
• Share with interested community members`;
    
    showToast('Check your downloads folder', 'info');
    
    // Show more detailed info in console
    console.info('%c📥 Whitepaper Download Complete!', 'color: #4CAF50; font-weight: bold;');
    console.info(info);
  }, 1000);
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
    
    element.addEventListener('touchcancel', function() {
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
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 
                     type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : 
                type === 'warning' ? '#FF9800' : '#2196F3'};
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
    white-space: normal;
    text-align: center;
    line-height: 1.4;
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
  
  // Auto-remove after 4 seconds (longer for mobile)
  const duration = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 5000 : 4000;
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// Global exports
window.downloadWhitepaper = downloadWhitepaper;
window.viewWhitepaperOnline = viewWhitepaperOnline;
window.downloadFormat = downloadFormat;
window.downloadDocument = downloadDocument;
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
    
    .download-btn:disabled,
    .doc-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    .download-card {
      animation: pulse 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
  
  // Add download success animation to card
  setTimeout(() => {
    const downloadCard = document.querySelector('.download-card');
    if (downloadCard) {
      downloadCard.style.animation = 'none';
    }
  }, 2000);
});

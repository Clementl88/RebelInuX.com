// legal.js - Legal pages specific functionality (Privacy Policy, Terms of Service, Disclaimer)

// ===== INITIALIZATION - Wait for components to be ready =====
function waitForComponents(callback, maxAttempts = 20) {
  let attempts = 0;
  
  const checkInterval = setInterval(function() {
    attempts++;
    
    // Check if components are loaded AND common.js functions are available
    if (window.componentsLoaded && typeof window.setupMobileNavigation === 'function') {
      clearInterval(checkInterval);
      console.log('✅ Components ready, initializing legal page');
      callback();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      console.warn('⚠️ Components not ready after timeout, forcing initialization');
      // Force initialization anyway
      if (typeof window.initializeComponents === 'function') {
        window.initializeComponents();
      }
      callback();
    } else {
      console.log(`⏳ Waiting for components... (${attempts}/${maxAttempts})`);
    }
  }, 100);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Legal page DOM ready');
  waitForComponents(function() {
    setTimeout(initLegalPage, 200);
  });
});

// ===== MAIN INITIALIZATION =====
function initLegalPage() {
  console.log('⚖️ Initializing Legal page');
  
  // Make sure mobile navigation is set up
  if (typeof window.setupMobileNavigation === 'function') {
    window.setupMobileNavigation();
  }
  
  // Make sure dropdowns are set up
  if (typeof window.setupDropdowns === 'function') {
    window.setupDropdowns();
  }
  
  // Initialize legal-specific components
  initLegalComponents();
  
  // Initialize AOS with delay
  initAOSWithDelay();
  
  // Set active state for legal links in footer if needed
  highlightCurrentLegalPage();
}

// ===== LEGAL COMPONENTS =====
function initLegalComponents() {
  console.log('📋 Legal components initialized');
  
  // Initialize any interactive elements
  initCopyButtons();
  initDisclaimerCheckboxes();
  initCookiePreferences();
  initPrintButton();
}

// ===== COPY CONTRACT FUNCTIONALITY =====
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-mini-btn, .copy-contract-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Find the contract code element
      const contractElement = this.closest('.contract-address-box')?.querySelector('code') || 
                             document.getElementById('contract-address');
      
      if (contractElement) {
        const contractAddress = contractElement.textContent.trim();
        
        navigator.clipboard.writeText(contractAddress).then(() => {
          const originalHTML = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i>';
          this.style.background = '#4CAF50';
          
          showLegalToast('Contract address copied! Always verify before transacting.', 'success');
          
          setTimeout(() => {
            this.innerHTML = originalHTML;
            this.style.background = '';
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
          showLegalToast('Failed to copy. Please try again.', 'error');
        });
      }
    });
  });
}

// ===== DISCLAIMER CHECKBOXES =====
function initDisclaimerCheckboxes() {
  // This is for visual effect only - the checkboxes are disabled and checked by default
  const checkboxes = document.querySelectorAll('.ack-statement input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function(e) {
      e.preventDefault();
      // Keep them checked - this is for acknowledgment display only
      this.checked = true;
    });
  });
}

// ===== COOKIE PREFERENCES (Demo) =====
function initCookiePreferences() {
  const cookieSettingsLink = document.querySelector('a[href="#cookie-settings"]');
  
  if (cookieSettingsLink) {
    cookieSettingsLink.addEventListener('click', function(e) {
      e.preventDefault();
      showCookiePreferences();
    });
  }
}

function showCookiePreferences() {
  // Simple modal for cookie preferences
  const modal = document.createElement('div');
  modal.className = 'legal-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  
  modal.innerHTML = `
    <div style="background: var(--dark-bg); padding: var(--spacing-xl); border-radius: var(--border-radius); 
                border: 2px solid var(--rebel-gold); max-width: 500px; width: 90%;">
      <h3 style="color: var(--rebel-gold); margin-bottom: var(--spacing-lg); display: flex; align-items: center; gap: 0.5rem;">
        <i class="fas fa-cookie-bite"></i> Cookie Preferences
      </h3>
      
      <div style="margin-bottom: var(--spacing-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
          <div>
            <strong style="color: white;">Essential Cookies</strong>
            <p style="color: rgba(255,255,255,0.7); font-size: 0.85rem; margin: 0;">Required for site functionality</p>
          </div>
          <span style="background: rgba(76,175,80,0.2); color: #4CAF50; padding: 0.2rem 0.8rem; border-radius: 12px; font-size: 0.8rem;">Always On</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
          <div>
            <strong style="color: white;">Analytics Cookies</strong>
            <p style="color: rgba(255,255,255,0.7); font-size: 0.85rem; margin: 0;">Anonymous usage data</p>
          </div>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="color: white;">Opt-out</span>
            <input type="checkbox" id="analytics-opt-out" style="accent-color: var(--rebel-gold); width: 18px; height: 18px;">
          </label>
        </div>
      </div>
      
      <div style="display: flex; gap: var(--spacing-md); justify-content: flex-end;">
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 25px; 
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600;">
          Cancel
        </button>
        <button onclick="saveCookiePreferences()" 
                style="background: var(--rebel-gold); color: var(--dark-bg); border: none; border-radius: 25px; 
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600;">
          Save Preferences
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on background click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Save cookie preferences (simulated)
window.saveCookiePreferences = function() {
  const analyticsOptOut = document.getElementById('analytics-opt-out')?.checked;
  
  if (analyticsOptOut) {
    // In a real implementation, you would set a cookie or localStorage
    localStorage.setItem('rebelinux_analytics_opt_out', 'true');
    showLegalToast('Analytics cookies disabled', 'success');
  } else {
    localStorage.removeItem('rebelinux_analytics_opt_out');
    showLegalToast('Preferences saved', 'success');
  }
  
  // Close modal
  const modal = document.querySelector('[style*="position: fixed"]');
  if (modal) modal.remove();
};

// ===== PRINT FUNCTIONALITY =====
function initPrintButton() {
  // Add print button to legal pages if not present
  const legalHeader = document.querySelector('.legal-header');
  
  if (legalHeader && !document.querySelector('.print-button')) {
    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print';
    printButton.style.cssText = `
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 25px;
      padding: 0.5rem 1rem;
      margin-left: auto;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
    `;
    
    printButton.addEventListener('click', function() {
      window.print();
    });
    
    legalHeader.appendChild(printButton);
  }
}

// ===== HIGHLIGHT CURRENT PAGE =====
function highlightCurrentLegalPage() {
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Find all related page links in footer and highlight the current one
  const relatedLinks = document.querySelectorAll('.related-card');
  
  relatedLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      // Add active state
      link.style.borderColor = 'var(--rebel-gold)';
      link.style.boxShadow = '0 0 15px rgba(255, 204, 0, 0.3)';
      
      // Disable click on current page
      link.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
  });
}

// ===== TOAST NOTIFICATION =====
function showLegalToast(message, type = 'info') {
  // Remove existing toasts
  const existingToast = document.querySelector('.legal-toast');
  if (existingToast) existingToast.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `legal-toast legal-toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

// ===== AOS INITIALIZATION =====
function initAOSWithDelay() {
  // Check if AOS is available
  if (typeof AOS !== 'undefined') {
    // Delay to ensure menu is fully initialized
    setTimeout(function() {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
      console.log('✅ AOS initialized with delay');
    }, 200);
  } else {
    // If AOS not loaded yet, wait for it
    console.log('⏳ Waiting for AOS to load...');
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkAOS = setInterval(function() {
      attempts++;
      if (typeof AOS !== 'undefined') {
        clearInterval(checkAOS);
        setTimeout(function() {
          AOS.init({
            duration: 800,
            once: true,
            offset: 100
          });
          console.log('✅ AOS initialized after loading');
        }, 200);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkAOS);
        console.warn('⚠️ AOS failed to load');
      }
    }, 100);
  }
}

// ===== ANIMATION STYLES =====
const legalToastStyle = document.createElement('style');
legalToastStyle.textContent = `
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
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .legal-modal {
    animation: fadeIn 0.3s ease;
  }
  
  @media print {
    .page-hero,
    .legal-disclaimer-banner,
    .critical-warning-banner,
    .key-takeaways,
    .hero-buttons,
    .back-to-top,
    .loader,
    #header-container,
    #footer-container,
    .related-pages,
    #related-pages,
    .print-button,
    .copy-mini-btn,
    .verification-links,
    .function-buttons {
      display: none !important;
    }
    
    body, html {
      background: white;
      color: black;
    }
    
    .legal-card {
      border: none;
      background: white;
      color: black;
    }
    
    .legal-card h2,
    .legal-card h3,
    .legal-card h4 {
      color: black !important;
    }
    
    .legal-card p,
    .legal-card li {
      color: black !important;
    }
    
    .section-number {
      background: #ccc;
      color: black;
    }
  }
`;
document.head.appendChild(legalToastStyle);

// ===== GLOBAL EXPORTS =====
window.initLegalPage = initLegalPage;
window.showLegalToast = showLegalToast;
window.saveCookiePreferences = window.saveCookiePreferences;

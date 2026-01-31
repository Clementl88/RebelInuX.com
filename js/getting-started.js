/// ===== GETTING STARTED PAGE JAVASCRIPT =====
// Wallet Setup Guide

document.addEventListener('DOMContentLoaded', function() {
  console.log('📱 RebelInuX Wallet Guide Initializing...');
  
  // Initialize after common components are loaded
  setTimeout(() => {
    initGettingStartedPage();
  }, 300);
});

function initGettingStartedPage() {
  console.log('🎓 Initializing Wallet Guide features');
  
  // Initialize components
  initFAQAccordion();
  initCopyButtons();
  initSecurityChecklist();
  initScrollAnimations();
  
  // Add specific functionality for this page
  initPageSpecificFeatures();
}

// FAQ Accordion
function initFAQAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const answer = this.nextElementSibling;
      
      // Close all other FAQs
      faqQuestions.forEach(q => {
        if (q !== this) {
          q.setAttribute('aria-expanded', 'false');
          q.nextElementSibling.style.maxHeight = null;
        }
      });
      
      // Toggle current FAQ
      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        this.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
  
  // Open first FAQ by default
  if (faqQuestions.length > 0) {
    faqQuestions[0].click();
  }
}

// Copy Buttons
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copyable, .copy-small, .copy-config-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async function(e) {
      // For copyable code elements
      if (this.classList.contains('copyable')) {
        const text = this.textContent.trim();
        await copyToClipboard(text);
        showCopyFeedback(this, true);
      }
      
      // For copy small buttons
      if (this.classList.contains('copy-small')) {
        const codeElement = this.previousElementSibling;
        if (codeElement && codeElement.tagName === 'CODE') {
          const text = codeElement.textContent.trim();
          await copyToClipboard(text);
          showCopyFeedback(this, true);
        }
      }
    });
  });
}

// Copy Base Network Configuration
function copyBaseConfig() {
  const config = `Network Name: Base Mainnet
RPC URL: https://mainnet.base.org
Chain ID: 8453
Currency Symbol: ETH
Block Explorer: https://basescan.org`;
  
  copyToClipboard(config)
    .then(() => {
      showNotification('Base network configuration copied!', 'success');
    })
    .catch(() => {
      showNotification('Failed to copy configuration', 'error');
    });
}

// Security Checklist
function initSecurityChecklist() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const item = this.closest('.checklist-item');
      
      if (this.checked) {
        item.style.background = 'rgba(76, 175, 80, 0.1)';
        item.style.borderColor = '#4CAF50';
      } else {
        item.style.background = '';
        item.style.borderColor = '';
      }
      
      // Check if all are checked
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      if (allChecked) {
        showNotification('🎉 All security steps completed! You\'re ready to go!', 'success');
      }
    });
  });
}

// Page-specific animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.setup-step, .security-card, .next-step');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// Page-specific features
function initPageSpecificFeatures() {
  // Highlight current section in navigation
  const sections = document.querySelectorAll('section[id]');
  const navButtons = document.querySelectorAll('.nav-button');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navButtons.forEach(button => {
          if (button.getAttribute('href') === `#${id}`) {
            button.style.background = 'rgba(212, 167, 106, 0.3)';
            button.style.borderColor = 'var(--rebel-gold)';
          } else {
            button.style.background = '';
            button.style.borderColor = '';
          }
        });
      }
    });
  }, {
    threshold: 0.3
  });
  
  sections.forEach(section => observer.observe(section));
  
  // Auto-check first checklist item (recovery phrase written)
  const firstCheckbox = document.getElementById('check1');
  if (firstCheckbox) {
    setTimeout(() => {
      firstCheckbox.checked = true;
      firstCheckbox.dispatchEvent(new Event('change'));
    }, 1000);
  }
}

// Helper function to copy to clipboard
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Show copy feedback
function showCopyFeedback(element, success) {
  const originalText = element.innerHTML;
  const originalBackground = element.style.background;
  
  if (success) {
    element.innerHTML = '<i class="fas fa-check"></i> Copied!';
    element.style.background = '#4CAF50';
    element.style.color = 'white';
  } else {
    element.innerHTML = '<i class="fas fa-times"></i> Failed';
    element.style.background = '#f44336';
    element.style.color = 'white';
  }
  
  setTimeout(() => {
    element.innerHTML = originalText;
    element.style.background = originalBackground;
    element.style.color = '';
  }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  notification.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 
                 type === 'error' ? 'rgba(244, 67, 54, 0.95)' : 
                 'rgba(33, 150, 243, 0.95)'};
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
    max-width: min(350px, calc(100vw - 40px));
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add CSS for notifications if not present
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Export functions for global access
window.WalletGuide = {
  initGettingStartedPage,
  copyBaseConfig,
  showNotification
};

// Initialize when page is fully loaded
window.addEventListener('load', function() {
  console.log('✅ RebelInuX Wallet Guide Page Loaded');
  
  // Dispatch custom event
  document.dispatchEvent(new CustomEvent('rebelinux:walletGuideReady', {
    detail: {
      timestamp: Date.now()
    }
  }));
});

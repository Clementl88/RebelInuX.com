// ===== INDEX PAGE ENHANCED JAVASCRIPT =====
// Professional Crypto Project - Mobile Optimized

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 RebelInuX Index Page Initializing...');
  
  // Initialize after common components are loaded
  setTimeout(() => {
    initIndexPage();
    initPerformanceMonitoring();
  }, 300);
});

// Performance monitoring
function initPerformanceMonitoring() {
  if (window.performance) {
    const perfData = window.performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`📊 Page loaded in ${loadTime}ms`);
    
    // Report to analytics if needed
    if (loadTime > 3000) {
      console.warn('⚠️ Page load time is slow, consider optimization');
    }
  }
}

// Main initialization
function initIndexPage() {
  console.log('✨ Initializing enhanced Index page features');
  
  // Initialize components in order of priority
  const initQueue = [
    initLoader,
    initScrollAnimations,
    initStatsCounters,
    initCopyButtons,
    initContractViews,
    initSmoothScroll,
    initParticles,
    initLogoAnimations,
    initBackToTop,
    initMobileOptimizations,
    initTouchInteractions,
    initLazyLoading,
    initPerformanceObservers
  ];
  
  // Execute initialization queue
  initQueue.forEach((initFn, index) => {
    setTimeout(() => {
      try {
        initFn();
      } catch (error) {
        console.warn(`⚠️ Failed to initialize ${initFn.name}:`, error);
      }
    }, index * 100);
  });
}

// Enhanced Loader with Progress
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  // Simulate loading progress
  const progressBar = loader.querySelector('.progress-bar');
  if (progressBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      progressBar.style.width = Math.min(progress, 100) + '%';
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('loaded');
          document.body.classList.add('loaded');
          
          // Dispatch custom event
          document.dispatchEvent(new CustomEvent('pageLoaded', {
            detail: { timestamp: Date.now() }
          }));
        }, 500);
      }
    }, 100);
  } else {
    // Fallback if no progress bar
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.add('loaded');
    }, 1500);
  }
}

// Enhanced Scroll Animations with Intersection Observer
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.value-card, .comparison-card, .step-card, .stat-card, ' +
    '.token-card, .logo-card, .key-takeaway, .contract-emphasis, ' +
    '.feature-card, .process-step, .chain-node'
  );
  
  // Create observer with performance optimization
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animations for better visual effect
        setTimeout(() => {
          entry.target.classList.add('fade-in');
          
          // Add specific animations based on element position
          const rect = entry.target.getBoundingClientRect();
          if (rect.left < window.innerWidth / 2) {
            entry.target.classList.add('slide-in-left');
          } else {
            entry.target.classList.add('slide-in-right');
          }
        }, index * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  // Observe all elements
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
  });
  
  // Floating logo mouse interaction
  const floatingLogo = document.querySelector('.logo-3d');
  if (floatingLogo && !isMobile()) {
    let mouseX = 0;
    let mouseY = 0;
    let logoX = 0;
    let logoY = 0;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 25;
      mouseY = (e.clientY - window.innerHeight / 2) / 25;
    });
    
    function animateLogo() {
      // Smooth interpolation for better performance
      logoX += (mouseX - logoX) * 0.1;
      logoY += (mouseY - logoY) * 0.1;
      
      floatingLogo.style.transform = 
        `translateY(-20px) rotateY(${logoX}deg) rotateX(${logoY}deg)`;
      
      requestAnimationFrame(animateLogo);
    }
    
    animateLogo();
  }
}

// Advanced Stats Counters with Number Formatting
function initStatsCounters() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  if (statValues.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        const statElement = entry.target;
        const targetValue = parseFloat(statElement.getAttribute('data-target'));
        const prefix = statElement.getAttribute('data-prefix') || '';
        const suffix = statElement.getAttribute('data-suffix') || '';
        
        animateCounter(statElement, targetValue, prefix, suffix);
        statElement.classList.add('animated');
        observer.unobserve(statElement);
      }
    });
  }, { 
    threshold: 0.5,
    rootMargin: '100px' 
  });
  
  statValues.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target, prefix = '', suffix = '') {
  const duration = 2000;
  const startTime = performance.now();
  const startValue = parseFloat(element.textContent) || 0;
  
  // Format number based on size
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.round(num).toString();
  };
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic for smooth animation
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = startValue + (target - startValue) * easeProgress;
    
    element.textContent = prefix + formatNumber(current) + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = prefix + formatNumber(target) + suffix;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Enhanced Copy to Clipboard with Feedback
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn, .copy-contract-btn, [onclick*="copyToClipboard"]');
  
  copyButtons.forEach(button => {
    // Remove inline onclick if present
    if (button.hasAttribute('onclick')) {
      const onclick = button.getAttribute('onclick');
      button.removeAttribute('onclick');
      
      if (onclick.includes('copyToClipboard')) {
        button.addEventListener('click', handleCopyClick);
      }
    } else {
      button.addEventListener('click', handleCopyClick);
    }
  });
  
  function handleCopyClick(e) {
    e.preventDefault();
    
    let contractText = '';
    const button = e.currentTarget;
    
    if (button.classList.contains('copy-contract-btn')) {
      contractText = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    } else {
      const contract = button.getAttribute('data-contract');
      if (contract) {
        contractText = contract;
      } else {
        const codeElement = button.closest('.contract-address')?.querySelector('code');
        if (codeElement) {
          contractText = codeElement.getAttribute('data-full') || codeElement.textContent;
        }
      }
    }
    
    if (contractText) {
      copyToClipboard(contractText.trim())
        .then(() => showCopyFeedback(button, true))
        .catch(() => showCopyFeedback(button, false));
    }
  }
}

// Modern clipboard API with fallback
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    throw err;
  }
}

function showCopyFeedback(button, success) {
  const originalHTML = button.innerHTML;
  const originalBackground = button.style.background;
  const originalColor = button.style.color;
  
  if (success) {
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    
    // Show toast notification
    showNotification('Contract address copied to clipboard!', 'success');
  } else {
    button.innerHTML = '<i class="fas fa-times"></i> Failed';
    button.style.background = '#f44336';
    button.style.color = 'white';
    
    showNotification('Failed to copy address', 'error');
  }
  
  // Reset button after 2 seconds
  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.style.background = originalBackground;
    button.style.color = originalColor;
  }, 2000);
}

// Contract View Toggle
function initContractViews() {
  const viewButtons = document.querySelectorAll('.view-btn');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const contractAddress = this.closest('.contract-address');
      const codeElement = contractAddress?.querySelector('code');
      
      if (codeElement) {
        const isExpanded = codeElement.classList.toggle('expanded');
        const icon = this.querySelector('i');
        
        if (isExpanded) {
          icon.className = 'fas fa-compress-alt';
          this.setAttribute('title', 'Collapse address');
        } else {
          icon.className = 'fas fa-expand-alt';
          this.setAttribute('title', 'Expand address');
        }
      }
    });
  });
}

// Enhanced Smooth Scroll with offset
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || !href.startsWith('#') || !document.querySelector(href)) {
        return;
      }
      
      e.preventDefault();
      scrollToElement(href);
    });
  });
  
  // Also handle programmatic scrolling
  window.scrollToElement = function(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = targetPosition - headerHeight - 20;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Update URL without scrolling
    if (selector !== '#') {
      history.pushState(null, null, selector);
    }
  };
}

// Particle Background with Performance Optimization
function initParticles() {
  const heroSection = document.querySelector('.page-hero--main');
  if (!heroSection || document.querySelector('.particle')) return;
  
  // Only create particles on desktop for performance
  if (isMobile()) return;
  
  const particleContainer = heroSection.querySelector('.hero-particles');
  if (!particleContainer) return;
  
  const particleCount = Math.min(30, Math.floor(window.innerWidth / 30));
  
  for (let i = 0; i < particleCount; i++) {
    createParticle(particleContainer);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 4 + 1;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * duration;
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.1});
    border-radius: 50%;
    top: ${Math.random() * 100}%;
    left: ${Math.random() * 100}%;
    animation: float-particle ${duration}s linear ${delay}s infinite;
    z-index: 1;
    pointer-events: none;
  `;
  
  container.appendChild(particle);
}

// Add CSS for particles if not already present
if (!document.querySelector('#particle-styles')) {
  const style = document.createElement('style');
  style.id = 'particle-styles';
  style.textContent = `
    @keyframes float-particle {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(${Math.random() * -300 - 100}px) translateX(${Math.random() * 200 - 100}px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Logo Animations
function initLogoAnimations() {
  const logoCards = document.querySelectorAll('.logo-card');
  
  logoCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
  function toggleBackToTop() {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop(); // Initial check
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Mobile Optimizations
function initMobileOptimizations() {
  if (!isMobile()) return;
  
  // Optimize animations for mobile
  document.documentElement.style.setProperty('--animation-medium', '0.4s');
  document.documentElement.style.setProperty('--animation-slow', '0.6s');
  
  // Reduce particle count
  const particles = document.querySelectorAll('.particle');
  if (particles.length > 10) {
    for (let i = 10; i < particles.length; i++) {
      particles[i].remove();
    }
  }
  
  // Optimize image loading
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    if (isInViewport(img)) {
      img.loading = 'eager';
    }
  });
}

// Touch Interactions
function initTouchInteractions() {
  if (!isMobile()) return;
  
  // Add touch feedback to interactive elements
  const touchElements = document.querySelectorAll('button, a, .token-card, .value-card');
  
  touchElements.forEach(el => {
    el.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    }, { passive: true });
    
    el.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    }, { passive: true });
  });
}

// Lazy Loading Enhancement
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// Performance Observers
function initPerformanceObservers() {
  // Observe long tasks
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.log(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }
  
  // Observe layout shifts
  if ('LayoutShiftObserver' in window) {
    let cls = 0;
    new LayoutShiftObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
          console.log(`⚠️ Layout shift detected: ${entry.value.toFixed(3)}`);
        }
      });
    });
  }
}

// Utility Functions
function isMobile() {
  return window.innerWidth <= 768 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };
  
  notification.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <span>${message}</span>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 
                 type === 'error' ? 'rgba(244, 67, 54, 0.95)' : 
                 type === 'warning' ? 'rgba(255, 193, 7, 0.95)' : 
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
    border: 1px solid rgba(255,255,255,0.1);
    max-width: min(350px, calc(100vw - 40px));
    pointer-events: none;
  `;
  
  // Add keyframes if not present
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
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Add to Wallet Function
function addToWallet(contractAddress) {
  if (typeof window.ethereum !== 'undefined') {
    // Ethereum wallet
    try {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: contractAddress,
            symbol: 'REBL',
            decimals: 9
          }
        }
      }).then(success => {
        if (success) {
          showNotification('Token added to wallet successfully!', 'success');
        } else {
          showNotification('Failed to add token to wallet', 'error');
        }
      }).catch(error => {
        console.error('Error adding token:', error);
        showNotification('Error adding token to wallet', 'error');
      });
    } catch (error) {
      showNotification('Please install a Web3 wallet', 'warning');
    }
  } else if (window.solana || window.phantom?.solana) {
    // Solana wallet
    showNotification('For Solana tokens, please add manually using contract address', 'info');
    copyToClipboard(contractAddress)
      .then(() => showNotification('Contract address copied for manual addition', 'success'));
  } else {
    showNotification('Please install a cryptocurrency wallet', 'warning');
  }
}

// Export functions for global access
window.RebelInuX = {
  initIndexPage,
  copyToClipboard,
  addToWallet,
  showNotification,
  scrollToElement: window.scrollToElement
};

// Initialize when page is fully loaded
window.addEventListener('load', function() {
  // Set loaded state
  document.documentElement.classList.add('page-loaded');
  
  // Dispatch custom event
  const event = new CustomEvent('rebelinux:pageReady', {
    detail: {
      timestamp: Date.now(),
      page: 'index'
    }
  });
  document.dispatchEvent(event);
  
  // Log initialization complete
  console.log('✅ RebelInuX Index Page Initialized Successfully');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    // Page became visible again
    console.log('📱 Page became visible');
  }
});

// Error handling
window.addEventListener('error', function(e) {
  console.error('❌ Unhandled error:', e.error);
  
  // Report to analytics if available
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: e.error.message,
      fatal: true
    });
  }
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', function(e) {
  console.error('❌ Unhandled promise rejection:', e.reason);
});

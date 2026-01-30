//// ===== INDEX PAGE ENHANCED JAVASCRIPT =====
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
// In your copyToClipboard handlers, add this for Solana-specific handling
function handleCopyClick(e) {
  e.preventDefault();
  
  let contractText = '';
  const button = e.currentTarget;
  
  if (button.classList.contains('copy-contract-btn')) {
    // This is the $REBL (Solana) contract
    contractText = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  } else if (button.closest('.contract-address')) {
    // Check if it's a Solana or Ethereum address
    const codeElement = button.closest('.contract-address')?.querySelector('code');
    if (codeElement) {
      contractText = codeElement.getAttribute('data-full') || codeElement.textContent;
      
      // Add token type info to notification
      const isSolana = contractText.length > 32;
      const tokenType = isSolana ? 'Solana ($REBL)' : 'Base ($rebelinux)';
      
      copyToClipboard(contractText.trim())
        .then(() => {
          showNotification(`${tokenType} address copied!`, 'success');
          showCopyFeedback(button, true);
        })
        .catch(() => {
          showNotification('Failed to copy address', 'error');
          showCopyFeedback(button, false);
        });
      return;
    }
  }
  
  // Fallback for other cases
  if (contractText) {
    copyToClipboard(contractText.trim())
      .then(() => showCopyFeedback(button, true))
      .catch(() => showCopyFeedback(button, false));
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
// Enhanced mobile optimizations for token ecosystem - FIXED
function optimizeTokenEcosystemForMobile() {
  if (!isMobile()) return;
  
  const ecosystemFlow = document.querySelector('.ecosystem-flow');
  if (!ecosystemFlow) return;
  
  // Get all elements
  const basePlatform = ecosystemFlow.querySelector('.base-platform');
  const solanaPlatform = ecosystemFlow.querySelector('.solana-platform');
  const bridgeAnimation = ecosystemFlow.querySelector('.bridge-animation');
  
  if (basePlatform && solanaPlatform && bridgeAnimation) {
    // Clear current order
    ecosystemFlow.innerHTML = '';
    
    // Create a proper mobile layout
    const mobileLayout = document.createElement('div');
    mobileLayout.className = 'ecosystem-mobile-layout';
    mobileLayout.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
    `;
    
    // Add base platform
    const baseWrapper = document.createElement('div');
    baseWrapper.className = 'mobile-platform-wrapper';
    baseWrapper.appendChild(basePlatform);
    mobileLayout.appendChild(baseWrapper);
    
    // Add bridge (positioned between platforms)
    const bridgeWrapper = document.createElement('div');
    bridgeWrapper.className = 'mobile-bridge-wrapper';
    bridgeWrapper.style.cssText = `
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 1rem 0;
    `;
    
    // Transform bridge for mobile
    bridgeAnimation.classList.add('mobile-bridge');
    bridgeWrapper.appendChild(bridgeAnimation);
    mobileLayout.appendChild(bridgeWrapper);
    
    // Add solana platform
    const solanaWrapper = document.createElement('div');
    solanaWrapper.className = 'mobile-platform-wrapper';
    solanaWrapper.appendChild(solanaPlatform);
    mobileLayout.appendChild(solanaWrapper);
    
    // Add to ecosystem flow
    ecosystemFlow.appendChild(mobileLayout);
    
    // Update bridge styling for mobile
    updateBridgeForMobile(bridgeAnimation);
  }
  
  // Optimize contract addresses for mobile
  const contractCodes = document.querySelectorAll('.contract-short');
  contractCodes.forEach(code => {
    const fullText = code.getAttribute('data-full') || code.textContent;
    if (fullText.length > 20) {
      const mobileText = `${fullText.substring(0, 8)}...${fullText.substring(fullText.length - 6)}`;
      code.textContent = mobileText;
      code.setAttribute('title', 'Tap to view full address. Long press to copy.');
    }
  });
}

// Helper to update bridge for mobile
function updateBridgeForMobile(bridgeElement) {
  const bridgeLine = bridgeElement.querySelector('.bridge-line');
  const bridgeContent = bridgeElement.querySelector('.bridge-content');
  
  if (bridgeLine && bridgeContent) {
    // Change bridge line to vertical for mobile
    bridgeLine.style.cssText = `
      width: 3px;
      height: 60px;
      background: linear-gradient(to bottom, var(--rebel-gold), var(--rebel-blue));
      margin: 0 auto;
      border-radius: 3px;
    `;
    
    // Center bridge content
    bridgeContent.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50px;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      white-space: nowrap;
      z-index: 2;
    `;
    
    // Update text for mobile
    const bridgeText = bridgeContent.querySelector('span');
    if (bridgeText) {
      bridgeText.textContent = 'Cross-Chain';
    }
  }
}

// Add swipe hint for horizontal scrolling sections
function addSwipeHint() {
  const tokenSection = document.getElementById('token-ecosystem');
  if (!tokenSection || !isMobile()) return;
  
  // Check if content might overflow
  const checkOverflow = () => {
    const cards = tokenSection.querySelectorAll('.token-card, .nft-card');
    let totalWidth = 0;
    cards.forEach(card => {
      totalWidth += card.offsetWidth;
    });
    
    if (totalWidth > window.innerWidth - 40) {
      // Add swipe hint
      const hint = document.createElement('div');
      hint.className = 'swipe-hint';
      hint.innerHTML = '<i class="fas fa-arrows-alt-h"></i> <span>Swipe to view</span>';
      hint.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(212, 167, 106, 0.1);
        border-radius: 20px;
        color: var(--rebel-gold);
        font-size: 0.8rem;
        margin: 1rem auto;
        width: fit-content;
        border: 1px solid rgba(212, 167, 106, 0.2);
        animation: pulse 2s infinite;
      `;
      
      const platformHeaders = tokenSection.querySelectorAll('.platform-header');
      if (platformHeaders.length > 0) {
        platformHeaders[0].parentNode.insertBefore(hint, platformHeaders[0].nextSibling);
      }
    }
  };
  
  // Run after images load
  setTimeout(checkOverflow, 500);
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
  
  // Mobile-specific optimizations
  optimizeForMobile();
    optimizeTokenEcosystemForMobile();

}

// Add new optimization function AFTER initMobileOptimizations
function optimizeForMobile() {
  // Disable heavy animations on mobile
  if (isMobile()) {
    // Reduce floating animation intensity
    const floatingElements = document.querySelectorAll('.floating-logo, .logo-3d');
    floatingElements.forEach(el => {
      el.style.animationDuration = '4s';
    });
    
    // Simplify bridge animation
    const bridgeElements = document.querySelectorAll('.bridge-animation, .bridge-particles');
    bridgeElements.forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }
  
  // Adjust scroll animations for mobile
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '20px'
  };
  
  // Adjust touch targets for mobile
  adjustTouchTargets();
}

// Adjust touch targets for better mobile UX - ADD this new function
function adjustTouchTargets() {
  const touchElements = document.querySelectorAll('.action-btn, .copy-btn, .view-btn, .wallet-btn, .cta-button');
  
  touchElements.forEach(el => {
    // Ensure minimum touch target size
    if (el.offsetHeight < 44 || el.offsetWidth < 44) {
      const style = window.getComputedStyle(el);
      const paddingY = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
      const paddingX = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
      
      if (el.offsetHeight - paddingY < 44) {
        el.style.minHeight = '44px';
      }
      
      if (el.offsetWidth - paddingX < 44) {
        el.style.minWidth = '44px';
      }
    }
    
    // Add touch feedback
    el.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
      this.style.opacity = '0.9';
    }, { passive: true });
    
    el.addEventListener('touchend', function() {
      this.style.transform = '';
      this.style.opacity = '';
    }, { passive: true });
  });
}

// Find and UPDATE the initTouchInteractions function (around line 370-400):
function initTouchInteractions() {
  // Add long-press to copy on mobile
  if (isMobile()) {
    const contractAddresses = document.querySelectorAll('.contract-address code');
    
    contractAddresses.forEach(code => {
      let pressTimer;
      
      code.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
          const fullAddress = this.getAttribute('data-full') || this.textContent;
          copyToClipboard(fullAddress.trim())
            .then(() => showNotification('Address copied!', 'success'))
            .catch(() => showNotification('Copy failed', 'error'));
          
          // Visual feedback
          this.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
          setTimeout(() => {
            this.style.backgroundColor = '';
          }, 500);
        }, 800); // 800ms long press
      }, { passive: true });
      
      code.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
      }, { passive: true });
      
      code.addEventListener('touchmove', function() {
        clearTimeout(pressTimer);
      }, { passive: true });
    });
  }
  
  // Basic touch feedback for all touch devices
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

// Add to Wallet Function - UPDATED FOR SOLANA
// Enhanced Add Token to Wallet Function with correct decimals
function addTokenToWallet(contractAddress, symbol, decimals, network) {
  console.log(`Adding ${symbol} to wallet (${network} network, ${decimals} decimals)`);
  
  if (network === 'Solana') {
    addSolanaTokenToWallet(contractAddress, symbol);
  } else if (network === 'Base') {
    addBaseTokenToWallet(contractAddress, symbol, decimals);
  } else {
    addEthereumTokenToWallet(contractAddress, symbol, decimals, network);
  }
}

// Update the Base token function with correct decimals
function addBaseTokenToWallet(contractAddress, symbol, decimals) {
  // For $rebelinux, decimals = 6
  console.log(`Adding ${symbol} with ${decimals} decimals on Base chain`);
  
  if (typeof window.ethereum !== 'undefined') {
    const baseChainId = '0x2105'; // Base mainnet
    
    ethereum.request({ method: 'eth_chainId' })
      .then(currentChainId => {
        if (currentChainId === baseChainId) {
          addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
        } else {
          switchToBaseChain(contractAddress, symbol, decimals);
        }
      })
      .catch(error => {
        console.error('Error checking chain:', error);
        showNotification('Failed to check network. Please ensure your wallet is connected.', 'error');
      });
      
  } else {
    showNotification(`Please install MetaMask or another Web3 wallet for ${symbol}`, 'warning');
    
    setTimeout(() => {
      if (confirm('MetaMask is required for Base chain tokens. Install now?')) {
        window.open('https://metamask.io/', '_blank');
      }
    }, 1000);
  }
}

// Update the token image mapping
function addTokenViaEthereum(contractAddress, symbol, decimals, network) {
  const tokenImages = {
    'rebelinux': 'https://rebelinux.fun/images/rebelinux_logo/$rebelinux%20SVG%20(4).svg',
    'REBL': 'https://rebelinux.fun/images/Logo_REBL.svg'
  };
  
  // Log the details for debugging
  console.log(`Adding token details:
    Symbol: ${symbol}
    Address: ${contractAddress}
    Decimals: ${decimals}
    Network: ${network}
    Image: ${tokenImages[symbol] || 'none'}
  `);
  
  ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: contractAddress,
        symbol: symbol,
        decimals: parseInt(decimals), // Ensure it's a number
        image: tokenImages[symbol] || ''
      }
    }
  })
  .then(success => {
    if (success) {
      showNotification(`${symbol} added to wallet successfully!`, 'success');
    } else {
      showNotification(`User rejected adding ${symbol} to wallet`, 'warning');
    }
  })
  .catch(error => {
    console.error('Error adding token:', error);
    
    // User-friendly error messages
    if (error.code === 4001) {
      showNotification(`You rejected the request to add ${symbol}`, 'warning');
    } else if (error.message.includes('Invalid params')) {
      showNotification(`Invalid token parameters. Please check contract address and decimals.`, 'error');
    } else {
      showNotification(`Error: ${error.message}`, 'error');
    }
  });
}

// Update the fallback function
function addToWallet(contractAddress) {
  // Detect token by contract address
  const tokenConfigs = {
    '0xf95beeF6439ec38fA757238Cdec8417ABDA536bd': {
      symbol: 'rebelinux',
      decimals: 6,  // <-- Updated to 6!
      network: 'Base'
    },
    'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump': {
      symbol: 'REBL',
      decimals: 9,
      network: 'Solana'
    }
  };
  
  const tokenConfig = tokenConfigs[contractAddress];
  
  if (tokenConfig) {
    addTokenToWallet(
      contractAddress,
      tokenConfig.symbol,
      tokenConfig.decimals,
      tokenConfig.network
    );
  } else {
    // Unknown token - try to determine
    if (contractAddress.length > 32) {
      // Likely Solana
      addTokenToWallet(contractAddress, 'Unknown', 9, 'Solana');
    } else {
      // Likely Ethereum/Base
      addTokenToWallet(contractAddress, 'Unknown', 18, 'Base');
    }
  }
}

// Generic function to add tokens via Ethereum wallet_watchAsset
function addTokenViaEthereum(contractAddress, symbol, decimals, network) {
  const tokenImages = {
    'rebelinux': 'https://rebelinux.fun/images/rebelinux_logo/$rebelinux%20SVG%20(4).svg',
    'REBL': 'https://rebelinux.fun/images/Logo_REBL.svg'
  };
  
  ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: contractAddress,
        symbol: symbol,
        decimals: decimals,
        image: tokenImages[symbol] || ''
      }
    }
  })
  .then(success => {
    if (success) {
      showNotification(`${symbol} added to wallet successfully!`, 'success');
    } else {
      showNotification(`Failed to add ${symbol} to wallet`, 'error');
    }
  })
  .catch(error => {
    console.error('Error adding token:', error);
    showNotification(`Error adding ${symbol}: ${error.message}`, 'error');
  });
}

// Show instructions modal for Solana tokens
function showSolanaInstructionsModal(contractAddress, symbol) {
  copyToClipboard(contractAddress)
    .then(() => {
      showNotification(`${symbol} contract address copied!`, 'success');
      
      // Create modal
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div class="token-instructions-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(5px);">
          <div style="background: var(--dark-bg); padding: 2.5rem; border-radius: 20px; max-width: 500px; width: 90%; border: 2px solid var(--rebel-gold); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h3 style="color: var(--rebel-gold); margin: 0; font-size: 1.5rem;">
                <i class="fas fa-wallet" style="margin-right: 0.75rem;"></i>
                Add ${symbol} to Phantom
              </h3>
              <button onclick="this.closest('.token-instructions-modal').remove()" 
                      style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <ol style="color: white; margin-bottom: 2rem; padding-left: 1.5rem; line-height: 1.8;">
              <li style="margin-bottom: 1rem;">Open <strong>Phantom wallet</strong> on your device</li>
              <li style="margin-bottom: 1rem;">Tap the <strong style="color: var(--rebel-gold);">+</strong> button in your tokens list</li>
              <li style="margin-bottom: 1rem;">Select <strong>"Add Token"</strong></li>
              <li style="margin-bottom: 1rem;">
                Paste this address:
                <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; margin-top: 0.5rem; font-family: monospace; word-break: break-all; font-size: 0.9rem;">
                  ${contractAddress}
                </div>
              </li>
              <li>Tap <strong>"Add"</strong> to complete</li>
            </ol>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button onclick="copyToClipboard('${contractAddress}').then(() => { showNotification('Address copied again!', 'success'); })" 
                      style="background: var(--rebel-gold); color: white; border: none; padding: 1rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; flex: 1;">
                <i class="fas fa-copy" style="margin-right: 0.5rem;"></i>
                Copy Address
              </button>
              <button onclick="window.open('https://phantom.app/', '_blank')" 
                      style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 1rem 1.5rem; border-radius: 10px; cursor: pointer; flex: 1;">
                <i class="fas fa-external-link-alt" style="margin-right: 0.5rem;"></i>
                Get Phantom
              </button>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
    })
    .catch(() => {
      showNotification('Failed to copy address', 'error');
    });
}

// Fallback function for old buttons (backward compatibility)
function addToWallet(contractAddress) {
  // Detect token type by address length
  if (contractAddress.length > 32) {
    // Solana token (REBL)
    addTokenToWallet(contractAddress, 'REBL', 9, 'Solana');
  } else {
    // Base token (rebelinux)
    addTokenToWallet(contractAddress, 'rebelinux', 18, 'Base');
  }
}

// Function for adding Solana tokens
function addSolanaTokenToWallet(contractAddress) {
  // Check for Phantom wallet
  if (window.phantom?.solana || window.solana) {
    const solana = window.phantom?.solana || window.solana;
    
    // Check if wallet is connected
    solana.connect({ onlyIfTrusted: true })
      .then(() => {
        // Wallet is connected, show instruction
        showNotification('Please add $REBL manually using the contract address', 'info');
        
        // Copy address to clipboard
        copyToClipboard(contractAddress)
          .then(() => {
            showNotification('Contract address copied! Paste it in your wallet', 'success');
            
            // Show more detailed instructions
            setTimeout(() => {
              showNotification('In Phantom: Tap + → Add Token → Paste Address', 'info');
            }, 1500);
          })
          .catch(() => {
            showNotification('Failed to copy address', 'error');
          });
      })
      .catch(() => {
        // Wallet not connected or user rejected
        showNotification('Please connect your Phantom wallet first', 'warning');
        
        // Try to connect
        solana.connect()
          .then(() => {
            showNotification('Wallet connected! Now try adding the token again', 'success');
          })
          .catch((error) => {
            console.error('Connection error:', error);
            showNotification('Failed to connect wallet', 'error');
          });
      });
  } else {
    // Phantom not installed
    showNotification('Please install Phantom wallet for Solana', 'warning');
    
    // Offer to redirect to Phantom
    setTimeout(() => {
      if (confirm('Phantom wallet not detected. Would you like to install it?')) {
        window.open('https://phantom.app/', '_blank');
      }
    }, 1000);
  }
}

// Function for adding Ethereum tokens (for $rebelinux)
function addEthereumTokenToWallet(contractAddress) {
  if (typeof window.ethereum !== 'undefined') {
    try {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: contractAddress,
            symbol: 'rebelinux',
            decimals: 18,
            image: 'https://rebelinux.fun/images/rebelinux_logo/$rebelinux%20SVG%20(4).svg'
          }
        }
      }).then(success => {
        if (success) {
          showNotification('$rebelinux added to wallet!', 'success');
        } else {
          showNotification('Failed to add token to wallet', 'error');
        }
      }).catch(error => {
        console.error('Error adding token:', error);
        showNotification('Error adding token to wallet', 'error');
      });
    } catch (error) {
      showNotification('Please install a Web3 wallet like MetaMask', 'warning');
    }
  } else {
    showNotification('Please install MetaMask or another Web3 wallet', 'warning');
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

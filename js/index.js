///// ===== INDEX PAGE ENHANCED JAVASCRIPT ========
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

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.value-card, .comparison-card, .step-card, .stat-card, ' +
    '.token-card, .logo-card, .key-takeaway, .contract-emphasis, ' +
    '.feature-card, .process-step'
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
    
    // Store the mousemove listener for cleanup
    const mousemoveHandler = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 25;
      mouseY = (e.clientY - window.innerHeight / 2) / 25;
    };
    
    window.addEventListener('mousemove', mousemoveHandler);
    window.mousemoveListener = mousemoveHandler; // Store for cleanup
    
    function animateLogo() {
      // Smooth interpolation for better performance
      logoX += (mouseX - logoX) * 0.1;
      logoY += (mouseY - logoY) * 0.1;
      
      floatingLogo.style.transform = 
        `translateY(-20px) rotateY(${logoX}deg) rotateX(${logoY}deg)`;
      
      // Store animation frame ID for cleanup
      window.logoAnimationId = requestAnimationFrame(animateLogo);
    }
    
    window.logoAnimationId = requestAnimationFrame(animateLogo);
  }
  
  // Store observer reference for cleanup
  window.scrollAnimationObserver = observer;
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
    contractText = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    copyToClipboard(contractText.trim())
      .then(() => {
        showNotification('Solana ($REBL) address copied!', 'success');
        showCopyFeedback(button, true);
      })
      .catch(() => {
        showNotification('Failed to copy address', 'error');
        showCopyFeedback(button, false);
      });
    return;
  }
  
  if (button.closest('.contract-address')) {
    const codeElement = button.closest('.contract-address')?.querySelector('code');
    if (codeElement) {
      contractText = codeElement.getAttribute('data-full') || codeElement.textContent;
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
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn, .copy-contract-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', handleCopyClick);
  });
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
  
  // Store particle references for cleanup
  window.particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle(particleContainer);
    window.particles.push(particle);
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
  return particle; // ← ADD THIS LINE
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
  const bridgeTokens = document.querySelector('.bridge-tokens');
  const movingCoin = document.querySelector('.moving-coin');
  
  if (bridgeTokens && movingCoin && isMobile()) {
    // Change arrow direction
    const arrow = bridgeTokens.querySelector('.fa-arrow-right');
    if (arrow) {
      arrow.style.transform = 'rotate(90deg)';
    }
    
    // Update moving coin animation
    movingCoin.style.animation = 'move-down 2.5s ease-in-out infinite';
  }
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


function addTokenToWallet(contractAddress, symbol, decimals, network) {
  console.log(`Adding ${symbol} to wallet (${network} network)`);
  
  if (network === 'Solana') {
    addSolanaTokenToWallet(contractAddress, symbol, decimals);
  } else if (network === 'Base') {
    addBaseTokenToWallet(contractAddress, symbol, decimals);
  } else {
    // Generic Ethereum-compatible chain
    addEthereumTokenToWallet(contractAddress, symbol, decimals, network);
  }
}

// Function for adding Solana tokens
function addSolanaTokenToWallet(contractAddress, symbol, decimals) {
  // Check for Phantom wallet
  const phantom = window.phantom?.solana || window.solana;
  
  if (phantom) {
    // Check if wallet is connected
    phantom.connect({ onlyIfTrusted: true })
      .then(() => {
        showSolanaInstructionsModal(contractAddress, symbol);
      })
      .catch(() => {
        // Wallet not connected or user rejected
        showNotification('Please connect your Phantom wallet first', 'warning');
        
        // Try to connect
        phantom.connect()
          .then(() => {
            showNotification('Wallet connected! Now add the token', 'success');
            setTimeout(() => {
              showSolanaInstructionsModal(contractAddress, symbol);
            }, 1000);
          })
          .catch((error) => {
            console.error('Connection error:', error);
            showNotification('Failed to connect wallet', 'error');
          });
      });
  } else {
    // Phantom not installed
    showNotification(`Please install Phantom wallet for ${symbol}`, 'warning');
    
    setTimeout(() => {
      const install = confirm(`Phantom wallet is required for ${symbol}. Install now?`);
      if (install) {
        window.open('https://phantom.app/', '_blank');
      }
    }, 1000);
  }
}

// Function for adding Base chain tokens (Ethereum-compatible)
function addBaseTokenToWallet(contractAddress, symbol, decimals) {
  // Check for Ethereum provider (MetaMask, Coinbase Wallet, etc.)
  if (typeof window.ethereum !== 'undefined') {
    
    // Base chain ID is 8453
    const baseChainId = '0x2105'; // 8453 in hex
    
    // Check if we're on Base chain
    ethereum.request({ method: 'eth_chainId' })
      .then(currentChainId => {
        if (currentChainId === baseChainId) {
          // Already on Base chain, add token
          addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
        } else {
          // Not on Base chain, ask to switch
          switchToBaseChain(contractAddress, symbol, decimals);
        }
      })
      .catch(error => {
        console.error('Error checking chain:', error);
        showNotification('Failed to check network. Please ensure your wallet is connected.', 'error');
      });
      
  } else {
    // No Ethereum wallet detected
    showNotification(`Please install MetaMask or another Web3 wallet for ${symbol}`, 'warning');
    
    setTimeout(() => {
      const install = confirm('MetaMask is required for Base chain tokens. Install now?');
      if (install) {
        window.open('https://metamask.io/', '_blank');
      }
    }, 1000);
  }
}

// Switch to Base chain and add token
function switchToBaseChain(contractAddress, symbol, decimals) {
  const switchConfirm = confirm(`To add ${symbol}, you need to switch to Base network. Switch now?`);
  
  if (switchConfirm) {
    ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }], // Base mainnet
    })
    .then(() => {
      // Successfully switched, now add token
      setTimeout(() => {
        addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
      }, 1000);
    })
    .catch((switchError) => {
      // If chain is not added, add it first
      if (switchError.code === 4902) {
        ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x2105',
              chainName: 'Base Mainnet',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org']
            }
          ]
        })
        .then(() => {
          // Chain added, now add token
          setTimeout(() => {
            addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
          }, 1000);
        })
        .catch(addError => {
          console.error('Error adding Base chain:', addError);
          showNotification('Failed to add Base network to wallet', 'error');
        });
      } else {
        console.error('Error switching to Base:', switchError);
        showNotification('Failed to switch to Base network', 'error');
      }
    });
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
// Detect wallet type and add appropriate styling
function detectWallet() {
  if (window.phantom || window.solana) {
    console.log('🔍 Phantom wallet detected');
    return 'phantom';
  } else if (typeof window.ethereum !== 'undefined') {
    console.log('🔍 Ethereum wallet detected');
    return 'ethereum';
  } else {
    console.log('🔍 No wallet detected');
    return 'none';
  }
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
// Initialize wallet detection on page load
function initWalletDetection() {
  const walletType = detectWallet();
  const walletButtons = document.querySelectorAll('.wallet-action');
  
  walletButtons.forEach(button => {
    // Add wallet-specific icons
    const isSolanaButton = button.textContent.includes('REBL') || button.onclick.toString().includes('Solana');
    
    if (walletType === 'phantom' && isSolanaButton) {
      button.innerHTML = '<i class="fas fa-wallet"></i><span>Add to Phantom</span>';
    } else if (walletType === 'ethereum' && !isSolanaButton) {
      button.innerHTML = '<i class="fab fa-ethereum"></i><span>Add to MetaMask</span>';
    }
    
    // Add click handler for better UX
    button.addEventListener('click', function(e) {
      const originalText = this.innerHTML;
      
      // Show loading state
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting...</span>';
      this.disabled = true;
      
      // Restore after 3 seconds
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
      }, 3000);
    });
  });
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

function copyContractAddress() {
  const contractCode = document.querySelector('.contract-code code');
  if (contractCode) {
    const address = contractCode.textContent.trim();
    copyToClipboard(address)
      .then(() => {
        showNotification('Contract address copied to clipboard!', 'success');
      })
      .catch(() => {
        showNotification('Failed to copy address', 'error');
      });
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
// Cleanup function for animations
function cleanupAnimations() {
  console.log('🧹 Cleaning up animations...');
  
  // Cleanup Intersection Observer
  if (window.scrollAnimationObserver) {
    window.scrollAnimationObserver.disconnect();
    delete window.scrollAnimationObserver;
  }
  
  // Cancel any animation frames
  if (window.logoAnimationId) {
    cancelAnimationFrame(window.logoAnimationId);
    delete window.logoAnimationId;
  }
  
  // Cleanup other animation frames if they exist
  if (window.animationFrameId) {
    cancelAnimationFrame(window.animationFrameId);
    delete window.animationFrameId;
  }
  
  // Cleanup particles
  if (window.particles && window.particles.length > 0) {
    window.particles.forEach(particle => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    delete window.particles;
  }
  
  // Remove event listeners if you stored them
  if (window.mousemoveListener) {
    window.removeEventListener('mousemove', window.mousemoveListener);
    delete window.mousemoveListener;
  }
}

// ===== ADD EVENT LISTENERS HERE =====
// Call cleanup on page unload
window.addEventListener('beforeunload', cleanupAnimations);
window.addEventListener('pagehide', cleanupAnimations); // For better mobile support

// Also cleanup when navigating away in SPA-like environments
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    cleanupAnimations();
  }
});

// Add at the beginning of initIndexPage() function
console.log('🎬 Initializing animations...');

// Add animation classes to elements
function activateAnimations() {
  console.log('🎯 Activating animations...');
  
  // Floating logo animation
  const floatingLogo = document.querySelector('.logo-3d');
  if (floatingLogo) {
    floatingLogo.style.animation = 'float 3s ease-in-out infinite';
    console.log('✅ Floating logo animation activated');
  }
  
  // Loader spinner
  const loaderSpinner = document.querySelector('.loader-spinner');
  if (loaderSpinner) {
    loaderSpinner.style.animation = 'spin 1s linear infinite';
  }
  
  // Progress bar
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.animation = 'progress-load 3s ease-in-out forwards';
  }
  
  // Moving coin animation
  const movingCoin = document.querySelector('.moving-coin');
  if (movingCoin) {
    movingCoin.style.animation = 'move-right 2.5s ease-in-out infinite';
  }
  
  // Pulse animations
  const pulseElements = document.querySelectorAll('.badge-text, .flow-dot');
  pulseElements.forEach(el => {
    el.style.animation = 'pulse 2s infinite';
  });
  
  // Glow animations
  const primaryGlowButtons = document.querySelectorAll('.primary-glow');
  primaryGlowButtons.forEach(btn => {
    btn.style.position = 'relative';
  });
  
  console.log(`✅ ${pulseElements.length} pulse animations activated`);
}
function toggleContractView(button) {
  const contractAddress = button.closest('.contract-address');
  const codeElement = contractAddress?.querySelector('code');
  
  if (codeElement) {
    const isExpanded = codeElement.classList.toggle('expanded');
    const icon = button.querySelector('i');
    
    if (isExpanded) {
      // Show full address
      const fullAddress = codeElement.getAttribute('data-full') || codeElement.textContent;
      codeElement.textContent = fullAddress;
      icon.className = 'fas fa-compress-alt';
      button.setAttribute('title', 'Collapse address');
      button.setAttribute('aria-label', 'Collapse contract address view');
    } else {
      // Show shortened address
      const fullAddress = codeElement.getAttribute('data-full') || codeElement.textContent;
      const shortAddress = fullAddress.length > 20 
        ? `${fullAddress.substring(0, 8)}...${fullAddress.substring(fullAddress.length - 6)}`
        : fullAddress;
      codeElement.textContent = shortAddress;
      icon.className = 'fas fa-expand-alt';
      button.setAttribute('title', 'Expand address');
      button.setAttribute('aria-label', 'Expand contract address view');
    }
  }
}
// Initialize all contract addresses on page load
function initContractAddresses() {
  const contractCodes = document.querySelectorAll('.contract-short');
  
  contractCodes.forEach(code => {
    const fullAddress = code.getAttribute('data-full') || code.textContent;
    if (fullAddress.length > 20) {
      const shortAddress = `${fullAddress.substring(0, 8)}...${fullAddress.substring(fullAddress.length - 6)}`;
      code.textContent = shortAddress;
    }
  });
}
  
// Enhanced Scroll Animations with Parallax
function initParallaxEffects() {
  const heroBackground = document.querySelector('.hero-background-pattern');
  if (!heroBackground) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
  });
}

// Enhanced Logo Interaction
function initLogoInteractions() {
  const logos = document.querySelectorAll('.logo-3d, .token-logo-img');
  
  logos.forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      logo.style.filter = 'drop-shadow(0 0 30px rgba(212, 167, 106, 0.8)) brightness(1.2)';
    });
    
    logo.addEventListener('mouseleave', () => {
      logo.style.filter = 'drop-shadow(0 0 20px rgba(212, 167, 106, 0.5))';
    });
  });
}

// Enhanced Counter Animations
function initEnhancedCounters() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  
  counters.forEach(counter => {
    const updateCounter = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText.replace(/[^0-9.]/g, '');
      const increment = target / 100;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment).toLocaleString();
        setTimeout(updateCounter, 20);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    
    // Start counter when in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

// Enhanced Chain Visualization Animation
function initChainAnimation() {
  const bridgeTokens = document.querySelector('.bridge-tokens');
  if (!bridgeTokens) return;
  
  // Create additional moving elements
  for (let i = 0; i < 3; i++) {
    const coin = document.createElement('div');
    coin.className = 'moving-coin';
    coin.style.animationDelay = `${i * 0.5}s`;
    coin.style.opacity = '0.6';
    bridgeTokens.appendChild(coin);
  }
}

// Enhanced Value Cards Hover Effect
function initValueCardEffects() {
  const valueCards = document.querySelectorAll('.value-card');
  
  valueCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}
function isMobile() {
  // Check both viewport width and user agent
  return window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function initIndexPage() {
  console.log('✨ Initializing enhanced Index page features');
  
  // Initialize components in order of priority
  const initQueue = [
    initLoader,
    initScrollAnimations,
    initParallaxEffects,        // From second version
    initStatsCounters,
    initContractAddresses,      // From first version (important!)
    initEnhancedCounters,       // From second version
    initCopyButtons,
    initContractViews,
    initSmoothScroll,
    initParticles,
    initLogoAnimations,
    initLogoInteractions,       // From second version
    initBackToTop,
    initMobileOptimizations,
    initTouchInteractions,
    initLazyLoading,
    initPerformanceObservers,
    initWalletDetection,
    initChainAnimation,         // From second version
    initValueCardEffects        // From second version
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

// Add this CSS for the value card mouse effect
const valueCardStyles = `
  .value-card {
    --mouse-x: 50%;
    --mouse-y: 50%;
  }
  
  .value-card:hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      600px circle at var(--mouse-x) var(--mouse-y),
      rgba(212, 167, 106, 0.1),
      transparent 40%
    );
    pointer-events: none;
    border-radius: 20px;
  }
`;

// Add the styles to the document
if (!document.querySelector('#value-card-styles')) {
  const style = document.createElement('style');
  style.id = 'value-card-styles';
  style.textContent = valueCardStyles;
  document.head.appendChild(style);
}

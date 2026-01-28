// ===== INDEX PAGE ENHANCED JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
  // Initialize after common components are loaded
  setTimeout(initIndexPage, 300);
});

async function initIndexPage() {
  try {
    console.time('PageInitialization');
    console.log('Initializing enhanced Index page');
    
    // Batch DOM reads and initializations
    await Promise.all([
      initScrollAnimations(),
      initStatsCounters(),
      initROICalculator(),
      initCopyButtons(),
      initSmoothScroll(),
      initLogoAnimations(),
      initIntersectionObservers(),
      initParticles()
    ]);
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      initPerformanceMonitoring();
    }
    
    // Set up event listener cleanup on page unload
    setupCleanup();
    
    console.timeEnd('PageInitialization');
  } catch (error) {
    console.error('Failed to initialize page:', error);
    // Fallback: at least ensure basic functionality
    initEssentialFeatures();
  }
}

// Enhanced Scroll Animations with IntersectionObserver
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.value-card, .comparison-card, .step-card, .stat-card, .token-card, .logo-card, .ecosystem-feature, .contract-emphasis, .animate-on-scroll'
  );
  
  // Add initial styles for animation
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    el.style.willChange = 'opacity, transform';
  });
  
  // Floating logo animation
  const floatingLogo = document.querySelector('.logo-3d');
  if (floatingLogo) {
    let mouseX = 0;
    let mouseY = 0;
    let logoX = 0;
    let logoY = 0;
    const factor = 25;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function updateLogoPosition() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate rotation based on mouse position
      const targetX = (windowWidth / 2 - mouseX) / factor;
      const targetY = (windowHeight / 2 - mouseY) / factor;
      
      // Smooth interpolation
      logoX += (targetX - logoX) * 0.1;
      logoY += (targetY - logoY) * 0.1;
      
      floatingLogo.style.transform = `translateY(-20px) rotateY(${logoX}deg) rotateX(${logoY}deg)`;
      
      requestAnimationFrame(updateLogoPosition);
    }
    
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(updateLogoPosition);
    }
  }
}

// Intersection Observer for animations
function initIntersectionObservers() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }, delay);
      }
    });
  }, observerOptions);
  
  // Observe all elements that need animation
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    fadeObserver.observe(el);
  });
}

// Stats Counters Animation
function initStatsCounters() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  
  if (statValues.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statElement = entry.target;
        const targetValue = parseFloat(statElement.getAttribute('data-target'));
        
        if (!statElement.classList.contains('animated')) {
          animateCounter(statElement, targetValue);
          statElement.classList.add('animated');
        }
      }
    });
  }, { threshold: 0.5 });
  
  statValues.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
  const duration = 2000;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.textContent = target.toFixed(target % 1 === 0 ? 0 : 2);
    return;
  }
  
  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const easeOut = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    const current = target * easeOut;
    
    element.textContent = current.toFixed(target % 1 === 0 ? 0 : 2);
    
    if (frame === totalFrames) {
      clearInterval(counter);
      element.textContent = target.toFixed(target % 1 === 0 ? 0 : 2);
    }
  }, frameDuration);
}

// ROI Calculator - FIXED FUNCTION
function initROICalculator() {
  const amountSlider = document.getElementById('amount-slider');
  const amountInput = document.getElementById('amount-input');
  const ageSlider = document.getElementById('age-slider');
  const ageInput = document.getElementById('age-input');
  const weeklyRewardEl = document.getElementById('weekly-reward');
  const ageBonusEl = document.getElementById('age-bonus');
  const totalRewardEl = document.getElementById('total-reward');
  
  if (!amountSlider || !amountInput || !ageSlider || !ageInput) return;
  
  function updateCalculator() {
    const amount = parseFloat(amountInput.value) || 0;
    const age = parseInt(ageInput.value) || 0;
    
    // Calculate weekly reward (example: 1% of amount)
    const weeklyReward = amount * 0.01;
    
    // Calculate age bonus (example: 7% per week, max 240%)
    const ageBonusPercent = Math.min(age * 7, 240);
    const ageBonus = weeklyReward * (ageBonusPercent / 100);
    
    // Calculate total reward
    const totalReward = weeklyReward + ageBonus;
    
    // Update display
    if (weeklyRewardEl) {
      weeklyRewardEl.textContent = `$${weeklyReward.toFixed(2)}`;
    }
    if (ageBonusEl) {
      ageBonusEl.textContent = `$${ageBonus.toFixed(2)} (+${ageBonusPercent}%)`;
    }
    if (totalRewardEl) {
      totalRewardEl.textContent = `$${totalReward.toFixed(2)}`;
    }
  }
  
  // Event listeners with debouncing
  const updateCalculatorDebounced = debounce(updateCalculator, 100);
  
  amountSlider.addEventListener('input', function() {
    amountInput.value = this.value;
    updateCalculatorDebounced();
  });
  
  amountInput.addEventListener('input', function() {
    amountSlider.value = this.value;
    updateCalculatorDebounced();
  });
  
  ageSlider.addEventListener('input', function() {
    ageInput.value = this.value;
    updateCalculatorDebounced();
  });
  
  ageInput.addEventListener('input', function() {
    ageSlider.value = this.value;
    updateCalculatorDebounced();
  });
  
  // Initial calculation
  updateCalculator();
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Copy to Clipboard with fallback
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn, .copy-contract-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async function() {
      let contractText;
      
      if (this.classList.contains('copy-contract-btn')) {
        contractText = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
      } else {
        const contract = this.getAttribute('data-contract');
        if (!contract) {
          contractText = this.parentElement.querySelector('code')?.textContent;
        } else {
          contractText = contract;
        }
      }
      
      if (contractText) {
        await copyToClipboard(contractText.trim());
      }
    });
  });
}

// Enhanced copy functionality with fallback
async function copyToClipboard(text) {
  try {
    // Use modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showNotification('Contract address copied to clipboard!', 'success');
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showNotification('Copied to clipboard!', 'success');
        return true;
      } else {
        throw new Error('Copy command failed');
      }
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    showNotification('Failed to copy. Please copy manually.', 'error');
    
    // Show text for manual copy as fallback
    showManualCopyFallback(text);
    return false;
  }
}

function showManualCopyFallback(text) {
  const fallbackDiv = document.createElement('div');
  fallbackDiv.className = 'manual-copy-fallback';
  fallbackDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    z-index: 10001;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    border: 2px solid var(--rebel-gold);
  `;
  
  fallbackDiv.innerHTML = `
    <h4 style="margin: 0 0 15px 0; color: #333;">Copy Text Manually</h4>
    <code style="display: block; margin: 15px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 14px;">${text}</code>
    <div style="display: flex; gap: 10px; justify-content: flex-end;">
      <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
    </div>
  `;
  
  document.body.appendChild(fallbackDiv);
  
  // Close on escape key
  const closeHandler = (e) => {
    if (e.key === 'Escape') {
      fallbackDiv.remove();
      document.removeEventListener('keydown', closeHandler);
    }
  };
  document.addEventListener('keydown', closeHandler);
  
  // Close on background click
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 10000;
  `;
  document.body.appendChild(overlay);
  
  overlay.addEventListener('click', () => {
    fallbackDiv.remove();
    overlay.remove();
    document.removeEventListener('keydown', closeHandler);
  });
}

// Enhanced Notification
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  
  const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
  notification.innerHTML = `
    <i class="fas fa-${icon}" aria-hidden="true"></i>
    <span>${message}</span>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 'rgba(244, 67, 54, 0.95)'};
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
    max-width: 350px;
  `;
  
  // Add keyframes if not already added
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
  const timeout = setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 5000);
  
  // Allow manual dismissal
  notification.addEventListener('click', () => {
    clearTimeout(timeout);
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  });
}

// Smooth Scroll
function initSmoothScroll() {
  const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
  
  // Store calculated offsets to prevent recalculation
  const offsets = new Map();
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (!href.startsWith('#') || href === '#') return;
      
      e.preventDefault();
      
      const targetId = href.substring(1);
      let targetElement = document.getElementById(targetId);
      
      if (!targetElement) {
        // Try to find by name attribute as fallback
        targetElement = document.querySelector(`[name="${targetId}"]`);
      }
      
      if (targetElement) {
        // Calculate offset once and cache it
        if (!offsets.has(targetId)) {
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          offsets.set(targetId, targetPosition - headerHeight);
        }
        
        // Check for reduced motion preference
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        
        window.scrollTo({
          top: offsets.get(targetId),
          behavior: behavior
        });
        
        // Update URL without reload
        history.replaceState(null, null, href);
        
        // Focus the target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
        setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
      }
    });
  });
}

// Particle Background for Hero
function initParticles() {
  const heroSection = document.querySelector('.page-hero--main');
  if (!heroSection || document.querySelector('.particle')) return;
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  const particleCount = 50;
  const particlesContainer = heroSection.querySelector('.hero-particles');
  
  if (!particlesContainer) return;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.setAttribute('aria-hidden', 'true');
    
    const size = Math.random() * 5 + 1;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: float-particle ${duration}s linear ${delay}s infinite;
      z-index: 1;
      pointer-events: none;
    `;
    
    particlesContainer.appendChild(particle);
  }
  
  // Add animation keyframes
  if (!document.querySelector('#particle-animations')) {
    const style = document.createElement('style');
    style.id = 'particle-animations';
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
}

// Logo Section Animations
function initLogoAnimations() {
  const logoCards = document.querySelectorAll('.logo-card');
  
  if (logoCards.length === 0) return;
  
  logoCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    card.style.willChange = 'opacity, transform';
  });
}

// Copy Contract Address Function
function copyContractAddress() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  
  copyToClipboard(contractAddress).then(success => {
    if (success) {
      // Show success feedback on button
      const button = document.querySelector('.copy-contract-btn');
      if (button) {
        const originalHTML = button.innerHTML;
        const originalBackground = button.style.background;
        
        button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Copied!';
        button.style.background = '#4CAF50';
        button.setAttribute('aria-label', 'Address copied successfully');
        
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.style.background = originalBackground;
          button.setAttribute('aria-label', 'Copy contract address');
        }, 2000);
      }
    }
  });
}

// Add to Wallet function (placeholder)
function addToWallet(contractAddress) {
  // This is a placeholder - in a real implementation, you would:
  // 1. Check if the wallet extension is available
  // 2. Use the appropriate wallet API (Solana or Ethereum)
  // 3. Add the token to the user's wallet
  
  showNotification('Wallet integration coming soon! For now, manually add the contract address to your wallet.', 'info');
  
  // For demonstration purposes, we'll copy the contract address
  copyToClipboard(contractAddress);
}

// Toggle contract view
function toggleContractView(button) {
  const contractElement = button.closest('.contract-address').querySelector('code');
  const isExpanded = contractElement.classList.toggle('expanded');
  
  button.innerHTML = isExpanded 
    ? '<i class="fas fa-compress-alt" aria-hidden="true"></i>'
    : '<i class="fas fa-expand-alt" aria-hidden="true"></i>';
  
  button.setAttribute('aria-label', isExpanded ? 'Collapse contract address' : 'Expand contract address');
}

// Lazy loading for non-critical images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Check if it's a picture element or regular img
          if (img.tagName === 'PICTURE') {
            const sources = img.querySelectorAll('source[data-srcset]');
            sources.forEach(source => {
              source.srcset = source.dataset.srcset;
              source.removeAttribute('data-srcset');
            });
            
            const imgElement = img.querySelector('img[data-src]');
            if (imgElement) {
              imgElement.src = imgElement.dataset.src;
              imgElement.removeAttribute('data-src');
            }
          } else if (img.dataset.src) {
            // Regular img element
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });
    
    document.querySelectorAll('img.lazy, picture.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('img.lazy, picture.lazy').forEach(img => {
      if (img.tagName === 'PICTURE') {
        const sources = img.querySelectorAll('source[data-srcset]');
        sources.forEach(source => {
          source.srcset = source.dataset.srcset;
        });
        
        const imgElement = img.querySelector('img[data-src]');
        if (imgElement) {
          imgElement.src = imgElement.dataset.src;
        }
      } else {
        img.src = img.dataset.src;
      }
      img.classList.remove('lazy');
    });
  }
}

// Performance monitoring
function initPerformanceMonitoring() {
  try {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
      
      // You could send this to analytics
      // trackPerformanceMetric('LCP', lastEntry.startTime);
    });
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const delay = entry.processingStart - entry.startTime;
        console.log('FID:', delay);
        
        // You could send this to analytics
        // trackPerformanceMetric('FID', delay);
      }
    });
    
    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          console.log('CLS:', entry.value);
          
          // You could send this to analytics
          // trackPerformanceMetric('CLS', entry.value);
        }
      }
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    fidObserver.observe({ entryTypes: ['first-input'] });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    
  } catch (error) {
    console.warn('Performance monitoring failed:', error);
  }
}

// Essential features fallback
function initEssentialFeatures() {
  console.log('Loading essential features fallback');
  
  // Ensure copy buttons work
  document.querySelectorAll('.copy-btn, .copy-contract-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const contract = this.dataset.contract || 
                      this.closest('.contract-address')?.querySelector('code')?.textContent;
      if (contract) copyToClipboard(contract);
    });
  });
  
  // Ensure links work
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView();
        }
      }
    });
  });
  
  // Ensure all buttons have basic functionality
  document.querySelectorAll('button').forEach(button => {
    if (!button.hasAttribute('type')) {
      button.setAttribute('type', 'button');
    }
  });
}

// Setup cleanup for event listeners
function setupCleanup() {
  // Store references to remove later if needed
  window.pageListeners = [];
  
  // Add cleanup on page unload
  window.addEventListener('beforeunload', () => {
    // Clean up any intervals or timeouts
    const maxId = setTimeout(() => {}, 0);
    for (let i = 0; i < maxId; i++) {
      clearTimeout(i);
      clearInterval(i);
    }
    
    // Remove stored listeners (if you track them)
    if (window.pageListeners && window.pageListeners.length > 0) {
      window.pageListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    }
  });
}

// Initialize when page loads
window.addEventListener('load', function() {
  // Initialize particles
  initParticles();
  
  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    // Check for reduced motion
    const transitionDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? '0s' : '0.5s';
    
    loader.style.transition = `opacity ${transitionDuration} ease, transform ${transitionDuration} ease`;
    loader.style.opacity = '0';
    loader.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
      loader.style.display = 'none';
      loader.setAttribute('aria-hidden', 'true');
      
      // Set focus to main content for screen readers
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        setTimeout(() => mainContent.removeAttribute('tabindex'), 1000);
      }
    }, 500);
  }
  
  // Register service worker
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  }
});

// Error handling for images
document.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG') {
    console.warn('Image failed to load:', e.target.src);
    e.target.style.opacity = '0.5';
    e.target.title = 'Image failed to load';
    
    // You could set a fallback image here
    // e.target.src = 'images/fallback.svg';
  }
}, true);

// Export functions if needed
window.IndexPage = {
  initIndexPage,
  initScrollAnimations,
  initStatsCounters,
  initLogoAnimations,
  copyContractAddress,
  addToWallet,
  copyToClipboard
};

// Add this to handle browser back/forward navigation
window.addEventListener('pageshow', function(event) {
  // If the page was loaded from cache, reinitialize some features
  if (event.persisted) {
    initIntersectionObservers();
    initStatsCounters();
  }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    // Page became visible again
    initStatsCounters();
  }
});

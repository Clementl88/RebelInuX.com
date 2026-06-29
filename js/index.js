/**
 * ============================================================
 * REBELINUX INDEX PAGE - ENHANCED JAVASCRIPT
 * Version: 2.0 (3 Asset Types)
 * ============================================================
 * 
 * 3 Asset Types System:
 *   🪙 Type 1: Creator Coin ($rebelinux) on ZORA
 *   📜 Type 2: Content Coins (Rebel Key + Journey) on ZORA
 *   ⭐ Type 3: Governance + Reward Token ($REBL) on Solana
 * 
 * Formula: Hold Type 1 + Type 2 → Earn Type 3 ($REBL)
 * ============================================================
 */

// ============================================================
// MAIN INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 RebelInuX (3 Asset Types) Initializing...');
  
  // Initialize after DOM is ready
  setTimeout(() => {
    initIndexPage();
    initPerformanceMonitoring();
  }, 100);
});

// ============================================================
// CORE FUNCTIONS
// ============================================================

function initIndexPage() {
  console.log('✨ Initializing 3 Asset Types ecosystem');
  
  const initQueue = [
    initLoader,
    initScrollAnimations,
    initParallaxEffects,
    initStatsCounters,
    initContractAddresses,
    initEnhancedCounters,
    initCopyButtons,
    initSmoothScroll,
    initParticles,
    initLogoAnimations,
    initLogoInteractions,
    initBackToTop,
    initMobileOptimizations,
    initTouchInteractions,
    initLazyLoading,
    initPerformanceObservers,
    initWalletDetection,
    initChainAnimation,
    initValueCardEffects,
    initAssetTypesDisplay,
    initFormulaAnimation
  ];
  
  initQueue.forEach((initFn, index) => {
    setTimeout(() => {
      try {
        initFn();
      } catch (error) {
        console.warn(`⚠️ Failed to initialize ${initFn.name}:`, error);
      }
    }, index * 80);
  });
}

function initPerformanceMonitoring() {
  if (window.performance) {
    const perfData = window.performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`📊 Page loaded in ${loadTime}ms`);
    
    if (loadTime > 3000) {
      console.warn('⚠️ Page load time is slow, consider optimization');
    }
  }
}

// ============================================================
// LOADER
// ============================================================

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
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
          document.dispatchEvent(new CustomEvent('pageLoaded', {
            detail: { timestamp: Date.now() }
          }));
        }, 500);
      }
    }, 100);
  } else {
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.add('loaded');
    }, 1500);
  }
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.value-card, .comparison-card, .step-card, .stat-card, ' +
    '.token-card, .logo-card, .key-takeaway, .contract-emphasis, ' +
    '.feature-card, .process-step, .asset-card'
  );
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in');
          
          const rect = entry.target.getBoundingClientRect();
          if (rect.left < window.innerWidth / 2) {
            entry.target.classList.add('slide-in-left');
          } else {
            entry.target.classList.add('slide-in-right');
          }
        }, index * 80);
        
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
    observer.observe(el);
  });
  
  // Floating logo interaction
  const floatingLogo = document.querySelector('.logo-3d');
  if (floatingLogo && !isMobile()) {
    let mouseX = 0, mouseY = 0, logoX = 0, logoY = 0;
    
    const mousemoveHandler = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 25;
      mouseY = (e.clientY - window.innerHeight / 2) / 25;
    };
    
    window.addEventListener('mousemove', mousemoveHandler);
    window.mousemoveListener = mousemoveHandler;
    
    function animateLogo() {
      logoX += (mouseX - logoX) * 0.1;
      logoY += (mouseY - logoY) * 0.1;
      
      floatingLogo.style.transform = 
        `translateY(-20px) rotateY(${logoX}deg) rotateX(${logoY}deg)`;
      
      window.logoAnimationId = requestAnimationFrame(animateLogo);
    }
    
    window.logoAnimationId = requestAnimationFrame(animateLogo);
  }
  
  window.scrollAnimationObserver = observer;
}

function initParallaxEffects() {
  const heroBackground = document.querySelector('.hero-background-pattern');
  if (!heroBackground) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroBackground.style.transform = `translate3d(0, ${scrolled * -0.5}px, 0)`;
  });
}

// ============================================================
// STATS COUNTERS
// ============================================================

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

// ============================================================
// CONTRACT ADDRESSES
// ============================================================

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

function toggleContractView(button) {
  const contractAddress = button.closest('.contract-address');
  const codeElement = contractAddress?.querySelector('code');
  
  if (codeElement) {
    const isExpanded = codeElement.classList.toggle('expanded');
    const icon = button.querySelector('i');
    
    if (isExpanded) {
      const fullAddress = codeElement.getAttribute('data-full') || codeElement.textContent;
      codeElement.textContent = fullAddress;
      icon.className = 'fas fa-compress-alt';
      button.setAttribute('title', 'Collapse address');
    } else {
      const fullAddress = codeElement.getAttribute('data-full') || codeElement.textContent;
      const shortAddress = fullAddress.length > 20 
        ? `${fullAddress.substring(0, 8)}...${fullAddress.substring(fullAddress.length - 6)}`
        : fullAddress;
      codeElement.textContent = shortAddress;
      icon.className = 'fas fa-expand-alt';
      button.setAttribute('title', 'Expand address');
    }
  }
}

// ============================================================
// COPY TO CLIPBOARD
// ============================================================

function handleCopyClick(e) {
  e.preventDefault();
  
  let contractText = '';
  const button = e.currentTarget;
  
  if (button.classList.contains('copy-contract-btn')) {
    contractText = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    copyToClipboard(contractText.trim())
      .then(() => {
        showNotification('✅ $REBL (Type 3) address copied!', 'success');
        showCopyFeedback(button, true);
      })
      .catch(() => {
        showNotification('❌ Failed to copy address', 'error');
        showCopyFeedback(button, false);
      });
    return;
  }
  
  if (button.closest('.contract-address')) {
    const codeElement = button.closest('.contract-address')?.querySelector('code');
    if (codeElement) {
      contractText = codeElement.getAttribute('data-full') || codeElement.textContent;
      const isSolana = contractText.length > 32;
      const tokenType = isSolana ? '⭐ $REBL (Type 3)' : '🪙 $rebelinux (Type 1)';
      
      copyToClipboard(contractText.trim())
        .then(() => {
          showNotification(`✅ ${tokenType} address copied!`, 'success');
          showCopyFeedback(button, true);
        })
        .catch(() => {
          showNotification('❌ Failed to copy address', 'error');
          showCopyFeedback(button, false);
        });
    }
  }
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
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
  } else {
    button.innerHTML = '<i class="fas fa-times"></i> Failed';
    button.style.background = '#f44336';
    button.style.color = 'white';
  }
  
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

function copyContractAddress() {
  const contractCode = document.querySelector('.contract-code code');
  if (contractCode) {
    const address = contractCode.textContent.trim();
    copyToClipboard(address)
      .then(() => {
        showNotification('✅ $REBL (Type 3) contract address copied!', 'success');
      })
      .catch(() => {
        showNotification('❌ Failed to copy address', 'error');
      });
  }
}

// ============================================================
// NOTIFICATIONS
// ============================================================

function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
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
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ============================================================
// SMOOTH SCROLL
// ============================================================

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
    
    if (selector !== '#') {
      history.pushState(null, null, selector);
    }
  };
}

// ============================================================
// PARTICLES
// ============================================================

function initParticles() {
  const heroSection = document.querySelector('.page-hero--main');
  if (!heroSection || document.querySelector('.particle')) return;
  if (isMobile()) return;
  
  const particleContainer = heroSection.querySelector('.hero-particles');
  if (!particleContainer) return;
  
  const particleCount = Math.min(30, Math.floor(window.innerWidth / 30));
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
  return particle;
}

// ============================================================
// LOGO ANIMATIONS
// ============================================================

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

// ============================================================
// BACK TO TOP
// ============================================================

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
  toggleBackToTop();
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// MOBILE OPTIMIZATIONS
// ============================================================

function isMobile() {
  return window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function initMobileOptimizations() {
  if (!isMobile()) return;
  
  document.documentElement.style.setProperty('--animation-medium', '0.4s');
  document.documentElement.style.setProperty('--animation-slow', '0.6s');
  
  const particles = document.querySelectorAll('.particle');
  if (particles.length > 10) {
    for (let i = 10; i < particles.length; i++) {
      particles[i].remove();
    }
  }
  
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    if (isInViewport(img)) {
      img.loading = 'eager';
    }
  });
  
  optimizeTokenEcosystemForMobile();
  
  const bridgeTokens = document.querySelector('.bridge-tokens');
  const movingCoin = document.querySelector('.moving-coin');
  
  if (bridgeTokens && movingCoin && isMobile()) {
    const arrow = bridgeTokens.querySelector('.fa-arrow-right');
    if (arrow) {
      arrow.style.transform = 'rotate(90deg)';
    }
    movingCoin.style.animation = 'move-down 2.5s ease-in-out infinite';
  }
}

function optimizeTokenEcosystemForMobile() {
  if (!isMobile()) return;
  
  const ecosystemFlow = document.querySelector('.ecosystem-flow');
  if (!ecosystemFlow) return;
  
  const basePlatform = ecosystemFlow.querySelector('.base-platform');
  const solanaPlatform = ecosystemFlow.querySelector('.solana-platform');
  const bridgeAnimation = ecosystemFlow.querySelector('.bridge-animation');
  
  if (basePlatform && solanaPlatform && bridgeAnimation) {
    ecosystemFlow.innerHTML = '';
    
    const mobileLayout = document.createElement('div');
    mobileLayout.className = 'ecosystem-mobile-layout';
    mobileLayout.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
    `;
    
    const baseWrapper = document.createElement('div');
    baseWrapper.className = 'mobile-platform-wrapper';
    baseWrapper.appendChild(basePlatform);
    mobileLayout.appendChild(baseWrapper);
    
    const bridgeWrapper = document.createElement('div');
    bridgeWrapper.className = 'mobile-bridge-wrapper';
    bridgeWrapper.style.cssText = `
      display: flex;
      justify-content: center;
      width: 100%;
      padding: 1rem 0;
    `;
    
    bridgeAnimation.classList.add('mobile-bridge');
    bridgeWrapper.appendChild(bridgeAnimation);
    mobileLayout.appendChild(bridgeWrapper);
    
    const solanaWrapper = document.createElement('div');
    solanaWrapper.className = 'mobile-platform-wrapper';
    solanaWrapper.appendChild(solanaPlatform);
    mobileLayout.appendChild(solanaWrapper);
    
    ecosystemFlow.appendChild(mobileLayout);
    updateBridgeForMobile(bridgeAnimation);
  }
  
  const contractCodes = document.querySelectorAll('.contract-short');
  contractCodes.forEach(code => {
    const fullText = code.getAttribute('data-full') || code.textContent;
    if (fullText.length > 20) {
      const mobileText = `${fullText.substring(0, 8)}...${fullText.substring(fullText.length - 6)}`;
      code.textContent = mobileText;
    }
  });
}

function updateBridgeForMobile(bridgeElement) {
  const bridgeLine = bridgeElement.querySelector('.bridge-line');
  const bridgeContent = bridgeElement.querySelector('.bridge-content');
  
  if (bridgeLine && bridgeContent) {
    bridgeLine.style.cssText = `
      width: 3px;
      height: 60px;
      background: linear-gradient(to bottom, var(--rebel-gold), var(--rebel-blue));
      margin: 0 auto;
      border-radius: 3px;
    `;
    
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
    
    const bridgeText = bridgeContent.querySelector('span');
    if (bridgeText) {
      bridgeText.textContent = 'Cross-Chain';
    }
  }
}

function optimizeForMobile() {
  if (isMobile()) {
    const floatingElements = document.querySelectorAll('.floating-logo, .logo-3d');
    floatingElements.forEach(el => {
      el.style.animationDuration = '4s';
    });
    
    const bridgeElements = document.querySelectorAll('.bridge-animation, .bridge-particles');
    bridgeElements.forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }
  
  adjustTouchTargets();
}

function adjustTouchTargets() {
  const touchElements = document.querySelectorAll('.action-btn, .copy-btn, .view-btn, .wallet-btn, .cta-button');
  
  touchElements.forEach(el => {
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

// ============================================================
// TOUCH INTERACTIONS
// ============================================================

function initTouchInteractions() {
  if (isMobile()) {
    const contractAddresses = document.querySelectorAll('.contract-address code');
    
    contractAddresses.forEach(code => {
      let pressTimer;
      
      code.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
          const fullAddress = this.getAttribute('data-full') || this.textContent;
          copyToClipboard(fullAddress.trim())
            .then(() => showNotification('✅ Address copied!', 'success'))
            .catch(() => showNotification('❌ Copy failed', 'error'));
          
          this.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
          setTimeout(() => {
            this.style.backgroundColor = '';
          }, 500);
        }, 800);
      }, { passive: true });
      
      code.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
      }, { passive: true });
      
      code.addEventListener('touchmove', function() {
        clearTimeout(pressTimer);
      }, { passive: true });
    });
  }
  
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

// ============================================================
// LAZY LOADING
// ============================================================

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

// ============================================================
// PERFORMANCE OBSERVERS
// ============================================================

function initPerformanceObservers() {
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

// ============================================================
// WALLET DETECTION
// ============================================================

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

function initWalletDetection() {
  const walletType = detectWallet();
  const walletButtons = document.querySelectorAll('.wallet-action');
  
  walletButtons.forEach(button => {
    const isSolanaButton = button.textContent.includes('REBL') || 
                          button.onclick?.toString().includes('Solana');
    
    if (walletType === 'phantom' && isSolanaButton) {
      button.innerHTML = '<i class="fas fa-wallet"></i><span>Add to Phantom</span>';
    } else if (walletType === 'ethereum' && !isSolanaButton) {
      button.innerHTML = '<i class="fab fa-ethereum"></i><span>Add to MetaMask</span>';
    }
    
    button.addEventListener('click', function(e) {
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting...</span>';
      this.disabled = true;
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
      }, 3000);
    });
  });
}

// ============================================================
// CHAIN ANIMATION
// ============================================================

function initChainAnimation() {
  const bridgeTokens = document.querySelector('.bridge-tokens');
  if (!bridgeTokens) return;
  
  for (let i = 0; i < 3; i++) {
    const coin = document.createElement('div');
    coin.className = 'moving-coin';
    coin.style.animationDelay = `${i * 0.5}s`;
    coin.style.opacity = '0.6';
    bridgeTokens.appendChild(coin);
  }
}

// ============================================================
// VALUE CARD EFFECTS
// ============================================================

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

// ============================================================
// 3 ASSET TYPES DISPLAY
// ============================================================

function initAssetTypesDisplay() {
  console.log('🪙 Initializing 3 Asset Types display');
  
  // Update any elements showing "triple-asset" to "3 Asset Types"
  document.querySelectorAll('.triple-asset-text, .triple-asset-label').forEach(el => {
    el.textContent = el.textContent.replace(/triple-asset/gi, '3 Asset Types');
  });
  
  // Add type badges to asset cards if missing
  document.querySelectorAll('.asset-card').forEach((card, index) => {
    if (!card.querySelector('.asset-type-badge')) {
      const badge = document.createElement('div');
      badge.className = 'asset-type-badge';
      const types = ['TYPE 1', 'TYPE 2', 'TYPE 3'];
      const colors = ['#e3b87c', '#8b5cf6', '#fbbf24'];
      badge.textContent = types[index] || `TYPE ${index + 1}`;
      badge.style.cssText = `
        display: inline-block;
        padding: 0.2rem 0.8rem;
        border-radius: 20px;
        font-size: 0.6rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 0.5rem;
        background: ${colors[index] || '#e3b87c'}22;
        color: ${colors[index] || '#e3b87c'};
        border: 1px solid ${colors[index] || '#e3b87c'}44;
      `;
      card.insertBefore(badge, card.firstChild);
    }
  });
}

// ============================================================
// FORMULA ANIMATION
// ============================================================

function initFormulaAnimation() {
  const formula = document.querySelector('.asset-types-formula');
  if (!formula) return;
  
  // Add highlight animation to formula elements
  const elements = formula.querySelectorAll('.type-badge, .result, .arrow');
  elements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
      el.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
    }, 300 + (index * 150));
  });
  
  // Pulse the result
  const result = formula.querySelector('.result');
  if (result) {
    setInterval(() => {
      result.style.transform = 'scale(1.05)';
      setTimeout(() => {
        result.style.transform = 'scale(1)';
      }, 300);
    }, 3000);
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ============================================================
// CLEANUP
// ============================================================

function cleanupAnimations() {
  console.log('🧹 Cleaning up animations...');
  
  if (window.scrollAnimationObserver) {
    window.scrollAnimationObserver.disconnect();
    delete window.scrollAnimationObserver;
  }
  
  if (window.logoAnimationId) {
    cancelAnimationFrame(window.logoAnimationId);
    delete window.logoAnimationId;
  }
  
  if (window.animationFrameId) {
    cancelAnimationFrame(window.animationFrameId);
    delete window.animationFrameId;
  }
  
  if (window.particles && window.particles.length > 0) {
    window.particles.forEach(particle => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    delete window.particles;
  }
  
  if (window.mousemoveListener) {
    window.removeEventListener('mousemove', window.mousemoveListener);
    delete window.mousemoveListener;
  }
}

window.addEventListener('beforeunload', cleanupAnimations);
window.addEventListener('pagehide', cleanupAnimations);

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    cleanupAnimations();
  }
});

// ============================================================
// PAGE LOAD EVENTS
// ============================================================

window.addEventListener('load', function() {
  document.documentElement.classList.add('page-loaded');
  
  document.dispatchEvent(new CustomEvent('rebelinux:pageReady', {
    detail: {
      timestamp: Date.now(),
      page: 'index',
      version: '2.0'
    }
  }));
  
  console.log('✅ RebelInuX (3 Asset Types) Initialized Successfully');
});

document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    console.log('📱 Page became visible');
  }
});

window.addEventListener('error', function(e) {
  console.error('❌ Unhandled error:', e.error);
  
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: e.error?.message || 'Unknown error',
      fatal: true
    });
  }
});

// ============================================================
// EXPORTS
// ============================================================

window.RebelInuX = {
  initIndexPage,
  copyToClipboard,
  addToWallet,
  showNotification,
  scrollToElement: window.scrollToElement,
  toggleContractView,
  copyContractAddress,
  detectWallet,
  isMobile,
  version: '2.0'
};

// ============================================================
// ADDITIONAL STYLES
// ============================================================

const valueCardStyles = `
  .value-card {
    --mouse-x: 50%;
    --mouse-y: 50%;
    position: relative;
    overflow: hidden;
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
  
  .asset-card .asset-type-badge {
    display: inline-block;
    padding: 0.2rem 0.8rem;
    border-radius: 20px;
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }
`;

if (!document.querySelector('#rebelinux-styles')) {
  const style = document.createElement('style');
  style.id = 'rebelinux-styles';
  style.textContent = valueCardStyles;
  document.head.appendChild(style);
}

console.log('🪙 RebelInuX 3 Asset Types JS loaded successfully');

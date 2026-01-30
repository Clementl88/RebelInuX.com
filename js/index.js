//// ===== REBELINUX INDEX JS - OPTIMIZED VERSION =====
// Professional Crypto Project - Mobile Optimized
// Modular, Maintainable, and High Performance

// ===== MAIN INITIALIZATION =====
(() => {
  'use strict';
  
  // ===== CONFIGURATION =====
  const CONFIG = {
    animationDelay: 100,
    mobileBreakpoint: 768,
    scrollOffset: 100,
    particleCount: 30,
    counterDuration: 2000,
    notificationTimeout: 5000,
    longPressDelay: 800
  };
  
  // ===== STATE MANAGEMENT =====
  const STATE = {
    isInitialized: false,
    isMobile: null,
    walletConnected: false,
    activeAnimations: new Set()
  };
  
  // ===== DOM CACHE =====
  const DOM = {
    loader: null,
    backToTop: null,
    animatedElements: null,
    copyButtons: null,
    walletButtons: null,
    particlesContainer: null
  };
  
  // ===== CORE UTILITIES =====
  
  class Utilities {
    static isMobile() {
      if (STATE.isMobile === null) {
        STATE.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint || 
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
      return STATE.isMobile;
    }
    
    static debounce(func, wait) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    }
    
    static throttle(func, limit) {
      let inThrottle;
      return (...args) => {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
    
    static isInViewport(element, threshold = 0.1) {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold &&
        rect.left <= windowWidth * (1 - threshold) &&
        rect.right >= windowWidth * threshold
      );
    }
    
    static formatNumber(num) {
      if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
      if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
      return Math.round(num).toString();
    }
  }
  
  // ===== INITIALIZATION MANAGER =====
  
  class InitializationManager {
    static async initialize() {
      console.log('🚀 RebelInuX Index Page Initializing...');
      
      // Cache DOM elements
      this.cacheDOM();
      
      // Start initialization queue
      await this.runInitializationQueue();
      
      // Start performance monitoring
      PerformanceMonitor.start();
      
      console.log('✅ RebelInuX Index Page Initialized Successfully');
    }
    
    static cacheDOM() {
      DOM.loader = document.getElementById('loader');
      DOM.backToTop = document.getElementById('backToTop');
      DOM.particlesContainer = document.querySelector('.hero-particles');
      DOM.animatedElements = document.querySelectorAll(
        '.value-card, .comparison-card, .step-card, .stat-card, ' +
        '.token-card, .logo-card, .key-takeaway, .contract-emphasis, ' +
        '.feature-card, .process-step, .chain-node'
      );
      DOM.copyButtons = document.querySelectorAll('.copy-btn, .copy-contract-btn');
      DOM.walletButtons = document.querySelectorAll('.wallet-action, .wallet-btn');
    }
    
    static async runInitializationQueue() {
      const initQueue = [
        Loader.init,
        ScrollAnimations.init,
        StatsCounters.init,
        ClipboardManager.init,
        ContractViews.init,
        SmoothScroll.init,
        ParticleSystem.init,
        LogoAnimations.init,
        BackToTop.init,
        MobileOptimizer.init,
        TouchInteractions.init,
        LazyLoader.init,
        WalletManager.init
      ];
      
      for (let i = 0; i < initQueue.length; i++) {
        try {
          await this.delayedExecution(initQueue[i], i * CONFIG.animationDelay);
        } catch (error) {
          console.warn(`⚠️ Failed to initialize ${initQueue[i].name}:`, error);
        }
      }
      
      STATE.isInitialized = true;
      document.dispatchEvent(new CustomEvent('rebelinux:pageReady', {
        detail: { timestamp: Date.now(), page: 'index' }
      }));
    }
    
    static delayedExecution(func, delay) {
      return new Promise(resolve => {
        setTimeout(() => {
          func();
          resolve();
        }, delay);
      });
    }
  }
  
  // ===== LOADER =====
  
  class Loader {
    static init() {
      if (!DOM.loader) return;
      
      const progressBar = DOM.loader.querySelector('.progress-bar');
      if (progressBar) {
        this.simulateProgress(progressBar);
      } else {
        this.simpleLoader();
      }
    }
    
    static simulateProgress(progressBar) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
          clearInterval(interval);
          this.hideLoader();
        }
      }, 100);
    }
    
    static simpleLoader() {
      setTimeout(() => this.hideLoader(), 1500);
    }
    
    static hideLoader() {
      DOM.loader.classList.add('loaded');
      document.body.classList.add('loaded');
      document.dispatchEvent(new CustomEvent('pageLoaded', {
        detail: { timestamp: Date.now() }
      }));
    }
  }
  
  // ===== SCROLL ANIMATIONS =====
  
  class ScrollAnimations {
    static init() {
      if (!DOM.animatedElements.length) return;
      
      this.setupObservers();
      
      // Floating logo animation for desktop
      if (!Utilities.isMobile()) {
        this.initFloatingLogo();
      }
    }
    
    static setupObservers() {
      const observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        { threshold: 0.1, rootMargin: '50px' }
      );
      
      DOM.animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
      });
    }
    
    static handleIntersection(entries) {
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
          }, index * CONFIG.animationDelay);
          
          this.observer.unobserve(entry.target);
        }
      });
    }
    
    static initFloatingLogo() {
      const floatingLogo = document.querySelector('.logo-3d');
      if (!floatingLogo) return;
      
      let mouseX = 0, mouseY = 0;
      let logoX = 0, logoY = 0;
      
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / 25;
        mouseY = (e.clientY - window.innerHeight / 2) / 25;
      });
      
      const animate = () => {
        logoX += (mouseX - logoX) * 0.1;
        logoY += (mouseY - logoY) * 0.1;
        
        floatingLogo.style.transform = 
          `translateY(-20px) rotateY(${logoX}deg) rotateX(${logoY}deg)`;
        
        STATE.activeAnimations.add(animate);
        requestAnimationFrame(animate);
      };
      
      animate();
    }
  }
  
  // ===== STATS COUNTERS =====
  
  class StatsCounters {
    static init() {
      const statValues = document.querySelectorAll('.stat-value[data-target]');
      if (!statValues.length) return;
      
      const observer = new IntersectionObserver(
        this.handleCounterIntersection.bind(this),
        { threshold: 0.5, rootMargin: '100px' }
      );
      
      statValues.forEach(stat => observer.observe(stat));
    }
    
    static handleCounterIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          const element = entry.target;
          const target = parseFloat(element.getAttribute('data-target'));
          const prefix = element.getAttribute('data-prefix') || '';
          const suffix = element.getAttribute('data-suffix') || '';
          
          this.animateCounter(element, target, prefix, suffix);
          element.classList.add('animated');
          this.observer.unobserve(element);
        }
      });
    }
    
    static animateCounter(element, target, prefix, suffix) {
      const duration = CONFIG.counterDuration;
      const startTime = performance.now();
      const startValue = parseFloat(element.textContent) || 0;
      
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (target - startValue) * easeProgress;
        
        element.textContent = prefix + Utilities.formatNumber(current) + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = prefix + Utilities.formatNumber(target) + suffix;
        }
      };
      
      requestAnimationFrame(update);
    }
  }
  
  // ===== CLIPBOARD MANAGER =====
  
  class ClipboardManager {
    static init() {
      if (!DOM.copyButtons.length) return;
      
      DOM.copyButtons.forEach(button => {
        button.addEventListener('click', this.handleCopyClick.bind(this));
      });
    }
    
    static async handleCopyClick(e) {
      e.preventDefault();
      const button = e.currentTarget;
      
      let contractText = '';
      
      if (button.classList.contains('copy-contract-btn')) {
        contractText = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
      } else if (button.closest('.contract-address')) {
        const codeElement = button.closest('.contract-address')?.querySelector('code');
        if (codeElement) {
          contractText = codeElement.getAttribute('data-full') || codeElement.textContent;
          
          const isSolana = contractText.length > 32;
          const tokenType = isSolana ? 'Solana ($REBL)' : 'Base ($rebelinux)';
          
          try {
            await this.copyToClipboard(contractText.trim());
            Notification.show(`${tokenType} address copied!`, 'success');
            this.showCopyFeedback(button, true);
            return;
          } catch {
            Notification.show('Failed to copy address', 'error');
            this.showCopyFeedback(button, false);
            return;
          }
        }
      }
      
      if (contractText) {
        try {
          await this.copyToClipboard(contractText.trim());
          this.showCopyFeedback(button, true);
        } catch {
          this.showCopyFeedback(button, false);
        }
      }
    }
    
    static async copyToClipboard(text) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.cssText = 'position:fixed;opacity:0';
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
    
    static showCopyFeedback(button, success) {
      const originalHTML = button.innerHTML;
      const originalBackground = button.style.background;
      const originalColor = button.style.color;
      
      if (success) {
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        Notification.show('Contract address copied to clipboard!', 'success');
      } else {
        button.innerHTML = '<i class="fas fa-times"></i> Failed';
        button.style.background = '#f44336';
        button.style.color = 'white';
        Notification.show('Failed to copy address', 'error');
      }
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = originalBackground;
        button.style.color = originalColor;
      }, 2000);
    }
  }
  
  // ===== CONTRACT VIEWS =====
  
  class ContractViews {
    static init() {
      const viewButtons = document.querySelectorAll('.view-btn');
      viewButtons.forEach(button => {
        button.addEventListener('click', this.toggleView.bind(this));
      });
    }
    
    static toggleView(e) {
      e.preventDefault();
      const button = e.currentTarget;
      const contractAddress = button.closest('.contract-address');
      const codeElement = contractAddress?.querySelector('code');
      
      if (codeElement) {
        const isExpanded = codeElement.classList.toggle('expanded');
        const icon = button.querySelector('i');
        
        if (isExpanded) {
          icon.className = 'fas fa-compress-alt';
          button.setAttribute('title', 'Collapse address');
        } else {
          icon.className = 'fas fa-expand-alt';
          button.setAttribute('title', 'Expand address');
        }
      }
    }
  }
  
  // ===== SMOOTH SCROLL =====
  
  class SmoothScroll {
    static init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', this.handleAnchorClick.bind(this));
      });
      
      // Expose to global scope
      window.scrollToElement = this.scrollToElement;
    }
    
    static handleAnchorClick(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || !href.startsWith('#') || !document.querySelector(href)) {
        return;
      }
      
      e.preventDefault();
      this.scrollToElement(href);
    }
    
    static scrollToElement(selector) {
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
    }
  }
  
  // ===== PARTICLE SYSTEM =====
  
  class ParticleSystem {
    static init() {
      if (!DOM.particlesContainer || Utilities.isMobile()) return;
      
      this.injectStyles();
      this.createParticles();
    }
    
    static injectStyles() {
      if (document.querySelector('#particle-styles')) return;
      
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
    
    static createParticles() {
      const particleCount = Math.min(CONFIG.particleCount, Math.floor(window.innerWidth / 30));
      
      for (let i = 0; i < particleCount; i++) {
        this.createParticle();
      }
    }
    
    static createParticle() {
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
      
      DOM.particlesContainer.appendChild(particle);
    }
  }
  
  // ===== LOGO ANIMATIONS =====
  
  class LogoAnimations {
    static init() {
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
  }
  
  // ===== BACK TO TOP =====
  
  class BackToTop {
    static init() {
      if (!DOM.backToTop) return;
      
      window.addEventListener('scroll', Utilities.throttle(this.toggleVisibility.bind(this), 100));
      DOM.backToTop.addEventListener('click', this.scrollToTop.bind(this));
      
      this.toggleVisibility();
    }
    
    static toggleVisibility() {
      if (window.pageYOffset > 500) {
        DOM.backToTop.classList.add('visible');
      } else {
        DOM.backToTop.classList.remove('visible');
      }
    }
    
    static scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
  
  // ===== MOBILE OPTIMIZER =====
  
  class MobileOptimizer {
    static init() {
      if (!Utilities.isMobile()) return;
      
      this.optimizeAnimations();
      this.optimizeParticles();
      this.optimizeImages();
      this.optimizeTokenEcosystem();
      this.adjustTouchTargets();
    }
    
    static optimizeAnimations() {
      document.documentElement.style.setProperty('--animation-medium', '0.4s');
      document.documentElement.style.setProperty('--animation-slow', '0.6s');
      
      const floatingElements = document.querySelectorAll('.floating-logo, .logo-3d');
      floatingElements.forEach(el => {
        el.style.animationDuration = '4s';
      });
      
      const bridgeElements = document.querySelectorAll('.bridge-animation, .bridge-particles');
      bridgeElements.forEach(el => {
        el.style.animationPlayState = 'paused';
      });
    }
    
    static optimizeParticles() {
      const particles = document.querySelectorAll('.particle');
      if (particles.length > 10) {
        for (let i = 10; i < particles.length; i++) {
          particles[i].remove();
        }
      }
    }
    
    static optimizeImages() {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (Utilities.isInViewport(img)) {
          img.loading = 'eager';
        }
      });
    }
    
    static optimizeTokenEcosystem() {
      const ecosystemFlow = document.querySelector('.ecosystem-flow');
      if (!ecosystemFlow) return;
      
      const basePlatform = ecosystemFlow.querySelector('.base-platform');
      const solanaPlatform = ecosystemFlow.querySelector('.solana-platform');
      const bridgeAnimation = ecosystemFlow.querySelector('.bridge-animation');
      
      if (basePlatform && solanaPlatform && bridgeAnimation) {
        this.rearrangeForMobile(ecosystemFlow, basePlatform, solanaPlatform, bridgeAnimation);
      }
      
      // Optimize contract addresses
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
    
    static rearrangeForMobile(container, basePlatform, solanaPlatform, bridgeAnimation) {
      container.innerHTML = '';
      
      const mobileLayout = document.createElement('div');
      mobileLayout.className = 'ecosystem-mobile-layout';
      mobileLayout.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
      `;
      
      // Add platforms and bridge in proper order
      mobileLayout.appendChild(this.createPlatformWrapper(basePlatform));
      mobileLayout.appendChild(this.createBridgeWrapper(bridgeAnimation));
      mobileLayout.appendChild(this.createPlatformWrapper(solanaPlatform));
      
      container.appendChild(mobileLayout);
      this.updateBridgeForMobile(bridgeAnimation);
    }
    
    static createPlatformWrapper(platform) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mobile-platform-wrapper';
      wrapper.appendChild(platform);
      return wrapper;
    }
    
    static createBridgeWrapper(bridge) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mobile-bridge-wrapper';
      wrapper.style.cssText = `
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 1rem 0;
      `;
      bridge.classList.add('mobile-bridge');
      wrapper.appendChild(bridge);
      return wrapper;
    }
    
    static updateBridgeForMobile(bridgeElement) {
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
    
    static adjustTouchTargets() {
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
        
        el.addEventListener('touchstart', () => {
          this.style.transform = 'scale(0.98)';
          this.style.opacity = '0.9';
        }, { passive: true });
        
        el.addEventListener('touchend', () => {
          this.style.transform = '';
          this.style.opacity = '';
        }, { passive: true });
      });
    }
  }
  
  // ===== TOUCH INTERACTIONS =====
  
  class TouchInteractions {
    static init() {
      if (Utilities.isMobile()) {
        this.setupLongPressCopy();
      }
      
      this.setupTouchFeedback();
    }
    
    static setupLongPressCopy() {
      const contractAddresses = document.querySelectorAll('.contract-address code');
      
      contractAddresses.forEach(code => {
        let pressTimer;
        
        code.addEventListener('touchstart', (e) => {
          pressTimer = setTimeout(() => {
            const fullAddress = this.getAttribute('data-full') || this.textContent;
            ClipboardManager.copyToClipboard(fullAddress.trim())
              .then(() => Notification.show('Address copied!', 'success'))
              .catch(() => Notification.show('Copy failed', 'error'));
            
            this.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
            setTimeout(() => {
              this.style.backgroundColor = '';
            }, 500);
          }, CONFIG.longPressDelay);
        }, { passive: true });
        
        code.addEventListener('touchend', () => clearTimeout(pressTimer), { passive: true });
        code.addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });
      });
    }
    
    static setupTouchFeedback() {
      const touchElements = document.querySelectorAll('button, a, .token-card, .value-card');
      
      touchElements.forEach(el => {
        el.addEventListener('touchstart', () => {
          this.classList.add('touch-active');
        }, { passive: true });
        
        el.addEventListener('touchend', () => {
          this.classList.remove('touch-active');
        }, { passive: true });
      });
    }
  }
  
  // ===== LAZY LOADER =====
  
  class LazyLoader {
    static init() {
      if (!('IntersectionObserver' in window)) return;
      
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver(this.handleImageIntersection.bind(this));
      
      lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    static handleImageIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          this.observer.unobserve(img);
        }
      });
    }
  }
  
  // ===== WALLET MANAGER =====
  
  class WalletManager {
    static init() {
      if (!DOM.walletButtons.length) return;
      
      this.detectWalletType();
      this.setupWalletButtons();
    }
    
   // In WalletManager class
static detectWalletType() {
  const wallets = {
    phantom: window.phantom?.solana || window.solana,
    ethereum: typeof window.ethereum !== 'undefined',
    solflare: window.solflare,
    backpack: window.backpack,
    metamask: window.ethereum?.isMetaMask,
    coinbase: window.ethereum?.isCoinbaseWallet,
    trustwallet: window.ethereum?.isTrust,
    rabby: window.ethereum?.isRabby
  };
  
  if (wallets.phantom) {
    console.log('🔍 Phantom wallet detected');
    return 'phantom';
  } else if (wallets.solflare) {
    console.log('🔍 Solflare wallet detected');
    return 'solflare';
  } else if (wallets.backpack) {
    console.log('🔍 Backpack wallet detected');
    return 'backpack';
  } else if (wallets.ethereum) {
    // Detect specific Ethereum wallet
    if (wallets.metamask) {
      console.log('🔍 MetaMask wallet detected');
      return 'metamask';
    } else if (wallets.coinbase) {
      console.log('🔍 Coinbase Wallet detected');
      return 'coinbase';
    } else if (wallets.trustwallet) {
      console.log('🔍 Trust Wallet detected');
      return 'trustwallet';
    } else if (wallets.rabby) {
      console.log('🔍 Rabby Wallet detected');
      return 'rabby';
    }
    console.log('🔍 Ethereum wallet detected (unspecified)');
    return 'ethereum';
  } else {
    console.log('🔍 No wallet detected');
    return 'none';
  }
}

static getWalletName(type) {
  const walletNames = {
    phantom: 'Phantom',
    solflare: 'Solflare',
    backpack: 'Backpack',
    metamask: 'MetaMask',
    coinbase: 'Coinbase Wallet',
    trustwallet: 'Trust Wallet',
    rabby: 'Rabby',
    ethereum: 'Web3 Wallet'
  };
  return walletNames[type] || 'Wallet';
}
    
static setupWalletButtons() {
  const walletType = this.detectWalletType();
  
  DOM.walletButtons.forEach(button => {
    const originalHTML = button.innerHTML;
    const originalClass = button.className;
    
    // Determine which token this button is for
    const isSolanaButton = button.textContent.includes('REBL') || 
                          button.onclick?.toString().includes('Solana');
    
    // Update button text and icon based on detected wallet
    let newHTML = originalHTML;
    let walletName = '';
    
    if (isSolanaButton) {
      switch(walletType) {
        case 'phantom':
          newHTML = '<i class="fas fa-ghost"></i><span>Add to Phantom</span>';
          walletName = 'Phantom';
          break;
        case 'solflare':
          newHTML = '<i class="fas fa-fire"></i><span>Add to Solflare</span>';
          walletName = 'Solflare';
          break;
        case 'backpack':
          newHTML = '<i class="fas fa-briefcase"></i><span>Add to Backpack</span>';
          walletName = 'Backpack';
          break;
        default:
          newHTML = '<i class="fas fa-wallet"></i><span>Add to Solana Wallet</span>';
          walletName = 'Solana Wallet';
      }
    } else {
      // Base/Ethereum chain button
      switch(walletType) {
        case 'metamask':
          newHTML = '<i class="fab fa-metamask"></i><span>Add to MetaMask</span>';
          walletName = 'MetaMask';
          break;
        case 'coinbase':
          newHTML = '<i class="fab fa-bitcoin"></i><span>Add to Coinbase Wallet</span>';
          walletName = 'Coinbase Wallet';
          break;
        case 'trustwallet':
          newHTML = '<i class="fas fa-shield-alt"></i><span>Add to Trust Wallet</span>';
          walletName = 'Trust Wallet';
          break;
        default:
          newHTML = '<i class="fab fa-ethereum"></i><span>Add to Wallet</span>';
          walletName = 'Wallet';
      }
    }
    
    button.innerHTML = newHTML;
    
    // Store original data for reset
    button.dataset.originalHTML = originalHTML;
    button.dataset.originalClass = originalClass;
    button.dataset.walletName = walletName;
    
    // Enhanced click handler with proper error handling
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      
      if (button.disabled || button.classList.contains('loading')) return;
      
      // Store current state
      const currentHTML = button.innerHTML;
      const currentClass = button.className;
      
      // Set loading state
      button.classList.add('loading');
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting...</span>';
      button.disabled = true;
      
      try {
        // Determine which function to call
        if (isSolanaButton) {
          await this.addSolanaToken(
            'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump', 
            'REBL', 
            9
          );
        } else {
          await this.addBaseToken(
            '0xf95beeF6439ec38fA757238Cdec8417ABDA536bd',
            'rebelinux',
            18
          );
        }
        
        // Success state
        button.classList.remove('loading');
        button.classList.add('success');
        button.innerHTML = '<i class="fas fa-check"></i><span>Added!</span>';
        
      } catch (error) {
        console.error('Wallet addition error:', error);
        
        // Error state
        button.classList.remove('loading');
        button.classList.add('error');
        button.innerHTML = '<i class="fas fa-times"></i><span>Failed</span>';
        
        // Show error notification
        Notification.show(error.message || 'Failed to add token to wallet', 'error');
      }
      
      // Reset button after delay
      setTimeout(() => {
        button.disabled = false;
        button.classList.remove('loading', 'success', 'error');
        button.innerHTML = currentHTML;
        button.className = currentClass;
      }, 3000);
    });
  });
}
    
    static async addTokenToWallet(contractAddress, symbol, decimals, network) {
      console.log(`Adding ${symbol} to wallet (${network} network)`);
      
      switch (network) {
        case 'Solana':
          await this.addSolanaToken(contractAddress, symbol, decimals);
          break;
        case 'Base':
          await this.addBaseToken(contractAddress, symbol, decimals);
          break;
        default:
          await this.addEthereumToken(contractAddress, symbol, decimals, network);
      }
    }
    
static async addSolanaToken(contractAddress, symbol, decimals) {
  const walletType = this.detectWalletType();
  let wallet;
  
  switch(walletType) {
    case 'phantom':
      wallet = window.phantom?.solana || window.solana;
      break;
    case 'solflare':
      wallet = window.solflare;
      break;
    case 'backpack':
      wallet = window.backpack;
      break;
    default:
      wallet = null;
  }
  
  if (!wallet) {
    const walletName = this.getWalletName(walletType);
    const message = `Please install a Solana wallet (Phantom, Solflare, or Backpack) for ${symbol}`;
    
    Notification.show(message, 'warning');
    
    // Create wallet selection modal
    setTimeout(() => {
      this.showSolanaWalletSelector(contractAddress, symbol);
    }, 1500);
    throw new Error('No Solana wallet detected');
  }
  
  try {
    // Try to connect first
    const connectionResponse = await wallet.connect({ onlyIfTrusted: true });
    console.log('Wallet connected:', connectionResponse);
    
    // Show instructions for adding token
    this.showSolanaInstructions(contractAddress, symbol, walletType);
    
  } catch (connectError) {
    console.log('Wallet not connected, requesting connection...');
    
    try {
      // Request connection
      await wallet.connect();
      Notification.show(`${this.getWalletName(walletType)} connected! Now add the token`, 'success');
      
      // Show instructions after connection
      setTimeout(() => {
        this.showSolanaInstructions(contractAddress, symbol, walletType);
      }, 1000);
      
    } catch (connectionError) {
      console.error('Connection error:', connectionError);
      
      if (connectionError.code === 4001) {
        throw new Error('Connection rejected by user');
      } else {
        throw new Error(`Failed to connect wallet: ${connectionError.message}`);
      }
    }
  }
}

static showSolanaWalletSelector(contractAddress, symbol) {
  const modal = document.createElement('div');
  modal.className = 'wallet-selector-modal';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fas fa-wallet"></i> Add ${symbol} to Wallet</h3>
          <button class="modal-close" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <p>To add ${symbol}, you need a Solana wallet. Choose one to install:</p>
          
          <div class="wallet-options">
            <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" 
               class="wallet-option">
              <div class="wallet-icon">
                <i class="fas fa-ghost"></i>
              </div>
              <div class="wallet-info">
                <h4>Phantom</h4>
                <p>Most popular Solana wallet</p>
              </div>
              <i class="fas fa-external-link-alt"></i>
            </a>
            
            <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer"
               class="wallet-option">
              <div class="wallet-icon">
                <i class="fas fa-fire"></i>
              </div>
              <div class="wallet-info">
                <h4>Solflare</h4>
                <p>Feature-rich Solana wallet</p>
              </div>
              <i class="fas fa-external-link-alt"></i>
            </a>
            
            <a href="https://www.backpack.app/" target="_blank" rel="noopener noreferrer"
               class="wallet-option">
              <div class="wallet-icon">
                <i class="fas fa-briefcase"></i>
              </div>
              <div class="wallet-info">
                <h4>Backpack</h4>
                <p>Wallet with built-in exchange</p>
              </div>
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
          
          <div class="modal-actions">
            <button class="btn-secondary copy-address-btn">
              <i class="fas fa-copy"></i> Copy Address for Later
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal
  modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) {
      modal.remove();
    }
  });
  
  // Copy address button
  modal.querySelector('.copy-address-btn').addEventListener('click', async () => {
    try {
      await ClipboardManager.copyToClipboard(contractAddress);
      Notification.show('Address copied! Install a wallet and paste this address', 'success');
      modal.remove();
    } catch (error) {
      Notification.show('Failed to copy address', 'error');
    }
  });
  
  // Escape key to close
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  
  document.addEventListener('keydown', handleEscape);
}
    static createInstructionModal(contractAddress, symbol, walletType = 'phantom') {
  const modal = document.createElement('div');
  modal.className = 'token-instructions-modal';
  
  const walletName = this.getWalletName(walletType);
  const walletIcon = {
    phantom: 'fa-ghost',
    solflare: 'fa-fire',
    backpack: 'fa-briefcase',
    metamask: 'fa-fox',
    coinbase: 'fa-coinbase',
    trustwallet: 'fa-shield-alt',
    rabby: 'fa-paw',
    ethereum: 'fa-ethereum'
  }[walletType] || 'fa-wallet';
  
  const isSolana = ['phantom', 'solflare', 'backpack'].includes(walletType);
  
  const instructions = isSolana ? [
    `Open <strong>${walletName}</strong> on your device`,
    `Tap the <strong style="color: var(--rebel-gold);">+</strong> button in your tokens list`,
    `Select <strong>"Add Token"</strong>`,
    `Paste this address in the token field:`,
    `Tap <strong>"Add"</strong> to complete`
  ] : [
    `Open <strong>${walletName}</strong> on your device`,
    `Tap the <strong>"Import Tokens"</strong> or "Add Token" option`,
    `Select <strong>"Custom Token"</strong>`,
    `Paste this address in the token address field:`,
    `Tap <strong>"Import"</strong> or "Add" to complete`
  ];
  
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <i class="fas ${walletIcon}"></i>
            Add ${symbol} to ${walletName}
          </h3>
          <button class="modal-close" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <ol class="instructions-list">
            ${instructions.map((step, index) => `
              <li class="instruction-step">
                ${index === 3 ? `
                  <span>${step}</span>
                  <div class="address-display">
                    <code>${contractAddress}</code>
                    <button class="copy-address-btn-sm" 
                            onclick="ClipboardManager.copyToClipboard('${contractAddress}')"
                            title="Copy address">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                ` : `<span>${step}</span>`}
              </li>
            `).join('')}
          </ol>
          
          <div class="modal-actions">
            <button class="btn-primary copy-again-btn"
                    onclick="ClipboardManager.copyToClipboard('${contractAddress}')">
              <i class="fas fa-copy"></i> Copy Address Again
            </button>
            
            <button class="btn-secondary switch-wallet-btn">
              <i class="fas fa-sync-alt"></i> Switch Wallet Type
            </button>
          </div>
          
          <div class="quick-actions">
            <button class="btn-outline qr-btn" onclick="this.showQRCode('${contractAddress}')">
              <i class="fas fa-qrcode"></i> Show QR Code
            </button>
            
            <button class="btn-outline test-btn" onclick="this.testTokenAddition('${contractAddress}', '${symbol}')">
              <i class="fas fa-vial"></i> Test Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
  modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) modal.remove();
  });
  
  // Switch wallet button
  modal.querySelector('.switch-wallet-btn').addEventListener('click', () => {
    modal.remove();
    this.showSolanaWalletSelector(contractAddress, symbol);
  });
  
  // Close on escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Auto-copy address
  setTimeout(() => {
    ClipboardManager.copyToClipboard(contractAddress)
      .then(() => Notification.show(`Address copied to clipboard!`, 'success'))
      .catch(() => Notification.show('Failed to copy address', 'error'));
  }, 300);
}
    static async addBaseToken(contractAddress, symbol, decimals) {
      if (typeof window.ethereum !== 'undefined') {
        const baseChainId = '0x2105';
        
        try {
          const currentChainId = await ethereum.request({ method: 'eth_chainId' });
          
          if (currentChainId === baseChainId) {
            await this.addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
          } else {
            await this.switchToBaseChain(contractAddress, symbol, decimals);
          }
        } catch (error) {
          console.error('Error checking chain:', error);
          Notification.show('Failed to check network. Please ensure your wallet is connected.', 'error');
        }
      } else {
        Notification.show(`Please install MetaMask or another Web3 wallet for ${symbol}`, 'warning');
        setTimeout(() => {
          if (confirm('MetaMask is required for Base chain tokens. Install now?')) {
            window.open('https://metamask.io/', '_blank');
          }
        }, 1000);
      }
    }
    
    static async switchToBaseChain(contractAddress, symbol, decimals) {
      if (!confirm(`To add ${symbol}, you need to switch to Base network. Switch now?`)) {
        return;
      }
      
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }],
        });
        
        setTimeout(() => {
          this.addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
        }, 1000);
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x2105',
                chainName: 'Base Mainnet',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org']
              }]
            });
            
            setTimeout(() => {
              this.addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
            }, 1000);
          } catch (addError) {
            console.error('Error adding Base chain:', addError);
            Notification.show('Failed to add Base network to wallet', 'error');
          }
        } else {
          console.error('Error switching to Base:', switchError);
          Notification.show('Failed to switch to Base network', 'error');
        }
      }
    }
    
    static async addTokenViaEthereum(contractAddress, symbol, decimals, network) {
      const tokenImages = {
        'rebelinux': 'https://rebelinux.fun/images/rebelinux_logo/$rebelinux%20SVG%20(4).svg',
        'REBL': 'https://rebelinux.fun/images/Logo_REBL.svg'
      };
      
      try {
        const success = await ethereum.request({
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
        });
        
        if (success) {
          Notification.show(`${symbol} added to wallet successfully!`, 'success');
        } else {
          Notification.show(`Failed to add ${symbol} to wallet`, 'error');
        }
      } catch (error) {
        console.error('Error adding token:', error);
        Notification.show(`Error adding ${symbol}: ${error.message}`, 'error');
      }
    }
    
    static showSolanaInstructions(contractAddress, symbol) {
      ClipboardManager.copyToClipboard(contractAddress)
        .then(() => {
          Notification.show(`${symbol} contract address copied!`, 'success');
          this.createInstructionModal(contractAddress, symbol);
        })
        .catch(() => {
          Notification.show('Failed to copy address', 'error');
        });
    }
    
    static createInstructionModal(contractAddress, symbol) {
      const modal = document.createElement('div');
      modal.className = 'token-instructions-modal';
      modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(5px);">
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
              <button onclick="ClipboardManager.copyToClipboard('${contractAddress}').then(() => Notification.show('Address copied again!', 'success'))" 
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
    }
  }
  
  // ===== NOTIFICATION SYSTEM =====
  
  class Notification {
    static show(message, type = 'info') {
      this.removeExisting();
      
      const notification = this.createNotificationElement(message, type);
      document.body.appendChild(notification);
      
      this.injectStyles();
      this.autoRemove(notification);
    }
    
    static removeExisting() {
      const existing = document.querySelector('.notification');
      if (existing) {
        existing.remove();
      }
    }
    
    static createNotificationElement(message, type) {
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
        background: ${this.getBackgroundColor(type)};
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
      
      return notification;
    }
    
    static getBackgroundColor(type) {
      const colors = {
        success: 'rgba(76, 175, 80, 0.95)',
        error: 'rgba(244, 67, 54, 0.95)',
        warning: 'rgba(255, 193, 7, 0.95)',
        info: 'rgba(33, 150, 243, 0.95)'
      };
      return colors[type] || colors.info;
    }
    
    static injectStyles() {
      if (document.querySelector('#notification-styles')) return;
      
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
    
    static autoRemove(notification) {
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, CONFIG.notificationTimeout);
    }
  }
  
  // ===== PERFORMANCE MONITOR =====
  
  class PerformanceMonitor {
    static start() {
      if (!window.performance) return;
      
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`📊 Page loaded in ${loadTime}ms`);
      
      if (loadTime > 3000) {
        console.warn('⚠️ Page load time is slow, consider optimization');
      }
      
      this.observeLongTasks();
      this.observeLayoutShifts();
    }
    
    static observeLongTasks() {
      if (!('PerformanceObserver' in window)) return;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.log(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
    
    static observeLayoutShifts() {
      if (!('LayoutShiftObserver' in window)) return;
      
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
  
  // ===== GLOBAL EXPORTS =====
  
  // ===== GLOBAL EXPORTS =====

window.RebelInuX = {
  initIndexPage: InitializationManager.initialize,
  copyToClipboard: ClipboardManager.copyToClipboard,
  addTokenToWallet: WalletManager.addTokenToWallet, // Add this line
  addToWallet: WalletManager.addTokenToWallet,
  showNotification: Notification.show,
  scrollToElement: SmoothScroll.scrollToElement,
  isMobile: Utilities.isMobile
};
  
  // ===== EVENT HANDLERS =====
  
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(InitializationManager.initialize, 300);
  });
  
  window.addEventListener('load', () => {
    document.documentElement.classList.add('page-loaded');
  });
  
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('📱 Page became visible');
    }
  });
  
  window.addEventListener('error', (e) => {
    console.error('❌ Unhandled error:', e.error);
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: e.error.message,
        fatal: true
      });
    }
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Unhandled promise rejection:', e.reason);
  });
  
 // Cleanup animations on page unload
  window.addEventListener('beforeunload', () => {
    STATE.activeAnimations.forEach(id => cancelAnimationFrame(id));
  });

  // ===== GLOBAL HELPER FUNCTIONS =====
  window.copyContractAddress = function() {
    const address = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    ClipboardManager.copyToClipboard(address)
      .then(() => {
        Notification.show('Contract address copied!', 'success');
      })
      .catch(() => {
        Notification.show('Failed to copy address', 'error');
      });
  };

  window.addTokenToWallet = function(contractAddress, symbol, decimals, network) {
    if (window.RebelInuX && window.RebelInuX.addTokenToWallet) {
      window.RebelInuX.addTokenToWallet(contractAddress, symbol, decimals, network);
    } else {
      console.error('RebelInuX wallet manager not initialized');
      Notification.show('Please wait for page to fully load', 'error');
      
      // Fallback: Try to initialize and retry
      setTimeout(() => {
        if (window.RebelInuX && window.RebelInuX.addTokenToWallet) {
          window.RebelInuX.addTokenToWallet(contractAddress, symbol, decimals, network);
        } else {
          Notification.show('Wallet functionality not available', 'error');
        }
      }, 1000);
    }
  };

  window.addToWallet = function(contractAddress) {
    // Determine which token based on the address
    if (contractAddress === 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump') {
      window.addTokenToWallet(contractAddress, 'REBL', 9, 'Solana');
    } else {
      window.addTokenToWallet(contractAddress, 'rebelinux', 18, 'Base');
    }
  };

  window.copyToClipboard = function(text) {
    if (window.RebelInuX && window.RebelInuX.copyToClipboard) {
      return window.RebelInuX.copyToClipboard(text);
    } else {
      // Fallback implementation
      return ClipboardManager.copyToClipboard(text);
    }
  };

  window.toggleContractView = function(button) {
    const codeElement = button.closest('.contract-address')?.querySelector('code');
    if (codeElement) {
      const isExpanded = codeElement.classList.toggle('expanded');
      const icon = button.querySelector('i');
      
      if (isExpanded) {
        icon.className = 'fas fa-compress-alt';
        button.setAttribute('title', 'Collapse address');
      } else {
        icon.className = 'fas fa-expand-alt';
        button.setAttribute('title', 'Expand address');
      }
    }
  };

})();

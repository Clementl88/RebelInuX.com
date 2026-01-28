// ===== PERFORMANCE OPTIMIZATIONS =====

class PageOptimizer {
  constructor() {
    this.rafId = null;
    this.scrollHandlers = [];
    this.listeners = [];
    this.performanceMetrics = {
      fcp: null,
      lcp: null,
      fid: null,
      cls: 0
    };
  }
  
  // Request Animation Frame throttling
  throttleRAF(callback) {
    if (this.rafId) return;
    
    this.rafId = requestAnimationFrame(() => {
      callback();
      this.rafId = null;
    });
  }
  
  // Debounce function
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const context = this;
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Memory management
  addListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    this.listeners.push({ element, event, handler });
  }
  
  removeAllListeners() {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }
  
  // Image optimization helper
  optimizeImage(img) {
    if (!img.complete) {
      // Add loading attribute if not already present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add error handling
      img.addEventListener('error', () => {
        console.warn('Image failed to load:', img.src);
        img.style.opacity = '0.5';
      });
    }
    
    return img;
  }
  
  // Preconnect to external domains
  preconnect(url) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
  
  // Preload critical resources
  preload(resource, as) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = as;
    
    if (as === 'font') {
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  }
  
  // Lazy load iframes
  lazyLoadIframes() {
    const iframes = document.querySelectorAll('iframe[data-src]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
          observer.unobserve(iframe);
        }
      });
    });
    
    iframes.forEach(iframe => observer.observe(iframe));
  }
  
  // Track performance metrics
  trackPerformance() {
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        this.performanceMetrics.fcp = entries[0].startTime;
        console.log('FCP:', this.performanceMetrics.fcp);
      });
      
      fcpObserver.observe({ entryTypes: ['paint'] });
      
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.performanceMetrics.lcp = lastEntry.startTime;
        console.log('LCP:', this.performanceMetrics.lcp);
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.performanceMetrics.fid = entry.processingStart - entry.startTime;
          console.log('FID:', this.performanceMetrics.fid);
        }
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
      
      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            this.performanceMetrics.cls += entry.value;
            console.log('CLS:', this.performanceMetrics.cls);
          }
        }
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }
  
  // Send performance data to analytics (placeholder)
  sendToAnalytics() {
    // In a real implementation, you would send this to your analytics service
    console.log('Performance metrics:', this.performanceMetrics);
    
    // Example using navigator.sendBeacon
    if (navigator.sendBeacon) {
      const data = JSON.stringify(this.performanceMetrics);
      navigator.sendBeacon('/api/performance', data);
    }
  }
  
  // Detect slow network
  isSlowNetwork() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return connection.saveData || 
             connection.effectiveType.includes('2g') || 
             connection.effectiveType.includes('slow-2g');
    }
    return false;
  }
  
  // Adjust based on network conditions
  adjustForNetwork() {
    if (this.isSlowNetwork()) {
      // Disable animations
      document.body.classList.add('reduced-motion');
      
      // Lazy load everything
      document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
      
      console.log('Slow network detected, optimizing...');
    }
  }
  
  // Clean up resources
  cleanup() {
    this.removeAllListeners();
    
    // Clear any stored data
    localStorage.removeItem('pageOptimizer_temp');
    sessionStorage.removeItem('pageOptimizer_temp');
    
    // Cancel any pending animations
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

// Initialize optimizer
window.pageOptimizer = new PageOptimizer();

// Optimize on page load
document.addEventListener('DOMContentLoaded', () => {
  window.pageOptimizer.adjustForNetwork();
  window.pageOptimizer.trackPerformance();
  window.pageOptimizer.lazyLoadIframes();
  
  // Optimize all images
  document.querySelectorAll('img').forEach(img => {
    window.pageOptimizer.optimizeImage(img);
  });
});

// Send performance data before page unload
window.addEventListener('beforeunload', () => {
  window.pageOptimizer.sendToAnalytics();
  window.pageOptimizer.cleanup();
});

// Export optimization utilities
window.optimize = {
  debounce: (fn, delay, immediate) => window.pageOptimizer.debounce(fn, delay, immediate),
  throttle: (fn, limit) => window.pageOptimizer.throttle(fn, limit),
  throttleRAF: (fn) => window.pageOptimizer.throttleRAF(fn),
  preconnect: (url) => window.pageOptimizer.preconnect(url),
  preload: (resource, as) => window.pageOptimizer.preload(resource, as),
  isSlowNetwork: () => window.pageOptimizer.isSlowNetwork(),
  getMetrics: () => window.pageOptimizer.performanceMetrics
};

// Handle offline/online status
window.addEventListener('online', () => {
  console.log('Application is online');
  document.body.classList.remove('offline');
  
  // Show notification
  if (typeof showNotification === 'function') {
    showNotification('You are back online!', 'success');
  }
});

window.addEventListener('offline', () => {
  console.log('Application is offline');
  document.body.classList.add('offline');
  
  // Show notification
  if (typeof showNotification === 'function') {
    showNotification('You are offline. Some features may be limited.', 'warning');
  }
});

// Detect browser capabilities
window.browserCapabilities = {
  serviceWorker: 'serviceWorker' in navigator,
  webp: (() => {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  })(),
  intersectionObserver: 'IntersectionObserver' in window,
  performanceObserver: 'PerformanceObserver' in window,
  webShare: 'share' in navigator,
  clipboard: 'clipboard' in navigator && 'writeText' in navigator.clipboard
};

console.log('Browser capabilities:', window.browserCapabilities);

// Share functionality
if (window.browserCapabilities.webShare) {
  // Add share button if not present
  const shareData = {
    title: 'RebelInuX - Multi-Chain Passive Income Platform',
    text: 'Earn weekly $REBL rewards across Base and Solana chains. Join the dual-token ecosystem with up to 240% age bonus!',
    url: window.location.href
  };
  
  window.sharePage = async () => {
    try {
      await navigator.share(shareData);
      console.log('Shared successfully');
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };
  
  // You could add a share button dynamically
  // document.addEventListener('DOMContentLoaded', addShareButton);
}

// Add share button function (optional)
function addShareButton() {
  if (!window.browserCapabilities.webShare) return;
  
  const shareButton = document.createElement('button');
  shareButton.className = 'share-button';
  shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share';
  shareButton.onclick = window.sharePage;
  
  // Add to a suitable location in your page
  const heroButtons = document.querySelector('.hero-buttons');
  if (heroButtons) {
    heroButtons.appendChild(shareButton);
  }
}

// Handle theme preferences
if (window.matchMedia) {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  function handleDarkModeChange(e) {
    if (e.matches) {
      document.body.classList.add('dark-mode');
      console.log('Dark mode enabled');
    } else {
      document.body.classList.remove('dark-mode');
      console.log('Light mode enabled');
    }
  }
  
  // Initial check
  handleDarkModeChange(darkModeMediaQuery);
  
  // Listen for changes
  darkModeMediaQuery.addListener(handleDarkModeChange);
}

// Battery status API (if available)
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    function updateBatteryStatus() {
      if (battery.level < 0.2) {
        // Battery is low, optimize for power saving
        document.body.classList.add('low-battery');
        console.log('Low battery detected, optimizing...');
      }
    }
    
    // Initial check
    updateBatteryStatus();
    
    // Listen for changes
    battery.addEventListener('levelchange', updateBatteryStatus);
  });
}

// Memory management warning
if ('deviceMemory' in navigator) {
  const memory = navigator.deviceMemory;
  console.log(`Device memory: ${memory}GB`);
  
  if (memory < 4) {
    // Device has limited memory
    document.body.classList.add('low-memory');
    console.log('Low memory device detected, optimizing...');
    
    // Reduce animations and heavy operations
    if (typeof initParticles === 'function') {
      // Skip particle effects on low memory devices
      window.skipParticles = true;
    }
  }
}

// Hardware concurrency
if ('hardwareConcurrency' in navigator) {
  console.log(`CPU cores: ${navigator.hardwareConcurrency}`);
}

// Save data mode
if ('connection' in navigator && navigator.connection.saveData) {
  console.log('Data saver mode is enabled');
  document.body.classList.add('save-data');
  
  // Optimize for data saving
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.hasAttribute('srcset')) {
      // Use smaller images in srcset
      const srcset = img.getAttribute('srcset');
      const smallerSources = srcset.split(',').filter(src => {
        return !src.includes('2x') && !src.includes('3x');
      }).join(',');
      img.setAttribute('srcset', smallerSources);
    }
  });
}

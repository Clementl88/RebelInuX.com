// ===== REBELINUX INDEX PAGE - COMPLETE JAVASCRIPT =====
// All functionality for animations and interactions

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initLoader();
  initBackToTop();
  initParticles();
  initCounterAnimations();
  initCopyButtons();
  initScrollAnimations();
  initHoverEffects();
  initResponsiveMenu();
  initHeroAnimation();
  initTokenFlowAnimations();
  initTooltips();
});

// 1. Loader Animation
function initLoader() {
  const loader = document.getElementById('loader');
  
  // Hide loader after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      
      // Remove from DOM after animation
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 1000);
  });
}

// 2. Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 3. Hero Particles Animation
function initParticles() {
  const particlesContainer = document.getElementById('heroParticles');
  
  if (!particlesContainer) return;
  
  const particleCount = 50;
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(212, 167, 106, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      left: ${x}%;
      top: ${y}%;
      animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
      filter: blur(${Math.random() * 2}px);
    `;
    
    particlesContainer.appendChild(particle);
    particles.push(particle);
  }
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.5;
      }
      25% {
        transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.2);
        opacity: 0.8;
      }
      50% {
        transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1);
        opacity: 0.6;
      }
      75% {
        transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(0.8);
        opacity: 0.4;
      }
    }
  `;
  document.head.appendChild(style);
}

// 4. Counter Animations
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-target]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current);
        }, 16);
        
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// 5. Copy Address Buttons
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const contractElement = this.closest('.contract-address').querySelector('.contract-code');
      const text = contractElement.textContent;
      
      // Copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const originalIcon = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.style.color = '#10b981';
        
        // Reset after 2 seconds
        setTimeout(() => {
          this.innerHTML = originalIcon;
          this.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy: ', err);
        this.innerHTML = '<i class="fas fa-times"></i>';
        this.style.color = '#ef4444';
        
        setTimeout(() => {
          this.innerHTML = '<i class="far fa-copy"></i>';
          this.style.color = '';
        }, 2000);
      });
    });
  });
  
  // Expand contract address buttons
  const expandButtons = document.querySelectorAll('.expand-btn');
  expandButtons.forEach(button => {
    button.addEventListener('click', function() {
      const contractElement = this.closest('.contract-address').querySelector('.contract-code');
      const fullText = contractElement.getAttribute('data-full') || contractElement.textContent;
      
      // Toggle between truncated and full
      if (contractElement.textContent.includes('...')) {
        const originalText = contractElement.textContent;
        contractElement.setAttribute('data-truncated', originalText);
        contractElement.textContent = fullText;
        this.innerHTML = '<i class="fas fa-compress-alt"></i>';
      } else {
        const truncatedText = contractElement.getAttribute('data-truncated') || fullText;
        contractElement.textContent = truncatedText;
        this.innerHTML = '<i class="fas fa-expand-alt"></i>';
      }
    });
  });
}

// 6. Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          element.classList.add('aos-animate');
        }, parseInt(delay));
        
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

// 7. Hover Effects
function initHoverEffects() {
  // Add hover effects to cards
  const cards = document.querySelectorAll('.value-card, .stat-card, .step-card, .comparison-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px)';
      card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
    });
  });
  
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// 8. Responsive Menu
function initResponsiveMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Toggle icon
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }
}

// 9. Hero Animation
function initHeroAnimation() {
  const heroTitle = document.querySelector('.hero-title');
  const chainCards = document.querySelectorAll('.chain-card');
  
  if (heroTitle) {
    // Animate title lines
    const titleLines = heroTitle.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        line.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, index * 300);
    });
  }
  
  if (chainCards.length > 0) {
    // Animate chain cards
    chainCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateX(' + (index === 0 ? '-50px' : '50px') + ')';
      
      setTimeout(() => {
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
      }, 800 + index * 200);
    });
  }
  
  // Animate bridge
  const bridge = document.querySelector('.chain-bridge');
  if (bridge) {
    bridge.style.opacity = '0';
    setTimeout(() => {
      bridge.style.transition = 'opacity 0.8s ease';
      bridge.style.opacity = '1';
    }, 1000);
  }
}

// 10. Token Flow Animations
function initTokenFlowAnimations() {
  const flowCoins = document.querySelectorAll('.flow-coin');
  const pulseDots = document.querySelectorAll('.pulse-dot');
  
  // Animate flow coins
  if (flowCoins.length > 0) {
    flowCoins.forEach((coin, index) => {
      coin.style.animationDelay = (index * 0.66) + 's';
    });
  }
  
  // Animate pulse dots
  if (pulseDots.length > 0) {
    pulseDots.forEach((dot, index) => {
      dot.style.animationDelay = (index * 0.2) + 's';
    });
  }
  
  // Animate logo in final CTA
  const logoPulse = document.querySelector('.logo-pulse');
  if (logoPulse) {
    logoPulse.addEventListener('mouseenter', () => {
      logoPulse.style.animation = 'float 1.5s ease-in-out infinite';
    });
    
    logoPulse.addEventListener('mouseleave', () => {
      logoPulse.style.animation = 'float 3s ease-in-out infinite';
    });
  }
}

// 11. Tooltips
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[title]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = element.getAttribute('title');
      
      document.body.appendChild(tooltip);
      
      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let top = rect.top - tooltipRect.height - 10;
      let left = rect.left + (rect.width - tooltipRect.width) / 2;
      
      // Adjust if tooltip goes off screen
      if (top < 0) {
        top = rect.bottom + 10;
      }
      if (left < 0) {
        left = 10;
      }
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      tooltip.style.cssText = `
        position: fixed;
        top: ${top}px;
        left: ${left}px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        z-index: 9999;
        pointer-events: none;
        white-space: nowrap;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
      `;
      
      element.setAttribute('data-tooltip-id', 'tooltip-' + Date.now());
      element.tooltipElement = tooltip;
    });
    
    element.addEventListener('mouseleave', () => {
      if (element.tooltipElement) {
        element.tooltipElement.remove();
        element.tooltipElement = null;
      }
    });
  });
}

// 12. Parallax Effect
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-speed') || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// 13. Active Menu Highlight
function initActiveMenu() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// 14. Wallet Add Button
function initWalletButtons() {
  const walletButtons = document.querySelectorAll('.wallet-btn, .wallet-add-btn');
  
  walletButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tokenAddress = 'F4gh7VN...pump'; // Example Solana address
      
      // Show modal or notification
      const notification = document.createElement('div');
      notification.className = 'wallet-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-wallet"></i>
          <div>
            <h4>Add $REBL to Wallet</h4>
            <p>Copy the contract address to add manually:</p>
            <code class="address-code">${tokenAddress}</code>
            <button class="btn btn-primary copy-address-btn">
              <i class="far fa-copy"></i> Copy Address
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Style the notification
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(17, 17, 17, 0.95);
        border: 1px solid rgba(212, 167, 106, 0.3);
        border-radius: 15px;
        padding: 20px;
        z-index: 9999;
        max-width: 350px;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: slideIn 0.3s ease;
      `;
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .notification-content {
          display: flex;
          gap: 15px;
          align-items: flex-start;
        }
        
        .notification-content i {
          font-size: 2rem;
          color: var(--primary-gold);
          margin-top: 5px;
        }
        
        .notification-content h4 {
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }
        
        .notification-content p {
          margin: 0 0 10px 0;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        .address-code {
          display: block;
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-family: monospace;
          color: var(--text-primary);
          font-size: 0.9rem;
          word-break: break-all;
        }
        
        .copy-address-btn {
          width: 100%;
        }
      `;
      document.head.appendChild(style);
      
      // Copy address button in notification
      const copyBtn = notification.querySelector('.copy-address-btn');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(tokenAddress).then(() => {
          copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          copyBtn.style.background = '#10b981';
          
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="far fa-copy"></i> Copy Address';
            copyBtn.style.background = '';
          }, 2000);
        });
      });
      
      // Auto remove notification after 10 seconds
      setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
      }, 10000);
      
      // Close on click outside
      document.addEventListener('click', function closeNotification(e) {
        if (!notification.contains(e.target) && e.target !== button) {
          notification.remove();
          document.removeEventListener('click', closeNotification);
        }
      });
    });
  });
}

// 15. Initialize all
function initializeAll() {
  initLoader();
  initBackToTop();
  initParticles();
  initCounterAnimations();
  initCopyButtons();
  initScrollAnimations();
  initHoverEffects();
  initResponsiveMenu();
  initHeroAnimation();
  initTokenFlowAnimations();
  initTooltips();
  initParallax();
  initActiveMenu();
  initWalletButtons();
  
  // Add smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAll);

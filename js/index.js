// ===== INDEX PAGE ENHANCED JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
  // Initialize after common components are loaded
  setTimeout(initIndexPage, 300);
});

function initIndexPage() {
  console.log('Initializing enhanced Index page');
  
  // Initialize animations
  initScrollAnimations();
  
  // Initialize stats counters
  initStatsCounters();
  
  // Initialize ROI calculator
  initROICalculator();
  
  // Initialize copy buttons
  initCopyButtons();
  
  // Smooth scroll for anchor links
  initSmoothScroll();
  
  // Initialize logo animations
  initLogoAnimations();
}

// Enhanced Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.value-card, .comparison-card, .step-card, .stat-card, .token-card, .logo-card, .key-takeaway, .contract-emphasis'
  );
  
  // Add initial styles for animation
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });
  
  function animateOnScroll() {
    animatedElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight - 100) {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 150);
      }
    });
  }
  
  // Initial check
  animateOnScroll();
  
  // Listen to scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Floating logo animation
  const floatingLogo = document.querySelector('.logo-3d');
  if (floatingLogo) {
    window.addEventListener('mousemove', (e) => {
      const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      floatingLogo.style.transform = `translateY(-20px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
  }
}

// Stats Counters Animation
function initStatsCounters() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  
  // Only animate when in view
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
  
  // Event listeners
  amountSlider.addEventListener('input', function() {
    amountInput.value = this.value;
    updateCalculator();
  });
  
  amountInput.addEventListener('input', function() {
    amountSlider.value = this.value;
    updateCalculator();
  });
  
  ageSlider.addEventListener('input', function() {
    ageInput.value = this.value;
    updateCalculator();
  });
  
  ageInput.addEventListener('input', function() {
    ageSlider.value = this.value;
    updateCalculator();
  });
  
  // Initial calculation
  updateCalculator();
}

// Copy to Clipboard
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn, .copy-contract-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', function() {
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
        copyToClipboard(contractText);
      }
      
      // Visual feedback
      const originalHTML = this.innerHTML;
      const originalBackground = this.style.background;
      const originalColor = this.style.color;
      
      this.innerHTML = '<i class="fas fa-check"></i> Copied!';
      this.style.background = '#4CAF50';
      this.style.color = 'white';
      
      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.style.background = originalBackground;
        this.style.color = originalColor;
      }, 2000);
    });
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Contract address copied to clipboard!', 'success');
  }).catch(err => {
    showNotification('Failed to copy address', 'error');
    console.error('Failed to copy: ', err);
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
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
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
  
  // Add keyframes
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

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || !href.startsWith('#') || !document.querySelector(href)) return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without page jump
        if (href !== '#') {
          history.pushState(null, null, href);
        }
      }
    });
  });
}

// Particle Background for Hero
function initParticles() {
  const heroSection = document.querySelector('.page-hero--main');
  if (!heroSection || document.querySelector('.particle')) return;
  
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 5 + 1}px;
      height: ${Math.random() * 5 + 1}px;
      background: rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: float-particle ${Math.random() * 20 + 10}s linear infinite;
      z-index: 1;
    `;
    
    const style = document.createElement('style');
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
    
    heroSection.querySelector('.hero-particles')?.appendChild(particle);
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
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });
  
  // Initialize copy contract button
  const copyContractBtn = document.querySelector('.copy-contract-btn');
  if (copyContractBtn) {
    // Already initialized in initCopyButtons
    console.log('Contract copy button initialized');
  }
}

// Copy Contract Address Function (for direct access if needed)
function copyContractAddress() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  
  navigator.clipboard.writeText(contractAddress).then(() => {
    // Show success feedback
    const button = document.querySelector('.copy-contract-btn');
    if (button) {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copied!';
      button.style.background = '#4CAF50';
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
      }, 2000);
    }
    
    // Show notification
    showNotification('Contract address copied to clipboard!', 'success');
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showNotification('Failed to copy address', 'error');
  });
}

// Initialize when page loads
window.addEventListener('load', function() {
  // Initialize particles
  initParticles();
  
  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.transform = 'scale(1.1)';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 800);
  }
});

// Export functions if needed
window.IndexPage = {
  initIndexPage,
  initScrollAnimations,
  initStatsCounters,
  initLogoAnimations,
  copyContractAddress
};

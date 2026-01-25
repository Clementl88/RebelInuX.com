// ===== INDEX PAGE SPECIFIC JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
  // Initialize after common components are loaded
  setTimeout(initIndexPage, 300);
});

function initIndexPage() {
  console.log('Initializing Index page');
  
  // Initialize animations
  initScrollAnimations();
  
  // Initialize stats counters
  initStatsCounters();
  
  // Initialize newsletter form
  initNewsletterForm();
  
  // Smooth scroll for anchor links
  initSmoothScroll();
}

// Scroll Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.ecosystem-item, .timeline-step, .link-card, .stat-card, .cta-card'
  );
  
  // Add initial styles for animation
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  function animateOnScroll() {
    animatedElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight - 100) {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }
  
  // Initial check
  animateOnScroll();
  
  // Listen to scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Hero image floating animation
  const heroImage = document.querySelector('.hero-image img');
  if (heroImage) {
    setInterval(() => {
      heroImage.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 20}px)`;
    }, 100);
  }
}

// Stats Counters Animation
function initStatsCounters() {
  const statValues = document.querySelectorAll('.stat-value');
  
  // Only animate when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statElement = entry.target;
        const targetValue = parseFloat(statElement.textContent.replace('M', '000000'));
        const isLargeNumber = statElement.textContent.includes('M');
        
        if (!statElement.classList.contains('animated')) {
          animateCounter(statElement, targetValue, isLargeNumber);
          statElement.classList.add('animated');
        }
      }
    });
  }, { threshold: 0.5 });
  
  statValues.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target, isLarge) {
  const duration = 2000; // 2 seconds
  const frameDuration = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;
  
  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const current = Math.round(target * progress);
    
    if (isLarge) {
      element.textContent = (current / 1000000).toFixed(2) + 'M';
    } else {
      element.textContent = current;
    }
    
    if (frame === totalFrames) {
      clearInterval(counter);
      if (isLarge) {
        element.textContent = (target / 1000000).toFixed(2) + 'M';
      } else {
        element.textContent = target;
      }
    }
  }, frameDuration);
}

// Newsletter Form
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;
  
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = this.querySelector('input[type="email"]');
    const button = this.querySelector('button');
    
    if (!emailInput.value) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    
    // Save original button text
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Reset button
      button.innerHTML = originalText;
      button.disabled = false;
      
      // Clear input
      emailInput.value = '';
      
      // Show success message
      showNotification('Thank you for subscribing!', 'success');
    }, 1500);
  });
}

// Show notification
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
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  // Add keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
    
    // Add slideOut keyframes
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(slideOutStyle);
  }, 5000);
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      // Check if it's an internal link
      if (href.startsWith('#') && document.querySelector(href)) {
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
          history.pushState(null, null, href);
        }
      }
    });
  });
}

// Chain icons hover effect
function initChainIcons() {
  const chainIcons = document.querySelectorAll('.chain-icon');
  
  chainIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    icon.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Initialize when page loads
window.addEventListener('load', function() {
  initChainIcons();
  
  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }, 500);
  }
});

// Export functions if needed
window.IndexPage = {
  initIndexPage,
  initScrollAnimations,
  initStatsCounters
};

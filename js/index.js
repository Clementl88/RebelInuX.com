// ===== REBELINUX - SIMPLIFIED JAVASCRIPT =====

// 1. Loader - Always works
document.addEventListener('DOMContentLoaded', function() {
  const loader = document.getElementById('loader');
  
  // Hide loader after everything is loaded
  window.addEventListener('load', function() {
    setTimeout(function() {
      if (loader) {
        loader.classList.add('hidden');
      }
    }, 1000);
  });
  
  // Fallback: Hide loader after 3 seconds regardless
  setTimeout(function() {
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  }, 3000);
});

// 2. Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
  const backToTopBtn = document.getElementById('backToTop');
  
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// 3. Smooth Scroll for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});

// 4. Copy Address Buttons
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
      const contractElement = this.closest('.contract-address').querySelector('.contract-code');
      const text = contractElement.textContent;
      
      // Try to copy
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showCopyFeedback(this, true);
        }).catch(() => {
          fallbackCopy(text);
          showCopyFeedback(this, true);
        });
      } else {
        fallbackCopy(text);
        showCopyFeedback(this, true);
      }
    });
  });
  
  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
  
  function showCopyFeedback(button, success) {
    const originalHTML = button.innerHTML;
    
    if (success) {
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.style.color = '#10b981';
    } else {
      button.innerHTML = '<i class="fas fa-times"></i>';
      button.style.color = '#ef4444';
    }
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.color = '';
    }, 2000);
  }
});

// 5. Counter Animations (Simple Version)
document.addEventListener('DOMContentLoaded', function() {
  const counters = document.querySelectorAll('.metric-value[data-target], .stat-value[data-target]');
  
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }
  
  // Simple scroll trigger
  function checkCounters() {
    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        if (!counter.classList.contains('animated')) {
          counter.classList.add('animated');
          animateCounter(counter);
        }
      }
    });
  }
  
  // Check on scroll and on load
  window.addEventListener('scroll', checkCounters);
  checkCounters(); // Initial check
});

// 6. Hover Effects
document.addEventListener('DOMContentLoaded', function() {
  // Add hover effects to cards
  const cards = document.querySelectorAll('.value-card, .stat-card, .step-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add hover effects to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});

// 7. Mobile Menu Toggle (if you have one)
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
  }
});

// 8. Simple Animations on Scroll
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  function animateOnScroll() {
    animatedElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100;
      
      if (isVisible) {
        const animation = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          element.classList.add('aos-animate');
        }, parseInt(delay));
      }
    });
  }
  
  // Set initial state
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Check on scroll and load
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();
});

// 9. Chain Visualization Animation
document.addEventListener('DOMContentLoaded', function() {
  const bridgeLine = document.querySelector('.bridge-line');
  
  if (bridgeLine) {
    // Create moving coins in the bridge
    for (let i = 0; i < 3; i++) {
      const coin = document.createElement('div');
      coin.className = 'flow-coin';
      coin.style.animationDelay = (i * 0.66) + 's';
      bridgeLine.appendChild(coin);
    }
  }
});

// 10. Tooltips
document.addEventListener('DOMContentLoaded', function() {
  const tooltipElements = document.querySelectorAll('[title]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function(e) {
      const title = this.getAttribute('title');
      if (!title) return;
      
      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = title;
      
      document.body.appendChild(tooltip);
      
      // Position tooltip
      const rect = this.getBoundingClientRect();
      tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
      
      this.tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', function() {
      if (this.tooltip) {
        this.tooltip.remove();
        this.tooltip = null;
      }
    });
  });
});

// 11. Initialize everything when page loads
window.onload = function() {
  // Force hide loader after page is fully loaded
  setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
    }
  }, 500);
  
  // Initialize other features
  initBackToTop();
  initSmoothScroll();
  initCounters();
};

// Debug: Check if scripts are loading
console.log('RebelInuX JavaScript loaded successfully');

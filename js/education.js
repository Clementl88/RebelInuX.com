// education.js
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initializeFAQ();
  initializeSmoothScroll();
  initializeBackToTop();
  
  // Set current year in footer
  const currentYear = new Date().getFullYear();
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = currentYear;
  }
  
  // Load header and footer
  loadHeaderAndFooter();
  
  // Add active class to education nav link
  highlightActiveNav();
});

// FAQ Toggle Functionality
function initializeFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle current question
      this.setAttribute('aria-expanded', !isExpanded);
      answer.classList.toggle('active');
      
      // Close other questions (optional - comment out if you want multiple open)
      /*
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== this) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          otherQuestion.nextElementSibling.classList.remove('active');
        }
      });
      */
    });
  });
}

// Smooth Scroll for Anchor Links
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only process internal anchor links
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for fixed header
        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without scrolling
        history.pushState(null, null, href);
      }
    });
  });
}

// Back to Top Button
function initializeBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  
  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
    
    backToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Load Header and Footer
function loadHeaderAndFooter() {
  // This assumes you have includes.js that handles this
  // If not, you can implement it here:
  
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
      // Re-initialize mobile menu if needed
      initializeMobileMenu();
    })
    .catch(error => console.error('Error loading header:', error));
    
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-container').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Highlight active navigation
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Mobile Menu Initialization (if needed)
function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      this.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Copy Contract Address Function
function copyContractAddress() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  navigator.clipboard.writeText(contractAddress).then(() => {
    // Show success message
    showToast('Contract address copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showToast('Failed to copy address. Please try again.', 'error');
  });
}

// Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: ${type === 'error' ? '#f44336' : '#4CAF50'};
    color: white;
    border-radius: 8px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFAQ);
} else {
  initializeFAQ();
}

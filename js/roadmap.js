// roadmap.js - Roadmap page functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initRoadmapPage, 300);
});

function initRoadmapPage() {
  console.log('Initializing Roadmap page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize roadmap data
  initRoadmapData();
  
  // Initialize animations
  initScrollAnimations();
  
  // Initialize AOS animations
  initAOS();
  
  // Initialize milestone interactions
  initMilestoneInteractions();
  
  // Initialize progress animations
  initProgressAnimations();
}

// ========== AOS ANIMATIONS ==========
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      disable: window.innerWidth < 768 ? 'mobile' : false
    });
    
    // Refresh AOS on window resize
    window.addEventListener('resize', function() {
      AOS.refresh();
    });
  }
}

// ========== MOBILE DROPDOWN FUNCTIONALITY ==========
function initializeMobileDropdown() {
  const dropbtn = document.querySelector('.dropbtn');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (!dropbtn) return;
  
  // Mobile dropdown toggle
  dropbtn.addEventListener('click', function(e) {
    // Only handle on mobile
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdownContent = this.nextElementSibling;
      const isActive = dropdownContent.style.display === 'block' || 
                      dropdownContent.classList.contains('active');
      
      // Toggle this dropdown
      if (!isActive) {
        dropdownContent.style.display = 'block';
        dropdownContent.classList.add('active');
        this.classList.add('active');
      } else {
        dropdownContent.style.display = 'none';
        dropdownContent.classList.remove('active');
        this.classList.remove('active');
      }
    }
  });
}

// ========== ROADMAP DATA FUNCTIONS ==========
function initRoadmapData() {
  console.log('Initializing roadmap data');
  
  // Fetch and update roadmap stats
  updateRoadmapStats();
  
  // Initialize timeline animations
  initTimelineAnimations();
  
  // Start periodic updates
  setInterval(updateRoadmapStats, 60000); // Update every minute
}

async function updateRoadmapStats() {
  try {
    // In a real implementation, you would fetch these from APIs
    const stats = {
      milestonesCompleted: 8,
      activeMilestones: 4,
      upcomingFeatures: 12,
      communityProposals: 6
    };
    
    // Update stat counters with animation
    animateCounter('milestonesCompleted', stats.milestonesCompleted);
    animateCounter('activeMilestones', stats.activeMilestones);
    animateCounter('upcomingFeatures', stats.upcomingFeatures);
    animateCounter('communityProposals', stats.communityProposals);
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating roadmap stats:', error);
  }
}

function initTimelineAnimations() {
  // Animate timeline line
  const timelineLine = document.querySelector('.timeline-line');
  if (timelineLine) {
    timelineLine.style.height = '0%';
    
    setTimeout(() => {
      timelineLine.style.transition = 'height 2s ease-in-out';
      timelineLine.style.height = '100%';
    }, 500);
  }
  
  // Animate progress bars
  document.querySelectorAll('.progress-fill').forEach(fill => {
    const width = fill.style.width;
    fill.style.width = '0%';
    
    setTimeout(() => {
      fill.style.transition = 'width 1.5s ease-in-out';
      fill.style.width = width;
    }, 800);
  });
}

function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const current = parseInt(element.textContent) || 0;
  if (current === target) return;
  
  const duration = 1000; // 1 second
  const increment = (target - current) / (duration / 16);
  
  let currentValue = current;
  const timer = setInterval(() => {
    currentValue += increment;
    if ((increment > 0 && currentValue >= target) || (increment < 0 && currentValue <= target)) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(currentValue);
    }
  }, 16);
}

function updateLastUpdated() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const timestampElement = document.querySelector('.update-time');
  if (timestampElement) {
    timestampElement.textContent = `Last Updated: ${timeString}`;
  }
}

// ========== MILESTONE INTERACTIONS ==========
function initMilestoneInteractions() {
  const milestones = document.querySelectorAll('.timeline-milestone');
  
  milestones.forEach(milestone => {
    const content = milestone.querySelector('.milestone-content');
    
    // Add click handler for mobile
    content.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        this.classList.toggle('expanded');
      } else {
        showMilestoneDetails(milestone);
      }
    });
    
    // Add keyboard support
    content.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        showMilestoneDetails(milestone);
      }
    });
    
    // Make content focusable
    content.setAttribute('tabindex', '0');
    content.setAttribute('role', 'button');
    content.setAttribute('aria-label', 'View milestone details');
  });
  
  // Add click handlers for phase cards
  const phaseCards = document.querySelectorAll('.phase-card');
  phaseCards.forEach(card => {
    card.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        this.classList.toggle('expanded');
      }
    });
  });
}

function showMilestoneDetails(milestone) {
  const date = milestone.querySelector('.milestone-date').textContent;
  const title = milestone.querySelector('h3').textContent;
  const description = milestone.querySelector('p').textContent;
  const tags = Array.from(milestone.querySelectorAll('.tag')).map(tag => tag.textContent);
  
  // In a real implementation, you would show a modal with detailed information
  const details = `
    Milestone Details:
    
    Date: ${date}
    Title: ${title}
    
    Description:
    ${description}
    
    Tags: ${tags.join(', ')}
  `;
  
  showToast(`Viewing details for: ${title}`, 'info');
  
  // Simulate showing modal
  setTimeout(() => {
    // This would open a modal in production
    console.log('Milestone details:', details);
    
    // For now, just show an alert
    if (window.innerWidth > 768) {
      alert(details + '\n\n(In production, this would open a detailed modal)');
    }
  }, 100);
}

// ========== PROGRESS ANIMATIONS ==========
function initProgressAnimations() {
  // Animate phase progress bars
  const progressBars = document.querySelectorAll('.progress-bar .progress-fill');
  
  progressBars.forEach(bar => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = '0%';
          
          setTimeout(() => {
            entry.target.style.transition = 'width 1.5s ease-in-out';
            entry.target.style.width = width;
          }, 300);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(bar);
  });
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.phase-card, .timeline-milestone, .focus-card, .vision-phase, .process-step, .update-card, .faq-item, .related-card'
  );
  
  // Use Intersection Observer for better performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    window.addEventListener('scroll', animateElements);
    animateElements(); // Initial check
  }
}

function animateElements() {
  const animatedElements = document.querySelectorAll(
    '.phase-card, .timeline-milestone, .focus-card, .vision-phase, .process-step, .update-card, .faq-item, .related-card'
  );
  
  animatedElements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
    
    if (isVisible) {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 50);
    }
  });
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Style toast
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  
  document.body.appendChild(toast);
  
  // Add animation styles if not already present
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// ========== EXPORTED FUNCTIONS ==========
function viewCurrentPhase() {
  document.getElementById('current-phase').scrollIntoView({ 
    behavior: 'smooth',
    block: 'center'
  });
  showToast('Scrolling to current phase', 'info');
}

function viewTimeline() {
  document.getElementById('timeline').scrollIntoView({ 
    behavior: 'smooth'
  });
  showToast('Scrolling to timeline', 'info');
}

function viewFutureVision() {
  document.getElementById('future-vision').scrollIntoView({ 
    behavior: 'smooth'
  });
  showToast('Scrolling to future vision', 'info');
}

// ========== GLOBAL EXPORTS ==========
window.viewCurrentPhase = viewCurrentPhase;
window.viewTimeline = viewTimeline;
window.viewFutureVision = viewFutureVision;
window.initializeMobileDropdown = initializeMobileDropdown;
window.showToast = showToast;

// Add touch-active class styles
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .touch-active {
      opacity: 0.7 !important;
      transform: scale(0.98) !important;
      transition: all 0.1s ease !important;
    }
    
    .milestone-content.expanded,
    .phase-card.expanded {
      transform: scale(1.02) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
    }
    
    /* Timeline mobile adjustments */
    @media (max-width: 768px) {
      .timeline-milestone {
        cursor: pointer;
      }
      
      .milestone-content.expanded {
        margin-bottom: var(--spacing-lg);
      }
      
      .milestone-content.expanded p {
        display: block !important;
      }
      
      .milestone-content:not(.expanded) p {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
});

// Load roadmap progress from localStorage if available
window.addEventListener('load', function() {
  const savedProgress = localStorage.getItem('roadmapLastViewed');
  if (savedProgress) {
    try {
      const progress = JSON.parse(savedProgress);
      const now = new Date();
      const lastVisit = new Date(progress.lastVisit);
      const daysSince = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
      
      if (daysSince > 0) {
        showToast(`Welcome back! ${daysSince} day${daysSince === 1 ? '' : 's'} since your last visit.`, 'info');
      }
    } catch (e) {
      console.error('Error loading roadmap progress:', e);
    }
  }
  
  // Save current visit
  localStorage.setItem('roadmapLastViewed', JSON.stringify({
    lastVisit: new Date().toISOString(),
    page: 'roadmap'
  }));
});

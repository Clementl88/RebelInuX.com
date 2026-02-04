/// roadmap.js - Roadmap page functionality

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
  
  // Initialize timeline sections
  initTimelineSections();
  
  // Start periodic updates
  setInterval(updateRoadmapStats, 60000); // Update every minute
  
  // Save visit to localStorage
  saveRoadmapVisit();
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
}

async function updateRoadmapStats() {
  try {
    // In a real implementation, you would fetch these from APIs
    const stats = {
      milestonesCompleted: 12,
      activeProjects: 3,
      daoLaunchYear: 2026,
      phase2Progress: 80
    };
    
    // Update stat counters with animation
    animateCounter('milestonesCompleted', stats.milestonesCompleted);
    animateCounter('activeProjects', stats.activeProjects);
    animateCounter('daoLaunchYear', stats.daoLaunchYear);
    animateCounter('phase2Progress', stats.phase2Progress);
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating roadmap stats:', error);
  }
}

function initTimelineAnimations() {
  // Animate progress bars on page load
  setTimeout(() => {
    animateAllProgressBars();
  }, 500);
}

function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) {
    // Try to find by class if ID doesn't exist
    const elements = document.querySelectorAll('.stat-value');
    if (elements.length > 0) {
      // This is a simplified version - in real implementation, you'd need to map IDs properly
      return;
    }
  }
  
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
  const milestones = document.querySelectorAll('.timeline-item');
  
  milestones.forEach(milestone => {
    const content = milestone;
    
    // Add click handler for mobile
    content.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        this.classList.toggle('expanded');
        showToast('Tap to expand/collapse milestone details', 'info', 2000);
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
  
  // Add click handlers for principle cards
  const principleCards = document.querySelectorAll('.principle-card');
  principleCards.forEach(card => {
    card.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        this.classList.toggle('expanded');
      }
    });
  });
}

function showMilestoneDetails(milestone) {
  const quarterBadge = milestone.querySelector('.quarter-badge');
  const title = milestone.querySelector('h4')?.textContent || '';
  const description = Array.from(milestone.querySelectorAll('.milestone-list li'))
    .map(li => li.textContent.trim())
    .join('\n• ');
  
  // In a real implementation, you would show a modal with detailed information
  const details = `
    Milestone Details:
    
    Quarter: ${quarterBadge?.textContent || 'N/A'}
    Title: ${title}
    
    Achievements:
    • ${description}
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
  // Animate progress bars
  const progressBars = document.querySelectorAll('.progress-fill');
  
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

function animateAllProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  progressBars.forEach((bar, index) => {
    const width = bar.style.width;
    bar.style.width = '0%';
    
    setTimeout(() => {
      bar.style.transition = 'width 1.5s ease-in-out';
      bar.style.width = width;
    }, index * 200);
  });
}

// ========== TIMELINE SECTIONS ==========
function initTimelineSections() {
  const timelineSections = document.querySelectorAll('.timeline-section');
  
  timelineSections.forEach((section, index) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 200);
        }
      });
    }, { threshold: 0.1 });
    
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
  });
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.timeline-section, .principle-card, .milestone-highlight, .related-page-card, .takeaway-item'
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
    '.timeline-section, .principle-card, .milestone-highlight, .related-page-card, .takeaway-item'
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

// ========== SAVE ROADMAP VISIT ==========
function saveRoadmapVisit() {
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
}

// ========== EXPORTED FUNCTIONS ==========
function viewCompletedMilestones() {
  document.getElementById('completed').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  showToast('Scrolling to completed milestones', 'info');
}

function viewCurrentProgress() {
  document.getElementById('current').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  showToast('Scrolling to current progress', 'info');
}

function viewFutureVision() {
  document.getElementById('future').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  showToast('Scrolling to future vision', 'info');
}

// ========== GLOBAL EXPORTS ==========
window.viewCompletedMilestones = viewCompletedMilestones;
window.viewCurrentProgress = viewCurrentProgress;
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
    
    .timeline-item.expanded,
    .principle-card.expanded {
      transform: scale(1.02) !important;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
      .timeline-item {
        cursor: pointer;
      }
      
      .timeline-item.expanded {
        margin-bottom: var(--spacing-lg);
      }
      
      .timeline-item:not(.expanded) .milestone-list {
        max-height: 150px;
        overflow: hidden;
        position: relative;
      }
      
      .timeline-item:not(.expanded) .milestone-list::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8));
      }
      
      .principle-card {
        cursor: pointer;
      }
    }
  `;
  document.head.appendChild(style);
});

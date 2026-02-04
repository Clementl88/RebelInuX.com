// roadmap.js - Roadmap page functionality for 2026

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initRoadmapPage, 300);
});

function initRoadmapPage() {
  console.log('Initializing Roadmap page for 2026');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize roadmap data with 2026 updates
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
  
  // Initialize 2026 specific features
  init2026Features();
}

// ========== 2026 SPECIFIC FEATURES ==========
function init2026Features() {
  // Update all date elements to show 2026
  updateDateElements();
  
  // Initialize real-time progress tracking
  initRealTimeProgress();
  
  // Initialize DAO countdown if applicable
  initDAOCountdown();
}

function updateDateElements() {
  // Update any dynamic date elements to show 2026
  const dateElements = document.querySelectorAll('.current-date, .year-display');
  dateElements.forEach(el => {
    if (el.textContent.includes('2025') || el.textContent.includes('2024')) {
      el.textContent = el.textContent.replace(/202[0-5]/g, '2026');
    }
  });
}

function initRealTimeProgress() {
  // Simulate real-time progress updates
  setInterval(() => {
    const progressBars = document.querySelectorAll('.progress-fill[style*="width: 85%"]');
    progressBars.forEach(bar => {
      // Animate the progress bar slightly for visual effect
      bar.style.transition = 'all 0.5s ease';
      bar.style.width = '85.5%';
      setTimeout(() => {
        bar.style.width = '85%';
      }, 500);
    });
  }, 10000); // Every 10 seconds
}

function initDAOCountdown() {
  // Check if we have a DAO launch date element
  const daoLaunchElement = document.querySelector('.dao-launch-date');
  if (daoLaunchElement) {
    // Set target date for Q2 2026 (April 1, 2026)
    const targetDate = new Date('April 1, 2026 00:00:00').getTime();
    
    // Update countdown every second
    setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        daoLaunchElement.innerHTML = '<span class="dao-launched">DAO LAUNCHED!</span>';
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      daoLaunchElement.innerHTML = `
        <div class="countdown">
          <div class="countdown-item">
            <span class="countdown-value">${days}</span>
            <span class="countdown-label">Days</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${hours}</span>
            <span class="countdown-label">Hours</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${minutes}</span>
            <span class="countdown-label">Minutes</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-value">${seconds}</span>
            <span class="countdown-label">Seconds</span>
          </div>
        </div>
      `;
    }, 1000);
  }
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
  console.log('Initializing roadmap data for 2026');
  
  // Fetch and update roadmap stats
  updateRoadmapStats();
  
  // Initialize timeline animations
  initTimelineAnimations();
  
  // Update community stats for 2026
  updateCommunityStats();
}

async function updateRoadmapStats() {
  try {
    // 2026 updated stats
    const stats = {
      totalMilestones: 18,
      activeProjects: 5,
      daoLaunchTarget: 'Q2 2026',
      overallProgress: 85,
      communitySize: 2500
    };
    
    // Update stat counters with animation
    animateCounter('totalMilestones', stats.totalMilestones);
    animateCounter('activeProjects', stats.activeProjects);
    animateCounter('overallProgress', stats.overallProgress);
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating roadmap stats:', error);
  }
}

async function updateCommunityStats() {
  try {
    // Simulate fetching community stats
    const communityStats = {
      telegramMembers: 1250,
      xFollowers: 3500,
      discordMembers: 800,
      holders: 2500
    };
    
    // Update community stat elements if they exist
    const communityStatElements = document.querySelectorAll('.community-stat');
    communityStatElements.forEach(el => {
      const statType = el.dataset.stat;
      if (statType && communityStats[statType]) {
        animateCounter(el.id || el.dataset.id, communityStats[statType]);
      }
    });
    
  } catch (error) {
    console.error('Error updating community stats:', error);
  }
}

function initTimelineAnimations() {
  // Animate progress bars on page load
  setTimeout(() => {
    animateAllProgressBars();
  }, 500);
  
  // Add special animation for 2026 milestones
  const currentMilestones = document.querySelectorAll('#current .timeline-item');
  currentMilestones.forEach((milestone, index) => {
    setTimeout(() => {
      milestone.style.animation = 'pulse 2s ease-in-out';
      setTimeout(() => {
        milestone.style.animation = '';
      }, 2000);
    }, 1000 + (index * 500));
  });
}

function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) {
    // Try to find by class if ID doesn't exist
    const elements = document.querySelectorAll('.stat-value');
    elements.forEach(el => {
      if (el.textContent && !isNaN(parseInt(el.textContent))) {
        const current = parseInt(el.textContent) || 0;
        if (current !== target) {
          animateValue(el, current, target, 1000);
        }
      }
    });
    return;
  }
  
  const current = parseInt(element.textContent) || 0;
  if (current === target) return;
  
  animateValue(element, current, target, 1000);
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function updateLastUpdated() {
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const timestampElement = document.querySelector('.update-time');
  if (timestampElement) {
    timestampElement.textContent = `Last Updated: ${dateString} at ${timeString}`;
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
  
  // Add 2026 specific milestone interactions
  const currentMilestones = document.querySelectorAll('#current .milestone-list li');
  currentMilestones.forEach(item => {
    item.addEventListener('click', function() {
      if (window.innerWidth > 768) {
        showToast(`Recent achievement: ${this.textContent}`, 'success', 3000);
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
  
  // Check if it's a future milestone
  const isFuture = milestone.closest('#future');
  
  const details = `
    Milestone Details:
    
    Timeframe: ${quarterBadge?.textContent || 'N/A'}
    Title: ${title}
    
    ${isFuture ? 'Planned Achievements:' : 'Completed Achievements:'}
    • ${description}
    
    ${isFuture ? 'Status: Planned for implementation' : 'Status: Successfully completed'}
  `;
  
  showToast(`Viewing details for: ${title}`, 'info');
  
  // Simulate showing modal
  setTimeout(() => {
    if (window.innerWidth > 768 && !isFuture) {
      console.log('Milestone details:', details);
      // In production, this would open a detailed modal
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
            
            // Add special animation for current section
            if (entry.target.id === 'current') {
              entry.target.style.boxShadow = '0 0 30px rgba(255, 204, 0, 0.3)';
              setTimeout(() => {
                entry.target.style.boxShadow = '';
              }, 2000);
            }
          }, index * 200);
        }
      });
    }, { threshold: 0.1 });
    
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease';
    observer.observe(section);
  });
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.timeline-section, .principle-card, .milestone-highlight, .related-card, .takeaway-item'
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
    '.timeline-section, .principle-card, .milestone-highlight, .related-card, .takeaway-item'
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
  const savedProgress = localStorage.getItem('roadmapLastViewed2026');
  if (savedProgress) {
    try {
      const progress = JSON.parse(savedProgress);
      const now = new Date();
      const lastVisit = new Date(progress.lastVisit);
      const daysSince = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
      
      if (daysSince > 0) {
        showToast(`Welcome back to our 2026 roadmap! ${daysSince} day${daysSince === 1 ? '' : 's'} since your last visit.`, 'info');
      }
    } catch (e) {
      console.error('Error loading roadmap progress:', e);
    }
  }
  
  // Save current visit
  localStorage.setItem('roadmapLastViewed2026', JSON.stringify({
    lastVisit: new Date().toISOString(),
    page: 'roadmap-2026',
    version: '2026'
  }));
}

// ========== EXPORTED FUNCTIONS ==========
function viewCurrentProgress() {
  document.getElementById('current').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  showToast('Scrolling to current 2026 progress', 'info');
}

function view2025Achievements() {
  document.getElementById('completed').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  showToast('Scrolling to 2025 achievements', 'info');
}

function view2026Vision() {
  document.getElementById('future').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
  showToast('Scrolling to 2026-2027 vision', 'info');
}

// ========== GLOBAL EXPORTS ==========
window.viewCurrentProgress = viewCurrentProgress;
window.view2025Achievements = view2025Achievements;
window.view2026Vision = view2026Vision;
window.initializeMobileDropdown = initializeMobileDropdown;
window.showToast = showToast;

// Add touch-active class styles and 2026 specific styles
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
    
    /* 2026 specific animations */
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(255, 204, 0, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0); }
    }
    
    .current-status-badge {
      animation: pulse 2s infinite;
    }
    
    /* Countdown styles */
    .countdown {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .countdown-item {
      text-align: center;
      min-width: 60px;
    }
    
    .countdown-value {
      display: block;
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--rebel-gold);
      background: rgba(0, 0, 0, 0.3);
      padding: 0.5rem;
      border-radius: 8px;
      margin-bottom: 0.25rem;
    }
    
    .countdown-label {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .dao-launched {
      color: #4CAF50;
      font-weight: 900;
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
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
      
      .countdown {
        gap: 0.5rem;
      }
      
      .countdown-item {
        min-width: 50px;
      }
      
      .countdown-value {
        font-size: 1.4rem;
        padding: 0.4rem;
      }
    }
  `;
  document.head.appendChild(style);
});

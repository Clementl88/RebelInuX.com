// js/tokenomics-page.js - Consolidated tokenomics page JavaScript

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Tokenomics page');
  
  // Hide loader
  setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1000);
  
  // Initialize all components
  initializeMobileMenu();
  initializeBackToTop();
  initializeTokenomicsChart();
  initializeAccordion();
  initializeProgressCalculations();
  initializeMobileTouch();
  initializeScrollAnimations();
  
  // Set up intervals for live updates
  setInterval(updateFounderCommitmentProgress, 60000);
  setInterval(updateContractProgress, 60000);
});

// ========== MOBILE MENU ==========
function initializeMobileMenu() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      const nav = document.getElementById('nav-desktop');
      const icon = this.querySelector('i');
      const body = document.body;
      
      nav.classList.toggle('active');
      if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        body.style.overflow = 'hidden';
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        body.style.overflow = '';
      }
    });
  }
  
  // Close mobile nav when clicking on a link
  document.querySelectorAll('#nav-desktop a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        document.getElementById('nav-desktop').classList.remove('active');
        const toggleIcon = document.getElementById('mobileNavToggle').querySelector('i');
        if (toggleIcon) {
          toggleIcon.classList.remove('fa-times');
          toggleIcon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close mobile nav when clicking outside
  document.addEventListener('click', function(event) {
    const nav = document.getElementById('nav-desktop');
    const toggle = document.getElementById('mobileNavToggle');
    
    if (window.innerWidth <= 768 && 
        nav && nav.classList.contains('active') && 
        !nav.contains(event.target) && 
        (!toggle || !toggle.contains(event.target))) {
      nav.classList.remove('active');
      const toggleIcon = toggle?.querySelector('i');
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-times');
        toggleIcon.classList.add('fa-bars');
      }
      document.body.style.overflow = '';
    }
  });
  
  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    if (window.innerWidth > 768) {
      const nav = document.getElementById('nav-desktop');
      if (nav) nav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ========== BACK TO TOP ==========
function initializeBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ========== TOKENOMICS CHART ==========
function initializeTokenomicsChart() {
  const ctx = document.getElementById('distributionChart');
  if (!ctx) {
    console.warn('Distribution chart canvas not found');
    showFallbackChart();
    return;
  }
  
  try {
    // Destroy existing chart if it exists
    if (window.tokenomicsChart) {
      window.tokenomicsChart.destroy();
    }
    
    // Create new chart
    window.tokenomicsChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          'Bonding Curve (53.77%)',
          'Founder\'s Commitment (16.23%)',
          'ZORA Rewards Treasury (16%)',
          'Team Fund (7%)',
          'Ecosystem Fund (6%)',
          'Community DAO Reserve (1%)'
        ],
        datasets: [{
          data: [53.77, 16.23, 16, 7, 6, 1],
          backgroundColor: [
            'rgba(255, 51, 102, 0.9)',     // Red - Bonding Curve
            'rgba(0, 170, 255, 0.9)',      // Blue - Founder's Commitment
            'rgba(156, 39, 176, 0.9)',     // Purple - ZORA Rewards Treasury
            'rgba(75, 192, 192, 0.9)',     // Teal - Team Fund
            'rgba(255, 206, 86, 0.9)',     // Yellow - Ecosystem Fund
            'rgba(75, 192, 86, 0.9)'       // Green - Community DAO
          ],
          borderColor: [
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)',
            'rgba(255, 255, 255, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: window.innerWidth <= 768 ? 'bottom' : 'right',
            labels: {
              font: {
                size: window.innerWidth <= 768 ? 10 : 14,
                family: 'Montserrat',
                weight: '600'
              },
              color: 'white',
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'var(--rebel-gold)',
            bodyColor: 'white',
            titleFont: { size: 14 },
            bodyFont: { size: 13 }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 1000
        }
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
      if (window.tokenomicsChart) {
        window.tokenomicsChart.options.plugins.legend.position = window.innerWidth <= 768 ? 'bottom' : 'right';
        window.tokenomicsChart.resize();
        window.tokenomicsChart.update();
      }
    }, 250));
    
  } catch (error) {
    console.error('Chart initialization failed:', error);
    showFallbackChart();
  }
}

// ========== ACCORDION ==========
function initializeAccordion() {
  const accordionContainer = document.querySelector('.accordion');
  if (!accordionContainer) return;
  
  // Add Expand/Collapse controls
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'accordion-controls';
  controlsContainer.innerHTML = `
    <button id="expandAll" class="cta-button">
      <i class="fas fa-expand-alt"></i> Expand All Sections
    </button>
    <button id="collapseAll" class="cta-button gold">
      <i class="fas fa-compress-alt"></i> Collapse All Sections
    </button>
  `;
  
  // Insert controls before accordion
  accordionContainer.parentNode.insertBefore(controlsContainer, accordionContainer);
  
  // Set up click handlers for accordion headers
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const content = this.nextElementSibling;
      const isActive = content.classList.contains('active');
      
      // Toggle this item
      if (isActive) {
        content.classList.remove('active');
        this.classList.remove('active');
      } else {
        content.classList.add('active');
        this.classList.add('active');
        
        // Smooth scroll to expanded section
        setTimeout(() => {
          content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    });
  });
  
  // Set up expand/collapse all buttons
  document.getElementById('expandAll')?.addEventListener('click', expandAllAccordions);
  document.getElementById('collapseAll')?.addEventListener('click', collapseAllAccordions);
}

function expandAllAccordions() {
  document.querySelectorAll('.accordion-content').forEach(content => {
    content.classList.add('active');
  });
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.classList.add('active');
  });
}

function collapseAllAccordions() {
  document.querySelectorAll('.accordion-content').forEach(content => {
    content.classList.remove('active');
  });
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.classList.remove('active');
  });
}

// ========== PROGRESS CALCULATIONS ==========
function initializeProgressCalculations() {
  updateFounderCommitmentProgress();
  updateContractProgress();
  updateDAOReserveProgress();
  
  // Trigger initial animations
  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(bar => {
      bar.style.transition = 'width 1.5s ease-in-out';
    });
  }, 500);
}

function updateFounderCommitmentProgress() {
  // Exact contract dates from Streamflow
  const startDate = new Date("2025-11-01T01:28:00Z");
  const endDate = new Date("2026-11-01T01:27:00Z");
  const nextUnlockDate = new Date("2025-12-31T21:28:00Z");
  
  const now = new Date();
  const totalDuration = endDate - startDate;
  const elapsed = Math.max(0, now - startDate);
  
  // Calculate time-based progress
  const timeProgressPercent = Math.min(100, (elapsed / totalDuration) * 100);
  const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  const daysTotal = 365;
  
  // From Streamflow: 8% already unlocked
  const unlockedPercent = 8;
  const unlockedAmount = 13.49; // In millions
  
  // Update progress bars
  const unlockedBar = document.getElementById('founderUnlockedBar');
  const timeBar = document.getElementById('founderTimeBar');
  const unlockedAmountEl = document.getElementById('founderUnlockedAmount');
  const timeProgressEl = document.getElementById('founderTimeProgress');
  const nextUnlockDateEl = document.getElementById('founderNextUnlockDate');
  const daysCountEl = document.getElementById('founderDaysCount');
  
  if (unlockedBar) unlockedBar.style.width = `${unlockedPercent}%`;
  if (timeBar) timeBar.style.width = `${timeProgressPercent.toFixed(1)}%`;
  if (unlockedAmountEl) unlockedAmountEl.textContent = `${unlockedAmount}M REBL`;
  if (timeProgressEl) timeProgressEl.textContent = `${daysElapsed} days`;
  if (daysCountEl) daysCountEl.innerHTML = `<strong>${daysElapsed} of ${daysTotal} days</strong>`;
  
  // Calculate next unlock countdown
  const timeToNextUnlock = nextUnlockDate - now;
  if (nextUnlockDateEl && timeToNextUnlock > 0) {
    const daysToNext = Math.floor(timeToNextUnlock / (1000 * 60 * 60 * 24));
    const hoursToNext = Math.floor((timeToNextUnlock % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    nextUnlockDateEl.innerHTML = `Dec 31, 2025 <span style="color: #FFD700; font-size: 0.8em;">(${daysToNext}d ${hoursToNext}h)</span>`;
  } else if (nextUnlockDateEl) {
    nextUnlockDateEl.textContent = 'Dec 31, 2025';
  }
  
  // Update accordion elements
  const founderProgressBar = document.getElementById('founderProgressBar');
  const founderProgressText = document.getElementById('founderProgressText');
  const founderUnlockedAmountAccordion = document.getElementById('founderUnlockedAmountAccordion');
  const founderDaysElapsed = document.getElementById('founderDaysElapsed');
  const nextUnlockCountdown = document.getElementById('nextUnlockCountdown');
  
  if (founderProgressBar) founderProgressBar.style.width = `${unlockedPercent}%`;
  if (founderProgressText) founderProgressText.textContent = `${unlockedPercent}%`;
  if (founderUnlockedAmountAccordion) founderUnlockedAmountAccordion.textContent = `${unlockedAmount}M`;
  if (founderDaysElapsed) founderDaysElapsed.textContent = daysElapsed || '~30';
  
  if (nextUnlockCountdown && timeToNextUnlock > 0) {
    const days = Math.floor(timeToNextUnlock / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeToNextUnlock % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    nextUnlockCountdown.textContent = `${days}d ${hours}h`;
  } else if (nextUnlockCountdown) {
    nextUnlockCountdown.textContent = 'Unlocked!';
  }
}

function updateContractProgress() {
  const cliffDate = new Date("2025-09-14T17:36:00Z");
  const endDate = new Date("2027-09-14T17:33:00Z");
  const now = new Date();
  
  let progress = 47.5; // Base: 76M already unlocked out of 160M
  
  if (now > cliffDate) {
    const totalDuration = endDate - cliffDate;
    const elapsed = now - cliffDate;
    const linearProgress = Math.min(60, (elapsed / totalDuration) * 60);
    progress = 40 + linearProgress;
    progress = Math.min(100, progress);
  }
}

function updateDAOReserveProgress() {
  const lockupEnd = new Date("2026-07-01T00:00:00Z");
  const vestingEnd = new Date("2028-07-01T00:00:00Z");
  const now = new Date();
  
  let progress = 0;
  
  if (now >= lockupEnd) {
    if (now >= vestingEnd) {
      progress = 100;
    } else {
      const vestingDuration = vestingEnd - lockupEnd;
      const elapsedAfterLockup = now - lockupEnd;
      progress = Math.min(100, (elapsedAfterLockup / vestingDuration) * 100);
    }
  }
}

// ========== MOBILE TOUCH ==========
function initializeMobileTouch() {
  // Prevent zoom on double-tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Add touch feedback for buttons
  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    });
    
    element.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    });
  });
}

// ========== SCROLL ANIMATIONS ==========
function initializeScrollAnimations() {
  const cards = document.querySelectorAll(
    '.takeaway-item, .stat-card, .vesting-card, .faq-item, .related-card, .timeline-item, .revenue-card, .supply-stat, .security-stat'
  );
  
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  
  function animateCards() {
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 50);
      }
    });
  }
  
  window.addEventListener('scroll', animateCards);
  animateCards(); // Initial check
  
  // Timeline animations
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, index * 100);
  });
  
  // Progress bar animations on scroll
  document.addEventListener('scroll', function() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        bar.style.transition = 'width 1.5s ease-in-out';
      }
    });
  });
}

// ========== HELPER FUNCTIONS ==========
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showFallbackChart() {
  const chartContainer = document.querySelector('.chart-wrapper');
  if (chartContainer) {
    chartContainer.innerHTML = `
      <div class="chart-fallback">
        <div class="fallback-icon">
          <i class="fas fa-chart-pie"></i>
        </div>
        <h4>Interactive Chart Unavailable</h4>
        <p>Showing data in table format</p>
        <div class="fallback-data">
          <table>
            <tr><td>Bonding Curve:</td><td>53.77%</td></tr>
            <tr><td>Founder's Commitment:</td><td>16.23%</td></tr>
            <tr><td>ZORA Rewards Treasury:</td><td>16%</td></tr>
            <tr><td>Team Fund:</td><td>7%</td></tr>
            <tr><td>Ecosystem Fund:</td><td>6%</td></tr>
            <tr><td>Community DAO Reserve:</td><td>1%</td></tr>
          </table>
        </div>
      </div>
    `;
  }
}

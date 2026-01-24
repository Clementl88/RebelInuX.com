  <script>
    // Initialize page
  document.addEventListener('DOMContentLoaded', function() {
  // Hide loader
  setTimeout(function() {
    document.getElementById('loader').classList.add('hidden');
  }, 1000);
  
  // Mobile menu toggle
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
        body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        body.style.overflow = '';
      }
    });
  }
  
  // Initialize mobile dropdown
  initializeMobileDropdown();

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
      
      // Close all other dropdowns first
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
      });
      
      // Toggle this dropdown
      if (!isActive) {
        dropdownContent.style.display = 'block';
        dropdownContent.classList.add('active');
        this.classList.add('active');
        
        // Force all links to be visible
        dropdownContent.querySelectorAll('a').forEach(link => {
          link.style.display = 'flex';
          link.style.visibility = 'visible';
          link.style.opacity = '1';
          link.style.height = 'auto';
          link.style.overflow = 'visible';
        });
        
        // Specifically ensure community link is visible
        const communityLink = dropdownContent.querySelector('.nav-community');
        if (communityLink) {
          communityLink.style.display = 'flex';
          communityLink.style.visibility = 'visible';
          communityLink.style.opacity = '1';
        }
      } else {
        dropdownContent.style.display = 'none';
        dropdownContent.classList.remove('active');
        this.classList.remove('active');
      }
    }
  });
  
  // Close dropdown when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const dropdown = document.querySelector('.dropdown');
      const dropdownContent = document.querySelector('.dropdown-content');
      const dropbtn = document.querySelector('.dropbtn');
      
      if (!e.target.closest('.dropdown') && 
          dropdownContent && 
          dropbtn) {
        dropdownContent.style.display = 'none';
        dropdownContent.classList.remove('active');
        dropbtn.classList.remove('active');
      }
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropbtn = document.querySelector('.dropbtn');
    
    if (window.innerWidth > 768) {
      // Reset styles for desktop
      if (dropdownContent) {
        dropdownContent.style.display = '';
        dropdownContent.classList.remove('active');
        // Reset all links to default
        dropdownContent.querySelectorAll('a').forEach(link => {
          link.style.display = '';
          link.style.visibility = '';
          link.style.opacity = '';
        });
      }
      if (dropbtn) {
        dropbtn.classList.remove('active');
      }
    }
  });
  
  // Close dropdown when clicking a link inside it
  document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        const dropdownContent = this.closest('.dropdown-content');
        const dropbtn = document.querySelector('.dropbtn');
        
        if (dropdownContent) {
          dropdownContent.style.display = 'none';
          dropdownContent.classList.remove('active');
        }
        if (dropbtn) {
          dropbtn.classList.remove('active');
        }
        
        // Also close the mobile menu if it's open
        const mobileMenu = document.getElementById('nav-desktop');
        const toggleIcon = document.getElementById('mobileNavToggle')?.querySelector('i');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          if (toggleIcon) {
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-bars');
          }
          document.body.style.overflow = '';
        }
      }
    });
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
            nav.classList.contains('active') && 
            !nav.contains(event.target) && 
            !toggle.contains(event.target)) {
          nav.classList.remove('active');
          const toggleIcon = toggle.querySelector('i');
          if (toggleIcon) {
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-bars');
          }
          document.body.style.overflow = '';
        }
      });
      
      // Back to top button
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
      
      // Initialize chart
      initializeTokenomicsChart();
      
      // Initialize accordion
      initializeAccordion();
      
      // Initialize progress calculations
      updateFounderCommitmentProgress();
      updateContractProgress();
      updateDAOReserveProgress();
      
      // Set up intervals for live updates
      setInterval(updateFounderCommitmentProgress, 60000);
      setInterval(updateContractProgress, 60000);
      
      // Mobile touch improvements
      initializeMobileTouch();
      
      // Handle orientation change
      window.addEventListener('orientationchange', function() {
        // Reset chart on orientation change
        if (window.tokenomicsChart) {
          setTimeout(function() {
            window.tokenomicsChart.resize();
          }, 200);
        }
        
        // Close mobile menu on orientation change
        if (window.innerWidth > 768) {
          const nav = document.getElementById('nav-desktop');
          if (nav) nav.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
    
    // Tokenomics Chart - CORRECTED VERSION
    function initializeTokenomicsChart() {
      const ctx = document.getElementById('distributionChart');
      if (!ctx) return;
      
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
              titleFont: {
                size: 14
              },
              bodyFont: {
                size: 13
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true,
            duration: 1000
          }
        }
      });
    }
    
    // Founder's Commitment - Accurate Progress Calculator
    function updateFounderCommitmentProgress() {
      // Exact contract dates from Streamflow
      const startDate = new Date("2025-11-01T01:28:00Z"); // Nov 1, 2025, 02:28 AM GMT+1
      const endDate = new Date("2026-11-01T01:27:00Z");   // Nov 1, 2026, 02:27 AM GMT+1
      const nextUnlockDate = new Date("2025-12-31T21:28:00Z"); // Dec 31, 2025, 10:28 PM GMT+1
      
      const now = new Date();
      const totalDuration = endDate - startDate; // Total milliseconds in 1 year
      const elapsed = Math.max(0, now - startDate); // Milliseconds elapsed
      
      // Calculate time-based progress (0-100%)
      const timeProgressPercent = Math.min(100, (elapsed / totalDuration) * 100);
      
      // Calculate days elapsed/remaining
      const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
      const daysTotal = 365; // 1 year
      const daysRemaining = Math.max(0, daysTotal - daysElapsed);
      
      // From Streamflow: 8% already unlocked (13.4863M of 161.8367M)
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
      
      if (unlockedAmountEl) {
        unlockedAmountEl.textContent = `${unlockedAmount}M REBL`;
      }
      
      if (timeProgressEl) {
        timeProgressEl.textContent = `${daysElapsed} days`;
      }
      
      if (nextUnlockDateEl) {
        nextUnlockDateEl.textContent = `Dec 31, 2025`;
      }
      
      if (daysCountEl) {
        daysCountEl.innerHTML = `<strong>${daysElapsed} of ${daysTotal} days</strong>`;
      }
      
      // Calculate and display next unlock countdown
      const timeToNextUnlock = nextUnlockDate - now;
      if (timeToNextUnlock > 0) {
        const daysToNext = Math.floor(timeToNextUnlock / (1000 * 60 * 60 * 24));
        const hoursToNext = Math.floor((timeToNextUnlock % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        // Update the next unlock display with countdown
        if (nextUnlockDateEl) {
          nextUnlockDateEl.innerHTML = `Dec 31, 2025 <span style="color: #FFD700; font-size: 0.8em;">(${daysToNext}d ${hoursToNext}h)</span>`;
        }
      }
      
      // Update accordion progress if it exists
      const founderProgressBar = document.getElementById('founderProgressBar');
      const founderProgressText = document.getElementById('founderProgressText');
      const founderUnlockedAmountAccordion = document.getElementById('founderUnlockedAmountAccordion');
      const founderNextUnlockDateAccordion = document.getElementById('founderNextUnlockDateAccordion');
      
      if (founderProgressBar) founderProgressBar.style.width = `${unlockedPercent}%`;
      if (founderProgressText) founderProgressText.textContent = `${unlockedPercent}%`;
      if (founderUnlockedAmountAccordion) founderUnlockedAmountAccordion.textContent = `${unlockedAmount}M`;
      if (founderNextUnlockDateAccordion) founderNextUnlockDateAccordion.textContent = 'Dec 31, 2025';
    }
    
    // Update contract progress dynamically
    function updateContractProgress() {
      const cliffDate = new Date("2025-09-14T17:36:00Z"); // Sep 14, 2025, 06:36 PM GMT+1
      const endDate = new Date("2027-09-14T17:33:00Z"); // Sep 14, 2027, 06:33 PM GMT+1
      const now = new Date();
      
      let progress = 47.5; // Base: 76M already unlocked out of 160M
      
      if (now > cliffDate) {
        const totalDuration = endDate - cliffDate;
        const elapsed = now - cliffDate;
        const linearProgress = Math.min(60, (elapsed / totalDuration) * 60);
        progress = 40 + linearProgress;
        progress = Math.min(100, progress);
      }
      
      const progressBar = document.getElementById('contractProgressBar');
      const progressText = document.getElementById('contractProgress');
      
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      if (progressText) {
        progressText.textContent = `${progress.toFixed(1)}%`;
      }
    }
    
    // Community DAO Reserve progress calculation
    function updateDAOReserveProgress() {
      const lockupEnd = new Date("2026-07-01T00:00:00Z"); // July 1, 2026
      const vestingEnd = new Date("2028-07-01T00:00:00Z"); // 24 months later
      const now = new Date();
      
      let progress = 0;
      
      if (now >= lockupEnd) {
        if (now >= vestingEnd) {
          progress = 100;
        } else {
          // Calculate linear progress after lockup
          const vestingDuration = vestingEnd - lockupEnd;
          const elapsedAfterLockup = now - lockupEnd;
          progress = Math.min(100, (elapsedAfterLockup / vestingDuration) * 100);
        }
      }
      
      // Update progress bars for DAO Reserve card
      const daoProgressBars = document.querySelectorAll('.vesting-card:last-child .progress-fill');
      if (daoProgressBars.length >= 2) {
        // First bar (lockup period)
        daoProgressBars[0].style.width = now >= lockupEnd ? '100%' : '0%';
        
        // Second bar (linear vesting)
        daoProgressBars[1].style.width = `${progress}%`;
      }
    }
    
// Accordion functionality - CORRECTED VERSION
function initializeAccordion() {
  // Create and add Expand All button
  const accordionContainer = document.querySelector('.accordion');
  if (accordionContainer) {
    const expandAllBtn = document.createElement('button');
    expandAllBtn.className = 'accordion-button';
    expandAllBtn.style.margin = '0 auto 20px';
    expandAllBtn.style.display = 'block';
    expandAllBtn.innerHTML = '<i class="fas fa-expand-alt"></i> Expand All Sections';
    expandAllBtn.addEventListener('click', expandAllAccordions);
    
    accordionContainer.insertBefore(expandAllBtn, accordionContainer.firstChild);
    
    // Add click event to all accordion headers
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const content = header.nextElementSibling;
        const isActive = content.classList.contains('active');
        
        // Toggle just this item
        if (isActive) {
          content.classList.remove('active');
          header.classList.remove('active');
        } else {
          content.classList.add('active');
          header.classList.add('active');
          
          // Smooth scroll to expanded section
          setTimeout(() => {
            content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 300);
        }
      });
    });
    
  }
}

// Function to expand all accordions
function expandAllAccordions() {
  document.querySelectorAll('.accordion-content').forEach(content => {
    content.classList.add('active');
  });
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.classList.add('active');
  });
  
  // Change button text
  const expandBtn = document.querySelector('.accordion-button');
  if (expandBtn) {
    expandBtn.innerHTML = '<i class="fas fa-compress-alt"></i> Collapse All Sections';
    expandBtn.removeEventListener('click', expandAllAccordions);
    expandBtn.addEventListener('click', collapseAllAccordions);
  }
}

// Function to collapse all accordions
function collapseAllAccordions() {
  document.querySelectorAll('.accordion-content').forEach(content => {
    content.classList.remove('active');
  });
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.classList.remove('active');
  });
  
  // Change button text back
  const collapseBtn = document.querySelector('.accordion-button');
  if (collapseBtn) {
    collapseBtn.innerHTML = '<i class="fas fa-expand-alt"></i> Expand All Sections';
    collapseBtn.removeEventListener('click', collapseAllAccordions);
    collapseBtn.addEventListener('click', expandAllAccordions);
  }
}
    
    // Mobile touch improvements
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
      
      // Resize chart on window resize
      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          if (window.tokenomicsChart) {
            window.tokenomicsChart.resize();
            // Update legend position for mobile
            window.tokenomicsChart.options.plugins.legend.position = window.innerWidth <= 768 ? 'bottom' : 'right';
            window.tokenomicsChart.update();
          }
        }, 250);
      });
      
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
    
    // Trigger initial progress bar animations
    setTimeout(() => {
      document.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.transition = 'width 1.5s ease-in-out';
      });
      
      // Initial chart update
      if (window.tokenomicsChart) {
        window.tokenomicsChart.update();
      }
    }, 500);
  </script>

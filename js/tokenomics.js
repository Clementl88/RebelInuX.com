// js/tokenomics.js - Simplified version
document.addEventListener('DOMContentLoaded', function() {
  console.log('Tokenomics page loaded');
  
  // Hide loader
  setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 1000);
  
  // Initialize components
  initializeTokenomicsChart();
  initializeAccordion();
  updateProgressCalculations();
  
  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

function initializeTokenomicsChart() {
  const ctx = document.getElementById('distributionChart');
  if (!ctx) return;
  
  try {
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Bonding Curve (53.77%)', 'Founder\'s Commitment (16.23%)', 'ZORA Rewards Treasury (16%)', 'Team Fund (7%)', 'Ecosystem Fund (6%)', 'Community DAO Reserve (1%)'],
        datasets: [{
          data: [53.77, 16.23, 16, 7, 6, 1],
          backgroundColor: [
            'rgba(255, 51, 102, 0.9)',
            'rgba(0, 170, 255, 0.9)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(75, 192, 192, 0.9)',
            'rgba(255, 206, 86, 0.9)',
            'rgba(75, 192, 86, 0.9)'
          ],
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 2,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: window.innerWidth <= 768 ? 'bottom' : 'right'
          }
        }
      }
    });
  } catch (error) {
    console.error('Chart error:', error);
  }
}

function initializeAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      content.classList.toggle('active');
      this.classList.toggle('active');
    });
  });
  
  // Expand/Collapse buttons
  const expandAll = document.getElementById('expandAll');
  const collapseAll = document.getElementById('collapseAll');
  
  if (expandAll) {
    expandAll.addEventListener('click', function() {
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.add('active'));
      document.querySelectorAll('.accordion-header').forEach(h => h.classList.add('active'));
    });
  }
  
  if (collapseAll) {
    collapseAll.addEventListener('click', function() {
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
    });
  }
}

function updateProgressCalculations() {
  // Update founder commitment progress
  const unlockedBar = document.getElementById('founderUnlockedBar');
  const timeBar = document.getElementById('founderTimeBar');
  
  if (unlockedBar) unlockedBar.style.width = '8%';
  if (timeBar) {
    const startDate = new Date("2025-11-01T01:28:00Z");
    const endDate = new Date("2026-11-01T01:27:00Z");
    const now = new Date();
    const totalDuration = endDate - startDate;
    const elapsed = Math.max(0, now - startDate);
    const timeProgressPercent = Math.min(100, (elapsed / totalDuration) * 100);
    timeBar.style.width = `${timeProgressPercent.toFixed(1)}%`;
  }
}

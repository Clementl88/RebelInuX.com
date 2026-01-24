// js/tokenomics.js - Tokenomics page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tokenomics page loaded');
    
    // Hide loader after page loads
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }, 500);
    
    // Initialize all components
    initializeAccordion();
    initializeTokenomicsChart();
    setupBackToTop();
    setupProgressUpdates();
    
    // Initial progress calculation
    updateFounderProgress();
});

// ========== ACCORDION FUNCTIONALITY ==========
function initializeAccordion() {
    console.log('Initializing accordion...');
    
    // Get all accordion headers
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    if (accordionHeaders.length === 0) {
        console.warn('No accordion headers found!');
        return;
    }
    
    console.log(`Found ${accordionHeaders.length} accordion headers`);
    
    // Add click event to each header
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const content = this.nextElementSibling;
            const isActive = content.classList.contains('active');
            
            console.log('Accordion clicked, isActive:', isActive);
            
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
    const expandAllBtn = document.getElementById('expandAll');
    const collapseAllBtn = document.getElementById('collapseAll');
    
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.classList.add('active');
            });
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.classList.add('active');
            });
        });
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.classList.remove('active');
            });
        });
    }
    
    console.log('Accordion initialized successfully');
}

// ========== CHART INITIALIZATION ==========
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
                        'rgba(255, 51, 102, 0.9)',     // Red
                        'rgba(0, 170, 255, 0.9)',      // Blue
                        'rgba(156, 39, 176, 0.9)',     // Purple
                        'rgba(75, 192, 192, 0.9)',     // Teal
                        'rgba(255, 206, 86, 0.9)',     // Yellow
                        'rgba(75, 192, 86, 0.9)'       // Green
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
                        position: window.innerWidth <= 768 ? 'bottom' : 'right',
                        labels: {
                            color: 'white',
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
        
    } catch (error) {
        console.error('Chart initialization failed:', error);
        showFallbackChart();
    }
}

// ========== PROGRESS UPDATES ==========
function setupProgressUpdates() {
    // Update founder progress
    updateFounderProgress();
    
    // Set interval for live updates (every minute)
    setInterval(updateFounderProgress, 60000);
}

function updateFounderProgress() {
    const startDate = new Date("2025-11-01T01:28:00Z");
    const endDate = new Date("2026-11-01T01:27:00Z");
    const now = new Date();
    
    const totalDuration = endDate - startDate;
    const elapsed = Math.max(0, now - startDate);
    
    // Calculate time-based progress
    const timeProgressPercent = Math.min(100, (elapsed / totalDuration) * 100);
    
    // From Streamflow: 8% already unlocked
    const unlockedPercent = 8;
    
    // Update progress bars
    const unlockedBar = document.getElementById('founderUnlockedBar');
    const timeBar = document.getElementById('founderTimeBar');
    
    if (unlockedBar) unlockedBar.style.width = `${unlockedPercent}%`;
    if (timeBar) timeBar.style.width = `${timeProgressPercent.toFixed(1)}%`;
    
    // Update text values
    const unlockedAmountEl = document.getElementById('founderUnlockedAmount');
    const timeProgressEl = document.getElementById('founderTimeProgress');
    
    if (unlockedAmountEl) {
        unlockedAmountEl.textContent = '13.49M REBL';
    }
    
    if (timeProgressEl) {
        const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        timeProgressEl.textContent = `${daysElapsed} days`;
    }
}

// ========== BACK TO TOP BUTTON ==========
function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
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

// ========== FALLBACK FOR CHART ==========
function showFallbackChart() {
    const chartContainer = document.querySelector('.chart-wrapper');
    if (!chartContainer) return;
    
    chartContainer.innerHTML = `
        <div class="chart-fallback">
            <div class="fallback-icon">
                <i class="fas fa-chart-pie"></i>
            </div>
            <h4>Token Distribution</h4>
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

// ========== WINDOW RESIZE HANDLER ==========
window.addEventListener('resize', function() {
    if (window.tokenomicsChart) {
        window.tokenomicsChart.options.plugins.legend.position = window.innerWidth <= 768 ? 'bottom' : 'right';
        window.tokenomicsChart.resize();
        window.tokenomicsChart.update();
    }
});

// Add this function to js/includes.js after the existing functions
// Function to set active navigation item based on current page
function setActiveNavItem() {
    console.log('Setting active navigation item...');
    
    // Get current page filename
    const path = window.location.pathname;
    let currentPage = path.split('/').pop();
    
    // Handle empty path or root
    if (currentPage === '' || currentPage === '/' || !currentPage) {
        currentPage = 'index.html';
    }
    
    console.log('Current page:', currentPage);
    
    // Wait for navigation to be in DOM
    setTimeout(() => {
        // Get all navigation links - try multiple selectors
        const selectors = [
            '#nav-desktop a',
            '.dropdown-content a',
            '.nav-links a',
            '.nav-menu a',
            'header a[href*=".html"]'
        ];
        
        let navLinks = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length) {
                navLinks = [...navLinks, ...elements];
            }
        });
        
        if (navLinks.length === 0) {
            console.warn('No navigation links found');
            return;
        }
        
        // Remove active class from all links first
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Remove any inline color styles
            link.style.color = '';
        });
        
        // Find and highlight the matching link
        let activeFound = false;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Skip empty links, hash links, and javascript links
            if (href === '#' || href === '' || href.startsWith('javascript:')) {
                return;
            }
            
            // Extract filename from href
            const hrefPage = href.split('/').pop();
            
            // Check if this link matches the current page
            if (hrefPage === currentPage) {
                link.classList.add('active');
                link.style.color = 'white';
                
                // Also style parent if needed
                const parentLi = link.closest('li');
                if (parentLi) {
                    parentLi.classList.add('active');
                }
                
                // If this is in a dropdown, highlight the dropdown button too
                const dropdown = link.closest('.dropdown-content');
                if (dropdown) {
                    const dropbtn = dropdown.previousElementSibling;
                    if (dropbtn && dropbtn.classList.contains('dropbtn')) {
                        dropbtn.classList.add('active');
                    }
                }
                
                activeFound = true;
                console.log('Active link set:', href);
            }
        });
        
        // Special handling for calculator page in dropdown
        if (currentPage === 'rebl-calculator.html' && !activeFound) {
            // Try to find calculator link specifically
            const calcLink = document.querySelector('a[href*="rebl-calculator"]');
            if (calcLink) {
                calcLink.classList.add('active');
                calcLink.style.color = 'white';
                
                // Highlight the More dropdown button
                const dropdown = calcLink.closest('.dropdown-content');
                if (dropdown) {
                    const dropbtn = dropdown.previousElementSibling;
                    if (dropbtn && dropbtn.classList.contains('dropbtn')) {
                        dropbtn.classList.add('active');
                        dropbtn.style.color = 'white';
                    }
                }
                activeFound = true;
                console.log('Calculator link activated');
            }
        }
        
        // Update brand subtitle based on page
        updateBrandSubtitle(currentPage);
        
        if (!activeFound) {
            console.log('No matching nav link found for:', currentPage);
        }
    }, 150); // Slight delay to ensure DOM is ready
}

// Function to update brand subtitle based on current page
function updateBrandSubtitle(currentPage) {
    const brandSubtitle = document.querySelector('.brand-subtitle');
    if (!brandSubtitle) return;
    
    // Remove all page-specific data attributes
    brandSubtitle.removeAttribute('data-page');
    
    // Set subtitle text based on page
    let subtitleText = '';
    let pageName = '';
    
    switch(currentPage) {
        case 'index.html':
            subtitleText = 'Multi-Chain Passive Income';
            pageName = 'index';
            break;
        case 'rebl-calculator.html':
            subtitleText = 'Epoch Reward Calculator';
            pageName = 'rebl-calculator';
            break;
        case 'epoch-rewards.html':
            subtitleText = 'Claim Your Rewards';
            pageName = 'epoch-rewards';
            break;
        case 'tokenomics.html':
            subtitleText = 'Supply & Distribution';
            pageName = 'tokenomics';
            break;
        case 'trade.html':
            subtitleText = 'Buy & Trade Guide';
            pageName = 'trade';
            break;
        case 'community.html':
            subtitleText = 'Join Our Community';
            pageName = 'community';
            break;
        case 'security-integrity.html':
            subtitleText = 'Security & Integrity';
            pageName = 'security-integrity';
            break;
        case 'whitepaper.html':
            subtitleText = 'Technical Documentation';
            pageName = 'whitepaper';
            break;
        case 'governance.html':
            subtitleText = 'DAO Governance';
            pageName = 'governance';
            break;
        case 'roadmap.html':
            subtitleText = 'Development Roadmap';
            pageName = 'roadmap';
            break;
        case 'artwork.html':
            subtitleText = 'REBL Art Collection';
            pageName = 'artwork';
            break;
        default:
            subtitleText = 'Multi-Chain Passive Income';
            pageName = 'index';
    }
    
    brandSubtitle.textContent = subtitleText;
    brandSubtitle.setAttribute('data-page', pageName);
    brandSubtitle.classList.add('changing');
    
    setTimeout(() => {
        brandSubtitle.classList.remove('changing');
    }, 300);
    
    console.log('Brand subtitle updated to:', subtitleText);
}

// Also update your initializeComponents function to include setActiveNavItem
function initializeComponents() {
  console.log('⚙️ Initializing components...');
  
  try {
    // Check if common.js functions are available
    const requiredFunctions = [
      'setupMobileNavigation',
      'setupDropdowns',
      'setActiveNavItem', // Make sure this is included
      'setupBackToTop',
      'setupBuyDropdown',
      'setupHeaderScrollEffect'
    ];
    
    const missingFunctions = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
    
    if (missingFunctions.length > 0) {
      console.warn('⚠️ Missing required functions:', missingFunctions);
      
      // Define setActiveNavItem locally if missing
      if (!window.setActiveNavItem) {
        window.setActiveNavItem = setActiveNavItem;
        console.log('✅ setActiveNavItem defined locally');
      }
      
      // Try to load common.js dynamically if other functions are missing
      if (!window.commonJsLoaded && missingFunctions.some(fn => fn !== 'setActiveNavItem')) {
        console.log('🔄 Attempting to load common.js dynamically...');
        loadScript('js/common.js');
      }
    }
    
    // Initialize in correct order
    if (typeof setupMobileNavigation === 'function') {
      console.log('🔧 Setting up mobile navigation...');
      setupMobileNavigation();
    }
    
    if (typeof setupDropdowns === 'function') {
      console.log('🔧 Setting up dropdowns...');
      setupDropdowns();
    }
    
    if (typeof setupBuyDropdown === 'function') {
      console.log('🔧 Setting up buy dropdown...');
      setupBuyDropdown();
    }
    
    // ALWAYS run setActiveNavItem, regardless of where it comes from
    if (typeof window.setActiveNavItem === 'function') {
      console.log('🔧 Setting active nav item...');
      window.setActiveNavItem();
    } else {
      // Fallback - use our local function
      console.log('🔧 Using local setActiveNavItem...');
      setActiveNavItem();
    }
    
    if (typeof setupHeaderScrollEffect === 'function') {
      console.log('🔧 Setting up header scroll effect...');
      setupHeaderScrollEffect();
    }
    
    if (typeof setupBackToTop === 'function') {
      console.log('🔧 Setting up back to top...');
      setupBackToTop();
    }
    
    // Dispatch initialization complete event
    document.dispatchEvent(new CustomEvent('components:initialized'));
    
    console.log('✅ Components initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing components:', error);
  }
}

// Also add a dedicated function to highlight calculator specifically
function highlightCalculatorLink() {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'rebl-calculator.html') {
        const calcLink = document.querySelector('a[href*="rebl-calculator"]');
        if (calcLink) {
            calcLink.classList.add('active');
            calcLink.style.color = 'white';
            
            // Highlight the More dropdown button
            const dropdown = calcLink.closest('.dropdown-content');
            if (dropdown) {
                const dropbtn = dropdown.previousElementSibling;
                if (dropbtn && dropbtn.classList.contains('dropbtn')) {
                    dropbtn.classList.add('active');
                }
            }
            console.log('Calculator link highlighted via direct function');
        }
    }
}

// Export the functions
window.setActiveNavItem = setActiveNavItem;
window.updateBrandSubtitle = updateBrandSubtitle;
window.highlightCalculatorLink = highlightCalculatorLink;

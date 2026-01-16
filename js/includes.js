// js/includes.js - Load header and footer components

// Global state to track component loading
window.componentsLoaded = false;
window.componentsLoading = false;

// Load all components
async function loadAllComponents() {
  if (window.componentsLoading) return;
  window.componentsLoading = true;
  
  console.log('🔄 Loading components...');
  
  try {
    // Load header
    if (document.getElementById('header-container')) {
      await loadComponent('header-container', 'header.html');
    }
    
    // Load footer
    if (document.getElementById('footer-container')) {
      await loadComponent('footer-container', 'footer.html');
    }
    
    window.componentsLoaded = true;
    console.log('✅ All components loaded successfully');
    
    // Initialize dropdowns after ALL components are loaded
    if (window.componentsLoaded && typeof initializeComponents === 'function') {
      initializeComponents();
    }
    
  } catch (error) {
    console.error('❌ Error loading components:', error);
    window.componentsLoading = false;
  }
}

// Load individual component
async function loadComponent(elementId, url) {
  try {
    console.log(`📥 Loading ${url}...`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} loading ${url}`);
    }
    
    const html = await response.text();
    const container = document.getElementById(elementId);
    
    if (!container) {
      throw new Error(`Container #${elementId} not found`);
    }
    
    // Insert the HTML
    container.innerHTML = html;
    console.log(`✅ ${url} loaded into #${elementId}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to load ${url}:`, error);
    
    // Show error message
    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #D74D4D; background: rgba(215, 77, 77, 0.1); border-radius: 8px; margin: 10px;">
          <i class="fas fa-exclamation-triangle"></i> Failed to load ${url}
          <br><small>${error.message}</small>
        </div>
      `;
    }
    
    throw error;
  }
}

// Initialize components after everything is loaded
function initializeComponents() {
  console.log('⚙️ Initializing components...');
  
  // Check if common.js functions are available
  if (typeof setupMobileNavigation === 'function') {
    console.log('🔧 Setting up mobile navigation...');
    setupMobileNavigation();
  } else {
    console.warn('⚠️ setupMobileNavigation not found');
  }
  
  if (typeof setupDropdowns === 'function') {
    console.log('🔧 Setting up dropdowns...');
    setupDropdowns();
  } else {
    console.warn('⚠️ setupDropdowns not found');
  }
  
  if (typeof setActiveNavItem === 'function') {
    console.log('🔧 Setting active nav item...');
    setActiveNavItem();
  } else {
    console.warn('⚠️ setActiveNavItem not found');
  }
  
  if (typeof setupBackToTop === 'function') {
    console.log('🔧 Setting up back to top...');
    setupBackToTop();
  } else {
    console.warn('⚠️ setupBackToTop not found');
  }
  
  console.log('✅ Components initialized');
}

// Handle page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM Content Loaded');
  
  // Start loading components
  setTimeout(() => {
    loadAllComponents();
  }, 100);
});

// Handle window load (when all resources are loaded)
window.addEventListener('load', function() {
  console.log('🌐 Window fully loaded');
  
  // If components haven't loaded yet, try to initialize
  if (window.componentsLoaded && typeof initializeComponents === 'function') {
    setTimeout(initializeComponents, 100);
  }
});

// Export for debugging
window.debugComponents = function() {
  console.log('=== COMPONENTS DEBUG INFO ===');
  console.log('Components loaded:', window.componentsLoaded);
  console.log('Components loading:', window.componentsLoading);
  console.log('setupDropdowns exists:', typeof setupDropdowns === 'function');
  console.log('setupMobileNavigation exists:', typeof setupMobileNavigation === 'function');
  console.log('Dropdown buttons:', document.querySelectorAll('.dropbtn').length);
  console.log('Dropdown contents:', document.querySelectorAll('.dropdown-content').length);
  
  // Manually trigger initialization if needed
  if (!window.componentsLoaded && typeof initializeComponents === 'function') {
    console.log('⚠️ Manually triggering initialization...');
    initializeComponents();
  }
};

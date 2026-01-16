// Load header and footer on all pages
document.addEventListener('DOMContentLoaded', function() {
  // Load header
  if (document.getElementById('header-container')) {
    loadComponent('header-container', 'header.html');
  }
  
  // Load footer
  if (document.getElementById('footer-container')) {
    loadComponent('footer-container', 'footer.html');
  }
});

// Component loader function
async function loadComponent(elementId, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
    
    // Initialize common functionality after components are loaded
    setTimeout(() => {
      // Check if initialization functions exist
      if (typeof setupMobileNav === 'function') {
        setupMobileNav();
      }
      if (typeof initUniversalDropdowns === 'function') {
        initUniversalDropdowns();
      }
      if (typeof initBackToTop === 'function') {
        initBackToTop();
      }
      if (typeof setActiveNavItem === 'function') {
        setActiveNavItem();
      }
      console.log('Components loaded and initialized');
    }, 150);
    
  } catch (error) {
    console.error('Error loading component:', error);
    document.getElementById(elementId).innerHTML = `
      <div class="error-message" style="padding: 20px; text-align: center; color: var(--color-error);">
        Failed to load component. Please check your connection.
      </div>
    `;
  }
}

// js/includes.js - Load header and footer

async function loadComponent(elementId, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
    
    // Short delay to ensure DOM is updated
    setTimeout(() => {
      console.log(`✅ ${url} loaded`);
      
      // IMPORTANT: Re-initialize dropdowns after components load
      if (typeof setupDropdowns === 'function') {
        setupDropdowns();
      }
      if (typeof setActiveNavItem === 'function') {
        setActiveNavItem();
      }
    }, 50);
    
  } catch (error) {
    console.error('Error loading component:', error);
    document.getElementById(elementId).innerHTML = `
      <div style="padding: 20px; text-align: center; color: #D74D4D;">
        <i class="fas fa-exclamation-triangle"></i> Component failed to load
      </div>
    `;
  }
}

// Load components when DOM is ready
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

// js/includes.js - Load header and footer dynamically

async function loadComponents() {
  try {
    // Load header
    const headerResponse = await fetch('header.html');
    if (!headerResponse.ok) throw new Error('Header not found');
    const headerHtml = await headerResponse.text();
    
    // Insert header at the beginning of body
    const headerContainer = document.createElement('div');
    headerContainer.id = 'header-container';
    headerContainer.innerHTML = headerHtml;
    document.body.insertBefore(headerContainer, document.body.firstChild);
    
    // Load footer
    const footerResponse = await fetch('footer.html');
    if (!footerResponse.ok) throw new Error('Footer not found');
    const footerHtml = await footerResponse.text();
    
    // Insert footer before closing body
    const footerContainer = document.createElement('div');
    footerContainer.id = 'footer-container';
    footerContainer.innerHTML = footerHtml;
    document.body.appendChild(footerContainer);
    
    console.log('Header and footer loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading components:', error);
    
    // Fallback: Create minimal header/footer
    const headerFallback = document.createElement('header');
    headerFallback.innerHTML = `
      <div class="header-container">
        <a href="index.html" class="brand-link">
          <div class="brand-content">
            <img src="https://i.imgur.com/gEuSg1Y.webp" alt="RebelInuX Logo" width="40" height="40">
            <div class="brand-text">
              <div class="brand-title">RebelInuX</div>
            </div>
          </div>
        </a>
        <button class="mobile-nav-toggle" id="mobileNavToggle">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    `;
    document.body.insertBefore(headerFallback, document.body.firstChild);
    
    return false;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  loadComponents().then(() => {
    // Initialize common functionality after components are loaded
    if (typeof initializeCommon === 'function') {
      initializeCommon();
    }
  });
});

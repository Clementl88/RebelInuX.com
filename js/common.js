// Common JavaScript for all pages

document.addEventListener('DOMContentLoaded', function() {
  // Loader animation
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('loader--hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }, 500);
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('back-to-top--visible');
      } else {
        backToTop.classList.remove('back-to-top--visible');
      }
    });

    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile navigation toggle
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navDesktop = document.getElementById('nav-desktop');
  
  if (mobileNavToggle && navDesktop) {
    mobileNavToggle.addEventListener('click', function() {
      navDesktop.classList.toggle('active');
      const icon = this.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
      if (window.innerWidth <= 768 && 
          !event.target.closest('#nav-desktop') && 
          !event.target.closest('#mobileNavToggle') && 
          navDesktop.classList.contains('active')) {
        navDesktop.classList.remove('active');
        const icon = mobileNavToggle.querySelector('i');
        if (icon.classList.contains('fa-times')) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // Mobile dropdown functionality
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const dropbtn = dropdown.querySelector('.dropbtn');
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    
    if (dropbtn && dropdownContent) {
      dropbtn.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other open dropdowns
          document.querySelectorAll('.dropdown-content.active').forEach(active => {
            if (active !== dropdownContent) {
              active.classList.remove('active');
              active.previousElementSibling.classList.remove('active');
            }
          });
          
          // Toggle this dropdown
          dropdownContent.classList.toggle('active');
          this.classList.toggle('active');
        }
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
      const dropdowns = document.querySelectorAll('.dropdown-content.active');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target) && !dropdown.previousElementSibling.contains(event.target)) {
          dropdown.classList.remove('active');
          dropdown.previousElementSibling.classList.remove('active');
        }
      });
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile nav if open
        if (window.innerWidth <= 768 && navDesktop && navDesktop.classList.contains('active')) {
          navDesktop.classList.remove('active');
          const icon = mobileNavToggle.querySelector('i');
          if (icon && icon.classList.contains('fa-times')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
        
        const headerHeight = 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Set active nav link based on current page
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#nav-desktop a, .dropbtn');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }
  
  // Call after components are loaded
  setTimeout(setActiveNavLink, 100);
});

// Helper function to load components
async function loadComponent(elementId, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
    
    // Dispatch event when component is loaded
    document.dispatchEvent(new CustomEvent('componentLoaded', {
      detail: { elementId, url }
    }));
  } catch (error) {
    console.error('Error loading component:', error);
    document.getElementById(elementId).innerHTML = `
      <div class="error-message" style="padding: 20px; text-align: center; color: var(--color-error);">
        Failed to load component. Please check your connection.
      </div>
    `;
  }
}

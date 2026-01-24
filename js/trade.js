    // Initialize after common components are loaded
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initTradePage, 300);
    });
    
    function initTradePage() {
      console.log('Initializing Trade page');
      
      // Initialize any trade-specific functionality here
      initTradeComponents();
      
      // Initialize mobile dropdown
      initializeMobileDropdown();
    }
    
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
          
          // Toggle this dropdown
          if (!isActive) {
            dropdownContent.style.display = 'block';
            dropdownContent.classList.add('active');
            this.classList.add('active');
          } else {
            dropdownContent.style.display = 'none';
            dropdownContent.classList.remove('active');
            this.classList.remove('active');
          }
        }
      });
    }
    
    function initTradeComponents() {
      // Trade page specific initialization
      console.log('Trade components initialized');
    }

// artwork.js - Enhanced Artwork Gallery functionality

// ===== DEBUG: Check what's blocking the menu =====
console.log('🚀 artwork.js loaded');
console.log('Window width:', window.innerWidth);
console.log('Header container exists:', document.getElementById('header-container') !== null);

// Check if any CSS is hiding the menu
setTimeout(function() {
    console.log('=== DEBUG: Mobile Menu Check ===');
    
    // Check header
    const header = document.querySelector('header, .site-header, .main-header, nav');
    if (header) {
        const styles = window.getComputedStyle(header);
        console.log('Header styles:', {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            position: styles.position,
            zIndex: styles.zIndex,
            overflow: styles.overflow,
            overflowX: styles.overflowX,
            overflowY: styles.overflowY,
            maxHeight: styles.maxHeight,
            height: styles.height
        });
    } else {
        console.log('❌ Header not found!');
    }
    
    // Check hamburger button
    const hamburger = document.querySelector('.hamburger, .mobile-menu-toggle, [class*="hamburger"], [class*="menu-toggle"], #mobileNavToggle');
    if (hamburger) {
        const hamburgerStyles = window.getComputedStyle(hamburger);
        console.log('Hamburger styles:', {
            display: hamburgerStyles.display,
            visibility: hamburgerStyles.visibility,
            opacity: hamburgerStyles.opacity,
            pointerEvents: hamburgerStyles.pointerEvents,
            zIndex: hamburgerStyles.zIndex,
            position: hamburgerStyles.position,
            width: hamburgerStyles.width,
            height: hamburgerStyles.height
        });
        
        // Check if clickable
        const rect = hamburger.getBoundingClientRect();
        console.log('Hamburger clickable area:', {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            isVisible: rect.width > 0 && rect.height > 0 && rect.top > 0
        });
    } else {
        console.log('❌ Hamburger button not found!');
    }
    
    // Check mobile menu
    const mobileMenu = document.querySelector('.mobile-menu, #nav-desktop, [class*="mobile-menu"]');
    if (mobileMenu) {
        const menuStyles = window.getComputedStyle(mobileMenu);
        console.log('Mobile menu styles:', {
            display: menuStyles.display,
            visibility: menuStyles.visibility,
            opacity: menuStyles.opacity,
            maxHeight: menuStyles.maxHeight,
            overflow: menuStyles.overflow,
            transform: menuStyles.transform
        });
    }
    
    // Check for any elements that might be covering the hamburger
    const elementsAtPoint = document.elementsFromPoint(50, 50);
    console.log('Elements at click position (50,50):', elementsAtPoint.map(el => ({
        tag: el.tagName,
        id: el.id,
        class: el.className,
        zIndex: window.getComputedStyle(el).zIndex
    })));
    
    console.log('=== END DEBUG ===');
}, 1000);

// artwork.js - Enhanced Artwork Gallery functionality

// ===== INITIALIZATION - Wait for components to be ready =====
function waitForComponents(callback, maxAttempts = 20) {
  let attempts = 0;
  
  const checkInterval = setInterval(function() {
    attempts++;
    
    // Check if components are loaded AND common.js functions are available
    if (window.componentsLoaded && typeof window.setupMobileNavigation === 'function') {
      clearInterval(checkInterval);
      console.log('✅ Components ready, initializing artwork page');
      callback();
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      console.warn('⚠️ Components not ready after timeout, forcing initialization');
      // Force initialization anyway
      if (typeof window.initializeComponents === 'function') {
        window.initializeComponents();
      }
      callback();
    } else {
      console.log(`⏳ Waiting for components... (${attempts}/${maxAttempts})`);
    }
  }, 100);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Artwork page DOM ready');
  waitForComponents(function() {
    setTimeout(initArtworkPage, 200);
  });
});

// ===== MAIN INITIALIZATION =====
function initArtworkPage() {
  console.log('🚀 Initializing Enhanced Artwork Gallery page');
  

  // Initialize artwork data
  initArtworkData();
  
  // Initialize AOS animations with delay
  initAOSWithDelay();
  
  // Initialize gallery interactions
  initGalleryInteractions();
  
  // Initialize NFT interactions
  initNFTInteractions();
  
  // Initialize artwork modal
  initArtworkModal();
  
  // Initialize slider animation
  initArtworkSlider();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Start periodic updates
  setInterval(updateArtworkStats, 60000);
}

// ========== AOS ANIMATIONS ==========
function initAOSWithDelay() {
  // Check if AOS is available
  if (typeof AOS !== 'undefined') {
    // Delay to ensure menu is fully initialized
    setTimeout(function() {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        disable: window.innerWidth < 768 ? 'mobile' : false
      });
      
      // Refresh AOS on window resize
      window.addEventListener('resize', function() {
        AOS.refresh();
      });
      
      console.log('✅ AOS initialized with delay');
    }, 200);
  } else {
    // If AOS not loaded yet, wait for it
    console.log('⏳ Waiting for AOS to load...');
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkAOS = setInterval(function() {
      attempts++;
      if (typeof AOS !== 'undefined') {
        clearInterval(checkAOS);
        setTimeout(function() {
          AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 ? 'mobile' : false
          });
          
          window.addEventListener('resize', function() {
            AOS.refresh();
          });
          
          console.log('✅ AOS initialized after loading');
        }, 200);
      } else if (attempts >= maxAttempts) {
        clearInterval(checkAOS);
        console.warn('⚠️ AOS failed to load');
      }
    }, 100);
  }
}

// ========== REMOVED - Using common.js instead ==========
// function initializeMobileDropdown() { ... } - DELETED - Using common.js
// function initMobileMenu() { ... } - DELETED - Using common.js

// ========== ARTWORK DATA FUNCTIONS ==========
function initArtworkData() {
  console.log('📊 Initializing artwork data');
  
  // Fetch and update artwork stats
  updateArtworkStats();
  
  // Initialize filter functionality
  initFiltering();
  
  // Initialize artwork likes
  initArtworkLikes();
  
  // Initialize NFT data
  initNFTData();
  
  // Track page visit
  trackPageVisit();
}

async function updateArtworkStats() {
  try {
    // Update stat counters with corrected values
    animateCounter('totalArtworks', 78);
    animateCounter('contestWinners', 18);
    animateCounter('totalArtists', 32);
    document.getElementById('nftCollections').textContent = '15+';
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating artwork stats:', error);
  }
}

function initArtworkLikes() {
  // Initialize like counts from localStorage
  document.querySelectorAll('.like-btn').forEach(btn => {
    const artworkId = btn.closest('.artwork-card, .contest-card, .nft-card').getAttribute('data-id');
    const savedLikes = localStorage.getItem(`artwork_likes_${artworkId}`);
    if (savedLikes) {
      const likeCount = btn.querySelector('.like-count');
      if (likeCount) {
        likeCount.textContent = savedLikes;
      }
      
      // Check if liked
      const isLiked = localStorage.getItem(`artwork_liked_${artworkId}`) === 'true';
      if (isLiked) {
        btn.classList.add('liked');
        btn.querySelector('i').className = 'fas fa-heart';
      }
    }
  });
}

function initNFTData() {
  // Initialize like counts from localStorage for NFTs
  document.querySelectorAll('.nft-card').forEach(card => {
    const nftId = card.dataset.category;
    const savedLikes = localStorage.getItem(`nft_likes_${nftId}`);
    if (savedLikes) {
      const likeCount = card.querySelector('.like-count');
      if (likeCount) {
        likeCount.textContent = savedLikes;
      }
      
      // Check if liked
      const isLiked = localStorage.getItem(`nft_liked_${nftId}`) === 'true';
      if (isLiked) {
        const likeBtn = card.querySelector('.like-btn');
        if (likeBtn) {
          likeBtn.classList.add('liked');
          likeBtn.querySelector('i').className = 'fas fa-heart';
        }
      }
    }
  });
}

function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const current = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
  if (current === target) return;
  
  const duration = 1000;
  const increment = (target - current) / (duration / 16);
  
  let currentValue = current;
  const timer = setInterval(() => {
    currentValue += increment;
    if ((increment > 0 && currentValue >= target) || (increment < 0 && currentValue <= target)) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(currentValue) + '+';
    }
  }, 16);
}

function updateLastUpdated() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const timestampElement = document.querySelector('.update-time');
  if (timestampElement) {
    timestampElement.textContent = `Last Updated: ${timeString}`;
  }
}

function trackPageVisit() {
  const visitCount = parseInt(localStorage.getItem('artwork_visits') || '0');
  localStorage.setItem('artwork_visits', (visitCount + 1).toString());
  
  if (visitCount === 0) {
    setTimeout(() => {
      showToast('🎨 Welcome to the RebelInuX Art Gallery! Explore NFTs exclusively on ZORA.', 'info', 5000);
    }, 2000);
  }
}

// ========== GALLERY INTERACTIONS ==========
function initGalleryInteractions() {
  // Category navigation
  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update active state
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Scroll to section
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Filter functionality
  initFiltering();
}

function initFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const artworkCards = document.querySelectorAll('.artwork-card');
  
  // Artwork filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter artworks
      const filter = this.dataset.filter;
      
      artworkCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ========== ARTWORK MODAL ==========
function initArtworkModal() {
  const modal = document.getElementById('artworkModal');
  const modalClose = document.getElementById('modalClose');
  const viewButtons = document.querySelectorAll('.view-artwork');
  
  if (!modal || !modalClose) return;
  
  // View artwork buttons
  viewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const image = this.getAttribute('data-image');
      const title = this.getAttribute('data-title');
      const artist = this.getAttribute('data-artist');
      const description = this.getAttribute('data-description');
      const link = this.getAttribute('data-link');
      
      // Set modal content
      document.getElementById('modalImage').src = image;
      document.getElementById('modalImage').alt = title;
      document.getElementById('modalTitle').textContent = title;
      
      const artistInitial = artist.charAt(0);
      document.getElementById('modalArtist').innerHTML = `
        <div class="artist-info">
          <div class="artist-avatar">${artistInitial}</div>
          <span>by <a href="https://x.com/${artist.replace('@', '').split(' ')[0]}" class="artist-link">${artist}</a></span>
        </div>
      `;
      
      document.getElementById('modalDescription').textContent = description;
      document.getElementById('modalLink').href = link;
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Track modal view
      trackArtworkView(title);
    });
  });
  
  // Close modal
  modalClose.addEventListener('click', function() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
  
  // Close modal with escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

function trackArtworkView(title) {
  const views = parseInt(localStorage.getItem(`artwork_views_${title}`) || '0');
  localStorage.setItem(`artwork_views_${title}`, (views + 1).toString());
  
  // Send analytics event
  console.log(`Artwork viewed: ${title}`);
}

// ========== ARTWORK SLIDER ==========
function initArtworkSlider() {
  const sliderContainer = document.querySelector('.slider-container');
  if (!sliderContainer) return;
  
  // Pause animation on hover
  const slider = document.querySelector('.artwork-slider');
  if (slider) {
    slider.addEventListener('mouseenter', function() {
      sliderContainer.style.animationPlayState = 'paused';
    });
    
    slider.addEventListener('mouseleave', function() {
      sliderContainer.style.animationPlayState = 'running';
    });
  }
  
  // Reset animation periodically to create infinite loop effect
  setInterval(() => {
    sliderContainer.style.animation = 'none';
    setTimeout(() => {
      sliderContainer.style.animation = 'slide 30s linear infinite';
    }, 10);
  }, 30000);
}

// ========== NFT INTERACTIONS ==========
function initNFTInteractions() {
  // View button functionality for NFTs
  document.querySelectorAll('.nft-card .view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const nftCard = this.closest('.nft-card');
      const nftId = Array.from(nftCard.parentElement.children).indexOf(nftCard) + 1;
      viewNftDetails(nftId);
    });
  });
}

function viewNftDetails(nftId) {
  const nftData = {
    1: {
      name: "Rebel King #001",
      rarity: "Legendary",
      description: "The first and most powerful RebelInuX character in the collection.",
      attributes: ["1 of 10", "98% burned", "Royalty: 5%", "Blockchain: Base"],
      platform: "ZORA",
      link: "https://zora.co/@rebelinux"
    }
  };
  
  const nft = nftData[nftId] || nftData[1];
  
  // Show NFT details (in production, this would be a modal)
  const details = `
    NFT Details:
    
    Name: ${nft.name}
    Rarity: ${nft.rarity}
    Platform: ${nft.platform}
    
    Description:
    ${nft.description}
    
    Attributes:
    ${nft.attributes.join('\n')}
    
    View on ZORA: ${nft.link}
  `;
  
  showToast(`Viewing details for: ${nft.name}`, 'info');
  
  setTimeout(() => {
    // This would open a modal in production
    console.log('NFT details:', details);
    
    if (window.innerWidth > 768) {
      alert(details + '\n\n(In production, this would open a detailed modal)');
    }
  }, 100);
}

// ========== SUBMISSION FUNCTIONALITY ==========
function openSubmissionForm() {
  showToast('Opening community art submission form...', 'info');
  
  setTimeout(() => {
    const submissionInfo = `
      Community Art Submission:
      
      To submit your RebelInuX artwork:
      
      1. Join our Telegram community
      2. Post your artwork in the community chat
      3. Use hashtag #RebelArt
      4. Include your wallet address for potential rewards
      5. Selected artwork will be featured here!
      
      Requirements:
      - Must be original RebelInuX-themed art
      - No offensive or inappropriate content
      - Include your community username
      - By submitting, you grant display rights to RebelInuX
      
      Rewards for selected artwork:
      - 100,000 $REBL tokens
      - Featured in community gallery
      - Special role in community
      - May be minted as official NFT on ZORA
    `;
    
    if (confirm('Submit your RebelInuX artwork?\n\n' + submissionInfo)) {
      window.open('https://t.me/RebelInuX_Official', '_blank');
      showToast('Opening Telegram community...', 'info');
    }
  }, 500);
}

function downloadAsset(assetType) {
  showToast(`Downloading ${assetType}...`, 'info');
  
  setTimeout(() => {
    showToast('Asset downloaded successfully!', 'success');
    
    // Track downloads
    const downloads = parseInt(localStorage.getItem('asset_downloads') || '0');
    localStorage.setItem('asset_downloads', (downloads + 1).toString());
  }, 1000);
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.artwork-card, .contest-card, .nft-card, .utility-card, .faq-item, .related-card, .info-card, .brand-card, .guideline, .benefit-card'
  );
  
  // Use Intersection Observer for better performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    window.addEventListener('scroll', animateElements);
    animateElements(); // Initial check
  }
}

function animateElements() {
  const animatedElements = document.querySelectorAll(
    '.artwork-card, .contest-card, .nft-card, .utility-card, .faq-item, .related-card, .info-card, .brand-card, .guideline, .benefit-card'
  );
  
  animatedElements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
    
    if (isVisible) {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 50);
    }
  });
}

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Style toast
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    max-width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  
  document.body.appendChild(toast);
  
  // Add animation styles if not already present
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to {
          transform: translateX(-50%) translateY(100px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove toast after duration
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}

// ========== LOGO DOWNLOAD FUNCTIONS ==========
function downloadLogo(logoType) {
  let logoName, filePath;
  
  if (logoType === 'Logo_REBL') {
    logoName = 'RebelInuX_REBL_Logo.png';
    filePath = 'images/Logo_REBL.svg'; // We'll convert this to PNG
  } else if (logoType === 'rebelinux_logo') {
    logoName = 'RebelInuX_Logo.png';
    filePath = 'images/rebelinux_logo/$rebelinux SVG (4).svg';
  } else {
    showToast('Logo not found', 'error');
    return;
  }
  
  showToast(`Converting ${logoName} to PNG...`, 'info');
  
  // In a real implementation, you would:
  // 1. Have actual PNG files ready for download
  // 2. Or convert SVG to PNG on the server
  
  // For now, simulate the download process
  setTimeout(() => {
    // Create a temporary download link for the PNG version
    // Note: This requires actual PNG files to exist
    const tempLink = document.createElement('a');
    tempLink.href = filePath.replace('.svg', '.png'); // Assumes PNG version exists
    tempLink.download = logoName;
    tempLink.style.display = 'none';
    
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    
    showToast(`${logoName} downloaded!`, 'success');
    
    // Track downloads in analytics
    trackLogoDownload(logoType);
    
  }, 1000);
}

function downloadAsset(assetPath) {
  // Extract filename from path
  const fileName = assetPath.split('/').pop();
  const fileType = fileName.split('.').pop().toUpperCase();
  
  showToast(`Downloading ${fileName}...`, 'info');
  
  // Create a temporary download link
  const tempLink = document.createElement('a');
  tempLink.href = assetPath;
  tempLink.download = fileName;
  tempLink.style.display = 'none';
  
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  
  // Show success message
  setTimeout(() => {
    showToast(`${fileName} downloaded successfully!`, 'success');
    
    // Track downloads in analytics
    trackAssetDownload(fileName);
  }, 100);
}

function trackLogoDownload(logoType) {
  const downloads = parseInt(localStorage.getItem(`logo_downloads_${logoType}`) || '0');
  localStorage.setItem(`logo_downloads_${logoType}`, (downloads + 1).toString());
  
  console.log(`Logo downloaded: ${logoType}, Total: ${downloads + 1}`);
}

function trackAssetDownload(fileName) {
  const downloads = parseInt(localStorage.getItem(`asset_downloads`)) || 0;
  localStorage.setItem('asset_downloads', (downloads + 1).toString());
  
  console.log(`Asset downloaded: ${fileName}, Total downloads: ${downloads + 1}`);
  
  // Show designer credit toast on first download
  const hasSeenCredit = localStorage.getItem('seen_designer_credit');
  if (!hasSeenCredit && (fileName.includes('Logo') || fileName.includes('logo'))) {
    setTimeout(() => {
      showToast('🎨 Logo designed by Masum B - Professional Graphic Designer', 'info', 5000);
      localStorage.setItem('seen_designer_credit', 'true');
    }, 1500);
  }
}

// ========== GLOBAL EXPORTS ==========
window.viewNftDetails = viewNftDetails;
window.openSubmissionForm = openSubmissionForm;
window.downloadAsset = downloadAsset;
window.downloadLogo = downloadLogo;
window.trackAssetDownload = trackAssetDownload;
window.showToast = showToast;
window.initArtworkPage = initArtworkPage;

// Add touch-active class styles
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .touch-active {
      opacity: 0.7 !important;
      transform: scale(0.98) !important;
      transition: all 0.1s ease !important;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .artwork-card, .contest-card, .nft-card {
        cursor: pointer;
      }
      
      .artwork-overlay, .contest-overlay, .nft-overlay {
        opacity: 1;
        background: rgba(0, 0, 0, 0.5);
      }
      
      .overlay-text {
        font-size: 1rem;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add touch event listeners for mobile
  if ('ontouchstart' in window) {
    document.querySelectorAll('.artwork-card, .contest-card, .nft-card').forEach(card => {
      card.addEventListener('touchstart', function() {
        this.classList.add('touch-active');
      });
      
      card.addEventListener('touchend', function() {
        this.classList.remove('touch-active');
      });
    });
  }
});

// Load user preferences
window.addEventListener('load', function() {
  // Handle window resize for mobile dropdown - REMOVED conflicting code
  window.addEventListener('resize', function() {
    if (typeof window.setupMobileNavigation === 'function') {
      window.setupMobileNavigation();
    }
  });
});

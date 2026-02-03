// artwork.js - Enhanced Artwork Gallery functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initArtworkPage, 300);
});

function initArtworkPage() {
  console.log('Initializing Enhanced Artwork Gallery page');
  
  // Initialize mobile dropdown
  initializeMobileDropdown();
  
  // Initialize artwork data
  initArtworkData();
  
  // Initialize animations
  initScrollAnimations();
  
  // Initialize AOS animations
  initAOS();
  
  // Initialize gallery interactions
  initGalleryInteractions();
  
  // Initialize NFT interactions
  initNFTInteractions();
  
  // Initialize artwork modal
  initArtworkModal();
  
  // Initialize slider animation
  initArtworkSlider();
  
  // Start periodic updates
  setInterval(updateArtworkStats, 60000);
}

// ========== AOS ANIMATIONS ==========
function initAOS() {
  if (typeof AOS !== 'undefined') {
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
  }
}

// ========== MOBILE DROPDOWN FUNCTIONALITY ==========
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

// ========== ARTWORK DATA FUNCTIONS ==========
function initArtworkData() {
  console.log('Initializing artwork data');
  
  // Fetch and update artwork stats
  updateArtworkStats();
  
  // Initialize filter functionality
  initFiltering();
  
  // Initialize artwork likes
  initArtworkLikes();
  
  // Track page visit
  trackPageVisit();
}

async function updateArtworkStats() {
  try {
    // Update stat counters
    animateCounter('totalArtworks', 58);
    animateCounter('contestWinners', 12);
    animateCounter('totalArtists', 23);
    document.getElementById('nftCollections').textContent = '3';
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating artwork stats:', error);
  }
}

function initArtworkLikes() {
  // Initialize like counts from localStorage
  document.querySelectorAll('.like-btn').forEach(btn => {
    const artworkId = btn.closest('.artwork-card, .contest-card').getAttribute('data-id');
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
      showToast('🎨 Welcome to the RebelInuX Art Gallery! Explore NFTs and community art.', 'info', 5000);
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
          <span>by <a href="https://x.com/${artist.replace('@', '')}" class="artist-link">${artist}</a></span>
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
  
  // Send analytics event (in production)
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
  // Like button functionality
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleLike(this);
    });
  });
  
  // Buy button functionality
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const nftCard = this.closest('.nft-card');
      const nftName = nftCard.querySelector('h3').textContent;
      const nftPrice = nftCard.querySelector('.price-value').textContent;
      buyNFT(nftName, nftPrice);
    });
  });
  
  // View button functionality
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const nftCard = this.closest('.nft-card');
      const nftId = Array.from(nftCard.parentElement.children).indexOf(nftCard) + 1;
      viewNftDetails(nftId);
    });
  });
}

function toggleLike(button) {
  const itemCard = button.closest('.nft-card, .artwork-card, .contest-card');
  const itemId = itemCard.getAttribute('data-id') || itemCard.querySelector('h3').textContent;
  
  const likeCount = button.querySelector('.like-count');
  const likeIcon = button.querySelector('i');
  const isLiked = button.classList.contains('liked');
  
  if (isLiked) {
    // Unlike
    button.classList.remove('liked');
    likeIcon.className = 'far fa-heart';
    if (likeCount) {
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
    }
    
    localStorage.setItem(`artwork_liked_${itemId}`, 'false');
    showToast('Removed from favorites', 'info');
  } else {
    // Like
    button.classList.add('liked');
    likeIcon.className = 'fas fa-heart';
    if (likeCount) {
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    }
    
    localStorage.setItem(`artwork_liked_${itemId}`, 'true');
    showToast('Added to favorites! ❤️', 'success');
  }
  
  // Animate the like
  button.style.transform = 'scale(1.2)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 300);
  
  // Save like count
  if (likeCount) {
    localStorage.setItem(`artwork_likes_${itemId}`, likeCount.textContent);
  }
}

function buyNFT(nftName, nftPrice) {
  if (confirm(`Buy ${nftName} for ${nftPrice}?\n\nThis will connect your wallet and complete the purchase.`)) {
    showToast('Connecting wallet...', 'info');
    
    // Simulate wallet connection and purchase
    setTimeout(() => {
      showToast(`Successfully purchased ${nftName}!`, 'success');
      
      // Update UI
      setTimeout(() => {
        showToast('NFT transferred to your wallet. Check your collection!', 'info', 4000);
      }, 1000);
    }, 1500);
  }
}

function viewNftDetails(nftId) {
  const nftData = {
    1: {
      name: "Rebel King #001",
      rarity: "Legendary",
      description: "The first and most powerful RebelInuX character in the collection.",
      attributes: ["1 of 10", "98% burned", "Royalty: 5%", "Blockchain: Solana"],
      price: "10 SOL",
      owner: "Not available"
    },
    2: {
      name: "Cyber Rebel #045",
      rarity: "Epic",
      description: "Futuristic warrior with enhanced cybernetic upgrades.",
      attributes: ["45 of 90", "Electric", "Royalty: 5%", "Blockchain: Solana"],
      price: "2.5 SOL",
      owner: "Not available"
    }
  };
  
  const nft = nftData[nftId] || nftData[1];
  
  // In production, this would open a modal
  console.log('NFT details:', nft);
  showToast(`Viewing details for: ${nft.name}`, 'info');
}

// ========== SUBMISSION FUNCTIONALITY ==========
function submitArtwork(channel) {
  const channels = {
    telegram: 'https://t.me/RebelInuX_Official',
    twitter: 'https://x.com/RebelInuX',
    discord: 'https://discord.gg/s8dkuyD3cZ'
  };
  
  const messages = {
    telegram: 'Opening Telegram to submit your artwork...',
    twitter: 'Opening Twitter/X to submit your artwork...',
    discord: 'Opening Discord to submit your artwork...'
  };
  
  showToast(messages[channel], 'info');
  
  // Open the submission channel
  setTimeout(() => {
    window.open(channels[channel], '_blank');
    
    // Show submission tips
    const tips = `
      Submission Tips:
      
      1. Include your X/Twitter handle
      2. Add your wallet address for prizes
      3. Use hashtag #RebelArt
      4. Describe your artwork
      5. Mention if it's for a contest
    `;
    
    showToast('Remember to include your details for credit and prizes!', 'info', 5000);
  }, 500);
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.artwork-card, .contest-card, .collection-card, .nft-card, .faq-item, .related-card, .benefit-card'
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
    '.artwork-card, .contest-card, .collection-card, .nft-card, .faq-item, .related-card, .benefit-card'
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

// ========== GLOBAL EXPORTS ==========
window.toggleLike = toggleLike;
window.buyNft = buyNFT;
window.viewNftDetails = viewNftDetails;
window.submitArtwork = submitArtwork;
window.showToast = showToast;

// Add mobile touch optimizations
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
      
      .artwork-overlay, .contest-overlay {
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
  // Load liked artwork
  const likedArtwork = [];
  document.querySelectorAll('.artwork-card, .contest-card, .nft-card').forEach(card => {
    const itemId = card.getAttribute('data-id') || card.querySelector('h3').textContent;
    if (localStorage.getItem(`artwork_liked_${itemId}`) === 'true') {
      likedArtwork.push(itemId);
    }
  });
  
  if (likedArtwork.length > 0) {
    console.log('Liked artwork:', likedArtwork);
  }
});

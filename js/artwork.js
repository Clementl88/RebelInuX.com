// artwork.js - Artwork Gallery page functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initArtworkPage, 300);
});

function initArtworkPage() {
  console.log('Initializing Artwork Gallery page');
  
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
  
  // Initialize lightbox
  initLightbox();
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
  
  // Initialize NFT data
  initNFTData();
  
  // Initialize filter functionality
  initFiltering();
  
  // Start periodic updates
  setInterval(updateArtworkStats, 60000); // Update every minute
}

async function updateArtworkStats() {
  try {
    // In a real implementation, you would fetch these from APIs
    const stats = {
      totalNfts: 1000,
      nftOwners: 423,
      communityArt: 78,
      volumeTraded: 250
    };
    
    // Update stat counters with animation
    animateCounter('totalNfts', stats.totalNfts);
    animateCounter('nftOwners', stats.nftOwners);
    animateCounter('communityArt', stats.communityArt);
    document.getElementById('volumeTraded').textContent = stats.volumeTraded;
    
    // Update last updated time
    updateLastUpdated();
    
  } catch (error) {
    console.error('Error updating artwork stats:', error);
  }
}

function initNFTData() {
  // Initialize like counts from localStorage
  document.querySelectorAll('.like-btn').forEach(btn => {
    const nftId = btn.closest('.nft-card').dataset.category;
    const savedLikes = localStorage.getItem(`nft_likes_${nftId}`);
    if (savedLikes) {
      const likeCount = btn.querySelector('.like-count');
      if (likeCount) {
        likeCount.textContent = savedLikes;
      }
      
      // Check if liked
      const isLiked = localStorage.getItem(`nft_liked_${nftId}`) === 'true';
      if (isLiked) {
        btn.classList.add('liked');
        btn.querySelector('i').className = 'fas fa-heart';
      }
    }
  });
  
  // Initialize community art likes
  document.querySelectorAll('.community-art .stat').forEach(stat => {
    const artId = stat.closest('.community-art').querySelector('h3').textContent;
    const savedLikes = localStorage.getItem(`art_likes_${artId}`);
    if (savedLikes && stat.querySelector('.fa-heart')) {
      stat.textContent = stat.textContent.replace(/\d+/, savedLikes);
    }
  });
}

function animateCounter(elementId, target) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const current = parseInt(element.textContent.replace(/,/g, '')) || 0;
  if (current === target) return;
  
  const duration = 1000; // 1 second
  const increment = (target - current) / (duration / 16);
  
  let currentValue = current;
  const timer = setInterval(() => {
    currentValue += increment;
    if ((increment > 0 && currentValue >= target) || (increment < 0 && currentValue <= target)) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(currentValue).toLocaleString();
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
  
  // Sort functionality
  const sortSelect = document.getElementById('sortNfts');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortNFTs(this.value);
    });
  }
}

function initFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const nftCards = document.querySelectorAll('.nft-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter NFTs
      const filter = this.dataset.filter;
      
      nftCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
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

function sortNFTs(sortBy) {
  const nftContainer = document.querySelector('.nft-grid');
  const nftCards = Array.from(document.querySelectorAll('.nft-card'));
  
  nftCards.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return 0; // In real implementation, sort by mint date
      case 'oldest':
        return 0; // In real implementation, sort by mint date
      case 'rarity':
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
        return rarityOrder[a.dataset.category] - rarityOrder[b.dataset.category];
      case 'price':
        const priceA = parseFloat(a.querySelector('.price-value').textContent);
        const priceB = parseFloat(b.querySelector('.price-value').textContent);
        return priceA - priceB;
      default:
        return 0;
    }
  });
  
  // Reorder cards
  nftCards.forEach(card => {
    nftContainer.appendChild(card);
  });
  
  showToast(`NFTs sorted by: ${sortBy.replace('_', ' ')}`, 'info');
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
  
  // Community art view buttons
  document.querySelectorAll('.community-art .view-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const artCard = this.closest('.community-art');
      const artId = Array.from(artCard.parentElement.children).indexOf(artCard) + 1;
      viewArtDetails(artId);
    });
  });
}

function toggleLike(button) {
  const nftCard = button.closest('.nft-card, .community-art');
  const isNFT = nftCard.classList.contains('nft-card');
  const itemId = isNFT ? nftCard.dataset.category : nftCard.querySelector('h3').textContent;
  
  const likeCount = button.querySelector('.like-count');
  const likeIcon = button.querySelector('i');
  const isLiked = button.classList.contains('liked');
  
  if (isLiked) {
    // Unlike
    button.classList.remove('liked');
    likeIcon.className = 'far fa-heart';
    likeCount.textContent = parseInt(likeCount.textContent) - 1;
    
    // Save to localStorage
    if (isNFT) {
      localStorage.setItem(`nft_likes_${itemId}`, likeCount.textContent);
      localStorage.setItem(`nft_liked_${itemId}`, 'false');
    }
    
    showToast('Removed from favorites', 'info');
  } else {
    // Like
    button.classList.add('liked');
    likeIcon.className = 'fas fa-heart';
    likeCount.textContent = parseInt(likeCount.textContent) + 1;
    
    // Save to localStorage
    if (isNFT) {
      localStorage.setItem(`nft_likes_${itemId}`, likeCount.textContent);
      localStorage.setItem(`nft_liked_${itemId}`, 'true');
    }
    
    showToast('Added to favorites!', 'success');
  }
  
  // Animate the like
  button.style.transform = 'scale(1.2)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 300);
}

function buyNFT(nftName, nftPrice) {
  if (confirm(`Buy ${nftName} for ${nftPrice}?\n\nThis will connect your wallet and complete the purchase.`)) {
    showToast('Connecting wallet...', 'info');
    
    // Simulate wallet connection and purchase
    setTimeout(() => {
      // In a real implementation, you would:
      // 1. Connect wallet
      // 2. Show purchase confirmation
      // 3. Execute transaction
      
      showToast(`Successfully purchased ${nftName}!`, 'success');
      
      // Update UI
      setTimeout(() => {
        showToast('NFT transferred to your wallet. Check your collection!', 'info', 4000);
      }, 1000);
    }, 1500);
  }
}

function viewNftDetails(nftId) {
  // In a real implementation, you would show a modal with detailed NFT information
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
    },
    3: {
      name: "Desert Warrior #128",
      rarity: "Rare",
      description: "Survivor of the digital desert with tactical gear.",
      attributes: ["128 of 300", "Desert", "Royalty: 5%", "Blockchain: Solana"],
      price: "1.2 SOL",
      owner: "Not available"
    },
    4: {
      name: "Street Rebel #512",
      rarity: "Common",
      description: "Urban fighter with basic gear and raw determination.",
      attributes: ["512 of 600", "Urban", "Royalty: 5%", "Blockchain: Solana"],
      price: "0.5 SOL",
      owner: "Not available"
    }
  };
  
  const nft = nftData[nftId] || nftData[1];
  
  // Show NFT details (in production, this would be a modal)
  const details = `
    NFT Details:
    
    Name: ${nft.name}
    Rarity: ${nft.rarity}
    Price: ${nft.price}
    
    Description:
    ${nft.description}
    
    Attributes:
    ${nft.attributes.join('\n')}
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

function viewArtDetails(artId) {
  // In a real implementation, you would show a modal with detailed art information
  const artData = {
    1: {
      title: "Digital Warrior",
      artist: "RebelJames",
      date: "Feb 15, 2024",
      description: "Fan art inspired by the RebelInuX lore.",
      medium: "Digital Painting",
      likes: 24,
      comments: 8
    },
    2: {
      title: "Rebel Landscape",
      artist: "CryptoInu",
      date: "Feb 12, 2024",
      description: "Digital painting of the RebelInuX universe.",
      medium: "Digital Painting",
      likes: 18,
      comments: 5
    },
    3: {
      title: "3D Render",
      artist: "ArtNinja",
      date: "Feb 10, 2024",
      description: "3D modeled RebelInuX character concept.",
      medium: "3D Modeling",
      likes: 32,
      comments: 12
    },
    4: {
      title: "Pixel Art",
      artist: "DigitalRebel",
      date: "Feb 8, 2024",
      description: "Retro pixel art style RebelInuX character.",
      medium: "Pixel Art",
      likes: 15,
      comments: 3
    }
  };
  
  const art = artData[artId] || artData[1];
  
  // Show art details (in production, this would be a modal)
  const details = `
    Artwork Details:
    
    Title: ${art.title}
    Artist: ${art.artist}
    Date: ${art.date}
    Medium: ${art.medium}
    
    Description:
    ${art.description}
    
    Stats:
    ❤️ ${art.likes} Likes | 💬 ${art.comments} Comments
  `;
  
  showToast(`Viewing details for: ${art.title}`, 'info');
  
  setTimeout(() => {
    // This would open a modal in production
    console.log('Art details:', details);
    
    if (window.innerWidth > 768) {
      alert(details + '\n\n(In production, this would open a detailed modal)');
    }
  }, 100);
}

// ========== LIGHTBOX ==========
function initLightbox() {
  // Lightbox is already initialized in the HTML head
  // We just need to handle custom lightbox behavior
  
  // Set up lightbox for all images
  document.querySelectorAll('a[data-lightbox]').forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        // On mobile, use full screen view
        e.preventDefault();
        const imgSrc = this.getAttribute('href');
        viewFullscreenImage(imgSrc, this.getAttribute('data-title') || 'Image');
      }
    });
  });
}

function viewFullscreenImage(src, title) {
  // Create fullscreen viewer
  const viewer = document.createElement('div');
  viewer.className = 'fullscreen-viewer';
  viewer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;
  
  viewer.innerHTML = `
    <div style="position: absolute; top: 20px; right: 20px;">
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <img src="${src}" alt="${title}" style="max-width: 100%; max-height: 80%; object-fit: contain; border-radius: 8px;">
    <div style="color: white; margin-top: 20px; font-size: 1.2rem; font-weight: 600;">${title}</div>
  `;
  
  document.body.appendChild(viewer);
  
  // Close on escape key
  viewer.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      viewer.remove();
    }
  });
  
  // Close on click outside image
  viewer.addEventListener('click', function(e) {
    if (e.target === this) {
      this.remove();
    }
  });
  
  // Focus for keyboard navigation
  viewer.focus();
}

// ========== MINTING FUNCTIONALITY ==========
function startMinting() {
  showToast('Opening NFT minting interface...', 'info');
  
  // In a real implementation, you would:
  // 1. Connect wallet
  // 2. Open minting modal
  // 3. Handle file upload and metadata
  
  setTimeout(() => {
    // Show minting instructions
    const instructions = `
      NFT Minting Instructions:
      
      1. Connect your Solana wallet
      2. Upload your artwork (JPG, PNG, GIF, or MP4)
      3. Add title, description, and attributes
      4. Set your royalty percentage (recommended: 5%)
      5. Pay the minting fee (0.5 SOL + gas)
      6. Confirm transaction in your wallet
      
      Your NFT will be minted and listed automatically!
    `;
    
    if (confirm('Ready to mint NFTs?\n\n' + instructions)) {
      // Simulate minting process
      simulateMintingProcess();
    }
  }, 500);
}

function simulateMintingProcess() {
  showToast('Simulating NFT minting process...', 'info');
  
  // Show progress steps
  const steps = ['Connecting wallet...', 'Uploading artwork...', 'Setting metadata...', 'Minting NFT...', 'Listing on marketplaces...'];
  let currentStep = 0;
  
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      showToast(steps[currentStep], 'info');
      currentStep++;
    } else {
      clearInterval(interval);
      showToast('NFT minted successfully!', 'success');
      
      setTimeout(() => {
        showToast('Your NFT is now available on Magic Eden and other marketplaces!', 'info', 5000);
      }, 1000);
    }
  }, 1500);
}

function viewMarketplace() {
  window.open('https://magiceden.io/marketplace/rebelinux', '_blank');
  showToast('Opening Magic Eden marketplace...', 'info');
}

// ========== SUBMISSION FUNCTIONALITY ==========
function openSubmissionForm() {
  showToast('Opening community art submission form...', 'info');
  
  // In a real implementation, you would open a modal or redirect to a form
  setTimeout(() => {
    const submissionInfo = `
      Community Art Submission:
      
      To submit your RebelInuX artwork:
      
      1. Join our Telegram community
      2. Post your artwork in the community chat
      3. Use hashtag #RebelArt
      4. Include your Solana wallet address for potential rewards
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
    `;
    
    if (confirm('Submit your RebelInuX artwork?\n\n' + submissionInfo)) {
      window.open('https://t.me/RebelInuX', '_blank');
      showToast('Opening Telegram community...', 'info');
    }
  }, 500);
}

function downloadAsset(assetType) {
  showToast(`Downloading ${assetType}...`, 'info');
  
  // In a real implementation, you would trigger a file download
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
    '.nft-card, .utility-card, .community-art, .feature, .faq-item, .related-card, .info-card, .brand-card, .guideline'
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
    '.nft-card, .utility-card, .community-art, .feature, .faq-item, .related-card, .info-card, .brand-card, .guideline'
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
window.viewArtDetails = viewArtDetails;
window.startMinting = startMinting;
window.viewMarketplace = viewMarketplace;
window.openSubmissionForm = openSubmissionForm;
window.downloadAsset = downloadAsset;
window.initializeMobileDropdown = initializeMobileDropdown;
window.showToast = showToast;

// Add touch-active class styles
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .touch-active {
      opacity: 0.7 !important;
      transform: scale(0.98) !important;
      transition: all 0.1s ease !important;
    }
    
    /* Fullscreen viewer mobile styles */
    .fullscreen-viewer img {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    
    /* Improved mobile interactions */
    @media (max-width: 768px) {
      .nft-card, .community-art {
        cursor: pointer;
      }
      
      .nft-overlay, .art-overlay {
        opacity: 0;
      }
      
      .nft-card:active .nft-overlay,
      .community-art:active .art-overlay {
        opacity: 1;
        background: rgba(0, 0, 0, 0.7);
      }
    }
  `;
  document.head.appendChild(style);
});

// Load user preferences
window.addEventListener('load', function() {
  // Load liked NFTs
  const likedNFTs = [];
  document.querySelectorAll('.nft-card').forEach(card => {
    const nftId = card.dataset.category;
    if (localStorage.getItem(`nft_liked_${nftId}`) === 'true') {
      likedNFTs.push(card.querySelector('h3').textContent);
    }
  });
  
  if (likedNFTs.length > 0) {
    console.log('Liked NFTs:', likedNFTs);
  }
  
  // Track page visit
  const visitCount = parseInt(localStorage.getItem('artwork_visits') || '0');
  localStorage.setItem('artwork_visits', (visitCount + 1).toString());
  
  if (visitCount === 0) {
    setTimeout(() => {
      showToast('Welcome to the RebelInuX Art Gallery! Explore NFTs and community art.', 'info', 5000);
    }, 2000);
  }
});

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
  
  // Initialize mobile menu
  initMobileMenu();
  
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

// ========== MOBILE MENU ==========
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileNavToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      const nav = document.getElementById('nav-desktop');
      const icon = this.querySelector('i');
      const body = document.body;
      
      nav.classList.toggle('active');
      if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        body.style.overflow = 'hidden';
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        body.style.overflow = '';
      }
    });
  }
  
  // Close mobile nav when clicking on a link
  document.querySelectorAll('#nav-desktop a').forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        document.getElementById('nav-desktop').classList.remove('active');
        const toggleIcon = document.getElementById('mobileNavToggle').querySelector('i');
        if (toggleIcon) {
          toggleIcon.classList.remove('fa-times');
          toggleIcon.classList.add('fa-bars');
        }
        document.body.style.overflow = '';
      }
    });
  });
}

// ========== MOBILE DROPDOWN FUNCTIONALITY ==========
function initializeMobileDropdown() {
  const dropbtn = document.querySelector('.dropbtn');
  
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
      
      // Close all other dropdowns first
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
      });
      
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
  
  // Close dropdown when clicking outside (mobile only)
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const dropdown = document.querySelector('.dropdown');
      const dropdownContent = document.querySelector('.dropdown-content');
      
      if (!e.target.closest('.dropdown') && dropdownContent) {
        dropdownContent.style.display = 'none';
        dropdownContent.classList.remove('active');
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
  
  // Initialize NFT data
  initNFTData();
  
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
    
    // Update NFT stats
    document.getElementById('totalNfts').textContent = '1,000';
    document.getElementById('nftOwners').textContent = '423';
    document.getElementById('communityArt').textContent = '78';
    document.getElementById('volumeTraded').textContent = '250';
    
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
  document.querySelectorAll('.nft-card .like-btn').forEach(btn => {
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
  
  // Sort functionality for NFTs
  const sortSelect = document.getElementById('sortNfts');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortNFTs(this.value);
    });
  }
}

function initFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const artworkCards = document.querySelectorAll('.artwork-card');
  const nftCards = document.querySelectorAll('.nft-card');
  
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
  
  // NFT filtering
  const nftFilterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  nftFilterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      nftFilterBtns.forEach(b => b.classList.remove('active'));
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
        return 0;
      case 'oldest':
        return 0;
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
  
  // View button functionality for NFTs
  document.querySelectorAll('.nft-card .view-btn').forEach(btn => {
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
  const itemCard = button.closest('.nft-card, .artwork-card, .contest-card, .community-art');
  const isNFT = itemCard.classList.contains('nft-card');
  const itemId = isNFT ? itemCard.dataset.category : itemCard.getAttribute('data-id') || itemCard.querySelector('h3').textContent;
  
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
    
    if (isNFT) {
      localStorage.setItem(`nft_liked_${itemId}`, 'false');
    } else {
      localStorage.setItem(`artwork_liked_${itemId}`, 'false');
    }
    
    showToast('Removed from favorites', 'info');
  } else {
    // Like
    button.classList.add('liked');
    likeIcon.className = 'fas fa-heart';
    if (likeCount) {
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    }
    
    if (isNFT) {
      localStorage.setItem(`nft_liked_${itemId}`, 'true');
    } else {
      localStorage.setItem(`artwork_liked_${itemId}`, 'true');
    }
    
    showToast('Added to favorites! ❤️', 'success');
  }
  
  // Animate the like
  button.style.transform = 'scale(1.2)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 300);
  
  // Save like count
  if (likeCount) {
    if (isNFT) {
      localStorage.setItem(`nft_likes_${itemId}`, likeCount.textContent);
    } else {
      localStorage.setItem(`artwork_likes_${itemId}`, likeCount.textContent);
    }
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
  
  // Show art details
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
    console.log('Art details:', details);
    
    if (window.innerWidth > 768) {
      alert(details + '\n\n(In production, this would open a detailed modal)');
    }
  }, 100);
}

// ========== MINTING FUNCTIONALITY ==========
function startMinting() {
  showToast('Opening NFT minting interface...', 'info');
  
  setTimeout(() => {
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
      simulateMintingProcess();
    }
  }, 500);
}

function simulateMintingProcess() {
  showToast('Simulating NFT minting process...', 'info');
  
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
    '.artwork-card, .contest-card, .collection-card, .nft-card, .utility-card, .community-art, .feature, .faq-item, .related-card, .info-card, .brand-card, .guideline, .benefit-card'
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
    '.artwork-card, .contest-card, .collection-card, .nft-card, .utility-card, .community-art, .feature, .faq-item, .related-card, .info-card, .brand-card, .guideline, .benefit-card'
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
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .artwork-card, .contest-card, .nft-card, .community-art {
        cursor: pointer;
      }
      
      .artwork-overlay, .contest-overlay, .nft-overlay, .art-overlay {
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
    document.querySelectorAll('.artwork-card, .contest-card, .nft-card, .community-art').forEach(card => {
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
  document.querySelectorAll('.artwork-card, .contest-card, .nft-card, .community-art').forEach(card => {
    const itemId = card.getAttribute('data-id') || card.querySelector('h3').textContent;
    if (localStorage.getItem(`artwork_liked_${itemId}`) === 'true' || localStorage.getItem(`nft_liked_${itemId}`) === 'true') {
      likedArtwork.push(itemId);
    }
  });
  
  if (likedArtwork.length > 0) {
    console.log('Liked artwork:', likedArtwork);
  }
  
  // Handle window resize for mobile dropdown
  window.addEventListener('resize', function() {
    const dropdownContent = document.querySelector('.dropdown-content');
    if (window.innerWidth > 768 && dropdownContent) {
      dropdownContent.style.display = '';
      dropdownContent.classList.remove('active');
    }
  });
});

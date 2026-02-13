/// 404.js - 404 Error page specific functionality

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🦴 404 Page loaded');
  
  // Initialize components after a short delay
  setTimeout(function() {
    init404Page();
  }, 200);
});

function init404Page() {
  console.log('🚀 Initializing 404 page');
  
  // Hide back to top button (not needed on 404)
  hideBackToTop();
  
  // Set up easter egg click tracking
  setupEasterEgg();
  
  // Prefetch popular destinations for faster navigation
  prefetchPopularPages();
  
  // Log 404 error for analytics
  log404Error();
}

// ===== HIDE BACK TO TOP BUTTON =====
function hideBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.style.opacity = '0';
    backToTop.style.visibility = 'hidden';
    backToTop.style.display = 'none';
  }
}

// ===== EASTER EGG SETUP =====
function setupEasterEgg() {
  const eggElement = document.querySelector('.egg-content');
  
  if (eggElement) {
    // Add click counter for secret achievement
    let clickCount = 0;
    
    eggElement.addEventListener('click', function(e) {
      clickCount++;
      
      // Secret achievement at 10 clicks
      if (clickCount === 10) {
        showSecretAchievement();
      }
      
      // Super secret at 25 clicks
      if (clickCount === 25) {
        showSuperSecretAchievement();
      }
    });
  }
}

// Secret achievement popup
function showSecretAchievement() {
  const achievement = document.createElement('div');
  achievement.className = 'achievement-popup';
  achievement.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--rebel-gold), #e6b800);
    color: var(--dark-bg);
    padding: 1rem 1.5rem;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: 700;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(255, 204, 0, 0.5);
    animation: slideInRight 0.5s ease;
  `;
  achievement.innerHTML = `
    <i class="fas fa-trophy" style="font-size: 1.5rem;"></i>
    <div>
      <strong>🏆 ACHIEVEMENT UNLOCKED!</strong>
      <p style="margin: 0; font-size: 0.85rem;">404 Explorer - You found the secret!</p>
    </div>
    <button onclick="this.parentElement.remove()" style="background: transparent; border: none; color: var(--dark-bg); cursor: pointer; margin-left: 0.5rem;">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  document.body.appendChild(achievement);
  
  setTimeout(() => {
    if (achievement.parentElement) {
      achievement.style.animation = 'slideOutRight 0.5s ease';
      setTimeout(() => achievement.remove(), 500);
    }
  }, 5000);
}

// Super secret achievement
function showSuperSecretAchievement() {
  const achievement = document.createElement('div');
  achievement.className = 'achievement-popup';
  achievement.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, var(--rebel-red), #b71c1c);
    color: white;
    padding: 1.2rem 1.8rem;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font-weight: 700;
    z-index: 10000;
    box-shadow: 0 5px 30px rgba(255, 51, 102, 0.7);
    animation: slideInRight 0.5s ease;
    border: 2px solid var(--rebel-gold);
  `;
  achievement.innerHTML = `
    <i class="fas fa-crown" style="font-size: 2rem; color: var(--rebel-gold);"></i>
    <div>
      <strong style="font-size: 1.1rem;">👑 REBEL LEGEND 👑</strong>
      <p style="margin: 0.2rem 0 0; font-size: 0.9rem;">You've discovered the 404 secret society!</p>
      <p style="margin: 0.2rem 0 0; font-size: 0.8rem;">Contract: F4gh7VNjtp... (never forget)</p>
    </div>
    <button onclick="this.parentElement.remove()" style="background: transparent; border: none; color: white; cursor: pointer; margin-left: 0.5rem;">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  document.body.appendChild(achievement);
  
  setTimeout(() => {
    if (achievement.parentElement) {
      achievement.style.animation = 'slideOutRight 0.5s ease';
      setTimeout(() => achievement.remove(), 500);
    }
  }, 8000);
}

// ===== PREFETCH POPULAR PAGES =====
function prefetchPopularPages() {
  // Prefetch common destinations for faster navigation
  const pagesToPrefetch = [
    'index.html',
    'trade.html',
    'epoch-rewards.html',
    'tokenomics.html',
    'rebl-calculator.html',
    'community.html'
  ];
  
  // Use requestIdleCallback to prefetch when browser is idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      pagesToPrefetch.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      });
      console.log('📦 Prefetched popular pages for faster navigation');
    });
  }
}

// ===== LOG 404 ERROR (for analytics) =====
function log404Error() {
  // Get the URL that caused the 404
  const badUrl = document.referrer || window.location.pathname;
  
  // Log to console for debugging
  console.warn(`⚠️ 404 Error: Page not found - ${badUrl}`);
  
  // You could send this to analytics if available
  if (typeof window.gtag === 'function') {
    window.gtag('event', '404_error', {
      'page_path': badUrl,
      'page_title': document.title
    });
  }
  
  // Store in session storage for potential troubleshooting
  try {
    const errors = JSON.parse(sessionStorage.getItem('rebel_404_errors') || '[]');
    errors.push({
      url: badUrl,
      timestamp: new Date().toISOString()
    });
    // Keep only last 5 errors
    if (errors.length > 5) errors.shift();
    sessionStorage.setItem('rebel_404_errors', JSON.stringify(errors));
  } catch (e) {
    // Ignore storage errors
  }
}

// ===== FUN FACTS DATABASE (enhanced) =====
window.funFacts = [
  "Did you know? The $REBL contract has 98.57% of LP tokens burned — one of the highest burn rates on Solana.",
  "Did you know? RebelInuX launched with zero presale and zero team allocation — 100% fair launch.",
  "Did you know? The dual logo system exists because on-chain metadata is immutable. Both logos represent the same token!",
  "Did you know? $REBL has 67+ verified holders and growing.",
  "Did you know? The Rebel Key NFTs on Base earn $REBL rewards every epoch.",
  "Did you know? 'RebelInuX' combines 'Rebel' + 'Inu' (dog) + 'X' (the unknown) — we're the rebellious unknown.",
  "Did you know? Always verify the contract address. Scammers create fake tokens with similar addresses.",
  "Did you know? The original on-chain logo is stored permanently on Solana and can never be changed.",
  "Did you know? You can track $REBL live on DexScreener and GeckoTerminal.",
  "Did you know? 404 errors are also called 'Page Not Found' — but we prefer 'Rogue Page'.",
  "Did you know? The RebelInuX website is fully responsive and works on mobile, tablet, and desktop.",
  "Did you know? You can verify the $REBL contract on RugCheck and Solscan in under 30 seconds.",
  "Did you know? 404 is the HTTP status code for 'Not Found'. It's been around since the early days of the web.",
  "Did you know? Some websites create elaborate 404 pages to entertain lost visitors. We're one of them!",
  "Did you know? The $REBL contract address starts with 'F4gh' — memorize it to avoid scams!"
];

window.factIndex = Math.floor(Math.random() * window.funFacts.length);

// ===== ENHANCED REBEL SOUND FUNCTION =====
window.playRebelSound = function() {
  // Change fun fact with animation
  const factElement = document.getElementById('funFact');
  if (factElement) {
    window.factIndex = (window.factIndex + 1) % window.funFacts.length;
    
    // Fade out/in animation
    factElement.style.opacity = '0';
    factElement.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      factElement.textContent = window.funFacts[window.factIndex];
      factElement.style.opacity = '1';
      factElement.style.transform = 'translateY(0)';
    }, 200);
    
    // Animate egg icon
    const eggIcon = document.querySelector('.egg-icon i');
    if (eggIcon) {
      eggIcon.style.transform = 'rotate(360deg) scale(1.2)';
      eggIcon.style.transition = 'transform 0.5s ease';
      
      setTimeout(() => {
        eggIcon.style.transform = 'rotate(0deg) scale(1)';
      }, 500);
    }
    
    // Play subtle sound effect if Web Audio API is available (vibes only, no actual sound)
    // This is just for the visual feedback - we don't actually play audio automatically
    console.log('🔊 Easter egg activated! Fact #' + (window.factIndex + 1));
  }
};

// ===== ADD ANIMATION STYLES =====
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .achievement-popup {
    transition: all 0.3s ease;
  }
`;
document.head.appendChild(animationStyles);

// ===== EXPORT FUNCTIONS =====
window.copy404Contract = window.copy404Contract || function() {
  const contract = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const btn = event.currentTarget;
  const originalHTML = btn.innerHTML;
  
  navigator.clipboard.writeText(contract).then(() => {
    btn.innerHTML = '<i class="fas fa-check"></i>';
    btn.style.background = '#4CAF50';
    
    // Use toast if available
    if (typeof window.showLegalToast === 'function') {
      window.showLegalToast('Contract address copied! Always verify before transacting.', 'success');
    } else if (typeof window.showToast === 'function') {
      window.showToast('Contract address copied! Always verify before transacting.', 'success');
    } else {
      alert('Contract address copied to clipboard!');
    }
    
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-copy"></i>';
      btn.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    
    if (typeof window.showLegalToast === 'function') {
      window.showLegalToast('Failed to copy. Please try again.', 'error');
    } else if (typeof window.showToast === 'function') {
      window.showToast('Failed to copy. Please try again.', 'error');
    }
    
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-copy"></i>';
      btn.style.background = '';
    }, 2000);
  });
};

console.log('✅ 404.js loaded successfully');

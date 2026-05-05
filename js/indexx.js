// ===== INDEX PAGE JAVASCRIPT - REBELINUX NFTFI ECOSYSTEM =====
// Professional NFTfi Project - Mobile Optimized
// Updated for Journey NFTs, AI-Animated Historical Art, NFTfi Focus

let animationFrameId = null;

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 RebelInuX NFTfi Ecosystem Index Page Initializing...');
  
  setTimeout(() => {
    initIndexPage();
    initPerformanceMonitoring();
  }, 300);
});

function initPerformanceMonitoring() {
  if (window.performance) {
    const perfData = window.performance.timing;
    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`📊 Page loaded in ${loadTime}ms`);
    if (loadTime > 3000) {
      console.warn('⚠️ Page load time is slow, consider optimization');
    }
  }
}

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  
  const progressBar = loader.querySelector('.progress-bar');
  if (progressBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      progressBar.style.width = Math.min(progress, 100) + '%';
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('loaded');
          document.body.classList.add('loaded');
          document.dispatchEvent(new CustomEvent('pageLoaded', {
            detail: { timestamp: Date.now() }
          }));
        }, 500);
      }
    }, 100);
  } else {
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.classList.add('loaded');
    }, 1500);
  }
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.value-card, .comparison-card, .step-card, .stat-card, ' +
    '.token-card, .logo-card, .contract-emphasis, ' +
    '.feature-card, .process-step, .journey-card, .journey-story-card'
  );
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '50px' });
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  window.scrollAnimationObserver = observer;
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    throw err;
  }
}

function showCopyFeedback(button, success) {
  const originalHTML = button.innerHTML;
  const originalBackground = button.style.background;
  const originalColor = button.style.color;
  
  if (success) {
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    showNotification('Contract address copied!', 'success');
  } else {
    button.innerHTML = '<i class="fas fa-times"></i>';
    button.style.background = '#f44336';
    button.style.color = 'white';
    showNotification('Failed to copy address', 'error');
  }
  
  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.style.background = originalBackground;
    button.style.color = originalColor;
  }, 2000);
}

function handleCopyClick(e) {
  e.preventDefault();
  
  let contractText = '';
  const button = e.currentTarget;
  
  if (button.classList.contains('copy-contract-btn')) {
    contractText = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    copyToClipboard(contractText.trim())
      .then(() => {
        showNotification('$REBL contract address copied!', 'success');
        showCopyFeedback(button, true);
      })
      .catch(() => {
        showNotification('Failed to copy address', 'error');
        showCopyFeedback(button, false);
      });
    return;
  }
  
  if (button.closest('.contract-address')) {
    const codeElement = button.closest('.contract-address')?.querySelector('code');
    if (codeElement) {
      contractText = codeElement.getAttribute('data-full') || codeElement.textContent;
      const isSolana = contractText.length > 32;
      const tokenType = isSolana ? '$REBL (Solana)' : '$rebelinux (Base)';
      
      copyToClipboard(contractText.trim())
        .then(() => {
          showNotification(`${tokenType} address copied!`, 'success');
          showCopyFeedback(button, true);
        })
        .catch(() => {
          showNotification('Failed to copy address', 'error');
          showCopyFeedback(button, false);
        });
    }
  }
}

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn, .copy-contract-btn');
  copyButtons.forEach(button => {
    button.addEventListener('click', handleCopyClick);
  });
}

function toggleContractView(button) {
  const contractAddress = button.closest('.contract-address');
  const codeElement = contractAddress?.querySelector('code');
  
  if (codeElement) {
    const isExpanded = codeElement.classList.toggle('expanded');
    const icon = button.querySelector('i');
    
    if (isExpanded) {
      const fullAddress = codeElement.getAttribute('data-full') || codeElement.textContent;
      codeElement.textContent = fullAddress;
      icon.className = 'fas fa-compress-alt';
    } else {
      const fullAddress = codeElement.getAttribute('data-full') || codeElement.textContent;
      const shortAddress = fullAddress.length > 20 
        ? `${fullAddress.substring(0, 8)}...${fullAddress.substring(fullAddress.length - 6)}`
        : fullAddress;
      codeElement.textContent = shortAddress;
      icon.className = 'fas fa-expand-alt';
    }
  }
}

function initContractAddresses() {
  const contractCodes = document.querySelectorAll('.contract-short');
  contractCodes.forEach(code => {
    const fullAddress = code.getAttribute('data-full') || code.textContent;
    if (fullAddress.length > 20) {
      const shortAddress = `${fullAddress.substring(0, 8)}...${fullAddress.substring(fullAddress.length - 6)}`;
      code.textContent = shortAddress;
    }
  });
}

function initParallaxEffects() {
  const heroBackground = document.querySelector('.hero-background-pattern');
  if (!heroBackground) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroBackground.style.transform = `translate3d(0, ${scrolled * -0.3}px, 0)`;
  });
}

function initLogoInteractions() {
  const logos = document.querySelectorAll('.logo-3d, .token-logo-img');
  logos.forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      logo.style.filter = 'drop-shadow(0 0 30px rgba(212, 167, 106, 0.8)) brightness(1.2)';
    });
    logo.addEventListener('mouseleave', () => {
      logo.style.filter = 'drop-shadow(0 0 20px rgba(212, 167, 106, 0.5))';
    });
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function detectWallet() {
  if (window.phantom || window.solana) return 'phantom';
  if (typeof window.ethereum !== 'undefined') return 'ethereum';
  return 'none';
}

function addTokenToWallet(contractAddress, symbol, decimals, network) {
  if (network === 'Solana') {
    addSolanaTokenToWallet(contractAddress, symbol);
  } else if (network === 'Base') {
    addBaseTokenToWallet(contractAddress, symbol, decimals);
  }
}

function addSolanaTokenToWallet(contractAddress, symbol) {
  const phantom = window.phantom?.solana || window.solana;
  
  if (phantom) {
    phantom.connect({ onlyIfTrusted: true })
      .then(() => {
        copyToClipboard(contractAddress);
        showNotification(`${symbol} address copied! Add it in Phantom.`, 'success');
      })
      .catch(() => {
        phantom.connect()
          .then(() => {
            copyToClipboard(contractAddress);
            showNotification(`${symbol} address copied! Add it in Phantom.`, 'success');
          })
          .catch(() => showNotification('Failed to connect Phantom wallet', 'error'));
      });
  } else {
    showNotification('Please install Phantom wallet', 'warning');
    setTimeout(() => {
      if (confirm('Install Phantom wallet?')) window.open('https://phantom.app/', '_blank');
    }, 1000);
  }
}

function addBaseTokenToWallet(contractAddress, symbol, decimals) {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: contractAddress,
          symbol: symbol,
          decimals: decimals,
          image: 'https://rebelinux.fun/images/rebelinux_logo/$rebelinux%20SVG%20(4).svg'
        }
      }
    })
    .then(success => {
      if (success) showNotification(`${symbol} added to wallet!`, 'success');
      else showNotification('Failed to add token', 'error');
    })
    .catch(() => showNotification('Error adding token', 'error'));
  } else {
    showNotification('Please install MetaMask', 'warning');
    setTimeout(() => {
      if (confirm('Install MetaMask?')) window.open('https://metamask.io/', '_blank');
    }, 1000);
  }
}

function addToWallet(contractAddress) {
  if (contractAddress.length > 32) {
    addTokenToWallet(contractAddress, 'REBL', 9, 'Solana');
  } else {
    addTokenToWallet(contractAddress, 'rebelinux', 18, 'Base');
  }
}

function copyContractAddress() {
  const contractCode = document.querySelector('.contract-code code');
  if (contractCode) {
    const address = contractCode.textContent.trim();
    copyToClipboard(address)
      .then(() => showNotification('$REBL contract address copied!', 'success'))
      .catch(() => showNotification('Failed to copy', 'error'));
  }
}

function initWalletDetection() {
  const walletType = detectWallet();
  const walletButtons = document.querySelectorAll('.wallet-action');
  
  walletButtons.forEach(button => {
    const isSolanaButton = button.textContent.includes('REBL');
    if (walletType === 'phantom' && isSolanaButton) {
      button.innerHTML = '<i class="fas fa-wallet"></i><span>Add to Phantom</span>';
    } else if (walletType === 'ethereum' && !isSolanaButton) {
      button.innerHTML = '<i class="fab fa-ethereum"></i><span>Add to MetaMask</span>';
    }
  });
}

function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';
  
  notification.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  
  // Style notification
  let bgColor = 'rgba(33, 150, 243, 0.95)';
  if (type === 'success') bgColor = 'rgba(76, 175, 80, 0.95)';
  if (type === 'error') bgColor = 'rgba(244, 67, 54, 0.95)';
  if (type === 'warning') bgColor = 'rgba(255, 152, 0, 0.95)';
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 12px 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
    max-width: min(350px, calc(100vw - 40px));
    font-size: 0.9rem;
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function isMobile() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function optimizeForMobile() {
  if (!isMobile()) return;
  
  const heroMetrics = document.querySelector('.hero-metrics');
  if (heroMetrics) heroMetrics.style.gridTemplateColumns = '1fr';
  
  const chainNodes = document.querySelectorAll('.chain-node');
  chainNodes.forEach(node => node.style.maxWidth = '250px');
}

function initMobileOptimizations() {
  if (!isMobile()) return;
  
  optimizeForMobile();
  
  const bridgeTokens = document.querySelector('.bridge-tokens');
  const movingCoin = document.querySelector('.moving-coin');
  if (bridgeTokens && movingCoin) {
    const arrow = bridgeTokens.querySelector('.fa-arrow-right');
    if (arrow) arrow.style.transform = 'rotate(90deg)';
    movingCoin.style.animation = 'move-down 2.5s ease-in-out infinite';
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#how-it-works') {
        e.preventDefault();
        const target = document.querySelector('#how-it-works');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

function initIndexPage() {
  console.log('✨ Initializing RebelInuX NFTfi Ecosystem Index Page');
  
  const initFunctions = [
    initLoader,
    initScrollAnimations,
    initParallaxEffects,
    initContractAddresses,
    initCopyButtons,
    initBackToTop,
    initMobileOptimizations,
    initWalletDetection,
    initLogoInteractions,
    initSmoothScroll
  ];
  
  initFunctions.forEach((fn, i) => {
    setTimeout(() => {
      try { 
        fn(); 
      } catch (e) { 
        console.warn(`⚠️ ${fn.name}:`, e); 
      }
    }, i * 100);
  });
}

// Expose global functions
window.RebelInuX = { 
  initIndexPage, 
  copyToClipboard, 
  addToWallet, 
  showNotification, 
  toggleContractView,
  copyContractAddress
};

// Page ready event
window.addEventListener('load', () => {
  document.dispatchEvent(new CustomEvent('rebelinux:pageReady', { 
    detail: { timestamp: Date.now(), page: 'index' } 
  }));
  console.log('✅ RebelInuX NFTfi Ecosystem Index Page Initialized');
});

// Add required keyframe animations if not present
const keyframeStyle = document.createElement('style');
keyframeStyle.textContent = `
  @keyframes move-down {
    0% { transform: translateY(-30px); opacity: 0; }
    50% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(30px); opacity: 0; }
  }
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(keyframeStyle);

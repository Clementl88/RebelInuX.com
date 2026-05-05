/// ===== INDEXX PAGE JAVASCRIPT - EPOCH 31+ VERSION =====
// Professional Crypto Project - Mobile Optimized
// Updated for Permanent Rebel Key, One-Time Registration, REBL Governance Hub

let animationFrameId = null;

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 RebelInuX IndexX Page (Epoch 31+) Initializing...');
  
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
    '.token-card, .logo-card, .key-takeaway, .contract-emphasis, ' +
    '.feature-card, .process-step'
  );
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in');
          const rect = entry.target.getBoundingClientRect();
          if (rect.left < window.innerWidth / 2) {
            entry.target.classList.add('slide-in-left');
          } else {
            entry.target.classList.add('slide-in-right');
          }
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    observer.observe(el);
  });
  
  window.scrollAnimationObserver = observer;
}

function initStatsCounters() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  if (statValues.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        const statElement = entry.target;
        const targetValue = parseFloat(statElement.getAttribute('data-target'));
        const prefix = statElement.getAttribute('data-prefix') || '';
        const suffix = statElement.getAttribute('data-suffix') || '';
        
        animateCounter(statElement, targetValue, prefix, suffix);
        statElement.classList.add('animated');
        observer.unobserve(statElement);
      }
    });
  }, { 
    threshold: 0.5,
    rootMargin: '100px' 
  });
  
  statValues.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target, prefix = '', suffix = '') {
  const duration = 2000;
  const startTime = performance.now();
  const startValue = parseFloat(element.textContent) || 0;
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.round(num).toString();
  };
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = startValue + (target - startValue) * easeProgress;
    
    element.textContent = prefix + formatNumber(current) + suffix;
    
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(updateCounter);
    } else {
      element.textContent = prefix + formatNumber(target) + suffix;
    }
  }
  
  animationFrameId = requestAnimationFrame(updateCounter);
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
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    showNotification('Contract address copied to clipboard!', 'success');
  } else {
    button.innerHTML = '<i class="fas fa-times"></i> Failed';
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
        showNotification('Solana ($REBL) address copied!', 'success');
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
      const tokenType = isSolana ? 'Solana ($REBL)' : 'Base ($rebelinux)';
      
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

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || !href.startsWith('#') || !document.querySelector(href)) {
        return;
      }
      
      e.preventDefault();
      scrollToElement(href);
    });
  });
  
  window.scrollToElement = function(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 80;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = targetPosition - headerHeight - 20;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    if (selector !== '#') {
      history.pushState(null, null, selector);
    }
  };
}

function initParticles() {
  const heroSection = document.querySelector('.page-hero--main');
  if (!heroSection || document.querySelector('.particle')) return;
  
  if (isMobile()) return;
  
  const particleContainer = heroSection.querySelector('.hero-particles');
  if (!particleContainer) return;
  
  const particleCount = Math.min(30, Math.floor(window.innerWidth / 30));
  window.particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = createParticle(particleContainer);
    window.particles.push(particle);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 4 + 1;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * duration;
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.1});
    border-radius: 50%;
    top: ${Math.random() * 100}%;
    left: ${Math.random() * 100}%;
    animation: float-particle ${duration}s linear ${delay}s infinite;
    z-index: 1;
    pointer-events: none;
  `;
  
  container.appendChild(particle);
  return particle;
}

function initLogoAnimations() {
  const logoCards = document.querySelectorAll('.logo-card');
  logoCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 300 + (index * 200));
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
  function toggleBackToTop() {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  
  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop();
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      button.setAttribute('title', 'Collapse address');
      button.setAttribute('aria-label', 'Collapse contract address view');
    } else {
      const fullAddress = codeElement.getAttribute('data-full') || codeElement.textContent;
      const shortAddress = fullAddress.length > 20 
        ? `${fullAddress.substring(0, 8)}...${fullAddress.substring(fullAddress.length - 6)}`
        : fullAddress;
      codeElement.textContent = shortAddress;
      icon.className = 'fas fa-expand-alt';
      button.setAttribute('title', 'Expand address');
      button.setAttribute('aria-label', 'Expand contract address view');
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
    const rate = scrolled * -0.5;
    heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
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

function initEnhancedCounters() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  counters.forEach(counter => {
    const updateCounter = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText.replace(/[^0-9.]/g, '');
      const increment = target / 100;
      
      if (count < target) {
        counter.innerText = Math.ceil(count + increment).toLocaleString();
        setTimeout(updateCounter, 20);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(counter);
  });
}

function initChainAnimation() {
  const bridgeTokens = document.querySelector('.bridge-tokens');
  if (!bridgeTokens) return;
  
  for (let i = 0; i < 3; i++) {
    const coin = document.createElement('div');
    coin.className = 'moving-coin';
    coin.style.animationDelay = `${i * 0.5}s`;
    coin.style.opacity = '0.6';
    bridgeTokens.appendChild(coin);
  }
}

function initValueCardEffects() {
  const valueCards = document.querySelectorAll('.value-card');
  valueCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

function isMobile() {
  return window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function detectWallet() {
  if (window.phantom || window.solana) {
    console.log('🔍 Phantom wallet detected');
    return 'phantom';
  } else if (typeof window.ethereum !== 'undefined') {
    console.log('🔍 Ethereum wallet detected');
    return 'ethereum';
  } else {
    console.log('🔍 No wallet detected');
    return 'none';
  }
}

function addTokenToWallet(contractAddress, symbol, decimals, network) {
  console.log(`Adding ${symbol} to wallet (${network} network)`);
  
  if (network === 'Solana') {
    addSolanaTokenToWallet(contractAddress, symbol, decimals);
  } else if (network === 'Base') {
    addBaseTokenToWallet(contractAddress, symbol, decimals);
  } else {
    addEthereumTokenToWallet(contractAddress, symbol, decimals, network);
  }
}

function addSolanaTokenToWallet(contractAddress, symbol, decimals) {
  const phantom = window.phantom?.solana || window.solana;
  
  if (phantom) {
    phantom.connect({ onlyIfTrusted: true })
      .then(() => {
        showSolanaInstructionsModal(contractAddress, symbol);
      })
      .catch(() => {
        showNotification('Please connect your Phantom wallet first', 'warning');
        phantom.connect()
          .then(() => {
            showNotification('Wallet connected! Now add the token', 'success');
            setTimeout(() => {
              showSolanaInstructionsModal(contractAddress, symbol);
            }, 1000);
          })
          .catch((error) => {
            console.error('Connection error:', error);
            showNotification('Failed to connect wallet', 'error');
          });
      });
  } else {
    showNotification(`Please install Phantom wallet for ${symbol}`, 'warning');
    setTimeout(() => {
      const install = confirm(`Phantom wallet is required for ${symbol}. Install now?`);
      if (install) {
        window.open('https://phantom.app/', '_blank');
      }
    }, 1000);
  }
}

function addBaseTokenToWallet(contractAddress, symbol, decimals) {
  if (typeof window.ethereum !== 'undefined') {
    const baseChainId = '0x2105';
    window.ethereum.request({ method: 'eth_chainId' })
      .then(currentChainId => {
        if (currentChainId === baseChainId) {
          addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
        } else {
          switchToBaseChain(contractAddress, symbol, decimals);
        }
      })
      .catch(error => {
        console.error('Error checking chain:', error);
        showNotification('Failed to check network. Please ensure your wallet is connected.', 'error');
      });
  } else {
    showNotification(`Please install MetaMask or another Web3 wallet for ${symbol}`, 'warning');
    setTimeout(() => {
      const install = confirm('MetaMask is required for Base chain tokens. Install now?');
      if (install) {
        window.open('https://metamask.io/', '_blank');
      }
    }, 1000);
  }
}

function switchToBaseChain(contractAddress, symbol, decimals) {
  const switchConfirm = confirm(`To add ${symbol}, you need to switch to Base network. Switch now?`);
  
  if (switchConfirm) {
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }],
    })
    .then(() => {
      setTimeout(() => {
        addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
      }, 1000);
    })
    .catch((switchError) => {
      if (switchError.code === 4902) {
        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x2105',
            chainName: 'Base Mainnet',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org']
          }]
        })
        .then(() => {
          setTimeout(() => {
            addTokenViaEthereum(contractAddress, symbol, decimals, 'Base');
          }, 1000);
        })
        .catch(addError => {
          console.error('Error adding Base chain:', addError);
          showNotification('Failed to add Base network to wallet', 'error');
        });
      } else {
        console.error('Error switching to Base:', switchError);
        showNotification('Failed to switch to Base network', 'error');
      }
    });
  }
}

function addTokenViaEthereum(contractAddress, symbol, decimals, network) {
  const tokenImages = {
    'rebelinux': 'https://rebelinux.fun/images/rebelinux_logo/$rebelinux%20SVG%20(4).svg',
    'REBL': 'https://rebelinux.fun/images/Logo_REBL.svg'
  };
  
  window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: contractAddress,
        symbol: symbol,
        decimals: decimals,
        image: tokenImages[symbol] || ''
      }
    }
  })
  .then(success => {
    if (success) {
      showNotification(`${symbol} added to wallet successfully!`, 'success');
    } else {
      showNotification(`Failed to add ${symbol} to wallet`, 'error');
    }
  })
  .catch(error => {
    console.error('Error adding token:', error);
    showNotification(`Error adding ${symbol}: ${error.message}`, 'error');
  });
}

function addToWallet(contractAddress) {
  if (contractAddress.length > 32) {
    addTokenToWallet(contractAddress, 'REBL', 9, 'Solana');
  } else {
    addTokenToWallet(contractAddress, 'rebelinux', 18, 'Base');
  }
}

function showSolanaInstructionsModal(contractAddress, symbol) {
  copyToClipboard(contractAddress)
    .then(() => {
      showNotification(`${symbol} contract address copied!`, 'success');
      
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div class="token-instructions-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(8px);">
          <div style="background: linear-gradient(135deg, #1a120b, #2a1f14); padding: 2rem; border-radius: 20px; max-width: 500px; width: 90%; border: 2px solid var(--rebel-gold); box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h3 style="color: var(--rebel-gold); margin: 0; font-size: 1.5rem;">
                <i class="fas fa-wallet" style="margin-right: 0.75rem;"></i>
                Add ${symbol} to Phantom Wallet
              </h3>
              <button onclick="this.closest('.token-instructions-modal').remove()" 
                      style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <ol style="color: white; margin-bottom: 2rem; padding-left: 1.5rem; line-height: 1.8;">
              <li style="margin-bottom: 1rem;">Open <strong style="color: var(--rebel-gold);">Phantom wallet</strong> on your device</li>
              <li style="margin-bottom: 1rem;">Tap the <strong style="color: var(--rebel-gold);">+</strong> button in your tokens list</li>
              <li style="margin-bottom: 1rem;">Select <strong>"Add Token"</strong></li>
              <li style="margin-bottom: 1rem;">
                Paste this address:
                <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; margin-top: 0.5rem; font-family: monospace; word-break: break-all; font-size: 0.8rem;">
                  ${contractAddress}
                </div>
              </li>
              <li>Tap <strong>"Add"</strong> to complete</li>
            </ol>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <button onclick="copyToClipboard('${contractAddress}').then(() => { showNotification('Address copied again!', 'success'); })" 
                      style="background: var(--rebel-gold); color: #333; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 700; flex: 1;">
                <i class="fas fa-copy" style="margin-right: 0.5rem;"></i>
                Copy Address
              </button>
              <button onclick="window.open('https://phantom.app/', '_blank')" 
                      style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; flex: 1;">
                <i class="fas fa-external-link-alt" style="margin-right: 0.5rem;"></i>
                Get Phantom
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    })
    .catch(() => {
      showNotification('Failed to copy address', 'error');
    });
}

function addEthereumTokenToWallet(contractAddress, symbol, decimals, network) {
  if (typeof window.ethereum !== 'undefined') {
    addTokenViaEthereum(contractAddress, symbol, decimals, network);
  } else {
    showNotification('Please install a Web3 wallet like MetaMask', 'warning');
  }
}

function copyContractAddress() {
  const contractCode = document.querySelector('.contract-code code');
  if (contractCode) {
    const address = contractCode.textContent.trim();
    copyToClipboard(address)
      .then(() => {
        showNotification('Contract address copied to clipboard!', 'success');
      })
      .catch(() => {
        showNotification('Failed to copy address', 'error');
      });
  }
}

function initWalletDetection() {
  const walletType = detectWallet();
  const walletButtons = document.querySelectorAll('.wallet-action');
  
  walletButtons.forEach(button => {
    const isSolanaButton = button.textContent.includes('REBL') || 
                           (button.onclick && button.onclick.toString().includes('Solana'));
    
    if (walletType === 'phantom' && isSolanaButton) {
      button.innerHTML = '<i class="fas fa-wallet"></i><span>Add to Phantom</span>';
    } else if (walletType === 'ethereum' && !isSolanaButton) {
      button.innerHTML = '<i class="fab fa-ethereum"></i><span>Add to MetaMask</span>';
    }
    
    button.addEventListener('click', function(e) {
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting...</span>';
      this.disabled = true;
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
      }, 3000);
    });
  });
}

function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

function initPerformanceObservers() {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.log(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  }
}

function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };
  
  notification.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <span>${message}</span>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'rgba(76, 175, 80, 0.95)' : 
                 type === 'error' ? 'rgba(244, 67, 54, 0.95)' : 
                 type === 'warning' ? 'rgba(255, 193, 7, 0.95)' : 
                 'rgba(33, 150, 243, 0.95)'};
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    max-width: min(350px, calc(100vw - 40px));
    pointer-events: none;
  `;
  
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

function initMobileOptimizations() {
  if (!isMobile()) return;
  
  document.documentElement.style.setProperty('--animation-medium', '0.4s');
  document.documentElement.style.setProperty('--animation-slow', '0.6s');
  
  const particles = document.querySelectorAll('.particle');
  if (particles.length > 10) {
    for (let i = 10; i < particles.length; i++) {
      particles[i].remove();
    }
  }
  
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    if (isInViewport(img)) {
      img.loading = 'eager';
    }
  });
  
  optimizeTokenEcosystemForMobile();
  
  const bridgeTokens = document.querySelector('.bridge-tokens');
  const movingCoin = document.querySelector('.moving-coin');
  
  if (bridgeTokens && movingCoin && isMobile()) {
    const arrow = bridgeTokens.querySelector('.fa-arrow-right');
    if (arrow) {
      arrow.style.transform = 'rotate(90deg)';
    }
    movingCoin.style.animation = 'move-down 2.5s ease-in-out infinite';
  }
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 &&
         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

function optimizeTokenEcosystemForMobile() {
  if (!isMobile()) return;
  
  const ecosystemFlow = document.querySelector('.ecosystem-flow');
  if (!ecosystemFlow) return;
  
  const basePlatform = ecosystemFlow.querySelector('.base-platform');
  const solanaPlatform = ecosystemFlow.querySelector('.solana-platform');
  const bridgeAnimation = ecosystemFlow.querySelector('.bridge-animation');
  
  if (basePlatform && solanaPlatform && bridgeAnimation) {
    ecosystemFlow.innerHTML = '';
    
    const mobileLayout = document.createElement('div');
    mobileLayout.className = 'ecosystem-mobile-layout';
    mobileLayout.style.cssText = `display: flex; flex-direction: column; align-items: center; gap: 1.5rem; width: 100%;`;
    
    const baseWrapper = document.createElement('div');
    baseWrapper.className = 'mobile-platform-wrapper';
    baseWrapper.appendChild(basePlatform);
    
    const bridgeWrapper = document.createElement('div');
    bridgeWrapper.className = 'mobile-bridge-wrapper';
    bridgeWrapper.style.cssText = `display: flex; justify-content: center; width: 100%; padding: 1rem 0;`;
    bridgeAnimation.classList.add('mobile-bridge');
    bridgeWrapper.appendChild(bridgeAnimation);
    
    const solanaWrapper = document.createElement('div');
    solanaWrapper.className = 'mobile-platform-wrapper';
    solanaWrapper.appendChild(solanaPlatform);
    
    mobileLayout.appendChild(baseWrapper);
    mobileLayout.appendChild(bridgeWrapper);
    mobileLayout.appendChild(solanaWrapper);
    ecosystemFlow.appendChild(mobileLayout);
    
    updateBridgeForMobile(bridgeAnimation);
  }
}

function updateBridgeForMobile(bridgeElement) {
  const bridgeLine = bridgeElement.querySelector('.bridge-line');
  const bridgeContent = bridgeElement.querySelector('.bridge-content');
  
  if (bridgeLine && bridgeContent) {
    bridgeLine.style.cssText = `
      width: 3px;
      height: 60px;
      background: linear-gradient(to bottom, var(--rebel-gold), var(--rebel-blue));
      margin: 0 auto;
      border-radius: 3px;
    `;
    
    bridgeContent.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50px;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      white-space: nowrap;
      z-index: 2;
    `;
    
    const bridgeText = bridgeContent.querySelector('span');
    if (bridgeText) {
      bridgeText.textContent = 'Cross-Chain';
    }
  }
}

function initTouchInteractions() {
  if (isMobile()) {
    const contractAddresses = document.querySelectorAll('.contract-address code');
    
    contractAddresses.forEach(code => {
      let pressTimer;
      code.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
          const fullAddress = this.getAttribute('data-full') || this.textContent;
          copyToClipboard(fullAddress.trim())
            .then(() => showNotification('Address copied!', 'success'))
            .catch(() => showNotification('Copy failed', 'error'));
          this.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
          setTimeout(() => { this.style.backgroundColor = ''; }, 500);
        }, 800);
      }, { passive: true });
      code.addEventListener('touchend', function() { clearTimeout(pressTimer); }, { passive: true });
      code.addEventListener('touchmove', function() { clearTimeout(pressTimer); }, { passive: true });
    });
  }
  
  const touchElements = document.querySelectorAll('button, a, .token-card, .value-card');
  touchElements.forEach(el => {
    el.addEventListener('touchstart', function() { this.classList.add('touch-active'); }, { passive: true });
    el.addEventListener('touchend', function() { this.classList.remove('touch-active'); }, { passive: true });
  });
}

function cleanupAnimations() {
  console.log('🧹 Cleaning up animations...');
  
  if (window.scrollAnimationObserver) {
    window.scrollAnimationObserver.disconnect();
    delete window.scrollAnimationObserver;
  }
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  if (window.logoAnimationId) {
    cancelAnimationFrame(window.logoAnimationId);
    delete window.logoAnimationId;
  }
  
  if (window.particles && window.particles.length > 0) {
    window.particles.forEach(particle => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    delete window.particles;
  }
  
  if (window.mousemoveListener) {
    window.removeEventListener('mousemove', window.mousemoveListener);
    delete window.mousemoveListener;
  }
}

window.addEventListener('beforeunload', cleanupAnimations);
window.addEventListener('pagehide', cleanupAnimations);
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    cleanupAnimations();
  }
});

function initParallax() {
  const heroBG = document.querySelector('.hero-background-pattern');
  if (!heroBG) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroBG.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
}

function initIndexPage() {
  console.log('✨ Initializing Epoch 31+ Index page features');
  
  const initQueue = [
    initLoader,
    initScrollAnimations,
    initParallaxEffects,
    initStatsCounters,
    initContractAddresses,
    initEnhancedCounters,
    initCopyButtons,
    initSmoothScroll,
    initParticles,
    initLogoAnimations,
    initLogoInteractions,
    initBackToTop,
    initMobileOptimizations,
    initTouchInteractions,
    initLazyLoading,
    initPerformanceObservers,
    initWalletDetection,
    initChainAnimation,
    initValueCardEffects
  ];
  
  initQueue.forEach((initFn, index) => {
    setTimeout(() => {
      try {
        initFn();
      } catch (error) {
        console.warn(`⚠️ Failed to initialize ${initFn.name}:`, error);
      }
    }, index * 100);
  });
}

window.RebelInuX = {
  initIndexPage,
  copyToClipboard,
  addToWallet,
  showNotification,
  scrollToElement: window.scrollToElement,
  toggleContractView
};

window.addEventListener('load', function() {
  document.documentElement.classList.add('page-loaded');
  document.dispatchEvent(new CustomEvent('rebelinux:pageReady', {
    detail: { timestamp: Date.now(), page: 'indexx' }
  }));
  console.log('✅ RebelInuX IndexX Page (Epoch 31+) Initialized Successfully');
});

window.addEventListener('error', function(e) {
  console.error('❌ Unhandled error:', e.error);
  if (window.gtag) {
    window.gtag('event', 'exception', { description: e.error.message, fatal: true });
  }
});

const style = document.createElement('style');
style.textContent = `
  @keyframes move-down {
    0% { transform: translateY(-30px); opacity: 0; }
    50% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(30px); opacity: 0; }
  }
  .touch-active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
`;
document.head.appendChild(style);

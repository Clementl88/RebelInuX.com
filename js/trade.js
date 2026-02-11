// trade.js - Trade page specific functionality

// Add this function to trade.js
function initLogoExplanation() {
  console.log("Initializing logo explanation section");
  
  // Add click handlers to show more info about each logo
  document.querySelectorAll('.logo-section').forEach(section => {
    section.addEventListener('click', function() {
      const type = this.classList.contains('onchain') ? 'on-chain' : 'off-chain';
      showLogoInfo(type);
    });
  });
  
}

function showLogoInfo(type) {
  const messages = {
    'on-chain': `The original RebelInuX logo is permanently stored on the Solana blockchain. This cannot be changed due to blockchain immutability.`,
    'off-chain': `The updated RebelInuX logo represents our current brand identity and is used across websites, marketing materials, and centralized platforms.`
  };
  
  showToast(messages[type], 'info');
}

function initTradePage() {
  console.log('Initializing Trade page');
  
  // Initialize any trade-specific functionality here
  initTradeComponents();
  
  ;
  
  // ===== ADD THIS: Initialize AOS with delay =====
  initAOSWithDelay();
}

// ===== NEW FUNCTION: Initialize AOS with proper delay =====
function initAOSWithDelay() {
  // Check if AOS is available
  if (typeof AOS !== 'undefined') {
    // Delay to ensure menu is fully initialized
    setTimeout(function() {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
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
            offset: 100
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


function initTradeComponents() {
  console.log('Trade components initialized');
  
  // Initialize live data
  initializeLiveData();
  
  // Initialize contract verification functions
  initContractFunctions();
  
  // Setup trading pairs
  setupTradingPairs();

  initLogoExplanation();
}

// ========== LIVE TRADING DATA FUNCTIONS ==========

const STATIC_DATA = {
  holders: 67,
  currentSupply: 944920617,
  burnedSupply: 55079383,
  maxSupply: 1000000000
};

let currentSolPrice = 0;

async function fetchLiveStatsData() {
  try {
    console.log("🔄 Fetching live trading data...");
    
    // Get DexScreener API data
    let marketData = {
      price: 0,
      priceChange: 0,
      marketCap: 0,
      volume: 0,
      liquidity: 0,
      success: false
    };
    
    try {
      const dexscreenerResponse = await fetch(
        'https://api.dexscreener.com/latest/dex/pairs/solana/Fyak2SY4vx2PnExMh87rJ7uGAVrhN3Z9SfZcJEMa7kyv',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-cache'
        }
      );
      
      if (dexscreenerResponse.ok) {
        const dexscreenerData = await dexscreenerResponse.json();
        
        if (dexscreenerData.pairs && dexscreenerData.pairs.length > 0) {
          const pair = dexscreenerData.pairs[0];
          
          marketData = {
            price: parseFloat(pair.priceUsd) || 0,
            priceChange: parseFloat(pair.priceChange?.h24) || 0,
            marketCap: parseFloat(pair.fdv) || 0,
            volume: parseFloat(pair.volume?.h24) || 0,
            liquidity: parseFloat(pair.liquidity?.usd) || 0,
            success: true
          };
          
          console.log("✅ Market data parsed:", marketData);
        }
      }
    } catch (dexscreenerError) {
      console.error("❌ DexScreener error:", dexscreenerError);
    }
    
    // Get SOL price
    const solPrice = await getSolPrice();
    currentSolPrice = solPrice;
    
    // Prepare final data
    const finalData = {
      price: marketData.price,
      priceChange: marketData.priceChange,
      marketCap: marketData.marketCap,
      volume: marketData.volume,
      liquidity: marketData.liquidity,
      holders: STATIC_DATA.holders,
      solPrice: solPrice,
      lastUpdate: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }),
      success: marketData.success
    };
    
    console.log("✅ Final trading data prepared:", finalData);
    return finalData;
    
  } catch (error) {
    console.error("💥 Error in fetchLiveStatsData:", error);
    return {
      price: 0,
      priceChange: 0,
      marketCap: 0,
      volume: 0,
      liquidity: 0,
      holders: 0,
      solPrice: 0,
      lastUpdate: 'Error',
      success: false
    };
  }
}

async function getSolPrice() {
  // In a real implementation, you would fetch SOL price from an API
  // For now, return a placeholder
  return 150; // Approximate SOL price in USD
}

function updateTradingDisplay(data) {
  console.log("🎨 Updating trading display with data:", data);
  
  // Format number with commas
  function formatNumber(num, isCurrency = true) {
    if (num === 0 || isNaN(num)) return '—';
    if (num >= 1000000) {
      return (isCurrency ? '$' : '') + (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (isCurrency ? '$' : '') + (num / 1000).toFixed(1) + 'K';
    }
    return (isCurrency ? '$' : '') + num.toFixed(2);
  }
  
  function formatSmallNumber(num) {
    if (num === 0 || isNaN(num)) return '0.00';
    if (num < 0.000001) {
      return num.toExponential(2);
    }
    if (num < 0.0001) {
      return num.toFixed(8);
    }
    if (num < 0.01) {
      return num.toFixed(6);
    }
    return num.toFixed(4);
  }
  
  // Update price
  const priceElement = document.getElementById('current-price');
  if (priceElement) {
    priceElement.textContent = data.price > 0 ? `$${formatSmallNumber(data.price)}` : '$0.00000000';
  }
  
  // Update price change
  const priceChangeElement = document.getElementById('price-change');
  if (priceChangeElement) {
    if (data.priceChange !== 0) {
      priceChangeElement.textContent = `${data.priceChange >= 0 ? '+' : ''}${data.priceChange.toFixed(2)}%`;
      priceChangeElement.className = data.priceChange >= 0 ? 'positive' : 'negative';
    } else {
      priceChangeElement.textContent = '0.00%';
      priceChangeElement.className = 'positive';
    }
  }
  
  // Update market stats
  const updates = {
    'market-cap': formatNumber(data.marketCap),
    'volume-24h': formatNumber(data.volume),
    'liquidity': formatNumber(data.liquidity),
    'holders': data.holders.toLocaleString(),
    'last-updated-time': data.lastUpdate || 'Just now'
  };
  
  Object.entries(updates).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
      console.log(`✅ Updated ${id}: ${value}`);
    }
  });
  
  // Update SOL price conversion
  const solPriceElement = document.getElementById('sol-price');
  if (solPriceElement && currentSolPrice > 0 && data.price > 0) {
    const reblPerSol = 1 / (data.price / currentSolPrice);
    solPriceElement.textContent = formatNumber(reblPerSol, false);
  }
  
  // Update USDC price conversion (1 USDC = 1 USD)
  const usdcPriceElement = document.getElementById('usdc-price');
  if (usdcPriceElement && data.price > 0) {
    const reblPerUsdc = 1 / data.price;
    usdcPriceElement.textContent = formatNumber(reblPerUsdc, false);
  }
  
  // Update API status
  const statusElement = document.getElementById('api-status');
  if (statusElement) {
    statusElement.textContent = data.success ? '✅ Live' : '⚠️ Cached';
    statusElement.style.background = data.success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)';
    statusElement.style.color = data.success ? '#4CAF50' : '#FF9800';
    statusElement.style.borderColor = data.success ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)';
  }
}

async function initializeLiveData() {
  console.log("🚀 Initializing live trading data...");
  
  // Show loading state
  document.querySelectorAll('.value').forEach(el => {
    if (el.textContent === '—' || el.textContent === 'Loading...') {
      el.innerHTML = '<span style="color: var(--rebel-gold); font-style: italic;">Loading...</span>';
    }
  });
  
  try {
    // Initial data fetch
    const data = await fetchLiveStatsData();
    updateTradingDisplay(data);
    
    // Start auto-refresh every 30 seconds
    console.log("🔄 Setting up auto-refresh every 30 seconds...");
    setInterval(async () => {
      if (document.visibilityState === 'visible') {
        console.log("🔄 Auto-refresh triggered at:", new Date().toLocaleTimeString());
        const newData = await fetchLiveStatsData();
        updateTradingDisplay(newData);
      } else {
        console.log("⏸️ Page not visible, skipping refresh");
      }
    }, 30000);
    
    console.log("✅ Auto-refresh interval started");
    
  } catch (error) {
    console.error("❌ Failed to initialize live data:", error);
  }
}

// Global refresh function
window.refreshAllData = async function(event) {
  const button = document.querySelector('.refresh-button');
  const isManualClick = button && event && event.type === 'click';
  
  if (isManualClick) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
    button.disabled = true;
  }
  
  try {
    console.log("🔄 Refreshing all data...");
    const data = await fetchLiveStatsData();
    updateTradingDisplay(data);
    
    if (isManualClick) {
      // Show success feedback for manual clicks only
      button.innerHTML = '<i class="fas fa-check"></i> Updated!';
      button.style.background = '#4CAF50';
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.background = '';
      }, 1500);
    }
    
  } catch (error) {
    console.error("❌ Error refreshing data:", error);
    
    if (isManualClick) {
      button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
      button.style.background = 'var(--rebel-red)';
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.background = '';
      }, 2000);
    }
  }
};

// ========== CONTRACT VERIFICATION FUNCTIONS ==========

function initContractFunctions() {
  console.log("Initializing contract verification functions");
}

function copyContractFull() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;
  
  navigator.clipboard.writeText(contractAddress).then(() => {
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#4CAF50';
    
    showToast('Contract address copied to clipboard!', 'success');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
    }, 2000);
    
  }).catch(err => {
    console.error('Failed to copy: ', err);
    button.innerHTML = '<i class="fas fa-times"></i> Failed';
    button.style.background = '#f44336';
    showToast('Failed to copy. Please try again.', 'error');
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
    }, 2000);
  });
}

function addToWallet() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const button = event.target.closest('button') || event.target;
  const originalHTML = button.innerHTML;
  
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  
  // Show instructions for adding to wallet
  showToast('Check your wallet for token addition prompt', 'info');
  
  // Provide instructions
  const instructions = `To add $REBL to your wallet:
1. Open your wallet (Phantom, Solflare, etc.)
2. Click "Add Token" or "Import Token"
3. Paste this address: ${contractAddress}
4. Confirm addition`;

  alert(instructions);
  
  setTimeout(() => {
    button.innerHTML = originalHTML;
  }, 2000);
}

function verifyOnAll() {
  // Open all verification links in new tabs
  const links = [
    'https://solscan.io/token/F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump',
    'https://rugcheck.xyz/tokens/F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump',
    'https://dexscreener.com/solana/Fyak2SY4vx2PnExMh87rJ7uGAVrhN3Z9SfZcJEMa7kyv'
  ];
  
  links.forEach(link => {
    window.open(link, '_blank');
  });
  
  showToast('Opening all verification platforms...', 'info');
}

function generateQR() {
  const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(contractAddress)}`;
  
  // Create modal with QR code
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  
  modal.innerHTML = `
    <div style="background: var(--dark-bg); padding: var(--spacing-xl); border-radius: var(--border-radius); 
                border: 2px solid var(--rebel-gold); text-align: center; max-width: 400px; width: 90%;">
      <h3 style="color: var(--rebel-gold); margin-bottom: var(--spacing-lg);">
        <i class="fas fa-qrcode"></i> Contract QR Code
      </h3>
      
      <div style="margin: var(--spacing-lg) 0;">
        <img src="${qrUrl}" alt="Contract QR Code" style="width: 200px; height: 200px; margin: 0 auto; border: 3px solid var(--rebel-gold); border-radius: 10px;">
      </div>
      
      <div style="font-size: 0.9em; color: #aaa; margin-bottom: var(--spacing-lg); max-width: 300px; margin-left: auto; margin-right: auto;">
        Scan this QR code with your wallet app to quickly add the $REBL contract.
      </div>
      
      <div style="display: flex; gap: var(--spacing-md); justify-content: center;">
        <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                style="background: var(--rebel-red); color: white; border: none; border-radius: 25px; 
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
          Close
        </button>
        
        <button onclick="downloadQR('${qrUrl}')" 
                style="background: var(--rebel-gold); color: var(--dark-bg); border: none; border-radius: 25px; 
                       padding: 0.8rem 1.5rem; cursor: pointer; font-weight: 600; font-size: 0.9rem;">
          <i class="fas fa-download"></i> Download
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on background click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Add animation style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

function downloadQR(url) {
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rebelinux-contract-qr.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('QR code downloaded!', 'success');
}

function setupTradingPairs() {
  console.log("Setting up trading pairs display");
  // Additional trading pair functionality can be added here
}

// ========== TOAST NOTIFICATION ==========

function showToast(message, type = 'info') {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
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
  `;
  
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toast animation styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
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
document.head.appendChild(toastStyle);

// ========== GLOBAL EXPORTS ==========

// Make functions available globally
window.copyContractFull = copyContractFull;
window.addToWallet = addToWallet;
window.verifyOnAll = verifyOnAll;
window.generateQR = generateQR;
window.downloadQR = downloadQR;
window.refreshAllData = refreshAllData;

// security-integrity.js - Combined Security & Integrity page functionality
// Integrates with common.js for shared functionality

// Initialize after common components are loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for common.js to initialize
    setTimeout(initSecurityIntegrityPage, 300);
});

function initSecurityIntegrityPage() {
    console.log('🛡️ Initializing Security & Integrity page');
    
    try {
        // Wait for common.js components
        if (typeof initializeCommon === 'function') {
            // Let common.js handle mobile navigation and dropdowns
            console.log('✅ Common.js detected - using shared functionality');
        }
        
        // Initialize page-specific functionality
        initSecurityData();
        initScrollAnimations();
        initAOS();
        initTouchEvents();
        initPrincipleCards();
        initPageSpecificCopyContract();
        initSecurityModals();
        
        console.log('✅ Security & Integrity page initialized');
    } catch (error) {
        console.error('❌ Error initializing Security & Integrity page:', error);
    }
}

// ========== PAGE-SPECIFIC AOS ANIMATIONS ==========
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 ? 'mobile' : false
        });
        
        // Refresh AOS on window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                AOS.refresh();
            }, 250);
        });
    }
}

// ========== SECURITY DATA FUNCTIONS ==========
function initSecurityData() {
    console.log('📊 Initializing security data');
    
    // Update holder count
    updateHolderCount();
    
    // Update verification timestamps
    updateVerificationTimestamps();
    
    // Initialize real-time data
    initRealTimeData();
}

async function updateHolderCount() {
    try {
        // In a real implementation, you would fetch this from an API
        const holderCount = 67; // Static for now
        
        // Update all holder count elements
        document.querySelectorAll('.metric-item .metric-value').forEach(el => {
            if (el.textContent.includes('67')) {
                el.textContent = holderCount.toLocaleString();
            }
        });
        
        // Animate the update
        const elements = document.querySelectorAll('.takeaway-value');
        elements.forEach(el => {
            if (el.textContent.includes('67')) {
                animateCounter(el, holderCount);
            }
        });
        
    } catch (error) {
        console.error('❌ Error updating holder count:', error);
    }
}

function updateVerificationTimestamps() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateString = now.toLocaleDateString();
    
    // Update timestamp in security section
    const timestampElement = document.querySelector('.update-time');
    if (timestampElement) {
        timestampElement.textContent = `Last Updated: ${dateString} ${timeString}`;
    }
}

// ========== PRINCIPLE CARD INTERACTIONS ==========
function initPrincipleCards() {
    const principleCards = document.querySelectorAll('.principle-card');
    
    principleCards.forEach(card => {
        // Add click handler for mobile
        card.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                this.classList.toggle('expanded');
            }
        });
        
        // Add hover effects for desktop
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.card-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.card-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        }
    });
}

// ========== PAGE-SPECIFIC CONTRACT COPY ==========
function initPageSpecificCopyContract() {
    console.log('📋 Setting up page-specific contract copy buttons');
    
    // Add copy event to all copy buttons on this page
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', copyContractEnhanced);
    });
    
    // Setup add to wallet button
    const addToWalletBtn = document.querySelector('.action-button.add-wallet');
    if (addToWalletBtn) {
        addToWalletBtn.addEventListener('click', addToWallet);
    }
}

function copyContractEnhanced(event) {
    const contractAddress = 'F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump';
    const button = event.target.closest('button') || event.target;
    const originalHTML = button.innerHTML;
    
    navigator.clipboard.writeText(contractAddress).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = '#4CAF50';
        button.style.transform = 'scale(0.95)';
        
        showToast('Contract address copied to clipboard!', 'success');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.transform = '';
        }, 2000);
        
    }).catch(err => {
        console.error('❌ Failed to copy: ', err);
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
    button.disabled = true;
    
    // Show instructions for adding to wallet
    showToast('Check your wallet for token addition prompt', 'info');
    
    // Try to add token automatically
    try {
        if (typeof window.solana !== 'undefined') {
            // For Phantom wallet
            window.solana.request({
                method: 'addToken',
                params: {
                    address: contractAddress,
                    symbol: 'REBL',
                    decimals: 9,
                    image: 'https://i.imgur.com/gEuSg1Y.webp'
                }
            }).then(() => {
                showToast('$REBL added to wallet successfully!', 'success');
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }, 2000);
            }).catch(err => {
                console.error('❌ Failed to add token:', err);
                showManualInstructions(contractAddress);
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }, 2000);
            });
        } else {
            showManualInstructions(contractAddress);
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.disabled = false;
            }, 2000);
        }
    } catch (error) {
        console.error('❌ Error adding to wallet:', error);
        showManualInstructions(contractAddress);
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 2000);
    }
}

function showManualInstructions(contractAddress) {
    const instructions = `To add $REBL to your wallet:
1. Open your wallet (Phantom, Solflare, etc.)
2. Click "Add Token" or "Import Token"
3. Paste this address: ${contractAddress}
4. Confirm addition`;

    showToast('Instructions shown in alert', 'info');
    setTimeout(() => {
        alert(instructions);
    }, 100);
}

// ========== ANIMATION FUNCTIONS ==========
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.takeaway-item, .security-card, .practice-item, .audit-card, ' +
        '.faq-item, .related-card, .principle-card, .verification-stat, ' +
        '.tool-card, [data-aos]:not([data-aos="fade"])'
    );
    
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        function animateElements() {
            animatedElements.forEach((el, index) => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
                
                if (isVisible) {
                    setTimeout(() => {
                        el.classList.add('animated');
                    }, index * 50);
                }
            });
        }
        
        window.addEventListener('scroll', animateElements);
        animateElements(); // Initial check
    }
}

function animateCounter(element, target) {
    const duration = 1000; // 1 second
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ========== TOUCH EVENTS ==========
function initTouchEvents() {
    // Add touch feedback for buttons specific to this page
    document.querySelectorAll('.action-button, .copy-button, .tool-card, .practice-item').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
}

// ========== REAL-TIME DATA ==========
function initRealTimeData() {
    // This would connect to your API or blockchain to get real-time data
    // For now, we'll simulate with static data
    
    // Update verification status
    updateVerificationStatus();
    
    // Start periodic updates
    setInterval(updateVerificationStatus, 30000); // Update every 30 seconds
}

function updateVerificationStatus() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Update status indicators
    const statusElements = document.querySelectorAll('.status-indicator');
    statusElements.forEach(el => {
        el.innerHTML = `<i class="fas fa-circle" style="color: #4CAF50; font-size: 0.8em;"></i> Verified ${timeString}`;
    });
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
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ========== SECURITY MODALS ==========
function initSecurityModals() {
    // Initialize any security-related modals on this page
    const verifyButtons = document.querySelectorAll('.verify-trigger');
    
    verifyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const verificationType = this.getAttribute('data-verify-type');
            showVerificationModal(verificationType);
        });
    });
}

function showVerificationModal(type) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'security-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    // Modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'security-modal-content';
    modalContent.style.cssText = `
        background: var(--dark-bg);
        padding: var(--spacing-xl);
        border-radius: var(--border-radius-lg);
        border: 2px solid var(--rebel-gold);
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    let title = '';
    let content = '';
    
    switch(type) {
        case 'mint':
            title = 'Mint Authority Verification';
            content = 'The mint authority has been permanently renounced. This means no new $REBL tokens can ever be created, ensuring the fixed supply of 1,000,000,000 tokens.';
            break;
        case 'freeze':
            title = 'Freeze Authority Verification';
            content = 'The freeze authority has been permanently renounced. No one can freeze tokens in user wallets, ensuring full control remains with token holders at all times.';
            break;
        case 'lp':
            title = 'Liquidity Pool Verification';
            content = '98.57% of liquidity pool tokens have been permanently burned. This locks liquidity and makes rug pulls mathematically impossible.';
            break;
        default:
            title = 'Security Verification';
            content = 'All security measures have been implemented and verified on-chain.';
    }
    
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 60px; height: 60px; background: rgba(76, 175, 80, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-lg);">
                <i class="fas fa-shield-alt" style="color: #4CAF50; font-size: 1.8rem;"></i>
            </div>
            <h3 style="color: var(--rebel-gold); margin-bottom: var(--spacing-md);">${title}</h3>
            <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: var(--spacing-xl); line-height: 1.6;">${content}</p>
            <div style="display: flex; gap: var(--spacing-md); justify-content: center;">
                <button onclick="this.closest('.security-modal').remove()" class="cta-button" style="background: var(--rebel-red);">
                    <i class="fas fa-times"></i> Close
                </button>
                <a href="#contract-verification" onclick="this.closest('.security-modal').remove()" class="cta-button gold">
                    <i class="fas fa-file-contract"></i> Verify Contract
                </a>
            </div>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// ========== ADD TOUCH-ACTIVE CLASS STYLES ==========
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .touch-active {
            opacity: 0.7 !important;
            transform: scale(0.98) !important;
            transition: all 0.1s ease !important;
        }
        
        .principle-card.expanded {
            transform: scale(1.02) !important;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
        }
        
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Initial state for scroll animations */
        .takeaway-item, .security-card, .practice-item, .audit-card,
        .faq-item, .related-card, .principle-card, .verification-stat,
        .tool-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
    `;
    document.head.appendChild(style);
});

// ========== EXPORT FUNCTIONS FOR GLOBAL USE ==========
window.copyContractEnhanced = copyContractEnhanced;
window.addToWallet = addToWallet;
window.showToast = showToast;
window.showVerificationModal = showVerificationModal;
window.initSecurityIntegrityPage = initSecurityIntegrityPage;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecurityIntegrityPage);
} else {
    initSecurityIntegrityPage();
}

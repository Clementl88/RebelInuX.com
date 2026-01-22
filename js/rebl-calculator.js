// rebl-calculator-pro.js -- Professional Calculator JavaScript v4.0
// Enhanced with professional UI features, animations, and advanced functionality

// ========== GLOBAL STATE & CONSTANTS ==========
const CS = 499242047.00; // Circulating Supply
const WERP = 3200000.00; // Weekly Epoch Reward Pool
const K = 0.07; // Age bonus per epoch
const MAX_AGE = 20; // Maximum age for bonus
const MAX_WS = CS * 2.4; // Maximum ∑WS = CS * 2.4

let calculatorState = {
    participantType: 'detailed',
    totalUserTokens: 0,
    totalUserWS: 0,
    otherTokens: 0,
    otherWS: 0,
    otherAvgAge: 0,
    otherAvgBonus: 1.0,
    currentParticipatingTokens: 0,
    currentTotalWS: 0,
    isCalculating: false,
    scenarios: [],
    currentScenario: null,
    alerts: []
};

let rewardChart = null;
let isInitialized = false;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Professional REBL Calculator v4.0');
    
    // Initialize with smooth loading animation
    initializeCalculator();
    
    // Setup performance monitoring
    setupPerformanceMonitor();
    
    // Initialize tooltips
    setupTooltips();
    
    // Load saved scenarios if any
    loadSavedScenarios();
    
    // Setup auto-save
    setupAutoSave();
});

function initializeCalculator() {
    // Show loading animation
    showLoadingOverlay();
    
    // Initialize with one empty row for user and other participants
    setTimeout(() => {
        addTokenBatch();
        addOtherParticipantBatch();
        
        // Initialize displays with animations
        animateIn('.pro-card', 100);
        updateAllDisplays();
        
        // Hide loading overlay
        setTimeout(() => {
            hideLoadingOverlay();
            showNotification('Professional Calculator Ready', 'Welcome to the enhanced REBL Calculator! Add your tokens to begin.', 'success');
            
            // Mark as initialized
            isInitialized = true;
            
            // Start performance monitoring
            monitorPerformance();
        }, 800);
    }, 300);
}

// ========== PROFESSIONAL UI FUNCTIONS ==========
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.classList.add('show'), 10);
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 500);
    }
}

function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const notification = document.createElement('div');
    notification.className = 'pro-notification';
    notification.innerHTML = `
        <div class="pro-notification-icon" style="color: ${getNotificationColor(type)}">
            <i class="fas fa-${iconMap[type]}"></i>
        </div>
        <div class="pro-notification-content">
            <div class="pro-notification-title">${title}</div>
            <div class="pro-notification-message">${message}</div>
        </div>
        <button class="pro-notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#FF3366',
        warning: '#FFC107',
        info: '#00AAFF'
    };
    return colors[type] || '#00AAFF';
}

function animateIn(selector, delay = 0) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay + (index * 100));
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        // Update active tab
        document.querySelectorAll('.pro-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');
        
        // Smooth scroll
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add highlight animation
        element.classList.add('highlight');
        setTimeout(() => element.classList.remove('highlight'), 1000);
    }
}

// ========== ENHANCED TOKEN MANAGEMENT ==========
function addTokenBatch(amount = '', age = '', animate = true) {
    const table = document.querySelector('#token-batches-table tbody');
    if (!table) return;
    
    const rowId = 'batch-' + Date.now();
    const row = document.createElement('tr');
    row.id = rowId;
    row.innerHTML = `
        <td>
            <div class="pro-input-group">
                <input type="number" class="pro-input batch-amount" value="${amount}" 
                       placeholder="Enter amount" min="0" step="1000"
                       oninput="updateRowCalculations('${rowId}')">
                <span class="pro-input-suffix">$rebelinux</span>
            </div>
        </td>
        <td>
            <div class="pro-input-group">
                <input type="number" class="pro-input batch-age" value="${age}" 
                       placeholder="Age" min="0" max="20" step="1"
                       oninput="updateRowCalculations('${rowId}')">
                <span class="pro-input-suffix">epochs</span>
            </div>
        </td>
        <td class="batch-factor">
            <span class="pro-badge">1.00x</span>
        </td>
        <td class="batch-ws">
            <span class="pro-value">0</span>
        </td>
        <td>
            <div class="pro-action-buttons">
                <button class="pro-action-btn" onclick="duplicateBatch('${rowId}')" title="Duplicate">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="pro-action-btn danger" onclick="removeTokenBatch('${rowId}')" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    table.appendChild(row);
    
    if (animate) {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, 10);
    }
    
    if (amount || age) {
        setTimeout(() => updateRowCalculations(rowId), 50);
    }
    
    updateUserBatchCount();
    showNotification('Batch Added', 'New token batch added to your portfolio', 'success');
}

function updateRowCalculations(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;
    
    const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
    const age = parseFloat(row.querySelector('.batch-age').value) || 0;
    
    // Validate and format input
    if (amount < 0) row.querySelector('.batch-amount').value = 0;
    if (age < 0) row.querySelector('.batch-age').value = 0;
    if (age > 20) row.querySelector('.batch-age').value = 20;
    
    // Format large numbers with commas
    if (amount >= 1000) {
        row.querySelector('.batch-amount').value = formatNumberInput(amount);
    }
    
    // Calculate weight factor
    const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
    const weightedShare = amount * weightFactor;
    
    // Update display
    const factorCell = row.querySelector('.batch-factor');
    const wsCell = row.querySelector('.batch-ws');
    
    if (factorCell) {
        const badge = factorCell.querySelector('.pro-badge');
        if (badge) {
            badge.textContent = weightFactor.toFixed(2) + 'x';
            badge.style.background = weightFactor > 1.5 ? 
                'linear-gradient(135deg, #4CAF50, #8BC34A)' : 
                weightFactor > 1 ? 
                'linear-gradient(135deg, #FFC107, #FF9800)' : 
                'rgba(255, 255, 255, 0.1)';
        }
    }
    
    if (wsCell) {
        const valueSpan = wsCell.querySelector('.pro-value');
        if (valueSpan) {
            valueSpan.textContent = formatNumber(weightedShare, true);
            valueSpan.style.color = weightedShare > 1000000 ? 'var(--rebel-gold)' : '#ffffff';
        }
    }
    
    // Animate update
    row.classList.add('updating');
    setTimeout(() => row.classList.remove('updating'), 300);
    
    // Update totals
    updateUserTotals();
    
    // Auto-save scenario
    autoSaveScenario();
}

function removeTokenBatch(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;
    
    // Animate removal
    row.style.transform = 'translateX(100%)';
    row.style.opacity = '0';
    
    setTimeout(() => {
        row.remove();
        updateUserTotals();
        updateUserBatchCount();
        
        // Add empty row if all are removed
        const table = document.querySelector('#token-batches-table tbody');
        if (table && table.children.length === 0) {
            addTokenBatch();
        }
        
        showNotification('Batch Removed', 'Token batch removed from portfolio', 'info');
    }, 300);
}

function duplicateBatch(rowId) {
    const row = document.getElementById(rowId);
    if (!row) return;
    
    const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
    const age = parseFloat(row.querySelector('.batch-age').value) || 0;
    
    addTokenBatch(amount, age);
    showNotification('Batch Duplicated', 'Token batch duplicated successfully', 'success');
}

function updateUserBatchCount() {
    const rows = document.querySelectorAll('#token-batches-table tbody tr');
    const count = rows.length;
    const countElement = document.getElementById('userBatchCount');
    if (countElement) {
        countElement.textContent = count + ' batch' + (count !== 1 ? 'es' : '');
    }
}

// ========== ENHANCED CALCULATION FUNCTIONS ==========
function updateUserTotals() {
    const rows = document.querySelectorAll('#token-batches-table tbody tr');
    let totalTokens = 0;
    let totalWS = 0;
    let totalWeightedAge = 0;
    let batchCount = 0;
    
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
        const age = parseFloat(row.querySelector('.batch-age').value) || 0;
        
        if (amount > 0) {
            batchCount++;
            const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
            const weightedShare = amount * weightFactor;
            
            totalTokens += amount;
            totalWS += weightedShare;
            totalWeightedAge += amount * age;
        }
    });
    
    calculatorState.totalUserTokens = totalTokens;
    calculatorState.totalUserWS = totalWS;
    
    // Update displays with animations
    animateValue('userTotalTokensDisplay', totalTokens);
    animateValue('userTotalWSDisplay', totalWS);
    
    const avgAge = totalTokens > 0 ? (totalWeightedAge / totalTokens) : 0;
    const avgBonus = totalTokens > 0 ? (totalWS / totalTokens) : 1.0;
    
    animateValue('userAvgAgeDisplay', avgAge, 1);
    animateValue('userAvgBonusDisplay', avgBonus, 2, 'x');
    
    // Update share percentages
    updateSharePercentages();
    
    // Trigger gamma calculation
    updateGammaScale();
}

function animateValue(elementId, value, decimals = 0, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0;
    const targetValue = value;
    
    if (Math.abs(currentValue - targetValue) < 0.001) return;
    
    let start = null;
    const duration = 500;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        const eased = easeOutCubic(progress);
        const current = currentValue + (targetValue - currentValue) * eased;
        
        element.textContent = formatNumber(current, decimals) + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function updateSharePercentages() {
    const totalParticipating = calculatorState.currentParticipatingTokens;
    const totalWS = calculatorState.currentTotalWS;
    
    const tokenShare = totalParticipating > 0 ? 
        (calculatorState.totalUserTokens / totalParticipating * 100) : 0;
    const wsShare = totalWS > 0 ? 
        (calculatorState.totalUserWS / totalWS * 100) : 0;
    
    animateValue('tokenSharePercentage', tokenShare, 1, '%');
    animateValue('wsSharePercentage', wsShare, 1, '%');
}

// ========== ENHANCED GAMMA CALCULATION ==========
function calculateGammaScale(P, totalWS) {
    // γ = MAX(0.4, MIN(1, P/(0.5 × CS), CS×1.5/∑WS))
    
    const participationTerm = P / (0.5 * CS);
    const inflationCap = (CS * 1.5) / totalWS;
    const minTerm = Math.min(1, participationTerm, inflationCap);
    const gamma = Math.max(0.4, minTerm);
    
    return {
        gamma: gamma,
        participationTerm: participationTerm,
        inflationCap: inflationCap,
        minTerm: minTerm
    };
}

function updateGammaScale() {
    const totalTokens = calculatorState.totalUserTokens + calculatorState.otherTokens;
    const totalWS = calculatorState.totalUserWS + calculatorState.otherWS;
    
    calculatorState.currentParticipatingTokens = totalTokens;
    calculatorState.currentTotalWS = totalWS;
    
    // Update total displays
    animateValue('totalTokensDisplay', totalTokens);
    animateValue('totalWSDisplay', totalWS);
    
    // Calculate gamma
    const gammaData = calculateGammaScale(totalTokens, totalWS);
    const gamma = gammaData.gamma;
    
    // Update gamma displays with animations
    animateValue('gammaValueDisplay', gamma, 2, 'γ = ');
    animateValue('participationTerm', gammaData.participationTerm, 2);
    animateValue('inflationCap', gammaData.inflationCap, 2);
    animateValue('effectiveGamma', gamma, 2);
    
    // Update progress bar
    const progress = 40 + (gamma - 0.4) * (100 / 0.6);
    const progressBar = document.getElementById('gammaProgress');
    if (progressBar) {
        progressBar.style.width = Math.min(100, Math.max(40, progress)) + '%';
        
        // Update color based on gamma value
        if (gamma >= 1) {
            progressBar.style.background = 'linear-gradient(135deg, #00ff00, #4CAF50)';
        } else if (gamma >= 0.8) {
            progressBar.style.background = 'linear-gradient(135deg, #ffff00, #FFC107)';
        } else if (gamma >= 0.6) {
            progressBar.style.background = 'linear-gradient(135deg, #ffcc00, #FF9800)';
        } else if (gamma >= 0.4) {
            progressBar.style.background = 'linear-gradient(135deg, #ff9900, #FF5722)';
        } else {
            progressBar.style.background = 'linear-gradient(135deg, #ff3366, #FF6B9D)';
        }
    }
    
    // Update participation rate
    const participationRate = (totalTokens / CS * 100);
    animateValue('participationRate', participationRate, 1, '%');
    
    // Check alerts
    checkAlerts(gamma);
}

// ========== PROFESSIONAL CALCULATE REWARDS ==========
async function calculateRewards() {
    if (calculatorState.isCalculating) return;
    calculatorState.isCalculating = true;
    
    const button = document.getElementById('calculateButton');
    const originalHTML = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CALCULATING...';
    button.disabled = true;
    
    // Show calculating animation
    const resultsContainer = document.getElementById('reward-result');
    resultsContainer.innerHTML = `
        <div class="pro-loading">
            <div class="pro-loader"></div>
            <div class="pro-loading-text" style="margin-top: 20px;">
                <div>Calculating sustainable rewards...</div>
                <div class="pro-loading-subtext">Analyzing participation and gamma scale</div>
            </div>
        </div>
    `;
    
    // Simulate calculation delay for better UX
    await sleep(800);
    
    try {
        // Perform calculations
        const rows = document.querySelectorAll('#token-batches-table tbody tr');
        let userWS = 0;
        let totalAmount = 0;
        const batchData = [];
        
        rows.forEach(row => {
            const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
            const age = parseFloat(row.querySelector('.batch-age').value) || 0;
            
            const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
            const weightedShare = amount * weightFactor;
            
            userWS += weightedShare;
            totalAmount += amount;
            
            if (amount > 0) {
                batchData.push({
                    amount: amount,
                    age: age,
                    ws: weightedShare,
                    factor: weightFactor
                });
            }
        });
        
        const participatingTokens = calculatorState.currentParticipatingTokens;
        const totalWS = calculatorState.currentTotalWS;
        
        if (userWS <= 0 || batchData.length === 0) {
            throw new Error('Please add valid token batches');
        }
        
        const gammaData = calculateGammaScale(participatingTokens, totalWS);
        const gamma = gammaData.gamma;
        const userShare = totalWS > 0 ? (userWS / totalWS) : 0;
        const userReward = userShare * WERP * gamma;
        
        // Calculate additional metrics
        const effectivePool = WERP * gamma;
        const poolPercentage = (userShare * 100).toFixed(4);
        const returnPercentage = ((userReward / totalAmount) * 100).toFixed(4);
        const monthlyReward = userReward * 4.33;
        const annualReward = userReward * 52;
        
        // Create professional results display
        const resultsHTML = createProfessionalResults({
            userWS,
            totalAmount,
            participatingTokens,
            totalWS,
            gamma,
            userShare,
            userReward,
            effectivePool,
            poolPercentage,
            returnPercentage,
            monthlyReward,
            annualReward,
            batchData
        });
        
        // Update results with animation
        resultsContainer.innerHTML = resultsHTML;
        animateIn('.pro-result-card', 100);
        
        // Update chart
        updateProfessionalChart(batchData, userWS);
        
        // Show success notification
        showNotification('Calculation Complete', `Your weekly reward: ${formatNumber(userReward, true)} $REBL`, 'success');
        
        // Save to history
        saveToHistory({
            timestamp: new Date().toISOString(),
            userReward: userReward,
            gamma: gamma,
            participatingTokens: participatingTokens,
            userTokens: totalAmount
        });
        
    } catch (error) {
        // Show error state
        resultsContainer.innerHTML = `
            <div class="pro-error-state">
                <div class="pro-error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="pro-error-title">Calculation Error</div>
                <div class="pro-error-message">${error.message}</div>
                <button class="pro-btn" onclick="calculateRewards()" style="margin-top: 20px;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
        
        showNotification('Calculation Failed', error.message, 'error');
    } finally {
        // Restore button
        button.innerHTML = originalHTML;
        button.disabled = false;
        calculatorState.isCalculating = false;
    }
}

function createProfessionalResults(data) {
    const {
        userWS,
        totalAmount,
        participatingTokens,
        totalWS,
        gamma,
        userShare,
        userReward,
        effectivePool,
        poolPercentage,
        returnPercentage,
        monthlyReward,
        annualReward,
        batchData
    } = data;
    
    // Calculate ROI metrics
    const weeklyROI = returnPercentage;
    const monthlyROI = (monthlyReward / totalAmount * 100).toFixed(4);
    const annualROI = (annualReward / totalAmount * 100).toFixed(4);
    
    // Calculate other participants info
    const otherTokens = participatingTokens - calculatorState.totalUserTokens;
    const otherWS = totalWS - userWS;
    const otherAvgBonus = otherTokens > 0 ? (otherWS / otherTokens) : 0;
    const otherAvgAge = otherAvgBonus >= 1 ? ((otherAvgBonus - 1) / K) : 0;
    
    return `
        <div class="pro-results-grid">
            <!-- Main Reward Card -->
            <div class="pro-result-card highlight">
                <div class="pro-result-header">
                    <div class="pro-result-title">
                        <i class="fas fa-trophy"></i> Weekly Reward
                    </div>
                    <div class="pro-result-badge">
                        ${getGammaBadge(gamma)}
                    </div>
                </div>
                <div class="pro-result-main">
                    <div class="pro-reward-amount">${formatNumber(userReward, true)}</div>
                    <div class="pro-reward-unit">$REBL</div>
                </div>
                <div class="pro-result-meta">
                    <div class="pro-meta-item">
                        <span class="pro-meta-label">Gamma Scale:</span>
                        <span class="pro-meta-value" style="color: ${getGammaColor(gamma)}">${gamma.toFixed(2)}</span>
                    </div>
                    <div class="pro-meta-item">
                        <span class="pro-meta-label">Your Share:</span>
                        <span class="pro-meta-value">${poolPercentage}%</span>
                    </div>
                    <div class="pro-meta-item">
                        <span class="pro-meta-label">Weekly ROI:</span>
                        <span class="pro-meta-value">${weeklyROI}%</span>
                    </div>
                </div>
            </div>
            
            <!-- Projections Card -->
            <div class="pro-result-card">
                <div class="pro-result-header">
                    <div class="pro-result-title">
                        <i class="fas fa-chart-line"></i> Projections
                    </div>
                </div>
                <div class="pro-projection-grid">
                    <div class="pro-projection">
                        <div class="pro-projection-label">Monthly</div>
                        <div class="pro-projection-value">${formatNumber(monthlyReward, true)}</div>
                        <div class="pro-projection-roi">${monthlyROI}% ROI</div>
                    </div>
                    <div class="pro-projection">
                        <div class="pro-projection-label">Annual</div>
                        <div class="pro-projection-value">${formatNumber(annualReward, true)}</div>
                        <div class="pro-projection-roi">${annualROI}% ROI</div>
                    </div>
                </div>
                <div class="pro-result-hint">*Projections assume consistent participation</div>
            </div>
            
            <!-- Participation Metrics Card -->
            <div class="pro-result-card">
                <div class="pro-result-header">
                    <div class="pro-result-title">
                        <i class="fas fa-chart-network"></i> Participation Metrics
                    </div>
                </div>
                <div class="pro-metrics-grid">
                    <div class="pro-metric-item">
                        <div class="pro-metric-label">Effective Pool</div>
                        <div class="pro-metric-value">${formatNumber(effectivePool)}</div>
                        <div class="pro-metric-hint">${(gamma * 100).toFixed(0)}% of maximum</div>
                    </div>
                    <div class="pro-metric-item">
                        <div class="pro-metric-label">Total Participants</div>
                        <div class="pro-metric-value">${formatNumber(participatingTokens)}</div>
                        <div class="pro-metric-hint">${(participatingTokens / CS * 100).toFixed(1)}% of CS</div>
                    </div>
                </div>
            </div>
            
            <!-- Other Participants Card -->
            <div class="pro-result-card">
                <div class="pro-result-header">
                    <div class="pro-result-title">
                        <i class="fas fa-users"></i> Other Participants
                    </div>
                </div>
                <div class="pro-others-grid">
                    <div class="pro-other-item">
                        <div class="pro-other-label">Total Tokens</div>
                        <div class="pro-other-value">${formatNumber(otherTokens)}</div>
                    </div>
                    <div class="pro-other-item">
                        <div class="pro-other-label">Avg Age</div>
                        <div class="pro-other-value">${otherAvgAge.toFixed(1)}</div>
                    </div>
                    <div class="pro-other-item">
                        <div class="pro-other-label">Avg Bonus</div>
                        <div class="pro-other-value">${otherAvgBonus.toFixed(2)}x</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Individual Batch Breakdown -->
        <div class="pro-batch-breakdown">
            <div class="pro-breakdown-header">
                <div class="pro-breakdown-title">
                    <i class="fas fa-list-ol"></i> Batch Breakdown
                </div>
                <div class="pro-breakdown-actions">
                    <button class="pro-btn pro-btn-secondary" onclick="toggleBatchDetails()">
                        <i class="fas fa-expand-alt"></i> Expand All
                    </button>
                </div>
            </div>
            <div class="pro-batch-list">
                ${batchData.map((batch, index) => `
                    <div class="pro-batch-item">
                        <div class="pro-batch-header" onclick="toggleBatchItem(${index})">
                            <div class="pro-batch-title">
                                <span class="pro-batch-number">Batch ${index + 1}</span>
                                <span class="pro-batch-amount">${formatNumber(batch.amount)} $rebelinux</span>
                            </div>
                            <div class="pro-batch-reward">
                                ${formatNumber((batch.ws / userWS) * userReward, true)} $REBL
                            </div>
                        </div>
                        <div class="pro-batch-details">
                            <div class="pro-batch-metrics">
                                <div class="pro-batch-metric">
                                    <span class="pro-metric-label">Age:</span>
                                    <span class="pro-metric-value">${batch.age} epochs</span>
                                </div>
                                <div class="pro-batch-metric">
                                    <span class="pro-metric-label">Bonus:</span>
                                    <span class="pro-metric-value">${batch.factor.toFixed(2)}x</span>
                                </div>
                                <div class="pro-batch-metric">
                                    <span class="pro-metric-label">WS:</span>
                                    <span class="pro-metric-value">${formatNumber(batch.ws, true)}</span>
                                </div>
                                <div class="pro-batch-metric">
                                    <span class="pro-metric-label">Share:</span>
                                    <span class="pro-metric-value">${((batch.ws / userWS) * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function getGammaBadge(gamma) {
    if (gamma >= 1) return '<span class="pro-badge" style="background: linear-gradient(135deg, #4CAF50, #8BC34A)">Maximum</span>';
    if (gamma >= 0.8) return '<span class="pro-badge" style="background: linear-gradient(135deg, #FFC107, #FF9800)">High</span>';
    if (gamma >= 0.6) return '<span class="pro-badge" style="background: linear-gradient(135deg, #FF9800, #FF5722)">Medium</span>';
    return '<span class="pro-badge" style="background: linear-gradient(135deg, #FF3366, #FF6B9D)">Floor</span>';
}

// ========== PROFESSIONAL CHART FUNCTIONS ==========
function updateProfessionalChart(batchData, totalUserWS) {
    const ctx = document.getElementById('rewardChart');
    const placeholder = document.getElementById('chartPlaceholder');
    
    if (!ctx || !placeholder) return;
    
    // Hide placeholder
    placeholder.style.display = 'none';
    ctx.style.display = 'block';
    
    // Destroy existing chart
    if (rewardChart) {
        rewardChart.destroy();
    }
    
    // Prepare data
    const labels = batchData.map((batch, index) => `Batch ${index + 1}`);
    const data = batchData.map(batch => batch.ws);
    const percentages = batchData.map(batch => ((batch.ws / totalUserWS) * 100).toFixed(1));
    
    // Professional color palette
    const backgroundColors = [
        'rgba(255, 51, 102, 0.8)',
        'rgba(255, 204, 0, 0.8)',
        'rgba(0, 170, 255, 0.8)',
        'rgba(156, 39, 176, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(33, 150, 243, 0.8)',
        'rgba(233, 30, 99, 0.8)'
    ];
    
    const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));
    
    // Create gradient for background
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(212, 167, 106, 0.1)');
    gradient.addColorStop(1, 'rgba(212, 167, 106, 0)');
    
    rewardChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
                borderAlign: 'inner',
                hoverOffset: 15,
                hoverBackgroundColor: backgroundColors.map(color => color.replace('0.8', '1'))
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            radius: '90%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        padding: 20,
                        font: {
                            family: 'Montserrat',
                            size: 12,
                            weight: '500'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                const percentage = ((value / totalUserWS) * 100).toFixed(1);
                                return {
                                    text: `${label} - ${percentage}%`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].borderColor[i],
                                    lineWidth: 2,
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(16, 18, 27, 0.95)',
                    titleColor: 'var(--rebel-gold)',
                    bodyColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(212, 167, 106, 0.3)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const batch = batchData[context.dataIndex];
                            return [
                                `Amount: ${formatNumber(batch.amount)} $rebelinux`,
                                `Age: ${batch.age} epochs`,
                                `Bonus: ${batch.factor.toFixed(2)}x`,
                                `WS: ${formatNumber(batch.ws, true)}`,
                                `Share: ${((batch.ws / totalUserWS) * 100).toFixed(1)}%`
                            ];
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000,
                easing: 'easeOutQuart'
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function(chart) {
                if (chart.config.options.elements.center) {
                    const ctx = chart.ctx;
                    const centerConfig = chart.config.options.elements.center;
                    const fontStyle = centerConfig.fontStyle || 'Montserrat';
                    const txt = centerConfig.text;
                    const color = centerConfig.color || '#000';
                    const sidePadding = centerConfig.sidePadding || 20;
                    
                    ctx.save();
                    ctx.font = `700 24px ${fontStyle}`;
                    ctx.fillStyle = color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                    
                    ctx.fillText(txt, centerX, centerY);
                    ctx.restore();
                }
            }
        }],
        options: {
            elements: {
                center: {
                    text: formatNumber(totalUserWS, true),
                    color: 'var(--rebel-gold)',
                    fontStyle: 'Montserrat'
                }
            }
        }
    });
}

// ========== ADVANCED FEATURES ==========
function saveScenario() {
    const scenario = {
        id: Date.now(),
        name: `Scenario ${calculatorState.scenarios.length + 1}`,
        timestamp: new Date().toISOString(),
        userTokens: calculatorState.totalUserTokens,
        userWS: calculatorState.totalUserWS,
        otherTokens: calculatorState.otherTokens,
        otherWS: calculatorState.otherWS,
        gamma: calculateGammaScale(
            calculatorState.currentParticipatingTokens,
            calculatorState.currentTotalWS
        ).gamma,
        reward: calculateCurrentReward()
    };
    
    calculatorState.scenarios.push(scenario);
    calculatorState.currentScenario = scenario.id;
    
    // Save to localStorage
    localStorage.setItem('rebl_scenarios', JSON.stringify(calculatorState.scenarios));
    
    showNotification('Scenario Saved', `${scenario.name} saved successfully`, 'success');
    
    // Update scenario list UI
    updateScenarioList();
}

function loadSavedScenarios() {
    try {
        const saved = localStorage.getItem('rebl_scenarios');
        if (saved) {
            calculatorState.scenarios = JSON.parse(saved);
            updateScenarioList();
            console.log(`Loaded ${calculatorState.scenarios.length} saved scenarios`);
        }
    } catch (error) {
        console.error('Error loading scenarios:', error);
    }
}

function updateScenarioList() {
    const container = document.getElementById('scenariosList');
    if (!container) return;
    
    container.innerHTML = calculatorState.scenarios.map(scenario => `
        <div class="pro-scenario-item" onclick="loadScenario(${scenario.id})">
            <div class="pro-scenario-name">${scenario.name}</div>
            <div class="pro-scenario-details">
                <div class="pro-scenario-detail">
                    <span class="pro-detail-label">Tokens:</span>
                    <span class="pro-detail-value">${formatNumber(scenario.userTokens)}</span>
                </div>
                <div class="pro-scenario-detail">
                    <span class="pro-detail-label">Reward:</span>
                    <span class="pro-detail-value">${formatNumber(scenario.reward, true)}</span>
                </div>
                <div class="pro-scenario-detail">
                    <span class="pro-detail-label">Gamma:</span>
                    <span class="pro-detail-value">${scenario.gamma.toFixed(2)}</span>
                </div>
            </div>
            <div class="pro-scenario-actions">
                <button class="pro-action-btn" onclick="event.stopPropagation(); deleteScenario(${scenario.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function setupAutoSave() {
    let saveTimeout;
    
    const observer = new MutationObserver(() => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            if (isInitialized) {
                autoSaveScenario();
            }
        }, 2000);
    });
    
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true
    });
}

function autoSaveScenario() {
    if (calculatorState.scenarios.length > 0 && calculatorState.currentScenario) {
        const scenario = calculatorState.scenarios.find(s => s.id === calculatorState.currentScenario);
        if (scenario) {
            scenario.userTokens = calculatorState.totalUserTokens;
            scenario.userWS = calculatorState.totalUserWS;
            scenario.otherTokens = calculatorState.otherTokens;
            scenario.otherWS = calculatorState.otherWS;
            scenario.gamma = calculateGammaScale(
                calculatorState.currentParticipatingTokens,
                calculatorState.currentTotalWS
            ).gamma;
            scenario.reward = calculateCurrentReward();
            
            localStorage.setItem('rebl_scenarios', JSON.stringify(calculatorState.scenarios));
        }
    }
}

function calculateCurrentReward() {
    const totalWS = calculatorState.currentTotalWS;
    const userWS = calculatorState.totalUserWS;
    const gamma = calculateGammaScale(
        calculatorState.currentParticipatingTokens,
        totalWS
    ).gamma;
    
    const userShare = totalWS > 0 ? (userWS / totalWS) : 0;
    return userShare * WERP * gamma;
}

// ========== UTILITY FUNCTIONS ==========
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatNumber(num, showDecimals = false) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) return '0';
    
    if (num >= 1000000000) {
        const value = num / 1000000000;
        return value.toFixed(value >= 100 ? 0 : (value >= 10 ? 1 : 2)) + 'B';
    } else if (num >= 1000000) {
        const value = num / 1000000;
        return value.toFixed(value >= 100 ? 0 : (value >= 10 ? 1 : 2)) + 'M';
    } else if (num >= 1000) {
        const value = num / 1000;
        return value.toFixed(value >= 10 ? 0 : 1) + 'K';
    }
    
    return showDecimals ? num.toFixed(2) : Math.round(num).toString();
}

function formatNumberInput(num) {
    return num.toLocaleString('en-US', {
        maximumFractionDigits: 0
    });
}

function setupTooltips() {
    // Initialize tooltips using Tippy.js or similar
    // For now, using simple title attributes
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.title = element.dataset.tooltip;
    });
}

function setupPerformanceMonitor() {
    // Monitor calculation performance
    const originalCalculateRewards = calculateRewards;
    calculateRewards = async function() {
        const startTime = performance.now();
        await originalCalculateRewards.apply(this, arguments);
        const endTime = performance.now();
        
        console.log(`Calculation completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        if (endTime - startTime > 1000) {
            showNotification('Performance Notice', 'Large dataset detected. Consider consolidating batches for faster calculations.', 'warning');
        }
    };
}

function monitorPerformance() {
    setInterval(() => {
        const memory = performance.memory;
        if (memory && memory.usedJSHeapSize > 500000000) {
            console.warn('High memory usage detected');
        }
    }, 30000);
}

// ========== HELPER FUNCTIONS FOR HTML ==========
function quickPreset(type) {
    clearTokenBatches();
    
    setTimeout(() => {
        switch(type) {
            case 'starter':
                addTokenBatch('50000', '3');
                addTokenBatch('100000', '8');
                addTokenBatch('25000', '1');
                break;
            case 'investor':
                addTokenBatch('500000', '5');
                addTokenBatch('1000000', '10');
                addTokenBatch('750000', '15');
                break;
            case 'whale':
                addTokenBatch('2000000', '8');
                addTokenBatch('3000000', '12');
                addTokenBatch('5000000', '18');
                break;
        }
        
        showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} Preset Loaded`, 'Adjust parameters as needed', 'success');
    }, 300);
}

function quickAddBatch(amount, age) {
    addTokenBatch(amount, age);
}

function exportResults() {
    // Implement PDF/CSV export
    showNotification('Export Feature', 'Export functionality coming soon!', 'info');
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'My REBL Calculator Results',
            text: `Check out my $REBL reward calculation!`,
            url: window.location.href
        });
    } else {
        showNotification('Share', 'Copy the URL to share your results', 'info');
    }
}

function toggleBatchDetails() {
    const items = document.querySelectorAll('.pro-batch-item');
    const isExpanded = items[0]?.classList.contains('expanded');
    
    items.forEach(item => {
        if (isExpanded) {
            item.classList.remove('expanded');
        } else {
            item.classList.add('expanded');
        }
    });
}

function toggleBatchItem(index) {
    const item = document.querySelectorAll('.pro-batch-item')[index];
    if (item) {
        item.classList.toggle('expanded');
    }
}

// ========== INITIALIZE ALL DISPLAYS ==========
function updateAllDisplays() {
    updateUserBatchCount();
    updateUserTotals();
    updateGammaScale();
    
    // Update other participant displays
    updateOtherParticipantsSummary();
    
    // Update quick stats
    updateQuickStats();
}

function updateQuickStats() {
    // Update quick access statistics
    const stats = {
        totalParticipants: calculatorState.currentParticipatingTokens,
        participationRate: (calculatorState.currentParticipatingTokens / CS * 100).toFixed(1),
        avgGamma: calculateGammaScale(
            calculatorState.currentParticipatingTokens,
            calculatorState.currentTotalWS
        ).gamma.toFixed(2)
    };
    
    // Update any quick stat displays
}

// ========== EXPORT FUNCTIONS ==========
// Make all necessary functions available globally
window.addTokenBatch = addTokenBatch;
window.removeTokenBatch = removeTokenBatch;
window.clearTokenBatches = clearTokenBatches;
window.updateRowCalculations = updateRowCalculations;
window.calculateRewards = calculateRewards;
window.quickPreset = quickPreset;
window.quickAddBatch = quickAddBatch;
window.scrollToSection = scrollToSection;
window.setParticipantType = setParticipantType;
window.updateSummaryOther = updateSummaryOther;
window.updateWhatIfGamma = updateWhatIfGamma;
window.setSimulatorPreset = setSimulatorPreset;
window.exportResults = exportResults;
window.shareResults = shareResults;
window.toggleBatchDetails = toggleBatchDetails;
window.toggleBatchItem = toggleBatchItem;
window.addOtherParticipantBatch = addOtherParticipantBatch;
window.clearOtherParticipantBatches = clearOtherParticipantBatches;
window.addExampleOtherParticipants = addExampleOtherParticipants;
window.saveScenario = saveScenario;
window.analyzeStrategy = analyzeStrategy;
window.setAlert = setAlert;
window.exportToPDF = exportToPDF;

console.log('✅ Professional Calculator functions loaded successfully');

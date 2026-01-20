// rebl-calculator.js -- Complete Enhanced Calculator JavaScript
// Version: 1.2.0 | Enhanced with advanced features and better UX

// ========== GLOBAL VARIABLES & CONSTANTS =============
let rewardChart = null;
const CS = 499242047.00; // Circulating Supply
const WERP = 3200000.00; // Weekly Epoch Reward Pool
const K = 0.07; // Age bonus per epoch
const MAX_AGE = 20; // Maximum age for bonus

// Enhanced state management
let calculatorState = {
    autoUpdateParticipation: true,
    totalUserTokens: 0,
    totalUserWS: 0,
    currentParticipatingTokens: 100000000,
    currentTotalWS: 100000000,
    isCalculating: false,
    lastCalculationTime: null,
    theme: 'dark', // 'dark' | 'light' | 'auto'
    animationsEnabled: true
};

// Performance tracking
const performanceMetrics = {
    calculations: 0,
    averageTime: 0,
    errors: 0
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Enhanced REBL Calculator v1.2.0...');
    
    // Initialize with one empty row after a small delay
    setTimeout(initializeCalculator, 100);
    
    // Add performance monitoring
    setupPerformanceMonitoring();
    
    // Add theme detection
    detectUserTheme();
    
    // Add keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Add offline support detection
    setupOfflineSupport();
});

function initializeCalculator() {
    addTokenBatch();
    updateParticipationUI();
    updateWhatIfGamma();
    setupChartPlaceholder();
    initCalculatorAnimations();
    setupEventListeners();
    initQuickPresets();
    
    // Show enhanced welcome message
    setTimeout(() => {
        showToast('🎯 Welcome to Enhanced REBL Calculator! Try loading an example or add your token batches.', 'info');
        logPerformance('Initialization complete');
    }, 1500);
}

// ========== PERFORMANCE MONITORING ==========
function setupPerformanceMonitoring() {
    // Monitor calculation performance
    const originalCalculateRewards = calculateRewards;
    calculateRewards = function() {
        const startTime = performance.now();
        const result = originalCalculateRewards.apply(this, arguments);
        const endTime = performance.now();
        
        performanceMetrics.calculations++;
        performanceMetrics.averageTime = 
            (performanceMetrics.averageTime * (performanceMetrics.calculations - 1) + (endTime - startTime)) / 
            performanceMetrics.calculations;
        
        // Log performance periodically
        if (performanceMetrics.calculations % 10 === 0) {
            console.log(`📊 Performance: ${performanceMetrics.calculations} calculations, avg: ${performanceMetrics.averageTime.toFixed(2)}ms`);
        }
        
        return result;
    };
}

function logPerformance(message) {
    console.log(`📈 ${message} | Calculations: ${performanceMetrics.calculations} | Avg: ${performanceMetrics.averageTime.toFixed(2)}ms`);
}

// ========== THEME MANAGEMENT ==========
function detectUserTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('rebl-calculator-theme');
    if (savedTheme) {
        calculatorState.theme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        calculatorState.theme = 'light';
    }
    
    applyTheme();
    
    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (calculatorState.theme === 'auto') {
            calculatorState.theme = e.matches ? 'light' : 'dark';
            applyTheme();
        }
    });
}

function applyTheme() {
    const root = document.documentElement;
    
    if (calculatorState.theme === 'light') {
        root.style.setProperty('--dark-bg', '#f8f9fa');
        root.style.setProperty('--color-text-primary', '#212529');
        root.style.setProperty('--color-text-secondary', '#495057');
        root.style.setProperty('--color-text-muted', '#6c757d');
        root.style.setProperty('--color-bg-card', 'rgba(255, 255, 255, 0.9)');
    } else {
        root.style.setProperty('--dark-bg', '#1a1a1a');
        root.style.setProperty('--color-text-primary', '#FFFFFF');
        root.style.setProperty('--color-text-secondary', '#F0E6D2');
        root.style.setProperty('--color-text-muted', 'rgba(255, 255, 255, 0.7)');
        root.style.setProperty('--color-bg-card', 'rgba(212, 167, 106, 0.1)');
    }
}

// ========== KEYBOARD SHORTCUTS ==========
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter: Calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            calculateRewards();
            showToast('📊 Calculated rewards (Ctrl+Enter)', 'info');
        }
        
        // Ctrl/Cmd + N: Add new batch
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            addTokenBatch();
            showToast('➕ Added new token batch (Ctrl+N)', 'info');
        }
        
        // Ctrl/Cmd + K: Clear all
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (confirm('Clear all token batches?')) {
                clearTokenBatches();
            }
        }
        
        // Escape: Focus management
        if (e.key === 'Escape') {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT') {
                activeElement.blur();
            }
        }
        
        // Number shortcuts for examples
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    loadExampleCase('starter');
                    break;
                case '2':
                    e.preventDefault();
                    loadExampleCase('investor');
                    break;
                case '3':
                    e.preventDefault();
                    loadExampleCase('whale');
                    break;
            }
        }
    });
    
    // Show shortcut hint
    setTimeout(() => {
        console.log('🎹 Keyboard shortcuts enabled:');
        console.log('  Ctrl+Enter: Calculate rewards');
        console.log('  Ctrl+N: Add new batch');
        console.log('  Ctrl+K: Clear all batches');
        console.log('  Alt+1/2/3: Load examples');
    }, 2000);
}

// ========== OFFLINE SUPPORT ==========
function setupOfflineSupport() {
    // Check if offline
    if (!navigator.onLine) {
        showToast('🌐 You are offline. Calculator is using cached data.', 'warning');
    }
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
        showToast('🌐 You are back online!', 'success');
    });
    
    window.addEventListener('offline', () => {
        showToast('🌐 You are offline. Some features may be limited.', 'warning');
    });
}

// ========== ENHANCED SETUP FUNCTIONS ==========
function setupEventListeners() {
    // Enhanced participation inputs
    setupEnhancedInputListeners();
    
    // Auto-update toggle with animation
    const toggle = document.getElementById('autoUpdateToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            calculatorState.autoUpdateParticipation = this.checked;
            
            // Add toggle animation
            const slider = this.nextElementSibling;
            if (slider) {
                slider.style.transform = this.checked ? 'scale(1.1)' : 'scale(0.9)';
                setTimeout(() => {
                    slider.style.transform = '';
                }, 300);
            }
            
            updateParticipationUI();
            showToast(`Auto-update ${this.checked ? 'enabled 🔄' : 'disabled ⏸️'}`, 'info');
        });
    }
    
    // Add input validation
    setupInputValidation();
    
    // Add scroll animations
    setupScrollAnimations();
}

function setupEnhancedInputListeners() {
    const inputs = [
        { id: 'participatingTokensInput', slider: 'participatingTokens', stateKey: 'currentParticipatingTokens' },
        { id: 'totalWSInput', slider: 'totalWS', stateKey: 'currentTotalWS' },
        { id: 'whatIfParticipatingInput', slider: 'whatIfParticipating', stateKey: null },
        { id: 'whatIfTotalWSInput', slider: 'whatIfTotalWS', stateKey: null }
    ];
    
    inputs.forEach(config => {
        const input = document.getElementById(config.id);
        const slider = document.getElementById(config.slider);
        
        if (input && slider) {
            // Debounced input handler
            let timeout;
            input.addEventListener('input', function() {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    let value = parseInt(this.value.replace(/,/g, '')) || 0;
                    const min = parseInt(this.min) || 0;
                    const max = parseInt(this.max) || Infinity;
                    
                    value = Math.max(min, Math.min(max, value));
                    this.value = value.toLocaleString();
                    slider.value = value;
                    
                    if (config.stateKey) {
                        calculatorState[config.stateKey] = value;
                    }
                    
                    // Add visual feedback
                    this.style.borderColor = 'var(--rebel-gold)';
                    setTimeout(() => {
                        this.style.borderColor = '';
                    }, 500);
                    
                    if (config.stateKey) {
                        updateParticipationDisplay();
                        calculateRewards();
                    } else {
                        updateWhatIfGamma();
                    }
                }, 300);
            });
            
            // Format on blur
            input.addEventListener('blur', function() {
                const value = parseInt(this.value.replace(/,/g, '')) || 0;
                this.value = formatNumber(value, false);
            });
            
            slider.addEventListener('input', function() {
                const value = parseInt(this.value);
                input.value = formatNumber(value, false);
                
                if (config.stateKey) {
                    calculatorState[config.stateKey] = value;
                    updateParticipationDisplay();
                    calculateRewards();
                } else {
                    updateWhatIfGamma();
                }
            });
        }
    });
}

function setupInputValidation() {
    // Validate token batch inputs
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('batch-amount')) {
            const value = parseFloat(e.target.value);
            if (value < 0) {
                e.target.classList.add('error');
                showToast('Token amount cannot be negative', 'warning');
            } else {
                e.target.classList.remove('error');
            }
        }
        
        if (e.target.classList.contains('batch-age')) {
            const value = parseFloat(e.target.value);
            if (value < 0 || value > 20) {
                e.target.classList.add('error');
                showToast('Age must be between 0 and 20 epochs', 'warning');
            } else {
                e.target.classList.remove('error');
            }
        }
    });
}

function setupScrollAnimations() {
    // Add scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe calculator sections
    document.querySelectorAll('.calculator-section').forEach(section => {
        observer.observe(section);
    });
}

// ========== ENHANCED TOKEN BATCH FUNCTIONS ==========
function addTokenBatch(amount = '', age = '') {
    const table = document.querySelector('#token-batches-table tbody');
    if (!table) return;
    
    const rowId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const row = document.createElement('tr');
    row.id = rowId;
    row.className = 'token-batch-row';
    row.innerHTML = `
        <td>
            <div class="input-group">
                <input type="text" class="batch-amount" value="${amount}" 
                       placeholder="0" oninput="updateRowCalculations(this)"
                       data-type="amount" data-row="${rowId}">
                <span class="input-suffix">$rebelinux</span>
            </div>
            <div class="input-hint">Token amount</div>
        </td>
        <td>
            <div class="input-group">
                <input type="number" class="batch-age" value="${age}" 
                       placeholder="0" oninput="updateRowCalculations(this)"
                       min="0" max="20" step="1" data-type="age" data-row="${rowId}">
                <span class="input-suffix">epochs</span>
            </div>
            <div class="input-hint">Age (0-20)</div>
        </td>
        <td class="batch-factor" style="color: var(--rebel-gold); font-weight: 800; text-align: center;">
            <span class="factor-value">1.00</span>
            <div class="input-hint">Weight factor</div>
        </td>
        <td class="batch-ws" style="color: var(--rebel-red); font-weight: 800; text-align: center;">
            <span class="ws-value">0</span>
            <div class="input-hint">Weighted share</div>
        </td>
        <td style="text-align: center;">
            <button onclick="removeTokenBatch(this)" class="batch-btn" 
                    data-row="${rowId}" title="Remove this batch">
                <i class="fas fa-trash-alt"></i>
            </button>
            <div class="input-hint">Remove</div>
        </td>
    `;
    table.appendChild(row);
    
    // Initialize input formatting
    if (amount) {
        const amountInput = row.querySelector('.batch-amount');
        amountInput.value = formatNumber(parseFloat(amount), false);
    }
    
    // Add animation
    row.style.opacity = '0';
    row.style.transform = 'translateY(20px) scale(0.95)';
    setTimeout(() => {
        row.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0) scale(1)';
    }, 10);
    
    // Focus on amount input
    setTimeout(() => {
        const amountInput = row.querySelector('.batch-amount');
        if (amountInput && !amount) {
            amountInput.focus();
        }
    }, 100);
    
    // Update calculations
    if (amount || age) {
        setTimeout(() => updateRowCalculations(row.querySelector('.batch-amount')), 50);
    }
    
    updateUserTotals();
    
    // Analytics
    logPerformance(`Added token batch: ${amount || 'empty'}, age: ${age || 'empty'}`);
}

function removeTokenBatch(button) {
    const rowId = button.dataset.row;
    const row = document.getElementById(rowId);
    
    if (row) {
        // Animation
        row.style.transform = 'translateX(100%) scale(0.9)';
        row.style.opacity = '0';
        
        setTimeout(() => {
            row.remove();
            updateUserTotals();
            calculateRewards();
            
            // Add empty row if table is empty
            const table = document.querySelector('#token-batches-table tbody');
            if (table && table.children.length === 0) {
                setTimeout(() => addTokenBatch(), 100);
            }
            
            showToast('🗑️ Token batch removed', 'info');
        }, 300);
    }
}

function clearTokenBatches() {
    const table = document.querySelector('#token-batches-table tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length === 0) return;
    
    if (!confirm('Are you sure you want to clear all token batches?')) {
        return;
    }
    
    // Animated removal
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.style.transform = 'translateX(-100%) rotate(-5deg)';
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 400);
        }, index * 100);
    });
    
    // Reset and add empty row
    setTimeout(() => {
        addTokenBatch();
        calculatorState.totalUserTokens = 0;
        calculatorState.totalUserWS = 0;
        updateParticipationUI();
        
        resetResultsDisplay();
        hideChart();
        
        showToast('🧹 All token batches cleared', 'info');
        logPerformance('Cleared all token batches');
    }, rows.length * 100 + 500);
}

function resetResultsDisplay() {
    const resultElement = document.getElementById('reward-result');
    if (resultElement) {
        resultElement.innerHTML = `
            <div class="reward-placeholder">
                <i class="fas fa-calculator"></i>
                <p>Enter your token batches to calculate your sustainable $REBL rewards!</p>
                <p class="reward-placeholder-subtext">
                    Try loading an example or adding your own token batches.
                </p>
                <div class="placeholder-actions">
                    <button onclick="loadExampleCase('starter')" class="quick-action-btn">
                        <i class="fas fa-user-graduate"></i> Load Starter Example
                    </button>
                </div>
            </div>
        `;
        resultElement.className = 'reward-result';
    }
}

function updateRowCalculations(input) {
    const row = input.closest('tr');
    if (!row) return;
    
    const rowId = row.id;
    const amountInput = row.querySelector('.batch-amount');
    const ageInput = row.querySelector('.batch-age');
    
    // Parse values with proper formatting
    const amount = parseFloat(amountInput.value.replace(/,/g, '')) || 0;
    const age = parseFloat(ageInput.value) || 0;
    
    // Validate and format
    if (amount < 0) {
        amountInput.value = '0';
        showToast('Token amount cannot be negative', 'warning');
        return;
    }
    
    if (age < 0 || age > 20) {
        ageInput.value = Math.min(20, Math.max(0, age));
        showToast('Age must be between 0 and 20 epochs', 'warning');
    }
    
    // Format amount input
    if (amount > 0) {
        amountInput.value = formatNumber(amount, false);
    }
    
    // Calculate weight factor and weighted share
    const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
    const weightedShare = amount * weightFactor;
    
    // Update display with animation
    const factorValue = row.querySelector('.factor-value');
    const wsValue = row.querySelector('.ws-value');
    
    if (factorValue) {
        factorValue.textContent = weightFactor.toFixed(2);
        factorValue.style.color = weightFactor > 1 ? 'var(--rebel-gold)' : '#ffffff';
        
        // Add animation
        factorValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            factorValue.style.transform = 'scale(1)';
        }, 300);
    }
    
    if (wsValue) {
        wsValue.textContent = formatNumber(weightedShare, true);
        wsValue.style.color = 'var(--rebel-red)';
        
        // Add animation
        wsValue.style.transform = 'scale(1.2)';
        setTimeout(() => {
            wsValue.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Update user totals with debounce
    clearTimeout(window.updateUserTotalsTimeout);
    window.updateUserTotalsTimeout = setTimeout(() => {
        updateUserTotals();
    }, 200);
}

// ========== ENHANCED USER TOTALS & STATS ==========
function updateUserTotals() {
    const rows = document.querySelectorAll('#token-batches-table tbody tr');
    let totalTokens = 0;
    let totalWS = 0;
    let batchCount = 0;
    
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.batch-amount').value.replace(/,/g, '')) || 0;
        const wsText = row.querySelector('.ws-value').textContent;
        const ws = parseFloat(wsText.replace(/,/g, '')) || 0;
        
        totalTokens += amount;
        totalWS += ws;
        if (amount > 0) batchCount++;
    });
    
    calculatorState.totalUserTokens = totalTokens;
    calculatorState.totalUserWS = totalWS;
    
    // Update auto-update if enabled
    if (calculatorState.autoUpdateParticipation) {
        updateParticipationUI();
    }
    
    // Update stats display
    updateUserStatsDisplay(totalTokens, totalWS, batchCount);
    
    // Update quick info
    updateQuickInfoDisplays();
    
    // Schedule calculation if we have tokens
    if (totalTokens > 0 && !calculatorState.isCalculating) {
        calculatorState.isCalculating = true;
        setTimeout(() => {
            calculateRewards();
            calculatorState.isCalculating = false;
        }, 500);
    }
}

function updateUserStatsDisplay(totalTokens, totalWS, batchCount) {
    let statsContainer = document.querySelector('.user-stats-container');
    
    if (!statsContainer && totalTokens > 0) {
        const tokenSection = document.querySelector('.token-batches-section');
        if (!tokenSection) return;
        
        statsContainer = document.createElement('div');
        statsContainer.className = 'user-stats-container';
        statsContainer.innerHTML = `
            <div class="user-stats-grid">
                <div class="user-stat-item">
                    <div class="user-stat-label">Total Tokens</div>
                    <div id="userTotalTokens" class="user-stat-value">0</div>
                    <div id="userTokenPercentage" class="user-stat-percentage">0% of CS</div>
                </div>
                <div class="user-stat-item">
                    <div class="user-stat-label">Weighted Share</div>
                    <div id="userTotalWS" class="user-stat-value">0</div>
                    <div class="user-stat-percentage">Total WS</div>
                </div>
                <div class="user-stat-item">
                    <div class="user-stat-label">Avg. Bonus</div>
                    <div id="userAvgBonus" class="user-stat-value">1.00x</div>
                    <div id="userBatchCount" class="user-stat-percentage">0 batches</div>
                </div>
            </div>
        `;
        
        const tableContainer = tokenSection.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.parentNode.insertBefore(statsContainer, tableContainer.nextSibling);
        }
    }
    
    if (statsContainer) {
        const userTotalTokens = document.getElementById('userTotalTokens');
        const userTokenPercentage = document.getElementById('userTokenPercentage');
        const userTotalWS = document.getElementById('userTotalWS');
        const userAvgBonus = document.getElementById('userAvgBonus');
        const userBatchCount = document.getElementById('userBatchCount');
        
        if (userTotalTokens) {
            userTotalTokens.textContent = formatNumber(totalTokens);
            userTotalTokens.style.color = totalTokens > 1000000 ? 'var(--rebel-gold)' : '#ffffff';
        }
        
        if (userTokenPercentage) {
            const percentage = totalTokens > 0 ? ((totalTokens / CS) * 100).toFixed(4) : 0;
            userTokenPercentage.textContent = `${percentage}% of CS`;
            userTokenPercentage.style.color = 
                percentage >= 1 ? '#4CAF50' :
                percentage >= 0.1 ? '#FFC107' :
                'rgba(255, 255, 255, 0.6)';
        }
        
        if (userTotalWS) {
            userTotalWS.textContent = formatNumber(totalWS, true);
            userTotalWS.style.color = totalWS > totalTokens * 1.5 ? 'var(--rebel-gold)' : '#ffffff';
        }
        
        if (userAvgBonus) {
            const avgBonus = totalTokens > 0 ? (totalWS / totalTokens).toFixed(2) : '1.00';
            userAvgBonus.textContent = `${avgBonus}x`;
            userAvgBonus.style.color = 
                avgBonus >= 2.0 ? '#4CAF50' :
                avgBonus >= 1.5 ? '#FFC107' :
                avgBonus > 1.0 ? '#FF9800' :
                '#ffffff';
        }
        
        if (userBatchCount) {
            userBatchCount.textContent = `${batchCount} batch${batchCount !== 1 ? 'es' : ''}`;
        }
        
        statsContainer.style.display = totalTokens > 0 ? 'block' : 'none';
        
        // Add animation
        statsContainer.style.opacity = '0';
        statsContainer.style.transform = 'translateY(10px)';
        setTimeout(() => {
            statsContainer.style.transition = 'all 0.3s ease';
            statsContainer.style.opacity = '1';
            statsContainer.style.transform = 'translateY(0)';
        }, 100);
    }
}

function updateQuickInfoDisplays() {
    const yourTokenShare = document.getElementById('yourTokenShare');
    const yourWSShare = document.getElementById('yourWSShare');
    
    if (yourTokenShare && calculatorState.currentParticipatingTokens > 0) {
        const share = (calculatorState.totalUserTokens / calculatorState.currentParticipatingTokens * 100).toFixed(2);
        yourTokenShare.textContent = `${share}%`;
        yourTokenShare.title = `You own ${share}% of participating tokens`;
    }
    
    if (yourWSShare && calculatorState.currentTotalWS > 0) {
        const share = (calculatorState.totalUserWS / calculatorState.currentTotalWS * 100).toFixed(2);
        yourWSShare.textContent = `${share}%`;
        yourWSShare.title = `You control ${share}% of weighted shares`;
    }
}

// ========== ENHANCED GAMMA CALCULATIONS ==========
function calculateGammaScale(P, totalWS) {
    // γ = MAX(0.4, MIN(1, P/(0.5 × CS), CS/∑WS))
    
    const participationTerm = P / (0.5 * CS);
    const inflationCap = CS / totalWS;
    const minTerm = Math.min(1, participationTerm, inflationCap);
    const gamma = Math.max(0.4, minTerm);
    
    return {
        gamma: gamma,
        participationTerm: participationTerm,
        inflationCap: inflationCap,
        minTerm: minTerm,
        participationRatio: (P / CS) * 100,
        wsRatio: (totalWS / CS) * 100
    };
}

function updateGammaInfoPanel(gamma, gammaData) {
    const gammaInfoPanel = document.getElementById('gammaInfoPanel');
    if (!gammaInfoPanel) return;
    
    let panelClass, panelTitle, panelText, panelIcon;
    
    if (gamma >= 1) {
        panelClass = 'high';
        panelTitle = 'Maximum Rewards 🎉';
        panelText = `Gamma Scale is at maximum! 100% of weekly pool is distributed. Participation: ${gammaData.participationRatio.toFixed(1)}% of CS.`;
        panelIcon = 'fas fa-trophy';
    } else if (gamma >= 0.8) {
        panelClass = 'high';
        panelTitle = 'High Participation 🚀';
        panelText = `Excellent participation! Close to unlocking maximum rewards. Current: ${gammaData.participationRatio.toFixed(1)}% of CS.`;
        panelIcon = 'fas fa-rocket';
    } else if (gamma >= 0.6) {
        panelClass = 'medium';
        panelTitle = 'Good Participation 📈';
        panelText = `Good participation level. Rewards scaling up. Current: ${gammaData.participationRatio.toFixed(1)}% of CS.`;
        panelIcon = 'fas fa-chart-line';
    } else if (gamma >= 0.4) {
        panelClass = 'low';
        panelTitle = 'Low Participation ⚠️';
        panelText = `Gamma Scale is at minimum (40%). Need ${(50 - gammaData.participationRatio).toFixed(1)}% more participation for full rewards.`;
        panelIcon = 'fas fa-exclamation-triangle';
    }
    
    gammaInfoPanel.className = `gamma-info-panel ${panelClass}`;
    gammaInfoPanel.innerHTML = `
        <div class="gamma-info-header">
            <i class="${panelIcon}"></i>
            <strong>${panelTitle} (γ = ${gamma.toFixed(2)})</strong>
        </div>
        <p class="gamma-info-text">${panelText}</p>
    `;
}

// ========== ENHANCED REWARD CALCULATION ==========
function calculateRewards() {
    if (calculatorState.isCalculating) {
        console.log('⏳ Calculation already in progress...');
        return;
    }
    
    calculatorState.isCalculating = true;
    calculatorState.lastCalculationTime = new Date();
    
    const startTime = performance.now();
    
    // Show loading state
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.classList.add('loading');
        calculateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CALCULATING...';
        calculateButton.disabled = true;
    }
    
    // Get batch data
    const rows = document.querySelectorAll('#token-batches-table tbody tr');
    let userWS = 0;
    let totalAmount = 0;
    let batchCount = 0;
    const batchData = [];
    
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.batch-amount').value.replace(/,/g, '')) || 0;
        const age = parseFloat(row.querySelector('.batch-age').value) || 0;
        const wsText = row.querySelector('.ws-value').textContent;
        const ws = parseFloat(wsText.replace(/,/g, '')) || 0;
        
        userWS += ws;
        totalAmount += amount;
        
        if (amount > 0) {
            batchCount++;
            batchData.push({
                amount: amount,
                age: age,
                ws: ws,
                factor: 1 + (K * Math.min(age, MAX_AGE))
            });
        }
    });
    
    // Validate data
    if (batchData.length === 0 || totalAmount <= 0) {
        showEmptyState();
        calculatorState.isCalculating = false;
        return;
    }
    
    // Ensure totalWS >= userWS
    if (calculatorState.currentTotalWS < userWS) {
        calculatorState.currentTotalWS = Math.max(userWS * 1.1, userWS + 1000000);
        document.getElementById('totalWSInput').value = formatNumber(calculatorState.currentTotalWS, false);
        document.getElementById('totalWS').value = calculatorState.currentTotalWS;
        showToast('📊 Adjusted Total WS to match your weighted shares', 'warning');
    }
    
    // Calculate gamma
    const gammaData = calculateGammaScale(calculatorState.currentParticipatingTokens, calculatorState.currentTotalWS);
    const gamma = gammaData.gamma;
    
    // Calculate rewards
    const userShare = calculatorState.currentTotalWS > 0 ? (userWS / calculatorState.currentTotalWS) : 0;
    const userReward = userShare * WERP * gamma;
    const effectivePool = WERP * gamma;
    
    // Calculate projections
    const monthlyReward = userReward * 4.33;
    const annualReward = userReward * 52;
    const roiPerEpoch = ((userReward / totalAmount) * 100).toFixed(4);
    const roiAnnual = ((annualReward / totalAmount) * 100).toFixed(2);
    
    // Display results
    displayResults({
        userWS,
        totalWS: calculatorState.currentTotalWS,
        userShare,
        gamma,
        effectivePool,
        userReward,
        monthlyReward,
        annualReward,
        roiPerEpoch,
        roiAnnual,
        participatingTokens: calculatorState.currentParticipatingTokens,
        batchData,
        totalAmount
    });
    
    // Update chart
    updateChart(batchData, userWS);
    
    // Restore button
    if (calculateButton) {
        calculateButton.classList.remove('loading');
        calculateButton.innerHTML = '<i class="fas fa-calculator"></i> CALCULATE SUSTAINABLE REWARDS';
        calculateButton.disabled = false;
    }
    
    calculatorState.isCalculating = false;
    
    // Performance logging
    const endTime = performance.now();
    const calculationTime = endTime - startTime;
    
    logPerformance(`Calculation completed in ${calculationTime.toFixed(2)}ms`);
    
    // Show success message
    showToast(`✅ Rewards calculated! ${formatNumber(userReward, true)} $REBL/week`, 'success');
}

function showEmptyState() {
    const resultElement = document.getElementById('reward-result');
    if (!resultElement) return;
    
    resultElement.innerHTML = `
        <div class="reward-placeholder">
            <i class="fas fa-calculator"></i>
            <p>Enter your token batches to calculate your sustainable $REBL rewards!</p>
            <p class="reward-placeholder-subtext">
                Try loading an example or adding your own token batches to see results.
            </p>
            <div class="placeholder-actions">
                <button onclick="loadExampleCase('starter')" class="quick-action-btn">
                    <i class="fas fa-user-graduate"></i> Load Starter Example
                </button>
                <button onclick="addTokenBatch('100000', '5')" class="quick-action-btn">
                    <i class="fas fa-plus"></i> Add Sample Batch
                </button>
            </div>
        </div>
    `;
    resultElement.className = 'reward-result';
    
    hideChart();
    
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.classList.remove('loading');
        calculateButton.innerHTML = '<i class="fas fa-calculator"></i> CALCULATE SUSTAINABLE REWARDS';
        calculateButton.disabled = false;
    }
}

function displayResults(data) {
    const resultElement = document.getElementById('reward-result');
    if (!resultElement) return;
    
    const gammaColor = getGammaColor(data.gamma);
    const poolPercentage = (data.userShare * 100).toFixed(4);
    
    resultElement.innerHTML = `
        <div class="reward-results-content">
            <div class="results-header">
                <h4><i class="fas fa-chart-bar"></i> Calculation Results</h4>
                <div class="results-timestamp">
                    <i class="fas fa-clock"></i> ${new Date().toLocaleTimeString()}
                </div>
            </div>
            
            <div class="results-grid">
                <div class="result-item">
                    <div class="result-label">Your Weighted Share</div>
                    <div class="result-value gold">${formatNumber(data.userWS, true)}</div>
                    <div class="result-hint">Total WSᵢ</div>
                </div>
                
                <div class="result-item">
                    <div class="result-label">Pool Share</div>
                    <div class="result-value gold">${poolPercentage}%</div>
                    <div class="result-hint">Of active pool</div>
                </div>
                
                <div class="result-item">
                    <div class="result-label">Gamma Scale (γ)</div>
                    <div class="result-value" style="color: ${gammaColor}">${data.gamma.toFixed(2)}</div>
                    <div class="result-hint">Sustainability factor</div>
                </div>
                
                <div class="result-item">
                    <div class="result-label">Weekly ROI</div>
                    <div class="result-value gold">${data.roiPerEpoch}%</div>
                    <div class="result-hint">Return per epoch</div>
                </div>
            </div>
            
            <div class="results-divider"></div>
            
            <div class="main-result">
                <div class="main-result-label">
                    <i class="fas fa-trophy"></i> Your Sustainable Reward
                </div>
                <div class="main-result-value">
                    ${formatNumber(data.userReward, true)} <span class="currency">$REBL</span>
                </div>
                <div class="main-result-subtext">
                    Weekly distribution | Based on ${formatNumber(data.participatingTokens)} participating tokens
                </div>
            </div>
            
            <div class="projections-section">
                <div class="section-label">
                    <i class="fas fa-calendar-alt"></i> Projections
                </div>
                <div class="projections-grid">
                    <div class="projection-item">
                        <div class="projection-label">Monthly Estimate</div>
                        <div class="projection-value gold">${formatNumber(data.monthlyReward, true)} $REBL</div>
                        <div class="projection-hint">~4.33 weeks</div>
                    </div>
                    <div class="projection-item">
                        <div class="projection-label">Annual Estimate</div>
                        <div class="projection-value gold">${formatNumber(data.annualReward, true)} $REBL</div>
                        <div class="projection-hint">~${data.roiAnnual}% ROI</div>
                    </div>
                </div>
                <div class="projections-note">
                    <i class="fas fa-info-circle"></i> Estimates assume consistent participation levels
                </div>
            </div>
            
            <div class="results-footer">
                <div class="batch-summary">
                    <i class="fas fa-layer-group"></i> ${data.batchData.length} batch${data.batchData.length !== 1 ? 'es' : ''} • ${formatNumber(data.totalAmount)} tokens
                </div>
                <div class="actions">
                    <button onclick="exportResults()" class="action-btn">
                        <i class="fas fa-download"></i> Export
                    </button>
                    <button onclick="shareResults()" class="action-btn">
                        <i class="fas fa-share-alt"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `;
    resultElement.className = 'reward-result';
}

// ========== ENHANCED CHART FUNCTIONS ==========
function updateChart(batchData, totalUserWS) {
    const ctx = document.getElementById('rewardChart');
    if (!ctx) return;
    
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    if (chartPlaceholder) chartPlaceholder.style.display = 'none';
    
    ctx.style.display = 'block';
    
    // Destroy existing chart
    if (rewardChart) {
        rewardChart.destroy();
    }
    
    // Prepare data
    const labels = batchData.map((batch, index) => `Batch ${index + 1}`);
    const weightedShares = batchData.map(batch => batch.ws);
    const percentages = weightedShares.map(ws => ((ws / totalUserWS) * 100).toFixed(1));
    
    // Enhanced colors with better contrast
    const backgroundColors = [
        'rgba(255, 51, 102, 0.85)',
        'rgba(255, 204, 0, 0.85)',
        'rgba(0, 170, 255, 0.85)',
        'rgba(156, 39, 176, 0.85)',
        'rgba(76, 175, 80, 0.85)',
        'rgba(255, 152, 0, 0.85)',
        'rgba(33, 150, 243, 0.85)',
        'rgba(233, 30, 99, 0.85)'
    ];
    
    const borderColors = [
        'rgba(255, 51, 102, 1)',
        'rgba(255, 204, 0, 1)',
        'rgba(0, 170, 255, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(33, 150, 243, 1)',
        'rgba(233, 30, 99, 1)'
    ];
    
    // Create enhanced chart
    rewardChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map((label, i) => `${label} (${percentages[i]}%)`),
            datasets: [{
                data: weightedShares,
                backgroundColor: backgroundColors.slice(0, weightedShares.length),
                borderColor: borderColors.slice(0, weightedShares.length),
                borderWidth: 3,
                hoverBorderWidth: 5,
                hoverOffset: 25,
                borderRadius: 10,
                spacing: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: 'white',
                        padding: 20,
                        font: {
                            family: 'Montserrat, sans-serif',
                            size: 13,
                            weight: '600'
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function(label, i) {
                                    const value = data.datasets[0].data[i];
                                    const percentage = ((value / totalUserWS) * 100).toFixed(1);
                                    return {
                                        text: `${label.split(' ')[0]} ${label.split(' ')[1]}`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: 2,
                                        hidden: false,
                                        index: i,
                                        percentage: percentage
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: 'var(--rebel-gold)',
                    bodyColor: 'white',
                    borderColor: 'var(--rebel-gold)',
                    borderWidth: 2,
                    cornerRadius: 10,
                    padding: 15,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            const batch = batchData[context.dataIndex];
                            return [
                                `Amount: ${formatNumber(batch.amount)} $rebelinux`,
                                `Age: ${batch.age} epoch${batch.age !== 1 ? 's' : ''}`,
                                `Factor: ${batch.factor.toFixed(2)}x`,
                                `WS: ${formatNumber(batch.ws, true)}`,
                                `Share: ${((batch.ws / totalUserWS) * 100).toFixed(1)}%`
                            ];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Token Batch Distribution',
                    color: 'var(--rebel-gold)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1200,
                easing: 'easeOutQuart',
                onProgress: function(animation) {
                    const progress = animation.currentStep / animation.numSteps;
                    if (progress > 0.5) {
                        this.options.cutout = '60%';
                    }
                }
            },
            cutout: '65%',
            radius: '90%'
        }
    });
    
    // Add chart interactions
    ctx.onclick = function(evt) {
        const points = rewardChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
        if (points.length) {
            const firstPoint = points[0];
            const label = rewardChart.data.labels[firstPoint.index];
            const value = rewardChart.data.datasets[0].data[firstPoint.index];
            
            showToast(`Selected: ${label} - ${formatNumber(value, true)} WS`, 'info');
        }
    };
}

// ========== ENHANCED UTILITY FUNCTIONS ==========
function formatNumber(num, showDecimals = false) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) return '0';
    
    if (num === 0) return '0';
    
    // For very small numbers
    if (num < 0.001 && num > 0) {
        return '<0.001';
    }
    
    if (num < 0) {
        return '-' + formatNumber(Math.abs(num), showDecimals);
    }
    
    // Format with suffixes
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const suffixNum = Math.floor(('' + num).length / 3);
    let shortNum = parseFloat((suffixNum !== 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
    
    if (shortNum % 1 !== 0) {
        shortNum = shortNum.toFixed(showDecimals ? 2 : 1);
    }
    
    return shortNum + (suffixes[suffixNum] || '');
}

function getGammaColor(gamma) {
    if (gamma >= 1) return '#00ff00';
    if (gamma >= 0.9) return '#80ff00';
    if (gamma >= 0.8) return '#ffff00';
    if (gamma >= 0.7) return '#ffcc00';
    if (gamma >= 0.6) return '#ff9900';
    if (gamma >= 0.5) return '#ff6600';
    if (gamma >= 0.4) return '#ff3300';
    return '#ff0000';
}

function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    document.querySelectorAll('.calculator-toast').forEach(toast => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });
    
    // Create toast
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}`;
    toast.id = toastId;
    toast.className = `calculator-toast calculator-toast-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="document.getElementById('${toastId}').remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove
    const timeout = setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
    
    // Pause on hover
    toast.addEventListener('mouseenter', () => clearTimeout(timeout));
    toast.addEventListener('mouseleave', () => {
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    });
}

// ========== EXPORT & SHARE FUNCTIONS ==========
function exportResults() {
    const rows = document.querySelectorAll('#token-batches-table tbody tr');
    const batches = [];
    
    rows.forEach((row, index) => {
        const amount = parseFloat(row.querySelector('.batch-amount').value.replace(/,/g, '')) || 0;
        const age = parseFloat(row.querySelector('.batch-age').value) || 0;
        const ws = parseFloat(row.querySelector('.ws-value').textContent.replace(/,/g, '')) || 0;
        
        if (amount > 0) {
            batches.push({
                batch: index + 1,
                amount: amount,
                age: age,
                weightedShare: ws
            });
        }
    });
    
    const data = {
        timestamp: new Date().toISOString(),
        batches: batches,
        totals: {
            tokens: calculatorState.totalUserTokens,
            weightedShares: calculatorState.totalUserWS,
            participatingTokens: calculatorState.currentParticipatingTokens,
            totalWS: calculatorState.currentTotalWS
        },
        results: getCurrentResults()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rebl-calculator-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('📥 Results exported as JSON', 'success');
}

function shareResults() {
    if (navigator.share) {
        const results = getCurrentResults();
        navigator.share({
            title: 'My REBL Calculator Results',
            text: `I'm earning ${formatNumber(results.weeklyReward, true)} $REBL weekly! Check out the REBL Calculator.`,
            url: window.location.href
        }).then(() => {
            showToast('📤 Results shared!', 'success');
        }).catch(console.error);
    } else {
        // Fallback: Copy to clipboard
        const results = getCurrentResults();
        const text = `REBL Calculator Results:\n` +
                    `Weekly Reward: ${formatNumber(results.weeklyReward, true)} $REBL\n` +
                    `Monthly Estimate: ${formatNumber(results.monthlyReward, true)} $REBL\n` +
                    `Annual Estimate: ${formatNumber(results.annualReward, true)} $REBL\n` +
                    `Gamma Scale: ${results.gamma.toFixed(2)}\n` +
                    `Calculate yours: ${window.location.href}`;
        
        navigator.clipboard.writeText(text).then(() => {
            showToast('📋 Results copied to clipboard!', 'success');
        });
    }
}

function getCurrentResults() {
    const resultElement = document.getElementById('reward-result');
    if (!resultElement || resultElement.querySelector('.reward-placeholder')) {
        return null;
    }
    
    // Extract data from current display
    // This would need to be implemented based on your display structure
    return {
        weeklyReward: calculatorState.lastCalculation?.userReward || 0,
        monthlyReward: calculatorState.lastCalculation?.monthlyReward || 0,
        annualReward: calculatorState.lastCalculation?.annualReward || 0,
        gamma: calculatorState.lastCalculation?.gamma || 0.4
    };
}

// ========== PUBLIC API ==========
// Expose functions globally
window.addTokenBatch = addTokenBatch;
window.removeTokenBatch = removeTokenBatch;
window.clearTokenBatches = clearTokenBatches;
window.updateRowCalculations = updateRowCalculations;
window.calculateRewards = calculateRewards;
window.updateWhatIfGamma = updateWhatIfGamma;
window.loadExampleCase = loadExampleCase;
window.setParticipationPreset = setParticipationPreset;
window.setSimulatorPreset = setSimulatorPreset;
window.exportResults = exportResults;
window.shareResults = shareResults;

// Make state accessible for debugging
window.getCalculatorState = () => calculatorState;
window.getPerformanceMetrics = () => performanceMetrics;

console.log('🎯 Enhanced REBL Calculator loaded successfully!');
console.log('📚 Available commands:');
console.log('  - addTokenBatch(amount, age)');
console.log('  - calculateRewards()');
console.log('  - exportResults()');
console.log('  - shareResults()');
console.log('  - getCalculatorState()');
console.log('  - getPerformanceMetrics()');

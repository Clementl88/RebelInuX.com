/// rebl-calculator.js -- Enhanced Calculator JavaScript v3.5 - FULLY ALIGNED WITH WHITEPAPER

// Global variables
let rewardChart = null;
const CS = 499242047.00; // Circulating Supply
const WERP = 3200000.00; // Weekly Epoch Reward Pool
const K = 0.07; // Age bonus per epoch (7%)
const MAX_AGE = 20; // Maximum age for bonus (20 epochs)
const MAX_WS = CS * 2.4; // Maximum ∑WS = CS * 2.4 = 1.2B

// State management
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
    // Multiplier state
    collectiblesCount: 1,
    largestHolderCount: 0,
    multiplier: 1.0
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing REBL Calculator v3.5 - Fully Aligned with Whitepaper');
    
    setTimeout(function() {
        addTokenBatch();
        addOtherParticipantBatch();
        
        // Initialize multiplier
        updateMultiplier();
        
        updateOtherParticipantsSummary();
        updateParticipationDisplay();
        updateWhatIfGamma();
        
        setupChartPlaceholder();
        setupEventListeners();
        initQuickPresets();
        
        const formulaToggleBtn = document.getElementById('formulaToggleBtn');
        if (formulaToggleBtn) {
            formulaToggleBtn.onclick = function(e) {
                e.preventDefault();
                toggleFormulaDetails();
                return false;
            };
        }
    }, 100);
    
    setTimeout(() => {
        showToast('Welcome to the Epoch Reward Calculator! Add your tokens, set your collector multiplier, and calculate rewards.', 'info');
    }, 1500);
});

// ========== SETUP FUNCTIONS ==========
function setupEventListeners() {
    const summaryOtherTokensInput = document.getElementById('summaryOtherTokensInput');
    const summaryOtherTokensSlider = document.getElementById('summaryOtherTokens');
    const summaryOtherAgeInput = document.getElementById('summaryOtherAgeInput');
    const summaryOtherAgeSlider = document.getElementById('summaryOtherAge');
    
    if (summaryOtherTokensInput && summaryOtherTokensSlider) {
        summaryOtherTokensInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            value = Math.max(0, Math.min(500000000, value));
            this.value = value;
            summaryOtherTokensSlider.value = value;
            updateSummaryOther();
        });
        
        summaryOtherTokensSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            summaryOtherTokensInput.value = value;
            updateSummaryOther();
        });
    }
    
    if (summaryOtherAgeInput && summaryOtherAgeSlider) {
        summaryOtherAgeInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            value = Math.max(0, Math.min(20, value));
            this.value = value;
            summaryOtherAgeSlider.value = value;
            updateSummaryOther();
        });
        
        summaryOtherAgeSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            summaryOtherAgeInput.value = value;
            updateSummaryOther();
        });
    }
    
    const whatIfParticipatingInput = document.getElementById('whatIfParticipatingInput');
    const whatIfTotalWSInput = document.getElementById('whatIfTotalWSInput');
    const whatIfParticipatingSlider = document.getElementById('whatIfParticipating');
    const whatIfTotalWSSlider = document.getElementById('whatIfTotalWS');
    
    if (whatIfParticipatingInput && whatIfParticipatingSlider) {
        whatIfParticipatingInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            value = Math.max(1000000, Math.min(500000000, value));
            this.value = value;
            whatIfParticipatingSlider.value = value;
            updateWhatIfGamma();
        });
        
        whatIfParticipatingSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            whatIfParticipatingInput.value = value;
            updateWhatIfGamma();
        });
    }
    
    if (whatIfTotalWSInput && whatIfTotalWSSlider) {
        whatIfTotalWSInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            value = Math.max(1000000, Math.min(MAX_WS, value));
            this.value = value;
            whatIfTotalWSSlider.value = value;
            updateWhatIfGamma();
        });
        
        whatIfTotalWSSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            whatIfTotalWSInput.value = value;
            updateWhatIfGamma();
        });
    }
    
    // Multiplier inputs - using number inputs (not checkboxes)
    const collectiblesInput = document.getElementById('collectiblesCount');
    const largestHolderInput = document.getElementById('largestHolderCount');
    
    if (collectiblesInput) {
        collectiblesInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            value = Math.max(0, Math.min(100, value)); // Max 100 as per HTML
            this.value = value;
            calculatorState.collectiblesCount = value;
            updateMultiplier();
            calculateRewards();
        });
    }
    
    if (largestHolderInput) {
        largestHolderInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            value = Math.max(0, Math.min(100, value)); // Max 100 as per HTML
            this.value = value;
            calculatorState.largestHolderCount = value;
            updateMultiplier();
            calculateRewards();
        });
    }
}

function initQuickPresets() {
    const targetParticipatingDisplay = document.getElementById('targetParticipatingDisplay');
    if (targetParticipatingDisplay) {
        const target = (0.5 * CS);
        targetParticipatingDisplay.textContent = formatNumber(target);
    }
}

// ========== MULTIPLIER FUNCTIONS ==========
function updateMultiplier() {
    const collectibles = parseInt(document.getElementById('collectiblesCount').value) || 0;
    const largestHolderCount = parseInt(document.getElementById('largestHolderCount').value) || 0;
    
    // Multiplierᵢ = 1.0 + (0.05 × Collectibles) + (0.1 × LargestHolderCount)
    const collectiblesBonus = collectibles * 0.05;
    const largestHolderBonus = largestHolderCount * 0.1;
    const totalMultiplier = 1.0 + collectiblesBonus + largestHolderBonus;
    
    // Update state
    calculatorState.collectiblesCount = collectibles;
    calculatorState.largestHolderCount = largestHolderCount;
    calculatorState.multiplier = totalMultiplier;
    
    // Update display
    const baseMultiplier = document.getElementById('baseMultiplier');
    const collectiblesBonusDisplay = document.getElementById('collectiblesBonus');
    const largestHolderBonusDisplay = document.getElementById('largestHolderBonus');
    const totalMultiplierDisplay = document.getElementById('totalMultiplier');
    
    if (baseMultiplier) baseMultiplier.textContent = '1.00x';
    
    if (collectiblesBonusDisplay) {
        collectiblesBonusDisplay.textContent = `+${collectiblesBonus.toFixed(2)}x`;
        collectiblesBonusDisplay.style.color = collectiblesBonus > 0 ? '#4CAF50' : 'rgba(255, 255, 255, 0.6)';
    }
    
    if (largestHolderBonusDisplay) {
        largestHolderBonusDisplay.textContent = `+${largestHolderBonus.toFixed(2)}x`;
        largestHolderBonusDisplay.style.color = largestHolderBonus > 0 ? '#FF9800' : 'rgba(255, 255, 255, 0.6)';
    }
    
    if (totalMultiplierDisplay) {
        totalMultiplierDisplay.textContent = `${totalMultiplier.toFixed(2)}x`;
        totalMultiplierDisplay.style.color = totalMultiplier > 1.0 ? '#ffcc00' : '#ffffff';
    }
    
    // Recalculate user totals with new multiplier
    updateUserTotals();
}

// ========== YOUR TOKEN BATCH FUNCTIONS ==========
function addTokenBatch(amount = '', age = '') {
    const table = document.querySelector('#token-batches-table tbody');
    if (!table) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <input type="number" class="batch-amount" value="${amount}" placeholder="Amount" 
                   oninput="updateRowCalculations(this)" min="0" step="1000">
            <div class="input-hint">$rebelinux amount</div>
        </td>
        <td>
            <input type="number" class="batch-age" value="${age}" placeholder="Age" 
                   oninput="updateRowCalculations(this)" min="0" max="20" step="1">
            <div class="input-hint">Epochs (0-20)</div>
        </td>
        <td class="batch-factor" style="color: var(--rebel-gold); font-weight: bold; text-align: center;">1.00</td>
        <td class="batch-ws" style="color: var(--rebel-red); font-weight: bold; text-align: center;">0</td>
        <td style="text-align: center;">
            <button onclick="removeTokenBatch(this)" class="batch-btn">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    table.appendChild(row);
    
    if (amount || age) {
        setTimeout(() => updateRowCalculations(row.querySelector('.batch-amount')), 10);
    }
    
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    setTimeout(() => {
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }, 10);
    
    updateUserTotals();
}

function removeTokenBatch(button) {
    const row = button.closest('tr');
    if (row) {
        row.style.transform = 'translateX(-100%)';
        row.style.opacity = '0';
        
        setTimeout(() => {
            row.remove();
            updateUserTotals();
            calculateRewards();
            
            const table = document.querySelector('#token-batches-table tbody');
            if (table && table.children.length === 0) {
                addTokenBatch();
            }
        }, 300);
    }
}

function clearTokenBatches() {
    const table = document.querySelector('#token-batches-table tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length === 0) return;
    
    if (!confirm('Are you sure you want to clear all your token batches?')) {
        return;
    }
    
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.style.transform = 'translateX(100%)';
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 300);
        }, index * 50);
    });
    
    setTimeout(() => {
        addTokenBatch();
        calculatorState.totalUserTokens = 0;
        calculatorState.totalUserWS = 0;
        updateUserTotals();
        
        const resultElement = document.getElementById('reward-result');
        if (resultElement) {
            resultElement.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-calculator" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Enter your token batches to calculate your $REBL epoch rewards!</p>
                    <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-top: 0.5rem;">
                        Try loading an example or adding your own token batches.
                    </p>
                </div>
            `;
            resultElement.className = 'reward-result';
        }
        hideChart();
        showToast('Your token batches cleared', 'info');
    }, rows.length * 50 + 300);
}

function updateRowCalculations(input) {
    const row = input.closest('tr');
    if (!row) return;
    
    const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
    const age = parseFloat(row.querySelector('.batch-age').value) || 0;
    
    if (amount < 0) {
        row.querySelector('.batch-amount').value = 0;
        return;
    }
    if (age < 0) {
        row.querySelector('.batch-age').value = 0;
        return;
    }
    if (age > 20) {
        row.querySelector('.batch-age').value = 20;
    }
    
    // Weight factor: 1 + 0.07 × min(Age, 20) - NO LOYALTY BONUS
    const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
    const weightedShare = amount * weightFactor;
    
    const factorCell = row.querySelector('.batch-factor');
    const wsCell = row.querySelector('.batch-ws');
    
    if (factorCell) {
        factorCell.textContent = weightFactor.toFixed(2);
        factorCell.style.color = weightFactor > 1 ? 'var(--rebel-gold)' : '#ffffff';
        factorCell.style.fontWeight = weightFactor > 1 ? 'bold' : 'normal';
    }
    
    if (wsCell) {
        wsCell.textContent = formatNumber(weightedShare, true);
        wsCell.style.color = 'var(--rebel-red)';
        wsCell.style.fontWeight = 'bold';
    }
    
    updateUserTotals();
    
    if (!calculatorState.isCalculating) {
        calculatorState.isCalculating = true;
        setTimeout(() => {
            calculateRewards();
            calculatorState.isCalculating = false;
        }, 300);
    }
}

function updateUserTotals() {
    const rows = document.querySelectorAll('#token-batches-table tbody tr');
    let totalTokens = 0;
    let totalWS = 0;
    let totalWeightedAge = 0;
    
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
        const age = parseFloat(row.querySelector('.batch-age').value) || 0;
        
        const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
        const weightedShare = amount * weightFactor;
        
        totalTokens += amount;
        totalWS += weightedShare;
        totalWeightedAge += amount * age;
        
        const wsCell = row.querySelector('.batch-ws');
        if (wsCell) {
            wsCell.textContent = formatNumber(weightedShare, true);
        }
    });
    
    // Apply multiplier to total WS
    const multiplier = calculatorState.multiplier || 1.0;
    const totalWSWithMultiplier = totalWS * multiplier;
    
    calculatorState.totalUserTokens = totalTokens;
    calculatorState.totalUserWS = totalWSWithMultiplier;
    
    const userTokenSum = document.getElementById('userTokenSum');
    const userWSSum = document.getElementById('userWSSum');
    
    if (userTokenSum) userTokenSum.textContent = formatNumber(totalTokens);
    if (userWSSum) userWSSum.textContent = formatNumber(totalWSWithMultiplier, true);
    
    updateOtherParticipantsSummary();
    updateParticipationDisplay();
    updateUserStatsDisplay(totalTokens, totalWSWithMultiplier, totalWeightedAge);
    updateWSInfoDisplay();
}
function setParticipantType(type) {
    calculatorState.participantType = type;
    
    const detailedMode = document.getElementById('detailedBatchesMode');
    const summaryMode = document.getElementById('summaryMode');
    const detailedOption = document.querySelector('.participant-type-option:nth-child(1)');
    const summaryOption = document.querySelector('.participant-type-option:nth-child(2)');
    
    if (type === 'detailed') {
        if (detailedMode) {
            detailedMode.style.display = 'block';
            detailedMode.classList.add('active');
        }
        if (summaryMode) {
            summaryMode.style.display = 'none';
            summaryMode.classList.remove('active');
        }
        if (detailedOption) detailedOption.classList.add('active');
        if (summaryOption) summaryOption.classList.remove('active');
        
        calculateDetailedBatchesWS();
    } else {
        if (detailedMode) {
            detailedMode.style.display = 'none';
            detailedMode.classList.remove('active');
        }
        if (summaryMode) {
            summaryMode.style.display = 'block';
            summaryMode.classList.add('active');
        }
        if (detailedOption) detailedOption.classList.remove('active');
        if (summaryOption) summaryOption.classList.add('active');
        updateSummaryOther();
    }
    
    updateOtherParticipantsSummary();
    updateParticipationDisplay();
    calculateRewards();
    
    showToast(`Switched to ${type} mode for other participants`, 'info');
}
function updateUserStatsDisplay(totalTokens, totalWSWithMultiplier, totalWeightedAge) {
    let statsContainer = document.querySelector('.user-stats-container');
    
    if (!statsContainer && totalTokens > 0) {
        const tokenSection = document.querySelector('.token-batches-section');
        if (!tokenSection) return;
        
        statsContainer = document.createElement('div');
        statsContainer.className = 'user-stats-container';
        statsContainer.innerHTML = `
            <div class="user-stats-grid">
                <div class="user-stat-item">
                    <div class="user-stat-label">Your Total Tokens</div>
                    <div id="userTotalTokens" class="user-stat-value">0</div>
                    <div id="userTokenPercentage" class="user-stat-percentage">0% of CS</div>
                </div>
                <div class="user-stat-item">
                    <div class="user-stat-label">Your Weighted Share</div>
                    <div id="userTotalWS" class="user-stat-value">0</div>
                    <div class="user-stat-percentage">With ${calculatorState.multiplier.toFixed(2)}x multiplier</div>
                </div>
                <div class="user-stat-item">
                    <div class="user-stat-label">Avg. Age</div>
                    <div id="userAvgAge" class="user-stat-value">0.0</div>
                    <div class="user-stat-percentage">Epochs</div>
                </div>
                <div class="user-stat-item">
                    <div class="user-stat-label">Collector Multiplier</div>
                    <div id="userMultiplier" class="user-stat-value">1.00x</div>
                    <div class="user-stat-percentage">From collectibles</div>
                </div>
            </div>
        `;
        
        const tableContainer = tokenSection.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.parentNode.insertBefore(statsContainer, tableContainer.nextSibling);
        }
    }
    
    if (statsContainer) {
        const avgAge = totalTokens > 0 ? (totalWeightedAge / totalTokens) : 0;
        const avgBonus = totalTokens > 0 ? (totalWSWithMultiplier / totalTokens) : 1.0;
        const tokenPercentage = totalTokens > 0 ? ((totalTokens / CS) * 100) : 0;
        const multiplier = calculatorState.multiplier || 1.0;
        
        const userTotalTokens = document.getElementById('userTotalTokens');
        const userTokenPercentage = document.getElementById('userTokenPercentage');
        const userTotalWS = document.getElementById('userTotalWS');
        const userAvgAge = document.getElementById('userAvgAge');
        const userMultiplier = document.getElementById('userMultiplier');
        
        if (userTotalTokens) {
            userTotalTokens.textContent = formatNumber(totalTokens);
            userTotalTokens.style.color = totalTokens > 1000000 ? 'var(--rebel-gold)' : '#ffffff';
        }
        
        if (userTokenPercentage) {
            userTokenPercentage.textContent = `${tokenPercentage.toFixed(4)}% of CS`;
            if (tokenPercentage >= 1) {
                userTokenPercentage.style.color = '#4CAF50';
            } else if (tokenPercentage >= 0.1) {
                userTokenPercentage.style.color = '#FFC107';
            } else {
                userTokenPercentage.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        }
        
        if (userTotalWS) {
            userTotalWS.textContent = formatNumber(totalWSWithMultiplier, true);
            userTotalWS.style.color = totalWSWithMultiplier > totalTokens * 1.5 ? 'var(--rebel-gold)' : '#ffffff';
        }
        
        if (userAvgAge) {
            userAvgAge.textContent = avgAge.toFixed(1);
            userAvgAge.style.color = avgAge >= 10 ? '#4CAF50' : avgAge >= 5 ? '#FFC107' : '#ffffff';
        }
        
        if (userMultiplier) {
            userMultiplier.textContent = `${multiplier.toFixed(2)}x`;
            userMultiplier.style.color = multiplier > 1.0 ? '#ffcc00' : '#ffffff';
        }
        
        statsContainer.style.display = totalTokens > 0 ? 'block' : 'none';
    }
}

function updateWSInfoDisplay() {
    const yourTokensDisplay = document.getElementById('yourTokensDisplay');
    const yourWSDisplay = document.getElementById('yourWSDisplay');
    
    if (yourTokensDisplay) {
        yourTokensDisplay.textContent = formatNumber(calculatorState.totalUserTokens);
    }
    
    if (yourWSDisplay) {
        yourWSDisplay.textContent = formatNumber(calculatorState.totalUserWS, true);
        yourWSDisplay.style.color = calculatorState.multiplier > 1.0 ? '#ffcc00' : 'var(--rebel-gold)';
    }
}

// ========== OTHER PARTICIPANTS FUNCTIONS ==========
function addOtherParticipantBatch(amount = '', age = '') {
    const table = document.querySelector('#other-participants-table tbody');
    if (!table) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <input type="number" class="other-batch-amount" value="${amount}" placeholder="Amount" 
                   oninput="updateOtherRowCalculations(this)" min="0" step="1000">
            <div class="input-hint">Other participant's tokens</div>
        </td>
        <td>
            <input type="number" class="other-batch-age" value="${age}" placeholder="Age" 
                   oninput="updateOtherRowCalculations(this)" min="0" max="20" step="1">
            <div class="input-hint">Epochs (0-20)</div>
        </td>
        <td class="other-batch-factor" style="color: var(--rebel-blue); font-weight: bold; text-align: center;">1.00</td>
        <td class="other-batch-ws" style="color: var(--rebel-blue); font-weight: bold; text-align: center;">0</td>
        <td style="text-align: center;">
            <button onclick="removeOtherParticipantBatch(this)" class="batch-btn">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    table.appendChild(row);
    
    if (amount || age) {
        setTimeout(() => updateOtherRowCalculations(row.querySelector('.other-batch-amount')), 10);
    }
    
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    setTimeout(() => {
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }, 10);
}

function removeOtherParticipantBatch(button) {
    const row = button.closest('tr');
    if (row) {
        row.style.transform = 'translateX(-100%)';
        row.style.opacity = '0';
        
        setTimeout(() => {
            row.remove();
            
            if (calculatorState.participantType === 'detailed') {
                calculateDetailedBatchesWS();
                updateOtherParticipantsSummary();
            }
            
            const table = document.querySelector('#other-participants-table tbody');
            if (table && table.children.length === 0) {
                addOtherParticipantBatch();
            }
        }, 300);
    }
}

function clearOtherParticipantBatches() {
    const table = document.querySelector('#other-participants-table tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length === 0) return;
    
    if (!confirm('Are you sure you want to clear all other participant batches?')) {
        return;
    }
    
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.style.transform = 'translateX(100%)';
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 300);
        }, index * 50);
    });
    
    setTimeout(() => {
        addOtherParticipantBatch();
        updateOtherParticipantsSummary();
        showToast('Other participant batches cleared', 'info');
    }, rows.length * 50 + 300);
}

function updateOtherRowCalculations(input) {
    const row = input.closest('tr');
    if (!row) return;
    
    const amount = parseFloat(row.querySelector('.other-batch-amount').value) || 0;
    const age = parseFloat(row.querySelector('.other-batch-age').value) || 0;
    
    if (amount < 0) {
        row.querySelector('.other-batch-amount').value = 0;
        return;
    }
    if (age < 0) {
        row.querySelector('.other-batch-age').value = 0;
        return;
    }
    if (age > 20) {
        row.querySelector('.other-batch-age').value = 20;
    }
    
    // Weight factor: 1 + 0.07 × min(Age, 20) - NO LOYALTY BONUS
    const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
    const weightedShare = amount * weightFactor;
    
    const factorCell = row.querySelector('.other-batch-factor');
    const wsCell = row.querySelector('.other-batch-ws');
    
    if (factorCell) {
        factorCell.textContent = weightFactor.toFixed(2);
        factorCell.style.color = weightFactor > 1 ? 'var(--rebel-blue)' : '#ffffff';
        factorCell.style.fontWeight = weightFactor > 1 ? 'bold' : 'normal';
    }
    
    if (wsCell) {
        wsCell.textContent = formatNumber(weightedShare, true);
        wsCell.style.color = 'var(--rebel-blue)';
        wsCell.style.fontWeight = 'bold';
    }
    
    calculateDetailedBatchesWS();
    updateOtherParticipantsSummary();
    
    if (!calculatorState.isCalculating) {
        calculatorState.isCalculating = true;
        setTimeout(() => {
            calculateRewards();
            calculatorState.isCalculating = false;
        }, 300);
    }
}

function calculateDetailedBatchesWS() {
    if (calculatorState.participantType !== 'detailed') return;
    
    const rows = document.querySelectorAll('#other-participants-table tbody tr');
    let totalTokens = 0;
    let totalWS = 0;
    let totalWeightedAge = 0;
    
    rows.forEach((row) => {
        const amountInput = row.querySelector('.other-batch-amount');
        const ageInput = row.querySelector('.other-batch-age');
        
        if (!amountInput || !ageInput) return;
        
        const amount = parseFloat(amountInput.value) || 0;
        const age = parseFloat(ageInput.value) || 0;
        
        if (amount > 0) {
            const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
            const weightedShare = amount * weightFactor;
            
            totalTokens += amount;
            totalWS += weightedShare;
            totalWeightedAge += amount * age;
        }
    });
    
    calculatorState.otherTokens = totalTokens;
    calculatorState.otherWS = totalWS;
    calculatorState.otherAvgAge = totalTokens > 0 ? (totalWeightedAge / totalTokens) : 0;
    calculatorState.otherAvgBonus = totalTokens > 0 ? (totalWS / totalTokens) : 1.0;
}

function updateOtherParticipantsSummary() {
    const otherTotalTokens = document.getElementById('otherTotalTokens');
    const otherAvgAge = document.getElementById('otherAvgAge');
    const otherAvgBonus = document.getElementById('otherAvgBonus');
    const otherTotalWS = document.getElementById('otherTotalWS');
    
    if (otherTotalTokens) {
        otherTotalTokens.textContent = formatNumber(calculatorState.otherTokens);
    }
    if (otherAvgAge) {
        otherAvgAge.textContent = calculatorState.otherAvgAge.toFixed(1);
    }
    if (otherAvgBonus) {
        otherAvgBonus.textContent = calculatorState.otherAvgBonus.toFixed(2) + 'x';
        if (calculatorState.otherAvgBonus >= 2.0) {
            otherAvgBonus.style.color = '#4CAF50';
        } else if (calculatorState.otherAvgBonus >= 1.5) {
            otherAvgBonus.style.color = '#FFC107';
        } else if (calculatorState.otherAvgBonus > 1.0) {
            otherAvgBonus.style.color = '#ffffff';
        } else {
            otherAvgBonus.style.color = '#ff3366';
        }
    }
    if (otherTotalWS) {
        otherTotalWS.textContent = formatNumber(calculatorState.otherWS);
    }
    
    updateParticipationDisplay();
}

// ========== SUMMARY MODE FUNCTIONS ==========
function updateSummaryOther() {
    if (calculatorState.participantType !== 'summary') return;
    
    const totalTokens = parseInt(document.getElementById('summaryOtherTokens').value) || 0;
    const avgAge = parseInt(document.getElementById('summaryOtherAge').value) || 0;
    
    const summaryOtherTokensValue = document.getElementById('summaryOtherTokensValue');
    const summaryOtherAgeValue = document.getElementById('summaryOtherAgeValue');
    
    if (summaryOtherTokensValue) summaryOtherTokensValue.textContent = formatNumber(totalTokens);
    if (summaryOtherAgeValue) summaryOtherAgeValue.textContent = avgAge;
    
    const weightFactor = 1 + (K * Math.min(avgAge, MAX_AGE));
    const totalWS = totalTokens * weightFactor;
    
    calculatorState.otherTokens = totalTokens;
    calculatorState.otherWS = totalWS;
    calculatorState.otherAvgAge = avgAge;
    calculatorState.otherAvgBonus = weightFactor;
    
    updateOtherParticipantsSummary();
}

// ========== EXAMPLE FUNCTIONS ==========
function addExampleOtherParticipants() {
    clearOtherParticipantBatches();
    
    setTimeout(() => {
        addOtherParticipantBatch('50000000', '3');
        addOtherParticipantBatch('30000000', '8');
        addOtherParticipantBatch('20000000', '12');
        addOtherParticipantBatch('10000000', '18');
        addOtherParticipantBatch('5000000', '20');
        
        showToast('Added example other participant batches', 'success');
    }, 300);
}

// ========== PARTICIPATION CALCULATIONS ==========
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

function updateParticipationDisplay() {
    const totalTokens = calculatorState.totalUserTokens + calculatorState.otherTokens;
    const totalWS = calculatorState.totalUserWS + calculatorState.otherWS;
    
    calculatorState.currentParticipatingTokens = totalTokens;
    calculatorState.currentTotalWS = totalWS;
    
    const totalTokensDisplay = document.getElementById('totalTokensDisplay');
    const totalWSDisplay = document.getElementById('totalWSDisplay');
    
    if (totalTokensDisplay) {
        totalTokensDisplay.textContent = formatNumber(totalTokens);
    }
    if (totalWSDisplay) {
        totalWSDisplay.textContent = formatNumber(totalWS);
    }
    
    const gammaData = calculateGammaScale(totalTokens, totalWS);
    const gamma = gammaData.gamma;
    
    const gammaValue = document.getElementById('gammaValue');
    const gammaDisplay = document.getElementById('gammaValueDisplay');
    
    if (gammaValue) gammaValue.textContent = gamma.toFixed(2);
    if (gammaDisplay) gammaDisplay.textContent = gamma.toFixed(2);
    
    const gammaColor = getGammaColor(gamma);
    if (gammaValue) gammaValue.style.color = gammaColor;
    if (gammaDisplay) gammaDisplay.style.color = gammaColor;
    
    const markerPosition = 40 + (gamma - 0.4) * (100 / 0.6);
    const marker = document.getElementById('gammaMarker');
    if (marker) {
        marker.style.left = `${Math.min(100, Math.max(40, markerPosition))}%`;
    }
    
    const participationTermEl = document.getElementById('participationTerm');
    const inflationCapEl = document.getElementById('inflationCap');
    const minTermEl = document.getElementById('minTerm');
    const maxTermEl = document.getElementById('maxTerm');
    
    if (participationTermEl) participationTermEl.textContent = gammaData.participationTerm.toFixed(2);
    if (inflationCapEl) inflationCapEl.textContent = gammaData.inflationCap.toFixed(2);
    if (minTermEl) minTermEl.textContent = gammaData.minTerm.toFixed(2);
    if (maxTermEl) maxTermEl.textContent = gammaData.gamma.toFixed(2);
    
    updateGammaInfoPanel(gamma);
    updateContributionPercentage();
}

function updateGammaInfoPanel(gamma) {
    const gammaInfoPanel = document.getElementById('gammaInfoPanel');
    if (!gammaInfoPanel) return;
    
    const P = calculatorState.currentParticipatingTokens;
    const totalWS = calculatorState.currentTotalWS;
    const participationTerm = P / (0.5 * CS);
    const inflationCapTerm = (CS * 1.5) / totalWS;
    const minTerm = Math.min(1, participationTerm, inflationCapTerm);
    
    let panelClass, panelTitle, panelText, capNote = '';
    
    if (gamma >= 1) {
        panelClass = 'high';
        panelTitle = 'Maximum Rewards (γ = 1.00)';
        panelText = 'Gamma Scale is at maximum! 100% of weekly pool is distributed. Ideal participation level reached.';
    } else if (gamma >= 0.8) {
        panelClass = 'high';
        panelTitle = `High Participation (γ = ${gamma.toFixed(2)})`;
        panelText = 'Excellent participation! Close to unlocking maximum rewards. Keep encouraging participation!';
    } else if (gamma >= 0.6) {
        panelClass = 'medium';
        panelTitle = `Good Participation (γ = ${gamma.toFixed(2)})`;
        panelText = 'Good participation level. Rewards are scaling up with increased community activity.';
    } else {
        panelClass = 'low';
        panelTitle = `Low Gamma (γ = ${gamma.toFixed(2)})`;
        
        if (participationTerm < inflationCapTerm) {
            panelText = `Low participation: P/(0.5×CS) = ${participationTerm.toFixed(2)}. Need ${(0.5 * CS).toLocaleString()} tokens to reach 50% participation.`;
            capNote = `Current participating tokens: ${P.toLocaleString()}`;
        } else if (inflationCapTerm < participationTerm) {
            panelText = `Age inflation cap active: CS×1.5/∑WS = ${inflationCapTerm.toFixed(2)}. Weighted shares (∑WS) are limiting Gamma.`;
            capNote = `∑WS = ${totalWS.toLocaleString()} | Max allowed: ${(1.5 * CS).toLocaleString()}`;
        } else {
            panelText = 'Gamma is at minimum (40%). Increase participating tokens or reduce weighted shares to unlock higher rewards.';
        }
    }
    
    gammaInfoPanel.className = `gamma-info-panel ${panelClass}`;
    gammaInfoPanel.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <i class="fas fa-info-circle"></i>
            <strong>${panelTitle}</strong>
        </div>
        <p style="margin: 0; font-size: 12px;">${panelText}</p>
        ${capNote ? `<p style="margin: 5px 0 0 0; font-size: 11px; color: rgba(255, 255, 255, 0.6);"><i class="fas fa-chart-line"></i> ${capNote}</p>` : ''}
        <p style="margin: 8px 0 0 0; font-size: 11px; color: rgba(212, 167, 106, 0.8); border-top: 1px solid rgba(212, 167, 106, 0.2); padding-top: 6px;">
            <i class="fas fa-info-circle"></i> <strong>Age Bonus:</strong> +7% per epoch (max +140% at 20 epochs).
            <i class="fas fa-trophy"></i> <strong>Collector Multiplier:</strong> +0.05x per collectible, +0.1x for largest holder.
            <i class="fas fa-chart-line"></i> <strong>Age Cap:</strong> CS×1.5/∑WS prevents excessive age bonus inflation.
        </p>
    `;
}

function updateContributionPercentage() {
    const userTokens = calculatorState.totalUserTokens;
    const participatingTokens = calculatorState.currentParticipatingTokens;
    const userWS = calculatorState.totalUserWS;
    const totalWS = calculatorState.currentTotalWS;
    
    let contributionContainer = document.getElementById('contributionContainer');
    
    if (!contributionContainer && userTokens > 0) {
        const participationSection = document.querySelector('.participation-settings .gamma-visualization');
        if (!participationSection) return;
        
        contributionContainer = document.createElement('div');
        contributionContainer.id = 'contributionContainer';
        contributionContainer.className = 'contribution-container';
        contributionContainer.style.display = 'none';
        contributionContainer.innerHTML = `
            <div class="contribution-header">
                <i class="fas fa-user-check"></i> Your Contribution
            </div>
            <div class="contribution-grid">
                <div class="contribution-item">
                    <div class="contribution-label">Token Share</div>
                    <div id="tokenContribution" class="contribution-value">0%</div>
                    <div class="contribution-bar">
                        <div id="tokenBar" class="bar-fill" style="width: 0%"></div>
                    </div>
                </div>
                <div class="contribution-item">
                    <div class="contribution-label">Weighted Share (with Multiplier)</div>
                    <div id="wsContribution" class="contribution-value">0%</div>
                    <div class="contribution-bar">
                        <div id="wsBar" class="bar-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
        
        participationSection.parentNode.insertBefore(contributionContainer, participationSection.nextSibling);
    }
    
    if (contributionContainer && userTokens > 0) {
        const tokenPercentage = participatingTokens > 0 ? (userTokens / participatingTokens * 100) : 0;
        const wsPercentage = totalWS > 0 ? (userWS / totalWS * 100) : 0;
        
        const tokenContribution = document.getElementById('tokenContribution');
        const wsContribution = document.getElementById('wsContribution');
        const tokenBar = document.getElementById('tokenBar');
        const wsBar = document.getElementById('wsBar');
        
        if (tokenContribution) {
            const displayPercentage = Math.min(100, tokenPercentage.toFixed(1));
            tokenContribution.textContent = `${displayPercentage}%`;
            tokenContribution.style.color = tokenPercentage >= 50 ? '#4CAF50' : tokenPercentage >= 20 ? '#FFC107' : '#ffffff';
        }
        
        if (wsContribution) {
            const displayPercentage = Math.min(100, wsPercentage.toFixed(1));
            wsContribution.textContent = `${displayPercentage}%`;
            wsContribution.style.color = wsPercentage >= 50 ? '#4CAF50' : wsPercentage >= 20 ? '#FFC107' : '#ffffff';
        }
        
        if (tokenBar) {
            tokenBar.style.width = `${Math.min(100, tokenPercentage)}%`;
            tokenBar.style.background = tokenPercentage >= 50 ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' :
                                       tokenPercentage >= 20 ? 'linear-gradient(90deg, #FFC107, #FF9800)' :
                                       'linear-gradient(90deg, var(--rebel-red), var(--rebel-gold))';
        }
        
        if (wsBar) {
            wsBar.style.width = `${Math.min(100, wsPercentage)}%`;
            wsBar.style.background = wsPercentage >= 50 ? 'linear-gradient(90deg, #4CAF50, #8BC34A)' :
                                     wsPercentage >= 20 ? 'linear-gradient(90deg, #FFC107, #FF9800)' :
                                     'linear-gradient(90deg, var(--rebel-red), var(--rebel-gold))';
        }
        
        contributionContainer.style.display = 'block';
    } else if (contributionContainer) {
        contributionContainer.style.display = 'none';
    }
}

// ========== REWARD CALCULATION ==========
function calculateRewards() {
    if (calculatorState.isCalculating) return;
    calculatorState.isCalculating = true;
    
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.classList.add('loading');
        calculateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CALCULATING EPOCH REWARDS...';
    }
    
    setTimeout(() => {
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
        
        // Apply collector multiplier to user WS
        const multiplier = calculatorState.multiplier || 1.0;
        userWS = userWS * multiplier;
        
        const participatingTokens = calculatorState.currentParticipatingTokens;
        const totalWS = calculatorState.currentTotalWS;
        
        const gammaData = calculateGammaScale(participatingTokens, totalWS);
        const gamma = gammaData.gamma;
        
        const userShare = totalWS > 0 ? (userWS / totalWS) : 0;
        const userReward = userShare * WERP * gamma;
        const effectivePool = WERP * gamma;
        
        const resultElement = document.getElementById('reward-result');
        if (!resultElement) {
            calculatorState.isCalculating = false;
            return;
        }
        
        if (userWS <= 0 || batchData.length === 0 || totalAmount <= 0) {
            resultElement.innerHTML = `
                <div style="text-align: center;">
                    <i class="fas fa-calculator" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Please enter valid token batches to calculate your $REBL epoch rewards!</p>
                    <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-top: 0.5rem;">
                        Try loading an example or adding your own token batches.
                    </p>
                </div>
            `;
            resultElement.className = 'reward-result';
            hideChart();
            
            if (calculateButton) {
                calculateButton.classList.remove('loading');
                calculateButton.innerHTML = '<i class="fas fa-calculator"></i> CALCULATE YOUR $REBL REWARDS';
            }
            
            calculatorState.isCalculating = false;
            return;
        }
        
        const poolPercentage = (userShare * 100).toFixed(4);
        const returnPercentage = ((userReward / totalAmount) * 100).toFixed(4);
        const monthlyReward = userReward * 4.33;
        const annualReward = userReward * 52;
        
        let totalWeightedAge = 0;
        rows.forEach(row => {
            const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
            const age = parseFloat(row.querySelector('.batch-age').value) || 0;
            totalWeightedAge += amount * age;
        });
        
        const userAvgAge = totalAmount > 0 ? (totalWeightedAge / totalAmount) : 0;
        const userAvgBonus = totalAmount > 0 ? (userWS / totalAmount) : 1.0;
        
        const otherTokens = participatingTokens - calculatorState.totalUserTokens;
        const otherWS = totalWS - userWS;
        const otherAvgBonus = otherTokens > 0 ? (otherWS / otherTokens) : 0;
        
        const resultHTML = `
            <div style="text-align: left;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Your Total Tokens:</strong></span>
                    <span style="color: var(--rebel-gold); font-weight: bold;">${formatNumber(totalAmount)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Your Average Age:</strong></span>
                    <span style="color: var(--rebel-gold); font-weight: bold;">${userAvgAge.toFixed(1)} epochs</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Your Average Bonus:</strong></span>
                    <span style="color: var(--rebel-gold); font-weight: bold;">${userAvgBonus.toFixed(2)}x</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Collector Multiplier:</strong></span>
                    <span style="color: #ffcc00; font-weight: bold;">${multiplier.toFixed(2)}x</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Your Weighted Share (WSᵢ):</strong></span>
                    <span style="color: var(--rebel-gold); font-weight: bold;">${formatNumber(userWS)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Total Participating Tokens (P):</strong></span>
                    <span style="color: var(--rebel-gold); font-weight: bold;">${formatNumber(participatingTokens)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Total Weighted Shares (∑WS):</strong></span>
                    <span style="color: var(--rebel-gold); font-weight: bold;">${formatNumber(totalWS)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Your Share of Pool:</strong></span>
                    <span style="color: var(--rebel-gold); font-weight: bold;">${poolPercentage}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Gamma Scale Factor (γ):</strong></span>
                    <span style="color: ${getGammaColor(gamma)}; font-weight: bold;">${gamma.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Effective Weekly Pool:</strong></span>
                    <span style="color: var(--rebel-red); font-weight: bold;">${formatNumber(effectivePool)} $REBL</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                    <span><strong>Weekly Return:</strong></span>
                    <span style="color: var(--rebel-gold); font-weight: bold;">${returnPercentage}%</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; font-size: 1.3em; margin-top: 1em; padding-top: 1em; border-top: 3px solid rgba(255, 204, 0, 0.7); background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 8px;">
                    <span style="font-weight: 800;"><strong>Your Epoch Reward:</strong></span>
                    <span style="color: var(--rebel-red); font-weight: 800; text-shadow: 0 0 10px rgba(255, 51, 102, 0.5); font-size: 1.4em;">
                        ${formatNumber(userReward, true)} $REBL
                    </span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-top: 0.5em; font-size: 0.9em; color: rgba(255, 255, 255, 0.7); padding: 0 5px;">
                    <span><em>Based on ${formatNumber(participatingTokens)} participating tokens with γ=${gamma.toFixed(2)}</em></span>
                    <span><em>Formula: (${formatNumber(userWS)} / ${formatNumber(totalWS)}) × ${formatNumber(WERP)} × ${gamma.toFixed(2)}</em></span>
                </div>
                
                <div style="margin-top: 1em; padding: 1em; background: rgba(0, 0, 0, 0.3); border-radius: 8px; border-left: 4px solid var(--rebel-blue);">
                    <div style="font-weight: 600; color: var(--rebel-blue); margin-bottom: 0.5em;">
                        <i class="fas fa-users"></i> Other Participants Summary
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.9em;">
                        <div>
                            <div style="font-size: 0.8em; color: rgba(255, 255, 255, 0.7);">Total Other Tokens</div>
                            <div style="color: var(--rebel-blue); font-weight: bold;">${formatNumber(otherTokens)}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.8em; color: rgba(255, 255, 255, 0.7);">Average Age</div>
                            <div style="color: var(--rebel-blue); font-weight: bold;">${Math.max(0, (otherAvgBonus - 1) / K).toFixed(1)} epochs</div>
                        </div>
                        <div>
                            <div style="font-size: 0.8em; color: rgba(255, 255, 255, 0.7);">Average Bonus</div>
                            <div style="color: var(--rebel-blue); font-weight: bold;">${otherAvgBonus.toFixed(2)}x</div>
                        </div>
                        <div>
                            <div style="font-size: 0.8em; color: rgba(255, 255, 255, 0.7);">Total Other WS</div>
                            <div style="color: var(--rebel-blue); font-weight: bold;">${formatNumber(otherWS)}</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 1em; padding-top: 1em; border-top: 1px dashed rgba(255, 255, 255, 0.2);">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.9em;">
                        <div style="text-align: center; background: rgba(0, 0, 0, 0.3); padding: 8px; border-radius: 6px;">
                            <div style="font-size: 0.8em; color: rgba(255, 255, 255, 0.7);">Monthly Estimate*</div>
                            <div style="color: var(--rebel-gold); font-weight: bold;">${formatNumber(monthlyReward, true)} $REBL</div>
                        </div>
                        <div style="text-align: center; background: rgba(0, 0, 0, 0.3); padding: 8px; border-radius: 6px;">
                            <div style="font-size: 0.8em; color: rgba(255, 255, 255, 0.7);">Annual Estimate*</div>
                            <div style="color: var(--rebel-gold); font-weight: bold;">${formatNumber(annualReward, true)} $REBL</div>
                        </div>
                    </div>
                    <div style="font-size: 0.7em; color: rgba(255, 255, 255, 0.5); margin-top: 5px; text-align: center;">
                        *Estimates assume same participation levels continue
                    </div>
                </div>
            </div>
        `;
        
        resultElement.innerHTML = resultHTML;
        resultElement.className = 'reward-result';
        
        updateChart(batchData, userWS);
        
        if (calculateButton) {
            calculateButton.classList.remove('loading');
            calculateButton.innerHTML = '<i class="fas fa-calculator"></i> CALCULATE YOUR $REBL REWARDS';
        }
        
        calculatorState.isCalculating = false;
        showToast('Rewards calculated successfully!', 'success');
    }, 800);
}

// ========== WHAT-IF GAMMA SIMULATOR ==========
function updateWhatIfGamma() {
    const participating = parseInt(document.getElementById('whatIfParticipating').value) || 100000000;
    const totalWS = parseInt(document.getElementById('whatIfTotalWS').value) || 100000000;
    
    const whatIfParticipatingValue = document.getElementById('whatIfParticipatingValue');
    const whatIfTotalWSValue = document.getElementById('whatIfTotalWSValue');
    
    if (whatIfParticipatingValue) whatIfParticipatingValue.textContent = formatNumber(participating);
    if (whatIfTotalWSValue) whatIfTotalWSValue.textContent = formatNumber(totalWS);
    
    const gammaData = calculateGammaScale(participating, totalWS);
    const gamma = gammaData.gamma;
    
    const gammaResult = document.getElementById('gammaScaleResult');
    if (gammaResult) {
        gammaResult.textContent = `γ = ${gamma.toFixed(2)}`;
        gammaResult.style.color = getGammaColor(gamma);
    }
    
    const effectiveDistribution = WERP * gamma;
    const effectiveElement = document.getElementById('effectiveDistribution');
    if (effectiveElement) {
        effectiveElement.textContent = formatNumber(effectiveDistribution, false) + ' $REBL';
        effectiveElement.style.color = getGammaColor(gamma);
    }
    
    const markerPosition = 40 + (gamma - 0.4) * (100 / 0.6);
    const marker = document.getElementById('whatIfGammaMarker');
    if (marker) {
        marker.style.left = `${Math.min(100, Math.max(40, markerPosition))}%`;
    }
    
    const targetParticipation = (0.5 * CS);
    const targetElement = document.getElementById('targetParticipation');
    if (targetElement) {
        targetElement.textContent = `${formatNumber(targetParticipation)} (50% CS)`;
    }
    
    const breakdownElement = document.getElementById('gammaBreakdown');
    if (breakdownElement) {
        breakdownElement.innerHTML = `
            γ = MAX(0.4, MIN(1, 
            <span style="color: #ff3366;">${gammaData.participationTerm.toFixed(2)}</span>, 
            <span style="color: #ffcc00;">${gammaData.inflationCap.toFixed(2)}</span>)) = 
            <span style="color: ${getGammaColor(gamma)}; font-weight: bold;">${gamma.toFixed(2)}</span>
        `;
    }
}

// ========== EXAMPLE CASES ==========
function loadExampleCase(type) {
    clearTokenBatches();
    
    // Set multiplier defaults based on example type
    let collectibles = 0;
    let largestHolderCount = 0;
    
    switch(type) {
        case 'starter':
            collectibles = 2;
            largestHolderCount = 0;
            break;
        case 'investor':
            collectibles = 8;
            largestHolderCount = 3;
            break;
        case 'whale':
            collectibles = 25;
            largestHolderCount = 12;
            break;
        default:
            collectibles = 1;
            largestHolderCount = 0;
    }
    
    // Set multiplier inputs
    const collectiblesInput = document.getElementById('collectiblesCount');
    const largestHolderInput = document.getElementById('largestHolderCount');
    
    if (collectiblesInput) collectiblesInput.value = collectibles;
    if (largestHolderInput) largestHolderInput.value = largestHolderCount;
    
    calculatorState.collectiblesCount = collectibles;
    calculatorState.largestHolderCount = largestHolderCount;
    updateMultiplier();
    
    setTimeout(() => {
        switch(type) {
            case 'starter':
                addTokenBatch('50000', '3');
                addTokenBatch('100000', '8');
                addTokenBatch('25000', '1');
                
                clearOtherParticipantBatches();
                setTimeout(() => {
                    addOtherParticipantBatch('20000000', '2');
                    addOtherParticipantBatch('30000000', '5');
                    addOtherParticipantBatch('25000000', '8');
                    addOtherParticipantBatch('15000000', '12');
                    addOtherParticipantBatch('10000000', '15');
                }, 100);
                break;
                
            case 'investor':
                addTokenBatch('500000', '5');
                addTokenBatch('1000000', '10');
                addTokenBatch('750000', '15');
                addTokenBatch('250000', '2');
                
                clearOtherParticipantBatches();
                setTimeout(() => {
                    addOtherParticipantBatch('50000000', '3');
                    addOtherParticipantBatch('40000000', '7');
                    addOtherParticipantBatch('30000000', '10');
                    addOtherParticipantBatch('20000000', '14');
                    addOtherParticipantBatch('10000000', '18');
                }, 100);
                break;
                
            case 'whale':
                addTokenBatch('2000000', '8');
                addTokenBatch('3000000', '12');
                addTokenBatch('5000000', '18');
                addTokenBatch('1000000', '20');
                addTokenBatch('500000', '6');
                
                clearOtherParticipantBatches();
                setTimeout(() => {
                    addOtherParticipantBatch('80000000', '4');
                    addOtherParticipantBatch('60000000', '8');
                    addOtherParticipantBatch('40000000', '12');
                    addOtherParticipantBatch('30000000', '16');
                    addOtherParticipantBatch('20000000', '20');
                }, 100);
                break;
                
            default:
                addTokenBatch('100000', '1');
        }
        
        const resultElement = document.getElementById('reward-result');
        if (resultElement) {
            const multiplier = calculatorState.multiplier || 1.0;
            resultElement.innerHTML = `
                <div style="text-align: center; margin-bottom: var(--spacing-sm);">
                    <span style="color: var(--rebel-gold); font-weight: bold; font-size: 1.2rem;">
                        <i class="fas fa-user-check"></i> ${type.charAt(0).toUpperCase() + type.slice(1)} Example Loaded
                    </span>
                    <span style="display: block; font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">
                        Multiplier: ${multiplier.toFixed(2)}x (${collectibles} collectibles${largestHolderCount > 0 ? `, ${largestHolderCount} largest holder${largestHolderCount > 1 ? 's' : ''}` : ''})
                    </span>
                </div>
                <p style="text-align: center; color: var(--rebel-gold); font-size: 0.9rem;">
                    Adjust other participants and click "Calculate Your $REBL epoch rewards" to see results!
                </p>
                <div style="display: flex; justify-content: center; gap: var(--spacing-sm); margin-top: var(--spacing-sm);">
                    <button onclick="calculateRewards()" style="background: var(--rebel-gold); color: black; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">
                        <i class="fas fa-calculator"></i> Calculate Now
                    </button>
                </div>
            `;
            resultElement.className = 'reward-result';
        }
        
        setTimeout(() => calculateRewards(), 800);
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} example loaded with ${calculatorState.multiplier.toFixed(2)}x multiplier`, 'success');
    }, 500);
}

// ========== SIMULATOR PRESETS ==========
function setSimulatorPreset(type) {
    let participating, totalWS;
    
    switch(type) {
        case 'current':
            participating = calculatorState.currentParticipatingTokens;
            totalWS = calculatorState.currentTotalWS;
            break;
        case 'half':
            participating = 249621023;
            totalWS = 374431535;
            break;
        case 'full':
            participating = 499242047;
            totalWS = 748863070;
            break;
        default:
            return;
    }
    
    const participatingInput = document.getElementById('whatIfParticipatingInput');
    const participatingSlider = document.getElementById('whatIfParticipating');
    const totalWSInput = document.getElementById('whatIfTotalWSInput');
    const totalWSSlider = document.getElementById('whatIfTotalWS');
    
    if (participatingInput) participatingInput.value = participating;
    if (participatingSlider) participatingSlider.value = participating;
    if (totalWSInput) totalWSInput.value = totalWS;
    if (totalWSSlider) totalWSSlider.value = totalWS;
    
    updateWhatIfGamma();
    showToast(`Simulator preset: ${type}`, 'info');
}

// ========== CHART FUNCTIONS ==========
function setupChartPlaceholder() {
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const canvas = document.getElementById('rewardChart');
    
    if (chartPlaceholder) chartPlaceholder.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
}

function updateChart(batchData, totalUserWS) {
    const ctx = document.getElementById('rewardChart');
    if (!ctx) return;
    
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const canvas = document.getElementById('rewardChart');
    
    if (chartPlaceholder) chartPlaceholder.style.display = 'none';
    if (canvas) canvas.style.display = 'block';
    
    if (rewardChart) {
        rewardChart.destroy();
    }
    
    const labels = batchData.map((batch, index) => `Batch ${index + 1}`);
    const weightedShares = batchData.map(batch => batch.ws);
    
    const backgroundColors = [
        'rgba(255, 51, 102, 0.9)',
        'rgba(255, 204, 0, 0.9)',
        'rgba(0, 170, 255, 0.9)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(76, 175, 80, 0.9)',
        'rgba(255, 152, 0, 0.9)',
        'rgba(33, 150, 243, 0.9)',
        'rgba(233, 30, 99, 0.9)'
    ];
    
    const borderColors = [
        'rgb(255, 51, 102)',
        'rgb(255, 204, 0)',
        'rgb(0, 170, 255)',
        'rgb(156, 39, 176)',
        'rgb(76, 175, 80)',
        'rgb(255, 152, 0)',
        'rgb(33, 150, 243)',
        'rgb(233, 30, 99)'
    ];
    
    rewardChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: weightedShares,
                backgroundColor: backgroundColors.slice(0, weightedShares.length),
                borderColor: borderColors.slice(0, weightedShares.length),
                borderWidth: 3,
                hoverBackgroundColor: backgroundColors.slice(0, weightedShares.length).map(color => 
                    color.replace('0.9', '1')
                ),
                hoverBorderColor: 'white',
                hoverBorderWidth: 4,
                hoverOffset: 25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    display: true,
                    labels: {
                        color: 'rgb(255, 255, 255)',
                        padding: 15,
                        font: {
                            family: 'Montserrat, sans-serif',
                            size: 12,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    titleColor: 'var(--rebel-gold)',
                    bodyColor: 'white',
                    borderColor: 'var(--rebel-gold)',
                    borderWidth: 2,
                    cornerRadius: 8,
                    padding: 16,
                    titleFont: {
                        family: 'Montserrat, sans-serif',
                        size: 13,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: 'Montserrat, sans-serif',
                        size: 12
                    },
                    callbacks: {
                        label: function(context) {
                            const batch = batchData[context.dataIndex];
                            const percentage = ((batch.ws / totalUserWS) * 100).toFixed(1);
                            return [
                                `Amount: ${batch.amount.toLocaleString()} $rebelinux`,
                                `Age: ${batch.age} epochs`,
                                `Factor: ${(1 + (0.07 * Math.min(batch.age, 20))).toFixed(2)}x`,
                                `Weighted Share: ${batch.ws.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`,
                                `Share: ${percentage}% of your total WS`
                            ];
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1200,
                easing: 'easeOutQuart'
            },
            cutout: '60%',
            radius: '90%',
            interaction: {
                intersect: false,
                mode: 'index'
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function(chart) {
                const ctx = chart.ctx;
                const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fill();
                ctx.strokeStyle = 'var(--rebel-gold)';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                ctx.font = 'bold 14px Montserrat';
                ctx.fillStyle = 'var(--rebel-gold)';
                ctx.fillText('YOUR WEIGHTED SHARE', centerX, centerY - 35);
                
                ctx.font = '600 10px Montserrat';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fillText('Total WS = Σ(Tokens × Age Bonus) × Multiplier', centerX, centerY - 18);
                
                ctx.beginPath();
                ctx.moveTo(centerX - 40, centerY - 5);
                ctx.lineTo(centerX + 40, centerY - 5);
                ctx.strokeStyle = 'rgba(212, 167, 106, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                const formattedWS = formatNumber(totalUserWS, true);
                ctx.font = 'bold 24px Montserrat';
                ctx.fillStyle = 'white';
                ctx.fillText(formattedWS, centerX, centerY + 12);
                
                ctx.font = 'bold 12px Montserrat';
                ctx.fillStyle = 'var(--rebel-gold)';
                ctx.fillText('WS UNITS', centerX, centerY + 30);
                
                ctx.beginPath();
                ctx.moveTo(centerX - 40, centerY + 40);
                ctx.lineTo(centerX + 40, centerY + 40);
                ctx.strokeStyle = 'rgba(212, 167, 106, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.font = '600 10px Montserrat';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                const multiplier = calculatorState.multiplier || 1.0;
                ctx.fillText(`${batchData.length} token batches × ${multiplier.toFixed(2)}x multiplier`, centerX, centerY + 52);
                
                ctx.restore();
            }
        }]
    });
}

function hideChart() {
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const canvas = document.getElementById('rewardChart');
    
    if (chartPlaceholder) chartPlaceholder.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
    
    if (rewardChart) {
        rewardChart.destroy();
        rewardChart = null;
    }
}

// ========== FORMULA DETAILS TOGGLE ==========
function toggleFormulaDetails() {
    const details = document.getElementById('formulaDetails');
    const button = document.getElementById('formulaToggleBtn');
    
    if (!details || !button) return;
    
    const isHidden = details.style.display === 'none' || details.style.display === '';
    
    if (isHidden) {
        details.style.display = 'block';
        button.innerHTML = '<i class="fas fa-times"></i> Hide Formula Details & Breakdown';
        
        details.style.opacity = '0';
        details.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            details.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            details.style.opacity = '1';
            details.style.transform = 'translateY(0)';
        }, 10);
    } else {
        details.style.opacity = '0';
        details.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            details.style.display = 'none';
            button.innerHTML = '<i class="fas fa-calculator"></i> Show Formula Details & Breakdown';
            setTimeout(() => {
                details.style.transition = '';
            }, 300);
        }, 300);
    }
}

// ========== HELPER FUNCTIONS ==========
function formatNumber(num, showDecimals = false) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) return '0';
    
    if (num < 0.001 && num > 0) {
        return '<0.001';
    }
    
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
    
    if (showDecimals) {
        return num.toFixed(2);
    }
    
    return Math.round(num).toString();
}

function getGammaColor(gamma) {
    if (gamma >= 1) return '#00ff00';
    if (gamma >= 0.8) return '#ffff00';
    if (gamma >= 0.6) return '#ffcc00';
    if (gamma >= 0.4) return '#ff9900';
    return '#ff3366';
}

function showToast(message, type = 'info') {
    const existingToasts = document.querySelectorAll('.calculator-toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `calculator-toast calculator-toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== EXPORT FUNCTIONS TO GLOBAL SCOPE ==========
window.addTokenBatch = addTokenBatch;
window.removeTokenBatch = removeTokenBatch;
window.clearTokenBatches = clearTokenBatches;
window.updateRowCalculations = updateRowCalculations;
window.addOtherParticipantBatch = addOtherParticipantBatch;
window.removeOtherParticipantBatch = removeOtherParticipantBatch;
window.clearOtherParticipantBatches = clearOtherParticipantBatches;
window.updateOtherRowCalculations = updateOtherRowCalculations;
window.addExampleOtherParticipants = addExampleOtherParticipants;
window.setParticipantType = setParticipantType;
window.updateSummaryOther = updateSummaryOther;
window.calculateRewards = calculateRewards;
window.updateWhatIfGamma = updateWhatIfGamma;
window.loadExampleCase = loadExampleCase;
window.setSimulatorPreset = setSimulatorPreset;
window.toggleFormulaDetails = toggleFormulaDetails;
window.updateMultiplier = updateMultiplier;

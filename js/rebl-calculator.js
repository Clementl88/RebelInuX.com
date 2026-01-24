// rebl-calculator.js -- Enhanced Calculator JavaScript v3.2 - FIXED & OPTIMIZED

// Global variables
let rewardChart = null;
const CS = 499242047.00; // Circulating Supply
const WERP = 3200000.00; // Weekly Epoch Reward Pool
const K = 0.07; // Age bonus per epoch
const MAX_AGE = 20; // Maximum age for bonus
const MAX_WS = CS * 2.4; // Maximum ∑WS = CS * 2.4 = 1.2B

// State management
let calculatorState = {
    participantType: 'detailed', // 'detailed' or 'summary'
    totalUserTokens: 0,
    totalUserWS: 0,
    otherTokens: 0,
    otherWS: 0,
    otherAvgAge: 0,
    otherAvgBonus: 1.0,
    currentParticipatingTokens: 0,
    currentTotalWS: 0,
    isCalculating: false
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Enhanced REBL Calculator v3.2');
    
    // Initialize with one empty row for user and other participants
    setTimeout(function() {
        addTokenBatch();
        addOtherParticipantBatch();
        
        // Initialize displays
        updateOtherParticipantsSummary();
        updateParticipationDisplay();
        updateWhatIfGamma();
        
        // Initialize chart placeholder
        setupChartPlaceholder();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize quick presets
        initQuickPresets();
    }, 100);
    
    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to the Epoch Reward Calculator! Add your tokens and other participants to calculate rewards.', 'info');
    }, 1500);
});

// ========== SETUP FUNCTIONS ==========
function setupEventListeners() {
    // Summary mode inputs
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
    
    // What-if simulator inputs
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
}

function initQuickPresets() {
    // Set target participation display
    const targetParticipatingDisplay = document.getElementById('targetParticipatingDisplay');
    if (targetParticipatingDisplay) {
        const target = (0.5 * CS);
        targetParticipatingDisplay.textContent = formatNumber(target);
    }
}

// ========== PARTICIPANT TYPE SELECTION ==========
function setParticipantType(type) {
    calculatorState.participantType = type;
    
    // Update UI
    const detailedMode = document.getElementById('detailedBatchesMode');
    const summaryMode = document.getElementById('summaryMode');
    const detailedOption = document.querySelector('.participant-type-option:nth-child(1)');
    const summaryOption = document.querySelector('.participant-type-option:nth-child(2)');
    
    if (type === 'detailed') {
        detailedMode.style.display = 'block';
        summaryMode.style.display = 'none';
        detailedOption.classList.add('active');
        summaryOption.classList.remove('active');
        
        // Recalculate detailed batches
        calculateDetailedBatchesWS();
    } else {
        detailedMode.style.display = 'none';
        summaryMode.style.display = 'block';
        detailedOption.classList.remove('active');
        summaryOption.classList.add('active');
        updateSummaryOther();
    }
    
    // Recalculate
    updateOtherParticipantsSummary();
    updateParticipationDisplay();
    calculateRewards();
    
    showToast(`Switched to ${type} mode for other participants`, 'info');
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
            <button onclick="removeTokenBatch(this)" class="batch-btn" 
                    style="background: var(--rebel-red); color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; transition: all 0.3s ease;">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    table.appendChild(row);
    
    if (amount || age) {
        setTimeout(() => updateRowCalculations(row.querySelector('.batch-amount')), 10);
    }
    
    // Add animation
    row.style.opacity = '0';
    row.style.transform = 'translateY(10px)';
    setTimeout(() => {
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }, 10);
    
    // Update user totals
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
            
            // Add empty row if all are removed
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
    
    // Animate removal
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.style.transform = 'translateX(100%)';
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 300);
        }, index * 50);
    });
    
    // Add empty row after animation
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
    
    // Validate inputs
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
    
    // Calculate weight factor: 1 + 0.07 × min(Age, 20)
    const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
    
    // Calculate weighted share: Token Amount × Weight Factor
    const weightedShare = amount * weightFactor;
    
    // Update display
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
    
    // Update user totals
    updateUserTotals();
    
    // Calculate rewards with slight delay to avoid rapid calculations
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
        
        // Calculate WS manually
        const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
        const weightedShare = amount * weightFactor;
        
        totalTokens += amount;
        totalWS += weightedShare;
        totalWeightedAge += amount * age;
        
        // Update the cell if it exists
        const wsCell = row.querySelector('.batch-ws');
        if (wsCell) {
            wsCell.textContent = formatNumber(weightedShare, true);
        }
    });
    
    calculatorState.totalUserTokens = totalTokens;
    calculatorState.totalUserWS = totalWS;
    
    // Update token sum display
    const userTokenSum = document.getElementById('userTokenSum');
    const userWSSum = document.getElementById('userWSSum');
    
    if (userTokenSum) userTokenSum.textContent = formatNumber(totalTokens);
    if (userWSSum) userWSSum.textContent = formatNumber(totalWS, true);
    
    // Update UI
    updateOtherParticipantsSummary();
    updateParticipationDisplay();
    
    // Update user stats display
    updateUserStatsDisplay(totalTokens, totalWS, totalWeightedAge);
    
    // Update WS info display
    updateWSInfoDisplay();
}

function updateUserStatsDisplay(totalTokens, totalWS, totalWeightedAge) {
    // Find or create user stats display
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
                    <div class="user-stat-percentage">Weighted total</div>
                </div>
                <div class="user-stat-item">
                    <div class="user-stat-label">Avg. Age</div>
                    <div id="userAvgAge" class="user-stat-value">0.0</div>
                    <div class="user-stat-percentage">Epochs</div>
                </div>
                <div class="user-stat-item">
                    <div class="user-stat-label">Avg. Age Bonus</div>
                    <div id="userAvgBonus" class="user-stat-value">1.00x</div>
                    <div class="user-stat-percentage">Multiplier</div>
                </div>
            </div>
        `;
        
        // Insert after table container
        const tableContainer = tokenSection.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.parentNode.insertBefore(statsContainer, tableContainer.nextSibling);
        }
    }
    
    if (statsContainer) {
        // Calculate statistics
        const avgAge = totalTokens > 0 ? (totalWeightedAge / totalTokens) : 0;
        const avgBonus = totalTokens > 0 ? (totalWS / totalTokens) : 1.0;
        const tokenPercentage = totalTokens > 0 ? ((totalTokens / CS) * 100) : 0;
        
        // Update values
        const userTotalTokens = document.getElementById('userTotalTokens');
        const userTokenPercentage = document.getElementById('userTokenPercentage');
        const userTotalWS = document.getElementById('userTotalWS');
        const userAvgAge = document.getElementById('userAvgAge');
        const userAvgBonus = document.getElementById('userAvgBonus');
        
        if (userTotalTokens) {
            userTotalTokens.textContent = formatNumber(totalTokens);
            userTotalTokens.style.color = totalTokens > 1000000 ? 'var(--rebel-gold)' : '#ffffff';
        }
        
        if (userTokenPercentage) {
            userTokenPercentage.textContent = `${tokenPercentage.toFixed(4)}% of CS`;
            
            // Color code based on percentage
            if (tokenPercentage >= 1) {
                userTokenPercentage.style.color = '#4CAF50';
            } else if (tokenPercentage >= 0.1) {
                userTokenPercentage.style.color = '#FFC107';
            } else {
                userTokenPercentage.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        }
        
        if (userTotalWS) {
            userTotalWS.textContent = formatNumber(totalWS, true);
            userTotalWS.style.color = totalWS > totalTokens * 1.5 ? 'var(--rebel-gold)' : '#ffffff';
        }
        
        if (userAvgAge) {
            userAvgAge.textContent = avgAge.toFixed(1);
            userAvgAge.style.color = avgAge >= 10 ? '#4CAF50' : avgAge >= 5 ? '#FFC107' : '#ffffff';
        }
        
        if (userAvgBonus) {
            userAvgBonus.textContent = `${avgBonus.toFixed(2)}x`;
            
            // Color code based on bonus
            if (avgBonus >= 2.0) {
                userAvgBonus.style.color = '#4CAF50';
            } else if (avgBonus >= 1.5) {
                userAvgBonus.style.color = '#FFC107';
            } else if (avgBonus > 1.0) {
                userAvgBonus.style.color = '#FF9800';
            } else {
                userAvgBonus.style.color = '#ffffff';
            }
        }
        
        // Show/hide based on whether user has tokens
        statsContainer.style.display = totalTokens > 0 ? 'block' : 'none';
    }
}

function updateWSInfoDisplay() {
    const yourTokensDisplay = document.getElementById('yourTokensDisplay');
    
    if (yourTokensDisplay) {
        yourTokensDisplay.textContent = formatNumber(calculatorState.totalUserTokens);
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
            <button onclick="removeOtherParticipantBatch(this)" class="batch-btn" 
                    style="background: var(--rebel-red); color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer; transition: all 0.3s ease;">
                <i class="fas fa-times"></i>
            </button>
        </td>
    `;
    table.appendChild(row);
    
    // If values were provided, trigger calculation
    if (amount || age) {
        setTimeout(() => updateOtherRowCalculations(row.querySelector('.other-batch-amount')), 10);
    }
    
    // Add animation
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
            
            // Recalculate after removal
            if (calculatorState.participantType === 'detailed') {
                calculateDetailedBatchesWS();
                updateOtherParticipantsSummary();
            }
            
            // Add empty row if all are removed
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
    
    // Animate removal
    rows.forEach((row, index) => {
        setTimeout(() => {
            row.style.transform = 'translateX(100%)';
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 300);
        }, index * 50);
    });
    
    // Add empty row after animation
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
    
    // Validate inputs
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
    
    // Calculate weight factor: 1 + 0.07 × min(Age, 20)
    const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
    
    // Calculate weighted share: Token Amount × Weight Factor
    const weightedShare = amount * weightFactor;
    
    // Update display
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
    
    // Recalculate all detailed batches
    calculateDetailedBatchesWS();
    updateOtherParticipantsSummary();
    
    // Calculate rewards with slight delay to avoid rapid calculations
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
            // Calculate weight factor: 1 + 0.07 × min(Age, 20)
            const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
            const weightedShare = amount * weightFactor;
            
            totalTokens += amount;
            totalWS += weightedShare;
            totalWeightedAge += amount * age;
        }
    });
    
    // Update state
    calculatorState.otherTokens = totalTokens;
    calculatorState.otherWS = totalWS;
    calculatorState.otherAvgAge = totalTokens > 0 ? (totalWeightedAge / totalTokens) : 0;
    calculatorState.otherAvgBonus = totalTokens > 0 ? (totalWS / totalTokens) : 1.0;
}

function updateOtherParticipantsSummary() {
    // Update summary display with current state values
    const otherTotalTokens = document.getElementById('otherTotalTokens');
    const otherAvgAge = document.getElementById('otherAvgAge');
    const otherAvgBonus = document.getElementById('otherAvgBonus');
    const otherTotalWS = document.getElementById('otherTotalWS');
    const displayOtherTokens = document.getElementById('displayOtherTokens');
    
    if (otherTotalTokens) {
        otherTotalTokens.textContent = formatNumber(calculatorState.otherTokens);
    }
    if (otherAvgAge) {
        otherAvgAge.textContent = calculatorState.otherAvgAge.toFixed(1);
    }
    if (otherAvgBonus) {
        otherAvgBonus.textContent = calculatorState.otherAvgBonus.toFixed(2) + 'x';
        // Color code
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
    if (displayOtherTokens) {
        displayOtherTokens.textContent = formatNumber(calculatorState.otherTokens);
    }
    
    // Update total participation
    updateParticipationDisplay();
}

// ========== SUMMARY MODE FUNCTIONS ==========
function updateSummaryOther() {
    if (calculatorState.participantType !== 'summary') return;
    
    const totalTokens = parseInt(document.getElementById('summaryOtherTokens').value) || 0;
    const avgAge = parseInt(document.getElementById('summaryOtherAge').value) || 0;
    
    // Update display values
    const summaryOtherTokensValue = document.getElementById('summaryOtherTokensValue');
    const summaryOtherAgeValue = document.getElementById('summaryOtherAgeValue');
    
    if (summaryOtherTokensValue) summaryOtherTokensValue.textContent = formatNumber(totalTokens);
    if (summaryOtherAgeValue) summaryOtherAgeValue.textContent = avgAge;
    
    // Calculate WS for summary mode
    const weightFactor = 1 + (K * Math.min(avgAge, MAX_AGE));
    const totalWS = totalTokens * weightFactor;
    
    calculatorState.otherTokens = totalTokens;
    calculatorState.otherWS = totalWS;
    calculatorState.otherAvgAge = avgAge;
    calculatorState.otherAvgBonus = weightFactor;
    
    // Update summary display
    updateOtherParticipantsSummary();
}

// ========== EXAMPLE FUNCTIONS ==========
function addExampleOtherParticipants() {
    clearOtherParticipantBatches();
    
    setTimeout(() => {
        // Add example other participant batches
        addOtherParticipantBatch('50000000', '3');   // 50M tokens, 3 epochs
        addOtherParticipantBatch('30000000', '8');   // 30M tokens, 8 epochs
        addOtherParticipantBatch('20000000', '12');  // 20M tokens, 12 epochs
        addOtherParticipantBatch('10000000', '18');  // 10M tokens, 18 epochs
        addOtherParticipantBatch('5000000', '20');   // 5M tokens, 20 epochs
        
        showToast('Added example other participant batches', 'success');
    }, 300);
}

// ========== PARTICIPATION CALCULATIONS ==========
function calculateGammaScale(P, totalWS) {
    // γ = MAX(0.4, MIN(1, P/(0.5 × CS), CS×1.5/∑WS))
    
    // Term 1: P/(0.5 × CS) - Participation Scaling
    const participationTerm = P / (0.5 * CS);
    
    // Term 2: CS×1.5/∑WS - Age Inflation Cap (with 1.5 multiplier)
    const inflationCap = (CS * 1.5) / totalWS;
    
    // MIN(1, participationTerm, inflationCap)
    const minTerm = Math.min(1, participationTerm, inflationCap);
    
    // MAX(0.4, minTerm)
    const gamma = Math.max(0.4, minTerm);
    
    return {
        gamma: gamma,
        participationTerm: participationTerm,
        inflationCap: inflationCap,
        minTerm: minTerm
    };
}

function updateParticipationDisplay() {
    // Calculate totals
    const totalTokens = calculatorState.totalUserTokens + calculatorState.otherTokens;
    const totalWS = calculatorState.totalUserWS + calculatorState.otherWS;
    
    calculatorState.currentParticipatingTokens = totalTokens;
    calculatorState.currentTotalWS = totalWS;
    
    // Update total displays
    const totalTokensDisplay = document.getElementById('totalTokensDisplay');
    const totalWSDisplay = document.getElementById('totalWSDisplay');
    
    if (totalTokensDisplay) {
        totalTokensDisplay.textContent = formatNumber(totalTokens);
    }
    if (totalWSDisplay) {
        totalWSDisplay.textContent = formatNumber(totalWS);
    }
    
    // Calculate gamma scale
    const gammaData = calculateGammaScale(totalTokens, totalWS);
    const gamma = gammaData.gamma;
    
    // Update gamma display
    const gammaValue = document.getElementById('gammaValue');
    const gammaDisplay = document.getElementById('gammaValueDisplay');
    
    if (gammaValue) gammaValue.textContent = gamma.toFixed(2);
    if (gammaDisplay) gammaDisplay.textContent = gamma.toFixed(2);
    
    // Color code gamma value
    const gammaColor = getGammaColor(gamma);
    if (gammaValue) gammaValue.style.color = gammaColor;
    if (gammaDisplay) gammaDisplay.style.color = gammaColor;
    
    // Update marker position (40% to 100% scale)
    const markerPosition = 40 + (gamma - 0.4) * (100 / 0.6);
    const marker = document.getElementById('gammaMarker');
    if (marker) {
        marker.style.left = `${Math.min(100, Math.max(40, markerPosition))}%`;
    }
    
    // Update component values
    document.getElementById('participationTerm').textContent = gammaData.participationTerm.toFixed(2);
    document.getElementById('inflationCap').textContent = gammaData.inflationCap.toFixed(2);
    document.getElementById('minTerm').textContent = gammaData.minTerm.toFixed(2);
    document.getElementById('maxTerm').textContent = gammaData.gamma.toFixed(2);
    
    // Update gamma info panel
    updateGammaInfoPanel(gamma);
    
    // Update user's contribution percentage
    updateContributionPercentage();
}

function updateGammaInfoPanel(gamma) {
    const gammaInfoPanel = document.getElementById('gammaInfoPanel');
    if (!gammaInfoPanel) return;
    
    let panelClass, panelTitle, panelText;
    
    if (gamma >= 1) {
        panelClass = 'high';
        panelTitle = 'Maximum Rewards (γ = 1.00)';
        panelText = 'Gamma Scale is at maximum! 100% of weekly pool is distributed. Ideal participation level reached.';
    } else if (gamma >= 0.8) {
        panelClass = 'high';
        panelTitle = 'High Participation (γ = ' + gamma.toFixed(2) + ')';
        panelText = 'Excellent participation! Close to unlocking maximum rewards. Keep encouraging participation!';
    } else if (gamma >= 0.6) {
        panelClass = 'medium';
        panelTitle = 'Good Participation (γ = ' + gamma.toFixed(2) + ')';
        panelText = 'Good participation level. Rewards are scaling up with increased community activity.';
    } else if (gamma >= 0.4) {
        panelClass = 'low';
        panelTitle = 'Low Participation (γ = ' + gamma.toFixed(2) + ')';
        panelText = 'The Gamma Scale is at its minimum (40%). Increase participating tokens to unlock higher rewards.';
    }
    
    gammaInfoPanel.className = `gamma-info-panel ${panelClass}`;
    gammaInfoPanel.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
            <i class="fas fa-info-circle"></i>
            <strong>${panelTitle}</strong>
        </div>
        <p style="margin: 0; font-size: 12px;">${panelText}</p>
    `;
}

function updateContributionPercentage() {
    const userTokens = calculatorState.totalUserTokens;
    const participatingTokens = calculatorState.currentParticipatingTokens;
    const userWS = calculatorState.totalUserWS;
    const totalWS = calculatorState.currentTotalWS;
    
    // Find or create contribution display
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
                    <div class="contribution-label">Weighted Share</div>
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
        // Calculate percentages
        const tokenPercentage = participatingTokens > 0 ? (userTokens / participatingTokens * 100) : 0;
        const wsPercentage = totalWS > 0 ? (userWS / totalWS * 100) : 0;
        
        // Update values
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
        
        // Show the container
        contributionContainer.style.display = 'block';
    } else if (contributionContainer) {
        // Hide the container if user has no tokens
        contributionContainer.style.display = 'none';
    }
}

// ========== REWARD CALCULATION ==========
function calculateRewards() {
    // Prevent rapid calculations
    if (calculatorState.isCalculating) return;
    calculatorState.isCalculating = true;
    
    // Show loading state on button
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.classList.add('loading');
        calculateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CALCULATING EPOCH REWARDS...';
    }
    
    setTimeout(() => {
        const rows = document.querySelectorAll('#token-batches-table tbody tr');
        let userWS = 0; // User's total weighted shares
        let totalAmount = 0;
        let batchCount = 0;
        
        // Store batch data for chart and individual calculations
        const batchData = [];
        
        // Calculate user's WSᵢ
        rows.forEach(row => {
            const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
            const age = parseFloat(row.querySelector('.batch-age').value) || 0;
            
            // Calculate WS manually to ensure accuracy
            const weightFactor = 1 + (K * Math.min(age, MAX_AGE));
            const weightedShare = amount * weightFactor;
            
            userWS += weightedShare;
            totalAmount += amount;
            
            if (amount > 0) {
                batchCount++;
                batchData.push({
                    amount: amount,
                    age: age,
                    ws: weightedShare,
                    factor: weightFactor
                });
            }
        });
        
        // Get participation data
        const participatingTokens = calculatorState.currentParticipatingTokens;
        const totalWS = calculatorState.currentTotalWS;
        
        // Calculate gamma scale
        const gammaData = calculateGammaScale(participatingTokens, totalWS);
        const gamma = gammaData.gamma;
        
        // Calculate user's share and reward
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
            
            // Restore button
            if (calculateButton) {
                calculateButton.classList.remove('loading');
                calculateButton.innerHTML = '<i class="fas fa-calculator"></i>  CALCULATE EPOCH REWARDS';
            }
            
            calculatorState.isCalculating = false;
            return;
        }
        
        // Calculate percentage of active pool
        const poolPercentage = (userShare * 100).toFixed(4);
        const returnPercentage = ((userReward / totalAmount) * 100).toFixed(4);
        
        // Calculate monthly and annual projections
        const monthlyReward = userReward * 4.33;
        const annualReward = userReward * 52;
        
        // Calculate user's average age
        let totalWeightedAge = 0;
        rows.forEach(row => {
            const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
            const age = parseFloat(row.querySelector('.batch-age').value) || 0;
            totalWeightedAge += amount * age;
        });
        
        const userAvgAge = totalAmount > 0 ? (totalWeightedAge / totalAmount) : 0;
        const userAvgBonus = totalAmount > 0 ? (userWS / totalAmount) : 1.0;
        
        // Calculate other participants info
        const otherTokens = participatingTokens - calculatorState.totalUserTokens;
        const otherWS = totalWS - userWS;
        const otherAvgBonus = otherTokens > 0 ? (otherWS / otherTokens) : 0;
        
        // Format the results
        const resultHTML = `
            <div style="text-align: left;">
                <!-- Key Metrics -->
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
                
                <!-- MAIN REWARD DISPLAY -->
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
                
                <!-- Other Participants Summary -->
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
                
                <!-- Monthly/Annual Estimates -->
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
        
        // Update chart with weighted shares
        updateChart(batchData, userWS);
        
        // Restore button
        if (calculateButton) {
            calculateButton.classList.remove('loading');
            calculateButton.innerHTML = '<i class="fas fa-calculator"></i> CALCULATE YOUR $REBL REWARDS';
        }
        
        calculatorState.isCalculating = false;
        
        // Show success toast
        showToast('Rewards calculated successfully!', 'success');
    }, 800);
}

// ========== WHAT-IF GAMMA SIMULATOR ==========
function updateWhatIfGamma() {
    const participating = parseInt(document.getElementById('whatIfParticipating').value) || 100000000;
    const totalWS = parseInt(document.getElementById('whatIfTotalWS').value) || 100000000;
    
    // Update display values
    const whatIfParticipatingValue = document.getElementById('whatIfParticipatingValue');
    const whatIfTotalWSValue = document.getElementById('whatIfTotalWSValue');
    
    if (whatIfParticipatingValue) whatIfParticipatingValue.textContent = formatNumber(participating);
    if (whatIfTotalWSValue) whatIfTotalWSValue.textContent = formatNumber(totalWS);
    
    // Calculate gamma scale
    const gammaData = calculateGammaScale(participating, totalWS);
    const gamma = gammaData.gamma;
    
    // Update gamma result
    const gammaResult = document.getElementById('gammaScaleResult');
    if (gammaResult) {
        gammaResult.textContent = `γ = ${gamma.toFixed(2)}`;
        gammaResult.style.color = getGammaColor(gamma);
    }
    
    // Update effective distribution
    const effectiveDistribution = WERP * gamma;
    const effectiveElement = document.getElementById('effectiveDistribution');
    if (effectiveElement) {
        effectiveElement.textContent = formatNumber(effectiveDistribution, false) + ' $REBL';
        effectiveElement.style.color = getGammaColor(gamma);
    }
    
    // Update marker position
    const markerPosition = 40 + (gamma - 0.4) * (100 / 0.6);
    const marker = document.getElementById('whatIfGammaMarker');
    if (marker) {
        marker.style.left = `${Math.min(100, Math.max(40, markerPosition))}%`;
    }
    
    // Update target participation label
    const targetParticipation = (0.5 * CS);
    const targetElement = document.getElementById('targetParticipation');
    if (targetElement) {
        targetElement.textContent = `${formatNumber(targetParticipation)} (50% CS)`;
    }
    
    // Update gamma breakdown
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
    
    setTimeout(() => {
        switch(type) {
            case 'starter':
                // Small holder example
                addTokenBatch('50000', '3');   // 50K tokens, 3 epochs
                addTokenBatch('100000', '8');  // 100K tokens, 8 epochs
                addTokenBatch('25000', '1');   // 25K tokens, 1 epoch
                
                // Add example other participants
                clearOtherParticipantBatches();
                setTimeout(() => {
                    addOtherParticipantBatch('20000000', '2');   // 20M tokens, 2 epochs
                    addOtherParticipantBatch('30000000', '5');   // 30M tokens, 5 epochs
                    addOtherParticipantBatch('25000000', '8');   // 25M tokens, 8 epochs
                    addOtherParticipantBatch('15000000', '12');  // 15M tokens, 12 epochs
                    addOtherParticipantBatch('10000000', '15');  // 10M tokens, 15 epochs
                }, 100);
                break;
                
            case 'investor':
                // Medium-sized investor
                addTokenBatch('500000', '5');   // 500K tokens, 5 epochs
                addTokenBatch('1000000', '10'); // 1M tokens, 10 epochs
                addTokenBatch('750000', '15');  // 750K tokens, 15 epochs
                addTokenBatch('250000', '2');   // 250K tokens, 2 epochs
                
                // Add example other participants
                clearOtherParticipantBatches();
                setTimeout(() => {
                    addOtherParticipantBatch('50000000', '3');   // 50M tokens, 3 epochs
                    addOtherParticipantBatch('40000000', '7');   // 40M tokens, 7 epochs
                    addOtherParticipantBatch('30000000', '10');  // 30M tokens, 10 epochs
                    addOtherParticipantBatch('20000000', '14');  // 20M tokens, 14 epochs
                    addOtherParticipantBatch('10000000', '18');  // 10M tokens, 18 epochs
                }, 100);
                break;
                
            case 'whale':
                // Large holder
                addTokenBatch('2000000', '8');   // 2M tokens, 8 epochs
                addTokenBatch('3000000', '12');  // 3M tokens, 12 epochs
                addTokenBatch('5000000', '18');  // 5M tokens, 18 epochs
                addTokenBatch('1000000', '20');  // 1M tokens, 20 epochs (max age bonus)
                addTokenBatch('500000', '6');    // 500K tokens, 6 epochs
                
                // Add example other participants
                clearOtherParticipantBatches();
                setTimeout(() => {
                    addOtherParticipantBatch('80000000', '4');   // 80M tokens, 4 epochs
                    addOtherParticipantBatch('60000000', '8');   // 60M tokens, 8 epochs
                    addOtherParticipantBatch('40000000', '12');  // 40M tokens, 12 epochs
                    addOtherParticipantBatch('30000000', '16');  // 30M tokens, 16 epochs
                    addOtherParticipantBatch('20000000', '20');  // 20M tokens, 20 epochs
                }, 100);
                break;
                
            default:
                // Fallback to starter
                addTokenBatch('100000', '1');
        }
        
        // Add example description
        const resultElement = document.getElementById('reward-result');
        if (resultElement) {
            resultElement.innerHTML = `
                <div style="text-align: center; margin-bottom: var(--spacing-sm);">
                    <span style="color: var(--rebel-gold); font-weight: bold; font-size: 1.2rem;">
                        <i class="fas fa-user-check"></i> ${type.charAt(0).toUpperCase() + type.slice(1)} Example Loaded
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
        
        // Recalculate after a short delay
        setTimeout(() => calculateRewards(), 800);
        
        // Show toast notification
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} example loaded`, 'success');
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
        case 'optimal':
            participating = 249621024; // 50% of CS
            totalWS = participating * 1.6; // Realistic age bonus average
            break;
        case 'full':
            participating = 499242047; // 100% of CS
            totalWS = participating * 2.4; // Maximum age bonus (2.4x)
            break;
        default:
            return;
    }
    
    // Update simulator inputs
    document.getElementById('whatIfParticipatingInput').value = participating;
    document.getElementById('whatIfParticipating').value = participating;
    document.getElementById('whatIfTotalWSInput').value = totalWS;
    document.getElementById('whatIfTotalWS').value = totalWS;
    
    // Update display
    updateWhatIfGamma();
    
    // Show toast
    showToast(`Simulator preset: ${type}`, 'info');
}

// ========== ENHANCED CHART FUNCTIONS ==========

function setupChartPlaceholder() {
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const canvas = document.getElementById('rewardChart');
    
    if (chartPlaceholder) chartPlaceholder.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
}

// Toggle chart legend
function toggleChartLegend() {
    if (!rewardChart) return;
    
    const isVisible = rewardChart.options.plugins.legend.display;
    rewardChart.options.plugins.legend.display = !isVisible;
    rewardChart.update();
    
    const btn = document.getElementById('toggleLegendBtn');
    btn.classList.toggle('active', !isVisible);
    btn.innerHTML = `<i class="fas fa-layer-group"></i><span>${!isVisible ? 'Hide' : 'Show'} Legend</span>`;
    
    showToast(`${!isVisible ? 'Showing' : 'Hiding'} chart legend`, 'info');
}

// Toggle chart labels
// Toggle data labels on/off
function toggleChartLabels() {
    if (!rewardChart) return;
    
    // Check if we should use Chart.js datalabels plugin or custom labels
    const hasDatalabelsPlugin = rewardChart.config.plugins && 
        rewardChart.config.plugins.find(p => p.id === 'datalabels');
    
    if (hasDatalabelsPlugin) {
        // Toggle datalabels plugin
        const datalabels = rewardChart.config.plugins.find(p => p.id === 'datalabels');
        datalabels.config.display = !datalabels.config.display;
    } else {
        // Toggle between pie and doughnut for different label visibility
        rewardChart.config.type = rewardChart.config.type === 'pie' ? 'doughnut' : 'pie';
    }
    
    rewardChart.update();
    
    // Update toggle button state
    const btn = document.getElementById('toggleLabelsBtn');
    if (btn) {
        const isShowingLabels = hasDatalabelsPlugin ? 
            rewardChart.config.plugins.find(p => p.id === 'datalabels').config.display :
            rewardChart.config.type === 'pie';
        
        btn.classList.toggle('active', isShowingLabels);
        btn.innerHTML = `<i class="fas fa-tag"></i><span>${isShowingLabels ? 'Hide' : 'Show'} Labels</span>`;
        
        showToast(`${isShowingLabels ? 'Showing' : 'Hiding'} chart labels`, 'info');
    }
}

// ========== ENHANCED CHART FUNCTIONS ==========

function updateChart(batchData, totalUserWS) {
    const ctx = document.getElementById('rewardChart');
    if (!ctx) return;
    
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const canvas = document.getElementById('rewardChart');
    const statsOverlay = document.getElementById('chartStatsOverlay');
    
    if (chartPlaceholder) chartPlaceholder.style.display = 'none';
    if (canvas) canvas.style.display = 'block';
    if (statsOverlay) statsOverlay.style.display = 'block';
    
    // Destroy existing chart
    if (rewardChart) {
        rewardChart.destroy();
    }
    
    // Prepare data
    const labels = batchData.map((batch, index) => `Batch ${index + 1}`);
    const weightedShares = batchData.map(batch => batch.ws);
    
    // Professional color palette with rebelinux theme
    const backgroundColors = [
        'rgba(255, 51, 102, 0.9)',    // Rebel Red
        'rgba(255, 204, 0, 0.9)',     // Rebel Gold
        'rgba(0, 170, 255, 0.9)',     // Blue
        'rgba(156, 39, 176, 0.9)',    // Purple
        'rgba(76, 175, 80, 0.9)',     // Green
        'rgba(255, 152, 0, 0.9)',     // Orange
        'rgba(33, 150, 243, 0.9)',    // Light Blue
        'rgba(233, 30, 99, 0.9)'      // Pink
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
    
    // Update chart stats overlay
    if (statsOverlay) {
        document.getElementById('chartTotalWS').textContent = totalUserWS.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        document.getElementById('chartBatchCount').textContent = batchData.length;
    }
    
    // Create new chart with enhanced options
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
                                `Factor: ${(1 + (0.07 * Math.min(batch.age, 20))).toFixed(2)}`,
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
        // Draw center text
        const ctx = chart.ctx;
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Background circle with gradient
        ctx.beginPath();
        ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'var(--rebel-gold)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add subtle glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(212, 167, 106, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Main title (what this number represents)
        ctx.font = 'bold 14px Montserrat';
        ctx.fillStyle = 'var(--rebel-gold)';
        ctx.fillText('YOUR WEIGHTED SHARE', centerX, centerY - 35);
        
        // Subtitle for clarity
        ctx.font = '600 10px Montserrat';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText('Total WS = Σ(Tokens × Age Bonus)', centerX, centerY - 18);
        
        // Divider line
        ctx.beginPath();
        ctx.moveTo(centerX - 40, centerY - 5);
        ctx.lineTo(centerX + 40, centerY - 5);
        ctx.strokeStyle = 'rgba(212, 167, 106, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Main value - formatted for readability
        const formattedWS = formatNumber(totalUserWS, true);
        ctx.font = 'bold 24px Montserrat';
        ctx.fillStyle = 'white';
        ctx.fillText(formattedWS, centerX, centerY + 12);
        
        // Unit label
        ctx.font = 'bold 12px Montserrat';
        ctx.fillStyle = 'var(--rebel-gold)';
        ctx.fillText('WS UNITS', centerX, centerY + 30);
        
        // Footer with batch info
        ctx.beginPath();
        ctx.moveTo(centerX - 40, centerY + 40);
        ctx.lineTo(centerX + 40, centerY + 40);
        ctx.strokeStyle = 'rgba(212, 167, 106, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.font = '600 10px Montserrat';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`${batchData.length} token batches`, centerX, centerY + 52);
        
        ctx.restore();
    }
}]
    });
}
// Enhanced hideChart function
function hideChart() {
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const canvas = document.getElementById('rewardChart');
    const statsOverlay = document.getElementById('chartStatsOverlay');
    
    if (chartPlaceholder) chartPlaceholder.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
    if (statsOverlay) statsOverlay.style.display = 'none';
    
    if (rewardChart) {
        rewardChart.destroy();
        rewardChart = null;
    }
    
    // Reset toggle buttons
    const legendBtn = document.getElementById('toggleLegendBtn');
    const labelsBtn = document.getElementById('toggleLabelsBtn');
    
    if (legendBtn) {
        legendBtn.classList.remove('active');
        legendBtn.innerHTML = '<i class="fas fa-layer-group"></i><span>Legend</span>';
    }
    
    if (labelsBtn) {
        labelsBtn.classList.remove('active');
        labelsBtn.innerHTML = '<i class="fas fa-tag"></i><span>Labels</span>';
    }
}


// ========== HELPER FUNCTIONS ==========
function formatNumber(num, showDecimals = false) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) return '0';
    
    // For very small numbers
    if (num < 0.001 && num > 0) {
        return '<0.001';
    }
    
    // For numbers over 1 billion, show with abbreviation
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
    
    // For numbers with decimals where we want to show them
    if (showDecimals) {
        return num.toFixed(2);
    }
    
    // For integers or numbers without decimals
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
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.calculator-toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `calculator-toast calculator-toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========== FORMULA DETAILS TOGGLE ==========
function toggleFormulaDetails() {
    const details = document.getElementById('formulaDetails');
    const button = document.getElementById('formulaToggleBtn');
    
    if (!details || !button) return;
    
    if (details.style.display === 'none' || details.style.display === '') {
        // Show details with animation
        details.style.display = 'block';
        button.innerHTML = '<i class="fas fa-times"></i> Hide Formula Details & Breakdown';
        
        // Animate in
        details.style.opacity = '0';
        details.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            details.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            details.style.opacity = '1';
            details.style.transform = 'translateY(0)';
        }, 10);
        
        showToast('Formula details expanded', 'info');
    } else {
        // Hide details with animation
        details.style.opacity = '0';
        details.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            details.style.display = 'none';
            button.innerHTML = '<i class="fas fa-calculator"></i> Show Formula Details & Breakdown';
        }, 300);
    }
}

// ========== QUICK ACTIONS FOR FORMULA SECTION ==========
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add visual feedback
        section.style.boxShadow = '0 0 0 3px var(--rebel-gold)';
        setTimeout(() => {
            section.style.boxShadow = '';
        }, 1000);
        
        showToast(`Scrolled to ${sectionId.replace('.', '').replace('#', '')}`, 'info');
    }
}

// ========== EXPORT FUNCTIONS TO GLOBAL SCOPE ==========
// Make functions available for onclick handlers
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
window.scrollToSection = scrollToSection;

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to calculate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        calculateRewards();
        showToast('Calculating rewards... (Ctrl+Enter)', 'info');
    }
    
    // Ctrl/Cmd + L to toggle legend
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        toggleChartLegend();
    }
    
    // Ctrl/Cmd + P to toggle pie/doughnut
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        toggleChartLabels();
    }
    
    // Ctrl/Cmd + N to add new batch
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addTokenBatch();
        showToast('Added new token batch (Ctrl+N)', 'info');
    }
});

// Add the new chart functions to window object
window.toggleChartLegend = toggleChartLegend;
window.toggleChartLabels = toggleChartLabels;

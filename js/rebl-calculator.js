// rebl-calculator.js -- Enhanced Calculator JavaScript

// Global variables
let rewardChart = null;
const CS = 499242047.00; // Circulating Supply
const WERP = 3200000.00; // Weekly Epoch Reward Pool
const K = 0.07; // Age bonus per epoch
const MAX_AGE = 20; // Maximum age for bonus

// State management
let calculatorState = {
    autoUpdateParticipation: true,
    totalUserTokens: 0,
    totalUserWS: 0,
    currentParticipatingTokens: 100000000,
    currentTotalWS: 100000000,
    isCalculating: false
};

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Enhanced REBL Calculator...');
    
    // Initialize with one empty row
    setTimeout(function() {
        addTokenBatch();
    }, 100);
    
    // Initialize participation settings with input fields
    initParticipationInputs();
    
    // Initialize chart placeholder
    setupChartPlaceholder();
    
    // Add page initialization animations
    initCalculatorAnimations();
    
    // Add auto-update toggle
    setupAutoUpdateToggle();
    
    // Add input listeners for direct number input
    setupDirectInputListeners();
});

// ========== STATE MANAGEMENT ==========
function setupAutoUpdateToggle() {
    // Create toggle UI in the participation settings section
    const participationSection = document.querySelector('.participation-settings');
    if (!participationSection) return;
    
    // Find the section header
    const header = participationSection.querySelector('h3');
    if (!header) return;
    
    // Create toggle button
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'auto-update-toggle';
    toggleContainer.innerHTML = `
        <label class="toggle-label">
            <input type="checkbox" id="autoUpdateToggle" checked>
            <span class="toggle-slider"></span>
            <span class="toggle-text">Auto-update participation based on your tokens</span>
        </label>
        <div class="toggle-help">
            <i class="fas fa-info-circle"></i> When enabled, participation estimates adjust automatically based on your token batches
        </div>
    `;
    
    // Insert after header
    header.parentNode.insertBefore(toggleContainer, header.nextSibling);
    
    // Add event listener
    const toggle = document.getElementById('autoUpdateToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            calculatorState.autoUpdateParticipation = this.checked;
            updateParticipationUI();
            showToast('Auto-update ' + (this.checked ? 'enabled' : 'disabled'), 'info');
        });
    }
}

function initParticipationInputs() {
    const participatingSlider = document.getElementById('participatingTokens');
    const totalWSSlider = document.getElementById('totalWS');
    
    if (!participatingSlider || !totalWSSlider) return;
    
    // Replace slider labels with enhanced version
    const participatingLabel = participatingSlider.previousElementSibling;
    const totalWSLabel = totalWSSlider.previousElementSibling;
    
    if (participatingLabel && totalWSLabel) {
        participatingLabel.outerHTML = `
            <div class="slider-info">
                <div class="slider-info-label">
                    <span>Total Participating Tokens (P):</span>
                    <i class="fas fa-question-circle slider-info-help" title="Total tokens participating in this epoch. Includes your tokens plus estimated other participants."></i>
                </div>
                <div class="slider-info-value">
                    <input type="number" id="participatingTokensInput" class="value-input" 
                           value="100000000" min="1000000" max="500000000" step="1000000">
                    <span id="participatingTokensValue" class="slider-value">100M</span>
                </div>
            </div>
        `;
        
        totalWSLabel.outerHTML = `
            <div class="slider-info">
                <div class="slider-info-label">
                    <span>∑WS (Total Active Weighted Shares):</span>
                    <i class="fas fa-question-circle slider-info-help" title="Total weighted shares including age bonuses. This is always ≥ total participating tokens."></i>
                </div>
                <div class="slider-info-value">
                    <input type="number" id="totalWSInput" class="value-input" 
                           value="100000000" min="1000000" max="500000000" step="1000000">
                    <span id="totalWSValue" class="slider-value">100M</span>
                </div>
            </div>
        `;
    }
    
    // Setup input listeners
    setupDirectInputListeners();
    
    // Initialize values
    updateParticipationUI();
}

function setupDirectInputListeners() {
    // Participating tokens input
    const participatingInput = document.getElementById('participatingTokensInput');
    const participatingSlider = document.getElementById('participatingTokens');
    
    if (participatingInput && participatingSlider) {
        participatingInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            value = Math.max(1000000, Math.min(500000000, value));
            this.value = value;
            participatingSlider.value = value;
            calculatorState.currentParticipatingTokens = value;
            updateParticipationDisplay();
            calculateRewards();
        });
        
        participatingSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            participatingInput.value = value;
            calculatorState.currentParticipatingTokens = value;
            updateParticipationDisplay();
            calculateRewards();
        });
    }
    
    // Total WS input
    const totalWSInput = document.getElementById('totalWSInput');
    const totalWSSlider = document.getElementById('totalWS');
    
    if (totalWSInput && totalWSSlider) {
        totalWSInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            value = Math.max(1000000, Math.min(500000000, value));
            this.value = value;
            totalWSSlider.value = value;
            calculatorState.currentTotalWS = value;
            updateParticipationDisplay();
            calculateRewards();
        });
        
        totalWSSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            totalWSInput.value = value;
            calculatorState.currentTotalWS = value;
            updateParticipationDisplay();
            calculateRewards();
        });
    }
    
    // What-if simulator inputs
    const whatIfParticipatingInput = document.createElement('input');
    whatIfParticipatingInput.type = 'number';
    whatIfParticipatingInput.className = 'value-input';
    whatIfParticipatingInput.id = 'whatIfParticipatingInput';
    whatIfParticipatingInput.value = '100000000';
    whatIfParticipatingInput.min = '1000000';
    whatIfParticipatingInput.max = '500000000';
    whatIfParticipatingInput.step = '1000000';
    
    const whatIfTotalWSInput = document.createElement('input');
    whatIfTotalWSInput.type = 'number';
    whatIfTotalWSInput.className = 'value-input';
    whatIfTotalWSInput.id = 'whatIfTotalWSInput';
    whatIfTotalWSInput.value = '100000000';
    whatIfTotalWSInput.min = '1000000';
    whatIfTotalWSInput.max = '500000000';
    whatIfTotalWSInput.step = '1000000';
    
    // Add event listeners for simulator
    whatIfParticipatingInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 0;
        value = Math.max(1000000, Math.min(500000000, value));
        this.value = value;
        document.getElementById('whatIfParticipating').value = value;
        updateWhatIfGamma();
    });
    
    whatIfTotalWSInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 0;
        value = Math.max(1000000, Math.min(500000000, value));
        this.value = value;
        document.getElementById('whatIfTotalWS').value = value;
        updateWhatIfGamma();
    });
    
    // Also update simulator sliders
    document.getElementById('whatIfParticipating').addEventListener('input', function() {
        const value = parseInt(this.value);
        whatIfParticipatingInput.value = value;
        updateWhatIfGamma();
    });
    
    document.getElementById('whatIfTotalWS').addEventListener('input', function() {
        const value = parseInt(this.value);
        whatIfTotalWSInput.value = value;
        updateWhatIfGamma();
    });
    
    // Insert inputs into simulator
    const whatIfParticipatingValue = document.getElementById('whatIfParticipatingValue');
    const whatIfTotalWSValue = document.getElementById('whatIfTotalWSValue');
    
    if (whatIfParticipatingValue) {
        whatIfParticipatingValue.parentNode.insertBefore(whatIfParticipatingInput, whatIfParticipatingValue);
    }
    
    if (whatIfTotalWSValue) {
        whatIfTotalWSValue.parentNode.insertBefore(whatIfTotalWSInput, whatIfTotalWSValue);
    }
}

function updateParticipationDisplay() {
    const participatingValue = document.getElementById('participatingTokensValue');
    const totalWSValue = document.getElementById('totalWSValue');
    
    if (participatingValue) {
        participatingValue.textContent = formatNumber(calculatorState.currentParticipatingTokens);
    }
    
    if (totalWSValue) {
        totalWSValue.textContent = formatNumber(calculatorState.currentTotalWS);
    }
    
    // Calculate gamma scale
    const gammaData = calculateGammaScale(calculatorState.currentParticipatingTokens, calculatorState.currentTotalWS);
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
    
    // Update user's contribution percentage
    updateContributionPercentage();
}

function updateParticipationUI() {
    const participatingSlider = document.getElementById('participatingTokens');
    const totalWSSlider = document.getElementById('totalWS');
    const participatingInput = document.getElementById('participatingTokensInput');
    const totalWSInput = document.getElementById('totalWSInput');
    
    if (!participatingSlider || !totalWSSlider || !participatingInput || !totalWSInput) return;
    
    const isAuto = calculatorState.autoUpdateParticipation;
    
    // Update input states
    participatingSlider.disabled = isAuto;
    totalWSSlider.disabled = isAuto;
    participatingInput.disabled = isAuto;
    totalWSInput.disabled = isAuto;
    
    // Update slider values based on user's tokens
    if (isAuto) {
        // Get user's data
        const userTokens = calculatorState.totalUserTokens;
        const userWS = calculatorState.totalUserWS;
        
        // Estimate other participants
        const remainingTokens = Math.max(CS - userTokens, 0);
        
        // Scenario 1: User only (minimum case)
        if (userTokens === 0) {
            // Default minimum values
            calculatorState.currentParticipatingTokens = 10000000;
            calculatorState.currentTotalWS = 15000000;
        } 
        // Scenario 2: User has tokens
        else {
            // Calculate user's age bonus factor
            const userAgeBonus = userTokens > 0 ? (userWS / userTokens) : 1;
            
            // Estimate other participants based on user's holdings
            // If user has significant holdings, assume more participation
            const userShare = userTokens / CS;
            let otherMultiplier;
            
            if (userShare >= 0.01) { // User owns 1%+ of supply
                otherMultiplier = 2; // Assume 2x other participants
            } else if (userShare >= 0.001) { // User owns 0.1%+ of supply
                otherMultiplier = 5;
            } else {
                otherMultiplier = 10; // Small holder, assume more other participants
            }
            
            const estimatedOtherTokens = Math.min(remainingTokens, userTokens * otherMultiplier);
            const estimatedOtherWS = estimatedOtherTokens * (userAgeBonus * 0.8); // Others have slightly lower age bonus
            
            // Calculate totals
            calculatorState.currentParticipatingTokens = Math.min(
                CS,
                Math.max(userTokens * 2, userTokens + estimatedOtherTokens, 10000000)
            );
            
            calculatorState.currentTotalWS = Math.min(
                CS * 2.4, // Maximum possible WS (all tokens with max age bonus)
                Math.max(userWS * 1.5, userWS + estimatedOtherWS, 15000000)
            );
        }
        
        // Update sliders and inputs
        participatingSlider.value = calculatorState.currentParticipatingTokens;
        totalWSSlider.value = calculatorState.currentTotalWS;
        participatingInput.value = calculatorState.currentParticipatingTokens;
        totalWSInput.value = calculatorState.currentTotalWS;
        
        // Update displays
        updateParticipationDisplay();
        calculateRewards();
    }
}

// ========== CALCULATOR FUNCTIONS ==========
function addTokenBatch(amount = '', age = '') {
    const table = document.querySelector('#token-batches-table tbody');
    if (!table) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <input type="number" class="batch-amount" value="${amount}" placeholder="Amount" 
                   oninput="updateRowCalculations(this)" min="0" step="1000">
        </td>
        <td>
            <input type="number" class="batch-age" value="${age}" placeholder="Age" 
                   oninput="updateRowCalculations(this)" min="0" max="20" step="1">
        </td>
        <td class="batch-factor" style="color: var(--rebel-gold); font-weight: bold;">1.00</td>
        <td class="batch-ws" style="color: var(--rebel-red); font-weight: bold;">0</td>
        <td>
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
    
    if (!confirm('Are you sure you want to clear all token batches?')) {
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
        updateParticipationUI();
        
        const resultElement = document.getElementById('reward-result');
        if (resultElement) {
            resultElement.innerHTML = 'Enter your token batches to calculate your sustainable $REBL rewards!';
            resultElement.className = 'reward-result';
        }
        hideChart();
        showToast('All token batches cleared', 'info');
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
    
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
        const ws = parseFloat(row.querySelector('.batch-ws').textContent.replace(/,/g, '')) || 0;
        
        totalTokens += amount;
        totalWS += ws;
    });
    
    calculatorState.totalUserTokens = totalTokens;
    calculatorState.totalUserWS = totalWS;
    
    // Update UI if auto-update is enabled
    if (calculatorState.autoUpdateParticipation) {
        updateParticipationUI();
    }
    
    // Update user stats display
    updateUserStatsDisplay(totalTokens, totalWS);
}

function updateUserStatsDisplay(totalTokens, totalWS) {
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
                    <div class="user-stat-label">Avg. Age Bonus</div>
                    <div id="userAvgBonus" class="user-stat-value">1.00x</div>
                    <div class="user-stat-percentage">Average multiplier</div>
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
        // Update values
        const userTotalTokens = document.getElementById('userTotalTokens');
        const userTokenPercentage = document.getElementById('userTokenPercentage');
        const userTotalWS = document.getElementById('userTotalWS');
        const userAvgBonus = document.getElementById('userAvgBonus');
        
        if (userTotalTokens) {
            userTotalTokens.textContent = formatNumber(totalTokens);
            userTotalTokens.style.color = totalTokens > 1000000 ? 'var(--rebel-gold)' : '#ffffff';
        }
        
        if (userTokenPercentage) {
            const percentage = totalTokens > 0 ? ((totalTokens / CS) * 100).toFixed(4) : 0;
            userTokenPercentage.textContent = `${percentage}% of CS`;
            
            // Color code based on percentage
            if (percentage >= 1) {
                userTokenPercentage.style.color = '#4CAF50';
            } else if (percentage >= 0.1) {
                userTokenPercentage.style.color = '#FFC107';
            } else {
                userTokenPercentage.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        }
        
        if (userTotalWS) {
            userTotalWS.textContent = formatNumber(totalWS, true);
            userTotalWS.style.color = totalWS > totalTokens * 1.5 ? 'var(--rebel-gold)' : '#ffffff';
        }
        
        if (userAvgBonus) {
            const avgBonus = totalTokens > 0 ? (totalWS / totalTokens).toFixed(2) : '1.00';
            userAvgBonus.textContent = `${avgBonus}x`;
            
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

function calculateGammaScale(P, totalWS) {
    // γ = MAX(0.4, MIN(1, P/(0.5 × CS), CS/∑WS))
    
    // Term 1: P/(0.5 × CS) - Participation Scaling
    const participationTerm = P / (0.5 * CS);
    
    // Term 2: CS/∑WS - Age Inflation Cap
    const inflationCap = CS / totalWS;
    
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

function updateContributionPercentage() {
    const userTokens = calculatorState.totalUserTokens;
    const participatingTokens = calculatorState.currentParticipatingTokens;
    const userWS = calculatorState.totalUserWS;
    const totalWS = calculatorState.currentTotalWS;
    
    // Find or create contribution display
    let contributionContainer = document.querySelector('.contribution-container');
    
    if (!contributionContainer && userTokens > 0) {
        const participationSection = document.querySelector('.participation-settings .slider-group');
        if (!participationSection) return;
        
        contributionContainer = document.createElement('div');
        contributionContainer.className = 'contribution-container';
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

function calculateRewards() {
    // Prevent rapid calculations
    if (calculatorState.isCalculating) return;
    calculatorState.isCalculating = true;
    
    const rows = document.querySelectorAll('#token-batches-table tbody tr');
    let userWS = 0; // User's total weighted shares
    let totalAmount = 0;
    let batchCount = 0;
    
    // Store batch data for chart
    const batchData = [];
    
    // Calculate user's WSᵢ
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
        const age = parseFloat(row.querySelector('.batch-age').value) || 0;
        const ws = parseFloat(row.querySelector('.batch-ws').textContent.replace(/,/g, '')) || 0;
        
        userWS += ws;
        totalAmount += amount;
        
        if (amount > 0) {
            batchCount++;
            batchData.push({
                amount: amount,
                age: age,
                ws: ws
            });
        }
    });
    
    // Get participation data
    const participatingTokens = calculatorState.currentParticipatingTokens;
    const totalWS = calculatorState.currentTotalWS;
    
    // Validate that totalWS >= userWS
    if (totalWS < userWS) {
        calculatorState.currentTotalWS = Math.max(userWS * 1.1, userWS + 1000000);
        const totalWSInput = document.getElementById('totalWSInput');
        const totalWSSlider = document.getElementById('totalWS');
        if (totalWSInput) totalWSInput.value = calculatorState.currentTotalWS;
        if (totalWSSlider) totalWSSlider.value = calculatorState.currentTotalWS;
        updateParticipationDisplay();
        showToast('Adjusted Total WS to be at least your weighted shares', 'warning');
    }
    
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
                <p>Please enter valid token batches to calculate your sustainable $REBL rewards!</p>
                <p style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-top: 0.5rem;">
                    Try loading an example or adding your own token batches.
                </p>
            </div>
        `;
        resultElement.className = 'reward-result';
        hideChart();
        calculatorState.isCalculating = false;
        return;
    }
    
    // Calculate percentage of active pool
    const poolPercentage = (userShare * 100).toFixed(4);
    const returnPercentage = ((userReward / totalAmount) * 100).toFixed(4);
    
    // Format the results
    const resultHTML = `
        <div style="text-align: left;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Your Weighted Share (WSᵢ):</strong></span>
                <span style="color: var(--rebel-gold); font-weight: bold;">${formatNumber(userWS, true)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Total Active Weighted Shares (∑WS):</strong></span>
                <span style="color: var(--rebel-gold); font-weight: bold;">${formatNumber(totalWS)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Your Share of Active Pool:</strong></span>
                <span style="color: var(--rebel-gold); font-weight: bold;">${poolPercentage}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Gamma Scale Factor (γ):</strong></span>
                <span style="color: ${getGammaColor(gamma)}; font-weight: bold;">${gamma.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Effective Weekly Pool:</strong></span>
                <span style="color: var(--rebel-red); font-weight: bold;">${formatNumber(effectivePool, false)} $REBL</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Weekly Return:</strong></span>
                <span style="color: var(--rebel-gold); font-weight: bold;">${returnPercentage}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.3em; margin-top: 0.5em; padding-top: 0.5em; border-top: 2px solid rgba(255, 204, 0, 0.5);">
                <span><strong>Your Sustainable Reward:</strong></span>
                <span style="color: var(--rebel-red); font-weight: 800; text-shadow: 0 0 10px rgba(255, 51, 102, 0.3);">
                    ${formatNumber(userReward, true)} $REBL
                </span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 0.5em; font-size: 0.9em; color: rgba(255, 255, 255, 0.7);">
                <span><em>Based on ${formatNumber(participatingTokens)} participating tokens with γ=${gamma.toFixed(2)}</em></span>
            </div>
        </div>
    `;
    
    resultElement.innerHTML = resultHTML;
    resultElement.className = 'reward-result';
    
    // Update chart with weighted shares
    updateChart(batchData, userWS);
    
    calculatorState.isCalculating = false;
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

// ========== CHART FUNCTIONS ==========
function setupChartPlaceholder() {
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const canvas = document.getElementById('rewardChart');
    
    if (chartPlaceholder) chartPlaceholder.style.display = 'flex';
    if (canvas) canvas.style.display = 'none';
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

function updateChart(batchData, totalUserWS) {
    const ctx = document.getElementById('rewardChart');
    if (!ctx) return;
    
    const chartPlaceholder = document.getElementById('chartPlaceholder');
    const canvas = document.getElementById('rewardChart');
    
    if (chartPlaceholder) chartPlaceholder.style.display = 'none';
    if (canvas) canvas.style.display = 'block';
    
    // Destroy existing chart
    if (rewardChart) rewardChart.destroy();
    
    // Prepare data
    const labels = batchData.map((batch, index) => `Batch ${index + 1}`);
    const weightedShares = batchData.map(batch => batch.ws);
    
    // Calculate percentages for labels
    const percentages = weightedShares.map(ws => ((ws / totalUserWS) * 100).toFixed(1));
    
    // Colors for the chart
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
    
    // Create new chart
    rewardChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map((label, i) => `${label} (${percentages[i]}%)`),
            datasets: [{
                data: weightedShares,
                backgroundColor: backgroundColors.slice(0, weightedShares.length),
                borderColor: borderColors.slice(0, weightedShares.length),
                borderWidth: 2,
                hoverOffset: 20
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
                        padding: 15,
                        font: {
                            family: 'Montserrat, sans-serif',
                            size: 12
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function(label, i) {
                                    const value = data.datasets[0].data[i];
                                    const percentage = ((value / totalUserWS) * 100).toFixed(1);
                                    return {
                                        text: `${label.split(' ')[0]} ${label.split(' ')[1]} - ${percentage}%`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor[i],
                                        lineWidth: 2,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    titleColor: 'var(--rebel-gold)',
                    bodyColor: 'white',
                    borderColor: 'var(--rebel-gold)',
                    borderWidth: 1,
                    cornerRadius: 6,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const batch = batchData[context.dataIndex];
                            return [
                                `Amount: ${formatNumber(batch.amount)} $rebelinux`,
                                `Age: ${batch.age} epochs`,
                                `Factor: ${(1 + (K * Math.min(batch.age, MAX_AGE))).toFixed(2)}x`,
                                `Weighted Share: ${formatNumber(batch.ws, true)}`,
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
            },
            cutout: '60%'
        }
    });
}

// ========== EXAMPLE CASES ==========
function loadExampleCase(type) {
    clearTokenBatches();
    
    // Small delay to ensure previous clearing is complete
    setTimeout(() => {
        switch(type) {
            case 'starter':
                // Small holder example
                addTokenBatch('50000', '3');   // 50K tokens, 3 epochs
                addTokenBatch('100000', '8');  // 100K tokens, 8 epochs
                addTokenBatch('25000', '1');   // 25K tokens, 1 epoch
                break;
                
            case 'investor':
                // Medium-sized investor
                addTokenBatch('500000', '5');   // 500K tokens, 5 epochs
                addTokenBatch('1000000', '10'); // 1M tokens, 10 epochs
                addTokenBatch('750000', '15');  // 750K tokens, 15 epochs
                addTokenBatch('250000', '2');   // 250K tokens, 2 epochs
                break;
                
            case 'whale':
                // Large holder
                addTokenBatch('2000000', '8');   // 2M tokens, 8 epochs
                addTokenBatch('3000000', '12');  // 3M tokens, 12 epochs
                addTokenBatch('5000000', '18');  // 5M tokens, 18 epochs
                addTokenBatch('1000000', '20');  // 1M tokens, 20 epochs (max age bonus)
                addTokenBatch('500000', '6');    // 500K tokens, 6 epochs
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
                    Adjust participation settings and click "Calculate Sustainable Rewards" to see results!
                </p>
                <div style="display: flex; justify-content: center; gap: var(--spacing-sm); margin-top: var(--spacing-sm);">
                    <button onclick="updateParticipationUI()" style="background: var(--rebel-red); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                        <i class="fas fa-sync-alt"></i> Auto-update Participation
                    </button>
                    <button onclick="calculateRewards()" style="background: var(--rebel-gold); color: black; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: bold;">
                        <i class="fas fa-calculator"></i> Calculate Now
                    </button>
                </div>
            `;
            resultElement.className = 'reward-result';
        }
        
        // Enable auto-update for examples
        calculatorState.autoUpdateParticipation = true;
        const toggle = document.getElementById('autoUpdateToggle');
        if (toggle) toggle.checked = true;
        updateParticipationUI();
        
        // Recalculate after a short delay
        setTimeout(() => calculateRewards(), 800);
        
        // Show toast notification
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} example loaded`, 'success');
    }, 500);
}

// ========== HELPER FUNCTIONS ==========
function formatNumber(num, showDecimals = false) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) return '0';
    
    // For very small numbers
    if (num < 0.001 && num > 0) {
        return '<0.001';
    }
    
    // Format large numbers with K, M, B suffixes
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(showDecimals ? 2 : 1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(showDecimals ? 2 : 1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(showDecimals ? 2 : 1) + 'K';
    }
    
    const options = {
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0
    };
    
    return num.toLocaleString(undefined, options);
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
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 
                     type === 'warning' ? 'rgba(255, 193, 7, 0.9)' : 
                     type === 'error' ? 'rgba(255, 51, 102, 0.9)' : 
                     'rgba(33, 150, 243, 0.9)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 600;
        animation: toastIn 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animation styles
if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes toastIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ========== ANIMATION FUNCTIONS ==========
function initCalculatorAnimations() {
    const elements = document.querySelectorAll('.parameter-item, .calculator-section, .calculate-btn');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ========== PUBLIC FUNCTIONS ==========
// Expose necessary functions to global scope
window.addTokenBatch = addTokenBatch;
window.removeTokenBatch = removeTokenBatch;
window.clearTokenBatches = clearTokenBatches;
window.updateRowCalculations = updateRowCalculations;
window.updateParticipation = function() {
    const participatingSlider = document.getElementById('participatingTokens');
    const totalWSSlider = document.getElementById('totalWS');
    
    if (participatingSlider && totalWSSlider) {
        calculatorState.currentParticipatingTokens = parseInt(participatingSlider.value) || 100000000;
        calculatorState.currentTotalWS = parseInt(totalWSSlider.value) || 100000000;
        
        const participatingInput = document.getElementById('participatingTokensInput');
        const totalWSInput = document.getElementById('totalWSInput');
        
        if (participatingInput) participatingInput.value = calculatorState.currentParticipatingTokens;
        if (totalWSInput) totalWSInput.value = calculatorState.currentTotalWS;
        
        updateParticipationDisplay();
        calculateRewards();
    }
};
window.calculateRewards = calculateRewards;
window.updateWhatIfGamma = updateWhatIfGamma;
window.loadExampleCase = loadExampleCase;

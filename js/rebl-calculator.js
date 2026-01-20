
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
    currentTotalWS: 100000000
};

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing REBL Calculator...');
    
    // Initialize with one empty row
    setTimeout(function() {
        addTokenBatch();
    }, 100);
    
    // Initialize participation settings
    updateParticipation();
    updateWhatIfGamma();
    
    // Initialize chart placeholder
    setupChartPlaceholder();
    
    // Add page initialization animations
    initCalculatorAnimations();
    
    // Add auto-update toggle
    setupAutoUpdateToggle();
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
    `;
    
    // Insert after header
    header.parentNode.insertBefore(toggleContainer, header.nextSibling);
    
    // Add event listener
    const toggle = document.getElementById('autoUpdateToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            calculatorState.autoUpdateParticipation = this.checked;
            updateParticipationUI();
        });
    }
}

function updateParticipationUI() {
    const toggle = document.getElementById('autoUpdateToggle');
    const participatingSlider = document.getElementById('participatingTokens');
    const totalWSSlider = document.getElementById('totalWS');
    
    if (!toggle || !participatingSlider || !totalWSSlider) return;
    
    const isAuto = calculatorState.autoUpdateParticipation;
    
    // Update slider states
    participatingSlider.disabled = isAuto;
    totalWSSlider.disabled = isAuto;
    
    // Update slider values based on user's tokens
    if (isAuto) {
        // Estimate other participants: assume 50% of remaining tokens participate
        const userTokens = calculatorState.totalUserTokens;
        const remainingTokens = CS - userTokens;
        const estimatedOtherTokens = Math.max(remainingTokens * 0.5, 1000000); // At least 1M other tokens
        
        // Update participating tokens (user + estimated others)
        const participatingTokens = Math.max(userTokens * 2, estimatedOtherTokens, 10000000); // At least 10M total
        calculatorState.currentParticipatingTokens = Math.min(participatingTokens, CS);
        
        // Calculate total WS (user WS + estimated others with avg age bonus)
        const userWS = calculatorState.totalUserWS;
        const avgAgeBonus = userTokens > 0 ? (userWS / userTokens) : 1.5;
        const estimatedOtherWS = estimatedOtherTokens * avgAgeBonus;
        const totalWS = Math.max(userWS * 1.5, estimatedOtherWS, 15000000); // At least 15M total WS
        calculatorState.currentTotalWS = Math.min(totalWS, CS * 2.4); // Max possible WS
        
        // Update sliders
        participatingSlider.value = calculatorState.currentParticipatingTokens;
        totalWSSlider.value = calculatorState.currentTotalWS;
        
        // Update displays
        updateParticipation();
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
        <td class="batch-factor" style="color: var(--rebel-gold);">1.00</td>
        <td class="batch-ws" style="color: var(--rebel-red); font-weight: bold;">0</td>
        <td>
            <button onclick="removeTokenBatch(this)" class="batch-btn" 
                    style="background: var(--rebel-red); color: white; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; cursor: pointer;">
                ×
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
        document.getElementById('reward-result').innerHTML = 'Enter your token batches to calculate your sustainable $REBL rewards!';
        hideChart();
    }, rows.length * 50 + 300);
}

function updateRowCalculations(input) {
    const row = input.closest('tr');
    if (!row) return;
    
    const amount = parseFloat(row.querySelector('.batch-amount').value) || 0;
    const age = parseFloat(row.querySelector('.batch-age').value) || 0;
    
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
    }
    
    if (wsCell) {
        wsCell.textContent = formatNumber(weightedShare, true);
        wsCell.style.color = 'var(--rebel-red)';
    }
    
    // Update user totals
    updateUserTotals();
    calculateRewards();
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
    
    if (!statsContainer) {
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
    
    // Update values
    const userTotalTokens = document.getElementById('userTotalTokens');
    const userTokenPercentage = document.getElementById('userTokenPercentage');
    const userTotalWS = document.getElementById('userTotalWS');
    const userAvgBonus = document.getElementById('userAvgBonus');
    
    if (userTotalTokens) {
        userTotalTokens.textContent = formatNumber(totalTokens);
    }
    
    if (userTokenPercentage) {
        const percentage = totalTokens > 0 ? ((totalTokens / CS) * 100).toFixed(2) : 0;
        userTokenPercentage.textContent = `${percentage}% of CS`;
        userTokenPercentage.style.color = percentage >= 1 ? '#4CAF50' : percentage >= 0.5 ? '#FFC107' : 'rgba(255, 255, 255, 0.6)';
    }
    
    if (userTotalWS) {
        userTotalWS.textContent = formatNumber(totalWS, true);
    }
    
    if (userAvgBonus) {
        const avgBonus = totalTokens > 0 ? (totalWS / totalTokens).toFixed(2) : '1.00';
        userAvgBonus.textContent = `${avgBonus}x`;
        userAvgBonus.style.color = avgBonus >= 1.5 ? '#4CAF50' : avgBonus >= 1.2 ? '#FFC107' : '#ffffff';
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

// Update participation settings
function updateParticipation() {
    const participatingTokens = parseInt(document.getElementById('participatingTokens').value) || 100000000;
    const totalWS = parseInt(document.getElementById('totalWS').value) || 100000000;
    
    // Store current values
    calculatorState.currentParticipatingTokens = participatingTokens;
    calculatorState.currentTotalWS = totalWS;
    
    // Update display values
    document.getElementById('participatingTokensValue').textContent = formatNumber(participatingTokens);
    document.getElementById('totalWSValue').textContent = formatNumber(totalWS);
    
    // Calculate gamma scale
    const gammaData = calculateGammaScale(participatingTokens, totalWS);
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
    
    calculateRewards();
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
            tokenContribution.textContent = `${Math.min(100, tokenPercentage).toFixed(1)}%`;
            tokenContribution.style.color = tokenPercentage >= 50 ? '#4CAF50' : tokenPercentage >= 20 ? '#FFC107' : '#ffffff';
        }
        
        if (wsContribution) {
            wsContribution.textContent = `${Math.min(100, wsPercentage).toFixed(1)}%`;
            wsContribution.style.color = wsPercentage >= 50 ? '#4CAF50' : wsPercentage >= 20 ? '#FFC107' : '#ffffff';
        }
        
        if (tokenBar) {
            tokenBar.style.width = `${Math.min(100, tokenPercentage)}%`;
        }
        
        if (wsBar) {
            wsBar.style.width = `${Math.min(100, wsPercentage)}%`;
        }
    }
}

function calculateRewards() {
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
    
    // Calculate gamma scale
    const gammaData = calculateGammaScale(participatingTokens, totalWS);
    const gamma = gammaData.gamma;
    
    // Calculate user's share and reward
    const userShare = totalWS > 0 ? (userWS / totalWS) : 0;
    const userReward = userShare * WERP * gamma;
    const effectivePool = WERP * gamma;
    
    const resultElement = document.getElementById('reward-result');
    if (!resultElement) return;
    
    if (userWS <= 0 || batchData.length === 0) {
        resultElement.innerHTML = 'Please enter valid token batches!';
        resultElement.style.color = 'var(--rebel-red)';
        hideChart();
        return;
    }
    
    // Calculate percentage of active pool
    const poolPercentage = (userShare * 100).toFixed(4);
    const returnPercentage = totalAmount > 0 ? ((userReward / totalAmount) * 100).toFixed(4) : '0.0000';
    
    resultElement.innerHTML = `
        <div style="text-align: left;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Your Weighted Share (WSᵢ):</strong></span>
                <span style="color: var(--rebel-gold);">${formatNumber(userWS, true)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Total Active Weighted Shares (∑WS):</strong></span>
                <span style="color: var(--rebel-gold);">${formatNumber(totalWS)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em;">
                <span><strong>Your Share of Active Pool:</strong></span>
                <span style="color: var(--rebel-gold);">${poolPercentage}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em; font-size: 0.9em;">
                <span><strong>Gamma Scale Factor (γ):</strong></span>
                <span style="color: ${getGammaColor(gamma)}; font-weight: bold;">${gamma.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em; font-size: 0.9em;">
                <span><strong>Effective Weekly Pool:</strong></span>
                <span style="color: var(--rebel-red); font-weight: bold;">${formatNumber(effectivePool, false)} $REBL</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5em; font-size: 0.9em;">
                <span><strong>Return on $rebelinux:</strong></span>
                <span style="color: var(--rebel-gold);">${returnPercentage}% weekly</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2em; margin-top: 0.5em; padding-top: 0.5em; border-top: 1px solid rgba(255, 204, 0, 0.3);">
                <span><strong>Your Sustainable Reward:</strong></span>
                <span style="color: var(--rebel-red); font-weight: bold;">${formatNumber(userReward, true)} $REBL</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 0.5em; font-size: 0.9em; color: rgba(255, 255, 255, 0.7);">
                <span><em>Based on ${formatNumber(participatingTokens)} participating tokens with γ=${gamma.toFixed(2)}</em></span>
            </div>
        </div>
    `;
    resultElement.style.color = 'var(--rebel-gold)';
    
    // Update chart with weighted shares
    updateChart(batchData, userWS);
}

// ========== WHAT-IF GAMMA SIMULATOR ==========
function updateWhatIfGamma() {
    const participating = parseInt(document.getElementById('whatIfParticipating').value) || 100000000;
    const totalWS = parseInt(document.getElementById('whatIfTotalWS').value) || 100000000;
    
    // Update display values
    document.getElementById('whatIfParticipatingValue').textContent = formatNumber(participating);
    document.getElementById('whatIfTotalWSValue').textContent = formatNumber(totalWS);
    
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
            MAX(0.4, MIN(1, 
            <span style="color: #ff3366;">${gammaData.participationTerm.toFixed(2)}</span>, 
            <span style="color: #ffcc00;">${gammaData.inflationCap.toFixed(2)}</span>)) = 
            <span style="color: ${getGammaColor(gamma)};">${gamma.toFixed(2)}</span>
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
    
    // Create new chart
    rewardChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map((label, i) => `${label} (${percentages[i]}%)`),
            datasets: [{
                data: weightedShares,
                backgroundColor: [
                    'rgba(255, 51, 102, 0.8)',
                    'rgba(255, 204, 0, 0.8)',
                    'rgba(0, 170, 255, 0.8)',
                    'rgba(156, 39, 176, 0.8)',
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(255, 152, 0, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 51, 102, 1)',
                    'rgba(255, 204, 0, 1)',
                    'rgba(0, 170, 255, 1)',
                    'rgba(156, 39, 176, 1)',
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 152, 0, 1)'
                ],
                borderWidth: 2,
                hoverOffset: 15
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
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'var(--rebel-gold)',
                    bodyColor: 'white',
                    borderColor: 'var(--rebel-gold)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const batch = batchData[context.dataIndex];
                            return [
                                `Amount: ${formatNumber(batch.amount)} $rebelinux`,
                                `Age: ${batch.age} epochs`,
                                `Factor: ${(1 + (K * Math.min(batch.age, MAX_AGE))).toFixed(2)}`,
                                `Weighted Share: ${formatNumber(batch.ws, true)}`
                            ];
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
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
                addTokenBatch('100000', '5'); // 100K tokens, 5 epochs
                addTokenBatch('50000', '3');  // 50K tokens, 3 epochs
                break;
                
            case 'investor':
                // Medium-sized investor
                addTokenBatch('1000000', '8'); // 1M tokens, 8 epochs
                addTokenBatch('2000000', '4'); // 2M tokens, 4 epochs
                addTokenBatch('500000', '12'); // 500K tokens, 12 epochs
                break;
                
            case 'whale':
                // Large holder
                addTokenBatch('5000000', '10'); // 5M tokens, 10 epochs
                addTokenBatch('3000000', '15'); // 3M tokens, 15 epochs
                addTokenBatch('2000000', '20'); // 2M tokens, 20 epochs (max age bonus)
                addTokenBatch('1000000', '2');  // 1M tokens, 2 epochs
                break;
                
            default:
                // Fallback to starter
                addTokenBatch('500000', '1');
        }
        
        // Add example description
        const resultElement = document.getElementById('reward-result');
        if (resultElement) {
            resultElement.innerHTML = `
                <div style="text-align: center; margin-bottom: var(--spacing-sm);">
                    <span style="color: var(--rebel-gold); font-weight: bold; font-size: 1.1rem;">
                        <i class="fas fa-user-check"></i> ${type.charAt(0).toUpperCase() + type.slice(1)} Example Loaded
                    </span>
                </div>
                <p style="text-align: center; color: var(--rebel-gold); font-size: 0.9rem;">
                    Adjust participation settings and click "Calculate Sustainable Rewards" to see results!
                </p>
            `;
        }
        
        // Enable auto-update for examples
        calculatorState.autoUpdateParticipation = true;
        const toggle = document.getElementById('autoUpdateToggle');
        if (toggle) toggle.checked = true;
        updateParticipationUI();
        
        // Recalculate after a short delay
        setTimeout(() => calculateRewards(), 500);
    }, 500);
}

// ========== HELPER FUNCTIONS ==========
function formatNumber(num, showDecimals = false) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    
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
window.updateParticipation = updateParticipation;
window.calculateRewards = calculateRewards;
window.updateWhatIfGamma = updateWhatIfGamma;
window.loadExampleCase = loadExampleCase;

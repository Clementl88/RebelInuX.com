// rebl-calculator.js - Calculator-specific JavaScript

// Global variables
let rewardChart = null;
const CS = 499242047.00; // Circulating Supply
const WERP = 3200000.00; // Weekly Epoch Reward Pool
const K = 0.07; // Age bonus per epoch
const MAX_AGE = 20; // Maximum age for bonus

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
});

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
        wsCell.textContent = weightedShare.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        wsCell.style.color = 'var(--rebel-red)';
    }
    
    calculateRewards();
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
    
    calculateRewards();
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
    const participatingTokens = parseInt(document.getElementById('participatingTokens').value) || 100000000;
    const totalWS = parseInt(document.getElementById('totalWS').value) || 100000000;
    
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

function updateChart(batchData, totalWS) {
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
    const percentages = weightedShares.map(ws => ((ws / totalWS) * 100).toFixed(1));
    
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
        
        // Recalculate after a short delay
        setTimeout(() => calculateRewards(), 500);
    }, 500);
}

// ========== HELPER FUNCTIONS ==========
function formatNumber(num, showDecimals = false) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    
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

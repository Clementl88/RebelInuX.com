// rebelinus-journey.js - RebelInuX Journey Functionality
// 1 vote = 500,000 $REBL
// Contract: F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump

const REBL_CONTRACT = "F4gh7VNjtp69gKv3JVhFFtXTD4NBbHfbEq5zdiBJpump";
const VOTE_THRESHOLD = 500000; // 500,000 $REBL = 1 vote

let voteData = {
    destinations: [
        { 
            id: "ancient_rome", 
            name: "Ancient Rome", 
            era: "73 BCE", 
            location: "Roman Republic",
            desc: "Witness the rebellion of Spartacus and the gladiators against the Roman Empire. Support those fighting for freedom against oppression.",
            icon: "fa-roman-statue", 
            votes: 1245 
        },
        { 
            id: "viking_age", 
            name: "Viking Age", 
            era: "793-1066 CE", 
            location: "Scandinavia",
            desc: "Join the Viking rebels as they challenge feudal kingdoms and explore new lands. Support Norse explorers and warriors.",
            icon: "fa-viking", 
            votes: 980 
        },
        { 
            id: "renaissance", 
            name: "Renaissance Italy", 
            era: "14th-17th Century", 
            location: "Florence, Italy",
            desc: "Stand with revolutionary artists and thinkers challenging the established order. Support the birth of humanism and free thought.",
            icon: "fa-palette", 
            votes: 1560 
        },
        { 
            id: "american_revolution", 
            name: "American Revolution", 
            era: "1775-1783", 
            location: "American Colonies",
            desc: "Travel to 1776 and stand with colonists fighting for independence. Support the birth of a new nation built on liberty.",
            icon: "fa-fist-raised", 
            votes: 890 
        },
        { 
            id: "future_rebellion", 
            name: "Future Rebellion", 
            era: "The Future", 
            location: "Unknown",
            desc: "Journey forward to witness future rebellions. Support those fighting for freedom in tomorrow's world.",
            icon: "fa-robot", 
            votes: 1450 
        }
    ],
    totalVotes: 6125,
    activeVoters: 1247,
    selectedDestination: null,
    selectedTiming: null,
    walletConnected: false,
    walletAddress: null,
    walletBalance: 0,
    votingPower: 0
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initRebelInuXJourney, 300);
});

function initRebelInuXJourney() {
    console.log('RebelInuX Journey Initialized - 1 vote = 500,000 $REBL');
    console.log('Contract:', REBL_CONTRACT);
    
    renderVoteOptions();
    initTimingOptions();
    initPastJourneys();
    renderLeaderboard();
    initWalletConnection();
    initCountdownTimer();
    initSuggestions();
    initNotifyButton();
    updateVoteStats();
    
    // Periodic updates
    setInterval(updateVoteStats, 30000);
    saveJourneyVisit();
}

// Calculate voting power based on $REBL balance
function calculateVotingPower(balance) {
    return Math.floor(balance / VOTE_THRESHOLD);
}

// Render vote options
function renderVoteOptions() {
    const container = document.getElementById('voteOptionsContainer');
    if (!container) return;
    
    container.innerHTML = voteData.destinations.map(dest => `
        <div class="vote-option" data-id="${dest.id}" onclick="selectDestination('${dest.id}')">
            <div class="vote-option-icon">
                <i class="fas ${dest.icon}"></i>
            </div>
            <h4>${dest.name}</h4>
            <div>
                <span class="era-badge">${dest.era}</span>
                <span class="location-badge"><i class="fas fa-map-marker-alt"></i> ${dest.location}</span>
            </div>
            <p>${dest.desc}</p>
            <div class="vote-count">
                <i class="fas fa-vote-yea"></i> ${dest.votes.toLocaleString()} votes
            </div>
        </div>
    `).join('');
    
    if (voteData.selectedDestination) {
        const selected = document.querySelector(`.vote-option[data-id="${voteData.selectedDestination}"]`);
        if (selected) selected.classList.add('selected');
    }
}

// Select destination
function selectDestination(id) {
    document.querySelectorAll('.vote-option').forEach(opt => opt.classList.remove('selected'));
    const selected = document.querySelector(`.vote-option[data-id="${id}"]`);
    if (selected) selected.classList.add('selected');
    voteData.selectedDestination = id;
    const destName = voteData.destinations.find(d => d.id === id).name;
    showToast(`You're sending RebelInuX to ${destName}!`, 'info');
}

// Initialize timing options
function initTimingOptions() {
    const timingBtns = document.querySelectorAll('.timing-btn');
    timingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            timingBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            voteData.selectedTiming = this.getAttribute('data-timing');
            const timingText = this.querySelector('span:first-child').textContent.trim();
            showToast(`RebelInuX will travel ${timingText}`, 'info');
        });
    });
}

// Initialize past journeys gallery
function initPastJourneys() {
    const gallery = document.getElementById('pastJourneysGallery');
    if (!gallery) return;
    
    gallery.innerHTML = `
        <div class="journey-card">
            <div class="journey-video-placeholder">
                <i class="fas fa-flag-france"></i>
                <i class="fas fa-play-circle"></i>
            </div>
            <div class="journey-card-content">
                <h4>French Revolution 1789</h4>
                <p><i class="fas fa-map-marker-alt"></i> Paris, France</p>
                <p>RebelInuX stood with the revolutionaries, witnessing the storming of the Bastille and the birth of modern democracy.</p>
                <small><i class="fas fa-calendar-alt"></i> Coming Soon</small>
                <div style="margin-top: 10px;">
                    <span class="status-badge status-in-progress">
                        <i class="fas fa-film"></i> In Production
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Render leaderboard
function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    const leaders = [
        { rank: 1, name: "Pathfinder.eth", votes: 3420, badge: "🥇" },
        { rank: 2, name: "TimeTraveler_Sol", votes: 2890, badge: "🥈" },
        { rank: 3, name: "RebelGuide", votes: 2100, badge: "🥉" },
        { rank: 4, name: "HistorySeeker", votes: 1875, badge: "⭐" },
        { rank: 5, name: "JourneyHodler", votes: 1432, badge: "⭐" },
        { rank: 6, name: "AdventureRebel", votes: 1240, badge: "⭐" },
        { rank: 7, name: "TrailBlazer_X", votes: 987, badge: "⭐" },
        { rank: 8, name: "WildExplorer", votes: 856, badge: "⭐" },
        { rank: 9, name: "SummitSeeker", votes: 723, badge: "⭐" },
        { rank: 10, name: "RoamingRebel", votes: 654, badge: "⭐" }
    ];
    
    leaderboardList.innerHTML = leaders.map(leader => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">${leader.badge} #${leader.rank}</span>
            <span class="leaderboard-name">
                <i class="fab fa-ethereum"></i> ${leader.name}
            </span>
            <span class="leaderboard-votes">
                <i class="fas fa-vote-yea"></i> ${leader.votes.toLocaleString()} votes
            </span>
        </div>
    `).join('');
}

// Wallet connection
function initWalletConnection() {
    const connectBtn = document.getElementById('connectWalletBtn');
    if (!connectBtn) return;
    
    connectBtn.addEventListener('click', toggleWalletConnection);
    
    const savedWallet = localStorage.getItem('rebelinusWalletConnected');
    const savedBalance = localStorage.getItem('rebelinusWalletBalance');
    if (savedWallet === 'true' && savedBalance) {
        voteData.walletConnected = true;
        voteData.walletAddress = localStorage.getItem('rebelinusWalletAddress');
        voteData.walletBalance = parseInt(savedBalance);
        voteData.votingPower = calculateVotingPower(voteData.walletBalance);
        updateWalletUI();
    }
}

function toggleWalletConnection() {
    if (voteData.walletConnected) {
        disconnectWallet();
    } else {
        connectWallet();
    }
}

function connectWallet() {
    showToast('Connecting wallet to check $REBL holdings...', 'info');
    
    setTimeout(() => {
        // Simulate wallet balance check
        const mockBalance = Math.floor(Math.random() * 5000000) + 500000;
        voteData.walletConnected = true;
        voteData.walletAddress = '0x' + Math.random().toString(16).substr(2, 12);
        voteData.walletBalance = mockBalance;
        voteData.votingPower = calculateVotingPower(mockBalance);
        
        localStorage.setItem('rebelinusWalletConnected', 'true');
        localStorage.setItem('rebelinusWalletAddress', voteData.walletAddress);
        localStorage.setItem('rebelinusWalletBalance', mockBalance);
        
        updateWalletUI();
        showToast(`Wallet connected! You have ${voteData.walletBalance.toLocaleString()} $REBL = ${voteData.votingPower} vote${voteData.votingPower !== 1 ? 's' : ''}`, 'success');
    }, 1000);
}

function disconnectWallet() {
    voteData.walletConnected = false;
    voteData.walletAddress = null;
    voteData.walletBalance = 0;
    voteData.votingPower = 0;
    localStorage.removeItem('rebelinusWalletConnected');
    localStorage.removeItem('rebelinusWalletAddress');
    localStorage.removeItem('rebelinusWalletBalance');
    updateWalletUI();
    showToast('Wallet disconnected.', 'info');
}

function updateWalletUI() {
    const walletStatus = document.getElementById('walletStatus');
    const connectBtn = document.getElementById('connectWalletBtn');
    
    if (voteData.walletConnected && voteData.walletAddress) {
        const shortAddress = voteData.walletAddress.slice(0, 6) + '...' + voteData.walletAddress.slice(-4);
        walletStatus.innerHTML = `<i class="fas fa-check-circle"></i> ${shortAddress} | ${voteData.walletBalance.toLocaleString()} $REBL = ${voteData.votingPower} vote${voteData.votingPower !== 1 ? 's' : ''}`;
        connectBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Disconnect';
        connectBtn.style.background = '#ff4444';
        connectBtn.style.color = 'white';
    } else {
        walletStatus.innerHTML = '<i class="fas fa-link"></i> Not connected';
        connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
        connectBtn.style.background = 'var(--rebel-gold)';
        connectBtn.style.color = '#1a1a1a';
    }
}

// Submit vote
function submitVote() {
    if (!voteData.selectedDestination) {
        showToast('Where should RebelInuX go? Choose a destination first!', 'error');
        return;
    }
    
    if (!voteData.selectedTiming) {
        showToast('When should RebelInuX travel? Select a timing!', 'error');
        return;
    }
    
    if (!voteData.walletConnected) {
        showToast('Connect your wallet to vote! 500,000 $REBL = 1 vote.', 'warning');
        return;
    }
    
    if (voteData.votingPower === 0) {
        showToast(`You need at least ${VOTE_THRESHOLD.toLocaleString()} $REBL to vote. Current balance: ${voteData.walletBalance.toLocaleString()} $REBL`, 'warning');
        return;
    }
    
    const weight = voteData.votingPower;
    const destIndex = voteData.destinations.findIndex(d => d.id === voteData.selectedDestination);
    
    if (destIndex !== -1) {
        voteData.destinations[destIndex].votes += weight;
        voteData.totalVotes += weight;
        
        renderVoteOptions();
        updateVoteStats();
        
        const destName = voteData.destinations[destIndex].name;
        const timingText = document.querySelector(`.timing-btn[data-timing="${voteData.selectedTiming}"] span:first-child`).textContent.trim();
        
        showToast(`✓ ${weight} vote${weight !== 1 ? 's' : ''} cast for ${destName}! Travel: ${timingText}`, 'success');
        
        saveVoteToLocalStorage(voteData.selectedDestination, weight);
        
        voteData.selectedDestination = null;
        voteData.selectedTiming = null;
        
        document.querySelectorAll('.vote-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.timing-btn').forEach(btn => btn.classList.remove('selected'));
    }
}

document.addEventListener('click', function(e) {
    if (e.target.id === 'submitVoteBtn' || e.target.closest('#submitVoteBtn')) {
        submitVote();
    }
});

function saveVoteToLocalStorage(destination, weight) {
    const votes = JSON.parse(localStorage.getItem('rebelinusUserVotes') || '[]');
    votes.push({ destination, weight, timestamp: new Date().toISOString() });
    localStorage.setItem('rebelinusUserVotes', JSON.stringify(votes));
}

// Update vote stats
function updateVoteStats() {
    const totalVotesSpan = document.getElementById('totalVotesCount');
    const activeVotersSpan = document.getElementById('activeVotersCount');
    const liveTallyDiv = document.getElementById('liveTally');
    
    if (totalVotesSpan) {
        totalVotesSpan.textContent = voteData.totalVotes.toLocaleString();
    }
    
    if (activeVotersSpan) {
        voteData.activeVoters = 1247 + Math.floor(Math.random() * 10);
        activeVotersSpan.textContent = voteData.activeVoters.toLocaleString();
    }
    
    if (liveTallyDiv) {
        const tallyHtml = voteData.destinations.map(d => 
            `<div><strong>${d.name}:</strong> ${d.votes.toLocaleString()} votes (${Math.round((d.votes/voteData.totalVotes)*100)}%)</div>`
        ).join('');
        liveTallyDiv.innerHTML = tallyHtml;
    }
}

// Countdown timer
function initCountdownTimer() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(23, 59, 59, 0);
    
    const timerElement = document.getElementById('countdownTimer');
    const deadlineElement = document.getElementById('voteDeadline');
    
    function updateTimer() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            if (timerElement) timerElement.innerHTML = 'Voting Closed!';
            if (deadlineElement) deadlineElement.innerHTML = 'Voting has ended';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / 3600000);
        
        if (timerElement) {
            timerElement.innerHTML = days > 0 ? `${days}d ${hours}h` : `${hours}h`;
        }
        if (deadlineElement) {
            deadlineElement.innerHTML = `${days} days, ${hours} hours`;
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 60000);
}

// Notify button
function initNotifyButton() {
    const notifyBtn = document.getElementById('notifyBtn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function() {
            if (!voteData.walletConnected) {
                showToast('Connect your wallet to get notified when the French Revolution journey releases!', 'warning');
                return;
            }
            showToast('You\'ll be notified when RebelInuX\'s Paris adventure is ready!', 'success');
            localStorage.setItem('rebelinusNotifyFrenchRevolution', 'true');
        });
    }
}

// Community suggestions
function initSuggestions() {
    const submitBtn = document.getElementById('submitSuggestionBtn');
    const input = document.getElementById('suggestionInput');
    
    if (submitBtn && input) {
        submitBtn.addEventListener('click', function() {
            const suggestion = input.value.trim();
            if (suggestion) {
                addSuggestion(suggestion);
                input.value = '';
                showToast('Suggestion submitted! RebelInuX might visit there soon!', 'success');
            } else {
                showToast('Where should RebelInuX go? Enter a destination!', 'warning');
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') submitBtn.click();
        });
    }
}

function addSuggestion(suggestion) {
    const suggestionsList = document.getElementById('suggestionsList');
    if (suggestionsList) {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span>${escapeHtml(suggestion)}</span>
            <span style="margin-left: auto; color: var(--rebel-gold);">0 votes</span>
        `;
        suggestionsList.insertBefore(suggestionItem, suggestionsList.firstChild);
        
        const suggestions = JSON.parse(localStorage.getItem('rebelinusSuggestions') || '[]');
        suggestions.unshift({ text: suggestion, votes: 0, timestamp: new Date().toISOString() });
        localStorage.setItem('rebelinusSuggestions', JSON.stringify(suggestions.slice(0, 10)));
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.journey-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `journey-toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'dog' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save journey visit
function saveJourneyVisit() {
    const lastVisit = localStorage.getItem('rebelinusJourneyLastVisit');
    const now = new Date();
    
    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        if (daysDiff > 0 && daysDiff < 7) {
            setTimeout(() => {
                showToast(`Welcome back! RebelInuX missed your guidance. ${daysDiff} day${daysDiff === 1 ? '' : 's'} since your last visit.`, 'info');
            }, 1000);
        }
    }
    
    localStorage.setItem('rebelinusJourneyLastVisit', now.toISOString());
}

// Make functions globally available
window.selectDestination = selectDestination;

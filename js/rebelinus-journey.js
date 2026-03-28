// rebelinus-journey.js - RebelInuX Journey page functionality

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initRebelInuXJourney, 300);
});

// Main initialization function
function initRebelInuXJourney() {
    console.log('Initializing RebelInuX Journey page');
    
    // Initialize all components
    initVoteData();
    initVoteOptions();
    initTimingOptions();
    initPastJourneys();
    initLeaderboard();
    initWalletConnection();
    initCountdownTimer();
    initSuggestions();
    initMobileDropdown();
    initScrollAnimations();
    
    // Save visit to localStorage
    saveJourneyVisit();
    
    // Start periodic updates
    setInterval(updateVoteStats, 30000); // Update every 30 seconds
}

// ========== VOTE DATA ==========
let voteData = {
    destinations: [
        { 
            id: "alps", 
            name: "Alpine Ascent", 
            desc: "Hiking & paragliding in the majestic Swiss Alps. Experience breathtaking mountain views and adrenaline-pumping flights with the RebelInuX crew.", 
            icon: "fa-mountain",
            votes: 1245,
            image: "alps.jpg"
        },
        { 
            id: "moab", 
            name: "Desert Drift", 
            desc: "Overlanding & rock crawling in Moab, Utah. Conquer legendary off-road trails and explore red rock canyons with fellow Rebels.", 
            icon: "fa-car-side",
            votes: 980,
            image: "moab.jpg"
        },
        { 
            id: "azores", 
            name: "Coastal Siege", 
            desc: "Freediving & cliff jumping in the Azores. Discover volcanic landscapes, crystal clear waters, and marine life on this RebelInuX adventure.", 
            icon: "fa-water",
            votes: 1560,
            image: "azores.jpg"
        },
        { 
            id: "patagonia", 
            name: "Patagonian Odyssey", 
            desc: "Trekking through Torres del Paine and exploring glaciers. Pure wilderness and untouched nature for the ultimate Rebel journey.", 
            icon: "fa-hiking",
            votes: 890,
            image: "patagonia.jpg"
        }
    ],
    totalVotes: 4675,
    activeVoters: 1247,
    selectedDestination: null,
    selectedTiming: null
};

// ========== VOTE OPTIONS ==========
function initVoteOptions() {
    const container = document.getElementById('voteOptionsContainer');
    if (!container) return;
    
    renderVoteOptions();
    
    // Add click handlers to vote options
    document.querySelectorAll('.vote-option').forEach(opt => {
        opt.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            selectDestination(id);
        });
    });
}

function renderVoteOptions() {
    const container = document.getElementById('voteOptionsContainer');
    if (!container) return;
    
    container.innerHTML = voteData.destinations.map(dest => `
        <div class="vote-option" data-id="${dest.id}">
            <div class="vote-option-icon">
                <i class="fas ${dest.icon}"></i>
            </div>
            <h4>${dest.name}</h4>
            <p>${dest.desc}</p>
            <div class="vote-count">
                <i class="fas fa-vote-yea"></i> ${dest.votes.toLocaleString()} votes
            </div>
        </div>
    `).join('');
    
    // Highlight selected if any
    if (voteData.selectedDestination) {
        const selected = document.querySelector(`.vote-option[data-id="${voteData.selectedDestination}"]`);
        if (selected) selected.classList.add('selected');
    }
}

function selectDestination(id) {
    // Remove selected class from all
    document.querySelectorAll('.vote-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked
    const selected = document.querySelector(`.vote-option[data-id="${id}"]`);
    if (selected) selected.classList.add('selected');
    
    voteData.selectedDestination = id;
    const destName = voteData.destinations.find(d => d.id === id).name;
    showToast(`Selected for RebelInuX: ${destName}`, 'info');
}

// ========== TIMING OPTIONS ==========
function initTimingOptions() {
    const timingBtns = document.querySelectorAll('.timing-btn');
    timingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            timingBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            voteData.selectedTiming = this.getAttribute('data-timing');
            const timingText = this.querySelector('span:first-child').textContent.trim();
            showToast(`RebelInuX timing selected: ${timingText}`, 'info');
        });
    });
}

// ========== PAST JOURNEYS ==========
function initPastJourneys() {
    const gallery = document.getElementById('pastJourneysGallery');
    if (!gallery) return;
    
    const pastJourneys = [
        { 
            title: "Operation: Iceland", 
            desc: "Glacier hiking, ice caves, and the northern lights in Iceland's rugged terrain with the RebelInuX community.", 
            date: "March 2025", 
            icon: "fa-snowflake",
            videoUrl: "#"
        },
        { 
            title: "Operation: Baja", 
            desc: "Desert surfing, off-road adventures, and coastal exploration in Baja California with RebelInuX crew.", 
            date: "January 2025", 
            icon: "fa-sun",
            videoUrl: "#"
        },
        { 
            title: "Operation: Appalachia", 
            desc: "Mountain trails, waterfalls, and ancient forests in the Appalachian Mountains guided by RebelInuX.", 
            date: "October 2024", 
            icon: "fa-tree",
            videoUrl: "#"
        },
        { 
            title: "Operation: Japan Alps", 
            desc: "Winter climbing, hot springs, and cultural immersion in the Japanese Alps with fellow Rebels.", 
            date: "December 2024", 
            icon: "fa-mountain-sun",
            videoUrl: "#"
        }
    ];
    
    gallery.innerHTML = pastJourneys.map(journey => `
        <div class="journey-card" onclick="playJourneyVideo('${journey.videoUrl}')">
            <div class="journey-video-placeholder">
                <i class="fas ${journey.icon}"></i>
                <i class="fas fa-play-circle"></i>
            </div>
            <div class="journey-card-content">
                <h4>${journey.title}</h4>
                <p>${journey.desc}</p>
                <small><i class="fas fa-calendar-alt"></i> ${journey.date}</small>
                <div style="margin-top: 10px;">
                    <span class="status-badge status-completed">
                        <i class="fas fa-check-circle"></i> Chosen by RebelInuX community
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== LEADERBOARD ==========
function initLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    const leaders = [
        { rank: 1, name: "CryptoNomad.eth", votes: 3420, badge: "🥇" },
        { rank: 2, name: "RebelWolf_Sol", votes: 2890, badge: "🥈" },
        { rank: 3, name: "DegenVoyager", votes: 2100, badge: "🥉" },
        { rank: 4, name: "MoonShotMike", votes: 1875, badge: "⭐" },
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

// ========== WALLET CONNECTION ==========
let walletConnected = false;
let walletAddress = null;

function initWalletConnection() {
    const connectBtn = document.getElementById('connectWalletBtn');
    if (!connectBtn) return;
    
    connectBtn.addEventListener('click', toggleWalletConnection);
    
    // Check if wallet was previously connected
    const savedWallet = localStorage.getItem('rebelinusWalletConnected');
    if (savedWallet === 'true') {
        walletConnected = true;
        walletAddress = localStorage.getItem('rebelinusWalletAddress');
        updateWalletUI();
    }
}

function toggleWalletConnection() {
    if (walletConnected) {
        disconnectWallet();
    } else {
        connectWallet();
    }
}

function connectWallet() {
    // Simulate wallet connection
    showToast('Connecting to wallet for RebelInuX...', 'info');
    
    setTimeout(() => {
        walletConnected = true;
        walletAddress = '0x' + Math.random().toString(16).substr(2, 12);
        localStorage.setItem('rebelinusWalletConnected', 'true');
        localStorage.setItem('rebelinusWalletAddress', walletAddress);
        updateWalletUI();
        showToast('Wallet connected successfully! Your RebelInuX voting power is now active.', 'success');
    }, 1000);
}

function disconnectWallet() {
    walletConnected = false;
    walletAddress = null;
    localStorage.removeItem('rebelinusWalletConnected');
    localStorage.removeItem('rebelinusWalletAddress');
    updateWalletUI();
    showToast('Wallet disconnected from RebelInuX', 'info');
}

function updateWalletUI() {
    const walletStatus = document.getElementById('walletStatus');
    const connectBtn = document.getElementById('connectWalletBtn');
    
    if (walletConnected && walletAddress) {
        const shortAddress = walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);
        walletStatus.innerHTML = `<i class="fas fa-check-circle"></i> Connected: ${shortAddress}`;
        connectBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Disconnect';
        connectBtn.style.background = '#ff4444';
    } else {
        walletStatus.innerHTML = '<i class="fas fa-link"></i> Wallet not connected';
        connectBtn.innerHTML = '<i class="fas fa-wallet"></i> Connect Wallet';
        connectBtn.style.background = 'var(--rebel-gold)';
    }
}

// ========== SUBMIT VOTE ==========
document.addEventListener('click', function(e) {
    if (e.target.id === 'submitVoteBtn' || e.target.closest('#submitVoteBtn')) {
        submitVote();
    }
});

function submitVote() {
    if (!voteData.selectedDestination) {
        showToast('Please select a destination for the RebelInuX journey!', 'error');
        return;
    }
    
    if (!voteData.selectedTiming) {
        showToast('Please select a timing for the RebelInuX journey!', 'error');
        return;
    }
    
    if (!walletConnected) {
        showToast('Please connect your wallet to vote as a RebelInuX holder!', 'warning');
        return;
    }
    
    // Simulate vote submission with weight based on wallet (mock)
    const weight = Math.floor(Math.random() * 500) + 50;
    const destIndex = voteData.destinations.findIndex(d => d.id === voteData.selectedDestination);
    
    if (destIndex !== -1) {
        voteData.destinations[destIndex].votes += weight;
        voteData.totalVotes += weight;
        
        // Update UI
        renderVoteOptions();
        updateVoteStats();
        
        const destName = voteData.destinations[destIndex].name;
        const timingText = document.querySelector(`.timing-btn[data-timing="${voteData.selectedTiming}"] span:first-child`).textContent.trim();
        
        showToast(`✓ RebelInuX vote cast for ${destName} with ${weight} voting power! Timing: ${timingText}`, 'success');
        
        // Save to localStorage for persistence
        saveVoteToLocalStorage(voteData.selectedDestination, weight);
        
        // Reset selection after vote
        voteData.selectedDestination = null;
        voteData.selectedTiming = null;
        
        // Clear UI selection
        document.querySelectorAll('.vote-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.timing-btn').forEach(btn => btn.classList.remove('selected'));
    }
}

function saveVoteToLocalStorage(destination, weight) {
    const votes = JSON.parse(localStorage.getItem('rebelinusUserVotes') || '[]');
    votes.push({
        destination: destination,
        weight: weight,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('rebelinusUserVotes', JSON.stringify(votes));
}

// ========== VOTE STATS ==========
function updateVoteStats() {
    const totalVotesSpan = document.getElementById('totalVotesCount');
    const activeVotersSpan = document.getElementById('activeVotersCount');
    const liveTallyDiv = document.getElementById('liveTally');
    
    if (totalVotesSpan) {
        totalVotesSpan.textContent = voteData.totalVotes.toLocaleString();
    }
    
    if (activeVotersSpan) {
        // Simulate active voter growth
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

// ========== COUNTDOWN TIMER ==========
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
        const minutes = Math.floor((diff % 3600000) / 60000);
        
        if (timerElement) {
            if (days > 0) {
                timerElement.innerHTML = `${days}d ${hours}h`;
            } else {
                timerElement.innerHTML = `${hours}h ${minutes}m`;
            }
        }
        
        if (deadlineElement) {
            deadlineElement.innerHTML = `${days} days, ${hours} hours`;
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 60000);
}

// ========== COMMUNITY SUGGESTIONS ==========
function initSuggestions() {
    const submitBtn = document.getElementById('submitSuggestionBtn');
    const input = document.getElementById('suggestionInput');
    
    if (submitBtn && input) {
        submitBtn.addEventListener('click', function() {
            const suggestion = input.value.trim();
            if (suggestion) {
                addSuggestion(suggestion);
                input.value = '';
                showToast('Suggestion submitted to RebelInuX community! It will appear in the next voting cycle.', 'success');
            } else {
                showToast('Please enter a destination suggestion for RebelInuX!', 'warning');
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
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
        
        // Save to localStorage
        const suggestions = JSON.parse(localStorage.getItem('rebelinusSuggestions') || '[]');
        suggestions.unshift({ text: suggestion, votes: 0, timestamp: new Date().toISOString() });
        localStorage.setItem('rebelinusSuggestions', JSON.stringify(suggestions.slice(0, 10)));
    }
}

// ========== UTILITY FUNCTIONS ==========
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.journey-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `journey-toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.vote-card, .journey-card, .leaderboard-item, .suggestion-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }
}

// ========== MOBILE DROPDOWN ==========
function initMobileDropdown() {
    const dropbtn = document.querySelector('.dropbtn');
    if (!dropbtn) return;
    
    dropbtn.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();
            const dropdownContent = this.nextElementSibling;
            if (dropdownContent) {
                const isVisible = dropdownContent.style.display === 'block';
                dropdownContent.style.display = isVisible ? 'none' : 'block';
                this.classList.toggle('active');
            }
        }
    });
}

// ========== SAVE VISIT ==========
function saveJourneyVisit() {
    const lastVisit = localStorage.getItem('rebelinusJourneyLastVisit');
    const now = new Date();
    
    if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        if (daysDiff > 0 && daysDiff < 7) {
            setTimeout(() => {
                showToast(`Welcome back to the RebelInuX Journey! ${daysDiff} day${daysDiff === 1 ? '' : 's'} since your last visit.`, 'info');
            }, 1000);
        }
    }
    
    localStorage.setItem('rebelinusJourneyLastVisit', now.toISOString());
}

// ========== PLAY JOURNEY VIDEO ==========
window.playJourneyVideo = function(videoUrl) {
    showToast('RebelInuX journey video coming soon! Stay tuned for the full adventure.', 'info');
};

// ========== UPDATE VOTE STATS PERIODICALLY ==========
function updateVoteStatsPeriodically() {
    setInterval(() => {
        // Simulate small vote increases for demo
        if (Math.random() > 0.7) {
            const randomDest = Math.floor(Math.random() * voteData.destinations.length);
            const increment = Math.floor(Math.random() * 10) + 1;
            voteData.destinations[randomDest].votes += increment;
            voteData.totalVotes += increment;
            renderVoteOptions();
            updateVoteStats();
        }
    }, 45000);
}

// Start periodic updates
setTimeout(() => {
    updateVoteStats();
    updateVoteStatsPeriodically();
}, 2000);

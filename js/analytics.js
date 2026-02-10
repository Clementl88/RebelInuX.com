// analytics.js - Enhanced analytics with crypto-specific tracking

class RebelAnalytics {
    constructor() {
        this.initialized = false;
        this.userId = this.getUserId();
        this.sessionId = this.generateSessionId();
    }
    
    init() {
        if (this.initialized) return;
        
        // Initialize analytics providers
        this.initGoogleAnalytics();
        this.initCustomEvents();
        
        this.initialized = true;
        console.log('📊 Analytics initialized');
    }
    
    initGoogleAnalytics() {
        // Replace with your GA4 measurement ID
        const measurementId = 'G-PL0GBXNTMD';
        
        // Load gtag.js if not already loaded
        if (!window.gtag) {
            const script = document.createElement('script');
            script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
            script.async = true;
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
                dataLayer.push(arguments);
            };
            gtag('js', new Date());
            gtag('config', measurementId);
        }
    }
    
    initCustomEvents() {
        // Track page views
        this.trackPageView();
        
        // Track wallet interactions
        this.trackWalletEvents();
        
        // Track contract interactions
        this.trackContractEvents();
    }
    
    trackEvent(eventName, params = {}) {
        const eventData = {
            ...params,
            user_id: this.userId,
            session_id: this.sessionId,
            timestamp: Date.now(),
            url: window.location.href,
            user_agent: navigator.userAgent
        };
        
        // Send to Google Analytics
        if (window.gtag) {
            gtag('event', eventName, eventData);
        }
        
        // Send to custom endpoint (optional)
        this.sendToEndpoint(eventName, eventData);
        
        console.log(`📊 Event tracked: ${eventName}`, eventData);
    }
    
    trackPageView() {
        this.trackEvent('page_view', {
            page_title: document.title,
            page_path: window.location.pathname,
            page_referrer: document.referrer
        });
    }
    
    trackWalletEvents() {
        // Track wallet connection attempts
        document.addEventListener('click', (e) => {
            if (e.target.closest('.wallet-connect-btn')) {
                this.trackEvent('wallet_connect_attempt');
            }
        });
    }
    
    trackContractEvents() {
        // Track contract address copies
        document.addEventListener('click', (e) => {
            if (e.target.closest('.contract-value')) {
                this.trackEvent('contract_address_copied');
            }
        });
    }
    
    trackBuyClick(platform, url) {
        this.trackEvent('buy_link_clicked', {
            platform: platform,
            url: url,
            user_has_wallet: window.solana ? true : false
        });
    }
    
    trackMenuNavigation(menuItem, isMobile) {
        this.trackEvent('menu_navigation', {
            menu_item: menuItem,
            is_mobile: isMobile
        });
    }
    
    sendToEndpoint(eventName, data) {
        // Optional: Send to your own analytics endpoint
        // fetch('/api/analytics', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ event: eventName, data: data })
        // });
    }
    
    getUserId() {
        // Generate or retrieve user ID
        let userId = localStorage.getItem('rebel_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('rebel_user_id', userId);
        }
        return userId;
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Privacy compliant
    optOut() {
        localStorage.setItem('rebel_analytics_opt_out', 'true');
        console.log('📊 Analytics opted out');
    }
    
    optIn() {
        localStorage.removeItem('rebel_analytics_opt_out');
        console.log('📊 Analytics opted in');
    }
}

// Initialize analytics
const rebelAnalytics = new RebelAnalytics();
document.addEventListener('DOMContentLoaded', () => {
    // Check opt-out
    if (!localStorage.getItem('rebel_analytics_opt_out')) {
        rebelAnalytics.init();
    }
});

// Export for use in common.js
window.RebelAnalytics = rebelAnalytics;

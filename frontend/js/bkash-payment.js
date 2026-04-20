/**
 * bKash Sandbox Payment Integration
 * Demo payment gateway for SkillSwap Lite
 */

class BkashPaymentHandler {
    constructor() {
        this.paymentModal = document.getElementById('bkashPaymentModal');
        this.closeBtn = document.getElementById('closeBkashModal');
        this.payButton = document.getElementById('bkashPayButton');
        this.currentProvider = null;
        this.bKashReady = false;
        
        this.init();
    }
    
    init() {
        // Close modal button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.paymentModal) {
                this.closeModal();
            }
        });
        
        // Pay button click
        if (this.payButton) {
            this.payButton.addEventListener('click', () => this.initiatePayment());
        }
        
        // Listen for hire button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('hire-btn') || e.target.closest('.hire-btn')) {
                const button = e.target.classList.contains('hire-btn') ? e.target : e.target.closest('.hire-btn');
                const providerId = button.getAttribute('data-provider-id');
                const providerName = button.getAttribute('data-provider-name');
                this.openPaymentModal(providerId, providerName);
            }
        });
        
        // Initialize bKash when script loads
        this.waitForBkash();
    }
    
    waitForBkash() {
        if (typeof bKash !== 'undefined') {
            this.initBkash();
        } else {
            setTimeout(() => this.waitForBkash(), 500);
        }
    }
    
    initBkash() {
        // Get auth token from backend
        fetch('/api/payment/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: '1', providerId: 'demo', providerName: 'demo' })
        })
        .then(res => res.json())
        .then(data => {
            if (data.bkashURL) {
                this.bKashReady = true;
                if (this.payButton) this.payButton.disabled = false;
            }
        })
        .catch(err => console.error('bKash init error:', err));
    }
    
    openPaymentModal(providerId, providerName) {
        this.currentProvider = { id: providerId, name: providerName };
        
        const providerInfoDiv = document.getElementById('bkashProviderInfo');
        if (providerInfoDiv) {
            providerInfoDiv.innerHTML = `
                <h4>Hiring: ${providerName}</h4>
                <p>Complete payment to start your project</p>
            `;
        }
        
        document.getElementById('bkashAmount').value = '5000';
        
        if (this.paymentModal) {
            this.paymentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal() {
        if (this.paymentModal) {
            this.paymentModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    async initiatePayment() {
        const amount = document.getElementById('bkashAmount').value;
        
        if (!amount || amount < 100) {
            this.showNotification('Minimum amount is 100 BDT', 'error');
            return;
        }
        
        this.showLoading(true);
        
        try {
            const response = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount,
                    providerId: this.currentProvider.id,
                    providerName: this.currentProvider.name,
                    projectTitle: 'Project Hire'
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.paymentID) {
                this.openBkashCheckout(data.paymentID, amount);
            } else {
                this.showNotification(data.message || 'Payment initiation failed', 'error');
                this.showLoading(false);
            }
        } catch (error) {
            console.error('Payment error:', error);
            this.showNotification('Payment initiation failed', 'error');
            this.showLoading(false);
        }
    }
    
    openBkashCheckout(paymentID, amount) {
        this.closeModal();
        this.showLoading(false);
        
        // This would open bKash checkout popup
        // For demo purposes, show success modal
        this.showDemoSuccessModal(amount);
    }
    
    showDemoSuccessModal(amount) {
        const successModal = document.createElement('div');
        successModal.className = 'modal-overlay active';
        successModal.innerHTML = `
            <div class="modal-container success-modal">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Payment Initiated!</h2>
                <p>bKash checkout would open here in production</p>
                <div class="success-details">
                    <p><strong>Amount:</strong> ৳${parseInt(amount).toLocaleString()}</p>
                    <p><strong>Provider:</strong> ${this.currentProvider?.name}</p>
                    <p><strong>Status:</strong> <span style="color: #28a745;">Demo Mode</span></p>
                </div>
                <p class="payment-note-demo">
                    <strong>Note:</strong> This is a demonstration. 
                    To use real bKash sandbox, get credentials from 
                    <a href="https://developer.bka.sh/" target="_blank">bKash Developer Portal</a>
                </p>
                <button class="signup-submit" onclick="this.closest('.modal-overlay').remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(successModal);
        
        // Add CSS for demo note
        const style = document.createElement('style');
        style.textContent = `
            .payment-note-demo {
                font-size: 0.8rem;
                color: var(--text-secondary);
                margin-top: 15px;
                padding: 10px;
                background: #ffc10720;
                border-radius: 8px;
            }
            .payment-note-demo a {
                color: var(--accent-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showLoading(show) {
        let loader = document.getElementById('bkash-loader');
        
        if (show && !loader) {
            loader = document.createElement('div');
            loader.id = 'bkash-loader';
            loader.innerHTML = `
                <div class="payment-loading-overlay">
                    <div class="payment-spinner"></div>
                    <p>Connecting to bKash...</p>
                </div>
            `;
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            `;
            document.body.appendChild(loader);
        } else if (!show && loader) {
            loader.remove();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bkashPayment = new BkashPaymentHandler();
});
/**
 * Join/Login Modal Popup Functionality
 * Handles signup, login, and Google OAuth integration
 */

class AuthModal {
    constructor() {
        // API Base URL - your Render backend
        this.API_BASE_URL = "https://skillswap-lite-api.onrender.com/api";
        
        // Get DOM elements
        this.joinModal = document.getElementById('joinModal');
        this.loginModal = document.getElementById('loginModal');
        this.joinBtn = document.getElementById('joinBtn');
        this.closeModalBtn = document.getElementById('closeModal');
        this.closeLoginModalBtn = document.getElementById('closeLoginModal');
        this.showLogin = document.getElementById('showLogin');
        this.showSignup = document.getElementById('showSignup');
        this.userTypeSelect = document.getElementById('userType');
        this.providerFields = document.getElementById('providerFields');
        this.signupForm = document.getElementById('signupForm');
        this.loginForm = document.getElementById('loginForm');
        this.googleSignIn = document.getElementById('googleSignIn');
        this.googleSignInLogin = document.getElementById('googleSignInLogin');
        
        // Initialize only if elements exist
        if (this.joinBtn) {
            this.init();
        } else {
            console.error('Join button not found in DOM');
        }
    }
    
    init() {
        console.log('AuthModal initialized');
        
        // Open join modal
        if (this.joinBtn) {
            this.joinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Join button clicked');
                this.openModal(this.joinModal);
            });
        }
        
        // Close join modal button
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Close join modal button clicked');
                this.closeModal(this.joinModal);
            });
        }
        
        // Close login modal button
        if (this.closeLoginModalBtn) {
            this.closeLoginModalBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Close login modal button clicked');
                this.closeModal(this.loginModal);
            });
        }
        
        // Switch between signup and login
        if (this.showLogin) {
            this.showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Switch to login clicked');
                this.switchToLogin();
            });
        }
        
        if (this.showSignup) {
            this.showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Switch to signup clicked');
                this.switchToSignup();
            });
        }
        
        // Show/hide provider fields based on user type
        if (this.userTypeSelect) {
            this.userTypeSelect.addEventListener('change', () => {
                this.toggleProviderFields();
            });
            this.toggleProviderFields();
        }
        
        // Handle form submissions
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Handle Google sign in
        if (this.googleSignIn) {
            this.googleSignIn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleGoogleSignIn();
            });
        }
        
        if (this.googleSignInLogin) {
            this.googleSignInLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleGoogleSignIn();
            });
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.joinModal) {
                this.closeModal(this.joinModal);
            }
            if (e.target === this.loginModal) {
                this.closeModal(this.loginModal);
            }
        });

        // Check if user is already logged in
        this.checkLoggedInUser();
    }
    
    openModal(modal) {
        if (modal) {
            console.log('Opening modal:', modal.id);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modal) {
        if (modal) {
            console.log('Closing modal:', modal.id);
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    switchToLogin() {
        console.log('Switching to login modal');
        this.closeModal(this.joinModal);
        this.openModal(this.loginModal);
    }
    
    switchToSignup() {
        console.log('Switching to signup modal');
        this.closeModal(this.loginModal);
        this.openModal(this.joinModal);
    }
    
    toggleProviderFields() {
        if (this.userTypeSelect && this.providerFields) {
            if (this.userTypeSelect.value === 'provider') {
                this.providerFields.classList.remove('hidden');
                const skills = document.getElementById('skills');
                const description = document.getElementById('description');
                if (skills) skills.required = true;
                if (description) description.required = true;
            } else {
                this.providerFields.classList.add('hidden');
                const skills = document.getElementById('skills');
                const description = document.getElementById('description');
                if (skills) skills.required = false;
                if (description) description.required = false;
            }
        }
    }
    
    async handleSignup(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            userType: document.getElementById('userType').value
        };
        
        if (formData.userType === 'provider') {
            const skillsInput = document.getElementById('skills').value;
            formData.skills = skillsInput.split(',').map(skill => skill.trim());
            formData.description = document.getElementById('description').value;
        }
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.showNotification('Successfully signed up!', 'success');
                this.closeModal(this.joinModal);
                this.updateUIForLoggedInUser(data.user);
            } else {
                this.showNotification(data.message || 'Signup failed', 'error');
            }
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification('An error occurred during signup', 'error');
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                this.showNotification('Successfully logged in!', 'success');
                this.closeModal(this.loginModal);
                this.updateUIForLoggedInUser(data.user);
            } else {
                this.showNotification(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('An error occurred during login', 'error');
        }
    }
    
    handleGoogleSignIn() {
        console.log('Google sign in clicked');
        window.location.href = `${this.API_BASE_URL}/auth/google`;
    }
    
    updateUIForLoggedInUser(user) {
        if (this.joinBtn) {
            this.joinBtn.textContent = user.name.split(' ')[0];
            this.joinBtn.classList.add('logged-in');
            
            // Remove old listeners
            const newJoinBtn = this.joinBtn.cloneNode(true);
            this.joinBtn.parentNode.replaceChild(newJoinBtn, this.joinBtn);
            this.joinBtn = newJoinBtn;
            
            this.joinBtn.addEventListener('click', () => {
                if (confirm('Do you want to logout?')) {
                    this.logout();
                }
            });
        }
    }
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        if (this.joinBtn) {
            this.joinBtn.textContent = 'Join';
            this.joinBtn.classList.remove('logged-in');
            
            // Remove old listeners
            const newJoinBtn = this.joinBtn.cloneNode(true);
            this.joinBtn.parentNode.replaceChild(newJoinBtn, this.joinBtn);
            this.joinBtn = newJoinBtn;
            
            this.joinBtn.addEventListener('click', () => this.openModal(this.joinModal));
        }
        
        this.showNotification('Logged out successfully', 'success');
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    checkLoggedInUser() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            try {
                this.updateUIForLoggedInUser(JSON.parse(user));
            } catch (e) {
                console.error('Error parsing user data', e);
            }
        }
    }
}

// Initialize auth modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AuthModal');
    window.authModal = new AuthModal();
});
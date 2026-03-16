/**
 * Join/Login Modal Popup Functionality
 * Handles signup, login, and Google OAuth integration
 */

class AuthModal {
    constructor() {
        // API Base URL - MAKE SURE THIS IS CORRECT
        this.API_BASE_URL = "https://skillswap-lite-1.onrender.com/api";
        
        // Get DOM elements
        this.joinModal = document.getElementById('joinModal');
        this.loginModal = document.getElementById('loginModal');
        this.joinBtn = document.getElementById('joinBtn');
        this.closeModal = document.getElementById('closeModal');
        this.closeLoginModal = document.getElementById('closeLoginModal');
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
        console.log('AuthModal initialized'); // Debug log
        
        // Open join modal
        if (this.joinBtn) {
            this.joinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Join button clicked'); // Debug log
                this.openModal(this.joinModal);
            });
        }
        
        // Close modals
        if (this.closeModal) {
            this.closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(this.joinModal);
            });
        }
        
        if (this.closeLoginModal) {
            this.closeLoginModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(this.loginModal);
            });
        }
        
        // Switch between signup and login
        if (this.showLogin) {
            this.showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToLogin();
            });
        }
        
        if (this.showSignup) {
            this.showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToSignup();
            });
        }
        
        // Show/hide provider fields based on user type
        if (this.userTypeSelect) {
            this.userTypeSelect.addEventListener('change', () => {
                this.toggleProviderFields();
            });
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
            console.log('Opening modal'); // Debug log
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
    
    closeModal(modal) {
        if (modal) {
            console.log('Closing modal'); // Debug log
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    switchToLogin() {
        this.closeModal(this.joinModal);
        this.openModal(this.loginModal);
    }
    
    switchToSignup() {
        this.closeModal(this.loginModal);
        this.openModal(this.joinModal);
    }
    
    toggleProviderFields() {
        if (this.userTypeSelect && this.providerFields) {
            if (this.userTypeSelect.value === 'provider') {
                this.providerFields.classList.remove('hidden');
                // Make provider fields required
                const skills = document.getElementById('skills');
                const description = document.getElementById('description');
                if (skills) skills.required = true;
                if (description) description.required = true;
            } else {
                this.providerFields.classList.add('hidden');
                // Make provider fields not required
                const skills = document.getElementById('skills');
                const description = document.getElementById('description');
                if (skills) skills.required = false;
                if (description) description.required = false;
            }
        }
    }
    
    async handleSignup(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            userType: document.getElementById('userType').value
        };
        
        // Add provider-specific fields if needed
        if (formData.userType === 'provider') {
            const skillsInput = document.getElementById('skills').value;
            formData.skills = skillsInput.split(',').map(skill => skill.trim());
            formData.description = document.getElementById('description').value;
        }
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Show success message
                this.showNotification('Successfully signed up!', 'success');
                
                // Close modal
                this.closeModal(this.joinModal);
                
                // Update UI for logged in user
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Show success message
                this.showNotification('Successfully logged in!', 'success');
                
                // Close modal
                this.closeModal(this.loginModal);
                
                // Update UI for logged in user
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
        console.log('Google sign in clicked'); // Debug log
        // Redirect to Google OAuth
        window.location.href = `${this.API_BASE_URL}/auth/google`;
    }
    
    updateUIForLoggedInUser(user) {
        // Change join button to user menu
        if (this.joinBtn) {
            this.joinBtn.textContent = user.name.split(' ')[0];
            this.joinBtn.classList.add('logged-in');
            
            // Replace click handler for logout
            this.joinBtn.removeEventListener('click', this.joinBtn.clickHandler);
            this.joinBtn.clickHandler = () => {
                if (confirm('Do you want to logout?')) {
                    this.logout();
                }
            };
            this.joinBtn.addEventListener('click', this.joinBtn.clickHandler);
        }
    }
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Reset join button
        if (this.joinBtn) {
            this.joinBtn.textContent = 'Join';
            this.joinBtn.classList.remove('logged-in');
            
            // Restore original click handler
            this.joinBtn.removeEventListener('click', this.joinBtn.clickHandler);
            this.joinBtn.addEventListener('click', () => this.openModal(this.joinModal));
        }
        
        this.showNotification('Logged out successfully', 'success');
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
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
    console.log('DOM loaded, initializing AuthModal'); // Debug log
    window.authModal = new AuthModal(); // Make it global for debugging
});
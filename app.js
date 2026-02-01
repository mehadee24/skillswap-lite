// Initialize data storage with sample data
function initializeStorage() {
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }
    
    if (!localStorage.getItem("services")) {
        localStorage.setItem("services", JSON.stringify([
            {
                id: 1,
                owner: "designer@example.com",
                ownerName: "John Designer",
                title: "UI/UX Design Consultation",
                category: "Design",
                desc: "Professional UI/UX design consultation for your web or mobile application.",
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                owner: "developer@example.com",
                ownerName: "Sarah Developer",
                title: "Frontend Development",
                category: "Development",
                desc: "React.js and Vue.js development for your next project.",
                createdAt: new Date().toISOString()
            }
        ]));
    }
    
    if (!localStorage.getItem("requests")) {
        localStorage.setItem("requests", JSON.stringify([]));
    }
    
    if (!localStorage.getItem("categories")) {
        localStorage.setItem("categories", JSON.stringify([
            { id: 1, name: "Design", icon: "fas fa-paint-brush", color: "#8b5cf6" },
            { id: 2, name: "Development", icon: "fas fa-code", color: "#3b82f6" },
            { id: 3, name: "Marketing", icon: "fas fa-chart-line", color: "#10b981" },
            { id: 4, name: "Writing", icon: "fas fa-pen", color: "#f59e0b" },
            { id: 5, name: "Photography", icon: "fas fa-camera", color: "#ef4444" },
            { id: 6, name: "Consulting", icon: "fas fa-comments", color: "#6366f1" },
            { id: 7, name: "Tutoring", icon: "fas fa-graduation-cap", color: "#ec4899" },
            { id: 8, name: "Business", icon: "fas fa-briefcase", color: "#14b8a6" }
        ]));
    }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    showSection('home');
    updateStats();
    loadCategories();
    checkAuthState();
    setupEventListeners();
});

// Global State
let currentUser = null;

// Helper Functions
function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getServices() {
    return JSON.parse(localStorage.getItem("services") || "[]");
}

function saveServices(s) {
    localStorage.setItem("services", JSON.stringify(s));
}

function getRequests() {
    return JSON.parse(localStorage.getItem("requests") || "[]");
}

function saveRequests(r) {
    localStorage.setItem("requests", JSON.stringify(r));
}

function getCategories() {
    return JSON.parse(localStorage.getItem("categories") || "[]");
}

function showLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    if (type === 'error') {
        toast.style.background = '#ef4444';
    } else if (type === 'warning') {
        toast.style.background = '#f59e0b';
    } else {
        toast.style.background = '#10b981';
    }
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// UI Functions
function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            if (navMenu.style.display === 'flex') {
                navMenu.style.display = 'none';
            } else {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'white';
                navMenu.style.padding = '1rem';
                navMenu.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
            }
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchServices');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchServices();
            }
        });
    }
}

function showSection(id) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => {
        if (s) s.classList.add('hidden');
    });
    document.querySelectorAll('.nav-link').forEach(l => {
        if (l) l.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(id);
    if (section) {
        section.classList.remove('hidden');
        
        // Update active nav link
        const navLink = document.querySelector(`[onclick="showSection('${id}')"]`);
        if (navLink) navLink.classList.add('active');
        
        // Special handling for dashboard
        if (id === 'dashboard' && currentUser) {
            loadDashboard();
        }
        
        // Load services for services section
        if (id === 'services') {
            renderAllServices();
        }
        
        // Load categories for categories section
        if (id === 'categories') {
            loadCategories();
        }
    }
    
    // Close mobile menu
    const navMenu = document.querySelector('.nav-menu');
    if (window.innerWidth <= 768 && navMenu && navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const parent = input.parentElement;
    if (!parent) return;
    
    const toggle = parent.querySelector('.password-toggle i');
    if (!toggle) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

function selectRole(role) {
    const roleInput = document.getElementById('regRole');
    if (roleInput) {
        roleInput.value = role;
    }
    
    // Update UI
    document.querySelectorAll('.role-option').forEach(opt => {
        if (opt) opt.classList.remove('selected');
    });
    
    const clientOption = document.getElementById('clientOption');
    const providerOption = document.getElementById('providerOption');
    
    if (role === 'client' && clientOption) {
        clientOption.classList.add('selected');
    } else if (role === 'provider' && providerOption) {
        providerOption.classList.add('selected');
    }
}

function updateStats() {
    const services = getServices();
    const users = getUsers();
    const requests = getRequests();
    const completed = requests.filter(r => r.status === 'accepted').length;
    
    // Animate counters
    animateCounter('servicesCount', services.length);
    animateCounter('usersCount', users.length);
    animateCounter('exchangesCount', completed);
}

function animateCounter(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = finalValue / 50;
    const duration = 1000;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= finalValue) {
            clearInterval(timer);
            element.textContent = finalValue;
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / 50);
}

// User Authentication
function register() {
    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const passwordInput = document.getElementById('regPassword');
    const roleInput = document.getElementById('regRole');
    
    if (!nameInput || !emailInput || !passwordInput || !roleInput) {
        showToast('Form elements not found', 'error');
        return;
    }
    
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const role = roleInput.value;
    
    // Validation
    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    let users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showToast('User with this email already exists', 'error');
        return;
    }
    
    let user = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        role: role,
        createdAt: new Date().toISOString()
    };
    
    users.push(user);
    saveUsers(users);
    
    showToast('Account created successfully!', 'success');
    
    // Auto login
    currentUser = user;
    updateAuthUI();
    showSection('dashboard');
}

function login() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) {
        showToast('Login form elements not found', 'error');
        return;
    }
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    let users = getUsers();
    let user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showToast('Invalid email or password', 'error');
        return;
    }
    
    currentUser = user;
    updateAuthUI();
    showSection('dashboard');
    showToast(`Welcome back, ${user.name}!`);
}

function logout() {
    currentUser = null;
    updateAuthUI();
    showSection('home');
    showToast('Logged out successfully');
}

function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateAuthUI();
        } catch (e) {
            console.error('Error parsing saved user:', e);
            localStorage.removeItem('currentUser');
        }
    }
}

function updateAuthUI() {
    const userProfile = document.getElementById('userProfile');
    const navAuth = document.querySelector('.nav-auth');
    
    if (!userProfile || !navAuth) return;
    
    if (currentUser) {
        // Save user to localStorage for persistence
        try {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } catch (e) {
            console.error('Error saving user:', e);
        }
        
        // Update UI
        userProfile.classList.remove('hidden');
        navAuth.classList.add('hidden');
        
        const userNameElement = document.getElementById('userName');
        const userRoleElement = document.getElementById('userRole');
        
        if (userNameElement) userNameElement.textContent = currentUser.name;
        if (userRoleElement) userRoleElement.textContent = currentUser.role;
        
        // Update welcome message
        const welcomeElement = document.getElementById('welcome');
        if (welcomeElement) {
            welcomeElement.innerHTML = `
                Welcome back, <span class="highlight">${currentUser.name}</span>!
            `;
        }
    } else {
        localStorage.removeItem('currentUser');
        userProfile.classList.add('hidden');
        navAuth.classList.remove('hidden');
    }
}

// Categories
function loadCategories() {
    const categories = getCategories();
    const container = document.getElementById('categoriesList');
    const categorySelect = document.getElementById('serviceCategory');
    
    if (container) {
        container.innerHTML = categories.map(cat => `
            <div class="category-card animate-fade-in" onclick="filterByCategory('${cat.name}')">
                <div class="category-icon" style="background: ${cat.color}">
                    <i class="${cat.icon}"></i>
                </div>
                <h3>${cat.name}</h3>
                <p>Browse ${cat.name.toLowerCase()} services</p>
            </div>
        `).join('');
    }
    
    if (categorySelect) {
        categorySelect.innerHTML = `
            <option value="">Select Category</option>
            ${categories.map(cat => `
                <option value="${cat.name}">${cat.name}</option>
            `).join('')}
        `;
    }
}

function filterByCategory(category) {
    const filterInput = document.getElementById('filterCategory');
    if (filterInput) {
        filterInput.value = category;
    }
    showSection('dashboard');
    setTimeout(() => {
        renderServices();
        showToast(`Filtered by ${category}`);
    }, 100);
}

// Dashboard
function loadDashboard() {
    if (!currentUser) {
        showSection('login');
        return;
    }
    
    // Update user stats
    const services = getServices();
    const requests = getRequests();
    
    const myServices = services.filter(s => s.owner === currentUser.email);
    const myRequests = requests.filter(r => 
        r.client === currentUser.email || r.provider === currentUser.email
    );
    const completed = requests.filter(r => 
        (r.client === currentUser.email || r.provider === currentUser.email) && 
        r.status === 'accepted'
    ).length;
    
    const myServicesElement = document.getElementById('myServicesCount');
    const myRequestsElement = document.getElementById('myRequestsCount');
    const completedElement = document.getElementById('completedExchanges');
    
    if (myServicesElement) myServicesElement.textContent = myServices.length;
    if (myRequestsElement) myRequestsElement.textContent = myRequests.length;
    if (completedElement) completedElement.textContent = completed;
    
    // Show/hide provider panel
    const providerPanel = document.getElementById('providerPanel');
    if (providerPanel) {
        if (currentUser.role === 'provider') {
            providerPanel.classList.remove('hidden');
        } else {
            providerPanel.classList.add('hidden');
        }
    }
    
    renderServices();
    renderRequests();
}

// Services
function createService() {
    if (!currentUser) {
        showToast('Please login first', 'error');
        return;
    }
    
    if (currentUser.role !== 'provider') {
        showToast('Only providers can create services', 'error');
        return;
    }
    
    const titleInput = document.getElementById('serviceTitle');
    const categorySelect = document.getElementById('serviceCategory');
    const descTextarea = document.getElementById('serviceDesc');
    
    if (!titleInput || !categorySelect || !descTextarea) {
        showToast('Service form elements not found', 'error');
        return;
    }
    
    const title = titleInput.value;
    const category = categorySelect.value;
    const desc = descTextarea.value;
    
    if (!title || !category || !desc) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    let services = getServices();
    
    services.push({
        id: Date.now(),
        owner: currentUser.email,
        ownerName: currentUser.name,
        title: title,
        category: category,
        desc: desc,
        createdAt: new Date().toISOString()
    });
    
    saveServices(services);
    
    // Clear form
    titleInput.value = '';
    categorySelect.value = '';
    descTextarea.value = '';
    
    showToast('Service created successfully!');
    renderServices();
    updateStats();
}

function renderServices() {
    const container = document.getElementById('servicesList');
    const allContainer = document.getElementById('allServicesList');
    
    if (!container && !allContainer) return;
    
    let services = getServices();
    const filterInput = document.getElementById('filterCategory');
    const sortSelect = document.getElementById('sortServices');
    
    const filter = filterInput ? filterInput.value.toLowerCase() : '';
    const sort = sortSelect ? sortSelect.value : 'newest';
    
    // Apply filter
    if (filter) {
        services = services.filter(s => 
            (s.category && s.category.toLowerCase().includes(filter)) ||
            (s.title && s.title.toLowerCase().includes(filter)) ||
            (s.desc && s.desc.toLowerCase().includes(filter))
        );
    }
    
    // Apply sorting
    services.sort((a, b) => {
        if (sort === 'newest') {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        }
        if (sort === 'oldest') {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateA - dateB;
        }
        if (sort === 'category') {
            const catA = a.category || '';
            const catB = b.category || '';
            return catA.localeCompare(catB);
        }
        return 0;
    });
    
    const serviceHTML = services.map(service => {
        const isOwner = currentUser && service.owner === currentUser.email;
        
        return `
            <div class="service-item animate-fade-in">
                <div class="service-header">
                    <h4>${service.title || 'Untitled Service'}</h4>
                    ${service.category ? `<span class="service-category">${service.category}</span>` : ''}
                </div>
                <p class="service-desc">${service.desc || 'No description provided'}</p>
                <div class="service-footer">
                    <small class="service-meta">
                        <i class="fas fa-user"></i> ${service.ownerName || 'Unknown'}
                        ${service.createdAt ? `<i class="fas fa-clock"></i> ${formatDate(service.createdAt)}` : ''}
                    </small>
                    <div class="service-actions">
                        ${isOwner ? `
                            <button class="btn btn-outline btn-sm" onclick="deleteService(${service.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        ` : currentUser && currentUser.role === 'client' ? `
                            <button class="btn btn-primary btn-sm" onclick="sendRequest(${service.id})">
                                <i class="fas fa-handshake"></i> Request
                            </button>
                        ` : !currentUser ? `
                            <button class="btn btn-outline btn-sm" onclick="showSection('login')">
                                <i class="fas fa-sign-in-alt"></i> Login to Request
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    const noServicesHTML = '<p class="no-services">No services found. Be the first to create one!</p>';
    
    if (container) container.innerHTML = serviceHTML || noServicesHTML;
    if (allContainer) allContainer.innerHTML = serviceHTML || '<p class="no-services">No services available yet.</p>';
}

function renderAllServices() {
    renderServices();
}

function searchServices() {
    const searchInput = document.getElementById('searchServices');
    const filterInput = document.getElementById('filterCategory');
    
    if (searchInput && filterInput) {
        const query = searchInput.value;
        filterInput.value = query;
        renderServices();
    }
}

function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    let services = getServices().filter(s => s.id !== id);
    saveServices(services);
    
    showToast('Service deleted successfully');
    renderServices();
    updateStats();
}

// Requests
function sendRequest(serviceId) {
    if (!currentUser || currentUser.role !== 'client') {
        showToast('Only clients can request services', 'error');
        return;
    }
    
    const service = getServices().find(s => s.id === serviceId);
    if (!service) {
        showToast('Service not found', 'error');
        return;
    }
    
    let requests = getRequests();
    
    requests.push({
        id: Date.now(),
        serviceId: serviceId,
        serviceTitle: service.title,
        provider: service.owner,
        providerName: service.ownerName,
        client: currentUser.email,
        clientName: currentUser.name,
        status: "pending",
        createdAt: new Date().toISOString()
    });
    
    saveRequests(requests);
    showToast('Service request sent!');
    renderRequests();
}

function showRequests(type) {
    // Update active tab
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    const clickedButton = event.target;
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    renderRequests(type);
}

function renderRequests(type = 'incoming') {
    const container = document.getElementById('requestsList');
    if (!container || !currentUser) {
        return;
    }
    
    let requests = getRequests();
    
    if (type === 'incoming') {
        requests = requests.filter(r => r.provider === currentUser.email);
    } else {
        requests = requests.filter(r => r.client === currentUser.email);
    }
    
    container.innerHTML = requests.map(req => {
        const isIncoming = req.provider === currentUser.email;
        
        return `
            <div class="request-item animate-fade-in">
                <div class="request-info">
                    <h4>${req.serviceTitle || 'Unknown Service'}</h4>
                    <p>
                        ${isIncoming ? 
                            `<i class="fas fa-user"></i> From: ${req.clientName || 'Unknown'}` : 
                            `<i class="fas fa-user-tie"></i> To: ${req.providerName || 'Unknown'}`
                        }
                        <br>
                        <small><i class="fas fa-clock"></i> ${req.createdAt ? formatDate(req.createdAt) : 'Recently'}</small>
                    </p>
                </div>
                <div class="request-actions">
                    <span class="request-status status-${req.status}">
                        ${req.status || 'pending'}
                    </span>
                    ${isIncoming && req.status === 'pending' ? `
                        <div class="request-buttons">
                            <button class="btn btn-success btn-sm" onclick="updateRequest(${req.id}, 'accepted')">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="updateRequest(${req.id}, 'rejected')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('') || `<p class="no-requests">No ${type} requests found.</p>`;
}

function updateRequest(id, status) {
    let requests = getRequests();
    let request = requests.find(r => r.id === id);
    
    if (request) {
        request.status = status;
        request.updatedAt = new Date().toISOString();
        
        saveRequests(requests);
        showToast(`Request ${status} successfully`);
        renderRequests();
        updateStats();
    }
}

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatDate(dateString) {
    if (!dateString) return 'Recently';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    } catch (e) {
        return 'Recently';
    }
}
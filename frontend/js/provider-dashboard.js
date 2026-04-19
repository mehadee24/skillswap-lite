/**
 * Provider Dashboard - View and Edit Profile
 */

const API_BASE_URL = "https://skillswap-lite-api.onrender.com/api";
let currentProvider = null;
let currentSkills = [];

// Check if user is logged in and is a provider
async function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.userType !== 'provider') {
        // Not logged in or not a provider, redirect to home
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Load provider profile
async function loadProviderProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.profile) {
            currentProvider = data.profile;
            currentSkills = data.profile.skills || [];
            renderProfile(data.profile);
            renderSkills(currentSkills);
            loadProjects();
            loadReviews();
        } else {
            console.error('Failed to load profile');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Render profile in dashboard
function renderProfile(profile) {
    // Sidebar
    document.getElementById('dashboardAvatar').textContent = profile.name.charAt(0);
    document.getElementById('dashboardName').textContent = profile.name;
    document.getElementById('dashboardRating').innerHTML = `<i class="fas fa-star"></i> ${profile.rating || 0}`;
    document.getElementById('dashboardProjects').textContent = profile.projectsCompleted || 0;
    
    // Form fields
    document.getElementById('profileName').value = profile.name || '';
    document.getElementById('profileEmail').value = profile.email || '';
    document.getElementById('profileTitle').value = profile.currentlyWorkingOn || '';
    document.getElementById('profileDescription').value = profile.description || '';
    document.getElementById('profileCurrentWork').value = profile.currentlyWorkingOn || '';
}

// Render skills for editing
function renderSkills(skills) {
    const container = document.getElementById('skillsList');
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p class="loading-text">No skills added yet. Add your first skill above!</p>';
        return;
    }
    
    container.innerHTML = skills.map((skill, index) => `
        <div class="skill-tag-edit">
            ${skill}
            <button onclick="removeSkill(${index})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

// Add new skill
function addSkill() {
    const input = document.getElementById('newSkill');
    const skill = input.value.trim();
    
    if (skill && !currentSkills.includes(skill)) {
        currentSkills.push(skill);
        renderSkills(currentSkills);
        input.value = '';
    }
}

// Remove skill
function removeSkill(index) {
    currentSkills.splice(index, 1);
    renderSkills(currentSkills);
}

// Save skills to database
async function saveSkills() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    try {
        const response = await fetch(`${API_BASE_URL}/providers/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ skills: currentSkills })
        });
        
        const data = await response.json();
        if (data.success) {
            showNotification('Skills updated successfully!', 'success');
            loadProviderProfile();
        } else {
            showNotification('Failed to update skills', 'error');
        }
    } catch (error) {
        console.error('Error saving skills:', error);
        showNotification('Error saving skills', 'error');
    }
}

// Save profile form
document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            
            const updatedProfile = {
                name: document.getElementById('profileName').value,
                email: document.getElementById('profileEmail').value,
                currentlyWorkingOn: document.getElementById('profileTitle').value,
                description: document.getElementById('profileDescription').value
            };
            
            try {
                const response = await fetch(`${API_BASE_URL}/providers/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedProfile)
                });
                
                const data = await response.json();
                if (data.success) {
                    showNotification('Profile updated successfully!', 'success');
                    loadProviderProfile();
                } else {
                    showNotification('Failed to update profile', 'error');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                showNotification('Error updating profile', 'error');
            }
        });
    }
});

// Load projects
async function loadProjects() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        const container = document.getElementById('projectsList');
        if (data.success && data.projects && data.projects.length > 0) {
            container.innerHTML = data.projects.map(project => `
                <div class="project-card">
                    <div class="project-title">${project.projectTitle}</div>
                    <div class="project-description">${project.projectDescription}</div>
                    <div class="project-price">💰 $${project.pricePaid}</div>
                    <span class="project-status status-${project.status.replace('-', '')}">${project.status}</span>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="loading-text">No projects yet.</p>';
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load reviews
async function loadReviews() {
    const container = document.getElementById('reviewsList');
    if (currentProvider && currentProvider.reviews && currentProvider.reviews.length > 0) {
        container.innerHTML = currentProvider.reviews.map(review => `
            <div class="review-card">
                <div class="review-rating">
                    ${renderStars(review.rating)}
                </div>
                <p class="review-comment">${review.comment || 'No comment provided.'}</p>
                <small>${new Date(review.date).toLocaleDateString()}</small>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="loading-text">No reviews yet.</p>';
    }
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

function showNotification(message, type) {
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

function showSection(section) {
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}Section`).classList.add('active');
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAuth();
    if (isAuthenticated) {
        await loadProviderProfile();
    }
});
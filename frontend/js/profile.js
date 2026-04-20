/**
 * Provider Profile Page
 * Displays detailed information about a service provider
 */

const API_BASE_URL = "https://skillswap-lite-api.onrender.com/api";

// Get provider ID from URL
const urlParams = new URLSearchParams(window.location.search);
const providerId = urlParams.get('id');

async function loadProfile() {
    if (!providerId) {
        showError('No provider ID specified');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/providers/${providerId}`);
        const data = await response.json();

        if (data.success && data.provider) {
            renderProfile(data.provider);
        } else {
            showError('Provider not found');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Failed to load profile');
    }
}

function renderProfile(provider) {
    const container = document.getElementById('profileContent');
    
    container.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar-large">${provider.avatar || provider.name.charAt(0)}</div>
            <div class="profile-info">
                <h1>${provider.name}</h1>
                <div class="profile-rating">
                    ${renderStars(provider.rating)}
                    <span>${provider.rating || 'New'} (${provider.totalReviews || 0} reviews)</span>
                </div>
                <div class="profile-stats">
                    <div class="stat">
                        <i class="fas fa-briefcase"></i>
                        <span>${provider.projectsCompleted || 0} projects completed</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="profile-section">
            <h2><i class="fas fa-user"></i> About Me</h2>
            <p>${provider.description || 'No description provided.'}</p>
        </div>

        <div class="profile-section">
            <h2><i class="fas fa-code"></i> Skills & Expertise</h2>
            <div class="skills-list">
                ${provider.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
            </div>
        </div>

        <div class="profile-section">
            <h2><i class="fas fa-chart-line"></i> Current Work</h2>
            <p>${provider.currentlyWorkingOn || 'Available for new projects'}</p>
        </div>

        <div class="profile-section">
            <h2><i class="fas fa-star"></i> Reviews</h2>
            <div id="reviewsSection">
                ${renderReviews(provider.reviews)}
            </div>
        </div>

        <div class="profile-actions">
            <button class="contact-btn" onclick="contactProvider('${provider.email}')">
                <i class="fas fa-envelope"></i> Contact Provider
            </button>
            <button class="hire-btn" onclick="window.open('https://merchantdemo.sandbox.bka.sh/frontend/checkout')">
                <i class="fas fa-handshake"></i> Hire Now
            </button>
        </div>
    `;
}

function renderStars(rating) {
    if (!rating) return '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>'.repeat(5);
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star"></i>';
    
    return stars;
}

function renderReviews(reviews) {
    if (!reviews || reviews.length === 0) {
        return '<p class="no-reviews">No reviews yet. Be the first to leave a review!</p>';
    }
    
    return reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <strong>${review.clientId?.name || 'Anonymous'}</strong>
                <div class="review-rating">${renderStars(review.rating)}</div>
            </div>
            <p class="review-comment">${review.comment || 'No comment provided.'}</p>
            <small class="review-date">${new Date(review.date).toLocaleDateString()}</small>
        </div>
    `).join('');
}

function showError(message) {
    const container = document.getElementById('profileContent');
    container.innerHTML = `
        <div class="error-container">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>${message}</h2>
            <a href="index.html" class="back-btn">Back to Home</a>
        </div>
    `;
}

function contactProvider(email) {
    window.location.href = `mailto:${email}`;
}

function hireProvider(providerId) {
    // Redirect to login or hire page
    if (localStorage.getItem('token')) {
        window.location.href = `hire.html?provider=${providerId}`;
    } else {
        alert('Please login to hire this provider');
        document.getElementById('joinBtn').click();
    }
}

// Add profile CSS
const style = document.createElement('style');
style.textContent = `
    .profile-container {
        max-width: 1000px;
        margin: 40px auto;
        padding: 0 20px;
    }
    .profile-header {
        display: flex;
        gap: 30px;
        margin-bottom: 40px;
        padding: 30px;
        background: var(--card-bg);
        border-radius: 16px;
        box-shadow: 0 2px 8px var(--shadow-color);
    }
    .profile-avatar-large {
        width: 120px;
        height: 120px;
        background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        color: white;
        font-weight: bold;
    }
    .profile-section {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 25px;
        box-shadow: 0 2px 8px var(--shadow-color);
    }
    .profile-section h2 {
        margin-bottom: 15px;
        color: var(--text-primary);
        font-size: 1.3rem;
    }
    .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .skill-badge {
        background: var(--bg-secondary);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.85rem;
        border: 1px solid var(--border-color);
    }
    .profile-actions {
        display: flex;
        gap: 20px;
        margin-top: 30px;
    }
    .contact-btn, .hire-btn {
        padding: 12px 30px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
    }
    .contact-btn {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }
    .hire-btn {
        background: var(--accent-color);
        color: white;
    }
    .contact-btn:hover, .hire-btn:hover {
        transform: translateY(-2px);
    }
    .review-card {
        background: var(--bg-secondary);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
    }
    .loading-spinner {
        text-align: center;
        padding: 60px;
    }
    .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid var(--border-color);
        border-top-color: var(--accent-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .error-container {
        text-align: center;
        padding: 60px;
    }
    .back-btn {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background: var(--accent-color);
        color: white;
        text-decoration: none;
        border-radius: 6px;
    }
    @media (max-width: 768px) {
        .profile-header {
            flex-direction: column;
            text-align: center;
        }
        .profile-actions {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(style);

// Load profile when page loads
document.addEventListener('DOMContentLoaded', loadProfile);
/**
 * Dark Mode Toggle Functionality
 * Handles theme switching between light and dark modes
 */

// Initialize dark mode based on user preference
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.setAttribute('data-theme', 'dark');
        updateDarkModeIcon(true);
    } else {
        document.body.setAttribute('data-theme', 'light');
        updateDarkModeIcon(false);
    }
    
    // Add event listener for toggle button
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

// Toggle between light and dark modes
function toggleDarkMode() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateDarkModeIcon(newTheme === 'dark');
}

// Update dark mode toggle icon
function updateDarkModeIcon(isDark) {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDarkMode);
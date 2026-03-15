/**
 * Main JavaScript file
 * Handles common functionality and initializations
 */

// Add notification styles to the page
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background-color: #28a745;
    }
    
    .notification.error {
        background-color: #dc3545;
    }
    
    .notification.info {
        background-color: #17a2b8;
    }
    
    .join-btn.logged-in {
        background-color: #28a745;
    }
    
    .join-btn.logged-in:hover {
        background-color: #218838;
    }
`;

document.head.appendChild(style);

// Language selector functionality
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    
    if (languageSelect) {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSelect.value = savedLanguage;
        
        // Handle language change
        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            localStorage.setItem('language', selectedLanguage);
            
            // Here you would typically load language files and update text
            console.log('Language changed to:', selectedLanguage);
            
            // Show notification
            const authModal = new AuthModal();
            authModal.showNotification(`Language changed to ${selectedLanguage}`, 'info');
        });
    }
});

// Lazy loading images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add active class to navigation links based on scroll position
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// Mobile menu toggle (if needed)
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('.nav-container');
    if (nav && window.innerWidth <= 768) {
        nav.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('show');
        });
    }
});

// Add mobile menu styles
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: block;
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--bg-secondary);
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 2px 4px var(--shadow-color);
        }
        
        .nav-links.show {
            display: flex;
        }
        
        .nav-links a {
            padding: 10px 0;
        }
    }
`;

document.head.appendChild(mobileStyles);
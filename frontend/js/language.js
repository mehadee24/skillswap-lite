/**
 * Language Handler for English, Bangla, and Spanish
 * Updates text content across all pages
 */

class LanguageHandler {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.init();
    }
    
    init() {
        // Load saved language
        this.setLanguage(this.currentLanguage);
        
        // Add event listener to language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }
    
    setLanguage(lang) {
        if (!translations[lang]) {
            console.error(`Language ${lang} not found`);
            return;
        }
        
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.placeholder) {
                        element.placeholder = translations[lang][key];
                    }
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Update placeholders for search input specifically
        const searchInput = document.getElementById('searchInput');
        if (searchInput && translations[lang].searchPlaceholder) {
            searchInput.placeholder = translations[lang].searchPlaceholder;
        }
        
        console.log(`Language changed to: ${lang}`);
    }
    
    translate(key) {
        return translations[this.currentLanguage][key] || key;
    }
}

// Initialize language handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageHandler = new LanguageHandler();
});
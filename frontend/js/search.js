/**
 * Search Functionality with Database Integration
 * Searches real service providers from MongoDB
 */

class SearchHandler {
    constructor() {
        // UPDATE THIS to your new Render URL
        this.API_BASE_URL = "https://skillswap-lite-api.onrender.com/api";
        
        this.searchInput = document.getElementById('searchInput');
        this.suggestionsContainer = document.getElementById('suggestions');
        this.keywordBtns = document.querySelectorAll('.keyword-btn');
        this.searchResultsContainer = document.createElement('div');
        this.searchResultsContainer.className = 'search-results-container';
        this.searchResultsContainer.style.display = 'none';
        
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.appendChild(this.searchResultsContainer);
        }
        
        this.selectedIndex = -1;
        this.suggestions = [];
        this.searchTimeout = null;
        
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
        this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.searchInput.addEventListener('blur', this.handleBlur.bind(this));
        
        this.keywordBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const keyword = btn.getAttribute('data-keyword');
                if (keyword) {
                    this.searchInput.value = keyword;
                    this.performSearch(keyword);
                }
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && 
                !this.suggestionsContainer.contains(e.target) &&
                !this.searchResultsContainer.contains(e.target)) {
                this.hideSuggestions();
                this.hideSearchResults();
            }
        });
    }
    
    async handleInput(e) {
        const query = e.target.value.trim();
        
        if (query.length < 1) {
            this.hideSuggestions();
            this.hideSearchResults();
            return;
        }
        
        clearTimeout(this.searchTimeout);
        
        await this.fetchSuggestions(query);
        
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                this.performSearch(query);
            }
        }, 500);
    }
    
    async fetchSuggestions(query) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success && data.suggestions && data.suggestions.length > 0) {
                this.suggestions = data.suggestions;
                this.showSuggestions(data.suggestions);
            } else {
                this.hideSuggestions();
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            this.hideSuggestions();
        }
    }
    
    showSuggestions(suggestions) {
        this.suggestionsContainer.innerHTML = '';
        this.selectedIndex = -1;
        
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = suggestion;
            item.setAttribute('data-index', index);
            
            item.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
            });
            
            item.addEventListener('mouseenter', () => {
                this.removeSelectedClass();
                item.classList.add('selected');
                this.selectedIndex = index;
            });
            
            this.suggestionsContainer.appendChild(item);
        });
        
        this.suggestionsContainer.classList.add('active');
    }
    
    hideSuggestions() {
        this.suggestionsContainer.classList.remove('active');
        this.suggestionsContainer.innerHTML = '';
        this.selectedIndex = -1;
    }
    
    handleKeyDown(e) {
        const suggestions = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        
        if (suggestions.length === 0) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = (this.selectedIndex + 1) % suggestions.length;
                this.updateSelectedSuggestion(suggestions);
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = this.selectedIndex <= 0 ? suggestions.length - 1 : this.selectedIndex - 1;
                this.updateSelectedSuggestion(suggestions);
                break;
                
            case 'Enter':
            case 'Tab':
                if (this.selectedIndex >= 0 && this.selectedIndex < suggestions.length) {
                    e.preventDefault();
                    const suggestion = suggestions[this.selectedIndex].textContent;
                    this.selectSuggestion(suggestion);
                }
                break;
                
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    
    updateSelectedSuggestion(suggestions) {
        this.removeSelectedClass();
        
        if (this.selectedIndex >= 0 && this.selectedIndex < suggestions.length) {
            suggestions[this.selectedIndex].classList.add('selected');
            suggestions[this.selectedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    removeSelectedClass() {
        this.suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.classList.remove('selected');
        });
    }
    
    selectSuggestion(suggestion) {
        this.searchInput.value = suggestion;
        this.hideSuggestions();
        this.performSearch(suggestion);
    }
    
    async performSearch(query) {
        console.log('Searching for:', query);
        this.showLoading(true);
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success && data.providers && data.providers.length > 0) {
                this.displaySearchResults(data.providers, query);
            } else {
                this.displayNoResults(query);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.displayNoResults(query);
        } finally {
            this.showLoading(false);
        }
    }
    
    displaySearchResults(providers, query) {
        this.searchResultsContainer.innerHTML = '';
        
        const resultsHTML = `
            <div class="search-results-header">
                <h3>Found ${providers.length} professional${providers.length > 1 ? 's' : ''} for "${query}"</h3>
            </div>
            <div class="search-results-grid">
                ${providers.map(pro => `
                    <div class="search-result-card">
                        <div class="result-avatar">${pro.avatar || pro.name.charAt(0)}</div>
                        <div class="result-info">
                            <h4>${pro.name}</h4>
                            <div class="result-rating">
                                <i class="fas fa-star"></i> ${pro.rating || 'New'} 
                                <span>(${pro.projectsCompleted || 0} projects)</span>
                            </div>
                            <div class="result-skills">
                                ${pro.skills.slice(0, 3).map(skill => `<span class="result-skill">${skill}</span>`).join('')}
                                ${pro.skills.length > 3 ? `<span class="result-skill">+${pro.skills.length - 3}</span>` : ''}
                            </div>
                            <p class="result-description">${pro.description ? pro.description.substring(0, 100) + '...' : ''}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.searchResultsContainer.innerHTML = resultsHTML;
        this.searchResultsContainer.style.display = 'block';
        this.searchResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    displayNoResults(query) {
        this.searchResultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No professionals found for "${query}"</h3>
                <p>Try different keywords like "Web Developer", "App Developer", or "Machine Learning"</p>
            </div>
        `;
        this.searchResultsContainer.style.display = 'block';
    }
    
    hideSearchResults() {
        this.searchResultsContainer.style.display = 'none';
    }
    
    showLoading(show) {
        let loader = document.getElementById('search-loader');
        
        if (show && !loader) {
            loader = document.createElement('div');
            loader.id = 'search-loader';
            loader.innerHTML = '<div class="loader-spinner"></div><p>Searching...</p>';
            loader.style.cssText = `
                text-align: center;
                padding: 40px;
                color: var(--text-secondary);
            `;
            this.searchResultsContainer.appendChild(loader);
            this.searchResultsContainer.style.display = 'block';
        } else if (!show && loader) {
            loader.remove();
        }
    }
    
    handleBlur(e) {
        setTimeout(() => {
            if (!this.suggestionsContainer.contains(document.activeElement) &&
                !this.searchResultsContainer.contains(document.activeElement)) {
                this.hideSuggestions();
            }
        }, 200);
    }
}

// Initialize search
document.addEventListener('DOMContentLoaded', () => {
    new SearchHandler();
});
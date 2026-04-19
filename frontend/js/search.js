/**
 * Professional Search Functionality with Real-time Results
 * Features: Live search, autocomplete, relevance scoring, debouncing
 */

class SearchHandler {
    constructor() {
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
        this.isLoading = false;
        this.currentQuery = '';
        
        this.init();
    }
    
    init() {
        if (!this.searchInput) {
            console.error('Search input not found!');
            return;
        }
        
        console.log('SearchHandler initialized');
        
        // Event listeners
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
        this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.searchInput.addEventListener('focus', this.handleFocus.bind(this));
        document.addEventListener('click', this.handleClickOutside.bind(this));
        
        // Keyword buttons
        this.keywordBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const keyword = btn.getAttribute('data-keyword');
                if (keyword) {
                    this.searchInput.value = keyword;
                    this.performSearch(keyword);
                    this.searchInput.focus();
                }
            });
        });
    }
    
    async handleInput(e) {
        const query = e.target.value.trim();
        this.currentQuery = query;
        
        clearTimeout(this.searchTimeout);
        
        if (query.length === 0) {
            this.hideSuggestions();
            this.hideSearchResults();
            return;
        }
        
        // Get suggestions for autocomplete
        await this.fetchSuggestions(query);
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 1) {
                this.performSearch(query);
            }
        }, 300);
    }
    
    async fetchSuggestions(query) {
        if (query.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success && data.suggestions && data.suggestions.length > 0) {
                this.showSuggestions(data.suggestions, query);
            } else {
                this.hideSuggestions();
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            this.hideSuggestions();
        }
    }
    
    showSuggestions(suggestions, currentQuery) {
        this.suggestionsContainer.innerHTML = '';
        this.selectedIndex = -1;
        
        // Add header
        const header = document.createElement('div');
        header.className = 'suggestions-header';
        header.innerHTML = '<i class="fas fa-lightbulb"></i> Suggestions';
        this.suggestionsContainer.appendChild(header);
        
        suggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            
            // Highlight matching part
            const matchIndex = suggestion.toLowerCase().indexOf(currentQuery.toLowerCase());
            if (matchIndex !== -1) {
                const before = suggestion.substring(0, matchIndex);
                const match = suggestion.substring(matchIndex, matchIndex + currentQuery.length);
                const after = suggestion.substring(matchIndex + currentQuery.length);
                item.innerHTML = `${before}<strong>${match}</strong>${after} <i class="fas fa-arrow-right"></i>`;
            } else {
                item.innerHTML = `${suggestion} <i class="fas fa-arrow-right"></i>`;
            }
            
            item.setAttribute('data-index', index);
            item.addEventListener('click', () => this.selectSuggestion(suggestion));
            item.addEventListener('mouseenter', () => this.setSelectedSuggestion(index));
            
            this.suggestionsContainer.appendChild(item);
        });
        
        this.suggestionsContainer.classList.add('active');
    }
    
    hideSuggestions() {
        this.suggestionsContainer.classList.remove('active');
        this.suggestionsContainer.innerHTML = '';
        this.selectedIndex = -1;
    }
    
    setSelectedSuggestion(index) {
        this.selectedIndex = index;
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        items.forEach((item, i) => {
            if (i === index + 1) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    async performSearch(query) {
        if (this.isLoading) return;
        this.isLoading = true;
        this.showLoading(true);
        
        console.log('Searching for:', query);
        
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
            this.isLoading = false;
            this.showLoading(false);
        }
    }
    
    displaySearchResults(providers, query) {
        this.searchResultsContainer.innerHTML = '';
        
        const resultsHTML = `
            <div class="search-results-header">
                <h3>
                    <i class="fas fa-search"></i> 
                    Found ${providers.length} result${providers.length > 1 ? 's' : ''} for "${this.escapeHtml(query)}"
                </h3>
                <p>Showing top matches based on skills, experience, and ratings</p>
            </div>
            <div class="search-results-grid">
                ${providers.map(pro => `
                    <div class="search-result-card" onclick="window.location.href='provider-profile.html?id=${pro.id}'">
                        <div class="result-avatar">${this.escapeHtml(pro.avatar || pro.name.charAt(0))}</div>
                        <div class="result-info">
                            <h3 class="result-name">${this.escapeHtml(pro.name)}</h3>
                            <div class="result-stats">
                                <span class="result-rating">
                                    <i class="fas fa-star"></i> ${pro.rating ? pro.rating.toFixed(1) : 'New'}
                                </span>
                                <span class="result-projects">
                                    <i class="fas fa-briefcase"></i> ${pro.projectsCompleted || 0} projects
                                </span>
                            </div>
                            <div class="result-skills">
                                ${pro.skills.slice(0, 4).map(skill => `<span class="result-skill">${this.escapeHtml(skill)}</span>`).join('')}
                                ${pro.skills.length > 4 ? `<span class="result-skill">+${pro.skills.length - 4}</span>` : ''}
                            </div>
                            <p class="result-description">${this.escapeHtml(pro.description ? pro.description.substring(0, 120) + '...' : 'No description provided')}</p>
                            <button class="view-profile-btn" onclick="event.stopPropagation(); window.location.href='provider-profile.html?id=${pro.id}'">
                                View Full Profile <i class="fas fa-arrow-right"></i>
                            </button>
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
                <h3>No professionals found for "${this.escapeHtml(query)}"</h3>
                <p>Try these suggestions:</p>
                <div class="suggestion-buttons">
                    <button class="suggestion-chip" data-suggestion="Web Developer">Web Developer</button>
                    <button class="suggestion-chip" data-suggestion="App Developer">App Developer</button>
                    <button class="suggestion-chip" data-suggestion="AI Expert">AI Expert</button>
                    <button class="suggestion-chip" data-suggestion="Cyber Security">Cyber Security</button>
                    <button class="suggestion-chip" data-suggestion="Cloud Architect">Cloud Architect</button>
                    <button class="suggestion-chip" data-suggestion="Game Developer">Game Developer</button>
                </div>
            </div>
        `;
        
        // Add event listeners to suggestion chips
        document.querySelectorAll('.suggestion-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                this.searchInput.value = btn.dataset.suggestion;
                this.performSearch(btn.dataset.suggestion);
            });
        });
        
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
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <p>Searching for professionals...</p>
            `;
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
    
    handleKeyDown(e) {
        const items = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        const visibleCount = items.length;
        
        if (visibleCount === 0) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, visibleCount - 1);
                this.updateSelectedSuggestion(items);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelectedSuggestion(items);
                break;
            case 'Enter':
                if (this.selectedIndex >= 0 && this.selectedIndex < visibleCount) {
                    e.preventDefault();
                    const suggestion = items[this.selectedIndex].textContent.replace('→', '').trim();
                    this.selectSuggestion(suggestion);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    
    updateSelectedSuggestion(items) {
        items.forEach((item, i) => {
            if (i === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    selectSuggestion(suggestion) {
        this.searchInput.value = suggestion;
        this.hideSuggestions();
        this.performSearch(suggestion);
    }
    
    handleFocus() {
        if (this.currentQuery && this.currentQuery.length > 0) {
            this.fetchSuggestions(this.currentQuery);
        }
    }
    
    handleClickOutside(e) {
        if (!this.searchInput.contains(e.target) && 
            !this.suggestionsContainer.contains(e.target) &&
            !this.searchResultsContainer.contains(e.target)) {
            this.hideSuggestions();
        }
    }
    
    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing search...');
    window.searchHandler = new SearchHandler();
});
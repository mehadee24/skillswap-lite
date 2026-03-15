/**
 * Search Functionality with Autocomplete
 * Handles search input, suggestions from backend, and keyword clicks
 */

class SearchHandler {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.suggestionsContainer = document.getElementById('suggestions');
        this.keywordBtns = document.querySelectorAll('.keyword-btn');
        this.selectedIndex = -1;
        this.suggestions = [];
        
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        // Add event listeners
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
        this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.searchInput.addEventListener('blur', this.handleBlur.bind(this));
        
        // Add click listeners to keyword buttons
        this.keywordBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const keyword = btn.getAttribute('data-keyword');
                if (keyword) {
                    this.searchInput.value = keyword;
                    this.performSearch(keyword);
                }
            });
        });
        
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    async handleInput(e) {
        const query = e.target.value.trim();
        
        if (query.length < 1) {
            this.hideSuggestions();
            return;
        }
        
        // Fetch suggestions from backend
        await this.fetchSuggestions(query);
    }
    
    async fetchSuggestions(query) {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success && data.suggestions.length > 0) {
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
            
            // Scroll into view if needed
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
    
    performSearch(query) {
        console.log('Performing search for:', query);
        // You can implement actual search functionality here
        // For example, redirect to search results page
        // window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
    
    handleBlur(e) {
        // Delay hiding to allow click on suggestions
        setTimeout(() => {
            if (!this.suggestionsContainer.contains(document.activeElement)) {
                this.hideSuggestions();
            }
        }, 200);
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchHandler();
});
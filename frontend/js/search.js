/**
 * Search Functionality with Autocomplete and Results
 * Handles search input, suggestions from backend, and displays results
 */

class SearchHandler {
    constructor() {
        // API Base URL - your Render backend
        this.API_BASE_URL = "https://skillswap-lite-1.onrender.com/api";
        
        this.searchInput = document.getElementById('searchInput');
        this.suggestionsContainer = document.getElementById('suggestions');
        this.keywordBtns = document.querySelectorAll('.keyword-btn');
        this.searchResultsContainer = document.createElement('div');
        this.searchResultsContainer.className = 'search-results-container';
        this.searchResultsContainer.style.display = 'none';
        
        // Insert results container after search
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.appendChild(this.searchResultsContainer);
        }
        
        this.selectedIndex = -1;
        this.suggestions = [];
        
        // Mock data for IT professionals
        this.itProfessionals = [
            {
                name: "Mehadee",
                skills: ["Backend Development", "Machine Learning", "AI", "React", "Node.js"],
                rating: 4.9,
                projects: 45,
                avatar: "M",
                title: "Full Stack Developer & AI Specialist"
            },
            {
                name: "Rakib",
                skills: ["Game Development", "Unreal Engine", "3D Modeling", "C++", "Physics"],
                rating: 4.8,
                projects: 32,
                avatar: "R",
                title: "Game Developer & Graphics Engineer"
            },
            {
                name: "Alamin",
                skills: ["UI/UX Design", "Frontend", "Mobile Apps", "React Native", "Figma"],
                rating: 5.0,
                projects: 51,
                avatar: "A",
                title: "UI/UX Designer & Frontend Developer"
            },
            {
                name: "Sarah Khan",
                skills: ["Cyber Security", "Ethical Hacking", "Network Security", "Penetration Testing"],
                rating: 4.7,
                projects: 28,
                avatar: "S",
                title: "Cyber Security Expert"
            },
            {
                name: "Tanvir Ahmed",
                skills: ["Cloud Computing", "AWS", "DevOps", "Docker", "Kubernetes"],
                rating: 4.9,
                projects: 37,
                avatar: "T",
                title: "Cloud Architect & DevOps Engineer"
            },
            {
                name: "Nusrat Jahan",
                skills: ["Data Science", "Python", "TensorFlow", "Data Visualization", "SQL"],
                rating: 4.8,
                projects: 42,
                avatar: "N",
                title: "Data Scientist & ML Engineer"
            },
            {
                name: "Kamal Hossain",
                skills: ["Mobile Development", "Flutter", "iOS", "Android", "Firebase"],
                rating: 4.6,
                projects: 39,
                avatar: "K",
                title: "Cross-Platform Mobile Developer"
            },
            {
                name: "Farhana Islam",
                skills: ["Frontend Development", "React", "Vue.js", "Angular", "UI Design"],
                rating: 4.8,
                projects: 44,
                avatar: "F",
                title: "Frontend Specialist"
            }
        ];
        
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
        
        // Show suggestions while typing
        await this.fetchSuggestions(query);
        
        // If query is longer than 2 chars, show results
        if (query.length >= 2) {
            this.performSearch(query);
        }
    }
    
    async fetchSuggestions(query) {
        try {
            // First try backend API
            const response = await fetch(`${this.API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success && data.suggestions && data.suggestions.length > 0) {
                this.suggestions = data.suggestions;
                this.showSuggestions(data.suggestions);
            } else {
                // Fallback to local suggestions based on query
                const localSuggestions = this.getLocalSuggestions(query);
                if (localSuggestions.length > 0) {
                    this.suggestions = localSuggestions;
                    this.showSuggestions(localSuggestions);
                } else {
                    this.hideSuggestions();
                }
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            // Use local suggestions as fallback
            const localSuggestions = this.getLocalSuggestions(query);
            if (localSuggestions.length > 0) {
                this.suggestions = localSuggestions;
                this.showSuggestions(localSuggestions);
            } else {
                this.hideSuggestions();
            }
        }
    }
    
    getLocalSuggestions(query) {
        const lowercaseQuery = query.toLowerCase();
        // Get unique skills from all professionals
        const allSkills = [...new Set(this.itProfessionals.flatMap(p => p.skills))];
        
        // Filter skills that match the query
        const matchingSkills = allSkills.filter(skill => 
            skill.toLowerCase().includes(lowercaseQuery)
        ).slice(0, 5);
        
        // Get names that match the query
        const matchingNames = this.itProfessionals
            .filter(p => p.name.toLowerCase().includes(lowercaseQuery))
            .map(p => p.name)
            .slice(0, 3);
        
        // Combine and remove duplicates
        return [...new Set([...matchingSkills, ...matchingNames])];
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
        console.log('Searching for:', query);
        this.hideSuggestions();
        
        // Filter professionals based on query
        const lowercaseQuery = query.toLowerCase();
        const results = this.itProfessionals.filter(pro => 
            pro.name.toLowerCase().includes(lowercaseQuery) ||
            pro.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
            pro.title.toLowerCase().includes(lowercaseQuery)
        );
        
        this.displaySearchResults(results, query);
    }
    
    displaySearchResults(results, query) {
        this.searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No professionals found for "${query}"</h3>
                    <p>Try different keywords or browse all professionals below</p>
                </div>
            `;
        } else {
            const resultsHTML = `
                <div class="search-results-header">
                    <h3>Found ${results.length} professional${results.length > 1 ? 's' : ''} for "${query}"</h3>
                </div>
                <div class="search-results-grid">
                    ${results.map(pro => `
                        <div class="search-result-card">
                            <div class="result-avatar">${pro.avatar}</div>
                            <div class="result-info">
                                <h4>${pro.name}</h4>
                                <p class="result-title">${pro.title}</p>
                                <div class="result-skills">
                                    ${pro.skills.slice(0, 3).map(skill => `<span class="result-skill">${skill}</span>`).join('')}
                                    ${pro.skills.length > 3 ? `<span class="result-skill">+${pro.skills.length - 3}</span>` : ''}
                                </div>
                                <div class="result-meta">
                                    <span class="result-rating"><i class="fas fa-star"></i> ${pro.rating}</span>
                                    <span class="result-projects"><i class="fas fa-briefcase"></i> ${pro.projects} projects</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            this.searchResultsContainer.innerHTML = resultsHTML;
        }
        
        this.searchResultsContainer.style.display = 'block';
        
        // Scroll to results
        this.searchResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    hideSearchResults() {
        this.searchResultsContainer.style.display = 'none';
    }
    
    handleBlur(e) {
        // Delay hiding to allow click on suggestions
        setTimeout(() => {
            if (!this.suggestionsContainer.contains(document.activeElement) &&
                !this.searchResultsContainer.contains(document.activeElement)) {
                this.hideSuggestions();
            }
        }, 200);
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchHandler();
});
// Movie Tracker Application
class MovieTracker {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.userData = this.loadUserData();
        this.init();
    }

    // Initialize the application
    async init() {
        try {
            await this.loadMovies();
            this.setupEventListeners();
            this.populateFilterOptions();
            this.renderRecommendations();
            this.applyFilters();
            this.updateStatistics();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to load movies. Please refresh the page.');
        }
    }

    // Load movies from JSON file
    async loadMovies() {
        try {
            const response = await fetch('movies.json');
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const data = await response.json();
            this.movies = data.movies;
            this.filteredMovies = [...this.movies];
        } catch (error) {
            console.error('Error loading movies:', error);
            throw error;
        }
    }

    // Load user data from localStorage
    loadUserData() {
        const data = localStorage.getItem('movieTrackerData');
        return data ? JSON.parse(data) : {};
    }

    // Save user data to localStorage
    saveUserData() {
        localStorage.setItem('movieTrackerData', JSON.stringify(this.userData));
    }

    // Get user data for a specific movie
    getMovieUserData(movieId) {
        return this.userData[movieId] || { watched: false, rating: 0, watchlist: false, notInterested: false };
    }

    // Set user data for a specific movie
    setMovieUserData(movieId, data) {
        this.userData[movieId] = { ...this.getMovieUserData(movieId), ...data };
        this.saveUserData();
        this.updateStatistics();
        this.renderRecommendations();
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter listeners
        document.getElementById('holiday-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('genre-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('theme-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('status-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('search-input').addEventListener('input', () => this.applyFilters());
        document.getElementById('reset-filters').addEventListener('click', () => this.resetFilters());

        // Sort listener
        document.getElementById('sort-select').addEventListener('change', () => this.applySorting());

        // Clear data button
        document.getElementById('clear-data-btn').addEventListener('click', () => this.clearAllData());

        // Not interested modal
        document.getElementById('show-not-interested-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showNotInterestedModal();
        });

        const notInterestedModal = document.getElementById('not-interested-modal');
        const closeNotInterested = document.getElementById('close-not-interested');
        closeNotInterested.addEventListener('click', () => {
            notInterestedModal.style.display = 'none';
        });

        // Online recommendations button
        document.getElementById('get-online-recommendations-btn').addEventListener('click', () => {
            this.getOnlineRecommendations();
        });

        // Modal close
        const modal = document.getElementById('movie-modal');
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
            if (e.target === notInterestedModal) {
                notInterestedModal.style.display = 'none';
            }
        });
    }

    // Populate filter dropdowns with unique values
    populateFilterOptions() {
        // Get unique genres
        const genres = new Set();
        this.movies.forEach(movie => genres.add(movie.genre));
        const genreFilter = document.getElementById('genre-filter');
        Array.from(genres).sort().forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });

        // Get unique themes
        const themes = new Set();
        this.movies.forEach(movie => {
            movie.themes.forEach(theme => themes.add(theme));
        });
        const themeFilter = document.getElementById('theme-filter');
        Array.from(themes).sort().forEach(theme => {
            const option = document.createElement('option');
            option.value = theme;
            option.textContent = theme;
            themeFilter.appendChild(option);
        });
    }

    // Apply all filters
    applyFilters() {
        const holidayFilter = document.getElementById('holiday-filter').value;
        const genreFilter = document.getElementById('genre-filter').value;
        const themeFilter = document.getElementById('theme-filter').value;
        const statusFilter = document.getElementById('status-filter').value;
        const searchQuery = document.getElementById('search-input').value.toLowerCase();

        this.filteredMovies = this.movies.filter(movie => {
            const userData = this.getMovieUserData(movie.id);

            // Always filter out movies marked as not interested
            if (userData.notInterested) {
                return false;
            }

            // Holiday filter
            if (holidayFilter !== 'all' && !movie.holidays.includes(holidayFilter)) {
                return false;
            }

            // Genre filter
            if (genreFilter !== 'all' && movie.genre !== genreFilter) {
                return false;
            }

            // Theme filter
            if (themeFilter !== 'all' && !movie.themes.includes(themeFilter)) {
                return false;
            }

            // Status filter
            if (statusFilter === 'watched' && !userData.watched) {
                return false;
            }
            if (statusFilter === 'unwatched' && (userData.watched || userData.watchlist)) {
                return false;
            }
            if (statusFilter === 'rated' && userData.rating === 0) {
                return false;
            }

            // Search filter
            if (searchQuery) {
                const searchableText = `${movie.title} ${movie.description} ${movie.holidays.join(' ')} ${movie.themes.join(' ')}`.toLowerCase();
                if (!searchableText.includes(searchQuery)) {
                    return false;
                }
            }

            return true;
        });

        this.applySorting();
    }

    // Apply sorting
    applySorting() {
        const sortValue = document.getElementById('sort-select').value;

        this.filteredMovies.sort((a, b) => {
            const aData = this.getMovieUserData(a.id);
            const bData = this.getMovieUserData(b.id);

            switch (sortValue) {
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'year-asc':
                    return a.year - b.year;
                case 'year-desc':
                    return b.year - a.year;
                case 'rating-asc':
                    return aData.rating - bData.rating;
                case 'rating-desc':
                    return bData.rating - aData.rating;
                default:
                    return 0;
            }
        });

        this.renderMovies();
    }

    // Reset all filters
    resetFilters() {
        document.getElementById('holiday-filter').value = 'all';
        document.getElementById('genre-filter').value = 'all';
        document.getElementById('theme-filter').value = 'all';
        document.getElementById('status-filter').value = 'all';
        document.getElementById('search-input').value = '';
        document.getElementById('sort-select').value = 'title-asc';
        this.applyFilters();
    }

    // Render movies to the grid
    renderMovies() {
        const grid = document.getElementById('movies-grid');
        const noResults = document.getElementById('no-results');

        if (this.filteredMovies.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        grid.innerHTML = '';

        this.filteredMovies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            grid.appendChild(movieCard);
        });

        this.updateStatistics();
    }

    // Create a movie card element
    createMovieCard(movie) {
        const userData = this.getMovieUserData(movie.id);
        const card = document.createElement('div');
        card.className = `movie-card ${userData.watched ? 'watched' : 'unwatched'}`;
        card.setAttribute('data-movie-id', movie.id);

        // Determine status
        let statusBadge = '';
        if (userData.watched) {
            statusBadge = '<span class="status-badge status-watched">Watched</span>';
        } else if (userData.watchlist) {
            statusBadge = '<span class="status-badge status-watchlist">Want to Watch</span>';
        }

        card.innerHTML = `
            <div class="movie-header">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-year">${movie.year}</div>
                <div class="movie-genres">${movie.genre}</div>
            </div>

            <div class="movie-holidays">
                ${movie.holidays.map(holiday => `<span class="holiday-tag">${holiday}</span>`).join('')}
            </div>

            <div class="movie-themes">
                ${movie.themes.map(theme => `<span class="theme-tag">${theme}</span>`).join('')}
            </div>

            <div class="movie-description">
                ${movie.description}
            </div>

            <a href="${movie.trailer}" target="_blank" rel="noopener noreferrer" class="btn-trailer">Watch Trailer</a>

            <div class="rating-section">
                <div class="current-rating">
                    <span class="rating-label">Your Rating:</span>
                    <div class="stars" data-movie-id="${movie.id}">
                        ${this.createStars(userData.rating, movie.id)}
                    </div>
                </div>

                <div class="watch-status">
                    <div class="watch-status-row">
                        <button class="btn ${userData.watched ? 'btn-secondary' : 'btn-primary'} watch-btn"
                                data-movie-id="${movie.id}">
                            ${userData.watched ? 'Mark as Unwatched' : 'Mark as Watched'}
                        </button>
                        <button class="btn ${userData.watchlist ? 'btn-secondary' : 'btn-watchlist'} watchlist-btn"
                                data-movie-id="${movie.id}"
                                ${userData.watched ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            ${userData.watchlist ? 'Remove from Watch List' : 'Add to Watch List'}
                        </button>
                    </div>
                    <button class="btn btn-not-interested not-interested-btn"
                            data-movie-id="${movie.id}">
                        Not Interested
                    </button>
                </div>

                ${statusBadge}
            </div>
        `;

        // Add event listeners
        this.attachCardEventListeners(card, movie);

        return card;
    }

    // Create star rating HTML
    createStars(rating, movieId) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= rating ? 'filled' : '';
            starsHTML += `<span class="star ${filled}" data-rating="${i}" data-movie-id="${movieId}">★</span>`;
        }
        return starsHTML;
    }

    // Attach event listeners to a movie card
    attachCardEventListeners(card, movie) {
        // Star rating click
        const stars = card.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                const rating = parseInt(star.getAttribute('data-rating'));
                this.setRating(movie.id, rating);
            });

            star.addEventListener('mouseenter', (e) => {
                const rating = parseInt(star.getAttribute('data-rating'));
                this.highlightStars(card, rating);
            });
        });

        const starsContainer = card.querySelector('.stars');
        starsContainer.addEventListener('mouseleave', () => {
            const userData = this.getMovieUserData(movie.id);
            this.highlightStars(card, userData.rating);
        });

        // Watch button click
        const watchBtn = card.querySelector('.watch-btn');
        watchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleWatchStatus(movie.id);
        });

        // Wishlist button click
        const watchlistBtn = card.querySelector('.watchlist-btn');
        if (watchlistBtn) {
            watchlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleWishlist(movie.id);
            });
        }

        // Not interested button click
        const notInterestedBtn = card.querySelector('.not-interested-btn');
        if (notInterestedBtn) {
            notInterestedBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markNotInterested(movie.id);
            });
        }
    }

    // Highlight stars on hover
    highlightStars(card, rating) {
        const stars = card.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
            } else {
                star.classList.remove('filled');
            }
        });
    }

    // Set rating for a movie
    setRating(movieId, rating) {
        const currentData = this.getMovieUserData(movieId);

        // If clicking the same rating, remove it (set to 0)
        if (currentData.rating === rating) {
            rating = 0;
        }

        this.setMovieUserData(movieId, { rating });

        // If rating a movie, automatically mark it as watched
        if (rating > 0 && !currentData.watched) {
            this.setMovieUserData(movieId, { watched: true });
        }

        // Re-render to update the UI
        this.applyFilters();
    }

    // Toggle watch status
    toggleWatchStatus(movieId) {
        const currentData = this.getMovieUserData(movieId);
        const newWatchedStatus = !currentData.watched;

        this.setMovieUserData(movieId, {
            watched: newWatchedStatus,
            watchlist: false  // Remove from watchlist if marking as watched
        });

        // If marking as unwatched, also clear the rating
        if (currentData.watched) {
            this.setMovieUserData(movieId, { rating: 0 });
        }

        this.applyFilters();
    }

    // Toggle watchlist status
    toggleWishlist(movieId) {
        const currentData = this.getMovieUserData(movieId);

        // Can't add to watchlist if already watched
        if (currentData.watched) {
            return;
        }

        this.setMovieUserData(movieId, {
            watchlist: !currentData.watchlist
        });

        this.applyFilters();
    }

    // Mark movie as not interested
    markNotInterested(movieId) {
        if (confirm('Are you sure you want to hide this movie? It will be permanently removed from your list.')) {
            this.setMovieUserData(movieId, {
                notInterested: true,
                watched: false,
                watchlist: false,
                rating: 0
            });

            this.applyFilters();
        }
    }

    // Update statistics display
    updateStatistics() {
        const totalMovies = this.filteredMovies.length;
        let watchedCount = 0;
        let totalRating = 0;
        let ratedCount = 0;

        this.filteredMovies.forEach(movie => {
            const userData = this.getMovieUserData(movie.id);
            if (userData.watched) {
                watchedCount++;
            }
            if (userData.rating > 0) {
                totalRating += userData.rating;
                ratedCount++;
            }
        });

        const unwatchedCount = totalMovies - watchedCount;
        const avgRating = ratedCount > 0 ? (totalRating / ratedCount).toFixed(1) : '-';

        // Count not interested movies
        let notInterestedCount = 0;
        this.movies.forEach(movie => {
            const userData = this.getMovieUserData(movie.id);
            if (userData.notInterested) {
                notInterestedCount++;
            }
        });

        document.getElementById('total-movies').textContent = totalMovies;
        document.getElementById('watched-count').textContent = watchedCount;
        document.getElementById('unwatched-count').textContent = unwatchedCount;
        document.getElementById('avg-rating').textContent = avgRating !== '-' ? `${avgRating} ★` : avgRating;
        document.getElementById('not-interested-count').textContent = notInterestedCount;
    }

    // Generate movie recommendations based on user ratings
    generateRecommendations() {
        // Get all rated movies (4-5 stars are considered favorites)
        const highlyRatedMovies = this.movies.filter(movie => {
            const userData = this.getMovieUserData(movie.id);
            return userData.rating >= 4;
        });

        // If user hasn't rated any movies highly, don't show recommendations
        if (highlyRatedMovies.length === 0) {
            document.getElementById('recommendations-section').style.display = 'none';
            return [];
        }

        // Analyze user preferences
        const preferences = {
            genres: {},
            themes: {},
            holidays: {},
            decades: {}
        };

        // Build preference profile from highly rated movies
        highlyRatedMovies.forEach(movie => {
            const userData = this.getMovieUserData(movie.id);
            const weight = userData.rating; // 4 or 5 stars

            // Count genres
            preferences.genres[movie.genre] = (preferences.genres[movie.genre] || 0) + weight;

            // Count themes
            movie.themes.forEach(theme => {
                preferences.themes[theme] = (preferences.themes[theme] || 0) + weight;
            });

            // Count holidays
            movie.holidays.forEach(holiday => {
                preferences.holidays[holiday] = (preferences.holidays[holiday] || 0) + weight;
            });

            // Count decades
            const decade = Math.floor(movie.year / 10) * 10;
            preferences.decades[decade] = (preferences.decades[decade] || 0) + weight;
        });

        // Get unwatched movies (exclude not interested movies)
        const unwatchedMovies = this.movies.filter(movie => {
            const userData = this.getMovieUserData(movie.id);
            return !userData.watched && !userData.notInterested;
        });

        // Score each unwatched movie
        const scoredMovies = unwatchedMovies.map(movie => {
            let score = 0;
            const reasons = [];

            // Genre match (30% weight)
            if (preferences.genres[movie.genre]) {
                const genreScore = preferences.genres[movie.genre] * 0.3;
                score += genreScore;
                reasons.push({
                    type: 'genre',
                    value: movie.genre,
                    score: genreScore
                });
            }

            // Theme matches (40% weight)
            let themeScore = 0;
            const matchedThemes = [];
            movie.themes.forEach(theme => {
                if (preferences.themes[theme]) {
                    themeScore += preferences.themes[theme] * 0.1;
                    matchedThemes.push(theme);
                }
            });
            if (themeScore > 0) {
                score += themeScore;
                reasons.push({
                    type: 'themes',
                    value: matchedThemes,
                    score: themeScore
                });
            }

            // Holiday matches (20% weight)
            let holidayScore = 0;
            const matchedHolidays = [];
            movie.holidays.forEach(holiday => {
                if (preferences.holidays[holiday]) {
                    holidayScore += preferences.holidays[holiday] * 0.2;
                    matchedHolidays.push(holiday);
                }
            });
            if (holidayScore > 0) {
                score += holidayScore;
                reasons.push({
                    type: 'holidays',
                    value: matchedHolidays,
                    score: holidayScore
                });
            }

            // Decade preference (10% weight)
            const decade = Math.floor(movie.year / 10) * 10;
            if (preferences.decades[decade]) {
                const decadeScore = preferences.decades[decade] * 0.1;
                score += decadeScore;
                reasons.push({
                    type: 'decade',
                    value: `${decade}s`,
                    score: decadeScore
                });
            }

            return {
                movie,
                score,
                reasons: reasons.sort((a, b) => b.score - a.score)
            };
        });

        // Sort by score and return top 6
        const recommendations = scoredMovies
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6);

        return recommendations;
    }

    // Render recommendations section
    renderRecommendations() {
        const recommendations = this.generateRecommendations();
        const section = document.getElementById('recommendations-section');
        const grid = document.getElementById('recommendations-grid');

        if (recommendations.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        grid.innerHTML = '';

        recommendations.forEach((rec, index) => {
            const movie = rec.movie;
            const userData = this.getMovieUserData(movie.id);

            // Calculate match percentage (normalize score to 0-100%)
            const maxPossibleScore = 5 * (0.3 + 0.4 + 0.2 + 0.1); // Max score if all preferences match
            const matchPercentage = Math.min(100, Math.round((rec.score / maxPossibleScore) * 100));

            // Get primary reason
            const primaryReason = rec.reasons[0];
            let reasonText = '';

            if (primaryReason.type === 'genre') {
                reasonText = `You enjoyed other <strong>${primaryReason.value}</strong> movies`;
            } else if (primaryReason.type === 'themes') {
                reasonText = `Shares themes: <strong>${primaryReason.value.join(', ')}</strong>`;
            } else if (primaryReason.type === 'holidays') {
                reasonText = `You love <strong>${primaryReason.value.join(', ')}</strong> movies`;
            } else if (primaryReason.type === 'decade') {
                reasonText = `From the <strong>${primaryReason.value}</strong> you enjoy`;
            }

            const card = document.createElement('div');
            card.className = 'recommendation-card movie-card unwatched';
            card.setAttribute('data-movie-id', movie.id);

            // Determine status for recommendation
            let statusBadge = '';
            if (userData.watched) {
                statusBadge = '<span class="status-badge status-watched">Watched</span>';
            } else if (userData.watchlist) {
                statusBadge = '<span class="status-badge status-watchlist">Want to Watch</span>';
            }

            card.innerHTML = `
                <span class="recommendation-badge">Recommended</span>

                <div class="movie-header">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-year">${movie.year}</div>
                    <div class="movie-genres">${movie.genre}</div>
                </div>

                <div class="movie-holidays">
                    ${movie.holidays.map(holiday => `<span class="holiday-tag">${holiday}</span>`).join('')}
                </div>

                <div class="recommendation-reason">
                    ${reasonText}
                </div>

                <div class="match-score">
                    <span class="match-score-label">Match:</span>
                    <span class="match-score-value">${matchPercentage}%</span>
                </div>

                <div class="movie-themes">
                    ${movie.themes.map(theme => `<span class="theme-tag">${theme}</span>`).join('')}
                </div>

                <div class="movie-description">
                    ${movie.description}
                </div>

                <a href="${movie.trailer}" target="_blank" rel="noopener noreferrer" class="btn-trailer">Watch Trailer</a>

                <div class="rating-section">
                    <div class="current-rating">
                        <span class="rating-label">Your Rating:</span>
                        <div class="stars" data-movie-id="${movie.id}">
                            ${this.createStars(userData.rating, movie.id)}
                        </div>
                    </div>

                    <div class="watch-status">
                        <div class="watch-status-row">
                            <button class="btn ${userData.watched ? 'btn-secondary' : 'btn-primary'} watch-btn"
                                    data-movie-id="${movie.id}">
                                ${userData.watched ? 'Mark as Unwatched' : 'Mark as Watched'}
                            </button>
                            <button class="btn ${userData.watchlist ? 'btn-secondary' : 'btn-watchlist'} watchlist-btn"
                                    data-movie-id="${movie.id}"
                                    ${userData.watched ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                                ${userData.watchlist ? 'Remove from Watch List' : 'Add to Watch List'}
                            </button>
                        </div>
                        <button class="btn btn-not-interested not-interested-btn"
                                data-movie-id="${movie.id}">
                            Not Interested
                        </button>
                    </div>

                    ${statusBadge}
                </div>
            `;

            // Add event listeners
            this.attachCardEventListeners(card, movie);

            grid.appendChild(card);
        });
    }

    // Clear all user data
    clearAllData() {
        if (confirm('Are you sure you want to clear all your movie tracking data? This cannot be undone.')) {
            localStorage.removeItem('movieTrackerData');
            this.userData = {};
            this.renderRecommendations();
            this.applyFilters();
            alert('All data has been cleared!');
        }
    }

    // Show error message
    showError(message) {
        const grid = document.getElementById('movies-grid');
        grid.innerHTML = `
            <div class="no-results" style="display: block;">
                <p style="color: var(--danger-color);">${message}</p>
            </div>
        `;
    }

    // Show not interested movies modal
    showNotInterestedModal() {
        const modal = document.getElementById('not-interested-modal');
        const grid = document.getElementById('not-interested-grid');

        // Get all not interested movies
        const notInterestedMovies = this.movies.filter(movie => {
            const userData = this.getMovieUserData(movie.id);
            return userData.notInterested;
        });

        if (notInterestedMovies.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">No movies marked as not interested.</p>';
        } else {
            grid.innerHTML = '';
            notInterestedMovies.forEach(movie => {
                const item = document.createElement('div');
                item.className = 'not-interested-item';
                item.innerHTML = `
                    <h4>${movie.title}</h4>
                    <p>${movie.year} • ${movie.genre}</p>
                    <p style="font-size: 0.8rem; color: var(--text-light);">Click to restore</p>
                `;
                item.addEventListener('click', () => {
                    if (confirm(`Restore "${movie.title}" to your movie list?`)) {
                        this.setMovieUserData(movie.id, {
                            notInterested: false
                        });
                        this.showNotInterestedModal(); // Refresh the modal
                        this.applyFilters(); // Refresh main view
                    }
                });
                grid.appendChild(item);
            });
        }

        modal.style.display = 'block';
    }

    // Get online recommendations
    async getOnlineRecommendations() {
        const button = document.getElementById('get-online-recommendations-btn');
        const content = document.getElementById('online-recommendations-content');
        const section = document.getElementById('online-recommendations-section');

        button.disabled = true;
        button.textContent = 'Loading...';

        try {
            // Get user's favorite genres and themes
            const favorites = this.movies.filter(movie => {
                const userData = this.getMovieUserData(movie.id);
                return userData.rating >= 4;
            });

            if (favorites.length === 0) {
                content.innerHTML = `
                    <p style="color: var(--text-light);">Please rate some movies 4-5 stars first to get personalized online recommendations.</p>
                `;
                section.style.display = 'block';
                return;
            }

            // Analyze favorite genres and holidays
            const genreCounts = {};
            const holidayCounts = {};
            favorites.forEach(movie => {
                genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
                movie.holidays.forEach(holiday => {
                    holidayCounts[holiday] = (holidayCounts[holiday] || 0) + 1;
                });
            });

            const topGenre = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])[0];
            const topHoliday = Object.keys(holidayCounts).sort((a, b) => holidayCounts[b] - holidayCounts[a])[0];

            // Create a simple recommendation message based on preferences
            content.innerHTML = `
                <h4>Based on Your Preferences</h4>
                <p>You seem to enjoy <strong>${topGenre}</strong> movies, especially those celebrating <strong>${topHoliday}</strong>.</p>
                <p>Here are some online resources for finding similar movies:</p>
                <ul>
                    <li><a href="https://www.imdb.com/search/title/?genres=${topGenre.toLowerCase()}&title_type=feature" target="_blank" rel="noopener noreferrer">IMDb - ${topGenre} Movies</a></li>
                    <li><a href="https://www.rottentomatoes.com/browse/movies_in_theaters/genres:${topGenre.toLowerCase()}" target="_blank" rel="noopener noreferrer">Rotten Tomatoes - ${topGenre} Section</a></li>
                    <li><a href="https://www.justwatch.com/us/search?q=${topHoliday.replace(' ', '%20')}%20movies" target="_blank" rel="noopener noreferrer">JustWatch - ${topHoliday} Movies</a></li>
                    <li><a href="https://www.themoviedb.org/search?query=${topHoliday.replace(' ', '+')}+${topGenre.replace(' ', '+')}" target="_blank" rel="noopener noreferrer">The Movie Database - Similar Movies</a></li>
                </ul>
                <p style="font-size: 0.9rem; color: var(--text-light); margin-top: 1rem;">These links will open in new tabs and help you discover more holiday movies based on your tastes!</p>
            `;

            section.style.display = 'block';
        } catch (error) {
            console.error('Error getting online recommendations:', error);
            content.innerHTML = `
                <p style="color: var(--danger-color);">Failed to generate recommendations. Please try again later.</p>
            `;
            section.style.display = 'block';
        } finally {
            button.disabled = false;
            button.textContent = 'Get Online Recommendations';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.movieTracker = new MovieTracker();
});

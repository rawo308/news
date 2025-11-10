// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// API Client
const api = {
    /**
     * Fetch news articles from the backend
     * @param {Object} options - Query options
     * @param {string} options.category - Filter by category
     * @param {boolean} options.breaking - Filter by breaking news
     * @returns {Promise<Array>} Array of news articles
     */
    async getNews({ category = null, breaking = null } = {}) {
        try {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (breaking !== null) params.append('breaking', breaking ? '1' : '0');

            const url = `${API_BASE_URL}/news${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    },

    /**
     * Login to admin panel
     * @param {string} username - Admin username
     * @param {string} password - Admin password
     * @returns {Promise<Object>} Token object
     */
    async login(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Create a new news article
     * @param {Object} article - Article data
     * @param {string} token - JWT token
     * @returns {Promise<Object>} Created article
     */
    async createNews(article, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(article),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating news:', error);
            throw error;
        }
    }
};

// Export for use in other scripts
window.api = api;

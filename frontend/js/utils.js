// Utility functions for the frontend

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format date to Arabic locale
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Get category display name in Arabic
 * @param {string} category - Category key
 * @returns {string} Arabic category name
 */
function getCategoryDisplayName(category) {
    const categoryNames = {
        'urgent': 'عاجل',
        'local': 'محلي',
        'international': 'دولي',
        'economy': 'اقتصاد',
        'highlights': 'أبرز الأخبار'
    };
    return categoryNames[category] || category;
}

/**
 * Get category color class
 * @param {string} category - Category key
 * @returns {string} CSS class name
 */
function getCategoryColor(category) {
    const colors = {
        'urgent': 'category-urgent',
        'local': 'category-local',
        'international': 'category-international',
        'economy': 'category-economy',
        'highlights': 'category-highlights'
    };
    return colors[category] || 'category-default';
}

/**
 * Show loading spinner
 */
function showLoading() {
    const container = document.getElementById('news-container');
    if (container) {
        container.innerHTML = '<div class="loading">جاري التحميل...</div>';
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message = 'حدث خطأ أثناء تحميل الأخبار') {
    const container = document.getElementById('news-container');
    if (container) {
        container.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
    }
}

/**
 * Show empty state
 * @param {string} message - Empty state message
 */
function showEmpty(message = 'لا توجد أخبار حالياً') {
    const container = document.getElementById('news-container');
    if (container) {
        container.innerHTML = `<div class="empty">${escapeHtml(message)}</div>`;
    }
}

/**
 * Render a news card
 * @param {Object} article - Article object
 * @returns {string} HTML string
 */
function renderNewsCard(article) {
    const imageUrl = article.image || 'ramya logo.jpg';
    const breakingBadge = article.breaking ? '<span class="breaking-badge">عاجل</span>' : '';

    return `
        <div class="news-card ${article.breaking ? 'breaking-news' : ''}">
            ${breakingBadge}
            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(article.title)}" class="news-image">
            <div class="news-content">
                <span class="news-category ${getCategoryColor(article.category)}">
                    ${escapeHtml(getCategoryDisplayName(article.category))}
                </span>
                <h3 class="news-title">${escapeHtml(article.title)}</h3>
                <p class="news-summary">${escapeHtml(article.summary)}</p>
                <div class="news-meta">
                    <span class="news-date">${formatDate(article.date)}</span>
                </div>
                <a href="pages/article.html?id=${article.id}" class="read-more">اقرأ المزيد</a>
            </div>
        </div>
    `;
}

/**
 * Render news list
 * @param {Array} articles - Array of articles
 * @param {string} containerId - Container element ID
 */
function renderNewsList(articles, containerId = 'news-container') {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }

    if (!articles || articles.length === 0) {
        showEmpty();
        return;
    }

    const html = articles.map(article => renderNewsCard(article)).join('');
    container.innerHTML = html;
}

// Export functions to global scope
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.getCategoryDisplayName = getCategoryDisplayName;
window.getCategoryColor = getCategoryColor;
window.showLoading = showLoading;
window.showError = showError;
window.showEmpty = showEmpty;
window.renderNewsCard = renderNewsCard;
window.renderNewsList = renderNewsList;

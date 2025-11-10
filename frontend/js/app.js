// Main application logic

/**
 * Load news based on current page and filters
 */
async function loadNews() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const breaking = urlParams.get('breaking');

    // Show loading state
    showLoading();

    try {
        // Fetch news from API
        const articles = await api.getNews({
            category: category,
            breaking: breaking === '1' ? true : breaking === '0' ? false : null
        });

        // Render news list
        renderNewsList(articles);

    } catch (error) {
        console.error('Failed to load news:', error);
        showError('حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة مرة أخرى.');
    }
}

/**
 * Load a single article by ID
 */
async function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        showError('معرف المقال غير موجود');
        return;
    }

    showLoading();

    try {
        // Fetch all news and find the specific article
        const articles = await api.getNews();
        const article = articles.find(a => a.id == articleId);

        if (!article) {
            showError('المقال غير موجود');
            return;
        }

        // Render article
        renderArticle(article);

    } catch (error) {
        console.error('Failed to load article:', error);
        showError('حدث خطأ أثناء تحميل المقال. يرجى المحاولة مرة أخرى.');
    }
}

/**
 * Render a full article
 * @param {Object} article - Article object
 */
function renderArticle(article) {
    const container = document.getElementById('article-container');

    if (!container) {
        console.error('Article container not found');
        return;
    }

    const imageUrl = article.image || '../ramya logo.jpg';
    const breakingBadge = article.breaking ? '<span class="breaking-badge">عاجل</span>' : '';

    const html = `
        <article class="article-detail">
            ${breakingBadge}
            <h1 class="article-title">${escapeHtml(article.title)}</h1>
            <div class="article-meta">
                <span class="article-category ${getCategoryColor(article.category)}">
                    ${escapeHtml(getCategoryDisplayName(article.category))}
                </span>
                <span class="article-date">${formatDate(article.date)}</span>
            </div>
            <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(article.title)}" class="article-image">
            <div class="article-content">
                ${escapeHtml(article.content)}
            </div>
            <a href="../index.html" class="back-button">العودة إلى الصفحة الرئيسية</a>
        </article>
    `;

    container.innerHTML = html;
}

/**
 * Initialize the application
 */
function initApp() {
    // Check which page we're on
    const path = window.location.pathname;

    if (path.includes('article.html')) {
        // Load single article
        loadArticle();
    } else {
        // Load news list
        loadNews();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for use in other scripts
window.loadNews = loadNews;
window.loadArticle = loadArticle;
window.renderArticle = renderArticle;

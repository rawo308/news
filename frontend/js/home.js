// Home Page Logic - 3 Column Layout
// Right: Urgent News | Middle: Random News Feed | Left: Featured Articles

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch all news
        const allNews = await api.getNews();

        // Separate news by type
        const urgentNews = allNews.filter(item => item.category === 'urgent' || item.breaking);
        const otherNews = allNews.filter(item => item.category !== 'urgent');

        // Load each column
        loadUrgentNews(urgentNews);
        loadMainNewsFeed(otherNews);
        loadFeaturedArticles(otherNews);

    } catch (error) {
        console.error('Error loading homepage:', error);
    }
});

// Right Column: Urgent News Mirror
function loadUrgentNews(urgentNews) {
    const container = document.getElementById('urgent-news-list');

    if (!urgentNews || urgentNews.length === 0) {
        container.innerHTML = '<p style="padding:12px;color:#999;font-size:0.9rem;">لا توجد أخبار عاجلة حالياً</p>';
        return;
    }

    // Take latest 8 urgent news items
    const latestUrgent = urgentNews.slice(0, 8);

    container.innerHTML = latestUrgent.map(item => {
        const date = formatDate(item.date);
        const time = formatTime(item.date);

        return `
           <div class="urgent-compact-item">
                <h3 class="urgent-compact-title">
                    <span class="urgent-dot"></span>
                    <a href="javascript:void(0)">${escapeHtml(item.title)}</a>
                </h3>
                <div class="urgent-compact-date">
                    <span>${date}</span>
                    <span>•</span>
                    <span>${time}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Middle Column: Random News from other categories (local, economy, international, highlights)
function loadMainNewsFeed(otherNews) {
    const container = document.getElementById('main-news-feed');

    if (!otherNews || otherNews.length === 0) {
        container.innerHTML = '<p style="padding:20px;color:#999;text-align:center;">لا توجد أخبار متاحة</p>';
        return;
    }

    // Shuffle and take 6 random articles
    const shuffled = shuffleArray([...otherNews]);
    const randomNews = shuffled.slice(0, 6);
    // Add staggered animation delay
    container.innerHTML = randomNews.map((item, index) => {
        const imageUrl = item.image || 'ramya logo.jpg';
const categoryLabel = `<a href="pages/category.html?cat=${encodeURIComponent(item.category)}" style="color: inherit; text-decoration: none;">${getCategoryLabel(item.category)}</a>`;
        const date = formatDate(item.date);

        return `
            <article class="news-feed-item" style="animation-delay:${index * 0.1}s">
                <img src="${imageUrl}" alt="${escapeHtml(item.title)}" loading="lazy">
                <div class="news-feed-body">
                    <span class="news-feed-category">${categoryLabel}</span>
                    <h2 class="news-feed-title">
                        <a href="pages/article.html?id=${item.id}">${escapeHtml(item.title)}</a>
                    </h2>
                    ${item.summary ? `<p class="news-feed-summary">${escapeHtml(item.summary)}</p>` : ''}
                    <div class="news-feed-footer">
                        <span class="news-feed-date">${date}</span>
                        <a href="pages/article.html?id=${item.id}" class="read-more-btn">اقرأ المزيد</a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Left Column: Featured Articles (random selection from other categories)
function loadFeaturedArticles(otherNews) {
    const container = document.getElementById('featured-articles');

    if (!otherNews || otherNews.length === 0) {
        container.innerHTML = '<p style="padding:12px;color:#999;font-size:0.9rem;">لا توجد مقالات مميزة</p>';
        return;
    }

    // Shuffle and take 5 featured articles
    const shuffled = shuffleArray([...otherNews]);
    const featured = shuffled.slice(0, 5);

    container.innerHTML = featured.map(item => {
        const imageUrl = item.image || 'ramya logo.jpg';
        const summary = item.summary || item.content.substring(0, 100) + '...';

        return `
            <article class="featured-item">
                <img src="${imageUrl}" alt="${escapeHtml(item.title)}" loading="lazy">
                <div class="featured-body">
                    <h3 class="featured-title">
                        <a href="pages/article.html?id=${item.id}">${escapeHtml(item.title)}</a>
                    </h3>
                    <p class="featured-summary">${escapeHtml(summary)}</p>
                    <a href="pages/article.html?id=${item.id}" class="featured-read-btn">اقرأ المزيد ←</a>
                </div>
            </article>
        `;
    }).join('');
}

// Helper: Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Helper: Get category label in Arabic
function getCategoryLabel(category) {
    const labels = {
        'highlights': 'أخبار هامة',
        'local': 'محليات',
        'international': 'إقليمي ودولي',
        'economy': 'اقتصاد',
        'urgent': 'عاجل'
    };
    return labels[category] || category;
}

// Helper: Format date (reuse from utils.js if available)
function formatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    } catch (e) {
        return dateString;
    }
}

// Helper: Format time
function formatTime(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    } catch (e) {
        return '';
    }
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

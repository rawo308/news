// Simple client-side loader + admin-local-storage support
const CONTAINER = document.getElementById('news-container');
const DATA_PATH = 'data/articles.json';
const STORAGE_KEY = 'ramya_articles_local';

async function loadSource(){
    const res = await fetch(DATA_PATH).catch(()=>null);
    const fromFile = res ? await res.json().catch(()=>[]) : [];
    const fromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // merge: storage items override file items with same id
    const map = new Map();
    fromFile.forEach(a=>map.set(String(a.id), a));
    fromStorage.forEach(a=>map.set(String(a.id), a));
    return Array.from(map.values()).sort((a,b)=> new Date(b.date)-new Date(a.date));
}

function renderList(list){
    if(!list.length){ CONTAINER.innerHTML = '<p>لا توجد أخبار حالياً.</p>'; return; }
    const grid = document.createElement('div'); grid.className='grid';
    list.forEach(item=>{
        const card = document.createElement('article'); card.className='card';
        card.innerHTML = `
            <img src="${escapeHtml(item.image||'https://via.placeholder.com/640x360')}" alt="${escapeHtml(item.title)}">
            <div class="body">
              <h3><a href="pages/article.html?id=${item.id}">${escapeHtml(item.title)}</a></h3>
              <p>${escapeHtml(item.summary || '')}</p>
              <div class="meta">
                <span>${escapeHtml(item.category||'عام')}</span>
                <span>${new Date(item.date).toLocaleString('ar-EG')}</span>
              </div>
            </div>
        `;
        if(item.breaking){
            const badge = document.createElement('div'); badge.className='badge'; badge.textContent='عاجل';
            card.querySelector('.body').prepend(badge);
        }
        grid.appendChild(card);
    });
    CONTAINER.innerHTML = '';
    CONTAINER.appendChild(grid);
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

async function init(){
    const list = await loadSource();
    renderList(list);
    document.getElementById('ajel').addEventListener('click', e=>{
        e.preventDefault();
        renderList(list.filter(a=>a.breaking));
    });
}
init();
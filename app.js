/* ===== CityGuide India — Main Application (Part 1: Core + Pages) ===== */

// --- State ---
const state = {
  page: 'home', adminLoggedIn: false, adminTab: 'dashboard',
  guideLoggedIn: null,
  theme: localStorage.getItem('cg_theme') || (window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'),
  searchOpen: false, menuOpen: false
};

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
  applyTheme(state.theme);
  await initDB();
  setupEventListeners();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
  // PWA
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  // Install prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; document.getElementById('install-banner').classList.remove('hidden'); });
  document.getElementById('install-btn')?.addEventListener('click', () => { if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; } document.getElementById('install-banner').classList.add('hidden'); });
  document.getElementById('install-dismiss')?.addEventListener('click', () => document.getElementById('install-banner').classList.add('hidden'));
  // Splash
  setTimeout(() => { document.getElementById('splash').classList.add('hide'); setTimeout(() => document.getElementById('splash').remove(), 500); }, 1200);
  // Session end
  window.addEventListener('beforeunload', endSession);
  logActivity('app_start', 'visitor', 'app');
});

// --- Theme ---
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  state.theme = t; localStorage.setItem('cg_theme', t);
  const icon = document.querySelector('#theme-btn .material-symbols-rounded');
  if (icon) icon.textContent = t === 'dark' ? 'light_mode' : 'dark_mode';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#111318' : '#1b6ef3');
}

// --- Events ---
function setupEventListeners() {
  document.getElementById('theme-btn').addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
  // Scroll
  window.addEventListener('scroll', () => document.getElementById('top-bar').classList.toggle('scrolled', scrollY > 10));
  // Avatar menu
  document.getElementById('avatar-btn').addEventListener('click', e => { e.stopPropagation(); document.getElementById('avatar-dropdown').classList.toggle('open'); });
  document.addEventListener('click', () => document.getElementById('avatar-dropdown').classList.remove('open'));
  // Search
  document.getElementById('search-toggle-btn').addEventListener('click', () => toggleSearch());
  document.getElementById('search-close-btn').addEventListener('click', () => toggleSearch(false));
  document.getElementById('global-search').addEventListener('input', e => runSearch(e.target.value));
  // Guide logout
  document.getElementById('guide-logout-link')?.addEventListener('click', e => { e.preventDefault(); state.guideLoggedIn = null; localStorage.removeItem('cg_guide_login'); updateGuideMenu(); snackbar('Logged out successfully'); navigateTo('/'); });
  // Restore guide login
  const savedGuide = localStorage.getItem('cg_guide_login');
  if (savedGuide) { state.guideLoggedIn = savedGuide; updateGuideMenu(); }
}

function toggleSearch(open) {
  const c = document.getElementById('search-bar-container');
  const isOpen = open !== undefined ? open : !c.classList.contains('open');
  c.classList.toggle('open', isOpen);
  if (isOpen) document.getElementById('global-search').focus();
  else { document.getElementById('global-search').value = ''; document.getElementById('search-results').innerHTML = ''; }
}

async function runSearch(q) {
  const el = document.getElementById('search-results');
  if (!q || q.length < 2) { el.innerHTML = ''; return; }
  q = q.toLowerCase();
  const cityResults = CITIES.filter(c => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q));
  const guides = await db.guides.where('status').equals('verified').toArray();
  const guideResults = guides.filter(g => g.name.toLowerCase().includes(q) || g.city.toLowerCase().includes(q) || g.specialties.some(s => s.toLowerCase().includes(q)));
  let html = '';
  cityResults.forEach(c => { html += `<div class="search-result-item" onclick="navigateTo('/city/${c.id}');toggleSearch(false)"><span class="material-symbols-rounded">location_city</span><div><strong>${c.name}</strong> — ${c.tagline}</div></div>`; });
  guideResults.slice(0, 5).forEach(g => { html += `<div class="search-result-item" onclick="navigateTo('/guide/${g.id}');toggleSearch(false)"><span class="material-symbols-rounded">person</span><div><strong>${g.name}</strong> — ${getCityName(g.city)}</div></div>`; });
  if (!html) html = '<div style="padding:12px;font-size:14px;color:var(--md-outline)">No results found</div>';
  el.innerHTML = html;
}

function updateGuideMenu() {
  const show = !!state.guideLoggedIn;
  document.getElementById('guide-dashboard-link').style.display = show ? '' : 'none';
  document.getElementById('guide-logout-link').style.display = show ? '' : 'none';
  document.getElementById('guide-menu-divider').style.display = show ? '' : 'none';
  const hdr = document.getElementById('dropdown-header');
  if (show) {
    db.guides.get(state.guideLoggedIn).then(g => { if (g) hdr.textContent = `Signed in as ${g.name}`; });
  } else hdr.textContent = 'Not signed in';
}

// --- Router ---
function handleRoute() {
  const hash = location.hash.slice(1) || '/';
  const [, ...parts] = hash.split('/');
  const route = parts.join('/') || '';
  // Update nav
  document.querySelectorAll('[data-route]').forEach(el => {
    const r = el.dataset.route;
    el.classList.toggle('active', route === r || (r === 'home' && route === ''));
  });
  // FAB visibility
  const fab = document.getElementById('fab');
  if (fab) fab.classList.toggle('hide', route.startsWith('register') || route.startsWith('admin') || route.startsWith('guide-dashboard'));
  // Route
  const app = document.getElementById('app');
  if (route === '' || route === 'home') renderHome(app);
  else if (route === 'cities') renderCities(app);
  else if (route.startsWith('city/')) renderCityDetail(app, route.split('/')[1]);
  else if (route === 'guides') renderGuides(app);
  else if (route.startsWith('guide/')) renderGuideProfile(app, route.split('/')[1]);
  else if (route === 'bookings') renderBookings(app);
  else if (route === 'register-guide') renderGuideRegister(app);
  else if (route === 'guide-login') renderGuideLogin(app);
  else if (route === 'guide-dashboard') renderGuideDashboard(app);
  else if (route.startsWith('quiz/')) renderQuiz(app, route);
  else if (route === 'admin-panel-x7k9') renderAdmin(app);
  else render404(app);
  logPageView(route || 'home');
  window.scrollTo(0, 0);
}

function navigateTo(path) { location.hash = path; }

// --- Helpers ---
function getCityName(id) { const c = CITIES.find(c => c.id === id); return c ? c.name : id; }
function getCityColor(id) { const c = CITIES.find(c => c.id === id); return c ? c.color : '#1b6ef3'; }
function getAvatar(name) { return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=d6e3ff&textColor=001b3e&fontSize=42`; }
function getStars(rating, interactive = false, id = '') {
  let html = `<div class="star-rating ${interactive ? 'star-rating-interactive' : ''}" ${id ? `id="${id}"` : ''}>`;
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rating);
    const half = !filled && i - 0.5 <= rating;
    html += `<span class="material-symbols-rounded star ${filled || half ? 'filled' : ''}" data-val="${i}" ${interactive ? `onclick="setStarRating('${id}',${i})"` : ''}>${filled ? 'star' : half ? 'star_half' : 'star'}</span>`;
  }
  html += '</div>';
  return html;
}
function setStarRating(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.dataset.value = val;
  el.querySelectorAll('.star').forEach(s => {
    const v = parseInt(s.dataset.val);
    s.classList.toggle('filled', v <= val);
    s.textContent = v <= val ? 'star' : 'star';
  });
}
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}
function formatDate(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }

// --- Snackbar ---
function snackbar(msg, type = 'info') {
  const host = document.getElementById('snackbar-host');
  const el = document.createElement('div');
  el.className = `snackbar ${type}`;
  const icons = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };
  el.innerHTML = `<span class="material-symbols-rounded">${icons[type] || 'info'}</span><span class="snackbar-msg">${msg}</span>`;
  host.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3000);
}

// --- Modal ---
function openModal(title, bodyHtml) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-scrim').classList.add('open');
  logActivity('modal_open', 'visitor', title);
}
function closeModal() { document.getElementById('modal-scrim').classList.remove('open'); }
document.getElementById('modal-scrim')?.addEventListener('click', e => { if (e.target.id === 'modal-scrim') closeModal(); });

// --- HOME PAGE ---
async function renderHome(app) {
  const guides = await db.guides.where('status').equals('verified').toArray();
  const topGuides = guides.sort((a, b) => b.rating - a.rating).slice(0, 4);
  const cityGuideCount = {};
  guides.forEach(g => { cityGuideCount[g.city] = (cityGuideCount[g.city] || 0) + 1; });
  const totalBookings = await db.bookings.count();

  app.innerHTML = `<div class="page-enter">
    <!-- Hero -->
    <div class="hero">
      <div class="hero-bg" style="background-image:url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&q=80')"></div>
      <div class="hero-content">
        <div class="hero-badge"><span class="material-symbols-rounded" style="font-size:16px">verified</span> Trusted by ${totalBookings}+ travelers</div>
        <h1>Discover India with Local Experts</h1>
        <p>Find verified guides who speak your language and know every hidden gem. Book personalized tours across India's most beautiful cities.</p>
        <div class="hero-actions">
          <a href="#/cities" class="md-btn md-btn-filled md-btn-lg"><span class="material-symbols-rounded">explore</span>Explore Cities</a>
          <a href="#/guides" class="md-btn md-btn-outlined md-btn-lg"><span class="material-symbols-rounded">group</span>Find Guides</a>
        </div>
      </div>
    </div>

    <!-- Cities -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Explore India's Iconic Cities</h2>
        <p class="section-subtitle">6 handpicked destinations, each with its own magic</p>
      </div>
      <div class="city-grid">
        ${CITIES.map(c => `
          <div class="city-card" onclick="navigateTo('/city/${c.id}')">
            <div class="city-card-bg" style="background-image:url('${c.image}')"></div>
            <div class="city-card-overlay"></div>
            <div class="city-card-content">
              <div class="city-card-emoji">${c.emoji}</div>
              <div class="city-card-name">${c.name}</div>
              <div class="city-card-tagline">${c.tagline}</div>
              <div class="city-card-meta">
                <span><span class="material-symbols-rounded">person</span>${cityGuideCount[c.id] || 0} Guides</span>
                <span><span class="material-symbols-rounded">place</span>${c.attractions.length} Spots</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Top Guides -->
    <div class="section">
      <div class="section-header flex justify-between items-center">
        <div>
          <h2 class="section-title">Top Rated Guides</h2>
          <p class="section-subtitle">Handpicked guides loved by travelers worldwide</p>
        </div>
        <a href="#/guides" class="md-btn md-btn-tonal md-btn-sm">View All</a>
      </div>
      <div class="guide-grid">
        ${topGuides.map(g => guideCardHtml(g)).join('')}
      </div>
    </div>

    <!-- Features -->
    <div class="section">
      <div class="section-header text-center">
        <h2 class="section-title">Why CityGuide?</h2>
        <p class="section-subtitle">The smarter way to explore India</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px">
        ${[
          { icon: 'verified_user', title: 'Verified Guides', desc: 'Every guide passes language and city knowledge tests before being approved.' },
          { icon: 'translate', title: 'Speak Your Language', desc: 'Filter by language — from Hindi to English to regional languages.' },
          { icon: 'calendar_month', title: 'Easy Booking', desc: 'Book your perfect tour in under 3 minutes. Choose date, time, and group size.' },
          { icon: 'star', title: 'Real Reviews', desc: 'Read honest reviews from real travelers. Our rating system helps you find the best.' },
          { icon: 'payments', title: 'Transparent Pricing', desc: 'No hidden fees. See the exact price per hour upfront. Pay only for the time you need.' },
          { icon: 'eco', title: 'Local Experiences', desc: 'Go beyond tourist traps. Our guides show you the real India — hidden gems and authentic culture.' }
        ].map(f => `
          <div class="md-card-elevated" style="padding:24px;text-align:center">
            <div style="width:56px;height:56px;border-radius:var(--md-radius-lg);background:var(--md-primary-container);color:var(--md-on-primary-container);display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
              <span class="material-symbols-rounded" style="font-size:28px">${f.icon}</span>
            </div>
            <h3 style="font-size:16px;font-weight:600;margin-bottom:8px">${f.title}</h3>
            <p style="font-size:13px;color:var(--md-on-surface-variant);line-height:1.5">${f.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- CTA -->
    <div style="background:linear-gradient(135deg,var(--md-primary),#6b5ce7);border-radius:var(--md-radius-xl);padding:48px 32px;text-align:center;color:#fff;margin-bottom:24px">
      <h2 style="font-family:var(--md-font-display);font-size:28px;font-weight:700;margin-bottom:8px">Ready to Explore India?</h2>
      <p style="opacity:0.9;margin-bottom:24px;font-size:15px">Join hundreds of travelers discovering India through the eyes of locals.</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a href="#/cities" class="md-btn md-btn-lg" style="background:#fff;color:var(--md-primary)">Browse Cities</a>
        <a href="#/register-guide" class="md-btn md-btn-outlined md-btn-lg" style="border-color:rgba(255,255,255,0.4);color:#fff">Become a Guide</a>
      </div>
    </div>
  </div>`;
}

function guideCardHtml(g) {
  return `<div class="md-card-elevated guide-card" onclick="navigateTo('/guide/${g.id}')" style="cursor:pointer">
    <div class="guide-card-top">
      <div class="guide-avatar"><img src="${getAvatar(g.name)}" alt="${g.name}"></div>
      <div class="guide-info">
        <div class="guide-name">${g.name} ${g.status === 'verified' ? '<span class="material-symbols-rounded verified">verified</span>' : ''}</div>
        <div class="guide-city"><span class="material-symbols-rounded">location_on</span>${getCityName(g.city)}</div>
      </div>
    </div>
    <div class="guide-bio">${g.bio}</div>
    <div class="guide-languages">${g.languages.map(l => `<span class="guide-lang-chip">${l}</span>`).join('')}</div>
    <div class="guide-card-bottom">
      <div>
        ${getStars(g.rating)}
        <span class="rating-value">${g.rating.toFixed(1)}</span>
        <span class="rating-count">(${g.reviewCount})</span>
      </div>
      <div class="guide-price">₹${g.price}<small>/hr</small></div>
    </div>
  </div>`;
}

// --- CITIES PAGE ---
async function renderCities(app) {
  const guides = await db.guides.where('status').equals('verified').toArray();
  const counts = {};
  guides.forEach(g => counts[g.city] = (counts[g.city] || 0) + 1);
  app.innerHTML = `<div class="page-enter">
    <div class="section-header"><h2 class="section-title">All Cities</h2><p class="section-subtitle">Pick your destination and start exploring</p></div>
    <div class="city-grid">${CITIES.map(c => `
      <div class="city-card" onclick="navigateTo('/city/${c.id}')" style="height:220px">
        <div class="city-card-bg" style="background-image:url('${c.image}')"></div>
        <div class="city-card-overlay"></div>
        <div class="city-card-content">
          <div class="city-card-emoji">${c.emoji}</div>
          <div class="city-card-name">${c.name}</div>
          <div class="city-card-tagline">${c.tagline}</div>
          <div class="city-card-meta">
            <span><span class="material-symbols-rounded">person</span>${counts[c.id] || 0} Guides</span>
            <span><span class="material-symbols-rounded">place</span>${c.attractions.length} Spots</span>
            <span><span class="material-symbols-rounded">wb_sunny</span>${c.bestTime}</span>
          </div>
        </div>
      </div>`).join('')}</div>
  </div>`;
}

// --- CITY DETAIL ---
async function renderCityDetail(app, cityId) {
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return render404(app);
  const guides = await db.guides.where('city').equals(cityId).and(g => g.status === 'verified').toArray();
  logActivity('city_view', 'visitor', cityId);

  app.innerHTML = `<div class="page-enter">
    <div class="city-hero">
      <div class="city-hero-bg" style="background-image:url('${city.heroImage}')"></div>
      <div class="city-hero-overlay"></div>
      <div class="city-hero-content">
        <h1>${city.emoji} ${city.name}</h1>
        <p style="opacity:0.9;margin-bottom:8px">${city.tagline}</p>
        <div class="city-hero-meta">
          <span><span class="material-symbols-rounded">person</span>${guides.length} Guides</span>
          <span><span class="material-symbols-rounded">place</span>${city.attractions.length} Attractions</span>
          <span><span class="material-symbols-rounded">wb_sunny</span>${city.bestTime}</span>
        </div>
      </div>
    </div>

    <div class="md-tabs" id="city-tabs">
      <div class="md-tab active" onclick="showCityTab('overview',this)">Overview</div>
      <div class="md-tab" onclick="showCityTab('attractions',this)">Attractions</div>
      <div class="md-tab" onclick="showCityTab('guides',this)">Guides (${guides.length})</div>
      <div class="md-tab" onclick="showCityTab('food',this)">Food & Tips</div>
    </div>

    <div id="city-tab-content" style="margin-top:24px">
      <div id="tab-overview" class="city-tab-panel">
        <div class="city-overview">${city.description.split('\n').filter(p=>p.trim()).map(p => `<p>${p}</p>`).join('')}</div>
        <a href="#/guides" class="md-btn md-btn-filled mt-24" style="background:${city.color}"><span class="material-symbols-rounded">person_search</span>Find a Guide in ${city.name}</a>
      </div>
      <div id="tab-attractions" class="city-tab-panel" style="display:none">
        <div class="attraction-list">${city.attractions.map(a => `
          <div class="attraction-item">
            <div class="attraction-icon" style="background:${city.color}20;color:${city.color}"><span class="material-symbols-rounded">${a.icon}</span></div>
            <div><div class="attraction-name">${a.name}</div><div class="attraction-desc">${a.desc}</div></div>
          </div>`).join('')}</div>
      </div>
      <div id="tab-guides" class="city-tab-panel" style="display:none">
        ${guides.length ? `<div class="guide-grid">${guides.map(g => guideCardHtml(g)).join('')}</div>` : '<div class="empty-state"><span class="material-symbols-rounded">group_off</span><h3>No guides yet</h3><p>Be the first guide in ${city.name}!</p><a href="#/register-guide" class="md-btn md-btn-filled">Become a Guide</a></div>'}
      </div>
      <div id="tab-food" class="city-tab-panel" style="display:none">
        <h3 style="font-size:18px;font-weight:600;margin-bottom:12px">🍽️ Must-Try Food</h3>
        <div class="food-grid mb-24">${city.localFood.map(f => `<span class="chip">${f}</span>`).join('')}</div>
        <h3 style="font-size:18px;font-weight:600;margin-bottom:12px">🚗 Getting Around</h3>
        <p style="font-size:14px;color:var(--md-on-surface-variant);line-height:1.6">${city.transport}</p>
        <h3 style="font-size:18px;font-weight:600;margin:20px 0 12px">☀️ Best Time to Visit</h3>
        <p style="font-size:14px;color:var(--md-on-surface-variant)">${city.bestTime}</p>
      </div>
    </div>
  </div>`;
}

window.showCityTab = function(tab, el) {
  document.querySelectorAll('.city-tab-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('.md-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).style.display = '';
  el.classList.add('active');
};

// --- GUIDES PAGE ---
async function renderGuides(app) {
  const allGuides = await db.guides.where('status').equals('verified').toArray();
  app.innerHTML = `<div class="page-enter">
    <div class="section-header text-center">
      <h2 class="section-title">Find Your Guide</h2>
      <p class="section-subtitle">${allGuides.length} verified guides across ${CITIES.length} cities</p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;justify-content:center">
      <select class="md-select" id="filter-city" onchange="filterGuides()" style="width:auto;min-width:140px">
        <option value="">All Cities</option>${CITIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
      </select>
      <select class="md-select" id="filter-lang" onchange="filterGuides()" style="width:auto;min-width:160px">
        <option value="">All Languages</option>
        ${[...new Set(allGuides.flatMap(g => g.languages))].sort().map(l => `<option value="${l}">${l}</option>`).join('')}
      </select>
      <select class="md-select" id="filter-sort" onchange="filterGuides()" style="width:auto;min-width:150px">
        <option value="rating">Highest Rated</option><option value="price-low">Price: Low→High</option><option value="price-high">Price: High→Low</option><option value="reviews">Most Reviews</option>
      </select>
      <div style="position:relative;flex:1;min-width:180px">
        <input class="md-input" id="filter-search" placeholder="Search guides..." oninput="filterGuides()" style="padding-left:40px">
        <span class="material-symbols-rounded" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:20px;color:var(--md-outline)">search</span>
      </div>
    </div>
    <div class="guide-grid" id="guides-grid"></div>
  </div>`;
  window._allGuides = allGuides;
  filterGuides();
}

window.filterGuides = async function() {
  const city = document.getElementById('filter-city')?.value;
  const lang = document.getElementById('filter-lang')?.value;
  const sort = document.getElementById('filter-sort')?.value;
  const search = document.getElementById('filter-search')?.value?.toLowerCase();
  let filtered = [...(window._allGuides || [])];
  if (city) filtered = filtered.filter(g => g.city === city);
  if (lang) filtered = filtered.filter(g => g.languages.includes(lang));
  if (search) filtered = filtered.filter(g => g.name.toLowerCase().includes(search) || g.bio.toLowerCase().includes(search) || g.specialties.some(s => s.toLowerCase().includes(search)));
  if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'reviews') filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  const grid = document.getElementById('guides-grid');
  if (!grid) return;
  grid.innerHTML = filtered.length ? filtered.map(g => guideCardHtml(g)).join('') : '<div class="empty-state" style="grid-column:1/-1"><span class="material-symbols-rounded">search_off</span><h3>No guides found</h3><p>Try adjusting your filters</p></div>';
};

// ===== App.js Part 2: Guide Profile, Bookings, Registration, Quizzes =====

// --- GUIDE PROFILE ---
async function renderGuideProfile(app, guideId) {
  const guide = await db.guides.get(guideId);
  if (!guide || guide.status !== 'verified') return render404(app);
  const reviews = await db.reviews.where('guideId').equals(guideId).reverse().sortBy('createdAt');
  const bookings = await db.bookings.where('guideId').equals(guideId).count();
  logActivity('guide_view', 'visitor', guideId, { name: guide.name });

  app.innerHTML = `<div class="page-enter">
    <button class="md-btn md-btn-text mb-16" onclick="history.back()"><span class="material-symbols-rounded">arrow_back</span>Back</button>
    <div class="md-card-elevated" style="padding:24px;margin-bottom:24px">
      <div class="guide-profile-top">
        <div class="guide-profile-avatar"><img src="${getAvatar(guide.name)}" alt="${guide.name}"></div>
        <div class="guide-profile-info">
          <div class="guide-profile-name">${guide.name} <span class="material-symbols-rounded verified" style="font-size:22px">verified</span></div>
          <div class="guide-profile-city"><span class="material-symbols-rounded" style="font-size:16px">location_on</span> ${getCityName(guide.city)}</div>
          <div class="guide-profile-stats">
            <div class="guide-stat"><div class="guide-stat-val">${guide.rating.toFixed(1)}</div><div class="guide-stat-label">Rating</div></div>
            <div class="guide-stat"><div class="guide-stat-val">${guide.reviewCount}</div><div class="guide-stat-label">Reviews</div></div>
            <div class="guide-stat"><div class="guide-stat-val">${bookings}</div><div class="guide-stat-label">Bookings</div></div>
            <div class="guide-stat"><div class="guide-stat-val">₹${guide.price}</div><div class="guide-stat-label">Per Hour</div></div>
          </div>
        </div>
      </div>
      <p style="font-size:15px;line-height:1.7;color:var(--md-on-surface-variant);margin-bottom:16px">${guide.bio}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
        <strong style="font-size:14px;margin-right:4px">Languages:</strong>
        ${guide.languages.map(l => `<span class="chip selected">${l}</span>`).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
        <strong style="font-size:14px;margin-right:4px">Specialties:</strong>
        ${guide.specialties.map(s => `<span class="chip">${s}</span>`).join('')}
      </div>
      <button class="md-btn md-btn-filled md-btn-lg" onclick="openBookingModal('${guide.id}')">
        <span class="material-symbols-rounded">calendar_month</span>Book This Guide
      </button>
    </div>

    <!-- Reviews -->
    <div class="section">
      <div class="section-header flex justify-between items-center">
        <h2 class="section-title">Reviews (${reviews.length})</h2>
        <button class="md-btn md-btn-tonal md-btn-sm" onclick="openReviewModal('${guide.id}')"><span class="material-symbols-rounded">rate_review</span>Write Review</button>
      </div>
      ${reviews.length ? reviews.map(r => `
        <div class="md-card review-card">
          <div class="review-header">
            <div class="review-avatar">${r.visitorName.charAt(0)}</div>
            <div class="review-meta">
              <div class="review-author">${r.visitorName}</div>
              <div class="review-date">${timeAgo(r.createdAt)}</div>
            </div>
            <div>${getStars(r.rating)}</div>
          </div>
          <div class="review-text">${r.text}</div>
        </div>
      `).join('') : '<div class="empty-state"><span class="material-symbols-rounded">reviews</span><h3>No reviews yet</h3><p>Be the first to review this guide!</p></div>'}
    </div>
  </div>`;
}

// --- BOOKING MODAL ---
window.openBookingModal = function(guideId) {
  db.guides.get(guideId).then(guide => {
    if (!guide) return;
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    openModal(`Book ${guide.name}`, `
      <form id="booking-form" onsubmit="submitBooking(event,'${guideId}')">
        <div class="md-field"><label>Your Name *</label><input class="md-input" name="name" required placeholder="Full name"></div>
        <div class="md-field"><label>Email *</label><input class="md-input" name="email" type="email" required placeholder="your@email.com"></div>
        <div class="md-field"><label>Phone *</label><input class="md-input" name="phone" required placeholder="+91-XXXXXXXXXX"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="md-field"><label>Date *</label><input class="md-input" name="date" type="date" min="${minDate}" required></div>
          <div class="md-field"><label>Time *</label><input class="md-input" name="time" type="time" required value="09:00"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="md-field"><label>Duration (hours) *</label><select class="md-select" name="duration">${[2,3,4,5,6,8].map(h=>`<option value="${h}">${h} hours</option>`).join('')}</select></div>
          <div class="md-field"><label>Group Size *</label><select class="md-select" name="groupSize">${[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}">${n} ${n===1?'person':'people'}</option>`).join('')}</select></div>
        </div>
        <div class="md-field"><label>Tour Type</label><select class="md-select" name="tourType"><option>Heritage Walk</option><option>Food Tour</option><option>Cultural Experience</option><option>Photography Tour</option><option>Adventure</option><option>Spiritual Tour</option><option>Custom</option></select></div>
        <div class="md-field"><label>Notes</label><textarea class="md-textarea" name="notes" rows="3" placeholder="Any special requests..."></textarea></div>
        <div class="booking-summary">
          <div class="booking-summary-row"><span>Guide</span><strong>${guide.name}</strong></div>
          <div class="booking-summary-row"><span>Rate</span><span>₹${guide.price}/hr</span></div>
          <div class="booking-summary-row"><span>Duration</span><span id="summary-duration">2 hours</span></div>
          <div class="booking-summary-row booking-summary-total"><span>Total</span><strong id="summary-total">₹${guide.price * 2}</strong></div>
        </div>
        <button type="submit" class="md-btn md-btn-filled md-btn-lg" style="width:100%;margin-top:16px"><span class="material-symbols-rounded">check</span>Confirm Booking</button>
      </form>
      <script>
        document.querySelector('[name=duration]').addEventListener('change', function() {
          const h = parseInt(this.value);
          document.getElementById('summary-duration').textContent = h + ' hours';
          document.getElementById('summary-total').textContent = '₹' + (${guide.price} * h);
        });
      </script>
    `);
  });
};

window.submitBooking = async function(e, guideId) {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const guide = await db.guides.get(guideId);
  const booking = {
    id: 'b_' + Date.now(),
    guideId,
    visitorName: fd.get('name'),
    visitorEmail: fd.get('email'),
    visitorPhone: fd.get('phone'),
    city: guide.city,
    date: fd.get('date'),
    time: fd.get('time'),
    duration: parseInt(fd.get('duration')),
    groupSize: parseInt(fd.get('groupSize')),
    tourType: fd.get('tourType'),
    notes: fd.get('notes'),
    totalPrice: guide.price * parseInt(fd.get('duration')),
    status: 'pending',
    createdAt: Date.now()
  };
  await db.bookings.add(booking);
  await logActivity('booking_created', fd.get('name'), guideId, { date: booking.date, total: booking.totalPrice });
  closeModal();
  snackbar('Booking confirmed! Your guide will be in touch.', 'success');
  navigateTo('/bookings');
};

// --- REVIEW MODAL ---
window.openReviewModal = function(guideId) {
  openModal('Write a Review', `
    <form id="review-form" onsubmit="submitReview(event,'${guideId}')">
      <div class="md-field"><label>Your Name *</label><input class="md-input" name="name" required placeholder="Your name"></div>
      <div class="md-field">
        <label>Rating *</label>
        <div style="margin:8px 0">${getStars(0, true, 'review-stars')}</div>
      </div>
      <div class="md-field"><label>Your Review *</label><textarea class="md-textarea" name="text" required rows="4" placeholder="Share your experience..."></textarea></div>
      <button type="submit" class="md-btn md-btn-filled" style="width:100%"><span class="material-symbols-rounded">send</span>Submit Review</button>
    </form>
  `);
};

window.submitReview = async function(e, guideId) {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const stars = document.getElementById('review-stars');
  const rating = parseInt(stars?.dataset?.value || '0');
  if (!rating) { snackbar('Please select a rating', 'warning'); return; }
  const review = {
    id: 'r_' + Date.now(),
    guideId,
    bookingId: null,
    visitorName: fd.get('name'),
    rating,
    text: fd.get('text'),
    createdAt: Date.now()
  };
  await db.reviews.add(review);
  // Update guide rating
  const guide = await db.guides.get(guideId);
  if (guide) {
    const allReviews = await db.reviews.where('guideId').equals(guideId).toArray();
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await db.guides.update(guideId, { rating: Math.round(avg * 10) / 10, reviewCount: allReviews.length });
  }
  await logActivity('review_created', fd.get('name'), guideId, { rating });
  closeModal();
  snackbar('Review submitted! Thank you.', 'success');
  renderGuideProfile(document.getElementById('app'), guideId);
};

// --- BOOKINGS PAGE ---
async function renderBookings(app) {
  const bookings = await db.bookings.reverse().sortBy('createdAt');
  app.innerHTML = `<div class="page-enter">
    <div class="section-header"><h2 class="section-title">My Bookings</h2><p class="section-subtitle">${bookings.length} total bookings</p></div>
    ${bookings.length ? bookings.map(b => {
      const statusBadge = { pending: 'badge-warning', confirmed: 'badge-info', completed: 'badge-success', cancelled: 'badge-error' };
      return `<div class="md-card-elevated booking-card">
        <div class="booking-card-header">
          <div class="booking-card-guide">
            <div class="booking-card-avatar">${b.visitorName.charAt(0)}</div>
            <div><strong>${b.visitorName}</strong><br><span style="font-size:12px;color:var(--md-outline)">${b.visitorEmail || ''}</span></div>
          </div>
          <span class="badge ${statusBadge[b.status] || 'badge-info'}">${b.status}</span>
        </div>
        <div class="booking-card-details">
          <div class="booking-detail"><div class="booking-detail-label">Date</div><div class="booking-detail-value">${formatDate(b.date)}</div></div>
          <div class="booking-detail"><div class="booking-detail-label">Time</div><div class="booking-detail-value">${b.time}</div></div>
          <div class="booking-detail"><div class="booking-detail-label">Duration</div><div class="booking-detail-value">${b.duration}h</div></div>
          <div class="booking-detail"><div class="booking-detail-label">Group</div><div class="booking-detail-value">${b.groupSize} people</div></div>
          <div class="booking-detail"><div class="booking-detail-label">Tour</div><div class="booking-detail-value">${b.tourType}</div></div>
          <div class="booking-detail"><div class="booking-detail-label">Total</div><div class="booking-detail-value" style="color:var(--md-primary);font-weight:700">₹${b.totalPrice}</div></div>
        </div>
        ${b.notes ? `<div style="font-size:13px;color:var(--md-on-surface-variant);padding:8px 12px;background:var(--md-surface-container);border-radius:var(--md-radius-sm)"><strong>Notes:</strong> ${b.notes}</div>` : ''}
      </div>`;
    }).join('') : '<div class="empty-state"><span class="material-symbols-rounded">calendar_month</span><h3>No bookings yet</h3><p>Find a guide and book your first tour!</p><a href="#/guides" class="md-btn md-btn-filled">Find Guides</a></div>'}
  </div>`;
}

// --- GUIDE REGISTRATION ---
function renderGuideRegister(app) {
  app.innerHTML = `<div class="page-enter" style="max-width:640px;margin:0 auto">
    <div class="section-header text-center">
      <h2 class="section-title">Become a Guide</h2>
      <p class="section-subtitle">Share your city's stories with travelers from around the world</p>
    </div>
    <div class="md-card-elevated" style="padding:24px">
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px">
        ${['Fill Profile', 'Language Quiz', 'City Quiz', 'Review & Submit'].map((s, i) => `
          <div style="flex:1;min-width:120px;text-align:center;padding:12px;border-radius:var(--md-radius-sm);background:var(--md-surface-container);opacity:${i === 0 ? 1 : 0.5}">
            <div style="width:28px;height:28px;border-radius:50%;background:${i === 0 ? 'var(--md-primary)' : 'var(--md-outline-variant)'};color:${i === 0 ? '#fff' : 'var(--md-outline)'};display:flex;align-items:center;justify-content:center;margin:0 auto 6px;font-size:14px;font-weight:600">${i + 1}</div>
            <div style="font-size:12px;font-weight:500">${s}</div>
          </div>
        `).join('')}
      </div>
      <form id="guide-register-form" onsubmit="submitGuideRegistration(event)">
        <div class="md-field"><label>Full Name *</label><input class="md-input" name="name" required placeholder="Your full name"></div>
        <div class="md-field"><label>City *</label><select class="md-select" name="city" required><option value="">Select your city</option>${CITIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select></div>
        <div class="md-field"><label>Bio *</label><textarea class="md-textarea" name="bio" required rows="4" placeholder="Tell travelers about yourself, your experience, and what makes your tours special..." minlength="50"></textarea><div class="md-helper">Minimum 50 characters</div></div>
        <div class="md-field">
          <label>Languages * <span style="font-size:12px;color:var(--md-outline)">(select all that apply)</span></label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px" id="lang-chips">
            ${['Hindi','English','Urdu','Punjabi','Marathi','Gujarati','Tamil','Bengali','Rajasthani','Mewari','Konkani','Malayalam','Sanskrit','French','German','Spanish','Portuguese','Japanese'].map(l => `<label class="chip" onclick="this.classList.toggle('selected')"><input type="checkbox" name="languages" value="${l}" style="display:none">${l}</label>`).join('')}
          </div>
        </div>
        <div class="md-field">
          <label>Specialties *</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
            ${['History','Food','Architecture','Adventure','Photography','Culture','Spiritual','Nature','Shopping','Nightlife','Art','Crafts','Music','Bollywood','Heritage Walks'].map(s => `<label class="chip" onclick="this.classList.toggle('selected')"><input type="checkbox" name="specialties" value="${s}" style="display:none">${s}</label>`).join('')}
          </div>
        </div>
        <div class="md-field"><label>Price per Hour (₹) *</label><input class="md-input" name="price" type="number" min="200" max="5000" step="50" required placeholder="800"></div>
        <div class="md-field"><label>Phone *</label><input class="md-input" name="phone" required placeholder="+91-XXXXXXXXXX"></div>
        <div class="md-field"><label>Email *</label><input class="md-input" name="email" type="email" required placeholder="guide@email.com"></div>
        <button type="submit" class="md-btn md-btn-filled md-btn-lg" style="width:100%"><span class="material-symbols-rounded">arrow_forward</span>Continue to Language Quiz</button>
      </form>
    </div>
  </div>`;
}

window.submitGuideRegistration = function(e) {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const languages = fd.getAll('languages');
  const specialties = fd.getAll('specialties');
  if (languages.length === 0) { snackbar('Please select at least one language', 'warning'); return; }
  if (specialties.length === 0) { snackbar('Please select at least one specialty', 'warning'); return; }
  // Store temp data
  window._pendingGuide = {
    name: fd.get('name'), city: fd.get('city'), bio: fd.get('bio'),
    languages, specialties,
    price: parseInt(fd.get('price')), phone: fd.get('phone'), email: fd.get('email')
  };
  logActivity('guide_registration_started', fd.get('name'), fd.get('city'));
  navigateTo('/quiz/language');
};

// --- QUIZZES ---
function renderQuiz(app, route) {
  const type = route.split('/')[1]; // 'language' or 'city'
  if (!window._pendingGuide && type !== 'demo') { navigateTo('/register-guide'); return; }

  let questions;
  let title;
  if (type === 'language') {
    questions = [...LANGUAGE_QUIZZES.english]; // Default to English quiz
    title = 'Language Proficiency Quiz';
  } else if (type === 'city') {
    const city = window._pendingGuide?.city || 'delhi';
    questions = [...(CITY_QUIZZES[city] || CITY_QUIZZES.delhi)];
    title = `${getCityName(city)} Knowledge Quiz`;
  } else { navigateTo('/'); return; }

  window._quizState = { questions, current: 0, score: 0, answers: [], type };
  renderQuizQuestion(app, title);
}

function renderQuizQuestion(app, title) {
  const qs = window._quizState;
  if (!qs) return;
  if (qs.current >= qs.questions.length) { renderQuizResult(app); return; }

  const q = qs.questions[qs.current];
  const progress = ((qs.current) / qs.questions.length) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  app.innerHTML = `<div class="page-enter quiz-container">
    <button class="md-btn md-btn-text mb-16" onclick="history.back()"><span class="material-symbols-rounded">arrow_back</span>Back</button>
    <h2 style="font-size:20px;font-weight:600;margin-bottom:20px">${title}</h2>
    <div class="quiz-progress">
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
      <div class="quiz-progress-text">${qs.current + 1}/${qs.questions.length}</div>
    </div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <div class="quiz-option" onclick="selectQuizOption(this,${i},${q.correct})" data-idx="${i}">
          <div class="quiz-option-letter">${letters[i]}</div>
          <span>${opt}</span>
        </div>
      `).join('')}
    </div>
    <div id="quiz-next" style="margin-top:24px;text-align:center;display:none">
      <button class="md-btn md-btn-filled md-btn-lg" onclick="nextQuizQuestion()">
        <span class="material-symbols-rounded">${qs.current < qs.questions.length - 1 ? 'arrow_forward' : 'done'}</span>
        ${qs.current < qs.questions.length - 1 ? 'Next Question' : 'See Results'}
      </button>
    </div>
  </div>`;
}

window.selectQuizOption = function(el, idx, correct) {
  if (el.closest('.quiz-options').dataset.answered) return;
  el.closest('.quiz-options').dataset.answered = 'true';
  const qs = window._quizState;
  qs.answers.push(idx);
  if (idx === correct) qs.score++;
  // Show correct/wrong
  el.closest('.quiz-options').querySelectorAll('.quiz-option').forEach((opt, i) => {
    if (i === correct) opt.classList.add('correct');
    else if (i === idx && idx !== correct) opt.classList.add('wrong');
  });
  document.getElementById('quiz-next').style.display = '';
};

window.nextQuizQuestion = function() {
  window._quizState.current++;
  const title = window._quizState.type === 'language' ? 'Language Proficiency Quiz' : `${getCityName(window._pendingGuide?.city || 'delhi')} Knowledge Quiz`;
  renderQuizQuestion(document.getElementById('app'), title);
};

async function renderQuizResult(app) {
  const qs = window._quizState;
  const pct = Math.round((qs.score / qs.questions.length) * 100);
  const passed = pct >= 70;

  // Save quiz attempt
  if (window._pendingGuide) {
    await db.quizAttempts.add({
      id: 'qa_' + Date.now(),
      guideId: null,
      type: qs.type,
      score: pct,
      passed,
      answers: qs.answers,
      createdAt: Date.now()
    });
    await logActivity('quiz_completed', window._pendingGuide.name, qs.type, { score: pct, passed });
  }

  app.innerHTML = `<div class="page-enter quiz-container">
    <div class="quiz-result">
      <div class="quiz-result-icon">${passed ? '🎉' : '😔'}</div>
      <div class="quiz-result-score" style="color:${passed ? 'var(--md-success)' : 'var(--md-error)'}">${pct}%</div>
      <div class="quiz-result-text">${qs.score}/${qs.questions.length} correct — ${passed ? 'You passed!' : 'You need 70% to pass'}</div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        ${passed ? (qs.type === 'language'
          ? `<button class="md-btn md-btn-filled md-btn-lg" onclick="navigateTo('/quiz/city')"><span class="material-symbols-rounded">arrow_forward</span>Continue to City Quiz</button>`
          : `<button class="md-btn md-btn-filled md-btn-lg" onclick="finalizeGuideRegistration()"><span class="material-symbols-rounded">check</span>Submit Application</button>`
        ) : `<button class="md-btn md-btn-filled md-btn-lg" onclick="navigateTo('/quiz/${qs.type}')"><span class="material-symbols-rounded">refresh</span>Try Again</button>`}
        <button class="md-btn md-btn-outlined" onclick="navigateTo('/')">Go Home</button>
      </div>
    </div>
  </div>`;
}

window.finalizeGuideRegistration = async function() {
  const g = window._pendingGuide;
  if (!g) return;
  const guide = {
    id: 'g_' + Date.now(),
    name: g.name, city: g.city, bio: g.bio,
    languages: g.languages, specialties: g.specialties,
    price: g.price, phone: g.phone, email: g.email,
    rating: 0, reviewCount: 0,
    status: 'pending',
    avatar: null,
    createdAt: Date.now()
  };
  await db.guides.add(guide);
  await logActivity('guide_registered', g.name, g.city, { status: 'pending', guideId: guide.id });
  window._pendingGuide = null;
  snackbar('Application submitted! Admin will review your profile.', 'success');
  navigateTo('/');
};

// --- GUIDE LOGIN ---
function renderGuideLogin(app) {
  app.innerHTML = `<div class="page-enter" style="max-width:400px;margin:0 auto">
    <div class="md-card-elevated" style="padding:32px;text-align:center">
      <span class="material-symbols-rounded" style="font-size:48px;color:var(--md-primary);margin-bottom:16px">badge</span>
      <h2 style="font-size:22px;font-weight:600;margin-bottom:4px">Guide Login</h2>
      <p style="font-size:14px;color:var(--md-outline);margin-bottom:24px">Access your dashboard</p>
      <form onsubmit="guideLogin(event)">
        <div class="md-field"><label>Email</label><input class="md-input" name="email" type="email" required placeholder="guide@email.com"></div>
        <div class="md-field"><label>Name</label><input class="md-input" name="name" required placeholder="Your registered name"></div>
        <button type="submit" class="md-btn md-btn-filled md-btn-lg" style="width:100%"><span class="material-symbols-rounded">login</span>Sign In</button>
      </form>
      <p style="font-size:13px;color:var(--md-outline);margin-top:16px">Not a guide yet? <a href="#/register-guide">Register here</a></p>
    </div>
  </div>`;
}

window.guideLogin = async function(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const guides = await db.guides.toArray();
  const match = guides.find(g => g.name.toLowerCase() === fd.get('name').toLowerCase());
  if (match) {
    state.guideLoggedIn = match.id;
    localStorage.setItem('cg_guide_login', match.id);
    updateGuideMenu();
    await logActivity('guide_login', match.name, match.id);
    snackbar(`Welcome back, ${match.name}!`, 'success');
    navigateTo('/guide-dashboard');
  } else {
    snackbar('Guide not found. Check your name.', 'error');
  }
};

// --- GUIDE DASHBOARD ---
async function renderGuideDashboard(app) {
  if (!state.guideLoggedIn) { navigateTo('/guide-login'); return; }
  const guide = await db.guides.get(state.guideLoggedIn);
  if (!guide) { navigateTo('/guide-login'); return; }
  const bookings = await db.bookings.where('guideId').equals(guide.id).reverse().sortBy('createdAt');
  const reviews = await db.reviews.where('guideId').equals(guide.id).reverse().sortBy('createdAt');
  const earnings = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.totalPrice, 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  app.innerHTML = `<div class="page-enter">
    <div class="flex items-center justify-between mb-24" style="flex-wrap:wrap;gap:12px">
      <div>
        <h2 class="section-title">Welcome, ${guide.name}</h2>
        <p class="section-subtitle">${guide.status === 'verified' ? '✅ Verified Guide' : guide.status === 'pending' ? '⏳ Pending Approval' : '❌ ' + guide.status} · ${getCityName(guide.city)}</p>
      </div>
      <span class="badge ${guide.status === 'verified' ? 'badge-success' : guide.status === 'pending' ? 'badge-warning' : 'badge-error'}">${guide.status}</span>
    </div>

    <div class="dashboard-grid">
      <div class="stat-card"><div class="stat-card-icon" style="background:var(--md-primary-container);color:var(--md-primary)"><span class="material-symbols-rounded">calendar_month</span></div><div class="stat-card-value">${bookings.length}</div><div class="stat-card-label">Total Bookings</div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:var(--md-success-container);color:var(--md-success)"><span class="material-symbols-rounded">payments</span></div><div class="stat-card-value">₹${earnings.toLocaleString()}</div><div class="stat-card-label">Total Earnings</div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:#fff3cd;color:#856404"><span class="material-symbols-rounded">pending</span></div><div class="stat-card-value">${pendingBookings.length}</div><div class="stat-card-label">Pending</div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:var(--md-tertiary-container);color:var(--md-tertiary)"><span class="material-symbols-rounded">star</span></div><div class="stat-card-value">${guide.rating ? guide.rating.toFixed(1) : 'N/A'}</div><div class="stat-card-label">Rating (${guide.reviewCount})</div></div>
    </div>

    ${pendingBookings.length ? `<div class="section"><h3 style="font-size:18px;font-weight:600;margin-bottom:12px">⏳ Pending Bookings</h3>
      ${pendingBookings.map(b => `<div class="md-card booking-card">
        <div class="flex justify-between items-center mb-8"><strong>${b.visitorName}</strong><div class="flex gap-8">
          <button class="md-btn md-btn-filled md-btn-sm" onclick="updateBookingStatus('${b.id}','confirmed')"><span class="material-symbols-rounded">check</span>Accept</button>
          <button class="md-btn md-btn-outlined md-btn-sm" style="color:var(--md-error);border-color:var(--md-error)" onclick="updateBookingStatus('${b.id}','cancelled')"><span class="material-symbols-rounded">close</span>Decline</button>
        </div></div>
        <div style="font-size:13px;color:var(--md-on-surface-variant)">${formatDate(b.date)} at ${b.time} · ${b.duration}h · ${b.groupSize} people · ₹${b.totalPrice}</div>
        ${b.notes ? `<div style="font-size:12px;color:var(--md-outline);margin-top:4px">Notes: ${b.notes}</div>` : ''}
      </div>`).join('')}</div>` : ''}

    <div class="section">
      <h3 style="font-size:18px;font-weight:600;margin-bottom:12px">📅 All Bookings</h3>
      ${bookings.length ? bookings.slice(0, 10).map(b => `<div class="md-card booking-card" style="padding:12px">
        <div class="flex justify-between items-center"><div><strong>${b.visitorName}</strong><span style="font-size:12px;color:var(--md-outline);margin-left:8px">${formatDate(b.date)}</span></div><span class="badge ${b.status === 'confirmed' ? 'badge-info' : b.status === 'completed' ? 'badge-success' : b.status === 'pending' ? 'badge-warning' : 'badge-error'}">${b.status}</span></div>
      </div>`).join('') : '<p style="color:var(--md-outline)">No bookings yet</p>'}
    </div>

    <div class="section">
      <h3 style="font-size:18px;font-weight:600;margin-bottom:12px">⭐ Recent Reviews</h3>
      ${reviews.length ? reviews.slice(0, 5).map(r => `<div class="md-card review-card">
        <div class="review-header"><div class="review-avatar">${r.visitorName.charAt(0)}</div><div class="review-meta"><div class="review-author">${r.visitorName}</div><div class="review-date">${timeAgo(r.createdAt)}</div></div><div>${getStars(r.rating)}</div></div>
        <div class="review-text">${r.text}</div>
      </div>`).join('') : '<p style="color:var(--md-outline)">No reviews yet</p>'}
    </div>
  </div>`;
}

window.updateBookingStatus = async function(bookingId, status) {
  await db.bookings.update(bookingId, { status });
  await logActivity('booking_status_changed', 'guide', bookingId, { status });
  snackbar(`Booking ${status}`, status === 'confirmed' ? 'success' : 'info');
  renderGuideDashboard(document.getElementById('app'));
};

// --- 404 ---
function render404(app) {
  app.innerHTML = `<div class="page-enter empty-state" style="padding-top:80px">
    <span class="material-symbols-rounded" style="font-size:80px">explore_off</span>
    <h3 style="font-size:24px">Page Not Found</h3>
    <p>The page you're looking for doesn't exist.</p>
    <a href="#/" class="md-btn md-btn-filled mt-16">Go Home</a>
  </div>`;
}

// ===== App.js Part 3: Admin Panel =====

// --- ADMIN PAGE ---
async function renderAdmin(app) {
  if (!state.adminLoggedIn) {
    app.innerHTML = `<div class="page-enter" style="max-width:400px;margin:0 auto">
      <div class="md-card-elevated" style="padding:32px;text-align:center">
        <span class="material-symbols-rounded" style="font-size:48px;color:var(--md-primary);margin-bottom:16px">admin_panel_settings</span>
        <h2 style="font-size:22px;font-weight:600;margin-bottom:4px">Admin Panel</h2>
        <p style="font-size:14px;color:var(--md-outline);margin-bottom:24px">Restricted access — authorized personnel only</p>
        <form onsubmit="adminLogin(event)">
          <div class="md-field"><label>Email</label><input class="md-input" name="email" type="email" required placeholder="admin@cityguide.com"></div>
          <div class="md-field"><label>Password</label><input class="md-input" name="password" type="password" required placeholder="••••••••"></div>
          <button type="submit" class="md-btn md-btn-filled md-btn-lg" style="width:100%"><span class="material-symbols-rounded">lock_open</span>Login</button>
        </form>
      </div>
    </div>`;
    return;
  }
  await renderAdminDashboard(app);
}

window.adminLogin = async function(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  if (fd.get('email') === 'admin@cityguide.com' && fd.get('password') === 'admin123') {
    state.adminLoggedIn = true;
    await logActivity('admin_login', 'admin', 'admin_panel');
    snackbar('Welcome, Admin!', 'success');
    renderAdmin(document.getElementById('app'));
  } else {
    snackbar('Invalid credentials', 'error');
    await logActivity('admin_login_failed', 'unknown', 'admin_panel');
  }
};

async function renderAdminDashboard(app) {
  const tab = state.adminTab;
  app.innerHTML = `<div class="page-enter">
    <div class="flex items-center justify-between mb-24" style="flex-wrap:wrap;gap:12px">
      <div><h2 class="section-title">Admin Dashboard</h2><p class="section-subtitle">Manage your platform</p></div>
      <button class="md-btn md-btn-outlined md-btn-sm" onclick="state.adminLoggedIn=false;navigateTo('/')"><span class="material-symbols-rounded">logout</span>Logout</button>
    </div>
    <div class="admin-layout">
      <div class="admin-sidebar">
        ${[
          { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
          { id: 'guides', icon: 'group', label: 'Manage Guides' },
          { id: 'bookings', icon: 'calendar_month', label: 'Bookings' },
          { id: 'reviews', icon: 'reviews', label: 'Reviews' },
          { id: 'activity', icon: 'history', label: 'Activity Log' },
          { id: 'sessions', icon: 'devices', label: 'Sessions' }
        ].map(item => `<div class="admin-sidebar-item ${tab === item.id ? 'active' : ''}" onclick="switchAdminTab('${item.id}')"><span class="material-symbols-rounded">${item.icon}</span>${item.label}</div>`).join('')}
      </div>
      <div class="admin-content" id="admin-content"></div>
    </div>
  </div>`;
  await loadAdminTab(tab);
}

window.switchAdminTab = async function(tab) {
  state.adminTab = tab;
  document.querySelectorAll('.admin-sidebar-item').forEach(el => el.classList.toggle('active', el.textContent.trim() === { dashboard:'Dashboard', guides:'Manage Guides', bookings:'Bookings', reviews:'Reviews', activity:'Activity Log', sessions:'Sessions' }[tab]));
  await logActivity('admin_tab_switch', 'admin', tab);
  await loadAdminTab(tab);
};

async function loadAdminTab(tab) {
  const el = document.getElementById('admin-content');
  if (!el) return;
  if (tab === 'dashboard') await adminDashboardTab(el);
  else if (tab === 'guides') await adminGuidesTab(el);
  else if (tab === 'bookings') await adminBookingsTab(el);
  else if (tab === 'reviews') await adminReviewsTab(el);
  else if (tab === 'activity') await adminActivityTab(el);
  else if (tab === 'sessions') await adminSessionsTab(el);
}

// --- Admin: Dashboard ---
async function adminDashboardTab(el) {
  const totalGuides = await db.guides.count();
  const verifiedGuides = await db.guides.where('status').equals('verified').count();
  const pendingGuides = await db.guides.where('status').equals('pending').count();
  const totalBookings = await db.bookings.count();
  const totalReviews = await db.reviews.count();
  const allBookings = await db.bookings.toArray();
  const revenue = allBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const completedBookings = allBookings.filter(b => b.status === 'completed').length;
  const activities = await db.activityLog.orderBy('timestamp').reverse().limit(10).toArray();

  // Chart data - bookings per city
  const cityBookings = {};
  CITIES.forEach(c => cityBookings[c.name] = 0);
  allBookings.forEach(b => { const cn = getCityName(b.city); if (cityBookings[cn] !== undefined) cityBookings[cn]++; });

  el.innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-card-icon" style="background:var(--md-primary-container);color:var(--md-primary)"><span class="material-symbols-rounded">group</span></div><div class="stat-card-value">${totalGuides}</div><div class="stat-card-label">Total Guides</div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:var(--md-success-container);color:var(--md-success)"><span class="material-symbols-rounded">verified</span></div><div class="stat-card-value">${verifiedGuides}</div><div class="stat-card-label">Verified</div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:#fff3cd;color:#856404"><span class="material-symbols-rounded">pending</span></div><div class="stat-card-value">${pendingGuides}</div><div class="stat-card-label">Pending Approval</div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:var(--md-secondary-container);color:var(--md-secondary)"><span class="material-symbols-rounded">calendar_month</span></div><div class="stat-card-value">${totalBookings}</div><div class="stat-card-label">Bookings</div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:var(--md-tertiary-container);color:var(--md-tertiary)"><span class="material-symbols-rounded">star</span></div><div class="stat-card-value">${totalReviews}</div><div class="stat-card-label">Reviews</div></div>
      <div class="stat-card"><div class="stat-card-icon" style="background:var(--md-error-container);color:var(--md-error)"><span class="material-symbols-rounded">payments</span></div><div class="stat-card-value">₹${revenue.toLocaleString()}</div><div class="stat-card-label">Revenue</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
      <div class="md-card-elevated" style="padding:20px"><h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Bookings by City</h3><div class="chart-container"><canvas id="chart-city"></canvas></div></div>
      <div class="md-card-elevated" style="padding:20px"><h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Booking Status</h3><div class="chart-container"><canvas id="chart-status"></canvas></div></div>
    </div>

    <div class="md-card-elevated" style="padding:20px">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:12px">Recent Activity</h3>
      ${activities.map(a => `<div class="activity-item">
        <div class="activity-icon"><span class="material-symbols-rounded">${getActivityIcon(a.type)}</span></div>
        <div class="activity-text"><strong>${a.actor}</strong> ${getActivityText(a)}</div>
        <div class="activity-time">${timeAgo(a.timestamp)}</div>
      </div>`).join('')}
    </div>
  `;

  // Render charts
  setTimeout(() => {
    const isDark = state.theme === 'dark';
    const textColor = isDark ? '#e2e2e9' : '#191c20';
    const gridColor = isDark ? '#33353a' : '#e0e2ee';

    new Chart(document.getElementById('chart-city'), {
      type: 'bar',
      data: {
        labels: Object.keys(cityBookings),
        datasets: [{ label: 'Bookings', data: Object.values(cityBookings),
          backgroundColor: ['#d32f2f','#1565c0','#e65100','#6a1b9a','#f57f17','#00897b'],
          borderRadius: 8, borderSkipped: false }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { color: textColor, stepSize: 1 }, grid: { color: gridColor } }, x: { ticks: { color: textColor }, grid: { display: false } } } }
    });

    const statusCounts = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    allBookings.forEach(b => { if (statusCounts[b.status] !== undefined) statusCounts[b.status]++; });
    new Chart(document.getElementById('chart-status'), {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        datasets: [{ data: Object.values(statusCounts),
          backgroundColor: ['#ffc107','#1b6ef3','#4caf50','#f44336'],
          borderWidth: 0, borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '65%',
        plugins: { legend: { position: 'bottom', labels: { color: textColor, padding: 16, usePointStyle: true, pointStyleWidth: 10 } } } }
    });
  }, 100);
}

function getActivityIcon(type) {
  const icons = { page_view:'visibility', booking_created:'calendar_month', review_created:'star', guide_registered:'person_add',
    guide_login:'login', admin_login:'admin_panel_settings', admin_login_failed:'block', booking_status_changed:'update',
    guide_approved:'check_circle', guide_rejected:'cancel', guide_suspended:'block', review_deleted:'delete',
    quiz_completed:'quiz', app_start:'power_settings_new', city_view:'location_city', guide_view:'person',
    modal_open:'open_in_new', admin_tab_switch:'tab', system:'settings', guide_registration_started:'edit' };
  return icons[type] || 'info';
}

function getActivityText(a) {
  const texts = {
    page_view: `viewed <em>${a.target}</em>`, booking_created: `booked guide <em>${a.target}</em>`,
    review_created: `reviewed guide <em>${a.target}</em>`, guide_registered: `registered as guide in <em>${getCityName(a.target)}</em>`,
    guide_login: `logged into dashboard`, admin_login: `logged into admin panel`,
    admin_login_failed: `failed admin login attempt`, booking_status_changed: `changed booking status`,
    guide_approved: `approved guide <em>${a.target}</em>`, guide_rejected: `rejected guide <em>${a.target}</em>`,
    guide_suspended: `suspended guide <em>${a.target}</em>`, review_deleted: `deleted a review`,
    quiz_completed: `completed ${a.target} quiz (${a.details?.score}%)`, app_start: `opened the app`,
    city_view: `viewed ${getCityName(a.target)}`, guide_view: `viewed guide profile`
  };
  return texts[a.type] || `performed ${a.type} on ${a.target}`;
}

// --- Admin: Guides ---
async function adminGuidesTab(el) {
  const guides = await db.guides.toArray();
  const pending = guides.filter(g => g.status === 'pending');
  const verified = guides.filter(g => g.status === 'verified');
  const other = guides.filter(g => !['pending', 'verified'].includes(g.status));

  el.innerHTML = `
    ${pending.length ? `<div class="mb-24"><h3 style="font-size:18px;font-weight:600;margin-bottom:12px">⏳ Pending Approval (${pending.length})</h3>
      ${pending.map(g => `<div class="md-card-elevated" style="padding:16px;margin-bottom:12px">
        <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:12px">
          <div class="flex items-center gap-12">
            <div class="guide-avatar" style="width:44px;height:44px"><img src="${getAvatar(g.name)}" alt="${g.name}"></div>
            <div>
              <div style="font-weight:600">${g.name}</div>
              <div style="font-size:13px;color:var(--md-outline)">${getCityName(g.city)} · ${g.languages.join(', ')} · ₹${g.price}/hr</div>
              <div style="font-size:12px;color:var(--md-outline);margin-top:2px">${g.bio.substring(0, 100)}...</div>
            </div>
          </div>
          <div class="flex gap-8">
            <button class="md-btn md-btn-filled md-btn-sm" onclick="adminApproveGuide('${g.id}')"><span class="material-symbols-rounded">check</span>Approve</button>
            <button class="md-btn md-btn-outlined md-btn-sm" style="color:var(--md-error);border-color:var(--md-error)" onclick="adminRejectGuide('${g.id}')"><span class="material-symbols-rounded">close</span>Reject</button>
          </div>
        </div>
      </div>`).join('')}</div>` : ''}

    <h3 style="font-size:18px;font-weight:600;margin-bottom:12px">✅ Verified Guides (${verified.length})</h3>
    <div style="overflow-x:auto">
      <table class="md-table">
        <thead><tr><th>Guide</th><th>City</th><th>Rating</th><th>Reviews</th><th>Price</th><th>Actions</th></tr></thead>
        <tbody>${verified.map(g => `<tr>
          <td><div class="flex items-center gap-8"><div class="guide-avatar" style="width:32px;height:32px;font-size:14px"><img src="${getAvatar(g.name)}" alt=""></div><strong>${g.name}</strong></div></td>
          <td>${getCityName(g.city)}</td>
          <td>${g.rating.toFixed(1)} ⭐</td>
          <td>${g.reviewCount}</td>
          <td>₹${g.price}</td>
          <td><button class="md-btn md-btn-outlined md-btn-sm" style="color:var(--md-error);border-color:var(--md-error)" onclick="adminSuspendGuide('${g.id}')">Suspend</button></td>
        </tr>`).join('')}</tbody>
      </table>
    </div>

    ${other.length ? `<h3 style="font-size:18px;font-weight:600;margin:24px 0 12px">Other (${other.length})</h3>
      ${other.map(g => `<div class="md-card" style="padding:12px;margin-bottom:8px"><div class="flex justify-between items-center"><span>${g.name} — ${getCityName(g.city)}</span><span class="badge badge-error">${g.status}</span></div></div>`).join('')}` : ''}
  `;
}

window.adminApproveGuide = async function(id) {
  await db.guides.update(id, { status: 'verified' });
  const g = await db.guides.get(id);
  await logActivity('guide_approved', 'admin', id, { name: g?.name });
  snackbar(`${g?.name || 'Guide'} approved!`, 'success');
  loadAdminTab('guides');
};

window.adminRejectGuide = async function(id) {
  await db.guides.update(id, { status: 'rejected' });
  const g = await db.guides.get(id);
  await logActivity('guide_rejected', 'admin', id, { name: g?.name });
  snackbar(`${g?.name || 'Guide'} rejected`, 'info');
  loadAdminTab('guides');
};

window.adminSuspendGuide = async function(id) {
  if (!confirm('Suspend this guide? They will no longer appear to visitors.')) return;
  await db.guides.update(id, { status: 'suspended' });
  const g = await db.guides.get(id);
  await logActivity('guide_suspended', 'admin', id, { name: g?.name });
  snackbar(`${g?.name || 'Guide'} suspended`, 'warning');
  loadAdminTab('guides');
};

// --- Admin: Bookings ---
async function adminBookingsTab(el) {
  const bookings = await db.bookings.reverse().sortBy('createdAt');
  el.innerHTML = `<h3 style="font-size:18px;font-weight:600;margin-bottom:16px">All Bookings (${bookings.length})</h3>
    <div style="overflow-x:auto"><table class="md-table">
      <thead><tr><th>Visitor</th><th>Guide</th><th>City</th><th>Date</th><th>Duration</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>${await Promise.all(bookings.map(async b => {
        const g = await db.guides.get(b.guideId);
        return `<tr><td>${b.visitorName}</td><td>${g?.name || 'Unknown'}</td><td>${getCityName(b.city)}</td><td>${formatDate(b.date)}</td><td>${b.duration}h</td><td>₹${b.totalPrice}</td><td><span class="badge ${b.status === 'confirmed' ? 'badge-info' : b.status === 'completed' ? 'badge-success' : b.status === 'pending' ? 'badge-warning' : 'badge-error'}">${b.status}</span></td></tr>`;
      })).then(rows => rows.join(''))}</tbody>
    </table></div>`;
}

// --- Admin: Reviews ---
async function adminReviewsTab(el) {
  const reviews = await db.reviews.reverse().sortBy('createdAt');
  el.innerHTML = `<h3 style="font-size:18px;font-weight:600;margin-bottom:16px">All Reviews (${reviews.length})</h3>
    ${reviews.map(r => `<div class="md-card review-card">
      <div class="review-header">
        <div class="review-avatar">${r.visitorName.charAt(0)}</div>
        <div class="review-meta"><div class="review-author">${r.visitorName}</div><div class="review-date">${timeAgo(r.createdAt)} · Guide: ${r.guideId}</div></div>
        <div class="flex items-center gap-8">${getStars(r.rating)}<button class="md-btn-icon" onclick="adminDeleteReview('${r.id}')" title="Delete"><span class="material-symbols-rounded" style="color:var(--md-error)">delete</span></button></div>
      </div>
      <div class="review-text">${r.text}</div>
    </div>`).join('')}`;
}

window.adminDeleteReview = async function(id) {
  if (!confirm('Delete this review?')) return;
  await db.reviews.delete(id);
  await logActivity('review_deleted', 'admin', id);
  snackbar('Review deleted', 'info');
  loadAdminTab('reviews');
};

// --- Admin: Activity Log ---
async function adminActivityTab(el) {
  const activities = await db.activityLog.orderBy('timestamp').reverse().limit(100).toArray();
  el.innerHTML = `<div class="flex justify-between items-center mb-16">
    <h3 style="font-size:18px;font-weight:600">Activity Log (${activities.length} recent)</h3>
    <button class="md-btn md-btn-outlined md-btn-sm" onclick="exportActivityLog()"><span class="material-symbols-rounded">download</span>Export</button>
  </div>
  <div class="md-card-elevated" style="padding:16px">
    ${activities.map(a => `<div class="activity-item">
      <div class="activity-icon"><span class="material-symbols-rounded">${getActivityIcon(a.type)}</span></div>
      <div class="activity-text"><strong>${a.actor}</strong> ${getActivityText(a)}${a.page ? ` <span style="color:var(--md-outline);font-size:11px">[${a.page}]</span>` : ''}</div>
      <div class="activity-time">${timeAgo(a.timestamp)}</div>
    </div>`).join('')}
  </div>`;
}

window.exportActivityLog = async function() {
  const all = await db.activityLog.toArray();
  const csv = 'timestamp,type,actor,target,page,details\n' + all.map(a =>
    `${new Date(a.timestamp).toISOString()},${a.type},${a.actor},${a.target},${a.page || ''},${JSON.stringify(a.details || {}).replace(/,/g, ';')}`
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'activity_log.csv'; a.click();
  URL.revokeObjectURL(url);
  snackbar('Activity log exported!', 'success');
};

// --- Admin: Sessions ---
async function adminSessionsTab(el) {
  const sessions = await db.sessions.orderBy('startedAt').reverse().limit(50).toArray();
  el.innerHTML = `<h3 style="font-size:18px;font-weight:600;margin-bottom:16px">User Sessions (${sessions.length} recent)</h3>
    <div style="overflow-x:auto"><table class="md-table">
      <thead><tr><th>Session ID</th><th>Type</th><th>Started</th><th>Duration</th><th>Device</th></tr></thead>
      <tbody>${sessions.map(s => {
        const dur = s.endedAt ? Math.round((s.endedAt - s.startedAt) / 1000 / 60) + 'min' : 'Active';
        const screen = s.data?.screen || 'Unknown';
        return `<tr><td style="font-size:12px;font-family:monospace">${s.sessionId.substring(0, 20)}...</td><td>${s.type}</td><td>${timeAgo(s.startedAt)}</td><td>${dur}</td><td>${screen}</td></tr>`;
      }).join('')}</tbody>
    </table></div>`;
}

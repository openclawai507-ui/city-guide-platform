// ===== App State =====
const state = {
  currentPage: 'home',
  adminLoggedIn: false,
  adminTab: 'dashboard',
  guideLoggedIn: null, // guide id if logged in
  bookings: JSON.parse(localStorage.getItem('cg_bookings') || 'null') || [...SAMPLE_BOOKINGS],
  reviews: JSON.parse(localStorage.getItem('cg_reviews') || 'null') || [...SAMPLE_REVIEWS],
  guides: JSON.parse(localStorage.getItem('cg_guides') || 'null') || [...GUIDES],
  theme: localStorage.getItem('cg_theme') || 'light'
};

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  setupHeader();
  setupThemeToggle();
  setupMobileMenu();
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
});

// ===== Theme =====
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  state.theme = theme;
  localStorage.setItem('cg_theme', theme);
  const icon = document.querySelector('#theme-toggle .material-icons-round');
  if (icon) icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
}
function setupThemeToggle() {
  document.getElementById('theme-toggle').addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  });
}

// ===== Header =====
function setupHeader() {
  window.addEventListener('scroll', () => {
    document.getElementById('header').classList.toggle('scrolled', window.scrollY > 10);
  });
}
function setupMobileMenu() {
  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.toggle('open');
  });
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobile-nav').classList.remove('open');
    });
  });
}

// ===== Router =====
function navigateTo(path) {
  window.location.hash = path;
}
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);
  document.getElementById('mobile-nav').classList.remove('open');

  // Update nav active state
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const page = link.dataset.page;
    link.classList.toggle('active',
      (page === 'home' && hash === '/') ||
      (page && hash.startsWith('/' + page))
    );
  });

  const app = document.getElementById('app');
  window.scrollTo(0, 0);

  if (hash === '/') renderHome(app);
  else if (hash === '/cities') renderCities(app);
  else if (parts[0] === 'city' && parts[1]) renderCityDetail(app, parts[1]);
  else if (hash === '/guides') renderGuides(app);
  else if (parts[0] === 'guide' && parts[1]) renderGuideProfile(app, parts[1]);
  else if (parts[0] === 'book' && parts[1]) renderBookingForm(app, parts[1]);
  else if (hash === '/bookings') renderBookings(app);
  else if (hash === '/register-guide') renderGuideRegister(app);
  else if (parts[0] === 'quiz' && parts[1]) renderQuiz(app, parts[1], parts[2]);
  else if (hash === '/guide-dashboard') renderGuideDashboard(app);
  else if (hash === '/admin-panel-x7k9') renderAdmin(app);
  else render404(app);
}

// ===== Toast =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="material-icons-round">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut .3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ===== Modal =====
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ===== Stars Component =====
function renderStars(rating, count = null) {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<span class="material-icons-round">star</span>';
    else if (i - 0.5 <= rating) html += '<span class="material-icons-round">star_half</span>';
    else html += '<span class="material-icons-round empty">star</span>';
  }
  if (count !== null) html += `<span class="stars-count">(${count})</span>`;
  html += '</div>';
  return html;
}
function renderInteractiveStars(containerId, initialRating = 0) {
  return `<div class="stars stars-interactive" id="${containerId}" data-rating="${initialRating}">
    ${[1,2,3,4,5].map(i => `<span class="material-icons-round" data-value="${i}" onclick="setStarRating('${containerId}', ${i})">${i <= initialRating ? 'star' : 'star'}</span>`).join('')}
  </div>`;
}
function setStarRating(containerId, value) {
  const container = document.getElementById(containerId);
  container.dataset.rating = value;
  container.querySelectorAll('.material-icons-round').forEach(star => {
    const v = parseInt(star.dataset.value);
    star.style.color = v <= value ? 'var(--secondary)' : 'var(--outline)';
  });
}

// ===== Save State =====
function saveState() {
  localStorage.setItem('cg_bookings', JSON.stringify(state.bookings));
  localStorage.setItem('cg_reviews', JSON.stringify(state.reviews));
  localStorage.setItem('cg_guides', JSON.stringify(state.guides));
}

// ===== HOME PAGE =====
function renderHome(app) {
  const topGuides = state.guides.filter(g => g.status === 'approved').sort((a,b) => b.rating - a.rating).slice(0, 4);
  app.innerHTML = `
    <div class="page-enter">
      <section class="hero">
        <div class="hero-content">
          <h1>Discover India with Local Experts</h1>
          <p>Find verified local guides who speak your language and know every hidden gem. Book personalized tours across India's most beautiful cities.</p>
          <div class="hero-search">
            <input type="text" placeholder="Search cities, guides, or experiences..." id="hero-search-input" onkeydown="if(event.key==='Enter')searchFromHero()">
            <button class="btn btn-primary" onclick="searchFromHero()">
              <span class="material-icons-round">search</span> Search
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>Explore India's Iconic Cities</h2>
            <p>6 handpicked destinations, each with its own magic</p>
          </div>
          <div class="cities-grid">
            ${CITIES.map(city => `
              <div class="card city-card" onclick="navigateTo('/city/${city.id}')">
                <div class="card-img" style="background:linear-gradient(135deg, ${city.color}40, ${city.color}20); display:flex; align-items:center; justify-content:center;">
                  <span style="font-size:64px">${city.emoji}</span>
                </div>
                <div class="city-card-overlay">
                  <h3>${city.name}</h3>
                  <p>${city.tagline} · ${city.guidesCount} guides</p>
                </div>
                <span class="city-badge">${city.emoji} ${city.guidesCount} Guides</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="section" style="background: var(--surface);">
        <div class="container">
          <div class="section-header">
            <h2>Top Rated Guides</h2>
            <p>Handpicked guides loved by travelers worldwide</p>
          </div>
          <div class="guides-grid">
            ${topGuides.map(guide => renderGuideCard(guide)).join('')}
          </div>
          <div class="text-center mt-4">
            <a href="#/guides" class="btn btn-outline btn-lg">View All Guides <span class="material-icons-round">arrow_forward</span></a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>Why CityGuide?</h2>
            <p>The smarter way to explore India</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <span class="material-icons-round">verified_user</span>
              <h3>Verified Guides</h3>
              <p>Every guide passes language and city knowledge tests before being approved. You're in safe, knowledgeable hands.</p>
            </div>
            <div class="feature-card">
              <span class="material-icons-round">translate</span>
              <h3>Speak Your Language</h3>
              <p>Filter guides by language. From Hindi and English to regional languages — find someone who speaks yours.</p>
            </div>
            <div class="feature-card">
              <span class="material-icons-round">calendar_month</span>
              <h3>Easy Booking</h3>
              <p>Book your perfect tour in under 2 minutes. Choose your date, time, and group size — done.</p>
            </div>
            <div class="feature-card">
              <span class="material-icons-round">star</span>
              <h3>Real Reviews</h3>
              <p>Read honest reviews from real travelers. Our rating system helps you find the best guide for your style.</p>
            </div>
            <div class="feature-card">
              <span class="material-icons-round">payments</span>
              <h3>Transparent Pricing</h3>
              <p>No hidden fees. See the exact price per hour upfront. Pay only for the time you need.</p>
            </div>
            <div class="feature-card">
              <span class="material-icons-round">diversity_3</span>
              <h3>Local Experiences</h3>
              <p>Go beyond tourist traps. Our guides show you the real India — hidden gems, local food, authentic culture.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="background: linear-gradient(135deg, #1a73e8 0%, #6c5ce7 100%); color: #fff; text-align: center;">
        <div class="container">
          <h2 style="font-family:'Playfair Display',serif; font-size:2rem; margin-bottom:12px;">Ready to Explore India?</h2>
          <p style="opacity:.9; margin-bottom:24px; font-size:1.05rem;">Join hundreds of travelers discovering India through the eyes of locals.</p>
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <a href="#/cities" class="btn" style="background:#fff; color:var(--primary);">Browse Cities</a>
            <a href="#/register-guide" class="btn" style="border:2px solid #fff; color:#fff;">Become a Guide</a>
          </div>
        </div>
      </section>
    </div>
  `;
}

function searchFromHero() {
  const q = document.getElementById('hero-search-input').value.trim().toLowerCase();
  if (!q) return;
  const city = CITIES.find(c => c.name.toLowerCase().includes(q) || c.id.includes(q));
  if (city) { navigateTo('/city/' + city.id); return; }
  navigateTo('/guides');
}

// ===== CITIES PAGE =====
function renderCities(app) {
  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>All Cities</h2>
            <p>Choose your next adventure</p>
          </div>
          <div class="cities-grid">
            ${CITIES.map(city => `
              <div class="card city-card" onclick="navigateTo('/city/${city.id}')">
                <div class="card-img" style="background:linear-gradient(135deg, ${city.color}40, ${city.color}20); display:flex; align-items:center; justify-content:center;">
                  <span style="font-size:64px">${city.emoji}</span>
                </div>
                <div class="city-card-overlay">
                  <h3>${city.name}</h3>
                  <p>${city.tagline} · ${city.guidesCount} guides</p>
                </div>
                <span class="city-badge">${city.emoji} ${city.guidesCount} Guides</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    </div>
  `;
}

// ===== CITY DETAIL =====
function renderCityDetail(app, cityId) {
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return render404(app);
  const cityGuides = state.guides.filter(g => g.city === cityId && g.status === 'approved');

  app.innerHTML = `
    <div class="page-enter">
      <div class="city-hero">
        <div class="city-hero-bg" style="background:linear-gradient(135deg, ${city.color}90, ${city.color}40); display:flex; align-items:center; justify-content:center;">
          <span style="font-size:120px; opacity:.3">${city.emoji}</span>
        </div>
        <div class="city-hero-overlay"></div>
        <div class="city-hero-content container">
          <h1>${city.emoji} ${city.name}</h1>
          <p>${city.tagline}</p>
          <div class="city-stats">
            <div class="city-stat"><span class="material-icons-round">person</span> ${cityGuides.length} Guides</div>
            <div class="city-stat"><span class="material-icons-round">place</span> ${city.attractions.length} Attractions</div>
            <div class="city-stat"><span class="material-icons-round">wb_sunny</span> ${city.bestTime.split('(')[0].trim()}</div>
          </div>
        </div>
      </div>

      <section class="section">
        <div class="container">
          <div class="tabs" id="city-tabs">
            <div class="tab active" onclick="switchTab('overview')">Overview</div>
            <div class="tab" onclick="switchTab('attractions')">Attractions</div>
            <div class="tab" onclick="switchTab('guides')">Guides (${cityGuides.length})</div>
            <div class="tab" onclick="switchTab('food')">Food & Tips</div>
          </div>

          <div class="tab-content active" id="tab-overview">
            <div style="max-width:800px;">
              ${city.description.split('\n\n').map(p => `<p style="margin-bottom:16px; font-size:1.05rem; line-height:1.8; color:var(--on-surface-secondary);">${p}</p>`).join('')}
            </div>
            <div class="mt-4">
              <a href="#/guides" class="btn btn-primary btn-lg">Find a Guide in ${city.name}</a>
            </div>
          </div>

          <div class="tab-content" id="tab-attractions">
            <h3 style="margin-bottom:20px;">Top Attractions in ${city.name}</h3>
            ${city.attractions.map(a => `
              <div class="attraction-card">
                <span class="material-icons-round">${a.icon}</span>
                <div class="attraction-info">
                  <h4>${a.name}</h4>
                  <p>${a.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="tab-content" id="tab-guides">
            <h3 style="margin-bottom:20px;">Verified Guides in ${city.name}</h3>
            ${cityGuides.length ? `
              <div class="guides-grid">
                ${cityGuides.map(g => renderGuideCard(g)).join('')}
              </div>
            ` : '<div class="empty-state"><span class="material-icons-round">person_off</span><h3>No guides yet</h3><p>Be the first guide in ${city.name}!</p><a href="#/register-guide" class="btn btn-primary">Register as Guide</a></div>'}
          </div>

          <div class="tab-content" id="tab-food">
            <div style="max-width:700px;">
              <h3 style="margin-bottom:16px;">🍽️ Must-Try Food</h3>
              <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:32px;">
                ${city.localFood.map(f => `<span class="tag tag-primary">${f}</span>`).join('')}
              </div>
              <h3 style="margin-bottom:16px;">📅 Best Time to Visit</h3>
              <p style="margin-bottom:32px; color:var(--on-surface-secondary);">${city.bestTime}</p>
              <h3 style="margin-bottom:16px;">🚗 Getting Around</h3>
              <p style="color:var(--on-surface-secondary);">${city.transport}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}

// ===== GUIDE CARD =====
function renderGuideCard(guide) {
  const city = CITIES.find(c => c.id === guide.city);
  return `
    <div class="card guide-card" onclick="navigateTo('/guide/${guide.id}')">
      <div class="card-body">
        <div class="guide-header">
          <img src="${guide.avatar}" alt="${guide.name}" class="guide-avatar" loading="lazy">
          <div class="guide-info">
            <h4>${guide.name} ${guide.verified ? '<span class="material-icons-round" style="font-size:16px; color:var(--primary); vertical-align:middle;">verified</span>' : ''}</h4>
            <p>${city ? city.emoji + ' ' + city.name : guide.city}</p>
          </div>
        </div>
        <p style="font-size:.8125rem; color:var(--on-surface-secondary); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${guide.bio}</p>
        <div class="guide-meta">
          ${guide.languages.slice(0, 3).map(l => `<span class="tag">${l}</span>`).join('')}
          ${guide.languages.length > 3 ? `<span class="tag">+${guide.languages.length - 3}</span>` : ''}
        </div>
        <div class="guide-footer">
          <div>${renderStars(guide.rating, guide.totalReviews)}</div>
          <div class="guide-price">₹${guide.pricePerHour}<span>/hr</span></div>
        </div>
      </div>
    </div>
  `;
}

// ===== GUIDES PAGE =====
function renderGuides(app) {
  const allGuides = state.guides.filter(g => g.status === 'approved');
  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>Find Your Guide</h2>
            <p>${allGuides.length} verified guides across ${CITIES.length} cities</p>
          </div>
          <div class="filter-bar">
            <select class="form-select" id="filter-city" onchange="filterGuides()">
              <option value="">All Cities</option>
              ${CITIES.map(c => `<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('')}
            </select>
            <select class="form-select" id="filter-language" onchange="filterGuides()">
              <option value="">All Languages</option>
              ${[...new Set(allGuides.flatMap(g => g.languages))].sort().map(l => `<option value="${l}">${l}</option>`).join('')}
            </select>
            <select class="form-select" id="filter-sort" onchange="filterGuides()">
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <input type="text" class="form-input" placeholder="Search guides..." id="filter-search" oninput="filterGuides()" style="min-width:200px;">
          </div>
          <div class="guides-grid" id="guides-list">
            ${allGuides.map(g => renderGuideCard(g)).join('')}
          </div>
        </div>
      </section>
    </div>
  `;
}

function filterGuides() {
  const city = document.getElementById('filter-city').value;
  const language = document.getElementById('filter-language').value;
  const sort = document.getElementById('filter-sort').value;
  const search = document.getElementById('filter-search').value.toLowerCase();

  let filtered = state.guides.filter(g => g.status === 'approved');
  if (city) filtered = filtered.filter(g => g.city === city);
  if (language) filtered = filtered.filter(g => g.languages.includes(language));
  if (search) filtered = filtered.filter(g =>
    g.name.toLowerCase().includes(search) ||
    g.bio.toLowerCase().includes(search) ||
    g.specialties.some(s => s.toLowerCase().includes(search))
  );

  if (sort === 'rating') filtered.sort((a,b) => b.rating - a.rating);
  else if (sort === 'reviews') filtered.sort((a,b) => b.totalReviews - a.totalReviews);
  else if (sort === 'price-low') filtered.sort((a,b) => a.pricePerHour - b.pricePerHour);
  else if (sort === 'price-high') filtered.sort((a,b) => b.pricePerHour - a.pricePerHour);

  document.getElementById('guides-list').innerHTML = filtered.length
    ? filtered.map(g => renderGuideCard(g)).join('')
    : '<div class="empty-state"><span class="material-icons-round">search_off</span><h3>No guides found</h3><p>Try adjusting your filters</p></div>';
}

// ===== GUIDE PROFILE =====
function renderGuideProfile(app, guideId) {
  const guide = state.guides.find(g => g.id === guideId);
  if (!guide) return render404(app);
  const city = CITIES.find(c => c.id === guide.city);
  const guideReviews = state.reviews.filter(r => r.guideId === guideId);

  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <section class="section">
        <div class="container" style="max-width:800px;">
          <div style="display:flex; gap:24px; align-items:flex-start; flex-wrap:wrap;">
            <img src="${guide.avatar}" alt="${guide.name}" style="width:120px; height:120px; border-radius:var(--radius-xl); flex-shrink:0;">
            <div style="flex:1; min-width:250px;">
              <h1 style="font-size:1.75rem; margin-bottom:4px;">${guide.name}
                ${guide.verified ? '<span class="badge badge-verified"><span class="material-icons-round" style="font-size:14px;">verified</span> Verified</span>' : '<span class="badge badge-pending">Pending</span>'}
              </h1>
              <p style="color:var(--on-surface-secondary); margin-bottom:8px;">${city ? city.emoji + ' ' + city.name : guide.city}</p>
              <div style="margin-bottom:12px;">${renderStars(guide.rating, guide.totalReviews)}</div>
              <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
                ${guide.specialties.map(s => `<span class="tag tag-primary">${s}</span>`).join('')}
              </div>
              <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <a href="#/book/${guide.id}" class="btn btn-primary btn-lg">
                  <span class="material-icons-round">calendar_month</span> Book Now — ₹${guide.pricePerHour}/hr
                </a>
              </div>
            </div>
          </div>

          <hr class="divider">

          <h3 style="margin-bottom:12px;">About</h3>
          <p style="color:var(--on-surface-secondary); line-height:1.8; margin-bottom:24px;">${guide.bio}</p>

          <h3 style="margin-bottom:12px;">Languages</h3>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px;">
            ${guide.languages.map(l => `<span class="tag"><span class="material-icons-round" style="font-size:14px;">translate</span> ${l}</span>`).join('')}
          </div>

          <hr class="divider">

          <div class="flex-between mb-3">
            <h3>Reviews (${guideReviews.length})</h3>
            <button class="btn btn-outline btn-sm" onclick="showReviewForm('${guide.id}')">
              <span class="material-icons-round" style="font-size:16px;">edit</span> Write Review
            </button>
          </div>
          ${guideReviews.length ? guideReviews.map(r => `
            <div class="review-card">
              <div class="review-header">
                <div>
                  <span class="review-author">${r.author}</span>
                  ${renderStars(r.rating)}
                </div>
                <span class="review-date">${formatDate(r.date)}</span>
              </div>
              <p class="review-text">${r.text}</p>
            </div>
          `).join('') : '<p style="color:var(--on-surface-tertiary);">No reviews yet. Be the first!</p>'}
        </div>
      </section>
    </div>
  `;
}

function showReviewForm(guideId) {
  openModal('Write a Review', `
    <div>
      <div class="form-group">
        <label class="form-label">Your Rating</label>
        ${renderInteractiveStars('review-stars', 0)}
      </div>
      <div class="form-group">
        <label class="form-label">Your Name</label>
        <input type="text" class="form-input" id="review-author" placeholder="Enter your name">
      </div>
      <div class="form-group">
        <label class="form-label">Your Review</label>
        <textarea class="form-textarea" id="review-text" placeholder="Share your experience..."></textarea>
      </div>
      <button class="btn btn-primary" onclick="submitReview('${guideId}')">Submit Review</button>
    </div>
  `);
  // Init stars coloring
  setTimeout(() => setStarRating('review-stars', 0), 50);
}

function submitReview(guideId) {
  const rating = parseInt(document.getElementById('review-stars').dataset.rating);
  const author = document.getElementById('review-author').value.trim();
  const text = document.getElementById('review-text').value.trim();

  if (!rating || !author || !text) { showToast('Please fill all fields', 'error'); return; }

  const review = { guideId, author, rating, text, date: new Date().toISOString().split('T')[0] };
  state.reviews.push(review);

  // Update guide rating
  const guide = state.guides.find(g => g.id === guideId);
  const guideReviews = state.reviews.filter(r => r.guideId === guideId);
  guide.totalReviews = guideReviews.length;
  guide.rating = Math.round((guideReviews.reduce((sum, r) => sum + r.rating, 0) / guideReviews.length) * 10) / 10;

  saveState();
  closeModal();
  showToast('Review submitted! Thank you.', 'success');
  renderGuideProfile(document.getElementById('app'), guideId);
}

// ===== BOOKING FORM =====
function renderBookingForm(app, guideId) {
  const guide = state.guides.find(g => g.id === guideId);
  if (!guide) return render404(app);
  const city = CITIES.find(c => c.id === guide.city);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <section class="section">
        <div class="container">
          <div class="booking-form">
            <div style="text-align:center; margin-bottom:32px;">
              <img src="${guide.avatar}" alt="${guide.name}" style="width:80px; height:80px; border-radius:50%; margin:0 auto 12px;">
              <h2>Book ${guide.name}</h2>
              <p style="color:var(--on-surface-secondary);">${city ? city.emoji + ' ' + city.name : ''} · ₹${guide.pricePerHour}/hr</p>
            </div>

            <div class="form-group">
              <label class="form-label">Your Name *</label>
              <input type="text" class="form-input" id="book-name" placeholder="Enter your full name">
              <div class="form-error">Please enter your name</div>
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <input type="tel" class="form-input" id="book-phone" placeholder="+91 XXXXX XXXXX">
              <div class="form-error">Please enter a valid phone number</div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date *</label>
                <input type="date" class="form-input" id="book-date" min="${minDate}">
                <div class="form-error">Please select a date</div>
              </div>
              <div class="form-group">
                <label class="form-label">Start Time *</label>
                <select class="form-select" id="book-time">
                  <option value="">Select time</option>
                  ${['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map(t => `<option value="${t}">${formatTime(t)}</option>`).join('')}
                </select>
                <div class="form-error">Please select a time</div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Duration (hours) *</label>
                <select class="form-select" id="book-duration" onchange="updateBookingSummary(${guide.pricePerHour})">
                  ${[2,3,4,5,6,8].map(h => `<option value="${h}" ${h===4?'selected':''}>${h} hours</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Group Size</label>
                <select class="form-select" id="book-group" onchange="updateBookingSummary(${guide.pricePerHour})">
                  ${[1,2,3,4,5,6,7,8].map(n => `<option value="${n}" ${n===2?'selected':''}>${n} ${n===1?'person':'people'}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Tour Type</label>
              <select class="form-select" id="book-type">
                ${guide.specialties.map(s => `<option value="${s}">${s}</option>`).join('')}
                <option value="Custom">Custom Tour</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Special Requests</label>
              <textarea class="form-textarea" id="book-notes" placeholder="Any special requests or interests..."></textarea>
            </div>

            <div class="booking-summary" id="booking-summary">
              <h4 style="margin-bottom:12px;">Booking Summary</h4>
              <div class="booking-summary-row"><span>Guide</span><span>${guide.name}</span></div>
              <div class="booking-summary-row"><span>Rate</span><span>₹${guide.pricePerHour}/hr</span></div>
              <div class="booking-summary-row"><span>Duration</span><span id="sum-duration">4 hours</span></div>
              <div class="booking-summary-row"><span>Group Size</span><span id="sum-group">2 people</span></div>
              <div class="booking-summary-row booking-total"><span>Total</span><span id="sum-total">₹${guide.pricePerHour * 4}</span></div>
            </div>

            <button class="btn btn-primary btn-lg" style="width:100%;" onclick="submitBooking('${guide.id}', ${guide.pricePerHour})">
              <span class="material-icons-round">check_circle</span> Confirm Booking
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function updateBookingSummary(pricePerHour) {
  const duration = parseInt(document.getElementById('book-duration').value);
  const group = parseInt(document.getElementById('book-group').value);
  const total = pricePerHour * duration;
  document.getElementById('sum-duration').textContent = duration + ' hours';
  document.getElementById('sum-group').textContent = group + (group === 1 ? ' person' : ' people');
  document.getElementById('sum-total').textContent = '₹' + total;
}

function submitBooking(guideId, pricePerHour) {
  const name = document.getElementById('book-name').value.trim();
  const phone = document.getElementById('book-phone').value.trim();
  const date = document.getElementById('book-date').value;
  const time = document.getElementById('book-time').value;
  const duration = parseInt(document.getElementById('book-duration').value);
  const groupSize = parseInt(document.getElementById('book-group').value);
  const tourType = document.getElementById('book-type').value;

  let valid = true;
  [[name, 'book-name'], [phone, 'book-phone'], [date, 'book-date'], [time, 'book-time']].forEach(([val, id]) => {
    const group = document.getElementById(id).closest('.form-group');
    if (!val) { group.classList.add('error'); valid = false; }
    else group.classList.remove('error');
  });
  if (!valid) { showToast('Please fill all required fields', 'error'); return; }

  const booking = {
    id: 'b' + Date.now(),
    guideId, date, time, duration, groupSize, tourType,
    status: 'pending',
    totalPrice: pricePerHour * duration,
    visitorName: name,
    visitorPhone: phone
  };
  state.bookings.push(booking);
  saveState();
  showToast('Booking submitted! The guide will confirm shortly.', 'success');
  navigateTo('/bookings');
}

// ===== BOOKINGS PAGE =====
function renderBookings(app) {
  const bookings = state.bookings.sort((a,b) => new Date(b.date) - new Date(a.date));

  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <section class="section">
        <div class="container" style="max-width:800px;">
          <div class="section-header" style="text-align:left;">
            <h2>My Bookings</h2>
            <p>${bookings.length} booking${bookings.length !== 1 ? 's' : ''}</p>
          </div>
          ${bookings.length ? bookings.map(b => {
            const guide = state.guides.find(g => g.id === b.guideId);
            const city = guide ? CITIES.find(c => c.id === guide.city) : null;
            return `
              <div class="booking-card">
                ${guide ? `<img src="${guide.avatar}" alt="${guide.name}" class="guide-avatar">` : ''}
                <div style="flex:1;">
                  <div class="flex-between" style="flex-wrap:wrap; gap:8px;">
                    <div>
                      <h4>${guide ? guide.name : 'Guide'}</h4>
                      <p style="font-size:.8125rem; color:var(--on-surface-secondary);">${city ? city.emoji + ' ' : ''}${b.tourType}</p>
                    </div>
                    <span class="booking-status status-${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
                  </div>
                  <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:12px; font-size:.875rem; color:var(--on-surface-secondary);">
                    <span><span class="material-icons-round" style="font-size:16px; vertical-align:middle;">calendar_today</span> ${formatDate(b.date)}</span>
                    <span><span class="material-icons-round" style="font-size:16px; vertical-align:middle;">schedule</span> ${formatTime(b.time)} · ${b.duration}h</span>
                    <span><span class="material-icons-round" style="font-size:16px; vertical-align:middle;">group</span> ${b.groupSize}</span>
                    <span style="font-weight:600; color:var(--primary);">₹${b.totalPrice}</span>
                  </div>
                  ${b.status === 'completed' ? `<button class="btn btn-outline btn-sm mt-2" onclick="showReviewForm('${b.guideId}')"><span class="material-icons-round" style="font-size:14px;">edit</span> Leave Review</button>` : ''}
                </div>
              </div>
            `;
          }).join('') : `
            <div class="empty-state">
              <span class="material-icons-round">event_busy</span>
              <h3>No bookings yet</h3>
              <p>Find a guide and book your first tour!</p>
              <a href="#/guides" class="btn btn-primary">Browse Guides</a>
            </div>
          `}
        </div>
      </section>
    </div>
  `;
}

// ===== GUIDE REGISTRATION =====
function renderGuideRegister(app) {
  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <section class="section">
        <div class="container" style="max-width:600px;">
          <div class="section-header">
            <h2>Become a Guide</h2>
            <p>Share your knowledge and earn by showing travelers your city</p>
          </div>

          <div class="card">
            <div class="card-body" style="padding:32px;">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" class="form-input" id="reg-name" placeholder="Your full name">
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" class="form-input" id="reg-email" placeholder="your@email.com">
              </div>
              <div class="form-group">
                <label class="form-label">City *</label>
                <select class="form-select" id="reg-city">
                  <option value="">Select your city</option>
                  ${CITIES.map(c => `<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Languages (comma separated) *</label>
                <input type="text" class="form-input" id="reg-languages" placeholder="Hindi, English, Rajasthani">
                <div class="form-hint">List all languages you can guide in</div>
              </div>
              <div class="form-group">
                <label class="form-label">Specialties *</label>
                <input type="text" class="form-input" id="reg-specialties" placeholder="Heritage Walks, Food Tours, Photography">
              </div>
              <div class="form-group">
                <label class="form-label">Price per Hour (₹) *</label>
                <input type="number" class="form-input" id="reg-price" placeholder="800" min="200" max="5000">
              </div>
              <div class="form-group">
                <label class="form-label">Bio *</label>
                <textarea class="form-textarea" id="reg-bio" placeholder="Tell travelers about yourself, your experience, and what makes your tours special..." style="min-height:120px;"></textarea>
              </div>
              <div style="background:var(--primary-light); padding:16px; border-radius:var(--radius-md); margin-bottom:24px;">
                <p style="font-size:.875rem; color:var(--primary);"><strong>📝 Next Steps:</strong> After registration, you'll need to pass a language proficiency quiz and a city knowledge quiz (70% required for each). Once you pass, an admin will verify your profile.</p>
              </div>
              <button class="btn btn-primary btn-lg" style="width:100%;" onclick="submitGuideRegistration()">
                <span class="material-icons-round">how_to_reg</span> Register & Take Quizzes
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function submitGuideRegistration() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const city = document.getElementById('reg-city').value;
  const languages = document.getElementById('reg-languages').value.split(',').map(l => l.trim()).filter(Boolean);
  const specialties = document.getElementById('reg-specialties').value.split(',').map(s => s.trim()).filter(Boolean);
  const price = parseInt(document.getElementById('reg-price').value);
  const bio = document.getElementById('reg-bio').value.trim();

  if (!name || !email || !city || !languages.length || !specialties.length || !price || !bio) {
    showToast('Please fill all fields', 'error');
    return;
  }

  const newGuide = {
    id: 'g' + Date.now(),
    name, city, bio, languages, specialties,
    pricePerHour: price,
    rating: 0, totalReviews: 0,
    verified: false, status: 'quiz-pending',
    avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
    quizScores: {},
    email
  };

  state.guides.push(newGuide);
  state.guideLoggedIn = newGuide.id;
  saveState();
  showToast('Registration successful! Now take the quizzes.', 'success');
  navigateTo('/quiz/language/' + newGuide.id);
}

// ===== QUIZ =====
function renderQuiz(app, type, guideId) {
  const guide = state.guides.find(g => g.id === guideId);
  if (!guide) return render404(app);

  const isLanguage = type === 'language';
  const quizKey = isLanguage ? (guide.languages.includes('Hindi') ? 'hindi' : 'english') : guide.city;
  const questions = isLanguage ? (LANGUAGE_QUIZ[quizKey] || LANGUAGE_QUIZ.english) : (CITY_QUIZ[quizKey] || []);

  if (!questions.length) {
    app.innerHTML = `<div class="page-enter" style="margin-top:var(--header-height);"><div class="container text-center mt-4"><h2>Quiz unavailable</h2><p>No questions available for this quiz.</p></div></div>`;
    return;
  }

  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <section class="section">
        <div class="container">
          <div class="quiz-container">
            <div class="section-header">
              <h2>${isLanguage ? '🗣️ Language Proficiency' : '🏙️ City Knowledge'} Quiz</h2>
              <p>${isLanguage ? `Testing your ${quizKey.charAt(0).toUpperCase() + quizKey.slice(1)} proficiency` : `How well do you know ${CITIES.find(c=>c.id===guide.city)?.name}?`}</p>
            </div>
            <div id="quiz-area"></div>
          </div>
        </div>
      </section>
    </div>
  `;

  let current = 0;
  let score = 0;
  let answered = false;

  function showQuestion() {
    answered = false;
    const q = questions[current];
    document.getElementById('quiz-area').innerHTML = `
      <div class="quiz-progress">
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${(current/questions.length)*100}%"></div></div>
        <div class="quiz-progress-text"><span>Question ${current+1} of ${questions.length}</span><span>Score: ${score}/${current}</span></div>
      </div>
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<div class="quiz-option" data-index="${i}" onclick="selectQuizOption(this, ${q.answer})">${opt}</div>`).join('')}
      </div>
      <div class="mt-3 text-center" id="quiz-next" style="display:none;">
        <button class="btn btn-primary" onclick="nextQuizQuestion()">
          ${current < questions.length - 1 ? 'Next Question →' : 'See Results'}
        </button>
      </div>
    `;
  }

  window.selectQuizOption = function(el, correctIndex) {
    if (answered) return;
    answered = true;
    const selected = parseInt(el.dataset.index);
    document.querySelectorAll('.quiz-option').forEach((opt, i) => {
      if (i === correctIndex) opt.classList.add('correct');
      else if (i === selected && selected !== correctIndex) opt.classList.add('wrong');
      opt.style.pointerEvents = 'none';
    });
    if (selected === correctIndex) score++;
    document.getElementById('quiz-next').style.display = 'block';
  };

  window.nextQuizQuestion = function() {
    current++;
    if (current < questions.length) {
      showQuestion();
    } else {
      const pct = Math.round((score / questions.length) * 100);
      const passed = pct >= 70;

      if (!guide.quizScores) guide.quizScores = {};
      guide.quizScores[type] = pct;

      if (isLanguage && passed) {
        saveState();
        document.getElementById('quiz-area').innerHTML = `
          <div class="quiz-result ${passed ? '' : 'failed'}">
            <div class="quiz-score">${pct}%</div>
            <h3 style="margin:12px 0;">${passed ? '🎉 Language Quiz Passed!' : '😔 Not Quite'}</h3>
            <p style="color:var(--on-surface-secondary); margin-bottom:24px;">You scored ${score} out of ${questions.length}</p>
            <a href="#/quiz/city/${guideId}" class="btn btn-primary btn-lg">Take City Knowledge Quiz →</a>
          </div>
        `;
      } else if (!isLanguage && passed) {
        guide.status = 'pending';
        saveState();
        document.getElementById('quiz-area').innerHTML = `
          <div class="quiz-result">
            <div class="quiz-score">${pct}%</div>
            <h3 style="margin:12px 0;">🎉 Both Quizzes Passed!</h3>
            <p style="color:var(--on-surface-secondary); margin-bottom:24px;">Your profile is now pending admin verification. You'll appear to visitors once approved.</p>
            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
              <a href="#/guide-dashboard" class="btn btn-primary">Go to Dashboard</a>
              <a href="#/" class="btn btn-outline">Back to Home</a>
            </div>
          </div>
        `;
      } else {
        document.getElementById('quiz-area').innerHTML = `
          <div class="quiz-result failed">
            <div class="quiz-score">${pct}%</div>
            <h3 style="margin:12px 0;">😔 Not Quite — 70% Needed</h3>
            <p style="color:var(--on-surface-secondary); margin-bottom:24px;">You scored ${score} out of ${questions.length}. You need at least 70% to pass.</p>
            <button class="btn btn-primary btn-lg" onclick="navigateTo('/quiz/${type}/${guideId}')">
              <span class="material-icons-round">refresh</span> Try Again
            </button>
          </div>
        `;
      }
    }
  };

  showQuestion();
}

// ===== GUIDE DASHBOARD =====
function renderGuideDashboard(app) {
  const guide = state.guideLoggedIn ? state.guides.find(g => g.id === state.guideLoggedIn) : null;

  if (!guide) {
    app.innerHTML = `
      <div class="page-enter" style="margin-top:var(--header-height);">
        <section class="section">
          <div class="container" style="max-width:400px;">
            <div class="admin-login">
              <h2>Guide Login</h2>
              <p>Enter your email to access your dashboard</p>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="guide-login-email" placeholder="your@email.com">
              </div>
              <button class="btn btn-primary" style="width:100%;" onclick="guideLogin()">Login</button>
            </div>
          </div>
        </section>
      </div>
    `;
    return;
  }

  const guideBookings = state.bookings.filter(b => b.guideId === guide.id);
  const guideReviews = state.reviews.filter(r => r.guideId === guide.id);
  const earnings = guideBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((s,b) => s + b.totalPrice, 0);

  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <section class="section">
        <div class="container">
          <div class="flex-between mb-3" style="flex-wrap:wrap; gap:12px;">
            <div>
              <h2>Welcome back, ${guide.name.split(' ')[0]}!</h2>
              <p style="color:var(--on-surface-secondary);">
                Status: ${guide.status === 'approved'
                  ? '<span class="badge badge-verified">✅ Verified</span>'
                  : guide.status === 'pending'
                    ? '<span class="badge badge-pending">⏳ Pending Verification</span>'
                    : '<span class="badge badge-rejected">Quiz Pending</span>'}
              </p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="state.guideLoggedIn=null; navigateTo('/');">Logout</button>
          </div>

          <div class="dashboard-stats">
            <div class="stat-card">
              <span class="material-icons-round">event</span>
              <div class="stat-value">${guideBookings.length}</div>
              <div class="stat-label">Total Bookings</div>
            </div>
            <div class="stat-card">
              <span class="material-icons-round">payments</span>
              <div class="stat-value">₹${earnings.toLocaleString()}</div>
              <div class="stat-label">Total Earnings</div>
            </div>
            <div class="stat-card">
              <span class="material-icons-round">star</span>
              <div class="stat-value">${guide.rating || '—'}</div>
              <div class="stat-label">Rating (${guide.totalReviews} reviews)</div>
            </div>
            <div class="stat-card">
              <span class="material-icons-round">verified</span>
              <div class="stat-value">${guide.quizScores?.language || 0}%</div>
              <div class="stat-label">Language Score</div>
            </div>
          </div>

          <h3 style="margin-bottom:16px;">Your Bookings</h3>
          ${guideBookings.length ? guideBookings.map(b => `
            <div class="booking-card">
              <div style="flex:1;">
                <div class="flex-between" style="flex-wrap:wrap; gap:8px;">
                  <div>
                    <h4>${b.visitorName}</h4>
                    <p style="font-size:.8125rem; color:var(--on-surface-secondary);">${b.tourType} · ${b.groupSize} people</p>
                  </div>
                  <span class="booking-status status-${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span>
                </div>
                <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:8px; font-size:.875rem; color:var(--on-surface-secondary);">
                  <span>📅 ${formatDate(b.date)}</span>
                  <span>🕐 ${formatTime(b.time)} · ${b.duration}h</span>
                  <span style="font-weight:600; color:var(--primary);">₹${b.totalPrice}</span>
                </div>
                ${b.status === 'pending' ? `
                  <div style="margin-top:12px; display:flex; gap:8px;">
                    <button class="btn btn-success btn-sm" onclick="updateBookingStatus('${b.id}','confirmed')">✓ Accept</button>
                    <button class="btn btn-danger btn-sm" onclick="updateBookingStatus('${b.id}','declined')">✗ Decline</button>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('') : '<p style="color:var(--on-surface-tertiary);">No bookings yet.</p>'}

          <hr class="divider">

          <h3 style="margin-bottom:16px;">Your Reviews</h3>
          ${guideReviews.length ? guideReviews.map(r => `
            <div class="review-card">
              <div class="review-header">
                <div><span class="review-author">${r.author}</span> ${renderStars(r.rating)}</div>
                <span class="review-date">${formatDate(r.date)}</span>
              </div>
              <p class="review-text">${r.text}</p>
            </div>
          `).join('') : '<p style="color:var(--on-surface-tertiary);">No reviews yet.</p>'}
        </div>
      </section>
    </div>
  `;
}

function guideLogin() {
  const email = document.getElementById('guide-login-email').value.trim();
  const guide = state.guides.find(g => g.email === email);
  if (guide) {
    state.guideLoggedIn = guide.id;
    renderGuideDashboard(document.getElementById('app'));
    showToast('Welcome back!', 'success');
  } else {
    showToast('No guide found with that email', 'error');
  }
}

function updateBookingStatus(bookingId, status) {
  const booking = state.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    saveState();
    showToast(`Booking ${status}`, status === 'confirmed' ? 'success' : 'info');
    renderGuideDashboard(document.getElementById('app'));
  }
}

// ===== ADMIN PANEL =====
function renderAdmin(app) {
  if (!state.adminLoggedIn) {
    app.innerHTML = `
      <div class="page-enter" style="margin-top:var(--header-height);">
        <div class="admin-login">
          <div style="text-align:center; margin-bottom:20px;">
            <span class="material-icons-round" style="font-size:48px; color:var(--primary);">admin_panel_settings</span>
          </div>
          <h2>Admin Panel</h2>
          <p>Restricted access — authorized personnel only</p>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" id="admin-email" placeholder="admin@cityguide.com">
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" id="admin-password" placeholder="••••••••" onkeydown="if(event.key==='Enter')adminLogin()">
          </div>
          <button class="btn btn-primary" style="width:100%;" onclick="adminLogin()">Login</button>
        </div>
      </div>
    `;
    return;
  }

  const approvedGuides = state.guides.filter(g => g.status === 'approved');
  const pendingGuides = state.guides.filter(g => g.status === 'pending');
  const totalBookings = state.bookings.length;
  const totalRevenue = state.bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((s,b) => s + b.totalPrice, 0);
  const cityStats = CITIES.map(c => ({
    name: c.name,
    guides: state.guides.filter(g => g.city === c.id && g.status === 'approved').length,
    bookings: state.bookings.filter(b => {
      const guide = state.guides.find(g => g.id === b.guideId);
      return guide && guide.city === c.id;
    }).length
  }));

  app.innerHTML = `
    <div class="page-enter">
      <div class="admin-sidebar">
        <div style="padding:16px 20px; border-bottom:1px solid var(--outline); margin-bottom:8px;">
          <span style="font-size:.75rem; font-weight:600; color:var(--on-surface-tertiary); text-transform:uppercase; letter-spacing:1px;">Admin Panel</span>
        </div>
        <a class="admin-sidebar-link ${state.adminTab==='dashboard'?'active':''}" onclick="switchAdminTab('dashboard')">
          <span class="material-icons-round">dashboard</span> Dashboard
        </a>
        <a class="admin-sidebar-link ${state.adminTab==='guides'?'active':''}" onclick="switchAdminTab('guides')">
          <span class="material-icons-round">people</span> Guides
          ${pendingGuides.length ? `<span class="badge" style="background:var(--error); color:#fff; margin-left:auto;">${pendingGuides.length}</span>` : ''}
        </a>
        <a class="admin-sidebar-link ${state.adminTab==='bookings'?'active':''}" onclick="switchAdminTab('bookings')">
          <span class="material-icons-round">event</span> Bookings
        </a>
        <a class="admin-sidebar-link ${state.adminTab==='reviews'?'active':''}" onclick="switchAdminTab('reviews')">
          <span class="material-icons-round">reviews</span> Reviews
        </a>
        <a class="admin-sidebar-link" onclick="state.adminLoggedIn=false; navigateTo('/');" style="margin-top:auto;">
          <span class="material-icons-round">logout</span> Logout
        </a>
      </div>

      <div class="admin-content">
        <!-- Dashboard Tab -->
        <div id="admin-tab-dashboard" style="display:${state.adminTab==='dashboard'?'block':'none'}">
          <h2 style="margin-bottom:24px;">Dashboard</h2>
          <div class="dashboard-stats">
            <div class="stat-card">
              <span class="material-icons-round">people</span>
              <div class="stat-value">${approvedGuides.length}</div>
              <div class="stat-label">Active Guides</div>
            </div>
            <div class="stat-card">
              <span class="material-icons-round">pending</span>
              <div class="stat-value">${pendingGuides.length}</div>
              <div class="stat-label">Pending Approval</div>
            </div>
            <div class="stat-card">
              <span class="material-icons-round">event</span>
              <div class="stat-value">${totalBookings}</div>
              <div class="stat-label">Total Bookings</div>
            </div>
            <div class="stat-card">
              <span class="material-icons-round">payments</span>
              <div class="stat-value">₹${totalRevenue.toLocaleString()}</div>
              <div class="stat-label">Total Revenue</div>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            <div class="admin-card">
              <h3>Guides per City</h3>
              <div class="chart-container"><canvas id="chart-guides"></canvas></div>
            </div>
            <div class="admin-card">
              <h3>Bookings per City</h3>
              <div class="chart-container"><canvas id="chart-bookings"></canvas></div>
            </div>
          </div>

          <div class="admin-card mt-3">
            <h3>Revenue Trend (Last 7 Days)</h3>
            <div class="chart-container"><canvas id="chart-revenue"></canvas></div>
          </div>
        </div>

        <!-- Guides Tab -->
        <div id="admin-tab-guides" style="display:${state.adminTab==='guides'?'block':'none'}">
          <h2 style="margin-bottom:24px;">Manage Guides</h2>

          ${pendingGuides.length ? `
            <div class="admin-card" style="border-left:4px solid var(--warning);">
              <h3>⏳ Pending Approval (${pendingGuides.length})</h3>
              <div class="table-responsive">
                <table>
                  <thead><tr><th>Guide</th><th>City</th><th>Languages</th><th>Quiz Scores</th><th>Actions</th></tr></thead>
                  <tbody>
                    ${pendingGuides.map(g => {
                      const city = CITIES.find(c => c.id === g.city);
                      return `<tr>
                        <td><div class="flex" style="gap:10px; align-items:center;"><img src="${g.avatar}" style="width:36px; height:36px; border-radius:50%;"><div><strong>${g.name}</strong><br><span style="font-size:.75rem; color:var(--on-surface-tertiary);">${g.specialties.join(', ')}</span></div></div></td>
                        <td>${city ? city.emoji + ' ' + city.name : g.city}</td>
                        <td>${g.languages.join(', ')}</td>
                        <td>Lang: ${g.quizScores?.language || '—'}% | City: ${g.quizScores?.city || '—'}%</td>
                        <td>
                          <div style="display:flex; gap:6px;">
                            <button class="btn btn-success btn-sm" onclick="adminApproveGuide('${g.id}')">Approve</button>
                            <button class="btn btn-danger btn-sm" onclick="adminRejectGuide('${g.id}')">Reject</button>
                          </div>
                        </td>
                      </tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <div class="admin-card">
            <h3>All Guides (${state.guides.length})</h3>
            <div class="table-responsive">
              <table>
                <thead><tr><th>Guide</th><th>City</th><th>Rating</th><th>Bookings</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  ${state.guides.map(g => {
                    const city = CITIES.find(c => c.id === g.city);
                    const bookings = state.bookings.filter(b => b.guideId === g.id).length;
                    return `<tr>
                      <td><div class="flex" style="gap:10px; align-items:center;"><img src="${g.avatar}" style="width:36px; height:36px; border-radius:50%;"><strong>${g.name}</strong></div></td>
                      <td>${city ? city.name : g.city}</td>
                      <td>${g.rating ? renderStars(g.rating, g.totalReviews) : '—'}</td>
                      <td>${bookings}</td>
                      <td><span class="badge badge-${g.status === 'approved' ? 'verified' : g.status === 'pending' ? 'pending' : 'rejected'}">${g.status}</span></td>
                      <td>
                        ${g.status === 'approved' ? `<button class="btn btn-outline btn-sm" onclick="adminSuspendGuide('${g.id}')">Suspend</button>` : g.status === 'pending' ? `<button class="btn btn-success btn-sm" onclick="adminApproveGuide('${g.id}')">Approve</button>` : '—'}
                      </td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Bookings Tab -->
        <div id="admin-tab-bookings" style="display:${state.adminTab==='bookings'?'block':'none'}">
          <h2 style="margin-bottom:24px;">All Bookings</h2>
          <div class="admin-card">
            <div class="table-responsive">
              <table>
                <thead><tr><th>Booking</th><th>Guide</th><th>Visitor</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  ${state.bookings.map(b => {
                    const guide = state.guides.find(g => g.id === b.guideId);
                    return `<tr>
                      <td>${b.id}</td>
                      <td>${guide ? guide.name : '—'}</td>
                      <td>${b.visitorName}</td>
                      <td>${formatDate(b.date)}</td>
                      <td>₹${b.totalPrice}</td>
                      <td><span class="booking-status status-${b.status}">${b.status}</span></td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div id="admin-tab-reviews" style="display:${state.adminTab==='reviews'?'block':'none'}">
          <h2 style="margin-bottom:24px;">All Reviews</h2>
          <div class="admin-card">
            <div class="table-responsive">
              <table>
                <thead><tr><th>Guide</th><th>Author</th><th>Rating</th><th>Review</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  ${state.reviews.map((r, i) => {
                    const guide = state.guides.find(g => g.id === r.guideId);
                    return `<tr>
                      <td>${guide ? guide.name : '—'}</td>
                      <td>${r.author}</td>
                      <td>${renderStars(r.rating)}</td>
                      <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${r.text}</td>
                      <td>${formatDate(r.date)}</td>
                      <td><button class="btn btn-danger btn-sm" onclick="adminDeleteReview(${i})">Delete</button></td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render charts after DOM is ready
  if (state.adminTab === 'dashboard') {
    setTimeout(() => renderAdminCharts(cityStats), 100);
  }
}

function switchAdminTab(tab) {
  state.adminTab = tab;
  document.querySelectorAll('[id^="admin-tab-"]').forEach(el => el.style.display = 'none');
  document.getElementById('admin-tab-' + tab).style.display = 'block';
  document.querySelectorAll('.admin-sidebar-link').forEach(el => el.classList.remove('active'));
  event.target.closest('.admin-sidebar-link').classList.add('active');
  if (tab === 'dashboard') setTimeout(() => {
    const cityStats = CITIES.map(c => ({
      name: c.name,
      guides: state.guides.filter(g => g.city === c.id && g.status === 'approved').length,
      bookings: state.bookings.filter(b => {
        const guide = state.guides.find(g => g.id === b.guideId);
        return guide && guide.city === c.id;
      }).length
    }));
    renderAdminCharts(cityStats);
  }, 100);
}

function renderAdminCharts(cityStats) {
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#e8eaed' : '#1f1f1f';
  const gridColor = isDark ? '#3c4043' : '#e8eaed';
  const colors = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#ff6d01', '#46bdc6'];

  const defaults = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor } } },
    scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { color: gridColor } } }
  };

  // Destroy existing
  Chart.helpers.each(Chart.instances, c => c.destroy());

  const ctx1 = document.getElementById('chart-guides');
  if (ctx1) new Chart(ctx1, {
    type: 'bar',
    data: { labels: cityStats.map(c=>c.name), datasets: [{ label: 'Guides', data: cityStats.map(c=>c.guides), backgroundColor: colors }] },
    options: { ...defaults, plugins: { ...defaults.plugins, legend: { display: false } } }
  });

  const ctx2 = document.getElementById('chart-bookings');
  if (ctx2) new Chart(ctx2, {
    type: 'doughnut',
    data: { labels: cityStats.map(c=>c.name), datasets: [{ data: cityStats.map(c=>c.bookings || 1), backgroundColor: colors }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } } }
  });

  const ctx3 = document.getElementById('chart-revenue');
  if (ctx3) {
    const days = [];
    const revenues = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push(d.toLocaleDateString('en', { weekday: 'short' }));
      revenues.push(state.bookings.filter(b => b.date === dateStr && (b.status === 'confirmed' || b.status === 'completed')).reduce((s,b) => s + b.totalPrice, 0) || Math.floor(Math.random() * 5000 + 1000));
    }
    new Chart(ctx3, {
      type: 'line',
      data: { labels: days, datasets: [{ label: 'Revenue (₹)', data: revenues, borderColor: '#1a73e8', backgroundColor: 'rgba(26,115,232,.1)', fill: true, tension: .4 }] },
      options: defaults
    });
  }
}

function adminLogin() {
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  if (email === ADMIN_CREDS.email && password === ADMIN_CREDS.password) {
    state.adminLoggedIn = true;
    state.adminTab = 'dashboard';
    showToast('Welcome, Admin!', 'success');
    renderAdmin(document.getElementById('app'));
  } else {
    showToast('Invalid credentials', 'error');
  }
}

function adminApproveGuide(guideId) {
  const guide = state.guides.find(g => g.id === guideId);
  if (guide) {
    guide.status = 'approved';
    guide.verified = true;
    CITIES.forEach(c => { c.guidesCount = state.guides.filter(g => g.city === c.id && g.status === 'approved').length; });
    saveState();
    showToast(`${guide.name} approved!`, 'success');
    renderAdmin(document.getElementById('app'));
  }
}

function adminRejectGuide(guideId) {
  const guide = state.guides.find(g => g.id === guideId);
  if (guide) {
    guide.status = 'rejected';
    saveState();
    showToast(`${guide.name} rejected`, 'info');
    renderAdmin(document.getElementById('app'));
  }
}

function adminSuspendGuide(guideId) {
  const guide = state.guides.find(g => g.id === guideId);
  if (guide) {
    guide.status = 'suspended';
    guide.verified = false;
    CITIES.forEach(c => { c.guidesCount = state.guides.filter(g => g.city === c.id && g.status === 'approved').length; });
    saveState();
    showToast(`${guide.name} suspended`, 'info');
    renderAdmin(document.getElementById('app'));
  }
}

function adminDeleteReview(index) {
  if (index >= 0 && index < state.reviews.length) {
    state.reviews.splice(index, 1);
    saveState();
    showToast('Review deleted', 'info');
    renderAdmin(document.getElementById('app'));
  }
}

// ===== 404 =====
function render404(app) {
  app.innerHTML = `
    <div class="page-enter" style="margin-top:var(--header-height);">
      <div class="empty-state" style="padding:120px 20px;">
        <span class="material-icons-round" style="font-size:80px;">explore_off</span>
        <h3 style="font-size:1.5rem;">Page Not Found</h3>
        <p>The page you're looking for doesn't exist.</p>
        <a href="#/" class="btn btn-primary">Back to Home</a>
      </div>
    </div>
  `;
}

// ===== Helpers =====
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

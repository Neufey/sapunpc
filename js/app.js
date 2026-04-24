// ============= РЎРћРЎРўРћРЇРќРР• =============
let cart;
try { cart = JSON.parse(localStorage.getItem('ermak_cart') || '[]'); } catch { cart = []; }
let currentCat = 'all';
let checkpointState = {};
CHECKPOINTS.forEach(c => { checkpointState[c.id] = c.defaultOn; });

if (localStorage.getItem('ermak_theme') === 'dark' || (!localStorage.getItem('ermak_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('ermak_theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    renderProducts('home-products', PRODUCTS.slice(0, 4));
    renderProducts('catalog-products', currentCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === currentCat));
    document.getElementById('hero-pc-svg').innerHTML = pcSvg(PRODUCTS[0], false);
    if (document.getElementById('page-product').classList.contains('active') && typeof lastProductId !== 'undefined') {
        renderProductDetail(lastProductId);
    }
    renderCart();
}

function toggleCheckpoint(id) {
    checkpointState[id] = !checkpointState[id];
    renderCart();
}

// ============= РќРђР’РР“РђР¦РРЇ =============
function nav(page, params) {
    if (page === 'product' && params) {
        renderProductDetail(params);
    }
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelectorAll('nav a[data-page]').forEach(a => {
        a.classList.toggle('active', a.dataset.page === page);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (page === 'cart') renderCart();
    closeMenu();
}

function toggleMenu() {
    const nav = document.getElementById('main-nav');
    const burger = document.getElementById('burger');
    nav.classList.toggle('open');
    burger.classList.toggle('open');
}

function closeMenu() {
    const nav = document.getElementById('main-nav');
    const burger = document.getElementById('burger');
    if (nav) nav.classList.remove('open');
    if (burger) burger.classList.remove('open');
}

function switchTab(tab) {
    document.querySelectorAll('.info-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.info-content > div').forEach(d => d.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
}

function isDarkMode() { return document.documentElement.classList.contains('dark'); }

function productBg(p) { return isDarkMode() && p.darkBg ? p.darkBg : p.bg; }

// ============= SVG PC (РґР»СЏ РєР°СЂС‚РѕС‡РµРє С‚РѕРІР°СЂРѕРІ) =============
function pcSvg(p, big) {
    const w = big ? 600 : 400;
    const h = big ? 600 : 300;
    const accent = p.glow ? p.glow.replace('rgba(', 'rgb(').replace(/,\s*[\d.]+\)/, ')') : 'rgb(255,87,34)';
    const isLight = p.dark && !isDarkMode();
    const stroke = isLight ? '#1a1a1a' : '#ffffff';
    const stroke2 = isLight ? 'rgba(26,26,26,0.3)' : 'rgba(255,255,255,0.2)';
    const fill = isLight ? '#fafaf7' : '#0a0a0f';
    
    const cx = w/2, cy = h/2;
    const cw = big ? 220 : 150, ch = big ? 320 : 200;
    const x = cx - cw/2, y = cy - ch/2;
    
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;">
        <defs>
            <linearGradient id="caseGrad${p.id}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${fill}" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="${fill}" stop-opacity="0.7"/>
            </linearGradient>
            <radialGradient id="rgb${p.id}" cx="50%" cy="50%">
                <stop offset="0%" stop-color="${accent}" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
            </radialGradient>
            <filter id="glow${p.id}"><feGaussianBlur stdDeviation="${big?6:3}"/></filter>
        </defs>
        <ellipse cx="${cx}" cy="${cy}" rx="${cw}" ry="${ch*0.7}" fill="url(#rgb${p.id})" opacity="0.5"/>
        <ellipse cx="${cx}" cy="${y+ch+10}" rx="${cw*0.55}" ry="6" fill="${stroke}" opacity="0.15"/>
        <rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="6" fill="url(#caseGrad${p.id})" stroke="${stroke}" stroke-width="${big?2:1.5}"/>
        <rect x="${x+8}" y="${y+8}" width="${cw-16}" height="${ch-16}" rx="3" fill="${isLight?'rgba(0,0,0,0.05)':'rgba(0,0,0,0.4)'}" stroke="${stroke2}" stroke-width="0.5"/>
        <rect x="${x+18}" y="${y+30}" width="${cw-36}" height="${ch-80}" rx="2" fill="${isLight?'rgba(26,26,26,0.08)':'rgba(255,255,255,0.04)'}"/>
        <rect x="${x+18}" y="${y+ch*0.45}" width="${cw-36}" height="${big?40:25}" rx="2" fill="${isLight?'rgba(26,26,26,0.15)':'rgba(255,255,255,0.1)'}" stroke="${stroke2}" stroke-width="0.5"/>
        <circle cx="${x+cw*0.32}" cy="${y+ch*0.45+(big?20:12.5)}" r="${big?12:7}" fill="none" stroke="${stroke2}" stroke-width="0.8"/>
        <circle cx="${x+cw*0.68}" cy="${y+ch*0.45+(big?20:12.5)}" r="${big?12:7}" fill="none" stroke="${stroke2}" stroke-width="0.8"/>
        <circle cx="${x+cw*0.32}" cy="${y+ch*0.45+(big?20:12.5)}" r="2" fill="${accent}" filter="url(#glow${p.id})"/>
        <circle cx="${x+cw*0.68}" cy="${y+ch*0.45+(big?20:12.5)}" r="2" fill="${accent}" filter="url(#glow${p.id})"/>
        <rect x="${cx-(big?28:18)}" y="${y+30}" width="${big?56:36}" height="${big?80:50}" rx="2" fill="${isLight?'rgba(26,26,26,0.2)':'rgba(255,255,255,0.12)'}" stroke="${stroke2}" stroke-width="0.5"/>
        ${[...Array(big?7:5)].map((_,i)=>`<line x1="${cx-(big?28:18)}" y1="${y+38+i*(big?10:7)}" x2="${cx+(big?28:18)}" y2="${y+38+i*(big?10:7)}" stroke="${stroke2}" stroke-width="0.5"/>`).join('')}
        <rect x="${x+cw*0.7}" y="${y+30}" width="${big?6:4}" height="${big?70:45}" fill="${accent}" opacity="0.7" filter="url(#glow${p.id})"/>
        <rect x="${x+cw*0.78}" y="${y+30}" width="${big?6:4}" height="${big?70:45}" fill="${accent}" opacity="0.7" filter="url(#glow${p.id})"/>
        <circle cx="${x+12}" cy="${y+ch*0.25}" r="${big?7:5}" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.8"/>
        <circle cx="${x+12}" cy="${y+ch*0.55}" r="${big?7:5}" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.8"/>
        <circle cx="${x+12}" cy="${y+ch*0.85}" r="${big?7:5}" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.8"/>
        <circle cx="${x+12}" cy="${y+ch*0.25}" r="1.5" fill="${accent}" filter="url(#glow${p.id})"/>
        <circle cx="${x+12}" cy="${y+ch*0.55}" r="1.5" fill="${accent}" filter="url(#glow${p.id})"/>
        <circle cx="${x+12}" cy="${y+ch*0.85}" r="1.5" fill="${accent}" filter="url(#glow${p.id})"/>
        <rect x="${x+18}" y="${y+ch-50}" width="${cw-36}" height="${big?30:20}" rx="1" fill="${isLight?'rgba(26,26,26,0.1)':'rgba(255,255,255,0.05)'}" stroke="${stroke2}" stroke-width="0.5"/>
        <circle cx="${x+cw-15}" cy="${y+15}" r="2.5" fill="${accent}" filter="url(#glow${p.id})"/>
    </svg>`;
}

// ============= РљРђРўРђР›РћР“ =============
function renderProducts(container, items) {
    const el = document.getElementById(container);
    el.innerHTML = items.map(p => `
        <div class="product-card" onclick="nav('product', ${p.id})">
            <div class="product-img" style="background:${productBg(p)};">
                ${pcSvg(p, false)}
                ${p.tag ? `<span class="product-tag ${p.tag}">${p.tagName}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-cat">${p.catName}</div>
                <div class="product-name">${p.name}</div>
                <ul class="product-specs">
                    ${p.specs.slice(0, 3).map(s => `<li>${s}</li>`).join('')}
                </ul>
                <div class="product-bottom">
                    <div class="product-price">${formatPrice(p.price)} в‚Ѕ<small>РѕС‚ ${formatPrice(Math.round(p.price/24))} в‚Ѕ/РјРµСЃ</small></div>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id}, this)">Р’ РєРѕСЂР·РёРЅСѓ</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderFilters() {
    const el = document.getElementById('filter-bar');
    el.innerHTML = CATEGORIES.map(c => {
        const count = c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === c.id).length;
        return `<button class="filter-btn ${c.id === currentCat ? 'active' : ''}" onclick="setFilter('${c.id}')">${c.name}<span class="filter-count">${count}</span></button>`;
    }).join('');
}

function setFilter(cat) {
    currentCat = cat;
    renderFilters();
    const items = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
    renderProducts('catalog-products', items);
}

// ============= Р”Р•РўРђР›Р¬ =============
let lastProductId = null;
function renderProductDetail(id) {
    lastProductId = id;
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    document.getElementById('product-detail-content').innerHTML = `
        <a class="pd-back" onclick="nav('catalog')">в†ђ РќР°Р·Р°Рґ РІ РєР°С‚Р°Р»РѕРі</a>
        <div class="pd-image" style="background:${productBg(p)};border-radius:24px;overflow:hidden;">
            ${pcSvg(p, true)}
            ${p.tag ? `<span class="product-tag ${p.tag}" style="position:absolute;top:24px;left:24px;z-index:3;">${p.tagName}</span>` : ''}
        </div>
        <div class="pd-info">
            <div class="pd-cat">${p.catName}</div>
            <h1>${p.name}</h1>
            <p class="pd-desc">${p.desc}</p>
            <div class="pd-specs-table">
                ${p.specs.map((s, i) => {
                    const labels = ['РџСЂРѕС†РµСЃСЃРѕСЂ', 'Р’РёРґРµРѕРєР°СЂС‚Р°', 'РџР°РјСЏС‚СЊ', 'РќР°РєРѕРїРёС‚РµР»СЊ'];
                    return `<div class="pd-spec-row"><div class="pd-spec-key">${labels[i] || 'РџСЂРѕС‡РµРµ'}</div><div class="pd-spec-val">${s}</div></div>`;
                }).join('')}
                <div class="pd-spec-row"><div class="pd-spec-key">Р“Р°СЂР°РЅС‚РёСЏ</div><div class="pd-spec-val">1 РіРѕРґ</div></div>
                <div class="pd-spec-row"><div class="pd-spec-key">РЎР±РѕСЂРєР°</div><div class="pd-spec-val">24вЂ“48 С‡Р°СЃРѕРІ</div></div>
            </div>
            <div class="pd-price-block">
                <div class="pd-price">${formatPrice(p.price)} в‚Ѕ</div>
                <div class="pd-price-note">РёР»Рё РѕС‚ ${formatPrice(Math.round(p.price/24))} в‚Ѕ/РјРµСЃ РІ СЂР°СЃСЃСЂРѕС‡РєСѓ 0-0-24</div>
                <div class="pd-actions">
                    <button class="btn btn-primary btn-arrow" onclick="addToCart(${p.id}, this); nav('cart')">РљСѓРїРёС‚СЊ СЃРµР№С‡Р°СЃ</button>
                    <button class="btn btn-ghost" onclick="addToCart(${p.id}, this)">Р’ РєРѕСЂР·РёРЅСѓ</button>
                </div>
            </div>
        </div>
    `;
}

// ============= РљРћР Р—РРќРђ =============
function addToCart(id, btn) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        const p = PRODUCTS.find(x => x.id === id);
        cart.push({ ...p, qty: 1 });
    }
    saveCart();
    updateCartCount();
    showToast('Р”РѕР±Р°РІР»РµРЅРѕ РІ РєРѕСЂР·РёРЅСѓ');
    if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Р”РѕР±Р°РІР»РµРЅРѕ вњ“';
        btn.classList.add('added');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('added'); }, 1200);
    }
}

function changeQty(id, delta) {
    const item = cart.find(x => x.id == id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(x => x.id != id);
    saveCart();
    updateCartCount();
    renderCart();
}

function removeItem(id) {
    cart = cart.filter(x => x.id != id);
    saveCart();
    updateCartCount();
    renderCart();
}

function saveCart() { localStorage.setItem('ermak_cart', JSON.stringify(cart)); }
function updateCartCount() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    const el = document.getElementById('cart-count');
    el.textContent = total;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
}

function renderCart() {
    const el = document.getElementById('cart-content');
    if (cart.length === 0) {
        el.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">в€…</div>
                <h2>РљРѕСЂР·РёРЅР° РїСѓСЃС‚Р°</h2>
                <p>РЎР°РјРѕРµ РІСЂРµРјСЏ РІС‹Р±СЂР°С‚СЊ С‡С‚Рѕ-РЅРёР±СѓРґСЊ РјРѕС‰РЅРѕРµ</p>
                <button class="btn btn-primary btn-arrow" onclick="nav('catalog')">РџРµСЂРµР№С‚Рё РІ РєР°С‚Р°Р»РѕРі</button>
            </div>`;
        return;
    }
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const cpTotal = CHECKPOINTS.filter(c => checkpointState[c.id] && c.price > 0).reduce((s, c) => s + c.price, 0);
    const assembly = cart.some(i => i.custom) ? ASSEMBLY_FEE : 0;
    const delivery = subtotal >= 100000 ? 0 : 1500;
    const total = subtotal + cpTotal + assembly + delivery;
    const baseDays = cart.some(i => i.custom) ? 4 : 3;
    const savedDays = CHECKPOINTS.filter(c => !checkpointState[c.id] && c.savesDays).reduce((s, c) => s + c.savesDays, 0);
    const totalDays = baseDays - savedDays;
    const cpHtml = CHECKPOINTS.map(c => {
        const on = checkpointState[c.id];
        return `<div class="checkpoint ${on ? 'on' : 'off'}" onclick="toggleCheckpoint('${c.id}')">
            <div class="cp-toggle">${on ? 'вњ“' : ''}</div>
            <div class="cp-info">
                <div class="cp-name">${c.name}${c.price > 0 ? ` <span class="cp-price">+${formatPrice(c.price)} в‚Ѕ</span>` : ''}</div>
                <div class="cp-desc">${c.desc}${c.savesDays && !on ? ` <span class="cp-save">в€’${c.savesDays} РґРЅСЏ Рє СЃСЂРѕРєСѓ</span>` : ''}</div>
            </div>
        </div>`;
    }).join('');
    el.innerHTML = `
        <h1>РљРѕСЂР·РёРЅР°</h1>
        <div class="cart-page-sub">${cart.reduce((s,i)=>s+i.qty,0)} РўРћР’РђР РћР’ Р’ РљРћР Р—РРќР•</div>
        <div class="cart-grid">
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-img" style="background:${productBg(item) || 'var(--bg-warm)'};overflow:hidden;position:relative;">
                            ${item.custom ? '<span style="font-family:var(--serif);font-size:32px;color:var(--accent);">вљ™</span>' : pcSvg(item, false)}
                        </div>
                        <div>
                            <div class="cart-item-cat">${item.catName}</div>
                            <div class="cart-item-name">${item.name}</div>
                            ${item.custom ? `<div style="font-size:12px;color:var(--ink-muted);margin-bottom:12px;">${item.specs.slice(0,2).join(' В· ')}...</div>` : ''}
                            <div class="qty-control">
                                <button class="qty-btn" onclick="changeQty('${item.id}', -1)">в€’</button>
                                <span class="qty-val">${item.qty}</span>
                                <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                            </div>
                        </div>
                        <div class="cart-item-right">
                            <div class="cart-item-price">${formatPrice(item.price * item.qty)} в‚Ѕ</div>
                            <a class="cart-item-remove" onclick="removeItem('${item.id}')">РЈРґР°Р»РёС‚СЊ</a>
                        </div>
                    </div>
                `).join('')}

                <div class="checkpoints-section">
                    <div class="checkpoints-title">Р§С‚Рѕ РІРєР»СЋС‡РёС‚СЊ РІ Р·Р°РєР°Р·</div>
                    <div class="checkpoints-list">${cpHtml}</div>
                </div>
            </div>
            <div class="cart-summary">
                <h3>РС‚РѕРіРѕ</h3>
                <div class="summary-row"><span>РўРѕРІР°СЂС‹ (${cart.reduce((s,i)=>s+i.qty,0)})</span><span>${formatPrice(subtotal)} в‚Ѕ</span></div>
                ${cpTotal > 0 ? `<div class="summary-row"><span>Р”РѕРї. СѓСЃР»СѓРіРё</span><span>+${formatPrice(cpTotal)} в‚Ѕ</span></div>` : ''}
                ${assembly > 0 ? `<div class="summary-row"><span>РЎР±РѕСЂРєР° + С‚РµСЃС‚</span><span>${formatPrice(assembly)} в‚Ѕ</span></div>` : ''}
                <div class="summary-row"><span>Р”РѕСЃС‚Р°РІРєР°</span><span>${delivery === 0 ? 'Р‘РµСЃРїР»Р°С‚РЅРѕ' : '~' + formatPrice(delivery) + ' в‚Ѕ'}</span></div>
                ${delivery > 0 ? `<div style="font-size:12px;color:var(--ink-muted);margin-top:4px;">РћСЂРёРµРЅС‚РёСЂРѕРІРѕС‡РЅРѕ В· РёС‚РѕРі СЂР°СЃСЃС‡РёС‚Р°РµС‚ РўРљ. Р”Рѕ Р±РµСЃРїР»Р°С‚РЅРѕР№ РґРѕСЃС‚Р°РІРєРё: ${formatPrice(100000-subtotal)} в‚Ѕ</div>` : ''}
                <div class="summary-row total"><span>Рљ РѕРїР»Р°С‚Рµ</span><span>${formatPrice(total)} в‚Ѕ</span></div>
                <button class="btn btn-primary btn-arrow" onclick="checkout()">РћС„РѕСЂРјРёС‚СЊ Р·Р°РєР°Р·</button>
                <p style="font-size:11px;color:var(--ink-muted);text-align:center;margin-top:16px;font-family:var(--mono);letter-spacing:0.05em;">РЎР‘РћР РљРђ ${totalDays}вЂ“${totalDays + 1} Р РђР‘РћР§РРҐ Р”РќР•Р™</p>
            </div>
        </div>
    `;
}

// ============= РњРћР”РђР›РљРђ =============
function checkout() {
    if (cart.length === 0) return;
    document.getElementById('checkout-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = subtotal >= 100000 ? 0 : 1500;
    document.getElementById('modal-total').textContent = formatPrice(subtotal + delivery) + ' в‚Ѕ';
    document.getElementById('modal-items-count').textContent = cart.reduce((s,i) => s+i.qty, 0);
    toggleAddressFields();
}

function toggleAddressFields() {
    const val = document.querySelector('input[name="delivery"]:checked')?.value;
    const section = document.getElementById('address-section');
    if (!section) return;
    if (val === 'pickup') {
        section.style.display = 'none';
    } else {
        section.style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('checkout-modal').classList.remove('show');
    document.body.style.overflow = '';
    const form = document.getElementById('checkout-form');
    const success = document.getElementById('checkout-success');
    if (form) form.style.display = 'block';
    if (success) success.style.display = 'none';
    const btn = form ? form.querySelector('button[type="submit"]') : null;
    if (btn) { btn.disabled = false; btn.textContent = 'РћС„РѕСЂРјРёС‚СЊ Р·Р°РєР°Р·'; }
    if (form) form.reset();
}

function submitOrder(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'РћС„РѕСЂРјР»СЏРµРј...';
    
    setTimeout(() => {
        document.getElementById('checkout-form').style.display = 'none';
        document.getElementById('checkout-success').style.display = 'block';
        const orderNum = 'ER-' + Date.now().toString().slice(-6);
        document.getElementById('order-num').textContent = orderNum;
        cart = [];
        saveCart();
        updateCartCount();
    }, 1200);
}

function finishCheckout() {
    closeModal();
    document.getElementById('checkout-form').style.display = 'block';
    document.getElementById('checkout-success').style.display = 'none';
    document.getElementById('checkout-form').reset();
    const btn = document.querySelector('#checkout-form button[type="submit"]');
    btn.disabled = false;
    btn.textContent = 'РћС„РѕСЂРјРёС‚СЊ Р·Р°РєР°Р·';
    renderCart();
    nav('home');
}

function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
}

// ============= РЈРўРР›РРўР« =============
function formatPrice(n) { return n.toLocaleString('ru-RU').replace(/,/g, ' '); }

function showToast(msg, isError) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    if (isError) t.style.background = 'var(--accent)';
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.style.background = '', 400);
    }, 2500);
}

// ============= РРќРР¦РРђР›РР—РђР¦РРЇ =============
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('home-products', PRODUCTS.slice(0, 4));
    renderFilters();
    setFilter('all');
    updateCartCount();
    nav('home');
    
    document.getElementById('hero-pc-svg').innerHTML = pcSvg(PRODUCTS[0], false);

    document.getElementById('contactForm').addEventListener('submit', e => {
        e.preventDefault();
        const status = document.getElementById('formStatus');
        status.textContent = 'вЏі РћС‚РїСЂР°РІРєР°...';
        status.style.color = 'var(--ink-muted)';
        setTimeout(() => {
            status.textContent = 'вњ“ РћС‚РїСЂР°РІР»РµРЅРѕ! РЎРІСЏР¶РµРјСЃСЏ РІ С‚РµС‡РµРЅРёРµ С‡Р°СЃР°.';
            status.style.color = 'var(--green)';
            e.target.reset();
        }, 800);
    });

    document.querySelectorAll('input[name="delivery"]').forEach(r => {
        r.addEventListener('change', toggleAddressFields);
    });
    
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('checkout-modal');
            if (modal.classList.contains('show')) closeModal();
        }
    });
    
    if (typeof initConfigurator === 'function') initConfigurator();

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => observer.observe(el));
    }

    // Add stagger to product cards
    document.querySelectorAll('.products-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.product-card');
        cards.forEach((card, i) => { card.style.animationDelay = `${i * 80}ms`; });
    });
});

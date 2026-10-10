/*
 * Ponni Drops website: product drawings, English / Tamil switch, the
 * customer order form, the dealership form, WhatsApp / call buttons, the
 * "message ready" popup, and the scroll and 3D-tilt effects.
 * The WebGL hero bottle is in scene3d.js.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  const CFG = window.PONNI_SITE || {};
  const M = window.PonniMessages;
  const I18N = window.PonniI18n;
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Bottle drawings ---------- */

  function petBottle(label) {
    return `<svg viewBox="0 0 40 122" class="bottle-svg">
      <rect x="14" y="0" width="12" height="9" rx="2" fill="url(#g-cap)"/>
      <rect x="12" y="9" width="16" height="3" rx="1" fill="#0f5a3f"/>
      <path d="M15 12h10v6c0 8 11 10 11 20v74q0 8-6 8H10q-6 0-6-8V38c0-10 11-12 11-20z" fill="url(#g-water)" stroke="#7cc9b0" stroke-width=".6"/>
      <path d="M5 50h30M5 104h30" stroke="#8fd3bd" stroke-width=".8" opacity=".8"/>
      <rect x="4" y="60" width="32" height="30" fill="url(#g-label)"/>
      <text x="20" y="73" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="800" font-size="6" fill="#fff">PONNI</text>
      <text x="20" y="80" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="700" font-size="4.4" fill="#bff5dc" letter-spacing=".4">DROPS</text>
      <text x="20" y="87" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="700" font-size="3.6" fill="#fff">${label}</text>
      <path d="M8 40c-1 6-1 60 0 68" stroke="#fff" stroke-width="2.2" opacity=".75" stroke-linecap="round" fill="none"/>
    </svg>`;
  }

  function jar5() {
    return `<svg viewBox="0 0 64 104" class="bottle-svg">
      <rect x="20" y="0" width="16" height="9" rx="2" fill="url(#g-cap)"/>
      <rect x="22" y="9" width="12" height="7" fill="#9fdcc8"/>
      <path d="M38 18h10q8 0 8 8v4h-6v-4q0-2-2-2h-8z" fill="#9fdcc8" stroke="#7cc9b0" stroke-width=".6"/>
      <path d="M10 16h44q6 0 6 8l2 70q0 10-10 10H12q-10 0-10-10l2-70q0-8 6-8z" fill="url(#g-water)" stroke="#7cc9b0" stroke-width=".6"/>
      <rect x="6" y="44" width="52" height="32" rx="2" fill="url(#g-label)"/>
      <text x="32" y="58" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="800" font-size="8" fill="#fff">PONNI</text>
      <text x="32" y="66" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="700" font-size="5.5" fill="#bff5dc" letter-spacing=".5">DROPS</text>
      <text x="32" y="73" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="700" font-size="5" fill="#fff">5 L</text>
      <path d="M9 24c-2 10-2 62 0 72" stroke="#fff" stroke-width="2.6" opacity=".7" stroke-linecap="round" fill="none"/>
    </svg>`;
  }

  function can20() {
    return `<svg viewBox="0 0 80 124" class="bottle-svg">
      <rect x="28" y="0" width="24" height="9" rx="3" fill="url(#g-cap)"/>
      <rect x="31" y="9" width="18" height="9" fill="#7fd0c0"/>
      <path d="M14 18h52q10 0 10 12v84q0 10-10 10H14q-10 0-10-10V30q0-12 10-12z" fill="url(#g-can)" stroke="#5fb9a6" stroke-width=".6"/>
      <path d="M4 40h72M4 98h72" stroke="#4fae99" stroke-width="2" opacity=".55"/>
      <rect x="10" y="52" width="60" height="36" rx="3" fill="url(#g-label)"/>
      <text x="40" y="67" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="800" font-size="10" fill="#fff">PONNI</text>
      <text x="40" y="76" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="700" font-size="6.5" fill="#bff5dc" letter-spacing=".6">DROPS</text>
      <text x="40" y="84" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="700" font-size="5.5" fill="#fff">20 LITRE</text>
      <path d="M11 28c-2 14-2 70 0 86" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round" fill="none"/>
    </svg>`;
  }

  // Height (in % of the tallest) so the line-up shows real relative sizes.
  const ART = {
    '300ml': { h: 40, svg: () => petBottle('300 ml') },
    '500ml': { h: 50, svg: () => petBottle('500 ml') },
    '1l': { h: 64, svg: () => petBottle('1 LITRE') },
    '2l': { h: 80, svg: () => petBottle('2 LITRE') },
    '5l': { h: 70, svg: jar5 },
    '20l': { h: 100, svg: can20 },
  };


  /* ---------- Language ---------- */

  let lang = 'en';
  const english = new Map(); // element → its English text, read once from the page

  function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ta' || q === 'en') return q;
    try {
      const saved = localStorage.getItem('ponni-lang');
      if (saved === 'ta' || saved === 'en') return saved;
    } catch (e) { /* storage blocked */ }
    return /^ta\b/i.test(navigator.language || '') ? 'ta' : 'en';
  }

  const ui = () => I18N.UI[lang];

  function applyLang(next, save) {
    lang = next === 'ta' ? 'ta' : 'en';
    document.documentElement.lang = lang;
    document.body.classList.toggle('lang-ta', lang === 'ta');
    const ta = I18N.ta;
    const set = (attr, apply) => $$(`[${attr}]`).forEach((el) => {
      const key = el.getAttribute(attr);
      const id = el;
      if (!english.has(id)) english.set(id, {});
      const store = english.get(id);
      if (!(attr in store)) store[attr] = apply(el);
      const value = lang === 'ta' && ta[key] != null ? ta[key] : store[attr];
      apply(el, value);
    });
    set('data-i18n', (el, v) => (v === undefined ? el.textContent : (el.textContent = v)));
    set('data-i18n-html', (el, v) => (v === undefined ? el.innerHTML : (el.innerHTML = v)));
    set('data-i18n-ph', (el, v) => (v === undefined ? el.placeholder : (el.placeholder = v)));
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    if (save) { try { localStorage.setItem('ponni-lang', lang); } catch (e) { /* storage blocked */ } }
    renderProducts();
    renderQtyLabels();
    renderChips();
    setupContactText();
    refreshPreviews();
    $$('.form-card').forEach((f) => $$('[data-err]', f).forEach((p) => { p.textContent = ''; }));
  }

  function setupLang() {
    $$('[data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang, true)));
  }

  /* ---------- Products ---------- */

  const sizeName = (p) => (p.size === '1/2 L' ? ui().half : p.size);

  function renderLineup() {
    const lineup = $('#hero-lineup');
    lineup.innerHTML = M.PRODUCTS.map((p, i) =>
      `<div class="lu-item" style="--h:${ART[p.id].h}%;--i:${i}">${ART[p.id].svg()}</div>`).join('');
  }

  function renderProducts() {
    const grid = $('#product-grid');
    const first = !grid.children.length;
    grid.innerHTML = M.PRODUCTS.map((p, i) => `
      <article class="product glass-light-card${first ? '' : ' in'}" data-reveal="flip" style="--d:${i % 3}" data-tilt>
        <span class="glare" aria-hidden="true"></span>
        <div class="p-art"><div class="p-bottle" style="--h:${ART[p.id].h}%">${ART[p.id].svg()}</div></div>
        <div class="p-body">
          <h3>${esc(sizeName(p))}</h3>
          <p class="pack">${esc(p.pack[lang])}</p>
          <p class="use">${esc(p.use[lang])}</p>
          <button type="button" class="btn btn-sm btn-gloss" data-add="${p.id}">${esc(ui().orderThis)}</button>
        </div>
      </article>`).join('');
    if (first) observeReveals(grid);
    setupTilt(grid);
  }

  /* ---------- Contact links ---------- */

  const waNumber = String(CFG.whatsapp || '').replace(/\D/g, '');
  const telNumber = String(CFG.phone || '').replace(/[^\d+]/g, '');

  function setupContact() {
    if (telNumber) {
      $$('.js-call').forEach((a) => { a.href = `tel:${telNumber}`; });
    } else {
      // No phone number set yet: hide call buttons, keep the contact card as a note.
      $$('.js-call').forEach((a) => { if (!a.classList.contains('js-call-card')) a.hidden = true; });
      const card = $('.js-call-card');
      if (card) card.removeAttribute('href');
    }
    $('#contact-hours').textContent = CFG.hours || '';
    $('#year').textContent = new Date().getFullYear();
  }

  // Parts of the contact details that change with the language.
  function setupContactText() {
    const chatUrl = M.whatsappUrl(waNumber, ui().waHello);
    $$('.js-wa-chat').forEach((a) => { a.href = chatUrl; });
    if (telNumber) $$('.js-phone-label').forEach((el) => { el.textContent = CFG.phoneLabel || CFG.phone; });
    if (waNumber) $$('.js-wa-label').forEach((el) => { el.textContent = `+${waNumber}`; });

    const extra = [CFG.address && `📍 ${CFG.address}`, CFG.email && `✉️ ${CFG.email}`].filter(Boolean);
    if (extra.length || CFG.mapUrl) {
      const box = $('#contact-extra');
      box.innerHTML = extra.map(esc).join('<br>') +
        (CFG.mapUrl ? `${extra.length ? '<br>' : ''}<a href="${esc(CFG.mapUrl)}" target="_blank" rel="noopener">${esc(ui().map)}</a>` : '');
      box.hidden = false;
    }
    const lic = [CFG.fssai && `${ui().fssai} ${CFG.fssai}`, CFG.bis && `${ui().bis} ${CFG.bis}`].filter(Boolean);
    if (lic.length) {
      const el = $('#licences');
      el.textContent = lic.join(' · ');
      el.hidden = false;
    }
  }

  /* ---------- Tabs ---------- */

  function showTab(name, focus) {
    $$('[role="tab"]').forEach((t) => {
      const on = t.dataset.tab === name;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    $('#panel-customer').hidden = name !== 'customer';
    $('#panel-dealer').hidden = name !== 'dealer';
    $$(`#panel-${name} [data-reveal]`).forEach((el) => el.classList.add('in'));
  }

  function setupTabs() {
    $$('[role="tab"]').forEach((t) => {
      t.addEventListener('click', () => showTab(t.dataset.tab));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          showTab(t.dataset.tab === 'customer' ? 'dealer' : 'customer', true);
        }
      });
    });
    // Any link with data-tab opens that tab (nav, hero, footer).
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-tab]');
      if (a) showTab(a.dataset.tab);
    });
    if (/dealer/i.test(location.hash)) showTab('dealer');
  }

  /* ---------- Form helpers ---------- */

  function readForm(form) {
    const d = {};
    $$('input[name], select[name], textarea[name]', form).forEach((el) => {
      if (el.type === 'checkbox') return;
      if (el.type === 'radio') { if (el.checked) d[el.name] = el.value; return; }
      d[el.name] = el.value;
    });
    return d;
  }

  function showErrors(form, errors) {
    $$('[data-err]', form).forEach((p) => { p.textContent = errors[p.dataset.err] || ''; });
    $$('input, textarea, select', form).forEach((el) => {
      el.toggleAttribute('aria-invalid', Boolean(errors[el.name]));
    });
    const first = Object.keys(errors)[0];
    if (first) {
      const target = $(`[name="${first}"]`, form) || $(`[data-err="${first}"]`, form);
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (target.focus) target.focus({ preventScroll: true });
    }
  }

  // Shows the message as WhatsApp does: *bold* and line breaks.
  function toBubble(text) {
    return esc(text).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  }

  const previews = [];
  function refreshPreviews() { previews.forEach((fn) => fn()); }

  /* ---------- Customer form ---------- */

  const qty = {};

  function renderQtyLabels() {
    M.PRODUCTS.forEach((p) => {
      const box = $(`.qty[data-id="${p.id}"]`);
      if (!box) return;
      $('.qty-info b', box).textContent = sizeName(p);
      $('.qty-info small', box).textContent = p.pack[lang];
      $('input', box).setAttribute('aria-label', `${p.size} (${p.unit === 'can' ? ui().cans : ui().boxes})`);
    });
  }

  function setupCustomer() {
    const form = $('#customer-form');
    const grid = $('#qty-grid');
    grid.innerHTML = M.PRODUCTS.map((p) => `
      <div class="qty" data-id="${p.id}">
        <div class="qty-art" style="--h:${ART[p.id].h}%">${ART[p.id].svg()}</div>
        <div class="qty-info"><b></b><small></small></div>
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="− ${esc(p.size)}">−</button>
          <input type="number" inputmode="numeric" min="0" max="9999" value="0" data-qty="${p.id}">
          <button type="button" data-step="1" aria-label="+ ${esc(p.size)}">+</button>
        </div>
      </div>`).join('');

    const setQty = (id, n) => {
      qty[id] = Math.max(0, Math.min(9999, Math.floor(Number(n) || 0)));
      const box = $(`.qty[data-id="${id}"]`, grid);
      $('input', box).value = qty[id];
      box.classList.toggle('on', qty[id] > 0);
      box.classList.remove('bump');
      void box.offsetWidth; // restart the bump animation
      box.classList.add('bump');
      $('#empties-field').hidden = !(qty['20l'] > 0);
      update();
    };

    grid.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      const id = b.closest('.qty').dataset.id;
      setQty(id, (qty[id] || 0) + Number(b.dataset.step));
    });
    grid.addEventListener('input', (e) => {
      if (e.target.dataset.qty) {
        qty[e.target.dataset.qty] = Math.max(0, Math.floor(Number(e.target.value) || 0));
        e.target.closest('.qty').classList.toggle('on', qty[e.target.dataset.qty] > 0);
        $('#empties-field').hidden = !(qty['20l'] > 0);
        update();
      }
    });
    grid.addEventListener('change', (e) => { if (e.target.dataset.qty) setQty(e.target.dataset.qty, e.target.value); });

    // "Order this" on a product card.
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-add]');
      if (!b) return;
      showTab('customer');
      setQty(b.dataset.add, (qty[b.dataset.add] || 0) + 1);
      $('#order').scrollIntoView({ behavior: 'smooth' });
      toast(ui().added(sizeName(M.PRODUCTS.find((p) => p.id === b.dataset.add))));
    });

    const date = $('#c-date');
    const t = new Date();
    date.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;

    const data = () => Object.assign(readForm(form), { qty: Object.assign({}, qty) });
    function update() { $('#customer-preview').innerHTML = toBubble(M.customerMessage(data(), 'PD-O-…', lang)); }
    previews.push(update);
    form.addEventListener('input', (e) => { if (!e.target.dataset.qty) update(); });
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = data();
      const errors = M.validateCustomer(d, lang);
      showErrors(form, errors);
      if (Object.keys(errors).length) return;
      send('customer', d);
    });
    copyButton('customer', () => M.customerMessage(data(), '', lang));
  }

  /* ---------- Dealer form ---------- */

  function renderChips() {
    const types = $('#dealer-types');
    const chosen = ($('input[name="type"]:checked', types) || {}).value || 'dealer';
    types.innerHTML = M.DEALER_TYPES.map((t) => `
      <label class="chip"><input type="radio" name="type" value="${t.id}"${t.id === chosen ? ' checked' : ''}><span>${esc(t[lang])}</span></label>`).join('');
    const sizes = $('#dealer-sizes');
    if (!sizes.children.length) {
      sizes.innerHTML = M.PRODUCTS.map((p) => `
        <label class="chip"><input type="checkbox" value="${p.id}" data-size checked><span>${esc(p.size)}</span></label>`).join('');
    }
  }

  function setupDealer() {
    const form = $('#dealer-form');
    const data = () => Object.assign(readForm(form), { sizes: $$('[data-size]:checked', form).map((c) => c.value) });
    const update = () => { $('#dealer-preview').innerHTML = toBubble(M.dealerMessage(data(), 'PD-D-…', lang)); };
    previews.push(update);
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = data();
      const errors = M.validateDealer(d, lang);
      showErrors(form, errors);
      if (Object.keys(errors).length) return;
      send('dealer', d);
    });
    copyButton('dealer', () => M.dealerMessage(data(), '', lang));
  }

  /* ---------- Send / received ---------- */

  let lastFocus = null;

  function send(kind, d) {
    const ref = M.makeRef(kind);
    const text = kind === 'dealer' ? M.dealerMessage(d, ref, lang) : M.customerMessage(d, ref, lang);
    const url = M.whatsappUrl(waNumber, text);
    window.open(url, '_blank', 'noopener');

    $('#sent-ref').textContent = ref;
    $('#sent-open').href = url;
    $('#sent-title').textContent = kind === 'dealer' ? ui().sentDealer : ui().sentOrder;
    try { localStorage.setItem('ponni-last-ref', ref); } catch (e) { /* storage blocked: not needed */ }
    openModal();
  }

  function openModal() {
    const modal = $('#sent-modal');
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    $('[data-close]', modal).focus();
  }

  function closeModal() {
    $('#sent-modal').hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  function setupModal() {
    const modal = $('#sent-modal');
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  }

  function copyButton(kind, getText) {
    $(`[data-copy="${kind}"]`).addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(getText());
        toast(ui().copied);
      } catch (e) {
        toast(ui().copyFail);
      }
    });
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  /* ---------- Header ---------- */

  function setupHeader() {
    const btn = $('.menu-btn');
    const nav = $('#nav');
    btn.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- Scroll effects ---------- */

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let revealObserver = null;

  // Fade / slide / flip elements in as they scroll into view.
  function observeReveals(root) {
    const items = $$('[data-reveal]', root).filter((el) => !el.classList.contains('in'));
    if (reduceMotion || !('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in')); return; }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
      }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    }
    items.forEach((el) => revealObserver.observe(el));
  }

  // Count numbers up when they first appear.
  function setupCounters() {
    const els = $$('[data-count]');
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1400);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  // One scroll handler for: progress bar, header, parallax, quality flow line.
  function setupScroll() {
    const head = $('.site-head');
    const bar = $('.scroll-bar');
    const parallax = $$('[data-parallax]');
    const flow = $('#flow');
    const steps = $$('#flow .process li');
    let ticking = false;

    function onFrame() {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      head.classList.toggle('scrolled', y > 10);
      document.documentElement.style.setProperty('--scroll', String(y));

      // Parallax only while the hero is on screen, and not on phones.
      if (!reduceMotion && window.innerWidth > 860 && y < vh * 1.2) {
        parallax.forEach((el) => {
          const speed = Number(el.dataset.parallax) || 0;
          el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
        });
      }

      if (flow) {
        const r = flow.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh * 0.75 - r.top) / (r.height || 1)));
        flow.style.setProperty('--flow', p.toFixed(3));
        steps.forEach((li, i) => li.classList.toggle('lit', p >= (i + 0.35) / steps.length));
      }
    }
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    onFrame();
  }

  // Cards lean towards the pointer in 3D, with a moving light glare.
  function setupTilt(root) {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('[data-tilt]', root).forEach((el) => {
      if (el.dataset.tiltReady) return;
      el.dataset.tiltReady = '1';
      if (!$('.glare', el)) el.insertAdjacentHTML('afterbegin', '<span class="glare" aria-hidden="true"></span>');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', `${((0.5 - y) * 10).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${((x - 0.5) * 12).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
        el.classList.add('tilting');
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Bubbles rising behind the quality section.
  function setupBubbles() {
    const box = $('.bubbles-bg');
    if (!box || reduceMotion) return;
    box.innerHTML = Array.from({ length: 22 }, () => {
      const s = 6 + Math.random() * 26;
      return `<i style="left:${(Math.random() * 100).toFixed(1)}%;width:${s.toFixed(0)}px;height:${s.toFixed(0)}px;animation-duration:${(9 + Math.random() * 12).toFixed(1)}s;animation-delay:-${(Math.random() * 20).toFixed(1)}s"></i>`;
    }).join('');
  }

  // Second copy of the trust strip so the marquee loops without a gap.
  const set = $('.marquee-set');
  if (set) { const copy = set.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); set.after(copy); }

  renderLineup();
  setupCustomer();
  setupDealer();
  setupContact();
  setupLang();
  applyLang(pickLang(), false);
  setupHeader();
  setupTabs();
  setupModal();
  observeReveals(document);
  setupCounters();
  setupScroll();
  setupTilt(document);
  setupBubbles();
})();

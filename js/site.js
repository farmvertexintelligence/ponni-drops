/*
 * Ponni Drops website: product drawings, the customer order form, the
 * dealership form, WhatsApp / call buttons and the "message ready" popup.
 */
(function () {
  'use strict';

  const CFG = window.PONNI_SITE || {};
  const M = window.PonniMessages;
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

  function renderArt() {
    const lineup = $('#hero-lineup');
    if (lineup) {
      lineup.innerHTML = M.PRODUCTS.map((p, i) =>
        `<div class="lu-item" style="--h:${ART[p.id].h}%;--i:${i}">${ART[p.id].svg()}</div>`).join('');
    }
    const grid = $('#product-grid');
    if (grid) {
      grid.innerHTML = M.PRODUCTS.map((p) => `
        <article class="product">
          <div class="p-art"><div class="p-bottle" style="--h:${ART[p.id].h}%">${ART[p.id].svg()}</div></div>
          <div class="p-body">
            <h3>${esc(p.size === '1/2 L' ? '½ Litre' : p.size)}</h3>
            <p class="pack">${esc(p.pack)}</p>
            <p class="use">${esc(p.use)}</p>
            <button type="button" class="btn btn-sm btn-gloss" data-add="${p.id}">Order this</button>
          </div>
        </article>`).join('');
    }
  }

  /* ---------- Contact links ---------- */

  const waNumber = String(CFG.whatsapp || '').replace(/\D/g, '');
  const telNumber = String(CFG.phone || '').replace(/[^\d+]/g, '');

  function setupContact() {
    const chatUrl = M.whatsappUrl(waNumber, 'Hello Ponni Drops, I would like to know more.');
    $$('.js-wa-chat').forEach((a) => { a.href = chatUrl; });

    if (telNumber) {
      $$('.js-call').forEach((a) => { a.href = `tel:${telNumber}`; });
      $$('.js-phone-label').forEach((el) => { el.textContent = CFG.phoneLabel || CFG.phone; });
    } else {
      // No phone number set yet: hide call buttons, keep the contact card as a note.
      $$('.js-call').forEach((a) => { if (!a.classList.contains('js-call-card')) a.hidden = true; });
      const card = $('.js-call-card');
      if (card) card.removeAttribute('href');
      if (waNumber) $$('.js-wa-chat .js-phone-label').forEach((el) => { el.textContent = `+${waNumber}`; });
    }

    $('#contact-hours').textContent = CFG.hours || '';
    const extra = [CFG.address && `📍 ${CFG.address}`, CFG.email && `✉️ ${CFG.email}`].filter(Boolean);
    if (extra.length || CFG.mapUrl) {
      const box = $('#contact-extra');
      box.innerHTML = extra.map(esc).join('<br>') +
        (CFG.mapUrl ? `${extra.length ? '<br>' : ''}<a href="${esc(CFG.mapUrl)}" target="_blank" rel="noopener">Open in Google Maps ↗</a>` : '');
      box.hidden = false;
    }
    const lic = [CFG.fssai && `FSSAI Lic. No. ${CFG.fssai}`, CFG.bis && `BIS Licence ${CFG.bis}`].filter(Boolean);
    if (lic.length) {
      const el = $('#licences');
      el.textContent = lic.join(' · ');
      el.hidden = false;
    }
    $('#year').textContent = new Date().getFullYear();
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

  /* ---------- Customer form ---------- */

  const qty = {};

  function setupCustomer() {
    const form = $('#customer-form');
    const grid = $('#qty-grid');
    grid.innerHTML = M.PRODUCTS.map((p) => `
      <div class="qty" data-id="${p.id}">
        <div class="qty-art" style="--h:${ART[p.id].h}%">${ART[p.id].svg()}</div>
        <div class="qty-info"><b>${esc(p.size)}</b><small>${esc(p.pack)}</small></div>
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="One less ${esc(p.size)}">−</button>
          <input type="number" inputmode="numeric" min="0" max="9999" value="0" aria-label="${esc(p.size)} quantity (${p.unit === 'can' ? 'cans' : 'boxes'})" data-qty="${p.id}">
          <button type="button" data-step="1" aria-label="One more ${esc(p.size)}">+</button>
        </div>
      </div>`).join('');

    const setQty = (id, n) => {
      qty[id] = Math.max(0, Math.min(9999, Math.floor(Number(n) || 0)));
      const box = $(`.qty[data-id="${id}"]`, grid);
      $('input', box).value = qty[id];
      box.classList.toggle('on', qty[id] > 0);
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
      toast(`${M.PRODUCTS.find((p) => p.id === b.dataset.add).size} added to your order`);
    });

    const date = $('#c-date');
    const t = new Date();
    date.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;

    const data = () => Object.assign(readForm(form), { qty: Object.assign({}, qty) });
    function update() { $('#customer-preview').innerHTML = toBubble(M.customerMessage(data(), 'PD-O-…')); }
    form.addEventListener('input', (e) => { if (!e.target.dataset.qty) update(); });
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = data();
      const errors = M.validateCustomer(d);
      showErrors(form, errors);
      if (Object.keys(errors).length) return;
      send('customer', d);
    });
    copyButton('customer', () => M.customerMessage(data(), ''));
    update();
  }

  /* ---------- Dealer form ---------- */

  function setupDealer() {
    const form = $('#dealer-form');
    $('#dealer-types').innerHTML = M.DEALER_TYPES.map((t, i) => `
      <label class="chip"><input type="radio" name="type" value="${esc(t)}"${i === 0 ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('');
    $('#dealer-sizes').innerHTML = M.PRODUCTS.map((p) => `
      <label class="chip"><input type="checkbox" value="${p.id}" data-size checked><span>${esc(p.size)}</span></label>`).join('');

    const data = () => Object.assign(readForm(form), { sizes: $$('[data-size]:checked', form).map((c) => c.value) });
    const update = () => { $('#dealer-preview').innerHTML = toBubble(M.dealerMessage(data(), 'PD-D-…')); };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = data();
      const errors = M.validateDealer(d);
      showErrors(form, errors);
      if (Object.keys(errors).length) return;
      send('dealer', d);
    });
    copyButton('dealer', () => M.dealerMessage(data(), ''));
    update();
  }

  /* ---------- Send / received ---------- */

  let lastFocus = null;

  function send(kind, d) {
    const ref = M.makeRef(kind);
    const text = kind === 'dealer' ? M.dealerMessage(d, ref) : M.customerMessage(d, ref);
    const url = M.whatsappUrl(waNumber, text);
    window.open(url, '_blank', 'noopener');

    $('#sent-ref').textContent = ref;
    $('#sent-open').href = url;
    $('#sent-title').textContent = kind === 'dealer' ? 'Enquiry ready in WhatsApp' : 'Order ready in WhatsApp';
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
      const text = getText();
      try {
        await navigator.clipboard.writeText(text);
        toast('Message copied');
      } catch (e) {
        toast('Could not copy. Please select the text and copy.');
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
    const head = $('.site-head');
    const btn = $('.menu-btn');
    const nav = $('#nav');
    const onScroll = () => head.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  renderArt();
  setupContact();
  setupHeader();
  setupTabs();
  setupCustomer();
  setupDealer();
  setupModal();
})();

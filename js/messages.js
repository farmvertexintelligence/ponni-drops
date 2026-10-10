/*
 * Ready-made WhatsApp messages for the Ponni Drops website.
 *
 * Pure functions only: no DOM. Loaded as a classic <script> in the browser
 * (exposes window.PonniMessages) and via require() in Node for tests.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PonniMessages = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Same sizes and packs as the billing app (js/store.js).
  const PRODUCTS = [
    { id: '300ml', size: '300 ml', pack: 'Box of 30', unit: 'box', use: 'Functions, meetings, travel' },
    { id: '500ml', size: '1/2 L', pack: 'Box of 24', unit: 'box', use: 'On the go, shops, events' },
    { id: '1l', size: '1 L', pack: 'Box of 12', unit: 'box', use: 'Daily carry, offices, restaurants' },
    { id: '2l', size: '2 L', pack: 'Box of 6', unit: 'box', use: 'Family trips, dining tables' },
    { id: '5l', size: '5 L', pack: 'Single can', unit: 'can', use: 'Small homes, picnics, shops' },
    { id: '20l', size: '20 L', pack: 'Returnable can', unit: 'can', use: 'Homes, offices, dispensers' },
  ];

  const DEALER_TYPES = ['Dealer', 'Distributor', 'Retail seller (shop)', 'Super stockist'];

  function clean(v) {
    return String(v == null ? '' : v).replace(/[\r\t]+/g, ' ').replace(/[ ]{2,}/g, ' ').trim();
  }

  // 10-digit Indian mobile from "+91 98765 43210", "098765-43210" etc., or '' if not valid.
  function normalizeMobile(v) {
    let d = String(v || '').replace(/\D/g, '');
    if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
    else if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
    return /^[6-9]\d{9}$/.test(d) ? d : '';
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  // 'YYYY-MM-DD' (date input value) → 'dd-mm-yy'.
  function formatDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    return m ? `${m[3]}-${m[2]}-${m[1].slice(2)}` : '';
  }

  // Reference the visitor and the office can quote, e.g. PD-O-101026-4821.
  function makeRef(kind, date, rand) {
    const d = date || new Date();
    const r = rand == null ? Math.floor(Math.random() * 9000) + 1000 : rand;
    return `PD-${kind === 'dealer' ? 'D' : 'O'}-${pad(d.getDate())}${pad(d.getMonth() + 1)}${String(d.getFullYear()).slice(2)}-${r}`;
  }

  function qtyText(product, qty) {
    if (product.unit === 'can') return `${qty} ${qty === 1 ? 'can' : 'cans'}`;
    return `${qty} ${qty === 1 ? 'box' : 'boxes'} (${product.pack.toLowerCase()})`;
  }

  function orderLines(qty) {
    return PRODUCTS
      .map((p) => ({ p, q: Math.max(0, Math.floor(Number((qty || {})[p.id]) || 0)) }))
      .filter((x) => x.q > 0);
  }

  // Returns a list of problems; empty when the order can be sent.
  function validateCustomer(d) {
    const errors = {};
    if (!clean(d.name)) errors.name = 'Please enter your name';
    if (!normalizeMobile(d.phone)) errors.phone = 'Enter a 10-digit mobile number';
    if (!clean(d.address)) errors.address = 'Please enter the delivery address';
    if (!orderLines(d.qty).length) errors.qty = 'Add at least one bottle size';
    return errors;
  }

  function validateDealer(d) {
    const errors = {};
    if (!clean(d.name)) errors.name = 'Please enter your name';
    if (!normalizeMobile(d.phone)) errors.phone = 'Enter a 10-digit mobile number';
    if (!clean(d.city)) errors.city = 'Please enter your town / district';
    if (!clean(d.type)) errors.type = 'Choose how you want to partner';
    return errors;
  }

  function line(label, value) {
    const v = clean(value);
    return v ? `${label}: ${v}` : null;
  }

  function customerMessage(d, ref) {
    const lines = orderLines(d.qty);
    const mobile = normalizeMobile(d.phone);
    const when = [formatDate(d.date), clean(d.slot)].filter(Boolean).join(', ');
    const out = [
      '*PONNI DROPS – Water Order*',
      ref ? `Ref: ${ref}` : null,
      '',
      'Hello, I would like to order Ponni Drops water.',
      '',
      line('👤 Name', d.name),
      line('📞 Mobile', mobile ? `+91 ${mobile}` : d.phone),
      line('🏠 For', d.kind),
      line('📍 Address', d.address),
      line('📌 Area / Pincode', d.area),
      line('🗓️ Delivery', when || 'As early as possible'),
      '',
      '*Order*',
      ...(lines.length ? lines.map((x) => `• ${x.p.size} – ${qtyText(x.p, x.q)}`) : ['• (no sizes chosen yet)']),
    ];
    const empties = Math.max(0, Math.floor(Number(d.empties) || 0));
    if (lines.some((x) => x.p.id === '20l') && empties > 0) out.push(`♻️ Empty 20 L cans to return: ${empties}`);
    if (clean(d.note)) out.push('', line('📝 Note', d.note));
    out.push('', 'Please confirm the order and the amount. Thank you!');
    return out.filter((l) => l !== null).join('\n');
  }

  function dealerMessage(d, ref) {
    const mobile = normalizeMobile(d.phone);
    const sizes = PRODUCTS.filter((p) => (d.sizes || []).includes(p.id)).map((p) => p.size);
    const type = clean(d.type) || 'Dealer';
    const out = [
      '*PONNI DROPS – Dealership Enquiry*',
      ref ? `Ref: ${ref}` : null,
      '',
      `Hello, I am interested in becoming a *${type}* for Ponni Drops packaged drinking water.`,
      '',
      line('👤 Name', d.name),
      line('🏪 Business / shop', d.business),
      line('📞 Mobile', mobile ? `+91 ${mobile}` : d.phone),
      line('📍 Town / District', d.city),
      line('🗺️ Areas I can cover', d.areas),
      line('💼 Current business', d.current),
      line('🏬 Godown / storage', d.storage),
      line('🚚 Delivery vehicle', d.vehicle),
      sizes.length ? `📦 Sizes interested: ${sizes.join(', ')}` : null,
      line('📈 Expected monthly sale', d.volume),
      line('💰 Planned investment', d.investment),
    ];
    if (clean(d.note)) out.push('', line('📝 Message', d.note));
    out.push('', 'Please share the dealer price list and terms. Thank you!');
    return out.filter((l) => l !== null).join('\n');
  }

  // Link that opens WhatsApp with the message typed in. With no number,
  // WhatsApp asks the visitor which chat to send it to.
  function whatsappUrl(number, text) {
    const n = String(number || '').replace(/\D/g, '');
    return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
  }

  return {
    PRODUCTS, DEALER_TYPES, normalizeMobile, formatDate, makeRef, orderLines,
    validateCustomer, validateDealer, customerMessage, dealerMessage, whatsappUrl,
  };
});

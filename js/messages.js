/*
 * Ready-made WhatsApp messages for the Ponni Drops website, in English or
 * Tamil (lang 'en' | 'ta').
 *
 * Pure functions only: no DOM. Loaded as a classic <script> in the browser
 * (exposes window.PonniMessages) and via require() in Node for tests.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PonniMessages = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Same sizes and packs as the billing app.
  const PRODUCTS = [
    { id: '300ml', size: '300 ml', count: 30, unit: 'box', pack: { en: 'Box of 30', ta: '30 பாட்டில் பெட்டி' }, use: { en: 'Functions, meetings, travel', ta: 'விழாக்கள், கூட்டங்கள், பயணம்' } },
    { id: '500ml', size: '1/2 L', count: 24, unit: 'box', pack: { en: 'Box of 24', ta: '24 பாட்டில் பெட்டி' }, use: { en: 'On the go, shops, events', ta: 'வெளியே செல்லும்போது, கடைகள், நிகழ்ச்சிகள்' } },
    { id: '1l', size: '1 L', count: 12, unit: 'box', pack: { en: 'Box of 12', ta: '12 பாட்டில் பெட்டி' }, use: { en: 'Daily carry, offices, restaurants', ta: 'தினசரி பயன்பாடு, அலுவலகங்கள், உணவகங்கள்' } },
    { id: '2l', size: '2 L', count: 6, unit: 'box', pack: { en: 'Box of 6', ta: '6 பாட்டில் பெட்டி' }, use: { en: 'Family trips, dining tables', ta: 'குடும்பப் பயணங்கள், சாப்பாட்டு மேஜை' } },
    { id: '5l', size: '5 L', unit: 'can', pack: { en: 'Single can', ta: 'ஒற்றை கேன்' }, use: { en: 'Small homes, picnics, shops', ta: 'சிறிய குடும்பங்கள், சுற்றுலா, கடைகள்' } },
    { id: '20l', size: '20 L', unit: 'can', pack: { en: 'Returnable can', ta: 'திருப்பித் தரும் கேன்' }, use: { en: 'Homes, offices, dispensers', ta: 'வீடுகள், அலுவலகங்கள், டிஸ்பென்சர்கள்' } },
  ];

  const DEALER_TYPES = [
    { id: 'dealer', en: 'Dealer', ta: 'டீலர்' },
    { id: 'distributor', en: 'Distributor', ta: 'விநியோகஸ்தர்' },
    { id: 'retail', en: 'Retail seller (shop)', ta: 'சில்லறை விற்பனையாளர் (கடை)' },
    { id: 'stockist', en: 'Super stockist', ta: 'சூப்பர் ஸ்டாக்கிஸ்ட்' },
  ];

  const TEXT = {
    en: {
      orderTitle: '*PONNI DROPS – Water Order*',
      orderHello: 'Hello, I would like to order Ponni Drops water.',
      name: '👤 Name', mobile: '📞 Mobile', kind: '🏠 For', address: '📍 Address', area: '📌 Area / Pincode',
      delivery: '🗓️ Delivery', asap: 'As early as possible', order: '*Order*', none: '• (no sizes chosen yet)',
      empties: '♻️ Empty 20 L cans to return', note: '📝 Note',
      orderBye: 'Please confirm the order and the amount. Thank you!',
      box: (q, p) => `${q} ${q === 1 ? 'box' : 'boxes'} (${p.pack.en.toLowerCase()})`,
      can: (q) => `${q} ${q === 1 ? 'can' : 'cans'}`,
      dealerTitle: '*PONNI DROPS – Dealership Enquiry*',
      dealerHello: (t) => `Hello, I am interested in becoming a *${t}* for Ponni Drops packaged drinking water.`,
      business: '🏪 Business / shop', city: '📍 Town / District', areas: '🗺️ Areas I can cover', current: '💼 Current business',
      storage: '🏬 Godown / storage', vehicle: '🚚 Delivery vehicle', sizes: '📦 Sizes interested', volume: '📈 Expected monthly sale',
      investment: '💰 Planned investment', message: '📝 Message',
      dealerBye: 'Please share the dealer price list and terms. Thank you!',
      errName: 'Please enter your name', errPhone: 'Enter a 10-digit mobile number', errAddress: 'Please enter the delivery address',
      errQty: 'Add at least one bottle size', errCity: 'Please enter your town / district', errType: 'Choose how you want to partner',
    },
    ta: {
      orderTitle: '*PONNI DROPS – தண்ணீர் ஆர்டர்*',
      orderHello: 'வணக்கம், எனக்கு பொன்னி டிராப்ஸ் தண்ணீர் ஆர்டர் செய்ய வேண்டும்.',
      name: '👤 பெயர்', mobile: '📞 மொபைல்', kind: '🏠 பயன்பாடு', address: '📍 முகவரி', area: '📌 பகுதி / பின்கோடு',
      delivery: '🗓️ டெலிவரி', asap: 'முடிந்தவரை விரைவில்', order: '*ஆர்டர்*', none: '• (இன்னும் அளவு தேர்வு செய்யவில்லை)',
      empties: '♻️ திருப்பித் தரும் காலி 20 L கேன்கள்', note: '📝 குறிப்பு',
      orderBye: 'ஆர்டரையும் தொகையையும் உறுதிப்படுத்தவும். நன்றி!',
      box: (q, p) => `${q} பெட்டி (${p.pack.ta})`,
      can: (q) => `${q} கேன்`,
      dealerTitle: '*PONNI DROPS – டீலர்ஷிப் விசாரணை*',
      dealerHello: (t) => `வணக்கம், பொன்னி டிராப்ஸ் குடிநீருக்கு *${t}* ஆக இணைய விரும்புகிறேன்.`,
      business: '🏪 நிறுவனம் / கடை', city: '📍 ஊர் / மாவட்டம்', areas: '🗺️ நான் சேவை செய்யும் பகுதிகள்', current: '💼 தற்போதைய தொழில்',
      storage: '🏬 கிடங்கு / சேமிப்பு இடம்', vehicle: '🚚 டெலிவரி வாகனம்', sizes: '📦 விரும்பும் அளவுகள்', volume: '📈 எதிர்பார்க்கும் மாத விற்பனை',
      investment: '💰 திட்டமிட்ட முதலீடு', message: '📝 செய்தி',
      dealerBye: 'டீலர் விலைப் பட்டியலையும் விதிமுறைகளையும் அனுப்பவும். நன்றி!',
      errName: 'உங்கள் பெயரை உள்ளிடவும்', errPhone: '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்', errAddress: 'டெலிவரி முகவரியை உள்ளிடவும்',
      errQty: 'குறைந்தது ஒரு அளவைச் சேர்க்கவும்', errCity: 'உங்கள் ஊர் / மாவட்டத்தை உள்ளிடவும்', errType: 'எப்படி இணைய விரும்புகிறீர்கள் என்பதைத் தேர்வு செய்யவும்',
    },
  };

  const t = (lang) => TEXT[lang] || TEXT.en;

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

  function orderLines(qty) {
    return PRODUCTS
      .map((p) => ({ p, q: Math.max(0, Math.floor(Number((qty || {})[p.id]) || 0)) }))
      .filter((x) => x.q > 0);
  }

  function dealerTypeLabel(id, lang) {
    const dt = DEALER_TYPES.find((x) => x.id === id);
    return dt ? dt[lang] || dt.en : clean(id);
  }

  // Returns { field: problem }; empty when the order can be sent.
  function validateCustomer(d, lang) {
    const T = t(lang);
    const errors = {};
    if (!clean(d.name)) errors.name = T.errName;
    if (!normalizeMobile(d.phone)) errors.phone = T.errPhone;
    if (!clean(d.address)) errors.address = T.errAddress;
    if (!orderLines(d.qty).length) errors.qty = T.errQty;
    return errors;
  }

  function validateDealer(d, lang) {
    const T = t(lang);
    const errors = {};
    if (!clean(d.name)) errors.name = T.errName;
    if (!normalizeMobile(d.phone)) errors.phone = T.errPhone;
    if (!clean(d.city)) errors.city = T.errCity;
    if (!clean(d.type)) errors.type = T.errType;
    return errors;
  }

  function line(label, value) {
    const v = clean(value);
    return v ? `${label}: ${v}` : null;
  }

  function customerMessage(d, ref, lang) {
    const T = t(lang);
    const lines = orderLines(d.qty);
    const mobile = normalizeMobile(d.phone);
    const when = [formatDate(d.date), clean(d.slot)].filter(Boolean).join(', ');
    const out = [
      T.orderTitle,
      ref ? `Ref: ${ref}` : null,
      '',
      T.orderHello,
      '',
      line(T.name, d.name),
      line(T.mobile, mobile ? `+91 ${mobile}` : d.phone),
      line(T.kind, d.kind),
      line(T.address, d.address),
      line(T.area, d.area),
      line(T.delivery, when || T.asap),
      '',
      T.order,
      ...(lines.length ? lines.map((x) => `• ${x.p.size} – ${x.p.unit === 'can' ? T.can(x.q) : T.box(x.q, x.p)}`) : [T.none]),
    ];
    const empties = Math.max(0, Math.floor(Number(d.empties) || 0));
    if (lines.some((x) => x.p.id === '20l') && empties > 0) out.push(`${T.empties}: ${empties}`);
    if (clean(d.note)) out.push('', line(T.note, d.note));
    out.push('', T.orderBye);
    return out.filter((l) => l !== null).join('\n');
  }

  function dealerMessage(d, ref, lang) {
    const T = t(lang);
    const mobile = normalizeMobile(d.phone);
    const sizes = PRODUCTS.filter((p) => (d.sizes || []).includes(p.id)).map((p) => p.size);
    const type = dealerTypeLabel(d.type || 'dealer', lang === 'ta' ? 'ta' : 'en');
    const out = [
      T.dealerTitle,
      ref ? `Ref: ${ref}` : null,
      '',
      T.dealerHello(type),
      '',
      line(T.name, d.name),
      line(T.business, d.business),
      line(T.mobile, mobile ? `+91 ${mobile}` : d.phone),
      line(T.city, d.city),
      line(T.areas, d.areas),
      line(T.current, d.current),
      line(T.storage, d.storage),
      line(T.vehicle, d.vehicle),
      sizes.length ? `${T.sizes}: ${sizes.join(', ')}` : null,
      line(T.volume, d.volume),
      line(T.investment, d.investment),
    ];
    if (clean(d.note)) out.push('', line(T.message, d.note));
    out.push('', T.dealerBye);
    return out.filter((l) => l !== null).join('\n');
  }

  // Link that opens WhatsApp with the message typed in. With no number,
  // WhatsApp asks the visitor which chat to send it to.
  function whatsappUrl(number, text) {
    const n = String(number || '').replace(/\D/g, '');
    return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
  }

  return {
    PRODUCTS, DEALER_TYPES, normalizeMobile, formatDate, makeRef, orderLines, dealerTypeLabel,
    validateCustomer, validateDealer, customerMessage, dealerMessage, whatsappUrl,
  };
});

const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../js/messages.js');

test('mobile numbers are normalised to 10 digits', () => {
  assert.equal(M.normalizeMobile('+91 98765 43210'), '9876543210');
  assert.equal(M.normalizeMobile('098765-43210'), '9876543210');
  assert.equal(M.normalizeMobile('9876543210'), '9876543210');
  assert.equal(M.normalizeMobile('12345'), '');
  assert.equal(M.normalizeMobile('5876543210'), '');
});

test('reference and dates use dd-mm-yy', () => {
  assert.equal(M.makeRef('customer', new Date(2026, 9, 10), 4821), 'PD-O-101026-4821');
  assert.equal(M.makeRef('dealer', new Date(2026, 0, 5), 1000), 'PD-D-050126-1000');
  assert.equal(M.formatDate('2026-10-12'), '12-10-26');
  assert.equal(M.formatDate(''), '');
});

test('customer order needs name, mobile, address and at least one size', () => {
  const errs = M.validateCustomer({ name: '', phone: '12', address: ' ', qty: {} });
  assert.deepEqual(Object.keys(errs).sort(), ['address', 'name', 'phone', 'qty']);
  assert.deepEqual(M.validateCustomer({ name: 'Ravi', phone: '9876543210', address: '12 Main Rd', qty: { '20l': 2 } }), {});
});

test('customer message lists sizes, packs and empty cans', () => {
  const text = M.customerMessage({
    name: 'Ravi', phone: '98765 43210', address: '12 Main Rd', area: '638001', kind: 'Home',
    date: '2026-10-12', slot: 'Morning (7 – 11 am)', empties: 2, note: 'Call first',
    qty: { '20l': 3, '1l': 1, '300ml': 0 },
  }, 'PD-O-101026-4821');
  assert.match(text, /^\*PONNI DROPS – Water Order\*\nRef: PD-O-101026-4821/);
  assert.match(text, /📞 Mobile: \+91 9876543210/);
  assert.match(text, /• 1 L – 1 box \(box of 12\)/);
  assert.match(text, /• 20 L – 3 cans/);
  assert.doesNotMatch(text, /300 ml/);
  assert.match(text, /Delivery: 12-10-26, Morning/);
  assert.match(text, /Empty 20 L cans to return: 2/);
  assert.match(text, /Note: Call first/);
});

test('dealer enquiry carries type, place and sizes; empty fields are left out', () => {
  assert.deepEqual(Object.keys(M.validateDealer({ name: 'A', phone: '9876543210', city: '', type: '' })).sort(), ['city', 'type']);
  const text = M.dealerMessage({ name: 'Anbu', phone: '9876543210', city: 'Salem', type: 'distributor', sizes: ['20l', '1l'], business: '' }, 'PD-D-101026-1234');
  assert.match(text, /becoming a \*Distributor\*/);
  assert.match(text, /Town \/ District: Salem/);
  assert.match(text, /Sizes interested: 1 L, 20 L/);
  assert.doesNotMatch(text, /Business \/ shop/);
});

test('WhatsApp link encodes the message, with or without a number', () => {
  assert.equal(M.whatsappUrl('+91 98765 43210', 'Hi & bye\n*x*'), 'https://wa.me/919876543210?text=Hi%20%26%20bye%0A*x*');
  assert.equal(M.whatsappUrl('', 'Hi'), 'https://wa.me/?text=Hi');
});

test('Tamil messages and errors', () => {
  const errs = M.validateCustomer({ name: '', phone: '', address: 'x', qty: { '1l': 1 } }, 'ta');
  assert.equal(errs.name, 'உங்கள் பெயரை உள்ளிடவும்');
  const text = M.customerMessage({ name: 'ரவி', phone: '9876543210', address: 'ஈரோடு', qty: { '1l': 2, '20l': 1 } }, 'PD-O-1', 'ta');
  assert.match(text, /தண்ணீர் ஆர்டர்/);
  assert.match(text, /• 1 L – 2 பெட்டி \(12 பாட்டில் பெட்டி\)/);
  assert.match(text, /• 20 L – 1 கேன்/);
  assert.match(text, /டெலிவரி: முடிந்தவரை விரைவில்/);
  const d = M.dealerMessage({ name: 'அன்பு', phone: '9876543210', city: 'சேலம்', type: 'distributor', sizes: ['20l'] }, '', 'ta');
  assert.match(d, /\*விநியோகஸ்தர்\* ஆக/);
  assert.doesNotMatch(d, /Ref:/);
});

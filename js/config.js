/*
 * Ponni Drops website settings. Change these values only; the rest of the
 * site reads them.
 *
 * whatsapp: the number that receives orders and dealer enquiries, with the
 *           country code and no "+" or spaces, e.g. '919876543210'.
 *           While it is empty, "Send on WhatsApp" opens WhatsApp and lets
 *           the visitor pick the contact.
 * phone:    the number the Call buttons dial, e.g. '+919876543210'.
 *           While it is empty, the Call buttons are hidden.
 */
window.PONNI_SITE = {
  whatsapp: '',
  phone: '',
  phoneLabel: '',            // how the number is shown, e.g. '+91 98765 43210'
  email: '',
  address: '',               // factory / office address, shown in Contact
  hours: 'Mon – Sat, 7:00 am – 8:00 pm',
  fssai: '',                 // FSSAI licence no., shown in Quality when filled
  bis: '',                   // BIS licence (CM/L) no., shown in Quality when filled
  mapUrl: '',                // Google Maps link to the factory, optional
};

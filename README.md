# Ponni Drops website

Public website for **Ponni Drops** packaged drinking water, a brand of **Sree Jeevan Minerals**. Plain HTML, CSS and JavaScript: no build step or server needed.

## What it has

- **English / தமிழ்** switch in the header. The whole page, form errors and the WhatsApp message change language; the choice is remembered. Link straight to Tamil with `?lang=ta`.
- **3D hero:** a glossy glass Ponni Drops bottle with rising bubbles, floating droplets and a rippling water surface (WebGL, `js/scene3d.js`). It follows the mouse or phone tilt and turns as you scroll. Without WebGL the flat bottle line-up is shown instead.
- **Scroll effects:** sections fade, slide and flip in; a progress bar runs along the top; numbers count up; in Quality a water drop flows along the steps and lights each one as you scroll; the trust strip scrolls as a marquee.
- **Glass look:** frosted-glass cards over slowly moving colour blobs, cards that tilt in 3D with a light glare under the mouse.
- **Products:** 300 ml, 1/2 L, 1 L, 2 L, 5 L and 20 L, each with an **Order this** button.
- **Quality:** the purification steps, the lab checks and your FSSAI / BIS numbers (when filled in).
- **I want water (customers):** pick sizes with + / − buttons, enter name, mobile, address, delivery date and time. The WhatsApp message is typed out and shown live. **Send order on WhatsApp** opens WhatsApp to your number with the message ready, and the visitor presses Send.
- **Become a dealer:** partner type (dealer / distributor / retail seller / super stockist), town, areas, godown, vehicle, sizes, expected sale and investment. The enquiry is sent the same way.
- After sending, a popup confirms it and gives a reference number (e.g. `PD-O-101026-4821` for an order, `PD-D-…` for a dealer enquiry). The same number is in the message you receive, so you can both quote it.
- **Call** buttons in the header, on the forms, in Contact and as a floating button, plus a floating WhatsApp chat button.

## Set your number (do this first)

Open `js/config.js` and fill in:

```js
whatsapp: '919876543210',      // country code + number, no + or spaces
phone: '+919876543210',        // number the Call buttons dial
phoneLabel: '+91 98765 43210', // how it is shown
```

Also optional: `email`, `address`, `hours`, `fssai`, `bis`, `mapUrl`. Until `phone` is set the Call buttons stay hidden, and until `whatsapp` is set WhatsApp asks the visitor which chat to send to.

## Put it online (GitHub Pages)

1. On GitHub open **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
2. Open **Actions → Publish website → Run workflow** once.
3. The site appears at `https://farmvertexintelligence.github.io/ponni-drops/` and updates by itself on every push to `main`. Your own domain (e.g. `www.ponnidrops.in`) can be added on the same Pages screen.

To check locally: run `npx http-server` in this folder and open the address it shows (the 3D needs a web server; opening `index.html` directly shows the flat bottles), and run `npm test` for the message tests.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page sections |
| `css/site.css` | Glossy dark-green design |
| `js/config.js` | Your phone / WhatsApp number and details |
| `tests/messages.test.js` | Tests for the WhatsApp messages (`npm test`) |
| `js/messages.js` | Builds the WhatsApp messages and checks the forms (tested in `tests/messages.test.js`) |
| `js/site.js` | Bottle drawings, language switch, forms, tabs, popup, scroll and tilt effects |
| `js/i18n.js` | Tamil text for the page |
| `js/scene3d.js` | 3D hero bottle |
| `js/vendor/` | three.js 0.160 (MIT licence) for the 3D |
| `img/favicon.svg` | Ponni Drops drop logo |

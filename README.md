# Canales Creative — Starter Website

This is a minimal static website optimized for a creative agency landing + portfolio with a lead-focused CTA.

What’s included
- index.html — Home, Services, Portfolio, About, Contact
- styles.css — responsive, minimal, photo-forward design with sage accent
- script.js — mobile nav, simple form UX, year auto-update
- images/ — sample placeholders (replace with your assets)

Local preview
1. Save files and the `images/` folder next to `index.html`.
2. Open `index.html` in your browser, or run a local server:
   - Python 3: `python -m http.server 8000`
   - Node: `npx serve .`

Formspree setup (free)
1. Go to https://formspree.io and sign up (free plan supports email submissions).
2. Create a new form and set the destination email to: `elijahcanales56@gmail.com`
3. Formspree gives you a form endpoint like `https://formspree.io/f/abcxyz`. Replace the `action` attribute in `index.html` (at the contact form) with that full URL.
4. Test by submitting the contact form — you may need to verify your email via Formspree.

Notes
- The contact form uses a simple HTML POST to Formspree. You can optionally implement AJAX (fetch) instead for nicer UX.
- If you prefer not to use Formspree, the form is also accompanied by a mailto link as shown in the Contact section.

Deploy to GitHub Pages (username site)
1. Create a repository named exactly: `elijahcanales56.github.io` under your GitHub account.
2. Push these files to the repository's `main` branch.
3. GitHub Pages will serve the site at: `https://elijahcanales56.github.io/` (it may take a minute to build).

Assets & logo
- Replace `images/placeholder-1.jpg` etc. with your real portfolio images in the `images/` folder.
- If you have a wordmark (SVG/PNG), add it to the repo and replace the text logo in `index.html` with an `<img>` inside `.logo`.

SEO & accessibility basics
- Add page-specific meta tags and Open Graph tags for each project if you want link previews on social.
- Add descriptive alt text for each portfolio image (important for SEO and accessibility).

Next steps I can take after your confirmation
- Confirm Formspree endpoint and I’ll show how to add a thank-you redirect or AJAX submit.
- Replace the placeholder images with your real assets (I can add them if you upload).
- Add Plausible analytics later (privacy-friendly), or integrate a basic GA4 snippet on request.

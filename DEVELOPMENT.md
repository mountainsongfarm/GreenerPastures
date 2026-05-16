# Mountain Song Farm — Development Plan

## Current State Assessment

The site is a **3-page static HTML site** for Mountain Song Farm, a horse boarding facility in Monterey, MA. Pages: Home (`index.html`), Boarding (`boarding.html`), and Gallery (`gallery.html`).

### What Works

- Home page hero with video background and parallax effect
- About section with farm description and aerial photo
- Contact information section with address, phone, email, social icons
- Boarding page with detailed custom care services grid
- Gallery page with functional carousel and image collage grid
- Responsive layout at mobile/tablet/desktop breakpoints
- Consistent navigation across all pages
- Brand-appropriate color scheme (greens, earth tones)

### Recently Fixed (Critical Bugs)

- [x] **Navigation blocked by JS** — `script.js` was calling `preventDefault()` on all `nav a` links, which broke clicks to `boarding.html` and `gallery.html`. Fixed to only target `a[href^="#"]`.
- [x] **Video MIME mismatch** — `<source>` pointed at `.mov` file with `type="video/mp4"`. Fixed to serve `.mp4` first with `.mov` as QuickTime fallback.

---

## Remaining Issues (Priority Order)

### P0 — Must Fix for Launch

| # | Issue | File(s) | Notes |
|---|-------|---------|-------|
| 1 | Missing footer on boarding page | `boarding.html` | Add shared footer markup |
| 2 | Missing footer on gallery page | `gallery.html` | Add shared footer markup |
| 3 | Placeholder phone number `(555) 123-4567` | `index.html` | Replace with real number |
| 4 | Social media links are `href="#"` | `index.html` | Add real Facebook/Instagram URLs |
| 5 | Copyright year hardcoded as 2025 | `index.html` | Update or make dynamic with JS |

### P1 — Should Have for a Professional Site

| # | Feature | Description |
|---|---------|-------------|
| 6 | Contact form | Add an inquiry form (name, email, horse info, message). Use Formspree, Netlify Forms, or similar for backend-free submission. |
| 7 | Meta tags & SEO | Add `<meta name="description">`, Open Graph tags, and a favicon. |
| 8 | Google Maps embed | Show farm location in the contact section. |
| 9 | Page load performance | Compress images (JPEG quality 80, WebP where supported). The current images are unoptimized originals. |
| 10 | Consistent `script.js` on all pages | `boarding.html` and `gallery.html` don't load `script.js`, so the sticky header effect is missing on those pages. |

### P2 — Nice to Have (Future Enhancements)

| # | Feature | Description |
|---|---------|-------------|
| 11 | Testimonials section | Slider with quotes from boarders. CSS and JS patterns exist but markup is missing. |
| 12 | Pricing/rates section | Even a "contact for rates" card on the boarding page helps conversion. |
| 13 | FAQ / Policies page | Common boarding agreement terms, visiting hours, emergency protocols. |
| 14 | Mobile hamburger menu | Nav wraps awkwardly on small phones; a toggle menu would be cleaner. |
| 15 | Lightbox for gallery | Click images to view full-size in a modal overlay. |
| 16 | Hosting & custom domain | Deploy to Netlify/Vercel/GitHub Pages with `mountainsongfarm.com`. |

---

## Dead / Unused Code to Clean Up

These CSS selectors in `styles.css` have **no matching HTML** anywhere on the site:

- `#services` (lines 279–296) — references `images/Barn Inside.jpeg` which doesn't exist
- `.facilities-grid` (lines 271–276)
- `.form-group` (lines 394–410)
- `.contact-wrapper` in media query

Decision: keep if planning to add those sections soon; otherwise remove to reduce confusion.

---

## How to Run Locally

```bash
# Option A: Python (built-in)
python3 -m http.server 8000

# Option B: Node (if installed)
npx serve .

# Option C: VS Code / Cursor Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then visit `http://localhost:8000` (or whichever port is reported).

---

## Deployment Checklist

- [ ] Replace placeholder phone number with real number
- [ ] Add real social media URLs
- [ ] Compress all images (target < 300KB each)
- [ ] Add favicon (`favicon.ico` + `<link>` in all pages)
- [ ] Add `<meta name="description">` to all pages
- [ ] Test all pages on iPhone Safari, Android Chrome, Desktop Chrome/Firefox
- [ ] Verify video plays or gracefully falls back on iOS
- [ ] Choose hosting (Netlify recommended for static sites — free tier, auto-HTTPS)

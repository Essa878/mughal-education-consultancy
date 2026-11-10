# Mughal Education Consultancy — website

A complete, responsive marketing website for **Mughal Education Consultancy**, a Pakistan-based
education consultancy and travel agency offering independent student recruitment and education
guidance for students interested in studying in North Cyprus, plus travel assistance.

The site is plain **HTML + CSS + JavaScript**. There is no build step and no framework, so it can be
opened locally, edited in any text editor, and uploaded to any static host.

---

## 1. Quick start

1. Open the folder in a code editor (VS Code, Notepad++, etc.).
2. Edit **`assets/js/config.js`** — this is the single place for phone, WhatsApp, email, location and
   the form delivery settings.
3. Preview by opening `index.html` in a browser, or serve the folder locally:

   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```

4. Upload the whole folder to your hosting (see §6).

---

## 2. Current business details

The live contact details below are already applied across the site. To change any of them, edit
**`assets/js/config.js`** and also update the same values in the HTML (search and replace across
`*.html`, since the details are written directly into the pages so the site works without JavaScript).

| Detail | Current value | Where it appears |
|---|---|---|
| Phone (displayed) | `+90 548 841 47 75` | header, footer, contact page, call buttons |
| Phone link | `+905488414775` (`tel:`) | all telephone links |
| WhatsApp | `905488414775` | floating button, WhatsApp buttons |
| Email | `essamughal456@gmail.com` | footer, contact page, form summaries |
| Address | `Mughal Education Consultancy, Sunrise St, Dina, Pakistan` | footer, contact cards, contact sidebar |
| Google Maps | search link for the address above | contact page buttons (edit the two `google.com/maps/search` links in `contact.html`) |

**The domain is still a placeholder, not a confirmed registration.** It now mirrors the site name
(`mughaleducationconsultancy.com`). Confirm the domain you actually register and replace this value
before launch:

| Placeholder | Where it appears | How to change |
|---|---|---|
| `https://www.mughaleducationconsultancy.com` | canonical URLs, Open Graph tags, schema, `sitemap.xml`, `robots.txt` | search & replace across `*.html`, `sitemap.xml`, `robots.txt` (see §7) |

There are **no social media icons** on the site. The footer column that previously held them is now a
"Start an enquiry" call-to-action, and the contact page sidebar has a "Before you visit" card with a
Google Maps button. To add social profiles later, add plain text/icon links and update the privacy
policy accordingly.

> **Note:** the contact details are written directly into the generated HTML so the site works without
> JavaScript. `config.js` keeps them in sync on page load. For a permanent change, update both.

---

## 3. Enquiry forms

There are three forms:

- **Student enquiry** — `apply-now.html` (full application enquiry)
- **Travel enquiry** — `travel-services.html#travel-enquiry`
- **Contact form** — `contact.html`

### Delivery mode A — no setup (default)

`formEndpoint` is empty in `config.js`. When a visitor submits, the site shows a **"review and send"**
panel with:

- **Send by email** — opens the visitor's email app with the enquiry pre-filled
- **Send on WhatsApp** — opens WhatsApp with the enquiry pre-filled
- **Copy enquiry / Copy email address / Open Gmail instead** — a fallback for computers with no
  email app configured, where a `mailto:` link can appear to do nothing

Nothing is stored by the website. This is honest, works immediately, and requires no account.

> If "Send by email" does nothing on a particular computer, that device has no default mail app.
> The copy buttons and the Gmail link in the same panel always work. On Windows, set a default under
> **Settings → Apps → Default apps → Mail**.

### Delivery mode B — automatic email delivery (recommended)

1. Create a free form endpoint, for example:
   - [Web3Forms](https://web3forms.com) → gives you an `access_key`
   - [Formspree](https://formspree.io) → gives you a form URL
   - [Basin](https://usebasin.com), [Getform](https://getform.io) and similar services work too
2. In `assets/js/config.js` set:

   ```js
   formEndpoint: "https://api.web3forms.com/submit",
   formAccessKey: "YOUR-ACCESS-KEY",
   ```

3. Submit a test enquiry and confirm it arrives at your business email.

The form:
- validates required fields in the browser,
- shows accessible inline errors,
- includes a hidden honeypot field to reduce spam,
- never asks for passports, identity documents, card numbers or bank details.

### Storage / CRM

If you connect a CRM or database, store enquiries on a secured server (HTTPS, access control,
retention policy) and update the privacy policy to describe it.

---

## 4. Optional integrations

Open `assets/js/config.js`:

```js
analyticsId: "",               // e.g. "G-XXXXXXXXXX"
searchConsoleVerification: ""  // meta verification value, if you use the HTML tag method
```

- **Google Analytics 4** — paste the `G-…` measurement ID; the GA script is only injected when an ID
  is present.
- **Google Search Console** — the easiest method is a DNS verification record. If you use the HTML
  tag method, add the tag to the `<head>` of every page (or add `searchConsoleVerification` support
  in `main.js`).
- After launch, submit `https://www.mughaleducationconsultancy.com/sitemap.xml` in Search Console.

---

## 5. Cookies

A cookie notice appears on first visit and stores the choice in `localStorage` under
`mt-cookie-consent`. Analytics only loads when `analyticsId` is configured. Update the notice text in
the footer include if your cookie use changes.

---

## 6. Hosting and HTTPS

Any static host works:

- **Netlify / Vercel / Cloudflare Pages** — drag the folder in, HTTPS is automatic.
- **cPanel / shared hosting** — upload the folder contents to `public_html`.
- **GitHub Pages** — push the folder to a repository and enable Pages.

Checklist:

- [ ] Force HTTPS (redirect `http://` → `https://` and `www` → non-www or vice versa).
- [ ] Point the domain `mughaleducationconsultancy.com` at the host.
- [ ] Confirm `index.html` is the directory index.
- [ ] Set a 404 page to `404.html`.
- [ ] Enable gzip/brotli compression and browser caching for images/CSS/JS.
- [ ] Submit the sitemap and check indexing after launch.

A sample `_headers` / `.htaccess` snippet for caching and the 404 page is included in §9.

---

## 7. Editing content

### Simple text edits
Open the relevant `.html` file and edit the text between the tags. Each page is self-contained.

### Adding a page
1. Copy an existing page (e.g. `about.html`).
2. Update `<title>`, `<meta name="description">`, `<link rel="canonical">` and the `<h1>`.
3. Add a link in the header/footer navigation (present in every page).
4. Add the new page to `sitemap.xml`.

### Replacing images
Images live in `assets/img/`. Each photo is published in three WebP sizes plus two JPEG
fallbacks:

| File | Purpose |
|---|---|
| `photo.webp` | Full size (1600px or 1920px wide) |
| `photo-1200.webp` | Mid size, used on most laptops |
| `photo-800.webp` | Small screens |
| `photo.jpg` / `photo-800.jpg` | Fallback for browsers without WebP |

Pages use a `<picture>` element with the WebP versions first and JPEG as fallback:

```html
<picture>
  <source type="image/webp"
          srcset="assets/img/your-photo-800.webp 800w,
                  assets/img/your-photo-1200.webp 1200w,
                  assets/img/your-photo.webp 1600w"
          sizes="(min-width: 1000px) 50vw, 100vw">
  <img src="assets/img/your-photo.jpg"
       srcset="assets/img/your-photo-800.jpg 800w, assets/img/your-photo.jpg 1600w"
       sizes="(min-width: 1000px) 50vw, 100vw"
       width="1600" height="1067" alt="Descriptive alt text" loading="lazy" decoding="async">
</picture>
```

If you replace a photo, keep the same filename for the full-size `.jpg`, then re-create the
`-800.jpg`, `-1200.webp`, `.webp` and `-800.webp` versions so the sizes stay in step. Use roughly
1600px wide, quality ~72, and keep the full-size WebP under ~250 KB.

### The logo
The header, footer and mobile menu use the supplied logo at `assets/img/logo.webp` (a square,
white-backed badge shown as a 54px circle). The same artwork is used for the browser tab and app
icons: `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` (180px) and `logo-192.png` /
`logo-512.png` for the web manifest. If the logo changes, replace the source PNG and regenerate
those sizes together, keeping the badge centred on its white square.

### Changing brand colours / fonts
All design tokens are at the top of `assets/css/styles.css` under `:root` (`--navy-900`, `--gold`,
`--font-serif`, etc.).

Fonts are self-hosted in `assets/fonts/` as variable WOFF2 files (Inter, plus Playfair Display
regular and italic, latin subset) and declared in `assets/css/fonts.css`. Nothing is loaded from
Google's servers, so the site works without third-party requests. To change a font, replace the
WOFF2 file and update the matching `@font-face` rule.

### Global find-and-replace
If the domain or business name changes:

```bash
# PowerShell example
Get-ChildItem -Recurse -Include *.html,*.xml,*.txt | ForEach-Object {
  (Get-Content $_.FullName -Raw).Replace('https://www.mughaleducationconsultancy.com','https://NEW-DOMAIN.com') |
    Set-Content $_.FullName -NoNewline
}
```

---

## 8. Backup and maintenance

- Keep a zipped copy of the site before every change (`mughal-travels-backup-YYYY-MM-DD.zip`).
- If using Git, commit after each content change.
- Ask your host whether automatic daily backups are included.
- Review form delivery and contact links every few months.
- Re-check university information at least once per intake, since programmes, fees and requirements
  change.

---

## 9. Optional server config snippets

**`.htaccess` (Apache)**

```apache
ErrorDocument 404 /404.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/png  "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/css   "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Force HTTPS (adjust if the site is served from a subfolder)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

**`_headers` (Netlify / Cloudflare Pages)**

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin

/assets/img/*
  Cache-Control: public, max-age=31536000, immutable

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/assets/css/*
  Cache-Control: public, max-age=2592000
```

For the best scores, make sure the host serves **Brotli or gzip** for HTML, CSS and JavaScript.
The fonts are WOFF2 and the photos are WebP, so they are already compressed and should be cached
long-term rather than re-compressed.

---

## 10. Content and compliance notes

- Mughal Education Consultancy is described as an **independent** student recruitment and education guidance
  service. The site does not claim official university representation, partnerships or logos.
- There are **no** invented testimonials, student numbers, awards, years of experience, rankings,
  tuition fees, scholarship percentages or guaranteed outcomes.
- Admission, scholarship, visa and entry decisions are repeatedly stated as belonging to the
  universities and authorities.
- The site never collects passport copies, identity documents or financial information through
  public forms.
- University names link to their official websites. Current official domains used:
  - Near East University — https://www.neu.edu.tr/
  - Eastern Mediterranean University — https://www.emu.edu.tr/
  - Cyprus International University — https://www.ciu.edu.tr/
  - Girne American University — https://www.gau.edu.tr/
  - European University of Lefke — https://www.eul.edu.tr/
  - Final International University — https://www.final.edu.tr/
  - Onbeş Kasım Kıbrıs University — https://www.onbeskku.edu.tr/
- **Verify these links** and re-check programme details before publishing, and at least once per
  intake. The Near East University site may show a browser/security challenge to automated checks;
  it opens normally in a regular browser.

### University agent approval

Two pages exist specifically for a university's agent-relations or due-diligence team:

| Page | Purpose |
|---|---|
| `for-universities.html` | Who we are, the services we provide, the five-step process, our commitments, what we will not do, a partnership enquiry form and a direct email/WhatsApp route |
| `code-of-conduct.html` | Thirteen sections covering role, accurate information, no guarantees, genuine documents, fees, student data, marketing and branding, communication, safeguarding, ethical recruitment, conflicts of interest, complaints and review |

They are linked from the footer (Support column and the legal row), from `about.html`, from
`contact.html` (sidebar card and an enquiry-type option), and from `terms.html` and
`privacy-policy.html`. They are not in the main navigation, which already has nine items.

Both pages state plainly that Mughal Education Consultancy is independent and only describes itself as an
official agent where a **written agreement** exists. Nothing on either page claims registration,
staff numbers, student numbers, partnerships, rankings or guaranteed outcomes. Do not add such
claims to win an approval — universities verify them.

**What is still missing for a strong application** (needs owner input, cannot be written here):

- A business email on the real domain (the Gmail address is live but weakens due diligence);
- Company/business registration details and a tax registration number, if they exist;
- A named contact person with a direct line, and a short statement of relevant experience;
- One or two professional references, if available;
- The live domain with HTTPS.

**Do not add photographs of the office, staff or students — real or stock.** The site deliberately
contains none. Every image is destination, campus or travel photography, and `image-credits.html`
states that none of the photographs show Mughal Education Consultancy' premises, staff or students. A stock photo
presented as "our office" is a due-diligence red flag; leaving photographs out is the honest choice.

**After an agreement is signed**, update these places:

1. `for-universities.html` — name the university, the date and scope of the agreement, and the approved
   wording for how we may describe the relationship.
2. `code-of-conduct.html` — update section 1 and the "last updated" date.
3. Add the university's logo **only** if the agreement and the university's brand rules allow it, and
   only in the form they supply.
4. Add the named agent-relations contact and the agreed application route to the "Working together"
   section.
5. Update `terms.html` §2 and the footer disclaimer wording.
6. Record the commission and termination terms in the internal agreement file, not on the public site.

---

## 11. Image licensing

Photographs are sourced from Wikimedia Commons under Creative Commons / public-domain licences.
Required attribution is listed on **`image-credits.html`**, linked in the footer.

**Do not delete the image credits page** while these images are in use — several licences
(CC BY, CC BY-SA) legally require attribution.

If you replace a photo, add its attribution here and keep the licence note accurate. The site
intentionally uses no photographs of the office, staff or students — keep it that way, and keep the
"Illustrative only" note on the credits page in step with the images actually used.

Three universities (European University of Lefke, Final International University and Onbeş Kasım
Kıbrıs University) have no openly licensed campus photograph in the set used, so destination imagery
of North Cyprus is shown instead. The alt text and the detail pages are honest about this.

---

## 12. Files

```
mughal-travels/
├── index.html                     Home
├── about.html                     About Us
├── study-in-north-cyprus.html     Study destination guide
├── universities.html              University directory
├── university-near-east.html      Near East University
├── university-emu.html            Eastern Mediterranean University
├── university-ciu.html            Cyprus International University
├── university-gau.html            Girne American University
├── university-eul.html            European University of Lefke
├── university-fiu.html            Final International University
├── university-okku.html           Onbeş Kasım Kıbrıs University
├── services.html                  Our Services
├── travel-services.html           Travel Services + travel form
├── how-it-works.html              How to Apply
├── apply-now.html                 Apply Now + student form
├── contact.html                   Contact + contact form
├── faq.html                       FAQ (with FAQPage schema)
├── for-universities.html          University partnerships (agent approval)
├── code-of-conduct.html           Standards for students and universities
├── privacy-policy.html            Privacy Policy
├── terms.html                     Terms & Conditions
├── image-credits.html             Image attributions
├── 404.html                       Not found page
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── assets/
    ├── css/styles.css
    ├── css/fonts.css              self-hosted font declarations
    ├── fonts/                     Inter + Playfair Display (WOFF2)
    ├── js/config.js               ← edit this first
    ├── js/main.js
    ├── js/forms.js
    └── img/                       photos (WebP + JPEG, 800/1200/full sizes), og-image, logo and icons
```

---

## 13. Pre-launch checklist

- [x] Real phone, WhatsApp, email and office address entered
- [ ] Domain replaced in canonical tags, schema, sitemap and robots.txt
- [ ] Form endpoint configured and test enquiry received
- [ ] Google Analytics / Search Console connected (optional)
- [x] Google Maps link opens the office address in Maps (no iframe embed)
- [x] Social icons removed (footer shows an enquiry CTA instead)
- [x] All seven official university links checked
- [x] Image credits page retained (licence requirement)
- [x] Images served as WebP with JPEG fallback and three responsive sizes
- [x] Fonts self-hosted (no Google Fonts request), with the two main faces preloaded
- [x] Agent-facing pages built (`for-universities.html`, `code-of-conduct.html`) and linked
- [ ] HTTPS forced, 404 page set, sitemap submitted
- [ ] Tested on a real phone: menu, WhatsApp button, tel: link, email link, all three forms

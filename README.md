# MODEL AI — Dashboard Edition

A responsive, reference-inspired dashboard website for **modelaitools.online**. This package includes a white / blue / purple dashboard, a left navigation sidebar, global tool search, category filters, popular tool cards, a right-side AI assistant panel, a footer, legal/information pages, SEO files and 34 dedicated tool routes.

## Included

- `index.html` — dashboard home and tool directory.
- `assets/style.css` — shared tool page styles.
- `assets/dashboard.css` / `assets/dashboard.js` — dashboard design, mobile drawer, dark mode, favourites stored locally, and AI assistant UI.
- `tools/*/index.html` — dedicated pages for all selected tools and an AI image-generation interface.
- `functions/api/chat.js` — server-side Gemini/OpenAI-compatible chat and vision proxy.
- `functions/api/image.js` — image generation route using the same Gemini key (model access and quota required).
- `functions/api/background-remove.js` — optional remove.bg background removal route with a separate encrypted key.
- `login.html` / `account.html` — Firebase email/password + Google sign-in screens and account page.
- `assets/firebase-config.js` / `assets/firebase-auth.js` — Firebase client config placeholder and modular SDK authentication.
- `FIREBASE-SETUP.md` — step-by-step Firebase setup and security notes.
- `API-SETUP.md` — provider secret configuration.
- `about.html`, `contact.html`, `privacy.html`, `terms.html`, `disclaimer.html`, `sitemap.html`, `sitemap.xml`, `robots.txt`, `ads.txt`, `_headers`, `404.html`.

## Preview locally

Because the project uses absolute paths such as `/assets/style.css`, do not open `index.html` directly from File Explorer. Run a local server from the project root, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy on Cloudflare Pages

1. Extract this ZIP.
2. Upload the **extracted files and folders** to the root of your GitHub repository; do not upload only the ZIP. The root must contain `index.html`, `assets/`, `tools/`, and `functions/`.
3. In Cloudflare, create/import a **Pages** project connected to that repository (not a plain static Worker upload).
4. Framework preset: `None`; build command: `exit 0`; build output directory: `.`; production branch: `main`.
5. Deploy, then test the `*.pages.dev` URL, including several `/tools/<slug>/` routes.
6. In Pages → Custom domains, attach `modelaitools.online` once the Pages project works. Preserve existing email DNS records when making DNS changes.

## Feature status — read this carefully

The local/browser tools are usable without an AI key where supported. Examples include the marks calculator, weighted GPA, timetable, manual flashcards, date difference, case conversion, text-to-speech, hashtag helper, image compression/resizing/format conversion, color palette, QR/PDF tools when the required browser library CDN is reachable, JSON formatter and code formatter.

AI Chat, image analysis, translator, quiz, YouTube generators, coding helper and story writer require a configured Gemini/OpenAI-compatible chat provider, model support and account quota. Image generation now calls `/api/image` using `AI_IMAGE_MODEL`; background removal calls `/api/background-remove` and requires a separate `BG_REMOVE_API_KEY`. They will show a real setup/provider error until secrets are configured. Image generation and background removal need a separate image provider integration; their pages explicitly report that they are not connected and do not pretend to generate/edit images. Login/Google OAuth and cloud-synced history are not connected in this front-end edition; profile controls are labelled as setup placeholders.

## Ads / AdSense

The page includes clearly labelled ad-placement preview spaces only. They are **not live ads** and no fake publisher ID is included. Add the official AdSense script and real `ads.txt` publisher record only after approval and only as supplied by Google. Approval is not guaranteed; original content, usable pages, privacy/contact details, policy compliance and site quality remain your responsibility.

## Important

- Never put API keys in `assets/*.js`, HTML files or a public GitHub repo.
- Do not promise users that AI generation is free or unlimited; your selected provider may bill or enforce quotas.
- Before opening the public AI endpoint to visitors, add rate limits, abuse controls and usage budgets (e.g. at Cloudflare or your provider).
- Update contact email and any business/legal details to reflect the actual website owner.


## Firebase login setup
Follow `FIREBASE-SETUP.md`, enable Email/Password and Google providers in Firebase Authentication, add your real domain to Authorized domains, and fill `assets/firebase-config.js` with your Firebase web-app configuration. Until this is configured, the UI will explain that setup is needed; no user name is hard-coded in the dashboard.


## API setup
Follow `API-SETUP.md` to add Gemini API and optional remove.bg keys in Cloudflare Pages **Variables and Secrets**. Keys are not included in this ZIP; add them directly to Cloudflare as encrypted secrets. The project is not production abuse-proof until you configure rate limits and usage monitoring.

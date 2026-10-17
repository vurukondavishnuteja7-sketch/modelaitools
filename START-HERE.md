# MODEL AI — Reference layout build

## This ZIP restores the white/blue dashboard shown in the supplied screenshot

- Header search and account area
- Left navigation and MODEL AI Pro card
- Pastel blue robot hero banner
- Four overview/stat cards
- Five popular tool cards with local sticker SVGs
- Eight category tiles and 34-tool catalogue with search/filter/favourites
- Right rail: AI Assistant, popular tools, tips
- Responsive mobile navigation and reduced-motion support
- Signup-mode toggle works independently of Firebase module loading; the Firebase auth script provides visible error messages
- Existing Cloudflare Functions kept for OpenRouter text/image-analysis and separate Gemini image generation
- One reserved AdSense placement; no ad code/fake publisher ID is included

## Deploy
1. Extract the ZIP.
2. Replace matching files in your GitHub repository root. Keep `index.html`, `assets/`, `functions/`, and `tools/` at the root.
3. Commit the changes and wait for the Cloudflare Pages production deployment to succeed.
4. Hard refresh `https://modelaitools.online/` and test `/login.html`.
5. Keep actual API keys in Cloudflare encrypted Secrets. Never commit provider keys to GitHub.

## Firebase auth
- `assets/firebase-config.js` contains the client web config supplied earlier. Verify it against Firebase Console → Project settings → Your apps.
- In Firebase Authentication, enable Email/Password and Google sign-in.
- Add `modelaitools.online` and your exact `*.pages.dev` hostname to Authorized domains.
- Test Create account, sign in, password reset and Google. If a provider/config/domain error appears, the page should show its message; browser Console may give additional details.

## AI API variables
Keep your OpenRouter text variables and Gemini image variables matching `API-SETUP.md`. Secrets only in Cloudflare.

## AdSense
Read `ADSENSE-READINESS.md`. Approval is decided by Google and cannot be guaranteed by a template. Replace the site-owner contact email if it is not monitored, ensure all pages have useful original content and do not add the publisher ID until supplied by AdSense.

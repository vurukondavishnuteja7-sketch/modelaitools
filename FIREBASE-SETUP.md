# MODEL AI — Firebase login setup

The homepage signup/profile UI is independent of Firebase loading; account creation and Google login still require a working Firebase web config, enabled providers and an authorized domain.

## 1. Verify web config
- Open Firebase Console → Project settings → Your apps → SDK setup and configuration.
- Compare the Web app values against `assets/firebase-config.js` in this repository.
- The file is browser-side Firebase configuration; do not add a service-account JSON or private Admin SDK key to GitHub.

## 2. Enable providers and domain
1. Open https://console.firebase.google.com/ and select project `modelaitools`.
2. Authentication → Sign-in method: enable **Email/Password** and **Google** and Save.
3. Authentication → Settings → Authorized domains: add `modelaitools.online` and your exact Cloudflare Pages hostname (for example `modelaitools.pages.dev`), with no `https://`.
4. Commit updated config if needed, then wait for Cloudflare Pages production deployment to finish.

## 3. Test account creation
1. Open `https://modelaitools.online/login.html`, hard refresh (`Ctrl+Shift+R`), then click **New to MODEL AI? Create an account**. The title should change and a name field should appear even before Firebase responds.
2. Enter a name, email and password (at least 6 characters), then click **Create account**.
3. Firebase Console → Authentication → Users should list a successful new account.
4. Click **Continue with Google** and select your account.

## Troubleshooting
- `auth/unauthorized-domain`: authorize `modelaitools.online` and the exact deployed hostname.
- `auth/operation-not-allowed`: enable the relevant provider under Authentication → Sign-in method.
- `auth/invalid-api-key`: re-copy the exact Web app config from Project settings → Your apps.
- If the title doesn't change, verify `/assets/firebase-auth.js` loads successfully in DevTools → Network. The page includes an inline mode-toggle fallback and will show a diagnostic when the auth script fails to load.
- If the title changes but signup fails, read the visible message in the login card and check DevTools → Console/Network.

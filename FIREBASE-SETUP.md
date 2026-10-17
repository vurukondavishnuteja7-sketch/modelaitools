# MODEL AI — Firebase login setup

The repository includes a web app config in `assets/firebase-config.js` populated from the values shown in your screenshot. Verify every value against Firebase Console → Project settings → Your apps → SDK setup and configuration. If any value differs, replace it with the exact console value and keep valid commas between object properties. Do not add a Firebase service-account JSON file to GitHub.

## Enable providers

1. Open https://console.firebase.google.com/ and select project `modelaitools`.
2. Authentication → Sign-in method. Enable **Email/Password** and **Google** and Save.
3. Authentication → Settings → Authorized domains. Add `modelaitools.online` and your actual Cloudflare Pages hostname (for example `modelaitools.pages.dev`). Do not include `https://`.
4. GitHub → `assets/firebase-config.js`: make sure it contains the matching web config from Project settings. Commit and redeploy.

## Test account creation

1. Open `/login.html`, hard refresh (`Ctrl+Shift+R`), click “Create an account”, and verify the title changes.
2. Enter name/email/password (at least 6 chars) and submit.
3. After a new account is created, Firebase Console → Authentication → Users should list it.
4. Click “Continue with Google”. If it fails, read the visible message on the page and inspect the browser DevTools Console. Common errors: `auth/unauthorized-domain` means add the deployed hostname; `auth/operation-not-allowed` means enable the provider; config/import errors mean the web config or JavaScript file failed to load.

The included `assets/firebase-auth.js` binds the mode-toggle immediately and displays Firebase import/config/auth errors in the page. The status message is more useful than repeatedly changing settings without checking the error.

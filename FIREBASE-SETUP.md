# Firebase Authentication setup for MODEL AI

This project uses Firebase Authentication for email/password sign-in, account creation, password reset, and Google sign-in. The UI is included, but authentication will not work until you configure your own Firebase web app.

## 1. Create a Firebase project
1. Open https://console.firebase.google.com/ and create a project (or select your existing project).
2. In Project settings, add a Web app. Copy the web app configuration.
3. Open **Authentication → Get started → Sign-in method**. Enable **Email/Password** and **Google**. Save each provider.
4. In **Authentication → Settings → Authorized domains**, add `modelaitools.online` and `modelaitools.pages.dev` (plus any preview domain you actually use).

## 2. Add your web app config
Edit `assets/firebase-config.js` and replace the `PASTE_...` placeholder values with your Firebase web app's `apiKey`, `authDomain`, `projectId`, `appId`, and `messagingSenderId`. These are Firebase client configuration values and are expected to be visible to browsers; they are not service-account credentials. Never put a Firebase Admin service-account JSON, private key, or other server secret in this file or GitHub.

## 3. Deploy
Commit and push the updated files to GitHub. Cloudflare Pages should redeploy automatically. Test `/login.html`, Google sign-in, email account creation, sign-in, and password reset on your actual domain.

## Important security notes
- Firebase web configuration alone does not grant Admin privileges. Configure Firebase Security Rules before adding Firestore, Storage, or saved chat history.
- Do not store private API provider keys in frontend JavaScript. Keep AI provider secrets in Cloudflare Pages/Workers secrets and call them through a server-side function.
- This starter adds authentication UI and Firebase Auth only. It does not yet implement database-backed chat history, subscription billing, or authorization rules for paid tools.
- Users can continue to use browser-only tools without signing in.

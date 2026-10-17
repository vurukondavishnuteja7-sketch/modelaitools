# START HERE — MODEL AI Premium Website

## 1. Deploy the website files
1. Download and extract the ZIP.
2. The ZIP contains the website root directly: `index.html`, `assets/`, `tools/`, and `functions/`.
3. Replace the corresponding files in the root of your GitHub Pages/Cloudflare Pages connected repository with the extracted files. Do not upload only the ZIP file into the repo.
4. Commit changes and confirm Cloudflare Pages shows a successful production deployment.

## 2. Firebase login
- Review `assets/firebase-config.js` against Firebase Console → Project settings → Your apps.
- In Firebase Authentication, enable Email/Password and Google providers.
- Add `modelaitools.online` and your actual Pages hostname under Authentication → Settings → Authorized domains.
- See `FIREBASE-SETUP.md`.

## 3. AI chat
- The chat route is `functions/api/chat.js` and uses the OpenRouter-compatible endpoint configured through Cloudflare Pages variables/secrets.
- Keep `AI_API_KEY` as an encrypted Secret. Do not commit it to GitHub or share it in screenshots.
- Set `AI_API_BASE_URL` and model variables per `API-SETUP.md`. Free provider/model availability and quotas can change.

## 4. Test after deployment
- Home: `https://modelaitools.online/`
- Login: `https://modelaitools.online/login.html`
- AI Chat: `https://modelaitools.online/tools/ai-chat/`
- Image Generator: `https://modelaitools.online/tools/ai-image-generator/`
- API route health: `https://modelaitools.online/api/chat` (GET route checks if the function route is deployed; it does not test the provider key).

## Important
Static file checks do not prove Firebase or API credentials work on your live domain. After deployment, run the tests above and inspect the exact error text if any service still fails.

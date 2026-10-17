# Validation Notes — Neon Gold Restored Build

- Confirmed 34 tool pages are retained.
- Injected local SVG stickers into tool-card, popular-tool, category, and tool-page heading icons.
- Added `assets/login-ui.js` to make the create-account mode toggle independent from Firebase module imports and to show errors when the auth bundle fails to load.
- Changed login/account Firebase script tags to ordered deferred classic scripts; `firebase-auth.js` uses dynamic imports and therefore remains compatible.
- Preserved OpenRouter chat route and separate Gemini image-generation route.
- Static JS syntax checks and archive file/link checks are performed before packaging.
- Live auth and provider requests still require testing against the owner’s deployed Firebase project and API keys.

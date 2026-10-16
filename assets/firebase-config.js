// MODEL AI Firebase web-app configuration. Replace every placeholder with values from
// Firebase Console > Project settings > Your apps > SDK setup and configuration.
// This client config is not a service-account secret. NEVER put service-account JSON
// or private server credentials in this file.
export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_WEB_API_KEY_HERE",
  authDomain: "PASTE_PROJECT_ID_HERE.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID_HERE",
  appId: "PASTE_FIREBASE_APP_ID_HERE",
  messagingSenderId: "PASTE_MESSAGING_SENDER_ID_HERE"
};
export const firebaseConfigured = Object.values(firebaseConfig).every(v => typeof v === "string" && v.length > 0 && !v.startsWith("PASTE_"));

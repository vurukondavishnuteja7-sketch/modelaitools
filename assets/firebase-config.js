// MODEL AI Firebase web-app configuration. Replace every placeholder with values from
// Firebase Console > Project settings > Your apps > SDK setup and configuration.
// This client config is not a service-account secret. NEVER put service-account JSON
// or private server credentials in this file.
export const firebaseConfig = {
  apiKey: "AIzaSyDXlru4Tt19yqfIe3oKUtc3yn5v_l55fms",
  authDomain: "modelaitools.firebaseapp.com",
  projectId: "modelaitools",
  appId: "1:833872426359:web:67a321c8b5619ca79d5d72",
  messagingSenderId: "838372426359",
  measurementId: "G-DZMG6ER0W6"
};
export const firebaseConfigured = Object.values(firebaseConfig).every(v => typeof v === "string" && v.length > 0 && !v.startsWith("PASTE_"));

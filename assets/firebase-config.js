// MODEL AI - Firebase web-app configuration.
// Firebase Console > Project settings > Your apps

export const firebaseConfig = {
  apiKey: "AIzaSyDX1ru4Tt19yqfIe3oKUtc3yn5v_155fms",
  authDomain: "modelaitools.firebaseapp.com",
  projectId: "modelaitools",
  appId: "1:833872426359:web:67a321c8b5619ca79d5d72",
  messagingSenderId: "833872426359",
  measurementId: "G-DZM6GER0W6"
};

export const firebaseConfigured = Object.values(firebaseConfig).every(
  (value) =>
    typeof value === "string" &&
    value.length > 0 &&
    !value.startsWith("PASTE_")
);

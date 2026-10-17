// MODEL AI - Firebase authentication bootstrap with visible diagnostics.
// Place at: assets/firebase-auth.js
// Firebase SDK/config imports are loaded dynamically so a failed import
// does not leave the login buttons completely unresponsive.

const $ = (selector, root = document) => root.querySelector(selector);
const safeText = (value) => String(value || "").trim();

let auth = null;
let authSdk = null;
let firebasePromise = null;
let currentUser = null;

function setStatus(message, kind = "info") {
  const el = $("#auth-status");
  if (!el) {
    console[kind === "error" ? "error" : "info"]("[MODEL AI auth]", message);
    return;
  }
  el.textContent = message;
  el.dataset.kind = kind;
  el.hidden = false;
}

function hideStatus() {
  const el = $("#auth-status");
  if (el) el.hidden = true;
}

function setBusy(busy) {
  document.querySelectorAll("[data-auth-action]").forEach((button) => {
    button.disabled = busy;
    button.setAttribute("aria-busy", String(busy));
  });
}

function friendlyError(error) {
  const code = error?.code || "";
  const messages = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/missing-password": "Please enter your password.",
    "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/email-already-in-use": "An account already exists for this email. Try signing in.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/user-not-found": "No account found for this email. Create an account first.",
    "auth/wrong-password": "Email or password is incorrect.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/unauthorized-domain": "This domain is not authorized in Firebase Authentication settings.",
    "auth/operation-not-allowed": "Enable this sign-in method in Firebase Console → Authentication → Sign-in method.",
    "auth/network-request-failed": "Network error. Check your internet connection and try again.",
    "auth/popup-blocked": "Your browser blocked the Google sign-in popup. Allow popups and retry.",
    "auth/cancelled-popup-request": "A sign-in popup is already open. Finish or close it first.",
    "auth/invalid-api-key": "Firebase rejected the web API key. Copy the Web app config again from Firebase Console → Project settings → Your apps.",
    "auth/configuration-not-found": "Firebase Authentication configuration was not found. Enable Email/Password and Google in Authentication → Sign-in method.",
    "auth/too-many-requests": "Too many attempts. Wait a little and try again."
  };
  if (messages[code]) return messages[code];
  return error?.message || "Authentication failed. Check the Firebase setup and try again.";
}

function setMode(mode) {
  const creating = mode === "create";
  const title = $("#auth-title");
  const subtitle = $("#auth-subtitle");
  const nameLabel = $("#name-field");
  const nameInput = $("#auth-name");
  const submit = $("#auth-submit");
  const modeButton = $("#auth-mode");
  const resetRow = document.querySelector(".auth-form-row");
  if (resetRow) resetRow.hidden = creating;

  if (title) title.textContent = creating ? "Create your MODEL AI account" : "Welcome back";
  if (subtitle) subtitle.textContent = creating
    ? "Create an account to get started."
    : "Sign in to continue to your workspace.";
  if (nameLabel) nameLabel.hidden = !creating;
  if (nameInput) {
    nameInput.hidden = !creating;
    nameInput.required = creating;
    nameInput.autocomplete = "name";
  }
  if (submit) submit.textContent = creating ? "Create account" : "Sign in";
  if (modeButton) {
    modeButton.textContent = creating
      ? "Already have an account? Sign in"
      : "New to MODEL AI? Create an account";
    modeButton.dataset.next = creating ? "signin" : "create";
    modeButton.dataset.mode = creating ? "create" : "signin";
    modeButton.setAttribute("aria-pressed", String(creating));
  }
  hideStatus();
}

function updateAccountUI(user) {
  currentUser = user || null;
  const link = $("#auth-profile-link");
  if (link) {
    const name = user ? (user.displayName || user.email?.split("@")[0] || "Account") : "Sign in";
    const nameEl = $("#auth-display-name");
    const welcomeEl = $("#auth-welcome");
    const avatarEl = $("#auth-avatar");
    if (nameEl) nameEl.textContent = name;
    if (welcomeEl) welcomeEl.textContent = user ? "Signed in" : "Welcome";
    if (avatarEl) avatarEl.textContent = user ? (name[0] || "A").toUpperCase() : "👤";
    link.href = user ? "/account.html" : "/login.html";
    link.setAttribute("aria-label", user ? "Open your MODEL AI account" : "Sign in to MODEL AI");
  }

  const railName = $("#rail-account-name");
  const railStatus = $("#rail-account-status");
  const railLink = $("#rail-account-link");
  if (railName) railName.textContent = user ? (user.displayName || user.email?.split("@")[0] || "MODEL AI member") : "Sign in to sync your workspace";
  if (railStatus) railStatus.textContent = user ? "YOUR WORKSPACE" : "WELCOME BACK";
  if (railLink) { railLink.href = user ? "/account.html" : "/login.html"; railLink.innerHTML = user ? "Open account <b>→</b>" : "Sign in / Create account <b>→</b>"; }

  const accountName = $("#account-display-name");
  const accountEmail = $("#account-email");
  if (accountName) accountName.textContent = user ? (user.displayName || user.email || "MODEL AI member") : "You are not signed in";
  if (accountEmail) accountEmail.textContent = user?.email || "Sign in to view account details.";
  $("#account-signed-in")?.toggleAttribute("hidden", !user);
  $("#account-signed-out")?.toggleAttribute("hidden", !!user);
}

async function ensureFirebase() {
  if (auth && authSdk) return { auth, authSdk };
  if (!firebasePromise) {
    firebasePromise = (async () => {
      let appModule;
      let authModule;
      let configModule;
      try {
        [appModule, authModule, configModule] = await Promise.all([
          import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
          import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),
          import("/assets/firebase-config.js")
        ]);
      } catch (error) {
        console.error("[MODEL AI auth] Failed to load Firebase modules/config", error);
        throw new Error("Firebase JavaScript could not load. Check that /assets/firebase-auth.js and /assets/firebase-config.js deploy correctly, then check the browser Console for the import error.");
      }

      if (!configModule.firebaseConfigured) {
        throw new Error("Firebase setup is incomplete. Check that assets/firebase-config.js contains your actual Firebase web app values, not PASTE_ placeholders.");
      }

      try {
        const app = appModule.initializeApp(configModule.firebaseConfig);
        auth = authModule.getAuth(app);
        authSdk = authModule;
        authModule.onAuthStateChanged(auth, (user) => {
          updateAccountUI(user);
          if ($("#login-card") && user) {
            setStatus("You are signed in. Opening your account…", "success");
            setTimeout(() => { location.href = "/account.html"; }, 650);
          }
        });
        return { auth, authSdk };
      } catch (error) {
        console.error("[MODEL AI auth] Firebase initialization failed", error);
        throw new Error("Firebase could not initialize. Recheck the web app config in Firebase Console → Project settings → Your apps.");
      }
    })();
  }

  try {
    return await firebasePromise;
  } catch (error) {
    setStatus(friendlyError(error), "error");
    throw error;
  }
}

// Bind UI actions immediately. The account-mode toggle works even if Firebase fails to load.
const modeButton = $("#auth-mode");
if (modeButton && !window.__MODEL_AI_LOGIN_UI_BOUND) {
  modeButton.addEventListener("click", () => {
    setMode(modeButton.dataset.next || "create");
  });
}

const form = $("#auth-form");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = safeText($("#auth-email")?.value);
    const password = $("#auth-password")?.value || "";
    const name = safeText($("#auth-name")?.value);
    const creating = modeButton?.dataset.next === "signin";

    if (!email) return setStatus("Enter your email address.", "error");
    if (password.length < 6) return setStatus("Use a password with at least 6 characters.", "error");
    if (creating && !name) return setStatus("Enter your name to create an account.", "error");

    setBusy(true);
    try {
      const loaded = await ensureFirebase();
      if (creating) {
        const credential = await loaded.authSdk.createUserWithEmailAndPassword(loaded.auth, email, password);
        await loaded.authSdk.updateProfile(credential.user, { displayName: name });
        setStatus("Account created successfully. Redirecting…", "success");
      } else {
        await loaded.authSdk.signInWithEmailAndPassword(loaded.auth, email, password);
        setStatus("Signed in successfully. Redirecting…", "success");
      }
      setTimeout(() => { location.href = "/account.html"; }, 500);
    } catch (error) {
      setStatus(friendlyError(error), "error");
      console.error("[MODEL AI auth] Email auth action failed", error);
    } finally {
      setBusy(false);
    }
  });
}

const googleButton = $("#google-signin");
if (googleButton) {
  googleButton.addEventListener("click", async () => {
    setBusy(true);
    try {
      const loaded = await ensureFirebase();
      const provider = new loaded.authSdk.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await loaded.authSdk.signInWithPopup(loaded.auth, provider);
      setStatus("Google sign-in successful. Redirecting…", "success");
      setTimeout(() => { location.href = "/account.html"; }, 500);
    } catch (error) {
      setStatus(friendlyError(error), "error");
      console.error("[MODEL AI auth] Google sign-in failed", error);
    } finally {
      setBusy(false);
    }
  });
}

const resetButton = $("#password-reset");
if (resetButton) {
  resetButton.addEventListener("click", async () => {
    const email = safeText($("#auth-email")?.value);
    if (!email) return setStatus("Enter your email address first, then choose Forgot password.", "error");
    setBusy(true);
    try {
      const loaded = await ensureFirebase();
      await loaded.authSdk.sendPasswordResetEmail(loaded.auth, email);
      setStatus("Password reset email sent. Check your inbox and spam folder.", "success");
    } catch (error) {
      setStatus(friendlyError(error), "error");
      console.error("[MODEL AI auth] Password reset failed", error);
    } finally {
      setBusy(false);
    }
  });
}

const signoutButton = $("#signout-button");
if (signoutButton) {
  signoutButton.addEventListener("click", async () => {
    if (!auth || !currentUser) {
      location.href = "/login.html";
      return;
    }
    try {
      await authSdk.signOut(auth);
      location.href = "/";
    } catch (error) {
      setStatus(friendlyError(error), "error");
    }
  });
}

if (form) setMode("signin");
updateAccountUI(null);
window.__MODEL_AI_AUTH_READY = true;

// Initialize in the background so signed-in users and the header are updated.
void ensureFirebase().catch((error) => console.warn("[MODEL AI auth] Startup check failed", error));

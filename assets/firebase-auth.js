import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { firebaseConfig, firebaseConfigured } from "/assets/firebase-config.js";

const $ = (s, root=document) => root.querySelector(s);
const safeText = (value) => String(value || "").trim();
let auth = null;
let firebaseReady = false;
let currentUser = null;
const setStatus = (text, kind="info") => { const el=$("#auth-status"); if(el){el.textContent=text;el.dataset.kind=kind;el.hidden=false;} };
const setBusy = (busy) => document.querySelectorAll("[data-auth-action]").forEach(b=>{b.disabled=busy;b.setAttribute("aria-busy",String(busy));});
const friendlyError = (error) => { const code=error?.code||""; const map={
  "auth/invalid-email":"Please enter a valid email address.",
  "auth/missing-password":"Please enter your password.",
  "auth/weak-password":"Use a password with at least 6 characters.",
  "auth/email-already-in-use":"An account already exists for this email. Try signing in.",
  "auth/invalid-credential":"Email or password is incorrect.",
  "auth/user-not-found":"No account found for this email. Create an account first.",
  "auth/wrong-password":"Email or password is incorrect.",
  "auth/popup-closed-by-user":"Google sign-in was closed before finishing.",
  "auth/unauthorized-domain":"This domain is not authorized in Firebase Authentication settings.",
  "auth/operation-not-allowed":"Enable this sign-in method in Firebase Console → Authentication → Sign-in method.",
  "auth/network-request-failed":"Network error. Check your internet connection and try again."
}; return map[code] || (error?.message || "Authentication failed. Check Firebase setup and try again."); };
function requireConfig(){ if(!firebaseConfigured){setStatus("Firebase setup is not complete yet. Follow FIREBASE-SETUP.md and add your web app config.","error");return false;} return true; }
function setMode(mode){const create=mode==="create"; $("#auth-title") && ( $("#auth-title").textContent=create?"Create your MODEL AI account":"Welcome back" ); $("#auth-subtitle") && ( $("#auth-subtitle").textContent=create?"Save your account details and get started.":"Sign in to continue to your workspace." ); $("#name-field")?.toggleAttribute("hidden",!create); $("#auth-name")?.toggleAttribute("hidden",!create); $("#auth-submit") && ( $("#auth-submit").textContent=create?"Create account":"Sign in" ); $("#auth-mode") && ( $("#auth-mode").textContent=create?"Already have an account? Sign in":"New to MODEL AI? Create an account" ); $("#auth-mode")?.setAttribute("data-mode",create?"signin":"create"); $("#auth-mode")?.setAttribute("aria-pressed",String(create)); $("#auth-mode")?.classList.toggle("active",create); const title=$("#auth-mode"); if(title) title.dataset.next=create?"signin":"create"; const status=$("#auth-status"); if(status) status.hidden=true; }
function updateAccountUI(user){currentUser=user||null;const link=$("#auth-profile-link");if(link){const name=user?(user.displayName||user.email?.split("@")[0]||"Account"):"Sign in";$("#auth-display-name")&&( $("#auth-display-name").textContent=name );$("#auth-welcome")&&( $("#auth-welcome").textContent=user?"Signed in":"Welcome" );$("#auth-avatar")&&( $("#auth-avatar").textContent=user?(name[0]||"A").toUpperCase():"👤" );link.href=user?"/account.html":"/login.html";link.setAttribute("aria-label",user?"Open your MODEL AI account":"Sign in to MODEL AI");} const accountName=$("#account-display-name");if(accountName)accountName.textContent=user?(user.displayName||user.email||"MODEL AI member"):"You are not signed in";const accountEmail=$("#account-email");if(accountEmail)accountEmail.textContent=user?.email||"Sign in to view account details.";$("#account-signed-in")?.toggleAttribute("hidden",!user);$("#account-signed-out")?.toggleAttribute("hidden",!!user);}
try { if(firebaseConfigured){ const app=initializeApp(firebaseConfig); auth=getAuth(app); firebaseReady=true; onAuthStateChanged(auth, user=>{updateAccountUI(user); if($("#login-card")&&user){setStatus("You are signed in. Opening your account…","success");setTimeout(()=>{location.href="/account.html";},650);}}); } else { updateAccountUI(null); } } catch(error){console.error("Firebase initialization error",error);setStatus("Firebase could not start. Check assets/firebase-config.js.","error");}

const modeButton=$("#auth-mode");modeButton?.addEventListener("click",()=>setMode(modeButton.dataset.next||"create"));
$("#auth-form")?.addEventListener("submit",async e=>{e.preventDefault();if(!requireConfig())return;const email=safeText($("#auth-email")?.value);const password=$("#auth-password")?.value||"";const name=safeText($("#auth-name")?.value);const creating=modeButton?.dataset.next==="signin";if(!email||!password){setStatus("Enter your email and password.","error");return;}if(creating&&!name){setStatus("Enter your name to create an account.","error");return;}setBusy(true);try{if(creating){const cred=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(cred.user,{displayName:name});setStatus("Account created successfully. Redirecting…","success");}else{await signInWithEmailAndPassword(auth,email,password);setStatus("Signed in successfully. Redirecting…","success");}setTimeout(()=>location.href="/account.html",500);}catch(error){setStatus(friendlyError(error),"error");}finally{setBusy(false);}});
$("#google-signin")?.addEventListener("click",async()=>{if(!requireConfig())return;setBusy(true);try{const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:"select_account"});await signInWithPopup(auth,provider);setStatus("Google sign-in successful. Redirecting…","success");setTimeout(()=>location.href="/account.html",500);}catch(error){setStatus(friendlyError(error),"error");}finally{setBusy(false);}});
$("#password-reset")?.addEventListener("click",async()=>{if(!requireConfig())return;const email=safeText($("#auth-email")?.value);if(!email){setStatus("Enter your email address first, then choose Forgot password.","error");return;}try{await sendPasswordResetEmail(auth,email);setStatus("Password reset email sent. Check your inbox and spam folder.","success");}catch(error){setStatus(friendlyError(error),"error");}});
$("#signout-button")?.addEventListener("click",async()=>{if(!auth||!currentUser){location.href="/login.html";return;}try{await signOut(auth);location.href="/";}catch(error){setStatus(friendlyError(error),"error");}});
if($("#auth-form"))setMode("signin");

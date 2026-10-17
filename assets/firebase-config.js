/*
 * MODEL AI — Firebase Web Configuration
 * Used by /assets/firebase-auth.js
 */

(() => {
  "use strict";

  const config = {
    apiKey: "AIzaSyDXlru4Tt19yqfIe3oKUtc3yn5v_l55fms",
    authDomain: "modelaitools.firebaseapp.com",
    projectId: "modelaitools",
    storageBucket: "modelaitools.firebasestorage.app",
    messagingSenderId: "833872426359",
    appId: "1:833872426359:web:67a321c8b5619ca79d5d72",
    measurementId: "G-DZM6GER0W6"
  };

  // Share the configuration with the MODEL AI authentication script.
  window.MODEL_AI_FIREBASE_CONFIG = config;

  // Check whether required Firebase values are present.
  window.MODEL_AI_FIREBASE_CONFIGURED =
    Boolean(
      config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.appId &&
      config.messagingSenderId
    );
})();

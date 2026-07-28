/* =========================================================
   FIREBASE CONFIG
   1. Go to https://console.firebase.google.com → create a project
   2. Add a Web App → copy the config object below
   3. Enable: Authentication (Email/Password + Google), Firestore Database, Storage
   4. Paste your Firestore security rules from /firestore.rules
   ========================================================= */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Demo mode: if config hasn't been filled in, LUXE runs on local sample
// data (js/data.js) so the site is fully clickable out of the box.
const FIREBASE_ENABLED = firebaseConfig.apiKey !== "YOUR_API_KEY";

let auth = null;
let db = null;
let storage = null;

if (FIREBASE_ENABLED) {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
  storage = firebase.storage();
} else {
  console.info(
    "%cLUXE MARKET running in DEMO MODE",
    "color:#c9a24b;font-weight:bold;",
    "\nAdd your Firebase keys in js/firebase-config.js to go live with real Auth + Firestore."
  );
}

/* ---------------------------------------------------------
   Firestore collection map (create these in Firestore):
   products/{productId}
   categories/{categoryId}
   brands/{brandId}
   orders/{orderId}
   customers/{uid}
   reviews/{reviewId}
   coupons/{code}
   carts/{uid}
   wishlists/{uid}
   banners/{bannerId}
   blogPosts/{postId}
   settings/store  (single doc)
   admins/{uid}
--------------------------------------------------------- */

# LUXE MARKET — Premium E-Commerce Website

A full, static, multi-page e-commerce site (customer storefront + admin dashboard)
built with plain HTML/CSS/JS, ready to host on **GitHub Pages** and wired for
**Firebase Authentication** + **Cloud Firestore**. No build step, no framework,
no server required.

---

## ✨ What's included

**Storefront**
- Homepage — hero slider, featured categories, featured/new/deal/best-seller rails, brand strip, testimonials, social feed, newsletter
- Shop — filters (category, brand, price, rating, colour, stock), search, sort, grid/list view, pagination
- Product page — gallery with zoom, video modal, colour/size selectors, quantity, stock, tabs (description/specs/reviews/delivery), ratings breakdown, write-a-review, related / frequently-bought-together / recently-viewed rails
- Cart — quantity edit, remove, save-for-later, coupon codes, shipping estimate, tax, totals
- Checkout — guest or logged-in, 4-step flow (address → delivery → payment → review), M-Pesa / Card / Bank / Mobile Money / PayPal / Cash on Delivery, order confirmation
- Accounts — register, login, Google sign-in, forgot password, profile, address book, order history, returns, wishlist, saved payment methods, notifications
- Wishlist, Compare (up to 4 products), Order Tracking (status stepper)
- About, Blog, FAQ / Help Centre, Contact (form + map + WhatsApp)
- Left sidebar navigation (collapsible + mobile drawer) on every page, premium navy/gold design system

**Admin Dashboard** (`/admin`)
- Dashboard — revenue KPIs, 7-day revenue chart, low-stock alerts, recent orders, best sellers, pending deliveries
- Products — full CRUD (add / edit / delete), search & category filter
- Inventory — stock levels, low/out-of-stock KPIs, quick stock adjustment, purchase orders
- Orders — search/filter, order detail modal, status updates, invoice/shipping-label stubs
- Customers — list with order count, lifetime spend, loyalty points, customer segment
- Marketing — coupons (create/enable/disable), banners, bundle/BOGO offers, newsletter + push campaign stubs
- Reports — date-range KPIs, sales-by-category, payment-method split, product performance
- Settings — store info, shipping rates, payment gateways, taxes, email/notifications, website management, admins & roles, activity log, JSON backup export

---

## 🧪 Demo mode (works immediately, no setup)

Open `index.html` in a browser (or serve the folder) and the whole site works
out of the box. `js/firebase-config.js` detects that no real Firebase project
has been configured and falls back to **localStorage**, seeded with realistic
sample products, categories, orders and reviews (see `js/data.js`).

**Demo admin login:** `admin@luxe.test` / `admin123` (pre-filled on `admin/login.html`).

Every read/write in the app goes through the `LuxeDB` object (`js/data.js`) and
`LuxeAuth` object (`js/auth.js`) — so switching to real Firebase later requires
**zero page-level code changes**.

---

## 🔥 Going live with Firebase

1. **Create a Firebase project** at https://console.firebase.google.com
2. **Add a Web App** (</> icon) and copy the `firebaseConfig` object
3. Paste it into `js/firebase-config.js` — this alone flips `FIREBASE_ENABLED` to `true`
4. In the Firebase console enable:
   - **Authentication** → Sign-in method → Email/Password, and Google
   - **Firestore Database** → Create database (production mode)
   - **Storage** (optional, for product images uploaded via admin)
5. Deploy the provided `firestore.rules` (Firestore → Rules tab, paste the contents of `/firestore.rules`)
6. Create your first **admin** user:
   - Register a normal account on the site (or via Firebase console → Authentication)
   - In Firestore, create a document at `admins/{that user's uid}` with any field, e.g. `{ role: "super_admin" }`
   - That account can now access `/admin`
7. (Optional) Seed initial catalog data — either add products through the Admin → Products screen, or bulk-import via the Firebase console / a script using the `products` collection shape documented at the top of `js/data.js`.

### Firestore collections used
```
products/{productId}     categories/{categoryId}   brands/{brandId}
orders/{orderId}         customers/{uid}           reviews/{reviewId}
coupons/{code}           carts/{uid}                wishlists/{uid}
banners/{bannerId}       blogPosts/{postId}        settings/store
admins/{uid}
```

---

## 🚀 Deploying to GitHub Pages

1. Push this folder to a GitHub repository
2. Repo → Settings → Pages → Deploy from branch → select `main` (or `master`) and `/ (root)`
3. Your site will be live at `https://<username>.github.io/<repo>/`
4. Because this is a static site with client-side routing (query strings, not
   path-based routes), no special Pages configuration is needed

> Payment gateways (M-Pesa Daraja, Stripe/card, PayPal) require a small server
> or Cloud Function to hold secret keys and confirm payments — GitHub Pages
> only hosts static files. The checkout flow here is fully wired on the
> front end (method selection, order creation in Firestore) and ready to
> connect to Firebase Cloud Functions for the actual payment capture step.

---

## 🎨 Customizing the design

All design tokens live at the top of `css/style.css` under `:root` —
change `--navy-900`, `--gold`, `--sage`, `--rose`, fonts, radius, etc. and
the whole site (storefront + admin) updates, since every page shares one
stylesheet.

Sidebar navigation links are defined once in `js/layout.js` (`NAV_SECTIONS`)
for the storefront and `js/admin-layout.js` (`ADMIN_NAV`) for the admin
panel — edit those arrays to add/remove/reorder nav items site-wide.

---

## 📁 Project structure

```
index.html            Homepage
shop.html              Catalog + filters
product.html            Product detail
cart.html                Cart
checkout.html             Checkout
login.html / register.html / forgot-password.html
account.html            Customer dashboard
wishlist.html / compare.html / track-order.html
about.html / blog.html / faq.html / contact.html
admin/
  login.html            Admin login
  index.html             Dashboard
  products.html            Product CRUD
  inventory.html            Stock management
  orders.html                Order management
  customers.html               Customer list
  marketing.html                 Coupons / banners / campaigns
  reports.html                     Sales & performance reports
  settings.html                      Store / shipping / payments / users
css/style.css          Shared design system
js/
  firebase-config.js   Firebase init (fill in your keys)
  data.js               LuxeDB — sample data + Firestore/localStorage abstraction
  auth.js                LuxeAuth — Firebase Auth + demo fallback
  cart.js                  Cart / Wishlist / Compare / Toast helpers
  layout.js                 Storefront sidebar/topbar/footer injector
  admin-layout.js             Admin sidebar/topbar injector + guardAdmin()
  render.js                     Shared product card renderers
  main.js, shop.js, product.js, cart-page.js, checkout.js, account.js
  admin.js, admin-dashboard.js, admin-products.js, admin-orders.js
firestore.rules       Production security rules
```

---

## ⚠️ Before going to production

- Replace demo Google Sign-In / Facebook buttons with your configured OAuth providers
- Remove the seeded `admin@luxe.test` demo account and manage real admins via the `admins` collection
- Connect a payment backend (Firebase Cloud Functions) for M-Pesa STK push, card capture, and PayPal
- Add real product photography (currently uses placeholder images from picsum.photos)
- Review and tighten `firestore.rules` for your exact data model before launch

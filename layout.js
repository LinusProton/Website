/* =========================================================
   LUXE MARKET — Shared Layout (sidebar / topbar / footer)
   Injected on every page so nav + branding live in one place.
   Set <body data-page="shop"> to highlight the matching link.
   ========================================================= */
const NAV_SECTIONS = [
  {
    label: "Shop",
    links: [
      { page: "home", href: "index.html", label: "Home", icon: "home" },
      { page: "shop", href: "shop.html", label: "All Products", icon: "grid" },
      { page: "deals", href: "shop.html?deal=1", label: "Today's Deals", icon: "tag" },
      { page: "brands", href: "shop.html", label: "Brands", icon: "star" }
    ]
  },
  {
    label: "Categories",
    links: [
      { page: "cat-electronics", href: "shop.html?category=electronics", label: "Electronics", icon: "electronics" },
      { page: "cat-fashion", href: "shop.html?category=fashion", label: "Fashion", icon: "fashion" },
      { page: "cat-beauty", href: "shop.html?category=beauty", label: "Beauty", icon: "beauty" },
      { page: "cat-home-living", href: "shop.html?category=home-living", label: "Home & Living", icon: "home2" },
      { page: "cat-jewellery", href: "shop.html?category=jewellery", label: "Jewellery", icon: "gem" },
      { page: "cat-shoes", href: "shop.html?category=shoes", label: "Shoes", icon: "shoe" },
      { page: "cat-more", href: "shop.html", label: "View all categories", icon: "more" }
    ]
  },
  {
    label: "My Account",
    links: [
      { page: "account", href: "account.html", label: "My Profile", icon: "user" },
      { page: "orders", href: "account.html#orders", label: "Order History", icon: "box" },
      { page: "track", href: "track-order.html", label: "Track Order", icon: "truck" },
      { page: "wishlist", href: "wishlist.html", label: "Wishlist", icon: "heart", countKey: "wishlist" },
      { page: "compare", href: "compare.html", label: "Compare", icon: "compare" }
    ]
  },
  {
    label: "Company",
    links: [
      { page: "about", href: "about.html", label: "About Us", icon: "info" },
      { page: "blog", href: "blog.html", label: "Blog", icon: "book" },
      { page: "contact", href: "contact.html", label: "Contact", icon: "mail" },
      { page: "faq", href: "faq.html", label: "Help Centre", icon: "help" }
    ]
  }
];

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  tag: '<path d="M20 12 12 20l-9-9V4h7z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
  star: '<path d="M12 3l2.7 5.7 6.3.9-4.5 4.4 1 6.3L12 17l-5.5 3 1-6.3L3 9.6l6.3-.9z"/>',
  electronics: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
  fashion: '<path d="M8 4 4 7l3 3v10h10V10l3-3-4-3-3 2-3-2z"/>',
  beauty: '<path d="M12 3v6M9 3h6M8 9h8l1 12H7z"/>',
  home2: '<path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/>',
  gem: '<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l3 6 3-6M9 9l3 12 3-12"/>',
  shoe: '<path d="M3 15c0-2 2-2 4-3l6-4 2 2h4a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
  more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  truck: '<path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
  heart: '<path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.3 4.5 6 4.2c2-.2 3.8 1 6 3.3 2.2-2.3 4-3.5 6-3.3 3.7.3 5.5 3.8 4 7.5C19.5 16.4 12 21 12 21z"/>',
  compare: '<path d="M8 3v18M16 3v18M3 8h5M16 8h5M3 16h5M16 16h5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 8v.01"/>',
  book: '<path d="M4 4h9a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M20 4h-4v16h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2 2-2 3.5M12 17v.01"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  cart: '<circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M3 4h2l2.4 12h11.2L21 8H6.5"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>'
};
const svgIcon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;

function buildSidebar(activePage) {
  const sections = NAV_SECTIONS.map(sec => `
    <div class="sidebar-section-label">${sec.label}</div>
    ${sec.links.map(l => {
      const countKey = l.countKey;
      const countVal = countKey === "wishlist" ? Wishlist.count() : 0;
      return `<a href="${l.href}" class="${activePage === l.page ? "active" : ""}">
        ${svgIcon(l.icon)}<span class="label-text">${l.label}</span>
        ${countVal ? `<span class="badge">${countVal}</span>` : ""}
      </a>`;
    }).join("")}
  `).join("");

  return `
  <aside class="sidebar" id="sidebar">
    <button class="sidebar-collapse-btn" id="sidebarCollapseBtn" title="Toggle sidebar" aria-label="Toggle sidebar">‹</button>
    <a href="index.html" class="sidebar-brand">
      <span class="mark">L</span>
      <span class="word">LUXE<small>MARKET</small></span>
    </a>
    <div class="sidebar-search">
      <input type="search" id="sidebarSearch" placeholder="Search products…" />
    </div>
    <nav class="sidebar-nav">${sections}</nav>
    <div class="sidebar-foot">
      <div class="support-card">
        <strong>Need help?</strong>
        Chat with us on WhatsApp — replies in minutes, daily 8am–9pm EAT.
        <div style="margin-top:.6rem;"><a href="contact.html" class="btn btn-gold btn-sm btn-block">Get Support</a></div>
      </div>
    </div>
  </aside>`;
}

function buildTopbar() {
  const user = LuxeAuth.currentUser();
  return `
  <header class="topbar">
    <button class="sidebar-toggle-mobile" id="mobileSidebarBtn" aria-label="Open menu">${svgIcon("menu")}</button>
    <form class="topbar-search" id="topbarSearchForm" role="search">
      ${svgIcon("search")}
      <input type="search" id="topbarSearchInput" placeholder="Search for products, brands and categories…" />
    </form>
    <div class="topbar-actions">
      <span class="topbar-bar-note">Free delivery in Nairobi over KSh 5,000</span>
      <a class="icon-btn" href="compare.html" title="Compare">${svgIcon("compare")}<span class="count" id="compareCount">0</span></a>
      <a class="icon-btn" href="wishlist.html" title="Wishlist">${svgIcon("heart")}<span class="count" id="wishlistCount">0</span></a>
      <a class="icon-btn" href="cart.html" title="Cart">${svgIcon("cart")}<span class="count" id="cartCount">0</span></a>
      <a class="icon-btn" href="${user ? "account.html" : "login.html"}" title="Account">${svgIcon("user")}</a>
    </div>
  </header>`;
}

function buildFooter() {
  return `
  <footer class="site-footer">
    <div class="footer-grid">
      <div>
        <h4 style="font-family:var(--font-display);font-size:1.3rem;color:#fff;">LUXE MARKET</h4>
        <p style="color:var(--ivory-dim);font-size:.85rem;max-width:280px;">Considered products, honest prices, and service that treats every order like it matters. Based in Nairobi, shipping across Kenya and beyond.</p>
        <div class="social-row">
          <a href="#" aria-label="Instagram">${svgIcon("star")}</a>
          <a href="#" aria-label="Facebook">${svgIcon("info")}</a>
          <a href="#" aria-label="TikTok">${svgIcon("compare")}</a>
        </div>
      </div>
      <div>
        <h4>Shop</h4>
        <a href="shop.html">All Products</a>
        <a href="shop.html?deal=1">Today's Deals</a>
        <a href="shop.html?category=fashion">New Arrivals</a>
        <a href="shop.html">Best Sellers</a>
      </div>
      <div>
        <h4>Support</h4>
        <a href="faq.html">FAQs</a>
        <a href="contact.html">Contact Us</a>
        <a href="track-order.html">Track Order</a>
        <a href="account.html#returns">Returns &amp; Refunds</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="about.html">About Us</a>
        <a href="blog.html">Blog</a>
        <a href="admin/index.html">Admin Dashboard</a>
        <a href="contact.html">Careers</a>
      </div>
      <div>
        <h4>Stay in the loop</h4>
        <p style="font-size:.8rem;">Subscribe for early access to drops and offers.</p>
        <div class="newsletter-mini">
          <input type="email" placeholder="Your email" id="footerNewsletterEmail"/>
          <button id="footerNewsletterBtn">Join</button>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} LUXE MARKET. All rights reserved. · <a href="#" style="color:inherit;text-decoration:underline;">Privacy Policy</a> · <a href="#" style="color:inherit;text-decoration:underline;">Terms</a></span>
      <div class="pay-icons">
        <span>M-PESA</span><span>VISA</span><span>Mastercard</span><span>PayPal</span><span>Bank Transfer</span>
      </div>
    </div>
  </footer>`;
}

function renderLayout() {
  const body = document.body;
  const activePage = body.dataset.page || "";
  const sidebarMount = document.getElementById("sidebar-mount");
  const topbarMount = document.getElementById("topbar-mount");
  const footerMount = document.getElementById("footer-mount");
  if (sidebarMount) sidebarMount.outerHTML = buildSidebar(activePage);
  if (topbarMount) topbarMount.outerHTML = buildTopbar();
  if (footerMount) footerMount.outerHTML = buildFooter();

  wireLayoutEvents();
  refreshCounts();
}

function wireLayoutEvents() {
  const sidebar = document.getElementById("sidebar");
  const mainArea = document.getElementById("main-area");
  const collapseBtn = document.getElementById("sidebarCollapseBtn");
  const mobileBtn = document.getElementById("mobileSidebarBtn");

  if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainArea.classList.toggle("collapsed");
      collapseBtn.textContent = sidebar.classList.contains("collapsed") ? "›" : "‹";
      LS.set("luxe_sidebar_collapsed", sidebar.classList.contains("collapsed"));
    });
    if (LS.get("luxe_sidebar_collapsed", false) && window.innerWidth > 960) {
      sidebar.classList.add("collapsed"); mainArea.classList.add("collapsed"); collapseBtn.textContent = "›";
    }
  }
  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => sidebar.classList.toggle("mobile-open"));
  }
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 960 && sidebar && sidebar.classList.contains("mobile-open")
      && !sidebar.contains(e.target) && e.target !== mobileBtn && !mobileBtn?.contains(e.target)) {
      sidebar.classList.remove("mobile-open");
    }
  });

  const searchForm = document.getElementById("topbarSearchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = document.getElementById("topbarSearchInput").value.trim();
      window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
    });
  }
  const sideSearch = document.getElementById("sidebarSearch");
  if (sideSearch) {
    sideSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") window.location.href = `shop.html?q=${encodeURIComponent(sideSearch.value.trim())}`;
    });
  }
  const nlBtn = document.getElementById("footerNewsletterBtn");
  if (nlBtn) {
    nlBtn.addEventListener("click", () => {
      const email = document.getElementById("footerNewsletterEmail").value.trim();
      if (email) { Toast.show("Subscribed! Watch your inbox for offers."); document.getElementById("footerNewsletterEmail").value = ""; }
    });
  }

  document.addEventListener("cart:change", refreshCounts);
  document.addEventListener("wishlist:change", refreshCounts);
  document.addEventListener("compare:change", refreshCounts);
}

function refreshCounts() {
  const cartEl = document.getElementById("cartCount");
  const wishEl = document.getElementById("wishlistCount");
  const cmpEl = document.getElementById("compareCount");
  if (cartEl) cartEl.textContent = Cart.count();
  if (wishEl) wishEl.textContent = Wishlist.count();
  if (cmpEl) cmpEl.textContent = Compare.get().length;
}

document.addEventListener("DOMContentLoaded", renderLayout);

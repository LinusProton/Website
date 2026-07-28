/* =========================================================
   LUXE MARKET — Admin Layout
   Separate left nav for the admin dashboard suite.
   ========================================================= */
const ADMIN_NAV = [
  { label: "Overview", links: [{ page: "dashboard", href: "index.html", label: "Dashboard", icon: "grid" }] },
  {
    label: "Catalog", links: [
      { page: "products", href: "products.html", label: "Products", icon: "box" },
      { page: "inventory", href: "inventory.html", label: "Inventory", icon: "truck" }
    ]
  },
  {
    label: "Sales", links: [
      { page: "orders", href: "orders.html", label: "Orders", icon: "tag" },
      { page: "customers", href: "customers.html", label: "Customers", icon: "user" }
    ]
  },
  {
    label: "Growth", links: [
      { page: "marketing", href: "marketing.html", label: "Marketing", icon: "star" },
      { page: "reports", href: "reports.html", label: "Reports", icon: "compare" }
    ]
  },
  { label: "System", links: [{ page: "settings", href: "settings.html", label: "Settings", icon: "info" }] }
];

function buildAdminSidebar(activePage) {
  const sections = ADMIN_NAV.map(sec => `
    <div class="sidebar-section-label">${sec.label}</div>
    ${sec.links.map(l => `<a href="${l.href}" class="${activePage === l.page ? "active" : ""}">${svgIcon(l.icon)}<span class="label-text">${l.label}</span></a>`).join("")}
  `).join("");
  return `
  <aside class="sidebar" id="sidebar">
    <button class="sidebar-collapse-btn" id="sidebarCollapseBtn" aria-label="Toggle sidebar">‹</button>
    <a href="index.html" class="sidebar-brand">
      <span class="mark">L</span>
      <span class="word">LUXE<small>ADMIN PANEL</small></span>
    </a>
    <nav class="sidebar-nav">${sections}</nav>
    <div class="sidebar-foot">
      <div class="support-card">
        <strong>Storefront</strong>
        View the live site as a customer sees it.
        <div style="margin-top:.6rem;"><a href="../index.html" class="btn btn-gold btn-sm btn-block">View Store →</a></div>
      </div>
    </div>
  </aside>`;
}

function buildAdminTopbar(title) {
  const user = LuxeAuth.currentUser();
  return `
  <header class="topbar">
    <button class="sidebar-toggle-mobile" id="mobileSidebarBtn" aria-label="Open menu">${svgIcon("menu")}</button>
    <h3 style="margin:0;font-size:1.1rem;">${title}</h3>
    <div class="topbar-actions">
      <span class="topbar-bar-note">${user ? (user.name || user.email) : "Admin"}</span>
      <a class="icon-btn" href="../index.html" title="View store">${svgIcon("home")}</a>
      <button class="icon-btn" id="adminLogoutBtn" title="Logout">${svgIcon("user")}</button>
    </div>
  </header>`;
}

function renderAdminLayout(title) {
  const body = document.body;
  const activePage = body.dataset.page || "";
  document.getElementById("sidebar-mount").outerHTML = buildAdminSidebar(activePage);
  document.getElementById("topbar-mount").outerHTML = buildAdminTopbar(title);
  wireLayoutEvents();
  document.getElementById("adminLogoutBtn")?.addEventListener("click", async () => {
    await LuxeAuth.logout();
    window.location.href = "login.html";
  });
}

async function guardAdmin() {
  const user = LuxeAuth.currentUser();
  if (!user) { window.location.href = "login.html"; return false; }
  const ok = await LuxeAuth.isAdmin();
  if (!ok) {
    document.body.innerHTML = `<div style="padding:4rem;text-align:center;font-family:sans-serif;">
      <h2>Access denied</h2><p>This account does not have admin permissions.</p>
      <p style="color:#888;font-size:.85rem;">Demo mode: any account can be made admin — see admin/login.html for the demo admin credentials.</p>
      <a href="login.html">← Back to admin login</a></div>`;
    return false;
  }
  return true;
}

/* =========================================================
   LUXE MARKET — Account Dashboard
   ========================================================= */
const STATUS_CLASS = { pending: "status-pending", processing: "status-processing", shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled" };

function wireAccountTabs() {
  document.querySelectorAll(".acc-tab").forEach(tab => tab.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".acc-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".acc-panel").forEach(p => p.style.display = "none");
    tab.classList.add("active");
    document.getElementById(`panel-${tab.dataset.tab}`).style.display = "block";
  }));
  if (location.hash) {
    const match = document.querySelector(`.acc-tab[href="${location.hash}"]`);
    if (match) match.click();
  }
}

function orderRowHTML(o) {
  return `
  <div class="info-card" style="margin-bottom:.8rem;">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:.6rem;align-items:center;">
      <div>
        <strong>Order #${o.id}</strong>
        <div style="font-size:.75rem;color:var(--text-mute);">${new Date(o.createdAt).toLocaleString()} · ${o.items.length} item(s)</div>
      </div>
      <span class="status-pill ${STATUS_CLASS[o.status] || "status-pending"}">${o.status}</span>
    </div>
    <div style="margin-top:.6rem;display:flex;gap:.6rem;flex-wrap:wrap;">
      ${o.items.slice(0, 4).map(i => `<img src="${i.image}" style="width:44px;height:44px;border-radius:6px;object-fit:cover;"/>`).join("")}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.8rem;">
      <strong>${money(o.total)}</strong>
      <div style="display:flex;gap:.5rem;">
        <a href="track-order.html?id=${o.id}" class="btn btn-outline btn-sm">Track</a>
        <button class="btn btn-outline btn-sm invoice-btn" data-id="${o.id}">Invoice</button>
      </div>
    </div>
  </div>`;
}

async function loadOrders(user) {
  const orders = await LuxeDB.getOrders(user?.uid);
  const list = document.getElementById("orderHistoryList");
  list.innerHTML = orders.length ? orders.map(orderRowHTML).join("") : "<p>No orders yet. <a href='shop.html'>Start shopping →</a></p>";

  const returnable = orders.filter(o => o.status === "delivered");
  document.getElementById("returnableOrders").innerHTML = returnable.length
    ? returnable.map(o => `
      <div class="info-card" style="display:flex;justify-content:space-between;align-items:center;">
        <span>Order #${o.id} · ${money(o.total)}</span>
        <button class="btn btn-outline btn-sm return-btn" data-id="${o.id}">Request Return</button>
      </div>`).join("")
    : "<p>No delivered orders eligible for return yet.</p>";

  document.querySelectorAll(".return-btn").forEach(b => b.addEventListener("click", () => Toast.show(`Return requested for order #${b.dataset.id}`)));
  document.querySelectorAll(".invoice-btn").forEach(b => b.addEventListener("click", () => Toast.show(`Invoice for #${b.dataset.id} would download here.`)));
}

function loadAddresses(user) {
  const addresses = user?.addresses || LS.get("luxe_addresses", []);
  const list = document.getElementById("addressList");
  list.innerHTML = addresses.length ? addresses.map((a, i) => `
    <div class="info-card" style="display:flex;justify-content:space-between;align-items:center;">
      <div><strong>${a.label}</strong><div style="font-size:.8rem;color:var(--text-mute);">${a.street}, ${a.city} · ${a.phone}</div></div>
      <button class="btn btn-outline btn-sm rm-addr" data-i="${i}">Remove</button>
    </div>`).join("") : "<p>No saved addresses yet.</p>";
  list.querySelectorAll(".rm-addr").forEach(b => b.addEventListener("click", () => {
    const list = LS.get("luxe_addresses", []);
    list.splice(+b.dataset.i, 1);
    LS.set("luxe_addresses", list);
    loadAddresses(user);
  }));
}

function loadNotifications() {
  const notifs = [
    { text: "Your order #ORD10234 has shipped.", time: "2h ago" },
    { text: "Flash Sale: 30% off Beauty ends tonight.", time: "1d ago" },
    { text: "Welcome to LUXE MARKET — enjoy 10% off your first order.", time: "3d ago" }
  ];
  document.getElementById("notifList").innerHTML = notifs.map(n => `
    <div style="padding:.7rem 0;border-bottom:1px solid #f2eee0;font-size:.85rem;display:flex;justify-content:space-between;">
      <span>${n.text}</span><span style="color:var(--text-mute);font-size:.75rem;">${n.time}</span>
    </div>`).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!LuxeAuth.requireLogin("account.html")) return;
  const user = LuxeAuth.currentUser();
  document.getElementById("accountGreeting").textContent = `Welcome, ${user.name || user.displayName || user.email}`;
  document.getElementById("profName").value = user.name || user.displayName || "";
  document.getElementById("profEmail").value = user.email || "";
  document.getElementById("loyaltyPoints").textContent = user.loyaltyPoints || 120;

  wireAccountTabs();
  await loadOrders(user);
  loadAddresses(user);
  loadNotifications();

  document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    await LuxeDB.saveCustomer({ uid: user.uid, name: document.getElementById("profName").value, phone: document.getElementById("profPhone").value });
    Toast.show("Profile updated");
  });

  document.getElementById("addAddressBtn").addEventListener("click", () => document.getElementById("addressModal").classList.add("open"));
  document.getElementById("closeAddressModal").addEventListener("click", () => document.getElementById("addressModal").classList.remove("open"));
  document.getElementById("saveAddressBtn").addEventListener("click", () => {
    const addr = {
      label: document.getElementById("newAddrLabel").value || "Address",
      phone: document.getElementById("newAddrPhone").value,
      street: document.getElementById("newAddrStreet").value,
      city: document.getElementById("newAddrCity").value
    };
    const list = LS.get("luxe_addresses", []);
    list.push(addr);
    LS.set("luxe_addresses", list);
    document.getElementById("addressModal").classList.remove("open");
    loadAddresses(user);
    Toast.show("Address saved");
  });

  document.getElementById("logoutLink").addEventListener("click", async (e) => {
    e.preventDefault();
    await LuxeAuth.logout();
    window.location.href = "index.html";
  });
});

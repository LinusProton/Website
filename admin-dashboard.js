/* =========================================================
   LUXE MARKET — Admin Dashboard
   ========================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  if (!(await guardAdmin())) return;
  renderAdminLayout("Dashboard");

  const [orders, products] = await Promise.all([LuxeDB.getOrders(), LuxeDB.getProducts()]);
  const revenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === "pending" || o.status === "processing").length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 8);
  const outOfStock = products.filter(p => p.stock === 0);

  document.getElementById("kpiGrid").innerHTML = `
    <div class="kpi-card"><div class="lbl">Total Revenue</div><div class="val">${money(revenue)}</div><div class="kpi-delta up">▲ 12.4% vs last month</div></div>
    <div class="kpi-card"><div class="lbl">Orders</div><div class="val">${orders.length}</div><div class="kpi-delta up">▲ 8 new today</div></div>
    <div class="kpi-card"><div class="lbl">Customers</div><div class="val">${(await LuxeDB.getCustomers()).length}</div><div class="kpi-delta up">▲ 5.1% growth</div></div>
    <div class="kpi-card"><div class="lbl">Pending Orders</div><div class="val">${pending}</div><div class="kpi-delta down">Needs action</div></div>
  `;

  // simple revenue bar chart (last 7 days) via inline SVG
  const days = Array.from({ length: 7 }).map((_, i) => {
    const dayStart = new Date(); dayStart.setDate(dayStart.getDate() - (6 - i)); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = dayStart.getTime() + 86400000;
    const total = orders.filter(o => o.createdAt >= dayStart.getTime() && o.createdAt < dayEnd).reduce((s, o) => s + o.total, 0);
    return { label: dayStart.toLocaleDateString("en-KE", { weekday: "short" }), total };
  });
  const max = Math.max(...days.map(d => d.total), 1000);
  const barW = 60, gap = 25, chartH = 170;
  const svg = document.getElementById("revenueChart");
  svg.innerHTML = days.map((d, i) => {
    const h = (d.total / max) * chartH;
    const x = 30 + i * (barW + gap);
    return `<rect x="${x}" y="${200 - h}" width="${barW}" height="${h}" rx="6" fill="url(#g1)"/>
      <text x="${x + barW / 2}" y="215" text-anchor="middle" font-size="11" fill="#6b7280">${d.label}</text>`;
  }).join("") + `<defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e3c47a"/><stop offset="100%" stop-color="#c9a24b"/></linearGradient></defs>`;

  document.getElementById("lowStockList").innerHTML = [...outOfStock, ...lowStock].slice(0, 6).map(p => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid #f2eee0;font-size:.83rem;">
      <span>${p.name}</span><span class="tag-chip" style="color:${p.stock === 0 ? "var(--rose)" : "var(--gold-dim)"};">${p.stock === 0 ? "Out of stock" : p.stock + " left"}</span>
    </div>`).join("") || "<p style='font-size:.85rem;'>All products well stocked.</p>";

  document.getElementById("recentOrdersTable").innerHTML = `
    <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
    <tbody>${orders.slice(0, 6).map(o => `<tr><td>#${o.id}</td><td>${o.customerName}</td><td>${money(o.total)}</td><td>${statusPill(o.status)}</td></tr>`).join("")}</tbody>`;

  const salesCount = {};
  orders.forEach(o => o.items.forEach(i => salesCount[i.productId] = (salesCount[i.productId] || 0) + i.qty));
  const bestSellers = Object.entries(salesCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, qty]) => ({ product: products.find(p => p.id === id), qty })).filter(x => x.product);
  document.getElementById("bestSellerList").innerHTML = bestSellers.map(b => `
    <div style="display:flex;gap:.6rem;align-items:center;padding:.5rem 0;border-bottom:1px solid #f2eee0;">
      <img src="${b.product.images[0]}" style="width:38px;height:38px;border-radius:6px;object-fit:cover;"/>
      <div style="flex:1;font-size:.82rem;">${b.product.name}</div>
      <strong style="font-size:.8rem;">${b.qty} sold</strong>
    </div>`).join("") || "<p style='font-size:.85rem;'>Not enough sales data yet.</p>";

  document.getElementById("pendingDeliveryTable").innerHTML = `
    <thead><tr><th>Order</th><th>Customer</th><th>City</th><th>Status</th><th></th></tr></thead>
    <tbody>${orders.filter(o => ["pending", "processing", "shipped"].includes(o.status)).slice(0, 8).map(o => `
      <tr><td>#${o.id}</td><td>${o.customerName}</td><td>${o.shipping_address?.city || o.shipping?.city || "—"}</td><td>${statusPill(o.status)}</td>
      <td><a href="orders.html" class="link-more">Manage →</a></td></tr>`).join("")}</tbody>`;
});

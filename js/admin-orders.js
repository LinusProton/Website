/* =========================================================
   LUXE MARKET — Admin Orders
   ========================================================= */
let AO_ORDERS = [];

async function loadOrdersAdmin() {
  AO_ORDERS = await LuxeDB.getOrders();
  renderOrdersTable();
}

function renderOrdersTable() {
  const search = document.getElementById("orderSearch").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;
  let rows = [...AO_ORDERS].sort((a, b) => b.createdAt - a.createdAt);
  if (search) rows = rows.filter(o => o.id.toLowerCase().includes(search) || o.customerName.toLowerCase().includes(search));
  if (status) rows = rows.filter(o => o.status === status);

  document.getElementById("orderCount").textContent = `${rows.length} orders`;
  document.getElementById("ordersTableBody").innerHTML = rows.map(o => `
    <tr>
      <td>#${o.id}</td>
      <td>${o.customerName}</td>
      <td>${fmtDate(o.createdAt)}</td>
      <td>${o.items.length}</td>
      <td>${money(o.total)}</td>
      <td style="text-transform:capitalize;">${o.paymentMethod}</td>
      <td>${statusPill(o.status)}</td>
      <td style="white-space:nowrap;">
        <button class="btn btn-outline btn-sm view-btn" data-id="${o.id}">View</button>
        <button class="btn btn-outline btn-sm invoice-btn" data-id="${o.id}">Invoice</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="8" style="text-align:center;padding:2rem;">No orders found.</td></tr>`;

  document.querySelectorAll(".view-btn").forEach(b => b.addEventListener("click", () => openOrderModal(b.dataset.id)));
  document.querySelectorAll(".invoice-btn").forEach(b => b.addEventListener("click", () => Toast.show(`Invoice PDF for #${b.dataset.id} would generate/download here.`)));
}

function openOrderModal(id) {
  const o = AO_ORDERS.find(x => x.id === id);
  if (!o) return;
  document.getElementById("orderModalBody").innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:.6rem;">
      <div><strong>#${o.id}</strong><div style="font-size:.8rem;color:var(--text-mute);">${fmtDate(o.createdAt)} · ${o.customerName} (${o.customerEmail})</div></div>
      ${statusPill(o.status)}
    </div>
    ${o.items.map(i => `<div style="display:flex;justify-content:space-between;font-size:.85rem;padding:.4rem 0;border-bottom:1px solid #f2eee0;">
      <span>${i.name} × ${i.qty}</span><span>${money(i.price * i.qty)}</span></div>`).join("")}
    <div class="summary-line total"><span>Total</span><span>${money(o.total)}</span></div>

    <div class="field" style="margin-top:1rem;">
      <label>Update Status</label>
      <select class="select-input" id="statusUpdateSelect" style="width:100%;">
        ${ORDER_STATUSES.map(s => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
      </select>
    </div>
    <button class="btn btn-dark btn-block" id="saveStatusBtn">Update Status</button>
    <button class="btn btn-outline btn-block" style="margin-top:.6rem;" id="printLabelBtn">Print Shipping Label</button>
  `;
  document.getElementById("orderModal").classList.add("open");
  document.getElementById("saveStatusBtn").addEventListener("click", async () => {
    const newStatus = document.getElementById("statusUpdateSelect").value;
    await LuxeDB.updateOrderStatus(o.id, newStatus);
    Toast.show(`Order #${o.id} marked as ${newStatus}`);
    document.getElementById("orderModal").classList.remove("open");
    loadOrdersAdmin();
  });
  document.getElementById("printLabelBtn").addEventListener("click", () => Toast.show("Shipping label would print/download here."));
}

document.getElementById("closeOrderModal").addEventListener("click", () => document.getElementById("orderModal").classList.remove("open"));
document.getElementById("orderSearch").addEventListener("input", renderOrdersTable);
document.getElementById("statusFilter").addEventListener("change", renderOrdersTable);

document.addEventListener("DOMContentLoaded", async () => {
  if (!(await guardAdmin())) return;
  renderAdminLayout("Orders");
  loadOrdersAdmin();
});

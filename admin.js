/* =========================================================
   LUXE MARKET — Admin shared helpers
   ========================================================= */
const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_CLASS_A = { pending: "status-pending", processing: "status-processing", shipped: "status-shipped", delivered: "status-delivered", cancelled: "status-cancelled" };

function statusPill(status) {
  return `<span class="status-pill ${STATUS_CLASS_A[status] || "status-pending"}">${status}</span>`;
}

function fmtDate(ts) { return new Date(ts).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }); }

/* =========================================================
   LUXE MARKET — Checkout
   ========================================================= */
let deliveryMethod = "standard";
let paymentMethod = "mpesa";
const DELIVERY_COSTS = { standard: 400, express: 900, pickup: 0 };

function goStep(n) {
  document.querySelectorAll(".step-panel").forEach(p => p.style.display = +p.dataset.step === n ? "block" : "none");
  document.querySelectorAll(".step-item").forEach(s => s.classList.toggle("active", +s.dataset.step <= n));
}

function renderCheckoutSummary() {
  const items = Cart.get().filter(i => !i.savedForLater);
  document.getElementById("checkoutItemsMini").innerHTML = items.map(i => `
    <div style="display:flex;justify-content:space-between;font-size:.8rem;padding:.35rem 0;">
      <span>${i.name} × ${i.qty}</span><span>${money(i.price * i.qty)}</span>
    </div>`).join("");

  const subtotal = Cart.subtotal();
  const totals = LS.get("luxe_cart_totals", { subtotal, discount: 0, shipping: 0, tax: subtotal * 0.16, total: subtotal * 1.16 });
  const shipping = DELIVERY_COSTS[deliveryMethod] === 0 ? 0 : (subtotal >= 5000 ? 0 : DELIVERY_COSTS[deliveryMethod]);
  const tax = Math.max(0, subtotal - totals.discount) * 0.16;
  const total = Math.max(0, subtotal - totals.discount) + shipping + tax;

  document.getElementById("coSubtotal").textContent = money(subtotal);
  document.getElementById("coDiscount").textContent = "- " + money(totals.discount || 0);
  document.getElementById("coShipping").textContent = shipping === 0 ? "Free" : money(shipping);
  document.getElementById("coTax").textContent = money(tax);
  document.getElementById("coTotal").textContent = money(total);

  document.getElementById("reviewItemsList").innerHTML = items.map(i => `
    <div style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid #f2eee0;font-size:.85rem;">
      <span>${i.name} ${i.color ? `(${i.color})` : ""} × ${i.qty}</span><strong>${money(i.price * i.qty)}</strong>
    </div>`).join("");

  return { subtotal, discount: totals.discount || 0, shipping, tax, total, coupon: totals.coupon };
}

function wirePaymentOptions() {
  document.querySelectorAll('[name="delivery"]').forEach(r => r.addEventListener("change", () => {
    deliveryMethod = r.value;
    document.querySelectorAll('.payment-option[data-val]').forEach(el => {
      if (["standard", "express", "pickup"].includes(el.dataset.val)) el.classList.toggle("selected", el.dataset.val === deliveryMethod);
    });
    renderCheckoutSummary();
  }));
  document.querySelectorAll('[name="payment"]').forEach(r => r.addEventListener("change", () => {
    paymentMethod = r.value;
    document.querySelectorAll('.payment-option[data-val]').forEach(el => {
      if (["mpesa", "card", "bank", "mobilemoney", "paypal", "cod"].includes(el.dataset.val)) el.classList.toggle("selected", el.dataset.val === paymentMethod);
    });
    document.getElementById("mpesaFields").style.display = paymentMethod === "mpesa" ? "block" : "none";
    document.getElementById("cardFields").style.display = paymentMethod === "card" ? "block" : "none";
  }));
}

async function placeOrder() {
  const totals = renderCheckoutSummary();
  const user = LuxeAuth.currentUser();
  const order = {
    uid: user ? user.uid : null,
    customerEmail: user ? user.email : "guest@luxe.test",
    customerName: document.getElementById("shipName").value || user?.name || "Guest Customer",
    items: Cart.get().filter(i => !i.savedForLater),
    shipping: {
      name: document.getElementById("shipName").value,
      phone: document.getElementById("shipPhone").value,
      street: document.getElementById("shipStreet").value,
      city: document.getElementById("shipCity").value,
      county: document.getElementById("shipCounty").value
    },
    deliveryMethod, paymentMethod,
    ...totals
  };
  const saved = await LuxeDB.createOrder(order);
  Cart.clear();
  document.getElementById("checkoutFlow").style.display = "none";
  document.getElementById("stepsRow").style.display = "none";
  document.getElementById("confirmationView").style.display = "block";
  document.getElementById("confirmOrderId").textContent = "#" + saved.id;
  document.getElementById("confirmTotal").textContent = money(saved.total);
  document.getElementById("confirmPayment").textContent = { mpesa: "M-Pesa", card: "Card", bank: "Bank Transfer", mobilemoney: "Mobile Money", paypal: "PayPal", cod: "Cash on Delivery" }[saved.paymentMethod];
  document.getElementById("confirmEta").textContent = deliveryMethod === "express" ? "Next business day" : deliveryMethod === "pickup" ? "Ready in 2 hours" : "2–4 business days";
  LS.set("luxe_last_order_id", saved.id);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!Cart.get().filter(i => !i.savedForLater).length) {
    document.getElementById("checkoutFlow").innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;"><h3>Your cart is empty</h3><a href="shop.html" class="btn btn-gold">Go to Shop</a></div>`;
    return;
  }
  const user = LuxeAuth.currentUser();
  if (user) {
    document.getElementById("guestLoginCard").innerHTML = `<strong>Welcome back, ${user.name || user.email}.</strong>`;
    document.getElementById("shipName").value = user.name || "";
  }
  renderCheckoutSummary();
  wirePaymentOptions();

  document.getElementById("sameBilling").addEventListener("change", (e) => {
    document.getElementById("billingFields").style.display = e.target.checked ? "none" : "block";
  });
  document.getElementById("toStep2").addEventListener("click", () => {
    if (!document.getElementById("shipName").value || !document.getElementById("shipPhone").value || !document.getElementById("shipStreet").value) {
      Toast.show("Please complete required shipping fields"); return;
    }
    goStep(2);
  });
  document.getElementById("toStep3").addEventListener("click", () => { renderCheckoutSummary(); goStep(3); });
  document.getElementById("toStep4").addEventListener("click", () => { renderCheckoutSummary(); goStep(4); });
  document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => goStep(+b.dataset.back)));
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
});

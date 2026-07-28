/* =========================================================
   LUXE MARKET — Cart Page
   ========================================================= */
let appliedCoupon = null;
const TAX_RATE = 0.16;
const SHIPPING_FLAT = 400;
const FREE_SHIP_THRESHOLD = 5000;

function renderCartPage() {
  const items = Cart.get();
  const active = items.filter(i => !i.savedForLater);
  const saved = items.filter(i => i.savedForLater);

  document.getElementById("cartEmpty").style.display = active.length ? "none" : "block";
  document.getElementById("cartLayout").style.display = active.length ? "grid" : "none";

  document.getElementById("cartItemsList").innerHTML = active.map(cartRowHTML).join("") || "<p>No active items.</p>";
  document.getElementById("savedForLaterCard").style.display = saved.length ? "block" : "none";
  document.getElementById("savedItemsList").innerHTML = saved.map(cartRowHTML).join("");

  wireCartRows();
  renderSummary();
}

function cartRowHTML(item) {
  return `
  <div class="cart-row" data-key="${item.key}">
    <img src="${item.image}" alt="${item.name}"/>
    <div>
      <a href="product.html?id=${item.productId}" style="font-weight:700;font-size:.9rem;">${item.name}</a>
      <div style="font-size:.76rem;color:var(--text-mute);">
        ${item.color ? `Colour: ${item.color}` : ""} ${item.size ? `· Size: ${item.size}` : ""}
      </div>
      <div style="margin-top:.4rem;display:flex;gap:.9rem;">
        <button class="rm" data-action="remove">Remove</button>
        <button class="rm" style="color:var(--sage);" data-action="save">${item.savedForLater ? "Move to cart" : "Save for later"}</button>
      </div>
    </div>
    <div class="qty-stepper" style="height:fit-content;">
      <button data-action="minus">−</button>
      <input type="text" value="${item.qty}" readonly/>
      <button data-action="plus">+</button>
    </div>
    <strong>${money(item.price * item.qty)}</strong>
  </div>`;
}

function wireCartRows() {
  document.querySelectorAll(".cart-row").forEach(row => {
    const key = row.dataset.key;
    row.querySelector('[data-action="remove"]').addEventListener("click", () => { Cart.remove(key); renderCartPage(); });
    row.querySelector('[data-action="save"]').addEventListener("click", () => { Cart.toggleSaveForLater(key); renderCartPage(); });
    row.querySelector('[data-action="minus"]')?.addEventListener("click", () => {
      const item = Cart.get().find(i => i.key === key);
      Cart.updateQty(key, item.qty - 1); renderCartPage();
    });
    row.querySelector('[data-action="plus"]')?.addEventListener("click", () => {
      const item = Cart.get().find(i => i.key === key);
      Cart.updateQty(key, item.qty + 1); renderCartPage();
    });
  });
}

function renderSummary() {
  const subtotal = Cart.subtotal();
  let discount = 0;
  let shipping = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;

  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") discount = subtotal * (appliedCoupon.value / 100);
    if (appliedCoupon.type === "flat") discount = appliedCoupon.value;
    if (appliedCoupon.type === "shipping") shipping = 0;
  }
  const tax = Math.max(0, subtotal - discount) * TAX_RATE;
  const total = Math.max(0, subtotal - discount) + shipping + tax;

  document.getElementById("sumSubtotal").textContent = money(subtotal);
  document.getElementById("sumDiscount").textContent = "- " + money(discount);
  document.getElementById("sumShipping").textContent = shipping === 0 ? "Free" : money(shipping);
  document.getElementById("sumTax").textContent = money(tax);
  document.getElementById("sumTotal").textContent = money(total);

  LS.set("luxe_cart_totals", { subtotal, discount, shipping, tax, total, coupon: appliedCoupon });
}

document.getElementById("applyCouponBtn")?.addEventListener("click", async () => {
  const code = document.getElementById("couponInput").value.trim();
  if (!code) return;
  const coupon = await LuxeDB.validateCoupon(code);
  const msg = document.getElementById("couponMsg");
  if (coupon) {
    appliedCoupon = coupon;
    msg.style.color = "var(--sage)";
    msg.textContent = `"${coupon.code}" applied ✓`;
  } else {
    appliedCoupon = null;
    msg.style.color = "var(--rose)";
    msg.textContent = "Invalid or expired code.";
  }
  renderSummary();
});

document.addEventListener("cart:change", renderCartPage);
document.addEventListener("DOMContentLoaded", renderCartPage);

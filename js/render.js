/* =========================================================
   LUXE MARKET — Shared render helpers
   ========================================================= */
function starString(rating) {
  const full = Math.round(rating);
  return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
}

function productCardHTML(p) {
  const wished = Wishlist.has(p.id);
  const tags = [];
  if (p.isNew) tags.push('<span class="tag tag-new">New</span>');
  if (p.discountPct > 0) tags.push(`<span class="tag tag-sale">-${p.discountPct}%</span>`);
  if (p.stock === 0) tags.push('<span class="tag tag-out">Out of stock</span>');
  return `
  <div class="product-card" data-id="${p.id}">
    <a href="product.html?id=${p.id}" class="product-media">
      <div class="product-tags">${tags.join("")}</div>
      <img src="${p.images[0]}" alt="${p.name}" loading="lazy"/>
    </a>
    <div class="card-quick-actions">
      <button class="qa-btn wish-btn ${wished ? "active" : ""}" data-id="${p.id}" title="Wishlist">${svgIcon("heart")}</button>
      <button class="qa-btn cmp-btn" data-id="${p.id}" title="Compare">${svgIcon("compare")}</button>
    </div>
    <div class="product-info">
      <span class="product-brand">${p.brand}</span>
      <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
      <div class="product-rating"><span class="stars">${starString(p.rating)}</span> (${p.reviewCount})</div>
      <div class="price-row">
        <span class="price-now">${money(p.discountPrice ?? p.price)}</span>
        ${p.discountPrice ? `<span class="price-old">${money(p.price)}</span>` : ""}
      </div>
      <button class="btn btn-dark btn-sm add-cart-btn" data-id="${p.id}" ${p.stock === 0 ? "disabled" : ""}>
        ${p.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  </div>`;
}

function productListRowHTML(p) {
  return `
  <div class="product-list-row" data-id="${p.id}">
    <a href="product.html?id=${p.id}" class="product-media" style="border-radius:8px;overflow:hidden;">
      <img src="${p.images[0]}" alt="${p.name}"/>
    </a>
    <div class="product-info" style="flex:1;">
      <span class="product-brand">${p.brand}</span>
      <a href="product.html?id=${p.id}" class="product-name" style="font-size:1.05rem;">${p.name}</a>
      <div class="product-rating"><span class="stars">${starString(p.rating)}</span> (${p.reviewCount} reviews)</div>
      <p style="max-width:520px;font-size:.82rem;">${p.description}</p>
      <div class="price-row">
        <span class="price-now">${money(p.discountPrice ?? p.price)}</span>
        ${p.discountPrice ? `<span class="price-old">${money(p.price)}</span>` : ""}
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:.5rem;align-self:center;">
      <button class="btn btn-dark btn-sm add-cart-btn" data-id="${p.id}" ${p.stock === 0 ? "disabled" : ""}>${p.stock === 0 ? "Out of Stock" : "Add to Cart"}</button>
      <button class="btn btn-outline btn-sm wish-btn" data-id="${p.id}">${Wishlist.has(p.id) ? "♥ Wishlisted" : "♡ Wishlist"}</button>
    </div>
  </div>`;
}

function wireProductCardEvents(container, allProducts) {
  container.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const p = allProducts.find(x => x.id === btn.dataset.id);
      if (p) Cart.add(p);
    });
  });
  container.querySelectorAll(".wish-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const active = Wishlist.toggle(btn.dataset.id);
      btn.classList.toggle("active", active);
      if (btn.textContent.includes("Wishlist")) btn.textContent = active ? "♥ Wishlisted" : "♡ Wishlist";
    });
  });
  container.querySelectorAll(".cmp-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      Compare.toggle(btn.dataset.id);
      Toast.show("Updated compare list");
    });
  });
}

function skeletonGrid(n = 8) {
  return Array.from({ length: n }).map(() => `
    <div class="product-card" style="opacity:.5;">
      <div class="product-media" style="background:#eee;"></div>
      <div class="product-info">
        <div style="height:10px;background:#eee;border-radius:4px;width:40%;"></div>
        <div style="height:14px;background:#eee;border-radius:4px;width:80%;margin-top:6px;"></div>
      </div>
    </div>`).join("");
}

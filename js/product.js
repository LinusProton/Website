/* =========================================================
   LUXE MARKET — Product Detail Page
   ========================================================= */
let CURRENT_PRODUCT = null;
let selectedColor = null;
let selectedSize = null;

function getProductId() { return new URLSearchParams(window.location.search).get("id"); }

async function initPDP() {
  const id = getProductId();
  const allProducts = await LuxeDB.getProducts();
  const product = await LuxeDB.getProduct(id) || allProducts[0];
  if (!product) return;
  CURRENT_PRODUCT = product;
  selectedColor = product.colors?.[0]?.hex || null;
  selectedSize = product.sizes?.[0] || null;
  RecentlyViewed.add(product.id);

  renderPDP(product);
  renderTabsContent(product);
  wireTabs();
  wireGallery(product);
  wireOptions(product);
  wireActions(product);
  await renderReviews(product);
  renderRails(product, allProducts);
}

function renderPDP(p) {
  document.title = `${p.name} — LUXE MARKET`;
  document.getElementById("pdpBreadcrumb").innerHTML =
    `<a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?category=${p.category}">${p.category}</a> / <span>${p.name}</span>`;
  document.getElementById("pdpBrand").textContent = p.brand;
  document.getElementById("pdpName").textContent = p.name;
  document.getElementById("pdpStars").textContent = starString(p.rating);
  document.getElementById("pdpRatingText").textContent = `${p.rating} (${p.reviewCount} reviews)`;
  document.getElementById("pdpSku").textContent = `SKU: ${p.sku}`;
  document.getElementById("pdpPrice").innerHTML = `
    <span class="now">${money(p.discountPrice ?? p.price)}</span>
    ${p.discountPrice ? `<span class="old">${money(p.price)}</span><span class="off">-${p.discountPct}%</span>` : ""}
  `;
  const stockEl = document.getElementById("pdpStock");
  if (p.stock === 0) { stockEl.textContent = "Out of stock"; stockEl.classList.add("low"); }
  else if (p.stock < 6) { stockEl.textContent = `Only ${p.stock} left in stock`; stockEl.classList.add("low"); }
  else { stockEl.textContent = "In stock, ready to ship"; }

  if (p.colors?.length) {
    document.getElementById("pdpColors").innerHTML = p.colors.map(c =>
      `<div class="swatch ${c.hex === selectedColor ? "selected" : ""}" style="background:${c.hex}" data-hex="${c.hex}" data-name="${c.name}" title="${c.name}"></div>`
    ).join("");
    document.getElementById("selectedColorName").textContent = p.colors[0]?.name || "";
  } else {
    document.getElementById("pdpColorBlock").style.display = "none";
  }

  if (p.sizes?.length) {
    document.getElementById("pdpSizeBlock").style.display = "block";
    document.getElementById("pdpSizes").innerHTML = p.sizes.map(s =>
      `<div class="size-chip ${s === selectedSize ? "selected" : ""}" data-size="${s}">${s}</div>`
    ).join("");
  }
}

function wireGallery(p) {
  const mainImg = document.getElementById("galleryMainImg");
  mainImg.src = p.images[0];
  document.getElementById("galleryThumbs").innerHTML = p.images.map((img, i) =>
    `<img src="${img}" class="${i === 0 ? "active" : ""}" data-src="${img}"/>`
  ).join("");
  document.querySelectorAll("#galleryThumbs img").forEach(t => t.addEventListener("click", () => {
    mainImg.src = t.dataset.src;
    document.querySelectorAll("#galleryThumbs img").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
  }));
  // simple hover-zoom
  const mainBox = document.getElementById("galleryMain");
  mainBox.addEventListener("mousemove", (e) => {
    const rect = mainBox.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mainImg.style.transformOrigin = `${x}% ${y}%`;
    mainImg.style.transform = "scale(1.8)";
  });
  mainBox.addEventListener("mouseleave", () => { mainImg.style.transform = "scale(1)"; });

  document.getElementById("playVideoBtn").addEventListener("click", () => document.getElementById("videoModal").classList.add("open"));
  document.getElementById("closeVideoModal").addEventListener("click", () => document.getElementById("videoModal").classList.remove("open"));
}

function wireOptions(p) {
  document.querySelectorAll("#pdpColors .swatch").forEach(sw => sw.addEventListener("click", () => {
    selectedColor = sw.dataset.hex;
    document.getElementById("selectedColorName").textContent = sw.dataset.name;
    document.querySelectorAll("#pdpColors .swatch").forEach(s => s.classList.remove("selected"));
    sw.classList.add("selected");
  }));
  document.querySelectorAll("#pdpSizes .size-chip").forEach(chip => chip.addEventListener("click", () => {
    selectedSize = chip.dataset.size;
    document.querySelectorAll("#pdpSizes .size-chip").forEach(c => c.classList.remove("selected"));
    chip.classList.add("selected");
  }));
  document.getElementById("qtyMinus").addEventListener("click", () => {
    const inp = document.getElementById("qtyInput");
    inp.value = Math.max(1, +inp.value - 1);
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    const inp = document.getElementById("qtyInput");
    inp.value = Math.min(p.stock || 99, +inp.value + 1);
  });
}

function wireActions(p) {
  const opts = () => ({ color: selectedColor, size: selectedSize, qty: +document.getElementById("qtyInput").value });
  document.getElementById("addToCartBtn").addEventListener("click", () => Cart.add(p, opts()));
  document.getElementById("buyNowBtn").addEventListener("click", () => { Cart.add(p, opts()); window.location.href = "checkout.html"; });
  const wishBtn = document.getElementById("wishBtn");
  wishBtn.textContent = Wishlist.has(p.id) ? "♥" : "♡";
  wishBtn.addEventListener("click", () => { wishBtn.textContent = Wishlist.toggle(p.id) ? "♥" : "♡"; });
  document.getElementById("cmpBtn").addEventListener("click", () => { Compare.toggle(p.id); Toast.show("Updated compare list"); });
}

function renderTabsContent(p) {
  document.getElementById("pdpDescription").textContent = p.description;
  document.getElementById("pdpSpecsTable").innerHTML = Object.entries(p.specs).map(([k, v]) =>
    `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
}

function wireTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
  }));
}

async function renderReviews(p) {
  const reviews = await LuxeDB.getReviews(p.id);
  document.getElementById("reviewsHeading").textContent = `Customer Reviews (${reviews.length})`;
  document.getElementById("reviewsList").innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-head"><span>${r.name}</span><span class="stars">${starString(r.rating)}</span></div>
      <p style="font-size:.85rem;">${r.text}</p>
      <span style="font-size:.72rem;color:var(--text-mute);">${new Date(r.date).toLocaleDateString()}</span>
    </div>`).join("") || "<p>No reviews yet — be the first to share your thoughts.</p>";

  const dist = [5, 4, 3, 2, 1].map(star => reviews.filter(r => r.rating === star).length);
  const max = Math.max(...dist, 1);
  document.getElementById("ratingBars").innerHTML = [5, 4, 3, 2, 1].map((star, i) => `
    <div class="rbar"><span>${star}★</span><div class="track"><div class="fill" style="width:${(dist[i] / max) * 100}%"></div></div><span>${dist[i]}</span></div>`).join("");

  document.getElementById("writeReviewBtn").addEventListener("click", () => {
    document.getElementById("reviewForm").style.display = "block";
  });
  document.getElementById("reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("reviewName").value.trim() || "Anonymous";
    const text = document.getElementById("reviewText").value.trim();
    const rating = +document.getElementById("reviewRating").value;
    if (!text) return;
    await LuxeDB.addReview(p.id, { name, text, rating });
    Toast.show("Thanks for your review!");
    document.getElementById("reviewForm").reset();
    document.getElementById("reviewForm").style.display = "none";
    renderReviews(p);
  });
}

function renderRails(p, allProducts) {
  const related = allProducts.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const fbt = allProducts.filter(x => x.id !== p.id).sort(() => 0.5 - Math.random()).slice(0, 4);
  const recent = RecentlyViewed.get().filter(id => id !== p.id).map(id => allProducts.find(x => x.id === id)).filter(Boolean).slice(0, 4);

  const mount = (id, list) => {
    const el = document.getElementById(id);
    if (!list.length) { el.closest("section").style.display = "none"; return; }
    el.innerHTML = list.map(productCardHTML).join("");
    wireProductCardEvents(el, allProducts);
  };
  mount("relatedGrid", related);
  mount("fbtGrid", fbt);
  mount("recentGrid", recent);
}

document.addEventListener("DOMContentLoaded", initPDP);

/* =========================================================
   LUXE MARKET — Homepage
   ========================================================= */
(function heroSlider() {
  const slides = () => document.querySelectorAll(".hero-slide");
  const dotsWrap = document.getElementById("heroDots");
  let current = 0, timer;

  function render() {
    const s = slides();
    s.forEach((el, i) => el.classList.toggle("active", i === current));
    if (dotsWrap) {
      dotsWrap.innerHTML = Array.from(s).map((_, i) => `<button class="${i === current ? "active" : ""}" data-i="${i}"></button>`).join("");
      dotsWrap.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { current = +b.dataset.i; render(); resetTimer(); }));
    }
  }
  function next() { current = (current + 1) % slides().length; render(); }
  function prev() { current = (current - 1 + slides().length) % slides().length; render(); }
  function resetTimer() { clearInterval(timer); timer = setInterval(next, 5500); }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    document.getElementById("heroNext")?.addEventListener("click", () => { next(); resetTimer(); });
    document.getElementById("heroPrev")?.addEventListener("click", () => { prev(); resetTimer(); });
    resetTimer();
  });
})();

document.addEventListener("DOMContentLoaded", async () => {
  const [products, categories] = await Promise.all([LuxeDB.getProducts(), LuxeDB.getCategories()]);

  // Category tiles
  const catGrid = document.getElementById("catGrid");
  if (catGrid) {
    catGrid.innerHTML = categories.slice(0, 6).map(c => `
      <a href="shop.html?category=${c.id}" class="cat-tile" style="background-image:url('${c.image}')">
        <span>${c.name}</span>
      </a>`).join("");
  }

  const mount = (id, list) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = list.slice(0, 4).map(productCardHTML).join("");
    wireProductCardEvents(el, products);
  };
  mount("featuredGrid", products.filter(p => p.isFeatured));
  mount("newGrid", [...products].filter(p => p.isNew).sort((a, b) => b.createdAt - a.createdAt));
  mount("dealGrid", products.filter(p => p.isDeal));
  mount("bestGrid", products.filter(p => p.isBestSeller));

  const brandGrid = document.getElementById("brandGrid");
  if (brandGrid) {
    brandGrid.innerHTML = LuxeDB.getBrands().map(b => `
      <a href="shop.html?brand=${encodeURIComponent(b)}" class="info-card" style="text-align:center;display:flex;align-items:center;justify-content:center;height:90px;font-family:var(--font-display);font-weight:700;font-size:1.05rem;">
        ${b}
      </a>`).join("");
  }

  const socialGrid = document.getElementById("socialGrid");
  if (socialGrid) {
    socialGrid.innerHTML = Array.from({ length: 6 }).map((_, i) =>
      `<img src="https://picsum.photos/seed/social${i}/300/300" style="border-radius:var(--radius);aspect-ratio:1/1;object-fit:cover;" alt="Social post"/>`
    ).join("");
  }

  const nlBtn = document.getElementById("heroNewsletterBtn");
  if (nlBtn) nlBtn.addEventListener("click", () => {
    const input = document.getElementById("heroNewsletterEmail");
    if (input.value.trim()) { Toast.show("You're subscribed! Check your inbox for 10% off."); input.value = ""; }
  });
});

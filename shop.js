/* =========================================================
   LUXE MARKET — Shop / Catalog page
   ========================================================= */
let ALL_PRODUCTS = [];
let ALL_CATEGORIES = [];
let currentFilters = {};
let viewMode = "grid";
let visibleCount = 12;

const COLOR_SWATCHES = [
  { hex: "#1b1d22", name: "Black" }, { hex: "#c9a24b", name: "Gold" },
  { hex: "#c1585c", name: "Rose" }, { hex: "#3f6b58", name: "Sage" },
  { hex: "#f7f4ee", name: "Ivory" }, { hex: "#6b7280", name: "Grey" }
];

function readParams() {
  const params = new URLSearchParams(window.location.search);
  const f = {};
  if (params.get("category")) f.category = params.get("category");
  if (params.get("brand")) f.brand = params.get("brand");
  if (params.get("q")) f.search = params.get("q");
  if (params.get("deal")) f.isDeal = true;
  return f;
}

async function init() {
  currentFilters = readParams();
  [ALL_PRODUCTS, ALL_CATEGORIES] = await Promise.all([LuxeDB.getProducts(), LuxeDB.getCategories()]);

  buildCategoryFilters();
  buildBrandFilters();
  buildRatingFilters();
  buildColorFilters();
  syncFilterUI();
  wireToolbar();
  updateTitle();
  applyAndRender();
}

function buildCategoryFilters() {
  const el = document.getElementById("filterCategories");
  el.innerHTML = ALL_CATEGORIES.map(c => `
    <label class="filter-opt"><input type="radio" name="cat" value="${c.id}" ${currentFilters.category === c.id ? "checked" : ""}/> ${c.name}</label>`
  ).join("") + `<label class="filter-opt"><input type="radio" name="cat" value="" ${!currentFilters.category ? "checked" : ""}/> All Categories</label>`;
  el.querySelectorAll("input").forEach(inp => inp.addEventListener("change", () => {
    currentFilters.category = inp.value || null; visibleCount = 12; updateTitle(); applyAndRender();
  }));
}

function buildBrandFilters() {
  const el = document.getElementById("filterBrands");
  el.innerHTML = LuxeDB.getBrands().map(b => `
    <label class="filter-opt"><input type="checkbox" class="brand-cb" value="${b}" ${currentFilters.brand === b ? "checked" : ""}/> ${b}</label>`
  ).join("");
  el.querySelectorAll(".brand-cb").forEach(cb => cb.addEventListener("change", () => {
    const checked = [...el.querySelectorAll(".brand-cb:checked")].map(c => c.value);
    currentFilters.brand = checked[0] || null; // demo: single-brand filter for simplicity
    el.querySelectorAll(".brand-cb").forEach(c => { if (c !== cb) c.checked = false; });
    visibleCount = 12; applyAndRender();
  }));
}

function buildRatingFilters() {
  const el = document.getElementById("filterRating");
  el.innerHTML = [4, 3, 2].map(r => `
    <label class="filter-opt"><input type="radio" name="rating" value="${r}"/> <span class="stars">${"★".repeat(r)}${"☆".repeat(5 - r)}</span> &amp; up</label>`
  ).join("") + `<label class="filter-opt"><input type="radio" name="rating" value="" checked/> Any rating</label>`;
  el.querySelectorAll("input").forEach(inp => inp.addEventListener("change", () => {
    currentFilters.minRating = inp.value ? +inp.value : null; visibleCount = 12; applyAndRender();
  }));
}

function buildColorFilters() {
  const el = document.getElementById("filterColors");
  el.innerHTML = COLOR_SWATCHES.map(c => `<div class="swatch" style="background:${c.hex}" data-hex="${c.hex}" title="${c.name}"></div>`).join("");
  el.querySelectorAll(".swatch").forEach(sw => sw.addEventListener("click", () => {
    const active = sw.classList.toggle("selected");
    el.querySelectorAll(".swatch").forEach(s => { if (s !== sw) s.classList.remove("selected"); });
    currentFilters.color = active ? sw.dataset.hex : null;
    visibleCount = 12; applyAndRender();
  }));
}

function syncFilterUI() {
  document.getElementById("filterInStock").addEventListener("change", (e) => {
    currentFilters.inStockOnly = e.target.checked; visibleCount = 12; applyAndRender();
  });
  document.getElementById("applyPriceBtn").addEventListener("click", () => {
    const min = document.getElementById("minPrice").value;
    const max = document.getElementById("maxPrice").value;
    currentFilters.minPrice = min ? +min : null;
    currentFilters.maxPrice = max ? +max : null;
    visibleCount = 12; applyAndRender();
  });
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    currentFilters = {}; visibleCount = 12;
    document.querySelectorAll('.filters-panel input[type=checkbox]').forEach(c => c.checked = false);
    document.querySelectorAll('.filters-panel input[type=radio][value=""]').forEach(r => r.checked = true);
    document.querySelectorAll('.swatch.selected').forEach(s => s.classList.remove("selected"));
    document.getElementById("minPrice").value = ""; document.getElementById("maxPrice").value = "";
    updateTitle(); applyAndRender();
  });
  if (currentFilters.isDeal) {
    // no dedicated UI toggle needed, driven by URL
  }
}

function wireToolbar() {
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    currentFilters.sort = e.target.value || null; applyAndRender();
  });
  document.getElementById("gridViewBtn").addEventListener("click", () => setView("grid"));
  document.getElementById("listViewBtn").addEventListener("click", () => setView("list"));
  document.getElementById("loadMoreBtn").addEventListener("click", () => { visibleCount += 12; applyAndRender(); });
}

function setView(mode) {
  viewMode = mode;
  document.getElementById("gridViewBtn").classList.toggle("active", mode === "grid");
  document.getElementById("listViewBtn").classList.toggle("active", mode === "list");
  document.getElementById("productGrid").className = mode === "grid" ? "grid grid-4" : "";
  applyAndRender();
}

function updateTitle() {
  const cat = ALL_CATEGORIES.find(c => c.id === currentFilters.category);
  const title = cat ? cat.name : (currentFilters.isDeal ? "Today's Deals" : "All Products");
  document.getElementById("shopTitle").textContent = title;
  document.getElementById("crumbCurrent").textContent = title;
  document.title = `${title} — LUXE MARKET`;
}

function applyAndRender() {
  let results = LuxeDB._applyClientFilters(ALL_PRODUCTS, currentFilters);
  if (currentFilters.color) {
    results = results.filter(p => p.colors.some(c => c.hex === currentFilters.color));
  }
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  const shown = results.slice(0, visibleCount);
  document.getElementById("resultsCount").textContent = `${results.length} product${results.length !== 1 ? "s" : ""} found`;
  document.getElementById("loadMoreBtn").style.display = results.length > visibleCount ? "inline-flex" : "none";

  if (!results.length) {
    grid.innerHTML = ""; empty.style.display = "block";
  } else {
    empty.style.display = "none";
    grid.innerHTML = shown.map(viewMode === "grid" ? productCardHTML : productListRowHTML).join("");
    wireProductCardEvents(grid, ALL_PRODUCTS);
  }
}

document.addEventListener("DOMContentLoaded", init);

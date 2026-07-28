/* =========================================================
   LUXE MARKET — Admin Products
   ========================================================= */
let AP_PRODUCTS = [];
let AP_CATEGORIES = [];

async function loadProducts() {
  AP_PRODUCTS = await LuxeDB.getProducts();
  renderProductsTable();
}

function renderProductsTable() {
  const search = document.getElementById("prodSearch").value.toLowerCase();
  const cat = document.getElementById("prodCatFilter").value;
  let rows = AP_PRODUCTS;
  if (search) rows = rows.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
  if (cat) rows = rows.filter(p => p.category === cat);

  document.getElementById("productsTableBody").innerHTML = rows.map(p => `
    <tr>
      <td><img src="${p.images[0]}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;"/></td>
      <td>${p.name}</td>
      <td>${p.sku}</td>
      <td>${p.category}</td>
      <td>${money(p.discountPrice ?? p.price)}</td>
      <td>${p.stock}</td>
      <td>${p.stock === 0 ? '<span class="status-pill status-cancelled">Out of stock</span>' : p.stock < 8 ? '<span class="status-pill status-pending">Low stock</span>' : '<span class="status-pill status-delivered">In stock</span>'}</td>
      <td style="white-space:nowrap;">
        <button class="btn btn-outline btn-sm edit-btn" data-id="${p.id}">Edit</button>
        <button class="btn btn-outline btn-sm del-btn" data-id="${p.id}" style="color:var(--rose);">Delete</button>
      </td>
    </tr>`).join("") || `<tr><td colspan="8" style="text-align:center;padding:2rem;">No products found.</td></tr>`;

  document.querySelectorAll(".edit-btn").forEach(b => b.addEventListener("click", () => openModal(AP_PRODUCTS.find(p => p.id === b.dataset.id))));
  document.querySelectorAll(".del-btn").forEach(b => b.addEventListener("click", async () => {
    if (confirm("Delete this product? This cannot be undone.")) {
      await LuxeDB.deleteProduct(b.dataset.id);
      Toast.show("Product deleted");
      loadProducts();
    }
  }));
}

function openModal(product = null) {
  document.getElementById("modalTitle").textContent = product ? "Edit Product" : "Add Product";
  document.getElementById("pId").value = product?.id || "";
  document.getElementById("pName").value = product?.name || "";
  document.getElementById("pSku").value = product?.sku || "LX-" + Date.now().toString().slice(-6);
  document.getElementById("pBrand").value = product?.brand || "";
  document.getElementById("pCategory").value = product?.category || AP_CATEGORIES[0]?.id || "";
  document.getElementById("pPrice").value = product?.price || "";
  document.getElementById("pDiscount").value = product?.discountPct || 0;
  document.getElementById("pStock").value = product?.stock ?? 10;
  document.getElementById("pImageSeed").value = "";
  document.getElementById("pDescription").value = product?.description || "";
  document.getElementById("pFeatured").checked = !!product?.isFeatured;
  document.getElementById("productModal").classList.add("open");
}

document.getElementById("addProductBtn").addEventListener("click", () => openModal());
document.getElementById("closeProductModal").addEventListener("click", () => document.getElementById("productModal").classList.remove("open"));
document.getElementById("prodSearch").addEventListener("input", renderProductsTable);
document.getElementById("prodCatFilter").addEventListener("change", renderProductsTable);

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("pId").value || null;
  const existing = id ? AP_PRODUCTS.find(p => p.id === id) : null;
  const price = +document.getElementById("pPrice").value;
  const discountPct = +document.getElementById("pDiscount").value || 0;
  const seed = document.getElementById("pImageSeed").value.trim() || (existing?.sku || "new-" + Date.now());
  const product = {
    id, sku: document.getElementById("pSku").value, name: document.getElementById("pName").value,
    brand: document.getElementById("pBrand").value, category: document.getElementById("pCategory").value,
    price, discountPct, discountPrice: discountPct > 0 ? Math.round(price * (1 - discountPct / 100) * 100) / 100 : null,
    stock: +document.getElementById("pStock").value,
    description: document.getElementById("pDescription").value,
    isFeatured: document.getElementById("pFeatured").checked,
    images: existing?.images || [IMG(seed + "-1"), IMG(seed + "-2"), IMG(seed + "-3"), IMG(seed + "-4")],
    colors: existing?.colors || [{ hex: "#1b1d22", name: "Black" }, { hex: "#c9a24b", name: "Gold" }],
    sizes: existing?.sizes || null,
    rating: existing?.rating || 4.2, reviewCount: existing?.reviewCount || 0,
    isNew: existing?.isNew ?? true, isBestSeller: existing?.isBestSeller ?? false, isDeal: discountPct > 0,
    specs: existing?.specs || { Material: "—", Origin: "—", Weight: "—", Warranty: "—" },
    createdAt: existing?.createdAt || Date.now()
  };
  await LuxeDB.saveProduct(product);
  Toast.show(id ? "Product updated" : "Product added");
  document.getElementById("productModal").classList.remove("open");
  loadProducts();
});

document.addEventListener("DOMContentLoaded", async () => {
  if (!(await guardAdmin())) return;
  renderAdminLayout("Products");
  AP_CATEGORIES = await LuxeDB.getCategories();
  document.getElementById("prodCatFilter").innerHTML += AP_CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  document.getElementById("pCategory").innerHTML = AP_CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  loadProducts();
});

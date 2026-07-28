/* =========================================================
   LUXE MARKET — Cart & Wishlist
   ========================================================= */
const Cart = {
  get() { return LS.get("luxe_cart", []); },
  set(items) { LS.set("luxe_cart", items); document.dispatchEvent(new CustomEvent("cart:change")); },

  add(product, opts = {}) {
    const items = this.get();
    const key = `${product.id}_${opts.color || ""}_${opts.size || ""}`;
    const existing = items.find(i => i.key === key);
    if (existing) {
      existing.qty += opts.qty || 1;
    } else {
      items.push({
        key, productId: product.id, name: product.name, image: product.images[0],
        price: product.discountPrice ?? product.price, color: opts.color || null,
        size: opts.size || null, qty: opts.qty || 1, savedForLater: false
      });
    }
    this.set(items);
    Toast.show(`${product.name} added to cart`);
  },

  updateQty(key, qty) {
    const items = this.get();
    const it = items.find(i => i.key === key);
    if (it) it.qty = Math.max(1, qty);
    this.set(items);
  },

  remove(key) { this.set(this.get().filter(i => i.key !== key)); },

  toggleSaveForLater(key) {
    const items = this.get();
    const it = items.find(i => i.key === key);
    if (it) it.savedForLater = !it.savedForLater;
    this.set(items);
  },

  clear() { this.set([]); },

  count() { return this.get().filter(i => !i.savedForLater).reduce((s, i) => s + i.qty, 0); },

  subtotal() { return this.get().filter(i => !i.savedForLater).reduce((s, i) => s + i.qty * i.price, 0); }
};

const Wishlist = {
  get() { return LS.get("luxe_wishlist", []); },
  set(items) { LS.set("luxe_wishlist", items); document.dispatchEvent(new CustomEvent("wishlist:change")); },
  has(productId) { return this.get().includes(productId); },
  toggle(productId) {
    let items = this.get();
    if (items.includes(productId)) { items = items.filter(id => id !== productId); Toast.show("Removed from wishlist"); }
    else { items.push(productId); Toast.show("Added to wishlist"); }
    this.set(items);
    return items.includes(productId);
  },
  count() { return this.get().length; }
};

const Compare = {
  get() { return LS.get("luxe_compare", []); },
  set(items) { LS.set("luxe_compare", items); document.dispatchEvent(new CustomEvent("compare:change")); },
  toggle(productId) {
    let items = this.get();
    if (items.includes(productId)) items = items.filter(id => id !== productId);
    else if (items.length < 4) items.push(productId);
    else { Toast.show("You can compare up to 4 products"); return; }
    this.set(items);
  }
};

const RecentlyViewed = {
  add(productId) {
    let items = LS.get("luxe_recent", []).filter(id => id !== productId);
    items.unshift(productId);
    LS.set("luxe_recent", items.slice(0, 12));
  },
  get() { return LS.get("luxe_recent", []); }
};

const Toast = {
  show(msg) {
    let el = document.getElementById("global-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "global-toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2400);
  }
};

function money(n) {
  return "KSh " + Number(n).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

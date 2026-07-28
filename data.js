/* =========================================================
   LUXE MARKET — Data Layer
   Every page talks to `LuxeDB`, never to Firestore/localStorage
   directly. When FIREBASE_ENABLED is true, LuxeDB reads/writes
   Firestore. Otherwise it seeds and uses localStorage so the
   whole store is clickable with zero backend setup.
   ========================================================= */

const IMG = (seed, w = 600, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const SAMPLE_CATEGORIES = [
  { id: "electronics", name: "Electronics", image: IMG("electronics", 400, 300) },
  { id: "fashion", name: "Fashion", image: IMG("fashion", 400, 300) },
  { id: "beauty", name: "Beauty", image: IMG("beauty", 400, 300) },
  { id: "home-living", name: "Home & Living", image: IMG("home", 400, 300) },
  { id: "jewellery", name: "Jewellery", image: IMG("jewellery", 400, 300) },
  { id: "shoes", name: "Shoes", image: IMG("shoes", 400, 300) },
  { id: "bags", name: "Bags", image: IMG("bags", 400, 300) },
  { id: "watches", name: "Watches", image: IMG("watches", 400, 300) },
  { id: "perfumes", name: "Perfumes", image: IMG("perfumes", 400, 300) },
  { id: "kids", name: "Kids", image: IMG("kids", 400, 300) },
  { id: "accessories", name: "Accessories", image: IMG("accessories", 400, 300) },
  { id: "gifts", name: "Gifts", image: IMG("gifts", 400, 300) }
];

const SAMPLE_BRANDS = ["Aurelia", "Northline", "Velour", "Kesho & Co", "Marbled", "Solstice", "Panga", "Ivory Row"];

function genProducts() {
  const names = {
    electronics: ["Wireless ANC Headphones", "Smartwatch Series X", "4K Action Camera", "Bluetooth Speaker", "USB-C Fast Charger", "Gaming Mouse"],
    fashion: ["Tailored Linen Blazer", "Silk Wrap Dress", "Merino Wool Sweater", "Slim Denim Jacket", "Pleated Midi Skirt", "Cotton Oversized Shirt"],
    beauty: ["Vitamin C Serum", "Matte Lipstick Set", "Hydrating Face Mask", "Argan Hair Oil", "Mineral Sunscreen SPF50", "Rose Clay Cleanser"],
    "home-living": ["Ceramic Vase Set", "Linen Throw Blanket", "Scented Soy Candle", "Rattan Table Lamp", "Marble Coasters", "Woven Storage Basket"],
    jewellery: ["Gold Hoop Earrings", "Pearl Pendant Necklace", "Sterling Silver Ring", "Layered Chain Bracelet", "Sapphire Stud Earrings", "Signet Ring"],
    shoes: ["Leather Chelsea Boots", "Suede Loafers", "Running Sneakers", "Strappy Block Heels", "Canvas Slip-Ons", "Espadrille Wedges"],
    bags: ["Structured Tote Bag", "Quilted Crossbody", "Leather Weekender", "Woven Straw Bag", "Mini Backpack", "Clutch Purse"],
    watches: ["Automatic Steel Watch", "Minimalist Leather Watch", "Chronograph Sports Watch", "Rose Gold Bangle Watch", "Smart Fitness Watch", "Classic Dress Watch"],
    perfumes: ["Amber Oud EDP", "Citrus Bloom EDT", "Vanilla Musk Perfume", "Sea Salt Cologne", "Rose & Jasmine Mist", "Sandalwood Attar"],
    kids: ["Organic Cotton Onesie", "Kids Rain Jacket", "Wooden Building Blocks", "Toddler Sneakers", "Character Backpack", "Plush Bear Toy"],
    accessories: ["Silk Twill Scarf", "Aviator Sunglasses", "Leather Belt", "Wool Beanie", "Printed Tie", "Cardholder Wallet"],
    gifts: ["Curated Gift Box", "Engraved Keepsake", "Spa Hamper Set", "Gourmet Chocolate Box", "Personalised Mug", "Candle & Journal Set"]
  };
  const colors = ["#1b1d22", "#c9a24b", "#c1585c", "#3f6b58", "#f7f4ee", "#6b7280"];
  const colorNames = ["Black", "Gold", "Rose", "Sage", "Ivory", "Grey"];
  let id = 1000;
  const out = [];
  Object.entries(names).forEach(([cat, list]) => {
    list.forEach((n, i) => {
      const price = Math.round((25 + Math.random() * 220) * 100) / 100;
      const onSale = Math.random() < 0.35;
      const discount = onSale ? Math.round((10 + Math.random() * 35)) : 0;
      const stock = Math.random() < 0.12 ? 0 : Math.floor(Math.random() * 60) + 1;
      id++;
      out.push({
        id: `P${id}`,
        sku: `LX-${cat.slice(0, 3).toUpperCase()}-${id}`,
        name: n,
        category: cat,
        brand: SAMPLE_BRANDS[(id + i) % SAMPLE_BRANDS.length],
        price,
        discountPrice: onSale ? Math.round(price * (1 - discount / 100) * 100) / 100 : null,
        discountPct: discount,
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 240) + 3,
        stock,
        images: [IMG(`${cat}-${id}-1`), IMG(`${cat}-${id}-2`), IMG(`${cat}-${id}-3`), IMG(`${cat}-${id}-4`)],
        colors: colors.slice(0, 3 + (id % 3)).map((c, ci) => ({ hex: c, name: colorNames[ci] })),
        sizes: ["fashion", "shoes", "kids"].includes(cat) ? ["XS", "S", "M", "L", "XL"] : null,
        isNew: Math.random() < 0.25,
        isBestSeller: Math.random() < 0.2,
        isFeatured: Math.random() < 0.3,
        isDeal: onSale && Math.random() < 0.5,
        description: `The ${n} blends considered materials with everyday wearability. Designed in small batches, finished by hand, and built to outlast trend cycles — a quietly premium addition from ${SAMPLE_BRANDS[(id + i) % SAMPLE_BRANDS.length]}.`,
        specs: {
          Material: ["Premium cotton blend", "Full-grain leather", "Recycled aluminium", "Mulberry silk"][id % 4],
          Origin: ["Made in Kenya", "Made in Italy", "Made in Portugal", "Made in Turkey"][id % 4],
          Weight: `${(0.2 + (id % 9) / 10).toFixed(1)} kg`,
          Warranty: ["12 months", "24 months", "No warranty", "6 months"][id % 4]
        },
        createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 90)
      });
    });
  });
  return out;
}

const SAMPLE_REVIEWS_POOL = [
  { name: "Amina W.", text: "Exceeded expectations — the quality feels genuinely premium and shipping was fast." },
  { name: "James K.", text: "Great value, exactly as pictured. Will be ordering more colours soon." },
  { name: "Sarah M.", text: "Packaging alone felt like a gift. The product itself is even better." },
  { name: "David O.", text: "Good product overall, sizing ran slightly small so check the chart." },
  { name: "Grace N.", text: "My second purchase from LUXE — consistent quality every time." },
  { name: "Peter L.", text: "Fast delivery to Nairobi, customer support answered my questions on WhatsApp instantly." }
];

const SAMPLE_COUPONS = [
  { code: "WELCOME10", type: "percent", value: 10, active: true },
  { code: "FREESHIP", type: "shipping", value: 100, active: true },
  { code: "SAVE500", type: "flat", value: 500, active: true }
];

/* ---------------------------------------------------------
   Local persistence helpers (demo mode)
--------------------------------------------------------- */
const LS = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

function seedIfNeeded() {
  if (!LS.get("luxe_products", null)) LS.set("luxe_products", genProducts());
  if (!LS.get("luxe_categories", null)) LS.set("luxe_categories", SAMPLE_CATEGORIES);
  if (!LS.get("luxe_orders", null)) LS.set("luxe_orders", []);
  if (!LS.get("luxe_customers", null)) LS.set("luxe_customers", []);
  if (!LS.get("luxe_coupons", null)) LS.set("luxe_coupons", SAMPLE_COUPONS);
  if (!LS.get("luxe_reviews", null)) LS.set("luxe_reviews", {});
  if (!LS.get("luxe_cart", null)) LS.set("luxe_cart", []);
  if (!LS.get("luxe_wishlist", null)) LS.set("luxe_wishlist", []);
  const customers = LS.get("luxe_customers", []);
  if (!customers.find(c => c.email === "admin@luxe.test")) {
    customers.push({ uid: "admin001", name: "Store Admin", email: "admin@luxe.test", password: "admin123", createdAt: Date.now(), addresses: [], loyaltyPoints: 0 });
    LS.set("luxe_customers", customers);
  }
  if (!LS.get("luxe_admin_emails", null)) LS.set("luxe_admin_emails", ["admin@luxe.test"]);
  if (LS.get("luxe_orders", []).length === 0) seedDemoOrders();
}

function seedDemoOrders() {
  const products = LS.get("luxe_products", []);
  const statuses = ["pending", "processing", "shipped", "delivered", "delivered", "cancelled"];
  const names = ["Amina Wanjiru", "James Kariuki", "Sarah Mwangi", "David Otieno", "Grace Njeri", "Peter Langat", "Fatuma Ali", "Brian Kiptoo"];
  const orders = [];
  for (let i = 0; i < 18; i++) {
    const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => {
      const p = products[Math.floor(Math.random() * products.length)];
      return { productId: p.id, name: p.name, image: p.images[0], price: p.discountPrice ?? p.price, qty: 1 + Math.floor(Math.random() * 2), color: null, size: null };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shipping = subtotal > 5000 ? 0 : 400;
    const tax = subtotal * 0.16;
    const daysAgo = Math.floor(Math.random() * 12);
    orders.push({
      id: "ORD" + (10000 + i * 7 + 231),
      uid: null,
      customerName: names[i % names.length],
      customerEmail: names[i % names.length].toLowerCase().replace(" ", ".") + "@example.com",
      items, subtotal, discount: 0, shipping, tax, total: subtotal + shipping + tax,
      status: statuses[i % statuses.length],
      paymentMethod: ["mpesa", "card", "cod", "bank"][i % 4],
      deliveryMethod: "standard",
      shipping_address: { city: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"][i % 4] },
      createdAt: Date.now() - daysAgo * 86400000 - i * 60000
    });
  }
  LS.set("luxe_orders", orders);
}
seedIfNeeded();

/* =========================================================
   LuxeDB — unified data access
   ========================================================= */
const LuxeDB = {
  async getProducts(filters = {}) {
    if (FIREBASE_ENABLED) {
      let q = db.collection("products");
      if (filters.category) q = q.where("category", "==", filters.category);
      if (filters.brand) q = q.where("brand", "==", filters.brand);
      const snap = await q.get();
      let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return this._applyClientFilters(items, filters);
    }
    let items = LS.get("luxe_products", []);
    return this._applyClientFilters(items, filters);
  },

  _applyClientFilters(items, f) {
    let out = [...items];
    if (f.category) out = out.filter(p => p.category === f.category);
    if (f.brand) out = out.filter(p => p.brand === f.brand);
    if (f.search) {
      const s = f.search.toLowerCase();
      out = out.filter(p => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
    }
    if (f.minPrice != null) out = out.filter(p => (p.discountPrice ?? p.price) >= f.minPrice);
    if (f.maxPrice != null) out = out.filter(p => (p.discountPrice ?? p.price) <= f.maxPrice);
    if (f.minRating) out = out.filter(p => p.rating >= f.minRating);
    if (f.inStockOnly) out = out.filter(p => p.stock > 0);
    if (f.isNew) out = out.filter(p => p.isNew);
    if (f.isBestSeller) out = out.filter(p => p.isBestSeller);
    if (f.isFeatured) out = out.filter(p => p.isFeatured);
    if (f.isDeal) out = out.filter(p => p.isDeal);
    switch (f.sort) {
      case "price-asc": out.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)); break;
      case "price-desc": out.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)); break;
      case "rating": out.sort((a, b) => b.rating - a.rating); break;
      case "popularity": out.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "newest": out.sort((a, b) => b.createdAt - a.createdAt); break;
    }
    return out;
  },

  async getProduct(id) {
    if (FIREBASE_ENABLED) {
      const doc = await db.collection("products").doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }
    return LS.get("luxe_products", []).find(p => p.id === id) || null;
  },

  async saveProduct(product) {
    if (FIREBASE_ENABLED) {
      const ref = product.id ? db.collection("products").doc(product.id) : db.collection("products").doc();
      await ref.set(product, { merge: true });
      return ref.id;
    }
    const items = LS.get("luxe_products", []);
    if (product.id) {
      const idx = items.findIndex(p => p.id === product.id);
      if (idx > -1) items[idx] = { ...items[idx], ...product };
      else items.push(product);
    } else {
      product.id = "P" + Date.now();
      items.push(product);
    }
    LS.set("luxe_products", items);
    return product.id;
  },

  async deleteProduct(id) {
    if (FIREBASE_ENABLED) return db.collection("products").doc(id).delete();
    LS.set("luxe_products", LS.get("luxe_products", []).filter(p => p.id !== id));
  },

  async getCategories() {
    if (FIREBASE_ENABLED) {
      const snap = await db.collection("categories").get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return LS.get("luxe_categories", SAMPLE_CATEGORIES);
  },

  getBrands() { return SAMPLE_BRANDS; },

  async getReviews(productId) {
    if (FIREBASE_ENABLED) {
      const snap = await db.collection("reviews").where("productId", "==", productId).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const all = LS.get("luxe_reviews", {});
    if (!all[productId]) {
      // synthesize believable starter reviews once
      const count = 2 + Math.floor(Math.random() * 3);
      all[productId] = Array.from({ length: count }, (_, i) => {
        const base = SAMPLE_REVIEWS_POOL[(i + productId.length) % SAMPLE_REVIEWS_POOL.length];
        return { id: "R" + i, name: base.name, text: base.text, rating: 3 + Math.floor(Math.random() * 3), date: Date.now() - i * 86400000 * 4 };
      });
      LS.set("luxe_reviews", all);
    }
    return all[productId];
  },

  async addReview(productId, review) {
    if (FIREBASE_ENABLED) {
      return db.collection("reviews").add({ productId, ...review, date: Date.now() });
    }
    const all = LS.get("luxe_reviews", {});
    if (!all[productId]) all[productId] = [];
    all[productId].unshift({ id: "R" + Date.now(), date: Date.now(), ...review });
    LS.set("luxe_reviews", all);
  },

  async createOrder(order) {
    order.id = "ORD" + Date.now().toString().slice(-8);
    order.status = "pending";
    order.createdAt = Date.now();
    if (FIREBASE_ENABLED) {
      await db.collection("orders").doc(order.id).set(order);
      return order;
    }
    const orders = LS.get("luxe_orders", []);
    orders.unshift(order);
    LS.set("luxe_orders", orders);
    return order;
  },

  async getOrders(uid = null) {
    if (FIREBASE_ENABLED) {
      let q = db.collection("orders").orderBy("createdAt", "desc");
      if (uid) q = q.where("uid", "==", uid);
      const snap = await q.get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    const orders = LS.get("luxe_orders", []);
    return uid ? orders.filter(o => o.uid === uid) : orders;
  },

  async updateOrderStatus(id, status) {
    if (FIREBASE_ENABLED) return db.collection("orders").doc(id).update({ status });
    const orders = LS.get("luxe_orders", []);
    const idx = orders.findIndex(o => o.id === id);
    if (idx > -1) orders[idx].status = status;
    LS.set("luxe_orders", orders);
  },

  async validateCoupon(code) {
    const coupons = FIREBASE_ENABLED
      ? (await db.collection("coupons").doc(code).get()).data()
      : LS.get("luxe_coupons", []).find(c => c.code === code.toUpperCase());
    return coupons && coupons.active ? coupons : null;
  },

  async getCustomers() {
    if (FIREBASE_ENABLED) {
      const snap = await db.collection("customers").get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return LS.get("luxe_customers", []);
  },

  async saveCustomer(customer) {
    if (FIREBASE_ENABLED) return db.collection("customers").doc(customer.uid).set(customer, { merge: true });
    const list = LS.get("luxe_customers", []);
    const idx = list.findIndex(c => c.uid === customer.uid);
    if (idx > -1) list[idx] = { ...list[idx], ...customer };
    else list.push(customer);
    LS.set("luxe_customers", list);
  }
};

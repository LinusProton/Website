/* =========================================================
   LUXE MARKET — Auth
   Wraps Firebase Auth (email/password + Google) with a demo
   fallback backed by localStorage so login/register works
   before Firebase keys are added.
   ========================================================= */
const LuxeAuth = {
  _listeners: [],

  onChange(cb) {
    this._listeners.push(cb);
    cb(this.currentUser());
  },

  _emit() { const u = this.currentUser(); this._listeners.forEach(cb => cb(u)); },

  currentUser() {
    if (FIREBASE_ENABLED) return auth.currentUser;
    return LS.get("luxe_session", null);
  },

  async register(name, email, password) {
    if (FIREBASE_ENABLED) {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      await LuxeDB.saveCustomer({ uid: cred.user.uid, name, email, createdAt: Date.now(), addresses: [], loyaltyPoints: 0 });
      this._emit();
      return cred.user;
    }
    const customers = LS.get("luxe_customers", []);
    if (customers.find(c => c.email === email)) throw new Error("An account with this email already exists.");
    const user = { uid: "u" + Date.now(), name, email, createdAt: Date.now(), addresses: [], loyaltyPoints: 120 };
    customers.push({ ...user, password });
    LS.set("luxe_customers", customers);
    LS.set("luxe_session", user);
    this._emit();
    return user;
  },

  async login(email, password) {
    if (FIREBASE_ENABLED) {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      this._emit();
      return cred.user;
    }
    const customers = LS.get("luxe_customers", []);
    const found = customers.find(c => c.email === email && c.password === password);
    if (!found) throw new Error("Invalid email or password.");
    const { password: pw, ...user } = found;
    LS.set("luxe_session", user);
    this._emit();
    return user;
  },

  async loginWithGoogle() {
    if (FIREBASE_ENABLED) {
      const provider = new firebase.auth.GoogleAuthProvider();
      const cred = await auth.signInWithPopup(provider);
      this._emit();
      return cred.user;
    }
    const user = { uid: "gu" + Date.now(), name: "Google User", email: "demo.google@luxe.test", createdAt: Date.now(), addresses: [], loyaltyPoints: 50 };
    LS.set("luxe_session", user);
    this._emit();
    Toast.show("Signed in with Google (demo mode)");
    return user;
  },

  async resetPassword(email) {
    if (FIREBASE_ENABLED) return auth.sendPasswordResetEmail(email);
    Toast.show(`Password reset link sent to ${email} (demo mode)`);
  },

  async logout() {
    if (FIREBASE_ENABLED) await auth.signOut();
    else LS.set("luxe_session", null);
    this._emit();
  },

  async isAdmin() {
    const u = this.currentUser();
    if (!u) return false;
    if (FIREBASE_ENABLED) {
      const doc = await db.collection("admins").doc(u.uid).get();
      return doc.exists;
    }
    return LS.get("luxe_admin_emails", ["admin@luxe.test"]).includes(u.email);
  },

  requireLogin(redirectTo = "account.html") {
    if (!this.currentUser()) {
      window.location.href = `login.html?next=${encodeURIComponent(redirectTo)}`;
      return false;
    }
    return true;
  }
};

if (FIREBASE_ENABLED) {
  auth.onAuthStateChanged(() => LuxeAuth._emit());
}

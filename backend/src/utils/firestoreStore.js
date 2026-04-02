import { getFirebaseDb } from "../config/firebase.js";

const collections = {
  users: "users",
  products: "products",
  carts: "carts",
  orders: "orders",
  subscriptions: "subscriptions"
};

const withId = (snapshot) => ({ _id: snapshot.id, ...snapshot.data() });

const collection = (name) => getFirebaseDb().collection(collections[name]);

export const firebaseStore = {
  async findUserByEmail(email) {
    const snapshot = await collection("users").where("email", "==", email).limit(1).get();
    if (snapshot.empty) return null;
    return withId(snapshot.docs[0]);
  },

  async findUserById(id) {
    const snapshot = await collection("users").doc(id).get();
    return snapshot.exists ? withId(snapshot) : null;
  },

  async createUser({ name, email, password }) {
    const ref = collection("users").doc();
    const user = {
      name,
      email,
      password,
      loyaltyPoints: 0,
      addresses: [],
      purchasePreferences: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await ref.set(user);
    await collection("carts").doc(ref.id).set({
      user: ref.id,
      items: [],
      updatedAt: new Date().toISOString()
    });

    return { _id: ref.id, ...user };
  },

  async updateUser(id, partial) {
    await collection("users").doc(id).set(
      {
        ...partial,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    return this.findUserById(id);
  },

  async getProducts() {
    const snapshot = await collection("products").get();
    return snapshot.docs.map(withId);
  },

  async getProductById(id) {
    const snapshot = await collection("products").doc(id).get();
    return snapshot.exists ? withId(snapshot) : null;
  },

  async seedProducts(products) {
    for (const product of products) {
      const { _id, ...data } = product;
      await collection("products").doc(_id).set(data);
    }
  },

  async getCart(userId) {
    const ref = collection("carts").doc(userId);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      await ref.set({
        user: userId,
        items: [],
        updatedAt: new Date().toISOString()
      });
      return { _id: userId, user: userId, items: [] };
    }

    return { _id: snapshot.id, ...snapshot.data() };
  },

  async saveCart(userId, items) {
    await collection("carts").doc(userId).set(
      {
        user: userId,
        items,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    return this.getCart(userId);
  },

  async getOrders(userId) {
    const snapshot = await collection("orders").where("user", "==", userId).get();
    return snapshot.docs.map(withId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createOrder(payload) {
    const ref = collection("orders").doc();
    const order = {
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await ref.set(order);
    return { _id: ref.id, ...order };
  },

  async getOrderById(orderId) {
    const snapshot = await collection("orders").doc(orderId).get();
    return snapshot.exists ? withId(snapshot) : null;
  },

  async getSubscriptions(userId) {
    const snapshot = await collection("subscriptions").where("user", "==", userId).get();
    return snapshot.docs.map(withId);
  },

  async createSubscription(payload) {
    const ref = collection("subscriptions").doc();
    const data = {
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await ref.set(data);
    return { _id: ref.id, ...data };
  },

  async updateSubscription(subscriptionId, payload) {
    const ref = collection("subscriptions").doc(subscriptionId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return null;

    await ref.set(
      {
        ...payload,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    const updated = await ref.get();
    return withId(updated);
  }
};

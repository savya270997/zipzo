import bcrypt from "bcryptjs";

const demoUsers = [];
const demoCarts = new Map();
const demoOrders = new Map();
const demoSubscriptions = new Map();

const ensureDemoUser = async () => {
  const existingUser = demoUsers.find((user) => user.email === "test@g.com");

  if (existingUser) {
    return existingUser;
  }

  const password = await bcrypt.hash("1234", 10);
  const user = {
    _id: "demo-user-1",
    name: "Test User",
    email: "test@g.com",
    password,
    role: "customer",
    loyaltyPoints: 120,
    addresses: [],
    purchasePreferences: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  demoUsers.push(user);
  return user;
};

await ensureDemoUser();

export const demoStore = {
  async findUserByEmail(email) {
    return demoUsers.find((user) => user.email === email) || null;
  },
  async findUserById(id) {
    return demoUsers.find((user) => user._id === id) || null;
  },
  async createUser({ name, email, password, role = "customer", addresses = [] }) {
    const user = {
      _id: `demo-user-${demoUsers.length + 1}`,
      name,
      email,
      password,
      role,
      loyaltyPoints: 0,
      addresses,
      purchasePreferences: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    demoUsers.push(user);
    demoCarts.set(user._id, { _id: `demo-cart-${demoUsers.length}`, user: user._id, items: [] });
    return user;
  },
  async getCart(userId) {
    if (!demoCarts.has(userId)) {
      demoCarts.set(userId, { _id: `demo-cart-${demoCarts.size + 1}`, user: userId, items: [] });
    }

    return demoCarts.get(userId);
  },
  async getOrders(userId) {
    return demoOrders.get(userId) || [];
  },
  async getSubscriptions(userId) {
    return demoSubscriptions.get(userId) || [];
  }
};

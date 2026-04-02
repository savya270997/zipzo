import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import api from "./api/client";
import Navbar from "./components/Navbar";
import CartDock from "./components/CartDock";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import TrackingPage from "./pages/TrackingPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import RewardsPage from "./pages/RewardsPage";
import ProfilePage from "./pages/ProfilePage";
import ShopsPage from "./pages/ShopsPage";
import { useAuth } from "./context/AuthContext";

const emptyCart = { items: [] };

const App = () => {
  const { isAuthenticated, setUser } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [rewards, setRewards] = useState({ loyaltyPoints: 0, nextRewardAt: 100 });
  const [recommendations, setRecommendations] = useState([]);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(emptyCart);
      return;
    }
    const { data } = await api.get("/cart");
    setCart(data || emptyCart);
  };

  const refreshOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    const { data } = await api.get("/orders");
    setOrders(data);
  };

  const refreshSubscriptions = async () => {
    if (!isAuthenticated) {
      setSubscriptions([]);
      return;
    }
    const { data } = await api.get("/subscriptions");
    setSubscriptions(data);
  };

  const refreshRewards = async () => {
    if (!isAuthenticated) {
      setRewards({ loyaltyPoints: 0, nextRewardAt: 100 });
      return;
    }
    const { data } = await api.get("/recommendations/rewards");
    setRewards(data);
  };

  const refreshRecommendations = async () => {
    if (!isAuthenticated) {
      setRecommendations([]);
      return;
    }
    const { data } = await api.get("/recommendations");
    setRecommendations(data);
  };

  const refreshUser = async () => {
    if (!isAuthenticated) return;
    const { data } = await api.get("/auth/me");
    setUser(data);
  };

  useEffect(() => {
    Promise.all([
      refreshCart(),
      refreshOrders(),
      refreshSubscriptions(),
      refreshRewards(),
      refreshRecommendations()
    ]);
  }, [isAuthenticated]);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) return;
    const { data } = await api.post("/cart", { productId, quantity: 1 });
    setCart(data);
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    const { data } = await api.patch(`/cart/${itemId}`, { quantity });
    setCart(data);
  };

  const handleRemoveItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setCart(data);
  };

  const handleSubscribe = async (productId) => {
    await api.post("/subscriptions", {
      product: productId,
      quantity: 1,
      frequency: "daily",
      preferredSlot: "Every day 7:00 AM - 8:00 AM",
      nextDeliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    refreshSubscriptions();
  };

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.items.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || 0),
    0
  );

  return (
    <div className="pb-28">
      <Navbar cartCount={cartItemCount} />
      <Routes>
        <Route path="/" element={<HomePage onAddToCart={handleAddToCart} recommendations={recommendations} rewards={rewards} />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/catalog" element={<CatalogPage onAddToCart={handleAddToCart} />} />
        <Route
          path="/shops"
          element={
            <PrivateRoute>
              <ShopsPage />
            </PrivateRoute>
          }
        />
        <Route path="/products/:id" element={<ProductPage onAddToCart={handleAddToCart} onSubscribe={handleSubscribe} />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage cart={cart} updateQuantity={handleUpdateQuantity} removeItem={handleRemoveItem} />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage cart={cart} refreshCart={refreshCart} refreshUser={refreshUser} />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage orders={orders} />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:orderId/tracking"
          element={
            <PrivateRoute>
              <TrackingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <PrivateRoute>
              <SubscriptionsPage subscriptions={subscriptions} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage rewards={rewards} subscriptions={subscriptions} orders={orders} />
            </PrivateRoute>
          }
        />
      </Routes>
      <CartDock itemCount={cartItemCount} subtotal={cartSubtotal} />
    </div>
  );
};

export default App;

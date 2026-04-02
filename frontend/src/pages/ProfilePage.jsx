import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyAddress = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  landmark: "",
  isDefault: false
};

const ProfilePage = ({ rewards, subscriptions = [], orders = [] }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const loadAddresses = async () => {
    try {
      const { data } = await api.get("/addresses");
      setAddresses(data);
    } catch {
      setError("Unable to load addresses right now.");
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const saveAddress = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) {
        const { data } = await api.patch(`/addresses/${editingId}`, addressForm);
        setAddresses(data);
      } else {
        const { data } = await api.post("/addresses", addressForm);
        setAddresses(data);
      }
      setAddressForm(emptyAddress);
      setEditingId(null);
    } catch {
      setError("Could not save address.");
    }
  };

  const deleteAddress = async (id) => {
    const { data } = await api.delete(`/addresses/${id}`);
    setAddresses(data);
  };

  const setDefault = async (id) => {
    const found = addresses.find((a) => a._id === id);
    if (!found) return;
    const { data } = await api.patch(`/addresses/${id}`, { ...found, isDefault: true });
    setAddresses(data);
  };

  return (
    <div className="shell space-y-8 py-8">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-600">Profile</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Account overview</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-brand-50 p-4 text-brand-800 dark:bg-brand-900/30 dark:text-brand-50">
            <p className="text-sm text-brand-700 dark:text-brand-100">Name</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
          <div className="rounded-2xl bg-brand-50 p-4 text-brand-800 dark:bg-brand-900/30 dark:text-brand-50">
            <p className="text-sm text-brand-700 dark:text-brand-100">Email</p>
            <p className="font-semibold">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.65fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Addresses</p>
              <h2 className="section-title">Manage delivery addresses</h2>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                setAddressForm(emptyAddress);
                setEditingId(null);
              }}
            >
              New address
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {addresses.map((address) => (
              <div key={address._id} className="flex items-start justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-semibold">
                    {address.label} {address.isDefault ? "• Default" : ""}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {address.line1}, {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {address.fullName} · {address.phone}
                  </p>
                  <div className="mt-2 flex gap-2 text-xs">
                    <button className="btn-secondary px-3 py-1" onClick={() => setDefault(address._id)}>
                      Set default
                    </button>
                    <button
                      className="btn-secondary px-3 py-1"
                      onClick={() => {
                        setEditingId(address._id);
                        setAddressForm({ ...address });
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn-secondary px-3 py-1 text-rose-600" onClick={() => deleteAddress(address._id)}>
                      <Trash2 className="mr-1 inline h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="section-title">Add / edit address</h2>
          <form className="mt-4 grid gap-3" onSubmit={saveAddress}>
            {["label", "fullName", "phone", "line1", "line2", "city", "state", "postalCode", "landmark"].map((key) => (
              <input
                key={key}
                className="input"
                placeholder={key.replace(/([A-Z])/g, " $1")}
                value={addressForm[key]}
                onChange={(event) => setAddressForm({ ...addressForm, [key]: event.target.value })}
                required={["label", "fullName", "phone", "line1", "city", "state", "postalCode"].includes(key)}
              />
            ))}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })}
              />
              Set as default
            </label>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <button className="btn-primary">{editingId ? "Update address" : "Save address"}</button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Orders</p>
              <h2 className="section-title">Recent order history</h2>
            </div>
            <Link to="/orders" className="btn-secondary">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No orders yet.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div key={order._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{order._id}</p>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{order.status || "Placed"}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {order.items?.length || 0} items • {order.paymentMethod || "Online payment"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <p className="section-kicker">Rewards</p>
          <h2 className="section-title">Loyalty overview</h2>
          <p className="mt-3 text-3xl font-bold text-brand-700 dark:text-brand-200">{rewards.loyaltyPoints} pts</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Next reward at {rewards.nextRewardAt} pts</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Subscriptions</p>
              <h2 className="section-title">Your active plans</h2>
            </div>
          </div>
          {subscriptions.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No subscriptions yet.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {subscriptions.map((sub) => (
                <div key={sub._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <p className="font-semibold">{sub.product?.name || "Subscription"}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {sub.quantity} qty • {sub.frequency} • {sub.preferredSlot}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

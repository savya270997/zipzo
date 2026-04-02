import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { formatCurrency } from "../utils/currency";

const initialAddress = {
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

const slots = ["Instant (10-15 mins)", "Tomorrow 7:00 AM - 8:00 AM", "Tomorrow 6:00 PM - 7:00 PM"];

const CheckoutPage = ({ cart, refreshCart, refreshUser }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [addressForm, setAddressForm] = useState(initialAddress);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [offerCode, setOfferCode] = useState("");
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [scheduledSlot, setScheduledSlot] = useState(slots[0]);
  const navigate = useNavigate();

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 35;
  const offerDiscount = appliedOffer?.type === "flat" ? appliedOffer.value : appliedOffer?.type === "percent" ? Math.round((subtotal * appliedOffer.value) / 100) : 0;
  const total = Math.max(subtotal + deliveryFee - offerDiscount, 0);

  const availableOffers = [
    { code: "ZIP50", label: "₹50 off above ₹399", type: "flat", value: 50, min: 399 },
    { code: "SORBET10", label: "10% off (max ₹150)", type: "percent", value: 10, cap: 150 },
    { code: "FREESHIP", label: "Free delivery", type: "delivery", value: 35 }
  ];

  const applyOffer = () => {
    const trimmed = offerCode.trim().toUpperCase();
    const match = availableOffers.find((o) => o.code === trimmed);
    if (!match) {
      setAppliedOffer(null);
      return;
    }

    if (match.min && subtotal < match.min) {
      setAppliedOffer({ ...match, error: `Add ₹${match.min - subtotal} more to unlock` });
      return;
    }

    if (match.type === "delivery") {
      setAppliedOffer({ ...match, value: deliveryFee });
      return;
    }

    if (match.type === "percent" && match.cap) {
      const calc = Math.min(Math.round((subtotal * match.value) / 100), match.cap);
      setAppliedOffer({ ...match, computed: calc, value: calc, type: "flat" });
      return;
    }

    setAppliedOffer(match);
  };

  useEffect(() => {
    api.get("/addresses").then(({ data }) => {
      setAddresses(data);
      const defaultAddress = data.find((address) => address.isDefault) || data[0];
      setSelectedAddressId(defaultAddress?._id || "");
      setShowAddressForm(data.length === 0);
    });
  }, []);

  const saveAddress = async (event) => {
    event.preventDefault();
    let response;
    if (editingAddressId) {
      const { data } = await api.patch(`/addresses/${editingAddressId}`, addressForm);
      response = data;
    } else {
      const { data } = await api.post("/addresses", addressForm);
      response = data;
    }

    const latest = response.find((addr) => addr._id === (editingAddressId || response.at(-1)?._id));
    setAddresses(response);
    setSelectedAddressId(latest?._id || "");
    setAddressForm(initialAddress);
    setEditingAddressId(null);
    setShowAddressForm(false);
    refreshUser();
  };

  const placeOrder = async () => {
    if (!selectedAddressId) return;

    if (paymentMethod === "razorpay") {
      await api.post("/orders/payment-order", { amount: total });
    }

    const { data } = await api.post("/orders", {
      addressId: selectedAddressId,
      paymentMethod,
      scheduledSlot
    });

    await Promise.all([refreshCart(), refreshUser()]);
    navigate(`/orders/${data._id}/tracking`);
  };

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <div className="card p-6">
          <h1 className="font-display text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose an address, schedule, and payment method.</p>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-2xl font-semibold">Saved addresses</h2>
          {addresses.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Add your delivery address to proceed.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="flex items-start justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      checked={selectedAddressId === address._id}
                      onChange={() => setSelectedAddressId(address._id)}
                    />
                    <div>
                      <p className="font-semibold">
                        {address.label} {address.isDefault ? "• Default" : ""}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {address.line1}, {address.city}, {address.state} - {address.postalCode}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {address.fullName} · {address.phone}
                      </p>
                    </div>
                  </label>
                  <button
                    className="text-sm font-semibold text-brand-600 hover:underline"
                    onClick={() => {
                      setAddressForm({ ...address });
                      setEditingAddressId(address._id);
                      setShowAddressForm(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
          {addresses.length > 0 ? (
            <button className="btn-secondary mt-4" onClick={() => {
              setAddressForm(initialAddress);
              setEditingAddressId(null);
              setShowAddressForm(true);
            }}>
              Add new address
            </button>
          ) : null}
        </div>

        {showAddressForm ? (
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">{editingAddressId ? "Edit address" : "Add new address"}</h2>
              {addresses.length > 0 ? (
                <button
                  className="text-sm font-semibold text-slate-500 hover:underline"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddressId(null);
                    setAddressForm(initialAddress);
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
            <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={saveAddress}>
              {Object.entries(addressForm).map(([key, value]) =>
                key === "isDefault" ? (
                  <label key={key} className="flex items-center gap-2 text-sm md:col-span-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })}
                    />
                    Set as default
                  </label>
                ) : (
                  <input
                    key={key}
                    className={`input ${key === "line1" || key === "line2" ? "md:col-span-2" : ""}`}
                    placeholder={key.replace(/([A-Z])/g, " $1")}
                    value={value}
                    onChange={(event) => setAddressForm({ ...addressForm, [key]: event.target.value })}
                    required={["label", "fullName", "phone", "line1", "city", "state", "postalCode"].includes(key)}
                  />
                )
              )}
              <button className="btn-primary md:col-span-2">{editingAddressId ? "Update address" : "Save address"}</button>
            </form>
          </div>
        ) : null}
      </div>

      <aside className="space-y-6">
        <div className="card p-6">
          <h2 className="font-display text-2xl font-semibold">Delivery slot</h2>
          <div className="mt-4 space-y-3">
            {slots.map((slot) => (
              <label key={slot} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <input type="radio" checked={scheduledSlot === slot} onChange={() => setScheduledSlot(slot)} />
                <span>{slot}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold">Offers</h2>
            {appliedOffer ? (
              <button
                className="text-sm font-semibold text-rose-600 hover:underline"
                onClick={() => {
                  setAppliedOffer(null);
                  setOfferCode("");
                }}
              >
                Remove
              </button>
            ) : null}
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="input flex-1"
                placeholder="Enter code e.g. ZIP50"
                value={offerCode}
                onChange={(event) => setOfferCode(event.target.value)}
              />
              <button className="btn-primary sm:w-32" type="button" onClick={applyOffer}>
                Apply
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {availableOffers.map((offer) => (
                <button
                  key={offer.code}
                  type="button"
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    appliedOffer?.code === offer.code ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30" : "border-slate-200 hover:border-brand-300 dark:border-slate-700"
                  }`}
                  onClick={() => {
                    setOfferCode(offer.code);
                    setAppliedOffer(offer);
                  }}
                >
                  <p className="font-semibold">{offer.code}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{offer.label}</p>
                </button>
              ))}
            </div>
            {appliedOffer ? (
              <p className={`text-sm ${appliedOffer.error ? "text-amber-600" : "text-emerald-600"}`}>
                {appliedOffer.error
                  ? appliedOffer.error
                  : `Applied ${appliedOffer.code} • ${
                      appliedOffer.type === "percent" && appliedOffer.computed ? `${appliedOffer.value}% (₹${appliedOffer.computed})` : `₹${appliedOffer.value} off`
                    }`}
              </p>
            ) : null}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-2xl font-semibold">Payment</h2>
          <div className="mt-4 grid gap-3">
            {["razorpay", "cod"].map((method) => (
              <button
                key={method}
                className={`rounded-2xl border px-4 py-3 text-left ${paymentMethod === method ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30" : "border-slate-200 dark:border-slate-700"}`}
                onClick={() => setPaymentMethod(method)}
              >
                {method === "razorpay" ? "Razorpay" : "Cash on delivery"}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-2xl font-semibold">Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
            </div>
            {appliedOffer && !appliedOffer.error ? (
              <div className="flex justify-between text-emerald-700">
                <span>Offer ({appliedOffer.code})</span>
                <span>-{formatCurrency(appliedOffer.type === "flat" ? appliedOffer.value : offerDiscount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <button className="btn-primary mt-6 w-full" onClick={placeOrder} disabled={!selectedAddressId || cart.items.length === 0}>
            Place order
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CheckoutPage;

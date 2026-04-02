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
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [scheduledSlot, setScheduledSlot] = useState(slots[0]);
  const navigate = useNavigate();

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 35;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    api.get("/addresses").then(({ data }) => {
      setAddresses(data);
      const defaultAddress = data.find((address) => address.isDefault) || data[0];
      setSelectedAddressId(defaultAddress?._id || "");
    });
  }, []);

  const saveAddress = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/addresses", addressForm);
    setAddresses(data);
    const latest = data.at(-1);
    setSelectedAddressId(latest._id);
    setAddressForm(initialAddress);
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
          <div className="mt-5 space-y-3">
            {addresses.map((address) => (
              <label key={address._id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
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
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-2xl font-semibold">Add new address</h2>
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
            <button className="btn-primary md:col-span-2">Save address</button>
          </form>
        </div>
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

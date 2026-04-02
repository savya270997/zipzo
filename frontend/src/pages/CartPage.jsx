import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

const CartPage = ({ cart, updateQuantity, removeItem }) => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 35;
  const total = subtotal + deliveryFee;

  return (
    <div className="shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cart.items.length === 0 ? (
            <div className="card p-8">
              <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Add essentials from the catalog to begin checkout.</p>
              <Link to="/catalog" className="btn-primary mt-6">
                Browse products
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item._id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.product.weight}</p>
                  <p className="mt-2 font-bold">{formatCurrency(item.product.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="btn-secondary px-3 py-3" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-6 text-center font-semibold">{item.quantity}</span>
                  <button className="btn-secondary px-3 py-3" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button className="btn-secondary px-3 py-3" onClick={() => removeItem(item._id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <aside className="card h-fit p-6">
          <h2 className="font-display text-2xl font-bold">Bill summary</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 w-full">
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;

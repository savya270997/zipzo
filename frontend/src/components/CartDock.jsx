import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

const hiddenRoutes = ["/auth", "/cart", "/checkout"];

const CartDock = ({ itemCount, subtotal }) => {
  const location = useLocation();

  if (!itemCount || hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const savings = Math.max(Math.round(subtotal * 0.08), 12);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] px-4 sm:bottom-6">
      <div className="shell">
        <div className="pointer-events-auto overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white shadow-2xl shadow-brand-900/30 backdrop-blur">
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{itemCount} item{itemCount > 1 ? "s" : ""} added</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/80">
                  <span>Cart ready to checkout</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/60 sm:block" />
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    You are already saving {formatCurrency(savings)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">Current total</p>
                <p className="mt-1 font-display text-2xl font-bold">{formatCurrency(subtotal)}</p>
              </div>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
              >
                View cart
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDock;

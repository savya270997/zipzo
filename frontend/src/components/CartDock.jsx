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
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/12 sm:h-12 sm:w-12">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold sm:text-base">
                  {itemCount} item{itemCount > 1 ? "s" : ""} added
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-white/80 sm:text-xs">
                  <span className="truncate">Ready to checkout</span>
                  <span className="hidden h-1 w-1 rounded-full bg-white/60 sm:block" />
                  <span className="hidden items-center gap-1 sm:inline-flex">
                    <Sparkles className="h-3.5 w-3.5" />
                    Saving {formatCurrency(savings)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <div className="text-right">
                <p className="hidden text-[11px] uppercase tracking-[0.24em] text-white/70 sm:block">Current total</p>
                <p className="font-display text-lg font-bold sm:mt-1 sm:text-2xl">{formatCurrency(subtotal)}</p>
              </div>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 sm:px-4 sm:py-3"
              >
                <span className="hidden sm:inline">View cart</span>
                <span className="sm:hidden">Cart</span>
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

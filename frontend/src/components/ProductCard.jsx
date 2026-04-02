import { Link } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import { formatCurrency } from "../utils/currency";

const ProductCard = ({ product, onAdd }) => (
  <article className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl">
    <div className="relative">
      <img src={product.image} alt={product.name} className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-600">
        {Math.max(product.mrp - product.price, 0) > 0 ? `${Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off` : "Fresh deal"}
      </div>
    </div>
    <div className="space-y-3 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-brand-500">{product.category}</p>
          <Link to={`/products/${product._id}`} className="mt-1 block text-lg font-semibold leading-6">
            {product.name}
          </Link>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">
          {product.weight}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-500 dark:text-slate-400">{product.brand}</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <Star className="h-3.5 w-3.5 fill-current" />
          {product.rating}
        </span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
          <p className="text-xs text-slate-400 line-through">{formatCurrency(product.mrp)}</p>
          <p className="mt-1 text-xs text-emerald-600">{product.stock > 0 ? `${product.stock} left in stock` : "Out of stock"}</p>
        </div>
        <button className="btn-primary gap-2 px-4 py-2" onClick={() => onAdd(product._id)}>
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  </article>
);

export default ProductCard;

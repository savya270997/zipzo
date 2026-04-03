import { Link } from "react-router-dom";
import { Plus, Star } from "lucide-react";
import { formatCurrency } from "../utils/currency";
import ImageInitials from "./ImageInitials";

const ProductCard = ({ product, onAdd, style }) => (
  <article className="product-card group" style={style}>
    <div className="product-media relative">
      <ImageInitials
        src={product.image}
        name={product.name}
        className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        placeholderClass="h-52 w-full rounded-t-[28px] text-3xl transition duration-500 group-hover:scale-[1.03]"
      />
      <div className="product-badge absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-600 shadow-sm">
        {Math.max(product.mrp - product.price, 0) > 0 ? `${Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off` : "Fresh deal"}
      </div>
    </div>
    <div className="product-content flex flex-1 flex-col space-y-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="product-subtle text-[11px] uppercase tracking-[0.24em] text-brand-500">{product.category}</p>
          <Link to={`/products/${product._id}`} className="product-title mt-1 block text-lg font-semibold leading-6 text-slate-800 transition-colors hover:text-brand-700">
            {product.name}
          </Link>
        </div>
        <span className="meta-pill shrink-0 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">
          {product.weight}
        </span>
      </div>
      <div className="flex min-h-[48px] items-start justify-between gap-4 text-sm">
        <div className="min-w-0">
          <p className="product-subtle truncate text-slate-500 dark:text-slate-400">{product.brand}</p>
          {product.shop?.name ? (
            product.shop?.id ? (
              <Link to={`/shops/${product.shop.id}`} className="product-subtle mt-1 inline-block text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline dark:text-brand-300">
                Sold by {product.shop.name}
              </Link>
            ) : (
              <p className="product-subtle mt-1 inline-block text-xs font-medium text-brand-600 dark:text-brand-300">
                Sold by {product.shop.name}
              </p>
            )
          ) : null}
        </div>
        <span className="meta-pill meta-pill-accent shrink-0">
          <Star className="h-3.5 w-3.5 fill-current" />
          {product.rating}
        </span>
      </div>
      <div className="product-divider mt-auto flex items-end justify-between gap-3 border-t border-brand-100/80 pt-4">
        <div>
          <p className="product-price text-lg font-bold text-slate-900">{formatCurrency(product.price)}</p>
          <p className="product-subtle text-xs text-slate-400 line-through">{formatCurrency(product.mrp)}</p>
          <p className="product-stock mt-1 text-xs text-emerald-600">{product.stock > 0 ? `${product.stock} left in stock` : "Out of stock"}</p>
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

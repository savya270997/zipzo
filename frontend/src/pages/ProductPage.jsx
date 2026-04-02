import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Clock3, Repeat2 } from "lucide-react";
import api from "../api/client";
import { formatCurrency } from "../utils/currency";
import ImageInitials from "../components/ImageInitials";

const ProductPage = ({ onAddToCart, onSubscribe }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) {
    return <div className="shell py-20 text-center">Loading product...</div>;
  }

  return (
    <div className="shell py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <ImageInitials
            src={product.image}
            name={product.name}
            className="h-full w-full object-cover"
            placeholderClass="h-full w-full text-5xl"
          />
        </div>
        <div className="card p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl font-bold">{product.name}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{product.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-brand-50 px-4 py-2 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100">{product.weight}</span>
            <span className="rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">{product.brand}</span>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-6 flex items-end gap-4">
            <p className="text-4xl font-bold">{formatCurrency(product.price)}</p>
            <p className="pb-1 text-sm text-slate-400 line-through">{formatCurrency(product.mrp)}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => onAddToCart(product._id)}>
              Add to cart
            </button>
            <button
              className="btn-secondary gap-2"
              onClick={async () => {
                await onSubscribe(product._id);
                setMessage("Subscription created for daily delivery.");
              }}
            >
              <Repeat2 className="h-4 w-4" />
              Subscribe
            </button>
          </div>
          {message ? <p className="mt-4 text-sm text-emerald-600">{message}</p> : null}

          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3">
              <Clock3 className="mt-1 h-5 w-5 text-brand-600" />
              <div>
                <p className="font-semibold">Delivery choices</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Instant dispatch in 10-15 minutes or choose a scheduled slot at checkout.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-brand-600" />
              <div>
                <p className="font-semibold">Price comparison</p>
                <div className="mt-2 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  {product.priceComparisons.map((comparison) => (
                    <div key={comparison.store} className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                      <span>{comparison.store}</span>
                      <span>
                        {formatCurrency(comparison.price)} • {comparison.deliveryEta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

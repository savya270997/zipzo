import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, MapPin, Star, Store } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

const ShopDetailPage = ({ onAddToCart }) => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/shops/${shopId}`)
      .then(({ data }) => setShop(data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load this shop right now."))
      .finally(() => setLoading(false));
  }, [shopId]);

  if (loading) {
    return <div className="shell py-16 text-center text-slate-500 dark:text-slate-400">Loading shop...</div>;
  }

  if (error) {
    return <div className="shell py-16 text-center text-rose-600">{error}</div>;
  }

  if (!shop) return null;

  return (
    <div className="shell space-y-8 py-8">
      <Link to="/shops" className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:underline dark:text-brand-300">
        <ArrowLeft className="h-4 w-4" />
        Back to shops
      </Link>

      <section className="card overflow-hidden bg-gradient-to-br from-brand-500 via-brand-400 to-amber-300 p-8 text-white shadow-glow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15">
              <Store className="h-7 w-7" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/75">Partnered seller</p>
            <h1 className="mt-2 font-display text-4xl font-bold">{shop.name}</h1>
            <p className="mt-3 max-w-xl text-white/80">
              Explore products listed by this shop, compare prices with other sellers, and place your order from the best fit.
            </p>
            <p className="mt-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium">{shop.offer}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/12 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Rating</p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
                <Star className="h-5 w-5 fill-current" />
                {shop.rating}
              </p>
            </div>
            <div className="rounded-3xl bg-white/12 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Delivery</p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
                <Clock3 className="h-5 w-5" />
                {shop.etaMinutes} min
              </p>
            </div>
            <div className="rounded-3xl bg-white/12 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">City</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-4 w-4" />
                {shop.city}
              </p>
            </div>
            <div className="rounded-3xl bg-white/12 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Products</p>
              <p className="mt-2 text-2xl font-bold">{shop.productCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-kicker">Listed products</p>
            <h2 className="section-title">Available from {shop.name}</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {shop.tags?.join(" • ")}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {shop.products?.map((product) => (
            <ProductCard key={product._id} product={product} onAdd={onAddToCart} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShopDetailPage;

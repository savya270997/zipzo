import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Gift,
  Mic,
  Repeat2,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import ImageInitials from "../components/ImageInitials";

const featureCards = [
  { icon: Sparkles, title: "AI Smart Baskets", copy: "Recommendations that become sharper after every order." },
  { icon: Repeat2, title: "Repeat Orders", copy: "Milk, bread, eggs, and daily staples on autopilot." },
  { icon: Gift, title: "Rewards Wallet", copy: "Stack loyalty points with every grocery refill." },
  { icon: TimerReset, title: "Slot Delivery", copy: "Instant now, or reserve the delivery hour you want." }
];

const promoCards = [
  { title: "Mega Saver Deals", copy: "Up to 45% off on pantry refills and breakfast packs.", tone: "from-brand-600 to-brand-500" },
  { title: "Fresh Hour", copy: "Extra cuts on fruits, vegetables, and dairy till midnight.", tone: "from-brand-400 to-amber-300" },
  { title: "Daily Essentials", copy: "One-tap restock for milk, bread, eggs, and atta.", tone: "from-slate-900 to-brand-700" }
];

const HomePage = ({ onAddToCart, recommendations = [] }) => {
  const [featured, setFeatured] = useState([]);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api.get("/products/featured").then(({ data }) => setFeatured(data));
    api.get("/products").then(({ data }) => setCatalog(data.products || []));
  }, []);

  const topDeals = useMemo(
    () =>
      [...catalog]
        .sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
        .slice(0, 8),
    [catalog]
  );

  const trendingNow = useMemo(
    () => [...catalog].sort((a, b) => b.rating - a.rating || b.stock - a.stock).slice(0, 8),
    [catalog]
  );

  const categoryHighlights = useMemo(() => {
    const map = new Map();

    catalog.forEach((product) => {
      if (!map.has(product.category)) {
        map.set(product.category, product);
      }
    });

    return Array.from(map.values()).slice(0, 20);
  }, [catalog]);

  return (
    <div className="space-y-14 pb-16">
      <section className="shell grid gap-6 py-8 lg:grid-cols-[1.35fr_0.95fr] lg:py-12">
        <div className="card overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 p-8 text-white shadow-glow sm:p-10">
          <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-100">
            Grocery marketplace
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Fast grocery delivery with richer offers, wider categories, and smarter reordering.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
            Discover 100+ products, trending deals, AI picks, repeat orders, and delivery slots in one polished shopping dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/catalog" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-brand-600">
              Start shopping
            </Link>
            <Link to="/auth" className="rounded-2xl border border-white/25 px-5 py-3 text-sm font-semibold text-white">
              Create account
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-2xl font-bold">100+</p>
              <p className="text-sm text-white/75">Products live</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-2xl font-bold">20</p>
              <p className="text-sm text-white/75">Major categories</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4">
              <p className="text-2xl font-bold">10 min</p>
              <p className="text-sm text-white/75">Quick delivery option</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="section-kicker">Live offers</p>
                <h2 className="mt-2 font-display text-2xl font-bold">Today’s high-conversion banner zone</h2>
              </div>
              <BadgePercent className="h-6 w-6 text-brand-500" />
            </div>
            <div className="mt-5 grid gap-3">
              {promoCards.map((card) => (
                <div key={card.title} className={`rounded-[24px] bg-gradient-to-r ${card.tone} p-5 text-white`}>
                  <p className="font-display text-xl font-semibold">{card.title}</p>
                  <p className="mt-2 max-w-xs text-sm text-white/80">{card.copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featureCards.slice(0, 2).map(({ icon: Icon, title, copy }) => (
              <div key={title} className="card p-6">
                <div className="mb-4 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-900/40">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell space-y-6">
        <div className="grid gap-4 rounded-[32px] bg-white/70 p-6 ring-1 ring-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Browse categories</p>
              <h2 className="section-title">20 aisles to jump into instantly</h2>
            </div>
            <Link to="/catalog" className="btn-secondary gap-2">
              See all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {categoryHighlights.map((product) => (
              <Link
                key={product.category}
                to={`/catalog?category=${encodeURIComponent(product.category)}`}
                className="group overflow-hidden rounded-[24px] border border-brand-100 bg-white p-4 transition hover:-translate-y-1 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-950"
              >
                <ImageInitials
                  src={product.image}
                  name={product.category}
                  className="h-28 w-full rounded-2xl object-cover"
                  placeholderClass="h-28 w-full rounded-2xl text-xl"
                />
                <p className="mt-4 font-display text-lg font-semibold">{product.category}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Starting from {product.brand}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="shell space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-kicker">Trending aisle</p>
            <h2 className="section-title">Ready for instant delivery</h2>
          </div>
          <Link to="/catalog" className="btn-secondary gap-2">
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} onAdd={onAddToCart} />
          ))}
        </div>
      </section>

      <section className="shell grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Top deals</p>
              <h2 className="section-title">Big savings like a real marketplace home</h2>
            </div>
            <Zap className="h-5 w-5 text-brand-500" />
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {topDeals.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} onAdd={onAddToCart} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">Offer stack</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  New users get discovery deals, repeat orders unlock loyalty acceleration, and high-frequency staples stay one tap away.
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">Voice shopping</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Speak “milk, bread, bananas” and jump straight into search with filters already available.
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold">Reliable fulfillment</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Instant dispatch, scheduled slots, and live tracking from placed to delivered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell space-y-6">
        <div>
          <p className="section-kicker">Customer favorites</p>
          <h2 className="section-title">Top rated picks this week</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trendingNow.map((product) => (
            <ProductCard key={product._id} product={product} onAdd={onAddToCart} />
          ))}
        </div>
      </section>

      {recommendations.length ? (
        <section className="shell space-y-6">
          <div>
            <p className="section-kicker">AI picks for you</p>
            <h2 className="section-title">Personalized recommendations</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {recommendations.map((product) => (
              <ProductCard key={product._id} product={product} onAdd={onAddToCart} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default HomePage;

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

const banners = [
  { title: "Zipzo Saver Fest", copy: "Combo deals on breakfast & dairy. Limited till midnight.", tone: "from-brand-500 via-amber-400 to-rose-300" },
  { title: "Green Basket Hours", copy: "Fruits & veggies at farm-fresh pricing every evening.", tone: "from-emerald-400 via-emerald-500 to-brand-400" },
  { title: "Slot & Save", copy: "Pick tomorrow slots and save extra on delivery.", tone: "from-sky-400 via-brand-400 to-amber-300" }
];

const sideBanners = [
  { title: "Wallet Boost", copy: "Earn 2x points on repeat orders today.", tone: "from-purple-400 via-brand-400 to-amber-300" },
  { title: "New Sellers", copy: "Support local sellers with curated picks.", tone: "from-emerald-500 via-teal-400 to-brand-300" },
  { title: "Voice to Cart", copy: "Speak milk, eggs, bread to auto-fill your basket.", tone: "from-brand-500 via-rose-400 to-orange-300" }
];

const featureCards = [
  { icon: Sparkles, title: "AI Smart Baskets", copy: "Recommendations that become sharper after every order." },
  { icon: Repeat2, title: "Repeat Orders", copy: "Milk, bread, eggs, and daily staples on autopilot." },
  { icon: Gift, title: "Rewards Wallet", copy: "Stack loyalty points with every grocery refill." },
  { icon: TimerReset, title: "Slot Delivery", copy: "Instant now, or reserve the delivery hour you want." }
];

const HomePage = ({ onAddToCart, recommendations = [] }) => {
  const [featured, setFeatured] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [sideBannerIndex, setSideBannerIndex] = useState(0);

  useEffect(() => {
    api.get("/products/featured").then(({ data }) => setFeatured(data));
    api.get("/products").then(({ data }) => setCatalog(data.products || []));
  }, []);

  useEffect(() => {
    const mainTimer = setInterval(() => {
      setBannerIndex((current) => (current + 1) % banners.length);
    }, 2000);

    const sideTimer = setInterval(() => {
      setSideBannerIndex((current) => (current + 1) % sideBanners.length);
    }, 2000);

    return () => {
      clearInterval(mainTimer);
      clearInterval(sideTimer);
    };
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

  const heroProducts = useMemo(() => catalog.slice(0, 20), [catalog]);

  return (
    <div className="space-y-14 pb-16">
      <section className="shell space-y-6 py-8 lg:py-12">
        <div className={`card overflow-hidden bg-gradient-to-br ${banners[bannerIndex].tone} p-8 text-white shadow-glow sm:p-10 transition`}>
          <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-100">
            Grocery marketplace
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{banners[bannerIndex].title}</h1>
              <p className="max-w-2xl text-base text-white/80 sm:text-lg">{banners[bannerIndex].copy}</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/catalog" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-brand-600 shadow">
                  Start shopping
                </Link>
                <Link to="/auth" className="rounded-2xl border border-white/25 px-5 py-3 text-sm font-semibold text-white">
                  Create account
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
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
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1].map((slot) => {
            const banner = sideBanners[(sideBannerIndex + slot) % sideBanners.length];
            return (
              <div key={slot} className={`card h-full bg-gradient-to-r ${banner.tone} p-6 text-white transition`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="section-kicker text-white/80">Offer</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold">{banner.title}</h3>
                    <p className="mt-2 text-sm text-white/85">{banner.copy}</p>
                  </div>
                  <BadgePercent className="h-6 w-6 text-white" />
                </div>
              </div>
            );
          })}
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
            <p className="section-kicker">Hero products</p>
            <h2 className="section-title">Top 20 picks for today</h2>
          </div>
          <Link to="/catalog" className="btn-secondary gap-2">
            Explore all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {heroProducts.map((product) => (
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

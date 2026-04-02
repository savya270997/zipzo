import { useEffect, useState } from "react";
import { ArrowRight, LocateFixed, MapPin, Star, Store } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const ShopsPage = () => {
  const { isAuthenticated } = useAuth();
  const [shops, setShops] = useState([]);
  const [shopMeta, setShopMeta] = useState({ city: "", postalCode: "" });
  const [addresses, setAddresses] = useState([]);
  const [activeAddress, setActiveAddress] = useState(null);
  const [locStatus, setLocStatus] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get("/addresses").then(({ data }) => {
      setAddresses(data);
      const def = data.find((a) => a.isDefault) || data[0];
      setActiveAddress(def || null);
    });
  }, [isAuthenticated]);

  const loadShops = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get("/shops/nearby");
      setShops(data.shops || []);
      setShopMeta({
        city: data.city || activeAddress?.city || "",
        postalCode: data.postalCode || activeAddress?.postalCode || ""
      });
      setVisibleCount(9);
      if (!activeAddress && data.city) {
        setActiveAddress({ city: data.city, postalCode: data.postalCode, label: data.addressLabel || "Default" });
      }
    } catch (error) {
      setShops([]);
      setShopMeta({
        city: activeAddress?.city || "",
        postalCode: activeAddress?.postalCode || ""
      });
      setLoadError(error.response?.data?.message || "Unable to load partner shops right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadShops();
  }, [isAuthenticated, activeAddress]);

  if (!isAuthenticated) {
    return (
      <div className="shell py-12">
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Login to see partner shops near you.</p>
          <Link to="/auth" className="btn-primary mt-4 inline-flex">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell space-y-8 py-8">
      <div className="card relative z-20 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-900/40">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-brand-600">Delivering to</p>
            <p className="font-semibold">
              {activeAddress ? `${activeAddress.label || "Default"} • ${activeAddress.city || ""} ${activeAddress.postalCode || ""}` : "Add an address"}
            </p>
            {locStatus ? <p className="text-xs text-slate-500 dark:text-slate-400">{locStatus}</p> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <details className="group relative">
            <summary className="btn-secondary cursor-pointer list-none gap-2">
              Switch address
              <ArrowRight className="inline h-4 w-4 rotate-90 transition group-open:-rotate-90" />
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {addresses.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No addresses yet</p>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <button
                      key={addr._id}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                        activeAddress?._id === addr._id ? "border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-900/30" : "border-slate-200 dark:border-slate-700"
                      }`}
                      onClick={async () => {
                        setActiveAddress(addr);
                        await api.patch(`/addresses/${addr._id}`, { isDefault: true });
                        setLocStatus("");
                        loadShops();
                      }}
                    >
                      {addr.label || "Address"} • {addr.city} {addr.postalCode}
                    </button>
                  ))}
                </div>
              )}
              <Link to="/checkout" className="mt-3 block text-xs font-semibold text-brand-600 hover:underline">
                Manage addresses
              </Link>
            </div>
          </details>
          <button
            className="btn-secondary gap-2"
            onClick={() => {
              if (!navigator.geolocation) {
                setLocStatus("Location not supported on this browser");
                return;
              }
              setLocStatus("Fetching live location…");
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const { latitude, longitude } = pos.coords;
                  setLocStatus(`Using GPS: ${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
                },
                () => setLocStatus("Unable to fetch location")
              );
            }}
          >
            <LocateFixed className="h-4 w-4" />
            Use GPS
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-kicker">Partnered shops</p>
            <h2 className="section-title">
              Near you • {shopMeta.city || activeAddress?.city || "Set address"} {(shopMeta.postalCode || activeAddress?.postalCode) ? `(${shopMeta.postalCode || activeAddress?.postalCode})` : ""}
            </h2>
          </div>
          <button className="btn-secondary" onClick={loadShops}>
            Refresh
          </button>
        </div>
        {loadError ? (
          <p className="mt-4 text-sm text-rose-600">{loadError}</p>
        ) : null}
        {loading ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading partner shops...</p>
        ) : shops.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No shops available yet. Try refresh once after the backend restarts.</p>
        ) : (
          <>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shops.slice(0, visibleCount).map((shop) => (
                <div key={shop.id} className="card h-full p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-900/40">
                      <Store className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{shop.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{shop.city}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {shop.rating}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">{shop.etaMinutes} min ETA</span>
                        {shop.since ? <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">Since {shop.since}</span> : null}
                        {shop.productCount ? <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">{shop.productCount} products</span> : null}
                      </div>
                      <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">{shop.offer}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {shop.tags?.slice(0, 3).join(" • ")}
                      </p>
                    </div>
                  </div>
                  <Link to={`/shops/${shop.id}`} className="btn-primary mt-4 w-full">
                    Shop now
                  </Link>
                </div>
              ))}
            </div>
            {visibleCount < shops.length ? (
              <div className="mt-4 flex justify-center">
                <button className="btn-secondary" onClick={() => setVisibleCount((c) => Math.min(c + 9, shops.length))}>
                  Load more
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopsPage;

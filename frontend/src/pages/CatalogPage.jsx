import { useEffect, useState } from "react";
import { Mic, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import { startVoiceSearch } from "../utils/voice";

const CatalogPage = ({ onAddToCart }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ categories: [], brands: [] });
  const [query, setQuery] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: "",
    maxPrice: ""
  });
  const [voiceError, setVoiceError] = useState("");

  useEffect(() => {
    setQuery((current) => {
      const nextSearch = searchParams.get("search") || "";
      const nextCategory = searchParams.get("category") || "";
      const nextBrand = searchParams.get("brand") || "";

      if (
        current.search === nextSearch &&
        current.category === nextCategory &&
        current.brand === nextBrand
      ) {
        return current;
      }

      return {
        ...current,
        search: nextSearch,
        category: nextCategory,
        brand: nextBrand
      };
    });
  }, [searchParams]);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(query).filter(([, value]) => value !== ""));
    api.get("/products", { params }).then(({ data }) => {
      setProducts(data.products);
      setFilters(data.filters);
    });
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (query.search) params.set("search", query.search);
    if (query.category) params.set("category", query.category);
    if (query.brand) params.set("brand", query.brand);

    const nextUrl = `/catalog${params.toString() ? `?${params.toString()}` : ""}`;
    navigate(nextUrl, { replace: true });
  }, [navigate, query.search, query.category, query.brand]);

  return (
    <div className="shell space-y-8 py-10">
      <div className="card p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Marketplace catalog</p>
            <h1 className="section-title">Browse products with cleaner filters</h1>
          </div>
          <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
            {products.length} products
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-11"
              placeholder="Search by name, brand, or category"
              value={query.search}
              onChange={(event) => setQuery({ ...query, search: event.target.value })}
            />
          </div>
          <button
            className="btn-secondary gap-2"
            onClick={() => {
              try {
                setVoiceError("");
                startVoiceSearch((result) => setQuery((current) => ({ ...current, search: result })));
              } catch (error) {
                setVoiceError(error.message);
              }
            }}
          >
            <Mic className="h-4 w-4" />
            Voice search
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <select className="input" value={query.category} onChange={(event) => setQuery({ ...query, category: event.target.value })}>
            <option value="">All categories</option>
            {filters.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select className="input" value={query.brand} onChange={(event) => setQuery({ ...query, brand: event.target.value })}>
            <option value="">All brands</option>
            {filters.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="number"
            placeholder="Min price"
            value={query.minPrice}
            onChange={(event) => setQuery({ ...query, minPrice: event.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Max price"
            value={query.maxPrice}
            onChange={(event) => setQuery({ ...query, maxPrice: event.target.value })}
          />
        </div>
        {voiceError ? <p className="mt-3 text-sm text-rose-500">{voiceError}</p> : null}
      </div>

      {products.length === 0 ? (
        <div className="card p-10 text-center text-slate-500">No products match these filters yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} onAdd={onAddToCart} style={{ animationDelay: `${index * 35}ms` }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;

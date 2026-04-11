import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Home, LogOut, Menu, Moon, Search, ShieldCheck, ShoppingBag, ShoppingCart, Store, Sun, Tag, Truck, UserCircle2, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-500 text-white shadow-[0_10px_24px_rgba(208,39,82,0.24)]"
      : "text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-200"
  }`;

const normalizeText = (value) => `${value || ""}`.trim().toLowerCase();

const fuzzyScore = (needle, haystack) => {
  const query = normalizeText(needle);
  const target = normalizeText(haystack);

  if (!query || !target) return 0;
  if (target === query) return 120;
  if (target.startsWith(query)) return 96;
  if (target.includes(query)) return 78;

  let score = 0;
  let pointer = 0;

  for (const char of query) {
    const foundIndex = target.indexOf(char, pointer);
    if (foundIndex === -1) {
      return 0;
    }

    score += foundIndex === pointer ? 9 : 4;
    pointer = foundIndex + 1;
  }

  return score;
};

const buildSuggestions = (query, products, shops) => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  const productSuggestions = products
    .map((product) => ({
      id: `product-${product._id}`,
      type: "product",
      title: product.name,
      subtitle: [product.brand, product.category].filter(Boolean).join(" • "),
      meta: product.shop?.name ? `Sold by ${product.shop.name}` : product.category,
      to: `/products/${product._id}`,
      image: product.image,
      score: Math.max(
        fuzzyScore(normalizedQuery, product.name),
        fuzzyScore(normalizedQuery, product.brand),
        fuzzyScore(normalizedQuery, product.category)
      )
    }))
    .filter((item) => item.score > 0);

  const shopSuggestions = shops
    .map((shop) => ({
      id: `shop-${shop.id}`,
      type: "shop",
      title: shop.name,
      subtitle: [shop.city, ...(shop.tags || []).slice(0, 2)].filter(Boolean).join(" • "),
      meta: shop.offer || "Partnered shop",
      to: `/shops/${shop.id}`,
      score: Math.max(
        fuzzyScore(normalizedQuery, shop.name),
        fuzzyScore(normalizedQuery, shop.city),
        ...((shop.tags || []).map((tag) => fuzzyScore(normalizedQuery, tag)))
      )
    }))
    .filter((item) => item.score > 0);

  const categorySuggestions = [...new Set(products.map((product) => product.category).filter(Boolean))]
    .map((category) => ({
      id: `category-${category}`,
      type: "category",
      title: category,
      subtitle: "Browse category",
      meta: "Category",
      to: `/catalog?category=${encodeURIComponent(category)}`,
      score: fuzzyScore(normalizedQuery, category)
    }))
    .filter((item) => item.score > 0);

  const brandSuggestions = [...new Set(products.map((product) => product.brand).filter(Boolean))]
    .map((brand) => ({
      id: `brand-${brand}`,
      type: "brand",
      title: brand,
      subtitle: "Browse brand",
      meta: "Brand",
      to: `/catalog?brand=${encodeURIComponent(brand)}`,
      score: fuzzyScore(normalizedQuery, brand)
    }))
    .filter((item) => item.score > 0);

  return [...productSuggestions, ...shopSuggestions, ...categorySuggestions, ...brandSuggestions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

const Navbar = ({ cartCount }) => {
  const { toggleTheme, theme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productsIndex, setProductsIndex] = useState([]);
  const [shopsIndex, setShopsIndex] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Account";
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";
  const mobileNavItems = isAdmin
    ? [
        { to: "/", label: "Home", icon: Home },
        { to: "/admin", label: "Admin", icon: ShieldCheck },
        { to: "/catalog", label: "Catalog", icon: ShoppingBag }
      ]
    : isSeller
    ? [
        { to: "/", label: "Home", icon: Home },
        { to: "/seller", label: "Seller", icon: Store },
        { to: "/catalog", label: "Catalog", icon: ShoppingBag }
      ]
    : [
        { to: "/", label: "Home", icon: Home },
        { to: "/catalog", label: "Catalog", icon: ShoppingBag },
        { to: "/shops", label: "Shops", icon: Store }
      ];

  useEffect(() => {
    if (mobileMenuOpen) {
      requestAnimationFrame(() => setMobileMenuVisible(true));
    } else {
      setMobileMenuVisible(false);
    }

  }, [mobileMenuOpen]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadSearchIndex = async () => {
      try {
        const requests = [api.get("/products")];
        if (isAuthenticated && !isSeller && !isAdmin) {
          requests.push(api.get("/shops/nearby"));
        }

        const [productsResponse, shopsResponse] = await Promise.all(requests);
        if (ignore) return;

        setProductsIndex(productsResponse.data.products || []);
        setShopsIndex(shopsResponse?.data?.shops || []);
      } catch {
        if (ignore) return;
        setProductsIndex([]);
        setShopsIndex([]);
      }
    };

    loadSearchIndex();
    return () => {
      ignore = true;
    };
  }, [isAuthenticated, isAdmin, isSeller]);

  const suggestions = useMemo(
    () => buildSuggestions(searchTerm, productsIndex, shopsIndex),
    [productsIndex, searchTerm, shopsIndex]
  );

  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
    window.setTimeout(() => setMobileMenuOpen(false), 220);
  };

  const submitSearch = (event, { closeDrawer = false } = {}) => {
    event.preventDefault();
    const nextSearch = searchTerm.trim();
    const params = new URLSearchParams();

    if (nextSearch) {
      params.set("search", nextSearch);
    }

    navigate(`/catalog${params.toString() ? `?${params.toString()}` : ""}`);
    setSearchOpen(false);
    if (closeDrawer) {
      closeMobileMenu();
    }
  };

  const selectSuggestion = (to, { closeDrawer = false } = {}) => {
    setSearchOpen(false);
    navigate(to);
    if (closeDrawer) {
      closeMobileMenu();
    }
  };

  const renderSuggestionIcon = (type) => {
    if (type === "shop") return <Store className="h-4 w-4" />;
    if (type === "category" || type === "brand") return <Tag className="h-4 w-4" />;
    return <ShoppingBag className="h-4 w-4" />;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/70 bg-[rgba(255,247,249,0.88)] backdrop-blur dark:border-slate-800 dark:bg-[rgba(17,31,53,0.82)]">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-500 p-2 text-white shadow-glow">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">Zipzo</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Essentials In Minutes</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {isAdmin ? (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          ) : null}
          {isSeller ? (
            <NavLink to="/seller" className={navLinkClass}>
              Seller
            </NavLink>
          ) : null}
          <NavLink to="/catalog" className={navLinkClass}>
            Catalog
          </NavLink>
          {!isSeller ? (
            <NavLink to="/shops" className={navLinkClass}>
              Shops
            </NavLink>
          ) : null}
        </nav>

        <div className="relative hidden max-w-xl flex-1 xl:block" ref={searchRef}>
          <form className="relative" onSubmit={submitSearch}>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input h-12 pl-11 pr-24"
              placeholder="Search products, brands, categories, or sellers"
              value={searchTerm}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setSearchOpen(true);
              }}
            />
            <button className="btn-primary absolute right-1.5 top-1.5 px-4 py-2.5 text-sm" type="submit">
              Search
            </button>
          </form>

          {searchOpen && searchTerm.trim() ? (
            <div className="absolute inset-x-0 top-[calc(100%+0.75rem)] z-50 rounded-[28px] border border-brand-100/80 bg-white p-3 shadow-[0_24px_80px_rgba(17,31,53,0.14)] dark:border-slate-800 dark:bg-slate-950">
              {suggestions.length ? (
                <div className="space-y-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-brand-50 dark:hover:bg-slate-900"
                      onClick={() => selectSuggestion(item.to)}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-900/40">
                        {renderSuggestionIcon(item.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                      </div>
                      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-500">
                        {item.meta}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-brand-50/50 px-4 py-6 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  No close matches yet. Press enter to search the full catalog.
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-secondary hidden px-3 py-3 md:inline-flex" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/cart" className="btn-secondary gap-2 px-4 py-3">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">{cartCount}</span>
          </Link>
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                className="btn-secondary gap-2 px-4 py-3"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <UserCircle2 className="h-4 w-4" />
                {firstName}
                <ChevronDown className={`h-4 w-4 transition ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 hover:bg-brand-50 dark:hover:bg-slate-800"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(isAdmin ? "/admin" : "/profile");
                    }}
                  >
                    <UserCircle2 className="h-4 w-4" />
                    {isAdmin ? "Open admin" : "Manage account"}
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-slate-800"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      navigate("/");
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/auth" className="btn-primary hidden gap-2 md:inline-flex">
              <UserCircle2 className="h-4 w-4" />
              Login
            </Link>
          )}
          <button
            className="btn-secondary px-3 py-3 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="md:hidden">
          <button
            className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] transition-opacity duration-200 ${
              mobileMenuVisible ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close menu overlay"
            onClick={closeMobileMenu}
          />
          <aside
            className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[86vw] max-w-sm flex-col overflow-y-auto border-r border-brand-100/70 bg-[rgb(var(--surface-soft))] px-5 pb-6 pt-5 shadow-[0_24px_80px_rgba(17,31,53,0.18)] transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-950 ${
              mobileMenuVisible ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="rounded-[28px] border border-brand-100/80 bg-white px-4 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
                  <div className="rounded-2xl bg-brand-500 p-2 text-white shadow-glow">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold">Zipzo</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Essentials In Minutes</p>
                  </div>
                </Link>
                <button className="btn-secondary px-3 py-3" onClick={closeMobileMenu} aria-label="Close menu">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              className="mt-6 flex w-full items-center gap-3 rounded-[24px] border border-brand-100 bg-white p-4 text-left shadow-sm transition hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              onClick={() => {
                closeMobileMenu();
                navigate(isAuthenticated ? (isAdmin ? "/admin" : "/profile") : "/auth");
              }}
            >
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-900/40">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{isAuthenticated ? firstName : "Guest"}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isAuthenticated ? "Open account settings" : "Login to unlock your account"}
                </p>
              </div>
            </button>

            <div className="mt-6" ref={searchRef}>
              <form className="relative" onSubmit={(event) => submitSearch(event, { closeDrawer: true })}>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="input bg-white pl-11 pr-24 dark:bg-slate-900"
                  placeholder="Search the marketplace"
                  value={searchTerm}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setSearchOpen(true);
                  }}
                />
                <button className="btn-primary absolute right-1.5 top-1.5 px-4 py-2 text-sm" type="submit">
                  Search
                </button>
              </form>

              {searchOpen && searchTerm.trim() ? (
                <div className="mt-3 rounded-[24px] border border-brand-100/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  {suggestions.length ? (
                    <div className="space-y-2">
                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-brand-50 dark:hover:bg-slate-800"
                          onClick={() => selectSuggestion(item.to, { closeDrawer: true })}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-900/40">
                            {renderSuggestionIcon(item.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">No close matches yet. Press search to browse the full catalog.</p>
                  )}
                </div>
              ) : null}
            </div>

            <nav className="mt-6 rounded-[28px] border border-brand-100/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-2">
              {mobileNavItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-brand-500 text-white shadow-[0_10px_24px_rgba(208,39,82,0.24)]"
                        : "text-slate-700 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
              </div>
            </nav>

            <div className="mt-6 rounded-[28px] border border-brand-100/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="grid grid-cols-2 gap-3">
              <button className="btn-secondary justify-center" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link to="/cart" className="btn-secondary justify-center" onClick={closeMobileMenu}>
                <ShoppingCart className="h-4 w-4" />
                {cartCount}
              </Link>
              </div>
            </div>

            <div className="mt-auto space-y-2 pt-8">
              {isAuthenticated ? (
                <button
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-slate-800"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}

    </header>
  );
};

export default Navbar;

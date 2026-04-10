import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, Home, LogOut, Menu, Moon, ShieldCheck, ShoppingBag, ShoppingCart, Store, Sun, Truck, UserCircle2, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-500 text-white shadow-[0_10px_24px_rgba(208,39,82,0.24)]"
      : "text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-200"
  }`;

const Navbar = ({ cartCount }) => {
  const { toggleTheme, theme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();
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

  const closeMobileMenu = () => {
    setMobileMenuVisible(false);
    window.setTimeout(() => setMobileMenuOpen(false), 220);
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

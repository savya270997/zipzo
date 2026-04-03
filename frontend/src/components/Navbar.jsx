import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, Home, LogOut, Menu, Moon, ShoppingBag, ShoppingCart, Store, Sun, Truck, UserCircle2, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-500 text-white shadow-[0_10px_24px_rgba(208,39,82,0.24)]"
      : "text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-200"
  }`;

const mobileNavItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/catalog", label: "Catalog", icon: ShoppingBag },
  { to: "/shops", label: "Shops", icon: Store }
];

const Navbar = ({ cartCount }) => {
  const { toggleTheme, theme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Account";

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
          <NavLink to="/catalog" className={navLinkClass}>
            Catalog
          </NavLink>
          <NavLink to="/shops" className={navLinkClass}>
            Shops
          </NavLink>
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
                      navigate("/profile");
                    }}
                  >
                    <UserCircle2 className="h-4 w-4" />
                    Manage account
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
            className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px]"
            aria-label="Close menu overlay"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-sm flex-col border-r border-brand-100/70 bg-[rgba(255,247,249,0.96)] px-5 pb-6 pt-5 shadow-2xl dark:border-slate-800 dark:bg-[rgba(17,31,53,0.96)]">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <div className="rounded-2xl bg-brand-500 p-2 text-white shadow-glow">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold">Zipzo</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Essentials In Minutes</p>
                </div>
              </Link>
              <button className="btn-secondary px-3 py-3" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-[24px] border border-brand-100/70 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-900/40">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{isAuthenticated ? firstName : "Guest"}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isAuthenticated ? "Manage your account and orders" : "Login to unlock your account"}
                </p>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {mobileNavItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
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
            </nav>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="btn-secondary justify-center" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link to="/cart" className="btn-secondary justify-center" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart className="h-4 w-4" />
                {cartCount}
              </Link>
            </div>

            <div className="mt-auto space-y-2 pt-8">
              <button
                className="btn-secondary w-full justify-start gap-3"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(isAuthenticated ? "/profile" : "/auth");
                }}
              >
                <UserCircle2 className="h-4 w-4" />
                {isAuthenticated ? "Manage account" : "Login"}
              </button>
              {isAuthenticated ? (
                <button
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-slate-800"
                  onClick={() => {
                    setMobileMenuOpen(false);
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

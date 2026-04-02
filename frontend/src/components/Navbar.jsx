import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Moon, ShoppingCart, Sun, Truck, UserCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-500 text-white"
      : "text-slate-600 hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300"
  }`;

const Navbar = ({ cartCount }) => {
  const { toggleTheme, theme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const firstName = user?.name?.trim()?.split(/\s+/)[0] || "Account";

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-amber-50/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
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
          <button className="btn-secondary px-3 py-3" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/cart" className="btn-secondary gap-2 px-4 py-3">
            <ShoppingCart className="h-4 w-4" />
            <span>{cartCount}</span>
          </Link>
          {isAuthenticated ? (
            <div className="relative">
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
            <Link to="/auth" className="btn-primary gap-2">
              <UserCircle2 className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

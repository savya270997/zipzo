import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, ShoppingCart, Sun, Truck, UserCircle2 } from "lucide-react";
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
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          ) : null}
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
            <button
              className="btn-secondary gap-2 px-4 py-3"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <UserCircle2 className="h-4 w-4" />
              Logout
            </button>
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

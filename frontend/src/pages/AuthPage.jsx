import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      fullName: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      label: "Home"
    },
    role: "customer"
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (mode === "signup" && form.password !== form.confirmPassword) {
      setError("Passwords must match");
      return;
    }

    try {
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              confirmPassword: form.confirmPassword,
              address: form.address,
              role: form.role
            };

      await login(payload, mode === "login" ? "login" : "signup");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to continue.");
    }
  };

  return (
    <div className="shell py-12">
      <div className="mx-auto max-w-md card p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">{mode === "login" ? "Welcome back" : "Join Zipzo"}</p>
        <h1 className="mt-3 font-display text-3xl font-bold">
          {mode === "login" ? "Login to continue" : "Create your account"}
        </h1>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          {mode === "signup" ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="input"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
                <select
                  className="input"
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                  required
                >
                  <option value="customer">Customer account</option>
                  <option value="seller">Seller account</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="input"
                  placeholder="Full address line"
                  value={form.address.line1}
                  onChange={(event) => setForm({ ...form, address: { ...form.address, line1: event.target.value } })}
                  required
                />
                <input
                  className="input"
                  placeholder="Apartment / Landmark (optional)"
                  value={form.address.line2}
                  onChange={(event) => setForm({ ...form, address: { ...form.address, line2: event.target.value } })}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  className="input"
                  placeholder="City"
                  value={form.address.city}
                  onChange={(event) => setForm({ ...form, address: { ...form.address, city: event.target.value } })}
                  required
                />
                <input
                  className="input"
                  placeholder="State"
                  value={form.address.state}
                  onChange={(event) => setForm({ ...form, address: { ...form.address, state: event.target.value } })}
                  required
                />
                <input
                  className="input"
                  placeholder="Postal code"
                  value={form.address.postalCode}
                  onChange={(event) => setForm({ ...form, address: { ...form.address, postalCode: event.target.value } })}
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="input"
                  placeholder="Contact person"
                  value={form.address.fullName}
                  onChange={(event) => setForm({ ...form, address: { ...form.address, fullName: event.target.value } })}
                  required
                />
                <input
                  className="input"
                  placeholder="Phone number"
                  value={form.address.phone}
                  onChange={(event) => setForm({ ...form, address: { ...form.address, phone: event.target.value } })}
                  required
                  pattern="^[0-9+()\\s-]{7,}$"
                  title="Enter a valid phone number"
                />
              </div>
            </>
          ) : null}
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
            minLength={8}
            title="8+ chars with upper, lower, number"
          />
          {mode === "signup" ? (
            <input
              className="input"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              required
            />
          ) : null}
          {error ? <p className="text-sm text-rose-500">{error}</p> : null}
          <button className="btn-primary w-full">{mode === "login" ? "Login" : "Sign up"}</button>
        </form>
        <button
          className="mt-4 text-sm text-brand-700 dark:text-brand-300"
          onClick={() => setMode((current) => (current === "login" ? "signup" : "login"))}
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;

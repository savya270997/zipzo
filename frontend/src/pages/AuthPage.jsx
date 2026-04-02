import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await login(form, mode === "login" ? "login" : "signup");
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
            <input
              className="input"
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
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
          />
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

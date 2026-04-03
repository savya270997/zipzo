import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Pencil, Plus, Send, Trash2 } from "lucide-react";
import api from "../api/client";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  brand: "",
  weight: "",
  price: "",
  mrp: "",
  stock: "",
  sku: "",
  shopName: "",
  tags: "",
  imagesText: ""
};

const statusTone = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  pending_approval: "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
  approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  rejected: "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
  archived: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
};

const SellerDashboardPage = () => {
  const [dashboard, setDashboard] = useState({ stats: null, products: [] });
  const [filters, setFilters] = useState({ categories: [] });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data: dashboardData }, { data: productData }] = await Promise.all([
        api.get("/seller/dashboard"),
        api.get("/products")
      ]);
      setDashboard(dashboardData);
      setFilters({ categories: productData.filters?.categories || [] });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load seller workspace.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const productCountLabel = useMemo(() => `${dashboard.products?.length || 0} listings`, [dashboard.products]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      weight: product.weight || "",
      price: product.price || "",
      mrp: product.mrp || "",
      stock: product.stock || "",
      sku: product.sku || "",
      shopName: product.shopName || "",
      tags: (product.tags || []).join(", "),
      imagesText: (product.images || [product.image].filter(Boolean)).join("\n")
    });
    setSuccess("");
    setError("");
  };

  const buildPayload = (approvalStatus) => ({
    ...form,
    price: Number(form.price),
    mrp: Number(form.mrp),
    stock: Number(form.stock),
    tags: form.tags,
    images: form.imagesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    approvalStatus
  });

  const saveProduct = async (approvalStatus = "draft") => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = buildPayload(approvalStatus);
      if (editingId) {
        await api.patch(`/seller/products/${editingId}`, payload);
      } else {
        await api.post("/seller/products", payload);
      }
      resetForm();
      setSuccess(approvalStatus === "pending_approval" ? "Product submitted for approval." : "Draft saved.");
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save seller product.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (productId) => {
    setError("");
    setSuccess("");
    try {
      await api.delete(`/seller/products/${productId}`);
      setSuccess("Product deleted.");
      if (editingId === productId) resetForm();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete seller product.");
    }
  };

  if (loading) {
    return <div className="shell py-20 text-center">Loading seller workspace...</div>;
  }

  return (
    <div className="shell space-y-8 py-8">
      <section className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Seller studio</p>
            <h1 className="section-title">Manage your listings and approval queue</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Create drafts, submit products for approval, update inventory, and keep your storefront ready for the future admin panel flow.
            </p>
          </div>
          <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
            {productCountLabel}
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Total listings", dashboard.stats?.total || 0],
            ["Drafts", dashboard.stats?.draft || 0],
            ["Pending approval", dashboard.stats?.pending_approval || 0],
            ["Approved", dashboard.stats?.approved || 0],
            ["Inventory value", `Rs ${Math.round(dashboard.stats?.inventoryValue || 0)}`]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-brand-100/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-500">{label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">My products</p>
              <h2 className="section-title">Seller listings</h2>
            </div>
            <button className="btn-secondary gap-2" onClick={resetForm}>
              <Plus className="h-4 w-4" />
              New listing
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {dashboard.products.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center text-sm text-slate-500">
                No seller products yet. Start by creating your first draft.
              </div>
            ) : (
              dashboard.products.map((product) => (
                <article key={product._id} className="rounded-[24px] border border-brand-100/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.22em] text-brand-500">{product.category}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{product.name}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {product.brand} • {product.weight} • Stock {product.stock}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[product.approvalStatus] || statusTone.draft}`}>
                      {product.approvalStatus?.replaceAll("_", " ")}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">Rs {product.price}</p>
                      <p className="text-xs text-slate-400 line-through">Rs {product.mrp}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary gap-2 px-4 py-2" onClick={() => startEdit(product)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button className="btn-secondary gap-2 px-4 py-2 text-rose-600" onClick={() => deleteProduct(product._id)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Product editor</p>
              <h2 className="section-title">{editingId ? "Update listing" : "Create seller product"}</h2>
            </div>
            {editingId ? (
              <button className="btn-secondary" onClick={resetForm}>
                Cancel edit
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input className="input" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {filters.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input className="input" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <input className="input" placeholder="Weight / unit" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            <input className="input" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="input" placeholder="MRP" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
            <input className="input" placeholder="Stock quantity" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <input className="input md:col-span-2" placeholder="Store / display name" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} />
            <input className="input md:col-span-2" placeholder="Tags, comma separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            <textarea
              className="input min-h-[132px] md:col-span-2"
              placeholder={"Image URLs, one per line\nhttps://...\nhttps://..."}
              value={form.imagesText}
              onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
            />
            <textarea
              className="input min-h-[132px] md:col-span-2"
              placeholder="Describe the product, highlights, specs, and why it should be approved."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="mt-4 rounded-[24px] border border-brand-100/80 bg-brand-50/50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-brand-700 dark:text-brand-200">
              <ImagePlus className="h-4 w-4" />
              Image handling
            </div>
            <p className="mt-2">
              Use direct image URLs for now. We can add actual file upload/storage in the next step without changing the seller workflow.
            </p>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-secondary gap-2" onClick={() => saveProduct("draft")} disabled={saving}>
              <Pencil className="h-4 w-4" />
              {saving ? "Saving..." : "Save draft"}
            </button>
            <button className="btn-primary gap-2" onClick={() => saveProduct("pending_approval")} disabled={saving}>
              <Send className="h-4 w-4" />
              Submit for approval
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SellerDashboardPage;

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ShieldAlert, ShieldCheck, Sparkles, Users, XCircle } from "lucide-react";
import api from "../api/client";
import ImageInitials from "../components/ImageInitials";

const statusTone = {
  all: "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300",
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  pending_approval: "bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
  approved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  rejected: "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
  archived: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
  suspended: "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200"
};

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending_approval", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" }
];

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState({ stats: null, products: [], sellers: [] });
  const [statusFilter, setStatusFilter] = useState("pending_approval");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [featureToggle, setFeatureToggle] = useState(false);
  const [sellerNotes, setSellerNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/dashboard");
      setDashboard(data);

      const defaultProduct =
        data.products.find((product) => product._id === selectedProductId) ||
        data.products.find((product) => product.approvalStatus === "pending_approval") ||
        data.products[0] ||
        null;
      const defaultSeller =
        data.sellers.find((seller) => seller._id === selectedSellerId) ||
        data.sellers[0] ||
        null;

      setSelectedProductId(defaultProduct?._id || null);
      setReviewNotes(defaultProduct?.approvalNotes || "");
      setFeatureToggle(Boolean(defaultProduct?.isFeatured));
      setSelectedSellerId(defaultSeller?._id || null);
      setSellerNotes(defaultSeller?.adminNotes || "");
      setSelectedProductIds((current) => current.filter((id) => data.products.some((product) => product._id === id)));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin moderation queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const filteredProducts = useMemo(() => {
    const products = dashboard.products || [];
    if (statusFilter === "all") return products;
    return products.filter((product) => product.approvalStatus === statusFilter);
  }, [dashboard.products, statusFilter]);

  const selectedProduct =
    dashboard.products.find((product) => product._id === selectedProductId) ||
    filteredProducts[0] ||
    null;

  const selectedSeller =
    dashboard.sellers.find((seller) => seller._id === selectedSellerId) ||
    dashboard.sellers[0] ||
    null;

  useEffect(() => {
    if (!selectedProduct) return;
    setSelectedProductId(selectedProduct._id);
    setReviewNotes(selectedProduct.approvalNotes || "");
    setFeatureToggle(Boolean(selectedProduct.isFeatured));
  }, [selectedProduct?._id]);

  useEffect(() => {
    if (!selectedSeller) return;
    setSelectedSellerId(selectedSeller._id);
    setSellerNotes(selectedSeller.adminNotes || "");
  }, [selectedSeller?._id]);

  const toggleSelection = (productId) => {
    setSelectedProductIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  const moderateProduct = async (approvalStatus) => {
    if (!selectedProduct) return;

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/admin/products/${selectedProduct._id}/review`, {
        approvalStatus,
        approvalNotes: reviewNotes,
        isFeatured: featureToggle
      });
      setSuccess(
        approvalStatus === "approved"
          ? "Product approved."
          : approvalStatus === "rejected"
            ? "Product rejected."
            : "Product updated."
      );
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update moderation status.");
    } finally {
      setSaving(false);
    }
  };

  const bulkModerate = async (approvalStatus) => {
    if (!selectedProductIds.length) return;

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await api.post("/admin/products/bulk-review", {
        productIds: selectedProductIds,
        approvalStatus,
        approvalNotes: reviewNotes,
        isFeatured: approvalStatus === "approved" ? featureToggle : undefined
      });
      setSuccess(data.message);
      setSelectedProductIds([]);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to complete bulk moderation.");
    } finally {
      setSaving(false);
    }
  };

  const updateSeller = async (accountStatus) => {
    if (!selectedSeller) return;

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.patch(`/admin/sellers/${selectedSeller._id}`, {
        accountStatus,
        adminNotes: sellerNotes
      });
      setSuccess(accountStatus === "suspended" ? "Seller suspended." : "Seller reactivated.");
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update seller status.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="shell py-20 text-center">Loading admin moderation workspace...</div>;
  }

  return (
    <div className="shell space-y-8 py-8">
      <section className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Admin studio</p>
            <h1 className="section-title">Review seller submissions and manage sellers</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Moderate seller products, run bulk actions, and suspend or reactivate sellers with admin notes.
            </p>
          </div>
          <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
            {dashboard.stats?.pending_approval || 0} pending review
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            ["Seller products", dashboard.stats?.total || 0],
            ["Pending", dashboard.stats?.pending_approval || 0],
            ["Approved", dashboard.stats?.approved || 0],
            ["Rejected", dashboard.stats?.rejected || 0],
            ["Sellers", dashboard.stats?.sellers || 0],
            ["Customers", dashboard.stats?.customers || 0]
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-brand-100/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-500">{label}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <section className="space-y-6">
          <div className="card p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-kicker">Moderation queue</p>
                <h2 className="section-title">Seller submissions</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      statusFilter === option.value ? "bg-brand-500 text-white shadow-sm" : `${statusTone[option.value]} border border-brand-100/80`
                    }`}
                    onClick={() => setStatusFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedProductIds.length ? (
              <div className="mt-4 rounded-[22px] border border-brand-100/80 bg-brand-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-sm font-semibold text-brand-700 dark:text-brand-200">
                  {selectedProductIds.length} product{selectedProductIds.length > 1 ? "s" : ""} selected
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-primary gap-2 px-4 py-2" disabled={saving} onClick={() => bulkModerate("approved")}>
                    <CheckCircle2 className="h-4 w-4" />
                    Bulk approve
                  </button>
                  <button className="btn-secondary gap-2 px-4 py-2 text-rose-600" disabled={saving} onClick={() => bulkModerate("rejected")}>
                    <XCircle className="h-4 w-4" />
                    Bulk reject
                  </button>
                  <button className="btn-secondary gap-2 px-4 py-2" disabled={saving} onClick={() => bulkModerate("archived")}>
                    <ShieldCheck className="h-4 w-4" />
                    Bulk archive
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              {filteredProducts.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center text-sm text-slate-500">
                  No products in this moderation bucket right now.
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`rounded-[24px] border p-4 transition ${
                      selectedProduct?._id === product._id
                        ? "border-brand-400 bg-brand-50/60 shadow-md dark:border-brand-500 dark:bg-slate-900"
                        : "border-brand-100/80 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selectedProductIds.includes(product._id)}
                        onChange={() => toggleSelection(product._id)}
                      />
                      <button className="flex min-w-0 flex-1 items-start gap-4 text-left" onClick={() => setSelectedProductId(product._id)}>
                        <div className="w-20 shrink-0">
                          <ImageInitials
                            src={(product.images || [product.image])[0]}
                            name={product.name}
                            className="h-20 w-full rounded-[18px] object-cover"
                            placeholderClass="h-20 w-full rounded-[18px] text-lg"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm uppercase tracking-[0.22em] text-brand-500">{product.category}</p>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[product.approvalStatus] || statusTone.draft}`}>
                              {product.approvalStatus.replaceAll("_", " ")}
                            </span>
                          </div>
                          <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{product.name}</h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {product.seller?.name || product.sellerName} • {product.shopName}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">Rs {product.price} • Stock {product.stock}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-brand-600" />
              <div>
                <p className="section-kicker">Seller management</p>
                <h2 className="section-title">Seller accounts</h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {(dashboard.sellers || []).map((seller) => (
                <button
                  key={seller._id}
                  className={`w-full rounded-[22px] border p-4 text-left transition ${
                    selectedSeller?._id === seller._id
                      ? "border-brand-400 bg-brand-50/60 shadow-md dark:border-brand-500 dark:bg-slate-900"
                      : "border-brand-100/80 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  }`}
                  onClick={() => {
                    setSelectedSellerId(seller._id);
                    setSellerNotes(seller.adminNotes || "");
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{seller.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{seller.email}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {seller.products.total} listings • {seller.products.pending_approval} pending • {seller.products.approved} approved
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone[seller.accountStatus] || statusTone.active}`}>
                      {seller.accountStatus}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="card p-6">
            {selectedProduct ? (
              <>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="section-kicker">Review detail</p>
                    <h2 className="section-title">{selectedProduct.name}</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Submitted by {selectedProduct.seller?.name || selectedProduct.sellerName} • {selectedProduct.seller?.email || "seller account"}
                    </p>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusTone[selectedProduct.approvalStatus] || statusTone.draft}`}>
                    {selectedProduct.approvalStatus.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {(selectedProduct.images || [selectedProduct.image]).slice(0, 3).map((image, index) => (
                    <ImageInitials
                      key={`${selectedProduct._id}-${index}`}
                      src={image}
                      name={selectedProduct.name}
                      className="h-40 w-full rounded-[22px] object-cover"
                      placeholderClass="h-40 w-full rounded-[22px] text-3xl"
                    />
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Category", selectedProduct.category],
                    ["Brand", selectedProduct.brand],
                    ["Price / MRP", `Rs ${selectedProduct.price} / Rs ${selectedProduct.mrp}`],
                    ["Stock", `${selectedProduct.stock}`]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[20px] border border-brand-100/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-[0.18em] text-brand-500">{label}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-brand-100/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-500">Description</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedProduct.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(selectedProduct.tags || []).map((tag) => (
                      <span key={tag} className="meta-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-brand-100/80 bg-brand-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 font-semibold text-brand-700 dark:text-brand-200">
                    <ShieldCheck className="h-4 w-4" />
                    Moderation notes
                  </div>
                  <textarea
                    className="input mt-4 min-h-[140px]"
                    placeholder="Add internal moderation notes or seller-facing rejection guidance."
                    value={reviewNotes}
                    onChange={(event) => setReviewNotes(event.target.value)}
                  />

                  <label className="mt-4 flex items-center gap-3 rounded-2xl border border-brand-100/80 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={featureToggle}
                      onChange={(event) => setFeatureToggle(event.target.checked)}
                    />
                    Mark this product as featured in the marketplace after approval
                  </label>
                </div>

                {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
                {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="btn-primary gap-2" disabled={saving} onClick={() => moderateProduct("approved")}>
                    <CheckCircle2 className="h-4 w-4" />
                    {saving ? "Saving..." : "Approve"}
                  </button>
                  <button className="btn-secondary gap-2 px-5 py-3 text-rose-600" disabled={saving} onClick={() => moderateProduct("rejected")}>
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button className="btn-secondary gap-2" disabled={saving} onClick={() => moderateProduct("archived")}>
                    <ShieldCheck className="h-4 w-4" />
                    Archive
                  </button>
                  <button className="btn-secondary gap-2" disabled={saving} onClick={() => moderateProduct("pending_approval")}>
                    <Sparkles className="h-4 w-4" />
                    Move back to pending
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-[24px] border border-dashed border-brand-200 bg-brand-50/40 p-10 text-center text-sm text-slate-500">
                Select a seller product to review.
              </div>
            )}
          </div>

          <div className="card p-6">
            {selectedSeller ? (
              <>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="section-kicker">Seller detail</p>
                    <h2 className="section-title">{selectedSeller.name}</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{selectedSeller.email}</p>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-sm font-semibold ${statusTone[selectedSeller.accountStatus] || statusTone.active}`}>
                    {selectedSeller.accountStatus}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Total listings", selectedSeller.products.total],
                    ["Pending", selectedSeller.products.pending_approval],
                    ["Approved", selectedSeller.products.approved],
                    ["Rejected", selectedSeller.products.rejected]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[20px] border border-brand-100/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-xs uppercase tracking-[0.18em] text-brand-500">{label}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-brand-100/80 bg-brand-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 font-semibold text-brand-700 dark:text-brand-200">
                    <ShieldAlert className="h-4 w-4" />
                    Seller admin notes
                  </div>
                  <textarea
                    className="input mt-4 min-h-[130px]"
                    placeholder="Leave internal notes about seller quality, trust, or support issues."
                    value={sellerNotes}
                    onChange={(event) => setSellerNotes(event.target.value)}
                  />
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="btn-primary gap-2" disabled={saving} onClick={() => updateSeller("active")}>
                    <ShieldCheck className="h-4 w-4" />
                    Activate seller
                  </button>
                  <button className="btn-secondary gap-2 px-5 py-3 text-rose-600" disabled={saving} onClick={() => updateSeller("suspended")}>
                    <ShieldAlert className="h-4 w-4" />
                    Suspend seller
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-[24px] border border-dashed border-brand-200 bg-brand-50/40 p-10 text-center text-sm text-slate-500">
                Select a seller to manage.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

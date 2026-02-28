import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { AdminSidebar } from "./AdminDashboard";

// ── Approval status config ────────────────────────────────────────────────────
const STATUS_CFG = {
  Pending:  { cls: "bg-amber-50 text-amber-700 border-amber-200",  dot: "bg-amber-400",  label: "Pending Review" },
  Approved: { cls: "bg-green-50 text-green-700 border-green-200",  dot: "bg-green-500",  label: "Approved"       },
  Rejected: { cls: "bg-red-50 text-red-700 border-red-200",        dot: "bg-red-400",    label: "Rejected"       },
};

function ApprovalBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
      {cfg.label}
    </span>
  );
}

// ── Detail drawer / expanded panel ───────────────────────────────────────────
function ProductDetail({ product, onApprove, onReject, acting }) {
  const pharmacy = product.userId;
  return (
    <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5">
      <div className="grid grid-cols-3 gap-6">

        {/* Product details */}
        <div className="col-span-2 space-y-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Product Details</p>
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-4xl overflow-hidden flex-shrink-0 shadow-sm">
              {product.productImageUrl
                ? <img src={product.productImageUrl} alt="" className="w-full h-full object-cover rounded-2xl"/>
                : "💊"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[16px] font-black text-gray-900 mb-1">{product.productName}</h3>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-3">{product.productDescription || "No description provided."}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-[12px] font-bold px-3 py-1 rounded-full">
                  💰 Rs. {product.productPrice?.toLocaleString()}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full border ${product.productTotalStockQuantity > 0 ? "bg-blue-50 border-blue-100 text-blue-700" : "bg-red-50 border-red-100 text-red-600"}`}>
                  📦 Stock: {product.productTotalStockQuantity} units
                </span>
                {product.createdAt && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-500 text-[12px] font-semibold px-3 py-1 rounded-full">
                    🕐 Submitted {new Date(product.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Approval action buttons */}
          {product.approvalStatus === "Pending" && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => onApprove(product._id)}
                disabled={acting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-[13px] font-bold hover:bg-green-400 transition disabled:opacity-50 shadow-sm shadow-green-500/20">
                {acting === product._id + "Approved"
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Approving…</>
                  : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Approve — Allow Selling</>}
              </button>
              <button
                onClick={() => onReject(product._id)}
                disabled={acting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-[13px] font-bold hover:bg-red-100 transition disabled:opacity-50">
                {acting === product._id + "Rejected"
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Rejecting…</>
                  : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>Reject — Block Selling</>}
              </button>
            </div>
          )}
          {product.approvalStatus === "Approved" && (
            <button
              onClick={() => onReject(product._id)}
              disabled={acting}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-[12px] font-bold hover:bg-red-100 transition disabled:opacity-50 w-fit">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
              Revoke Approval
            </button>
          )}
          {product.approvalStatus === "Rejected" && (
            <button
              onClick={() => onApprove(product._id)}
              disabled={acting}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-[12px] font-bold hover:bg-green-400 transition disabled:opacity-50 shadow-sm shadow-green-500/20 w-fit">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
              Re-Approve Product
            </button>
          )}
        </div>

        {/* Pharmacy details */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Seller / Pharmacy</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[14px] flex-shrink-0">
                {pharmacy?.name?.[0]?.toUpperCase() || "P"}
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-black text-gray-900 truncate">{pharmacy?.name || "Unknown Pharmacy"}</p>
                <p className="text-[11px] text-green-600 font-semibold">Pharmacy Seller</p>
              </div>
            </div>
            <div className="border-t border-gray-50 pt-3 space-y-2.5">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-[12px] text-gray-700 font-medium truncate">{pharmacy?.email || "—"}</p>
              </div>
              {pharmacy?.phone && (
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Phone</p>
                  <p className="text-[12px] text-gray-700 font-medium">{pharmacy.phone}</p>
                </div>
              )}
              {pharmacy?.address && (
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Address</p>
                  <p className="text-[12px] text-gray-700 font-medium">{pharmacy.address}</p>
                </div>
              )}
              {pharmacy?.licenseNumber && (
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">License No.</p>
                  <p className="text-[12px] text-gray-700 font-semibold font-mono">{pharmacy.licenseNumber}</p>
                </div>
              )}
              {pharmacy?.createdAt && (
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Member Since</p>
                  <p className="text-[12px] text-gray-600">{new Date(pharmacy.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              )}
            </div>
            {/* Selling permission badge */}
            <div className={`mt-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-bold ${product.approvalStatus === "Approved" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
              {product.approvalStatus === "Approved"
                ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Permitted to sell this product</>
                : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>Not permitted to sell yet</>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const navigate = useNavigate();
  const [admin, setAdmin]           = useState(null);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("Pending");   // default to Pending so admin sees what needs action
  const [search, setSearch]         = useState("");
  const [expanded, setExpanded]     = useState(null);
  const [acting, setActing]         = useState(null);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const role = (Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles || "").toLowerCase();
    if (!stored || role !== "admin") { navigate("/login", { replace: true }); return; }
    setAdmin(stored);
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/products");
      // Backend returns { products: [...] } or plain array
      const raw = res.data;
      setProducts(Array.isArray(raw) ? raw : Array.isArray(raw?.products) ? raw.products : []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (productId, approvalStatus) => {
    setActing(productId + approvalStatus);
    try {
      await api.put(`/admin/product/${productId}/approval`, { approvalStatus });
      setProducts(p => p.map(prod => prod._id === productId ? { ...prod, approvalStatus } : prod));
      showToast(
        approvalStatus === "Approved"
          ? "Product approved — pharmacy can now sell this item."
          : "Product rejected — pharmacy cannot sell this item.",
        approvalStatus === "Approved" ? "success" : "warn"
      );
      setExpanded(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed", "error");
    } finally {
      setActing(null);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Permanently delete this product?")) return;
    setActing(productId + "delete");
    try {
      await api.delete(`/admin/product/${productId}`);
      setProducts(p => p.filter(prod => prod._id !== productId));
      showToast("Product deleted.");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setActing(null);
    }
  };

  const logout = () => { localStorage.removeItem("user"); navigate("/login", { replace: true }); };

  const counts = {
    All:      products.length,
    Pending:  products.filter(p => p.approvalStatus === "Pending").length,
    Approved: products.filter(p => p.approvalStatus === "Approved").length,
    Rejected: products.filter(p => p.approvalStatus === "Rejected").length,
  };

  const filtered = products.filter(p => {
    const matchFilter = filter === "All" || p.approvalStatus === filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || p.productName?.toLowerCase().includes(q)
      || p.userId?.name?.toLowerCase().includes(q)
      || p.userId?.email?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold
          ${toast.type === "error" ? "bg-red-500" : toast.type === "warn" ? "bg-amber-500" : "bg-green-600"}`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
          {toast.msg}
        </div>
      )}

      <AdminSidebar active="products" navigate={navigate} onLogout={logout} admin={admin}/>

      <div className="pl-[220px]">
        <main className="px-8 py-7 min-h-screen">

          {/* Header */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight">Product Approvals</h1>
              <p className="text-gray-400 text-[13px] mt-0.5">Review pharmacy product submissions — approve to allow selling, reject to block</p>
            </div>
            <button onClick={fetchProducts}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2.5 rounded-xl font-bold text-[13px] hover:border-green-300 hover:text-green-700 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>

          {/* Pending alert */}
          {counts.Pending > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"/>
              <p className="text-[13px] font-semibold text-amber-800">
                <span className="font-black">{counts.Pending}</span> product{counts.Pending > 1 ? "s" : ""} waiting for your approval — pharmacies cannot sell until you review
              </p>
              <button onClick={() => setFilter("Pending")} className="ml-auto text-[11px] font-bold text-amber-700 underline underline-offset-2">
                Review now
              </button>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
            {[
              { key: "All",      label: "Total Products",    count: counts.All,      color: "text-gray-900",  bg: "bg-gray-50"    },
              { key: "Pending",  label: "Pending Review",    count: counts.Pending,  color: "text-amber-600", bg: "bg-amber-50"   },
              { key: "Approved", label: "Approved (Selling)",count: counts.Approved, color: "text-green-600", bg: "bg-green-50"   },
              { key: "Rejected", label: "Rejected (Blocked)",count: counts.Rejected, color: "text-red-600",   bg: "bg-red-50"     },
            ].map((s, i) => (
              <button key={s.key} onClick={() => setFilter(s.key)}
                className={`${s.bg} px-6 py-4 text-left transition-all ${i < 3 ? "border-r border-gray-100" : ""} ${filter === s.key ? "ring-2 ring-inset ring-green-400" : "hover:brightness-95"}`}>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
              </button>
            ))}
          </div>

          {/* Filter tabs + Search */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="flex gap-1.5">
              {["All", "Pending", "Approved", "Rejected"].map(key => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all flex items-center gap-1.5 ${filter === key ? "bg-gray-950 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                  {key}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>{counts[key]}</span>
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search product or pharmacy…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white shadow-sm transition"/>
            </div>
          </div>

          {/* Product list */}
          {loading ? (
            <div className="flex items-center justify-center py-28">
              <div className="w-9 h-9 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center">
              <div className="text-4xl mb-3">💊</div>
              <p className="text-[15px] font-bold text-gray-700">No products found</p>
              <p className="text-[13px] text-gray-400 mt-1">{search ? "Try clearing your search" : `No ${filter === "All" ? "" : filter.toLowerCase()} products`}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(product => {
                const pharmacy   = product.userId;
                const isExpanded = expanded === product._id;
                const isPending  = product.approvalStatus === "Pending";
                const cfg        = STATUS_CFG[product.approvalStatus] || STATUS_CFG.Pending;

                return (
                  <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Row */}
                    <div className="flex items-center gap-4 px-5 py-4">

                      {/* Status dot */}
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot} ${isPending ? "animate-pulse" : ""}`}/>

                      {/* Product image + name */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-xl flex-shrink-0 overflow-hidden">
                          {product.productImageUrl
                            ? <img src={product.productImageUrl} alt="" className="w-full h-full object-cover rounded-xl"/>
                            : "💊"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-black text-gray-900 truncate">{product.productName}</p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[200px]">{product.productDescription}</p>
                        </div>
                      </div>

                      {/* Pharmacy info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Pharmacy</p>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0">
                            {pharmacy?.name?.[0]?.toUpperCase() || "P"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-gray-800 truncate">{pharmacy?.name || "Unknown"}</p>
                            <p className="text-[11px] text-gray-400 truncate">{pharmacy?.email || ""}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price + Stock */}
                      <div className="flex-shrink-0 text-center">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Price</p>
                        <p className="text-[14px] font-black text-gray-900">Rs. {product.productPrice?.toLocaleString()}</p>
                      </div>
                      <div className="flex-shrink-0 text-center">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Stock</p>
                        <p className={`text-[14px] font-black ${product.productTotalStockQuantity === 0 ? "text-red-500" : "text-gray-700"}`}>{product.productTotalStockQuantity}</p>
                      </div>

                      {/* Selling permission badge */}
                      <div className="flex-shrink-0">
                        <ApprovalBadge status={product.approvalStatus}/>
                      </div>

                      {/* Quick action buttons (pending only in row) */}
                      {isPending && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={e => { e.stopPropagation(); handleApproval(product._id, "Approved"); }}
                            disabled={!!acting}
                            className="px-3 py-1.5 text-[11px] font-bold bg-green-500 text-white rounded-lg hover:bg-green-400 transition disabled:opacity-50 shadow-sm shadow-green-500/20">
                            {acting === product._id + "Approved" ? "…" : "✓ Approve"}
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleApproval(product._id, "Rejected"); }}
                            disabled={!!acting}
                            className="px-3 py-1.5 text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition disabled:opacity-50">
                            {acting === product._id + "Rejected" ? "…" : "✕ Reject"}
                          </button>
                        </div>
                      )}

                      {/* Delete */}
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(product._id); }}
                        disabled={!!acting}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>

                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : product._id)}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                        <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                    </div>

                    {/* Expanded detail panel */}
                    {isExpanded && (
                      <ProductDetail
                        product={product}
                        onApprove={id => handleApproval(id, "Approved")}
                        onReject={id => handleApproval(id, "Rejected")}
                        acting={acting}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <p className="text-[12px] text-gray-400 mt-4 px-1">{filtered.length} of {products.length} products shown</p>
          )}
        </main>
      </div>
    </div>
  );
}
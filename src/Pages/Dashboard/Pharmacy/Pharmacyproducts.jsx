import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const getRole = (stored) => {
  const raw = Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles;
  return (raw || "").toLowerCase().trim();
};

function Sidebar({ user, active, onLogout, navigate }) {
  const NAV = [
    { key: "dashboard", label: "Dashboard", path: "/pharmacy/dashboard", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { key: "orders", label: "Orders", path: "/pharmacy/orders", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    { key: "products", label: "Products", path: "/pharmacy/products", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { key: "profile", label: "Profile", path: "/pharmacy/profile", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];
  return (
    <aside className="w-[200px] min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 fixed left-0 top-0 bottom-0 z-20">
      <div className="px-5 py-[18px] border-b border-gray-100"><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0"><svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div><span className="font-black text-[14px] text-gray-900 tracking-tight leading-tight">HealthHaul</span></div></div>
      <div className="px-4 py-3.5 border-b border-gray-100"><p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p><div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">{user?.name?.[0]?.toUpperCase() || "P"}</div><div className="min-w-0"><p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Pharmacy"}</p><p className="text-[11px] text-green-600 font-semibold capitalize">Pharmacy</p></div></div></div>
      <nav className="flex-1 px-3 py-3 space-y-0.5">{NAV.map(({ key, label, path, icon }) => (<button key={key} onClick={() => navigate(path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${active === key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}><span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>{label}</button>))}</nav>
      <div className="px-3 pb-4 pt-1 border-t border-gray-100"><button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"><span className="opacity-60 flex-shrink-0"><svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></span>Sign Out</button></div>
    </aside>
  );
}

function ApprovalBadge({ status }) {
  const map = {
    Approved: { cls: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
    Pending: { cls: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400" },
    Rejected: { cls: "bg-red-100 text-red-600 border-red-200", dot: "bg-red-400" },
  };
  const s = map[status] || { cls: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function ProductModal({ product, onClose, onSuccess }) {
  const isEdit = !!product;
  const EMPTY = {
    productName: product?.productName || "",
    productDescription: product?.productDescription || "",
    productPrice: product?.productPrice || "",
    productImageUrl: product?.productImageUrl || "",
    productTotalStockQuantity: product?.productTotalStockQuantity || "",
  };
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => { setError(""); setForm(p => ({ ...p, [e.target.name]: e.target.value })); };
  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.productName || !form.productDescription || !form.productPrice || !form.productTotalStockQuantity) {
      setError("Name, description, price, and stock quantity are all required."); return;
    }
    setSaving(true);
    const payload = {
      productName: form.productName,
      productDescription: form.productDescription,
      productPrice: Number(form.productPrice),
      productImageUrl: form.productImageUrl || undefined,
      productTotalStockQuantity: Number(form.productTotalStockQuantity),
    };
    try {
      if (isEdit) {
        await api.put(`/products/product/update/${product._id}`, payload);
        onSuccess("Product updated! Awaiting re-approval from admin.");
      } else {
        await api.post("/products/create/product", payload);
        onSuccess("Product submitted! Awaiting admin approval.");
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-[15px] font-black text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{isEdit ? "Product will be sent for re-approval" : "Requires admin approval before going live"}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Product Name *</label>
            <input type="text" name="productName" value={form.productName} onChange={handleChange} placeholder="e.g. Paracetamol 500mg"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Price (Rs.) *</label>
              <input type="number" name="productPrice" value={form.productPrice} onChange={handleChange} placeholder="e.g. 150" min="0"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Stock Qty *</label>
              <input type="number" name="productTotalStockQuantity" value={form.productTotalStockQuantity} onChange={handleChange} placeholder="e.g. 100" min="0"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition" />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Image URL (optional)</label>
            <input type="text" name="productImageUrl" value={form.productImageUrl} onChange={handleChange} placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Description *</label>
            <textarea name="productDescription" value={form.productDescription} onChange={handleChange} rows={3} placeholder="Describe the medicine, its use, dosage info…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white resize-none transition" />
          </div>

          {/* Notice banner */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            <p className="text-[11px] text-amber-700 font-medium">
              {isEdit
                ? "Editing will reset status to <strong>Pending</strong> until admin re-approves."
                : "Product will be marked <strong>Pending</strong> until an admin approves it."}
            </p>
          </div>

          {error && <p className="text-[12px] font-semibold px-3.5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-gray-950 text-white py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 disabled:opacity-50 transition flex items-center justify-center gap-2">
              {saving
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
                : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ product, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/products/product/delete/${product._id}`);
      onSuccess("Product deleted.");
      onClose();
    } catch (err) {
      onSuccess(err.response?.data?.message || "Failed to delete product.", "error");
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </div>
          <h3 className="text-[16px] font-black text-gray-900 mb-1">Delete Product?</h3>
          <p className="text-[13px] text-gray-500 mb-5">"<span className="font-semibold text-gray-700">{product.productName}</span>" will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-[13px] hover:bg-red-600 disabled:opacity-50 transition flex items-center justify-center gap-2">
              {deleting
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Deleting…</>
                : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PharmacyProducts() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [filter, setFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || getRole(stored) !== "pharmacy") { navigate("/login", { replace: true }); return; }
    setUser(stored);
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Uses /my/products so ALL statuses (Pending, Approved, Rejected) are returned
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await api.get("/products/my/products");
      setProducts(r.data || []);
    } catch (_) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (_) { }
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleModalSuccess = (msg, type) => {
    showToast(msg, type);
    fetchProducts();
  };

  const FILTERS = ["all", "Pending", "Approved", "Rejected"];
  const filtered = filter === "all" ? products : products.filter(p => p.approvalStatus === filter);
  const counts = {
    all: products.length,
    Approved: products.filter(p => p.approvalStatus === "Approved").length,
    Pending: products.filter(p => p.approvalStatus === "Pending").length,
    Rejected: products.filter(p => p.approvalStatus === "Rejected").length,
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          {toast.msg}
        </div>
      )}

      {addModal && <ProductModal onClose={() => setAddModal(false)} onSuccess={handleModalSuccess} />}
      {editProduct && <ProductModal product={editProduct} onClose={() => setEditProduct(null)} onSuccess={handleModalSuccess} />}
      {deleteProduct && <DeleteModal product={deleteProduct} onClose={() => setDeleteProduct(null)} onSuccess={handleModalSuccess} />}

      <Sidebar user={user} active="products" onLogout={logout} navigate={navigate} />

      <div className="pl-[200px]">
        <main className="px-8 py-7 min-h-screen max-w-5xl">

          {/* Header */}
          <div className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">My Products</h1>
              <p className="text-gray-400 text-[13px] mt-0.5">Manage your medicine listings</p>
            </div>
            <button onClick={() => setAddModal(true)} className="flex items-center gap-2 bg-gray-950 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Product
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
            {[
              { label: "Total", count: counts.all, color: "text-gray-900", bg: "bg-gray-50" },
              { label: "Approved", count: counts.Approved, color: "text-green-600", bg: "bg-green-50" },
              { label: "Pending", count: counts.Pending, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Rejected", count: counts.Rejected, color: "text-red-600", bg: "bg-red-50" },
            ].map((s, i) => (
              <div key={s.label} className={`${s.bg} px-6 py-4 ${i < 3 ? "border-r border-gray-100" : ""}`}>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
              </div>
            ))}
          </div>

          {/* Rejected notice */}
          {counts.Rejected > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0" />
              <p className="text-[13px] font-semibold text-red-800">
                <span className="font-black">{counts.Rejected}</span> product{counts.Rejected > 1 ? "s were" : " was"} rejected by admin. Edit and resubmit to request re-approval.
              </p>
              <button onClick={() => setFilter("Rejected")} className="ml-auto text-[11px] font-bold text-red-700 underline underline-offset-2">View rejected</button>
            </div>
          )}

          {/* Pending notice */}
          {counts.Pending > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 mb-5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <p className="text-[13px] font-semibold text-amber-800">
                <span className="font-black">{counts.Pending}</span> product{counts.Pending > 1 ? "s are" : " is"} awaiting admin approval before going live.
              </p>
              <button onClick={() => setFilter("Pending")} className="ml-auto text-[11px] font-bold text-amber-700 underline underline-offset-2">View pending</button>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-1.5 mb-4">
            {FILTERS.map(key => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all flex items-center gap-1.5 ${filter === key ? "bg-gray-950 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                {key === "all" ? "All" : key}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>{counts[key]}</span>
              </button>
            ))}
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
                  <div className="w-full h-32 bg-gray-100 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-[15px] font-bold text-gray-700 mb-1">No products found</h3>
              <p className="text-[13px] text-gray-400 mb-5">
                {filter === "all" ? "You haven't added any products yet." : `No ${filter} products.`}
              </p>
              {filter === "all" && (
                <button onClick={() => setAddModal(true)} className="inline-flex items-center gap-2 bg-gray-950 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(product => (
                <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative w-full h-36 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden">
                    {product.productImageUrl
                      ? <img src={product.productImageUrl} alt={product.productName} className="w-full h-full object-cover" />
                      : <span className="text-4xl">💊</span>}
                    <div className="absolute top-3 right-3"><ApprovalBadge status={product.approvalStatus} /></div>
                    {/* Rejected overlay hint */}
                    {product.approvalStatus === "Rejected" && (
                      <div className="absolute inset-0 bg-red-900/10 flex items-end pb-3 justify-center">
                        <span className="text-[10px] font-bold text-red-700 bg-white/90 px-2.5 py-1 rounded-full">Edit to resubmit</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14px] font-black text-gray-900 truncate mb-1">{product.productName}</h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mb-3 leading-relaxed">{product.productDescription}</p>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[15px] font-black text-green-600">Rs. {product.productPrice?.toLocaleString()}</p>
                      <p className="text-[11px] text-gray-500 font-medium bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        Stock: <span className={`font-bold ${product.productTotalStockQuantity === 0 ? "text-red-500" : "text-gray-700"}`}>{product.productTotalStockQuantity}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditProduct(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 py-2 rounded-xl font-bold text-[12px] hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        {product.approvalStatus === "Rejected" ? "Edit & Resubmit" : "Edit"}
                      </button>
                      <button onClick={() => setDeleteProduct(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-red-100 text-red-500 py-2 rounded-xl font-bold text-[12px] hover:bg-red-50 hover:border-red-200 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
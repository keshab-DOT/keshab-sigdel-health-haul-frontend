import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

const getRole = (stored) => {
  const raw = Array.isArray(stored?.roles) ? stored.roles[0] : stored?.roles;
  return (raw || "").toLowerCase().trim();
};

const TYPE_META_N = {
  ORDER_PLACED:            { icon: "📦", color: "bg-blue-50  text-blue-600"  },
  ORDER_STATUS:            { icon: "🚚", color: "bg-green-50 text-green-600" },
  PRODUCT_APPROVED:        { icon: "✅", color: "bg-green-50 text-green-600" },
  PRODUCT_REJECTED:        { icon: "❌", color: "bg-red-50   text-red-600"   },
  PAYMENT_RECEIVED:        { icon: "💰", color: "bg-amber-50 text-amber-600" },
  PRODUCT_APPROVAL_NEEDED: { icon: "🆕", color: "bg-amber-50 text-amber-600" },
};
const notifMetaN = (type) => TYPE_META_N[type] || { icon: "🔔", color: "bg-gray-50 text-gray-600" };
function timeAgoN(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationBell({ userId }) {
  const [open,    setOpen]    = useState(false);
  const [notifs,  setNotifs]  = useState([]);
  const [unread,  setUnread]  = useState(0);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const socketRef   = useRef(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifs(data.notifications || []);
      setUnread(data.unreadCount   || 0);
    } catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  useEffect(() => {
    if (!userId) return;
    const socket = io("https://keshab-sigdel-health-haul-backend-production.up.railway.app", { query: { userId }, withCredentials: true });
    socketRef.current = socket;
    socket.emit("joinUserRoom", userId);
    socket.on("newNotification", (n) => {
      setNotifs(prev => prev.some(x => x._id === n._id) ? prev : [n, ...prev]);
      setUnread(prev => prev + 1);
    });
    return () => { socket.emit("leaveUserRoom", userId); socket.disconnect(); };
  }, [userId]);

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch { }
  };

  const markAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.put("/notifications/read-all");
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch { }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-gray-500 hover:bg-gray-50 hover:text-gray-800`}>
        <span className="flex-shrink-0 opacity-50 relative">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-[2px] leading-none">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </span>
        <span>Notifications</span>
        {unread > 0 && <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread}</span>}
      </button>

      {open && (
        <div className="absolute left-full top-0 ml-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-black text-gray-900">Notifications</p>
              {unread > 0 && <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread} new</span>}
            </div>
            {unread > 0 && <button onClick={markAllRead} className="text-[11px] font-bold text-green-600 hover:text-green-700">Mark all read</button>}
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"/></div>
            ) : notifs.length === 0 ? (
              <div className="py-12 text-center"><div className="text-3xl mb-2">🔔</div><p className="text-[13px] font-bold text-gray-600">No notifications yet</p></div>
            ) : notifs.slice(0, 20).map(n => {
              const m = notifMetaN(n.type);
              return (
                <button key={n._id}
                  onClick={() => { if (!n.isRead) markRead(n._id); setOpen(false); }}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-green-50/40" : ""}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${m.color}`}>{m.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] leading-snug ${n.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold"}`}>{n.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-300 mt-1">{timeAgoN(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5"/>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Sidebar({ user, active, onLogout, navigate }) {
  const NAV = [
    { key: "dashboard", label: "Dashboard", path: "/pharmacy/dashboard", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { key: "orders",    label: "Orders",    path: "/pharmacy/orders",    icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
    { key: "products",  label: "Products",  path: "/pharmacy/products",  icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg> },
    { key: "reviews",   label: "Reviews",   path: "/pharmacy/reviews",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg> },
    { key: "chat",      label: "Messages",  path: "/pharmacy/chat",      icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 12h.01M12 12h.01M16 12h.01M21 3H3a2 2 0 00-2 2v13a2 2 0 002 2h5l3 3 3-3h7a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg> },
    { key: "profile",   label: "Profile",   path: "/pharmacy/profile",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  ];

  return (
    <aside className="w-[200px] min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 fixed left-0 top-0 bottom-0 z-20">
      <div className="px-5 py-[18px] border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <span className="font-black text-[14px] text-gray-900 tracking-tight leading-tight">HealthHaul</span>
        </div>
      </div>
      <div className="px-4 py-3.5 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">Logged in as</p>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] flex-shrink-0">{user?.name?.[0]?.toUpperCase() || "P"}</div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-800 truncate leading-tight">{user?.name || "Pharmacy"}</p>
            <p className="text-[11px] text-green-600 font-semibold capitalize">Pharmacy</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${active === key ? "bg-gray-950 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}>
            <span className={`flex-shrink-0 ${active === key ? "opacity-100" : "opacity-50"}`}>{icon}</span>
            {label}
          </button>
        ))}
        {/* Notification bell sits in nav, not in footer */}
        <NotificationBell userId={user?._id} />
      </nav>

      <div className="px-3 pb-4 pt-1 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <span className="opacity-60 flex-shrink-0"><svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function ApprovalBadge({ status }) {
  const map = {
    Approved: { cls: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
    Pending:  { cls: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400" },
    Rejected: { cls: "bg-red-100   text-red-600   border-red-200",   dot: "bg-red-400"   },
  };
  const s = map[status] || { cls: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{status}
    </span>
  );
}

function ProductModal({ product, onClose, onSuccess }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    productName:               product?.productName               || "",
    productDescription:        product?.productDescription        || "",
    productPrice:              product?.productPrice              || "",
    productTotalStockQuantity: product?.productTotalStockQuantity || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(
    product?.productImageUrl
      ? product.productImageUrl.startsWith("http")
        ? product.productImageUrl
        : `https://keshab-sigdel-health-haul-backend-production.up.railway.app/uploads/${product.productImageUrl}`
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const handleChange = (e) => { setError(""); setForm(p => ({ ...p, [e.target.name]: e.target.value })); };
  const handleImage  = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.productName || !form.productDescription || !form.productPrice || !form.productTotalStockQuantity) {
      setError("Name, description, price and stock quantity are required.");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("productName",               form.productName);
    fd.append("productDescription",        form.productDescription);
    fd.append("productPrice",              Number(form.productPrice));
    fd.append("productTotalStockQuantity", Number(form.productTotalStockQuantity));
    if (imageFile) fd.append("image", imageFile);

    try {
      if (isEdit) {
        await api.put(`/products/product/update/${product._id}`, fd);
        onSuccess("Product updated! Awaiting re-approval from admin.");
      } else {
        await api.post("/products/create/product", fd);
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
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-[15px] font-black text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{isEdit ? "Product will be sent for re-approval" : "Requires admin approval before going live"}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Product Name *</label>
            <input type="text" name="productName" value={form.productName} onChange={handleChange}
              placeholder="e.g. Paracetamol 500mg"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Price (Rs.) *</label>
              <input type="number" name="productPrice" value={form.productPrice} onChange={handleChange}
                placeholder="e.g. 150" min="0"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition"/>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Stock Qty *</label>
              <input type="number" name="productTotalStockQuantity" value={form.productTotalStockQuantity} onChange={handleChange}
                placeholder="e.g. 100" min="0"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white transition"/>
            </div>
          </div>

          {/* Image upload — fixed size preview */}
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Product Image (optional)</label>
            <div className="flex items-start gap-3">
              {preview ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = "none"; }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl border border-dashed border-gray-200 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
              )}
              <label className="flex-1 flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-gray-200 rounded-xl px-3.5 py-4 cursor-pointer hover:border-green-400 hover:bg-green-50 transition text-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span className="text-[12px] text-gray-400 font-medium">{imageFile ? imageFile.name : "Click to upload"}</span>
                <span className="text-[10px] text-gray-300">PNG, JPG, WEBP up to 5MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImage}/>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Description *</label>
            <textarea name="productDescription" value={form.productDescription} onChange={handleChange}
              rows={3} placeholder="Describe the medicine, its use, dosage info…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 bg-white resize-none transition"/>
          </div>

          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            <p className="text-[11px] text-amber-700 font-medium">
              {isEdit ? "Editing will reset status to Pending until admin re-approves." : "Product will be marked Pending until an admin approves it."}
            </p>
          </div>

          {error && <p className="text-[12px] font-semibold px-3.5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-gray-950 text-white py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 disabled:opacity-50 transition flex items-center justify-center gap-2">
              {saving
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</>
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
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </div>
          <h3 className="text-[16px] font-black text-gray-900 mb-1">Delete Product?</h3>
          <p className="text-[13px] text-gray-500 mb-5">"<span className="font-semibold text-gray-700">{product.productName}</span>" will be permanently removed.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-50 transition">Cancel</button>
            <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-[13px] hover:bg-red-600 disabled:opacity-50 transition flex items-center justify-center gap-2">
              {deleting
                ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Deleting…</>
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
  const [user,          setUser]          = useState(null);
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [toast,         setToast]         = useState(null);
  const [addModal,      setAddModal]      = useState(false);
  const [editProduct,   setEditProduct]   = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [filter,        setFilter]        = useState("all");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored || getRole(stored) !== "pharmacy") { navigate("/login", { replace: true }); return; }
    setUser(stored);
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r    = await api.get("/products/my/products");
      const data = r.data;
      setProducts(Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : []);
    } catch (_) { setProducts([]); }
    finally { setLoading(false); }
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleModalSuccess = (msg, type) => { showToast(msg, type); fetchProducts(); };
  const FILTERS = ["all", "Pending", "Approved", "Rejected"];
  const filtered = products.filter(p => filter === "all" || p.approvalStatus === filter);
  const counts = {
    all:      products.length,
    Approved: products.filter(p => p.approvalStatus === "Approved").length,
    Pending:  products.filter(p => p.approvalStatus === "Pending").length,
    Rejected: products.filter(p => p.approvalStatus === "Rejected").length,
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-bold ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
          {toast.msg}
        </div>
      )}

      {addModal      && <ProductModal onClose={() => setAddModal(false)} onSuccess={handleModalSuccess}/>}
      {editProduct   && <ProductModal product={editProduct} onClose={() => setEditProduct(null)} onSuccess={handleModalSuccess}/>}
      {deleteProduct && <DeleteModal  product={deleteProduct} onClose={() => setDeleteProduct(null)} onSuccess={handleModalSuccess}/>}

      <Sidebar user={user} active="products" onLogout={logout} navigate={navigate}/>

      <div className="pl-[200px]">
        <main className="px-8 py-7 min-h-screen max-w-5xl">

          <div className="mb-7 flex items-start justify-between">
            <div>
              <h1 className="text-[26px] font-black text-gray-900 tracking-tight leading-tight">My Products</h1>
              <p className="text-gray-400 text-[13px] mt-0.5">Manage your medicine listings</p>
            </div>
            <button onClick={() => setAddModal(true)} className="flex items-center gap-2 bg-gray-950 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-4 gap-0 bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
            {[
              { label: "Total",    count: counts.all,      color: "text-gray-900",  bg: "bg-gray-50"  },
              { label: "Approved", count: counts.Approved, color: "text-green-600", bg: "bg-green-50" },
              { label: "Pending",  count: counts.Pending,  color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Rejected", count: counts.Rejected, color: "text-red-600",   bg: "bg-red-50"   },
            ].map((s, i) => (
              <div key={s.label} className={`${s.bg} px-6 py-4 ${i < 3 ? "border-r border-gray-100" : ""}`}>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
              </div>
            ))}
          </div>

          {counts.Rejected > 0 && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0"/>
              <p className="text-[13px] font-semibold text-red-800"><span className="font-black">{counts.Rejected}</span> product{counts.Rejected > 1 ? "s were" : " was"} rejected. Edit and resubmit.</p>
              <button onClick={() => setFilter("Rejected")} className="ml-auto text-[11px] font-bold text-red-700 underline underline-offset-2">View</button>
            </div>
          )}
          {counts.Pending > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"/>
              <p className="text-[13px] font-semibold text-amber-800"><span className="font-black">{counts.Pending}</span> product{counts.Pending > 1 ? "s are" : " is"} awaiting admin approval.</p>
              <button onClick={() => setFilter("Pending")} className="ml-auto text-[11px] font-bold text-amber-700 underline underline-offset-2">View</button>
            </div>
          )}

          <div className="flex gap-1.5 mb-5">
            {FILTERS.map(key => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all flex items-center gap-1.5 ${filter === key ? "bg-gray-950 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                {key === "all" ? "All" : key}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>{counts[key]}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
                  <div className="w-full h-32 bg-gray-100 rounded-xl mb-4"/>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"/>
                  <div className="h-3 bg-gray-100 rounded w-1/2"/>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-[15px] font-bold text-gray-700 mb-1">No products found</h3>
              <p className="text-[13px] text-gray-400 mb-5">{filter === "all" ? "You haven't added any products yet." : "No products match the selected filter."}</p>
              {filter === "all" && (
                <button onClick={() => setAddModal(true)} className="inline-flex items-center gap-2 bg-gray-950 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(product => {
                const imgSrc = product.productImageUrl
                  ? product.productImageUrl.startsWith("http") ? product.productImageUrl : `https://keshab-sigdel-health-haul-backend-production.up.railway.app/uploads/${product.productImageUrl}`
                  : null;
                return (
                  <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative w-full h-36 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden">
                      {imgSrc
                        ? <img src={imgSrc} alt={product.productName} className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }}/>
                        : <span className="text-4xl">💊</span>}
                      <div className="absolute top-3 right-3"><ApprovalBadge status={product.approvalStatus}/></div>
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
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          {product.approvalStatus === "Rejected" ? "Edit & Resubmit" : "Edit"}
                        </button>
                        <button onClick={() => setDeleteProduct(product)}
                          className="flex-1 flex items-center justify-center gap-1.5 border border-red-100 text-red-500 py-2 rounded-xl font-bold text-[12px] hover:bg-red-50 hover:border-red-200 transition">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
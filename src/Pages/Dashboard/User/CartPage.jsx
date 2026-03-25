import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

// Image URL helper 
function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `http://localhost:3000/uploads/${url}`;
}

const TYPE_META_N = { ORDER_PLACED: { icon: "📦", color: "bg-blue-50 text-blue-600" }, ORDER_STATUS: { icon: "🚚", color: "bg-green-50 text-green-600" }, PAYMENT_SUCCESS: { icon: "💰", color: "bg-amber-50 text-amber-600" } };
const notifMetaN = (type) => TYPE_META_N[type] || { icon: "🔔", color: "bg-gray-50 text-gray-600" };
function timeAgoN(date) { const diff = Math.floor((Date.now() - new Date(date)) / 1000); if (diff < 60) return "just now"; if (diff < 3600) return `${Math.floor(diff / 60)}m ago`; if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; return `${Math.floor(diff / 86400)}d ago`; }
function NotificationBell({ userId }) { const [open, setOpen] = useState(false); const [notifs, setNotifs] = useState([]); const [unread, setUnread] = useState(0); const [loading, setLoading] = useState(true); const dropdownRef = useRef(null); const socketRef = useRef(null); const fetchNotifs = useCallback(async () => { try { const { data } = await api.get("/notifications"); setNotifs(data.notifications || []); setUnread(data.unreadCount || 0); } catch { } finally { setLoading(false); }; }, []); useEffect(() => { fetchNotifs(); }, [fetchNotifs]); useEffect(() => { if (!userId) return; const socket = io("http://localhost:3000", { query: { userId }, withCredentials: true }); socketRef.current = socket; socket.emit("joinUserRoom", userId); socket.on("newNotification", (n) => { setNotifs(prev => prev.some(x => x._id === n._id) ? prev : [n, ...prev]); setUnread(prev => prev + 1); }); return () => { socket.emit("leaveUserRoom", userId); socket.disconnect(); }; }, [userId]); useEffect(() => { const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []); const markRead = async (id) => { try { await api.put(`/notifications/${id}/read`); setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n)); setUnread(prev => Math.max(0, prev - 1)); } catch { } }; const markAllRead = async (e) => { e.stopPropagation(); try { await api.put("/notifications/read-all"); setNotifs(prev => prev.map(n => ({ ...n, isRead: true }))); setUnread(0); } catch { } }; return (<div className="relative flex-shrink-0" ref={dropdownRef}><button onClick={() => setOpen(o => !o)} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition" title="Notifications"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>{unread > 0 && <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-[3px] leading-none">{unread > 9 ? "9+" : unread}</span>}</button>{open && (<div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"><div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between"><div className="flex items-center gap-2"><p className="text-[14px] font-black text-gray-900">Notifications</p>{unread > 0 && <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread} new</span>}</div>{unread > 0 && <button onClick={markAllRead} className="text-[11px] font-bold text-green-600 hover:text-green-700">Mark all read</button>}</div><div className="max-h-[380px] overflow-y-auto">{loading ? (<div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>) : notifs.length === 0 ? (<div className="py-12 text-center"><div className="text-3xl mb-2">🔔</div><p className="text-[13px] font-bold text-gray-600">No notifications yet</p></div>) : notifs.slice(0, 20).map(n => { const m = notifMetaN(n.type); return (<button key={n._id} onClick={() => { if (!n.isRead) markRead(n._id); setOpen(false); }} className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-green-50/40" : ""}`}><div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${m.color}`}>{m.icon}</div><div className="flex-1 min-w-0"><p className={`text-[12px] leading-snug ${n.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold"}`}>{n.title}</p><p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p><p className="text-[10px] text-gray-300 mt-1">{timeAgoN(n.createdAt)}</p></div>{!n.isRead && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />}</button>); })}</div></div>)}</div>); }

function Topbar({ user, cartCount, onLogout, navigate }) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-[56px]">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/user/dashboard")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <span className="font-black text-[15px] text-gray-900 tracking-tight">HealthHaul</span>
      </div>
      <nav className="flex items-center gap-1 ml-6">
        <button onClick={() => navigate("/user/dashboard")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Dashboard</button>
        <button onClick={() => navigate("/user/search")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Browse Medicines</button>
        <button onClick={() => navigate("/user/orders")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">My Orders</button>
        <button onClick={() => navigate("/user/chat")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Chat</button>
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          {cartCount > 0 && <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>}
        </button>
        <button onClick={() => navigate("/user/settings")} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
        <NotificationBell userId={user?._id} />
        <button onClick={() => navigate("/user/profile")} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 hover:border-green-300 transition">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px]">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="text-left"><p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name?.split(" ")[0] || "User"}</p><p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.roles?.[0] || "Customer"}</p></div>
        </button>
        <button onClick={onLogout} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Sign Out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </header>
  );
}

function Footer({ navigate }) {
  const quickLinks = [{ label: "Search Medicines", path: "/user/search" }, { label: "My Orders", path: "/user/orders" }, { label: "My Cart", path: "/user/cart" }, { label: "Profile", path: "/user/profile" }];
  const supportLinks = [{ label: "Help Center", path: "/user/support" }, { label: "Contact Us", path: "/user/support" }];
  return (
    <footer className="bg-gray-950 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">Fast, reliable medicine delivery across Nepal.</p>
          </div>
          <div><h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Quick Links</h5><ul className="space-y-1.5 text-gray-400 text-[13px]">{quickLinks.map(({ label, path }) => (<li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>))}</ul></div>
          <div><h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Support</h5><ul className="space-y-1.5 text-gray-400 text-[13px]">{supportLinks.map(({ label, path }) => (<li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>))}</ul></div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

const PAYMENT_METHODS = [
  {
    val: "cod",
    label: "Cash on Delivery",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  },
  {
    val: "khalti",
    label: "Khalti",
    icon: <span className="text-[15px]">💳</span>,
  },
];

export default function CartPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    shippingAddress: "",
    phoneNumber: "",
    paymentMethod: "cod",
  });
  const [phoneError, setPhoneError] = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    api.get("/cart/getcart")
      .then(r => setCartItems(r.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    setUpdating(p => ({ ...p, [id]: true }));
    try {
      await api.put(`/cart/update/cartitem/${id}`, { quantity: qty });
      setCartItems(p => p.map(item => item._id === id ? { ...item, quantity: qty } : item));
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setUpdating(p => ({ ...p, [id]: false }));
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/remove/cartitem/${id}`);
      setCartItems(p => p.filter(i => i._id !== id));
      showToast("Item removed");
    } catch { showToast("Failed to remove item", "error"); }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear/cart");
      setCartItems([]);
      showToast("Cart cleared");
    } catch { showToast("Failed to clear cart", "error"); }
  };

  // ── Phone validation — exactly 10 digits ────────────────────────────────────
  const validatePhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) return "Phone number must be exactly 10 digits";
    return "";
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    // Only allow digits, max 10
    if (/^\d{0,10}$/.test(val)) {
      setCheckoutForm(p => ({ ...p, phoneNumber: val }));
      setPhoneError(val.length > 0 && val.length < 10 ? "Phone number must be 10 digits" : "");
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!checkoutForm.shippingAddress.trim()) {
      showToast("Please enter your shipping address", "error"); return;
    }

    // Validate phone
    const phoneErr = validatePhone(checkoutForm.phoneNumber);
    if (phoneErr) { setPhoneError(phoneErr); showToast(phoneErr, "error"); return; }

    setCheckoutLoading(true);
    try {
      // Create the order
      const { data: orderData } = await api.post("/orders/checkout/cart", checkoutForm);

      if (checkoutForm.paymentMethod === "khalti") {
        const orderId = orderData?.order?._id;
        if (!orderId) throw new Error("Order ID missing from response");

        // Initiate Khalti and redirect — order stays pending until verified
        const { data: khaltiData } = await api.post("/payment/khalti/initiate", { orderId });
        window.location.href = khaltiData.payment_url;
        return;
      }

      // COD — success
      setCartItems([]);
      setShowCheckout(false);
      showToast("Order placed successfully! 🎉");
      setTimeout(() => navigate("/user/orders"), 1500);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Checkout failed", "error");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) { }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const total = cartItems.reduce((s, i) => s + (i.productId?.productPrice || 0) * i.quantity, 0);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading your cart…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-[15px] font-black text-gray-900">Complete Your Order</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Fill in your delivery details</p>
              </div>
              <button onClick={() => setShowCheckout(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              {/* Shipping Address */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Shipping Address</label>
                <textarea rows={3} placeholder="Enter your full delivery address"
                  value={checkoutForm.shippingAddress}
                  onChange={e => setCheckoutForm(p => ({ ...p, shippingAddress: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-400 resize-none bg-gray-50/50 transition"
                  required />
              </div>

              {/* Phone — 10 digits only */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Phone Number <span className="text-[11px] text-gray-400 font-normal">(10 digits)</span></label>
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={checkoutForm.phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-green-400/40 bg-gray-50/50 transition ${phoneError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-green-400"}`}
                  required />
                {phoneError && <p className="text-[11px] text-red-500 mt-1 font-medium">{phoneError}</p>}
                {!phoneError && checkoutForm.phoneNumber.length === 10 && (
                  <p className="text-[11px] text-green-600 mt-1 font-medium">✓ Valid phone number</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(({ val, label, icon }) => (
                    <button key={val} type="button"
                      onClick={() => setCheckoutForm(p => ({ ...p, paymentMethod: val }))}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-[11px] font-bold transition-all ${checkoutForm.paymentMethod === val
                        ? val === "khalti" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-800 bg-gray-900 text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                      {icon}{label}
                    </button>
                  ))}
                </div>

                {checkoutForm.paymentMethod === "khalti" && (
                  <div className="mt-2 flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3.5 py-2.5">
                    <span className="text-purple-500 mt-0.5 flex-shrink-0">💜</span>
                    <p className="text-[11px] text-purple-700 leading-relaxed">
                      You'll be redirected to Khalti. <strong>Your order will be cancelled if payment is not completed.</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-3.5 flex justify-between items-center">
                <span className="text-gray-700 font-semibold text-[13px]">Total Amount</span>
                <span className="text-xl font-black text-green-600">Rs. {total.toLocaleString()}</span>
              </div>

              {/* Submit */}
              <button type="submit" disabled={checkoutLoading || checkoutForm.phoneNumber.length !== 10}
                className={`w-full py-3 rounded-xl font-black disabled:opacity-50 transition text-[13px] text-white flex items-center justify-center gap-2 ${checkoutForm.paymentMethod === "khalti" ? "bg-[#5C2D8B] hover:bg-[#4a2470]" : "bg-gray-900 hover:bg-gray-800"}`}>
                {checkoutLoading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing…</>
                  : checkoutForm.paymentMethod === "khalti" ? "Pay with Khalti 💜" : "Place Order →"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Topbar user={user} cartCount={cartItems.length} onLogout={handleLogout} navigate={navigate} />

      <main className="flex-1 px-8 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">My Cart</h2>
            <p className="text-gray-400 text-[13px] mt-0.5">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/user/search")} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-3.5 py-2 rounded-xl hover:border-green-300 hover:text-green-700 hover:bg-green-50 transition text-[13px] font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add More
            </button>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="flex items-center gap-1.5 border border-red-200 text-red-500 px-3.5 py-2 rounded-xl hover:bg-red-50 transition text-[13px] font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Clear
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-24 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-[15px] font-bold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-400 text-[13px] mb-6">Search for medicines and add them to your cart</p>
            <button onClick={() => navigate("/user/search")} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">Search Medicines →</button>
          </div>
        ) : (
          <div className="flex gap-5 items-start">
            {/* Cart items */}
            <div className="flex-1 space-y-2.5">
              {cartItems.map(item => {
                const p = item.productId;
                const outOfStock = p?.productTotalStockQuantity === 0;
                const src = imgSrc(p?.productImageUrl);
                return (
                  <div key={item._id} className={`bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4 transition-shadow ${outOfStock ? "border-red-100 opacity-70" : "border-gray-100 hover:shadow-md"}`}>
                    <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-green-100">
                      {src
                        ? <img src={src} alt={p?.productName} className="w-full h-full object-cover rounded-xl" onError={e => { e.target.style.display = "none"; }} />
                        : <span className="text-2xl">💊</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-[13px] truncate">{p?.productName || "Product"}</h4>
                      <p className="text-green-600 font-black text-[13px] mt-0.5">Rs. {p?.productPrice?.toLocaleString()}</p>
                      {outOfStock
                        ? <p className="text-[11px] text-red-500 font-semibold mt-0.5">Out of stock — please remove</p>
                        : <p className="text-[11px] text-gray-400 mt-0.5">{p?.productTotalStockQuantity} in stock</p>}
                    </div>
                    <div className={`flex items-center border rounded-xl overflow-hidden ${outOfStock ? "border-gray-100 opacity-40 pointer-events-none" : "border-gray-200"}`}>
                      <button onClick={() => updateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1 || updating[item._id] || outOfStock} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 font-bold text-base transition">−</button>
                      <span className="w-8 text-center font-black text-gray-800 text-[13px]">{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.quantity + 1)} disabled={item.quantity >= p?.productTotalStockQuantity || updating[item._id] || outOfStock} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 font-bold text-base transition">+</button>
                    </div>
                    <p className="font-black text-gray-800 w-24 text-right text-[13px]">Rs. {((p?.productPrice || 0) * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeItem(item._id)} className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Order summary */}
            <div className="w-72 flex-shrink-0 sticky top-20">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-[15px] font-black text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex justify-between text-[12px]">
                      <span className="text-gray-500 truncate max-w-[130px]">{item.productId?.productName} × {item.quantity}</span>
                      <span className="font-semibold text-gray-700 flex-shrink-0 ml-2">Rs. {((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-gray-800 text-[13px]">Total</span>
                    <span className="text-xl font-black text-green-600">Rs. {total.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">Delivery charges may apply</p>
                </div>
                {/* Disable checkout if any out-of-stock items */}
                {cartItems.some(i => i.productId?.productTotalStockQuantity === 0) ? (
                  <div className="bg-red-50 border border-red-100 rounded-xl px-3.5 py-3 mb-2 text-center">
                    <p className="text-[12px] text-red-600 font-semibold">Remove out-of-stock items to checkout</p>
                  </div>
                ) : (
                  <button onClick={() => setShowCheckout(true)} className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-black hover:bg-gray-800 transition mb-2 text-[13px]">
                    Checkout →
                  </button>
                )}
                <button onClick={() => navigate("/user/search")} className="w-full border border-gray-200 text-gray-500 py-2 rounded-xl text-[12px] font-medium hover:bg-gray-50 transition">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { io } from "socket.io-client";

const TYPE_META_N = { ORDER_PLACED: { icon: "📦", color: "bg-blue-50 text-blue-600" }, ORDER_STATUS: { icon: "🚚", color: "bg-green-50 text-green-600" }, PAYMENT_SUCCESS: { icon: "💰", color: "bg-amber-50 text-amber-600" } };
const notifMetaN = (type) => TYPE_META_N[type] || { icon: "🔔", color: "bg-gray-50 text-gray-600" };
function timeAgoN(date) { const diff = Math.floor((Date.now() - new Date(date)) / 1000); if (diff < 60) return "just now"; if (diff < 3600) return `${Math.floor(diff / 60)}m ago`; if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; return `${Math.floor(diff / 86400)}d ago`; }

function NotificationBell({ userId }) {
  const [open, setOpen] = useState(false); const [notifs, setNotifs] = useState([]); const [unread, setUnread] = useState(0); const [loading, setLoading] = useState(true); const dropdownRef = useRef(null);
  const fetchNotifs = useCallback(async () => { try { const { data } = await api.get("/notifications"); setNotifs(data.notifications || []); setUnread(data.unreadCount || 0); } catch { } finally { setLoading(false); } }, []);
  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);
  useEffect(() => { if (!userId) return; const socket = io("http://keshab-sigdel-health-haul-backend-production.up.railway.app", { query: { userId }, withCredentials: true }); socket.emit("joinUserRoom", userId); socket.on("newNotification", (n) => { setNotifs(prev => prev.some(x => x._id === n._id) ? prev : [n, ...prev]); setUnread(prev => prev + 1); }); return () => { socket.emit("leaveUserRoom", userId); socket.disconnect(); }; }, [userId]);
  useEffect(() => { const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const markRead = async (id) => { try { await api.put(`/notifications/${id}/read`); setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n)); setUnread(prev => Math.max(0, prev - 1)); } catch { } };
  const markAllRead = async (e) => { e.stopPropagation(); try { await api.put("/notifications/read-all"); setNotifs(prev => prev.map(n => ({ ...n, isRead: true }))); setUnread(0); } catch { } };
  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button onClick={() => setOpen(o => !o)} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition" title="Notifications">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {unread > 0 && <span className="absolute top-1 right-1 min-w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-[3px] leading-none">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2"><p className="text-[14px] font-black text-gray-900">Notifications</p>{unread > 0 && <span className="bg-red-100 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread} new</span>}</div>
            {unread > 0 && <button onClick={markAllRead} className="text-[11px] font-bold text-green-600 hover:text-green-700">Mark all read</button>}
          </div>
          <div className="max-h-[380px] overflow-y-auto">
            {loading ? <div className="py-10 flex justify-center"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
              : notifs.length === 0 ? <div className="py-12 text-center"><div className="text-3xl mb-2">🔔</div><p className="text-[13px] font-bold text-gray-600">No notifications yet</p></div>
              : notifs.slice(0, 20).map(n => { const m = notifMetaN(n.type); return (<button key={n._id} onClick={() => { if (!n.isRead) markRead(n._id); setOpen(false); }} className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-green-50/40" : ""}`}><div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${m.color}`}>{m.icon}</div><div className="flex-1 min-w-0"><p className={`text-[12px] leading-snug ${n.isRead ? "text-gray-700 font-medium" : "text-gray-900 font-bold"}`}>{n.title}</p><p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p><p className="text-[10px] text-gray-300 mt-1">{timeAgoN(n.createdAt)}</p></div>{!n.isRead && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />}</button>); })}
          </div>
        </div>
      )}
    </div>
  );
}

function Topbar({ user, onLogout, navigate, active }) {
  const navItems = [
    { key: "dashboard", label: "Dashboard", path: "/user/dashboard" },
    { key: "search", label: "Browse Medicines", path: "/user/search" },
    { key: "orders", label: "My Orders", path: "/user/orders" },
    { key: "chat", label: "Chat", path: "/user/chat" },
  ];
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-[56px]">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/user/dashboard")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <span className="font-black text-[15px] text-gray-900 tracking-tight">HealthHaul</span>
      </div>
      <nav className="flex items-center gap-1 ml-6">
        {navItems.map(({ key, label, path }) => (
          <button key={key} onClick={() => navigate(path)} className={`px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition ${active === key ? "font-semibold text-gray-900 bg-gray-100" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>{label}</button>
        ))}
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </button>
        <NotificationBell userId={user?._id} />
        <button onClick={() => navigate("/user/profile")} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 hover:border-green-300 transition">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px]">{user?.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="text-left"><p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name?.split(" ")[0] || "User"}</p><p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.roles?.[0] || "Customer"}</p></div>
        </button>
        <button onClick={onLogout} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Sign Out">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </header>
  );
}

function Footer({ navigate }) {
  const quickLinks = [{ label: "Search Medicines", path: "/user/search" }, { label: "My Orders", path: "/user/orders" }, { label: "My Cart", path: "/user/cart" }, { label: "Profile", path: "/user/profile" }];
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-3 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">Your trusted partner for fast and reliable medicine delivery across Nepal.</p>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-400 text-sm">{quickLinks.map(({ label, path }) => (<li key={label}><button onClick={() => navigate(path)} className="hover:text-white transition text-left w-full">{label}</button></li>))}</ul>
          </div>
          <div>
            <h5 className="font-semibold mb-4">Contact Us</h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg><a href="mailto:sigdelbibek9898@gmail.com" className="hover:text-white transition break-all">sigdelbibek9898@gmail.com</a></li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg><a href="tel:9829396927" className="hover:text-white transition">9829396927</a></li>
              <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg><span>Itahari-8, Sunsari, Nepal</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-700 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function StatusPill({ status }) {
  const map = { pending: { cls: "bg-amber-100 text-amber-700", dot: "bg-amber-400", label: "Pending" }, delivered: { cls: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Delivered" }, cancelled: { cls: "bg-red-100 text-red-600", dot: "bg-red-400", label: "Cancelled" } };
  const s = map[status] || { cls: "bg-gray-100 text-gray-600", dot: "bg-gray-400", label: status };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${s.cls}`}><span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`}/>{s.label}</span>;
}

function TrackingBar({ status }) {
  const steps = ["pending", "delivered"];
  const idx = steps.indexOf(status);
  const isCancelled = status === "cancelled";
  if (isCancelled) return <div className="flex items-center gap-3 mt-3"><div className="flex-1 h-1 rounded-full bg-red-100"/><span className="text-[11px] text-red-400 font-medium flex-shrink-0">Order Cancelled</span></div>;
  return (
    <div className="mt-3">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${i <= idx ? "bg-green-500 shadow-sm shadow-green-200" : "bg-gray-200"}`}/>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < idx ? "bg-green-400" : "bg-gray-200"}`}/>}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {["Order Placed", "Delivered"].map((label, i) => <span key={label} className={`text-[10px] font-medium ${i <= idx ? "text-green-600" : "text-gray-300"}`}>{label}</span>)}
      </div>
    </div>
  );
}

export default function UserOrderPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    api.get("/orders/get/orders")
      .then(r => { const data = r.data || []; setOrders(data.map(o => ({ ...o, orderStatus: o.orderStatus?.toLowerCase() || "pending" }))); })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) { }
    localStorage.removeItem("user"); navigate("/login");
  };

  const FILTERS = [{ key: "all", label: "All" }, { key: "pending", label: "Pending" }, { key: "delivered", label: "Delivered" }, { key: "cancelled", label: "Cancelled" }];
  const filtered = filter === "all" ? orders : orders.filter(o => o.orderStatus === filter);
  const currentFilterLabel = FILTERS.find(f => f.key === filter)?.label || filter;
  const payLabel = { cod: "Cash on Delivery", esewa: "eSewa", khalti: "Khalti" };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center"><div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/><p className="text-gray-400 text-sm">Loading your orders…</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar user={user} onLogout={handleLogout} navigate={navigate} active="orders" />
      <main className="flex-1 px-8 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-[22px] font-black text-gray-900 tracking-tight">My Orders</h2><p className="text-gray-400 text-[13px] mt-0.5">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p></div>
          <button onClick={() => navigate("/user/search")} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition shadow-sm">
            Browse Medicines <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Orders", count: orders.length, bg: "bg-gray-50", text: "text-gray-900", emoji: "📦" },
            { label: "Pending", count: orders.filter(o => o.orderStatus === "pending").length, bg: "bg-amber-50", text: "text-amber-700", emoji: "⏳" },
            { label: "Delivered", count: orders.filter(o => o.orderStatus === "delivered").length, bg: "bg-green-50", text: "text-green-700", emoji: "✅" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-xl flex-shrink-0`}>{s.emoji}</div>
              <div><p className={`text-2xl font-black leading-none ${s.text}`}>{s.count}</p><p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.label}</p></div>
            </div>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTERS.map(({ key, label }) => {
            const count = key === "all" ? orders.length : orders.filter(o => o.orderStatus === key).length;
            return (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-1.5 ${filter === key ? "bg-gray-900 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                {label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-[15px] font-bold text-gray-700 mb-1">No orders found</h3>
            <p className="text-gray-400 text-[13px] mb-6">{filter === "all" ? "You haven't placed any orders yet" : `No ${currentFilterLabel} orders`}</p>
            {filter === "all" && <button onClick={() => navigate("/user/search")} className="bg-gray-900 text-white px-5 py-2 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">Start Shopping</button>}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map(order => (
              <div key={order._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-5 py-4 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                      {order.orderStatus === "delivered" ? "✅" : order.orderStatus === "cancelled" ? "❌" : "📦"}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "long", year: "numeric" })}<span className="mx-1.5 text-gray-200">·</span>{order.products?.length} item{order.products?.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <StatusPill status={order.orderStatus}/>
                    <p className="text-[13px] font-black text-gray-800 w-24 text-right">Rs. {order.totalAmount?.toLocaleString()}</p>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expanded === order._id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
                <div className="px-5 pb-4"><TrackingBar status={order.orderStatus}/></div>
                {expanded === order._id && (
                  <div className="border-t border-gray-100 px-5 py-5 bg-gray-50/60">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-700 mb-3">Items Ordered</h4>
                        <div className="space-y-2">
                          {order.products?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                                {item.productId?.productImageUrl ? <img src={item.productId.productImageUrl} alt="" className="w-full h-full object-cover rounded-lg"/> : "💊"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-gray-800 truncate">{item.productId?.productName || "Product"}</p>
                                <p className="text-[11px] text-gray-400">Qty: {item.quantity} × Rs. {item.productId?.productPrice?.toLocaleString()}</p>
                              </div>
                              <p className="text-[13px] font-bold text-green-600 flex-shrink-0">Rs. {((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-700 mb-3">Order Details</h4>
                        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                          {[{ label: "Shipping Address", value: order.shippingAddress }, { label: "Phone", value: order.phoneNumber }, { label: "Payment Method", value: payLabel[order.paymentMethod] || order.paymentMethod }].map(({ label, value }) => (
                            <div key={label} className="flex gap-3 p-3"><div><p className="text-[11px] text-gray-400">{label}</p><p className="text-[13px] text-gray-700 font-medium">{value}</p></div></div>
                          ))}
                          <div className="flex justify-between items-center p-3">
                            <span className="text-[13px] font-bold text-gray-700">Total Paid</span>
                            <span className="text-[13px] font-black text-green-600">Rs. {order.totalAmount?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
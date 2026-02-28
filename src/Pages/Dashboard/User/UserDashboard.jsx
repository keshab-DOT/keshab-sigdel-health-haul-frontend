import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const NAV = [
  { key: "search",   label: "Search Medicines", path: "/user/search",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",     label: "My Cart",          path: "/user/cart",     icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",   label: "My Orders",        path: "/user/orders",   icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile",  label: "Profile",          path: "/user/profile",  icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  { key: "settings", label: "Settings",         path: "/user/settings", icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
];

const CATEGORIES = [
  { label: "Pain Relief",    icon: "💊", count: null },
  { label: "Antibiotics",   icon: "🧬", count: null },
  { label: "Vitamins",      icon: "🌿", count: null },
  { label: "Heart Care",    icon: "❤️", count: null },
  { label: "Skin Care",     icon: "✨", count: null },
  { label: "All Medicines", icon: "🏥", count: null },
];

// ── Top Navbar ─────────────────────────────────────────────────────────────────
function Topbar({ user, cartCount, onLogout, navigate }) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-0 flex items-center justify-between sticky top-0 z-30 h-[56px]">
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate("/user/dashboard")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </div>
        <span className="font-black text-[15px] text-gray-900 tracking-tight">HealthHaul</span>
      </div>

      <nav className="flex items-center gap-1 ml-6">
        <button onClick={() => navigate("/user/dashboard")} className="px-3.5 py-1.5 text-[13px] font-semibold text-gray-900 bg-gray-100 rounded-lg">Dashboard</button>
        <button onClick={() => navigate("/user/search")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">Browse Medicines</button>
        <button onClick={() => navigate("/user/orders")} className="px-3.5 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition">My Orders</button>
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        <button onClick={() => navigate("/user/cart")} className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          {cartCount > 0 && <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartCount > 9 ? "9+" : cartCount}</span>}
        </button>

        <button onClick={() => navigate("/user/settings")} className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>

        <button onClick={() => navigate("/user/profile")} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 hover:border-green-300 transition">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-[11px]">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="text-left">
            <p className="text-[12px] font-bold text-gray-800 leading-tight">{user?.name?.split(" ")[0] || "User"}</p>
            <p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.roles?.[0] || "Customer"}</p>
          </div>
        </button>

        <button onClick={onLogout} className="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="Sign Out">
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </header>
  );
}

// Status Pill
function StatusPill({ status }) {
  const map = {
    pending: { cls: "bg-amber-100 text-amber-700", dot: "bg-amber-400", label: "Pending" },
    delivered: { cls: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Delivered" },
    cancalled: { cls: "bg-red-100 text-red-600",dot: "bg-red-400", label: "Cancelled" },
  };
  const s = map[status] || { cls: "bg-gray-100 text-gray-600", dot: "bg-gray-400", label: status };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? "animate-pulse" : ""}`}/>
      {s.label}
    </span>
  );
}

// ── Featured Active Order Card (2-step tracking: Pending → Delivered) ──────────
function FeaturedOrderCard({ order, navigate }) {
  // Only 2 steps now: pending → delivered
  const steps = ["pending", "delivered"];
  const idx = steps.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancalled";

  // Get the first product image from the order
  const firstProduct = order.products?.[0]?.productId;
  const productImage = firstProduct?.productImageUrl;
  const productName  = firstProduct?.productName;

  return (
    <div className="relative rounded-2xl overflow-hidden h-full min-h-[260px] bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 flex flex-col justify-between p-5">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-green-400 blur-3xl"/>
        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-emerald-500 blur-3xl"/>
      </div>

      {/* Header row */}
      <div className="relative flex items-center justify-end">
        <button onClick={() => navigate("/user/orders")}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition border border-white/10">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </button>
      </div>

      {/* Order info + medicine image */}
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1">ORDER</p>
          <p className="text-white font-black text-xl tracking-tight leading-none mb-1">#{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-white/50 text-[11px]">
            {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
            &nbsp;·&nbsp;{order.products?.length} item{order.products?.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Medicine image */}
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/20 bg-white/10 flex items-center justify-center flex-shrink-0">
          {productImage ? (
            <img
              src={productImage}
              alt={productName || "Medicine"}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
          ) : null}
          <span
            className="text-2xl items-center justify-center w-full h-full"
            style={{ display: productImage ? "none" : "flex" }}
          >💊</span>
        </div>
      </div>

      {/* Tracking bar: only Pending → Delivered (2 steps) */}
      <div className="relative">
        {isCancelled ? (
          <div className="h-1 rounded-full bg-red-400/40 mb-2"/>
        ) : (
          <>
            <div className="flex items-center mb-2">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black border-2 transition-all ${
                    i < idx ? "bg-green-400 border-green-400 text-white" : i === idx ? "bg-white border-white text-gray-900" : "border-white/20 bg-white/5"}`}>
                    {i < idx ? "✓" : i + 1}
                  </div>
                  {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 rounded-full ${i < idx ? "bg-green-400" : "bg-white/15"}`}/>}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {["Placed", "Delivered"].map((l, i) => (
                <span key={l} className={`text-[9px] font-semibold ${i <= idx ? "text-green-400" : "text-white/25"}`}>{l}</span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between border-t border-white/10 pt-3">
        <div>
          <p className="text-white/40 text-[10px] font-medium">Total</p>
          <p className="text-white font-black text-lg leading-tight">Rs. {order.totalAmount?.toLocaleString()}</p>
        </div>
        <button onClick={() => navigate("/user/orders")}
          className="bg-green-500 hover:bg-green-400 text-white text-[12px] font-bold px-4 py-2 rounded-xl transition flex items-center gap-1">
          Track Order
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer({ navigate }) {
  const quickLinks = [
    { label: "Search Medicines", path: "/user/search" },
    { label: "My Orders",        path: "/user/orders" },
    { label: "My Cart",          path: "/user/cart" },
    { label: "Profile",          path: "/user/profile" },
  ];
  const supportLinks = [
    { label: "Help Center",      path: "/user/help" },
    { label: "Contact Us",       path: "/user/contact" },
    { label: "Refund Policy",    path: "/user/refund-policy" },
    { label: "Terms of Service", path: "/user/terms" },
  ];
  return (
    <footer className="bg-gray-950 text-white mt-auto">
      <div className="px-8 pt-8 pb-5">
        <div className="grid grid-cols-4 gap-8 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <h4 className="font-bold text-green-400">HealthHaul Nepal</h4>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">Fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery in 30 minutes.</p>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Quick Links</h5>
            <ul className="space-y-1.5 text-gray-400 text-[13px]">
              {quickLinks.map(({ label, path }) => (
                <li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-[11px] text-gray-500 uppercase tracking-widest mb-3">Support</h5>
            <ul className="space-y-1.5 text-gray-400 text-[13px]">
              {supportLinks.map(({ label, path }) => (
                <li key={label}><button onClick={() => navigate(path)} className="hover:text-green-400 transition-colors text-left w-full">{label}</button></li>
              ))}
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

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [orders, setOrders]       = useState([]);
  const [products, setProducts]   = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [reordering, setReordering] = useState({});
  const [toast, setToast]         = useState(null);
  const [greeting, setGreeting]   = useState("Good morning");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");

    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);

    Promise.allSettled([
      api.get("/orders/get/orders"),
      api.get("/cart/getcart"),
      api.get("/products/get/products"),
    ]).then(([ordRes, cartRes, prodRes]) => {
      if (ordRes.status === "fulfilled") {
        const data = ordRes.value.data || [];
        setOrders(data.map(o => ({ ...o, orderStatus: o.orderStatus?.toLowerCase() || "pending" })));
      }
      if (cartRes.status === "fulfilled") setCartCount(cartRes.value.data?.length || 0);
      if (prodRes.status === "fulfilled") setProducts((prodRes.value.data || []).slice(0, 4));
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleReorder = async (productId) => {
    setReordering(p => ({ ...p, [productId]: true }));
    try {
      await api.post("/cart/add", { productId, quantity: 1 });
      setCartCount(c => c + 1);
      showToast("Added to cart! 🛒");
    } catch {
      showToast("Couldn't add to cart.", "error");
    } finally {
      setReordering(p => ({ ...p, [productId]: false }));
    }
  };

  // Active orders: only pending (removed ontheway)
  const activeOrders   = orders.filter(o => o.orderStatus === "pending");
  const latestActive   = activeOrders[0] || null;
  const totalOrders    = orders.length;
  const delivered      = orders.filter(o => o.orderStatus === "delivered").length;
  const totalSpent     = orders.filter(o => o.orderStatus === "delivered").reduce((s, o) => s + (o.totalAmount || 0), 0);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-gray-400 text-sm">Loading your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-white text-[13px] font-medium ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}>
          {toast.msg}
        </div>
      )}

      <Topbar user={user} cartCount={cartCount} onLogout={handleLogout} navigate={navigate} />

      <main className="flex-1">

        {/* ── HERO SECTION ─────────────────────────────────────────────── */}
        <section className="px-8 pt-7 pb-6">
          <div className="flex gap-5 items-stretch min-h-[270px]">

            {/* LEFT: hero text */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-7 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-green-50 border border-green-100"/>
              <div className="absolute -bottom-8 -right-4 w-24 h-24 rounded-full bg-emerald-50"/>

              <div className="relative">
                <p className="text-gray-400 text-[13px] font-medium mb-1">{greeting},</p>
                <h1 className="text-3xl font-black text-gray-900 leading-tight tracking-tight mb-1">Stay Healthy.</h1>
                <h1 className="text-3xl font-black text-green-600 leading-tight tracking-tight mb-3">Delivered Fast.</h1>
                <p className="text-gray-500 text-[13px] leading-relaxed max-w-xs">
                  Welcome back, <span className="font-bold text-gray-800">{user?.name?.split(" ")[0]}</span>. Browse medicines from licensed pharmacies and get them to your door.
                </p>
              </div>

              <div className="relative flex items-center gap-2.5 mt-5">
                <button onClick={() => navigate("/user/search")}
                  className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-gray-800 transition shadow-sm">
                  Browse Medicines
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                </button>
                <button onClick={() => navigate("/user/cart")}
                  className="flex items-center gap-2 border border-green-200 text-green-700 bg-green-50 px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-green-100 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  My Cart {cartCount > 0 && <span className="bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                </button>
              </div>
            </div>

            {/* RIGHT: featured active order OR empty state */}
            <div className="w-[340px] flex-shrink-0">
              {latestActive ? (
                <FeaturedOrderCard order={latestActive} navigate={navigate} />
              ) : (
                <div className="relative rounded-2xl overflow-hidden h-full min-h-[270px] bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-950 flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-green-400 blur-3xl"/>
                    <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-emerald-500 blur-3xl"/>
                  </div>
                  <div className="relative w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                    <span className="text-2xl">💊</span>
                  </div>
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2">No Active Orders</p>
                  <h3 className="text-white font-black text-lg leading-tight mb-3">Need medicines<br/>delivered now?</h3>
                  <button onClick={() => navigate("/user/search")}
                    className="bg-green-500 hover:bg-green-400 text-white text-[12px] font-bold px-5 py-2.5 rounded-xl transition">
                    Get Medicines Now →
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ── TRUST BADGES ─────────────────────────────────────────────── */}
        <section className="px-8 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🏥", title: "Licensed Pharmacies",  desc: "Every pharmacy verified" },
              { icon: "📋", title: "Order Tracking",        desc: "Get medicines on time" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3.5 flex items-center gap-3 hover:border-green-200 hover:shadow-md transition-all group">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-green-100 transition">{icon}</div>
                <div>
                  <p className="text-[12px] font-bold text-gray-800">{title}</p>
                  <p className="text-[11px] text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ROW ─────────────────────────────────────────────────── */}
        <section className="px-8 pb-6">
          <div className="grid grid-cols-3 gap-3">
            <div onClick={() => navigate("/user/orders")} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:border-green-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-green-50 flex items-center justify-center text-xl transition">📦</div>
              <div>
                <p className="text-2xl font-black text-gray-900 leading-none">{totalOrders}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Total Orders</p>
              </div>
            </div>
            <div onClick={() => navigate("/user/orders")} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:border-green-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">✅</div>
              <div>
                <p className="text-2xl font-black text-green-600 leading-none">{delivered}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Delivered</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">💰</div>
              <div>
                <p className="text-xl font-black text-emerald-600 leading-none">Rs. {totalSpent > 999 ? `${(totalSpent/1000).toFixed(1)}k` : totalSpent.toLocaleString()}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Total Spent</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── LIVE MEDICINES ─────────────────────────────────────────────── */}
        <section className="px-8 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-black text-gray-900">Available Medicines</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">From licensed pharmacies near you</p>
            </div>
            <button onClick={() => navigate("/user/search")} className="text-[12px] text-green-600 font-semibold hover:text-green-700 flex items-center gap-0.5 bg-green-50 px-3 py-1.5 rounded-lg transition">
              View all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {products.length > 0 ? products.map(product => {
              const outOfStock = product.productTotalStockQuantity === 0;
              return (
                <div key={product._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden relative">
                    {product.productImageUrl
                      ? <img src={product.productImageUrl} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { e.target.style.display = "none"; }}/>
                      : <span className="text-4xl opacity-50">💊</span>}
                    {outOfStock && (
                      <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                    {!outOfStock && product.productTotalStockQuantity <= 5 && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg">Only {product.productTotalStockQuantity} left</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] font-bold text-gray-800 truncate mb-0.5">{product.productName}</p>
                    <p className="text-[10px] text-gray-400 mb-2 line-clamp-1">{product.productDescription}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-green-600 font-black text-[13px]">Rs. {product.productPrice?.toLocaleString()}</p>
                      <button
                        onClick={() => handleReorder(product._id)}
                        disabled={outOfStock || reordering[product._id]}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition ${outOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-green-50 text-green-700 hover:bg-green-600 hover:text-white"}`}>
                        {reordering[product._id] ? "…" : outOfStock ? "N/A" : "+ Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-100"/>
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4"/>
                    <div className="h-2.5 bg-gray-100 rounded w-full"/>
                    <div className="h-7 bg-gray-100 rounded-lg mt-1"/>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── BROWSE CATEGORIES ────────────────────────────────────────── */}
        <section className="px-8 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-black text-gray-900">Browse Categories</h2>
          </div>
          <div className="grid grid-cols-6 gap-2.5">
            {CATEGORIES.map(({ label, icon }) => (
              <button key={label} onClick={() => navigate("/user/search")}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex flex-col items-center gap-2 hover:border-green-300 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center text-xl transition">{icon}</div>
                <p className="text-[11px] font-semibold text-gray-700 text-center leading-tight">{label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── ORDER HISTORY ─────────────────────────────────────────────── */}
        <section className="px-8 pb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-black text-gray-900">Order History</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Your recent orders</p>
            </div>
            <button onClick={() => navigate("/user/orders")} className="text-[12px] text-green-600 font-semibold hover:text-green-700 flex items-center gap-0.5 bg-green-50 px-3 py-1.5 rounded-lg transition">
              View all
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 py-12 text-center">
              <span className="text-4xl mb-3 block">🛒</span>
              <p className="text-[13px] font-bold text-gray-600 mb-1">No orders yet</p>
              <p className="text-[12px] text-gray-400 mb-4">Place your first order to see it here</p>
              <button onClick={() => navigate("/user/search")} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-xl text-[13px] font-bold hover:from-green-700 hover:to-emerald-700 transition">Browse Medicines →</button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
              {orders.slice(0, 5).map(order => (
                <div key={order._id} onClick={() => navigate("/user/orders")} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition cursor-pointer group">
                  <div className="w-8 h-8 bg-gray-50 group-hover:bg-green-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition">
                    {order.orderStatus === "delivered" ? "✅" : order.orderStatus === "cancalled" ? "❌" : "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short" })}
                      <span className="mx-1">·</span>
                      {order.products?.length} item{order.products?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-[12px] font-black text-gray-800">Rs. {order.totalAmount?.toLocaleString()}</p>
                    <StatusPill status={order.orderStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── BOTTOM CTA BANNER ─────────────────────────────────────────── */}
        <section className="px-8 pb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl px-8 py-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5"/>
            <div className="absolute -bottom-8 right-40 w-32 h-32 rounded-full bg-white/5"/>
            <div className="relative">
              <h3 className="text-white font-black text-xl leading-tight">Don't miss your health essentials.</h3>
              <p className="text-green-100/70 text-[13px] mt-1">New products added daily. Fast delivery to your door.</p>
            </div>
            <button onClick={() => navigate("/user/search")}
              className="relative bg-white text-green-700 font-black text-[13px] px-6 py-3 rounded-xl hover:bg-green-50 transition shadow-md flex items-center gap-2 flex-shrink-0">
              Browse Medicines
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </section>
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}
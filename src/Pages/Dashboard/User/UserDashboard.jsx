import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

// ── Nav ───────────────────────────────────────────────────────────────────────
const NAV = [
  { key: "search",  label: "Search Medicines", path: "/user/search",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",    label: "My Cart",          path: "/user/cart",    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",  label: "My Orders",        path: "/user/orders",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile", label: "Profile",          path: "/user/profile", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ active, user, onLogout, cartCount = 0 }) {
  const navigate = useNavigate();
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/")}>
        <h1 className="text-xl font-bold text-green-600">HealthHaul Nepal</h1>
        <p className="text-xs text-gray-400 mt-0.5">Customer Portal</p>
      </div>

      {/* User */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || "Customer"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative
              ${active === key ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>
            <span>{icon}</span>
            {label}
            {key === "cart" && cartCount > 0 && (
              <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-8 pt-10 pb-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <h4 className="font-bold text-green-400 text-lg mb-3">HealthHaul Nepal</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your trusted partner for fast, reliable medicine delivery across Nepal.
              Licensed pharmacies, verified products, doorstep delivery.
            </p>
            <div className="flex gap-3 mt-4">
              {["Licensed Pharmacies", "30-min Delivery", "Secure Payment"].map(t => (
                <span key={t} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-white mb-3">My Account</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-green-400 cursor-pointer transition">Search Medicines</li>
              <li className="hover:text-green-400 cursor-pointer transition">My Orders</li>
              <li className="hover:text-green-400 cursor-pointer transition">My Cart</li>
              <li className="hover:text-green-400 cursor-pointer transition">Profile</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-white mb-3">Help & Support</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="hover:text-green-400 cursor-pointer transition">Help Center</li>
              <li className="hover:text-green-400 cursor-pointer transition">Contact Us</li>
              <li className="hover:text-green-400 cursor-pointer transition">Refund Policy</li>
              <li className="hover:text-green-400 cursor-pointer transition">Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-5 flex justify-between items-center">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} HealthHaul Nepal. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Made with ❤️ in Nepal</p>
        </div>
      </div>
    </footer>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:   { cls: "bg-yellow-100 text-yellow-700", label: "Pending" },
    ontheway:  { cls: "bg-blue-100 text-blue-700",     label: "On the Way" },
    delivered: { cls: "bg-green-100 text-green-700",   label: "Delivered" },
    cancalled: { cls: "bg-red-100 text-red-700",       label: "Cancelled" },
  };
  const s = map[status] || { cls: "bg-gray-100 text-gray-600", label: status };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser]           = useState(null);
  const [orders, setOrders]       = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ordRes, cartRes] = await Promise.allSettled([
      api.get("/orders/get/orders").catch(() => ({ data: [] })),
      api.get("/cart/getcart").catch(() => ({ data: [] })),
    ]);
    if (ordRes.status === "fulfilled")  setOrders(ordRes.value.data || []);
    if (cartRes.status === "fulfilled") setCartCount(cartRes.value.data?.length || 0);
    setLoading(false);
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const delivered  = orders.filter(o => o.orderStatus === "delivered");
  const totalSpent = delivered.reduce((s, o) => s + (o.totalAmount || 0), 0);

  const stats = [
    { label: "Total Orders", value: orders.length,   icon: "📦", bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-100",    sub: `${delivered.length} delivered` },
    { label: "Pending",      value: orders.filter(o => o.orderStatus === "pending").length, icon: "⏳", bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100", sub: `${orders.filter(o => o.orderStatus === "ontheway").length} on the way` },
    { label: "Total Spent",  value: `Rs. ${totalSpent.toLocaleString()}`, icon: "💰", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", sub: "on delivered orders" },
    { label: "Cart Items",   value: cartCount,        icon: "🛒", bg: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-100",  sub: "ready to checkout" },
  ];

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-500 text-sm">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="overview" user={user} onLogout={handleLogout} cartCount={cartCount} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
            <p className="text-gray-500 text-sm mt-0.5">Here's your health dashboard overview</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/user/search")}
              className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2.5 rounded-xl hover:bg-green-50 transition font-medium text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Search Medicines
            </button>
            <button onClick={() => navigate("/user/cart")}
              className="relative flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm font-medium text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              My Cart
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>}
            </button>
          </div>
        </div>

        <main className="flex-1 px-8 py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon, bg, text, border, sub }) => (
              <div key={label} className={`bg-white rounded-2xl p-5 shadow-sm border ${border} hover:shadow-md transition`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 ${bg}`}>{icon}</div>
                <p className={`text-2xl font-bold ${text}`}>{value}</p>
                <p className="text-sm text-gray-700 font-medium mt-0.5">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Search & Buy Medicines", desc: "Browse our full catalogue and add to cart", icon: "🔍", path: "/user/search", bg: "from-green-500 to-green-700" },
              { label: "View My Cart",           desc: "Review items and proceed to checkout",      icon: "🛒", path: "/user/cart",   bg: "from-blue-500 to-blue-700" },
              { label: "Track My Orders",        desc: "See real-time status of your orders",       icon: "📍", path: "/user/orders", bg: "from-purple-500 to-purple-700" },
            ].map(({ label, desc, icon, path, bg }) => (
              <button key={label} onClick={() => navigate(path)}
                className={`bg-gradient-to-br ${bg} text-white rounded-2xl p-5 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md`}>
                <div className="text-3xl mb-3">{icon}</div>
                <h4 className="font-bold text-base mb-1">{label}</h4>
                <p className="text-xs text-white/80 leading-relaxed">{desc}</p>
              </button>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
                <p className="text-xs text-gray-400 mt-0.5">Your last {Math.min(orders.length, 5)} orders</p>
              </div>
              <button onClick={() => navigate("/user/orders")}
                className="text-green-600 text-sm font-semibold hover:text-green-700 transition flex items-center gap-1">
                View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="py-14 text-center">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-600 font-semibold">No orders yet</p>
                <p className="text-gray-400 text-sm mt-1 mb-5">Start by searching for medicines</p>
                <button onClick={() => navigate("/user/search")}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                  Browse Medicines →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.slice(0, 5).map(order => (
                  <div key={order._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/60 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg">📦</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                          {" · "}{order.products?.length} item{order.products?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={order.orderStatus} />
                      <p className="text-sm font-bold text-gray-800 w-24 text-right">Rs. {order.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Promo */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 flex items-center gap-5 text-white">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">💊</div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">Need medicines fast?</h4>
              <p className="text-green-100 text-sm mt-0.5">Browse our verified catalogue — get delivered to your doorstep in under 30 minutes.</p>
            </div>
            <button onClick={() => navigate("/user/search")}
              className="bg-white text-green-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-green-50 transition flex-shrink-0 shadow-sm">
              Shop Now →
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
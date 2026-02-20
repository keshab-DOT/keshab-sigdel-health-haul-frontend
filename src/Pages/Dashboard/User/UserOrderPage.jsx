import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const NAV = [
  { key: "search",  label: "Search Medicines", path: "/user/search",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",    label: "My Cart",          path: "/user/cart",    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",  label: "My Orders",        path: "/user/orders",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile", label: "Profile",          path: "/user/profile", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
];

function Sidebar({ active, user, onLogout }) {
  const navigate = useNavigate();
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/user/dashboard")}>
        <h1 className="text-xl font-bold text-green-600">HealthHaul Nepal</h1>
        <p className="text-xs text-gray-400 mt-0.5">Customer Portal</p>
      </div>
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
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${active === key ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-8 pt-10 pb-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <h4 className="font-bold text-green-400 text-lg mb-3">HealthHaul Nepal</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your trusted partner for fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
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

function StatusBadge({ status }) {
  const map = {
    pending:   { cls: "bg-yellow-100 text-yellow-700 border border-yellow-200", label: "⏳ Pending" },
    ontheway:  { cls: "bg-blue-100 text-blue-700 border border-blue-200",       label: "🚚 On the Way" },
    delivered: { cls: "bg-green-100 text-green-700 border border-green-200",    label: "✅ Delivered" },
    cancalled: { cls: "bg-red-100 text-red-700 border border-red-200",          label: "❌ Cancelled" },
  };
  const s = map[status] || { cls: "bg-gray-100 text-gray-600 border border-gray-200", label: status };
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

function TrackingBar({ status }) {
  const steps = ["pending", "ontheway", "delivered"];
  const idx = steps.indexOf(status);
  const isCancelled = status === "cancalled";
  if (isCancelled) return (
    <div className="flex items-center gap-3 mt-3">
      <div className="flex-1 h-1.5 rounded-full bg-red-200"/>
      <span className="text-xs text-red-500 font-medium flex-shrink-0">Order Cancelled</span>
    </div>
  );
  return (
    <div className="mt-3">
      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 border-2 transition-all ${i <= idx ? "bg-green-500 border-green-500" : "bg-gray-200 border-gray-300"}`}/>
            {i < steps.length - 1 && <div className={`flex-1 h-1 ${i < idx ? "bg-green-400" : "bg-gray-200"}`}/>}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {["Order Placed", "On the Way", "Delivered"].map((label, i) => (
          <span key={label} className={`text-xs ${i <= idx ? "text-green-600 font-medium" : "text-gray-400"}`}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default function UserOrderPage() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    api.get("/orders/get/orders")
      .then(r => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const FILTERS = [
    { key: "all",      label: "All Orders" },
    { key: "pending",  label: "Pending" },
    { key: "ontheway", label: "On the Way" },
    { key: "delivered",label: "Delivered" },
    { key: "cancalled",label: "Cancelled" },
  ];

  const filtered = filter === "all" ? orders : orders.filter(o => o.orderStatus === filter);
  const payLabel = { cod: "Cash on Delivery", khalti: "Khalti", esewa: "eSewa" };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="orders" user={user} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
          <p className="text-gray-500 text-sm mt-0.5">{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
        </div>

        <main className="flex-1 px-8 py-6 space-y-5">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total",      count: orders.length,                                         bg: "bg-gray-100",    text: "text-gray-700" },
              { label: "Pending",    count: orders.filter(o => o.orderStatus === "pending").length, bg: "bg-yellow-100", text: "text-yellow-700" },
              { label: "On the Way", count: orders.filter(o => o.orderStatus === "ontheway").length,bg: "bg-blue-100",   text: "text-blue-700" },
              { label: "Delivered",  count: orders.filter(o => o.orderStatus === "delivered").length,bg: "bg-green-100", text: "text-green-700" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                <p className={`text-2xl font-bold ${s.text}`}>{s.count}</p>
                <p className={`text-xs font-semibold ${s.text} mt-0.5`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition flex-shrink-0
                  ${filter === key ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600"}`}>
                {label}
                {key !== "all" && (
                  <span className={`ml-1.5 text-xs font-bold ${filter === key ? "text-green-200" : "text-gray-400"}`}>
                    ({orders.filter(o => o.orderStatus === key).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Orders */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">No orders found</h3>
              <p className="text-gray-400 text-sm mb-6">
                {filter === "all" ? "You haven't placed any orders yet" : `No ${filter} orders`}
              </p>
              {filter === "all" && (
                <button onClick={() => navigate("/user/search")}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm">
                  Start Shopping
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(order => (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  {/* Row */}
                  <div className="px-6 py-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📦</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "long", year: "numeric" })}
                          {" · "}{order.products?.length} item{order.products?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={order.orderStatus} />
                      <p className="text-sm font-bold text-gray-800 w-24 text-right">Rs. {order.totalAmount?.toLocaleString()}</p>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expanded === order._id ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                  </div>

                  {/* Tracking bar — always visible */}
                  <div className="px-6 pb-4">
                    <TrackingBar status={order.orderStatus} />
                  </div>

                  {/* Expanded detail */}
                  {expanded === order._id && (
                    <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/60">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Items */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-3">Items Ordered</h4>
                          <div className="space-y-2">
                            {order.products?.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0 overflow-hidden">
                                  {item.productId?.productImageUrl
                                    ? <img src={item.productId.productImageUrl} alt="" className="w-full h-full object-cover rounded-lg"/>
                                    : "💊"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">{item.productId?.productName || "Product"}</p>
                                  <p className="text-xs text-gray-400">Qty: {item.quantity} × Rs. {item.productId?.productPrice?.toLocaleString()}</p>
                                </div>
                                <p className="text-sm font-semibold text-green-600 flex-shrink-0">
                                  Rs. {((item.productId?.productPrice || 0) * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Details */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-3">Order Details</h4>
                          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                            <div className="flex gap-3 p-3">
                              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                              <div>
                                <p className="text-xs text-gray-400">Shipping Address</p>
                                <p className="text-sm text-gray-700 font-medium">{order.shippingAddress}</p>
                              </div>
                            </div>
                            <div className="flex gap-3 p-3">
                              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                              <div>
                                <p className="text-xs text-gray-400">Phone</p>
                                <p className="text-sm text-gray-700 font-medium">{order.phoneNumber}</p>
                              </div>
                            </div>
                            <div className="flex gap-3 p-3">
                              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                              <div>
                                <p className="text-xs text-gray-400">Payment Method</p>
                                <p className="text-sm text-gray-700 font-medium">{payLabel[order.paymentMethod] || order.paymentMethod}</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center p-3">
                              <span className="text-sm font-bold text-gray-700">Total Paid</span>
                              <span className="text-sm font-bold text-green-600">Rs. {order.totalAmount?.toLocaleString()}</span>
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

        <Footer />
      </div>
    </div>
  );
}
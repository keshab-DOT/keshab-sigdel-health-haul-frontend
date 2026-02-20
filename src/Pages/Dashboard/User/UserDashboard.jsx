import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

// ── Shared Sidebar Component ─────────────────────────────────────────────────
function Sidebar({ active, user, onLogout }) {
  const navigate = useNavigate();
  const links = [
    { key: "overview", label: "Overview", path: "/user/dashboard", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { key: "cart", label: "My Cart", path: "/user/cart", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    )},
    { key: "orders", label: "My Orders", path: "/user/orders", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
    { key: "profile", label: "Profile", path: "/user/profile", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )},
    { key: "support", label: "Support", path: "/user/support", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    )},
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm flex-shrink-0">
      <div className="px-6 py-5 border-b border-gray-100 cursor-pointer" onClick={() => navigate("/")}>
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
        {links.map(({ key, label, path, icon }) => (
          <button key={key} onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active === key ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-700"
            }`}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    pending:   "bg-yellow-100 text-yellow-700",
    ontheway:  "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancalled: "bg-red-100 text-red-700",
  };
  const labels = { pending: "Pending", ontheway: "On the Way", delivered: "Delivered", cancalled: "Cancelled" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {labels[status] || status}
    </span>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [quantities, setQuantities] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, cartRes] = await Promise.allSettled([
        api.get("/orders/get/orders").catch(() => ({ data: [] })),
        api.get("/products/get/products"),
        api.get("/cart/getcart"),
      ]);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.data?.slice(0, 5) || []);
      if (productsRes.status === "fulfilled") setProducts(productsRes.value.data || []);
      if (cartRes.status === "fulfilled") setCartCount(cartRes.value.data?.length || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const qty = quantities[productId] || 1;
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      await api.post("/cart/add", { productId, quantity: qty });
      setCartCount(c => c + qty);
      showToast("Added to cart!");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add to cart", "error");
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (e) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    { label: "Total Orders", value: orders.length, icon: "📦", color: "bg-blue-50 text-blue-600" },
    { label: "Delivered", value: orders.filter(o => o.orderStatus === "delivered").length, icon: "✅", color: "bg-green-50 text-green-600" },
    { label: "Pending", value: orders.filter(o => o.orderStatus === "pending").length, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
    { label: "Cart Items", value: cartCount, icon: "🛒", color: "bg-purple-50 text-purple-600" },
  ];

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="overview" user={user} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
            <p className="text-gray-500 text-sm mt-0.5">Here's what's happening with your orders today</p>
          </div>
          <button onClick={() => navigate("/user/cart")}
            className="relative flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm font-medium text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            View Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </button>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 ${color}`}>{icon}</div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
              <button onClick={() => navigate("/user/orders")} className="text-green-600 text-sm font-semibold hover:text-green-700 transition">
                View All →
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="py-16 text-center">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-500 font-medium">No orders yet</p>
                <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map(order => (
                  <div key={order._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={order.orderStatus} />
                      <p className="text-sm font-bold text-gray-800">Rs. {order.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Browse Products */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Browse Medicines</h3>
              <span className="text-sm text-gray-400">{products.length} products available</span>
            </div>
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-3">💊</div>
                <p className="text-gray-500">No products available yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                  <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="h-40 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden">
                      {product.productImageUrl ? (
                        <img src={product.productImageUrl} alt={product.productName} className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
                      ) : (
                        <span className="text-5xl">💊</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 text-sm truncate">{product.productName}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.productDescription}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-green-600 font-bold">Rs. {product.productPrice?.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{product.productTotalStockQuantity} left</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <input type="number" min="1" max={product.productTotalStockQuantity}
                          value={quantities[product._id] || 1}
                          onChange={e => setQuantities(prev => ({ ...prev, [product._id]: parseInt(e.target.value) || 1 }))}
                          className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-400" />
                        <button onClick={() => handleAddToCart(product._id)}
                          disabled={addingToCart[product._id] || product.productTotalStockQuantity === 0}
                          className="flex-1 bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                          {addingToCart[product._id] ? "Adding..." : product.productTotalStockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
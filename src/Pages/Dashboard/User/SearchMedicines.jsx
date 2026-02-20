import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const NAV = [
  { key: "search",  label: "Search Medicines", path: "/user/search",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { key: "cart",    label: "My Cart",          path: "/user/cart",    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { key: "orders",  label: "My Orders",        path: "/user/orders",  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { key: "profile", label: "Profile",          path: "/user/profile", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
];

function Sidebar({ active, user, onLogout, cartCount = 0 }) {
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative
              ${active === key ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:bg-green-50 hover:text-green-700"}`}>
            <span>{icon}</span>{label}
            {key === "cart" && cartCount > 0 && (
              <span className="absolute right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
            )}
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
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Your trusted partner for fast, reliable medicine delivery across Nepal. Licensed pharmacies, verified products, doorstep delivery.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Licensed Pharmacies", "30-min Delivery", "Secure Payment"].map(t => (
                <span key={t} className="bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-white mb-3">My Account</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["Search Medicines","My Orders","My Cart","Profile"].map(l => <li key={l} className="hover:text-green-400 cursor-pointer transition">{l}</li>)}
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sm text-white mb-3">Help & Support</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              {["Help Center","Contact Us","Refund Policy","Terms of Service"].map(l => <li key={l} className="hover:text-green-400 cursor-pointer transition">{l}</li>)}
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

function ProductCard({ product, onAddToCart, adding }) {
  const [qty, setQty] = useState(1);
  const outOfStock = product.productTotalStockQuantity === 0;
  const lowStock = !outOfStock && product.productTotalStockQuantity <= 5;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
      <div className="h-44 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center overflow-hidden relative">
        {product.productImageUrl && (
          <img src={product.productImageUrl} alt={product.productName}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = "none"; }}/>
        )}
        {!product.productImageUrl && <span className="text-6xl">💊</span>}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
          </div>
        )}
        {lowStock && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            Only {product.productTotalStockQuantity} left!
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-gray-800 text-sm leading-snug mb-1">{product.productName}</h4>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">{product.productDescription}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="text-green-600 font-bold text-lg">Rs. {product.productPrice?.toLocaleString()}</p>
          <p className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{product.productTotalStockQuantity} in stock</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1 || outOfStock}
              className="w-8 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition font-bold text-lg">−</button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800">{qty}</span>
            <button onClick={() => setQty(q => Math.min(product.productTotalStockQuantity, q + 1))}
              disabled={qty >= product.productTotalStockQuantity || outOfStock}
              className="w-8 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition font-bold text-lg">+</button>
          </div>
          <button onClick={() => onAddToCart(product._id, qty, () => setQty(1))} disabled={adding || outOfStock}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              outOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md active:scale-95"}`}>
            {adding ? (
              <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Adding...</>
            ) : outOfStock ? "Out of Stock" : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchMedicines() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState({});
  const [toast, setToast]       = useState(null);
  const [query, setQuery]       = useState("");
  const [sortBy, setSortBy]     = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) { navigate("/login"); return; }
    setUser(stored);
    api.get("/products/get/products").then(r => setProducts(r.data || [])).catch(() => {}).finally(() => setLoading(false));
    api.get("/cart/getcart").then(r => setCartCount(r.data?.length || 0)).catch(() => {});
  }, []);

  const handleAddToCart = async (productId, quantity, resetQty) => {
    setAdding(prev => ({ ...prev, [productId]: true }));
    try {
      await api.post("/cart/add", { productId, quantity });
      setCartCount(c => c + 1);
      resetQty();
      showToast("Added to cart! 🛒");
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        showToast("Session expired. Redirecting to login...", "error");
        setTimeout(() => { localStorage.removeItem("user"); navigate("/login"); }, 1500);
      } else {
        showToast(err.response?.data?.message || "Failed to add to cart", "error");
      }
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch (_) {}
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filtered = useMemo(() => {
    let r = [...products];
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter(p => p.productName?.toLowerCase().includes(q) || p.productDescription?.toLowerCase().includes(q)); }
    if (stockFilter === "instock")    r = r.filter(p => p.productTotalStockQuantity > 0);
    if (stockFilter === "outofstock") r = r.filter(p => p.productTotalStockQuantity === 0);
    if (sortBy === "newest")      r.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")      r.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "price_asc")   r.sort((a, b) => a.productPrice - b.productPrice);
    if (sortBy === "price_desc")  r.sort((a, b) => b.productPrice - a.productPrice);
    if (sortBy === "name_asc")    r.sort((a, b) => a.productName.localeCompare(b.productName));
    return r;
  }, [products, query, sortBy, stockFilter]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active="search" user={user} onLogout={handleLogout} cartCount={cartCount} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
            {toast.type === "error"
              ? <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              : <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Search Medicines</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {loading ? "Loading products..." : `${filtered.length} of ${products.length} products`}
            </p>
          </div>
          <button onClick={() => navigate("/user/cart")}
            className="relative flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm font-medium text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            View Cart
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>

        <main className="flex-1 px-8 py-6">
          {/* Search + Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input type="text" placeholder="Search by medicine name or description..."
                value={query} onChange={e => setQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                autoFocus/>
              {query && (
                <button onClick={() => setQuery("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-700 cursor-pointer min-w-[130px]">
              <option value="all">All Stock</option>
              <option value="instock">In Stock</option>
              <option value="outofstock">Out of Stock</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-700 cursor-pointer min-w-[160px]">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
            </select>
          </div>

          {/* Active search tag */}
          {query && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">Results for:</span>
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                "{query}"
                <button onClick={() => setQuery("")}><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
              </span>
              <span className="text-sm text-gray-400">— {filtered.length} found</span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-100"/>
                  <div className="p-4 space-y-3"><div className="h-4 bg-gray-100 rounded w-3/4"/><div className="h-3 bg-gray-100 rounded w-full"/><div className="h-9 bg-gray-100 rounded-xl"/></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-24 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No medicines found</h3>
              <p className="text-gray-400 mb-6">{query ? `No results for "${query}". Try a different term.` : "No products available yet."}</p>
              {query && <button onClick={() => setQuery("")} className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition">Clear Search</button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} adding={adding[product._id]}/>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}